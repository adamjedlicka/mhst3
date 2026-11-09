# Database-managed product and pricing catalogues

**Status: accepted architectural direction**, confirmed by adamjedlicka after
the catalogue recommendation on 2026-11-09. Detailed schema, editor scope and
publishing authority remain open. No business pricing rules are approved here.
See [ADR-0002](../decisions/0002-database-managed-catalogues.md).

## Recommendation

Make product definitions, configuration options, allowed values, compatibility
constraints and pricing definitions database-managed from the first product
slice. The configurator should consume a published catalogue, not contain
product names and option lists in React or duplicate them in the calculator.

Keep a small, typed, deterministic TypeScript engine to interpret that data.
Database-managed rules do not mean storing and executing arbitrary JavaScript
or unrestricted formula strings.

The legacy app already has
[versioned catalogue and price-list storage](../legacy/data-integrations.md#where-pricing-data-actually-comes-from).
However, it also retains
[product-name-based calculation branches](../../old/public/app.js#L2599-L2613).
The improvement is a consistent separation, not simply adding another table
beside the existing hardcoded paths.

## What belongs in the database

These are conceptual entities, not a finalized Convex table layout.

| Definition | Examples / responsibility |
| --- | --- |
| Product families and products | External blinds, Z90, C80; stable IDs, labels, descriptions, active/retired status |
| Configuration fields | `Vodítka`, `Držáky vodítek`, `Typ vedení`; input type, unit, help, grouping and display order |
| Allowed values | Named selectable values with stable IDs; applicability to particular products |
| Product-field bindings | Which fields a product uses, allowed subset, default, requiredness and explicitly permitted overrides |
| Compatibility and normalization rules | Conditional visibility, allowed combinations, required values and derived dimensions |
| Price sources | Supplier items, width/height matrices, quantity bands, internal rates, units, currency and effective versions |
| Pricing definitions | Supported calculation strategy and typed rules that connect selections/dimensions to price components |

A single `price` on each option is insufficient. Its effect might depend on
dimensions, another selection, quantity, bracket count, price-list version or
whether a component is already included.

For example, a **hypothetical**, not owner-approved, rule could be:

```text
When guide-bracket option = telescopic:
  component = installation hardware
  quantity = bracket-count table(height) × guide count × product quantity
  unit cost = referenced supplier item in the pinned price-list version
  treatment = purchase-cost surcharge, with an explicit rebate policy
```

The selected value, table, supplier-item reference and rule parameters are
data. Table lookup, unit conversion, quantity calculation and price-component
aggregation are tested engine capabilities.

## What stays in code

- Runtime schemas for supported field, condition and pricing-operation types.
- Evaluation semantics: matrix/band lookup, per-piece/area/length rates,
  derived quantities, coefficients, rebates and explicit deductions.
- Calculation stages, conflict/precedence rules, units and monetary arithmetic.
- Link/dependency resolution, cycle detection and normalization convergence.
- Validation, authorization, publication and immutable-quote safeguards.
- The common Mantine field renderer and specialized interactions where needed.

A product selects an explicit supported strategy; its label must not select a
code path. Adding a product using existing capabilities should need catalogue
changes only. A genuinely new manufacturing algorithm or operation still
requires tested code, an engine version and deployment.

Start with the operations needed by the first approved product, not a universal
no-code programming language. Keep each rule's stage, basis, unit and source
explicit; “add 10%” without identifying what it applies to is not a valid rule.
Reject unsupported operations and conflicting definitions rather than guessing
an order or silently treating them as zero.

## Configurator and editor

The configurator resolves a product's field definitions and renders common
input types using Mantine: select, checkbox, numeric/dimension input and so on.
The same catalogue drives allowed values, validation and the pricing engine.
UI hints are not security checks; the backend rejects invalid selections even
when the caller bypasses the form.

Shared field/value definitions avoid copying an option list for each product.
Product-specific bindings express deliberate differences. Use stable IDs for
products, fields, values and price items, independent of Czech labels,
translations or array positions.

The application's catalogue editor should allow authorized users to:

1. Add/retire products and edit their fields, values and defaults.
2. Associate supported compatibility/pricing rules and rate sources.
3. Preview valid combinations and an explained price using draft definitions.
4. Compare changes against approved examples and, later, affected drafts.
5. Validate and publish a new release with an audit record.

Start with ordinary forms and structured rule templates. A drag-and-drop rule
builder, unrestricted expressions and automatic UI generation for every complex
product interaction are not prerequisites.

## Publication and quote history

Use an explicit lifecycle:

```text
Editable catalogue draft → validate and preview → publish immutable release
                                                   ↓
                                      used by new quote drafts
```

- Publishing validates references, types, units, defaults, conditions,
  dependency cycles, price-source compatibility and engine support.
- Missing coverage must distinguish unavailable, manual-price-required and
  genuinely included items. Do not infer “free” from a missing price.
- Publish atomically against the expected draft revision. Check authorization
  on the backend and record the actor and change, not a caller-supplied author.
- Published definitions are not edited in place. Corrections create a new
  release; retirement removes products from new selection without breaking
  older quotes.
- Quote drafts pin catalogue and supplier/internal-rate versions. Publishing
  does not silently replace their fields, selections or prices.
- Updating a quote to a newer release is explicit: show differences,
  revalidate selections, resolve newly required fields and reprice according
  to the approved policy. A previously accepted exception must not
  automatically authorize changed inputs.
- Issued quotes retain their resolved definitions/labels, inputs, version
  references, engine version, outputs and original document. Referenced
  published versions remain available; newer catalogues cannot rewrite history.

Catalogue definitions, supplier price lists and quote-specific commercial
overrides are separate concerns. Resolve a compatible version set and pin it
per quote; do not make every supplier price update redefine every product field.
An approval/review step may be required before publication; the business owner
must decide who edits, who publishes and whether they must be different people
([Q-17](../business/questions.md#subsequent-meetings)).

## First implementation slice

1. Define the minimal typed catalogue contract for one approved product and
   its required rule operations.
2. Store a versioned initial catalogue and prices in Convex. Local test fixtures
   are snapshots of those contracts, not a second production source of truth.
3. Render its fields from catalogue data and calculate authoritatively using
   the same resolved definitions.
4. Provide a small catalogue-edit/preview/publish screen for that supported
   subset; do not hardcode the first product merely to postpone this boundary.
5. Verify [SC-13](../business/scenarios.md#scenario-catalogue): adding an allowed
   value with a supported price effect needs no deployment; invalid rules are
   rejected; published changes leave existing drafts and issued quotes intact.

The exact first editor capabilities need agreement, but database-backed
definitions should be part of the foundation rather than a later migration.
