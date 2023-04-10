export enum WarningStyle {
  Border = 'border',
  TopBanner = 'topBanner',
  BottomBanner = 'bottomBanner',
}

interface WarningBase {
  /**
   * Regular expression controlling where the warning is shown.
   * It's matched against a tab's URL.
   */
  pattern: string
}

export interface BorderWarning extends WarningBase {
  warningStyle: WarningStyle.Border
  borderColor: string
}

export interface BannerWarning extends WarningBase {
  warningStyle: WarningStyle.TopBanner | WarningStyle.BottomBanner
  text: string
  backgroundColor: string
  textColor: string
}

export type Warning = BorderWarning | BannerWarning

export type WarningWithId = { id: string } & Warning
