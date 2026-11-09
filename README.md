# MHST projects and configurator rewrite

A staged rewrite of the projects, product configuration, and quotation part of
the legacy MHST application. The technical foundation runs locally; business
features follow validated requirements and pricing examples.

**Start with the [knowledge base](docs/README.md) and
[current progress](docs/PROGRESS.md).** The first discovery pass is documented;
business-owner validation has not happened yet.

## Agreed direction

- React and TypeScript
- Mantine and its supporting packages, including `@mantine/form`
- Convex
- Bun for package management, Vite for bundling
- Vitest for unit tests, Playwright for end-to-end tests
- Biome for linting and formatting

The initial journey is login → project list/create → configure products in a
project → calculate prices. This is not a rewrite of the entire ERP.
See [scope and stack](docs/decisions/0001-rewrite-boundary-and-stack.md).

## Repository

| Path | Purpose |
| --- | --- |
| [`src/`](src/) | React/Mantine shell and the shared domain boundary |
| [`convex/`](convex/) | Convex foundation, generated bindings and isolated backend tests |
| [`tests/`](tests/) | UI test setup and Playwright browser smoke tests |
| [`old/`](old) | Read-only legacy Git submodule, pinned by the parent repository |
| [`docs/`](docs/README.md) | Findings, business questions, scenarios, architecture proposals, and progress |
| [`AGENTS.md`](AGENTS.md) | Continuity and engineering instructions for contributors and coding agents |

### Obtain the legacy source

```sh
git submodule update --init -- old
```

Access to the private legacy repository is required. Use the recorded revision;
do not update the submodule to the latest branch as part of routine discovery.
Some workspace tools do not index nested Git repositories; inspect `old/` from
the terminal when necessary.

The analyzed revision is `118bad3b390bf2785be0c16c8fe366fb3ecd2003`
(application version `1.256.2`). Its dependency directory is tracked in that
legacy repository; that is not a pattern for the rewrite.

## What can be run today?

With Node `24.22.2` and Bun `1.4.4`:

```sh
bun install --frozen-lockfile
bun run dev
```

No credentials or legacy checkout is needed for the standalone frontend.
**Login, project workflows, catalogue editing and pricing are not implemented
yet.** The UI labels these gaps rather than using fake business data.

Validate the foundation:

```sh
bun run check
PLAYWRIGHT_BROWSERS_PATH="$PWD/.cache/ms-playwright" bun run test:e2e:install
bun run test:e2e
```

See [development setup](docs/DEVELOPMENT.md) for optional local Convex,
environment variables, test isolation and CI. Do not run legacy deployment,
data-export or migration commands against production.
