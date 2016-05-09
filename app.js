(function () {
  if (!window.addEventListener) return // Check for IE9+

  let options = INSTALL_OPTIONS
  let element

  function updateElement() {
    function addOptions(button) {
      element = Eager.createElement(button.location, element)

      element.innerHTML = `<script async src="https://www.paypalobjects.com/js/external/paypal-button.min.js?merchant=${options.merchant}"
        data-button="${button.type}"
        data-type="form"
        data-name="${button.name}"
        data-amount="${button.price}"
        data-currency="${button.currency}"
        data-quantity="${button.quantity}"
        data-tax="${button.tax}"
        data-shipping="${button.shipping}"
        data-size="${button.size}"
        data-style="${button.style}"
      ></script>`

      // if subscribe
      // element.setAttribute("data-reoccurance", button.howOften)
      // element.setAttribute("data-period", button.timePeriod)
    }

    function addButton() {
      for (let i = 0; i < options.buttons.length; i++){
        addOptions(options.buttons[i])
      }
    }
    addButton()
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
