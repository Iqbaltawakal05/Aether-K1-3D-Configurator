// src/components/ConfiguratorPanel.tsx
// Polished Sidebar & Mobile Drawer Panel with ARIA accessibility & 44px touch targets

import { useState } from 'react'
import {
  useConfigurator,
  CASE_PRESETS,
  KEYCAP_PRESETS,
  SWITCH_PRESETS,
  PLATE_PRESETS,
  type CaseVariant,
  type KeycapVariant,
  type SwitchType,
  type PlateVariant,
} from '../store/configuratorStore'

const SECTION: React.CSSProperties = {
  marginBottom: '1.5rem',
}

const LABEL: React.CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--color-text-muted)',
  marginBottom: '0.5rem',
}

const SWATCH_ROW: React.CSSProperties = {
  display: 'flex',
  gap: '0.625rem',
  flexWrap: 'wrap',
}

interface SwatchProps {
  color: string
  active: boolean
  label: string
  onClick: () => void
}
function Swatch({ color, active, label, onClick }: SwatchProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      aria-label={label}
      title={label}
      onClick={onClick}
      style={{
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: color,
        border: active ? '3px solid var(--color-primary)' : '2px solid var(--color-border)',
        boxShadow: active ? '0 0 0 2px var(--color-primary-hover)' : 'none',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {active && (
        <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
          ✓
        </span>
      )}
    </button>
  )
}

interface ChipProps {
  label: string
  active: boolean
  onClick: () => void
}
function Chip({ label, active, onClick }: ChipProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      aria-label={label}
      onClick={onClick}
      style={{
        minHeight: '44px',
        padding: '0.5rem 1rem',
        borderRadius: '9999px',
        fontSize: '0.85rem',
        fontWeight: 600,
        background: active ? 'var(--color-primary)' : 'var(--color-border)',
        color: active ? '#000' : 'var(--color-text-main)',
        border: active ? '1px solid var(--color-primary-hover)' : '1px solid var(--color-border-hover)',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {label}
    </button>
  )
}

interface ConfiguratorPanelProps {
  isMobileOpen?: boolean
  onCloseMobile?: () => void
}

export function ConfiguratorPanel({ isMobileOpen = false, onCloseMobile }: ConfiguratorPanelProps) {
  const {
    caseVariant, setCaseVariant,
    keycapVariant, setKeycapVariant,
    switchType, setSwitchType,
    plateVariant, setPlateVariant,
    showSwitches, toggleSwitches,
    explodedFactor, setExplodedFactor,
    autoRotate, setAutoRotate,
    showLabels, setShowLabels,
    selectedPart, setSelectedPart,
    resetToDefaults,
  } = useConfigurator()

  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 2000)
  }

  const handleReset = () => {
    resetToDefaults()
    showToast('Reset ke konfigurasi awal')
  }

  return (
    <aside
      className={`configurator-sidebar ${isMobileOpen ? 'open' : ''}`}
      aria-label="Configurator Controls"
    >
      {/* Mobile Drawer Close Header */}
      {onCloseMobile && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)' }}>Configurator Options</span>
          <button
            type="button"
            onClick={onCloseMobile}
            style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: '1.25rem', cursor: 'pointer', minHeight: '44px', minWidth: '44px' }}
            aria-label="Close configuration panel"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.125rem', color: 'var(--color-text-main)', letterSpacing: '-0.01em' }}>
          Aether K1 Customizer
        </h3>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          Stand-alone 3D Keyboard Configurator
        </p>
      </div>

      {/* Toast Feedback Banner */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          style={{
            marginBottom: '1rem',
            padding: '0.5rem 0.75rem',
            background: 'var(--color-primary)',
            color: '#000',
            borderRadius: '0.375rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Case Color */}
      <div style={SECTION}>
        <span style={LABEL}>Case Color — {CASE_PRESETS[caseVariant].label}</span>
        <div style={SWATCH_ROW} role="radiogroup" aria-label="Case Color Selection">
          {(Object.keys(CASE_PRESETS) as CaseVariant[]).map((v) => (
            <Swatch
              key={v}
              color={CASE_PRESETS[v].color}
              active={caseVariant === v}
              label={CASE_PRESETS[v].label}
              onClick={() => {
                setCaseVariant(v)
                showToast(`Case: ${CASE_PRESETS[v].label}`)
              }}
            />
          ))}
        </div>
      </div>

      {/* Keycap Color */}
      <div style={SECTION}>
        <span style={LABEL}>Keycap Set — {KEYCAP_PRESETS[keycapVariant].label}</span>
        <div style={SWATCH_ROW} role="radiogroup" aria-label="Keycap Color Selection">
          {(Object.keys(KEYCAP_PRESETS) as KeycapVariant[]).map((v) => (
            <Swatch
              key={v}
              color={KEYCAP_PRESETS[v].color}
              active={keycapVariant === v}
              label={KEYCAP_PRESETS[v].label}
              onClick={() => {
                setKeycapVariant(v)
                showToast(`Keycaps: ${KEYCAP_PRESETS[v].label}`)
              }}
            />
          ))}
        </div>
      </div>

      {/* Switch Type */}
      <div style={SECTION}>
        <span style={LABEL}>Switch Type</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }} role="radiogroup" aria-label="Switch Type Selection">
          {(Object.keys(SWITCH_PRESETS) as SwitchType[]).map((v) => (
            <button
              type="button"
              role="radio"
              aria-checked={switchType === v}
              key={v}
              onClick={() => {
                setSwitchType(v)
                showToast(`Switch: ${SWITCH_PRESETS[v].label}`)
              }}
              style={{
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.6rem 0.75rem',
                background: switchType === v ? 'var(--color-bg-elevated)' : 'transparent',
                border: switchType === v ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: SWITCH_PRESETS[v].stemColor,
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                  {SWITCH_PRESETS[v].label}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                  {SWITCH_PRESETS[v].description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Plate Material */}
      <div style={SECTION}>
        <span style={LABEL}>Plate Material</span>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} role="radiogroup" aria-label="Plate Material Selection">
          {(Object.keys(PLATE_PRESETS) as PlateVariant[]).map((v) => (
            <Chip
              key={v}
              label={PLATE_PRESETS[v].label}
              active={plateVariant === v}
              onClick={() => {
                setPlateVariant(v)
                showToast(`Plate: ${PLATE_PRESETS[v].label}`)
              }}
            />
          ))}
        </div>
      </div>

      {/* Exploded View Slider */}
      <div style={SECTION}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={LABEL}>Exploded View</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600 }}>
            {Math.round(explodedFactor * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={explodedFactor}
          onChange={(e) => setExplodedFactor(parseFloat(e.target.value))}
          style={{ width: '100%', height: '24px', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
          aria-label="Exploded view layer separation slider"
        />
      </div>

      {/* View Options */}
      <div style={SECTION}>
        <span style={LABEL}>View Options</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-text-muted)', minHeight: '32px' }}>
            <input type="checkbox" checked={autoRotate} onChange={(e) => setAutoRotate(e.target.checked)} style={{ width: '18px', height: '18px' }} />
            Auto-Rotate Camera
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-text-muted)', minHeight: '32px' }}>
            <input type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} style={{ width: '18px', height: '18px' }} />
            Show 3D Annotations
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--color-text-muted)', minHeight: '32px' }}>
            <input type="checkbox" checked={showSwitches} onChange={toggleSwitches} style={{ width: '18px', height: '18px' }} />
            Show Switch Stems
          </label>
        </div>
      </div>

      {/* Selection Status */}
      {selectedPart && (
        <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-primary)', borderRadius: '0.5rem', fontSize: '0.75rem' }}>
          <div style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Terpilih: {selectedPart.toUpperCase()}</div>
          <button
            type="button"
            onClick={() => setSelectedPart(null)}
            style={{ marginTop: '0.25rem', background: 'none', border: 'none', color: 'var(--color-text-muted)', fontSize: '0.7rem', cursor: 'pointer', padding: 0 }}
          >
            Bersihkan Pilihan
          </button>
        </div>
      )}

      {/* Build Summary */}
      <div style={{ marginTop: 'auto', padding: '1rem', background: 'var(--color-bg-main)', border: '1px solid var(--color-border)', borderRadius: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
        <div style={{ fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>Ringkasan Konfigurasi</div>
        <div>Case: <span style={{ color: 'var(--color-primary)' }}>{CASE_PRESETS[caseVariant].label}</span></div>
        <div>Keycaps: <span style={{ color: 'var(--color-primary)' }}>{KEYCAP_PRESETS[keycapVariant].label}</span></div>
        <div>Switch: <span style={{ color: 'var(--color-primary)' }}>{SWITCH_PRESETS[switchType].label}</span></div>
        <div>Plate: <span style={{ color: 'var(--color-primary)' }}>{PLATE_PRESETS[plateVariant].label}</span></div>
      </div>

      {/* Reset Button */}
      <button
        type="button"
        onClick={handleReset}
        style={{
          marginTop: '1rem',
          minHeight: '44px',
          padding: '0.6rem',
          background: 'transparent',
          border: '1px solid var(--color-border-hover)',
          borderRadius: '0.5rem',
          color: 'var(--color-text-muted)',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        ↺ Reset Ke Default
      </button>
    </aside>
  )
}
