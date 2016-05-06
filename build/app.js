"use strict";

(function () {
  if (!window.addEventListener) return; // Check for IE9+

  var options = INSTALL_OPTIONS;
  var element = void 0;

  function updateElement() {
    element = Eager.createElement(options.location, element);

    element.className = "testing123";

    var eagerTest = document.createElement("eager-test");

    eagerTest.className = "testing123";

    console.log(element);

    eagerTest.innerHTML = "<script async=\"async\" src=\"https://www.paypalobjects.com/js/external/paypal-button.min.js?merchant=RDRPHF2EZT6GJ\" \n\t    data-button=\"buynow\" \n\t    data-name=\"swag\" \n\t    data-quantity=\"99999999\" \n\t    data-amount=\"123456789\" \n\t    data-currency=\"USD\" \n\t    data-shipping=\"1.25\" \n\t    data-tax=\"3.50\" \n\t    data-env=\"sandbox\"\n\t></script>";

    element.appendChild(eagerTest);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateElement);
  } else {
    updateElement();
  }

  window.INSTALL_SCOPE = {
    setOptions: function setOptions(nextOptions) {
      options = nextOptions;

      updateElement();
    }
  };
})();