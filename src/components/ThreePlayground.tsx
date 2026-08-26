import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export function ThreePlayground() {
  const mountRef = useRef<HTMLDivElement>(null)
  
  // UI State for Material & Lighting toggles
  const [materialType, setMaterialType] = useState<'standard' | 'physical'>('physical')
  const [lightColor, setLightColor] = useState('#60a5fa')
  const [autoRotate, setAutoRotate] = useState(true)

  const materialRef = useRef<THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial | null>(null)
  const pointLightRef = useRef<THREE.PointLight | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    // 1. Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#030712')

    // 2. Camera setup
    const width = container.clientWidth
    const height = container.clientHeight
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
    camera.position.set(3, 4, 5)

    // 3. WebGLRenderer with DPR handling
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.autoRotate = autoRotate
    controls.autoRotateSpeed = 1.5
    controlsRef.current = controls

    // 5. Materials & Meshes (Aether K1 Keyboard Case & Keycaps Playground)
    const createMaterial = (type: 'standard' | 'physical') => {
      if (type === 'physical') {
        return new THREE.MeshPhysicalMaterial({
          color: '#1e293b',
          metalness: 0.9,
          roughness: 0.15,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1,
          reflectivity: 0.9,
        })
      }
      return new THREE.MeshStandardMaterial({
        color: '#1e293b',
        metalness: 0.6,
        roughness: 0.3,
      })
    }

    const mainMaterial = createMaterial(materialType)
    materialRef.current = mainMaterial

    // Keyboard Base Frame
    const baseGeo = new THREE.BoxGeometry(4, 0.5, 2)
    const baseMesh = new THREE.Mesh(baseGeo, mainMaterial)
    baseMesh.position.y = 0.25
    baseMesh.castShadow = true
    baseMesh.receiveShadow = true
    scene.add(baseMesh)

    // Keycaps Grid
    const keyGeo = new THREE.BoxGeometry(0.35, 0.25, 0.35)
    const keyMat = new THREE.MeshPhysicalMaterial({
      color: '#38bdf8',
      roughness: 0.1,
      clearcoat: 0.5,
    })

    const keycapsGroup = new THREE.Group()
    for (let x = -1.6; x <= 1.6; x += 0.45) {
      for (let z = -0.6; z <= 0.6; z += 0.45) {
        const keyMesh = new THREE.Mesh(keyGeo, keyMat)
        keyMesh.position.set(x, 0.5 + 0.125, z)
        keyMesh.castShadow = true
        keyMesh.receiveShadow = true
        keycapsGroup.add(keyMesh)
      }
    }
    scene.add(keycapsGroup)

    // Grid Floor
    const gridHelper = new THREE.GridHelper(15, 15, '#3b82f6', '#1e293b')
    gridHelper.position.y = 0
    scene.add(gridHelper)

    // 6. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.8)
    mainLight.position.set(5, 8, 4)
    mainLight.castShadow = true
    mainLight.shadow.mapSize.width = 2048
    mainLight.shadow.mapSize.height = 2048
    scene.add(mainLight)

    const pointLight = new THREE.PointLight(lightColor, 3, 10)
    pointLight.position.set(0, 2, 0)
    pointLightRef.current = pointLight
    scene.add(pointLight)

    // 7. Animation Loop
    let animationId: number
    let clock = new THREE.Clock()

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      // Animate keycaps floating subtle wave effect
      keycapsGroup.children.forEach((child, index) => {
        child.position.y = 0.625 + Math.sin(elapsedTime * 2 + index * 0.2) * 0.03
      })

      // Point Light Orbit Animation
      pointLight.position.x = Math.sin(elapsedTime * 0.8) * 3
      pointLight.position.z = Math.cos(elapsedTime * 0.8) * 3

      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // 8. Dynamic Resize & DPR Handler
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationId)
      controls.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [materialType])

  // Sync controls and light settings
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate
    }
  }, [autoRotate])

  useEffect(() => {
    if (pointLightRef.current) {
      pointLightRef.current.color.set(lightColor)
    }
  }, [lightColor])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#030712', color: '#f9fafb' }}>
      <header style={{ padding: '1rem 1.5rem', background: '#090d16', borderBottom: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Phase 2 — Raw Three.js Playground</h2>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#9ca3af' }}>
            PerspectiveCamera, WebGLRenderer, OrbitControls, PBR Materials, Dynamic Lights &amp; Responsive DPR Handling
          </p>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        <div ref={mountRef} style={{ flex: 1, width: '100%', height: '100%' }} />

        {/* Playground Control Panel */}
        <aside style={{ width: '300px', padding: '1.5rem', background: '#090d16', borderLeft: '1px solid #1f2937' }}>
          <h3 style={{ marginTop: 0, fontSize: '1rem', color: '#60a5fa' }}>Playground Controls</h3>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Case Material:</label>
            <select
              value={materialType}
              onChange={(e) => setMaterialType(e.target.value as 'standard' | 'physical')}
              style={{ width: '100%', padding: '0.5rem', background: '#111827', color: '#fff', border: '1px solid #374151', borderRadius: '0.375rem' }}
            >
              <option value="physical">MeshPhysicalMaterial (Clearcoat &amp; Metalness)</option>
              <option value="standard">MeshStandardMaterial (Standard PBR)</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Orbit Accent Light Color:</label>
            <input
              type="color"
              value={lightColor}
              onChange={(e) => setLightColor(e.target.value)}
              style={{ width: '100%', height: '40px', background: 'none', border: '1px solid #374151', borderRadius: '0.375rem', cursor: 'pointer' }}
            />
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
              <input
                type="checkbox"
                checked={autoRotate}
                onChange={(e) => setAutoRotate(e.target.checked)}
              />
              Auto-Rotate Camera (OrbitControls)
            </label>
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', background: '#111827', borderRadius: '0.375rem', fontSize: '0.75rem', color: '#9ca3af' }}>
            💡 <strong>Interaksi:</strong> Klik &amp; drag mouse untuk memutar kamera, scroll untuk zoom, dan pan dengan klik kanan.
          </div>
        </aside>
      </div>
    </div>
  )
}
