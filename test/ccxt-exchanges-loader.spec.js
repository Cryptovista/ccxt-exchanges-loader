const fs = require('fs')
const path = require('path')

const sourceModifier = require('../lib/sourceModifier')
const expectedExchangesFromSource = require('./expectedExchangesFromSource')
const ccxtSource = fs.readFileSync(path.join(__dirname, 'ccxtSourceMock.js'), 'utf8')
const expectedSource = fs.readFileSync(path.join(__dirname, 'expectedSource.js'), 'utf8')

describe('sourceModifier', () => {
  describe('parseExchangesFromSource()', () => {
    it('should gather all the exchanges from ccxt source', () => {
      const parsedExchanges = sourceModifier.parseExchangesFromSource(
        ccxtSource,
        sourceModifier.exchangeRequiresRegex
      )
      expect(parsedExchanges).toEqual(expectedExchangesFromSource)
    })
  })

  describe('filterExchanges', () => {
    it('should replace the require statement in ccxt source', () => {
      const exchangesToKeep = ['binance', 'kraken']

      const updatedSource = sourceModifier.filterExchanges(ccxtSource, exchangesToKeep)
      expect(updatedSource).toBe(expectedSource)
    })

    it('should throw an error if exchange does not exist in the source', () => {
      const exchangesToKeep = [
        'kraken',
        'bynance', // <- BAD
      ]

      expect(() => {
        sourceModifier.filterExchanges(ccxtSource, exchangesToKeep)
      }).toThrowError('"bynance" exchange not found in ccxt source.')
    })
  })
})
