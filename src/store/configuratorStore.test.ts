import { describe, it, expect, beforeEach } from 'vitest'
import { useConfigurator, CASE_PRESETS, KEYCAP_PRESETS } from './configuratorStore'

describe('configuratorStore', () => {
  beforeEach(() => {
    useConfigurator.getState().resetToDefaults()
  })

  it('should initialize with correct default configuration', () => {
    const state = useConfigurator.getState()
    expect(state.caseVariant).toBe('navy')
    expect(state.keycapVariant).toBe('arctic')
    expect(state.switchType).toBe('linear')
    expect(state.plateVariant).toBe('brass')
    expect(state.showSwitches).toBe(false)
    expect(state.explodedFactor).toBe(0)
    expect(state.selectedPart).toBeNull()
  })

  it('should update case variant correctly', () => {
    useConfigurator.getState().setCaseVariant('ember')
    expect(useConfigurator.getState().caseVariant).toBe('ember')
    expect(CASE_PRESETS.ember.label).toBe('Ember Red')
  })

  it('should update keycap variant correctly', () => {
    useConfigurator.getState().setKeycapVariant('sakura')
    expect(useConfigurator.getState().keycapVariant).toBe('sakura')
    expect(KEYCAP_PRESETS.sakura.label).toBe('Sakura Pink')
  })

  it('should update switch type correctly', () => {
    useConfigurator.getState().setSwitchType('clicky')
    expect(useConfigurator.getState().switchType).toBe('clicky')
  })

  it('should update plate variant correctly', () => {
    useConfigurator.getState().setPlateVariant('carbon_fiber')
    expect(useConfigurator.getState().plateVariant).toBe('carbon_fiber')
  })

  it('should handle exploded factor changes', () => {
    useConfigurator.getState().setExplodedFactor(0.75)
    expect(useConfigurator.getState().explodedFactor).toBe(0.75)
  })

  it('should select and hover parts correctly', () => {
    useConfigurator.getState().setHoveredPart('case')
    expect(useConfigurator.getState().hoveredPart).toBe('case')

    useConfigurator.getState().setSelectedPart('plate')
    expect(useConfigurator.getState().selectedPart).toBe('plate')
  })

  it('should reset all state back to initial defaults', () => {
    const store = useConfigurator.getState()
    store.setCaseVariant('void')
    store.setKeycapVariant('forest')
    store.setExplodedFactor(1.0)
    store.setSelectedPart('pcb')

    store.resetToDefaults()

    const resetState = useConfigurator.getState()
    expect(resetState.caseVariant).toBe('navy')
    expect(resetState.keycapVariant).toBe('arctic')
    expect(resetState.explodedFactor).toBe(0)
    expect(resetState.selectedPart).toBeNull()
  })
})
