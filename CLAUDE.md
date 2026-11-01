# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

The imported AGENTS.md is the primary guide (commands, repo map, conventions, safety rules). The notes below add the cross-file architecture it doesn't spell out.

## Commands
- `npm run dev` / `npm run build` / `npm run preview` — no lint, typecheck, or test scripts exist. `npm run build` is the only automated check.
- Vite plugins: `vite-plugin-glsl` (so `.glsl` files can be imported, e.g. `src/components/Lights/Fireplace/noise.glsl`) and `vite-plugin-compression2` (emits compressed assets in `dist/`).

## Architecture

### Boot / loading flow
`App.jsx` mounts one R3F `<Canvas>` containing `Experience`, `HandlePerformance`, and `ProgressTracker`, with the DOM `Interface` overlay beside it. `useLoadingManager` (in `src/components/Loader/`) drives the `LoadingOverlay`: it fakes progress until the real loader reports, shows a "taking longer" message after 25s, and fades content in. When loading finishes, `App` sets the initial camera look-at (`cameraLookAtConst`) and `useAppStatusStore.isAppLoaded`. A `VisibilityRenderControl` sets `frameloop` to `"never"` while the tab is hidden.

Global hooks run once in `App`: `useArrowControls` (keyboard → `useArrowStore`) and `usePaintingInit` (loads the saved painting).

### Scene composition
`Experience.jsx` holds the colliders state: `Walls` builds invisible collider meshes and reports them through `onCollidersReady`, and they're passed to `CameraControl` for camera collision. Furniture and props are grouped under `Desk/TableSetup`, `Stuff/CatCorner`, and `StuffOnWall/SuffOnWall` (the filename really is spelled that way). Models are GLB files in `public/models/` loaded with `useGLTF(path, "/draco/")` plus `useGLTF.preload`; the Draco decoder is served from `public/draco/`.

### Cross-component state (Zustand stores in `src/stores/`)
Components talk to each other through stores, not props:
- `useCameraControlStore` — camera look-at target and modes like `chessMode`.
- `useTourStore` — guided tour (`GuidedTour.jsx`). While `active` is true, `TahaContainer` changes character behavior, so tour changes usually touch both files.
- `useGraphicsSettings` — quality tier (`high` / `medium` / `low` / `ultra-low`, each mapped to a DPR preset) plus a staged `highQualityStage` used for gradual upgrades. Many scene components read `quality` to gate expensive features (lights, fire, birds, outside, monitor, mug, keyboard).
- `useArrowStore`, `useCharacterAnimationsStore`, `usePaintingStore`, `useAppStatusStore`.

Outside React (e.g. inside `useFrame`), read stores with `useStore.getState()` so the component doesn't subscribe and rerender.

### Adaptive quality
`HandlePerformance.tsx` combines drei's `PerformanceMonitor` and `useRecalculateDPR`. It drops quality when FPS falls and can lock low mode for the session. Downgrades are not persisted, and only `high`/`medium` are read back from `localStorage`, so one bad session can't pin a device to low. A `SustainedHighQuality` sampler upgrades `medium` → high only after about 12s of ≥55 FPS, with a cooldown. The initial tier comes from device detection in `useGraphicsSettings` (memory, cores, mobile UA). Any new expensive effect should respect `quality`.

### Lighting
- Every light that `MeshStandardMaterial` sees adds per-pixel cost to every lit material, and adding or removing a light recompiles all of them (a one-off stutter). So gate lights by mounting them, not with `intensity={0}`. A zero-intensity light still costs.
- The green glow along the top of the walls is baked into the wall shader (`bakeStripLight` in `src/components/Room/Wall.jsx`). It's a port of three's RectAreaLight diffuse term. Don't re-add the four wall RectAreaLights.
- The only remaining RectAreaLight is the monitor glow in `Monitor2.jsx`. It lights the moving character, so it can't be baked.

### Painting persistence
`usePaintingStore` calls the production URLs `https://taha-shajarian.ir/server/{load,save}_painting.php` directly, so saving from local dev writes to the live site. `usePaintingInit` loads the painting on start, then refreshes it in the background every minute and whenever the tab becomes visible again. Background refreshes are skipped while the paint modal is open and for 10s after a local edit, so they never overwrite unsaved strokes.

The PHP endpoints read credentials from `server/config.php`, which is gitignored and must be uploaded alongside them (template: `server/config.example.php`). `save_painting.php` caps payload size and image dimensions. Keep those limits in sync with `CANVAS_WIDTH`/`CANVAS_HEIGHT` in `PaintingCanvas.jsx`.

## Repo notes
- `.github/agents/threejs-room-maintainer.agent.md` restates AGENTS.md as an agent persona; no extra rules.
- Dead components and orphaned assets were removed (Nov 2026). Before adding a model or texture, check that it's actually referenced from the import chain starting at `src/main.jsx`.
- The link-preview tags in `index.html` point at `public/og-image.jpg`.
- `*.log` files and `dist/` in the root are gitignored local artifacts.
