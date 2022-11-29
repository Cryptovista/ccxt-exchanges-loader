"use strict";

/*

MIT License

Copyright (c) 2017 Igor Kroitor

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

//-----------------------------------------------------------------------------

const Exchange  = require ('./js/base/Exchange')
    , wsExchange = require ('./js/pro/base/Exchange')
    , Precise   = require ('./js/base/Precise')
    , functions = require ('./js/base/functions')
    , errors    = require ('./js/base/errors')

//-----------------------------------------------------------------------------
// this is updated by vss.js when building

const version = '2.2.40'

Exchange.ccxtVersion = version

//-----------------------------------------------------------------------------

const exchanges = {
  binance: require ('./js/binance.js'),
  kraken: require ('./js/kraken.js'),
}

const pro = {
  binance: require ('./js/pro/binance.js'),
  kraken: require ('./js/pro/kraken.js'),
}

for (const exchange in pro) {
    const ccxtExchange = exchanges[exchange]
    const baseExchange = Object.getPrototypeOf (ccxtExchange)
    if (baseExchange.name === 'Exchange') {
        Object.setPrototypeOf (ccxtExchange, wsExchange)
        Object.setPrototypeOf (ccxtExchange.prototype, wsExchange.prototype)
    }
}

pro.exchanges = Object.keys (pro)

//-----------------------------------------------------------------------------

module.exports = Object.assign ({ version, Exchange, Precise, 'exchanges': Object.keys (exchanges), pro }, exchanges, functions, errors)

//-----------------------------------------------------------------------------