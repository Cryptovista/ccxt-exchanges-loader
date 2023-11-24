# ccxt-exchanges-loader

> Filter ccxt exchanges that you want to include in your Webpack bundle.


## Version support

* From v2, the loader supports ccxt v4.
* For ccxt v2 support, use loader v1.

## Use case

> [ccxt](https://github.com/ccxt/ccxt) is a JavaScript / Python / PHP cryptocurrency trading library with support for more than 100 bitcoin/altcoin exchanges

This loader is useful if you:

- ship ccxt with a frontend app
- don't need all the exchanges that ccxt supports
- don't need the pro features

You will get a **smaller bundle: lighter, faster code.**

## How to use

### 1. Install

```bash
npm install ccxt-exchanges-loader -DE
```

### 2. Webpack config

Add the loader to your config:

```js
module.exports = {
  module: {
    rules: [
      //...
      {
        test: /ccxt\.js$/,
        use: [
          {
            loader: 'ccxt-exchanges-loader',
            options: {
              exchanges: ['binance', 'kraken'],
              removePro: true
            }
          }
        ],
        include: /node_modules\/ccxt/,
      },
    ]
  ]
}
```

### 3. Enjoy a lighter package

<img align="center" src="https://github.com/Cryptovista/ccxt-exchanges-loader/blob/master/docs/images/filter-result.png" width="100%" alt="Comparison with the loader. 2 MegaBytes vs 310 KiloBytes"/>

## Warning

The loader may become incompatible with newer versions of ccxt. In case of problem, open an issue.
