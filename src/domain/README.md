# Shared domain boundary

Pricing, configuration normalization and business validation will live here as
deterministic TypeScript functions. They must not import React, Mantine, Convex,
browser globals, persistence or network clients.

Pass explicit configuration, catalogue/rate versions, units and policy inputs.
Return explained calculations and typed validation issues. The browser and
authoritative backend should reuse the same implementation where access permits.

No product definitions or price formulas are seeded yet: the first product and
worked examples still require business-owner validation. Do not fill this
directory with hardcoded Z90/C80 rules to make the scaffold appear complete.
