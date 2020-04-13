import 'webextension-polyfill'
import 'content-scripts-register-polyfill'
import Options from './options'
import * as Sites from './sites'

let sitesDb

setup()

async function setup () {
  const options = await Options.getAll()

  sitesDb = Sites.createDb()
  Sites.addAll(sitesDb, options.sites)

  browser.runtime.onMessage.addListener(onMessage)
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
  }
}

function onMessage (message, sender) {
  const type = message.type

  if (Object.hasOwnProperty.call(api, type)) {
    return api[type](message, sender)
  }
}
