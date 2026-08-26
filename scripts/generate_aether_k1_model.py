"""
Aether K1 - 75% Mechanical Keyboard Procedural Generator
Blender Z-up, export_yup=True, export_apply=False
Three.js: mesh.position.y = Blender object.location.z

Scale: 1 unit = 10 cm | Real 75% keyboard: 32cm W x 13cm D x ~3.8cm H

Details added in this version:
  - Case_Top_Body    : outer shell (solid, metallic navy)
  - Case_Top_Bezel   : inner lip/frame around keycap opening (slightly lighter, simulates the
                       recessed keycap well / opening in the top case)
  - Switch_Housing   : MX switch body (white/grey cube) visible between plate and keycap
  - Keycaps          : top face slightly inset via bmesh (sculpted top surface)
  - Stabilizer_Bar   : long keys (space, shift, enter, backspace) get a stab bar detail
  - USB_Port         : small rectangle on top-right edge of case (detail)

Assembly Z (= Three.js Y):
  Case_Top_Body   loc.z= 0.000  half_z=0.140  → Z -0.140 to +0.140
  Case_Top_Bezel  loc.z= 0.115  half_z=0.028  → Z +0.087 to +0.143  (inner lip at top of case)
  Case_Bottom     loc.z=-0.105  half_z=0.030  → Z -0.135 to -0.075
  PCB             loc.z=-0.040  half_z=0.018  → Z -0.058 to -0.022
  Plate           loc.z= 0.020  half_z=0.014  → Z +0.006 to +0.034
  Switch_Housing  loc.z= 0.095  half_z=0.038  → Z +0.057 to +0.133
  Keycaps         loc.z= 0.195  half_z=0.055  → Z +0.140 to +0.250
"""

import bpy
import bmesh

bpy.ops.wm.read_factory_settings(use_empty=True)
col = bpy.data.collections.new("Aether_K1")
bpy.context.scene.collection.children.link(col)

def add_obj(col):
    obj = bpy.context.active_object
    for c in list(obj.users_collection):
        c.objects.unlink(obj)
    col.objects.link(obj)
    return obj

