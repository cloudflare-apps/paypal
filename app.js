(function () {
  if (!window.addEventListener) return // Check for IE9+

  let options = INSTALL_OPTIONS
  let element

  function updateElement() {
    const merchantID = ""
    const button = "subscribe"
    const productName = "SWAG"
    const price = 7.00
    const size = "small"
    const style = "secondary"
    const shipping = 2.50
    const tax = 153.00
    const currency = "USD"
    const howMany = 12

    // only if subscription
    const howOften = 1
    const timePeriod = "M"

    element = Eager.createElement(options.buttons.location, element)

    element.innerHTML = `<script async src="https://www.paypalobjects.com/js/external/paypal-button.min.js?merchant=${merchantID}"
      data-button="${button}"
      data-type="form"
      data-name="${productName}"
      data-amount="${price}"
      data-currency="${currency}"
      data-quantity="${howMany}"
      data-tax="${tax}"
      data-shipping="${shipping}"
      data-size="${size}"
      data-style="${style}"
    ></script>`

    // if subscribe
    element.setAttribute("data-reoccurance", howOften)
    element.setAttribute("data-period", timePeriod)
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
