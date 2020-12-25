import interpolate, { cacheRanges, purgeRangeCache } from './lib/interpolation.js'

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

const init = () => {
  window.addEventListener('mousemove', reportPageCursor)
  window.addEventListener('scroll', reportPageScroll)
  window.addEventListener('resize', (e) => {
    purgeRangeCache()
    reportPageScroll(e)
  })

  reportPageCursor({ x: 0, y: 0 })
  reportPageScroll()
}

init()

export {
  reportScroll,
  reportVariable,
  reportIndex
}
