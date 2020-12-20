;(() => {
  const { reportScroll } = window.InteractionReporter
  const slider = document.querySelector('.content')
  slider.addEventListener('scroll', reportScroll({
    direction: 'vertical',
    name: '--slider-scroll'
  }))
})()
