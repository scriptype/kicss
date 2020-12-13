;(() => {
  const tabs = document.querySelectorAll('.tab')
  const panels = document.querySelectorAll('.carousel-item')
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
      panels[index].scrollIntoView()
    })
  })

  const { reportScroll } = window.InteractionReporter
  const carousel = document.querySelector('.carousel')
  carousel.addEventListener('scroll', reportScroll({
    direction: 'horizontal',
    name: '--carousel-scroll'
  }))
})()
