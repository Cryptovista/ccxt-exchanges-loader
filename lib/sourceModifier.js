const exchangesRegex = /const.*exchanges.*=.*\{[\s\S]+?\}/gm
const proRegex = /const.*pro.*=.*\{[\s\S]+?\}/gm
const exchangeRequiresRegex = /'(\w+)':\s*require\s*\('(\.\/js\/\w+\.js)'\)/gm
const proRequiresRegex = /'(\w+)':\s*require\s*\('(\.\/js\/pro\/\w+\.js)'\)/gm

/**
 * Get a list of exchanges supported by ccxt from source
 * @param {String} source
 * @returns {Object} the list of all exchanges with their corresponding require statement
 */
function parseExchangesFromSource(source, regex) {
  let exchanges = {}
  let matched
  while ((matched = regex.exec(source)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (matched.index === regex.lastIndex) {
      regex.lastIndex++
    }
    exchanges[matched[1]] = matched[2]
  }
  return exchanges
}

/**
 * @param {String} source - ccxt source
 * @param {Array.<String>} exchangeList - provided throught the options
 */
function filterExchanges(source, exchangeList) {
  const ccxtExchanges = parseExchangesFromSource(source, exchangeRequiresRegex)
  const pros = parseExchangesFromSource(source, proRequiresRegex)
  const requires = exchangeList.reduce((requires, exchange) => {
    const requireStatement = ccxtExchanges[exchange]
    if (typeof requireStatement === 'undefined') {
      throw new Error(`"${exchange}" exchange not found in ccxt source.`)
    }
    return requires + `  ${exchange}: require ('${requireStatement}'),\n`
  }, '')
  const proRequires = exchangeList.reduce((requires, exchange) => {
    const requireStatement = pros[exchange]
    return requires + `  ${exchange}: require ('${requireStatement}'),\n`
  }, '')
  const newExchangeList = `const exchanges = {\n${requires}}`
  const newProList = `const pro = {\n${proRequires}}`
  let updatedSource = source.replace(exchangesRegex, newExchangeList)
  updatedSource = updatedSource.replace(proRegex, newProList)
  return updatedSource
}

module.exports = {
  filterExchanges,
  parseExchangesFromSource,
  exchangeRequiresRegex,
  proRequiresRegex,
}
