import { reportVariable, reportScroll } from '../../kicss.js'

const tabs = Array.from(document.querySelectorAll('.tab'))
const panels = Array.from(document.querySelectorAll('.carousel-item'))
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    panels[index].scrollIntoView()
  })
})

reportVariable('--items', panels.length)
reportVariable('--tabline-position', tabs[0].offsetLeft + tabs[0].offsetWidth / 2)
reportVariable('--active-tab-width', tabs[0].offsetWidth)

const carousel = document.querySelector('.carousel')
carousel.addEventListener('scroll', reportScroll({
  direction: 'horizontal',
  name: '--carousel-scroll',
  interpolations: [
    {
      name: '--tabline-position',
      inputRange() {
        return panels.map((panel, i) => panel.offsetWidth * i)
      },
      outputRange() {
        return tabs.map((tab) => tab.offsetLeft + tab.offsetWidth / 2)
      }
    },
    {
      name: '--active-tab-width',
      inputRange() {
        return panels.map((panel, i) => panel.offsetWidth * i)
      },
      outputRange() {
        return tabs.map((tab) => tab.offsetWidth)
      }
    }
  ]
}))
