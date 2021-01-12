const reportVariable = (...args) => {
  if (!args) {
    throw new Error('options are mandatory.')
  }
  if (typeof args[0] === 'string') {
    if (typeof args[1] === 'undefined') {
      throw new Error('2nd argument is necessary when only the variable name is present')
    }
    if (typeof args[1] === 'object' && typeof args[1].value === 'undefined') {
      throw new Error('`value` is mandatory')
    }
  } else if (typeof args[0] === 'object') {
    if (!args[0].name || !args[0].name.trim()) {
      throw new Error('`name` is mandatory')
    }
    if (typeof args[0].value === 'undefined') {
      throw new Error('`value` is mandatory')
    }
  } else {
    throw new Error('First argument must be a string or an object.')
  }
}

const reportPageScroll = (...args) => {
  const { direction, interpolations } = args[0]
  if (interpolations) {
    if (!direction) {
      throw new Error('"direction" must be provided for interpolations')
    }
    if (direction !== 'horizontal' && direction !== 'vertical') {
      throw new Error('"direction" can be only "horizontal" or "vertical".')
    }
  }
}

const reportScroll = (...args) => {
  const { direction } = args[0]
  if (direction !== 'horizontal' && direction !== 'vertical') {
    throw new Error('"direction" can be only "horizontal" or "vertical".')
  }
}

export default {
  reportVariable,
  reportPageScroll,
  reportScroll
}