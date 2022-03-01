import { makeBanner } from './banner'

const warningsFactories = {
  border ({ borderColor }) {
    document.body.style.border = `3px solid #${borderColor}`
  },

  topBanner (warning) {
    makeBanner('top', warning)
  },

  bottomBanner (warning) {
    makeBanner('bottom', warning)
  }
}

main()

async function main () {
  if (window.prodGuardHasRun) {
    return
  }

  window.prodGuardHasRun = true

  const warnings = window.prodGuardWarnings || []

  for (const warning of warnings) {
    const warningFn = warningsFactories[warning.warningStyle]
    if (warningFn) {
      warningFn(warning)
    }
  }
}
