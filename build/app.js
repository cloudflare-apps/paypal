"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

  function humanizedNumber() {
    var number = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

    var _number$toFixed$split = number.toFixed(2).split(".");

    var _number$toFixed$split2 = _slicedToArray(_number$toFixed$split, 2);

    var wholes = _number$toFixed$split2[0];
    var decimals = _number$toFixed$split2[1];


    var formatted = wholes.split("").reverse().reduce(function (accumulator, character, index, entries) {
      var placeIndex = index + 1;
      var delimiter = placeIndex !== entries.length && placeIndex % 3 === 0 ? "," : "";

      return delimiter + character + accumulator;
    }, "");

    return [formatted, decimals].join(".");
  }

  function updateElements() {
    if (!options.merchant) return;

    var _options = options;
    var buttons = _options.buttons;
    var _options2 = options;
    var region = _options2.region;


    buttons.forEach(function (attrs, i) {
      var Button = document.createElement("script");
      var InfoWrapper = document.createElement("eager-info-wrapper");
      var ItemName = document.createElement("eager-item-name");
      var Price = document.createElement("eager-price");
      var shippingAndTax = document.createElement("eager-shipping-and-tax");

      var time = void 0;

      ItemName.innerHTML = attrs.name;

      if (toLocaleString) Price.innerHTML = "" + currencySymbol[region.currency] + attrs.amount.toLocaleString();else Price.innerHTML = "" + currencySymbol[region.currency] + humanizedNumber(attrs.amount);

      if (attrs.type === "subscribe") {
        time = attrs.recurrence === 1 ? "time" : "times";
        Price.innerHTML += " " + attrs.recurrence + " " + time + " " + TIME_PERIOD_SYMBOLS[attrs.timePeriod];
      }

      if (region.tax && attrs.type !== "donate" || attrs.shipping && attrs.type !== "donate") {
        var additionalCost = toLocaleString ? (region.tax + attrs.shipping).toLocaleString() : humanizedNumber(region.tax + attrs.shipping);

        var label = void 0;

        if (region.tax && attrs.shipping) label = "shipping & tax";else if (region.tax) label = "tax";else if (attrs.shipping) label = "shipping";

        shippingAndTax.innerHTML += "<small> + " + currencySymbol[region.currency] + additionalCost + " " + label + "</small>";
      }

      Button.src = PAYPAL_SCRIPT_URL + "?merchant=" + options.merchant;
      Button.setAttribute("data-button", attrs.type);
      Button.setAttribute("data-type", attrs.type);
      Button.setAttribute("data-name", attrs.name);
      Button.setAttribute("data-currency", region.currency);
      Button.setAttribute("data-tax", region.tax);
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
      InfoWrapper.appendChild(shippingAndTax);
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