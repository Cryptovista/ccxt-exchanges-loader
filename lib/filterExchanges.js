const exchangesMatch = /const.*exchanges.*=.*\{[\s\S]+?\}/gm

/**
 * @param {String} source - ccxt source
 * @param {Array} exchangeList - provided throught the options
 */
function filterExchanges (source, exchangeList) {
  const requires = exchangeList.reduce((requires, exchange) => {
    return requires + `  ${exchange}: require ('./js/${exchange}.js'),\n`
  }, '')
  const newExchangeList = `const exchanges = {\n${requires}}`
  const updatedSource = source.replace(exchangesMatch, newExchangeList)
  return updatedSource
}

module.exports = filterExchanges
