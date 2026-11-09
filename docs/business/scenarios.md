# Business validation scenarios

**All scenarios are candidates awaiting business-owner approval.**
“Legacy characterized” means only that selected old tests exercise part of the
behavior. It does not make an expected value business-approved.

For each meeting, complete one scenario with exact inputs and outputs rather
than reviewing a long list of abstract requirements. Use synthetic or approved
anonymized data.

## Scenario catalogue

| ID | Scenario | Expected behavior to confirm | Legacy evidence | Questions |
| --- | --- | --- | --- | --- |
| SC-01 | Sign in, recover access, disable account | Protected data stays unavailable before authentication; correct allowed view after login; recovery/MFA and account disabling work without privilege fallback | AUTH-01, AUTH-02; t246, t355 | Q-01, Q-02 |
| SC-02 | Create and find a project | Mandatory fields, unique human number, retry does not duplicate/overwrite; similar site prompts or adds another bidding customer; allowed filters find it after reload | PROJ-01–PROJ-03; t247 | Q-02, Q-03, Q-10 |
| SC-03 | Price one ordinary configured product | Explain source dimensions, base rate, rebate, surcharges, installation/transport, markup, margin, rounding and total; save/reload gives same resolved inputs and result | PRICE-01, PRICE-05, PRICE-09, PRICE-10; t294, t311, t313 | Q-04, Q-05, Q-07, Q-13 |
| SC-04 | Configure blind plus linked box/gallery | Correct box/product/clear heights and quantities; changing source or box has the agreed propagation and price effect; unrelated positions do not change | CFG-04, PRICE-03, PRICE-04; t255, t343, t353 | Q-05, Q-11 |
| SC-05 | Quote one set of positions as a whole and in groups | Owner explains whether grouping changes installation bands/trips or only allocates an already chosen total; row/subtotal/document values reconcile | PRICE-07, PRICE-08, PRICE-10; t311 | Q-06, Q-07 |
| SC-06 | Import, deviate, split and reimport | Stable position identity; no loss/duplication; approved treatment of manual changes and deleted rows; import choices do not alter another quote | CFG-04; import data findings; t253, t255 | Q-11 |
| SC-07 | Issue, view and copy a quotation | Stored document, inputs and approved amounts remain unchanged after rate changes; editable copy creates another draft; selected quote is explicit | QUOTE-02; snapshot findings; t247 | Q-08, Q-14 |
| SC-08 | Resolve invalid input and low margin | Invalid combinations cannot issue; warnings require the agreed acknowledgement; another authorized approver resolves margin; direct backend calls enforce the same policy | PRICE-02, PRICE-13; t241, t302 | Q-02, Q-08, Q-09 |
| SC-09 | Supplier price changes during draft work | Explicit reprice/hold-sale/historic-price policy, versioned evidence and expiry; issued history is unchanged | PRICE-12; t324 | Q-09, Q-12 |
| SC-10 | Two users, interrupted save and denied access | No cross-project/quote overwrite, no silent lost edits, no sensitive data in unauthorized responses, visible save failure/recovery | QUOTE-01, R-04, R-08; additional tests needed | Q-02, Q-15, Q-16 |
| SC-11 | Same site for different bidding customers | Separate commercial context, quote numbering and customer-specific rates/markup; investor/broker/customer totals are distinguished | PROJ-01, PRICE-09, PRICE-11; further characterization needed | Q-10, Q-13 |
| SC-12 | Large and historical project | Acceptable response time, migration reconciliation, preserved IDs/documents, no silent truncation or size-limit failure | Data findings; not yet exercised | Q-14, Q-16 |
| SC-13 | Manage and publish a catalogue change | Authorized editor adds a field/value and supported price effect without deployment; preview explains the change; invalid/unsupported rules cannot publish; existing drafts remain pinned and issued quotes unchanged | [Proposed catalogue contract](../architecture/catalogues.md); not implemented or characterized | Q-02, Q-05, Q-07, Q-12, Q-17 |

Rule references resolve through
[workflow findings](../legacy/auth-projects-quotes.md) and
[pricing findings](../legacy/configurator-pricing.md). Named scripts resolve
through the [validation baseline](../legacy/validation.md).

## First golden case: SC-03

**Not populated yet.** Do not manufacture an “expected” price by running the
legacy calculator and call it owner-approved.

Capture these together:

| Input/output | Value |
| --- | --- |
| Fixture ID / approved anonymization provenance | Pending |
| Business owner / approval date / meeting | Pending |
| Product and catalogue/rule version | Pending |
| Supplier price-list and internal-rate versions | Pending |
| Customer class and relevant pricing context | Pending |
| Dimensions, units, quantity and specification | Pending |
| Clear height versus product height choice | Pending |
| Base price and each surcharge/deduction | Pending |
| Rebate basis and excluded adjustments | Pending |
| Purchase cost per unit and row | Pending |
| Installation, transport and reserve | Pending |
| Markup per category and reported margin | Pending |
| Overhead and profit, if included | Pending |
| Rounding at each stage | Pending |
| Internal total, customer total, VAT, commission | Pending / explicit exclusion |
| Required approvals/warnings | Pending |
| Expected persisted/reloaded result | Pending |
| Intentional differences from legacy | Pending |

## Acceptance-example format

```text
Scenario:
Status: candidate / characterized / business-approved / implemented / verified
Question and rule IDs:
Approved by:
Meeting:
Input data and versions:
When:
Expected outputs, including units and rounding:
Expected failure/denial cases:
Legacy output and known differences:
Implementation link:
Automated test link:
Owner walkthrough result:
```

### Useful boundary cases for the first product

- Matrix band edge, just above it, below minimum, above maximum and empty cell.
- Quantity at 15/16, 50/51, 100/101 for installation.
- Delivery capacity exactly full and one piece over capacity.
- Rebate at zero and the agreed normal rate; deduction outside rebate.
- Missing dimensions versus a legitimate zero/atypical price.
- Customer-class default versus manual markup.
- Nondivisible row allocation and small-parts unit-price rounding.
- One position-specific change versus changing the common specification.

These are a proposed test matrix, not approved operating limits.
