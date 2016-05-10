"use strict";

(function () {
  if (!window.addEventListener) return; // Check for IE9+

  var options = INSTALL_OPTIONS;
  var updateTimeout = void 0;
  var delay = 1500;
  var elements = [];
  var PAYPAL_SCRIPT_URL = "https://cdn.rawgit.com/paypal/JavaScriptButtons/master/dist/button.js";

  function updateElements() {
    if (options.merchant) {
      var _options = options;
      var buttons = _options.buttons;


      buttons.filter(function ($) {
        return $.name && $.amount;
      }).forEach(function (attrs, i) {
        var paypalButton = document.createElement("script");

        var paypalPrice = document.createElement("eager-price");

        var currencySymbol = void 0;

        if (attrs.currency === "GBP") {
          currencySymbol = "£";
        } else {
          currencySymbol = "$";
        }

        paypalPrice.innerText = "" + currencySymbol + attrs.amount + " " + attrs.currency + " ";

        if (attrs.type === "subscribe") {
          paypalPrice.innerText += attrs.recurrence + " times " + attrs.timePeriod + " ";
        }

        if (attrs.tax) {
          paypalPrice.innerText += "+ " + currencySymbol + attrs.tax + " tax ";
        }

        if (attrs.shipping) {
          paypalPrice.innerText += "+ " + currencySymbol + attrs.shipping + " shipping";
        }

        // TODO find production host
        paypalButton.src = PAYPAL_SCRIPT_URL + "?merchant=" + options.merchant;
        paypalButton.async;
        paypalButton.setAttribute("data-button", attrs.type);
        paypalButton.setAttribute("data-type", "form");
        paypalButton.setAttribute("data-name", attrs.name);
        if (attrs.type === "donate") {
          paypalButton.setAttribute("data-amount-editable", 100);
        } else {
          paypalButton.setAttribute("data-amount", attrs.amount);
        }
        paypalButton.setAttribute("data-currency", attrs.currency);
        if (attrs.type === "buynow" || attrs.type === "cart") {
          paypalButton.setAttribute("data-quantity-editable", 1);
        } else {
          paypalButton.setAttribute("data-quantity", 1);
        }
        paypalButton.setAttribute("data-tax", attrs.tax);
        paypalButton.setAttribute("data-shipping", attrs.shipping);
        paypalButton.setAttribute("data-size", "small");
        paypalButton.setAttribute("data-style", attrs.style);
        if (attrs.type === "subscribe") {
          paypalButton.setAttribute("data-recurrence", attrs.recurrence);
          paypalButton.setAttribute("data-period", attrs.timePeriod);
        }

        var element = elements[i] = Eager.createElement(attrs.location, elements[i]);

        element.className = "eager-paypal";
        element.appendChild(paypalPrice);
        element.appendChild(paypalButton);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateElements);
  } else {
    updateElements();
  }

  window.INSTALL_SCOPE = {
    setOptions: function setOptions(nextOptions) {
      clearTimeout(updateTimeout);
      options = nextOptions;

      updateTimeout = setTimeout(function () {
        elements.forEach(function (element) {
          return Eager.createElement(null, element);
        });

        updateElements();
      }, delay);
    }
  };
})();