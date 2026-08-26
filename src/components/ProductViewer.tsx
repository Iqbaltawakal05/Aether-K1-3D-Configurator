import { Suspense, Component, ReactNode, useRef, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, OrbitControls, ContactShadows, Environment, Center, Bounds, Html, PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import { useApplyConfig } from '../hooks/useApplyConfig'
import { useAdvancedInteraction } from '../hooks/useAdvancedInteraction'
import { useConfigurator, KeyboardPart } from '../store/configuratorStore'
import { ConfiguratorPanel } from './ConfiguratorPanel'
import { isWebGLAvailable } from '../utils/webglCheck'

// GLB Model Loader with live material updates & interaction bindings
function KeyboardModel() {
  const { scene } = useGLTF('/assets/models/aether_k1.glb')
  const sceneRef = useRef<THREE.Group>(scene as unknown as THREE.Group)

  const { setHoveredPart, setSelectedPart, showLabels, explodedFactor } = useConfigurator()

  // Apply material configuration state
  useApplyConfig({ scene: sceneRef.current })

  // Apply advanced interaction
  useAdvancedInteraction({ scene: sceneRef.current })

  scene.traverse((child) => {
    if ('isMesh' in child && child.isMesh) {
      child.castShadow = true
      child.receiveShadow = true
    }
  })

  const getPartFromMeshName = (name: string): KeyboardPart | null => {
    if (name === 'Case_Top' || name === 'Case_Bottom') return 'case'
    if (name.startsWith('Keycap_')) return 'keycaps'
    if (name.startsWith('Switch_Stem_')) return 'switches'
    if (name === 'Plate') return 'plate'
    if (name === 'PCB') return 'pcb'
    return null
  }

  return (
    <group
      onPointerOver={(e) => {
        e.stopPropagation()
        const part = getPartFromMeshName(e.object.name)
        setHoveredPart(part)
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setHoveredPart(null)
      }}
      onClick={(e) => {
        e.stopPropagation()
        const part = getPartFromMeshName(e.object.name)
        setSelectedPart(part)
      }}
    >
      <primitive object={scene} />

      {/* 3D Part Annotations / Labels */}
      {showLabels && (
        <>
          <Html position={[0, 0.25 + explodedFactor * 0.4 + 0.3, 0.9]} center distanceFactor={8}>
            <div style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(4px)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', border: '1px solid #38bdf8', color: '#f8fafc', fontSize: '10px', fontWeight: 600, pointerEvents: 'none', whiteSpace: 'nowrap' }}>
              Top Case
            </div>
          </Html>
          {explodedFactor > 0.2 && (
            <>
              <Html position={[0, 0.35 + explodedFactor * 0.3 + 0.1, 0]} center distanceFactor={8}>
                <div style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(4px)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', border: '1px solid #b5a642', color: '#f8fafc', fontSize: '10px', fontWeight: 600, pointerEvents: 'none', whiteSpace: 'nowrap' }}>
                  Brass Plate
                </div>
              </Html>
              <Html position={[0, 0.28 - explodedFactor * 0.2 - 0.1, 0]} center distanceFactor={8}>
                <div style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(4px)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', border: '1px solid #22c55e', color: '#f8fafc', fontSize: '10px', fontWeight: 600, pointerEvents: 'none', whiteSpace: 'nowrap' }}>
                  Hotswap PCB
                </div>
              </Html>
            </>
          )}
        </>
      )}
    </group>
  )
}

useGLTF.preload('/assets/models/aether_k1.glb')

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
        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Loading Aether K1...</span>
      </div>
    </Html>
  )
}

interface ErrorBoundaryProps { children: ReactNode }
interface ErrorBoundaryState { hasError: boolean }
class ModelErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) {
      return (
        <Html center>
          <div style={{ padding: '1.5rem', background: '#7f1d1d', color: '#fef2f2', borderRadius: '0.5rem', textAlign: 'center' }}>
            <h3 style={{ margin: 0 }}>Gagal Memuat Model 3D</h3>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem' }}>File GLB tidak ditemukan.</p>
          </div>
        </Html>
      )
    }
    return this.props.children
  }
}

