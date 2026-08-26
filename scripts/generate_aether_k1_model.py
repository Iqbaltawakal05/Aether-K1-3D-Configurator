import bpy
import math

# Clear existing objects in Blender default scene
bpy.ops.wm.read_factory_settings(use_empty=True)

# Create main collection
collection = bpy.data.collections.new("Aether_K1")
bpy.context.scene.collection.children.link(collection)

# Helper function to create material
def create_material(name, color, roughness=0.3, metalness=0.0, clearcoat=0.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        bsdf.inputs['Base Color'].default_value = color
        bsdf.inputs['Roughness'].default_value = roughness
        bsdf.inputs['Metallic'].default_value = metalness
        if 'Clearcoat' in bsdf.inputs:
            bsdf.inputs['Clearcoat'].default_value = clearcoat
    return mat

# Create Materials
mat_case_top = create_material("Mat_Case_Top", (0.05, 0.08, 0.15, 1.0), roughness=0.2, metalness=0.8, clearcoat=0.5)
mat_case_bottom = create_material("Mat_Case_Bottom", (0.02, 0.03, 0.05, 1.0), roughness=0.3, metalness=0.9)
mat_plate = create_material("Mat_Plate", (0.8, 0.7, 0.3, 1.0), roughness=0.2, metalness=1.0) # Brass plate
mat_pcb = create_material("Mat_PCB", (0.01, 0.2, 0.08, 1.0), roughness=0.4, metalness=0.0)
mat_switch_stem = create_material("Mat_Switch_Stem", (0.8, 0.1, 0.1, 1.0), roughness=0.3)
mat_key_primary = create_material("Mat_Keycap_Primary", (0.1, 0.12, 0.16, 1.0), roughness=0.25)
mat_key_accent = create_material("Mat_Keycap_Accent", (0.85, 0.35, 0.1, 1.0), roughness=0.2)

# 1. Top Case
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0.2, 0))
case_top = bpy.context.active_object
case_top.name = "Case_Top"
case_top.scale = (3.8, 0.35, 1.8)
case_top.data.materials.append(mat_case_top)
collection.objects.link(case_top)

# 2. Bottom Case / Weight Plate
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -0.05, 0))
case_bottom = bpy.context.active_object
case_bottom.name = "Case_Bottom"
case_bottom.scale = (3.85, 0.2, 1.85)
case_bottom.data.materials.append(mat_case_bottom)
collection.objects.link(case_bottom)

# 3. Plate
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0.35, 0))
plate = bpy.context.active_object
plate.name = "Plate"
plate.scale = (3.6, 0.05, 1.6)
plate.data.materials.append(mat_plate)
collection.objects.link(plate)

# 4. PCB
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0.28, 0))
pcb = bpy.context.active_object
pcb.name = "PCB"
pcb.scale = (3.65, 0.03, 1.65)
pcb.data.materials.append(mat_pcb)
collection.objects.link(pcb)

# 5. Keycaps Layout (75% / Compact layout mockup)
rows = 5
cols = 14
start_x = -1.5
start_z = -0.6
spacing_x = 0.23
spacing_z = 0.25

for r in range(rows):
    for c in range(cols):
        # Determine keycap position
        kx = start_x + (c * spacing_x)
        kz = start_z + (r * spacing_z)
        
        bpy.ops.mesh.primitive_cube_add(size=1, location=(kx, 0.52, kz))
        keycap = bpy.context.active_object
        
        is_accent = (r == 0 and c == 0) or (r == 2 and c == cols - 1) or (r == 4 and c == 7)
        keycap.name = f"Keycap_R{r}_C{c}"
        keycap.scale = (0.2, 0.15, 0.22)
        
        if is_accent:
            keycap.data.materials.append(mat_key_accent)
        else:
            keycap.data.materials.append(mat_key_primary)
            
        collection.objects.link(keycap)

        # Switch Stem inside keycap
        bpy.ops.mesh.primitive_cube_add(size=1, location=(kx, 0.4, kz))
        stem = bpy.context.active_object
        stem.name = f"Switch_Stem_R{r}_C{c}"
        stem.scale = (0.06, 0.1, 0.06)
        stem.data.materials.append(mat_switch_stem)
        collection.objects.link(stem)

# Deselect all
bpy.ops.object.select_all(action='DESELECT')

print("Aether K1 3D model procedural generation complete.")

