const fs = require('fs')
const path = require('path')

const sourceModifier = require('../lib/sourceModifier')
const ccxtSource = fs.readFileSync(path.join(__dirname, 'ccxtSourceMock.js'), 'utf8')
const expectedResult = fs.readFileSync(path.join(__dirname, 'expectedResult.js'), 'utf8')
const expectedResultWithoutPro = fs.readFileSync(
  path.join(__dirname, 'expectedResultWithoutPro.js'),
  'utf8'
)

describe('sourceModifier', () => {
  describe('filterExchanges', () => {
    it('should replace the require statement in ccxt source', () => {
      const exchangesToKeep = ['binance', 'kraken']

      const updatedSource = sourceModifier.filterExchanges(ccxtSource, exchangesToKeep)
      expect(updatedSource).toBe(expectedResult)
    })

    it('should remove pro related code completely when needed', () => {
      const exchangesToKeep = ['binance', 'kraken']

      const updatedSource = sourceModifier.filterExchanges(ccxtSource, exchangesToKeep, true)
      expect(updatedSource).toBe(expectedResultWithoutPro)
    })

    it('should throw an error if exchange does not exist in the source', () => {
      const exchangesToKeep = [
        'kraken',
        'bynance', // <- BAD
      ]

      expect(() => sourceModifier.filterExchanges(ccxtSource, exchangesToKeep)).toThrowError(
        'bynance exchange(s) not found in ccxt source.'
      )
    })
  })
})
