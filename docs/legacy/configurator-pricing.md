# Configurator and pricing rules

**Status:** observed rules from the pinned source, with selected regression
evidence in [validation](validation.md). These describe compatibility behavior,
not yet approved business policy. Use [Q-04–Q-07](../business/questions.md) and
the [scenarios](../business/scenarios.md) to validate the calculations.

## CFG-01 — Configuration is not a position or a quote revision

The main structure is:

```text
Project
  Bidding customer / commercial context
    Draft or issued quote revision
      Configuration: product + common specification
        Positions: dimensions + quantity + optional deviations
        Derived accessory subvariants
      Grouping: building / floor / apartment / facade / stage
```

One configuration can produce several priced variants through grouping. A
derived accessory “subvariant” is not the same as a building/apartment group or
a quote revision.

The [configuration factory](../../old/public/app.js#L879-L885) holds product,
specification, position arrays, linked sources, risk selections, corner pairs,
accessories and overrides. An ordinary position uses:

| Legacy field | Meaning in the main calculator |
| --- | --- |
| `ozn` | Position label |
| `q` | Width, mm |
| `r` | Clear opening height, mm |
| `s` | Product/manufacturing height, mm |
| `u` | Quantity |
| `at` | Attributes such as stable import ID, building, floor, apartment, facade |
| `spec` | Position-specific specification deviations |
| `impOrig` | Original imported dimensions and quantity |

See [position construction](../../old/public/app.js#L2134-L2168) and
[import conversion](../../old/public/app-import.js#L1690-L1701).
Computed `t` is used for a derived box height; it is not interchangeable with
product height. Some helper paths repurpose dimensions for box/sheet products;
do not port one-letter names into a new public model.

## CFG-02 — Catalogue coverage is not pricing coverage

The bundled [catalogue](../../old/public/data.json#L1) lists eight families:
external blinds, ZIP screens, concealed boxes, cover galleries, internal
blinds, fabric roller blinds, aluminium roller shutters, and insect screens.

The bundled data has 22 price grids and only five field templates. The main
traced/calculated paths are external blinds, ZIP screens, boxes and galleries.
Many other listed products lack an equivalent complete bundled template/price
path. Database catalogue versions and product packages can add/change this.
**A product appearing in a dropdown is not evidence that it can be quoted.**

| Family / example | Observed price path | First-release implication |
| --- | --- | --- |
| External blind, e.g. Z90 | Width/height matrix plus specification, motor/bracket and other surcharges | Strong candidate for the first owner-approved slice; not selected yet |
| ZIP screens, e.g. ZIP100 | Matrix selected by product/specification, with rule/option surcharges | Validate motor/fabric differences separately |
| Concealed boxes, `Typ …` | Running-metre table, dimensions, material and insulation | Needs explicit box-height semantics and accessory quantities |
| ISO-KASTL | Matrix; insulation can select another matrix | Do not force every box through the running-metre path |
| Cover galleries | Developed sheet area, sheet rate, thickness, painting, sides | Distinct from concealed boxes even when type labels overlap |
| `Ostatní` | Manual/atypical item | Need an approved explicit manual-price workflow |

Sources: [base dispatch](../../old/public/app.js#L2599-L2621),
[matrix selection](../../old/public/app.js#L1290-L1306),
[gallery calculation](../../old/public/app.js#L1800-L1816),
[manual item convention](../../old/public/app.js#L933-L937).

## CFG-03 — Specifications are rule-driven

Field templates and rule tags determine selectable values, locks, defaults,
additional fields and technical limits. Older rule tags coexist with composed
JSON rules (`@PRAVIDLO`)
([field builder](../../old/public/app.js#L980-L1025),
[composed rules](../../old/public/app.js#L2357-L2441)).

Conditions can depend on product, specification, width, height, area, quantity,
configuration quantity, imported attributes, customer class, distance, date,
and catalogue-defined attributes. Effects include:

- Filtering/locking/unlocking fields, preselection and required values.
- Matrix selection, surcharges, deductions, coefficients and table lookups.
- Dimension rounding, splitting positions, minimum billable area.
- Additional installation, warnings and delivery-time adjustments.

The legacy field builder can mutate `cfg.spec` and repeat up to four times to
stabilize dependent selections
([normalization loop](../../old/public/app.js#L978-L986)).
Rendering is therefore not just a pure read.

**Proposed:** separate normalization from rendering and price calculation.
Define deterministic ordering, override precedence, and nonconvergence errors.
Port only rule capabilities needed by approved products; do not immediately
rebuild the entire visual rule editor.

## CFG-04 — Linked configurations and deviations

Boxes/galleries can follow positions from selected configurations, sometimes
only a filtered subset. The source lookup uses configuration names and has a
recursion-depth guard. It carries width, quantity, attributes and calculated
box height rather than blindly copying blind product height
([link resolution](../../old/public/app.js#L2684-L2716)).

This is a dependency graph, not a one-time paste. The code also supports taking
positions once instead of maintaining a live link. Partial links and changes
on either side need explicit semantics (Q-11).

Position deviations overlay the configuration specification for that position.
They can affect base purchase cost, accessories, installation, transport,
linked products, and group totals
([per-position calculation](../../old/public/app.js#L2159-L2206)).
The deviations module compares whole-quote calculations for impact, rather
than implementing a second pricing engine
([impact calculation](../../old/public/app-odchylky.js#L145-L169)).

Some manual overrides and linked-row overrides are keyed by array index
([override reads](../../old/public/app.js#L2119-L2129),
[purchase override](../../old/public/app.js#L2196-L2204)).
Use stable position IDs in the rewrite; confirm moving/deleting a row cannot
move someone else's override.

## PRICE-01 — Calculation order

The principal path is:

1. Resolve catalogue/template/defaults and normalize specification.
2. Resolve owned/linked positions, source filters and deviations.
3. Derive dimensions, rule-based rounding, splitting and minimum billable area.
4. Resolve base matrix or manufactured-product cost.
5. Add option/rule surcharges and deductions with units.
6. Apply rebate, custom price-affecting columns and purchase overrides.
7. Build priced groups and derive accessory quantities/cost.
8. Calculate installation, transport and installation risk reserve.
9. Apply category/customer/manual markup; calculate margin and overhead.
10. Compose sellable/printed lines and round them; derive the quote amount.
11. Apply presentation-specific commission/tax treatment and issue validation.

Sources:
[positions and purchase](../../old/public/app.js#L2105-L2206),
[base and options](../../old/public/app.js#L2492-L2613),
[grouping](../../old/public/app.js#L3439-L3514),
[financial summary](../../old/public/app.js#L3730-L3831),
[quote amount](../../old/public/app.js#L28755-L28761).

This order is important: changing a grouping, unit, or rounding stage can
change price even when the raw dimensions look identical.

## PRICE-02 — Dimension bands and invalid combinations

For matrix products the first width band `>= width` and first height band
`>= height` determine the cell; there is no interpolation.
Missing/zero/null cells and out-of-range upper bands produce no price
([matrix lookup](../../old/public/app.js#L1299-L1306)).

Validation is separate: below-minimum dimensions can still receive the minimum
band's numeric price, then be flagged as invalid/atypical. A numeric value is
not sufficient evidence that a position is valid
([validation rationale](../../old/public/app.js#L2630-L2640);
characterized by [t241](../../old/tests/t241.js#L29-L85)).

Missing option prices have another behavior: some selected items appear as
0 Kč with a warning, and missing entries in an edited NEVA price list can fall
back to the bundled base list with an informational notice
([missing-price alerts](../../old/public/app.js#L10313-L10320)).
Those are potentially significant commercial fallbacks, not proof of a free
or included item. Include them in owner validation.

The rewrite should distinguish “valid zero,” “not priced,” “invalid,” and
“needs manual pricing,” rather than use `0` for all four states.

## PRICE-03 — Clear height and box height

When clear-height mode is on, product height is clear height plus derived box
height. Missing clear height must not silently be replaced by product height.
Reverse inference exists for positions supplied with product height only
([height inference](../../old/public/app.js#L1308-L1354),
[position rules](../../old/public/app.js#L2134-L2150)).

The recommended MHST box height and the minimum technical NEVA packet height
are different concepts
([technical minimum](../../old/public/app.js#L1356-L1379)).
A linked box must use its own height, not the full blind height.
Later code also propagates a changed linked box height to blind height;
the selected [t353 regression](../../old/tests/t353.js#L1-L5) exercises it.
Validate this two-way behavior before defining a clean acyclic dependency model.

## PRICE-04 — Manufactured boxes and galleries

For ordinary `Typ …` boxes, the base formula combines:

```text
(running-metre rate + dimensional adjustment)
  × width in metres × (1 + material coefficient)
  + insulation cost + rubber-strip cost
```

Galleries instead use developed sheet area × sheet rate × thickness coefficient,
plus double-sided painting and side pieces where selected. Shape dimensions
can contain signed offsets, not just positive absolute lengths.

Sources: [box dispatch](../../old/public/app.js#L2603-L2608),
[gallery base](../../old/public/app.js#L1807-L1816),
[dimensional adjustments](../../old/public/app.js#L1851-L1884).
Exact shape rules, insulation areas and technical table values still require
product-specific worked examples; this summary is not a full manufacturing
specification.

## PRICE-05 — Surcharges, rebate, and manual purchase price

Let:

- `V`: pre-rebate unit price including option/rule surcharges.
- `B`: the part that must bypass rebate, including certain negative deductions.
- `r`: rebate as a fraction.
- `p`: custom percentage adjustment as a fraction.
- `a`: custom adjustment per unit.
- `A`: custom adjustment per row.
- `u`: quantity.

The observed main-position purchase formula is:

```text
purchaseUnit = (V - B) × (1 - r) × (1 + p) + B + a
purchaseRow  = purchaseUnit × u + A
```

A manual purchase-unit override replaces `purchaseUnit` before the row total.
See [purchase calculation](../../old/public/app.js#L2191-L2206) and
[custom-column classification](../../old/public/app.js#L2048-L2059).

Surcharges can be per piece, square metre, running metre, vertical metre,
configuration, corner count, table-derived quantity or catalogue attribute
([unit calculation](../../old/public/app.js#L2492-L2534)).
Composed coefficients use their calculated base; do not assume arbitrary
stacked percentages are all multiplicative.

For connected blinds without their own motor, the motor surcharge is omitted
and a supplier deduction applies **outside rebate**
([connected blind](../../old/public/app.js#L1885-L1904),
[surcharge handling](../../old/public/app.js#L2539-L2573)).

**Synthetic algebra example, not a quoted business case:** list base 10,000 Kč,
50% rebate, and a full 1,000 Kč deduction gives
`10,000 × 0.5 - 1,000 = 4,000 Kč`, not 4,500 Kč.
The no-rebate deduction behavior is also characterized by
[t313](../../old/tests/t313.js#L1).

## PRICE-06 — Accessories

Accessories are derived subvariants: e.g. sleeves, brackets, corner connectors,
fasteners and thermal pads. They can have their own purchase prices, rebates,
installation, delivery, risk and markup
([accessory wrapper](../../old/public/app.js#L2941),
[accessory financial rows](../../old/public/app.js#L3798-L3817)).

Both historical built-in derivation and catalogue-driven accessory rules exist;
selected [t284](../../old/tests/t284.js#L1) checks parity for that conversion.
Corner pairs can span configurations, so accessory counts cannot always be
calculated independently per row.

## PRICE-07 — Installation, transport, and reserve

- Installation unit rates use quantity bands: `<=15`, `<=50`, `<=100`, then
  `>100`.
- Installation quantity includes pieces created by relevant splitting rules;
  a row with quantity alone but no real position must not add installation.
- Transport trips are `ceil(quantity / capacity)` when capacity is positive.
  One trip costs `oneWayKm × 2 × kmRate`.
- Installation risk is a selected percentage sum of installation cost, not a
  percentage of the entire offer.
- Risk's selling markup is a percentage-weighted combination of the selected
  risk entries' markups.
- Accessories may contribute additional installation and transport.

Sources: [installation bands and quantities](../../old/public/app.js#L2794-L2835),
[transport and reserve](../../old/public/app.js#L2850-L2865),
[accessory delivery](../../old/public/app.js#L2910-L2937).

## PRICE-08 — Grouping can change the price

In whole-configuration mode, installation and transport are calculated for the
configuration and allocated to groups. In split mode, groups can be independent
pricing units, entering smaller installation bands or requiring more trips.
Grouping is therefore not always cosmetic
([pricing-group construction](../../old/public/app.js#L3469-L3519)).

Positions with missing group attributes go into an explicit unassigned group,
not out of the offer
([unassigned positions](../../old/public/app.js#L3447-L3455)).

Q-06 and SC-05 must establish when this behavior is commercially intended.
Do not adopt the false invariant “any grouping change preserves total price.”
Presentation-only allocation, however, should preserve the chosen total.

## PRICE-09 — Markup, margin, overhead, and profit

The label `marže` is overloaded. Row selling prices use a **markup on cost**:

```text
sell = cost × (1 + markupOnCost)
grossProfit = sell - cost
reportedGrossMargin = grossProfit / sell
```

Thus 25% markup on 800 Kč gives 1,000 Kč selling price and **20% margin**.
To reach 25% margin on that cost, selling price would instead be
`800 / (1 - 0.25)`, before the selected rounding policy.

Sources: [main rows](../../old/public/app.js#L3740-L3756),
[aggregate margin](../../old/public/app.js#L3781-L3790).
The distinction also appears in historical notes
([old import proposal](../../old/docs/zadani-import-rozpad.md#L1)).

Product markup can come from the bidding customer's class, otherwise the
product table. Manual quote/group/row overrides can take precedence. Accessory,
installation, transport and risk categories have different sources
([customer/product markup](../../old/public/app.js#L3381-L3405),
[summary categories](../../old/public/app.js#L3758-L3815)).

Overhead rate is annual planned cost divided by annual planned turnover.
Allocated overhead is selling price × that rate; net profit subtracts overhead
from gross profit. Target margin is derived from overhead and target profit
in the ordinary valid-input case
([plan formulas](../../old/public/app.js#L889-L892),
[summary totals](../../old/public/app.js#L3820-L3831)).
The company-budget editor can remain out of scope, but approved values for
these inputs cannot simply disappear.

## PRICE-10 — Rounding and quote amount

The legacy display/quote rule is unit-price-first:

1. Selling unit price is mathematically rounded to whole Kč, except amounts
   with absolute value below 100 Kč use two decimal places.
2. Row total is the rounded unit price × displayed quantity, rounded to Kč.
3. Subtotals and total sum the resulting rows.
4. Allocations use remainder distribution to preserve a chosen total.

Sources: [rounding primitives](../../old/public/app.js#L30-L52),
[print allocation exceptions](../../old/public/app.js#L28679-L28714).
Allocation can require a fractional unit-price correction; “every unit price
above 100 is an integer” is not a universal invariant.

Characterized examples from [t311](../../old/tests/t311.js#L108-L109):
`cenaRadku(1000.4, 3)` → 333 Kč/unit and 999 Kč/row;
`cenaRadku(25.5, 10)` → 2.55 Kč/unit and 26 Kč/row.

The persisted quote amount is based on composed quote lines, not simply the
unrounded financial-summary total. Snapshot reconciliation has a tolerance and
can fall back to the summary
([amount function](../../old/public/app.js#L28755-L28761),
[snapshot reconciliation](../../old/public/app.js#L22503-L22530)).
These fallbacks need characterization rather than silent duplication.

**Proposed:** explicit money/quantity types and named rounding stages, with
integer minor units or a deliberately chosen decimal representation. Decimal
precision and tie-breaking are Q-07, not an implementation detail to guess.

## PRICE-11 — List price, tax, and commission are distinct layers

- Reference/list price for an explicit displayed discount is reconstructed
  using a default rebate rather than necessarily the edited rebate. Non-rebate
  deductions are preserved in full
  ([list-price logic](../../old/public/app.js#L3718-L3727)).
- VAT selection precedence is quote → project → shared settings. Choices
  include 21%, 12%, 0% and reverse charge
  ([VAT selection](../../old/public/app.js#L28730-L28745)).
  This is observed behavior, not tax advice or approved future tax policy.
- Broker commission can increase customer prices using `1 + p` or
  `1 / (1 - p)`. Internal price and financial-summary margins are distinct from
  broker-facing/customer-facing output
  ([commission](../../old/public/app.js#L28664-L28676)).
- `castkaCN` is documented as the internal price, excluding commission and a
  partial print selection
  ([amount contract](../../old/public/app.js#L28755-L28761)).

Resolve Q-08 and Q-13 before naming a single unqualified `totalPrice` field.

## PRICE-12 — Price-list changes are a business event

A draft remembers supplier price-list versions. When changed versions affect
purchase cost, the UI offers:

1. Reprice using current prices.
2. Hold selling prices and recompute row markups.
3. Request time-limited permission to use original price lists.

Until resolved, the draft cannot be issued through the UI. A purchase-cost
change below one Kč is treated as no effective change in this implementation.
Permissions can expire or cover additional projects
([comparison and decisions](../../old/public/app.js#L10108-L10185),
[server permission decisions](../../old/worker.js#L3383-L3414)).

This changes the validity of a quote even without direct user edits. It needs
versioned inputs and explicit policy, not a mutable global “current price.”
SC-09 and Q-12 cover it.

## PRICE-13 — Validation and approval

Errors block issue and cannot be acknowledged away. Warnings can require an
explicit acknowledgement; informational items do not block. Low margin can
require a separate authorized person's approval
([blocking rule](../../old/public/app.js#L10839-L10868),
[margin request/decision](../../old/worker.js#L3444-L3507)).

There are project-wide and revision-specific margin permissions. A person may
not approve their own margin request and cannot authorize a margin below their
own limit. Customer minimums and frontend rights add further inputs to audit;
do not assume the default company limit is the complete policy.

The frontend issue procedure enforces these checks, but the server quote insert
does not mirror the same calculation and validation. See R-02 in the
[risk register](system-map.md#risk-register).
