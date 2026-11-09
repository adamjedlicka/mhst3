# Progress and handoff

## Current state

**Milestone:** technical foundation validated; first business-owner review and
business feature implementation remain pending.

- The legacy projects/configurator paths have been mapped from source.
- Nineteen selected legacy regression scripts passed; see
  [the exact baseline](legacy/validation.md).
- The target stack and rewrite boundary are recorded.
- BUILD-01 is implemented: React/Mantine frontend, strict TypeScript, pinned
  Bun dependencies, Convex foundation, Vitest, Playwright, Biome and a CI
  workflow. See [development setup](DEVELOPMENT.md).
- A [database-managed catalogue refinement](architecture/catalogues.md) is
  accepted as architectural direction: definitions and supported price effects
  are data, interpreted by a typed engine. Editor scope and publication
  authority are not yet agreed.
- Business validation and production-data analysis have **not** started.
  Login, project workflows, catalogue editing and pricing are not implemented;
  the runnable foundation does not pretend otherwise.
- No login provider, first product family, migration scope, or pricing policy
  has been selected by the business owner.
- The requester has selected direct `main` development during prototyping;
  see the [Git workflow](../AGENTS.md#git-workflow-during-prototyping). A separate
  Delta checkout must not be mistaken for the original project folder.

## Next concrete step

Meet the business owner with [Q-01–Q-07](business/questions.md#first-meeting)
and [SC-01–SC-05](business/scenarios.md). Request one simple and one complex
anonymized project with expected prices and an explanation of how they were
calculated.

Resolve access/identity and choose the first product family. Then convert the
approved simple example into an explicit calculation fixture before porting
the pricing implementation. More source investigation can continue without
making those product decisions.

Use the [implementation-readiness checklist](IMPLEMENTATION-READINESS.md) to
separate per-feature blockers from independent work. The requester has now
approved proceeding and BUILD-01 is complete. Implement login/access after
Q-01/Q-02, and the first business slice as its examples and scope are confirmed.

## Board

“Done” below refers to the specified discovery deliverable, not completeness
of the legacy audit or approval of its behavior.

| ID | Work | Status | Evidence / exit criterion |
| --- | --- | --- | --- |
| DISC-01 | Pin source and inventory relevant modules | Done | [System map](legacy/system-map.md) |
| DISC-02 | Trace login, access, project creation, and quote lifecycle | Done for first pass | [Workflow findings](legacy/auth-projects-quotes.md) |
| DISC-03 | Trace pricing pipeline and its exceptions | Done for first pass | [Pricing findings](legacy/configurator-pricing.md); individual production rule values still unknown |
| DISC-04 | Map persistence and integrations | Done for first pass | [Data findings](legacy/data-integrations.md) |
| DISC-05 | Establish selected legacy regression baseline | Done | 19/19 scripts, [validation record](legacy/validation.md); not the entire suite |
| DISC-06 | Establish knowledge-base and meeting workflow | Done | This board, questions, scenarios, and meeting template |
| DISC-07 | Validate identity/access and first supported product | Awaiting owner | Q-01, Q-02, Q-03; approved SC-01 and SC-02 |
| DISC-08 | Obtain approved worked pricing examples | Awaiting owner | Q-04–Q-07; SC-03–SC-05 with exact input/output values |
| DISC-09 | Reproduce browser journey on an isolated legacy environment | Not started | Login → create → configure → reload; no production writes or real-email sends |
| DISC-10 | Characterize source-only risks with focused tests | Not started | R-02, R-03, R-04 in [risk register](legacy/system-map.md#risk-register) |
| DISC-11 | Reconcile live catalogue/settings with bundled fallback | Needs approved evidence | Versioned, anonymized export or owner-guided inspection; no credentials in Git |
| DISC-12 | Establish complete-suite baseline and timezone coverage | Not started | All relevant legacy scripts classified as pass/fail/skip with runtime and fixtures recorded |
| DISC-13 | Define database-managed catalogue boundary | Architectural direction accepted; detailed policy open | [ADR-0002](decisions/0002-database-managed-catalogues.md); Q-17 and candidate SC-13 |
| DISC-14 | Define first-slice implementation readiness | Checklist documented; owner inputs pending | [Readiness gates](IMPLEMENTATION-READINESS.md); minimal scope, access matrix and approved examples |
| BUILD-01 | Scaffold the agreed stack and CI | Done locally; remote CI not run | Frozen install; typecheck/lint/build; 21 Vitest checks; 6 desktop/mobile Playwright smoke checks; isolated local Convex health/codegen; CI configured |
| BUILD-02 | Implement identity and server-side access boundary | Blocked on DISC-07 | Approved SC-01, negative backend-access tests |
| BUILD-03 | Implement project list/create/detail | Planned | Approved SC-02; numbering, validation, retry and authorization checks |
| BUILD-04 | Implement one vertical pricing slice | Blocked on DISC-08 | Approved examples; database-backed product/field/rule definitions; persisted/reloaded input; explained price; server recomputation |
| BUILD-05 | Add linked products, imports, quote issue workflow | Later; scope to confirm | Approved scenarios, immutability, approval and migration tests |
| BUILD-06 | Plan migration and cutover | Later; requirements open | Reconciliation, preserved documents, owner sign-off, rehearsal, rollback plan |
| BUILD-07 | Implement narrow catalogue editor and publication | Planned; details need Q-17 | Deliver with the first catalogue-backed slice; edit/preview/publish supported definitions, reject invalid rules, pass approved SC-13 |

## Working agreements for future sessions

1. Pick a board item; avoid scaffolding unrelated ERP features.
2. Read its canonical findings and source references.
3. Ask the owner only about unresolved business choices, not facts we can
   recover from the source.
4. Add or update a scenario before implementing a business rule.
5. Validate the actual workflow, not only the calculation helper.
6. Update this board and the relevant finding with commands, results, and the
   next task. Keep unanswered questions visible.

## Session log

### 2026-11-09 — Initial discovery

- Initialized the existing `old` submodule at its recorded commit
  `118bad3b390bf2785be0c16c8fe366fb3ecd2003`, version `1.256.2`.
  Did not change legacy source or advance its Git revision.
- Inspected core frontend/backend flows, relevant SQL, catalogue structure,
  import/linked-product paths, historical requirements, and selected tests.
- Identified markup versus margin terminology, group-dependent installation
  costs, incomplete snapshot shapes, client-side issue checks, and runtime
  catalogue/settings dependencies as important validation areas.
- Executed 19 selected Node-based legacy regression scripts: all passed,
  none skipped. These use local test harnesses, not a deployed application.
- Consulted the requested Mantine and Convex documentation, including forms,
  authentication, backend best practices, storage limits, and Biome integration.
- Created the knowledge base and proposed staged architecture. No application
  dependencies were added and no deployment was created.
- Checked all 15 documentation/instruction files: 240 local links and 193
  source-line references resolve with valid line bounds. Markdown heading
  anchors, code fences and whitespace checks passed, including new-file Git
  whitespace checks. External documentation URLs were not all independently
  fetched or link-checked.

**Handoff:** start with DISC-07 and DISC-08. Do not label the old rules as approved
or claim complete behavioral parity from the selected regression baseline.

### 2026-11-09 — Catalogue architecture refinement

- Recorded adamjedlicka's suggestion to manage products, configuration fields,
  allowed values and price effects in application catalogues.
- Rechecked legacy database catalogue support and remaining product-name-based
  calculation branches. The proposal replaces the mixed boundary, not a
  wholly absent catalogue.
- Added the catalogue proposal and proposed ADR-0002: database-backed definitions,
  a bounded typed evaluator, stable IDs, immutable publication and quote pins.
- Updated the first-slice architecture, added Q-17 and candidate SC-13, and
  tracked the narrow editor/publication work alongside pricing implementation.
- Validation: inline Python documentation checker passed for 17 files, 252
  local links, 194 source-line references and all question/scenario IDs.
  `git diff --check` and per-file `git diff --no-index --check /dev/null <file>`
  checks passed; the latter's normal new-file diff status was accounted for.
- Documentation only; no app/schema changes or newly executed legacy tests.
  The earlier nineteen-script result remains the initial-discovery baseline.

**Next:** confirm the catalogue/editor boundary and resolve Q-17 with the owner;
continue DISC-07/DISC-08 rather than building a general-purpose rule platform.

### 2026-11-09 — Implementation-readiness planning

- Recorded requester acceptance of the catalogue architectural direction in
  ADR-0002. Business pricing rules, publication authority and exact editor scope
  remain unapproved.
- Added a readiness checklist with per-feature gates, a candidate first
  end-to-end milestone, owner walkthrough inputs, golden-example requirements
  and a verification/feedback plan.
- Explicitly separated safe technical scaffolding from business-sensitive
  implementation. Full ERP discovery and every open question need not precede
  an isolated scaffold or an unrelated approved feature.
- Validation: inline Python documentation checker passed for 18 files, 261
  local links, 194 source-line references and all question/scenario IDs.
  `git diff --check` and per-file new-file whitespace checks passed.
- No application code, dependencies, schema or legacy source changed.
  No application tests were run for this documentation-only update.

**Next:** conduct the focused owner walkthrough and populate the first examples;
technical scaffolding is ready to start separately if requested.

### 2026-11-09 — Technical foundation

- Implemented BUILD-01 after the requester's “Agree. Lets do it.”
  This authorizes the technical start, not invented answers to owner questions.
- Added a single-package React/Vite/Mantine app with explicit not-configured,
  invalid and configured backend-URL states, no fake login/prices, and a
  persisted light/dark theme. Installed `@mantine/form` without inventing a
  business form to exercise it.
- Pinned dependencies and runtime/tool versions, added strict frontend/backend/
  test typechecks, Biome allowlists, workspace-local browser/cache exclusions,
  and a read-only-permission GitHub Actions workflow that skips `old/`.
- Added the Convex empty business schema, public non-sensitive health query,
  provider-neutral identity helper and actual SDK-generated bindings.
  Generated bindings are included for clean installs; no cloud project or
  company account was created.
- Used anonymous local Convex with CLI home/cache inside the worktree.
  `bunx convex dev --once --typecheck disable --run health:check` returned
  `{ status: "ok" }`; `bun run convex:codegen` then passed against that local
  backend with TypeScript enabled. Both used the isolated environment prefix
  documented in [development setup](DEVELOPMENT.md).
- Local validation passed:
  - `bun install --frozen-lockfile`.
  - `bun run check`: strict typechecks, `bun run lint`, `bun run test` (21
    checks across unit/UI/Convex projects), and `bun run build`.
  - `bun run test:e2e`: 6 production-build smoke checks across desktop/mobile
    Chromium. Every test blocks non-local traffic and WebSockets, and checks
    for uncaught browser errors.
  - Repeated frozen install, `bun run check` and `bun run test:e2e` in a
    clean-checkout copy without `old/`, `.env.local` or `.convex/`; all passed.
  - Parsed CI YAML and reviewed desktop/mobile screenshots.
  - Checked 21 documentation files, 289 local links and 195 source-line
    references; heading/line anchors, question/scenario IDs and whitespace
    passed. `git diff --check` and `git diff --cached --check` passed.
  - Verified ignored local state/credentials, no local deployment secrets in
    the index, unchanged legacy source/revision and closed temporary servers.
- Recorded the isolation/codegen choices in ADR-0003 and added run/setup docs.
  Generated local settings and deployment data remain ignored; no secrets,
  legacy data or dependencies were copied into the rewrite.
- Not run: the workflow on GitHub/Linux, Firefox/WebKit, production services,
  full legacy regression suite, actual login or business-flow acceptance.
  The original nineteen-script result remains a separate discovery baseline.

**Next:** resolve identity/access (Q-01/Q-02), pick the first representative
product, approve SC-03 worked examples and resolve catalogue authority (Q-17).
No further generic scaffold is needed before those feature-specific steps.

### 2026-11-09 — Main-branch prototype delivery

- The requester authorized committing the current knowledge base and technical
  scaffold to `main`, and selected direct `main` development rather than
  feature branches during prototyping. Recorded that preference in `AGENTS.md`.
- The requested delivery target is the original `~/Facha/3ok/mhst3` checkout,
  not only the isolated Delta checkout. No GitHub push was requested.
- Preflight confirmed both local `main` heads were at `dac1b61`, the original
  checkout was clean, and none of the new files would overwrite an existing
  untracked or ignored destination file.
- Reran `bun run check` (typechecks, Biome, 21 Vitest tests and production build)
  and `bun run test:e2e` (6 desktop/mobile Chromium checks); all passed before
  committing. Candidate-file and whitespace checks found no local credentials,
  deployment state, generated build output or legacy contents in the delivery.
- Local transfer must be a fast-forward; any intervening edits or divergent
  history stop the operation rather than triggering a reset or force update.
