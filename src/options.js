import OptionsSync from 'webext-options-sync'

export default new OptionsSync({
  defaults: {
    sites: {}
  },
  migrations: [
    OptionsSync.migrations.removeUnused
  ]
})
