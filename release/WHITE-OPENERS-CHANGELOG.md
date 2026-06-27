# Post-v8 QA changes — white chapter openers + Quiz Key flow

## Source changes (in book/OEBPS/)
1. **White chapter openers** — `style/style.css`: chapter openers no longer use a full black panel.
   - `.chap-title` background `--clr-ink` → `--clr-paper` (white)
   - `.title-line`, `.bible-quote-text`, `.introduction-paragraph p` text → `--clr-ink` (dark)
   - `.drop-cap` → `--clr-teal-primary` (teal accent)
   - Roman numeral stays white on its teal medallion. Now flows like the Part dividers.
2. **Quiz Key never clips** — `style/print.css`: `.key-container { overflow:visible; max-height:none }`
   so the 16-row answer table flows to a 2nd page instead of dropping chapters XV-XVI.

## Rebuilt eBooks (white openers) — epubcheck 5.2.1 = 0/0/0/0
- `release/Curls-and-Contemplation-v8-white-openers-FIXED.epub` (with cover)
- `release/Curls-and-Contemplation-v8-white-openers-KDP-nocover.epub` (KDP)

## Rebuild the print PDF (needs a Chromium-capable machine — Windows works)
```bash
cd Last2
pip install playwright pypdf reportlab pillow lxml beautifulsoup4
python -m playwright install chromium
python build/build-pod-final.py release/CurlsAndContemplation-POD-Royal-v8-white-openers.pdf
python build/inject-toc-folios.py            # refresh TOC page numbers from the new page-map
pdffonts release/CurlsAndContemplation-POD-Royal-v8-white-openers.pdf   # confirm all embedded
```
This produces a white-opener print PDF with the Quiz Key flowing correctly — no post-processing needed.
