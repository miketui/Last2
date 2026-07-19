# v14.1 Full-Content Repair and Validation Report

Date: July 19, 2026
Release: `v14.1-full-content`

## Result

**PASS.** The final EPUB and POD PDF contain the complete publication: all frontmatter, four Part openers, Chapters I–XVI, and all backmatter. No chapter source prose was generated, shortened, reconstructed, or otherwise changed during this repair.

## What was found and fixed

The v14 source and packaged EPUB already contained all sixteen chapters. The v14 PDF also reached Chapters XV and XVI, so a reader or AI extractor stopping early did not prove that those chapters were absent from the file.

The audit did find a real PDF defect in the backmatter: the print stylesheet limited several backmatter containers to one page and hid overflow. “About the Author” therefore stopped after `Nike’s “Greatest Dynasty…` even though the source continued. After natural pagination was restored, the build’s sparse-page detector also tried to discard the biography’s final one-line page.

The repair:

- removes the one-page height cap and hidden overflow from the author profile;
- allows the author profile to paginate naturally;
- preserves the sparse final biography page;
- re-injects all print Table of Contents folios from the final page map;
- adds a release-blocking source/EPUB/PDF completeness validator;
- updates every active author-site delivery reference from v14 to v14.1.

## Final artifacts

| Artifact | Size | SHA-256 |
|---|---:|---|
| `Curls-and-Contemplation-v14.1-FULL-CONTENT-KDP-FINAL.epub` | 5,172,283 bytes | `887a74de5f1051d5f7ca89e83b85342517717e4584da487510a003c084853d70` |
| `Curls-and-Contemplation-v14.1-FULL-CONTENT-POD-Interior-FINAL.pdf` | 19,937,645 bytes | `38f88ba6cd7fbf677636cfd32897079e76d2789d6cc9c9cfb457bbbfbf52973b` |

## Content-integrity proof

| Gate | Result |
|---|---|
| Linear reading-order files | PASS — 46 total: 9 frontmatter, 4 Parts, 16 chapters, 17 backmatter |
| Source-to-EPUB byte parity | PASS — 51/51 publication XML-family files exact |
| Chapter content | PASS — all 16 chapters; 11/11 PDF anchors per chapter |
| Quizzes and worksheets | PASS — 64 quiz questions and 64 worksheet prompts |
| Internal links and fragments | PASS — no broken targets |
| Table of Contents folios | PASS — 36/36 match the final PDF page map |
| Page-map order | PASS — exactly matches the 46-file linear spine |
| Required recto openers | PASS — 22/22 open on odd-numbered pages |
| Placeholder scan | PASS — no TODO, TBD, FIXME, lorem ipsum, insert, or placeholder markers |

The section-by-section page spans and anchor results are recorded in `FULL-CONTENT-INTEGRITY-REPORT.md`.

## EPUB validation

- EPUBCheck 5.3.0: 0 fatals, 0 errors, 0 warnings, 0 infos.
- XML parsing: 51/51 XHTML/XML/OPF/NCX files parsed successfully.
- `mimetype` is first in the archive and stored uncompressed.
- All packaged publication source files are byte-identical to the repository source.

## PDF validation

- Pages: 380.
- Trim: 481.92 × 691.92 points (KDP Royal 6.69 × 9.61 inches).
- Encrypted: no.
- Suspect structure: no.
- Font resources: 529/529 embedded; 0 unembedded.
- `pdftotext`: exit 0; 0 warnings; 66,688 extracted words.
- Ghostscript full-file render: PASS.
- Chapters XV and XVI: pages 293–310 and 311–332 respectively.
- About the Author: pages 348–351, including the restored final sentence, “This book is his way of pouring that belief forward.”
- Bibliography: pages 371–380 and closes normally.

## Visual inspection

Rendered-page review passed for the final Table of Contents, Dedication ending, Chapter XV opener and close, Chapter XVI opener and close, the repaired author biography, and the final bibliography page. No clipped text, overlaps, missing glyphs, or unreadable elements were observed. Page 332 is an intentional blank verso that places the Conclusion on recto page 333.

## Author-site validation

- Active private EPUB/PDF delivery paths now use the v14.1 filenames.
- Unit/integration tests: 13 files passed, 61 tests passed.
- ESLint: PASS with zero warnings.
- TypeScript: PASS.
- Next.js production build: PASS; 57 pages/routes generated or registered.

## Distribution boundary

These artifacts are complete and validated. Before commercial paperback upload, the cover wrap must be recalculated for the 380-page interior, and purchased ISBN metadata must be inserted if it has not yet been supplied. Kindle light/dark/sepia device testing remains a recommended final platform check.
