"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

(function () {
  if (!window.addEventListener) return; // Check for IE9+

  var language = window.navigator.userLanguage || window.navigator.language;
  var UPDATE_DELAY = 1500;
  var QUANTITY_AMOUNT = 1;
  var elements = [];
  // TODO find production host
  var PAYPAL_SCRIPT_URL = "https://cdn.rawgit.com/paypal/JavaScriptButtons/master/dist/button.js";
  var TIME_PERIOD_SYMBOLS = {
    D: "Daily",
    W: "Weekly",
    M: "Monthly",
    Y: "Yearly"
  };
  var CURRENCY_SYMBOL = {
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

  function localizeCurrency(integer) {
    var answer = void 0;

    if (integer.toLocaleString) {
      answer = integer.toLocaleString(language, { style: "currency", currency: options.region.currency });
    } else {
      answer = CURRENCY_SYMBOL[options.region.currency] + humanizedNumber(integer);
    }

    return answer;
  }

  function updateElements() {
    if (!options.merchant) return;

    var _options = options;
    var buttons = _options.buttons;
    var region = _options.region;


    buttons.forEach(function (attrs, i) {
      var button = document.createElement("script");
      var infoWrapper = document.createElement("eager-info-wrapper");
      var itemName = document.createElement("eager-item-name");
      var price = document.createElement("eager-price");
      var shippingAndTax = document.createElement("eager-shipping-and-tax");

      itemName.innerHTML = attrs.name;

      if (attrs.type !== "donate") price.innerHTML = localizeCurrency(attrs.amount);

      if (attrs.type === "subscribe") {
        var time = attrs.recurrence === 1 ? "time" : "times";

        price.innerHTML += " " + attrs.recurrence + " " + time + " " + TIME_PERIOD_SYMBOLS[attrs.timePeriod];
      }

      if (attrs.type !== "donate" && (region.tax || attrs.shipping)) {
        var additionalCost = localizeCurrency(region.tax + attrs.shipping);

        var label = void 0;

        if (region.tax && attrs.shipping) label = "shipping & tax";else if (region.tax) label = "tax";else if (attrs.shipping) label = "shipping";

        shippingAndTax.innerHTML += "<small> + " + additionalCost + " " + label + "</small>";
      }

      button.src = PAYPAL_SCRIPT_URL + "?merchant=" + options.merchant;
      button.setAttribute("data-button", attrs.type);
      button.setAttribute("data-type", attrs.type);
      button.setAttribute("data-name", attrs.name);
      button.setAttribute("data-currency", region.currency);
      button.setAttribute("data-tax", region.tax);
      button.setAttribute("data-shipping", attrs.shipping);
      button.setAttribute("data-size", "small");
      button.setAttribute("data-style", attrs.style);

      if (attrs.type === "donate") button.setAttribute("data-amount-editable", attrs.amount);else button.setAttribute("data-amount", attrs.amount);

      if (attrs.type === "buynow" || attrs.type === "cart") button.setAttribute("data-quantity-editable", QUANTITY_AMOUNT);else button.setAttribute("data-quantity", 1);

      if (attrs.type === "subscribe") {
        button.setAttribute("data-recurrence", attrs.recurrence);
        button.setAttribute("data-period", attrs.timePeriod);
      }

      if (INSTALL_ID === "preview") button.setAttribute("data-env", "sandbox");

      var element = elements[i] = Eager.createElement(attrs.location, elements[i]);

      element.className = "eager-paypal-buttons";
      infoWrapper.appendChild(itemName);
      infoWrapper.appendChild(price);
      infoWrapper.appendChild(shippingAndTax);
      infoWrapper.appendChild(button);
      element.appendChild(infoWrapper);
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