import './content-script.scss'

const warnings = {
  border () {
    document.body.style.border = '3px solid red'
  },

  topBanner (site) {
    makeBanner('top', site.warningText)
  },

  bottomBanner (site) {
    makeBanner('bottom', site.warningText)
  }
}

main()

async function main () {
  if (window.prodGuardHasRun) {
    return
  }

  window.prodGuardHasRun = true

  const sites = window.prodGuardSites || []

  for (const site of sites) {
    const warningFn = warnings[site.warningStyle]
    if (warningFn) {
      warningFn(site)
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
