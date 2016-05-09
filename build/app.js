"use strict";

(function () {
  if (!window.addEventListener) return; // Check for IE9+

  var options = INSTALL_OPTIONS;
  var element = void 0;

  function updateElement() {
    function addOptions(button) {
      element = Eager.createElement(button.location, element);

      element.innerHTML = "<script async src=\"https://www.paypalobjects.com/js/external/paypal-button.min.js?merchant=" + options.merchant + "\"\n        data-button=\"" + button.type + "\"\n        data-type=\"form\"\n        data-name=\"" + button.name + "\"\n        data-amount=\"" + button.price + "\"\n        data-currency=\"" + button.currency + "\"\n        data-quantity=\"" + button.quantity + "\"\n        data-tax=\"" + button.tax + "\"\n        data-shipping=\"" + button.shipping + "\"\n        data-size=\"" + button.size + "\"\n        data-style=\"" + button.style + "\"\n      ></script>";

      // if subscribe
      // element.setAttribute("data-reoccurance", button.howOften)
      // element.setAttribute("data-period", button.timePeriod)
    }

    function addButton() {
      for (var i = 0; i < options.buttons.length; i++) {
        addOptions(options.buttons[i]);
      }
    }
    addButton();
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