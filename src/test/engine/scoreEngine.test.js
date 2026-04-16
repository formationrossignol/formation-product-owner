import { describe, it, expect } from 'vitest'
import { scoreTask, scoreModule, scoreTotalSession } from '../../engine/scoreEngine'

describe('scoreTask', () => {
  it('single_choice correct', () => {
    expect(scoreTask({ type: 'single_choice', expected: 'a', points: 10 }, 'a')).toBe(10)
  })
  it('single_choice incorrect', () => {
    expect(scoreTask({ type: 'single_choice', expected: 'a', points: 10 }, 'b')).toBe(0)
  })
  it('multi_select partiel', () => {
    expect(scoreTask({ type: 'multi_select', expected: ['a', 'b'], points: 10 }, ['a'])).toBe(5)
  })
  it('multi_select complet', () => {
    expect(scoreTask({ type: 'multi_select', expected: ['a', 'b'], points: 10 }, ['a', 'b'])).toBe(10)
  })
  it('ranking correct', () => {
    expect(scoreTask({ type: 'ranking', expected_order: ['a', 'b', 'c'], points: 10 }, ['a', 'b', 'c'])).toBe(10)
  })
  it('ranking incorrect', () => {
    expect(scoreTask({ type: 'ranking', expected_order: ['a', 'b', 'c'], points: 10 }, ['b', 'a', 'c'])).toBe(0)
  })
  it('match_pairs partiel', () => {
    expect(scoreTask({ type: 'match_pairs', expected: { x: '1', y: '2' }, points: 10 }, { x: '1', y: '9' })).toBe(5)
  })
  it('numeric_input exact', () => {
    expect(scoreTask({ type: 'numeric_input', expected: 42, points: 10 }, 42)).toBe(10)
  })
  it('numeric_input dans tolérance', () => {
    expect(scoreTask({ type: 'numeric_input', expected: 42, tolerance: 2, points: 10 }, 43)).toBe(10)
  })
  it('numeric_input hors tolérance', () => {
    expect(scoreTask({ type: 'numeric_input', expected: 42, tolerance: 2, points: 10 }, 50)).toBe(0)
  })
  it('keywords_text partiel', () => {
    expect(scoreTask({ type: 'keywords_text', expected: ['valeur', 'utilisateur'], points: 10 }, 'apporter de la valeur')).toBe(5)
  })
  it('keywords_text complet', () => {
    expect(scoreTask({ type: 'keywords_text', expected: ['valeur', 'utilisateur'], points: 10 }, 'valeur pour utilisateur')).toBe(10)
  })
  it('retourne 0 si réponse null', () => {
    expect(scoreTask({ type: 'single_choice', expected: 'a', points: 10 }, null)).toBe(0)
  })
})

describe('scoreModule', () => {
  const module = {
    tasks: [
      { id: 't1', type: 'single_choice', expected: 'a', points: 10 },
      { id: 't2', type: 'single_choice', expected: 'b', points: 20 },
    ],
  }
  it('score partiel', () => {
    expect(scoreModule(module, { t1: 'a', t2: 'x' })).toEqual({ earned: 10, max: 30 })
  })
  it('score total', () => {
    expect(scoreModule(module, { t1: 'a', t2: 'b' })).toEqual({ earned: 30, max: 30 })
  })
  it('score zéro', () => {
    expect(scoreModule(module, {})).toEqual({ earned: 0, max: 30 })
  })
})

describe('scoreTotalSession', () => {
  const caseData = {
    modules: [
      { tasks: [{ id: 't1', type: 'single_choice', expected: 'a', points: 10 }] },
    ],
    events: [
      { id: 'e1', choices: [{ id: 'c1', points: 5 }, { id: 'c2', points: 10 }] },
    ],
  }
  it('calcule le pourcentage correctement', () => {
    const result = scoreTotalSession(caseData, { t1: 'a' }, { e1: 'c2' })
    expect(result).toEqual({ earned: 20, max: 20, percent: 100 })
  })
})
