import browser from 'webextension-polyfill'
import Options from './options'
import * as Sites from './sites'

let sitesDb

setup()

async function setup () {
  const options = await Options.getAll()

  sitesDb = Sites.createDb()
  Sites.addAll(sitesDb, options.sites)

  browser.runtime.onMessage.addListener(onMessage)
  browser.tabs.onUpdated.addListener(onTabChange, { properties: ['status'] })
}

async function saveSites () {
  const sites = Sites.getAll(sitesDb)
  await Options.set({ sites })
}

const api = {
  async getAllSites () {
    return Sites.getAll(sitesDb)
  },

  async getSite ({ id }) {
    return Sites.get(sitesDb, id)
  },

  async addSite ({ site }) {
    Sites.add(sitesDb, site)
    await saveSites()
  },

  async updateSite ({ id, site }) {
    Sites.update(sitesDb, id, site)
    await saveSites()
  },

  async removeSite ({ id }) {
    Sites.remove(sitesDb, id)
    await saveSites()
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

  const sites = Sites.findMatching(sitesDb, tab.url)
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
