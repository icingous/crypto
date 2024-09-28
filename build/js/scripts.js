"use strict";

function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var cryptoCurrs = ["ETH", "LTC", "BTC"];
var currencies = ["USD", "EUR", "GBP", "UAH"];
var signs = ["$", "€", "£", "₴"];
var urlBase = "https://apiv2.bitcoinaverage.com/indices/global/ticker/";
var currencyElems = [];
var currentCurrElem = document.querySelector(".js-curr-selected");
var cards = Array.from(document.querySelectorAll(".currency"));
var lastResults = null;
var mockData = {
  ask: 418.79,
  bid: 418.35,
  last: 418.66,
  high: 418.83,
  low: 417.1,
  open: {
    day: "417.73",
    week: "408.74",
    month: "439.27"
  },
  averages: {
    daily: 418.98,
    weekly: 418.39,
    monthly: 419.76
  },
  volume: 56542.49,
  changes: {
    price: {
      weekly: 9.92,
      monthly: -20.62,
      daily: 0.93
    },
    percent: {
      weekly: 2.43,
      monthly: -4.69,
      daily: 0.22
    }
  },
  volume_percent: 66.42,
  timestamp: 1458754392,
  display_timestamp: "Wed, 23 Mar 2016 17:33:12 +0000"
};
var initEventHandling = function initEventHandling() {
  var currencySelection = document.querySelector(".selector__current");
  var currencyOptions = document.querySelector(".selector__options");
  var currencyItems = document.querySelectorAll(".js-curr-option");
  if (currencySelection && currencyOptions && currencyItems.length > 0) {
    currencySelection.addEventListener("click", function (e) {
      e.stopPropagation();
      currencyOptions.classList.toggle("hidden");
    });
    var addHighlight = function addHighlight(e) {
      e.stopPropagation();
      e.target.classList.add("selector__current--highlighted");
    };
    var removeHighlight = function removeHighlight(e) {
      e.stopPropagation();
      e.target.classList.remove("selector__current--highlighted");
    };
    currentCurrElem.addEventListener("mouseenter", addHighlight);
    currentCurrElem.addEventListener("mouseleave", removeHighlight);
    Array.from(currencyItems).forEach(function (item) {
      item.addEventListener("mouseenter", addHighlight);
      item.addEventListener("mouseleave", removeHighlight);
    });
  }
  document.addEventListener("click", function () {
    if (!currencyOptions.classList.contains("hidden")) {
      currencyOptions.classList.add("hidden");
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Esc" || e.key === "Escape") {
      if (!currencyOptions.classList.contains("hidden")) {
        currencyOptions.classList.add("hidden");
      }
    }
  });
  var switchContainers = document.querySelectorAll(".js-switch-container");
  Array.from(switchContainers).forEach(function (elem) {
    elem.addEventListener("click", function (e) {
      if (e.target.classList.contains("js-switch-slider") || e.target.classList.contains("js-switch-thumb")) {
        var check = elem.querySelector(".js-switch");
        if (check) {
          check.checked = !check.checked;
          if (lastResults) {
            var card = null;
            if (e.target.closest) {
              card = e.target.closest(".js-currency");
            } else {
              var parent = e.target.parentElement;
              do {
                if (parent.classList.contains("js-currency")) {
                  card = parent;
                } else {
                  parent = parent.parentElement;
                }
              } while (card === null);
            }
            // const cryptoCurrency = card.dataset.currency;
            var cryptoCurrency = card.getAttribute("data-currency");
            var currency = currentCurrElem.textContent;
            var symbol = signs[currencies.indexOf(currency)];
            setChanges(card, check.checked, lastResults[cryptoCurrency].changes, symbol);
          }
        }
      }
    });
  });
};
var getRates = function getRates(currency) {
  var results = [];
  cryptoCurrs.forEach(function (crypto) {
    var result = Promise.resolve(mockData);
    // const result = fetch(urlBase + crypto + currency)
    //   .then((response) => {
    //     if (response.ok) {
    //       return response.json();
    //     }
    // throw new Error(response.statusText);
    //   })
    //   .catch(({message}) => {
    //     console.log(message);
    //   });

    // const result = new Promise((resolve, reject) => {
    //   const xhr = new XMLHttpRequest();
    //   xhr.open("GET", urlBase + crypto + currency);
    //   xhr.send();
    //   xhr.onreadystatechange = (e) => {
    //     if (xhr.readyState != 4) {
    //       return;
    //     }
    //     if (xhr.status != 200) {
    //       reject(xhr.statusText);
    //     }
    //     resolve(JSON.parse(xhr.responseText));
    //   };
    // });
    results.push(result);
  });
  return Promise.all(results);
};
var changeSelectedCurrency = function changeSelectedCurrency(elem, curr) {
  var current = currencyElems.filter(function (elem) {
    return elem.classList.contains("hidden");
  })[0];
  var replacement = elem;
  currentCurrElem.textContent = curr;
  replacement.classList.add("hidden");
  current.classList.remove("hidden");
  updateUI(curr);
};
function updateUI(currentCurrency) {
  var rates = getRates(currentCurrency);
  rates.then(function (results) {
    return results.reduce(function (data, result, i) {
      data[cryptoCurrs[i]] = result;
      return data;
    }, {});
  }).then(function (data) {
    return updateRates(currentCurrency, data);
  })["catch"](function (err) {
    return console.log(err.message);
  });
}
function setChangeColor(elem, value) {
  if (value < 0) {
    elem.classList.remove("currency__change-value--ok");
    elem.classList.add("currency__change-value--danger");
  } else {
    elem.classList.remove("currency__change-value--danger");
    elem.classList.add("currency__change-value--ok");
  }
}
function setChanges(card, percentage, changes, symbol) {
  console.log({
    changes: changes
  });
  if (percentage) {
    var percent = changes.percent;
    var hourChange = card.querySelector(".js-hour-change");
    if (!isNaN(percent.hourly)) {
      hourChange.textContent = formatNumber((percent.hourly < 0 ? "" : "+") + percent.hourly.toFixed(2)) + "%";
      setChangeColor(hourChange, percent.hourly);
    } else {
      hourChange.textContent = "";
    }
    var dayChange = card.querySelector(".js-day-change");
    if (!isNaN(percent.daily)) {
      dayChange.textContent = formatNumber((percent.daily < 0 ? "" : "+") + percent.daily.toFixed(2)) + "%";
      setChangeColor(dayChange, percent.daily);
    } else {
      dayChange.textContent = "";
    }
    var weekChange = card.querySelector(".js-week-change");
    if (!isNaN(percent.weekly)) {
      weekChange.textContent = formatNumber((percent.weekly < 0 ? "" : "+") + percent.weekly.toFixed(2)) + "%";
      setChangeColor(weekChange, percent.weekly);
    } else {
      weekChange.textContent = "";
    }
    var monthChange = card.querySelector(".js-month-change");
    if (!isNaN(percent.monthly)) {
      monthChange.textContent = formatNumber((percent.monthly < 0 ? "" : "+") + percent.monthly.toFixed(2)) + "%";
      setChangeColor(monthChange, percent.monthly);
    } else {
      monthChange.textContent = "";
    }
  } else {
    var price = changes.price;
    var _hourChange = card.querySelector(".js-hour-change");
    if (!isNaN(price.hourly)) {
      _hourChange.textContent = formatNumber((price.hourly < 0 ? "" : "+") + (price.hourly || 0).toFixed(2)) + symbol;
      setChangeColor(_hourChange, price.hourly);
    } else {
      _hourChange.textContent = "";
    }
    var _dayChange = card.querySelector(".js-day-change");
    if (!isNaN(price.daily)) {
      _dayChange.textContent = formatNumber((price.daily < 0 ? "" : "+") + price.daily.toFixed(2)) + symbol;
      setChangeColor(_dayChange, price.daily);
    } else {
      _dayChange.textContent = "";
    }
    var _weekChange = card.querySelector(".js-week-change");
    if (!isNaN(price.weekly)) {
      _weekChange.textContent = formatNumber((price.weekly < 0 ? "" : "+") + price.weekly.toFixed(2)) + symbol;
      setChangeColor(_weekChange, price.weekly);
    } else {
      _weekChange.textContent = "";
    }
    var _monthChange = card.querySelector(".js-month-change");
    if (!isNaN(price.monthly)) {
      _monthChange.textContent = formatNumber((price.monthly < 0 ? "" : "+") + price.monthly.toFixed(2)) + symbol;
      setChangeColor(_monthChange, price.monthly);
    } else {
      _monthChange.textContent = "";
    }
  }
}
function updateRates(currency, results) {
  console.log({
    results: results
  });
  lastResults = results;
  Object.entries(results).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      key = _ref2[0],
      value = _ref2[1];
    // const card = cards.filter(elem => elem.dataset.currency === key)[0];
    var card = cards.filter(function (elem) {
      return elem.getAttribute("data-currency") === key;
    })[0];
    var price = card.querySelector(".js-price");
    var symbol = signs[currencies.indexOf(currency)];
    var percentage = card.querySelector(".js-switch").checked;
    price.textContent = symbol + formatNumber(value.last.toFixed(2), false);
    setChanges(card, percentage, value.changes, symbol);
  });
}
var initUI = function initUI() {
  var currentCurrency = currencies[0];
  var currencyList = document.querySelector(".js-currency-list");
  currentCurrElem.textContent = currentCurrency;
  Array.from(currencies).forEach(function (curr, i) {
    var li = document.createElement("li");
    li.className = "selector__currency-item js-curr-option" + (i === 0 ? " hidden" : "");
    li.textContent = curr;
    li.addEventListener("click", function (e) {
      changeSelectedCurrency(li, curr);
    });
    currencyList.appendChild(li);
    currencyElems.push(li);
  });
  updateUI(currentCurrency);
};
function formatNumber(number) {
  var signed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var sign = "";
  if (signed) {
    sign = number[0];
    number = number.slice(1);
  }
  var parts = number.split(".");
  var groups = [];
  var integer = Array.from(parts[0]);
  var rest, digits;
  do {
    rest = integer.length % 3;
    if (rest > 0) {
      digits = integer.splice(0, rest);
      groups.push(digits.join(""));
    } else {
      digits = integer.splice(0, Math.min(3, integer.length));
      groups.push(digits.join(""));
    }
  } while (integer.length > 0);
  return sign + (parts.length > 1 ? groups.join(" ") + "." + parts[1] : groups.join(" "));
}
document.addEventListener("DOMContentLoaded", function () {
  initUI();
  initEventHandling();
});