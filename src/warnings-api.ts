import { type Warning } from './warnings'

type WarningId = Warning['id']

export interface WarningsApi {
  getAllWarnings: () => Promise<Warning[]>
  getWarning: (req: { id: WarningId }) => Promise<Warning>
  addWarning: (req: { warning: Warning }) => Promise<void>
  updateWarning: (req: { id: WarningId; warning: Warning }) => Promise<void>
  removeWarning: (req: { id: WarningId }) => Promise<void>
}
