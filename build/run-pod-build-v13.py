#!/usr/bin/env python3
"""Portable wrapper for build/build-pod-final.py.

Two environment shims, zero logic changes:
  1. ink_fractions() uses PyMuPDF instead of poppler's pdftoppm (not
     installable here). Same grayscale threshold (<160) and same dpi.
  2. chromium launch can use POD_CHROMIUM_PATH when Playwright's pinned
     browser revision is unavailable.
"""
import importlib.util
import os
import sys
from pathlib import Path

import fitz  # PyMuPDF

HERE = Path(__file__).resolve().parent
SCRIPT = HERE / "build-pod-final.py"
if not SCRIPT.is_file():
    raise FileNotFoundError(f"POD build module not found: {SCRIPT}")
spec = importlib.util.spec_from_file_location("bpf", SCRIPT)
if spec is None or spec.loader is None:
    raise ImportError(f"Unable to create an import loader for: {SCRIPT}")
bpf = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bpf)


def ink_fractions(pdf_path, dpi=36):
    doc = fitz.open(str(pdf_path))
    zoom = dpi / 72.0
    fracs = []
    for page in doc:
        pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), colorspace=fitz.csGRAY)
        data = pix.samples
        fracs.append(sum(1 for v in data if v < 160) / len(data))
    doc.close()
    return fracs


bpf.ink_fractions = ink_fractions

# Two files render real-but-light-ink pages that the blank detector would
# wrongly drop: the sparse third TOC page (8 entries) and the
# Acknowledgments closing page (teal signature + P.S. box + gold quote —
# missing from the previously shipped v13 interior). Keep them.
bpf.KEEP_BLANKS_FILES = frozenset(
    set(bpf.KEEP_BLANKS_FILES) | {"3-TableOfContents.xhtml", "33-Acknowledgments.xhtml"})

# Render with the archived print stylesheet injected at render time. The v13
# ebook source dropped its <link media="print"> tags (correct for the EPUB),
# so the POD build re-applies print.css here without touching book/.
PRINT_CSS = HERE.parent / "archive" / "print-assets-v11" / "print.css"


def render_files(names):
    import io
    from playwright.sync_api import sync_playwright
    from pypdf import PdfReader
    results = []
    with sync_playwright() as p:
        try:
            browser = p.chromium.launch()
        except Exception as original_error:
            browser_path = os.environ.get("POD_CHROMIUM_PATH")
            if not browser_path:
                raise RuntimeError(
                    "Playwright could not launch its Chromium browser. "
                    "Setting POD_CHROMIUM_PATH to a compatible Chromium executable "
                    f"may resolve the problem. Original launch error: {original_error}"
                ) from original_error
            browser = p.chromium.launch(
                executable_path=browser_path,
                args=["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
            )
        page = browser.new_page()
        page.emulate_media(media="print")
        for name in names:
            url = (bpf.OEBPS / "xhtml" / name).as_uri()
            page.goto(url, wait_until="networkidle")
            page.add_style_tag(path=str(PRINT_CSS))
            if name == "29-QuizKey.xhtml":
                # Compact the 17-row answer table so the whole Quiz Key
                # (header + table + closing quote) sits on one page, as in
                # the reference v13 recto build.
                page.add_style_tag(content=(
                    ".answer-table th, .answer-table td"
                    " { padding: 0.4rem 0.6rem !important; }"
                    ".key-container { max-height: none !important;"
                    " overflow: visible !important; }"))
            if name == "2-Copyright.xhtml":
                # The bottom-aligned copyright block overruns the page by
                # ~3 lines, orphaning the disclaimer tail onto its own page
                # (dropped as near-blank in the previously shipped v13
                # interior). Reclaim bottom padding so it fits one page.
                page.add_style_tag(content=(
                    "body.copyright-body { padding-bottom: 0.35in !important;"
                    " padding-top: 2rem !important; }"))
            page.wait_for_timeout(50)
            pdf = page.pdf(
                width="6.69in", height="9.61in",
                print_background=True, prefer_css_page_size=False,
                margin={"top": "0.6in", "bottom": "0.6in",
                        "left": "0.75in", "right": "0.75in"},
            )
            results.append((name, pdf))
            print(f"  rendered {name}: {len(PdfReader(io.BytesIO(pdf)).pages)} pp")
        browser.close()
    return results


bpf.render_files = render_files

# ReportLab's canvas emits an unused startup text state that references its
# default Helvetica resource before drawing the folio in embedded Montserrat.
# Alias that resource to Montserrat so the merged PDF has neither an
# unembedded font nor a dangling font reference during text extraction.
_orig_overlay = bpf.folio_overlay


def folio_overlay(number):
    pg = _orig_overlay(number)
    fonts = pg["/Resources"]["/Font"]
    folio_font = next(
        (ref for ref in fonts.values()
         if "Montserrat-Regular" in str(ref.get_object().get("/BaseFont", ""))),
        None,
    )
    if folio_font is None:
        raise RuntimeError("Embedded Montserrat folio font is missing from overlay")
    for key in list(fonts.keys()):
        if fonts[key].get_object().get("/BaseFont") == "/Helvetica":
            fonts[key] = folio_font
    return pg


bpf.folio_overlay = folio_overlay

if __name__ == "__main__":
    sys.argv = ["build-pod-final.py"] + sys.argv[1:]
    bpf.main()
