import { describe, it, expect } from 'vitest'
import { buildDepartureInfo } from '../departureInfo'

const baseStatus = (
  over: Partial<{ orarioPartenza: number; orarioArrivo: number; ritardo: number }>
) => ({
  orarioPartenza: 0,
  orarioArrivo: 0,
  ritardo: 0,
  ...over
})

const NOW = new Date('2026-05-10T12:00:00+02:00')
const at = (iso: string) => new Date(iso).getTime()

describe('buildDepartureInfo', () => {
  it('returns null when orarioPartenza is missing', () => {
    expect(buildDepartureInfo(baseStatus({ orarioPartenza: 0 }), NOW)).toBeNull()
  })

  it('detects "Oggi" with future departure (in partenza tra X ore)', () => {
    const info = buildDepartureInfo(
      baseStatus({ orarioPartenza: at('2026-05-10T21:43:00+02:00') }),
      NOW
    )
    expect(info?.relativeLabel).toBe('Oggi')
    expect(info?.variant).toBe('today')
    expect(info?.statusText).toMatch(/in partenza tra 10 ore/)
  })

  it('detects "Domani" with departure in next day', () => {
    const info = buildDepartureInfo(
      baseStatus({ orarioPartenza: at('2026-05-11T08:00:00+02:00') }),
      NOW
    )
    expect(info?.relativeLabel).toBe('Domani')
    expect(info?.variant).toBe('tomorrow')
  })

  it('detects "Ieri" for night trains still in transit', () => {
    const info = buildDepartureInfo(
      baseStatus({
        orarioPartenza: at('2026-05-09T23:00:00+02:00'),
        orarioArrivo: at('2026-05-10T15:00:00+02:00')
      }),
      NOW
    )
    expect(info?.relativeLabel).toBe('Ieri')
    expect(info?.variant).toBe('yesterday')
    expect(info?.statusText).toMatch(/in viaggio.*partito ieri/i)
  })

  it('marks completed runs as "corsa terminata"', () => {
    const info = buildDepartureInfo(
      baseStatus({
        orarioPartenza: at('2026-05-10T08:00:00+02:00'),
        orarioArrivo: at('2026-05-10T10:00:00+02:00')
      }),
      NOW
    )
    expect(info?.statusText).toBe('corsa terminata')
  })

  it('does NOT mark train as terminated if ritardo extends arrival past now', () => {
    // Train scheduled to arrive at 11:30 with 60 min delay → real arrival 12:30, NOW is 12:00
    const info = buildDepartureInfo(
      baseStatus({
        orarioPartenza: at('2026-05-10T09:30:00+02:00'),
        orarioArrivo: at('2026-05-10T11:30:00+02:00'),
        ritardo: 60
      }),
      NOW
    )
    expect(info?.statusText).toBe('in viaggio')
  })

  it('shows "in partenza ora" when delta is zero', () => {
    const info = buildDepartureInfo(baseStatus({ orarioPartenza: NOW.getTime() }), NOW)
    expect(info?.statusText).toBe('in partenza ora')
  })

  it('formats remote dates with weekday/day/month label', () => {
    const info = buildDepartureInfo(
      baseStatus({ orarioPartenza: at('2026-05-15T08:00:00+02:00') }),
      NOW
    )
    expect(info?.variant).toBe('future')
    // Italian short weekday + day + short month
    expect(info?.relativeLabel).toMatch(/^(lun|mar|mer|gio|ven|sab|dom)\.? \d{2} [a-z]{3}\.?/i)
  })
})
