"use strict";

(function () {
  if (!window.addEventListener) return; // Check for IE9+

  var options = INSTALL_OPTIONS;
  var updateTimeout = void 0;
  var delay = 1500;
  var elements = [];
  var PAYPAL_SCRIPT_URL = "https://cdn.rawgit.com/paypal/JavaScriptButtons/master/dist/button.js";
  var TIME_PERIOD_SYMBOLS = {
    D: "Daily",
    W: "Weekly",
    M: "Monthly",
    Y: "Yearly"
  };

  function updateElements() {
    if (options.merchant) {
      var _options = options;
      var buttons = _options.buttons;


      buttons.filter(function ($) {
        return $.name && $.amount;
      }).forEach(function (attrs, i) {
        var paypalButton = document.createElement("script");
        var paypalInfoWrapper = document.createElement("eager-paypal-info-wrapper");
        var paypalItemName = document.createElement("eager-paypal-item-name");
        var paypalPrice = document.createElement("eager-paypal-price");

        var currencySymbol = void 0;
        var times = void 0;

        if (options.region.currency === "GBP") {
          currencySymbol = "£";
        } else {
          currencySymbol = "$";
        }

        paypalItemName.innerHTML = "" + attrs.name;

        paypalPrice.innerHTML = "" + currencySymbol + attrs.amount + " " + options.region.currency + " ";

        if (attrs.type === "subscribe") {
          if (attrs.recurrence === 1) {
            times = "time";
          } else {
            times = "times";
          }
          paypalPrice.innerHTML += attrs.recurrence + " " + times + " " + TIME_PERIOD_SYMBOLS[attrs.timePeriod] + " ";
        }

        if (options.region.tax && !attrs.shipping) {
          paypalPrice.innerHTML += "<small>+ " + currencySymbol + options.region.tax + " tax </small>";
        } else if (attrs.shipping && !options.region.tax) {
          paypalPrice.innerHTML += "<small>+ " + currencySymbol + attrs.shipping + " shipping</small>";
        } else if (attrs.shipping && options.region.tax) {
          var shippingAndTax = attrs.shipping + options.region.tax;

          paypalPrice.innerHTML += "<small>+ " + currencySymbol + shippingAndTax + " shipping and tax</small>";
        }

        // TODO find production host
        paypalButton.src = PAYPAL_SCRIPT_URL + "?merchant=" + options.merchant;
        paypalButton.async;
        paypalButton.setAttribute("data-button", attrs.type);
        paypalButton.setAttribute("data-type", attrs.type);
        paypalButton.setAttribute("data-name", attrs.name);
        if (attrs.type === "donate") {
          paypalButton.setAttribute("data-amount-editable", 100);
        } else {
          paypalButton.setAttribute("data-amount", attrs.amount);
        }
        paypalButton.setAttribute("data-currency", options.region.currency);
        if (attrs.type === "buynow" || attrs.type === "cart") {
          paypalButton.setAttribute("data-quantity-editable", 1);
        } else {
          paypalButton.setAttribute("data-quantity", 1);
        }
        paypalButton.setAttribute("data-tax", options.region.tax);
        paypalButton.setAttribute("data-shipping", attrs.shipping);
        paypalButton.setAttribute("data-size", "small");
        paypalButton.setAttribute("data-style", attrs.style);
        if (attrs.type === "subscribe") {
          paypalButton.setAttribute("data-recurrence", attrs.recurrence);
          paypalButton.setAttribute("data-period", attrs.timePeriod);
        }

        var element = elements[i] = Eager.createElement(attrs.location, elements[i]);

        element.appendChild(paypalInfoWrapper);
        paypalInfoWrapper.appendChild(paypalItemName);
        paypalInfoWrapper.appendChild(paypalPrice);
        paypalInfoWrapper.appendChild(paypalButton);
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