import { v4 as uuidV4 } from 'uuid'

export async function migrateStorageData (migrations, storageData) {
  let hasMigrated = false
  let res = storageData

  let dataVersion
  for (
    dataVersion = storageData.dataVersion ?? 0;
    dataVersion < migrations.length;
    dataVersion += 1
  ) {
    hasMigrated = true
    const migration = migrations[dataVersion]
    res = await migration(res)
  }

  return [hasMigrated, { ...res, dataVersion }]
}

export const migrations = [
  async data => ({ warnings: data.sites ?? [] }),
  async data => ({
    ...data,
    warnings: data.warnings.map(warning => {
      switch (warning.warningStyle) {
        case 'topBanner':
        case 'bottomBanner':
          return {
            ...warning,
            text: 'Warning! This is Production!',
            backgroundColor: 'FF0000',
            textColor: 'FFFFFF'
          }
        case 'border':
          return {
            ...warning,
            borderColor: 'FF0000'
          }
        default:
          return warning
      }
    })
  }),
  async data => {
    const ids = new Set()

    function generateId () {
      let candidate
      do {
        candidate = uuidV4()
      } while (ids.has(candidate))

      ids.add(candidate)
      return candidate
    }

    return {
      ...data,
      warnings: data.warnings.map(warning => ({
        ...warning,
        id: generateId()
      }))
    }
  }
]
