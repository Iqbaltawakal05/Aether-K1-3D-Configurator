# Aether K1 — 3D Mechanical Keyboard Configurator

Interactive 3D product configurator for the fictional **Aether K1** 75% mechanical keyboard. Built as a standalone web app with real-time material customization, exploded layer view, and part interaction.

![Aether K1 Preview](docs/preview.png)

## Features

- **3D Viewer** — Real-time WebGL rendering via Three.js / React Three Fiber
- **Live Customization** — Switch case color, keycap set, switch type, and plate material
- **Exploded View** — Animated layer separation showing PCB, plate, switches, and keycaps
- **Part Interaction** — Click/hover to select individual parts with emissive highlight
- **3D Annotations** — Optional floating labels for each component layer
- **Responsive Layout** — Desktop sidebar + mobile drawer configurator panel
- **Accessibility** — Keyboard navigation, ARIA labels, reduced-motion support, WebGL fallback
- **Performance** — Adaptive DPR, shadow optimization, lazy GLB loading

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| 3D Engine | Three.js r185 |
| React bindings | React Three Fiber (R3F) v8 |
| 3D helpers | Drei |
| State | Zustand |
| 3D Asset | Blender 5.2.1 LTS (procedural Python script → GLB) |

## Project Structure

```
src/
  components/
    ProductViewer.tsx     # Main 3D canvas + camera + lighting
    ConfiguratorPanel.tsx # Sidebar/drawer UI
    R3FScene.tsx          # R3F scene helpers
  hooks/
    useApplyConfig.ts     # Maps store state → Three.js material mutations
    useAdvancedInteraction.ts  # Exploded view + hover/selection highlight
  store/
    configuratorStore.ts  # Zustand store — config state + material presets
  utils/
    webglCheck.ts         # WebGL availability detection
scripts/
  generate_aether_k1_model.py  # Blender procedural keyboard generator
  export_glb.py                # Blender headless GLB export runner
public/
  assets/models/
    aether_k1.glb         # Procedurally generated 3D model
```

## Getting Started

### Prerequisites
- Node.js >= 18
- (Optional) Blender 5.x — only needed to regenerate the GLB model

### Development
```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Production Build
```bash
npm run build
npm run preview
```

### Regenerate 3D Model (requires Blender)
```bash
blender --background --python scripts/export_glb.py
```

### Lint
```bash
npm run lint
```

## Build Output

| File | Size | Gzip |
|---|---|---|
| vendor-three.js | 717 KB | 190 KB |
| vendor-r3f.js | 431 KB | 142 KB |
| index.js | 19 KB | 6 KB |
| aether_k1.glb | 288 KB | — |

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `Drag` | Orbit camera |
| `Scroll` | Zoom |
| `Click` part | Select + highlight |
| `Esc` | Clear selection |
| `Alt + R` | Reset to defaults |

## Asset License

The `aether_k1.glb` model is 100% procedurally generated via Blender Python script. No third-party CAD files or proprietary geometry. Licensed under CC0 1.0 / MIT. See [`public/assets/models/LICENSE.md`](public/assets/models/LICENSE.md).

## Notes

- Aether K1 is a fictional keyboard created for this demo project.
- This is **Project B** — standalone configurator. No backend, auth, or payment.
- PCFSoftShadowMap deprecation warnings in console are a known Three.js r185 issue with no functional impact.
