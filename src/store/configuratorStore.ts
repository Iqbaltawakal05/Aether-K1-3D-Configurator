// src/store/configuratorStore.ts
// Typed configuration state for Aether K1 Configurator

import { create } from 'zustand'

// --- Types ---

export type CaseVariant = 'navy' | 'slate' | 'teal' | 'ember' | 'void'
export type KeycapVariant = 'arctic' | 'carbon' | 'sakura' | 'forest'
export type SwitchType = 'linear' | 'tactile' | 'clicky'
export type PlateVariant = 'brass' | 'aluminum' | 'carbon_fiber'
export type KnobVariant = 'aluminum' | 'resin'

// Material presets mapped to Three.js-compatible colors
export const CASE_PRESETS: Record<CaseVariant, { color: string; metalness: number; roughness: number; clearcoat: number; label: string }> = {
  navy:   { color: '#0f172a', metalness: 0.85, roughness: 0.15, clearcoat: 0.8, label: 'Midnight Navy' },
  slate:  { color: '#334155', metalness: 0.70, roughness: 0.30, clearcoat: 0.5, label: 'Storm Slate' },
  teal:   { color: '#0f4c4c', metalness: 0.80, roughness: 0.20, clearcoat: 0.7, label: 'Arctic Teal' },
  ember:  { color: '#7c2d12', metalness: 0.75, roughness: 0.25, clearcoat: 0.6, label: 'Ember Red' },
  void:   { color: '#09090b', metalness: 0.95, roughness: 0.05, clearcoat: 1.0, label: 'Void Black' },
}

export const KEYCAP_PRESETS: Record<KeycapVariant, { color: string; roughness: number; label: string }> = {
  arctic:  { color: '#e2e8f0', roughness: 0.20, label: 'Arctic White' },
  carbon:  { color: '#1c1917', roughness: 0.25, label: 'Carbon Black' },
  sakura:  { color: '#fbcfe8', roughness: 0.20, label: 'Sakura Pink' },
  forest:  { color: '#14532d', roughness: 0.30, label: 'Forest Green' },
}

export const SWITCH_PRESETS: Record<SwitchType, { stemColor: string; label: string; description: string }> = {
  linear:  { stemColor: '#ef4444', label: 'Linear (Red)',   description: 'Smooth & silent keystroke' },
  tactile: { stemColor: '#f59e0b', label: 'Tactile (Brown)', description: 'Subtle bump feedback' },
  clicky:  { stemColor: '#3b82f6', label: 'Clicky (Blue)',  description: 'Audible click per keypress' },
}

export const PLATE_PRESETS: Record<PlateVariant, { color: string; metalness: number; roughness: number; label: string }> = {
  brass:        { color: '#b5a642', metalness: 1.0, roughness: 0.15, label: 'Brass' },
  aluminum:     { color: '#9ca3af', metalness: 0.9, roughness: 0.20, label: 'Aluminum' },
  carbon_fiber: { color: '#18181b', metalness: 0.3, roughness: 0.40, label: 'Carbon Fiber' },
}

// --- Configuration State Shape ---

export interface ConfiguratorState {
  caseVariant:   CaseVariant
  keycapVariant: KeycapVariant
  switchType:    SwitchType
  plateVariant:  PlateVariant
  knobVariant:   KnobVariant
  showSwitches:  boolean

  // Actions
  setCaseVariant:   (v: CaseVariant)   => void
  setKeycapVariant: (v: KeycapVariant) => void
  setSwitchType:    (v: SwitchType)    => void
  setPlateVariant:  (v: PlateVariant)  => void
  setKnobVariant:   (v: KnobVariant)   => void
  toggleSwitches:   ()                 => void
  resetToDefaults:  ()                 => void
}

// --- Default Configuration ---

const DEFAULTS: Pick<ConfiguratorState,
  'caseVariant' | 'keycapVariant' | 'switchType' | 'plateVariant' | 'knobVariant' | 'showSwitches'
> = {
  caseVariant:   'navy',
  keycapVariant: 'arctic',
  switchType:    'linear',
  plateVariant:  'brass',
  knobVariant:   'aluminum',
  showSwitches:  false,
}

// --- Zustand Store ---

export const useConfigurator = create<ConfiguratorState>((set) => ({
  ...DEFAULTS,

  setCaseVariant:   (caseVariant)   => set({ caseVariant }),
  setKeycapVariant: (keycapVariant) => set({ keycapVariant }),
  setSwitchType:    (switchType)    => set({ switchType }),
  setPlateVariant:  (plateVariant)  => set({ plateVariant }),
  setKnobVariant:   (knobVariant)   => set({ knobVariant }),
  toggleSwitches:   ()              => set((state) => ({ showSwitches: !state.showSwitches })),
  resetToDefaults:  ()              => set({ ...DEFAULTS }),
}))

