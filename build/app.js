(function () {
  'use strict';

  var babelHelpers = {};

  babelHelpers.defineProperty = function (obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  };

  babelHelpers.slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

  babelHelpers;

  var NAME_PLACEHOLDERS = {
    buynow: "Product Name",
    donate: "Donation Name",
    subscribe: "Subscription Name"
  };

  var PERIOD_LABELS = {
    D: {
      singular: "day",
      plural: "days"
    },
    W: {
      singular: "week",
      plural: "weeks"
    },
    M: {
      singular: "month",
      plural: "months"
    },
    Y: {
      singular: "year",
      plural: "years"
    }
  };

  var CURRENCY_SYMBOLS = {
    CAD: "$",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    USD: "$"
  };

  var hasNativeLocale = false;

  try {
    0..toLocaleString("i");
  } catch (error) {
    hasNativeLocale = error.name === "RangeError";
  }

  function humanizedNumber() {
    var number = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

    var _number$toFixed$split = number.toFixed(2).split(".");

    var _number$toFixed$split2 = babelHelpers.slicedToArray(_number$toFixed$split, 2);

    var wholes = _number$toFixed$split2[0];
    var decimals = _number$toFixed$split2[1];


    var formatted = wholes.split("").reverse().reduce(function (accumulator, character, index, entries) {
      var placeIndex = index + 1;
      var delimiter = placeIndex !== entries.length && placeIndex % 3 === 0 ? "," : "";

      return delimiter + character + accumulator;
    }, "");

    return [formatted, decimals].join(".");
  }

  function localizeCurrency(language, currency, number) {
    var localized = void 0;

    if (hasNativeLocale) localized = number.toLocaleString(language, {
      currency: currency,
      style: "currency"
    });else localized = CURRENCY_SYMBOLS[currency] + humanizedNumber(number);

    return localized.replace(/\.00$/, "");
  }

  (function () {
    if (!window.addEventListener) return; // Check for IE9+

    var ATTENTION_CLASS = "eager-attention";
    var UPDATE_DELAY = 1500;
    var IS_PREVIEW = INSTALL_ID === "preview";

    var language = window.navigator.language || window.navigator.userLanguage;
    var container = void 0;
    var options = INSTALL_OPTIONS;
    var updateTimeout = void 0;

    function toArray(arrayLike) {
      return Array.prototype.slice.call(arrayLike);
    }

    function updateElements() {
      var _options = options;
      var locale = _options.locale;
      var _options2 = options;
      var merchantID = _options2.merchantID;


      if (!merchantID && !IS_PREVIEW) return;

      container = Eager.createElement(options.location, container);
      container.className = "eager-paypal-buttons";

      if (!merchantID) {
        merchantID = "eager@paypal.preview";

        container.innerHTML = "<eager-waiting-message>\n        Please provide your PayPal email in the app installer.\n      </eager-waiting-message>";
        container.setAttribute("data-state", "waiting");
      }

      var localizeCurrency$$ = localizeCurrency.bind(null, language, locale.currency);
      var processElement = window.paypal.button.processElement.bind(null, merchantID);
      var taxPercentage = parseFloat(locale.taxPercentage || 0, 10) / 100;
      var currencySymbol = CURRENCY_SYMBOLS[options.locale.currency];

      options.buttons.forEach(function ($) {
        var _attrs;

        var script = document.createElement("script");
        var itemName = document.createElement("eager-item-name");
        var price = document.createElement("eager-price");
        var priceDetails = document.createElement("eager-price-details");
        var element = document.createElement("eager-button-container");

        element.setAttribute("data-button-type", $.type);

        var name = $["name-" + $.type];
        var amount = $["amount-" + $.type] || 0;
        var tax = $.type === "buynow" ? taxPercentage * amount : 0;
        var attrs = (_attrs = {}, babelHelpers.defineProperty(_attrs, $.type === "donate" ? "amount-editable" : "amount", amount), babelHelpers.defineProperty(_attrs, "lc", language.replace("-", "_")), babelHelpers.defineProperty(_attrs, "button", $.type), babelHelpers.defineProperty(_attrs, "currency", locale.currency), babelHelpers.defineProperty(_attrs, "host", IS_PREVIEW ? "www.sandbox.paypal.com" : "www.paypal.com"), babelHelpers.defineProperty(_attrs, "name", name), babelHelpers.defineProperty(_attrs, "shipping", $.shipping || 0), babelHelpers.defineProperty(_attrs, "size", "small"), babelHelpers.defineProperty(_attrs, "style", "primary"), babelHelpers.defineProperty(_attrs, "tax", Math.round(tax * 100) / 100), babelHelpers.defineProperty(_attrs, "type", $.type), babelHelpers.defineProperty(_attrs, $.type === "buynow" && $.showQuantity ? "quantity-editable" : "quantity", 1), _attrs);

        itemName.textContent = name;
        itemName.setAttribute("data-placeholder", NAME_PLACEHOLDERS[$.type]);
        if (!name) itemName.className = ATTENTION_CLASS;

        element.appendChild(itemName);

        if ($.description) {
          var itemDescription = document.createElement("eager-item-description");

          itemDescription.textContent = $.description;
          element.appendChild(itemDescription);
        }

        if ($.type !== "donate") {
          var localizedAmount = localizeCurrency$$(attrs.amount);

          if ($.type === "subscribe") {
            var periodLabel = PERIOD_LABELS[$.period];

            price.textContent = localizedAmount + "/" + periodLabel.singular;

            if ($.recurrence.type === "reoccurring") {
              attrs.recurrence = 0;
            } else {
              attrs.recurrence = parseInt($.recurrence.customDuration, 10) || 1;
              var agreement = attrs.recurrence === 1 ? "singular" : "plural";

              price.textContent += " for " + attrs.recurrence + " " + periodLabel[agreement];
            }

            attrs.period = $.period;

            element.appendChild(price);
          } else {
            element.appendChild(price);
            price.textContent = localizedAmount;

            if (tax || attrs.shipping) {
              var additionalCost = tax + attrs.shipping;

              var label = void 0;

              if (tax && attrs.shipping) label = "shipping & tax";else if (tax) label = "tax";else if (attrs.shipping) label = "shipping";

              priceDetails.innerHTML = "+ " + localizeCurrency$$(additionalCost) + " " + label;

              if (additionalCost < 0) priceDetails.className = ATTENTION_CLASS;
              element.appendChild(priceDetails);
            }
          }

          if (attrs.amount <= 0) price.className = ATTENTION_CLASS;
        }

        Object.keys(attrs).forEach(function (key) {
          return script.setAttribute("data-" + key, attrs[key]);
        });

        script.addEventListener("load", function () {
          var inputContainer = document.createElement("paypal-input-container");
          var label = element.querySelector(".paypal-label");
          var input = element.querySelector(".paypal-input");

          if (!input) return;

          if ($.type === "donate") {
            inputContainer.setAttribute("data-currency", currencySymbol);
            input.placeholder = input.value;
          }

          input.parentNode.removeChild(input);
          inputContainer.appendChild(input);
          label.appendChild(inputContainer);
        });

        element.appendChild(script);
        container.appendChild(element);
      });

      toArray(container.querySelectorAll("script")).forEach(processElement);

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

}());