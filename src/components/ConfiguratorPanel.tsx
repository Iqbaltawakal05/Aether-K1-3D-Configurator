// src/components/ConfiguratorPanel.tsx
// Sidebar panel — wires Zustand store to UI controls & Phase 8 advanced interaction controls

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
  color: '#64748b',
  marginBottom: '0.5rem',
}
const SWATCH_ROW: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
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
      title={label}
      onClick={onClick}
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: color,
        border: active ? '2px solid #38bdf8' : '2px solid #334155',
        boxShadow: active ? '0 0 0 2px #0ea5e9' : 'none',
        cursor: 'pointer',
        transition: 'box-shadow 0.15s',
        flexShrink: 0,
      }}
    />
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
      onClick={onClick}
      style={{
        padding: '0.35rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.8rem',
        fontWeight: 500,
        background: active ? '#0ea5e9' : '#1e293b',
        color: active ? '#fff' : '#94a3b8',
        border: active ? '1px solid #0ea5e9' : '1px solid #334155',
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  )
}

export function ConfiguratorPanel() {
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

  return (
    <aside
      style={{
        width: '280px',
        minWidth: '280px',
        padding: '1.5rem',
        background: '#0a0f1e',
        borderLeft: '1px solid #1e293b',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', color: '#f1f5f9', letterSpacing: '-0.01em' }}>
          Aether K1
        </h3>
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#64748b' }}>
          Customize your build
        </p>
      </div>

      {/* Case Color */}
      <div style={SECTION}>
        <span style={LABEL}>Case — {CASE_PRESETS[caseVariant].label}</span>
        <div style={SWATCH_ROW}>
          {(Object.keys(CASE_PRESETS) as CaseVariant[]).map((v) => (
            <Swatch
              key={v}
              color={CASE_PRESETS[v].color}
              active={caseVariant === v}
              label={CASE_PRESETS[v].label}
              onClick={() => setCaseVariant(v)}
            />
          ))}
        </div>
      </div>

      {/* Keycap Color */}
      <div style={SECTION}>
        <span style={LABEL}>Keycaps — {KEYCAP_PRESETS[keycapVariant].label}</span>
        <div style={SWATCH_ROW}>
          {(Object.keys(KEYCAP_PRESETS) as KeycapVariant[]).map((v) => (
            <Swatch
              key={v}
              color={KEYCAP_PRESETS[v].color}
              active={keycapVariant === v}
              label={KEYCAP_PRESETS[v].label}
              onClick={() => setKeycapVariant(v)}
            />
          ))}
        </div>
      </div>

      {/* Switch Type */}
      <div style={SECTION}>
        <span style={LABEL}>Switch Type</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {(Object.keys(SWITCH_PRESETS) as SwitchType[]).map((v) => (
            <button
              key={v}
              onClick={() => setSwitchType(v)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.6rem 0.75rem',
                background: switchType === v ? '#0c1a2e' : 'transparent',
                border: switchType === v ? '1px solid #0ea5e9' : '1px solid #1e293b',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: SWITCH_PRESETS[v].stemColor,
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f1f5f9' }}>
                  {SWITCH_PRESETS[v].label}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
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
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(Object.keys(PLATE_PRESETS) as PlateVariant[]).map((v) => (
            <Chip
              key={v}
              label={PLATE_PRESETS[v].label}
              active={plateVariant === v}
              onClick={() => setPlateVariant(v)}
            />
          ))}
        </div>
      </div>

      {/* Phase 8: Exploded View Slider */}
      <div style={SECTION}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={LABEL}>Exploded Layer View</span>
          <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>
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
          style={{ width: '100%', cursor: 'pointer', accentColor: '#38bdf8' }}
        />
      </div>

      {/* View Options */}
      <div style={SECTION}>
        <span style={LABEL}>View Controls</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', color: '#94a3b8' }}>
            <input type="checkbox" checked={autoRotate} onChange={(e) => setAutoRotate(e.target.checked)} />
            Auto-Rotate Camera
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', color: '#94a3b8' }}>
            <input type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} />
            Show 3D Part Annotations
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', color: '#94a3b8' }}>
            <input type="checkbox" checked={showSwitches} onChange={toggleSwitches} />
            Show Switch Stems
          </label>
        </div>
      </div>

      {/* Selection Status */}
      {selectedPart && (
        <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#0c1a2e', border: '1px solid #0ea5e9', borderRadius: '0.5rem', fontSize: '0.75rem' }}>
          <div style={{ color: '#38bdf8', fontWeight: 600 }}>Selected Part: {selectedPart.toUpperCase()}</div>
          <button
            onClick={() => setSelectedPart(null)}
            style={{ marginTop: '0.25rem', background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.7rem', cursor: 'pointer', padding: 0 }}
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Build Summary */}
      <div style={{ marginTop: 'auto', padding: '1rem', background: '#111827', borderRadius: '0.5rem', fontSize: '0.75rem', color: '#64748b', lineHeight: 1.6 }}>
        <div style={{ fontWeight: 700, color: '#f1f5f9', marginBottom: '0.5rem' }}>Build Summary</div>
        <div>Case: <span style={{ color: '#38bdf8' }}>{CASE_PRESETS[caseVariant].label}</span></div>
        <div>Keycaps: <span style={{ color: '#38bdf8' }}>{KEYCAP_PRESETS[keycapVariant].label}</span></div>
        <div>Switch: <span style={{ color: '#38bdf8' }}>{SWITCH_PRESETS[switchType].label}</span></div>
        <div>Plate: <span style={{ color: '#38bdf8' }}>{PLATE_PRESETS[plateVariant].label}</span></div>
      </div>

      {/* Reset */}
      <button
        onClick={resetToDefaults}
        style={{
          marginTop: '1rem',
          padding: '0.6rem',
          background: 'transparent',
          border: '1px solid #334155',
          borderRadius: '0.5rem',
          color: '#64748b',
          fontSize: '0.8rem',
          cursor: 'pointer',
          transition: 'border-color 0.15s, color 0.15s',
        }}
        onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.borderColor = '#ef4444'; (e.target as HTMLButtonElement).style.color = '#ef4444' }}
        onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.borderColor = '#334155'; (e.target as HTMLButtonElement).style.color = '#64748b' }}
      >
        ↺ Reset to Defaults
      </button>
    </aside>
  )
}
