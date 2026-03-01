# electron-demo

Electron learning scaffold with a dual-track release strategy:

- `main` (modern): Electron `40.6.1`, auto-updater enabled.
- `legacy/electron22`: Electron `22.3.27`, updater disabled for compatibility.

## Stack

- Electron + electron-vite + React + TypeScript
- Routing: `react-router-dom`
- Async state: `@tanstack/react-query`
- Local state: `zustand`
- IPC payload validation: `zod`
- Unit test: `vitest`
- E2E smoke: `playwright`
- Packaging/Publish: `electron-builder` + GitHub Releases

## Compatibility Matrix

| Release line                 | Electron | Windows                   | Linux | macOS                   |
| ---------------------------- | -------- | ------------------------- | ----- | ----------------------- |
| modern (`main`)              | 40.6.1   | 10/11 (x86 + x64)         | x64   | x64 + arm64 + universal |
| legacy (`legacy/electron22`) | 22.3.27  | 7/8/8.1/10/11 (x86 + x64) | x64   | x64 + arm64 + universal |

## Quick Start

```bash
pnpm install
pnpm dev
```

## Dev / Test / Build Commands

```bash
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:e2e
pnpm dist:win
pnpm dist:linux
pnpm dist:mac
pnpm dist:mac:all
pnpm release
```

## IPC Contract

Renderer only talks through `window.desktop` (preload whitelist):

- `window.desktop.system.getInfo()`
- `window.desktop.updater.check()`
- `window.desktop.updater.download()`
- `window.desktop.updater.quitAndInstall()`
- `window.desktop.updater.onState(callback)`

Contracts are centralized in [`src/shared/ipc.ts`](./src/shared/ipc.ts).

## Release Workflows

- `.github/workflows/release-modern.yml` triggers on tags `v*`.
- `.github/workflows/release-legacy.yml` triggers on tags `legacy-v*` and builds from `legacy/electron22`.

Artifacts include release line marker in filename (`modern` or `legacy`) to avoid download confusion.

## Rollback Guide

1. Re-tag the previous stable tag (`vX.Y.Z` or `legacy-vX.Y.Z`) for quick redeploy.
2. If runtime regression is updater-related, set `DISABLE_APP_UPDATER=1` temporarily.
3. If platform-specific packaging breaks, use per-platform `dist:*` command locally to isolate.

## Signing / Notarization (placeholder)

The project keeps env placeholders in `.env.example` but does not enable signing in phase 1.
