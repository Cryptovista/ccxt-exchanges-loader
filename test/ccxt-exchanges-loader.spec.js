const fs = require('fs')
const path = require('path')

const filterExchanges = require('../lib/filterExchanges')
const ccxtSource = fs.readFileSync(path.join(__dirname, 'ccxtSourceMock.js'), 'utf8')
const expectedSource = fs.readFileSync(path.join(__dirname, 'expectedSource.js'), 'utf8')

describe('filterExchanges', () => {
  it('should replace the require statement in ccxt source', () => {
    const exchangesToKeep = [
      'binance',
      'kraken',
      'bittrex',
      'huobi',
      'coinbase',
    ]

    const updatedSource = filterExchanges(ccxtSource, exchangesToKeep)
    expect(updatedSource).toBe(expectedSource)
  })
})
