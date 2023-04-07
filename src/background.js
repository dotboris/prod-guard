import browser from 'webextension-polyfill'
import { migrateStorageData, migrations } from './migrations'
import * as WarningsDB from './warnings-db'

let warningsDb

setup()

async function setup() {
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
  browser.tabs.onUpdated.addListener(onTabChange)

  console.log('setup is done')
}

async function saveWarnings() {
  console.log('saving warnings to storage')
  const warnings = WarningsDB.getAll(warningsDb)
  await browser.storage.sync.set({ warnings })
}

/** @type {import('./warnings-api').WarningsApi} */
const api = {
  async getAllWarnings() {
    return WarningsDB.getAll(warningsDb)
  },

  async getWarning({ id }) {
    return WarningsDB.get(warningsDb, id)
  },

  async addWarning({ warning }) {
    WarningsDB.add(warningsDb, warning)
    await saveWarnings()
  },

  async updateWarning({ id, warning }) {
    WarningsDB.update(warningsDb, id, warning)
    await saveWarnings()
  },

  async removeWarning({ id }) {
    WarningsDB.remove(warningsDb, id)
    await saveWarnings()
  },
}

function onMessage(message, sender) {
  const type = message.type

  if (Object.hasOwnProperty.call(api, type)) {
    return api[type](message, sender)
  }
}

async function onTabChange(tabId, { status }, tab) {
  if (status !== 'complete') {
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
