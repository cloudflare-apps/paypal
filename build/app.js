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

  var ATTENTION_CLASS = "eager-attention";
  var UPDATE_DELAY = 1500;
  var PAYPAL_SCRIPT_URL = "https://cdn.rawgit.com/EagerApps/PayPalButtons/master/vendor/button.js";
  var PERIOD_LABELS = {
    D: "day",
    W: "week",
    M: "month",
    Y: "year"
  };
  var CURRENCY_SYMBOLS = {
    CAD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    USD: "$"
  };
  var language = window.navigator.language || window.navigator.userLanguage;
  var container = void 0;
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

    var taxPercentage = parseFloat(locale.taxPercentage || 0, 10) / 100;

    container = Eager.createElement(location, container);
    container.className = "eager-paypal-buttons";

    buttons.forEach(function ($) {
      var _attrs;

      var script = document.createElement("script");
      var itemName = document.createElement("eager-item-name");
      var price = document.createElement("eager-price");
      var priceDetails = document.createElement("eager-price-details");
      var element = document.createElement("eager-button-container");

      itemName.textContent = $.name;
      if (!itemName.textContent) itemName.className = ATTENTION_CLASS;

      element.appendChild(itemName);

      script.src = PAYPAL_SCRIPT_URL + "?merchant=" + options.merchant;

      var tax = $.type === "donate" ? 0 : taxPercentage * ($.amount || 0);
      var attrs = (_attrs = {}, _defineProperty(_attrs, $.type === "donate" ? "amount-editable" : "amount", $.amount || 0), _defineProperty(_attrs, "lc", language.replace("-", "_")), _defineProperty(_attrs, "button", $.type), _defineProperty(_attrs, "currency", locale.currency), _defineProperty(_attrs, "host", INSTALL_ID === "preview" ? "www.sandbox.paypal.com" : "www.paypal.com"), _defineProperty(_attrs, "name", $.name), _defineProperty(_attrs, "shipping", $.shipping || 0), _defineProperty(_attrs, "size", "small"), _defineProperty(_attrs, "style", "primary"), _defineProperty(_attrs, "tax", tax.toPrecision(2)), _defineProperty(_attrs, "type", $.type), _defineProperty(_attrs, $.type === "buynow" || $.type === "cart" ? "quantity-editable" : "quantity", 1), _attrs);

      if ($.type !== "donate") {
        var localizedAmount = localizeCurrency(attrs.amount);

        if ($.type === "subscribe") {
          var plural = $.recurrence === 1 ? "" : "s"; // HACK: brittle.

          price.textContent = localizedAmount + " for " + $.recurrence + " " + PERIOD_LABELS[$.period] + plural;

          attrs.recurrence = $.recurrence;
          attrs.period = $.period;

          element.appendChild(price);
        } else {
          element.appendChild(price);
          price.textContent = localizedAmount;

          if (tax || attrs.shipping) {
            var additionalCost = tax + attrs.shipping;

            var label = void 0;

            if (tax && attrs.shipping) label = "shipping & tax";else if (tax) label = "tax";else if (attrs.shipping) label = "shipping";

            priceDetails.innerHTML = "&nbsp;+ " + localizeCurrency(additionalCost) + " " + label;

            if (additionalCost < 0) priceDetails.className = ATTENTION_CLASS;
            element.appendChild(priceDetails);
          }
        }

        if (attrs.amount <= 0) price.className = ATTENTION_CLASS;
      }

      Object.keys(attrs).forEach(function (key) {
        return script.setAttribute("data-" + key, attrs[key]);
      });

      element.appendChild(script);

      container.appendChild(element);
    });

    container.setAttribute("data-state", "loaded");
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

      if (container) container.setAttribute("data-state", "refreshing");

      updateTimeout = setTimeout(updateElements, UPDATE_DELAY);
    }
  };
})();