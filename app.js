(function () {
  if (!window.addEventListener) return // Check for IE9+

  let options = INSTALL_OPTIONS
  const elements = []
  const PAYPAL_SCRIPT_URL = "https://cdn.rawgit.com/paypal/JavaScriptButtons/master/dist/button.js"

  function updateElement() {
    const {buttons} = options

    buttons
    // .filter($ => $.name && $.price && $.quantity && $.tax && $.shipping && $.howOften && $.timePeriod)
    .forEach((attrs, i) => {
      const paypalButton = document.createElement("script")

      // TODO find production host
      paypalButton.src = `${PAYPAL_SCRIPT_URL}?merchant=${options.merchant}`
      paypalButton.setAttribute("data-button", attrs.type)
      paypalButton.setAttribute("data-type", "form")
      paypalButton.setAttribute("data-name", attrs.name)
      paypalButton.setAttribute("data-amount", attrs.amount)
      paypalButton.setAttribute("data-currency", attrs.currency)
      paypalButton.setAttribute("data-quantity", attrs.quantity)
      paypalButton.setAttribute("data-tax", attrs.tax)
      paypalButton.setAttribute("data-shipping", attrs.shipping)
      paypalButton.setAttribute("data-size", attrs.size)
      paypalButton.setAttribute("data-style", attrs.style)
      if (attrs.type === "subscribe") {
        paypalButton.setAttribute("data-recurrence", attrs.recurrence)
        paypalButton.setAttribute("data-period", attrs.timePeriod)
      }

      const element = elements[i] = Eager.createElement(attrs.location, elements[i])

      element.appendChild(paypalButton)
    })
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateElement)
  }
  else {
    updateElement()
  }

  window.INSTALL_SCOPE = {
    setOptions(nextOptions) {
      elements.forEach(element => Eager.createElement(null, element))
      options = nextOptions

      updateElement()
    }
  }
}())
