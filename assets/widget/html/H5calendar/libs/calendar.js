"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*!
 *  * calendar v1.0.0
 *  * (c) 2019-2019
 *  * Released under the MIT License.
 */
!function (e) {
  var t = {};

  function a(n) {
    if (t[n]) return t[n].exports;
    var r = t[n] = {
      i: n,
      l: !1,
      exports: {}
    };
    return e[n].call(r.exports, r, r.exports, a), r.l = !0, r.exports;
  }

  a.m = e, a.c = t, a.d = function (e, t, n) {
    a.o(e, t) || Object.defineProperty(e, t, {
      enumerable: !0,
      get: n
    });
  }, a.r = function (e) {
    "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
      value: "Module"
    }), Object.defineProperty(e, "__esModule", {
      value: !0
    });
  }, a.t = function (e, t) {
    if (1 & t && (e = a(e)), 8 & t) return e;
    if (4 & t && "object" == _typeof(e) && e && e.__esModule) return e;
    var n = Object.create(null);
    if (a.r(n), Object.defineProperty(n, "default", {
      enumerable: !0,
      value: e
    }), 2 & t && "string" != typeof e) for (var r in e) {
      a.d(n, r, function (t) {
        return e[t];
      }.bind(null, r));
    }
    return n;
  }, a.n = function (e) {
    var t = e && e.__esModule ? function () {
      return e.default;
    } : function () {
      return e;
    };
    return a.d(t, "a", t), t;
  }, a.o = function (e, t) {
    return Object.prototype.hasOwnProperty.call(e, t);
  }, a.p = "/", a(a.s = 0);
}([function (e, t, a) {
  e.exports = a(3);
}, function (e, t, a) {}, function (e, t, a) {}, function (e, t, a) {
  "use strict";

  a.r(t);
  a(1), a(2);

  var n = function n(e) {
    if (e) {
      var t = new Date(e);
      return {
        year: t.getYear() + 1900,
        month: t.getMonth() + 1,
        date: t.getDate()
      };
    }
  },
      r = function r(e, t) {
    var a;

    switch (t) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        a = 31;
        break;

      case 2:
        a = function (e) {
          return e % 400 == 0 || e % 4 == 0 && e % 100 != 0;
        }(e) ? 29 : 28;
        break;

      default:
        a = 30;
    }

    return a;
  },
      l = function l(e, t) {
    return new Date(e + "/" + t + "/01").getDay();
  },
      i = function i(e) {
    if ("string" == typeof e) {
      var _t = document.querySelector(e);

      return _t || document.createElement("div");
    }

    return e;
  },
      s = function s(e, t) {
    if (o(e, t)) return;
    var a = e.className.split(" ");
    a.push(t), e.className = a.join(" ");
  },
      o = function o(e, t) {
    return new RegExp("(^|\\s)".concat(t, "($|\\s)")).test(e.className);
  },
      c = function c(e, t) {
    if (o(e, t)) {
      for (var a = " " + e.className.replace(/[\t\r\n]/g, "") + " "; a.indexOf(" " + t + " ") >= 0;) {
        a = a.replace(" " + t + " ", " ");
      }

      e.className = a.replace(/^\s+|\s+$/g, "");
    }
  },
      d = function d(e, t, a) {
    return a ? e.setAttribute("data-" + t, a) : e.getAttribute("data-" + t);
  };

  var u = document.createElement("div").style,
      m = function () {
    var e = {
      webkit: "webkitTransform",
      Moz: "MozTransform",
      O: "OTransform",
      ms: "msTransform",
      standard: "transform"
    };

    for (var _t2 in e) {
      if (void 0 !== u[e[_t2]]) return _t2;
    }

    return !1;
  }();

  function f(e) {
    return !1 !== m && ("standard" === m ? e : m + e.charAt(0).toUpperCase() + e.substr(1));
  }

  window.Calendar =
  /*#__PURE__*/
  function () {
    function _class(e) {
      _classCallCheck(this, _class);

      this.opts = e, this._loadDom();
    }

    _createClass(_class, [{
      key: "show",
      value: function show() {
        s(this.el, "on"), this.modal.style.opacity = 1, this.calendarBottom.style[f("transform")] = "translateY(0%)";
      }
    }, {
      key: "hide",
      value: function hide() {
        this.modal.style.opacity = 0, this.calendarBottom.style[f("transform")] = "translateY(100%)";
        var e = this;
        this.modal.addEventListener("transitionend", function t() {
          c(e.el, "on"), e.modal.removeEventListener("transitionend", t);
        }, !1);
      }
    }, {
      key: "_loadDom",
      value: function _loadDom() {
        var _this = this;

        var e = n(this.opts.start),
            t = n(this.opts.end),
            a = "",
            s = t.year - e.year;
        if (s < 0) throw new Error("End should not be less than start");
        var o = 12 * s + (t.month - e.month);

        for (var _n = 0; _n <= o; _n++) {
          var _i = (_n + e.month) % 12 ?e.year + parseInt((_n + e.month) / 12):e.year + parseInt((_n + e.month) / 12)-1,
              _s = (_n + e.month) % 12 || 12,
              _o = l(_i, _s),
              _c = "";


          for (var _e = 0; _e < _o; _e++) {
            _c += "<li></li>";
          }

          var _d = r(_i, _s);

          for (var _a = 0; _a < _d; _a++) {
            var _n2 = _a + 1,
                _r = this._resolveSpecial({
              year: _i,
              month: _s,
              date: _n2
            }),
                _l = "";

            _r.isSpecial && (_l = "calendar-special"), e.year === _i && e.month === _s && e.date > _n2 ? _l += " calendar-date-invalid" : t.year === _i && t.month === _s && t.date < _n2 ? _l += " calendar-date-invalid" : _l += " calendar-date-current", _c += "<li class=\"calendar-date-item ".concat(_l, "\"  data-date=\"").concat(_i, "/").concat(_s, "/").concat(_n2, "\">\n             <p class=\"calendar-day\">").concat(_n2, "</p>\n             ").concat(_r.tpl, "\n             </li>");
          }

          a += "\n      <div class=\"calendar-month\">".concat(_i, "\u5E74").concat(_s, "\u6708</div>\n    <ul class=\"calendar-date clearfix\">\n    ").concat(_c, "\n    </ul>\n      ");
        }

        this.el = document.createElement("div"), this.el.className = "calendar", this.el.innerHTML = "<div class=\"calendar-bottom\">\n            <ul class=\"calendar-weakday clearfix\">\n          <li>\u65E5</li>\n          <li>\u4E00</li>\n          <li>\u4E8C</li>\n          <li>\u4E09</li>\n          <li>\u56DB</li>\n          <li>\u4E94</li>\n          <li>\u516D</li>\n        </ul>\n        <div class=\"calendar-body\">\n    ".concat(a, "\n      </div>\n        </div>\n    "), document.body.appendChild(this.el), this.modal = i(".calendar-modal"), this.el = i(".calendar"), this.modal = i(".calendar-modal"), this.calendarBottom = i(".calendar-bottom"), this.cancelBtn = i(".calendar-cancel"), this.cancelBtn.onclick = function () {
          _this.hide();
        }, this._addItemClick();
      }
    }, {
      key: "_addItemClick",
      value: function _addItemClick() {
        var e = this,
            t = document.getElementsByClassName("calendar-date-current");

        for (var _a2 = 0; _a2 < t.length; _a2++) {
          t[_a2].onclick = function () {
            var t = i(".calendar-date-current.calendar-on");
            t && c(t, "calendar-on"), s(this, "calendar-on");
            var a = n(d(this, "date"));
            "function" == typeof e.opts.itemClick && e.opts.itemClick.call(e, a), e.opts.autoHide && e.hide();
          };
        }
      }
    }, {
      key: "_resolveSpecial",
      value: function _resolveSpecial(e) {
        var t = this.opts.specialDates;
        if (!t) return "";
        var a = "";

        for (var _r2 = 0; _r2 < t.length; _r2++) {
          var _l2 = n(t[_r2].date);

          if (_l2.year === e.year && _l2.month === e.month && _l2.date === e.date) return {
            tpl: a = "<p class='calendar-note'>".concat(t[_r2].text, "</p>"),
            isSpecial: !0
          };
        }

        return {
          tpl: a
        };
      }
    }]);

    return _class;
  }();
}]);
