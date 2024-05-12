import { z } from 'zod'
import { AllData } from '../../schema'

const baseStorageDataSchema = z.object({
  dataVersion: z.number().optional().default(0),
})

export function applyMigrations(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  migrations: ((data: any) => any)[],
  storageData: unknown,
): [boolean, AllData] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let res: any = storageData
  const startVersion = baseStorageDataSchema.parse(storageData).dataVersion

  let version
  let hasMigrated = false
  for (version = startVersion; version < migrations.length; version += 1) {
    hasMigrated = true
    const migrate = migrations[version]
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    res = migrate(res)
  }

  return [hasMigrated, { ...res, dataVersion: version } as AllData]
}
