const {getOptions} = require('loader-utils')
const sourceModifier = require('./sourceModifier')

/**
 * @param {string} source
 */
function ccxtExchangesLoader(source) {
  const options = getOptions(this)
  if (!Array.isArray(options.exchanges)) {
    throw new TypeError('Missing list of exchanges in options.')
  }
  return sourceModifier.filterExchanges(source, options.exchanges, options.removePro)
}

module.exports = ccxtExchangesLoader
