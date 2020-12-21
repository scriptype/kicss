;(() => {
  const tabs = Array.from(document.querySelectorAll('.tab'))
  const panels = Array.from(document.querySelectorAll('.panel'))

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      panels[index].scrollIntoView()
    })
  })

  const { reportVariable, reportScroll } = window.InteractionReporter
  reportVariable('--tabline-position', tabs[0].offsetTop - tabs[0].offsetHeight / 2)

  const slider = document.querySelector('.content')
  slider.addEventListener('scroll', reportScroll({
    direction: 'vertical',
    name: '--slider-scroll',
    interpolations: [
      {
        name: '--tabline-position',
        inputRange() {
          return panels.map((panel, i) => panel.offsetTop)
        },
        outputRange() {
          return tabs.map((tab) => tab.offsetTop - tab.offsetHeight / 2)
        }
      }
    ]
  }))
})()
