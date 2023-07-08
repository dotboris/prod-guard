import './banner.scss'
import rafThrottle from 'raf-throttle'

export function makeBanner(type, { text, backgroundColor, textColor }) {
  const banner = document.createElement('div')
  banner.classList.add('prod-guard', 'banner', type)
  banner.textContent = text
  banner.style.color = `#${textColor}`
  banner.style.backgroundColor = `#${backgroundColor}`
  document.body.append(banner)

  const state = {
    mouseInWindow: true,
    mouseX: 0,
    mouseY: 0,
    bannerBox: banner.getBoundingClientRect(),
  }

  const setOpacity = rafThrottle((opacity) => {
    banner.style.opacity = opacity
  })

  function update(newState) {
    Object.assign(state, newState)

    if (state.mouseInWindow) {
      const distance = vertialDistance(state.bannerBox, state.mouseY)

      const threshold = state.bannerBox.height * 2
      const opacity = Math.min(distance, threshold) / threshold

      setOpacity(opacity)
    } else {
      setOpacity(1)
    }
  }

  window.addEventListener('resize', () =>
    update({
      bannerBox: banner.getClientRects(),
    }),
  )
  document.addEventListener('mousemove', (event) =>
    update({
      mouseX: event.clientX,
      mouseY: event.clientY,
    }),
  )
  document.documentElement.addEventListener('mouseenter', () =>
    update({
      mouseInWindow: true,
    }),
  )
  document.documentElement.addEventListener('mouseleave', () =>
    update({
      mouseInWindow: false,
    }),
  )

  return banner
}

function vertialDistance(box, y) {
  const topDistance = Math.abs(box.top - y)
  const bottomDistance = Math.abs(box.bottom - y)

  if (topDistance < box.height && bottomDistance < box.height) {
    // we are within the box
    return 0
  } else {
    // return the closest one
    return Math.min(topDistance, bottomDistance)
  }
}
