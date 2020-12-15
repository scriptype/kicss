;((root) => {
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

  const reportScroll = ({ direction, name }) => (event) => {
    const { target } = event
    if (direction === 'horizontal') {
      const { scrollLeft, scrollWidth } = target
      const { clientWidth: targetWidth } = target
      const normalizedScroll = scrollLeft / (scrollWidth - targetWidth)
      setCSSProperty(name, normalizedScroll)
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
