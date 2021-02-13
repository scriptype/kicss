import { reportGlobals, reportVariable } from '../../kicss.js'

reportGlobals({
  scroll: true
})

const { min } = Math
reportVariable('--car-width', () => min(window.innerWidth / 3, 600))
reportVariable('--vw', () => window.innerWidth)
