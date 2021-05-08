import browser from 'webextension-polyfill'
import * as Warnings from './warnings'

let warningsDb

setup()

async function setup () {
  const { sites = [] } = await browser.storage.sync.get('sites')

  warningsDb = Warnings.createDb()
  Warnings.addAll(warningsDb, sites)

  browser.runtime.onMessage.addListener(onMessage)
  browser.tabs.onUpdated.addListener(onTabChange)
}

async function saveWarnings () {
  const sites = Warnings.getAll(warningsDb)
  await browser.storage.sync.set({ sites })
}

const api = {
  async getAllWarnings () {
    return Warnings.getAll(warningsDb)
  },

  async getWarning ({ id }) {
    return Warnings.get(warningsDb, id)
  },

  async addWarning ({ warning }) {
    Warnings.add(warningsDb, warning)
    await saveWarnings()
  },

  async updateWarning ({ id, warning }) {
    Warnings.update(warningsDb, id, warning)
    await saveWarnings()
  },

  async removeWarning ({ id }) {
    Warnings.remove(warningsDb, id)
    await saveWarnings()
  }
}

function onMessage (message, sender) {
  const type = message.type

  if (Object.hasOwnProperty.call(api, type)) {
    return api[type](message, sender)
  }
}

async function onTabChange (tabId, { status }, tab) {
  if (status !== 'complete') {
    return
  }

  const sites = Warnings.findMatching(warningsDb, tab.url)
  if (sites.length > 0) {
    await browser.tabs.executeScript(
      tabId,
      { code: `window.prodGuardSites = ${JSON.stringify(sites)};` }
    )
    await browser.tabs.executeScript(
      tabId,
      { file: 'content-script.js' }
    )

    console.log(`Loaded content script into ${tab.url} (tabId: ${tabId})`)
  }
}
