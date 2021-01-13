import { reportGlobals, reportVariable } from '../../reporter.js'

reportGlobals({
  scroll: true
})

const { min } = Math
reportVariable('--car-width', () => min(window.innerWidth / 3, 600))
reportVariable('--viewport-width', () => window.innerWidth)
