# Proposed rewrite architecture

**Status: proposal.** The stack and top-level scope were selected by the
requester in [ADR-0001](../decisions/0001-rewrite-boundary-and-stack.md).
The design below is a recommendation informed by discovery, not a final schema
or an approved business specification. The technical scaffold is implemented;
see [development setup](../DEVELOPMENT.md) and
[ADR-0003](../decisions/0003-foundation-and-test-isolation.md).
The catalogue data/engine boundary is now accepted in
[ADR-0002](../decisions/0002-database-managed-catalogues.md); its detailed schema
and editor policies remain open.

## Recommendation

Use a small modular application, not a port of the global browser state and
not a microservice/monorepo framework:

- One React/Vite frontend.
- Plain TypeScript domain modules for configuration normalization, validation,
  units, pricing and calculation explanations.
- Convex functions for authenticated access, persistence, authoritative
  calculations, revisions, approvals and transactions.
- Database-managed product, field, value and pricing definitions from the first
  product slice, with a narrow editor before a general visual rule builder.

The main engineering goal is **one explainable calculation model**, not just a
new UI that submits browser-calculated totals.

## Why this boundary

| Alternative | Benefit | Problem / recommendation |
| --- | --- | --- |
| Port the old browser calculation/state directly into React components | Fastest superficial UI conversion | Recreates render-time mutation, hidden dependencies and client-trusted prices; reject |
| Build a complete generic ERP/rule platform first | Broad theoretical flexibility | Delays business feedback and encodes rules we do not understand; reject |
| Extract a deterministic domain core and implement one vertical product slice | Independently testable, explainable, reusable on server and client | Requires approved examples and explicit inputs; recommended |

Use [versioned database catalogues](catalogues.md) to describe products,
configuration choices, compatibility and supported price effects. A typed
engine interprets them; ordinary catalogue maintenance does not require a
deployment. A new calculation operation still requires tested code. The
accepted direction and remaining publication/editor choices are recorded in
[ADR-0002](../decisions/0002-database-managed-catalogues.md).

## Suggested layout

Paths below describe the **target organization**. The application shell and
test/backend foundation exist; business feature modules remain planned:

```text
src/
  app/                    providers, routing and application shell
  features/
    auth/
    projects/
    configurator/
    catalogues/             authorized edit, preview and publication
  domain/
    configuration/        normalized inputs, dependencies, validation
    pricing/              units, rates, pure calculation, explanations
    quotations/           draft/revision rules and snapshot contracts
convex/
  schema.ts               explicit persisted schema and indexes
  projects.ts             thin public query/mutation endpoints
  quotations.ts
  model/                  access checks and persistence orchestration
tests/
  fixtures/               approved synthetic/anonymized scenarios
  e2e/                    Playwright workflows
```

The foundation colocates unit/UI/backend test files with their code and keeps
shared test setup and E2E under `tests/`. Continue that convention. Avoid
repository interfaces, service containers, event buses and packages without
a demonstrated need.

## Calculation contract

**Proposed inputs:**

- Versioned normalized configurations and stable position IDs.
- Explicit catalogue/rule and supplier/internal-rate snapshots.
- Customer pricing context, distance, installation-group policy, overhead plan.
- Typed manual overrides and scoped approved exceptions.
- Explicit effective date/currency/unit/rounding policy.

**Proposed outputs:**

- Position/category/group breakdowns, purchase cost and permitted selling views.
- Clearly separated markup-on-cost, margin-on-sale, overhead and profit.
- Rounded quote lines and reconciling totals.
- Distinct internal, customer, commission and tax amounts where required.
- Typed validation issues and explanation/provenance for each applied rule.
- Calculation/schema version and the input-version references.

No DOM access, `window`, global mutable catalogue, storage, network calls or
implicit current date in the calculator. Normalization should be explicit,
deterministic and tested independently. Detect invalid links/cycles rather
than relying on a depth limit.

Prefer explicit representations for absent/unpriced/invalid values. Choose
money precision and rounding from Q-07; do not silently round at every
intermediate operation.

### Authoritative prices

The browser submits configuration inputs and a revision/version reference,
not authoritative cost, margin, approval identity or total.

The backend checks identity/access, loads the approved versions, normalizes and
validates input, calculates the result, checks approval policy, and saves the
permitted snapshot. It rejects stale revisions or changed pricing context
according to the approved policy.

The browser can reuse the same pure functions for responsive previews **only
when the user is authorized to receive their required pricing inputs**.
Do not expose purchase rates or margin context merely to make local previews
convenient. Otherwise use an authorized server preview returning a filtered
selling view. In either case the save/issue path recomputes authoritatively.

For large calculations, measure realistic fixtures against Convex execution
limits before choosing the final function boundary. Do not assume every
legacy quote fits into a single mutation or document.

## Frontend state and forms

- Convex queries own persisted server state.
- Local React/Mantine state owns unsaved form input and transient UI state.
- Persist explicit user edits, not every render; saving has visible pending,
  saved, failed and conflict states.
- A server refresh must not silently erase a dirty form.
- Use Mantine components and `@mantine/form`, with uncontrolled mode where
  appropriate for large forms. Read current values via the supported APIs and
  use explicit change subscriptions for live calculations.
