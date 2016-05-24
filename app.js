(function () {
  if (!window.addEventListener) return // Check for IE9+

  let hasNativeLocale = false

  try {
    (0).toLocaleString("i")
  }
  catch (error) {
    hasNativeLocale = error.name === "RangeError"
  }

  const ATTENTION_CLASS = "eager-attention"
  const UPDATE_DELAY = 1500
  const PAYPAL_SCRIPT_URL = "https://cdn.rawgit.com/EagerApps/PayPalButtons/master/vendor/button.js"
  const PERIOD_LABELS = {
    D: "day",
    W: "week",
    M: "month",
    Y: "year"
  }
  const CURRENCY_SYMBOLS = {
    CAD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    USD: "$"
  }
  const language = window.navigator.language || window.navigator.userLanguage
  let container
  let options = INSTALL_OPTIONS
  let updateTimeout

  function humanizedNumber(number = 0) {
    const [wholes, decimals] = number.toFixed(2).split(".")

    const formatted = wholes
      .split("")
      .reverse()
      .reduce((accumulator, character, index, entries) => {
        const placeIndex = index + 1
        const delimiter = placeIndex !== entries.length && placeIndex % 3 === 0 ? "," : ""

        return delimiter + character + accumulator
      }, "")

    return [formatted, decimals].join(".")
  }

  function localizeCurrency(number) {
    if (hasNativeLocale) return number.toLocaleString(language, {
      currency: options.locale.currency,
      style: "currency"
    })

    return CURRENCY_SYMBOLS[options.locale.currency] + humanizedNumber(number)
  }

  function updateElements() {
    if (!options.merchant) return

    const {buttons, locale, location} = options
    const taxPercentage = parseFloat(locale.taxPercentage || 0, 10) / 100
    const currencySymbol = CURRENCY_SYMBOLS[options.locale.currency]

    container = Eager.createElement(location, container)
    container.className = "eager-paypal-buttons"

    buttons.forEach($ => {
      const script = document.createElement("script")
      const itemName = document.createElement("eager-item-name")
      const price = document.createElement("eager-price")
      const priceDetails = document.createElement("eager-price-details")
      const element = document.createElement("eager-button-container")
      const AMOUNTS = {
        buynow: $.amount,
        donate: $.amountDonate,
        subscribe: $.amountSubscribe
      }

      itemName.textContent = $.name
      if (!itemName.textContent) itemName.className = ATTENTION_CLASS

      element.appendChild(itemName)

      script.src = `${PAYPAL_SCRIPT_URL}?merchant=${options.merchant}`

      const tax = $.type === "donate" ? 0 : taxPercentage * (AMOUNTS[$.type] || 0)
      const attrs = {
        [$.type === "donate" ? "amount-editable" : "amount"]: AMOUNTS[$.type] || 0,
        lc: language.replace("-", "_"), // Convert to expected format.
        button: $.type,
        currency: locale.currency,
        host: INSTALL_ID === "preview" ? "www.sandbox.paypal.com" : "www.paypal.com",
        name: $.name,
        shipping: $.shipping || 0,
        size: "small",
        style: "primary",
        tax: Math.round(tax * 100) / 100, // Convert to expected precision.
        type: $.type,
        [$.type === "buynow" ? "quantity-editable" : "quantity"]: 1
      }

      if ($.type !== "donate") {
        const localizedAmount = localizeCurrency(attrs.amount)

        if ($.type === "subscribe") {
          const plural = $.recurrence === 1 ? "" : "s" // HACK: brittle.

          price.textContent = `${localizedAmount} for ${$.recurrence} ${PERIOD_LABELS[$.period]}${plural}`

          attrs.recurrence = $.recurrence
          attrs.period = $.period

          element.appendChild(price)
        }
        else {
          element.appendChild(price)
          price.textContent = localizedAmount

          if (tax || attrs.shipping) {
            const additionalCost = tax + attrs.shipping

            let label

            if (tax && attrs.shipping) label = "shipping & tax"
            else if (tax) label = "tax"
            else if (attrs.shipping) label = "shipping"

            priceDetails.innerHTML = `&nbsp;+ ${localizeCurrency(additionalCost)} ${label}`

            if (additionalCost < 0) priceDetails.className = ATTENTION_CLASS
            element.appendChild(priceDetails)
          }
        }

        if (attrs.amount <= 0) price.className = ATTENTION_CLASS
      }

      Object.keys(attrs).forEach(key => script.setAttribute(`data-${key}`, attrs[key]))

      script.addEventListener("load", () => {
        const inputContainer = document.createElement("paypal-input-container")
        const label = element.querySelector(".paypal-label")
        const input = element.querySelector(".paypal-input")

        if (!input) return

        if ($.type === "donate") {
          inputContainer.setAttribute("data-currency", currencySymbol)
          input.placeholder = input.value
        }

        input.parentNode.removeChild(input)
        inputContainer.appendChild(input)
        label.appendChild(inputContainer)
      })

      element.appendChild(script)

      container.appendChild(element)
    })

    container.setAttribute("data-state", "loaded")
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateElements)
  }
  else {
    updateElements()
  }

  window.INSTALL_SCOPE = {
    setOptions(nextOptions) {
      clearTimeout(updateTimeout)
      options = nextOptions

      if (container) container.setAttribute("data-state", "refreshing")

      updateTimeout = setTimeout(updateElements, UPDATE_DELAY)
    }
  }
}())
