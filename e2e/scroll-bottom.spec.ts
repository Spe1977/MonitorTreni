import { test, expect } from '@playwright/test'

const mockSuggestion = [
  {
    number: '9618',
    originName: 'Roma Termini',
    id: 'mock-id',
    originId: 'S08409',
    departureTimestamp: '1715731200000'
  }
]

function makeStop(name: string) {
  return {
    stazione: name,
    arrivoTeorico: 1715731200000,
    partenzaTeorica: 1715731200000,
    arrivoReale: null,
    partenzaReale: null,
    ritardoArrivo: 0,
    ritardoPartenza: 0,
    isPartenzaEffettuata: false,
    isArrivoEffettuato: false
  }
}

const fermate = [
  'Roma Termini',
  'Roma Tiburtina',
  'Firenze SMN',
  'Bologna Centrale',
  'Reggio Emilia AV',
  'Milano Rogoredo',
  'Milano Centrale',
  'Como S. Giovanni',
  'Chiasso',
  'Lugano',
  'Bellinzona',
  'Zurigo Stazione Finale Molto Lunga'
].map(makeStop)

const mockStatus = {
  compNumeroTreno: '9618',
  origine: 'Roma Termini',
  destinazione: 'Zurigo Stazione Finale Molto Lunga',
  ritardo: 0,
  orarioPartenza: 1715731200000,
  orarioArrivo: 1715760000000,
  categoria: 'FR',
  categoriaDescrizione: 'Frecciarossa',
  fermate,
  compOrarioPartenzaZeroEffettivo: '08:00',
  compOrarioArrivoZeroEffettivo: '16:00'
}

test('last station is visible above bottom nav after scrolling', async ({ page }) => {
  await page.route('**/api/train-autocomplete*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockSuggestion)
    })
  })
  await page.route('**/api/train-status*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockStatus)
    })
  })

  await page.goto('/')
  await page.getByPlaceholder('Numero treno (es. 9618)').fill('9618')
  await page.getByRole('button', { name: /Cerca treno/i }).click()

  const lastStation = page.getByText('Zurigo Stazione Finale Molto Lunga').first()
  await expect(lastStation).toBeVisible()

  // scroll the main to the bottom
  await page.evaluate(() => {
    const main = document.querySelector('main')!
    main.scrollTop = main.scrollHeight
  })
  await page.waitForTimeout(300)

  // capture geometry
  const info = await page.evaluate(() => {
    const lastNode = Array.from(document.querySelectorAll('h4')).find((el) =>
      el.textContent?.includes('Zurigo Stazione Finale Molto Lunga')
    )!
    const nav = document.querySelector('nav.fixed')!
    return {
      lastBottom: lastNode.getBoundingClientRect().bottom,
      navTop: nav.getBoundingClientRect().top
    }
  })

  // The bottom of the last station label must stay above the top of the bottom nav.
  expect(info.lastBottom).toBeLessThanOrEqual(info.navTop)
})
