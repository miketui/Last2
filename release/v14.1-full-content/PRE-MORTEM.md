# v14.1 Full-Content Release Pre-Mortem

Date: July 19, 2026
Scenario: It is 14 days after release, and readers report missing content or receive the wrong edition. What failed?

## Summary

- Risks identified: 10
- Tigers: 8
  - Launch-blocking: 6
  - Track: 2
- Paper Tigers: 1
- Elephants: 1

## Risk registry

| Risk | Class | Urgency | Evidence | Mitigation / decision | Owner | Decision date |
|---|---|---|---|---|---|---|
| A PDF container clips real text | Tiger | Launch-blocking | The v14 author biography ended mid-sentence because `max-height` and hidden overflow were applied | Remove the cap; allow natural fragmentation; verify first, middle, and final biography anchors and rendered pages | Build agent | July 19, 2026 — passed |
| A sparse but real final page is discarded as blank | Tiger | Launch-blocking | The restored biography’s final sentence occupies a light-ink page that the blank detector initially removed | Preserve known sparse-content files and verify the final source anchor in the assembled PDF | Build agent | July 19, 2026 — passed |
| The print Table of Contents points to stale pages | Tiger | Launch-blocking | The biography repair moved later backmatter by up to five pages | Regenerate 36 folios from the final page map and fail validation on any mismatch | Build agent | July 19, 2026 — passed |
| EPUB and PDF are built from different source states | Tiger | Launch-blocking | Recompilation and folio injection occurred in separate steps | Rebuild both after the final source edit; require byte parity for 51 publication files and PDF anchors for every substantive section | Release agent | July 19, 2026 — passed |
| Customers are served the superseded v14 files | Tiger | Launch-blocking | Twenty-two active website/configuration files referenced the old filenames | Update all active private-delivery references; run tests, lint, typecheck, and production build | Site agent | July 19, 2026 — passed |
| The paperback production package still assumes 375 pages or lacks final ISBN metadata | Tiger | Launch-blocking | The repaired interior is 380 pages, and ISBN purchase/insertion remains outside this repair | Recalculate the cover wrap for 380 pages and insert purchased ISBNs before KDP upload; then rerun the release gate | Author / cover designer | Before commercial POD upload — open |
| A third-party reader or AI extractor stops before the physical end and reports truncation | Tiger | Track | The reported Chapter XV cutoff did not match the complete spine present in the artifact | Ship checksums and the section-by-section integrity report; verify with a normal EPUB reader/PDF viewer and avoid treating a single extractor transcript as the file itself | Release owner | At distribution and support review |
| Kindle presentation differs in light, dark, or sepia mode | Tiger | Track | EPUBCheck proves conformance, not every device theme | Complete Kindle Previewer/device testing before storefront activation | Author / QA | Before storefront activation |
| The repair invents replacement chapter prose | Paper Tiger | — | No chapter source file was edited; the packaged EPUB is byte-identical to source | No additional mitigation; retain the no-prose-change diff and parity report | — | Closed July 19, 2026 |
| Inherited factual claims were not all re-researched during a packaging repair | Elephant | Accepted scope | This pass proves completeness and rendering, not a new line-by-line fact-check of unchanged prose | Keep prior editorial citations and disclose the boundary; schedule a separate evidence audit for a later edition if desired | Author / editor | Accepted July 19, 2026 |

## Release decision

The repaired EPUB and interior PDF may be published to the repository and used as the new private-delivery source. Commercial POD upload remains blocked until the cover wrap and ISBN metadata are aligned with the 380-page interior. The tracked platform risks do not indicate missing manuscript content in these validated artifacts.
