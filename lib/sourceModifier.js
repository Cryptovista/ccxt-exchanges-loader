const exchangesMatch = /const.*exchanges.*=.*\{[\s\S]+?\}/gm
const requiresMatch = /'(\w+)':\s*require\s*\('(\.\/js\/\w+\.js)'\)/gm

/**
 * Get a list of exchanges supported by ccxt from source
 * @param {String} source
 * @returns {Object} the list of all exchanges with their corresponding require statement
 */
function parseExchangesFromSource (source) {
  let exchanges = {}
  let matched
  while ((matched = requiresMatch.exec(source)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (matched.index === requiresMatch.lastIndex) {
      requiresMatch.lastIndex++
    }
    exchanges[matched[1]] = matched[2]
  }
  return exchanges
}

/**
 * @param {String} source - ccxt source
 * @param {Array.<String>} exchangeList - provided throught the options
 */
function filterExchanges (source, exchangeList) {
  const ccxtExchanges = parseExchangesFromSource(source)
  const requires = exchangeList.reduce((requires, exchange) => {
    const requireStatement = ccxtExchanges[exchange]
    if (typeof requireStatement === 'undefined') {
      throw new Error(`"${exchange}" exchange not found in ccxt source.`)
    }
    return requires + `  ${exchange}: require ('${requireStatement}'),\n`
  }, '')
  const newExchangeList = `const exchanges = {\n${requires}}`
  const updatedSource = source.replace(exchangesMatch, newExchangeList)
  return updatedSource
}

module.exports = {
  filterExchanges,
  parseExchangesFromSource,
}
