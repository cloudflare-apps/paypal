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

  var LOGO = "<svg class=\"eager-paypal-logo\" viewBox=\"0 0 288 288\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n  <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n    <path d=\"M92.7500757,271.941688 L97.5546847,241.524582 L86.8522573,241.277363 L35.7470177,241.277363 L71.262541,16.8298916 C71.3727806,16.1523282 71.7310593,15.520546 72.2546974,15.0718892 C72.7783354,14.6232323 73.4489596,14.3760132 74.1471438,14.3760132 L160.317762,14.3760132 C188.924937,14.3760132 208.667011,20.3092715 218.974414,32.0201317 C223.806583,37.5138894 226.884105,43.2548662 228.372339,49.5726876 C229.934067,56.2018219 229.961627,64.1219893 228.436646,73.7818466 L228.326406,74.4868789 L228.326406,80.6765126 L233.158575,83.4050789 C237.228253,85.5568007 240.461948,88.0198354 242.942339,90.8399644 C247.076324,95.5371272 249.749634,101.507011 250.87959,108.584802 C252.046293,115.864031 251.660454,124.525855 249.749634,134.332213 C247.544842,145.612729 243.980429,155.437399 239.166633,163.476598 C234.738676,170.884014 229.098083,177.027867 222.401028,181.789123 C216.007131,186.312317 208.409786,189.745916 199.820284,191.943419 C191.497194,194.104297 182.007402,195.193892 171.598947,195.193892 L164.892705,195.193892 C160.097282,195.193892 155.43966,196.91527 151.78338,200.00093 C148.117913,203.150685 145.692642,207.454128 144.948525,212.160447 L144.44326,214.89817 L135.954811,268.508089 L135.568972,270.476685 C135.467919,271.099311 135.293373,271.410624 135.036148,271.621218 C134.806482,271.8135 134.475763,271.941688 134.154231,271.941688 L92.7500757,271.941688 L92.7500757,271.941688 Z\" id=\"Shape\" fill=\"#253B80\"></path>\n    <path d=\"M237.733518,75.2010674 L237.733518,75.2010674 L237.733518,75.2010674 C237.476293,76.8400384 237.18232,78.5156345 236.851602,80.237012 C225.487736,138.388437 186.609905,158.477278 136.956154,158.477278 L111.67454,158.477278 C105.602175,158.477278 100.485221,162.872284 99.5389975,168.842168 L99.5389975,168.842168 L99.5389975,168.842168 L86.5950315,250.662533 L82.9295649,273.855346 C82.3140605,277.774227 85.3456494,281.308544 89.3142749,281.308544 L134.154231,281.308544 C139.464105,281.308544 143.974741,277.462914 144.810725,272.243844 L145.251683,269.973091 L153.694199,216.573766 L154.236211,213.643762 C155.063008,208.40638 159.582831,204.560749 164.892705,204.560749 L171.598947,204.560749 C215.042535,204.560749 249.05145,186.980724 258.991387,136.108528 C263.143745,114.856842 260.994073,97.1120044 250.00686,84.6320181 C246.681299,80.8687941 242.556501,77.7465085 237.733518,75.2010674 L237.733518,75.2010674 Z\" id=\"Shape\" fill=\"#179BD7\"></path>\n    <path d=\"M225.846015,70.4764357 C224.109741,69.9728413 222.318348,69.5150281 220.481021,69.1029963 C218.634508,68.7001207 216.742062,68.3430265 214.794496,68.0317136 C207.978014,66.932962 200.509281,66.411055 192.507724,66.411055 L124.967598,66.411055 C123.304817,66.411055 121.724716,66.7864618 120.309975,67.4640253 C117.195706,68.9564961 114.880675,71.8956565 114.32029,75.4940678 L99.952396,166.196008 L99.5389975,168.842168 C100.485221,162.872284 105.602175,158.477278 111.67454,158.477278 L136.956154,158.477278 C186.609905,158.477278 225.487736,138.379281 236.851602,80.237012 C237.191507,78.5156345 237.476293,76.8400384 237.733518,75.2010674 C234.858102,73.6811277 231.743834,72.3809384 228.390712,71.2730306 C227.563916,70.9983427 226.709559,70.7328111 225.846015,70.4764357 L225.846015,70.4764357 Z\" id=\"Shape\" fill=\"#222D65\"></path>\n    <path d=\"M114.32029,75.4940678 C114.880675,71.8956565 117.195706,68.9564961 120.309975,67.4731815 C121.733903,66.7956181 123.304817,66.4202113 124.967598,66.4202113 L192.507724,66.4202113 C200.509281,66.4202113 207.978014,66.9421183 214.794496,68.0408698 C216.742062,68.3521828 218.634508,68.709277 220.481021,69.1121526 C222.318348,69.5241844 224.109741,69.9819975 225.846015,70.485592 C226.709559,70.7419674 227.563916,71.007499 228.399899,71.2730306 C231.75302,72.3809384 234.867289,73.690284 237.742705,75.2010674 C241.123386,53.7113184 237.715145,39.0796104 226.057308,25.830498 C213.205208,11.2445713 190.00896,5 160.326948,5 L74.1563304,5 C68.0931526,5 62.9210782,9.39500617 61.9840416,15.3740458 L26.0918663,242.128896 C25.3844956,246.615464 28.8570429,250.662533 33.3952396,250.662533 L86.5950315,250.662533 L99.952396,166.196008 L114.32029,75.4940678 L114.32029,75.4940678 Z\" id=\"Shape\" fill=\"#253B80\"></path>\n  </g>\n</svg>\n";

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
      container = Eager.createElement(options.location, container);
      container.className = "eager-paypal-buttons";

      if (!options.merchantID) {
        if (!IS_PREVIEW) return;

        container.innerHTML = LOGO;
        container.innerHTML += "<eager-waiting-message>\n        Provide your PayPal email in the Eager app installer.\n      </eager-waiting-message>";
        container.setAttribute("data-state", "waiting");

        return;
      }

      var _options = options;
      var locale = _options.locale;

      var localizeCurrency$$ = localizeCurrency.bind(null, language, locale.currency);
      var processElement = window.paypal.button.processElement.bind(null, options.merchantID);
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