- Client validation improves feedback; backend validators and domain validation
  remain mandatory.
- Keep selected project, draft ID, issued revision and commercial customer
  context explicit in navigation. A quote switch cannot redirect a pending
  save into another document.

Official references: [Mantine Vite guide](https://mantine.dev/llms/guides-vite.md),
[uncontrolled forms](https://mantine.dev/llms/form-uncontrolled.md),
[Vitest integration](https://mantine.dev/llms/guides-vitest.md).

## Convex design

- Thin public queries/mutations delegate to domain/persistence helpers.
- Authenticate and authorize every public business function. Use verified
  identity, never a caller-supplied email or role.
- Enforce per-project and per-field/financial visibility according to Q-02.
  Use explicit response projections; do not return every stored field.
- Validate arguments at the boundary and keep schema/domain types aligned.
- Use appropriate indexes and pagination. A small prototype must not establish
  a permanent unbounded `.collect()` pattern.
- Use transactions for number allocation, idempotent creates, revision checks,
  approval decisions and state transitions that must succeed together.
- Make internal functions internal. Use actions for external effects such as
  mail/document generation; handle retries and partial failure explicitly.
- Store PDFs/files separately and authorize retrieval. Issued quotes must not
  be regenerated with current settings.
- Separate draft and issued snapshot contracts, with an explicit versioned
  conversion that is tested for completeness.
- Realtime subscriptions notify readers; revision checks or leases prevent
  lost updates. Decide the editing policy before enabling concurrent saves.

Official references:
[backend best practices](https://docs.convex.dev/understanding/best-practices.md),
[argument validation](https://docs.convex.dev/functions/validation.md),
[authentication](https://docs.convex.dev/auth/overview.md),
[limits](https://docs.convex.dev/production/state/limits.md).

## Authentication decision to make before implementation

Do not implement another custom credential/verifier/session system.

| Option | Use when | Caveat |
| --- | --- | --- |
| Existing company OIDC provider | Employees already have centrally managed identities | Confirm available integration, claims, MFA, invitations and offboarding |
| Managed provider integrated with Convex | We need robust invitation/recovery/MFA without owning credentials | Cost, data region, account ownership and test environment need agreement |
| Convex Auth | A self-contained React auth flow meets the required capabilities | Official docs currently describe it as beta; verify current capabilities and operational ownership before selection |

**Recommendation:** prefer the existing company identity system when feasible;
otherwise select a maintained managed integration based on Q-01. Keep domain
user IDs independent of a provider's display name/email. Provider choice is
open, not delegated to a coding agent's preference.

## Tests, linting, and delivery

| Layer | Tool / responsibility |
| --- | --- |
| Domain | Vitest: formulas, boundary cases, approved fixtures and invariants |
| React forms | Vitest with React Testing Library/Mantine test setup where useful |
| Convex | Vitest with an appropriate local test harness, e.g. `convex-test`; access denials, authoritative recalculation, revisions and retry safety |
| User workflows | Playwright against a dedicated test frontend/backend with deterministic seeds and fake email |
| Types | Strict TypeScript check, including frontend and Convex-generated types |
| Code quality | Biome formatting/general lint, excluding generated/vendor/build output |
| Packaging | Bun-managed, pinned dependencies and committed lockfile; Vite production build |

Biome cannot directly run Convex's ESLint plugin. The official
[Convex/Biome guide](https://docs.convex.dev/linting/biome.md) describes a narrow
additional Convex-rule runner using Oxlint or ESLint. Keep Biome as requested;
record a separate decision if adding that complementary check rather than
silently replacing the lint stack.

The foundation defines reproducible scripts for install, typecheck, lint,
unit/UI/backend tests, production build and browser smoke tests. Their current
evidence and limitations are in [development setup](../DEVELOPMENT.md) and
[progress](../PROGRESS.md); business-flow acceptance tests remain future work.

## Staged delivery and validation gates

1. **Discovery/owner validation:** approve identity/access, first product and
   exact worked examples. Continue closing source-only risks.
2. **Foundation:** scaffold the requested stack, install/lock dependencies,
   establish CI and isolated test/development environments. No production
   side effects in tests.
3. **Login:** approved identity workflow; unauthenticated/disabled/denied
   backend tests and Playwright login smoke check.
4. **Projects:** minimal list/create/detail, stable server-side numbering,
   validation, idempotency and persistence after reload.
5. **First configurator and catalogue:** load one product's definitions and
   price rules from Convex; provide manual positions, authoritative explained
   calculation, approved fixtures, save/reload and a small catalogue
   edit/preview/publish workflow.
6. **Owner checkpoint:** demonstrate the actual workflow and compare expected
   prices. Record intentional differences before widening scope.
7. **Expand selectively:** links, overrides, imports, groups, approvals,
   issued revisions and PDFs in the order approved by the owner.
8. **Migration/cutover:** only after representative data, reconciliation,
   operational access, historical-document and rollback requirements are met.

Completing an engineering milestone does not imply commercial sign-off.
Current status and task dependencies live in [progress](../PROGRESS.md), not
in this proposal.
