import './banner.scss'
import rafThrottle from 'raf-throttle'
import { type BannerWarning } from '../schema'

const BANNER_CLASS = {
  bottomBanner: 'bottom',
  topBanner: 'top',
} as const

interface BannerState {
  mouseInWindow: boolean
  mouseX: number
  mouseY: number
  bannerBox: DOMRect
}

export function makeBanner({
  warningStyle,
  text,
  backgroundColor,
  textColor,
}: BannerWarning): void {
  const banner = document.createElement('div')
  banner.classList.add('prod-guard', 'banner', BANNER_CLASS[warningStyle])
  banner.textContent = text
  banner.style.color = `#${textColor}`
  banner.style.backgroundColor = `#${backgroundColor}`
  document.body.append(banner)

  const state: BannerState = {
    mouseInWindow: true,
    mouseX: 0,
    mouseY: 0,
    bannerBox: banner.getBoundingClientRect(),
  }

  const setOpacity = rafThrottle((opacity) => {
    banner.style.opacity = opacity
  })

  function update(newState: Partial<BannerState>): void {
    Object.assign(state, newState)

    if (state.mouseInWindow) {
      const distance = verticalDistance(state.bannerBox, state.mouseY)

      const threshold = state.bannerBox.height * 2
      const opacity = Math.min(distance, threshold) / threshold

      setOpacity(opacity)
    } else {
      setOpacity(1)
    }
  }

  window.addEventListener('resize', () => {
    update({
      bannerBox: banner.getClientRects()[0],
    })
  })
  document.addEventListener('mousemove', (event) => {
    update({
      mouseX: event.clientX,
      mouseY: event.clientY,
    })
  })
  document.documentElement.addEventListener('mouseenter', () => {
    update({
      mouseInWindow: true,
    })
  })
  document.documentElement.addEventListener('mouseleave', () => {
    update({
      mouseInWindow: false,
    })
  })
}

function verticalDistance(box: DOMRect, y: number): number {
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
