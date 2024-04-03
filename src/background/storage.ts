import browser from 'webextension-polyfill'
import { State } from './state'
import { migrateStorageData } from './migrations'

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

export async function saveAllData(state: State): Promise<void> {
  console.log('saving all data to storage')
  const data = state.exportAllData()
  await browser.storage.sync.set(data)
}
