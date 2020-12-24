;(() => {
  const { reportVariable, reportIndex } = window.InteractionReporter

  const content = document.querySelector('.content')
  for (let i = 0; i < 60; i++) {
    content.innerHTML += '<div class="item"></div>'
  }

  const rowLength = 20
  reportVariable('--row-length', rowLength, content)
  reportIndex('.item', {
    rowIndexBy: rowLength
  })

  ;[rotate, scale].forEach(option => {
    option.addEventListener('click', e => {
      if (scale.checked) {
        content.classList.remove('rotate')
        content.classList.add('scale')
      } else  {
        content.classList.remove('scale')
        content.classList.add('rotate')
      }
    })
  })
})()
