import browser, { type Tabs } from 'webextension-polyfill'
import { migrateStorageData, migrations } from '../migrations'
import { State } from '../state'

export async function setupService(): Promise<void> {
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

  console.log('initializing state from storage data')

  const state = new State(storageData.warnings)
  const service = new Service(state)
  service.start()

  console.log('setup is done')
}

export class Service {
  constructor(private readonly state: State) {}

  start(): void {
    console.log('registering event listeners')
    browser.runtime.onMessage.addListener(this.onMessage)
    browser.tabs.onUpdated.addListener((...args) => {
      this.onTabChange(...args).catch((error) => {
        console.error('onTabChange failed with error', error)
      })
    })
  }

  async saveWarnings(): Promise<void> {
    console.log('saving warnings to storage')
    await browser.storage.sync.set({
      dataVersion: this.state.dataVersion,
      warnings: this.state.getAllWarnings(),
    })
  }

  async onMessage(message: any): Promise<any> {
    switch (message.type) {
      case 'getAllWarnings':
        return this.state.getAllWarnings()
      case 'getWarning':
        return this.state.getWarning(message.id)
      case 'addWarning':
        this.state.addWarning(message.warning)
        await this.saveWarnings()
        break
      case 'updateWarning':
        this.state.updateWarning(message.id, message.warning)
        await this.saveWarnings()
        break
      case 'removeWarning':
        this.state.removeWarning(message.id)
        await this.saveWarnings()
        break
    }
  }

  async onTabChange(
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

    const warnings = this.state.findMatchingWarnings(tab.url)
    if (warnings.length > 0) {
      await browser.tabs.executeScript(tabId, {
        code: `window.prodGuardWarnings = ${JSON.stringify(warnings)};`,
      })
      await browser.tabs.executeScript(tabId, { file: 'content-script.js' })

      console.log(`Loaded content script into ${tab.url} (tabId: ${tabId})`)
    }
  }
}
