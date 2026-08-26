import bpy
import os

output_dir = os.path.join(os.getcwd(), "public", "assets", "models")
os.makedirs(output_dir, exist_ok=True)
glb_path = os.path.join(output_dir, "aether_k1.glb")

# Run procedural generation
script_dir = os.path.dirname(os.path.abspath(__file__))
gen_script = os.path.join(script_dir, "generate_aether_k1_model.py")
exec(open(gen_script).read())

# Export GLB
# export_apply=False: keep object transforms as GLTF node translations/scales
#   → Three.js mesh.position.y = Blender object.location.z (via export_yup=True)
#   → useAdvancedInteraction BASE_Y values match Blender loc.z directly
bpy.ops.export_scene.gltf(
    filepath=glb_path,
    export_format='GLB',
    use_selection=False,
    export_apply=False,          # do NOT bake transforms into vertices
    export_materials='EXPORT',
    export_yup=True,             # Blender Z → Three.js Y
)

print(f"GLB Export Successful: {glb_path}")
