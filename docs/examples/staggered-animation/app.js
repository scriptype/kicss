import { reportVariable, reportIndex } from '../../kicss.js'

const content = document.querySelector('.content')
for (let i = 0; i < 60; i++) {
  content.innerHTML += '<div class="item"></div>'
}

const rowLength = 20
reportVariable('--row-length', {
  value: rowLength,
  scope: content
})
reportIndex('.item', {
  rowIndexBy: rowLength
})

;[rotate, scale].forEach(option => {
  option.addEventListener('click', e => {
    content.classList.toggle('rotate', rotate.checked)
    content.classList.toggle('scale', scale.checked)
  })
})
