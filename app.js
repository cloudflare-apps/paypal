(function () {
  if (!window.addEventListener) return // Check for IE9+

  let options = INSTALL_OPTIONS
  let updateTimeout
  const delay = 1500
  const elements = []
  const PAYPAL_SCRIPT_URL = "https://cdn.rawgit.com/paypal/JavaScriptButtons/master/dist/button.js"

  function updateElements() {
    const {buttons} = options

    buttons
    // .filter($ => $.name && $.price && $.quantity && $.tax && $.shipping && $.howOften && $.timePeriod)
    .forEach((attrs, i) => {
      const paypalButton = document.createElement("script")

      const paypalPrice = document.createElement("eager-price")

      paypalPrice.innerText = attrs.amount = "undefined" ? `_ ${attrs.currency}` : `${attrs.amount} ${attrs.currency}`

      // TODO find production host
      paypalButton.src = `${PAYPAL_SCRIPT_URL}?merchant=${options.merchant}`
      paypalButton.async
      paypalButton.setAttribute("data-button", attrs.type)
      paypalButton.setAttribute("data-type", "form")
      paypalButton.setAttribute("data-name", attrs.name)
      paypalButton.setAttribute("data-amount", attrs.amount)
      paypalButton.setAttribute("data-currency", attrs.currency)
      paypalButton.setAttribute("data-quantity-editable", 1)
      paypalButton.setAttribute("data-tax", attrs.tax)
      paypalButton.setAttribute("data-shipping", attrs.shipping)
      paypalButton.setAttribute("data-size", attrs.size)
      paypalButton.setAttribute("data-style", attrs.style)
      if (attrs.type === "subscribe") {
        paypalButton.setAttribute("data-recurrence", attrs.recurrence)
        paypalButton.setAttribute("data-period", attrs.timePeriod)
      }

      const element = elements[i] = Eager.createElement(attrs.location, elements[i])

      element.appendChild(paypalPrice)
      element.appendChild(paypalButton)
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
      }, delay)
    }
  }
}())
