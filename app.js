(function () {
  if (!window.addEventListener) return // Check for IE9+

  let options = INSTALL_OPTIONS
  let element

  function updateElement() {
    element = Eager.createElement(options.location, element)

    element.className = "testing123"

    const eagerTest = document.createElement("eager-test")

    eagerTest.className = "testing123"

    console.log(element)

    eagerTest.innerHTML = `<script async="async" src="https://www.paypalobjects.com/js/external/paypal-button.min.js?merchant=RDRPHF2EZT6GJ" 
	    data-button="buynow" 
	    data-name="swag" 
	    data-quantity="99999999" 
	    data-amount="123456789" 
	    data-currency="USD" 
	    data-shipping="1.25" 
	    data-tax="3.50" 
	    data-env="sandbox"
	></script>`

    element.appendChild(eagerTest)
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
