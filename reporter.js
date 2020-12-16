;((root) => {
  const interpolate = ({ value, inputRange, outputRange}) => {
    let interpolated = value
    interpolated = (interpolated - inputRange[0]) / (last(inputRange) - inputRange[0])
    interpolated = interpolated * (last(outputRange) - outputRange[0]) + outputRange[0]
    return interpolated
  }

  const last = (array) => array[array.length - 1]

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
