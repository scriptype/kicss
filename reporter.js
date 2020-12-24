;((root) => {
  function findRange(input, inputRange) {
    let i
    for (i = 1; i < inputRange.length - 1; ++i) {
      if (inputRange[i] >= input) {
        break
      }
    }
    return i - 1
  }

  const interpolate = ({ value, inputRange, outputRange}) => {
    const range = findRange(value, inputRange)
    const inputMin = inputRange[range]
    const inputMax = inputRange[range + 1]
    const outputMin = outputRange[range]
    const outputMax = outputRange[range + 1]
    let interpolated = value
    interpolated = (interpolated - inputMin) / (inputMax - inputMin)
    interpolated = interpolated * (outputMax - outputMin) + outputMin
    return interpolated
  }

  let rangeCache = {}
  const cacheRanges = (interpolationName, ranges, cacheDuration) => {
    const cachedRanges = rangeCache[interpolationName]
    if (cachedRanges && (Date.now() - cachedRanges.timestamp < cacheDuration)) {
      return cachedRanges.ranges
    }
    rangeCache[interpolationName] = {
      ranges: ranges.map(r => typeof r === 'function' ? r() : r),
      timestamp: Date.now()
    }
    return rangeCache[interpolationName].ranges
  }

  const setCSSProperty = (key, value, element = window.document.documentElement) => {
    element.style.setProperty(key, value)
  }

  const reportPageCursor = ({ x, y }) => {
    setCSSProperty('--cursor-x', x)
    setCSSProperty('--cursor-y', y)

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
      rangeCache = {}
      reportPageScroll(e)
    })

    reportPageCursor({ x: 0, y: 0 })
    reportPageScroll()
  }

  root.InteractionReporter = {
    reportScroll,
    reportVariable,
    reportIndex
  }

  init()
})(window)
