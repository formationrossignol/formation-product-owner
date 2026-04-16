import { describe, it, expect } from 'vitest'
import { getTriggeredEvents } from '../../engine/eventEngine'

const events = [
  { id: 'e1', trigger: 'after_module:prioritization', choices: [] },
  { id: 'e2', trigger: 'after_module:sprint_planning', choices: [] },
]

describe('getTriggeredEvents', () => {
  it('retourne événement déclenché', () => {
    expect(getTriggeredEvents(events, ['prioritization'], [])).toEqual([events[0]])
  })
  it('ne retourne pas un événement déjà répondu', () => {
    expect(getTriggeredEvents(events, ['prioritization'], ['e1'])).toEqual([])
  })
  it('retourne [] si module non complété', () => {
    expect(getTriggeredEvents(events, [], [])).toEqual([])
  })
  it('retourne [] si events est undefined', () => {
    expect(getTriggeredEvents(undefined, ['prioritization'], [])).toEqual([])
  })
  it('retourne plusieurs événements déclenchés', () => {
    const result = getTriggeredEvents(events, ['prioritization', 'sprint_planning'], [])
    expect(result).toHaveLength(2)
  })
})
