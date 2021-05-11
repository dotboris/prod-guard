import './content-script.scss'

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

function makeBanner (type, { text, backgroundColor, textColor }) {
  const el = document.createElement('div')
  el.className = `__prod-guard-extension-${type}-banner`
  el.textContent = text
  el.style.color = textColor
  el.style.backgroundColor = backgroundColor

  document.body.append(el)

  return el
}
