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
  async data => ({ warnings: data.sites ?? [] })
]
