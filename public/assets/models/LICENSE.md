# Asset License & Source — Aether K1 GLB

## Model

- **File**: `aether_k1.glb`
- **Format**: glTF 2.0 Binary
- **Generator**: Procedural Python script via Blender 5.2.1 LTS headless
- **Script**: `scripts/generate_aether_k1_model.py`
- **License**: CC0 1.0 Universal / MIT

## Mesh Hierarchy

| Object | Description |
|---|---|
| `Case_Top` | Outer shell / bezel (metallic navy) |
| `Case_Top_Bezel` | Inner lip — simulates keycap well opening |
| `Case_Bottom` | Removable back plate |
| `PCB` | Hotswap circuit board |
| `Plate` | Brass switch mounting plate |
| `Keycap_*` | Individual keycaps (64 keys, 75% layout) |
| `Switch_Housing_*` | MX switch bodies |
| `Switch_Stem_*` | Switch stems (colored by type) |
| `Stab_*` | Stabilizer bars and wires |
| `USB_Port` | USB-C port detail |

## Layout

75% layout, 5 rows × variable columns. Standard MX pitch (19.05mm).
Total: 64 keys. Wide keys: Space (6.25U), LShift (2.25U), Enter (2.25U), BkSp (2.0U), RShift (1.75U), others.

## Legal

This asset contains no proprietary third-party geometry. All meshes are
programmatically generated from scratch within this repository. Safe for
commercial and non-commercial use without restriction.
