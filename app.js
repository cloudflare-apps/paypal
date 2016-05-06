(function () {
  if (!window.addEventListener) return // Check for IE9+

  let options = INSTALL_OPTIONS
  let element

  const buynow = {
    name: "Swag",
    amount: "134.21"
  }

  const config = {
    button: "buynow",
    type: "button",
    style: "primary",
    size: "small",
    host: "https://www.paypal.com"
  }

  function updateElement() {
    element = Eager.createElement(options.location, element)

    paypal.button.create("RDRPHF2EZT6GJ", buynow, config, element)
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
