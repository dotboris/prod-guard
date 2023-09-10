import { v4 as uuidV4 } from 'uuid'
import { type StateVersions } from './state-versions'

export type MigrateFunc<
  CurrentVersion extends keyof StateVersions,
  TargetVersion extends keyof StateVersions,
> = TargetVersion extends 0
  ? never
  : (
      data: StateVersions[CurrentVersion],
    ) => Promise<Omit<StateVersions[TargetVersion], 'dataVersion'>>

export type MigrationFuncs = [
  MigrateFunc<0, 1>,
  MigrateFunc<1, 2>,
  MigrateFunc<2, 3>,
]

export const migrations: MigrationFuncs = [
  async (data) => ({
    warnings: data.sites ?? [],
  }),
  async (data) => {
    return {
      ...data,
      warnings: data.warnings.map((warning) => {
        switch (warning.warningStyle) {
          case 'topBanner':
          case 'bottomBanner':
            return {
              pattern: warning.pattern,
              text: warning.text ?? 'Warning! This is Production!',
              backgroundColor: warning.backgroundColor ?? 'FF0000',
              textColor: warning.text ?? 'FFFFFF',
              warningStyle: warning.warningStyle,
            }
          case 'border':
            return {
              pattern: warning.pattern,
              borderColor: warning.borderColor ?? 'FF0000',
              warningStyle: 'border',
            }
          default:
            throw new Error(`Failed`)
        }
      }),
    }
  },
  async (data) => {
    const ids = new Set()

    function generateId(): string {
      let candidate
      do {
        candidate = uuidV4()
      } while (ids.has(candidate))

      ids.add(candidate)
      return candidate
    }

    return {
      ...data,
      warnings: data.warnings.map((warning) => ({
        ...warning,
        id: generateId(),
      })),
    }
  },
]
