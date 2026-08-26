import { Suspense, Component, ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, ContactShadows, Environment, Center, Bounds, Html } from '@react-three/drei'

// GLB Model Loader Component
function KeyboardModel() {
  const { scene } = useGLTF('/assets/models/aether_k1.glb')

  // Ensure shadows are cast/received on loaded model meshes
  scene.traverse((child) => {
    if ('isMesh' in child && child.isMesh) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })

  return <primitive object={scene} />
}

// Pre-preload model
useGLTF.preload('/assets/models/aether_k1.glb')

// Custom Loading Fallback Component
function Loader() {
  return (
    <Html center>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#38bdf8', fontFamily: 'sans-serif' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid #1e293b',
            borderTop: '3px solid #38bdf8',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '0.75rem',
          }}
        />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Loading Aether K1 3D Model...</span>
      </div>
    </Html>
  )
}

// Error Boundary Component
interface ErrorBoundaryProps {
  children: ReactNode
}
interface ErrorBoundaryState {
  hasError: boolean
}

class ModelErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Html center>
          <div style={{ padding: '1.5rem', background: '#7f1d1d', color: '#fef2f2', borderRadius: '0.5rem', textAlign: 'center' }}>
            <h3 style={{ margin: 0 }}>Gagal Memuat Model 3D</h3>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem' }}>File GLB tidak ditemukan atau bermasalah.</p>
          </div>
        </Html>
      )
    }
    return this.props.children
  }
}

export function ProductViewer() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#030712', color: '#f9fafb' }}>
      <header style={{ padding: '1rem 1.5rem', background: '#090d16', borderBottom: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Phase 5 — Aether K1 3D Product Viewer</h2>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#9ca3af' }}>
            Loaded GLB Asset, Automatic Bounds Framing, Studio Lighting, Contact Shadows &amp; Touch Gesture Support
          </p>
        </div>
      </header>

      <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
        <Canvas
          shadows
          camera={{ position: [0, 3, 5], fov: 45 }}
          style={{ background: '#030712' }}
          dpr={[1, 2]}
        >
          <ambientLight intensity={0.7} />
          <directionalLight
            position={[5, 8, 4]}
            intensity={1.5}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0001}
          />
          <directionalLight position={[-5, 3, -4]} intensity={0.5} color="#38bdf8" />

          {/* Automatic Bounds framing & Centering */}
          <Bounds fit clip observe margin={1.2}>
            <Center top>
              <ModelErrorBoundary>
                <Suspense fallback={<Loader />}>
                  <KeyboardModel />
                </Suspense>
              </ModelErrorBoundary>
            </Center>
          </Bounds>

          {/* Realistic Floor Contact Shadows */}
          <ContactShadows position={[0, -0.01, 0]} opacity={0.75} scale={12} blur={2.5} far={4} color="#000000" />

          {/* Environment Map Lighting */}
          <Environment preset="city" />

          {/* OrbitControls with Camera Framing Limits & Touch Support */}
          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.05}
            minDistance={2}
            maxDistance={10}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2 - 0.05}
            rotateSpeed={0.8}
            zoomSpeed={0.8}
          />
        </Canvas>

        {/* Floating Instruction Badge */}
        <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', padding: '0.75rem 1.5rem', borderRadius: '9999px', border: '1px solid #1e293b', fontSize: '0.875rem', color: '#94a3b8', pointerEvents: 'none' }}>
          🖱️ Drag / Touch untuk memutar | Scroll / Pinch untuk zoom
        </div>
      </div>
    </div>
  )
}