def mat(name, base_color, roughness=0.25, metallic=0.0, clearcoat=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes.get("Principled BSDF")
    if b:
        b.inputs["Base Color"].default_value = (*base_color, 1.0)
        b.inputs["Roughness"].default_value = roughness
        b.inputs["Metallic"].default_value = metallic
        # Clearcoat removed in Blender 4+ (merged into coat)
        if "Coat Weight" in b.inputs:
            b.inputs["Coat Weight"].default_value = clearcoat
    return m

# ── Materials ────────────────────────────────────────────────────────────────
M_CASE_BODY  = mat("M_CaseBody",  (0.10, 0.20, 0.42), roughness=0.15, metallic=0.88, clearcoat=0.9)
M_CASE_BEZEL = mat("M_CaseBezel", (0.14, 0.28, 0.55), roughness=0.12, metallic=0.90, clearcoat=1.0)
M_CASE_BOT   = mat("M_CaseBot",   (0.06, 0.08, 0.14), roughness=0.30, metallic=0.85)
M_PLATE      = mat("M_Plate",     (0.72, 0.58, 0.18), roughness=0.20, metallic=1.00)
M_PCB        = mat("M_PCB",       (0.01, 0.18, 0.06), roughness=0.45, metallic=0.00)
M_SW_HOUSE   = mat("M_SwHouse",   (0.88, 0.88, 0.88), roughness=0.40, metallic=0.00)
M_SW_STEM    = mat("M_SwStem",    (0.80, 0.10, 0.10), roughness=0.30, metallic=0.00)
M_KEY_PRI    = mat("M_KeyPri",    (0.82, 0.83, 0.85), roughness=0.20, metallic=0.00)
M_KEY_ACC    = mat("M_KeyAcc",    (0.86, 0.36, 0.06), roughness=0.18, metallic=0.00)
M_STAB       = mat("M_Stab",      (0.50, 0.50, 0.55), roughness=0.35, metallic=0.60)
M_USB        = mat("M_USB",       (0.20, 0.20, 0.22), roughness=0.40, metallic=0.70)

KBD_W = 3.20
KBD_D = 1.30
PITCH = 0.1905

# ── CASE_TOP BODY — outer shell ──────────────────────────────────────────────
bpy.ops.mesh.primitive_cube_add(location=(0, 0, 0.000))
ob = add_obj(col); ob.name = "Case_Top"
ob.scale = (KBD_W / 2, KBD_D / 2, 0.140)
ob.data.materials.append(M_CASE_BODY)

# ── CASE_TOP BEZEL — inner lip/frame (simulates keycap well opening) ─────────
# A slightly smaller, slightly taller ring at the top of the case
# This creates a visual "step" that implies the keycaps sit in a recessed well
bpy.ops.mesh.primitive_cube_add(location=(0, 0, 0.115))
ob = add_obj(col); ob.name = "Case_Top_Bezel"
ob.scale = (KBD_W / 2 - 0.03, KBD_D / 2 - 0.03, 0.028)
ob.data.materials.append(M_CASE_BEZEL)

# ── CASE_BOTTOM ───────────────────────────────────────────────────────────────
bpy.ops.mesh.primitive_cube_add(location=(0, 0, -0.105))
ob = add_obj(col); ob.name = "Case_Bottom"
ob.scale = (KBD_W / 2 - 0.015, KBD_D / 2 - 0.015, 0.030)
ob.data.materials.append(M_CASE_BOT)

# ── PCB ───────────────────────────────────────────────────────────────────────
bpy.ops.mesh.primitive_cube_add(location=(0, 0, -0.040))
ob = add_obj(col); ob.name = "PCB"
ob.scale = (KBD_W / 2 - 0.06, KBD_D / 2 - 0.06, 0.018)
ob.data.materials.append(M_PCB)

# ── PLATE ─────────────────────────────────────────────────────────────────────
bpy.ops.mesh.primitive_cube_add(location=(0, 0, 0.020))
ob = add_obj(col); ob.name = "Plate"
ob.scale = (KBD_W / 2 - 0.07, KBD_D / 2 - 0.07, 0.014)
ob.data.materials.append(M_PLATE)

# ── USB PORT — top-right edge detail ─────────────────────────────────────────
# Small notch on the back edge (positive Y in Blender = front, so back = negative Y)
# USB-C port: ~9mm wide, ~3.5mm tall, centered near right side
bpy.ops.mesh.primitive_cube_add(location=(0.80, -(KBD_D / 2 - 0.005), 0.060))
ob = add_obj(col); ob.name = "USB_Port"
ob.scale = (0.045, 0.008, 0.018)
ob.data.materials.append(M_USB)

# ── KEYCAPS + SWITCH HOUSING ─────────────────────────────────────────────────
KEY_Z    = 0.195
KEY_H    = 0.055
KEY_D_H  = (PITCH * 0.92) / 2
ROW_Z_STEP = [0.000, 0.004, 0.008, 0.012, 0.017]

# MX switch housing: sits just below keycap, visible between plate and keycap
SW_H_Z   = 0.095   # switch housing center Z
SW_H_H   = 0.038   # switch housing half-height
SW_H_W   = 0.070   # switch housing half-width (14mm × 14mm MX footprint / 10cm scale = 0.14/2)

LAYOUT = [
    # Row 0: Spacebar row
    [("R0_Ctrl",1.25,False),("R0_Win",1.25,False),("R0_Alt",1.25,False),
     ("R0_Space",6.25,False),
     ("R0_AltGr",1.25,False),("R0_Fn",1.00,False),
     ("R0_Left",1.00,False),("R0_Down",1.00,False),("R0_Right",1.00,False)],
    # Row 1: Shift row
    [("R1_LShift",2.25,False),
     ("R1_Z",1.00,False),("R1_X",1.00,False),("R1_C",1.00,False),("R1_V",1.00,False),
     ("R1_B",1.00,False),("R1_N",1.00,False),("R1_M",1.00,False),
     ("R1_Comma",1.00,False),("R1_Dot",1.00,False),("R1_Slash",1.00,False),
     ("R1_RShift",1.75,False),("R1_Up",1.00,False)],
    # Row 2: Home row
    [("R2_Caps",1.75,False),
     ("R2_A",1.00,False),("R2_S",1.00,False),("R2_D",1.00,False),("R2_F",1.00,False),
     ("R2_G",1.00,False),("R2_H",1.00,False),("R2_J",1.00,False),("R2_K",1.00,False),
     ("R2_L",1.00,False),("R2_Semi",1.00,False),("R2_Quote",1.00,False),
     ("R2_Enter",2.25,True)],
    # Row 3: QWERTY row
    [("R3_Tab",1.50,False),
     ("R3_Q",1.00,False),("R3_W",1.00,False),("R3_E",1.00,False),("R3_R",1.00,False),
     ("R3_T",1.00,False),("R3_Y",1.00,False),("R3_U",1.00,False),("R3_I",1.00,False),
     ("R3_O",1.00,False),("R3_P",1.00,False),
     ("R3_LBrack",1.00,False),("R3_RBrack",1.00,False),("R3_BSlash",1.50,False),
     ("R3_Del",1.00,True)],
    # Row 4: Number row
    [("R4_Esc",1.00,True),
     ("R4_1",1.00,False),("R4_2",1.00,False),("R4_3",1.00,False),("R4_4",1.00,False),
     ("R4_5",1.00,False),("R4_6",1.00,False),("R4_7",1.00,False),("R4_8",1.00,False),
     ("R4_9",1.00,False),("R4_0",1.00,False),
     ("R4_Minus",1.00,False),("R4_Equal",1.00,False),("R4_BkSp",2.00,False)],
]

# Wide keys that need stabilizers (>= 2U)
STAB_MIN_U = 2.0

num_rows = len(LAYOUT)
START_Y   = (num_rows - 1) * PITCH / 2

for r_idx, row in enumerate(LAYOUT):
    row_U    = sum(k[1] for k in row)
    cursor_x = -(row_U * PITCH) / 2
    kz = KEY_Z + ROW_Z_STEP[r_idx]
    ky = START_Y - r_idx * PITCH

    for suffix, width_u, is_accent in row:
        kx = cursor_x + (width_u * PITCH) / 2
        sx = (width_u * PITCH * 0.92) / 2

        # ── Keycap (bmesh: sculpted top with slightly inset top face) ──────
        bm = bmesh.new()
        # Create a box, then scale top face slightly inward for sculpted look
        bmesh.ops.create_cube(bm, size=2.0)
        # Top face verts (z=+1 in local space)
        top_verts = [v for v in bm.verts if v.co.z > 0.5]
        # Inset top face by ~4% to simulate keycap dish/sculpt
        for v in top_verts:
            v.co.x *= 0.90
            v.co.y *= 0.90
        mesh_data = bpy.data.meshes.new(f"Keycap_{suffix}")
        bm.to_mesh(mesh_data); bm.free()

        ob = bpy.data.objects.new(f"Keycap_{suffix}", mesh_data)
        for c in list(ob.users_collection): c.objects.unlink(ob)
        col.objects.link(ob)
        ob.location = (kx, ky, kz)
        ob.scale    = (sx, KEY_D_H, KEY_H)
        ob.data.materials.append(M_KEY_ACC if is_accent else M_KEY_PRI)

        # ── Switch Housing (MX body, visible below keycap) ──────────────────
        # 1U keys get a single housing; wide keys get housing sized to 1U (center)
        bpy.ops.mesh.primitive_cube_add(location=(kx, ky, SW_H_Z + ROW_Z_STEP[r_idx] * 0.5))
        sw = add_obj(col)
        sw.name  = f"Switch_Housing_{suffix}"
        sw.scale = (SW_H_W, SW_H_W, SW_H_H)
        sw.data.materials.append(M_SW_HOUSE)

        # ── Switch Stem (colored peg, center of housing top) ─────────────────
        stem_z = kz - KEY_H - 0.015
        bpy.ops.mesh.primitive_cube_add(location=(kx, ky, stem_z))
        stem = add_obj(col)
        stem.name  = f"Switch_Stem_{suffix}"
        stem.scale = (0.022, 0.022, 0.030)
        stem.data.materials.append(M_SW_STEM)

        # ── Stabilizer bar for wide keys ──────────────────────────────────────
        if width_u >= STAB_MIN_U:
            stab_offset = (width_u * PITCH / 2) * 0.65
            stab_z = SW_H_Z - SW_H_H + 0.005 + ROW_Z_STEP[r_idx] * 0.5
            for sign in (-1, 1):
                bpy.ops.mesh.primitive_cube_add(
                    location=(kx + sign * stab_offset, ky, stab_z))
                stab = add_obj(col)
                stab.name  = f"Stab_{suffix}_{'L' if sign < 0 else 'R'}"
                stab.scale = (0.018, 0.018, 0.025)
                stab.data.materials.append(M_STAB)
            # Wire connecting stabs
            bpy.ops.mesh.primitive_cube_add(location=(kx, ky, stab_z - 0.010))
            wire = add_obj(col)
            wire.name  = f"Stab_Wire_{suffix}"
            wire.scale = (stab_offset, 0.005, 0.005)
            wire.data.materials.append(M_STAB)

        cursor_x += width_u * PITCH

bpy.ops.object.select_all(action='DESELECT')

max_U = max(sum(k[1] for k in row) for row in LAYOUT)
print("=== Aether K1 generation complete ===")
print(f"Case body:   Z -0.140 to +0.140 (28mm)")
print(f"Case bezel:  Z +0.087 to +0.143 (inner lip)")
print(f"Keycaps:     Z +0.140 to +0.250 (sculpted top)")
print(f"Grid: {max_U}U x {num_rows} rows")
print(f"Total objects: {len(bpy.data.objects)}")
