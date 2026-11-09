# Data, integrations, and migration implications

**Status:** source-derived data map, not a production database audit.
No live database, secrets, real accounts or customer files were accessed.

## Relevant persisted entities

| Legacy storage | Meaning | Rewrite concern |
| --- | --- | --- |
| [`users`, `sessions`, `pokusy`](../../old/schema.sql#L3-L39) | Identity, session hashes and login limiting | Provider identity is separate from application role/access; do not migrate secrets as domain data |
| [`role`, `uzivatel_role`](../../old/schema.sql#L144-L160), [`prava_matice`](../../old/schema.sql#L413) | Role grants, assignments and detailed matrix | Reconcile server and UI policies; capture the approved minimum matrix |
| [`poptavky`](../../old/schema.sql#L100-L124) | Project through inquiry/offer/job stages | Keep stable project ID distinct from human number |
| [`nabidky`](../../old/schema.sql#L48-L70) | Draft and locked quotes; input JSON, totals, summary and PDF | Explicit revision lifecycle; authoritative calculation; do not copy its monolithic document shape blindly |
| [`importy`](../../old/schema.sql#L72-L98) | Project-owned, versioned source rows and mappings | Source revision and quote-specific selections are different entities |
| [`nastaveni`](../../old/schema.sql#L41-L46) | Shared plan, defaults, overrides and feature switches | These are hidden pricing dependencies, not merely preferences |
| [`profily`](../../old/schema.sql#L127-L131) | User-specific layouts/preferences | Optional for first release; never mix with shared pricing inputs |
| [`schvaleni`, `marze_povoleni`, `ceny_povoleni`](../../old/schema.sql#L162-L192) | Margin and historic-price exceptions | Authority, scope, expiration and calculation/revision binding |
| [`zakaznici`](../../old/schema.sql#L194-L211) | Customer identity, contacts and minimum margin | Deduplicate by stable ID; price-class data must be captured too |
| [`proj_sod`](../../old/schema.sql#L687-L689) | Contract and wider project-workspace data, keyed by human project number | Contains more than the initial slice; establish ownership before migration |
| [`proj_ucastnici`](../../old/schema.sql#L691-L693) | Participants/contact roles on a site | Different from a user account, bidding customer or assigned salesperson |
| [`slovo`](../../old/schema.sql#L695-L699) | Edit lease and update marker | Not proof of universal conflict prevention |
| [`cenik_*`](../../old/schema.sql#L755-L815) | Supplier price-list versions, data sections, adjustments, history | Preserve effective versions, rates, row IDs, units and provenance |
| [`kat_verze`, `kat_data`, `kat_historie`](../../old/schema.sql#L817-L851) | Catalogue/rule/template versions | Catalogue revision must accompany price-list revisions |

SQL relationships and JSON references are not a guarantee of referential
integrity. A real export is needed to establish missing links, duplicate
numbers, orphaned imports, legacy snapshot variants and quote sizes.

The Worker also runs migrations when handling API calls
([entry point](../../old/worker.js#L6422-L6437)).
Reading `schema.sql` alone is not sufficient to reproduce a live schema.
Do not point a discovery harness at a production database.

## Where pricing data actually comes from

The browser initially reads the bundled
[`data.json`](../../old/public/data.json#L1), but can then load:

1. Shared settings such as plan, defaults, and manual data overrides.
2. Effective supplier price-list versions, including internal rate tables.
3. Effective catalogue versions, including fields, rules and defaults.
4. Quote-specific historic price versions when an exception is allowed.

Sources: [startup data loading](../../old/public/app.js#L32311-L32401),
[price-list API](../../old/worker.js#L1015-L1053),
[catalogue API](../../old/worker.js#L1557-L1574),
[historic pricing](../../old/public/app.js#L10108-L10185).

Price-list sections include matrices, sheet/running-metre costs, rebates and
other coefficients, installation, transport, risk and markups. Catalogue data
also changes the calculation through specification rules.

**Unknown:** which switches, catalogue/rate versions and overrides production
currently uses. Tests using the bundled fallback or applying a product package
in memory do not answer that question.

### Stable identity versus display names

Newer legacy code preserves original internal family/product/field names as
IDs and applies separate display-name maps
([identity convention](../../old/public/app.js#L949-L966)).
Price-list rows also gained IDs
([row-ID logic](../../old/public/app.js#L2289-L2292)).
Other relationships still use names or indexes. A migration must preserve
original identifiers and translate references deliberately, not generate new
IDs from the current translated display label.

## Snapshots: what is and is not frozen

The quote row can contain:

- Full configuration inputs, including position dimensions in `data.cfgs`.
- Cached numeric amount/purchase values.
- A financial summary snapshot with catalogue and price-list references.
- Original PDF bytes.

However, the
[financial snapshot rows](../../old/public/app.js#L22524-L22530) contain stable
financial-row keys, labels and selling amounts, not a complete per-position
calculation trace. The
[issued input payload](../../old/public/app.js#L22631-L22635) differs from the
[draft input payload](../../old/public/app.js#L19051-L19070).
Plan/print/context and warning/import state are not all serialized identically.

Consequences:

- Do not claim older quote summaries can always regenerate a full quote.
- Do not regenerate a historical official document from today's rules.
- Preserve original PDFs if historical quotes must migrate.
- Require one versioned, tested snapshot schema for the replacement, including
  resolved inputs, calculation/rule version, rates and decision provenance.
- Migration fixtures need examples of old shapes, missing fields and renamed
  catalogue entries, not just a newly created “perfect” quote.

## Import identity and ownership

Imports belong to the project and can be reused by several quote revisions.
New source uploads can create another version of the same import group
([import versioning](../../old/worker.js#L5128-L5161)).
The client workflow is Source → Mapping → Skeleton → Grouping
([steps](../../old/public/app-import.js#L1704-L1717)).

Quote-specific choices—selected sheets/positions, assignment targets and
grouping—belong to the quote, not the shared source document
([selection persistence](../../old/public/app-import.js#L3774-L3798)).
Imported positions retain source ID, parent/split information and an original
value snapshot
([conversion](../../old/public/app-import.js#L1690-L1701)).
Reimport has merge logic for manual edits
([merge](../../old/public/app-import.js#L1285-L1304)).
This is not safely replaced by “parse Excel and append rows.”

## External dependencies

| Dependency | Observed role | Initial rewrite treatment |
| --- | --- | --- |
| Cloudflare Workers/D1 | Current API/database and runtime migrations | Replace within the agreed scope; avoid operating the old deployment |
| Cloudflare Access | Email-verified password recovery | Depends on chosen new auth provider, not automatically retained |
| Resend | Invitation and development-report email | Email workflows need explicit provider/configuration; never send real messages in tests |
| OpenStreetMap Nominatim / OSRM | Address search and one-way road distance; fallback distance estimate | Manual distance can isolate pricing from mapping for an early slice, if approved |
| Czech ARES | Customer identity lookup | Not necessary for a minimal free-text customer form; directory scope is Q-10 |
| ABRA | Intended/current ERP data boundaries in broader app | Do not assume planned integrations work or rebuild the ERP; confirm ownership |
| Microsoft 365 / SharePoint / Gmail | Described as future/partial workflow integration in create-project UI | Do not treat placeholders as working integrations |
| Supplier spreadsheets and technical tables | Commercial/technical inputs for pricing | Obtain approved versions and permission to retain derived fixtures |

Sources:
[distance and fallback](../../old/public/app.js#L894-L915),
[ARES API](../../old/worker.js#L3548),
[email invite function](../../old/worker.js#L5984),
[project wizard integration descriptions](../../old/public/app.js#L21020-L21030),
[legacy data-ownership proposal](../../old/docs/zadani-projekty.md#L50-L94).

Older notes refer to R2 document storage, while the current schema includes
[document metadata and chunk tables](../../old/schema.sql#L701-L707).
The inspected Worker actually writes uploaded base64 content in 900,000-character
D1 chunks and reconstructs it on read
([upload and retrieval](../../old/worker.js#L4018-L4046)).
Verify deployed schema and content before planning migration, but do not design
an R2 export merely because an older requirements document says “R2.”

The original spreadsheet extractor is not reproducible as-is: it reads an
absolute uploaded `.xlsm` path and writes environment-specific paths
([input](../../old/export.py#L1-L3),
[output](../../old/export.py#L137-L139)).
The original macro-enabled workbook is not part of the inspected tracked
inventory. Four NEVA price/surcharge workbooks are present under `old/tests/data/`.
Do not run the exporter as a way to refresh the baseline.

## Convex migration constraints

**Proposed, not implemented:**

- Model project, quote revision, configuration, positions and price/rule
  revisions explicitly. Keep bounded groups of data together only when their
  size and access patterns justify it.
- Use indexes and pagination, not unbounded project/quote collection followed
  by filtering.
- Store PDF/source files in file storage with authorized access, not base64
  on the quote document.
- Preserve a legacy-ID mapping and human numbers independently of Convex IDs.
- Allocate project/quote numbers, enforce an idempotency key, write snapshots
  and link the selected quote using deliberately designed transactional steps.
  External file generation must handle partial failures and retries.
- Measure realistic large quotes before finalizing document boundaries and
  calculation placement. Realtime does not remove read/write/CPU limits.

The official [Convex limits](https://docs.convex.dev/production/state/limits.md)
consulted for this pass specify a 1 MiB document limit. The old
[four-million-character PDF/import checks](../../old/worker.js#L5062-L5063)
are not a safe new document-size budget.

## Migration evidence still needed

1. Whether migration is required for the first release or parallel new-project
   use is acceptable (Q-14).
2. Approved anonymized live catalogue/settings and several project/quote shapes.
3. Historical PDFs and the contract for unchanged historical totals.
4. Scale: largest position/import count, quote bytes, projects, active users.
5. Ownership and retention of customer data and generated documents.
6. Reconciliation, failure recovery, cutover and rollback criteria.

Until these are known, no production migration or cutover claim is justified.
