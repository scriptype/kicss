import { reportIndex } from '../reporter.js'

const content = document.querySelector('.content')
for (let i = 0; i < 31; i++) {
  content.innerHTML += '<div class="item"></div>'
}

reportIndex('.item')
