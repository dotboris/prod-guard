import 'webextension-polyfill'
import 'content-scripts-register-polyfill'
import OptionsSync from 'webext-options-sync'

const CONTENT_SCRIPTS = new Map()

const OPTIONS = new OptionsSync({
  defaults: {
    sites: {}
  },
  migrations: [
    OptionsSync.migrations.removeUnused
  ]
})

setup()

async function setup () {
  const options = await OPTIONS.getAll();
  await syncContentScripts(options.sites)
}

async function syncContentScripts (sites) {
  let keys = Object.keys(CONTENT_SCRIPTS)
  keys = keys.concat(Object.keys(sites))
  keys = new Set(keys)

  for (const key of keys) {
    // Unregister the old one
    if (CONTENT_SCRIPTS.has(key)) {
      const script = CONTENT_SCRIPTS.get(key)
      script.unregister()
      CONTENT_SCRIPTS.delete(key)
    }

    // Register the new one
    if (sites.hasOwnProperty(key)) {
      const site = sites[key]

      const scriptHandle = await browser.contentScripts.register({
        js: 'content-script.js',
        matches: site.pattern
      })

      CONTENT_SCRIPTS[key] = scriptHandle
    }
  }
}
