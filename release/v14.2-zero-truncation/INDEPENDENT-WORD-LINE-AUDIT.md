# v14.2 Independent Word-and-Line Integrity Audit

Date: July 19, 2026
Release: `v14.2-zero-truncation`
Result: **PASS**

## Scope

This audit compared the repository source, the packaged EPUB, and the rendered POD PDF. It covered the complete 46-file linear spine: 9 frontmatter files, 4 Part openers, Chapters I–XVI, and 17 backmatter files. It did not infer completeness from the Table of Contents alone.

No chapter prose was invented, reconstructed, summarized, or shortened in this repair. The only chapter-source edits are nonverbal markup around two existing citation calls so Chromium cannot duplicate those markers at page boundaries.

## Exhaustive content proof

| Gate | Result |
|---|---|
| Publication XML-family source packaged byte-for-byte in EPUB | PASS — 51/51 files |
| Complete semantic source blocks found in PDF | PASS — 3,010/3,010 |
| Final block of every spine section found in PDF | PASS — 46/46 |
| Required worksheet badges and footer pairs found in PDF | PASS — 22/22 |
| Citation-call markers | PASS — source 86 / PDF 86, in matching section order |
| Quiz questions | PASS — 64/64 |
| Worksheet prompts | PASS — 64/64 |
| Internal EPUB links and fragments | PASS — no broken targets |
| Print TOC folios | PASS — 36/36 match the final page map |
| PDF page boxes | PASS — 384/384 at 481.92 x 691.92 points |

The complete section-by-section block, ending, layout-label, noteref, word-count, and page-span evidence is in `FULL-CONTENT-INTEGRITY-REPORT.md`.

## Chapter spans in the final PDF

| Chapter | Pages | Source blocks |
|---|---:|---:|
| I | 21–38 | 132/132 |
| II | 39–56 | 135/135 |
| III | 57–70 | 110/110 |
| IV | 73–94 | 176/176 |
| V | 95–108 | 108/108 |
| VI | 109–130 | 179/179 |
| VII | 131–144 | 125/125 |
| VIII | 145–172 | 246/246 |
| IX | 175–196 | 192/192 |
| X | 197–210 | 124/124 |
| XI | 211–232 | 180/180 |
| XII | 233–258 | 227/227 |
| XIII | 259–274 | 121/121 |
| XIV | 277–298 | 186/186 |
| XV | 299–316 | 150/150 |
| XVI | 317–338 | 196/196 |

Chapter XVI closes normally on page 334 before its quiz, worksheet, quote page, and intentional blank verso. The Conclusion begins on recto page 339. The About the Author section occupies pages 354–355 without a stranded final sentence. The Bibliography occupies pages 375–384 and closes with its intended final note.

## v14.1 defects retested

| Defect | v14.2 disposition |
|---|---|
| Chapter III long McKinsey URL clipped at the right edge | Fixed; the full percent-encoded URL renders and the complete endnote block passes |
| Chapter I call 8 repeated across a page break | Fixed; 10 source calls / 10 PDF calls |
| Chapter II call 8 repeated across a page break | Fixed; 12 source calls / 12 PDF calls |
| `Mindset` badge omitted from Affirmation Odyssey print pages | Fixed; badge and heading share page 12 |
| Four worksheet footer pairs discarded with sparse pages | Fixed; all required footer pairs render with their final content |
| About the Author final sentence stranded on a separate page | Fixed; the complete biography now renders as two balanced, readable pages |
| Inserted blanks used a different MediaBox width | Fixed; all 384 MediaBoxes and CropBoxes are uniform |
| Prior validator sampled only a few anchors and could drop hidden-node tails | Fixed; tail-preserving removal and exhaustive block/layout/noteref/page-box gates now block release |

## Format and visual proof

- EPUBCheck 5.3.0: 0 fatals, 0 errors, 0 warnings, 0 infos.
- XML parse: 51/51 files.
- ZIP integrity: no errors; `mimetype` first and uncompressed.
- PDF fonts: 1,194/1,194 font resources embedded.
- `pdftotext -layout`: 67,056 extracted words, exit 0.
- Ghostscript full-file render: PASS.
- Raster review: 384/384 pages rendered at 482 x 692 pixels; 20 sequential contact sheets reviewed.
- Geometry: no ink in the outermost three-pixel crop band and no text span outside a page crop box.
- Intentional blank versos: 14, used only for recto imposition.

## Artifact identity

| Artifact | Bytes | SHA-256 |
|---|---:|---|
| `Curls-and-Contemplation-v14.2-ZERO-TRUNCATION-KDP-FINAL.epub` | 5,172,340 | `9214b3252711bf33abd951bdde6d56bf7848783292cf1ca90ee42a1c2e63c34c` |
| `Curls-and-Contemplation-v14.2-ZERO-TRUNCATION-POD-Interior-FINAL.pdf` | 24,015,419 | `d0364c4c00032bfc6e610a026817f3e7d833a840b9d0bf381ca2d3357ac3415f` |

## Audit boundary

This is an exhaustive packaging, text-presence, marker-count, navigation, geometry, and visual-layout audit. It proves that the finalized source text reached both artifacts without detected truncation or newly generated replacement prose. It is not a new external fact-check of every inherited factual claim or citation.
