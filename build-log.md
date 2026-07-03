# build-log.md

Use this file as the human-readable progress ledger.

## Entry template

```markdown
## YYYY-MM-DD — Task name

### Scope
- 

### Files changed
- 

### Commands run
| Command | Result | Notes |
|---|---:|---|
| `command` | Pass/Fail |  |

### Decisions
- 

### Blockers
- 

### Next action
- 
```

## 2026-07-02 — v13 EPUB production analysis & finalization (v13.1)

### Scope
- Validate uploaded `CurlsandContemplationv13KDPEPUBFINAL.epub` for production sale; fix all errors; sync repo source (user authorized v13 as the source of truth).

### Files changed
- `book/` — replaced with v13.1 source (50 files updated); print-only assets moved to `archive/print-assets-v11/`.
- `book/OEBPS/style/style.css` — responsive title scaling fix (title clipped on viewports ≲ 850 px).
- Ch I + Ch III endnotes, bibliography — 3 dead citation links fixed (1 replaced with live Yahoo syndication URL, 2 converted to print-style citations per "no invented URLs" precedent).
- `release/Curls-and-Contemplation-v13.1-KDP-FINAL.epub`, `release/epubcheck-v13.1.txt`, `reports/v13.1-production-qa.md`, `screenshots/v13.1/`.

### Commands run
| Command | Result | Notes |
|---|---:|---|
| `epubcheck` (5.1.0) on uploaded v13 | Pass | 0/0/0/0 |
| structural QA scripts (manifest/spine/links/alt/toc/ncx/classes) | Pass | 246 internal refs, 0 broken |
| external link sweep (100 unique URLs) | Fixed | 3 dead links found and fixed; rest 200 or bot-blocked |
| headless Chromium renders 320–1000 px | Pass | after title-scaling fix |
| `epubcheck` on v13.1 + on zip of `book/` | Pass | 0/0/0/0 both |

### Decisions
- v13 upload is authoritative (user-confirmed); repo `book/` synced to it.
- Citation fixes follow BUILD-MANIFEST precedent: never invent URLs; keep print-style citations when no live canonical exists.

### Blockers
- None for KDP upload.

### Next action
- Upload `release/Curls-and-Contemplation-v13.1-KDP-FINAL.epub` to KDP (no-cover variant; KDP supplies cover). Re-add ISBNs post-purchase if desired.

## 2026-07-03 — v13.1 RECTO POD interior build (print-ready PDF)

### Scope
- Produce the finalized, corrected, POD-ready print interior from the v13.1 source (user goal), referencing the shipped `Curls-and-Contemplation-v13-RECTO-POD-Interior-FINAL.pdf` (commit f2a0f20).

### Files changed
- `release/Curls-and-Contemplation-v13.1-RECTO-POD-Interior-FINAL.pdf` — 457 pp, KDP Royal 6.69×9.61, all openers recto, fonts embedded.
- `release/page-map.json` — refreshed to the imposed layout (was stale v11-era).
- `book/OEBPS/xhtml/3-TableOfContents.xhtml` — print folios re-injected from the new page map (hidden in EPUB via `display:none`).
- `release/Curls-and-Contemplation-v13.1-KDP-FINAL.epub` — rebuilt from source after TOC folio refresh; epubcheck 0/0/0/0.
- `build/run-pod-build-v13.py` — build wrapper (print.css injected at render time; PyMuPDF ink check; folio-overlay Helvetica strip; per-file print fixes).
- `reports/v13.1-production-qa.md`, `screenshots/v13.1-pod/`.

### Commands run
| Command | Result | Notes |
|---|---:|---|
| `python3 build/run-pod-build-v13.py` (×2, folio-inject between) | Pass | page-map converged; recto asserted by script |
| `python3 build/inject-toc-folios.py` | Pass | 36 entries |
| epubcheck 5.1.0 on rebuilt EPUB | Pass | 0/0/0/0 |
| PDF validation battery (recto/TOC/fonts/folios/links/quiz key) | Pass | see QA report |

### Decisions
- Corrected three content-loss defects present in the previously shipped POD PDFs (Acknowledgments closing page, TOC third page, copyright disclaimer tail) — all caused by the pipeline's blank-page detector dropping real-but-light-ink pages.
- Quiz Key compacted to a single page (matches shipped v13 reference).

### Blockers
- None.

### Next action
- Upload the RECTO POD PDF as the paperback interior on KDP; pair with the v13.1 KDP EPUB for the ebook.
