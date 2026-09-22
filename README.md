# CROFT

Croft is a multi-platform productivity platform. This repository currently contains
the monorepo foundation, shared TypeScript configuration, and a NestJS API with
process liveness checking. Database, authentication, and product modules are not
implemented. Official brand assets have not been added.

## Toolchain

- Node.js 24 LTS (supported runtime: Node 24.x)
- pnpm 12.5.1, pinned in `package.json`
- Turborepo for workspace task orchestration
- One Git repository for the entire monorepo

With Node 24 installed, install the pinned package manager if needed:

```sh
npm install --global pnpm@12.5.1
pnpm install
```

Commit `pnpm-lock.yaml` with dependency changes. For reproducible installs, use
`pnpm install --frozen-lockfile`.

## Repository layout

```text
apps/api/                NestJS API foundation
packages/config/         Shared TypeScript configuration
assets/brand/            Brand source/reference assets
assets/vendor/           Third-party assets
docs/architecture/      Architecture documentation
docs/decisions/         Architecture decisions
docs/licenses/          Third-party notices and license records
infrastructure/          Future infrastructure configuration
scripts/                 Future repository tooling
```

Workspace discovery includes `apps/*` and `packages/*`. `@croft/api` consumes
`@croft/config` through a workspace dependency. `.gitkeep` files preserve the
remaining intentionally empty directories. No nested repositories are needed.

## Commands

```sh
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
```

These root scripts run the API's matching tasks through Turborepo. `pnpm test` runs
unit tests; run API E2E tests separately as shown below. The configuration package
has no build step or runtime code.

Development tasks are persistent and uncached. Builds run dependency builds first
and cache `dist/` and `build/`; tests cache logs only. Lint, typecheck, and test
wait for dependency builds. Refine task dependencies, outputs, and environment
inputs when real packages are introduced.

## API

```sh
pnpm --filter @croft/api dev
# Or start workspace development tasks:
pnpm dev
```

`GET http://localhost:3000/health` returns HTTP 200 with `{"status":"ok"}`.
This checks API-process liveness only, with no dependency or database checks.
The API uses Nest's default Express adapter and listens on `0.0.0.0` for local
and deployment use. Set `PORT` to an integer from 1 to 65535 to override 3000;
Turbo passes it through to development tasks. For example, in PowerShell:

```powershell
$env:PORT = '3001'
pnpm --filter @croft/api dev
```

`apps/api/.env.example` documents the supported setting; `.env` is not loaded
automatically. Set environment variables in your shell or deployment environment.
Stop development with Ctrl+C; Nest shutdown hooks are enabled. On Windows, prefer
the filtered command: Turbo's global `pnpm.cmd` wrapper may require a second
Ctrl+C after the API has exited.

```sh
pnpm --filter @croft/api test:e2e
pnpm --filter @croft/api build
pnpm --filter @croft/api start:prod
```

Production starts compiled `dist/main.js`. `start` builds and runs once; `dev`
watches sources. NestJS 12 uses ESM; Jest runs with its documented
`--experimental-vm-modules` flag for ESM tests. This flag is test-only.

## Shared TypeScript configuration

`@croft/config` exports JSON presets with no runtime code or build step:

- `@croft/config/tsconfig/base.json`: strict checks and an ES2022 baseline.
- `@croft/config/tsconfig/node.json`: ES2023 libraries without DOM globals,
  NodeNext modules/resolution, and legacy decorator metadata for NestJS consumers.
- `@croft/config/tsconfig/react.json`: browser libraries, bundler resolution,
  React JSX, isolated modules, and type checking without emitting JavaScript.

TypeScript 6.0.3 is pinned at the root, matching the current NestJS CLI's 6.0.x
compiler line. Reassess the compiler version when introducing application tooling.

Future consumers should declare `"@croft/config": "workspace:*"` in their
`devDependencies`, then extend the appropriate exported path, for example:

```json
{
  "extends": "@croft/config/tsconfig/react.json",
  "include": ["src"]
}
```

Consumers own their source/output paths, environment types, and framework
packages. Node consumers must choose their package's `type` (CommonJS or ESM),
set an `outDir` for builds, and add Node types when needed. React consumers add
React types and Vite client types with the actual application. The base preset
leaves module resolution and emit policy to consumers; the Node preset allows
emit, while the browser preset delegates output to the bundler.

There is no root `tsconfig.json`: the root has no TypeScript sources or tooling
code to compile. The API inherits the Node preset without relaxing strict checks.
It adds `isolatedModules` for ts-jest's NodeNext transformation, its source/output
paths, and Node types. The production build excludes test files.

## Brand

Croft's primary brand color is **#F14936**. The official logo will be supplied
manually. Its future canonical location is
`packages/brand/assets/croft-mark-primary.svg`, or
`packages/brand/assets/croft-mark-primary.png` if the supplied source is PNG.
Neither the brand package nor a logo is created at this stage.

Record third-party assets and required notices in
[THIRD_PARTY_NOTICES.md](docs/licenses/THIRD_PARTY_NOTICES.md) when they are added.

## Local configuration

Local `.env` files are ignored. Safe `.env.example` and `.env.*.example` templates
are tracked; never put credentials in them.
