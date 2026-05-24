# AGENTS.md

## Project Snapshot
- Stack: `Vite` + `React 18` + `@react-three/fiber` + `@react-three/drei` + `three` + `zustand` + `tailwindcss`.
- Mixed JS/TS codebase (no dedicated lint/typecheck/test scripts in `package.json`).
- Main scene app with 3D room, character movement, painting modal, and performance auto-scaling.

## Fast Commands
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`

## Important Repo Map
- App entry:
  - `src/main.jsx`
  - `src/App.jsx`
  - `src/components/Experience.jsx`
- Scene/room:
  - `src/components/Room/*`
  - `src/constances/constances.jsx`
- Character + movement:
  - `src/components/Taha/TahaContainer.jsx`
  - `src/stores/useArrowStore.js`
  - `src/hooks/useArrowControls.js`
- Camera:
  - `src/components/Camera/CameraControl.jsx`
  - `src/stores/useCameraControlStore.js`
- UI shell + modals:
  - `src/components/UI/Interface.jsx`
  - `src/components/UI/Modal.jsx`
  - `src/components/UI/PaintingModal.jsx`
- Painting feature:
  - `src/components/UI/PaintingCanvas.jsx`
  - `src/components/UI/ColorAndBrushSelector.jsx`
  - `src/hooks/useCanvasEvents.js`
  - `src/stores/usePaintingStore.js`
- Performance:
  - `src/performance/HandlePerformance.tsx`
  - `src/performance/WebGLPerformanceManager.tsx`
  - `src/stores/useGraphicsSettings.js`

## Current Behavior Defaults (Do Not Accidentally Regress)
- Painting defaults:
  - Color is white (`#ffffff`) in `src/components/UI/PaintingCanvas.jsx`.
  - Brush type is `spray` in `src/components/UI/PaintingCanvas.jsx`.
- `Thing` movement and deformation live in `src/components/Stuff/Thing.jsx`.

## Code Style + Editing Rules
- Preserve existing per-file style (some files use semicolons heavily, some less so).
- Keep changes surgical; avoid broad reformatting.
- Follow existing naming/structure patterns in nearby files.
- Prefer minimal diffs over rewrites.

## State Management Conventions (Zustand)
- Existing stores often guard updates to avoid unnecessary rerenders (`set((s) => condition ? s : next)`).
- Keep this pattern when adding/updating store actions.
- Use focused selectors in components to reduce rerenders.

## 3D / `useFrame` Performance Rules
- Avoid allocations inside `useFrame` loops.
- Reuse vectors/arrays/refs and precompute reusable values.
- For animated `BufferAttribute` updates, set `DynamicDrawUsage` and mark `needsUpdate`.
- Dispose GPU resources (`geometry`, `material`, cloned textures) in cleanup effects.

## Painting System Notes
- `useCanvasEvents` is the drawing engine for all brush types.
- Persisting painting:
  - frontend store fetches/saves via `src/stores/usePaintingStore.js`
  - backend endpoints: `server/load_painting.php`, `server/save_painting.php`

## Camera / Collision Notes
- `Walls` creates invisible collider meshes and passes them to `CameraControl`.
- Room dimensions are centered around `wallSize`/`wallHeight` from constants.
- Character movement also uses hard room/object bounds in `TahaContainer`.

## Validation Strategy
- No test suite is configured; validate with:
  - targeted code review for touched files
  - `npm run build` when possible
  - manual interaction checks for UX-heavy changes (movement, painting, camera)

## Known Environment Gotcha
- If build fails with missing optional platform packages (e.g. Rollup/esbuild binaries), reinstall dependencies on the current OS/runtime:
  - remove `node_modules`
  - run `npm install` again in the same environment used for build/run

## Safety / Sensitive Areas
- `server/*.php` currently contains production DB credentials and write endpoints.
- Do not expose, rotate, or refactor backend credential handling unless explicitly requested.
- Avoid accidental edits to `public/models/*` and large static assets unless required.

## Recommended Task Playbooks
- New 3D object behavior:
  1. Start at `Experience.jsx` to find composition path.
  2. Edit object component under `src/components/Stuff/*`.
  3. Keep motion math allocation-free in `useFrame`.
  4. Sanity-check interactions with room bounds/camera.
- Painting changes:
  1. Update defaults/UI in `PaintingCanvas` + `ColorAndBrushSelector`.
  2. Update brush behavior in `useCanvasEvents`.
  3. Verify save/load path via `usePaintingStore`.
- Performance regressions:
  1. Check `HandlePerformance` + `useGraphicsSettings`.
  2. Inspect heavy per-frame loops for allocations.
  3. Validate quality switching behavior in UI (`QualityTag`).
