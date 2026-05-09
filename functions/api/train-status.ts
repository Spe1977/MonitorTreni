export const onRequest: PagesFunction = async (context) => {
  const { request } = context
  const url = new URL(request.url)
  const origin = url.searchParams.get('origin')
  const train = url.searchParams.get('train')
  const date = url.searchParams.get('date')

  if (!origin || !train || !date) {
    return new Response(JSON.stringify({ error: 'Missing parameters (origin, train, date)' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const vtResponse = await fetch(
      `http://www.viaggiatreno.it/infomobilitamobile/resteasy/viaggiatreno/andamentoTreno/${encodeURIComponent(origin)}/${encodeURIComponent(train)}/${encodeURIComponent(date)}`
    )

    // 204 No Content = treno non in circolazione per quella data
    if (vtResponse.status === 204) {
      return new Response(JSON.stringify({ error: 'NOT_AVAILABLE' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!vtResponse.ok) {
      throw new Error(`Viaggiatreno API error: ${vtResponse.status}`)
    }

    const data = (await vtResponse.json()) as {
      fermate?: Array<Record<string, unknown>>
      [k: string]: unknown
    }

    // Normalize fermate[]: ViaggiaTreno returns snake_case fields and omits status flags
    if (Array.isArray(data?.fermate)) {
      data.fermate = data.fermate.map((stop) => ({
        ...stop,
        arrivoTeorico: stop.arrivoTeorico ?? stop.arrivo_teorico ?? null,
        partenzaTeorica: stop.partenzaTeorica ?? stop.partenza_teorica ?? null,
        isPartenzaEffettuata: stop.partenzaReale != null,
        isArrivoEffettuato: stop.arrivoReale != null
      }))
    }

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
