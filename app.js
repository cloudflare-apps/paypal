(function () {
  if (!window.addEventListener) return // Check for IE9+

  let hasNativeLocale = false

  try {
    (0).toLocaleString("i")
  }
  catch (error) {
    hasNativeLocale = error.name === "RangeError"
  }

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
    const taxPercentage = locale.taxPercentage || 0

    container = Eager.createElement(location, container)
    container.className = "eager-paypal-buttons"

    buttons.forEach($ => {
      const script = document.createElement("script")
      const itemName = document.createElement("eager-item-name")
      const price = document.createElement("eager-price")
      const priceDetails = document.createElement("eager-price-details")
      const element = document.createElement("eager-button-container")

      itemName.textContent = $.name
      element.appendChild(itemName)

      script.src = `${PAYPAL_SCRIPT_URL}?merchant=${options.merchant}`

      const tax = $.type === "donate" ? 0 : taxPercentage * ($.amount || 0)
      const attrs = {
        [$.type === "donate" ? "amount-editable" : "amount"]: $.amount || 0,
        lc: language.replace("-", "_"), // Convert to expected format.
        button: $.type,
        currency: locale.currency,
        host: INSTALL_ID === "preview" ? "www.sandbox.paypal.com" : "www.paypal.com",
        name: $.name,
        shipping: $.shipping || 0,
        size: "small",
        style: "primary",
        tax: tax.toPrecision(2),
        type: $.type,
        [$.type === "buynow" || $.type === "cart" ? "quantity-editable" : "quantity"]: 1
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
          price.textContent = localizedAmount

          if (tax || attrs.shipping) {
            const additionalCost = localizeCurrency(tax + attrs.shipping)

            let label

            if (tax && attrs.shipping) label = "shipping & tax"
            else if (tax) label = "tax"
            else if (attrs.shipping) label = "shipping"

            priceDetails.innerHTML = `&nbsp;+ ${additionalCost} ${label}`
            element.appendChild(price)
            element.appendChild(priceDetails)
          }
        }
      }

      Object.keys(attrs).forEach(key => script.setAttribute(`data-${key}`, attrs[key]))

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
