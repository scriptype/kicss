import { reportVariable, reportScroll } from '../../kicss.js'

const tabs = Array.from(document.querySelectorAll('.tab'))
const panels = Array.from(document.querySelectorAll('.panel'))

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    panels[index].scrollIntoView()
  })
})

reportVariable('--tabline-position', tabs[0].offsetTop - tabs[0].offsetHeight / 2)

const slider = document.querySelector('.content')
slider.addEventListener('scroll', reportScroll('--slider-scroll', {
  interpolations: [
    {
      name: '--tabline-position',
      inputRange() {
        return panels.map((p) => p.offsetTop)
      },
      outputRange() {
        return tabs.map((t) => t.offsetTop - t.offsetHeight / 2)
      }
    },
    ...panels.map((panel, panelIndex) => ({
      name: '--panel-activation-1',
      scope: panel,
      inputRange() {
        return panels.map(p => p.offsetTop)
      },
      outputRange: panels.map((p, i) => i === panelIndex ? 1 : 0)
    }))
  ]
}))
