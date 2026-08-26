// src/hooks/useApplyConfig.ts
// Maps configurator state → live Three.js material mutations on the loaded GLB model

import { useEffect } from 'react'
import * as THREE from 'three'
import {
  useConfigurator,
  CASE_PRESETS,
  KEYCAP_PRESETS,
  SWITCH_PRESETS,
  PLATE_PRESETS,
} from '../store/configuratorStore'

interface UseApplyConfigOptions {
  scene: THREE.Group | null
}

export function useApplyConfig({ scene }: UseApplyConfigOptions) {
  const { caseVariant, keycapVariant, switchType, plateVariant, showSwitches } = useConfigurator()

  useEffect(() => {
    if (!scene) return

    const casePreset   = CASE_PRESETS[caseVariant]
    const keycapPreset = KEYCAP_PRESETS[keycapVariant]
    const switchPreset = SWITCH_PRESETS[switchType]
    const platePreset  = PLATE_PRESETS[plateVariant]

    scene.traverse((child) => {
      if (!('isMesh' in child) || !child.isMesh) return
      const mesh = child as THREE.Mesh
      const name = mesh.name

      // Case Top / Bottom / Bezel
      if (name === 'Case_Top' || name === 'Case_Bottom' || name === 'Case_Top_Bezel') {
        const mat = mesh.material as THREE.MeshPhysicalMaterial
        mat.color.set(casePreset.color)
        mat.metalness  = casePreset.metalness
        mat.roughness  = casePreset.roughness
        mat.clearcoat  = casePreset.clearcoat
        mat.needsUpdate = true
      }

      // Keycaps
      if (name.startsWith('Keycap_')) {
        const mat = mesh.material as THREE.MeshStandardMaterial
        mat.color.set(keycapPreset.color)
        mat.roughness  = keycapPreset.roughness
        mat.needsUpdate = true
      }

      // Switch Stems
      if (name.startsWith('Switch_Stem_')) {
        const mat = mesh.material as THREE.MeshStandardMaterial
        mat.color.set(switchPreset.stemColor)
        mat.needsUpdate = true
        mesh.visible = showSwitches
      }

      // Plate
      if (name === 'Plate') {
        const mat = mesh.material as THREE.MeshStandardMaterial
        mat.color.set(platePreset.color)
        mat.metalness  = platePreset.metalness
        mat.roughness  = platePreset.roughness
        mat.needsUpdate = true
      }
    })
  }, [scene, caseVariant, keycapVariant, switchType, plateVariant, showSwitches])
}

