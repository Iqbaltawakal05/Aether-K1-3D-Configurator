import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export function FundamentalsExperiment() {
  const mountRef = useRef<HTMLDivElement>(null)
  
  // Transform State for Interactive Controls
  const [posX, setPosX] = useState(0)
  const [posY, setPosY] = useState(0)
  const [posZ, setPosZ] = useState(0)
  const [rotY, setRotY] = useState(0)

  const meshRef = useRef<THREE.Mesh | null>(null)

  useEffect(() => {
    const currentMount = mountRef.current
    if (!currentMount) return

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0f172a')

    const width = currentMount.clientWidth
    const height = currentMount.clientHeight
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
    camera.position.set(0, 3, 6)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    currentMount.appendChild(renderer.domElement)

    // 2. Geometry, Material, Mesh (Primitive Keyboard Base & Keycap mockup)
    const baseGeometry = new THREE.BoxGeometry(3, 0.4, 1.5)
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: '#334155',
      roughness: 0.3,
      metalness: 0.8,
    })
    const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial)
    baseMesh.castShadow = true
    baseMesh.receiveShadow = true
    meshRef.current = baseMesh
    scene.add(baseMesh)

    // Keycap Primitives
    const keyGeo = new THREE.BoxGeometry(0.3, 0.2, 0.3)
    const keyMat = new THREE.MeshStandardMaterial({ color: '#38bdf8', roughness: 0.2 })
    
    for (let x = -1; x <= 1; x += 0.5) {
      for (let z = -0.4; z <= 0.4; z += 0.4) {
        const keyMesh = new THREE.Mesh(keyGeo, keyMat)
        keyMesh.position.set(x, 0.3, z)
        keyMesh.castShadow = true
        baseMesh.add(keyMesh)
      }
    }

    // Ground Plane
    const planeGeo = new THREE.PlaneGeometry(10, 10)
    const planeMat = new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.8 })
    const plane = new THREE.Mesh(planeGeo, planeMat)
    plane.rotation.x = -Math.PI / 2
    plane.position.y = -0.5
    plane.receiveShadow = true
    scene.add(plane)

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5)
    dirLight.position.set(5, 8, 5)
    dirLight.castShadow = true
    scene.add(dirLight)

    // 4. Render Loop
    let animationFrameId: number
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()

    // Resize Handler
    const handleResize = () => {
      if (!currentMount) return
      const w = currentMount.clientWidth
      const h = currentMount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  // Update mesh transforms when state changes
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(posX, posY, posZ)
      meshRef.current.rotation.y = (rotY * Math.PI) / 180
    }
  }, [posX, posY, posZ, rotY])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#090d16', color: '#f8fafc' }}>
      <header style={{ padding: '1rem', borderBottom: '1px solid #1e293b' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Phase 1 — 3D Fundamentals Experiment</h2>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#94a3b8' }}>
          Scene, Camera, Renderer, Geometry, Material, Mesh, Lighting &amp; X/Y/Z Transforms
        </p>
      </header>

      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        <div ref={mountRef} style={{ flex: 1, width: '100%', height: '100%' }} />

        {/* Controls Sidebar */}
        <aside style={{ width: '280px', padding: '1.5rem', background: '#0f172a', borderLeft: '1px solid #1e293b' }}>
          <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Transform Controls</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem' }}>Position X: {posX}</label>
            <input type="range" min="-3" max="3" step="0.1" value={posX} onChange={(e) => setPosX(parseFloat(e.target.value))} style={{ width: '100%' }} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem' }}>Position Y: {posY}</label>
            <input type="range" min="-1" max="3" step="0.1" value={posY} onChange={(e) => setPosY(parseFloat(e.target.value))} style={{ width: '100%' }} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem' }}>Position Z: {posZ}</label>
            <input type="range" min="-3" max="3" step="0.1" value={posZ} onChange={(e) => setPosZ(parseFloat(e.target.value))} style={{ width: '100%' }} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem' }}>Rotation Y (°): {rotY}</label>
            <input type="range" min="0" max="360" step="5" value={rotY} onChange={(e) => setRotY(parseFloat(e.target.value))} style={{ width: '100%' }} />
          </div>
        </aside>
      </div>
    </div>
  )
}
