;(() => {
  const setCSSProperty = (key, value) => {
    document.documentElement.style.setProperty(key, value)
  }

  const reportCursor = ({ x, y }) => {
    setCSSProperty('--cursor-x', x)
    setCSSProperty('--cursor-y', y)

    const { innerWidth, innerHeight } = window

    setCSSProperty('--cursor-x-1', x / innerWidth)
    setCSSProperty('--cursor-y-1', y / innerHeight)
  }

  const reportScroll = () => {
    const { scrollTop, scrollLeft } = document.documentElement
    setCSSProperty('--scroll-x', scrollLeft)
    setCSSProperty('--scroll-y', scrollTop)

    const { scrollWidth, scrollHeight } = document.documentElement
    const { innerWidth, innerHeight } = window
    setCSSProperty('--scroll-x-1', scrollLeft / (scrollWidth - innerWidth))
    setCSSProperty('--scroll-y-1', scrollTop / (scrollHeight - innerHeight))
  }

  const init = () => {
    window.addEventListener('mousemove', reportCursor)
    window.addEventListener('scroll', reportScroll)
    window.addEventListener('resize', reportScroll)

    reportCursor({ x: 0, y: 0 })
    reportScroll()
  }

  init()
})()
