import browser, { type Tabs } from 'webextension-polyfill'
import { migrateStorageData, migrations } from './migrations'
import * as WarningsDB from './warnings-db'
import { type ApiCall } from './api'

let warningsDb: any

setup().catch((error) => {
  console.error('ProdGuard background script failed to start', error)
})

async function setup(): Promise<void> {
  console.log('starting setup')

  const rawStorageData = (await browser.storage.sync.get()) ?? {}
  const [hasMigrated, storageData] = await migrateStorageData(
    migrations,
    rawStorageData
  )

  if (hasMigrated) {
    console.log('storage data was migrated')
    console.log('previous storage data:', rawStorageData)
    console.log('new storage data:', storageData)
    console.log('replacing all existing storage data with new storage data')
    await browser.storage.sync.clear()
    await browser.storage.sync.set(storageData)
    console.log('storage data migration is done')
  }

  console.log('initializing warnings database from storage data')
  warningsDb = WarningsDB.createDb()
  WarningsDB.importAll(warningsDb, storageData.warnings)

  console.log('registering event listeners')
  browser.runtime.onMessage.addListener(onMessage)
  browser.tabs.onUpdated.addListener((...args) => {
    onTabChange(...args).catch((error) => {
      console.error('onTabChange failed with error', error)
    })
  })

  console.log('setup is done')
}

async function saveWarnings(): Promise<void> {
  console.log('saving warnings to storage')
  const warnings = WarningsDB.getAll(warningsDb)
  await browser.storage.sync.set({ warnings })
}

const onMessage: ApiCall = async (message) => {
  switch (message.type) {
    case 'getAllWarnings': {
      return WarningsDB.getAll(warningsDb)
    }
    case 'getWarning': {
      return WarningsDB.get(warningsDb, message.id)
    }
    case 'addWarning': {
      WarningsDB.add(warningsDb, message.warning)
      await saveWarnings()
      break
    }
    case 'updateWarning': {
      WarningsDB.update(warningsDb, message.id, message.warning)
      await saveWarnings()
      break
    }
    case 'removeWarning': {
      WarningsDB.remove(warningsDb, message.id)
      await saveWarnings()
      break
    }
  }
}

async function onTabChange(
  tabId: number,
  { status }: Tabs.OnUpdatedChangeInfoType,
  tab: Tabs.Tab
): Promise<void> {
  if (status !== 'complete') {
    return
  }

  if (tab.url === undefined) {
    return
  }

  const warnings = WarningsDB.findMatching(warningsDb, tab.url)
  if (warnings.length > 0) {
    await browser.tabs.executeScript(tabId, {
      code: `window.prodGuardWarnings = ${JSON.stringify(warnings)};`,
    })
    await browser.tabs.executeScript(tabId, { file: 'content-script.js' })

    console.log(`Loaded content script into ${tab.url} (tabId: ${tabId})`)
  }
}
