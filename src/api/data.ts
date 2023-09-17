import { type WarningWithId } from './warnings'

/**
 * Current data version. The state is versioned using a number. The first
 * version is `0` and gets incremented with every upgrade.
 */
export const CURRENT_DATA_VERSION = 3

export interface AllData {
  dataVersion: typeof CURRENT_DATA_VERSION
  warnings: WarningWithId[]
}

export type ExportAllDataApiCall = (req: {
  type: 'exportAllData'
}) => Promise<AllData>
