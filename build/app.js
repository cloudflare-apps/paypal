"use strict";

(function () {
  if (!window.addEventListener) return; // Check for IE9+

  var options = INSTALL_OPTIONS;
  var element = void 0;
  var paypalURL = "https://www.paypalobjects.com/js/external/paypal-button.min.js?merchant=";

  function updateElement() {
    var _options = options;
    var buttons = _options.buttons;


    buttons.filter(function ($) {
      return $.name && $.price && $.quantity && $.tax && $.shipping && $.howOften && $.timePeriod;
    }).forEach(function (_ref, i) {
      var location = _ref.location;
      var type = _ref.type;
      var name = _ref.name;
      var amount = _ref.amount;
      var howOften = _ref.howOften;
      var timePeriod = _ref.timePeriod;
      var currency = _ref.currency;
      var quantity = _ref.quantity;
      var tax = _ref.tax;
      var shipping = _ref.shipping;
      var size = _ref.size;
      var style = _ref.style;

      element = Eager.createElement(location, element);

      var paypalButton = document.createElement("script");

      paypalButton.setAttribute("src", "" + paypalURL + options.merchant);
      paypalButton.setAttribute("data-paypalButton", "" + type);
      paypalButton.setAttribute("data-type", "form");
      paypalButton.setAttribute("data-name", "" + name);
      paypalButton.setAttribute("data-amount", "" + amount);
      paypalButton.setAttribute("data-currency", "" + currency);
      paypalButton.setAttribute("data-quantity", "" + quantity);
      paypalButton.setAttribute("data-tax", "" + tax);
      paypalButton.setAttribute("data-shipping", "" + shipping);
      paypalButton.setAttribute("data-size", "" + size);
      paypalButton.setAttribute("data-style", "" + style);
      if (type === "subscribe") {
        paypalButton.setAttribute("data-reoccurance", "" + howOften);
        paypalButton.setAttribute("data-period", "" + timePeriod);
      }

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