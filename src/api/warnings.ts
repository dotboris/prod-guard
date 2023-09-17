/**
 * Pseudo enum that represents that represents the various warning styles. This
 * is means to avoid having to write strings all over the code.
 */
export const WarningStyle = {
  Border: 'border',
  TopBanner: 'topBanner',
  BottomBanner: 'bottomBanner',
} as const

interface WarningBase {
  /**
   * Regular expression controlling where the warning is shown.
   * It's matched against a tab's URL.
   */
  pattern: string
}

export interface BorderWarning extends WarningBase {
  warningStyle: typeof WarningStyle.Border
  borderColor: string
}

export interface BannerWarning extends WarningBase {
  warningStyle: typeof WarningStyle.TopBanner | typeof WarningStyle.BottomBanner
  text: string
  backgroundColor: string
  textColor: string
}

export type Warning = BorderWarning | BannerWarning

export type WarningWithId = { id: string } & Warning

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
