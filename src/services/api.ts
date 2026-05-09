export interface TrainSuggestion {
  number: string
  originName: string
  id: string
  originId: string
  // Timestamp Unix (ms) della data di partenza, terzo parametro richiesto da andamentoTreno
  departureTimestamp: string
}

export interface TrainStop {
  stazione: string
  arrivoTeorico: number | null
  partenzaTeorica: number | null
  arrivoReale: number | null
  partenzaReale: number | null
  ritardoArrivo: number
  ritardoPartenza: number
  isPartenzaEffettuata: boolean
  isArrivoEffettuato: boolean
}

export interface TrainStatus {
  compNumeroTreno: string
  origine: string
  destinazione: string
  ritardo: number
  orarioPartenza: number
  orarioArrivo: number
  categoria: string
  categoriaDescrizione: string
  fermate: TrainStop[]
  compOrarioPartenzaZeroEffettivo: string
  compOrarioArrivoZeroEffettivo: string
}

const API_BASE = '/api'

export const api = {
  async searchTrain(query: string): Promise<TrainSuggestion[]> {
    if (!query) return []
    const res = await fetch(`${API_BASE}/train-autocomplete?q=${encodeURIComponent(query)}`)
    if (!res.ok) throw new Error('Errore nella ricerca del treno')
    return res.json()
  },

  async getTrainStatus(
    originId: string,
    trainNumber: string,
    departureTimestamp: string
  ): Promise<TrainStatus> {
    const params = new URLSearchParams({
      origin: originId,
      train: trainNumber,
      date: departureTimestamp
    })
    const res = await fetch(`${API_BASE}/train-status?${params.toString()}`)
    if (res.status === 404) throw new Error('NOT_AVAILABLE')
    if (!res.ok) throw new Error('Errore nel recupero dello stato del treno')
    return res.json()
  }
}
