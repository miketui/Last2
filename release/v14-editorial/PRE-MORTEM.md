# v14 Release Pre-Mortem

Date: July 19, 2026
Scenario: It is 14 days after release and the reduced edition has failed. What caused the failure?

## Summary

- Risks identified: 8
- Tigers: 6
  - Launch-blocking: 5
  - Track: 1
- Paper Tigers: 1
- Elephants: 1

## Risk Registry

| Risk | Class | Urgency | Evidence | Mitigation / Decision | Owner | Decision date |
|---|---|---|---|---|---|---|
| A chapter was truncated or lost required instructional material | Tiger | Launch-blocking | Sixteen chapter files were materially shortened | Parse all source files; validate links; require four quiz questions and four worksheet prompts per chapter; verify 498 rendered text anchors | Editorial/build agent | July 19, 2026 — passed |
| PDF or EPUB is stale and does not contain the final correction | Tiger | Launch-blocking | Chapter XV references changed after the first compilation | Recompile both formats after the last source edit; verify byte parity between EPUB contents and the final source | Build agent | July 19, 2026 — passed |
| POD PDF has clipping, wrong trim, unembedded fonts, or incorrect recto starts | Tiger | Launch-blocking | Browser rendering, page filtering, padding, and folio overlays can fail independently | Validate page geometry and fonts; confirm 22 odd-page openers; render and visually inspect representative pages | Build agent | July 19, 2026 — passed |
| Crisis-support information is inaccurate or outdated | Tiger | Launch-blocking | Readers may rely on Chapter XV’s contact instructions | Verify against official 988, Crisis Text Line, SAMHSA, FindTreatment.gov, and Open Path pages; add sources to the chapter | Editorial agent | July 19, 2026 — passed |
| Remote `main` changed and release work overwrites unrelated changes | Tiger | Launch-blocking | Work occurred on a dedicated branch while the repository remained shared | Fetch remote immediately before merge; require a clean fast-forward or explicit conflict review | Release agent | Before push |
| The reduction is perceived as too aggressive | Tiger | Track | POD length fell from 467 to 375 pages | Preserve exercises and high-value frameworks; document chapter-level reductions; monitor reader/editor feedback for a later edition | Author/editor | Post-release review |
| The Marco Reyes composite is mistaken for a real person | Paper Tiger | — | Both the heading and opening sentence label it as a composite | No additional mitigation required | — | — |
| Unchanged legacy claims have not all been re-fact-checked in this pass | Elephant | Accepted scope | This task revised and verified changed material, not every inherited sentence | State the boundary explicitly; retain existing citations; recommend a separate full-manuscript fact-check before a future evidence-focused edition | Author/editor | Accepted July 19, 2026 |

## Release Decision

The five launch-blocking Tigers are mitigated when the remote-main divergence check passes immediately before merge. The tracked Tiger and acknowledged Elephant do not indicate a compilation defect, source truncation, or unsupported claim introduced by this revision.
