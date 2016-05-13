"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function () {
  if (!window.addEventListener) return; // Check for IE9+

  var hasNativeLocale = false;

  try {
    0..toLocaleString("i");
  } catch (error) {
    hasNativeLocale = error.name === "RangeError";
  }

  var UPDATE_DELAY = 1500;
  var PAYPAL_SCRIPT_URL = "https://cdn.rawgit.com/EagerApps/PayPalButtons/master/vendor/button.js";
  var PERIOD_LABELS = {
    D: "Daily",
    W: "Weekly",
    M: "Monthly",
    Y: "Yearly"
  };
  var CURRENCY_SYMBOLS = {
    CAD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    USD: "$"
  };
  var language = window.navigator.language || window.navigator.userLanguage;
  var elements = [];

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

  function localizeCurrency(number) {
    if (hasNativeLocale) return number.toLocaleString(language, {
      currency: options.locale.currency,
      style: "currency"
    });

    return CURRENCY_SYMBOLS[options.locale.currency] + humanizedNumber(number);
  }

  function updateElements() {
    if (!options.merchant) return;

    var _options = options;
    var buttons = _options.buttons;
    var locale = _options.locale;
    var location = _options.location;

    var taxPercentage = locale.taxPercentage || 0;

    buttons.forEach(function ($, index) {
      var _attrs;

      var script = document.createElement("script");
      var infoWrapper = document.createElement("eager-info-wrapper");
      var itemName = document.createElement("eager-item-name");
      var price = document.createElement("eager-price");
      var shippingAndTax = document.createElement("eager-shipping-and-tax");
      var element = elements[index] = Eager.createElement(location, elements[index]);

      element.className = "eager-paypal-buttons";
      itemName.innerHTML = $.name;
      script.src = PAYPAL_SCRIPT_URL + "?merchant=" + options.merchant;

      var attrs = (_attrs = {}, _defineProperty(_attrs, $.type === "donate" ? "amount-editable" : "amount", $.amount || 0), _defineProperty(_attrs, "lc", language.replace("-", "_")), _defineProperty(_attrs, "button", $.type), _defineProperty(_attrs, "currency", locale.currency), _defineProperty(_attrs, "host", INSTALL_ID === "preview" ? "www.sandbox.paypal.com" : "www.paypal.com"), _defineProperty(_attrs, "name", $.name), _defineProperty(_attrs, "shipping", $.shipping || 0), _defineProperty(_attrs, "size", "small"), _defineProperty(_attrs, "style", "primary"), _defineProperty(_attrs, "tax", $.type === "donate" ? 0 : taxPercentage * ($.amount || 0)), _defineProperty(_attrs, "type", $.type), _defineProperty(_attrs, $.type === "buynow" || $.type === "cart" ? "quantity-editable" : "quantity", 1), _attrs);

      if ($.type === "subscribe") {
        var time = $.recurrence === 1 ? "time" : "times";

        price.innerHTML += " " + $.recurrence + " " + time + " " + PERIOD_LABELS[$.timePeriod];

        attrs.recurrence = $.recurrence;
        attrs.period = $.timePeriod;
      }

      if ($.type !== "donate") price.innerHTML = localizeCurrency(attrs.amount);

      if ($.type !== "donate" && (attrs.tax || attrs.shipping)) {
        var additionalCost = localizeCurrency(attrs.tax + attrs.shipping);

        var label = void 0;

        if (attrs.tax && attrs.shipping) label = "shipping & tax";else if (attrs.tax) label = "tax";else if (attrs.shipping) label = "shipping";

        shippingAndTax.innerHTML += "<small> + " + additionalCost + " " + label + "</small>";
      }

      Object.keys(attrs).forEach(function (key) {
        return script.setAttribute("data-" + key, attrs[key]);
      });

      infoWrapper.appendChild(itemName);
      infoWrapper.appendChild(price);
      infoWrapper.appendChild(shippingAndTax);
      infoWrapper.appendChild(script);
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