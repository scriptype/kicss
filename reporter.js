import interpolate, { cacheRanges, purgeRangeCache } from './lib/interpolation.js'
import { getScriptParameters } from './lib/helpers.js'

const setCSSProperty = (key, value, element = window.document.documentElement) => {
  element.style.setProperty(key, value)
}

const reportPageCursor = ({ x, y }) => {
  setCSSProperty('--cursor-x', `${x}px`)
  setCSSProperty('--cursor-y',`${y}px`)

  const { innerWidth, innerHeight } = window

  setCSSProperty('--cursor-x-1', x / innerWidth)
  setCSSProperty('--cursor-y-1', y / innerHeight)
}

const reportPageScroll = () => {
  const { scrollTop, scrollLeft } = document.documentElement
  setCSSProperty('--scroll-x', scrollLeft)
  setCSSProperty('--scroll-y', scrollTop)

  const { scrollWidth, scrollHeight } = document.documentElement
  const { innerWidth, innerHeight } = window
  setCSSProperty('--scroll-x-1', scrollLeft / (scrollWidth - innerWidth))
  setCSSProperty('--scroll-y-1', scrollTop / (scrollHeight - innerHeight))
}

const reportScroll = ({ direction, name, interpolations }) => (event) => {
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
  } else {
    throw new Error('"direction" can be only "horizontal" or "vertical".')
  }
  setCSSProperty(name, absoluteScroll)
  setCSSProperty(`${name}-1`, absoluteScroll / (targetScrollSize - targetSize))

  if (!interpolations) {
    return
  }

  interpolations.forEach((interpolation, interpolationIndex) => {
    const {
      name: interpolationName,
      scope,
      inputRange,
      outputRange,
      cache = true,
      cacheDuration = 300
    } = interpolation
    const [cachedInputRange, cachedOutputRane] = cache
      ? cacheRanges(`${interpolationName}-${interpolationIndex}`, [inputRange, outputRange], cacheDuration)
      : [
        typeof inputRange === 'function' ? inputRange() : inputRange,
        typeof outputRange === 'function' ? outputRange() : outputRange,
      ]
    const interpolated = interpolate({
      value: absoluteScroll,
      inputRange: cachedInputRange,
      outputRange: cachedOutputRane
    })
    setCSSProperty(interpolationName, interpolated, scope)
  })
}

const reportVariable = (name, value, scope) => {
  setCSSProperty(name, value, scope)
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

const reportTimestamp = ({ type } = { type: 'milliseconds' }) => {
  const interval = (
    type === 'hours' ? 1000 * 60 * 60 :
    type === 'minutes' ? 1000 * 60 :
    type === 'seconds' ? 1000 : 1
  )

  const report = (name, interval, repeat) => {
    const now = Date.now()
    setCSSProperty(name, Math.floor((now - startTime) / interval))
  }

  if (type === 'milliseconds') {
    requestAnimationFrame(() => {
      report('--timestamp', interval)
      reportTimestamp({ type: 'milliseconds' })
    })
  } else {
    report(`--timestamp-${type}`, interval)
    setInterval(() => report(`--timestamp-${type}`, interval), interval)
  }
}

const reportGlobals = ({
  scroll,
  cursor,
  timestampHours,
  timestampMinutes,
  timestampSeconds,
  timestampMilliSeconds,
  timestamp,
} = {
  scroll: true,
  cursor: true,
  timestampHours: false,
  timestampMinutes: false,
  timestampSeconds: false,
  timestampMilliSeconds: false,
  timestamp: false
}) => {
  if (cursor) {
    window.addEventListener('mousemove', reportPageCursor)
    reportPageCursor({ x: 0, y: 0 })
  }
  if (scroll) {
    window.addEventListener('scroll', reportPageScroll)
    window.addEventListener('resize', (e) => {
      purgeRangeCache()
      reportPageScroll(e)
    })
    reportPageScroll()
  }
  if (timestampHours) {
    reportTimestamp({
      type: 'hours'
    })
  }
  if (timestampMinutes) {
    reportTimestamp({
      type: 'minutes'
    })
  }
  if (timestampSeconds) {
    reportTimestamp({
      type: 'seconds'
    })
  }
  if (timestampMilliSeconds) {
    reportTimestamp({
      type: 'milliseconds'
    })
  }
  if (timestamp) {
    reportTimestamp({
      type: 'milliseconds'
    })
  }
}

const startTime = Date.now()

const queryParameters = getScriptParameters('reporter.js')
if (queryParameters && queryParameters.report) {
  const globalsToReport = queryParameters.report
  reportGlobals(globalsToReport)
}

export {
  reportScroll,
  reportVariable,
  reportIndex,
  reportTimestamp,
  reportGlobals
}
