import './banner.scss'
import rafThrottle from 'raf-throttle'

export function makeBanner (type, { text, backgroundColor, textColor }) {
  const banner = document.createElement('div')
  banner.classList.add('prod-guard', 'banner', type)
  banner.textContent = text
  banner.style.color = `#${textColor}`
  banner.style.backgroundColor = `#${backgroundColor}`
  document.body.append(banner)

  let bannerBox
  function updateBannerBox () {
    bannerBox = banner.getBoundingClientRect()
  }
  window.addEventListener('resize', updateBannerBox)
  updateBannerBox()

  function updateOpacity (event) {
    const distance = vertialDistance(bannerBox, event.clientY)

    const threshold = bannerBox.height * 2
    const opacity = Math.min(distance, threshold) / threshold

    banner.style.opacity = opacity
  }
  document.addEventListener('mousemove', rafThrottle(updateOpacity))

  return banner
}

function vertialDistance (box, y) {
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
