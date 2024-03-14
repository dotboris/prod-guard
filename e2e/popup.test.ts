import { test, expect } from './fixtures'

test('popup with no warnings screenshot', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/popup.html`)
  await expect(page.locator('body')).toContainText('Prod Guard')
  await expect(page.getByTestId('layout-root')).toHaveScreenshot()
})

test('empty settings page screenshot', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/popup.html`)
  await expect(page.locator('body')).toContainText('Prod Guard')

  await page.getByRole('link', { name: 'Settings' }).click()
  await expect(page.locator('body')).toContainText('Settings')

  await expect(page.getByTestId('layout-root')).toHaveScreenshot()
})
