import type { TrainStatus } from '../services/api'

export type DepartureVariant = 'today' | 'tomorrow' | 'yesterday' | 'future' | 'past'

export interface DepartureInfo {
  relativeLabel: string
  fullDate: string
  statusText: string
  variant: DepartureVariant
}

export function buildDepartureInfo(
  status: Pick<TrainStatus, 'orarioPartenza' | 'orarioArrivo' | 'ritardo'>,
  now: Date = new Date()
): DepartureInfo | null {
  const ts = status.orarioPartenza
  if (!ts) return null

  const departure = new Date(ts)
  const delayMs = Math.max(0, (status.ritardo ?? 0) * 60_000)
  const arrival = status.orarioArrivo ? new Date(status.orarioArrivo + delayMs) : null

  const dayDep = new Date(departure)
  dayDep.setHours(0, 0, 0, 0)
  const dayNow = new Date(now)
  dayNow.setHours(0, 0, 0, 0)
  const diffDays = Math.round((dayDep.getTime() - dayNow.getTime()) / 86_400_000)

  let relativeLabel: string
  let variant: DepartureVariant
  if (diffDays === 0) {
    relativeLabel = 'Oggi'
    variant = 'today'
  } else if (diffDays === 1) {
    relativeLabel = 'Domani'
    variant = 'tomorrow'
  } else if (diffDays === -1) {
    relativeLabel = 'Ieri'
    variant = 'yesterday'
  } else {
    relativeLabel = new Intl.DateTimeFormat('it-IT', {
      weekday: 'short',
      day: '2-digit',
      month: 'short'
    }).format(departure)
    variant = diffDays > 0 ? 'future' : 'past'
  }

  const fullDate = new Intl.DateTimeFormat('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(departure)

  let statusText = ''
  if (arrival && now.getTime() > arrival.getTime()) {
    statusText =
      diffDays === 0 ? 'corsa terminata' : `corsa terminata, partita ${relativeLabel.toLowerCase()}`
  } else if (now.getTime() > departure.getTime() + delayMs) {
    statusText = diffDays === -1 ? 'in viaggio (partito ieri)' : 'in viaggio'
  } else {
    const diffMs = departure.getTime() + delayMs - now.getTime()
    const diffMin = Math.round(diffMs / 60_000)
    if (diffMin <= 0) {
      statusText = 'in partenza ora'
    } else if (diffMin < 60) {
      statusText = `in partenza tra ${diffMin} min`
    } else if (diffMin < 24 * 60) {
      const h = Math.round(diffMin / 60)
      statusText = `in partenza tra ${h} ${h === 1 ? 'ora' : 'ore'}`
    } else {
      const d = Math.floor(diffMin / (24 * 60))
      statusText = `in partenza tra ${d} ${d === 1 ? 'giorno' : 'giorni'}`
    }
  }

  return { relativeLabel, fullDate, statusText, variant }
}
