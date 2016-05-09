"use strict";

(function () {
  if (!window.addEventListener) return; // Check for IE9+

  var options = INSTALL_OPTIONS;
  var element = void 0;

  function updateElement() {
    var merchantID = "";
    var button = "subscribe";
    var productName = "SWAG";
    var price = 7.00;
    var size = "small";
    var style = "secondary";
    var shipping = 2.50;
    var tax = 153.00;
    var currency = "USD";
    var howMany = 12;

    // only if subscription
    var howOften = 1;
    var timePeriod = "M";

    element = Eager.createElement(options.buttons.location, element);

    element.innerHTML = "<script async src=\"https://www.paypalobjects.com/js/external/paypal-button.min.js?merchant=" + merchantID + "\"\n      data-button=\"" + button + "\"\n      data-type=\"form\"\n      data-name=\"" + productName + "\"\n      data-amount=\"" + price + "\"\n      data-currency=\"" + currency + "\"\n      data-quantity=\"" + howMany + "\"\n      data-tax=\"" + tax + "\"\n      data-shipping=\"" + shipping + "\"\n      data-size=\"" + size + "\"\n      data-style=\"" + style + "\"\n    ></script>";

    // if subscribe
    element.setAttribute("data-reoccurance", howOften);
    element.setAttribute("data-period", timePeriod);
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