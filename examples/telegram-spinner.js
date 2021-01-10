import { reportVariable } from '../reporter.js'

const images = [
  'assets/alexey-turenkov-KZGTISDiuBw-unsplash.jpg',
  'assets/alin-agustin-OhejSRo7k9Y-unsplash.jpg',
  'assets/jack-hunter-qKeNO57OxWo-unsplash.jpg',
  'assets/jon-tyson-2Sq6zHdKZp8-unsplash.jpg',
  'assets/thomas-bruen-UyADDPd0d5s-unsplash.jpg'
]

const randomFrom = (array) => array[Math.floor(Math.random() * array.length)]

const startRandomProgress = (initial, callback) => {
  let progress = initial
  callback(progress)
  setTimeout(() => {
    const remaining = 1 - progress
    if (remaining < 0.1) {
      callback(progress + remaining)
    } else {
      const step = (remaining / 2) * Math.random()
      startRandomProgress(progress + step, callback)
    }
  }, Math.random() * 1000)
}

const items = document.querySelector('.items')
const addBtn = document.querySelector('.add-item')
const progressTransitionInMS = 500
reportVariable('--progress-transition', {
  value: progressTransitionInMS,
  scope: items
})

const loadNewItem = () => {
  const randomImageSrc = randomFrom(images)
  const clonedItem = document.querySelector('#item').content.cloneNode(true)
  const item = clonedItem.querySelector('.item')
  const image = item.querySelector('img')
  const spinner = item.querySelector('.spinner')
  image.src = randomImageSrc
  startRandomProgress(0, progress => {
    reportVariable('--progress', {
      value: progress,
      scope: spinner
    })
    if (progress === 1) {
      setTimeout(() => spinner.remove(), progressTransitionInMS)
    }
  })
  items.appendChild(item)
}

loadNewItem()
addBtn.addEventListener('click', loadNewItem)
