(function () {
  if (!window.addEventListener) return // Check for IE9+

  let supportsLocale = false

  try {
    (0).toLocaleString("i")
  }
  catch (error) {
    supportsLocale = error.name === "RangeError"
  }

  const language = window.navigator.userLanguage || window.navigator.language
  const UPDATE_DELAY = 1500
  const QUANTITY_AMOUNT = 1
  const elements = []
  // TODO find production host
  const PAYPAL_SCRIPT_URL = "https://cdn.rawgit.com/paypal/JavaScriptButtons/master/dist/button.js"
  const TIME_PERIOD_SYMBOLS = {
    D: "Daily",
    W: "Weekly",
    M: "Monthly",
    Y: "Yearly"
  }
  const CURRENCY_SYMBOL = {
    GBP: "£",
    USD: "$",
    CAD: "$",
    EUR: "€",
    JPY: "¥"
  }

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
    if (supportsLocale) return number.toLocaleString(language, {
      style: "currency",
      currency: options.region.currency
    })

    return CURRENCY_SYMBOL[options.region.currency] + humanizedNumber(number)
  }

  function updateElements() {
    if (!options.merchant) return

    const {buttons, region} = options

    buttons
    .forEach((attrs, i) => {
      const button = document.createElement("script")
      const infoWrapper = document.createElement("eager-info-wrapper")
      const itemName = document.createElement("eager-item-name")
      const price = document.createElement("eager-price")
      const shippingAndTax = document.createElement("eager-shipping-and-tax")

      itemName.innerHTML = attrs.name

      if (attrs.type !== "donate") price.innerHTML = localizeCurrency(attrs.amount)

      if (attrs.type === "subscribe") {
        const time = attrs.recurrence === 1 ? "time" : "times"

        price.innerHTML += ` ${attrs.recurrence} ${time} ${TIME_PERIOD_SYMBOLS[attrs.timePeriod]}`
      }

      if (attrs.type !== "donate" && (region.tax || attrs.shipping)) {
        const additionalCost = localizeCurrency(region.tax + attrs.shipping)

        let label

        if (region.tax && attrs.shipping) label = "shipping & tax"
        else if (region.tax) label = "tax"
        else if (attrs.shipping) label = "shipping"

        shippingAndTax.innerHTML += `<small> + ${additionalCost} ${label}</small>`
      }

      button.src = `${PAYPAL_SCRIPT_URL}?merchant=${options.merchant}`
      button.setAttribute("data-button", attrs.type)
      button.setAttribute("data-type", attrs.type)
      button.setAttribute("data-name", attrs.name)
      button.setAttribute("data-currency", region.currency)
      button.setAttribute("data-tax", region.tax)
      button.setAttribute("data-shipping", attrs.shipping)
      button.setAttribute("data-size", "small")
      button.setAttribute("data-style", attrs.style)

      if (attrs.type === "donate") button.setAttribute("data-amount-editable", attrs.amount)
      else button.setAttribute("data-amount", attrs.amount)

      if (attrs.type === "buynow" || attrs.type === "cart") button.setAttribute("data-quantity-editable", QUANTITY_AMOUNT)
      else button.setAttribute("data-quantity", 1)

      if (attrs.type === "subscribe") {
        button.setAttribute("data-recurrence", attrs.recurrence)
        button.setAttribute("data-period", attrs.timePeriod)
      }

      if (INSTALL_ID === "preview") button.setAttribute("data-env", "sandbox")

      const element = elements[i] = Eager.createElement(attrs.location, elements[i])

      element.className = "eager-paypal-buttons"
      infoWrapper.appendChild(itemName)
      infoWrapper.appendChild(price)
      infoWrapper.appendChild(shippingAndTax)
      infoWrapper.appendChild(button)
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
