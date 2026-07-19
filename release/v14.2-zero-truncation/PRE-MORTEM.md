# v14.2 Zero-Truncation Release Pre-Mortem

Date: July 19, 2026
Scenario: It is 14 days after release, and a reader reports missing text, duplicate references, the wrong edition, or a rejected paperback interior.

## Summary

- Tigers: 10
- Paper Tigers: 1
- Elephants: 1
- Internal artifact launch blockers remaining: 0
- External paperback/storefront blockers remaining: cover-wrap/ISBN/platform review

## Risk registry

| Risk | Class | Urgency | Evidence | Mitigation / decision | Status |
|---|---|---|---|---|---|
| A long citation is clipped at the print edge | Tiger | Launch-blocking | The v14.1 Chapter III McKinsey URL lost a middle segment | Permit character-level URL wrapping; require every complete source block; inspect page 65 | Closed — passed |
| A citation call is painted on both sides of a page break | Tiger | Launch-blocking | v14.1 repeated call 8 in Chapters I and II | Keep the affected paragraph atomic; require exact per-section marker sequences | Closed — 86/86 |
| Sparse but real worksheet content is discarded as blank | Tiger | Launch-blocking | Four footer pairs and one badge were absent from v14.1 print output | Fix worksheet fragmentation/spacing; audit badge/footer blocks explicitly | Closed — 22/22 |
| Recto blanks have a different trim box | Tiger | Launch-blocking | Fourteen v14.1 blanks were 0.24 points narrower | Assemble blanks and folio overlays at Chromium's exact Royal page box; audit every MediaBox/CropBox | Closed — 384/384 |
| A sampled validator passes while a middle or ending block is missing | Tiger | Launch-blocking | v14.1's validator sampled only a few anchors | Preserve XML tails and compare all 3,010 blocks, all 46 endings, layout labels, noterefs, page boxes, and EPUB bytes | Closed — passed |
| TOC or navigation points to stale pages | Tiger | Launch-blocking | Repairs changed pagination from 380 to 384 pages | Inject all 36 folios from the final map, rebuild again, and require a stable map | Closed — 36/36 |
| Customers receive v14.1 after v14.2 is approved | Tiger | Launch-blocking | Private delivery paths were locked to v14.1 filenames | Update active author-site paths/tests/docs to v14.2 and run the site verification suite | Closed — lint, typecheck, 61 tests, and production build passed |
| A final biography sentence is stranded on an otherwise empty page | Tiger | Launch-blocking | The first v14.2 render placed the About the Author closing sentence alone on page 357 | Compact only the biography print layout, rerun the complete build, and visually inspect both pages | Closed — balanced pages 354–355 |
| A paperback cover/ISBN does not match the 384-page interior | Tiger | External launch-blocking | The previous cover calculation used an older page count; purchased ISBN data is not in source | Recalculate the cover wrap for 384 pages and insert real ISBN metadata before commercial POD upload; never invent an ISBN | Open — author/cover designer |
| Kindle themes or a storefront processor render differently | Tiger | Track | EPUBCheck cannot reproduce every device/theme/vendor conversion | Run Kindle Previewer/device light-dark-sepia and final platform preview before activation | Open — platform QA |
| This repair silently rewrites chapters with generic AI prose | Paper Tiger | — | Git diff contains no chapter prose changes; only two nonverbal marker wrappers | Retain the source/EPUB byte-parity report and no-prose-change diff | Closed |
| Every inherited factual claim needs fresh external research | Elephant | Accepted boundary | This repair was a completeness/rendering release, not a new editorial evidence review | Preserve prior editorial work and commission a separate evidence audit for a future edition if desired | Accepted |

## Release decision

The v14.2 EPUB and POD interior may be committed to the repository and used as the private digital-delivery source after author-site path tests pass. Commercial paperback upload remains blocked until the separate cover wrap is recalculated for 384 pages and real ISBN metadata is supplied if required. Kindle/storefront preview remains a final platform check, not evidence of missing source content in these artifacts.
