var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function createCommonjsModule(fn, basedir, module) {
  return module = {
    path: basedir,
    exports: {},
    require: function(path, base) {
      return commonjsRequire(path, base === void 0 || base === null ? module.path : base);
    }
  }, fn(module, module.exports), module.exports;
}
function commonjsRequire() {
  throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
}
var dayjs_min = createCommonjsModule(function(module, exports) {
  !function(t, e) {
    module.exports = e();
  }(commonjsGlobal, function() {
    var t = "millisecond", e = "second", n = "minute", r = "hour", i = "day", s = "week", u = "month", a = "quarter", o = "year", f = "date", h = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/, c = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g, d = {name: "en", weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_")}, $ = function(t2, e2, n2) {
      var r2 = String(t2);
      return !r2 || r2.length >= e2 ? t2 : "" + Array(e2 + 1 - r2.length).join(n2) + t2;
    }, l = {s: $, z: function(t2) {
      var e2 = -t2.utcOffset(), n2 = Math.abs(e2), r2 = Math.floor(n2 / 60), i2 = n2 % 60;
      return (e2 <= 0 ? "+" : "-") + $(r2, 2, "0") + ":" + $(i2, 2, "0");
    }, m: function t2(e2, n2) {
      if (e2.date() < n2.date())
        return -t2(n2, e2);
      var r2 = 12 * (n2.year() - e2.year()) + (n2.month() - e2.month()), i2 = e2.clone().add(r2, u), s2 = n2 - i2 < 0, a2 = e2.clone().add(r2 + (s2 ? -1 : 1), u);
      return +(-(r2 + (n2 - i2) / (s2 ? i2 - a2 : a2 - i2)) || 0);
    }, a: function(t2) {
      return t2 < 0 ? Math.ceil(t2) || 0 : Math.floor(t2);
    }, p: function(h2) {
      return {M: u, y: o, w: s, d: i, D: f, h: r, m: n, s: e, ms: t, Q: a}[h2] || String(h2 || "").toLowerCase().replace(/s$/, "");
    }, u: function(t2) {
      return t2 === void 0;
    }}, y = "en", M = {};
    M[y] = d;
    var m = function(t2) {
      return t2 instanceof S;
    }, D = function(t2, e2, n2) {
      var r2;
      if (!t2)
        return y;
      if (typeof t2 == "string")
        M[t2] && (r2 = t2), e2 && (M[t2] = e2, r2 = t2);
      else {
        var i2 = t2.name;
        M[i2] = t2, r2 = i2;
      }
      return !n2 && r2 && (y = r2), r2 || !n2 && y;
    }, v = function(t2, e2) {
      if (m(t2))
        return t2.clone();
      var n2 = typeof e2 == "object" ? e2 : {};
      return n2.date = t2, n2.args = arguments, new S(n2);
    }, g = l;
    g.l = D, g.i = m, g.w = function(t2, e2) {
      return v(t2, {locale: e2.$L, utc: e2.$u, x: e2.$x, $offset: e2.$offset});
    };
    var S = function() {
      function d2(t2) {
        this.$L = D(t2.locale, null, true), this.parse(t2);
      }
      var $2 = d2.prototype;
      return $2.parse = function(t2) {
        this.$d = function(t3) {
          var e2 = t3.date, n2 = t3.utc;
          if (e2 === null)
            return new Date(NaN);
          if (g.u(e2))
            return new Date();
          if (e2 instanceof Date)
            return new Date(e2);
          if (typeof e2 == "string" && !/Z$/i.test(e2)) {
            var r2 = e2.match(h);
            if (r2) {
              var i2 = r2[2] - 1 || 0, s2 = (r2[7] || "0").substring(0, 3);
              return n2 ? new Date(Date.UTC(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2)) : new Date(r2[1], i2, r2[3] || 1, r2[4] || 0, r2[5] || 0, r2[6] || 0, s2);
            }
          }
          return new Date(e2);
        }(t2), this.$x = t2.x || {}, this.init();
      }, $2.init = function() {
        var t2 = this.$d;
        this.$y = t2.getFullYear(), this.$M = t2.getMonth(), this.$D = t2.getDate(), this.$W = t2.getDay(), this.$H = t2.getHours(), this.$m = t2.getMinutes(), this.$s = t2.getSeconds(), this.$ms = t2.getMilliseconds();
      }, $2.$utils = function() {
        return g;
      }, $2.isValid = function() {
        return !(this.$d.toString() === "Invalid Date");
      }, $2.isSame = function(t2, e2) {
        var n2 = v(t2);
        return this.startOf(e2) <= n2 && n2 <= this.endOf(e2);
      }, $2.isAfter = function(t2, e2) {
        return v(t2) < this.startOf(e2);
      }, $2.isBefore = function(t2, e2) {
        return this.endOf(e2) < v(t2);
      }, $2.$g = function(t2, e2, n2) {
        return g.u(t2) ? this[e2] : this.set(n2, t2);
      }, $2.unix = function() {
        return Math.floor(this.valueOf() / 1e3);
      }, $2.valueOf = function() {
        return this.$d.getTime();
      }, $2.startOf = function(t2, a2) {
        var h2 = this, c2 = !!g.u(a2) || a2, d3 = g.p(t2), $3 = function(t3, e2) {
          var n2 = g.w(h2.$u ? Date.UTC(h2.$y, e2, t3) : new Date(h2.$y, e2, t3), h2);
          return c2 ? n2 : n2.endOf(i);
        }, l2 = function(t3, e2) {
          return g.w(h2.toDate()[t3].apply(h2.toDate("s"), (c2 ? [0, 0, 0, 0] : [23, 59, 59, 999]).slice(e2)), h2);
        }, y2 = this.$W, M2 = this.$M, m2 = this.$D, D2 = "set" + (this.$u ? "UTC" : "");
        switch (d3) {
          case o:
            return c2 ? $3(1, 0) : $3(31, 11);
          case u:
            return c2 ? $3(1, M2) : $3(0, M2 + 1);
          case s:
            var v2 = this.$locale().weekStart || 0, S2 = (y2 < v2 ? y2 + 7 : y2) - v2;
            return $3(c2 ? m2 - S2 : m2 + (6 - S2), M2);
          case i:
          case f:
            return l2(D2 + "Hours", 0);
          case r:
            return l2(D2 + "Minutes", 1);
          case n:
            return l2(D2 + "Seconds", 2);
          case e:
            return l2(D2 + "Milliseconds", 3);
          default:
            return this.clone();
        }
      }, $2.endOf = function(t2) {
        return this.startOf(t2, false);
      }, $2.$set = function(s2, a2) {
        var h2, c2 = g.p(s2), d3 = "set" + (this.$u ? "UTC" : ""), $3 = (h2 = {}, h2[i] = d3 + "Date", h2[f] = d3 + "Date", h2[u] = d3 + "Month", h2[o] = d3 + "FullYear", h2[r] = d3 + "Hours", h2[n] = d3 + "Minutes", h2[e] = d3 + "Seconds", h2[t] = d3 + "Milliseconds", h2)[c2], l2 = c2 === i ? this.$D + (a2 - this.$W) : a2;
        if (c2 === u || c2 === o) {
          var y2 = this.clone().set(f, 1);
          y2.$d[$3](l2), y2.init(), this.$d = y2.set(f, Math.min(this.$D, y2.daysInMonth())).$d;
        } else
          $3 && this.$d[$3](l2);
        return this.init(), this;
      }, $2.set = function(t2, e2) {
        return this.clone().$set(t2, e2);
      }, $2.get = function(t2) {
        return this[g.p(t2)]();
      }, $2.add = function(t2, a2) {
        var f2, h2 = this;
        t2 = Number(t2);
        var c2 = g.p(a2), d3 = function(e2) {
          var n2 = v(h2);
          return g.w(n2.date(n2.date() + Math.round(e2 * t2)), h2);
        };
        if (c2 === u)
          return this.set(u, this.$M + t2);
        if (c2 === o)
          return this.set(o, this.$y + t2);
        if (c2 === i)
          return d3(1);
        if (c2 === s)
          return d3(7);
        var $3 = (f2 = {}, f2[n] = 6e4, f2[r] = 36e5, f2[e] = 1e3, f2)[c2] || 1, l2 = this.$d.getTime() + t2 * $3;
        return g.w(l2, this);
      }, $2.subtract = function(t2, e2) {
        return this.add(-1 * t2, e2);
      }, $2.format = function(t2) {
        var e2 = this;
        if (!this.isValid())
          return "Invalid Date";
        var n2 = t2 || "YYYY-MM-DDTHH:mm:ssZ", r2 = g.z(this), i2 = this.$locale(), s2 = this.$H, u2 = this.$m, a2 = this.$M, o2 = i2.weekdays, f2 = i2.months, h2 = function(t3, r3, i3, s3) {
          return t3 && (t3[r3] || t3(e2, n2)) || i3[r3].substr(0, s3);
        }, d3 = function(t3) {
          return g.s(s2 % 12 || 12, t3, "0");
        }, $3 = i2.meridiem || function(t3, e3, n3) {
          var r3 = t3 < 12 ? "AM" : "PM";
          return n3 ? r3.toLowerCase() : r3;
        }, l2 = {YY: String(this.$y).slice(-2), YYYY: this.$y, M: a2 + 1, MM: g.s(a2 + 1, 2, "0"), MMM: h2(i2.monthsShort, a2, f2, 3), MMMM: h2(f2, a2), D: this.$D, DD: g.s(this.$D, 2, "0"), d: String(this.$W), dd: h2(i2.weekdaysMin, this.$W, o2, 2), ddd: h2(i2.weekdaysShort, this.$W, o2, 3), dddd: o2[this.$W], H: String(s2), HH: g.s(s2, 2, "0"), h: d3(1), hh: d3(2), a: $3(s2, u2, true), A: $3(s2, u2, false), m: String(u2), mm: g.s(u2, 2, "0"), s: String(this.$s), ss: g.s(this.$s, 2, "0"), SSS: g.s(this.$ms, 3, "0"), Z: r2};
        return n2.replace(c, function(t3, e3) {
          return e3 || l2[t3] || r2.replace(":", "");
        });
      }, $2.utcOffset = function() {
        return 15 * -Math.round(this.$d.getTimezoneOffset() / 15);
      }, $2.diff = function(t2, f2, h2) {
        var c2, d3 = g.p(f2), $3 = v(t2), l2 = 6e4 * ($3.utcOffset() - this.utcOffset()), y2 = this - $3, M2 = g.m(this, $3);
        return M2 = (c2 = {}, c2[o] = M2 / 12, c2[u] = M2, c2[a] = M2 / 3, c2[s] = (y2 - l2) / 6048e5, c2[i] = (y2 - l2) / 864e5, c2[r] = y2 / 36e5, c2[n] = y2 / 6e4, c2[e] = y2 / 1e3, c2)[d3] || y2, h2 ? M2 : g.a(M2);
      }, $2.daysInMonth = function() {
        return this.endOf(u).$D;
      }, $2.$locale = function() {
        return M[this.$L];
      }, $2.locale = function(t2, e2) {
        if (!t2)
          return this.$L;
        var n2 = this.clone(), r2 = D(t2, e2, true);
        return r2 && (n2.$L = r2), n2;
      }, $2.clone = function() {
        return g.w(this.$d, this);
      }, $2.toDate = function() {
        return new Date(this.valueOf());
      }, $2.toJSON = function() {
        return this.isValid() ? this.toISOString() : null;
      }, $2.toISOString = function() {
        return this.$d.toISOString();
      }, $2.toString = function() {
        return this.$d.toUTCString();
      }, d2;
    }(), p2 = S.prototype;
    return v.prototype = p2, [["$ms", t], ["$s", e], ["$m", n], ["$H", r], ["$W", i], ["$M", u], ["$y", o], ["$D", f]].forEach(function(t2) {
      p2[t2[1]] = function(e2) {
        return this.$g(e2, t2[0], t2[1]);
      };
    }), v.extend = function(t2, e2) {
      return t2.$i || (t2(e2, S, v), t2.$i = true), v;
    }, v.locale = D, v.isDayjs = m, v.unix = function(t2) {
      return v(1e3 * t2);
    }, v.en = M[y], v.Ls = M, v.p = {}, v;
  });
});
var Ls = dayjs_min.Ls;
export default dayjs_min;
var en = dayjs_min.en;
var extend = dayjs_min.extend;
var isDayjs = dayjs_min.isDayjs;
var locale = dayjs_min.locale;
var p = dayjs_min.p;
var unix = dayjs_min.unix;
export {Ls, dayjs_min as __moduleExports, en, extend, isDayjs, locale, p, unix};
