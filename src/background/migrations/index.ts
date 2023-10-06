import { type CURRENT_DATA_VERSION } from '../../schema'
import { applyMigrations } from './apply-migrations'
import { migrations } from './migrations'
import { type StateVersions } from './state-versions'

export async function migrateStorageData(
  storageData: any,
): Promise<[boolean, StateVersions[typeof CURRENT_DATA_VERSION]]> {
  return await applyMigrations(migrations, storageData)
}
