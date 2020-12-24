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

const purgeRangeCache = () => {
  rangeCache = {}
}

export {
  cacheRanges,
  purgeRangeCache
}

export default interpolate
