import { type Warning } from './warnings'

export interface ApiCall {
  (req: { type: 'getAllWarnings' }): Promise<Warning[]>
  (req: { type: 'getWarning'; id: string }): Promise<Warning>
  (req: { type: 'addWarning'; warning: Warning }): Promise<void>
  (req: { type: 'updateWarning'; id: string; warning: Warning }): Promise<void>
  (req: { type: 'removeWarning'; id: string }): Promise<void>
}
