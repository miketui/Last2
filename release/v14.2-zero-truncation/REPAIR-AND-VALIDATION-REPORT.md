# v14.2 Zero-Truncation Repair and Validation Report

Date: July 19, 2026
Release: `v14.2-zero-truncation`
Result: **PASS**

## Outcome

The final EPUB and POD interior contain the complete publication: all frontmatter, four Part openers, Chapters I–XVI, and all backmatter through the Bibliography's intended final note. No source block, section ending, worksheet badge/footer, or citation-call marker is missing from the PDF, and the EPUB packages every publication XML-family source file byte-for-byte.

No replacement chapter prose was generated. This repair changes print behavior, page metadata, Table of Contents folios, two nonverbal citation-marker wrappers, validation code, and the active private-delivery paths.

## Defects corrected

- The complete Chapter III McKinsey citation URL now wraps within the print box instead of losing a middle segment.
- Chapter I call marker 8 and Chapter II call marker 8 no longer duplicate across page boundaries.
- The Affirmation Odyssey `Mindset` badge and four previously omitted worksheet footer pairs render in the final PDF.
- The About the Author section was compacted to two balanced pages so its final sentence is no longer stranded by itself.
- All inserted recto blanks, content pages, and folio overlays now use one exact 481.92 x 691.92 point page box.
- The print Table of Contents was regenerated from the stable 384-page final map.
- The release validator now preserves hidden-node tails and checks every semantic block, all section endings, required sparse-layout text, per-section citation sequences, and every page box.
- Active author-site source, tests, scripts, setup guidance, and handoff documents now target the v14.2 private object paths.

## Final artifacts

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `Curls-and-Contemplation-v14.2-ZERO-TRUNCATION-KDP-FINAL.epub` | 5,172,340 | `9214b3252711bf33abd951bdde6d56bf7848783292cf1ca90ee42a1c2e63c34c` |
| `Curls-and-Contemplation-v14.2-ZERO-TRUNCATION-POD-Interior-FINAL.pdf` | 24,015,419 | `d0364c4c00032bfc6e610a026817f3e7d833a840b9d0bf381ca2d3357ac3415f` |

## Content-integrity gates

| Gate | Result |
|---|---|
| Linear spine | PASS — 46 files: 9 frontmatter, 4 Parts, 16 chapters, 17 backmatter |
| Source-to-EPUB byte parity | PASS — 51/51 publication XML-family files |
| Source blocks in PDF | PASS — 3,010/3,010 |
| Final section blocks | PASS — 46/46 |
| Worksheet badges/footer pairs | PASS — 22/22 |
| Citation-call markers | PASS — source 86 / PDF 86 |
| Quizzes and worksheets | PASS — 64 questions / 64 prompts |
| Internal navigation | PASS — no broken files or fragments |
| Print TOC | PASS — 36/36 folios match the final page map |
| Recto openers | PASS — 22/22 on odd-numbered pages |
| Placeholder scan | PASS — 0 hits |

See `FULL-CONTENT-INTEGRITY-REPORT.md` and `INDEPENDENT-WORD-LINE-AUDIT.md` for the section-by-section evidence.

## EPUB gates

- EPUBCheck 5.3.0: 0 fatals, 0 errors, 0 warnings, 0 infos.
- ZIP integrity: PASS; `mimetype` is the first entry and is stored uncompressed.
- XML parsing: 51/51 source XHTML/XML/OPF/NCX files.
- Packaged source parity: 51/51 exact.

## PDF gates

- Pages: 384.
- Trim/page box: 481.92 x 691.92 points on all 384 MediaBoxes and CropBoxes.
- Encryption: none.
- Font resources: 1,194/1,194 embedded.
- `pdftotext -layout`: 67,056 extracted words, exit 0.
- Ghostscript full-file render: PASS.
- Raster render: 384/384 pages at 482 x 692 pixels.
- Geometry: no outermost-edge ink and no text spans outside a crop box.
- Visual review: 20 sequential contact sheets plus full-size repair pages reviewed; no detected clipping, overlap, missing glyph, or unintended sparse content page.
- Intentional blank versos: 14, solely for recto imposition.

## Active delivery paths

- EPUB: `books/curls-and-contemplation/epub/Curls-and-Contemplation-v14.2-ZERO-TRUNCATION-KDP-FINAL.epub`
- PDF: `books/curls-and-contemplation/pdf/Curls-and-Contemplation-v14.2-ZERO-TRUNCATION-POD-Interior-FINAL.pdf`

Paid files remain outside `author-site/public/` and must be uploaded to the private `curls-deliverables` bucket under the paths above.

## Author-site validation

- ESLint: PASS, zero warnings.
- TypeScript: PASS.
- Vitest: PASS — 13 test files, 61 tests.
- Next.js production build: PASS — 57 static/dynamic route entries generated or registered.

## Pre-mortem decision

All internal artifact and delivery-path launch blockers are mitigated. The remaining external commercial-paperback tasks are to recalculate the separate cover wrap for this 384-page interior and insert real ISBN metadata if required. No ISBN was invented. Kindle/device/storefront preview remains recommended before activation because EPUBCheck cannot reproduce every platform theme or conversion.
