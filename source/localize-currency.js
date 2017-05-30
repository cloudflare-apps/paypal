import {CURRENCY_SYMBOLS} from './labels'

let hasNativeLocale = false

try {
  const testNum = 0
  testNum.toLocaleString('i')
} catch (error) {
  hasNativeLocale = error.name === 'RangeError'
}

function humanizedNumber (number = 0) {
  const [wholes, decimals] = number.toFixed(2).split('.')

  const formatted = wholes
    .split('')
    .reverse()
    .reduce((accumulator, character, index, entries) => {
      const placeIndex = index + 1
      const delimiter = placeIndex !== entries.length && placeIndex % 3 === 0 ? ',' : ''

      return delimiter + character + accumulator
    }, '')

  return [formatted, decimals].join('.')
}

export default function localizeCurrency (language, currency, number) {
  let localized

  if (hasNativeLocale) {
    localized = number.toLocaleString(language, {
      currency,
      style: 'currency'
    })
  } else localized = CURRENCY_SYMBOLS[currency] + humanizedNumber(number)

  return localized.replace(/\.00$/, '')
}
