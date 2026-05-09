export const onRequest: PagesFunction = async (context) => {
  const { request } = context
  const url = new URL(request.url)
  const term = url.searchParams.get('q')

  if (!term) {
    return new Response(JSON.stringify({ error: 'Missing train number' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const vtResponse = await fetch(
      `http://www.viaggiatreno.it/infomobilitamobile/resteasy/viaggiatreno/cercaNumeroTrenoTrenoAutocomplete/${encodeURIComponent(term)}`
    )

    if (vtResponse.status === 204) {
      return new Response(JSON.stringify([]), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!vtResponse.ok) {
      throw new Error(`Viaggiatreno API error: ${vtResponse.status}`)
    }

    const text = await vtResponse.text()
    const trains = text
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line) => {
        // Format: "NumeroTreno - Origine - DD/MM/YY|idTreno-idStazioneOrigine-timestampMs"
        // Example: "9618 - ROMA TERMINI - 09/05/26|9618-S08409-1778277600000"
        const [labelPart = '', idsPart = ''] = line.split('|')
        const labelSegments = labelPart.split(' - ')
        const idSegments = idsPart.split('-')

        return {
          number: labelSegments[0]?.trim(),
          originName: labelSegments[1]?.trim(),
          id: idSegments[0]?.trim(),
          originId: idSegments[1]?.trim(),
          departureTimestamp: idSegments[2]?.trim()
        }
      })

    return new Response(JSON.stringify(trains), {
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
