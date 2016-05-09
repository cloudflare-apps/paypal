"use strict";

(function () {
  if (!window.addEventListener) return; // Check for IE9+

  var options = INSTALL_OPTIONS;
  var elements = [];
  var PAYPAL_SCRIPT_URL = "https://www.paypalobjects.com/js/external/paypal-button.min.js";

  function updateElement() {
    var _options = options;
    var buttons = _options.buttons;


    buttons
    // .filter($ => $.name && $.price && $.quantity && $.tax && $.shipping && $.howOften && $.timePeriod)
    .forEach(function (attrs, i) {
      var paypalButton = document.createElement("script");

      paypalButton.src = PAYPAL_SCRIPT_URL + "?merchant=" + options.merchant;
      paypalButton.setAttribute("data-button", attrs.type);
      paypalButton.setAttribute("data-type", "form");
      paypalButton.setAttribute("data-name", attrs.name);
      paypalButton.setAttribute("data-amount", attrs.amount);
      paypalButton.setAttribute("data-currency", attrs.currency);
      paypalButton.setAttribute("data-quantity", attrs.quantity);
      paypalButton.setAttribute("data-tax", attrs.tax);
      paypalButton.setAttribute("data-shipping", attrs.shipping);
      paypalButton.setAttribute("data-size", attrs.size);
      paypalButton.setAttribute("data-style", attrs.style);
      if (attrs.type === "subscribe") {
        paypalButton.setAttribute("data-recurrence", attrs.recurrence);
        paypalButton.setAttribute("data-period", attrs.timePeriod);
      }

      var element = elements[i] = Eager.createElement(attrs.location, elements[i]);

      element.appendChild(paypalButton);
    });
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