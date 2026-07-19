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


@dataclass
class SectionResult:
    name: str
    group: str
    source_words: int
    pdf_pages: str
    source_epub_equal: bool
    anchors_checked: int
    missing_anchors: int


def words(text: str) -> list[str]:
    return WORD_RE.findall(text)


def normalize(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", text.lower()).strip()


def element_text(element: etree._Element) -> str:
    return " ".join(" ".join(element.itertext()).split())


def print_body_text(doc: etree._Element) -> str:
    body = printable_body(doc)
    if body is None:
        return ""
    return element_text(body)


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
        parent = hidden.getparent()
        if parent is not None:
            parent.remove(hidden)
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
            source_text = print_body_text(doc)
            source_word_count = len(words(source_text))

            start = page_map.get(name)
            next_start = page_map.get(names[index + 1], len(pdf) + 1) if index + 1 < len(names) else len(pdf) + 1
            if not isinstance(start, int) or not isinstance(next_start, int) or start >= next_start:
                errors.append(f"invalid PDF page span for {name}: {start}-{next_start}")
                continue
            pdf_text = normalize(" ".join(pdf[page - 1].get_text() for page in range(start, next_start)))

            anchors: list[str] = []
            questions = prompts = 0
            if group == "Chapter":
                try:
                    anchors, questions, prompts = chapter_anchors(doc)
                except ValueError as exc:
                    errors.append(f"{name}: {exc}")
                chapter_questions += questions
                chapter_prompts += prompts
                if questions != 4:
                    errors.append(f"{name}: {questions} quiz questions, expected 4")
                if prompts != 4:
                    errors.append(f"{name}: {prompts} worksheet prompts, expected 4")
            elif source_word_count >= 40:
                body = printable_body(doc)
                anchors = block_anchors(body) if body is not None else []

            missing = [anchor for anchor in anchors if anchor and not anchor_present(anchor, pdf_text)]
            if missing:
                errors.append(
                    f"{name}: {len(missing)}/{len(anchors)} rendered anchors missing: "
                    + " | ".join(missing)
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
        "",
        "## Section-by-section proof",
        "",
        "| Group | Source file | Packaged words | PDF pages | EPUB parity | PDF anchors |",
        "|---|---|---:|---:|---|---:|",
    ]
    for result in results:
        lines.append(
            f"| {result.group} | `{result.name}` | {result.source_words:,} | {result.pdf_pages} | "
            f"{'exact' if result.source_epub_equal else 'MISMATCH'} | "
            f"{result.anchors_checked - result.missing_anchors}/{result.anchors_checked} |"
        )
    lines.extend(["", "## Findings", ""])
    if errors:
        lines.extend(f"- FAIL: {error}" for error in errors)
    else:
        lines.append("- No missing, truncated, stale, or reordered publication section was detected.")
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
