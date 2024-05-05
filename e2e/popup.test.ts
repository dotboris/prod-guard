import { test, expect } from './fixtures'

test.beforeEach(async ({ page, popupUrl }) => {
  await page.goto(popupUrl)
})

test('popup with no warnings screenshot', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Prod Guard' })).toBeVisible()
  await expect(page.getByText("There's nothing here.")).toBeVisible()
})

test('empty settings page screenshot', async ({ page }) => {
  await page.getByRole('link', { name: 'Settings' }).click()
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
  await expect(page.getByText(/"dataVersion": *\d/)).toBeVisible()

  await expect(page.getByTestId('layout-root')).toHaveScreenshot()
})
