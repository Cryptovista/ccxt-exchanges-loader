function createStringEndMatchRegex(strings) {
  const escapedStrings = strings.map((str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const regexString = `(${escapedStrings.join('|')})\\s*$`
  return new RegExp(regexString)
}

/**
 * ```
 * missingFromArr2([1, 2, 3], [1, 2]) // []
 * missingFromArr2([1, 2], [1, 2, 3]) // [3]
 * ```
 */
function missingFromArr2(arr1, arr2) {
  const arr1Set = new Set(arr1)
  return arr2.reduce((acc, item) => {
    if (!arr1Set.has(item)) {
      acc.push(item)
    }
    return acc
  }, [])
}

/**
 * @param {string} source
 * @param {string[]} exchangeList
 * @param {boolean} removePro
 * @returns {string}
 */
function filterExchanges(source, exchangeList, removePro) {
  const lines = source.split('\n')
  const modifiedLines = []

  let insideExchangesBlock = false
  let insideProBlock = false
  const exchangesFound = []

  const regexEnd = createStringEndMatchRegex(exchangeList)
  const regexProEnd = createStringEndMatchRegex(exchangeList.map((ex) => ex + 'Pro'))

  for (const line of lines) {
    if (line.includes('const exchanges =')) {
      insideExchangesBlock = line.includes('const exchanges =')
    }
    if (line.includes('const pro =')) {
      insideProBlock = true
    }
    if (insideExchangesBlock && line === '};') {
      insideExchangesBlock = false
      modifiedLines.push(`const exchanges = {${exchangeList.join(', ')}}`)
      continue
    }
    if (insideProBlock && line === '};') {
      insideProBlock = false
      modifiedLines.push(
        removePro
          ? 'const pro = {}'
          : `const pro = {${exchangeList.map((ex) => ex + 'Pro').join(', ')}}`
      )
      continue
    }
    if (line.startsWith('import')) {
      const [, path] = line.match(/'(.+)'/)
      if (path.includes('./src/base')) {
        modifiedLines.push(line)
      } else {
        const [importVar] = line.split('from')
        if (regexEnd.test(importVar.trim()) || (regexProEnd.test(importVar.trim()) && !removePro)) {
          modifiedLines.push(line)
          exchangesFound.push(importVar.replace('import ', '').trim())
        }
      }
    } else {
      if (line.startsWith('export { version')) {
        modifiedLines.push(
          `export { version, Exchange, exchanges, pro, Precise, functions, errors, BaseError, ExchangeError, PermissionDenied, AccountNotEnabled, AccountSuspended, ArgumentsRequired, BadRequest, BadSymbol, MarginModeAlreadySet, BadResponse, NullResponse, InsufficientFunds, InvalidAddress, InvalidOrder, OrderNotFound, OrderNotCached, CancelPending, OrderImmediatelyFillable, OrderNotFillable, DuplicateOrderId, NotSupported, NetworkError, DDoSProtection, RateLimitExceeded, ExchangeNotAvailable, OnMaintenance, InvalidNonce, RequestTimeout, AuthenticationError, AddressPending, NoChange, ${exchangeList.join(
            ', '
          )} };`
        )
      } else if (!insideExchangesBlock && !insideProBlock) {
        modifiedLines.push(line)
      }
    }
  }

  const missingEx = missingFromArr2(exchangesFound, exchangeList)
  if (missingEx.length > 0) {
    throw new Error(`${missingEx.join(', ')} exchange(s) not found in ccxt source.`)
  }

  return modifiedLines.join('\n')
}

module.exports = {
  filterExchanges,
}
