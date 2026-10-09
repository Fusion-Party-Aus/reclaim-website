# Skill coverage for the codebase improvement pass

All 39 installed `.agents/skills/*/SKILL.md` files were read. Reading and assessing a skill is different from executing its workflow. This pass applies the relevant engineering practices and records why other workflows were not run; it does not claim every skill was executed.

## Applied practices and adaptations

| Skill                         | Use in this pass                                                                                                                                                                                                                               |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| setup-matt-pocock-skills      | Added tracker, triage vocabulary and domain-document conventions, with navigation pointers in the existing `CLAUDE.md`. GitHub label provisioning remains blocked: `gh` is absent and the available connector has no label-creation operation. |
| ask-matt                      | Used the router to select the architecture, regression and review practices appropriate to maintenance work.                                                                                                                                   |
| improve-codebase-architecture | Surveyed recently changed deployment, content discovery and Sanity modules, and prepared a candidate report. The interactive candidate-selection and grilling stages were not run.                                                             |
| codebase-design               | Used interface, seam, depth and locality to evaluate shared sitemap serialization and safe Sanity lookups.                                                                                                                                     |
| tdd                           | Used existing exported lookup and sitemap endpoint seams for regressions, observed failures before fixes, and implemented in red–green slices. The user explicitly approved both test seams before tests were written.                         |
| writing-for-agents            | Kept setup material in reference documents and added short navigation pointers to the existing steering file.                                                                                                                                  |
| domain-modeling               | Added a code-grounded root glossary defining Branch, Policy, Delivery horizon, Research resource and Electorate. No ADR was needed for these reversible fixes.                                                                                 |
| diagnosing-bugs               | Applied deterministic reproduction and regression discipline to the identified failures. A full hard-bug hypothesis/instrumentation investigation was unnecessary for these directly reproducible cases.                                       |
| code-review                   | Adapted the two-axis review to the working-tree change: separate Standards and Spec agents review the scoped diff against project conventions and the authorized maintenance task. This is not a committed-branch review.                      |
| retro                         | Inspected the current session and existing checks: CI runs mutating `lint:fix`/format commands, and baseline Sanity tests exercise mock implementations. These are concrete follow-up checks; the missing label tool is an access limitation.  |

## Assessed but not executed

| Skill                      | Reason                                                                                                                                                      |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| chief-of-staff             | This is a finite maintenance pass, without a long-running goal or recurring schedule to coordinate.                                                         |
| claude-handoff             | No transfer to a Claude background session was needed.                                                                                                      |
| git-guardrails-claude-code | Installing Claude hooks would change a separate harness; no such configuration task was identified.                                                         |
| grill-me                   | No stateless design interview was needed for the selected maintenance fixes.                                                                                |
| grill-with-docs            | No unresolved product decision required an interview with glossary or ADR updates.                                                                          |
| grilling                   | The fixes have observable correctness criteria; an interview would add artificial work.                                                                     |
| handoff                    | Work remains in this workspace and session; no portable handoff was needed.                                                                                 |
| impeccable                 | No visible interface or design change was selected.                                                                                                         |
| implement-spec             | No approved multi-ticket spec or integration-branch task graph exists for this pass.                                                                        |
| implement                  | TDD and review practices were used directly; the ticket workflow and automatic commit step were not run.                                                    |
| loop-me                    | No recurring personal workflow was being specified.                                                                                                         |
| migrate-to-shoehorn        | The pass did not identify a test-fixture migration that justified adding a dependency and broader churn.                                                    |
| pr                         | No pull-request body was written.                                                                                                                           |
| prototype                  | Regressions settled the behavior directly; no uncertain state model or visual design needed a throwaway prototype.                                          |
| research                   | Repository evidence was sufficient; no external documentation question warranted a separate research artifact.                                              |
| scaffold-exercises         | This is a production website, not a course exercise-scaffolding task.                                                                                       |
| setup-pre-commit           | Husky and lint-staged already exist. Reinstalling them would duplicate existing setup.                                                                      |
| setup-ts-deep-modules      | The app uses existing feature modules; introducing a new package layout and example package for these fixes would be speculative restructuring.             |
| teach                      | No multi-session learning mission was requested.                                                                                                            |
| to-questionnaire           | No missing facts held by an external recipient blocked the fixes.                                                                                           |
| to-spec                    | The fixes fit this session; no feature spec was needed or published to the tracker.                                                                         |
| to-tickets                 | No multi-session implementation breakdown was needed.                                                                                                       |
| triage                     | No incoming issue or external PR was selected for triage. Label vocabulary setup does not constitute issue triage.                                          |
| wait-what                  | No request to re-pitch an unclear explanation arose.                                                                                                        |
| wayfinder                  | The selected changes have clear paths and fit one session; a decision-ticket map would add overhead.                                                        |
| wizard                     | No infrastructure cutover or credential-entry procedure was needed. Missing label tooling is documented rather than converted into a provisioning exercise. |
| writing-beats              | No article or raw-material writing journey was requested.                                                                                                   |
| writing-fragments          | No fragment-mining writing session was requested.                                                                                                           |
| writing-shape              | No raw-material article-shaping session was requested.                                                                                                      |

The architecture candidates that remain unimplemented are follow-up opportunities, not claims of completed improvements. Verification results belong in the final change report; this inventory records skill coverage rather than replacing those results.
