import { type Warning, WarningStyle } from '../warnings'
import { makeBanner } from './banner'

main().catch((error) => {
  console.error('ProdGuard failed to initialize on this page', error)
})

interface Globals {
  prodGuardHasRun?: boolean
  prodGuardWarnings?: Warning[]
}

declare const window: Window & typeof globalThis & Globals

async function main(): Promise<void> {
  if (window.prodGuardHasRun ?? false) {
    return
  }

  window.prodGuardHasRun = true

  const warnings = window.prodGuardWarnings ?? []

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
