"use strict";

(function () {
  if (!window.addEventListener) return; // Check for IE9+

  var UPDATE_DELAY = 1500;
  var elements = [];
  // TODO find production host
  var PAYPAL_SCRIPT_URL = "https://cdn.rawgit.com/paypal/JavaScriptButtons/master/dist/button.js";
  var TIME_PERIOD_SYMBOLS = {
    D: "Daily",
    W: "Weekly",
    M: "Monthly",
    Y: "Yearly"
  };
  var currencySymbol = {
    GBP: "£",
    USD: "$",
    CAD: "$",
    EUR: "€",
    JPY: "¥"
  };

  var options = INSTALL_OPTIONS;
  var updateTimeout = void 0;

  function updateElements() {
    if (!options.merchant) return;

    var _options = options;
    var buttons = _options.buttons;


    buttons.forEach(function (attrs, i) {
      var Button = document.createElement("script");
      var InfoWrapper = document.createElement("eager-info-wrapper");
      var ItemName = document.createElement("eager-item-name");
      var Price = document.createElement("eager-price");

      var time = void 0;

      ItemName.innerHTML = attrs.name;

      Price.innerHTML = "" + currencySymbol[options.region.currency] + attrs.amount;

      if (attrs.type === "subscribe") {
        time = attrs.recurrence === 1 ? "time" : "times";
        Price.innerHTML += " " + attrs.recurrence + " " + time + " " + TIME_PERIOD_SYMBOLS[attrs.timePeriod];
      }

      if (options.region.tax && attrs.type !== "donate" || attrs.shipping && attrs.type !== "donate") {
        var additionalCost = (options.region.tax + attrs.shipping).toFixed(2);

        var label = void 0;

        if (options.region.tax && attrs.shipping) label = "shipping & tax";else if (options.region.tax) label = "tax";else if (attrs.shipping) label = "shipping";

        Price.innerHTML += "<small> + " + currencySymbol[options.region.currency] + additionalCost + " " + label + "</small>";
      }

      Button.src = PAYPAL_SCRIPT_URL + "?merchant=" + options.merchant;
      Button.setAttribute("data-button", attrs.type);
      Button.setAttribute("data-type", attrs.type);
      Button.setAttribute("data-name", attrs.name);
      Button.setAttribute("data-currency", options.region.currency);
      Button.setAttribute("data-tax", options.region.tax);
      Button.setAttribute("data-shipping", attrs.shipping);
      Button.setAttribute("data-size", "small");
      Button.setAttribute("data-style", attrs.style);

      if (attrs.type === "donate") Button.setAttribute("data-amount-editable", 100);else Button.setAttribute("data-amount", attrs.amount);

      if (attrs.type === "buynow" || attrs.type === "cart") Button.setAttribute("data-quantity-editable", 1);else Button.setAttribute("data-quantity", 1);

      if (attrs.type === "subscribe") {
        Button.setAttribute("data-recurrence", attrs.recurrence);
        Button.setAttribute("data-period", attrs.timePeriod);
      }

      if (INSTALL_ID === "preview") Button.setAttribute("data-env", "sandbox");

      var element = elements[i] = Eager.createElement(attrs.location, elements[i]);

      InfoWrapper.appendChild(ItemName);
      InfoWrapper.appendChild(Price);
      InfoWrapper.appendChild(Button);
      element.appendChild(InfoWrapper);
    });
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
      }, UPDATE_DELAY);
    }
  };
})();