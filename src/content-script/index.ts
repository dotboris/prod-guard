import { Warning, WarningStyle } from '../warnings'
import { makeBanner } from './banner'

main()

interface Globals {
  prodGuardHasRun?: boolean
  prodGuardWarnings?: Warning[]
}

declare const window: Window & typeof globalThis & Globals

async function main(): Promise<void> {
  if (window.prodGuardHasRun) {
    return
  }

  window.prodGuardHasRun = true

  const warnings = window.prodGuardWarnings || []

  for (const warning of warnings) {
    switch (warning.warningStyle) {
      case WarningStyle.Border:
        document.body.style.border = `3px solid #${warning.borderColor}`
        break
      case WarningStyle.TopBanner:
      case WarningStyle.BottomBanner:
        makeBanner(warning)
        break
    }
  }
}
