import { performInterpolation, purgeRangeCache } from './lib/interpolation.js'
import { getCurrentScript, getScriptParameters } from './lib/helpers.js'
import validations from './lib/validations.js'

const setCSSProperty = (key, value, element = window.document.documentElement) => {
  element.style.setProperty(key, value)
}

const reportResponsiveVariable = (name, valueFn, scope) => {
  window.addEventListener('resize', () => setCSSProperty(name, valueFn(), scope))
  window.addEventListener('orientationchange', () => setCSSProperty(name, valueFn(), scope))
  setCSSProperty(name, valueFn(), scope)
}

const reportPageCursor = (event) => {
  let x, y
  if (event.touches) {
    x = event.touches.item(0).clientX
    y = event.touches.item(0).clientY
  } else {
    x = event.x
    y = event.y
  }
  setCSSProperty('--cursor-x', `${x}px`)
  setCSSProperty('--cursor-y',`${y}px`)

  const { innerWidth, innerHeight } = window

  setCSSProperty('--cursor-x-1', x / innerWidth)
  setCSSProperty('--cursor-y-1', y / innerHeight)
}

const reportPageScroll = ({ direction, interpolations }) => () => {
  validations.reportPageScroll({ direction, interpolations })

  const { scrollTop, scrollLeft } = document.documentElement
  setCSSProperty('--scroll-x', scrollLeft)
  setCSSProperty('--scroll-y', scrollTop)

  const { scrollWidth, scrollHeight } = document.documentElement
  const { innerWidth, innerHeight } = window
  setCSSProperty('--scroll-x-1', scrollLeft / (scrollWidth - innerWidth))
  setCSSProperty('--scroll-y-1', scrollTop / (scrollHeight - innerHeight))

  if (interpolations) {
    interpolations.forEach((interpolation, index) => {
      const { interpolationName, interpolated, scope } = performInterpolation({
        interpolation,
        id: index,
        value: direction === 'horizontal' ? scrollLeft : scrollTop
      })
      setCSSProperty(interpolationName, interpolated, scope)
    })
  }
}

const reportScroll = (...args) => (event) => {
  validations.reportScroll(...args)

  let name
  let direction = 'vertical'
  let interpolations
  if (typeof args[0] === 'string') {
    name = args[0]

    if (typeof args[1] === 'string') {
      direction = args[1]
    } else if (typeof args[1] === 'object') {
      direction = args[1].direction || direction
      interpolations = args[1].interpolations
    }

  } else if (typeof args[0] === 'object') {
    name = args[0].name
    direction = args[0].direction
    interpolations = args[0].interpolations
  }

  const { target } = event
  let absoluteScroll
  let targetScrollSize
  let targetSize
  if (direction === 'horizontal') {
    absoluteScroll = target.scrollLeft
    targetScrollSize = target.scrollWidth
    targetSize = target.clientWidth
  } else if (direction === 'vertical') {
    absoluteScroll = target.scrollTop
    targetScrollSize = target.scrollHeight
    targetSize = target.clientHeight
  }
  setCSSProperty(name, absoluteScroll)
  setCSSProperty(`${name}-1`, absoluteScroll / (targetScrollSize - targetSize))

  if (interpolations) {
    interpolations.forEach((interpolation, index) => {
      const { interpolationName, interpolated, scope } = performInterpolation({
        interpolation,
        id: index,
        value: absoluteScroll
      })
      setCSSProperty(interpolationName, interpolated, scope)
    })
  }
}

const reportVariable = (...args) => {
  validations.reportVariable(...args)
  let name
  let value
  let scope
  if (typeof args[0] === 'string') {
    name = args[0]
    if (typeof args[1] === 'function') {
      return reportResponsiveVariable(name, args[1])
    }
    if (typeof args[1] === 'object') {
      scope = args[1].scope
      value = args[1].value
      if (typeof args[1].value === 'function') {
        return reportResponsiveVariable(name, args[1].value, scope)
      }
    } else {
      value = args[1]
    }
    setCSSProperty(name, value, scope)

  } else if (typeof args[0] === 'object') {
    name = args[0].name
    value = args[0].value
    scope = args[0].scope
    if (typeof value === 'function') {
      return reportResponsiveVariable(name, value, scope)
    }
    setCSSProperty(name, value, scope)
  }
}

const reportIndex = (selector, {
  indexVariableName = '--index',
  rowIndexVariableName = '--row-index',
  rowIndexBy
} = {
  indexVariableName: '--index',
  rowIndexVariableName: '--row-index'
}) => {
  const elements = Array.from(document.querySelectorAll(selector))
  elements.forEach((element, index) => {
    setCSSProperty(indexVariableName, index, element)
    if (typeof rowIndexBy === 'number') {
      const rowIndex = Math.floor(index / rowIndexBy)
      setCSSProperty(rowIndexVariableName, rowIndex, element)
    }
  })
}

const cursor = () => {
  window.addEventListener('mousemove', reportPageCursor)
  window.addEventListener('touchmove', reportPageCursor)
  reportPageCursor({ x: 0, y: 0 })
}

const time = () => {
  const reportSeconds = () => {
    const seconds = (Date.now() - start) / 1000
    reportVariable('--seconds', seconds)
  }

  const reportMilliseconds = () => {
    const milliseconds = (Date.now() - start)
    reportVariable('--milliseconds', milliseconds)
    millisecondsLoop = requestAnimationFrame(reportMilliseconds)
  }

  let start = Date.now()
  let secondsLoop = window.setInterval(reportSeconds, 1000)
  let millisecondsLoop = requestAnimationFrame(reportMilliseconds)

  return {
    clear() {
      window.clearInterval(secondsLoop)
      window.cancelAnimationFrame(millisecondsLoop)
    }
  }
}

const reportGlobals = ({ scroll, cursor } = { scroll: true, cursor: true }) => {
  if (cursor) {
    window.addEventListener('mousemove', reportPageCursor)
    window.addEventListener('touchmove', reportPageCursor)
    reportPageCursor({ x: 0, y: 0 })
  }
  if (scroll) {
    let interpolations = scroll.interpolations
    let direction = scroll.direction
    window.addEventListener('scroll', reportPageScroll({
      direction,
      interpolations
    }))
    window.addEventListener('resize', (e) => {
      purgeRangeCache()
      reportPageScroll({
        direction,
        interpolations
      })(e)
    })
    reportPageScroll({
      direction,
      interpolations
    })()
  }
}

const currentScript = getCurrentScript('kicss.js')
if (currentScript) {
  const queryParameters = getScriptParameters(currentScript)
  if (queryParameters && queryParameters.report) {
    const globalsToReport = queryParameters.report
    reportGlobals(globalsToReport)
  }
  window.kicss = {
    reportScroll,
    reportVariable,
    reportIndex,
    reportGlobals,
    cursor,
    time
  }
}

export {
  reportScroll,
  reportVariable,
  reportIndex,
  reportGlobals,
  cursor,
  time
}

export default {
  reportScroll,
  reportVariable,
  reportIndex,
  reportGlobals,
  cursor,
  time
}
