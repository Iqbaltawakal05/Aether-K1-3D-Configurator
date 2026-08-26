// src/hooks/useAdvancedInteraction.ts
// export_yup=True, export_apply=False → mesh.position.y = Blender loc.z

import { useEffect } from 'react'
import * as THREE from 'three'
import { useConfigurator, KeyboardPart } from '../store/configuratorStore'

interface UseAdvancedInteractionOptions {
  scene: THREE.Group | null
}

const EXPLODE_DELTA: Record<string, number> = {
  Case_Top:       0.35,
  Case_Bottom:   -0.40,
  PCB:           -0.20,
  Plate:         -0.08,
  Switch_Housing: 0.20,
  Switch_Stem:    0.55,
  Keycap:         0.70,
  Stab:           0.20,
  USB_Port:       0.35,
}

export function useAdvancedInteraction({ scene }: UseAdvancedInteractionOptions) {
  const { explodedFactor, hoveredPart, selectedPart } = useConfigurator()

  useEffect(() => {
    if (!scene) return
    const f = explodedFactor

    scene.traverse((child) => {
      if (!('isMesh' in child) || !child.isMesh) return
      const mesh = child as THREE.Mesh
      const name = mesh.name

      // Store original position on first encounter
      if (mesh.userData.baseY === undefined) {
        mesh.userData.baseY = mesh.position.y
      }
      const base = mesh.userData.baseY as number

      if (name === 'Case_Top' || name === 'Case_Top_Bezel') {
        mesh.position.y = base + EXPLODE_DELTA.Case_Top * f
      } else if (name === 'Case_Bottom') {
        mesh.position.y = base + EXPLODE_DELTA.Case_Bottom * f
      } else if (name === 'PCB') {
        mesh.position.y = base + EXPLODE_DELTA.PCB * f
      } else if (name === 'Plate') {
        mesh.position.y = base + EXPLODE_DELTA.Plate * f
      } else if (name.startsWith('Switch_Housing_')) {
        mesh.position.y = base + EXPLODE_DELTA.Switch_Housing * f
      } else if (name.startsWith('Switch_Stem_')) {
        mesh.position.y = base + EXPLODE_DELTA.Switch_Stem * f
      } else if (name.startsWith('Keycap_')) {
        mesh.position.y = base + EXPLODE_DELTA.Keycap * f
      } else if (name.startsWith('Stab_')) {
        mesh.position.y = base + EXPLODE_DELTA.Stab * f
      } else if (name === 'USB_Port') {
        mesh.position.y = base + EXPLODE_DELTA.USB_Port * f
      }
    })
  }, [scene, explodedFactor])

  useEffect(() => {
    if (!scene) return

    scene.traverse((child) => {
      if (!('isMesh' in child) || !child.isMesh) return
      const mesh = child as THREE.Mesh
      const name = mesh.name

      let part: KeyboardPart | null = null
      if (name === 'Case_Top' || name === 'Case_Top_Bezel' || name === 'Case_Bottom') part = 'case'
      else if (name.startsWith('Keycap_')) part = 'keycaps'
      else if (name.startsWith('Switch_Housing_') || name.startsWith('Switch_Stem_')) part = 'switches'
      else if (name === 'Plate') part = 'plate'
      else if (name === 'PCB') part = 'pcb'

      const mat = mesh.material as THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial
      if (mat && 'emissive' in mat) {
        if (selectedPart === part) {
          mat.emissive.set('#0ea5e9'); mat.emissiveIntensity = 0.35
        } else if (hoveredPart === part) {
          mat.emissive.set('#38bdf8'); mat.emissiveIntensity = 0.20
        } else {
          mat.emissive.set('#000000'); mat.emissiveIntensity = 0
        }
        mat.needsUpdate = true
      }
    })
  }, [scene, hoveredPart, selectedPart])
}
