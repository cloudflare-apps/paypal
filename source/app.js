import {NAME_PLACEHOLDERS, PERIOD_LABELS, CURRENCY_SYMBOLS} from './labels'
import localizeCurrencyBase from './localize-currency'

(function () {
  if (!window.addEventListener) return // Check for IE9+

  const ATTENTION_CLASS = 'cf-attention'
  const UPDATE_DELAY = 1500
  const IS_PREVIEW = INSTALL_ID === 'preview'

  const language = window.navigator.language || window.navigator.userLanguage
  let container
  let options = INSTALL_OPTIONS
  let updateTimeout

  function toArray (arrayLike) {
    return Array.prototype.slice.call(arrayLike)
  }

  function updateElements () {
    const {locale} = options
    let {merchantID} = options

    if (!merchantID && !IS_PREVIEW) return

    container = INSTALL.createElement(options.location, container)
    container.className = 'cf-paypal-buttons'

    if (!merchantID) {
      merchantID = 'example@paypal.preview'

      container.innerHTML = `<cf-waiting-message>
        Please provide your PayPal email in the app installer.
      </cf-waiting-message>`
      container.setAttribute('data-state', 'waiting')
    }

    const localizeCurrency = localizeCurrencyBase.bind(null, language, locale.currency)
    const processElement = window.paypal.button.processElement.bind(null, merchantID)
    const taxPercentage = parseFloat(locale.taxPercentage || 0, 10) / 100
    const currencySymbol = CURRENCY_SYMBOLS[options.locale.currency]

    options.buttons.forEach($ => {
      const script = document.createElement('script')
      const itemName = document.createElement('cf-item-name')
      const price = document.createElement('cf-price')
      const priceDetails = document.createElement('cf-price-details')
      const element = document.createElement('cf-button-container')

      element.setAttribute('data-button-type', $.type)

      const name = $['name-' + $.type]
      const amount = $['amount-' + $.type] || 0
      const tax = $.type === 'buynow' ? taxPercentage * amount : 0
      const attrs = {
        [$.type === 'donate' ? 'amount-editable' : 'amount']: amount,
        lc: language.replace('-', '_'), // Convert to expected format.
        button: $.type,
        currency: locale.currency,
        host: IS_PREVIEW ? 'www.sandbox.paypal.com' : 'www.paypal.com',
        name,
        shipping: $.shipping || 0,
        size: 'small',
        style: 'primary',
        tax: Math.round(tax * 100) / 100, // Convert to expected precision.
        type: $.type,
        [$.type === 'buynow' && $.showQuantity ? 'quantity-editable' : 'quantity']: 1
      }

      itemName.textContent = name
      itemName.setAttribute('data-placeholder', NAME_PLACEHOLDERS[$.type])
      if (!name) itemName.className = ATTENTION_CLASS

      element.appendChild(itemName)

      if ($.description) {
        const itemDescription = document.createElement('cf-item-description')

        itemDescription.textContent = $.description
        element.appendChild(itemDescription)
      }

      if ($.type !== 'donate') {
        const localizedAmount = localizeCurrency(attrs.amount)

        if ($.type === 'subscribe') {
          const periodLabel = PERIOD_LABELS[$.period]

          price.textContent = `${localizedAmount}/${periodLabel.singular}`

          if ($.recurrence.type === 'reoccurring') {
            attrs.recurrence = 0
          } else {
            attrs.recurrence = parseInt($.recurrence.customDuration, 10) || 1
            const agreement = attrs.recurrence === 1 ? 'singular' : 'plural'

            price.textContent += ` for ${attrs.recurrence} ${periodLabel[agreement]}`
          }

          attrs.period = $.period

          element.appendChild(price)
        } else {
          element.appendChild(price)
          price.textContent = localizedAmount

          if (tax || attrs.shipping) {
            const additionalCost = tax + attrs.shipping

            let label

            if (tax && attrs.shipping) label = 'shipping & tax'
            else if (tax) label = 'tax'
            else if (attrs.shipping) label = 'shipping'

            priceDetails.innerHTML = `+ ${localizeCurrency(additionalCost)} ${label}`

            if (additionalCost < 0) priceDetails.className = ATTENTION_CLASS
            element.appendChild(priceDetails)
          }
        }

        if (attrs.amount <= 0) price.className = ATTENTION_CLASS
      }

      Object.keys(attrs).forEach(key => script.setAttribute(`data-${key}`, attrs[key]))

      script.addEventListener('load', () => {
        const inputContainer = document.createElement('paypal-input-container')
        const label = element.querySelector('.paypal-label')
        const input = element.querySelector('.paypal-input')

        if (!input) return

        if ($.type === 'donate') {
          inputContainer.setAttribute('data-currency', currencySymbol)
          input.placeholder = input.value
        }

        input.parentNode.removeChild(input)
        inputContainer.appendChild(input)
        label.appendChild(inputContainer)
      })

      element.appendChild(script)
      container.appendChild(element)
    })

    toArray(container.querySelectorAll('script')).forEach(processElement)

    container.setAttribute('data-state', 'loaded')
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateElements)
  } else {
    updateElements()
  }

  window.INSTALL_SCOPE = {
    setOptions (nextOptions) {
      clearTimeout(updateTimeout)
      options = nextOptions

      if (container) container.setAttribute('data-state', 'refreshing')

      updateTimeout = setTimeout(updateElements, UPDATE_DELAY)
    }
  }
}())
