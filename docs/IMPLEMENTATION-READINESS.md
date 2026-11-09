# Before implementation: decisions, examples, and starting gates

**Status:** planning checklist, 2026-11-09. The stack and database-managed
catalogue direction are accepted by the requester. First-release business
scope, identity/access, worked pricing examples and catalogue publication
authority remain open. The technical foundation is now implemented; see
[development setup](DEVELOPMENT.md) and [progress](PROGRESS.md).

We do not need to understand the entire ERP before writing code. We need enough
agreement to implement and verify the first small workflow without inventing
commercial policy.

## What is ready, and what is not

| Work | Needed before starting that work | Current state |
| --- | --- | --- |
| Technical scaffold and local test setup | Agreed stack and repository boundary | Implemented as BUILD-01; no business behavior approved by this completion |
| Login and protected backend | Identity flow, onboarding/MFA needs and minimum access matrix | Q-01/Q-02 open |
| Project list/create/detail | Mandatory fields, customer/site meaning, numbering and first statuses | Q-03 open; Q-10 if multiple bidding customers are essential initially |
| First catalogue/editor | Selected product, authoritative definitions/rates, minimal edit/publish authority | Q-05/Q-17 open; sketch the contract, not a universal rule platform |
| Authoritative pricing | Approved examples, money/unit semantics, relevant rate/overhead inputs | Q-04–Q-07/Q-13 open |
| Official offers or production cutover | Issue/approval policy, document/history guarantees, environment and migration/cutover requirements | Q-08/Q-09/Q-12/Q-14 open; not prerequisites for a synthetic internal prototype |

The [question register](business/questions.md) is canonical for answers; this
checklist does not introduce another copy of the business rules.

## 1. Agree on the first demonstrable workflow

Write a short milestone scope with one target user, an end-to-end journey and
explicit exclusions.

**Recommended candidate, not approved scope:**

```text
Employee logs in
  → creates and finds a project
  → selects one product from the published database catalogue
  → enters positions manually and selects configuration values
  → receives an explained, backend-calculated price
  → saves, reloads and gets the same versioned result

Authorized catalogue editor
  → changes a supported option/rate definition
  → previews, validates and publishes a new version
  → existing quote drafts are not silently changed
```

Z90 is a candidate for the first product, not a selection made on the owner's
behalf. Pick something both representative and small enough to validate.
Do not exclude linked boxes if they are indispensable to the real workflow.

Explicitly decide whether imports, multiple bidding customers, broker
commission, official PDFs, complex approvals and historical migration are
included or deferred. An internal draft calculator can precede official quote
issue; it must not be presented as an authorized customer offer.

**Deliverable:** a milestone scope and corresponding selected
[scenario IDs](business/scenarios.md), including what “done” means.

## 2. Walk through real work and obtain independent expected results

Ask the business owner to demonstrate how they receive an inquiry, create a
project, choose a product, configure it and decide what price to offer.
Use synthetic or approved anonymized evidence; do not copy customer documents
or production exports into Git.

For the chosen product, complete:

- A simple valid example.
- A more complex example with an option changing price and a relevant rounding
  or quantity boundary.
- An invalid/unpriceable combination and the required response.

For each valid case, capture dimensions and units, quantities, specification,
catalogue/rate versions, rebate, adjustments, installation/delivery if in scope,
markup versus margin, rounding and expected intermediate/final amounts.
List deliberate exclusions such as VAT or commission instead of silently
assuming them.

These expected results must come from the owner or another agreed independent
calculation, not merely be copied from the legacy calculator. Compare with
legacy output and classify any disagreement as intended change, suspected bug
or unresolved question.

**Deliverable:** populated SC-03 and the relevant additional scenario(s),
confirmed in a [meeting record](business/meetings/README.md). These become
golden fixtures when implementation starts.

## 3. Set the access boundary and authoritative data sources

Decide only the policies needed for the first workflow:

- How employees sign in and how accounts are invited, recovered and disabled.
- Who can view/edit projects, see purchase cost/margin, change catalogues and
  publish prices; whether publishing needs someone else's approval.
- Which supplier files, catalogue versions, internal rates and customer
  pricing context are authoritative. Source defaults alone are not evidence
  of production settings.
- Whether the first release starts with new projects in parallel with the old
  app or must migrate historical work before it is usable.
- Required deployment region/data handling and who owns the company accounts,
  before provisioning environments or storing real data.

The developer can recommend an auth integration after those requirements are
known. The owner does not need to choose technical schemas or SDKs.
Use isolated development/test environments and fake mail; supply future
credentials through environment/secret configuration, never documentation.

**Deliverable:** minimum allow/deny matrix and a list of approved input
sources/versions, with a clear boundary for real-data use.

## 4. Sketch the workflow and domain contract, not the whole system

Review rough screen/flow sketches for login, projects, the first configurator
and the narrow catalogue editor. This should expose missing steps and confusing
terms before detailed UI work, without requiring a pixel-perfect design.

Then outline stable IDs and relationships for project, quote draft/revision,
configuration, position, catalogue release and price-list versions. Specify
the first supported rule operations and calculation input/output contract.
Follow the [catalogue design](architecture/catalogues.md) rather than inventing
one generic table for every kind of business data.

Choose a simple explicit save-conflict behavior, such as revision-checked saves
with a visible conflict response. Do not equate realtime updates with safe
co-editing. Ask about typical/largest position counts, users and target devices
so we can test realistic sizes and interaction patterns.

**Deliverable:** a small model/command sketch tied to the selected examples.
Final table boundaries and performance measurements can evolve during the
first implementation; they need not be fully specified now.

## 5. Agree on the first slice's verification and feedback loop

The implementation backlog should include:

- Vitest domain checks for the approved examples and rounding/band boundaries.
- Backend tests for access denials, invalid selections, caller-supplied totals,
  missing prices, revision conflicts and retry-safe project creation.
- Catalogue publication checks and pinned-version behavior.
- A Playwright login → create → configure → save → reload journey.
- Visible save/calculation errors instead of zero-price or privileged fallback.
- Typecheck, Biome, unit tests and Vite build in CI, plus an isolated E2E setup.
- An owner demonstration after the first working slice, with differences and
  decisions written back into the knowledge base.

Choose an achievable review cadence with the owner rather than disappearing
until the entire configurator has been rebuilt. Track progress and blockers in
[the progress board](PROGRESS.md).

## What need not block us

- Every remaining business question or legacy product family.
- A general-purpose visual rule builder.
- Full ERP/integration design, historical migration tooling or production cutover.
- A complete visual redesign or every user preference.
- Running every legacy regression before beginning an isolated scaffold.

Known risks stay in the backlog and are resolved before their affected
capability is enabled. Unknown business behavior must be rejected, kept
explicitly unsupported or limited to a labelled prototype—not silently guessed.

## Recommended next step

Hold a focused 60–90 minute business-owner walkthrough using Q-01–Q-07 plus
Q-17, the milestone candidate and the three example types above. Discuss
official-offer and migration scope briefly to avoid hidden first-release
requirements. Record confirmed answers and pick the first product.

Technical scaffolding has proceeded independently as BUILD-01. Start the
business-sensitive features as their particular decisions/examples are ready;
do not turn this checklist into a requirement to finish all discovery first.
