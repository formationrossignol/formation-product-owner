import { describe, it, expect } from 'vitest'
import { getNextModule, isModuleUnlocked } from '../../engine/moduleEngine'

const modules = [
  { id: 'vision' },
  { id: 'discovery' },
  { id: 'prioritization' },
]

describe('getNextModule', () => {
  it('retourne le premier module si rien complété', () => {
    expect(getNextModule(modules, [])).toEqual({ id: 'vision' })
  })
  it('retourne le second module si premier complété', () => {
    expect(getNextModule(modules, ['vision'])).toEqual({ id: 'discovery' })
  })
  it('retourne null si tout complété', () => {
    expect(getNextModule(modules, ['vision', 'discovery', 'prioritization'])).toBeNull()
  })
})

describe('isModuleUnlocked', () => {
  it('premier module toujours débloqué', () => {
    expect(isModuleUnlocked('vision', modules, [])).toBe(true)
  })
  it('second module débloqué si premier complété', () => {
    expect(isModuleUnlocked('discovery', modules, ['vision'])).toBe(true)
  })
  it('second module verrouillé si premier non complété', () => {
    expect(isModuleUnlocked('discovery', modules, [])).toBe(false)
  })
})
