const {getOptions} = require('loader-utils')
const filterExchanges = require('./filterExchanges')

/**
 * @param {string} source
 */
function ccxtExchangesLoader (source) {
  const options = getOptions(this)
  if (!Array.isArray(options.exchanges)) {
    throw new TypeError('Missing list of exchanges in options.')
  }
  return filterExchanges(source, options.exchanges)
}

module.exports = ccxtExchangesLoader
