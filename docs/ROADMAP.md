# ROADMAP.md — Project B

## Phase 0 — Setup
- GitHub repo + Git.
- `main` / `develop`.
- React + TypeScript + Vite.
- Linter.
- README.
- Verify dev + production build.
- Initial commit.

## Phase 1 — 3D Fundamentals
- X/Y/Z and transforms.
- Scene, Camera, Renderer.
- Geometry, Material, Mesh.
- Lighting and render loop.
- Small primitive experiment.

## Phase 2 — Three.js
- Raw Three.js playground.
- PerspectiveCamera + WebGLRenderer.
- Materials/lights.
- Animation loop.
- Resize + DPR.

## Phase 3 — React Three Fiber
- Canvas.
- R3F scene.
- `useFrame`.
- Drei.
- OrbitControls.
- Rebuild previous experiment.

## Phase 4 — Blender / Asset Pipeline
- Prepare legally usable keyboard model.
- Clean hierarchy/names.
- Separate Case/Keycaps/Switches/Plate/PCB as needed.
- Materials/transforms.
- Optimize.
- Export GLB.
- Record asset license/source.

## Phase 5 — Product Viewer
- Load GLB.
- Camera framing.
- Orbit controls.
- Lighting/environment.
- Loading/error state.
- Mouse + touch.

## Phase 6 — Configurator Architecture
- Typed configuration state.
- Inspect model nodes/materials.
- Map UI state → 3D changes.
- Defaults/reset.

## Phase 7 — Core Configurator
- Case variants.
- Keycap variants.
- Switch state.
- Lighting toggle.
- Reset.
- Build summary.

## Phase 8 — Advanced Interaction
As useful:
- Part selection.
- Hover highlight.
- Camera focus.
- Labels.
- Exploded view.
- Auto rotate/reset camera.

## Phase 9 — UI/UX
- Desktop/mobile configurator layout.
- Accessible selectors.
- Clear selected states.
- Loading/error feedback.
- Touch-friendly controls.

## Phase 10 — Performance
Measure and optimize:
- GLB/texture size.
- Geometry.
- Materials/draw calls.
- Shadows.
- DPR.
- Rerenders.
- FPS/memory.
- Lazy loading/compression where justified.

## Phase 11 — Responsive & Accessibility
- Mobile/tablet/desktop.
- Keyboard/focus.
- Text labels.
- Reduced motion.
- WebGL/error fallback.

## Phase 12 — Testing & QA
- Functional configuration tests.
- Camera/interaction.
- 3D visual issues.
- Touch.
- Console/build/assets.
- Chrome/Edge/Firefox; Safari if available.
- CRITICAL=0, HIGH=0 before release.

## Phase 13 — Release
- Production build.
- Deploy + production test.
- GitHub/README.
- Screenshots/demo.
- Asset/license docs.
- Case study.
- `v1.0.0`.

After completion: Project C gets a separate plan. Do not merge A + B automatically.
