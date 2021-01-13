import { reportScroll } from '../../reporter.js'

const panels = Array.from(document.querySelectorAll('.carousel-item'))

const carousel = document.querySelector('.carousel')
carousel.addEventListener('scroll', reportScroll({
  direction: 'horizontal',
  name: '--carousel-scroll',
  interpolations: [
    ...panels.map((panel, panelIndex) => ({
      name: '--panel-activation-1',
      scope: panel,
      inputRange() {
        return panels.map(p => p.offsetLeft - carousel.offsetLeft)
      },
      outputRange: panels.map((p, i) => i === panelIndex ? 1 : 0)
    }))
  ]
}))
