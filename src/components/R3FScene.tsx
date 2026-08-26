import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, ContactShadows, Environment, Float } from '@react-three/drei'
import * as THREE from 'three'

function KeyboardMesh({ caseColor, autoFloat }: { caseColor: string; autoFloat: boolean }) {
  const groupRef = useRef<THREE.Group>(null)

  // R3F useFrame animation loop
  useFrame((_state, delta) => {
    if (groupRef.current && !autoFloat) {
      groupRef.current.rotation.y += delta * 0.2
    }
  })

  return (
    <Float speed={autoFloat ? 2 : 0} rotationIntensity={autoFloat ? 0.5 : 0} floatIntensity={autoFloat ? 0.8 : 0}>
      <group ref={groupRef} dispose={null}>
        {/* Keyboard Base Case */}
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[4, 0.5, 2]} />
          <meshPhysicalMaterial
            color={caseColor}
            metalness={0.8}
            roughness={0.2}
            clearcoat={0.8}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Keycaps Grid */}
        {[-1.6, -1.15, -0.7, -0.25, 0.25, 0.7, 1.15, 1.6].map((x) =>
          [-0.6, -0.15, 0.3, 0.75].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 0.625, z]} castShadow receiveShadow>
              <boxGeometry args={[0.35, 0.25, 0.35]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.15} />
            </mesh>
          ))
        )}
      </group>
    </Float>
  )
}

export function R3FScene() {
  const [caseColor, setCaseColor] = useState('#1e293b')
  const [autoFloat, setAutoFloat] = useState(true)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#090d16', color: '#f8fafc' }}>
      <header style={{ padding: '1rem 1.5rem', background: '#0f172a', borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Phase 3 — React Three Fiber (R3F) &amp; Drei</h2>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#94a3b8' }}>
            Declarative Canvas, R3F Hooks (`useFrame`), Drei Controls, Environment Lighting &amp; Float Animations
          </p>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* R3F Declarative Canvas */}
        <div style={{ flex: 1, width: '100%', height: '100%' }}>
          <Canvas
            shadows
            camera={{ position: [3, 4, 5], fov: 50 }}
            style={{ background: '#030712' }}
            dpr={[1, 2]}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 8, 4]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
            <pointLight position={[-4, 3, -2]} intensity={1} color="#38bdf8" />

            <KeyboardMesh caseColor={caseColor} autoFloat={autoFloat} />

            {/* Drei ContactShadows for realistic soft floor shadows */}
            <ContactShadows position={[0, -0.01, 0]} opacity={0.6} scale={10} blur={2} far={4} />

            {/* Drei Environment */}
            <Environment preset="city" />

            {/* Drei OrbitControls */}
            <OrbitControls makeDefault enableDamping dampingFactor={0.05} />
          </Canvas>
        </div>

        {/* R3F Controls Panel */}
        <aside style={{ width: '300px', padding: '1.5rem', background: '#0f172a', borderLeft: '1px solid #1e293b' }}>
          <h3 style={{ marginTop: 0, fontSize: '1rem', color: '#38bdf8' }}>R3F State Controls</h3>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Case Color:</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['#1e293b', '#0f766e', '#7c2d12', '#431407', '#312e81'].map((c) => (
                <button
                  key={c}
                  onClick={() => setCaseColor(c)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: c,
                    border: caseColor === c ? '2px solid #38bdf8' : '1px solid #475569',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
              <input
                type="checkbox"
                checked={autoFloat}
                onChange={(e) => setAutoFloat(e.target.checked)}
              />
              Drei Float Animation
            </label>
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', background: '#1e293b', borderRadius: '0.375rem', fontSize: '0.75rem', color: '#94a3b8' }}>
            ⚛️ <strong>Declarative 3D:</strong> Dibuat menggunakan React Three Fiber (R3F) Canvas, hooks (`useFrame`), dan Drei (OrbitControls, Environment, ContactShadows, Float).
          </div>
        </aside>
      </div>
    </div>
  )
}
