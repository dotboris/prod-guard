export enum WarningStyle {
  Border = 'border',
  TopBanner = 'topBanner',
  BottomBanner = 'bottomBanner',
}

interface WarningBase {
  id: string
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
