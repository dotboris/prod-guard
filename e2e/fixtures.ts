import { test as base, chromium, type BrowserContext } from '@playwright/test'
import path from 'path'

export const test = base.extend<{
  context: BrowserContext
  extensionId: string
}>({
  // eslint-disable-next-line no-empty-pattern
  context: async ({}, use) => {
    const pathToExtension = path.join(import.meta.dirname, '../dist')
    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,

        // Turn off a bunch of font stuff to normalize screenshots
        '--font-render-hinting=none',
        '--disable-skia-runtime-opts',
        '--disable-font-subpixel-positioning',
        '--disable-lcd-text',
      ],
    })
    await use(context)
    await context.close()
  },
  extensionId: async ({ context }, use) => {
    // for manifest v2:
    // let [background] = context.backgroundPages()
    // if (background == null) {
    //   background = await context.waitForEvent('backgroundpage')
    // }

    // for manifest v3:
    let [background] = context.serviceWorkers()
    if (background == null) {
      background = await context.waitForEvent('serviceworker')
    }

    const extensionId = background.url().split('/')[2]
    await use(extensionId)
  },
})
export const expect = test.expect
