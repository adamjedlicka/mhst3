# Working on the MHST rewrite

## Start here

1. Read `docs/README.md` and `docs/PROGRESS.md`.
2. Read the relevant legacy finding and business questions before implementing
   a feature. Follow the source links; legacy comments and notes can be stale.
3. Check `docs/decisions/` for accepted decisions. Architecture recommendations
   are not automatically accepted product requirements.

## Boundaries

- Treat `old/` as a read-only reference. Do not refactor it, regenerate its data,
  install over its tracked dependencies, update its Git revision, or deploy it
  unless explicitly requested.
- Build only the projects/configurator slice. Adjacent ERP modules are not in
  scope merely because the old UI links to them.
- The chosen stack is in
  `docs/decisions/0001-rewrite-boundary-and-stack.md`. Mantine's forms package is
  `@mantine/form`, singular.
- The technical scaffold is implemented; login, project workflows, catalogue
  editing and pricing still require their business decisions/examples. Read
  `docs/DEVELOPMENT.md` and consult the progress board before extending them.
- Do not copy production/customer data, credentials, session cookies, password
  verifiers, MFA secrets, or private database exports into documentation or
  fixtures. Use synthetic or explicitly approved anonymized examples.
- Do not contact production services during tests. Legacy scripts must be
  inspected for external effects before running.

## Git workflow during prototyping

- Work on `main` directly. The requester has chosen not to use feature branches
  during prototyping; do not create one unless asked.
- A Delta-managed checkout is separate from the original project checkout even
  when both branches are named `main`. At handoff, state where changes exist,
  whether they are committed, and whether the original checkout was updated.
- When synchronizing the original checkout is authorized, check for local work
  and divergent history first, then fast-forward only. Stop rather than
  overwrite files, reset work or force an update.
- Committing or synchronizing locally does not authorize a push to GitHub or
  another shared remote. Publish only when explicitly requested.

## Business rules and implementation

- Distinguish observed code, characterized behavior, business-approved rules,
  proposals, and unknowns using the knowledge-base conventions.
- Never silently reinterpret `marže` as markup or margin. Record the denominator,
  units, rounding, input versions, and a worked example.
- Keep pricing/normalization/validation in deterministic TypeScript functions,
  independent of React and persistence. React previews and authoritative backend
  calculations should reuse the same domain implementation.
- Enforce authorization, input validation, approval requirements, and issued
  quote immutability on the backend, not just in the UI.
- Prefer stable IDs and explicit draft/revision boundaries to names, array
  indexes, and a global mutable application state.
- A passing legacy regression is evidence of compatibility, not proof of
  commercial correctness.

## Leave a useful handoff

- Update `docs/PROGRESS.md` with completed work, evidence, blockers, and the next
  concrete task.
- Update the canonical finding when knowledge changes; link it rather than
  copying the rule into several documents.
- Record unresolved business questions in `docs/business/questions.md`.
- Record owner feedback using `docs/business/meetings/README.md`, including
  who decided, examples, affected question/scenario IDs, and implementation
  consequences. Do not invent approvals.
- Record consequential engineering decisions in `docs/decisions/`, including
  status and alternatives. Supersede decisions rather than erasing history.
- Name the actual validation commands and their results. Separate skipped or
  unrun checks from passes.
