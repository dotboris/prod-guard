import browser from 'webextension-polyfill'
import { createChromeHandler } from 'trpc-chrome/adapter'
import { setupState } from './storage'
import { appRouter } from './router'

export type AppRouter = typeof appRouter

const state = await setupState()
createChromeHandler({
  router: appRouter,
  createContext: () => ({ state }),
  onError: (error: any) => {
    console.error('tRPC error', error)
  },
})

browser.tabs.onUpdated.addListener((tabId, { status }, tab) => {
  void (async () => {
    if (status !== 'complete') {
      return
    }

    if (tab.url === undefined) {
      return
    }

    const warnings = state.findMatchingWarnings(tab.url)
    if (warnings.length > 0) {
      await browser.scripting.executeScript({
        target: { tabId },
        args: [warnings],
        func: (warnings) => {
          window.prodGuardWarnings = warnings
        },
      })
      await browser.scripting.executeScript({
        target: { tabId },
        files: ['content-script.js'],
      })

      console.log(`Loaded content script into ${tab.url} (tabId: ${tabId})`)
    }
  })()
})
