import browser from 'webextension-polyfill'
import { createChromeHandler } from 'trpc-chrome/adapter'
import { loadState, setupState } from './storage'
import { appRouter } from './router'

export type AppRouter = typeof appRouter

browser.runtime.onInstalled.addListener(() => {
  void setupState()
})

createChromeHandler({
  router: appRouter,
  createContext: async () => ({
    state: await loadState(),
  }),
  onError: (error: unknown) => {
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

    const state = await loadState()
    const warnings = state.findMatchingWarnings(tab.url)
    if (warnings.length > 0) {
      await browser.scripting.executeScript({
        target: { tabId },
        args: [warnings],
        func: (warnings) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
          ;(window as any).prodGuardWarnings = warnings
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
