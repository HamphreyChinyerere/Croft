# CROFT

Croft is a multi-platform productivity platform. This repository currently contains
the monorepo foundation and shared TypeScript configuration. No applications,
product features, or official brand assets have been added yet.

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
apps/                    Future applications
packages/config/         Shared TypeScript configuration
assets/brand/            Brand source/reference assets
assets/vendor/           Third-party assets
docs/architecture/      Architecture documentation
docs/decisions/         Architecture decisions
docs/licenses/          Third-party notices and license records
infrastructure/          Future infrastructure configuration
scripts/                 Future repository tooling
```

Workspace discovery includes `apps/*` and `packages/*`. The configuration package
is the only workspace package; `apps/` remains empty. `.gitkeep` files preserve
intentionally empty directories in Git. No nested repositories are needed.

## Commands

```sh
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
```

These root scripts delegate to matching scripts in workspace packages. At this
foundation stage, they have no package tasks to run. A successful invocation does
not mean application builds, linting, type checking, or tests have been performed.

Development tasks are persistent and uncached. Builds run dependency builds first
and cache `dist/` and `build/`; tests can cache `coverage/`. Lint, typecheck, and test
wait for dependency builds. Refine task dependencies, outputs, and environment
inputs when real packages are introduced.

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
code to compile. Root task scripts still have no executable package tasks;
configuration validation is not an application build or test.

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
