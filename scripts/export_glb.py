import bpy
import os
import sys

# Get output path from arguments or default
output_dir = os.path.join(os.getcwd(), "public", "assets", "models")
os.makedirs(output_dir, exist_ok=True)
glb_path = os.path.join(output_dir, "aether_k1.glb")

# Run procedural generation script
script_dir = os.path.dirname(os.path.abspath(__file__))
gen_script = os.path.join(script_dir, "generate_aether_k1_model.py")
exec(open(gen_script).read())

# Select all objects in Aether_K1 collection
bpy.ops.object.select_all(action='SELECT')

# Export GLB file
bpy.ops.export_scene.gltf(
    filepath=glb_path,
    export_format='GLB',
    use_selection=False,
    export_apply=True,
    export_materials='EXPORT',
    export_yup=True
)

print(f"GLB Export Successful: {glb_path}")

