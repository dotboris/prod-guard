import { type Warning } from './warnings'

export interface WarningsApi {
  getAllWarnings: () => Promise<Warning[]>
  getWarning: (req: { id: string }) => Promise<Warning>
  addWarning: (req: { warning: Warning }) => Promise<void>
  updateWarning: (req: { id: string; warning: Warning }) => Promise<void>
  removeWarning: (req: { id: string }) => Promise<void>
}
