import { test, expect } from './fixtures'

test('popup with no warnings screenshot', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/popup.html`)
  await page.waitForURL(`chrome-extension://${extensionId}/`)
  await expect(page.locator('body')).toContainText('Prod Guard')
  await expect(page.locator('body')).toContainText("There's nothing here")
  await expect(page.getByTestId('layout-root')).toHaveScreenshot()
})

test('empty settings page screenshot', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/popup.html`)
  await page.waitForURL(`chrome-extension://${extensionId}/`)

  await page.getByRole('link', { name: 'Settings' }).click()
  await page.waitForURL(`chrome-extension://${extensionId}/settings`)
  await expect(page.locator('body')).toContainText('Settings')
  await expect(page.locator('body')).toContainText('dataVersion')

  await expect(page.getByTestId('layout-root')).toHaveScreenshot()
})
