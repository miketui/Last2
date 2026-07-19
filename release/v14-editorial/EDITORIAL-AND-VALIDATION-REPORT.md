# Curls & Contemplation v14 Editorial Reduction and Validation Report

Date: July 19, 2026
Source branch: `agent/surgical-chapter-reduction-v14`

## Outcome

The raw XHTML for Chapters I–XVI was revised chapter by chapter. Repetition and cross-chapter overlap were removed while quizzes, worksheets, actionable frameworks, safety guidance, and the strongest chapter-specific material were preserved.

The POD interior is 375 pages, down from the reviewed 467-page v13 interior: 92 fewer pages (19.7%). Chapter-body source text decreased from approximately 64,745 to 45,972 words (29.0%). The difference between word and page reductions reflects preserved title pages, quizzes, worksheets, endnotes, quote pages, recto starts, and back matter.

## Chapter-Level Reduction

| Chapter | Before | After | Reduction |
|---|---:|---:|---:|
| I | 4,080 | 2,444 | 40.1% |
| II | 2,673 | 2,471 | 7.6% |
| III | 1,877 | 1,741 | 7.2% |
| IV | 3,653 | 3,280 | 10.2% |
| V | 4,383 | 2,114 | 51.8% |
| VI | 3,813 | 3,275 | 14.1% |
| VII | 2,549 | 2,045 | 19.8% |
| VIII | 5,541 | 4,644 | 16.2% |
| IX | 4,884 | 3,789 | 22.4% |
| X | 4,737 | 2,122 | 55.2% |
| XI | 4,374 | 3,254 | 25.6% |
| XII | 4,571 | 3,813 | 16.6% |
| XIII | 5,936 | 2,207 | 62.8% |
| XIV | 4,872 | 3,286 | 32.6% |
| XV | 3,429 | 2,516 | 26.6% |
| XVI | 3,373 | 2,971 | 11.9% |
| **Total** | **64,745** | **45,972** | **29.0%** |

Counts cover the primary chapter content area and exclude quizzes, worksheets, endnotes, and standalone quote pages.

## Content Integrity Gates

- 16 chapter source files revised.
- 50 publication XML/XHTML/OPF/NCX files parsed with zero structural errors.
- 64 multiple-choice questions retained: four per chapter.
- 64 worksheet prompts retained: four per chapter, including Chapter VI’s alternate worksheet markup.
- All internal chapter links, endnote targets, and backlinks resolve.
- 498 critical PDF text anchors checked across body headings, quiz questions, worksheet prompts, and chapter endings; zero missing.
- No `TODO`, `TBD`, lorem ipsum, insertion placeholders, or unresolved template tokens found.
- Composite material remains explicitly labeled as composite.

## PDF Validation

Artifact: `Curls-and-Contemplation-v14-EDITORIAL-POD-Interior-FINAL.pdf`

- 375 pages.
- Royal trim: approximately 6.69 × 9.61 inches.
- Not encrypted.
- All fonts embedded.
- 22 title, part, chapter, and conclusion openers land on odd-numbered recto pages.
- The page map remained stable after Table of Contents folios were injected.
- Representative title, body, endnote, quiz, worksheet, quote, Quiz Key, and final bibliography pages were rendered and visually inspected with no clipping, overlap, broken glyphs, or truncated text.
- SHA-256: `a46dcf74c236edd551152250fbfa2d15ee068a647229d335325efdb85d0a653b`

## EPUB Validation

Artifact: `Curls-and-Contemplation-v14-EDITORIAL-KDP-FINAL.epub`

- EPUBCheck 5.3.0: 0 fatals, 0 errors, 0 warnings, 0 infos.
- EPUB 3.3 rules used.
- `mimetype` is the first archive entry and is stored uncompressed.
- All 50 packaged publication source files are byte-for-byte identical to the final source tree.
- SHA-256: `4a38a0cd5770a7336a2930913306daedaace8dd56fb4348efb562a8984ed4d33`

## Factual-Safety Review of New Editorial Material

New attributed or high-stakes statements were checked against their cited or official sources. Chapter XV’s crisis and treatment resources were re-verified on July 19, 2026 and added to its selected references:

- [988 Suicide & Crisis Lifeline](https://988lifeline.org/get-help/what-to-expect/)
- [Crisis Text Line](https://www.crisistextline.org/text-us/)
- [SAMHSA Find Help](https://www.samhsa.gov/find-help)
- [FindTreatment.gov](https://findtreatment.gov/)
- [Open Path Psychotherapy Collective](https://openpathcollective.org/)

The ethics and sustainability revision retains traceable references to the [FTC Green Guides](https://www.ftc.gov/legal-library/browse/rules/green-guides), [EPA Safer Choice](https://www.epa.gov/saferchoice/learn-about-safer-choice-label), [OSHA hair-salon guidance](https://www.osha.gov/hair-salons), and [Green Circle Salons](https://greencirclesalons.com/how-it-works/). The mentorship revision retains a direct reference to the [HAIR HAS NO GENDER Affirming Service Finder](https://www.hairhasnogender.com/affirming-service-finder/).

This was an editorial reduction and changed-content verification, not a new line-by-line fact-check of every unchanged claim inherited from the prior edition.
