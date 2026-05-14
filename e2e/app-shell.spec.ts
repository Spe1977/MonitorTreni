import { test, expect } from '@playwright/test'

test.describe('App Shell', () => {
  test('renders the header and bottom navigation', async ({ page }) => {
    await page.goto('/')

    // Use .first() to match the first visible instance (mobile or desktop)
    await expect(page.getByText('Monitor', { exact: false }).first()).toBeVisible()
    await expect(page.getByRole('button', { name: /Stato Treno/i }).first()).toBeVisible()
    await expect(page.getByRole('button', { name: /Ricerca Viaggio/i }).first()).toBeVisible()
  })

  test('Stato Treno is the default view', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByPlaceholder('Numero treno (es. 9618)')).toBeVisible()
  })

  test('Ricerca Viaggio shows the work-in-progress placeholder', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('button', { name: /Ricerca Viaggio/i })
      .first()
      .click()

    await expect(page.getByText(/Funzionalità in fase di sviluppo/i)).toBeVisible()
  })

  test('shows error when train is not found', async ({ page }) => {
    await page.route('**/api/train-autocomplete*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      })
    })

    await page.goto('/')
    await page.getByPlaceholder('Numero treno (es. 9618)').fill('00000')
    await page.getByRole('button', { name: /Cerca treno/i }).click()

    await expect(page.getByText(/Treno non trovato/i)).toBeVisible()
  })
})
