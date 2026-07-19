#!/usr/bin/env python3
"""Fail if a release omits, truncates, or stale-packages book content.

This validator compares the source tree, the EPUB package, and the rendered
PDF. It is intentionally independent of EPUBCheck: EPUBCheck proves format
conformance, while this script proves that the complete intended book made it
into both deliverables.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import posixpath
import re
import sys
import unicodedata
import zipfile
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import unquote

import fitz
from lxml import etree


ROOT = Path(__file__).resolve().parents[1]
BOOK = ROOT / "book"
OPF = BOOK / "OEBPS" / "content.opf"
XHTML = BOOK / "OEBPS" / "xhtml"
NS = {
    "opf": "http://www.idpf.org/2007/opf",
    "x": "http://www.w3.org/1999/xhtml",
}
WORD_RE = re.compile(r"[A-Za-z0-9]+(?:[’'-][A-Za-z0-9]+)*")
TOKEN_RE = re.compile(r"[a-z0-9]+")
EXPECTED_PAGE_WIDTH = 481.92
EXPECTED_PAGE_HEIGHT = 691.92


@dataclass
class SectionResult:
    name: str
    group: str
    source_words: int
    pdf_pages: str
    source_epub_equal: bool
    anchors_checked: int
    missing_anchors: int
    final_block_exact: bool
    required_layout_blocks: int
    missing_layout_blocks: int
    source_noterefs: int
    pdf_noterefs: int


def words(text: str) -> list[str]:
    return WORD_RE.findall(text)


def normalize(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", text.lower()).strip()


def folded(text: str) -> str:
    """Fold punctuation, tracking, and layout hyphenation for exact text proof."""
    text = (
        text.replace("’", "'")
        .replace("‘", "'")
        .replace("“", '"')
        .replace("”", '"')
        .replace("ﬁ", "fi")
        .replace("ﬂ", "fl")
        .replace("–", "-")
        .replace("—", "-")
    )
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    return "".join(TOKEN_RE.findall(text.lower()))


def word_tokens(text: str) -> list[str]:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    return TOKEN_RE.findall(text.lower())


def element_text(element: etree._Element) -> str:
    return " ".join(" ".join(element.itertext()).split())


def remove_preserving_tail(element: etree._Element) -> None:
    """Remove an XML node without dropping visible prose in its tail."""
    parent = element.getparent()
    if parent is None:
        return
    tail = element.tail
    previous = element.getprevious()
    if tail:
        if previous is not None:
            previous.tail = (previous.tail or "") + tail
        else:
            parent.text = (parent.text or "") + tail
    parent.remove(element)


def print_body_text(doc: etree._Element) -> str:
    body = printable_body(doc)
    if body is None:
        return ""
    return element_text(body)


def text_without_noterefs(element: etree._Element) -> str:
    clone = etree.fromstring(etree.tostring(element))
    for sup in clone.xpath(".//x:sup[x:a]", namespaces=NS):
        remove_preserving_tail(sup)
    return element_text(clone)


def printable_body(doc: etree._Element) -> etree._Element | None:
    bodies = doc.xpath("//x:body", namespaces=NS)
    if len(bodies) != 1:
        return None
    body = etree.fromstring(etree.tostring(bodies[0]))
    for hidden in body.xpath(
        './/*[contains(concat(" ", normalize-space(@class), " "), " epub-download-cta ") '
        'or contains(concat(" ", normalize-space(@class), " "), " worksheet-cta ") '
        'or contains(concat(" ", normalize-space(@class), " "), " cta-section ") '
        'or contains(concat(" ", normalize-space(@class), " "), " web-only ") '
        'or contains(concat(" ", normalize-space(@class), " "), " download-cta ") '
        'or contains(concat(" ", normalize-space(@class), " "), " print-instruction ") '
        'or contains(concat(" ", normalize-space(@class), " "), " sr-only ")]'
    ):
        remove_preserving_tail(hidden)
    return body


def parse_xhtml(data: bytes) -> etree._Element:
    return etree.fromstring(data)


def group_for(name: str) -> str:
    if re.match(r"(?:9|1[01345679]|2[0123567])-chapter-", name):
        return "Chapter"
    if "Part-" in name:
        return "Part"
    if name in {
        "0a-HalfTitle.xhtml",
        "1-TitlePage.xhtml",
        "2-Copyright.xhtml",
        "3-TableOfContents.xhtml",
        "4-Dedication.xhtml",
        "5-SelfAssessment.xhtml",
        "6-AffirmationOdyssey.xhtml",
        "7-Preface.xhtml",
        "7a-preface-quote.xhtml",
    }:
        return "Front matter"
    return "Back matter"


def sample_phrases(text: str, width: int = 12) -> list[str]:
    tokens = words(text)
    if len(tokens) < width:
        return []
    starts = [0, max((len(tokens) - width) // 2, 0), len(tokens) - width]
    return [normalize(" ".join(tokens[start : start + width])) for start in starts]


def block_anchors(container: etree._Element, limit: int = 3, width: int = 8) -> list[str]:
    blocks = container.xpath(
        './/*[self::x:p or self::x:h1 or self::x:h2 or self::x:h3 or self::x:h4 '
        'or self::x:li or self::x:label or self::x:td or self::x:blockquote '
        'or (self::x:div and not(.//*[self::x:p or self::x:h1 or self::x:h2 or self::x:h3 '
        'or self::x:h4 or self::x:li or self::x:label or self::x:td]))]',
        namespaces=NS,
    )
    candidates: list[str] = []
    for block in blocks:
        tokens = words(element_text(block))
        if len(tokens) >= width:
            candidates.append(normalize(" ".join(tokens[:width])))
    # Preserve document order while removing duplicates.
    candidates = list(dict.fromkeys(candidates))
    if len(candidates) <= limit:
        return candidates
    indexes = [round(i * (len(candidates) - 1) / (limit - 1)) for i in range(limit)]
    return [candidates[index] for index in indexes]


def semantic_blocks(body: etree._Element) -> list[str]:
    """Return every visible leaf-level prose block in document order."""
    tags = {
        "p",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "li",
        "label",
        "td",
        "th",
        "blockquote",
        "figcaption",
    }
    candidates: list[etree._Element] = []
    for element in body.iter():
        local = etree.QName(element).localname if isinstance(element.tag, str) else ""
        if local not in tags:
            continue
        if any(
            etree.QName(child).localname in tags
            for child in element.iterdescendants()
            if isinstance(child.tag, str)
        ):
            continue
        text = text_without_noterefs(element)
        if folded(text):
            candidates.append(element)

    blocks = [text_without_noterefs(element) for element in candidates]
    if not blocks:
        whole = text_without_noterefs(body)
        return [whole] if folded(whole) else []
    return blocks


def required_layout_blocks(body: etree._Element) -> list[str]:
    """Text whose omission can hide sparse but intentional print elements."""
    elements = body.xpath(
        './/x:footer '
        '| .//*[contains(concat(" ", normalize-space(@class), " "), " badge ")]',
        namespaces=NS,
    )
    blocks: list[str] = []
    for element in elements:
        text = text_without_noterefs(element)
        if folded(text):
            blocks.append(text)
    return blocks


def page_text_without_layout_markers(page: fitz.Page) -> str:
    """Extract reading text while excluding folios and citation-call numbers."""
    parts: list[str] = []
    for block in page.get_text("dict", sort=True).get("blocks", []):
        for line in block.get("lines", []):
            line_parts: list[str] = []
            for span in line.get("spans", []):
                clean = " ".join(span.get("text", "").split())
                if not clean:
                    continue
                y0 = span["bbox"][1]
                size = float(span.get("size", 99))
                if y0 >= page.rect.height - 58 and re.fullmatch(r"\d+", clean):
                    continue
                # Source noteref anchors render as isolated seven-point digits.
                # They are counted independently so they cannot hide a duplicate.
                if re.fullmatch(r"\d+", clean) and size <= 7.2:
                    continue
                # Decorative drop caps are separate large glyphs that may sort
                # after their first line. block_present() proves them separately.
                if re.fullmatch(r"[A-Z]", clean) and size >= 18:
                    continue
                line_parts.append(clean)
            if line_parts:
                parts.append(" ".join(line_parts))
    return " ".join(parts)


def pdf_noteref_markers(page: fitz.Page) -> list[str]:
    markers: list[str] = []
    for block in page.get_text("dict").get("blocks", []):
        for line in block.get("lines", []):
            for span in line.get("spans", []):
                clean = span.get("text", "").strip()
                if re.fullmatch(r"\d+", clean) and float(span.get("size", 99)) <= 7.2:
                    markers.append(clean)
    return markers


def subsequence_span(needles: list[str], haystack: list[str]) -> int | None:
    if not needles:
        return 0
    starts = [index for index, token in enumerate(haystack) if token == needles[0]]
    best: int | None = None
    for start in starts:
        cursor = start
        for needle in needles:
            while cursor < len(haystack) and haystack[cursor] != needle:
                cursor += 1
            if cursor == len(haystack):
                break
            cursor += 1
        else:
            span = cursor - start
            best = span if best is None else min(best, span)
    return best


def block_present(block: str, pdf_text: str) -> bool:
    """Prove a complete source block rendered, tolerating layout-only spacing."""
    needle = folded(block)
    rendered = folded(pdf_text)
    if not needle or needle in rendered:
        return True
    # Chromium emits decorative drop caps outside normal reading order.
    if len(needle) > 1 and needle[1:] in rendered and needle[0] in rendered:
        return True
    # Printed external links can add an href inside a source block. Require all
    # source words in order and bound the number of allowed layout-only extras.
    source_words = word_tokens(block)
    span = subsequence_span(source_words, word_tokens(pdf_text))
    allowance = max(20, round(len(source_words) * 0.35))
    return span is not None and span <= len(source_words) + allowance


def anchor_present(anchor: str, pdf_text: str) -> bool:
    if anchor in pdf_text:
        return True
    # Display text may use CSS tracking, which Poppler/PyMuPDF can extract as
    # spaces inside words (for example, "SIGN ATURE TO UCH"). Comparing a
    # compact alphanumeric form still proves the full phrase rendered while
    # avoiding a false truncation report for those headings and pull quotes.
    if anchor.replace(" ", "") in pdf_text.replace(" ", ""):
        return True
    # Decorative drop caps are often extracted as a separate glyph ("E very").
    # The remainder of the same sentence is still a reliable content check.
    tokens = anchor.split()
    return len(tokens) >= 6 and " ".join(tokens[1:]) in pdf_text


def chapter_anchors(doc: etree._Element) -> tuple[list[str], int, int]:
    body = doc.xpath(
        '//x:section[contains(concat(" ", normalize-space(@class), " "), " chap-body ")]',
        namespaces=NS,
    )
    if len(body) != 1:
        raise ValueError(f"expected one chap-body section, found {len(body)}")

    anchors = block_anchors(body[0])
    questions = doc.xpath(
        '//*[contains(concat(" ", normalize-space(@class), " "), " question-text ")]',
        namespaces=NS,
    )
    prompts = doc.xpath(
        '//x:label[contains(concat(" ", normalize-space(@class), " "), " prompt-label ")]',
        namespaces=NS,
    )

    # Chapter VI deliberately uses an ordered-list worksheet instead of the
    # label-based worksheet component used by the other chapters.
    if not prompts:
        prompts = doc.xpath(
            '//x:section[contains(concat(" ", normalize-space(@class), " "), " worksheet ")]'
            '//x:ol/x:li/x:p[1]',
            namespaces=NS,
        )

    for element in [*questions, *prompts]:
        text = element_text(element)
        tokens = words(text)
        if tokens:
            anchors.append(normalize(" ".join(tokens[: min(8, len(tokens))])))
    return anchors, len(questions), len(prompts)


def resolve_internal_links(epub: zipfile.ZipFile, xhtml_names: list[str]) -> list[str]:
    ids: dict[str, set[str]] = {}
    docs: dict[str, etree._Element] = {}
    for name in xhtml_names:
        doc = parse_xhtml(epub.read(name))
        docs[name] = doc
        ids[name] = set(doc.xpath("//@id"))

    broken: list[str] = []
    for source, doc in docs.items():
        source_dir = Path(source).parent
        for href in doc.xpath("//x:a/@href", namespaces=NS):
            if re.match(r"^(?:https?|mailto|tel):", href):
                continue
            path, separator, fragment = href.partition("#")
            target = (source_dir / unquote(path)).as_posix() if path else source
            target = posixpath.normpath(target)
            if target not in epub.namelist():
                broken.append(f"{source} -> {href} (missing file)")
                continue
            if separator and target in ids and unquote(fragment) not in ids[target]:
                broken.append(f"{source} -> {href} (missing fragment)")
    return broken


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def validate(
    epub_path: Path,
    pdf_path: Path,
    page_map_path: Path,
    expected_pages: int | None = None,
) -> tuple[list[SectionResult], list[str], dict[str, object]]:
    errors: list[str] = []
    opf = etree.parse(str(OPF))
    manifest = {
        item.get("id"): item.get("href")
        for item in opf.xpath("//opf:manifest/opf:item", namespaces=NS)
    }
    linear_spine = [
        manifest[item.get("idref")]
        for item in opf.xpath('//opf:spine/opf:itemref[not(@linear="no")]', namespaces=NS)
    ]
    names = [href.split("/", 1)[1] for href in linear_spine]
    groups = [group_for(name) for name in names]
    expected_groups = {"Front matter": 9, "Part": 4, "Chapter": 16, "Back matter": 17}
    actual_groups = {group: groups.count(group) for group in expected_groups}
    if actual_groups != expected_groups:
        errors.append(f"spine group counts {actual_groups}, expected {expected_groups}")

    page_map = json.loads(page_map_path.read_text(encoding="utf-8"))
    if list(page_map) != names:
        errors.append("page-map order does not exactly match the 46-file linear spine")

    toc = etree.parse(str(XHTML / "3-TableOfContents.xhtml"))
    toc_entries = toc.xpath(
        '//x:div[contains(concat(" ", normalize-space(@class), " "), " toc-entry ")]',
        namespaces=NS,
    )
    toc_folios_checked = 0
    for entry in toc_entries:
        hrefs = entry.xpath("./x:a/@href", namespaces=NS)
        folios = entry.xpath(
            './x:span[contains(concat(" ", normalize-space(@class), " "), " toc-page-number ")]/text()',
            namespaces=NS,
        )
        if len(hrefs) != 1 or len(folios) != 1:
            errors.append("Table of Contents entry is missing one link or one print folio")
            continue
        href = hrefs[0].split("#", 1)[0]
        expected_folio = page_map.get(href)
        try:
            actual_folio = int(folios[0].strip())
        except ValueError:
            errors.append(f"Table of Contents has a non-numeric folio for {href}: {folios[0]!r}")
            continue
        if expected_folio != actual_folio:
            errors.append(
                f"Table of Contents folio mismatch for {href}: {actual_folio}, expected {expected_folio}"
            )
        else:
            toc_folios_checked += 1
    if len(toc_entries) != 36:
        errors.append(f"Table of Contents has {len(toc_entries)} linked entries, expected 36")

    pdf = fitz.open(pdf_path)
    if pdf.is_encrypted:
        errors.append("PDF is encrypted")
    if expected_pages is not None and len(pdf) != expected_pages:
        errors.append(f"PDF has {len(pdf)} pages, expected {expected_pages}")

    page_box_mismatches: list[str] = []
    for page_number, page in enumerate(pdf, 1):
        media_width = float(page.mediabox.width)
        media_height = float(page.mediabox.height)
        crop_width = float(page.cropbox.width)
        crop_height = float(page.cropbox.height)
        if (
            abs(media_width - EXPECTED_PAGE_WIDTH) > 0.01
            or abs(media_height - EXPECTED_PAGE_HEIGHT) > 0.01
            or abs(crop_width - EXPECTED_PAGE_WIDTH) > 0.01
            or abs(crop_height - EXPECTED_PAGE_HEIGHT) > 0.01
        ):
            page_box_mismatches.append(
                f"p{page_number} media={media_width:.2f}x{media_height:.2f} "
                f"crop={crop_width:.2f}x{crop_height:.2f}"
            )
    if page_box_mismatches:
        errors.append(
            f"{len(page_box_mismatches)} PDF pages have a nonuniform/non-Royal page box: "
            + "; ".join(page_box_mismatches[:8])
        )

    results: list[SectionResult] = []
    chapter_questions = 0
    chapter_prompts = 0
    parity_files = 0
    with zipfile.ZipFile(epub_path) as epub:
        entries = epub.infolist()
        if not entries or entries[0].filename != "mimetype" or entries[0].compress_type != zipfile.ZIP_STORED:
            errors.append("EPUB mimetype is not first and stored uncompressed")

        publication_sources = [
            path
            for path in BOOK.rglob("*")
            if path.suffix.lower() in {".xhtml", ".xml", ".opf", ".ncx"}
        ]
        for source in publication_sources:
            relative = source.relative_to(BOOK).as_posix()
            if relative not in epub.namelist():
                errors.append(f"EPUB missing source file: {relative}")
            elif epub.read(relative) != source.read_bytes():
                errors.append(f"EPUB/source byte mismatch: {relative}")
            else:
                parity_files += 1

        xhtml_entries = [name for name in epub.namelist() if name.endswith(".xhtml")]
        for broken in resolve_internal_links(epub, xhtml_entries):
            errors.append(f"broken link: {broken}")

        for index, (href, name, group) in enumerate(zip(linear_spine, names, groups, strict=True)):
            source_path = BOOK / "OEBPS" / href
            source_data = source_path.read_bytes()
            packed_data = epub.read("OEBPS/" + href)
            doc = parse_xhtml(source_data)
            body = printable_body(doc)
            if body is None:
                errors.append(f"{name}: missing printable body")
                continue
            source_text = text_without_noterefs(body)
            source_word_count = len(words(source_text))

            start = page_map.get(name)
            next_start = page_map.get(names[index + 1], len(pdf) + 1) if index + 1 < len(names) else len(pdf) + 1
            if not isinstance(start, int) or not isinstance(next_start, int) or start >= next_start:
                errors.append(f"invalid PDF page span for {name}: {start}-{next_start}")
                continue
            rendered_text = " ".join(
                page_text_without_layout_markers(pdf[page - 1])
                for page in range(start, next_start)
            )
            rendered_noterefs = [
                marker
                for page in range(start, next_start)
                for marker in pdf_noteref_markers(pdf[page - 1])
            ]
            source_noterefs = [
                text.strip()
                for text in body.xpath(".//x:sup/x:a/text()", namespaces=NS)
                if text and text.strip()
            ]

            anchors = semantic_blocks(body)
            layout_blocks = required_layout_blocks(body)
            questions = prompts = 0
            if group == "Chapter":
                try:
                    _sampled, questions, prompts = chapter_anchors(doc)
                except ValueError as exc:
                    errors.append(f"{name}: {exc}")
                chapter_questions += questions
                chapter_prompts += prompts
                if questions != 4:
                    errors.append(f"{name}: {questions} quiz questions, expected 4")
                if prompts != 4:
                    errors.append(f"{name}: {prompts} worksheet prompts, expected 4")
            missing = [block for block in anchors if block and not block_present(block, rendered_text)]
            if missing:
                errors.append(
                    f"{name}: {len(missing)}/{len(anchors)} complete source blocks missing: "
                    + " | ".join(text[:180] for text in missing[:4])
                )

            missing_layout = [
                block for block in layout_blocks if not block_present(block, rendered_text)
            ]
            if missing_layout:
                errors.append(
                    f"{name}: {len(missing_layout)}/{len(layout_blocks)} required badge/footer "
                    "blocks missing: " + " | ".join(missing_layout)
                )

            final_block_exact = not anchors or block_present(anchors[-1], rendered_text)
            if not final_block_exact:
                errors.append(f"{name}: final source block is missing from its PDF span")

            if source_noterefs != rendered_noterefs:
                errors.append(
                    f"{name}: citation-call markers differ: source={source_noterefs}, "
                    f"PDF={rendered_noterefs}"
                )

            results.append(
                SectionResult(
                    name=name,
                    group=group,
                    source_words=source_word_count,
                    pdf_pages=f"{start}–{next_start - 1}",
                    source_epub_equal=source_data == packed_data,
                    anchors_checked=len(anchors),
                    missing_anchors=len(missing),
                    final_block_exact=final_block_exact,
                    required_layout_blocks=len(layout_blocks),
                    missing_layout_blocks=len(missing_layout),
                    source_noterefs=len(source_noterefs),
                    pdf_noterefs=len(rendered_noterefs),
                )
            )

    if chapter_questions != 64:
        errors.append(f"book has {chapter_questions} quiz questions, expected 64")
    if chapter_prompts != 64:
        errors.append(f"book has {chapter_prompts} worksheet prompts, expected 64")

    recto = {
        name: page
        for name, page in page_map.items()
        if name == "1-TitlePage.xhtml"
        or "Part-" in name
        or "chapter-" in name
        or name == "28-Conclusion.xhtml"
    }
    even_openers = {name: page for name, page in recto.items() if page % 2 == 0}
    if even_openers:
        errors.append(f"recto openers on even pages: {even_openers}")

    summary = {
        "linear_spine_files": len(linear_spine),
        "group_counts": actual_groups,
        "publication_source_parity_files": parity_files,
        "chapter_questions": chapter_questions,
        "chapter_prompts": chapter_prompts,
        "pdf_pages": len(pdf),
        "recto_openers": len(recto),
        "toc_folios_checked": toc_folios_checked,
        "semantic_blocks_checked": sum(result.anchors_checked for result in results),
        "semantic_blocks_missing": sum(result.missing_anchors for result in results),
        "final_blocks_exact": sum(result.final_block_exact for result in results),
        "required_layout_blocks": sum(result.required_layout_blocks for result in results),
        "required_layout_blocks_missing": sum(result.missing_layout_blocks for result in results),
        "source_noterefs": sum(result.source_noterefs for result in results),
        "pdf_noterefs": sum(result.pdf_noterefs for result in results),
        "uniform_page_boxes": len(pdf) - len(page_box_mismatches),
        "epub_sha256": sha256(epub_path),
        "pdf_sha256": sha256(pdf_path),
    }
    pdf.close()
    return results, errors, summary


def markdown_report(results: list[SectionResult], errors: list[str], summary: dict[str, object], epub: Path, pdf: Path) -> str:
    status = "PASS" if not errors else "FAIL"
    lines = [
        "# Full-Content Integrity Report",
        "",
        f"**Result: {status}**",
        "",
        "This report proves that the complete source spine—not only the Table of Contents—was packaged into the EPUB and rendered into the PDF.",
        "",
        "## Release artifacts",
        "",
        f"- EPUB: `{epub.name}`",
        f"- PDF: `{pdf.name}`",
        f"- EPUB SHA-256: `{summary['epub_sha256']}`",
        f"- PDF SHA-256: `{summary['pdf_sha256']}`",
        "",
        "## Completeness gates",
        "",
        f"- Linear reading-order files: {summary['linear_spine_files']}",
        f"- Groups: {summary['group_counts']}",
        f"- Source files matching packaged EPUB byte-for-byte: {summary['publication_source_parity_files']}",
        f"- Quiz questions: {summary['chapter_questions']}",
        f"- Worksheet prompts: {summary['chapter_prompts']}",
        f"- PDF pages: {summary['pdf_pages']}",
        f"- Required recto openers: {summary['recto_openers']}",
        f"- Table of Contents folios matching the PDF page map: {summary['toc_folios_checked']}",
        f"- Complete semantic source blocks found in PDF: "
        f"{summary['semantic_blocks_checked'] - summary['semantic_blocks_missing']}/"
        f"{summary['semantic_blocks_checked']}",
        f"- Final section blocks found in PDF: {summary['final_blocks_exact']}/"
        f"{summary['linear_spine_files']}",
        f"- Required worksheet badges/footers found in PDF: "
        f"{summary['required_layout_blocks'] - summary['required_layout_blocks_missing']}/"
        f"{summary['required_layout_blocks']}",
        f"- Citation-call markers (source/PDF): {summary['source_noterefs']}/"
        f"{summary['pdf_noterefs']}",
        f"- Uniform {EXPECTED_PAGE_WIDTH:.2f} x {EXPECTED_PAGE_HEIGHT:.2f} pt page boxes: "
        f"{summary['uniform_page_boxes']}/{summary['pdf_pages']}",
        "",
        "## Section-by-section proof",
        "",
        "| Group | Source file | Packaged words | PDF pages | EPUB parity | PDF blocks | Final | Layout | Noterefs |",
        "|---|---|---:|---:|---|---:|---|---:|---:|",
    ]
    for result in results:
        lines.append(
            f"| {result.group} | `{result.name}` | {result.source_words:,} | {result.pdf_pages} | "
            f"{'exact' if result.source_epub_equal else 'MISMATCH'} | "
            f"{result.anchors_checked - result.missing_anchors}/{result.anchors_checked} | "
            f"{'exact' if result.final_block_exact else 'MISSING'} | "
            f"{result.required_layout_blocks - result.missing_layout_blocks}/"
            f"{result.required_layout_blocks} | "
            f"{result.source_noterefs}/{result.pdf_noterefs} |"
        )
    lines.extend(["", "## Findings", ""])
    if errors:
        lines.extend(f"- FAIL: {error}" for error in errors)
    else:
        lines.append(
            "- No missing, truncated, stale, reordered, duplicated-noteref, sparse-layout, "
            "or page-box defect was detected."
        )
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("epub", type=Path)
    parser.add_argument("pdf", type=Path)
    parser.add_argument("--page-map", type=Path, required=True)
    parser.add_argument("--expected-pages", type=int)
    parser.add_argument("--report", type=Path)
    args = parser.parse_args()

    results, errors, summary = validate(
        args.epub, args.pdf, args.page_map, expected_pages=args.expected_pages
    )
    report = markdown_report(results, errors, summary, args.epub, args.pdf)
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(report, encoding="utf-8")
    print(report)
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
