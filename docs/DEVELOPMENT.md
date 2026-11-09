# Developing and checking the rewrite

The technical foundation is runnable. Authentication, projects, catalogue
editing and business pricing are **not implemented**. The landing page makes
this explicit; it is not an approved quotation tool.

See [progress](PROGRESS.md) for the current milestone and
[implementation readiness](IMPLEMENTATION-READINESS.md) for business blockers.

## Requirements and installation

- Node `24.22.2`, recorded in `.node-version`. Node runs the TypeScript/Vite/test
  tools; Convex functions target the Convex runtime, not Bun.
- Bun `1.4.4`, recorded in `package.json`.
- No Convex account, auth-provider credentials, legacy checkout or production
  data is required for the frontend and automated test suite.

```sh
bun install --frozen-lockfile
bun run dev
```

Open the local URL printed by Vite. The frontend uses React, Mantine and a
light/dark theme. Mantine's form package is installed as `@mantine/form`; no
business form has been implemented merely to demonstrate the dependency.

The initial UI is an English development-status screen, not a decision about
the final business application's language or navigation.

## Repository boundaries

| Path | Responsibility |
| --- | --- |
| [`src/app/`](../src/app/) | Application shell, providers, theme and public backend configuration |
| [`src/domain/`](../src/domain/README.md) | Shared deterministic domain boundary; pricing implementation awaits approved examples |
| [`convex/`](../convex/) | Empty business schema, non-sensitive health query and provider-neutral identity helper |
| [`convex/_generated/`](../convex/_generated/) | Actual Convex-generated bindings; version these, do not hand-edit |
| [`tests/`](../tests/) | Test setup, render helper and isolated browser tests |
| [CI workflow](../.github/workflows/check.yml#L1) | Frozen install, type/lint/test/build checks and Chromium browser tests |
| [`old/`](../old) | Read-only legacy Git submodule, not an application dependency or part of the new test suite |

There are deliberately no project/customer tables, product seeds, price
formulas or auth-provider integration yet.

## Public backend configuration

With no `VITE_CONVEX_URL`, the app runs in standalone foundation mode. It does
not fall back to a local admin or load fake customer data.

The optional setting is documented in `.env.example`. Set it only to a
deployment URL for an intentionally selected **development** environment:

- Local backend: an HTTP loopback URL printed by the Convex CLI.
- Cloud development: its `.convex.cloud` URL, after account/region setup is
  explicitly agreed.
- Not a `.convex.site` HTTP Actions URL.

`VITE_*` values are embedded in browser bundles and **must not contain secrets**.
The URL validator rejects credentials, paths, queries and fragments and does
not echo invalid input into the UI.

A configured URL is not a healthy connection, authenticated user or authorization
grant. The current frontend can mount the Convex provider, but does not issue
business queries.

## Optional anonymous local backend

Standard generated bindings are already in the repository, so installation,
typechecking and tests do not require a backend or code generation.

To work on Convex functions in an isolated local development checkout, use
the CLI's anonymous mode. The following POSIX-shell command keeps CLI home,
download cache and local data inside the worktree and clears inherited
deployment credentials:

```sh
mkdir -p .cache/convex-home
HOME="$PWD/.cache/convex-home" \
XDG_CACHE_HOME="$PWD/.cache" \
CONVEX_AGENT_MODE=anonymous \
CONVEX_DEPLOYMENT= \
CONVEX_DEPLOY_KEY= \
CONVEX_URL= \
DO_NOT_TRACK=1 \
bunx convex dev
```

This intentionally configures an anonymous local deployment and updates the
ignored `.env.local`; review before using it in a checkout already linked to
a cloud environment. The first run downloads the official backend binary.
No company account or cloud deployment is created.

For a one-shot local initialization and actual-runtime health check, append:

```sh
--once --run health:check
```

Use the same environment prefix. This returns `{ status: "ok" }` and exits.
It does not test login or business persistence.

`bun run convex:codegen` uses the configured backend; it is not an offline
command. In this foundation, code generation was performed only against the
anonymous local backend, with the isolated CLI home above. Review the selected
environment before running CLI commands, and never point automated tests at
production. Local `.env.local`, `.convex/` and `.cache/` are ignored.

The [official local-agent workflow](https://docs.convex.dev/cli/agent-mode.md)
describes anonymous development. Its mode is currently labelled beta.

## Checks

```sh
bun run typecheck
bun run lint
bun run test
bun run build
```

`bun run check` runs these four in that order. `bun run build` is the Vite
production build, while TypeScript is checked explicitly by `typecheck`.

For Chromium E2E, install browsers inside this worktree:

```sh
PLAYWRIGHT_BROWSERS_PATH="$PWD/.cache/ms-playwright" bun run test:e2e:install
bun run test:e2e
```

The browser config defaults to that same workspace-local directory. CI uses
Playwright's `--with-deps chromium` installation on Ubuntu.

For iterative unit work, use `bun run test:watch`. `bun run format` applies
Biome's safe formatting/import/lint fixes only to the allowlisted rewrite
files. Legacy, generated bindings and dependency trees are outside that scope.

### Test isolation and what the tests prove

- **Vitest unit project:** public backend URL configuration, including missing,
  invalid and HTTP Actions URLs.
- **Vitest UI project:** real Mantine providers, honest feature/configuration
  states and theme interaction in jsdom.
- **Vitest Convex project:** registered health query and identity helper in
  `convex-test` with synthetic identities and no remote deployment.
- Unit/backend/UI test setup replaces `fetch` with a throwing mock.
- **Playwright:** production build/preview on loopback, desktop and mobile
  Chromium, startup, keyboard theme toggle/reload and no horizontal overflow.
  Every test blocks/reports non-local requests, blocks WebSockets and fails
  on uncaught browser errors.
- Playwright builds with `VITE_CONVEX_URL` explicitly empty, overriding any
  local environment file. Its smoke tests do not connect to a real backend.

The identity helper only requires verified identity from the backend context.
It is **not** a role/project permission system or a completed login integration.
The public health query intentionally returns no customer/business information.
There is no pricing correctness claim until the owner approves fixtures.

## Current validation evidence

Recorded on 2026-11-09, macOS arm64, Node `24.22.2`, Bun `1.4.4`:

- Frozen dependency install, strict TypeScript, Biome, Vitest and Vite build.
- Desktop/mobile Chromium E2E against the production build.
- Anonymous local Convex initialization, real-runtime health query and codegen.
- Clean-checkout verification without `old/`, `.env.local` or `.convex/`.
- Manual review of desktop/mobile screenshots of the standalone build.

Exact final results and any unrun checks are recorded in [progress](PROGRESS.md).
The GitHub Actions workflow is configured, but has not been executed on GitHub.
Only Chromium has been exercised, not Firefox/WebKit or real-device browsers.
The separate [legacy baseline](legacy/validation.md) was not rerun for this
scaffold.
