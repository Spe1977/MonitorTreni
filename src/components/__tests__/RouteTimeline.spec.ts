import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RouteTimeline from '../RouteTimeline.vue'
import type { TrainStop } from '../../services/api'

const stop = (over: Partial<TrainStop>): TrainStop => ({
  stazione: 'STAZIONE',
  arrivoTeorico: null,
  partenzaTeorica: null,
  arrivoReale: null,
  partenzaReale: null,
  ritardoArrivo: 0,
  ritardoPartenza: 0,
  isPartenzaEffettuata: false,
  isArrivoEffettuato: false,
  ...over
})

const at = (iso: string) => new Date(iso).getTime()

describe('RouteTimeline.vue', () => {
  it('renders one row per stop with the station name', () => {
    const stops: TrainStop[] = [
      stop({ stazione: 'ROMA TERMINI', partenzaTeorica: at('2026-05-10T08:00:00+02:00') }),
      stop({
        stazione: 'BOLOGNA C.LE',
        arrivoTeorico: at('2026-05-10T09:30:00+02:00'),
        partenzaTeorica: at('2026-05-10T09:33:00+02:00')
      }),
      stop({ stazione: 'MILANO CENTRALE', arrivoTeorico: at('2026-05-10T11:00:00+02:00') })
    ]
    const wrapper = mount(RouteTimeline, { props: { stops, isDark: false } })
    const text = wrapper.text()
    expect(text).toContain('ROMA TERMINI')
    expect(text).toContain('BOLOGNA C.LE')
    expect(text).toContain('MILANO CENTRALE')
  })

  it('shows scheduled times for intermediate stops (Arrivo + Partenza)', () => {
    const stops: TrainStop[] = [
      stop({ stazione: 'A', partenzaTeorica: at('2026-05-10T08:00:00+02:00') }),
      stop({
        stazione: 'B',
        arrivoTeorico: at('2026-05-10T09:30:00+02:00'),
        partenzaTeorica: at('2026-05-10T09:33:00+02:00')
      }),
      stop({ stazione: 'C', arrivoTeorico: at('2026-05-10T11:00:00+02:00') })
    ]
    const wrapper = mount(RouteTimeline, { props: { stops, isDark: false } })
    const text = wrapper.text()
    expect(text).toContain('Arrivo')
    expect(text).toContain('Partenza')
    expect(text).toContain('09:30')
    expect(text).toContain('09:33')
    expect(text).toContain('08:00')
    expect(text).toContain('11:00')
  })

  it('renders the delay badge when ritardo > 5 min and stop is passed', () => {
    const stops: TrainStop[] = [
      stop({ stazione: 'A', partenzaTeorica: at('2026-05-10T08:00:00+02:00') }),
      stop({
        stazione: 'B',
        arrivoTeorico: at('2026-05-10T09:30:00+02:00'),
        arrivoReale: at('2026-05-10T09:42:00+02:00'),
        ritardoArrivo: 12,
        isArrivoEffettuato: true
      })
    ]
    const wrapper = mount(RouteTimeline, { props: { stops, isDark: false } })
    expect(wrapper.text()).toContain("+12'")
  })

  it('does not render delay badge for upcoming stops', () => {
    const stops: TrainStop[] = [
      stop({ stazione: 'A', partenzaTeorica: at('2026-05-10T08:00:00+02:00') }),
      stop({ stazione: 'B', arrivoTeorico: at('2026-05-10T09:30:00+02:00'), ritardoArrivo: 0 })
    ]
    const wrapper = mount(RouteTimeline, { props: { stops, isDark: false } })
    expect(wrapper.text()).not.toContain("+0'")
  })

  it('shows real time arrow next to scheduled time when treno è passato', () => {
    const stops: TrainStop[] = [
      stop({ stazione: 'A', partenzaTeorica: at('2026-05-10T08:00:00+02:00') }),
      stop({
        stazione: 'B',
        arrivoTeorico: at('2026-05-10T09:30:00+02:00'),
        arrivoReale: at('2026-05-10T09:32:00+02:00'),
        isArrivoEffettuato: true
      })
    ]
    const wrapper = mount(RouteTimeline, { props: { stops, isDark: false } })
    expect(wrapper.text()).toContain('→ 09:32')
  })
})
