# Legacy discovery validation baseline

## What was actually run

On **2026-11-09**, nineteen selected standalone legacy regression scripts
completed successfully:

- Source: `118bad3b390bf2785be0c16c8fe366fb3ecd2003`
- Application: `1.256.2`
- Node: `v24.22.2`, including `node:sqlite`
- Bun available: `1.4.4` (not used as a substitute test runner)
- Python: `3.9.6` (used to inventory source and orchestrate checks)
- Working directory for each test command: `old/`
- Per-script orchestration timeout: 18 seconds
- Result: **19 passed, 0 failed, 0 scripts skipped**

The legacy source and its tracked dependencies were not changed. No dependency
installation, legacy deployment, production login, production database query,
or application email send was performed.

| Exact command inside `old/` | Primary evidence | Result |
| --- | --- | --- |
| `node tests/t246.js` | TOTP login, ticket expiry/replay/policy behavior in local Worker harness | Pass |
| `node tests/t355.js` | Post-login identity/rights refresh; source checks and extracted-function behavior | Pass |
| `node tests/t247.js` | Stale project number, retry key, competing creates, issued-version collision | Pass |
| `node tests/t253.js` | Import project scoping/version grouping | Pass |
| `node tests/t241.js` | Dimension bands, under/over-range values, missing matrix cells | Pass |
| `node tests/t255.js` | Position deviations, splitting, affected specification/price | Pass |
| `node tests/t284.js` | Accessory rule conversion parity | Pass |
| `node tests/t294.js` | Catalogue-option price references and surcharge units | Pass |
| `node tests/t300.js` | Composed rules, tables, coefficients and built-in conversion parity | Pass |
| `node tests/t302.js` | Technical limits, minimum billable area, warning rules | Pass |
| `node tests/t311.js` | Unit/row/quote rounding, allocation and snapshot reconciliation | Pass |
| `node tests/t313.js` | Supplier deductions outside rebate, reference price not NaN | Pass |
| `node tests/t324.js` | Current-price/hold-sale/historic-price decisions | Pass |
| `node tests/t328.js` | Display renames retain internal identifiers | Pass |
| `node tests/t343.js` | Technical packet height, wind checks, dimensional adjustments | Pass |
| `node tests/t345.js` | Additional NEVA specification, gallery and screen pricing paths | Pass |
| `node tests/t347.js` | Configurable numbering-series behavior | Pass |
| `node tests/t352.js` | Price-level units, target-price adjustment and comparison | Pass |
| `node tests/t353.js` | Linked-box height change affects the associated blind | Pass |

The nineteen commands took approximately 49 seconds in total in this
environment. Timings are not a performance baseline.

## What a pass means

These are the repository's existing Node scripts, not Vitest or Playwright
tests for the rewrite.

The scripts mix:

- Static/source-string checks.
- Extracted-function execution.
- jsdom-driven application interaction with mocked network/library paths.
- Worker execution against in-memory SQLite through a D1-like adapter.

For example, [t355](../../old/tests/t355.js#L9-L29) combines source matching and
an extracted identity-refresh function;
[t247](../../old/tests/t247.js#L11-L38) uses an in-memory SQLite Worker harness;
[t311](../../old/tests/t311.js#L6-L39) uses jsdom and local asset stubs.
Those are useful compatibility checks but do not demonstrate a deployed,
authenticated, real-browser journey or commercial correctness.

The suite has optional paths: some server scripts exit successfully when
`node:sqlite` is unavailable
([example](../../old/tests/t247.js#L11-L12)). Check for skip output, not just
exit code. Individual scripts can also conditionally bypass a subcase.

## Safe reproduction

Initialize the pinned submodule, verify Node supports `node:sqlite`, and inspect
scripts before running them. Do not install into or reformat `old/`.

From the parent repository:

```sh
git submodule update --init -- old
node --version
node -e "require('node:sqlite')"
cd old
node tests/t355.js
node tests/t247.js
node tests/t311.js
```

Repeat the other commands from the table for the same selected scope.
The initial execution used a Python subprocess harness to run each exact
`node tests/tNNN.js` command from `old/`, capture output/exit status and enforce
the timeout. Temporary logs and test-created Worker copies used the turn's
scratch directory; those scratch logs are not durable artifacts.
This document records the commands, environment, scope and outcomes.

## Not run or not established

- The complete 272-numbered-script suite and additional preview tests.
- Multiple timezone/date runs.
- Real-browser legacy E2E, layout/accessibility checks or visual comparison.
- A live Cloudflare Worker/D1 environment or actual identity-provider recovery.
- Production catalogue/settings reconciliation or production data migration.
- Original `.xlsm`/macro execution or agreement with independently calculated
  owner examples.
- New-app Vite build, TypeScript check, Biome, Vitest or Playwright were not run
  as part of this legacy-discovery baseline. Subsequent foundation checks are
  recorded separately in [development setup](../DEVELOPMENT.md) and
  [progress](../PROGRESS.md).
- Load/performance/security audit.

Historic red-test notes in
[the 1.171.0 handoff](../../old/docs/stav-a-co-zbyva-1.171.0.md#L10-L13)
are leads to investigate, not current failures to report as newly observed.

## Next verification layers

1. **Approved fixtures:** exact input, catalogue/rate versions, expected unit,
   category and final amounts, units, rounding and owner rationale.
2. **Characterization:** independent runner around the needed legacy functions;
   record inputs and outputs rather than merely searching source text.
3. **Vitest domain tests:** formula/unit/boundary tests and approved fixtures;
   test invariants such as row sums and unchanged unrelated positions.
4. **Backend integration tests:** access denials, server recomputation, retry
   safety, conflict handling, approvals and issued-quote immutability.
5. **Playwright:** real login → create → configure → save → reload → recalculate;
   two sessions for isolation/concurrency and signed-out/denied journeys.
6. **Owner walkthrough:** compare real business expectations with the running
   replacement; explicitly classify each difference as a bug fix, intentional
   change, or unresolved question.

The first real-browser check should use an isolated test environment with fake
mail and synthetic data, not an existing production account.