export function ProductViewer() {
  const { autoRotate, setSelectedPart, resetToDefaults } = useConfigurator()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [dpr, setDpr] = useState<number>(1.5)
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true)

  useEffect(() => {
    setWebGlSupported(isWebGLAvailable())
  }, [])

  // Keyboard accessibility listeners (Escape = clear selection / close drawer, R = reset)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPart(null)
        setIsMobileOpen(false)
      } else if (e.key.toLowerCase() === 'r' && e.altKey) {
        resetToDefaults()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setSelectedPart, resetToDefaults])

  return (
    <div className="configurator-wrapper">
      {/* Header */}
      <header style={{ padding: '0.75rem 1.5rem', background: 'var(--color-bg-card)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, flexShrink: 0 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.125rem', letterSpacing: '-0.01em', fontWeight: 700 }}>Aether K1 — 3D Configurator</h1>
          <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Interactive customization with live 3D preview &amp; exploded layer view
          </p>
        </div>
      </header>

      {/* Main Responsive Layout */}
      <div className="configurator-content">
        {/* Mobile Controls Toggle Button */}
        <button
          type="button"
          className="mobile-toggle-btn"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle configuration panel"
        >
          ⚙️ Customize
        </button>

        {/* 3D Canvas Container */}
        <div style={{ flex: 1, position: 'relative', width: '100%', height: '100%' }}>
          {!webGlSupported ? (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#ef4444', padding: '2rem', textAlign: 'center' }}>
              <div>
                <h2>WebGL Tidak Didukung</h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Peramban Anda tidak mendukung akselerasi grafik WebGL 3D.</p>
              </div>
            </div>
          ) : (
            <Canvas
              shadows
              camera={{ position: [4, 3.5, 4], fov: 40 }}
              style={{ background: 'var(--color-bg-main)' }}
              dpr={dpr}
              gl={{ antialias: true, powerPreference: 'high-performance' }}
              onCreated={({ gl }) => { gl.shadowMap.type = 1 /* PCFShadowMap */ }}
            >
              {/* Adaptive Performance Monitoring */}
              <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(1.5)}>
                <ambientLight intensity={0.7} />
                <directionalLight position={[5, 8, 4]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0001} />
                <directionalLight position={[-5, 3, -4]} intensity={0.5} color="#38bdf8" />

                <Bounds fit clip observe margin={1.2}>
                  <Center top>
                    <ModelErrorBoundary>
                      <Suspense fallback={<Loader />}>
                        <KeyboardModel />
                      </Suspense>
                    </ModelErrorBoundary>
                  </Center>
                </Bounds>

                <ContactShadows position={[0, -0.01, 0]} opacity={0.75} scale={12} blur={2.5} far={4} resolution={512} />
                <Environment preset="city" />
                <OrbitControls
                  makeDefault
                  enableDamping
                  dampingFactor={0.05}
                  autoRotate={autoRotate}
                  autoRotateSpeed={1.5}
                  minDistance={2}
                  maxDistance={10}
                  minPolarAngle={Math.PI / 5}
                  maxPolarAngle={Math.PI / 2 - 0.08}
                />
              </PerformanceMonitor>
            </Canvas>
          )}

          {/* Gesture & Keyboard Shortcut hint */}
          <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)', padding: '0.5rem 1.25rem', borderRadius: '9999px', border: '1px solid var(--color-border)', fontSize: '0.75rem', color: 'var(--color-text-muted)', pointerEvents: 'none', whiteSpace: 'nowrap' }}>
            🖱️ Click parts to select · Drag/Scroll to inspect · Press <kbd style={{ background: '#1e293b', padding: '1px 4px', borderRadius: '3px' }}>Esc</kbd> to clear
          </div>
        </div>

        {/* Configurator Sidebar / Mobile Drawer Panel */}
        <ConfiguratorPanel
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />
      </div>
    </div>
  )
}
