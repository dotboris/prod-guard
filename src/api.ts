import { type WarningWithId, type Warning } from './warnings'

export type GetAllWarningsApiCall = (req: {
  type: 'getAllWarnings'
}) => Promise<WarningWithId[]>

export type GetWarningApiCall = (req: {
  type: 'getWarning'
  id: string
}) => Promise<WarningWithId | undefined>

export type AddWarningApiCall = (req: {
  type: 'addWarning'
  warning: Warning
}) => Promise<undefined>

export type UpdateWarningApiCall = (req: {
  type: 'updateWarning'
  id: string
  warning: Warning
}) => Promise<undefined>

export type RemoveWarningApiCall = (req: {
  type: 'removeWarning'
  id: string
}) => Promise<undefined>

export type ApiCall =
  | GetAllWarningsApiCall
  | GetWarningApiCall
  | AddWarningApiCall
  | UpdateWarningApiCall
  | RemoveWarningApiCall
