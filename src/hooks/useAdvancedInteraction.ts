// src/hooks/useAdvancedInteraction.ts
// Handles exploded view animation, part hover highlighting, and 3D object interaction

import { useEffect } from 'react'
import * as THREE from 'three'
import { useConfigurator, KeyboardPart } from '../store/configuratorStore'

interface UseAdvancedInteractionOptions {
  scene: THREE.Group | null
}

// Initial Y positions of key components in the GLB model
const INITIAL_Y: Record<string, number> = {
  Case_Top: 0.25,
  Case_Bottom: -0.05,
  Plate: 0.35,
  PCB: 0.28,
}

export function useAdvancedInteraction({ scene }: UseAdvancedInteractionOptions) {
  const { explodedFactor, hoveredPart, selectedPart } = useConfigurator()

  // Exploded View Y-axis Displacements
  useEffect(() => {
    if (!scene) return

    const factor = explodedFactor

    scene.traverse((child) => {
      if (!('isMesh' in child)) return
      const mesh = child as THREE.Mesh
      const name = mesh.name

      if (name === 'Case_Top') {
        mesh.position.y = INITIAL_Y.Case_Top + factor * 0.4
      } else if (name.startsWith('Keycap_')) {
        mesh.position.y = 0.625 + factor * 1.2
      } else if (name.startsWith('Switch_Stem_')) {
        mesh.position.y = 0.4 + factor * 0.7
      } else if (name === 'Plate') {
        mesh.position.y = INITIAL_Y.Plate + factor * 0.3
      } else if (name === 'PCB') {
        mesh.position.y = INITIAL_Y.PCB - factor * 0.2
      } else if (name === 'Case_Bottom') {
        mesh.position.y = INITIAL_Y.Case_Bottom - factor * 0.6
      }
    })
  }, [scene, explodedFactor])

  // Hover & Selection Highlight Effect
  useEffect(() => {
    if (!scene) return

    scene.traverse((child) => {
      if (!('isMesh' in child)) return
      const mesh = child as THREE.Mesh
      const name = mesh.name

      let part: KeyboardPart | null = null
      if (name === 'Case_Top' || name === 'Case_Bottom') part = 'case'
      else if (name.startsWith('Keycap_')) part = 'keycaps'
      else if (name.startsWith('Switch_Stem_')) part = 'switches'
      else if (name === 'Plate') part = 'plate'
      else if (name === 'PCB') part = 'pcb'

      const isHovered = hoveredPart === part
      const isSelected = selectedPart === part

      const mat = mesh.material as THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial
      if (mat && 'emissive' in mat) {
        if (isSelected) {
          mat.emissive.set('#0ea5e9')
          mat.emissiveIntensity = 0.35
        } else if (isHovered) {
          mat.emissive.set('#38bdf8')
          mat.emissiveIntensity = 0.2
        } else {
          mat.emissive.set('#000000')
          mat.emissiveIntensity = 0
        }
        mat.needsUpdate = true
      }
    })
  }, [scene, hoveredPart, selectedPart])
}

