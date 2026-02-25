# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server at http://localhost:8080 (with telemetry)
npm run dev-nolog    # Dev server without telemetry
npm run build        # Production build to dist/ (with telemetry)
npm run build-nolog  # Production build without telemetry
```

No test runner or linter is configured.

## Architecture

Phaser 3 + TypeScript + Vite game sandbox. The entry flow is:

`src/main.ts` → waits for DOM → calls `StartGame()` from `src/game/main.ts` → creates a `Phaser.Game` instance with a scene list.

### Scene pipeline

Scenes run sequentially: `Boot → Preloader → MainMenu → Game → GameOver`

- **Boot** – loads minimal assets (background) needed by the preloader
- **Preloader** – shows a loading bar, loads remaining assets
- **MainMenu / Game / GameOver** – gameplay scenes; transition on click

New scenes must be added to the scene array in `src/game/main.ts`.

### Vite build split

`vite/config.dev.mjs` and `vite/config.prod.mjs` are separate configs. Phaser is manually chunked to keep it in its own bundle. The prod config uses Terser with 2 compression passes.

### Assets

Static assets live in `public/assets/`. Import them in TypeScript via string paths (e.g. `'assets/logo.png'`); Vite serves them directly.

### Game config

Defined in `src/game/main.ts`: 1024×768, auto renderer (WebGL → Canvas fallback), mounts into `#game-container`.

### log.js

Sends anonymous telemetry (template name, Phaser version, build type) to an external server. Use `-nolog` script variants or delete `log.js` to disable.
