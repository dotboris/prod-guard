import browser from 'webextension-polyfill'
import { State } from './state'
import { publicProcedure, router } from './trpc'
import { createChromeHandler } from 'trpc-chrome/adapter'
import { migrateStorageData } from './migrations'
import { z } from 'zod'
import { allDataSchema, warningSchema } from '../schema'

export async function setupState(): Promise<State> {
  console.log('starting setup')

  const rawStorageData = (await browser.storage.sync.get()) ?? {}
  const [hasMigrated, storageData] = await migrateStorageData(rawStorageData)

  if (hasMigrated) {
    console.log('storage data was migrated')
    console.log('previous storage data:', rawStorageData)
    console.log('new storage data:', storageData)
    console.log('replacing all existing storage data with new storage data')
    await browser.storage.sync.clear()
    await browser.storage.sync.set(storageData)
    console.log('storage data migration is done')
  }

  console.log('initializing state from storage data')

  console.log('setup is done')
  return new State(storageData)
}

async function saveAllData(state: State): Promise<void> {
  console.log('saving all data to storage')
  const data = state.exportAllData()
  await browser.storage.sync.set(data)
}

const state = await setupState()

const appRouter = router({
  warnings: router({
    list: publicProcedure.query(({ ctx }) => ctx.state.getAllWarnings()),
    get: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(({ ctx, input }) => ctx.state.getWarning(input.id)),
    add: publicProcedure
      .input(
        z.object({
          warning: warningSchema,
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const res = ctx.state.addWarning(input.warning)
        await saveAllData(ctx.state)
        return res
      }),
    update: publicProcedure
      .input(
        z.object({
          id: z.string(),
          warning: warningSchema,
        }),
      )
      .mutation(async ({ ctx, input }) => {
        ctx.state.updateWarning(input.id, input.warning)
        await saveAllData(ctx.state)
      }),
    remove: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const res = ctx.state.removeWarning(input.id)
        await saveAllData(ctx.state)
        return res
      }),
  }),
  exportAllData: publicProcedure.query(({ ctx }) => ctx.state.exportAllData()),
  importAllData: publicProcedure
    .input(z.object({ allData: allDataSchema }))
    .mutation(async ({ ctx, input }) => {
      ctx.state.importAllData(input.allData)
      await saveAllData(ctx.state)
    }),
})
export type AppRouter = typeof appRouter

createChromeHandler({
  router: appRouter,
  createContext: () => ({ state }),
  onError: (error: any) => {
    console.error('tRPC failed to start', error)
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
      await browser.tabs.executeScript(tabId, {
        code: `window.prodGuardWarnings = ${JSON.stringify(warnings)};`,
      })
      await browser.tabs.executeScript(tabId, { file: 'content-script.js' })

      console.log(`Loaded content script into ${tab.url} (tabId: ${tabId})`)
    }
  })()
})
