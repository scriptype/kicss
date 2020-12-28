import { reportGlobals } from '../reporter.js'

const header = document.querySelector('.heading')

reportGlobals({
  scroll: {
    direction: 'vertical',
    interpolations: [
      {
        name: '--scrolled-header',
        inputRange() {
          return [0, header.offsetHeight - 50, header.offsetHeight - 40]
        },
        outputRange() {
          return [0, 0, 1]
        }
      }
    ]
  }
})
