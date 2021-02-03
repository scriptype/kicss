import { reportGlobals, reportIndex } from '../../kicss.js'

const content = document.querySelector('.content')
for (let i = 0; i < 18; i++) {
  content.innerHTML += '<div class="item"></div>'
}

reportIndex('.item')

reportGlobals({
  cursor: true
})
