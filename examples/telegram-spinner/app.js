import { reportVariable } from '../../reporter.js'

const items = document.querySelector('.items')
const addBtn = document.querySelector('.add-item')
const template = document.querySelector('#item')
const progressTransitionInMS = 500

reportVariable('--progress-transition', {
  value: progressTransitionInMS,
  scope: items
})

const images = [
  '../assets/alexey-turenkov-KZGTISDiuBw-unsplash.jpg',
  '../assets/alin-agustin-OhejSRo7k9Y-unsplash.jpg',
  '../assets/jack-hunter-qKeNO57OxWo-unsplash.jpg',
  '../assets/jon-tyson-2Sq6zHdKZp8-unsplash.jpg',
  '../assets/thomas-bruen-UyADDPd0d5s-unsplash.jpg'
]

const randomFrom = (array) => array[Math.floor(Math.random() * array.length)]

const startRandomProgress = (progress, callback) => {
  callback(progress)
  setTimeout(() => {
    const remaining = 1 - progress
    if (remaining < 0.1) {
      callback(1)
    } else {
      const step = (remaining / 2) * Math.random()
      startRandomProgress(progress + step, callback)
    }
  }, Math.random() * 1000)
}

const createNewItem = () => {
  const clonedItem = template.content.cloneNode(true)
  const item = clonedItem.querySelector('.item')
  item.querySelector('img').src = randomFrom(images)
  return item
}

const animateSpinner = (spinner) => {
  startRandomProgress(0, progress => {
    reportVariable('--progress', {
      value: progress,
      scope: spinner
    })
    if (progress === 1) {
      setTimeout(() => spinner.remove(), progressTransitionInMS)
    }
  })
}

const addNewItem = () => {
  const item = createNewItem()
  const spinner = item.querySelector('.spinner')
  items.appendChild(item)
  animateSpinner(spinner)
}

addNewItem()
addBtn.addEventListener('click', addNewItem)
