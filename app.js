(function () {
  if (!window.addEventListener) return // Check for IE9+

  const UPDATE_DELAY = 1500
  const elements = []
  // TODO find production host
  const PAYPAL_SCRIPT_URL = "https://cdn.rawgit.com/paypal/JavaScriptButtons/master/dist/button.js"
  const TIME_PERIOD_SYMBOLS = {
    D: "Daily",
    W: "Weekly",
    M: "Monthly",
    Y: "Yearly"
  }
  const currencySymbol = {
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

  function updateElements() {
    if (!options.merchant) return

    const {buttons} = options
    const {region} = options

    buttons
    .forEach((attrs, i) => {
      const Button = document.createElement("script")
      const InfoWrapper = document.createElement("eager-info-wrapper")
      const ItemName = document.createElement("eager-item-name")
      const Price = document.createElement("eager-price")
      const shippingAndTax = document.createElement("eager-shipping-and-tax")

      let time

      ItemName.innerHTML = attrs.name

      if (toLocaleString) Price.innerHTML = `${currencySymbol[region.currency]}${attrs.amount.toLocaleString()}`
      else Price.innerHTML = `${currencySymbol[region.currency]}${humanizedNumber(attrs.amount)}`


      if (attrs.type === "subscribe") {
        time = attrs.recurrence === 1 ? "time" : "times"
        Price.innerHTML += ` ${attrs.recurrence} ${time} ${TIME_PERIOD_SYMBOLS[attrs.timePeriod]}`
      }

      if (region.tax && attrs.type !== "donate" || attrs.shipping && attrs.type !== "donate") {
        const additionalCost = toLocaleString ? (region.tax + attrs.shipping).toLocaleString() : humanizedNumber(region.tax + attrs.shipping)

        let label

        if (region.tax && attrs.shipping) label = "shipping & tax"
        else if (region.tax) label = "tax"
        else if (attrs.shipping) label = "shipping"

        shippingAndTax.innerHTML += `<small> + ${currencySymbol[region.currency]}${additionalCost} ${label}</small>`
      }

      Button.src = `${PAYPAL_SCRIPT_URL}?merchant=${options.merchant}`
      Button.setAttribute("data-button", attrs.type)
      Button.setAttribute("data-type", attrs.type)
      Button.setAttribute("data-name", attrs.name)
      Button.setAttribute("data-currency", region.currency)
      Button.setAttribute("data-tax", region.tax)
      Button.setAttribute("data-shipping", attrs.shipping)
      Button.setAttribute("data-size", "small")
      Button.setAttribute("data-style", attrs.style)

      if (attrs.type === "donate") Button.setAttribute("data-amount-editable", 100)
      else Button.setAttribute("data-amount", attrs.amount)

      if (attrs.type === "buynow" || attrs.type === "cart") Button.setAttribute("data-quantity-editable", 1)
      else Button.setAttribute("data-quantity", 1)

      if (attrs.type === "subscribe") {
        Button.setAttribute("data-recurrence", attrs.recurrence)
        Button.setAttribute("data-period", attrs.timePeriod)
      }

      if (INSTALL_ID === "preview") Button.setAttribute("data-env", "sandbox")

      const element = elements[i] = Eager.createElement(attrs.location, elements[i])

      InfoWrapper.appendChild(ItemName)
      InfoWrapper.appendChild(Price)
      InfoWrapper.appendChild(shippingAndTax)
      InfoWrapper.appendChild(Button)
      element.appendChild(InfoWrapper)
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
