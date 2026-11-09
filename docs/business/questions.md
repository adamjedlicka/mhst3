# Questions for the business owner

**Status:** all questions open. No owner answers have been recorded for the
rewrite. Code behavior is evidence to discuss, not the answer to “what should
the business do?”

Record answers in a [meeting note](meetings/README.md), link it here, and update
the affected [scenarios](scenarios.md). Avoid asking all questions in one
meeting; take concrete examples and work through a small slice.

## First meeting

### Q-01 — Who logs in, and how?

**Why it blocks:** login is the first implementation slice.

- Internal employees only, or external partners/customers too?
- Existing company identity provider, e.g. Microsoft/Google, or new accounts?
- Must login support passwords, recovery, invitations, MFA and account disabling
  from the first release?
- Can we create an isolated test tenant/environment with fake mail?

**Bring back:** selected identity flow, user onboarding/offboarding owner,
MFA requirement and test-account plan. No credentials in meeting notes.
Related: AUTH-01, SC-01.

### Q-02 — What may each person see and change?

The old app has separate project, quote, money, catalogue and approval rights.

Ask the owner to fill a small matrix for the initial real users:
view project, create project, edit assigned/other project, configure prices,
see purchase cost/margin, issue offer, approve exceptions, edit rates/catalogue.
Are there restricted project statuses, sites or customers?

**Bring back:** allow/deny examples, not just job titles. Decide whether
“all internal users can read all projects” is actually acceptable.
Related: AUTH-02, R-04, SC-01, SC-02, SC-10.

### Q-03 — What is the smallest useful project workflow?

- Which fields are mandatory, and is a free-text customer acceptable initially?
- Which list filters and columns are used daily?
- What happens when the same site is received from a second customer?
- Must human project numbers follow an existing series and remain unchanged?
- Which statuses must the first release support?

**Bring back:** a walkthrough of one real inquiry, one duplicate site and the
minimal create form. Related: PROJ-01–PROJ-03, SC-02, Q-10.

### Q-04 — What does each “marže” field mean?

The current calculator applies some percentages to purchase cost but reports
margin against selling price. Show **800 Kč cost + 25% = 1,000 Kč selling**
and **20% reported margin**.

- Is that intended, or do users believe they are setting a 25% selling margin?
- Which percentages are targets, overrides, limits or approval thresholds?
- What should the new UI call them?

**Bring back:** approved formulas and labels, including a manually calculated
example. Do not silently “correct” legacy totals.
Related: PRICE-09, R-01, SC-03.

### Q-05 — Which product do we port first, with which prices?

- Select one concrete product family/product and typical specification.
- Which supplier price-list version, discounts, internal rates, customer class
  and catalogue rules are authoritative?
- Can the first slice exclude import, linked products and manual exceptions?

**Bring back:** one simple and one complex anonymized example with source
dimensions, quantity, specification, expected cost/selling price, selected
price/rule versions and calculation explanation.
Related: CFG-02, PRICE-01–PRICE-06, SC-03, SC-04.

### Q-06 — When should splitting a project change its price?

The old system can price installation/transport per configuration or per
apartment/building group.

- Are split groups independently ordered/installed/delivered, or only printed
  separately?
- Should quantity discounts/trip capacity apply to the full project,
  configuration, building, apartment or installation visit?
- Which mode should be the default?

**Bring back:** the same positions quoted both as a whole and in groups,
including the expected difference. Related: PRICE-07, PRICE-08, SC-05.

### Q-07 — Which rounding and monetary invariants are contractual?

- Whole Kč or haléře at unit/row/document level? How are ties and negative
  adjustments rounded?
- Must displayed unit price × quantity equal the row total? Must all
  subtotals sum exactly to the document amount?
- What happens when allocating installation/accessories into product prices?
- Is CZK the only required currency?

**Bring back:** an approved small-parts example and a nondivisible allocation
example, with exact results. Related: PRICE-10, SC-03, SC-05.

## Subsequent meetings

| ID | Decision and reason | Evidence/example to request | Related scenarios |
| --- | --- | --- | --- |
| Q-08 | Is the first release an internal calculator or an official offer system? Define tax, commission, explicit discounts, quote numbering and document scope. | One issued PDF with explanation of each total, recipient and legal/commercial validity | SC-07, SC-08 |
| Q-09 | Which exceptions require another person's approval? Define minimum margins, warning acknowledgements, approval scope/expiry, self-approval and changed-input invalidation. | One accepted and one rejected exception, including who may decide | SC-08, SC-09 |
| Q-10 | Are multiple bidding customers, investors, customer classes and directories required initially? Which system owns customer identities? | One site quoted to two customers; differing prices/roles; directory ownership | SC-02, SC-11 |
| Q-11 | How should live links, one-time copies, corners and position deviations behave? | Blind + linked box + corner pair; change source height, split/move/delete/reimport a position | SC-04, SC-06 |
| Q-12 | What happens after supplier price changes? May sale stay fixed, may historic cost be used, and who authorizes for how long? | Old/new rate revision, a draft and an issued quote; expected before/after totals | SC-09 |
| Q-13 | Which annual plan, overhead, customer markup/rebate and internal-rate values must exist without the rest of the ERP? Who maintains them? | Approved initial values and responsibility for changing them | SC-03, SC-05, SC-11 |
| Q-14 | Do we migrate historical projects, quotes and PDFs or start in parallel with new projects? What makes cutover safe? | Counts, representative legacy shapes, retention needs, reconciliation and rollback criteria | SC-07, SC-12 |
| Q-15 | Do users co-edit the same quote? Is a single-editor lease acceptable, or must conflicting changes be merged? | Two-user editing walkthrough, acceptable save conflict and offline/error behavior | SC-10 |
| Q-16 | What scale and nonfunctional constraints matter? | Largest project/import/quote, active users, languages, browsers/devices, acceptable calculation latency, hosting/data-region requirements | SC-10, SC-12 |
| Q-17 | Who may edit/publish catalogues and prices, and what must the first editor support? Is separate approval needed? | One routine product/option/price change, one new calculation type, desired review/impact preview and expected treatment of existing quotes | SC-09, SC-13 |

## Answer record

Do not put an uncited answer directly into the pricing findings. For each
resolved question, record:

```text
Question:
Status: open / answered / deferred / superseded
Decision:
Decider and meeting link:
Concrete approved example:
Accepted scope and explicit exclusions:
Affected rule/scenario IDs:
Tests/implementation required:
Follow-up:
```

If the owner is unsure, keep the question open and note what evidence would
settle it. An engineering proposal is not an owner decision.
