# Curls & Contemplation — v8 delivery (current source)

These three files are built from your **current `book/` source** (v8, the most-recent production build — confirmed: `book/` last changed 2026-06-10 05:04, v8 built 2026-06-10 10:32; every commit since touches the website, not the book).

## The 3 files
| File | What it is | Verified |
|---|---|---|
| `Curls-and-Contemplation-v8-FIXED.epub` | Retail eBook **with cover** (Apple/Kobo/Google/direct; also fine on KDP) | epubcheck 5.2.1 **0/0/0/0** |
| `Curls-and-Contemplation-v8-KDP-nocover.epub` | KDP eBook **without cover** (KDP builds the cover) — derived from the retail EPUB, all 6 cover references + cover files removed | epubcheck 5.2.1 **0/0/0/0** |
| `Curls-and-Contemplation-v8-POD-Interior.pdf` | POD print interior, 465 pp, 6.69×9.61 in | 465 pp · trim exact · **all fonts embedded** · folios at a safe 0.45 in |

## The one fix I made
**Truncation found and corrected — the Chapter Quiz Answer Key (p.429).** The layout (`.key-container { max-height:8.11in; overflow:hidden }`) forced the 16-row answer table onto one page and **clipped Chapters XV and XVI** — those answers were missing from the v8 PDF. I regenerated that single page with the full 16-chapter table (all answers from `29-QuizKey.xhtml`, in the book's teal/gold palette and Libre Baskerville + Montserrat) and spliced it back in. Single page in → single page out, so pagination, the TOC page numbers, and folios are unchanged. Re-verified: all 16 chapters present, 465 pp, 0 non-embedded fonts, no render warnings.

The rest of the book flows cleanly — chapter quizzes (`overflow:visible`) and worksheets span multiple pages rather than clipping. The Quiz Key was the only truncation in the book.

## Notes
- **Page count:** v8 is 465 pp by design (every worksheet/journal gets a full writing page; chapter openers padded to recto). A leaner ~250-page layout is possible but would require re-rendering current source with a compacting `print.css` in a Chromium-capable environment (this sandbox has no browser engine). Say the word and I'll prepare that lean-build kit.
- **Do not use** the older 245-page compact files — they predate your v8 content corrections (anonymized case studies, removed unverified claims, ISBN cleanup) and would reintroduce that content.
- Ignore any non-`v8` duplicates in this folder; the three files above are the deliverables.
