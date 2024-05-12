export async function applyMigrations(
  migrations: ((data: any) => Promise<any>)[],
  storageData: any,
): Promise<[boolean, any]> {
  let hasMigrated = false
  let res = storageData

  const startVersion = res.dataVersion ?? 0
  if (typeof startVersion !== 'number') {
    throw TypeError(
      'Invalid storage data. Expected storageData.dataVersion to be a number ' +
        `but it was a ${typeof startVersion}`,
    )
  }

  let version
  for (version = startVersion; version < migrations.length; version += 1) {
    hasMigrated = true
    const migrate = migrations[version]
    res = await migrate(res)
  }

  return [hasMigrated, { ...res, dataVersion: version }]
}
