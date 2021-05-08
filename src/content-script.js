import './content-script.scss'

const warningsFactories = {
  border () {
    document.body.style.border = '3px solid red'
  },

  topBanner () {
    makeBanner('top', 'Warning! This is production!')
  },

  bottomBanner () {
    makeBanner('bottom', 'Warning! This is production!')
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

function makeBanner (type, text) {
  const el = document.createElement('div')
  el.className = `__prod-guard-extension-${type}-banner`
  el.textContent = text

  document.body.append(el)

  return el
}
