import browser from 'webextension-polyfill'
import { State } from './state'
import { migrateStorageData } from './migrations'
import { allDataSchema } from '../schema'

export async function setupState(): Promise<void> {
  console.log('setting up storage')

  const rawStorageData = (await browser.storage.sync.get()) ?? {}
  const [hasMigrated, storageData] = migrateStorageData(rawStorageData)

  if (hasMigrated) {
    console.log('storage data was migrated')
    console.log('previous storage data:', rawStorageData)
    console.log('new storage data:', storageData)
    console.log('replacing all existing storage data with new storage data')
    await browser.storage.sync.clear()
    await browser.storage.sync.set(storageData)
    console.log('storage data migration is done')
  }

  console.log('done setting up storage')
}

export async function loadState(): Promise<State> {
  console.log('loading state from storage')
  const rawState = allDataSchema.parse(await browser.storage.sync.get())
  const state = new State(rawState)
  return state
}

export async function saveState(state: State): Promise<void> {
  console.log('saving state to storage')
  const data = state.exportAllData()
  await browser.storage.sync.set(data)
}
