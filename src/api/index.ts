import { type ExportAllDataApiCall } from './data'
import {
  type GetAllWarningsApiCall,
  type GetWarningApiCall,
  type AddWarningApiCall,
  type UpdateWarningApiCall,
  type RemoveWarningApiCall,
} from './warnings'

export * from './warnings'
export * from './data'

export type ApiCall =
  | GetAllWarningsApiCall
  | GetWarningApiCall
  | AddWarningApiCall
  | UpdateWarningApiCall
  | RemoveWarningApiCall
  | ExportAllDataApiCall
