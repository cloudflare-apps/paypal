(function () {
  if (!window.addEventListener) return // Check for IE9+

  let options = INSTALL_OPTIONS
  let element
  const paypalURL = "https://www.paypalobjects.com/js/external/paypal-button.min.js?merchant="

  function updateElement() {
    const {buttons} = options

    buttons
    .filter($ => $.name && $.price && $.quantity && $.tax && $.shipping && $.howOften && $.timePeriod)
    .forEach(({location, type, name, amount, howOften, timePeriod, currency, quantity, tax, shipping, size, style}, i) => {
      element = Eager.createElement(location, element)

      const paypalButton = document.createElement("script")

      paypalButton.setAttribute("src", `${paypalURL}${options.merchant}`)
      paypalButton.setAttribute("data-paypalButton", `${type}`)
      paypalButton.setAttribute("data-type", "form")
      paypalButton.setAttribute("data-name", `${name}`)
      paypalButton.setAttribute("data-amount", `${amount}`)
      paypalButton.setAttribute("data-currency", `${currency}`)
      paypalButton.setAttribute("data-quantity", `${quantity}`)
      paypalButton.setAttribute("data-tax", `${tax}`)
      paypalButton.setAttribute("data-shipping", `${shipping}`)
      paypalButton.setAttribute("data-size", `${size}`)
      paypalButton.setAttribute("data-style", `${style}`)
      if (type === "subscribe") {
        paypalButton.setAttribute("data-reoccurance", `${howOften}`)
        paypalButton.setAttribute("data-period", `${timePeriod}`)
      }

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
      options = nextOptions

      updateElement()
    }
  }
}())
