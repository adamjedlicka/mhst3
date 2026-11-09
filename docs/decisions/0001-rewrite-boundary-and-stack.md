# ADR-0001 — Rewrite boundary and technology stack

- **Status:** accepted as requester constraints; detailed release scope remains open
- **Recorded:** 2026-11-09
- **Authority:** initial request from adamjedlicka

## Context

The legacy application contains a broad ERP and a business-heavy product
configurator. The requester wants an engineered replacement of the
projects/configurator part and expects frequent business-owner validation
because the rules are not yet understood.

## Decision

Start with discovery and a durable, Git-versioned knowledge base. The intended
initial user journey is:

```text
Login → project list/create → configuration within a project → calculated price
```

Use:

| Concern | Chosen technology |
| --- | --- |
| UI | React |
| Language | TypeScript |
| Components and supporting UI libraries | Mantine |
| Forms | `@mantine/form` (the official package name is singular) |
| Backend and persistence | Convex |
| Package manager | Bun |
| Frontend bundler | Vite |
| Unit tests | Vitest |
| End-to-end tests | Playwright |
| General linting/formatting | Biome |

Keep the legacy source available as a pinned, read-only reference.
Do not implement or migrate the entire ERP by default.

## Consequences

- Record observed behavior separately from approved requirements.
- Record progress, questions, worked examples, decisions and meeting outcomes
  in this repository so later sessions do not depend on chat memory.
- Use the requested library documentation as the starting point:
  [Mantine](https://mantine.dev/llms.txt) and
  [Convex](https://docs.convex.dev/llms.txt).
- Do not pick package versions until scaffolding; then pin/lock and validate
  the selected compatible versions.
- Bun as package manager does not imply replacing Vitest with `bun test` or
  running Convex server code on the Bun runtime.

## Not decided here

- Auth provider, MFA/onboarding policy, access matrix.
- Product families, authoritative pricing inputs and business formulas.
- Whether imports, multiple bidding customers, official PDFs, approvals and
  historical migration belong in the first usable release.
- Money/quantity precision, routing, exact schema, tenancy or deployment region.
- Complementary Convex-specific lint rules beyond Biome.

The [architecture](../architecture/README.md) is a proposal, not an extension
of this accepted decision. Alternatives within the selected stack should be
recorded as subsequent ADRs when actually decided.
