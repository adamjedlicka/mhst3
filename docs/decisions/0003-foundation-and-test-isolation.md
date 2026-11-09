# ADR-0003 — Technical foundation and isolated validation

- **Status:** accepted engineering decision, implemented
- **Recorded:** 2026-11-09
- **Authority:** requester approved proceeding after the readiness discussion;
  business decisions are not implied

## Context

The stack and catalogue direction are selected, but auth provider, access
policy, initial product and pricing examples are not. We can implement a
runnable foundation without inventing those business requirements.

## Decision

- Use one root Bun package, React/Vite app and strict TypeScript checks for
  frontend, Convex and test/tool code. No monorepo or extra application framework.
- Pin direct dependency versions and Bun/Node versions, and version the Bun
  lockfile. The tested baseline uses TypeScript 5.9.3 rather than upgrading the
  compiler major merely because a newer one is available.
- Use Mantine providers/theme and install the requested `@mantine/form` package.
  No fake project/login/pricing form is part of this foundation.
- Keep business schema empty until its first scenarios are agreed. Expose only
  a non-sensitive public health query and a provider-neutral identity helper.
- Use actual SDK-generated Convex bindings, generated against an anonymous
  local backend, rather than hand-written placeholders or a company cloud
  deployment. Version generated bindings so clean installs/tests work offline
  from any backend.
- Use separate Vitest projects for Node unit tests, jsdom UI tests and the
  Convex Edge-runtime mock. Block outbound fetches in all three.
- Run Playwright against the production frontend build, with the backend URL
  forced empty and network restrictions applied to every test.
- Use Biome for general lint/format and explicit allowlists excluding `old/`
  and generated/vendor trees. Supplemental Convex-specific lint rules remain
  a separate decision; they are not falsely claimed as provided by Biome.
- Configure a read-only-permission CI workflow with pinned action revisions,
  frozen dependency install and no private legacy-submodule checkout or secrets.

## Alternatives considered

| Alternative | Why not selected |
| --- | --- |
| Provision a cloud backend and select an auth provider immediately | Would involve account/region/access decisions still open |
| Hand-write generated Convex bindings or use untyped mock API references | Avoids one local initialization but undermines type safety and standard tooling |
| Require backend credentials/codegen on every install or CI run | Adds unnecessary external state and risks using the wrong deployment |
| Seed “representative” products and prices to make a working demo | Would turn assumptions into apparent requirements |
| Run browser tests against Vite dev or an existing deployment | Does not verify the shipped bundle and may contact unintended services |

## Consequences

The app starts without credentials and states what is missing. A configured
backend URL is not represented as successful authentication or connectivity.
Local development/cache/credentials and browser downloads stay ignored; no
secrets are versioned.

This completes BUILD-01, not login, project persistence, catalogue authoring or
pricing. `convex-test` remains a mock, so the one-shot local health check is
additional evidence, not a substitute for future real-backend business tests.
See [development setup](../DEVELOPMENT.md) and [progress](../PROGRESS.md).
