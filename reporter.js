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

  const setCSSProperty = (key, value) => {
    document.documentElement.style.setProperty(key, value)
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
    if (direction === 'horizontal') {
      const { scrollLeft } = target
      setCSSProperty(name, scrollLeft)

      const { scrollWidth, clientWidth: targetWidth } = target
      const normalizedScroll = scrollLeft / (scrollWidth - targetWidth)
      setCSSProperty(`${name}-1`, normalizedScroll)

      if (!interpolations) {
        return
      }

      interpolations.forEach(interpolation => {
        const { name: interpolationName, inputRange, outputRange } = interpolation
        const interpolated = interpolate({
          value: scrollLeft,
          inputRange,
          outputRange
        })
        setCSSProperty(interpolationName, interpolated)
      })
    }
  }

  const reportVariable = (name, value) => {
    setCSSProperty(name, value)
  }

  const init = () => {
    window.addEventListener('mousemove', reportPageCursor)
    window.addEventListener('scroll', reportPageScroll)
    window.addEventListener('resize', reportPageScroll)

    reportPageCursor({ x: 0, y: 0 })
    reportPageScroll()
  }

  root.InteractionReporter = {
    reportScroll,
    reportVariable
  }

  init()
})(window)
