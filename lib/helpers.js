const toFlagMap = (string) => {
  return string
    .split(',')
    .filter(Boolean)
    .reduce((flags, key) => ({
      ...flags,
      [key]: true
    }), {})
}

const getCurrentScript = (scriptName) => {
  const scripts = Array.from(document.getElementsByTagName('script'))
  const currentScript = scripts.find(
    script => script.src.includes(`/${scriptName}`)
  )
  return currentScript
}

const getScriptParameters = (currentScript) => {
  const query = currentScript.src.split('?').pop().split('&')
  const parameters = query.reduce((params, part) => {
    const [key, value] = part.split('=')
    return {
      ...params,
      [key]: value
    }
  }, {})

  if (!parameters) {
    return undefined
  }

  if (parameters.report) {
    return {
      ...parameters,
      report: toFlagMap(parameters.report)
    }
  }

  return parameters
}

export {
  getCurrentScript,
  getScriptParameters
}
