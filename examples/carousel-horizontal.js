;(() => {
  const tabsContainer = document.querySelector('.tabs')
  const tabs = Array.from(document.querySelectorAll('.tab'))
  const panels = Array.from(document.querySelectorAll('.carousel-item'))
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      panels[index].scrollIntoView()
    })
  })

  const { reportVariable, reportScroll } = window.InteractionReporter
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
        inputRange: panels.map((panel, i) => panel.offsetWidth * i),
        outputRange: tabs.map((tab) => tab.offsetLeft + tab.offsetWidth / 2)
      }
    ]
  }))
})()
