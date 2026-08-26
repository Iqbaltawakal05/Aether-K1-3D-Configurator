# PROGRESS.md

Current Phase: Phase 12 — Testing & QA (Re-audit complete)
Current Task: Asset visual issues resolved — ready for Phase 13
Status: Phase 4 asset re-audit completed. All visual bugs fixed.

## Phases
- [x] 0 Setup
- [x] 1 3D Fundamentals
- [x] 2 Three.js
- [x] 3 React Three Fiber
- [x] 4 Blender / Asset Pipeline  ← RE-AUDITED & FIXED
- [x] 5 Product Viewer
- [x] 6 Configurator Architecture
- [x] 7 Core Configurator
- [x] 8 Advanced Interaction
- [x] 9 UI/UX
- [x] 10 Performance
- [x] 11 Responsive & Accessibility
- [x] 12 Testing & QA
- [ ] 13 Release

## Phase 4 Re-audit Fixes Applied
- Case_Top / Case_Bottom overlap → fixed (clean Z boundary, no overlap)
- Keycap scale bug (KEY_W=half-extent, caused slab) → fixed (PITCH-based scale)
- Keycap grid coverage → rebuilt as explicit LAYOUT list per row (64 keys, 75% layout)
- BASE_Y in useAdvancedInteraction → fixed (export_apply=False, pos.y=Blender loc.z)
- Case color invisible (#0f172a = background) → fixed (#1e3a6e)
- Case_Top_Bezel override → added to useApplyConfig
- Added details: Switch_Housing, Case_Top_Bezel, USB_Port, Stabilizer bars
- Camera default angle → [4, 3.5, 4] fov=40 for proper 3/4 isometric view
- export_apply=False to preserve GLTF node translations
- PCFSoftShadowMap warning → known Three.js r185 deprecation, no functional impact

## Fixed Decisions
- Project B is standalone.
- Aether K1 is fictional.
- Project A integration belongs to Project C.
- No backend/auth/database/payment.

## Blockers
None.

## Next
Ready for Phase 13 Release upon user prompt.
