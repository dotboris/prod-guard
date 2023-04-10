import { type WarningWithId, type Warning } from './warnings'

export interface ApiCall {
  (req: { type: 'getAllWarnings' }): Promise<WarningWithId[]>
  (req: { type: 'getWarning'; id: string }): Promise<WarningWithId | undefined>
  (req: { type: 'addWarning'; warning: Warning }): Promise<undefined>
  (req: {
    type: 'updateWarning'
    id: string
    warning: Warning
  }): Promise<undefined>
  (req: { type: 'removeWarning'; id: string }): Promise<undefined>
}
