# ADR-0002 — Database-managed product and pricing catalogues

- **Status:** accepted architectural direction; detailed schema/editor policy remains open
- **Recorded:** 2026-11-09
- **Origin:** adamjedlicka suggested managing products, configuration options,
  allowed values and their price effects as catalogues in the application.
- **Acceptance:** adamjedlicka's “Looks good” response to the recommendation;
  this is requester approval of the architecture, not business-owner approval
  of pricing formulas or publication permissions.

## Context

The rewrite needs configurable products without deploying code for every new
value or price change. The legacy app already has database catalogue versions,
but pricing still mixes data-driven rules and product-name-based branches.
See the [catalogue proposal](../architecture/catalogues.md) for the canonical
model and boundaries.

## Decision

Use versioned database catalogues for product/field/value definitions,
constraints, price-source bindings and supported pricing rules from the first
product slice. Render common configuration fields from those definitions.

Evaluate rules with a typed, deterministic TypeScript engine reused by
authorized previews and authoritative backend calculation. Do not execute
arbitrary stored code. New products using supported operations are data
changes; new operation semantics require tested code and a new engine version.

Publish immutable catalogue releases and pin the catalogue/rate versions used
by each quote. Use explicit upgrades for drafts and preserve issued snapshots.
Provide a small application editor before attempting a general visual builder.

## Alternatives

| Approach | Assessment |
| --- | --- |
| Product/option definitions in code; only prices in the database | Simple initially, but ordinary catalogue maintenance requires deployment and risks UI/calculation drift |
| Database definitions with a bounded, typed evaluator | Recommended balance of maintainability, safety and application-managed flexibility |
| Arbitrary formulas/scripts or a universal no-code rule platform | More open-ended, but adds execution, ordering, migration, debugging and validation costs before the rules are understood |

## Consequences and open decisions

- No new stack or service is needed; this fits the selected Convex backend.
- Catalogue edits are consequential business changes and need backend
  authorization, validation, preview, publication and audit history.
- Product-specific parameters and rate references are data; money semantics,
  evaluation order and security remain deliberate code contracts.
- The precise Convex schema, first editor capabilities and publication
  authority remain open (Q-17). Business pricing examples still need approval.
- Acceptance scenario SC-13 covers catalogue changes without deployment and
  preservation of historical quotes.

## History

- Initially recorded as proposed in response to the catalogue suggestion.
- Architectural direction accepted by the requester in the following review.
  Q-17, business pricing examples and detailed implementation choices remain
  open; no catalogue feature has been implemented.
