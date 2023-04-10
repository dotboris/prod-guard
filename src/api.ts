import { type WarningWithId, type Warning } from './warnings'

export interface ApiCallMeta<Request, Response> {
  req: Request
  res: Response
}

interface ApiCallMap {
  getAllWarnings: { req: {}; res: WarningWithId[] }
  getWarning: { req: { id: string }; res: WarningWithId | undefined }
  addWarning: { req: { warning: Warning }; res: undefined }
  updateWarning: { req: { id: string; warning: Warning }; res: undefined }
  removeWarning: { req: { id: string }; res: undefined }
}

export type ApiCallName = keyof ApiCallMap
export type ApiCallRequest<Name extends ApiCallName> =
  ApiCallMap[Name]['req'] & { type: Name }
export type ApiCallResponse<Name extends ApiCallName> = ApiCallMap[Name]['res']
export type ApiCall<Name extends ApiCallName> = (
  req: ApiCallRequest<Name>
) => Promise<ApiCallResponse<Name>>

// export type ApiCallByName = ApiCallMap[keyof ApiCallMap]['req']

// export type GetAllWarningsApiCall = (req: {
//   type: 'getAllWarnings'
// }) => Promise<WarningWithId[]>
// export type GetWarningApiCall = (req: {
//   type: 'getWarning'
//   id: string
// }) => Promise<WarningWithId | undefined>
// export type AddWarningApiCall = (req: {
//   type: 'addWarning'
//   warning: Warning
// }) => Promise<undefined>
// export type UpdateWarningApiCall = (req: {
//   type: 'updateWarning'
//   id: string
//   warning: Warning
// }) => Promise<undefined>
// export type RemoveWarningApiCall = (req: {
//   type: 'removeWarning'
//   id: string
// }) => Promise<undefined>

// export type ApiCall =
//   | GetAllWarningsApiCall
//   | GetWarningApiCall
//   | AddWarningApiCall
//   | UpdateWarningApiCall
//   | RemoveWarningApiCall

// export type ApiCall =
//   | ((req: { type: 'getAllWarnings' }) => Promise<WarningWithId[]>)
//   | ((req: { type: 'getWarning'; id: string }) => Promise<WarningWithId | null>)
//   | ((req: { type: 'addWarning'; warning: Warning }) => Promise<void>)
//   | ((req: {
//       type: 'updateWarning'
//       id: string
//       warning: Warning
//     }) => Promise<void>)
//   | ((req: { type: 'removeWarning'; id: string }) => Promise<void>)
