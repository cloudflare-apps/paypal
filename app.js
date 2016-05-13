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
    D: "Daily",
    W: "Weekly",
    M: "Monthly",
    Y: "Yearly"
  }
  const CURRENCY_SYMBOLS = {
    CAD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    USD: "$"
  }
  const language = window.navigator.language || window.navigator.userLanguage
  const elements = []

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

    buttons.forEach(($, index) => {
      const script = document.createElement("script")
      const infoWrapper = document.createElement("eager-info-wrapper")
      const itemName = document.createElement("eager-item-name")
      const price = document.createElement("eager-price")
      const shippingAndTax = document.createElement("eager-shipping-and-tax")
      const element = elements[index] = Eager.createElement(location, elements[index])

      element.className = "eager-paypal-buttons"
      itemName.innerHTML = $.name
      script.src = `${PAYPAL_SCRIPT_URL}?merchant=${options.merchant}`

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
        tax: $.type === "donate" ? 0 : taxPercentage * ($.amount || 0),
        type: $.type,
        [$.type === "buynow" || $.type === "cart" ? "quantity-editable" : "quantity"]: 1
      }

      if ($.type === "subscribe") {
        const time = $.recurrence === 1 ? "time" : "times"

        price.innerHTML += ` ${$.recurrence} ${time} ${PERIOD_LABELS[$.timePeriod]}`

        attrs.recurrence = $.recurrence
        attrs.period = $.timePeriod
      }

      if ($.type !== "donate") price.innerHTML = localizeCurrency(attrs.amount)

      if ($.type !== "donate" && (attrs.tax || attrs.shipping)) {
        const additionalCost = localizeCurrency(attrs.tax + attrs.shipping)

        let label

        if (attrs.tax && attrs.shipping) label = "shipping & tax"
        else if (attrs.tax) label = "tax"
        else if (attrs.shipping) label = "shipping"

        shippingAndTax.innerHTML += `<small> + ${additionalCost} ${label}</small>`
      }

      Object.keys(attrs).forEach(key => script.setAttribute(`data-${key}`, attrs[key]))

      infoWrapper.appendChild(itemName)
      infoWrapper.appendChild(price)
      infoWrapper.appendChild(shippingAndTax)
      infoWrapper.appendChild(script)
      element.appendChild(infoWrapper)
    })
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

      updateTimeout = setTimeout(() => {
        elements.forEach(element => Eager.createElement(null, element))

        updateElements()
      }, UPDATE_DELAY)
    }
  }
}())
