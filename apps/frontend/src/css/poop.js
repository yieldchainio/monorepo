function personEditData() {
  $(".personalPage .toggle-model").click(function () {
    var n = $(this);
    $(this)
      .parents(".editable")
      .addClass("editing")
      .find("[aria-expanded]")
      .attr("aria-expanded", "true");
    $(".mailing-address-edit")
      .removeClass("editing")
      .find("[aria-expanded]")
      .attr("aria-expanded", "true");
    setTimeout(function () {
      n.parents(".editable").find(".clearfix .txt").focus();
    }, 100);
  });
  $(".personalPage .reset-btn").click(function () {
    $("#EmailForm").trigger("reset");
    var n = $(this).parents(".editable");
    n.removeClass("editing")
      .removeClass("show_message")
      .find("[aria-expanded]")
      .attr("aria-expanded", "false");
    n.find(".field-validation-valid").empty();
  });
  $(".personalPage .submit-btn").click(function () {
    var n = $(this).parents(".editable");
    return n && $(this).closest("form").valid()
      ? (n
          .removeClass("editing")
          .addClass("show_message")
          .find("[aria-expanded]")
          .attr("aria-expanded", "false"),
        !0)
      : !1;
  });
}
function mailingAddressUpdated(n) {
  n.success &&
    ($("#updateAddressModal").modal("hide"),
    $(".form-message .color-light-blue .font-sm").show());
}
function identityCodeFormPD(n) {
  n == "OK" &&
    setTimeout(function () {
      $("#codeModalPD").modal("show");
    }, 400);
}
function checkCodePD(n) {
  if (($("#codeModalPD").modal("toggle"), !n.success)) {
    grecaptcha.reset();
    var t = $("#codeModalPD");
    t.find("#valid").val("");
    n.expTime
      ? $("#codeModalPD").find(".errorMsg").text(n.errorMsg)
      : ($("#codeModalPD").find(".errorMsg").text(n.errorMsg),
        setTimeout(function () {
          $("#codeModalPD").modal("show");
        }, 400));
  }
}
function tryAgainPD() {
  var n = { culture: $("body").data("culture") };
  $.ajax({
    url: "/umbraco/Surface/PersonalDetailsSurface/SendAgainIdentifyCode",
    type: "POST",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(n),
  });
}
function confirmRavKavEdit(n) {
  $("#ravKavDialogBox").html(n);
  $("#ravKavCorrectModalForm").resetFormValidator();
  $("#ravKavEditModal").length > 0 && $("#ravKavEditModal").modal("hide");
  initCloseBtn();
  setTimeout(function () {
    $("#ravKavConfirmationModal").modal("show");
  }, 400);
}
function resetConfirmationFinalModalPD(n) {
  $("#ravKavConfirmationFinalModal")
    .find('[name="ravKavEmpty"],[name="ravKavNotEmpty"]')
    .hide();
  n.ravKav && n.ravKav !== ""
    ? $("#ravKavConfirmationFinalModal").find('[name="ravKavNotEmpty"]').show()
    : $("#ravKavConfirmationFinalModal").find('[name="ravKavEmpty"]').show();
}
function confirmRavKavSuccess(n) {
  $("#ravKavConfirmationModal").modal("hide");
  $("#ravKavConfirmationCorrectModal").modal("hide");
  resetConfirmationFinalModalPD(n);
  setTimeout(function () {
    $("#ravKavConfirmationFinalModal").modal("show");
  }, 400);
  $("#ravKavConfirmationFinalModal").on("hidden.bs.modal", function () {
    if (n.success)
      switch ($("#ravKavPopupType").val()) {
        case "1":
        case "2":
          $("#ravKavContainer").load(
            "/umbraco/Surface/ArchivePageSurface/GetRavKavPartial?lang=" +
              document.getElementById("currentLanguage").value +
              "&partialType=" +
              $("#ravKavPopupType").val(),
            function () {
              personEditData();
              $("#ravKavForm").resetFormValidator();
            }
          );
      }
  });
}
function initCloseBtn() {
  $(".ravkav-modal .close, .ravkav-modal .close-btn").click(function () {
    undoRavKavEdit();
  });
}
function undoRavKavEdit() {
  $("#ravKavForm").trigger("reset");
}
function openSummonRavKaEdit() {
  $(".ravkav-modal-group").appendTo("body");
  $("#ravKavEditModal").modal("show");
  $("#ravKavEditModal").on("hidden.bs.modal", function () {
    $("#ravKavContainer").load(
      "/umbraco/Surface/ArchivePageSurface/GetRavKavPartial?lang=" +
        document.getElementById("currentLanguage").value +
        "&partialType=2",
      function () {
        $("#ravKavForm").resetFormValidator();
      }
    );
  });
}
(function (n) {
  typeof define == "function" && define.amd
    ? define(["jquery"], n)
    : typeof exports == "object"
    ? n(require("jquery"))
    : n(jQuery);
})(function (n) {
  var i = 0,
    t = Array.prototype.slice,
    r;
  n.cleanData = (function (t) {
    return function (i) {
      for (var r, u, f = 0; (u = i[f]) != null; f++)
        try {
          r = n._data(u, "events");
          r && r.remove && n(u).triggerHandler("remove");
        } catch (e) {}
      t(i);
    };
  })(n.cleanData);
  n.widget = function (t, i, r) {
    var s,
      f,
      u,
      o,
      h = {},
      e = t.split(".")[0];
    return (
      (t = t.split(".")[1]),
      (s = e + "-" + t),
      r || ((r = i), (i = n.Widget)),
      (n.expr[":"][s.toLowerCase()] = function (t) {
        return !!n.data(t, s);
      }),
      (n[e] = n[e] || {}),
      (f = n[e][t]),
      (u = n[e][t] =
        function (n, t) {
          if (!this._createWidget) return new u(n, t);
          arguments.length && this._createWidget(n, t);
        }),
      n.extend(u, f, {
        version: r.version,
        _proto: n.extend({}, r),
        _childConstructors: [],
      }),
      (o = new i()),
      (o.options = n.widget.extend({}, o.options)),
      n.each(r, function (t, r) {
        if (!n.isFunction(r)) {
          h[t] = r;
          return;
        }
        h[t] = (function () {
          var n = function () {
              return i.prototype[t].apply(this, arguments);
            },
            u = function (n) {
              return i.prototype[t].apply(this, n);
            };
          return function () {
            var i = this._super,
              f = this._superApply,
              t;
            return (
              (this._super = n),
              (this._superApply = u),
              (t = r.apply(this, arguments)),
              (this._super = i),
              (this._superApply = f),
              t
            );
          };
        })();
      }),
      (u.prototype = n.widget.extend(
        o,
        { widgetEventPrefix: f ? o.widgetEventPrefix || t : t },
        h,
        { constructor: u, namespace: e, widgetName: t, widgetFullName: s }
      )),
      f
        ? (n.each(f._childConstructors, function (t, i) {
            var r = i.prototype;
            n.widget(r.namespace + "." + r.widgetName, u, i._proto);
          }),
          delete f._childConstructors)
        : i._childConstructors.push(u),
      n.widget.bridge(t, u),
      u
    );
  };
  n.widget.extend = function (i) {
    for (var e = t.call(arguments, 1), f = 0, o = e.length, r, u; f < o; f++)
      for (r in e[f])
        (u = e[f][r]),
          e[f].hasOwnProperty(r) &&
            u !== undefined &&
            (i[r] = n.isPlainObject(u)
              ? n.isPlainObject(i[r])
                ? n.widget.extend({}, i[r], u)
                : n.widget.extend({}, u)
              : u);
    return i;
  };
  n.widget.bridge = function (i, r) {
    var u = r.prototype.widgetFullName || i;
    n.fn[i] = function (f) {
      var s = typeof f == "string",
        o = t.call(arguments, 1),
        e = this;
      return (
        s
          ? this.each(function () {
              var t,
                r = n.data(this, u);
              return f === "instance"
                ? ((e = r), !1)
                : r
                ? !n.isFunction(r[f]) || f.charAt(0) === "_"
                  ? n.error(
                      "no such method '" + f + "' for " + i + " widget instance"
                    )
                  : ((t = r[f].apply(r, o)),
                    t !== r && t !== undefined
                      ? ((e = t && t.jquery ? e.pushStack(t.get()) : t), !1)
                      : void 0)
                : n.error(
                    "cannot call methods on " +
                      i +
                      " prior to initialization; attempted to call method '" +
                      f +
                      "'"
                  );
            })
          : (o.length && (f = n.widget.extend.apply(null, [f].concat(o))),
            this.each(function () {
              var t = n.data(this, u);
              t
                ? (t.option(f || {}), t._init && t._init())
                : n.data(this, u, new r(f, this));
            })),
        e
      );
    };
  };
  n.Widget = function () {};
  n.Widget._childConstructors = [];
  n.Widget.prototype = {
    widgetName: "widget",
    widgetEventPrefix: "",
    defaultElement: "<div>",
    options: { disabled: !1, create: null },
    _createWidget: function (t, r) {
      r = n(r || this.defaultElement || this)[0];
      this.element = n(r);
      this.uuid = i++;
      this.eventNamespace = "." + this.widgetName + this.uuid;
      this.bindings = n();
      this.hoverable = n();
      this.focusable = n();
      r !== this &&
        (n.data(r, this.widgetFullName, this),
        this._on(!0, this.element, {
          remove: function (n) {
            n.target === r && this.destroy();
          },
        }),
        (this.document = n(r.style ? r.ownerDocument : r.document || r)),
        (this.window = n(
          this.document[0].defaultView || this.document[0].parentWindow
        )));
      this.options = n.widget.extend(
        {},
        this.options,
        this._getCreateOptions(),
        t
      );
      this._create();
      this._trigger("create", null, this._getCreateEventData());
      this._init();
    },
    _getCreateOptions: n.noop,
    _getCreateEventData: n.noop,
    _create: n.noop,
    _init: n.noop,
    destroy: function () {
      this._destroy();
      this.element
        .unbind(this.eventNamespace)
        .removeData(this.widgetFullName)
        .removeData(n.camelCase(this.widgetFullName));
      this.widget()
        .unbind(this.eventNamespace)
        .removeAttr("aria-disabled")
        .removeClass(this.widgetFullName + "-disabled ui-state-disabled");
      this.bindings.unbind(this.eventNamespace);
      this.hoverable.removeClass("ui-state-hover");
      this.focusable.removeClass("ui-state-focus");
    },
    _destroy: n.noop,
    widget: function () {
      return this.element;
    },
    option: function (t, i) {
      var e = t,
        r,
        u,
        f;
      if (arguments.length === 0) return n.widget.extend({}, this.options);
      if (typeof t == "string")
        if (((e = {}), (r = t.split(".")), (t = r.shift()), r.length)) {
          for (
            u = e[t] = n.widget.extend({}, this.options[t]), f = 0;
            f < r.length - 1;
            f++
          )
            (u[r[f]] = u[r[f]] || {}), (u = u[r[f]]);
          if (((t = r.pop()), arguments.length === 1))
            return u[t] === undefined ? null : u[t];
          u[t] = i;
        } else {
          if (arguments.length === 1)
            return this.options[t] === undefined ? null : this.options[t];
          e[t] = i;
        }
      return this._setOptions(e), this;
    },
    _setOptions: function (n) {
      for (var t in n) this._setOption(t, n[t]);
      return this;
    },
    _setOption: function (n, t) {
      return (
        (this.options[n] = t),
        n === "disabled" &&
          (this.widget().toggleClass(this.widgetFullName + "-disabled", !!t),
          t &&
            (this.hoverable.removeClass("ui-state-hover"),
            this.focusable.removeClass("ui-state-focus"))),
        this
      );
    },
    enable: function () {
      return this._setOptions({ disabled: !1 });
    },
    disable: function () {
      return this._setOptions({ disabled: !0 });
    },
    _on: function (t, i, r) {
      var f,
        u = this;
      typeof t != "boolean" && ((r = i), (i = t), (t = !1));
      r
        ? ((i = f = n(i)), (this.bindings = this.bindings.add(i)))
        : ((r = i), (i = this.element), (f = this.widget()));
      n.each(r, function (r, e) {
        function o() {
          if (
            t ||
            (u.options.disabled !== !0 &&
              !n(this).hasClass("ui-state-disabled"))
          )
            return (typeof e == "string" ? u[e] : e).apply(u, arguments);
        }
        typeof e != "string" &&
          (o.guid = e.guid = e.guid || o.guid || n.guid++);
        var s = r.match(/^([\w:-]*)\s*(.*)$/),
          h = s[1] + u.eventNamespace,
          c = s[2];
        c ? f.delegate(c, h, o) : i.bind(h, o);
      });
    },
    _off: function (t, i) {
      i =
        (i || "").split(" ").join(this.eventNamespace + " ") +
        this.eventNamespace;
      t.unbind(i).undelegate(i);
      this.bindings = n(this.bindings.not(t).get());
      this.focusable = n(this.focusable.not(t).get());
      this.hoverable = n(this.hoverable.not(t).get());
    },
    _delay: function (n, t) {
      function r() {
        return (typeof n == "string" ? i[n] : n).apply(i, arguments);
      }
      var i = this;
      return setTimeout(r, t || 0);
    },
    _hoverable: function (t) {
      this.hoverable = this.hoverable.add(t);
      this._on(t, {
        mouseenter: function (t) {
          n(t.currentTarget).addClass("ui-state-hover");
        },
        mouseleave: function (t) {
          n(t.currentTarget).removeClass("ui-state-hover");
        },
      });
    },
    _focusable: function (t) {
      this.focusable = this.focusable.add(t);
      this._on(t, {
        focusin: function (t) {
          n(t.currentTarget).addClass("ui-state-focus");
        },
        focusout: function (t) {
          n(t.currentTarget).removeClass("ui-state-focus");
        },
      });
    },
    _trigger: function (t, i, r) {
      var u,
        f,
        e = this.options[t];
      if (
        ((r = r || {}),
        (i = n.Event(i)),
        (i.type = (
          t === this.widgetEventPrefix ? t : this.widgetEventPrefix + t
        ).toLowerCase()),
        (i.target = this.element[0]),
        (f = i.originalEvent),
        f)
      )
        for (u in f) u in i || (i[u] = f[u]);
      return (
        this.element.trigger(i, r),
        !(
          (n.isFunction(e) && e.apply(this.element[0], [i].concat(r)) === !1) ||
          i.isDefaultPrevented()
        )
      );
    },
  };
  n.each({ show: "fadeIn", hide: "fadeOut" }, function (t, i) {
    n.Widget.prototype["_" + t] = function (r, u, f) {
      typeof u == "string" && (u = { effect: u });
      var o,
        e = u ? (u === !0 || typeof u == "number" ? i : u.effect || i) : t;
      u = u || {};
      typeof u == "number" && (u = { duration: u });
      o = !n.isEmptyObject(u);
      u.complete = f;
      u.delay && r.delay(u.delay);
      o && n.effects && n.effects.effect[e]
        ? r[t](u)
        : e !== t && r[e]
        ? r[e](u.duration, u.easing, f)
        : r.queue(function (i) {
            n(this)[t]();
            f && f.call(r[0]);
            i();
          });
    };
  });
  r = n.widget;
});
$(function () {
  personEditData();
  var n = $("#select_subject").select2({
    dir: "rtl",
    minimumResultsForSearch: Infinity,
  });
  n.on("select2:open", function () {
    setTimeout(function () {
      var n = $(".select2-results > .select2-results__options");
      if (n)
        try {
          n.mCustomScrollbar({
            callbacks: {
              onScrollStart: function () {},
              onScroll: function () {},
            },
          });
        } catch (t) {}
    }, 10);
  });
  n.on("select2:closing", function () {
    var n = $(".select2-results > .select2-results__options");
    if (n)
      try {
        n.mCustomScrollbar("destroy");
      } catch (t) {}
  });
  $(".modal").on("shown.bs.modal", function () {
    var n = $(".cutomScrollbar", this);
    n.length > 0 &&
      n.mCustomScrollbar({
        callbacks: { onScrollStart: function () {}, onScroll: function () {} },
      });
  });
});
!(function (n, t) {
  "use strict";
  "undefined" != typeof module && module.exports
    ? (module.exports = t(require("jquery")))
    : "function" == typeof define && define.amd
    ? define(["jquery"], function (n) {
        return t(n);
      })
    : t(n.jQuery);
})(this, function (n) {
  "use strict";
  var t = function (t, i) {
      this.$element = n(t);
      this.options = n.extend({}, n.fn.typeahead.defaults, i);
      this.matcher = this.options.matcher || this.matcher;
      this.sorter = this.options.sorter || this.sorter;
      this.select = this.options.select || this.select;
      this.autoSelect =
        "boolean" == typeof this.options.autoSelect
          ? this.options.autoSelect
          : !0;
      this.highlighter = this.options.highlighter || this.highlighter;
      this.render = this.options.render || this.render;
      this.updater = this.options.updater || this.updater;
      this.displayText = this.options.displayText || this.displayText;
      this.source = this.options.source;
      this.delay = this.options.delay;
      this.$menu = n(this.options.menu);
      this.$appendTo = this.options.appendTo ? n(this.options.appendTo) : null;
      this.shown = !1;
      this.listen();
      this.showHintOnFocus =
        "boolean" == typeof this.options.showHintOnFocus
          ? this.options.showHintOnFocus
          : !1;
      this.afterSelect = this.options.afterSelect;
      this.addItem = !1;
    },
    i;
  t.prototype = {
    constructor: t,
    select: function () {
      var t = this.$menu.find(".active").data("value"),
        n;
      return (
        (this.$element.data("active", t), this.autoSelect || t) &&
          ((n = this.updater(t)),
          n || (n = ""),
          this.$element.val(this.displayText(n) || n).change(),
          this.afterSelect(n)),
        this.hide()
      );
    },
    updater: function (n) {
      return n;
    },
    setSource: function (n) {
      this.source = n;
    },
    show: function () {
      var i,
        t = n.extend({}, this.$element.position(), {
          height: this.$element[0].offsetHeight,
        }),
        r;
      return (
        (i =
          "function" == typeof this.options.scrollHeight
            ? this.options.scrollHeight.call()
            : this.options.scrollHeight),
        (r = this.shown
          ? this.$menu
          : this.$appendTo
          ? this.$menu.appendTo(this.$appendTo)
          : this.$menu.insertAfter(this.$element)),
        r.css({ top: t.top + t.height + i, left: t.left }).show(),
        (this.shown = !0),
        this
      );
    },
    hide: function () {
      return this.$menu.hide(), (this.shown = !1), this;
    },
    lookup: function (t) {
      if (
        ((this.query =
          "undefined" != typeof t && null !== t
            ? t
            : this.$element.val() || ""),
        this.query.length < this.options.minLength &&
          !this.options.showHintOnFocus)
      )
        return this.shown ? this.hide() : this;
      var i = n.proxy(function () {
        n.isFunction(this.source)
          ? this.source(this.query, n.proxy(this.process, this))
          : this.source && this.process(this.source);
      }, this);
      clearTimeout(this.lookupWorker);
      this.lookupWorker = setTimeout(i, this.delay);
    },
    process: function (t) {
      var i = this;
      return (
        (t = n.grep(t, function (n) {
          return i.matcher(n);
        })),
        (t = this.sorter(t)),
        t.length || this.options.addItem
          ? (t.length > 0
              ? this.$element.data("active", t[0])
              : this.$element.data("active", null),
            this.options.addItem && t.push(this.options.addItem),
            "all" == this.options.items
              ? this.render(t).show()
              : this.render(t.slice(0, this.options.items)).show())
          : this.shown
          ? this.hide()
          : this
      );
    },
    matcher: function (n) {
      var t = this.displayText(n);
      return ~t.toLowerCase().indexOf(this.query.toLowerCase());
    },
    sorter: function (n) {
      for (var i, t, r = [], u = [], f = []; (t = n.shift()); )
        (i = this.displayText(t)),
          i.toLowerCase().indexOf(this.query.toLowerCase())
            ? ~i.indexOf(this.query)
              ? u.push(t)
              : f.push(t)
            : r.push(t);
      return r.concat(u, f);
    },
    highlighter: function (t) {
      var r,
        e,
        o,
        s,
        h,
        u = n("<div></div>"),
        f = this.query,
        i = t.toLowerCase().indexOf(f.toLowerCase());
      if (((r = f.length), 0 === r)) return u.text(t).html();
      for (; i > -1; )
        (e = t.substr(0, i)),
          (o = t.substr(i, r)),
          (s = t.substr(i + r)),
          (h = n("<strong></strong>").text(o)),
          u.append(document.createTextNode(e)).append(h),
          (t = s),
          (i = t.toLowerCase().indexOf(f.toLowerCase()));
      return u.append(document.createTextNode(t)).html();
    },
    render: function (t) {
      var r = this,
        f = this,
        e = !1,
        u = [],
        i = r.options.separator;
      return (
        n.each(t, function (n, r) {
          n > 0 && r[i] !== t[n - 1][i] && u.push({ __type: "divider" });
          r[i] &&
            (0 === n || r[i] !== t[n - 1][i]) &&
            u.push({ __type: "category", name: r[i] });
          u.push(r);
        }),
        (t = n(u).map(function (t, i) {
          if ("category" == (i.__type || !1))
            return n(r.options.headerHtml).text(i.name)[0];
          if ("divider" == (i.__type || !1))
            return n(r.options.headerDivider)[0];
          var u = f.displayText(i);
          return (
            (t = n(r.options.item).data("value", i)),
            t.find("a").html(r.highlighter(u, i)),
            u == f.$element.val() &&
              (t.addClass("active"), f.$element.data("active", i), (e = !0)),
            t[0]
          );
        })),
        this.autoSelect &&
          !e &&
          (t.filter(":not(.dropdown-header)").first().addClass("active"),
          this.$element.data("active", t.first().data("value"))),
        this.$menu.html(t),
        this
      );
    },
    displayText: function (n) {
      return (
        ("undefined" != typeof n && "undefined" != typeof n.name && n.name) || n
      );
    },
    next: function () {
      var i = this.$menu.find(".active").removeClass("active"),
        t = i.next();
      t.length || (t = n(this.$menu.find("li")[0]));
      t.addClass("active");
    },
    prev: function () {
      var t = this.$menu.find(".active").removeClass("active"),
        n = t.prev();
      n.length || (n = this.$menu.find("li").last());
      n.addClass("active");
    },
    listen: function () {
      this.$element
        .on("focus", n.proxy(this.focus, this))
        .on("blur", n.proxy(this.blur, this))
        .on("keypress", n.proxy(this.keypress, this))
        .on("input", n.proxy(this.input, this))
        .on("keyup", n.proxy(this.keyup, this));
      this.eventSupported("keydown") &&
        this.$element.on("keydown", n.proxy(this.keydown, this));
      this.$menu
        .on("click", n.proxy(this.click, this))
        .on("mouseenter", "li", n.proxy(this.mouseenter, this))
        .on("mouseleave", "li", n.proxy(this.mouseleave, this));
    },
    destroy: function () {
      this.$element.data("typeahead", null);
      this.$element.data("active", null);
      this.$element
        .off("focus")
        .off("blur")
        .off("keypress")
        .off("input")
        .off("keyup");
      this.eventSupported("keydown") && this.$element.off("keydown");
      this.$menu.remove();
    },
    eventSupported: function (n) {
      var t = n in this.$element;
      return (
        t ||
          (this.$element.setAttribute(n, "return;"),
          (t = "function" == typeof this.$element[n])),
        t
      );
    },
    move: function (n) {
      if (this.shown)
        switch (n.keyCode) {
          case 9:
          case 13:
          case 27:
            n.preventDefault();
            break;
          case 38:
            if (n.shiftKey) return;
            n.preventDefault();
            this.prev();
            break;
          case 40:
            if (n.shiftKey) return;
            n.preventDefault();
            this.next();
        }
    },
    keydown: function (t) {
      this.suppressKeyPressRepeat = ~n.inArray(t.keyCode, [40, 38, 9, 13, 27]);
      this.shown || 40 != t.keyCode ? this.move(t) : this.lookup();
    },
    keypress: function (n) {
      this.suppressKeyPressRepeat || this.move(n);
    },
    input: function (n) {
      this.lookup();
      n.preventDefault();
    },
    keyup: function (n) {
      switch (n.keyCode) {
        case 9:
        case 13:
          if (!this.shown) return;
          this.select();
          break;
        case 27:
          if (!this.shown) return;
          this.hide();
      }
      n.preventDefault();
    },
    focus: function () {
      this.focused ||
        ((this.focused = !0), this.options.showHintOnFocus && this.lookup(""));
    },
    blur: function () {
      this.focused = !1;
      !this.mousedover && this.shown && this.hide();
    },
    click: function (n) {
      n.preventDefault();
      this.select();
      this.$element.focus();
      this.hide();
    },
    mouseenter: function (t) {
      this.mousedover = !0;
      this.$menu.find(".active").removeClass("active");
      n(t.currentTarget).addClass("active");
    },
    mouseleave: function () {
      this.mousedover = !1;
      !this.focused && this.shown && this.hide();
    },
  };
  i = n.fn.typeahead;
  n.fn.typeahead = function (i) {
    var r = arguments;
    return "string" == typeof i && "getActive" == i
      ? this.data("active")
      : this.each(function () {
          var f = n(this),
            u = f.data("typeahead"),
            e = "object" == typeof i && i;
          u || f.data("typeahead", (u = new t(this, e)));
          "string" == typeof i &&
            u[i] &&
            (r.length > 1
              ? u[i].apply(u, Array.prototype.slice.call(r, 1))
              : u[i]());
        });
  };
  n.fn.typeahead.defaults = {
    source: [],
    items: 8,
    menu: '<ul class="typeahead dropdown-menu" role="listbox"></ul>',
    item: '<li><a class="dropdown-item" href="#" role="option"></a></li>',
    minLength: 1,
    scrollHeight: 0,
    autoSelect: !0,
    afterSelect: n.noop,
    addItem: !1,
    delay: 0,
    separator: "category",
    headerHtml: '<li class="dropdown-header"></li>',
    headerDivider: '<li class="divider" role="separator"></li>',
  };
  n.fn.typeahead.Constructor = t;
  n.fn.typeahead.noConflict = function () {
    return (n.fn.typeahead = i), this;
  };
  n(document).on(
    "focus.typeahead.data-api",
    '[data-provide="typeahead"]',
    function () {
      var t = n(this);
      t.data("typeahead") || t.typeahead(t.data());
    }
  );
});
$("#modalMessage").submit(function () {
  var t = document.getElementById("chec1id"),
    i = document.getElementById("chec2id"),
    r = document.getElementById("chec3id"),
    n;
  t.checked == !1 && i.checked == !1 && r.checked == !1
    ? $(".serverError")
        .removeClass("serverErrorDisplayNone")
        .text("יש לבחור לפחות דרך התקשרות אחת")
    : ((n = document.getElementById("submtBtn")),
      (n.type = "submit"),
      $(".serverError").addClass("serverErrorDisplayNone"),
      $("#settingModal").modal("hide"));
});
$(function () {
  $("#personal-email").keyup(function () {
    $("#EmailForm").valid();
  });
  $(".personalDetailes .typeahead.city")
    .typeahead({
      source: function (n, t) {
        return (
          $("#CityId").val(""),
          $.get("/Umbraco/Api/Personal/GetCities", { term: n }, function (n) {
            return t(n);
          })
        );
      },
      updater: function (n) {
        return (
          (n.name = $.trim(n.name)),
          $("#CityId").val(n.id),
          $(".street").val(""),
          $("#StreetId").val(""),
          n
        );
      },
      autoSelect: !0,
    })
    .focusout(function () {
      $("#CityId").val().length <= 0 &&
        $(".personalDetailes .typeahead.city").val("");
    });
  $(".personalDetailes .typeahead.mail-city")
    .typeahead({
      source: function (n, t) {
        return (
          $("#mailCityId").val(""),
          $.get("/Umbraco/Api/Personal/GetCities", { term: n }, function (n) {
            return t(n);
          })
        );
      },
      updater: function (n) {
        return (n.name = $.trim(n.name)), $("#CityPostId").val(n.id), n;
      },
      autoSelect: !0,
    })
    .focusout(function () {
      $("#CityPostId").val().length <= 0 &&
        $(".personalDetailes .typeahead.mail-city").val("");
    });
  $(".personalDetailes .typeahead.street")
    .typeahead({
      source: function (n, t) {
        return $.get(
          "/Umbraco/Api/Personal/GetStreets",
          { term: n, cityId: $("#CityId").val() },
          function (n) {
            return t(n);
          }
        );
      },
      updater: function (n) {
        return (n.name = $.trim(n.name)), $("#StreetId").val(n.id), n;
      },
      autoSelect: !0,
    })
    .focusout(function () {
      $("#StreetId").val().length <= 0 &&
        $(".personalDetailes .typeahead.street").val("");
      $(".personalDetailes .typeahead.street").val().length <= 0 &&
        $("#StreetId").val("");
    });
  $("#chec1id, #chec2id, #chec3id").on("click", function () {
    var n = document.getElementById("chec1id"),
      t = document.getElementById("chec2id"),
      i = document.getElementById("chec3id");
    n.checked == !1 && t.checked == !1 && i.checked == !1
      ? ($(".serverError")
          .removeClass("serverErrorDisplayNone")
          .text("יש לבחור לפחות דרך התקשרות אחת"),
        $("#submtBtn").addClass("inactiveButton"))
      : ($("#submtBtn").removeClass("inactiveButton"),
        $(".serverError").addClass("serverErrorDisplayNone"));
  });
  $(".personalDetailes .typeahead").keypress(function () {
    var n = $(this);
    setTimeout(function () {
      var t = n.siblings(".typeahead").find("li").length;
      n.siblings(".typeaheadStatus").text(
        "נמצאו " +
          t +
          " תשובות, השתשמש בחיצים למעלה ולמטה בשביל לעבור בין התוצאות"
      );
    }, 200);
  });
}),
  (function (n) {
    typeof define == "function" && define.amd
      ? define(["jquery"], n)
      : typeof exports == "object"
      ? n(require("jquery"))
      : n(jQuery);
  })(function (n) {
    var t = (function () {
        var t;
        return (
          n &&
            n.fn &&
            n.fn.select2 &&
            n.fn.select2.amd &&
            (t = n.fn.select2.amd),
          (function () {
            if (!t || !t.requirejs) {
              t ? (i = t) : (t = {});
              var n, i, r;
              (function (t) {
                function e(n, t) {
                  return nt.call(n, t);
                }
                function c(n, t) {
                  var o,
                    s,
                    r,
                    u,
                    h,
                    y,
                    c,
                    w,
                    i,
                    l,
                    p,
                    e = t && t.split("/"),
                    a = f.map,
                    v = (a && a["*"]) || {};
                  if (n && n.charAt(0) === ".")
                    if (t) {
                      for (
                        n = n.split("/"),
                          h = n.length - 1,
                          f.nodeIdCompat &&
                            b.test(n[h]) &&
                            (n[h] = n[h].replace(b, "")),
                          n = e.slice(0, e.length - 1).concat(n),
                          i = 0;
                        i < n.length;
                        i += 1
                      )
                        if (((p = n[i]), p === ".")) n.splice(i, 1), (i -= 1);
                        else if (p === "..")
                          if (i === 1 && (n[2] === ".." || n[0] === ".."))
                            break;
                          else i > 0 && (n.splice(i - 1, 2), (i -= 2));
                      n = n.join("/");
                    } else n.indexOf("./") === 0 && (n = n.substring(2));
                  if ((e || v) && a) {
                    for (o = n.split("/"), i = o.length; i > 0; i -= 1) {
                      if (((s = o.slice(0, i).join("/")), e))
                        for (l = e.length; l > 0; l -= 1)
                          if (
                            ((r = a[e.slice(0, l).join("/")]),
                            r && ((r = r[s]), r))
                          ) {
                            u = r;
                            y = i;
                            break;
                          }
                      if (u) break;
                      !c && v && v[s] && ((c = v[s]), (w = i));
                    }
                    !u && c && ((u = c), (y = w));
                    u && (o.splice(0, y, u), (n = o.join("/")));
                  }
                  return n;
                }
                function p(n, i) {
                  return function () {
                    var r = tt.call(arguments, 0);
                    return (
                      typeof r[0] != "string" && r.length === 1 && r.push(null),
                      o.apply(t, r.concat([n, i]))
                    );
                  };
                }
                function k(n) {
                  return function (t) {
                    return c(t, n);
                  };
                }
                function d(n) {
                  return function (t) {
                    u[n] = t;
                  };
                }
                function l(n) {
                  if (e(h, n)) {
                    var i = h[n];
                    delete h[n];
                    y[n] = !0;
                    a.apply(t, i);
                  }
                  if (!e(u, n) && !e(y, n)) throw new Error("No " + n);
                  return u[n];
                }
                function w(n) {
                  var i,
                    t = n ? n.indexOf("!") : -1;
                  return (
                    t > -1 &&
                      ((i = n.substring(0, t)),
                      (n = n.substring(t + 1, n.length))),
                    [i, n]
                  );
                }
                function g(n) {
                  return function () {
                    return (f && f.config && f.config[n]) || {};
                  };
                }
                var a,
                  o,
                  v,
                  s,
                  u = {},
                  h = {},
                  f = {},
                  y = {},
                  nt = Object.prototype.hasOwnProperty,
                  tt = [].slice,
                  b = /\.js$/;
                v = function (n, t) {
                  var r,
                    u = w(n),
                    i = u[0];
                  return (
                    (n = u[1]),
                    i && ((i = c(i, t)), (r = l(i))),
                    i
                      ? (n = r && r.normalize ? r.normalize(n, k(t)) : c(n, t))
                      : ((n = c(n, t)),
                        (u = w(n)),
                        (i = u[0]),
                        (n = u[1]),
                        i && (r = l(i))),
                    { f: i ? i + "!" + n : n, n: n, pr: i, p: r }
                  );
                };
                s = {
                  require: function (n) {
                    return p(n);
                  },
                  exports: function (n) {
                    var t = u[n];
                    return typeof t != "undefined" ? t : (u[n] = {});
                  },
                  module: function (n) {
                    return { id: n, uri: "", exports: u[n], config: g(n) };
                  },
                };
                a = function (n, i, r, f) {
                  var w,
                    o,
                    k,
                    b,
                    c,
                    a = [],
                    g = typeof r,
                    nt;
                  if (((f = f || n), g === "undefined" || g === "function")) {
                    for (
                      i =
                        !i.length && r.length
                          ? ["require", "exports", "module"]
                          : i,
                        c = 0;
                      c < i.length;
                      c += 1
                    )
                      if (((b = v(i[c], f)), (o = b.f), o === "require"))
                        a[c] = s.require(n);
                      else if (o === "exports")
                        (a[c] = s.exports(n)), (nt = !0);
                      else if (o === "module") w = a[c] = s.module(n);
                      else if (e(u, o) || e(h, o) || e(y, o)) a[c] = l(o);
                      else if (b.p)
                        b.p.load(b.n, p(f, !0), d(o), {}), (a[c] = u[o]);
                      else throw new Error(n + " missing " + o);
                    k = r ? r.apply(u[n], a) : undefined;
                    n &&
                      (w && w.exports !== t && w.exports !== u[n]
                        ? (u[n] = w.exports)
                        : (k === t && nt) || (u[n] = k));
                  } else n && (u[n] = r);
                };
                n =
                  i =
                  o =
                    function (n, i, r, u, e) {
                      if (typeof n == "string")
                        return s[n] ? s[n](i) : l(v(n, i).f);
                      if (!n.splice) {
                        if (((f = n), f.deps && o(f.deps, f.callback), !i))
                          return;
                        i.splice ? ((n = i), (i = r), (r = null)) : (n = t);
                      }
                      return (
                        (i = i || function () {}),
                        typeof r == "function" && ((r = u), (u = e)),
                        u
                          ? a(t, n, i, r)
                          : setTimeout(function () {
                              a(t, n, i, r);
                            }, 4),
                        o
                      );
                    };
                o.config = function (n) {
                  return o(n);
                };
                n._defined = u;
                r = function (n, t, i) {
                  if (typeof n != "string")
                    throw new Error(
                      "See almond README: incorrect module build, no module name"
                    );
                  t.splice || ((i = t), (t = []));
                  e(u, n) || e(h, n) || (h[n] = [n, t, i]);
                };
                r.amd = { jQuery: !0 };
              })();
              t.requirejs = n;
              t.require = i;
              t.define = r;
            }
          })(),
          t.define("almond", function () {}),
          t.define("jquery", [], function () {
            var t = n || $;
            return (
              t == null &&
                console &&
                console.error &&
                console.error(
                  "Select2: An instance of jQuery or a jQuery-compatible library was not found. Make sure that you are including jQuery before Select2 on your web page."
                ),
              t
            );
          }),
          t.define("select2/utils", ["jquery"], function (n) {
            function r(n) {
              var i = n.prototype,
                r = [],
                t,
                u;
              for (t in i)
                ((u = i[t]), typeof u == "function") &&
                  t !== "constructor" &&
                  r.push(t);
              return r;
            }
            var t = {},
              i;
            return (
              (t.Extend = function (n, t) {
                function r() {
                  this.constructor = n;
                }
                var u = {}.hasOwnProperty;
                for (var i in t) u.call(t, i) && (n[i] = t[i]);
                return (
                  (r.prototype = t.prototype),
                  (n.prototype = new r()),
                  (n.__super__ = t.prototype),
                  n
                );
              }),
              (t.Decorate = function (n, t) {
                function i() {
                  var r = Array.prototype.unshift,
                    u = t.prototype.constructor.length,
                    i = n.prototype.constructor;
                  u > 0 &&
                    (r.call(arguments, n.prototype.constructor),
                    (i = t.prototype.constructor));
                  i.apply(this, arguments);
                }
                function l() {
                  this.constructor = i;
                }
                var s = r(t),
                  h = r(n),
                  u,
                  e,
                  c,
                  f,
                  o;
                for (
                  t.displayName = n.displayName, i.prototype = new l(), u = 0;
                  u < h.length;
                  u++
                )
                  (e = h[u]), (i.prototype[e] = n.prototype[e]);
                for (
                  c = function (n) {
                    var r = function () {},
                      u;
                    return (
                      (n in i.prototype) && (r = i.prototype[n]),
                      (u = t.prototype[n]),
                      function () {
                        var n = Array.prototype.unshift;
                        return n.call(arguments, r), u.apply(this, arguments);
                      }
                    );
                  },
                    f = 0;
                  f < s.length;
                  f++
                )
                  (o = s[f]), (i.prototype[o] = c(o));
                return i;
              }),
              (i = function () {
                this.listeners = {};
              }),
              (i.prototype.on = function (n, t) {
                this.listeners = this.listeners || {};
                n in this.listeners
                  ? this.listeners[n].push(t)
                  : (this.listeners[n] = [t]);
              }),
              (i.prototype.trigger = function (n) {
                var t = Array.prototype.slice;
                this.listeners = this.listeners || {};
                n in this.listeners &&
                  this.invoke(this.listeners[n], t.call(arguments, 1));
                "*" in this.listeners &&
                  this.invoke(this.listeners["*"], arguments);
              }),
              (i.prototype.invoke = function (n, t) {
                for (var i = 0, r = n.length; i < r; i++) n[i].apply(this, t);
              }),
              (t.Observable = i),
              (t.generateChars = function (n) {
                for (var t, i = "", r = 0; r < n; r++)
                  (t = Math.floor(Math.random() * 36)), (i += t.toString(36));
                return i;
              }),
              (t.bind = function (n, t) {
                return function () {
                  n.apply(t, arguments);
                };
              }),
              (t._convertData = function (n) {
                var f, r, i, u, t;
                for (f in n)
                  if (((r = f.split("-")), (i = n), r.length !== 1)) {
                    for (u = 0; u < r.length; u++)
                      (t = r[u]),
                        (t = t.substring(0, 1).toLowerCase() + t.substring(1)),
                        t in i || (i[t] = {}),
                        u == r.length - 1 && (i[t] = n[f]),
                        (i = i[t]);
                    delete n[f];
                  }
                return n;
              }),
              (t.hasScroll = function (t, i) {
                var u = n(i),
                  f = i.style.overflowX,
                  r = i.style.overflowY;
                return f === r && (r === "hidden" || r === "visible")
                  ? !1
                  : f === "scroll" || r === "scroll"
                  ? !0
                  : u.innerHeight() < i.scrollHeight ||
                    u.innerWidth() < i.scrollWidth;
              }),
              (t.escapeMarkup = function (n) {
                var t = {
                  "\\": "&#92;",
                  "&": "&amp;",
                  "<": "&lt;",
                  ">": "&gt;",
                  '"': "&quot;",
                  "'": "&#39;",
                  "/": "&#47;",
                };
                return typeof n != "string"
                  ? n
                  : String(n).replace(/[&<>"'\/\\]/g, function (n) {
                      return t[n];
                    });
              }),
              (t.appendMany = function (t, i) {
                if (n.fn.jquery.substr(0, 3) === "1.7") {
                  var r = n();
                  n.map(i, function (n) {
                    r = r.add(n);
                  });
                  i = r;
                }
                t.append(i);
              }),
              t
            );
          }),
          t.define("select2/results", ["jquery", "./utils"], function (n, t) {
            function i(n, t, r) {
              this.$element = n;
              this.data = r;
              this.options = t;
              i.__super__.constructor.call(this);
            }
            return (
              t.Extend(i, t.Observable),
              (i.prototype.render = function () {
                var t = n(
                  '<ul class="select2-results__options" role="tree"></ul>'
                );
                return (
                  this.options.get("multiple") &&
                    t.attr("aria-multiselectable", "true"),
                  (this.$results = t),
                  t
                );
              }),
              (i.prototype.clear = function () {
                this.$results.empty();
              }),
              (i.prototype.displayMessage = function (t) {
                var u = this.options.get("escapeMarkup"),
                  i,
                  r;
                this.clear();
                this.hideLoading();
                i = n(
                  '<li role="treeitem" aria-live="assertive" class="select2-results__option"></li>'
                );
                r = this.options.get("translations").get(t.message);
                i.append(u(r(t.args)));
                i[0].className += " select2-results__message";
                this.$results.append(i);
              }),
              (i.prototype.hideMessages = function () {
                this.$results.find(".select2-results__message").remove();
              }),
              (i.prototype.append = function (n) {
                var i, t, r, u;
                if (
                  (this.hideLoading(),
                  (i = []),
                  n.results == null || n.results.length === 0)
                ) {
                  this.$results.children().length === 0 &&
                    this.trigger("results:message", { message: "noResults" });
                  return;
                }
                for (
                  n.results = this.sort(n.results), t = 0;
                  t < n.results.length;
                  t++
                )
                  (r = n.results[t]), (u = this.option(r)), i.push(u);
                this.$results.append(i);
              }),
              (i.prototype.position = function (n, t) {
                var i = t.find(".select2-results");
                i.append(n);
              }),
              (i.prototype.sort = function (n) {
                var t = this.options.get("sorter");
                return t(n);
              }),
              (i.prototype.setClasses = function () {
                var t = this;
                this.data.current(function (i) {
                  var f = n.map(i, function (n) {
                      return n.id.toString();
                    }),
                    r = t.$results.find(
                      ".select2-results__option[aria-selected]"
                    ),
                    u;
                  r.each(function () {
                    var i = n(this),
                      t = n.data(this, "data"),
                      r = "" + t.id;
                    (t.element != null && t.element.selected) ||
                    (t.element == null && n.inArray(r, f) > -1)
                      ? i.attr("aria-selected", "true")
                      : i.attr("aria-selected", "false");
                  });
                  u = r.filter("[aria-selected=true]");
                  u.length > 0
                    ? u.first().trigger("mouseenter")
                    : r.first().trigger("mouseenter");
                });
              }),
              (i.prototype.showLoading = function (n) {
                this.hideLoading();
                var i = this.options.get("translations").get("searching"),
                  r = { disabled: !0, loading: !0, text: i(n) },
                  t = this.option(r);
                t.className += " loading-results";
                this.$results.prepend(t);
              }),
              (i.prototype.hideLoading = function () {
                this.$results.find(".loading-results").remove();
              }),
              (i.prototype.option = function (t) {
                var r = document.createElement("li"),
                  i,
                  e,
                  c,
                  o,
                  u,
                  v,
                  s,
                  f,
                  l,
                  a,
                  h;
                r.className = "select2-results__option";
                i = { role: "treeitem", "aria-selected": "false" };
                t.disabled &&
                  (delete i["aria-selected"], (i["aria-disabled"] = "true"));
                t.id == null && delete i["aria-selected"];
                t._resultId != null && (r.id = t._resultId);
                t.title && (r.title = t.title);
                t.children &&
                  ((i.role = "group"),
                  (i["aria-label"] = t.text),
                  delete i["aria-selected"]);
                for (e in i) (c = i[e]), r.setAttribute(e, c);
                if (t.children) {
                  for (
                    o = n(r),
                      u = document.createElement("strong"),
                      u.className = "select2-results__group",
                      v = n(u),
                      this.template(t, u),
                      s = [],
                      f = 0;
                    f < t.children.length;
                    f++
                  )
                    (l = t.children[f]), (a = this.option(l)), s.push(a);
                  h = n("<ul></ul>", {
                    class:
                      "select2-results__options select2-results__options--nested",
                  });
                  h.append(s);
                  o.append(u);
                  o.append(h);
                } else this.template(t, r);
                return n.data(r, "data", t), r;
              }),
              (i.prototype.bind = function (t) {
                var i = this,
                  r = t.id + "-results";
                this.$results.attr("id", r);
                t.on("results:all", function (n) {
                  i.clear();
                  i.append(n.data);
                  t.isOpen() && i.setClasses();
                });
                t.on("results:append", function (n) {
                  i.append(n.data);
                  t.isOpen() && i.setClasses();
                });
                t.on("query", function (n) {
                  i.hideMessages();
                  i.showLoading(n);
                });
                t.on("select", function () {
                  t.isOpen() && i.setClasses();
                });
                t.on("unselect", function () {
                  t.isOpen() && i.setClasses();
                });
                t.on("open", function () {
                  i.$results.attr("aria-expanded", "true");
                  i.$results.attr("aria-hidden", "false");
                  i.setClasses();
                  i.ensureHighlightVisible();
                });
                t.on("close", function () {
                  i.$results.attr("aria-expanded", "false");
                  i.$results.attr("aria-hidden", "true");
                  i.$results.removeAttr("aria-activedescendant");
                });
                t.on("results:toggle", function () {
                  var n = i.getHighlightedResults();
                  n.length !== 0 && n.trigger("mouseup");
                });
                t.on("results:select", function () {
                  var n = i.getHighlightedResults(),
                    t;
                  n.length !== 0 &&
                    ((t = n.data("data")),
                    n.attr("aria-selected") == "true"
                      ? i.trigger("close", {})
                      : i.trigger("select", { data: t }));
                });
                t.on("results:previous", function () {
                  var r = i.getHighlightedResults(),
                    u = i.$results.find("[aria-selected]"),
                    f = u.index(r),
                    n,
                    t;
                  if (f !== 0) {
                    n = f - 1;
                    r.length === 0 && (n = 0);
                    t = u.eq(n);
                    t.trigger("mouseenter");
                    var e = i.$results.offset().top,
                      o = t.offset().top,
                      s = i.$results.scrollTop() + (o - e);
                    n === 0
                      ? i.$results.scrollTop(0)
                      : o - e < 0 && i.$results.scrollTop(s);
                  }
                });
                t.on("results:next", function () {
                  var e = i.getHighlightedResults(),
                    t = i.$results.find("[aria-selected]"),
                    o = t.index(e),
                    r = o + 1,
                    n;
                  if (!(r >= t.length)) {
                    n = t.eq(r);
                    n.trigger("mouseenter");
                    var u =
                        i.$results.offset().top + i.$results.outerHeight(!1),
                      f = n.offset().top + n.outerHeight(!1),
                      s = i.$results.scrollTop() + f - u;
                    r === 0
                      ? i.$results.scrollTop(0)
                      : f > u && i.$results.scrollTop(s);
                  }
                });
                t.on("results:focus", function (n) {
                  n.element.addClass("select2-results__option--highlighted");
                });
                t.on("results:message", function (n) {
                  i.displayMessage(n);
                });
                if (n.fn.mousewheel)
                  this.$results.on("mousewheel", function (n) {
                    var t = i.$results.scrollTop(),
                      r = i.$results.get(0).scrollHeight - t + n.deltaY,
                      u = n.deltaY > 0 && t - n.deltaY <= 0,
                      f = n.deltaY < 0 && r <= i.$results.height();
                    u
                      ? (i.$results.scrollTop(0),
                        n.preventDefault(),
                        n.stopPropagation())
                      : f &&
                        (i.$results.scrollTop(
                          i.$results.get(0).scrollHeight - i.$results.height()
                        ),
                        n.preventDefault(),
                        n.stopPropagation());
                  });
                this.$results.on(
                  "mouseup",
                  ".select2-results__option[aria-selected]",
                  function (t) {
                    var r = n(this),
                      u = r.data("data");
                    if (r.attr("aria-selected") === "true") {
                      i.options.get("multiple")
                        ? i.trigger("unselect", { originalEvent: t, data: u })
                        : i.trigger("close", {});
                      return;
                    }
                    i.trigger("select", { originalEvent: t, data: u });
                  }
                );
                this.$results.on(
                  "mouseenter",
                  ".select2-results__option[aria-selected]",
                  function () {
                    var t = n(this).data("data");
                    i.getHighlightedResults().removeClass(
                      "select2-results__option--highlighted"
                    );
                    i.trigger("results:focus", { data: t, element: n(this) });
                  }
                );
              }),
              (i.prototype.getHighlightedResults = function () {
                return this.$results.find(
                  ".select2-results__option--highlighted"
                );
              }),
              (i.prototype.destroy = function () {
                this.$results.remove();
              }),
              (i.prototype.ensureHighlightVisible = function () {
                var n = this.getHighlightedResults();
                if (n.length !== 0) {
                  var f = this.$results.find("[aria-selected]"),
                    e = f.index(n),
                    t = this.$results.offset().top,
                    i = n.offset().top,
                    r = this.$results.scrollTop() + (i - t),
                    u = i - t;
                  r -= n.outerHeight(!1) * 2;
                  e <= 2
                    ? this.$results.scrollTop(0)
                    : (u > this.$results.outerHeight() || u < 0) &&
                      this.$results.scrollTop(r);
                }
              }),
              (i.prototype.template = function (t, i) {
                var u = this.options.get("templateResult"),
                  f = this.options.get("escapeMarkup"),
                  r = u(t, i);
                r == null
                  ? (i.style.display = "none")
                  : typeof r == "string"
                  ? (i.innerHTML = f(r))
                  : n(i).append(r);
              }),
              i
            );
          }),
          t.define("select2/keys", [], function () {
            return {
              BACKSPACE: 8,
              TAB: 9,
              ENTER: 13,
              SHIFT: 16,
              CTRL: 17,
              ALT: 18,
              ESC: 27,
              SPACE: 32,
              PAGE_UP: 33,
              PAGE_DOWN: 34,
              END: 35,
              HOME: 36,
              LEFT: 37,
              UP: 38,
              RIGHT: 39,
              DOWN: 40,
              DELETE: 46,
            };
          }),
          t.define(
            "select2/selection/base",
            ["jquery", "../utils", "../keys"],
            function (n, t, i) {
              function r(n, t) {
                this.$element = n;
                this.options = t;
                r.__super__.constructor.call(this);
              }
              return (
                t.Extend(r, t.Observable),
                (r.prototype.render = function () {
                  var t = n(
                    '<span class="select2-selection" role="combobox"  aria-haspopup="true" aria-expanded="false"></span>'
                  );
                  return (
                    (this._tabindex = 0),
                    this.$element.data("old-tabindex") != null
                      ? (this._tabindex = this.$element.data("old-tabindex"))
                      : this.$element.attr("tabindex") != null &&
                        (this._tabindex = this.$element.attr("tabindex")),
                    t.attr("title", this.$element.attr("title")),
                    t.attr("tabindex", this._tabindex),
                    (this.$selection = t),
                    t
                  );
                }),
                (r.prototype.bind = function (n) {
                  var t = this,
                    u = n.id + "-container",
                    r = n.id + "-results";
                  this.container = n;
                  this.$selection.on("focus", function (n) {
                    t.trigger("focus", n);
                  });
                  this.$selection.on("blur", function (n) {
                    t._handleBlur(n);
                  });
                  this.$selection.on("keydown", function (n) {
                    t.trigger("keypress", n);
                    n.which === i.SPACE && n.preventDefault();
                  });
                  n.on("results:focus", function (n) {
                    t.$selection.attr(
                      "aria-activedescendant",
                      n.data._resultId
                    );
                  });
                  n.on("selection:update", function (n) {
                    t.update(n.data);
                  });
                  n.on("open", function () {
                    t.$selection.attr("aria-expanded", "true");
                    t.$selection.attr("aria-owns", r);
                    t._attachCloseHandler(n);
                  });
                  n.on("close", function () {
                    t.$selection.attr("aria-expanded", "false");
                    t.$selection.removeAttr("aria-activedescendant");
                    t.$selection.removeAttr("aria-owns");
                    t.$selection.focus();
                    t._detachCloseHandler(n);
                  });
                  n.on("enable", function () {
                    t.$selection.attr("tabindex", t._tabindex);
                  });
                  n.on("disable", function () {
                    t.$selection.attr("tabindex", "-1");
                  });
                }),
                (r.prototype._handleBlur = function (t) {
                  var i = this;
                  window.setTimeout(function () {
                    document.activeElement == i.$selection[0] ||
                      n.contains(i.$selection[0], document.activeElement) ||
                      i.trigger("blur", t);
                  }, 1);
                }),
                (r.prototype._attachCloseHandler = function (t) {
                  var i = this;
                  n(document.body).on(
                    "mousedown.select2." + t.id,
                    function (t) {
                      var i = n(t.target),
                        r = i.closest(".select2"),
                        u = n(".select2.select2-container--open");
                      u.each(function () {
                        var i = n(this),
                          t;
                        this != r[0] &&
                          ((t = i.data("element")), t.select2("close"));
                      });
                    }
                  );
                }),
                (r.prototype._detachCloseHandler = function (t) {
                  n(document.body).off("mousedown.select2." + t.id);
                }),
                (r.prototype.position = function (n, t) {
                  var i = t.find(".selection");
                  i.append(n);
                }),
                (r.prototype.destroy = function () {
                  this._detachCloseHandler(this.container);
                }),
                (r.prototype.update = function () {
                  throw new Error(
                    "The `update` method must be defined in child classes."
                  );
                }),
                r
              );
            }
          ),
          t.define(
            "select2/selection/single",
            ["jquery", "./base", "../utils", "../keys"],
            function (n, t, i) {
              function r() {
                r.__super__.constructor.apply(this, arguments);
              }
              return (
                i.Extend(r, t),
                (r.prototype.render = function () {
                  var n = r.__super__.render.call(this);
                  return (
                    n.addClass("select2-selection--single"),
                    n.html(
                      '<span class="select2-selection__rendered"></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span>'
                    ),
                    n
                  );
                }),
                (r.prototype.bind = function (n) {
                  var i = this,
                    t;
                  r.__super__.bind.apply(this, arguments);
                  t = n.id + "-container";
                  this.$selection
                    .find(".select2-selection__rendered")
                    .attr("id", t);
                  this.$selection.attr("aria-labelledby", t);
                  this.$selection.on("mousedown", function (n) {
                    n.which === 1 && i.trigger("toggle", { originalEvent: n });
                  });
                  this.$selection.on("focus", function () {});
                  this.$selection.on("blur", function () {});
                  n.on("selection:update", function (n) {
                    i.update(n.data);
                  });
                }),
                (r.prototype.clear = function () {
                  this.$selection.find(".select2-selection__rendered").empty();
                }),
                (r.prototype.display = function (n, t) {
                  var i = this.options.get("templateSelection"),
                    r = this.options.get("escapeMarkup");
                  return r(i(n, t));
                }),
                (r.prototype.selectionContainer = function () {
                  return n("<span></span>");
                }),
                (r.prototype.update = function (n) {
                  if (n.length === 0) {
                    this.clear();
                    return;
                  }
                  var t = n[0],
                    i = this.$selection.find(".select2-selection__rendered"),
                    r = this.display(t, i);
                  i.empty().append(r);
                  i.prop("title", t.title || t.text);
                }),
                r
              );
            }
          ),
          t.define(
            "select2/selection/multiple",
            ["jquery", "./base", "../utils"],
            function (n, t, i) {
              function r() {
                r.__super__.constructor.apply(this, arguments);
              }
              return (
                i.Extend(r, t),
                (r.prototype.render = function () {
                  var n = r.__super__.render.call(this);
                  return (
                    n.addClass("select2-selection--multiple"),
                    n.html('<ul class="select2-selection__rendered"></ul>'),
                    n
                  );
                }),
                (r.prototype.bind = function () {
                  var t = this;
                  r.__super__.bind.apply(this, arguments);
                  this.$selection.on("click", function (n) {
                    t.trigger("toggle", { originalEvent: n });
                  });
                  this.$selection.on(
                    "click",
                    ".select2-selection__choice__remove",
                    function (i) {
                      if (!t.options.get("disabled")) {
                        var r = n(this),
                          u = r.parent(),
                          f = u.data("data");
                        t.trigger("unselect", { originalEvent: i, data: f });
                      }
                    }
                  );
                }),
                (r.prototype.clear = function () {
                  this.$selection.find(".select2-selection__rendered").empty();
                }),
                (r.prototype.display = function (n, t) {
                  var i = this.options.get("templateSelection"),
                    r = this.options.get("escapeMarkup");
                  return r(i(n, t));
                }),
                (r.prototype.selectionContainer = function () {
                  return n(
                    '<li class="select2-selection__choice"><span class="select2-selection__choice__remove" role="presentation">&times;</span></li>'
                  );
                }),
                (r.prototype.update = function (n) {
                  var f, r, e;
                  if ((this.clear(), n.length !== 0)) {
                    for (f = [], r = 0; r < n.length; r++) {
                      var u = n[r],
                        t = this.selectionContainer(),
                        o = this.display(u, t);
                      t.append(o);
                      t.prop("title", u.title || u.text);
                      t.data("data", u);
                      f.push(t);
                    }
                    e = this.$selection.find(".select2-selection__rendered");
                    i.appendMany(e, f);
                  }
                }),
                r
              );
            }
          ),
          t.define("select2/selection/placeholder", ["../utils"], function () {
            function n(n, t, i) {
              this.placeholder = this.normalizePlaceholder(
                i.get("placeholder")
              );
              n.call(this, t, i);
            }
            return (
              (n.prototype.normalizePlaceholder = function (n, t) {
                return typeof t == "string" && (t = { id: "", text: t }), t;
              }),
              (n.prototype.createPlaceholder = function (n, t) {
                var i = this.selectionContainer();
                return (
                  i.html(this.display(t)),
                  i
                    .addClass("select2-selection__placeholder")
                    .removeClass("select2-selection__choice"),
                  i
                );
              }),
              (n.prototype.update = function (n, t) {
                var r = t.length == 1 && t[0].id != this.placeholder.id,
                  u = t.length > 1,
                  i;
                if (u || r) return n.call(this, t);
                this.clear();
                i = this.createPlaceholder(this.placeholder);
                this.$selection.find(".select2-selection__rendered").append(i);
              }),
              n
            );
          }),
          t.define(
            "select2/selection/allowClear",
            ["jquery", "../keys"],
            function (n, t) {
              function i() {}
              return (
                (i.prototype.bind = function (n, t, i) {
                  var r = this;
                  n.call(this, t, i);
                  this.placeholder == null &&
                    this.options.get("debug") &&
                    window.console &&
                    console.error &&
                    console.error(
                      "Select2: The `allowClear` option should be used in combination with the `placeholder` option."
                    );
                  this.$selection.on(
                    "mousedown",
                    ".select2-selection__clear",
                    function (n) {
                      r._handleClear(n);
                    }
                  );
                  t.on("keypress", function (n) {
                    r._handleKeyboardClear(n, t);
                  });
                }),
                (i.prototype._handleClear = function (n, t) {
                  var r, u, i, f;
                  if (
                    !this.options.get("disabled") &&
                    ((r = this.$selection.find(".select2-selection__clear")),
                    r.length !== 0)
                  ) {
                    for (
                      t.stopPropagation(), u = r.data("data"), i = 0;
                      i < u.length;
                      i++
                    )
                      if (
                        ((f = { data: u[i] }),
                        this.trigger("unselect", f),
                        f.prevented)
                      )
                        return;
                    this.$element.val(this.placeholder.id).trigger("change");
                    this.trigger("toggle", {});
                  }
                }),
                (i.prototype._handleKeyboardClear = function (n, i, r) {
                  r.isOpen() ||
                    ((i.which == t.DELETE || i.which == t.BACKSPACE) &&
                      this._handleClear(i));
                }),
                (i.prototype.update = function (t, i) {
                  if (
                    (t.call(this, i),
                    !(
                      this.$selection.find(".select2-selection__placeholder")
                        .length > 0
                    ) && i.length !== 0)
                  ) {
                    var r = n(
                      '<span class="select2-selection__clear">&times;</span>'
                    );
                    r.data("data", i);
                    this.$selection
                      .find(".select2-selection__rendered")
                      .prepend(r);
                  }
                }),
                i
              );
            }
          ),
          t.define(
            "select2/selection/search",
            ["jquery", "../utils", "../keys"],
            function (n, t, i) {
              function r(n, t, i) {
                n.call(this, t, i);
              }
              return (
                (r.prototype.render = function (t) {
                  var i = n(
                      '<li class="select2-search select2-search--inline"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox" aria-autocomplete="list" /></li>'
                    ),
                    r;
                  return (
                    (this.$searchContainer = i),
                    (this.$search = i.find("input")),
                    (r = t.call(this)),
                    this._transferTabIndex(),
                    r
                  );
                }),
                (r.prototype.bind = function (n, t, r) {
                  var u = this,
                    f,
                    e;
                  n.call(this, t, r);
                  t.on("open", function () {
                    u.$search.trigger("focus");
                  });
                  t.on("close", function () {
                    u.$search.val("");
                    u.$search.removeAttr("aria-activedescendant");
                    u.$search.trigger("focus");
                  });
                  t.on("enable", function () {
                    u.$search.prop("disabled", !1);
                    u._transferTabIndex();
                  });
                  t.on("disable", function () {
                    u.$search.prop("disabled", !0);
                  });
                  t.on("focus", function () {
                    u.$search.trigger("focus");
                  });
                  t.on("results:focus", function (n) {
                    u.$search.attr("aria-activedescendant", n.id);
                  });
                  this.$selection.on(
                    "focusin",
                    ".select2-search--inline",
                    function (n) {
                      u.trigger("focus", n);
                    }
                  );
                  this.$selection.on(
                    "focusout",
                    ".select2-search--inline",
                    function (n) {
                      u._handleBlur(n);
                    }
                  );
                  this.$selection.on(
                    "keydown",
                    ".select2-search--inline",
                    function (n) {
                      var r, t, f;
                      n.stopPropagation();
                      u.trigger("keypress", n);
                      u._keyUpPrevented = n.isDefaultPrevented();
                      r = n.which;
                      r === i.BACKSPACE &&
                        u.$search.val() === "" &&
                        ((t = u.$searchContainer.prev(
                          ".select2-selection__choice"
                        )),
                        t.length > 0 &&
                          ((f = t.data("data")),
                          u.searchRemoveChoice(f),
                          n.preventDefault()));
                    }
                  );
                  f = document.documentMode;
                  e = f && f <= 11;
                  this.$selection.on(
                    "input.searchcheck",
                    ".select2-search--inline",
                    function () {
                      if (e) {
                        u.$selection.off("input.search input.searchcheck");
                        return;
                      }
                      u.$selection.off("keyup.search");
                    }
                  );
                  this.$selection.on(
                    "keyup.search input.search",
                    ".select2-search--inline",
                    function (n) {
                      if (e && n.type === "input") {
                        u.$selection.off("input.search input.searchcheck");
                        return;
                      }
                      var t = n.which;
                      t != i.SHIFT &&
                        t != i.CTRL &&
                        t != i.ALT &&
                        t != i.TAB &&
                        u.handleSearch(n);
                    }
                  );
                }),
                (r.prototype._transferTabIndex = function () {
                  this.$search.attr(
                    "tabindex",
                    this.$selection.attr("tabindex")
                  );
                  this.$selection.attr("tabindex", "-1");
                }),
                (r.prototype.createPlaceholder = function (n, t) {
                  this.$search.attr("placeholder", t.text);
                }),
                (r.prototype.update = function (n, t) {
                  var i = this.$search[0] == document.activeElement;
                  this.$search.attr("placeholder", "");
                  n.call(this, t);
                  this.$selection
                    .find(".select2-selection__rendered")
                    .append(this.$searchContainer);
                  this.resizeSearch();
                  i && this.$search.focus();
                }),
                (r.prototype.handleSearch = function () {
                  if ((this.resizeSearch(), !this._keyUpPrevented)) {
                    var n = this.$search.val();
                    this.trigger("query", { term: n });
                  }
                  this._keyUpPrevented = !1;
                }),
                (r.prototype.searchRemoveChoice = function (n, t) {
                  this.trigger("unselect", { data: t });
                  this.$search.val(t.text);
                  this.handleSearch();
                }),
                (r.prototype.resizeSearch = function () {
                  var n, t;
                  this.$search.css("width", "25px");
                  n = "";
                  this.$search.attr("placeholder") !== ""
                    ? (n = this.$selection
                        .find(".select2-selection__rendered")
                        .innerWidth())
                    : ((t = this.$search.val().length + 1),
                      (n = t * 0.75 + "em"));
                  this.$search.css("width", n);
                }),
                r
              );
            }
          ),
          t.define("select2/selection/eventRelay", ["jquery"], function (n) {
            function t() {}
            return (
              (t.prototype.bind = function (t, i, r) {
                var u = this,
                  f = [
                    "open",
                    "opening",
                    "close",
                    "closing",
                    "select",
                    "selecting",
                    "unselect",
                    "unselecting",
                  ],
                  e = ["opening", "closing", "selecting", "unselecting"];
                t.call(this, i, r);
                i.on("*", function (t, i) {
                  if (n.inArray(t, f) !== -1) {
                    i = i || {};
                    var r = n.Event("select2:" + t, { params: i });
                    (u.$element.trigger(r), n.inArray(t, e) !== -1) &&
                      (i.prevented = r.isDefaultPrevented());
                  }
                });
              }),
              t
            );
          }),
          t.define(
            "select2/translation",
            ["jquery", "require"],
            function (n, t) {
              function i(n) {
                this.dict = n || {};
              }
              return (
                (i.prototype.all = function () {
                  return this.dict;
                }),
                (i.prototype.get = function (n) {
                  return this.dict[n];
                }),
                (i.prototype.extend = function (t) {
                  this.dict = n.extend({}, t.all(), this.dict);
                }),
                (i._cache = {}),
                (i.loadPath = function (n) {
                  if (!(n in i._cache)) {
                    var r = t(n);
                    i._cache[n] = r;
                  }
                  return new i(i._cache[n]);
                }),
                i
              );
            }
          ),
          t.define("select2/diacritics", [], function () {
            return {
              "Ⓐ": "A",
              Ａ: "A",
              À: "A",
              Á: "A",
              Â: "A",
              Ầ: "A",
              Ấ: "A",
              Ẫ: "A",
              Ẩ: "A",
              Ã: "A",
              Ā: "A",
              Ă: "A",
              Ằ: "A",
              Ắ: "A",
              Ẵ: "A",
              Ẳ: "A",
              Ȧ: "A",
              Ǡ: "A",
              Ä: "A",
              Ǟ: "A",
              Ả: "A",
              Å: "A",
              Ǻ: "A",
              Ǎ: "A",
              Ȁ: "A",
              Ȃ: "A",
              Ạ: "A",
              Ậ: "A",
              Ặ: "A",
              Ḁ: "A",
              Ą: "A",
              Ⱥ: "A",
              Ɐ: "A",
              Ꜳ: "AA",
              Æ: "AE",
              Ǽ: "AE",
              Ǣ: "AE",
              Ꜵ: "AO",
              Ꜷ: "AU",
              Ꜹ: "AV",
              Ꜻ: "AV",
              Ꜽ: "AY",
              "Ⓑ": "B",
              Ｂ: "B",
              Ḃ: "B",
              Ḅ: "B",
              Ḇ: "B",
              Ƀ: "B",
              Ƃ: "B",
              Ɓ: "B",
              "Ⓒ": "C",
              Ｃ: "C",
              Ć: "C",
              Ĉ: "C",
              Ċ: "C",
              Č: "C",
              Ç: "C",
              Ḉ: "C",
              Ƈ: "C",
              Ȼ: "C",
              Ꜿ: "C",
              "Ⓓ": "D",
              Ｄ: "D",
              Ḋ: "D",
              Ď: "D",
              Ḍ: "D",
              Ḑ: "D",
              Ḓ: "D",
              Ḏ: "D",
              Đ: "D",
              Ƌ: "D",
              Ɗ: "D",
              Ɖ: "D",
              Ꝺ: "D",
              Ǳ: "DZ",
              Ǆ: "DZ",
              ǲ: "Dz",
              ǅ: "Dz",
              "Ⓔ": "E",
              Ｅ: "E",
              È: "E",
              É: "E",
              Ê: "E",
              Ề: "E",
              Ế: "E",
              Ễ: "E",
              Ể: "E",
              Ẽ: "E",
              Ē: "E",
              Ḕ: "E",
              Ḗ: "E",
              Ĕ: "E",
              Ė: "E",
              Ë: "E",
              Ẻ: "E",
              Ě: "E",
              Ȅ: "E",
              Ȇ: "E",
              Ẹ: "E",
              Ệ: "E",
              Ȩ: "E",
              Ḝ: "E",
              Ę: "E",
              Ḙ: "E",
              Ḛ: "E",
              Ɛ: "E",
              Ǝ: "E",
              "Ⓕ": "F",
              Ｆ: "F",
              Ḟ: "F",
              Ƒ: "F",
              Ꝼ: "F",
              "Ⓖ": "G",
              Ｇ: "G",
              Ǵ: "G",
              Ĝ: "G",
              Ḡ: "G",
              Ğ: "G",
              Ġ: "G",
              Ǧ: "G",
              Ģ: "G",
              Ǥ: "G",
              Ɠ: "G",
              Ꞡ: "G",
              Ᵹ: "G",
              Ꝿ: "G",
              "Ⓗ": "H",
              Ｈ: "H",
              Ĥ: "H",
              Ḣ: "H",
              Ḧ: "H",
              Ȟ: "H",
              Ḥ: "H",
              Ḩ: "H",
              Ḫ: "H",
              Ħ: "H",
              Ⱨ: "H",
              Ⱶ: "H",
              Ɥ: "H",
              "Ⓘ": "I",
              Ｉ: "I",
              Ì: "I",
              Í: "I",
              Î: "I",
              Ĩ: "I",
              Ī: "I",
              Ĭ: "I",
              İ: "I",
              Ï: "I",
              Ḯ: "I",
              Ỉ: "I",
              Ǐ: "I",
              Ȉ: "I",
              Ȋ: "I",
              Ị: "I",
              Į: "I",
              Ḭ: "I",
              Ɨ: "I",
              "Ⓙ": "J",
              Ｊ: "J",
              Ĵ: "J",
              Ɉ: "J",
              "Ⓚ": "K",
              Ｋ: "K",
              Ḱ: "K",
              Ǩ: "K",
              Ḳ: "K",
              Ķ: "K",
              Ḵ: "K",
              Ƙ: "K",
              Ⱪ: "K",
              Ꝁ: "K",
              Ꝃ: "K",
              Ꝅ: "K",
              Ꞣ: "K",
              "Ⓛ": "L",
              Ｌ: "L",
              Ŀ: "L",
              Ĺ: "L",
              Ľ: "L",
              Ḷ: "L",
              Ḹ: "L",
              Ļ: "L",
              Ḽ: "L",
              Ḻ: "L",
              Ł: "L",
              Ƚ: "L",
              Ɫ: "L",
              Ⱡ: "L",
              Ꝉ: "L",
              Ꝇ: "L",
              Ꞁ: "L",
              Ǉ: "LJ",
              ǈ: "Lj",
              "Ⓜ": "M",
              Ｍ: "M",
              Ḿ: "M",
              Ṁ: "M",
              Ṃ: "M",
              Ɱ: "M",
              Ɯ: "M",
              "Ⓝ": "N",
              Ｎ: "N",
              Ǹ: "N",
              Ń: "N",
              Ñ: "N",
              Ṅ: "N",
              Ň: "N",
              Ṇ: "N",
              Ņ: "N",
              Ṋ: "N",
              Ṉ: "N",
              Ƞ: "N",
              Ɲ: "N",
              Ꞑ: "N",
              Ꞥ: "N",
              Ǌ: "NJ",
              ǋ: "Nj",
              "Ⓞ": "O",
              Ｏ: "O",
              Ò: "O",
              Ó: "O",
              Ô: "O",
              Ồ: "O",
              Ố: "O",
              Ỗ: "O",
              Ổ: "O",
              Õ: "O",
              Ṍ: "O",
              Ȭ: "O",
              Ṏ: "O",
              Ō: "O",
              Ṑ: "O",
              Ṓ: "O",
              Ŏ: "O",
              Ȯ: "O",
              Ȱ: "O",
              Ö: "O",
              Ȫ: "O",
              Ỏ: "O",
              Ő: "O",
              Ǒ: "O",
              Ȍ: "O",
              Ȏ: "O",
              Ơ: "O",
              Ờ: "O",
              Ớ: "O",
              Ỡ: "O",
              Ở: "O",
              Ợ: "O",
              Ọ: "O",
              Ộ: "O",
              Ǫ: "O",
              Ǭ: "O",
              Ø: "O",
              Ǿ: "O",
              Ɔ: "O",
              Ɵ: "O",
              Ꝋ: "O",
              Ꝍ: "O",
              Ƣ: "OI",
              Ꝏ: "OO",
              Ȣ: "OU",
              "Ⓟ": "P",
              Ｐ: "P",
              Ṕ: "P",
              Ṗ: "P",
              Ƥ: "P",
              Ᵽ: "P",
              Ꝑ: "P",
              Ꝓ: "P",
              Ꝕ: "P",
              "Ⓠ": "Q",
              Ｑ: "Q",
              Ꝗ: "Q",
              Ꝙ: "Q",
              Ɋ: "Q",
              "Ⓡ": "R",
              Ｒ: "R",
              Ŕ: "R",
              Ṙ: "R",
              Ř: "R",
              Ȑ: "R",
              Ȓ: "R",
              Ṛ: "R",
              Ṝ: "R",
              Ŗ: "R",
              Ṟ: "R",
              Ɍ: "R",
              Ɽ: "R",
              Ꝛ: "R",
              Ꞧ: "R",
              Ꞃ: "R",
              "Ⓢ": "S",
              Ｓ: "S",
              ẞ: "S",
              Ś: "S",
              Ṥ: "S",
              Ŝ: "S",
              Ṡ: "S",
              Š: "S",
              Ṧ: "S",
              Ṣ: "S",
              Ṩ: "S",
              Ș: "S",
              Ş: "S",
              Ȿ: "S",
              Ꞩ: "S",
              Ꞅ: "S",
              "Ⓣ": "T",
              Ｔ: "T",
              Ṫ: "T",
              Ť: "T",
              Ṭ: "T",
              Ț: "T",
              Ţ: "T",
              Ṱ: "T",
              Ṯ: "T",
              Ŧ: "T",
              Ƭ: "T",
              Ʈ: "T",
              Ⱦ: "T",
              Ꞇ: "T",
              Ꜩ: "TZ",
              "Ⓤ": "U",
              Ｕ: "U",
              Ù: "U",
              Ú: "U",
              Û: "U",
              Ũ: "U",
              Ṹ: "U",
              Ū: "U",
              Ṻ: "U",
              Ŭ: "U",
              Ü: "U",
              Ǜ: "U",
              Ǘ: "U",
              Ǖ: "U",
              Ǚ: "U",
              Ủ: "U",
              Ů: "U",
              Ű: "U",
              Ǔ: "U",
              Ȕ: "U",
              Ȗ: "U",
              Ư: "U",
              Ừ: "U",
              Ứ: "U",
              Ữ: "U",
              Ử: "U",
              Ự: "U",
              Ụ: "U",
              Ṳ: "U",
              Ų: "U",
              Ṷ: "U",
              Ṵ: "U",
              Ʉ: "U",
              "Ⓥ": "V",
              Ｖ: "V",
              Ṽ: "V",
              Ṿ: "V",
              Ʋ: "V",
              Ꝟ: "V",
              Ʌ: "V",
              Ꝡ: "VY",
              "Ⓦ": "W",
              Ｗ: "W",
              Ẁ: "W",
              Ẃ: "W",
              Ŵ: "W",
              Ẇ: "W",
              Ẅ: "W",
              Ẉ: "W",
              Ⱳ: "W",
              "Ⓧ": "X",
              Ｘ: "X",
              Ẋ: "X",
              Ẍ: "X",
              "Ⓨ": "Y",
              Ｙ: "Y",
              Ỳ: "Y",
              Ý: "Y",
              Ŷ: "Y",
              Ỹ: "Y",
              Ȳ: "Y",
              Ẏ: "Y",
              Ÿ: "Y",
              Ỷ: "Y",
              Ỵ: "Y",
              Ƴ: "Y",
              Ɏ: "Y",
              Ỿ: "Y",
              "Ⓩ": "Z",
              Ｚ: "Z",
              Ź: "Z",
              Ẑ: "Z",
              Ż: "Z",
              Ž: "Z",
              Ẓ: "Z",
              Ẕ: "Z",
              Ƶ: "Z",
              Ȥ: "Z",
              Ɀ: "Z",
              Ⱬ: "Z",
              Ꝣ: "Z",
              "ⓐ": "a",
              ａ: "a",
              ẚ: "a",
              à: "a",
              á: "a",
              â: "a",
              ầ: "a",
              ấ: "a",
              ẫ: "a",
              ẩ: "a",
              ã: "a",
              ā: "a",
              ă: "a",
              ằ: "a",
              ắ: "a",
              ẵ: "a",
              ẳ: "a",
              ȧ: "a",
              ǡ: "a",
              ä: "a",
              ǟ: "a",
              ả: "a",
              å: "a",
              ǻ: "a",
              ǎ: "a",
              ȁ: "a",
              ȃ: "a",
              ạ: "a",
              ậ: "a",
              ặ: "a",
              ḁ: "a",
              ą: "a",
              ⱥ: "a",
              ɐ: "a",
              ꜳ: "aa",
              æ: "ae",
              ǽ: "ae",
              ǣ: "ae",
              ꜵ: "ao",
              ꜷ: "au",
              ꜹ: "av",
              ꜻ: "av",
              ꜽ: "ay",
              "ⓑ": "b",
              ｂ: "b",
              ḃ: "b",
              ḅ: "b",
              ḇ: "b",
              ƀ: "b",
              ƃ: "b",
              ɓ: "b",
              "ⓒ": "c",
              ｃ: "c",
              ć: "c",
              ĉ: "c",
              ċ: "c",
              č: "c",
              ç: "c",
              ḉ: "c",
              ƈ: "c",
              ȼ: "c",
              ꜿ: "c",
              ↄ: "c",
              "ⓓ": "d",
              ｄ: "d",
              ḋ: "d",
              ď: "d",
              ḍ: "d",
              ḑ: "d",
              ḓ: "d",
              ḏ: "d",
              đ: "d",
              ƌ: "d",
              ɖ: "d",
              ɗ: "d",
              ꝺ: "d",
              ǳ: "dz",
              ǆ: "dz",
              "ⓔ": "e",
              ｅ: "e",
              è: "e",
              é: "e",
              ê: "e",
              ề: "e",
              ế: "e",
              ễ: "e",
              ể: "e",
              ẽ: "e",
              ē: "e",
              ḕ: "e",
              ḗ: "e",
              ĕ: "e",
              ė: "e",
              ë: "e",
              ẻ: "e",
              ě: "e",
              ȅ: "e",
              ȇ: "e",
              ẹ: "e",
              ệ: "e",
              ȩ: "e",
              ḝ: "e",
              ę: "e",
              ḙ: "e",
              ḛ: "e",
              ɇ: "e",
              ɛ: "e",
              ǝ: "e",
              "ⓕ": "f",
              ｆ: "f",
              ḟ: "f",
              ƒ: "f",
              ꝼ: "f",
              "ⓖ": "g",
              ｇ: "g",
              ǵ: "g",
              ĝ: "g",
              ḡ: "g",
              ğ: "g",
              ġ: "g",
              ǧ: "g",
              ģ: "g",
              ǥ: "g",
              ɠ: "g",
              ꞡ: "g",
              ᵹ: "g",
              ꝿ: "g",
              "ⓗ": "h",
              ｈ: "h",
              ĥ: "h",
              ḣ: "h",
              ḧ: "h",
              ȟ: "h",
              ḥ: "h",
              ḩ: "h",
              ḫ: "h",
              ẖ: "h",
              ħ: "h",
              ⱨ: "h",
              ⱶ: "h",
              ɥ: "h",
              ƕ: "hv",
              "ⓘ": "i",
              ｉ: "i",
              ì: "i",
              í: "i",
              î: "i",
              ĩ: "i",
              ī: "i",
              ĭ: "i",
              ï: "i",
              ḯ: "i",
              ỉ: "i",
              ǐ: "i",
              ȉ: "i",
              ȋ: "i",
              ị: "i",
              į: "i",
              ḭ: "i",
              ɨ: "i",
              ı: "i",
              "ⓙ": "j",
              ｊ: "j",
              ĵ: "j",
              ǰ: "j",
              ɉ: "j",
              "ⓚ": "k",
              ｋ: "k",
              ḱ: "k",
              ǩ: "k",
              ḳ: "k",
              ķ: "k",
              ḵ: "k",
              ƙ: "k",
              ⱪ: "k",
              ꝁ: "k",
              ꝃ: "k",
              ꝅ: "k",
              ꞣ: "k",
              "ⓛ": "l",
              ｌ: "l",
              ŀ: "l",
              ĺ: "l",
              ľ: "l",
              ḷ: "l",
              ḹ: "l",
              ļ: "l",
              ḽ: "l",
              ḻ: "l",
              ſ: "l",
              ł: "l",
              ƚ: "l",
              ɫ: "l",
              ⱡ: "l",
              ꝉ: "l",
              ꞁ: "l",
              ꝇ: "l",
              ǉ: "lj",
              "ⓜ": "m",
              ｍ: "m",
              ḿ: "m",
              ṁ: "m",
              ṃ: "m",
              ɱ: "m",
              ɯ: "m",
              "ⓝ": "n",
              ｎ: "n",
              ǹ: "n",
              ń: "n",
              ñ: "n",
              ṅ: "n",
              ň: "n",
              ṇ: "n",
              ņ: "n",
              ṋ: "n",
              ṉ: "n",
              ƞ: "n",
              ɲ: "n",
              ŉ: "n",
              ꞑ: "n",
              ꞥ: "n",
              ǌ: "nj",
              "ⓞ": "o",
              ｏ: "o",
              ò: "o",
              ó: "o",
              ô: "o",
              ồ: "o",
              ố: "o",
              ỗ: "o",
              ổ: "o",
              õ: "o",
              ṍ: "o",
              ȭ: "o",
              ṏ: "o",
              ō: "o",
              ṑ: "o",
              ṓ: "o",
              ŏ: "o",
              ȯ: "o",
              ȱ: "o",
              ö: "o",
              ȫ: "o",
              ỏ: "o",
              ő: "o",
              ǒ: "o",
              ȍ: "o",
              ȏ: "o",
              ơ: "o",
              ờ: "o",
              ớ: "o",
              ỡ: "o",
              ở: "o",
              ợ: "o",
              ọ: "o",
              ộ: "o",
              ǫ: "o",
              ǭ: "o",
              ø: "o",
              ǿ: "o",
              ɔ: "o",
              ꝋ: "o",
              ꝍ: "o",
              ɵ: "o",
              ƣ: "oi",
              ȣ: "ou",
              ꝏ: "oo",
              "ⓟ": "p",
              ｐ: "p",
              ṕ: "p",
              ṗ: "p",
              ƥ: "p",
              ᵽ: "p",
              ꝑ: "p",
              ꝓ: "p",
              ꝕ: "p",
              "ⓠ": "q",
              ｑ: "q",
              ɋ: "q",
              ꝗ: "q",
              ꝙ: "q",
              "ⓡ": "r",
              ｒ: "r",
              ŕ: "r",
              ṙ: "r",
              ř: "r",
              ȑ: "r",
              ȓ: "r",
              ṛ: "r",
              ṝ: "r",
              ŗ: "r",
              ṟ: "r",
              ɍ: "r",
              ɽ: "r",
              ꝛ: "r",
              ꞧ: "r",
              ꞃ: "r",
              "ⓢ": "s",
              ｓ: "s",
              ß: "s",
              ś: "s",
              ṥ: "s",
              ŝ: "s",
              ṡ: "s",
              š: "s",
              ṧ: "s",
              ṣ: "s",
              ṩ: "s",
              ș: "s",
              ş: "s",
              ȿ: "s",
              ꞩ: "s",
              ꞅ: "s",
              ẛ: "s",
              "ⓣ": "t",
              ｔ: "t",
              ṫ: "t",
              ẗ: "t",
              ť: "t",
              ṭ: "t",
              ț: "t",
              ţ: "t",
              ṱ: "t",
              ṯ: "t",
              ŧ: "t",
              ƭ: "t",
              ʈ: "t",
              ⱦ: "t",
              ꞇ: "t",
              ꜩ: "tz",
              "ⓤ": "u",
              ｕ: "u",
              ù: "u",
              ú: "u",
              û: "u",
              ũ: "u",
              ṹ: "u",
              ū: "u",
              ṻ: "u",
              ŭ: "u",
              ü: "u",
              ǜ: "u",
              ǘ: "u",
              ǖ: "u",
              ǚ: "u",
              ủ: "u",
              ů: "u",
              ű: "u",
              ǔ: "u",
              ȕ: "u",
              ȗ: "u",
              ư: "u",
              ừ: "u",
              ứ: "u",
              ữ: "u",
              ử: "u",
              ự: "u",
              ụ: "u",
              ṳ: "u",
              ų: "u",
              ṷ: "u",
              ṵ: "u",
              ʉ: "u",
              "ⓥ": "v",
              ｖ: "v",
              ṽ: "v",
              ṿ: "v",
              ʋ: "v",
              ꝟ: "v",
              ʌ: "v",
              ꝡ: "vy",
              "ⓦ": "w",
              ｗ: "w",
              ẁ: "w",
              ẃ: "w",
              ŵ: "w",
              ẇ: "w",
              ẅ: "w",
              ẘ: "w",
              ẉ: "w",
              ⱳ: "w",
              "ⓧ": "x",
              ｘ: "x",
              ẋ: "x",
              ẍ: "x",
              "ⓨ": "y",
              ｙ: "y",
              ỳ: "y",
              ý: "y",
              ŷ: "y",
              ỹ: "y",
              ȳ: "y",
              ẏ: "y",
              ÿ: "y",
              ỷ: "y",
              ẙ: "y",
              ỵ: "y",
              ƴ: "y",
              ɏ: "y",
              ỿ: "y",
              "ⓩ": "z",
              ｚ: "z",
              ź: "z",
              ẑ: "z",
              ż: "z",
              ž: "z",
              ẓ: "z",
              ẕ: "z",
              ƶ: "z",
              ȥ: "z",
              ɀ: "z",
              ⱬ: "z",
              ꝣ: "z",
              Ά: "Α",
              Έ: "Ε",
              Ή: "Η",
              Ί: "Ι",
              Ϊ: "Ι",
              Ό: "Ο",
              Ύ: "Υ",
              Ϋ: "Υ",
              Ώ: "Ω",
              ά: "α",
              έ: "ε",
              ή: "η",
              ί: "ι",
              ϊ: "ι",
              ΐ: "ι",
              ό: "ο",
              ύ: "υ",
              ϋ: "υ",
              ΰ: "υ",
              ω: "ω",
              ς: "σ",
            };
          }),
          t.define("select2/data/base", ["../utils"], function (n) {
            function t() {
              t.__super__.constructor.call(this);
            }
            return (
              n.Extend(t, n.Observable),
              (t.prototype.current = function () {
                throw new Error(
                  "The `current` method must be defined in child classes."
                );
              }),
              (t.prototype.query = function () {
                throw new Error(
                  "The `query` method must be defined in child classes."
                );
              }),
              (t.prototype.bind = function () {}),
              (t.prototype.destroy = function () {}),
              (t.prototype.generateResultId = function (t, i) {
                var r = t.id + "-result-";
                return (
                  (r += n.generateChars(4)),
                  r +
                    (i.id != null
                      ? "-" + i.id.toString()
                      : "-" + n.generateChars(4))
                );
              }),
              t
            );
          }),
          t.define(
            "select2/data/select",
            ["./base", "../utils", "jquery"],
            function (n, t, i) {
              function r(n, t) {
                this.$element = n;
                this.options = t;
                r.__super__.constructor.call(this);
              }
              return (
                t.Extend(r, n),
                (r.prototype.current = function (n) {
                  var t = [],
                    r = this;
                  this.$element.find(":selected").each(function () {
                    var n = i(this),
                      u = r.item(n);
                    t.push(u);
                  });
                  n(t);
                }),
                (r.prototype.select = function (n) {
                  var t = this,
                    r;
                  if (((n.selected = !0), i(n.element).is("option"))) {
                    n.element.selected = !0;
                    this.$element.trigger("change");
                    return;
                  }
                  this.$element.prop("multiple")
                    ? this.current(function (r) {
                        var f = [],
                          u,
                          e;
                        for (
                          n = [n], n.push.apply(n, r), u = 0;
                          u < n.length;
                          u++
                        )
                          (e = n[u].id), i.inArray(e, f) === -1 && f.push(e);
                        t.$element.val(f);
                        t.$element.trigger("change");
                      })
                    : ((r = n.id),
                      this.$element.val(r),
                      this.$element.trigger("change"));
                }),
                (r.prototype.unselect = function (n) {
                  var t = this;
                  if (this.$element.prop("multiple")) {
                    if (((n.selected = !1), i(n.element).is("option"))) {
                      n.element.selected = !1;
                      this.$element.trigger("change");
                      return;
                    }
                    this.current(function (r) {
                      for (var u, f = [], e = 0; e < r.length; e++)
                        (u = r[e].id),
                          u !== n.id && i.inArray(u, f) === -1 && f.push(u);
                      t.$element.val(f);
                      t.$element.trigger("change");
                    });
                  }
                }),
                (r.prototype.bind = function (n) {
                  var t = this;
                  this.container = n;
                  n.on("select", function (n) {
                    t.select(n.data);
                  });
                  n.on("unselect", function (n) {
                    t.unselect(n.data);
                  });
                }),
                (r.prototype.destroy = function () {
                  this.$element.find("*").each(function () {
                    i.removeData(this, "data");
                  });
                }),
                (r.prototype.query = function (n, t) {
                  var r = [],
                    u = this,
                    f = this.$element.children();
                  f.each(function () {
                    var t = i(this),
                      e,
                      f;
                    (t.is("option") || t.is("optgroup")) &&
                      ((e = u.item(t)),
                      (f = u.matches(n, e)),
                      f !== null && r.push(f));
                  });
                  t({ results: r });
                }),
                (r.prototype.addOptions = function (n) {
                  t.appendMany(this.$element, n);
                }),
                (r.prototype.option = function (n) {
                  var t, u, r;
                  return (
                    n.children
                      ? ((t = document.createElement("optgroup")),
                        (t.label = n.text))
                      : ((t = document.createElement("option")),
                        t.textContent !== undefined
                          ? (t.textContent = n.text)
                          : (t.innerText = n.text)),
                    n.id && (t.value = n.id),
                    n.disabled && (t.disabled = !0),
                    n.selected && (t.selected = !0),
                    n.title && (t.title = n.title),
                    (u = i(t)),
                    (r = this._normalizeItem(n)),
                    (r.element = t),
                    i.data(t, "data", r),
                    u
                  );
                }),
                (r.prototype.item = function (n) {
                  var t = {},
                    u,
                    f,
                    r,
                    e,
                    o;
                  if (((t = i.data(n[0], "data")), t != null)) return t;
                  if (n.is("option"))
                    t = {
                      id: n.val(),
                      text: n.text(),
                      disabled: n.prop("disabled"),
                      selected: n.prop("selected"),
                      title: n.prop("title"),
                    };
                  else if (n.is("optgroup")) {
                    for (
                      t = {
                        text: n.prop("label"),
                        children: [],
                        title: n.prop("title"),
                      },
                        u = n.children("option"),
                        f = [],
                        r = 0;
                      r < u.length;
                      r++
                    )
                      (e = i(u[r])), (o = this.item(e)), f.push(o);
                    t.children = f;
                  }
                  return (
                    (t = this._normalizeItem(t)),
                    (t.element = n[0]),
                    i.data(n[0], "data", t),
                    t
                  );
                }),
                (r.prototype._normalizeItem = function (n) {
                  return (
                    i.isPlainObject(n) || (n = { id: n, text: n }),
                    (n = i.extend({}, { text: "" }, n)),
                    n.id != null && (n.id = n.id.toString()),
                    n.text != null && (n.text = n.text.toString()),
                    n._resultId == null &&
                      n.id &&
                      this.container != null &&
                      (n._resultId = this.generateResultId(this.container, n)),
                    i.extend({}, { selected: !1, disabled: !1 }, n)
                  );
                }),
                (r.prototype.matches = function (n, t) {
                  var i = this.options.get("matcher");
                  return i(n, t);
                }),
                r
              );
            }
          ),
          t.define(
            "select2/data/array",
            ["./select", "../utils", "jquery"],
            function (n, t, i) {
              function r(n, t) {
                var i = t.get("data") || [];
                r.__super__.constructor.call(this, n, t);
                this.addOptions(this.convertToOptions(i));
              }
              return (
                t.Extend(r, n),
                (r.prototype.select = function (n) {
                  var t = this.$element.find("option").filter(function (t, i) {
                    return i.value == n.id.toString();
                  });
                  t.length === 0 && ((t = this.option(n)), this.addOptions(t));
                  r.__super__.select.call(this, n);
                }),
                (r.prototype.convertToOptions = function (n) {
                  function c(n) {
                    return function () {
                      return i(this).val() == n.id;
                    };
                  }
                  for (
                    var r,
                      u,
                      e,
                      l = this,
                      o = this.$element.find("option"),
                      a = o
                        .map(function () {
                          return l.item(i(this)).id;
                        })
                        .get(),
                      s = [],
                      f = 0;
                    f < n.length;
                    f++
                  ) {
                    if (
                      ((r = this._normalizeItem(n[f])), i.inArray(r.id, a) >= 0)
                    ) {
                      var h = o.filter(c(r)),
                        v = this.item(h),
                        y = i.extend(!0, {}, r, v),
                        p = this.option(y);
                      h.replaceWith(p);
                      continue;
                    }
                    u = this.option(r);
                    r.children &&
                      ((e = this.convertToOptions(r.children)),
                      t.appendMany(u, e));
                    s.push(u);
                  }
                  return s;
                }),
                r
              );
            }
          ),
          t.define(
            "select2/data/ajax",
            ["./array", "../utils", "jquery"],
            function (n, t, i) {
              function r(n, t) {
                this.ajaxOptions = this._applyDefaults(t.get("ajax"));
                this.ajaxOptions.processResults != null &&
                  (this.processResults = this.ajaxOptions.processResults);
                r.__super__.constructor.call(this, n, t);
              }
              return (
                t.Extend(r, n),
                (r.prototype._applyDefaults = function (n) {
                  var t = {
                    data: function (n) {
                      return i.extend({}, n, { q: n.term });
                    },
                    transport: function (n, t, r) {
                      var u = i.ajax(n);
                      return u.then(t), u.fail(r), u;
                    },
                  };
                  return i.extend({}, t, n, !0);
                }),
                (r.prototype.processResults = function (n) {
                  return n;
                }),
                (r.prototype.query = function (n, t) {
                  function f() {
                    var f = r.transport(
                      r,
                      function (r) {
                        var f = u.processResults(r, n);
                        u.options.get("debug") &&
                          window.console &&
                          console.error &&
                          ((f && f.results && i.isArray(f.results)) ||
                            console.error(
                              "Select2: The AJAX results did not return an array in the `results` key of the response."
                            ));
                        t(f);
                      },
                      function () {
                        u.trigger("results:message", {
                          message: "errorLoading",
                        });
                      }
                    );
                    u._request = f;
                  }
                  var u = this,
                    r;
                  this._request != null &&
                    (i.isFunction(this._request.abort) && this._request.abort(),
                    (this._request = null));
                  r = i.extend({ type: "GET" }, this.ajaxOptions);
                  typeof r.url == "function" &&
                    (r.url = r.url.call(this.$element, n));
                  typeof r.data == "function" &&
                    (r.data = r.data.call(this.$element, n));
                  this.ajaxOptions.delay && n.term !== ""
                    ? (this._queryTimeout &&
                        window.clearTimeout(this._queryTimeout),
                      (this._queryTimeout = window.setTimeout(
                        f,
                        this.ajaxOptions.delay
                      )))
                    : f();
                }),
                r
              );
            }
          ),
          t.define("select2/data/tags", ["jquery"], function (n) {
            function t(t, i, r) {
              var f = r.get("tags"),
                o = r.get("createTag"),
                e,
                u;
              if (
                (o !== undefined && (this.createTag = o),
                (e = r.get("insertTag")),
                e !== undefined && (this.insertTag = e),
                t.call(this, i, r),
                n.isArray(f))
              )
                for (u = 0; u < f.length; u++) {
                  var s = f[u],
                    h = this._normalizeItem(s),
                    c = this.option(h);
                  this.$element.append(c);
                }
            }
            return (
              (t.prototype.query = function (n, t, i) {
                function u(n, f) {
                  for (var o, h, e = n.results, s = 0; s < e.length; s++) {
                    var c = e[s],
                      l = c.children != null && !u({ results: c.children }, !0),
                      a = c.text === t.term;
                    if (a || l) {
                      if (f) return !1;
                      n.data = e;
                      i(n);
                      return;
                    }
                  }
                  if (f) return !0;
                  o = r.createTag(t);
                  o != null &&
                    ((h = r.option(o)),
                    h.attr("data-select2-tag", !0),
                    r.addOptions([h]),
                    r.insertTag(e, o));
                  n.results = e;
                  i(n);
                }
                var r = this;
                if ((this._removeOldTags(), t.term == null || t.page != null)) {
                  n.call(this, t, i);
                  return;
                }
                n.call(this, t, u);
              }),
              (t.prototype.createTag = function (t, i) {
                var r = n.trim(i.term);
                return r === "" ? null : { id: r, text: r };
              }),
              (t.prototype.insertTag = function (n, t, i) {
                t.unshift(i);
              }),
              (t.prototype._removeOldTags = function () {
                var i = this._lastTag,
                  t = this.$element.find("option[data-select2-tag]");
                t.each(function () {
                  this.selected || n(this).remove();
                });
              }),
              t
            );
          }),
          t.define("select2/data/tokenizer", ["jquery"], function (n) {
            function t(n, t, i) {
              var r = i.get("tokenizer");
              r !== undefined && (this.tokenizer = r);
              n.call(this, t, i);
            }
            return (
              (t.prototype.bind = function (n, t, i) {
                n.call(this, t, i);
                this.$search =
                  t.dropdown.$search ||
                  t.selection.$search ||
                  i.find(".select2-search__field");
              }),
              (t.prototype.query = function (n, t, i) {
                function u(n) {
                  f.trigger("select", { data: n });
                }
                var f = this,
                  r;
                t.term = t.term || "";
                r = this.tokenizer(t, this.options, u);
                r.term !== t.term &&
                  (this.$search.length &&
                    (this.$search.val(r.term), this.$search.focus()),
                  (t.term = r.term));
                n.call(this, t, i);
              }),
              (t.prototype.tokenizer = function (t, i, r, u) {
                for (
                  var h = r.get("tokenSeparators") || [],
                    e = i.term,
                    f = 0,
                    c =
                      this.createTag ||
                      function (n) {
                        return { id: n.term, text: n.term };
                      },
                    o;
                  f < e.length;

                ) {
                  if (((o = e[f]), n.inArray(o, h) === -1)) {
                    f++;
                    continue;
                  }
                  var l = e.substr(0, f),
                    a = n.extend({}, i, { term: l }),
                    s = c(a);
                  if (s == null) {
                    f++;
                    continue;
                  }
                  u(s);
                  e = e.substr(f + 1) || "";
                  f = 0;
                }
                return { term: e };
              }),
              t
            );
          }),
          t.define("select2/data/minimumInputLength", [], function () {
            function n(n, t, i) {
              this.minimumInputLength = i.get("minimumInputLength");
              n.call(this, t, i);
            }
            return (
              (n.prototype.query = function (n, t, i) {
                if (
                  ((t.term = t.term || ""),
                  t.term.length < this.minimumInputLength)
                ) {
                  this.trigger("results:message", {
                    message: "inputTooShort",
                    args: {
                      minimum: this.minimumInputLength,
                      input: t.term,
                      params: t,
                    },
                  });
                  return;
                }
                n.call(this, t, i);
              }),
              n
            );
          }),
          t.define("select2/data/maximumInputLength", [], function () {
            function n(n, t, i) {
              this.maximumInputLength = i.get("maximumInputLength");
              n.call(this, t, i);
            }
            return (
              (n.prototype.query = function (n, t, i) {
                if (
                  ((t.term = t.term || ""),
                  this.maximumInputLength > 0 &&
                    t.term.length > this.maximumInputLength)
                ) {
                  this.trigger("results:message", {
                    message: "inputTooLong",
                    args: {
                      maximum: this.maximumInputLength,
                      input: t.term,
                      params: t,
                    },
                  });
                  return;
                }
                n.call(this, t, i);
              }),
              n
            );
          }),
          t.define("select2/data/maximumSelectionLength", [], function () {
            function n(n, t, i) {
              this.maximumSelectionLength = i.get("maximumSelectionLength");
              n.call(this, t, i);
            }
            return (
              (n.prototype.query = function (n, t, i) {
                var r = this;
                this.current(function (u) {
                  var f = u != null ? u.length : 0;
                  if (
                    r.maximumSelectionLength > 0 &&
                    f >= r.maximumSelectionLength
                  ) {
                    r.trigger("results:message", {
                      message: "maximumSelected",
                      args: { maximum: r.maximumSelectionLength },
                    });
                    return;
                  }
                  n.call(r, t, i);
                });
              }),
              n
            );
          }),
          t.define("select2/dropdown", ["jquery", "./utils"], function (n, t) {
            function i(n, t) {
              this.$element = n;
              this.options = t;
              i.__super__.constructor.call(this);
            }
            return (
              t.Extend(i, t.Observable),
              (i.prototype.render = function () {
                var t = n(
                  '<span class="select2-dropdown"><span class="select2-results"></span></span>'
                );
                return (
                  t.attr("dir", this.options.get("dir")),
                  (this.$dropdown = t),
                  t
                );
              }),
              (i.prototype.bind = function () {}),
              (i.prototype.position = function () {}),
              (i.prototype.destroy = function () {
                this.$dropdown.remove();
              }),
              i
            );
          }),
          t.define(
            "select2/dropdown/search",
            ["jquery", "../utils"],
            function (n) {
              function t() {}
              return (
                (t.prototype.render = function (t) {
                  var r = t.call(this),
                    i = n(
                      '<span class="select2-search select2-search--dropdown"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox" /></span>'
                    );
                  return (
                    (this.$searchContainer = i),
                    (this.$search = i.find("input")),
                    r.prepend(i),
                    r
                  );
                }),
                (t.prototype.bind = function (t, i, r) {
                  var u = this;
                  t.call(this, i, r);
                  this.$search.on("keydown", function (n) {
                    u.trigger("keypress", n);
                    u._keyUpPrevented = n.isDefaultPrevented();
                  });
                  this.$search.on("input", function () {
                    n(this).off("keyup");
                  });
                  this.$search.on("keyup input", function (n) {
                    u.handleSearch(n);
                  });
                  i.on("open", function () {
                    u.$search.attr("tabindex", 0);
                    u.$search.focus();
                    window.setTimeout(function () {
                      u.$search.focus();
                    }, 0);
                  });
                  i.on("close", function () {
                    u.$search.attr("tabindex", -1);
                    u.$search.val("");
                  });
                  i.on("results:all", function (n) {
                    if (n.query.term == null || n.query.term === "") {
                      var t = u.showSearch(n);
                      t
                        ? u.$searchContainer.removeClass("select2-search--hide")
                        : u.$searchContainer.addClass("select2-search--hide");
                    }
                  });
                }),
                (t.prototype.handleSearch = function () {
                  if (!this._keyUpPrevented) {
                    var n = this.$search.val();
                    this.trigger("query", { term: n });
                  }
                  this._keyUpPrevented = !1;
                }),
                (t.prototype.showSearch = function () {
                  return !0;
                }),
                t
              );
            }
          ),
          t.define("select2/dropdown/hidePlaceholder", [], function () {
            function n(n, t, i, r) {
              this.placeholder = this.normalizePlaceholder(
                i.get("placeholder")
              );
              n.call(this, t, i, r);
            }
            return (
              (n.prototype.append = function (n, t) {
                t.results = this.removePlaceholder(t.results);
                n.call(this, t);
              }),
              (n.prototype.normalizePlaceholder = function (n, t) {
                return typeof t == "string" && (t = { id: "", text: t }), t;
              }),
              (n.prototype.removePlaceholder = function (n, t) {
                for (var r, u = t.slice(0), i = t.length - 1; i >= 0; i--)
                  (r = t[i]), this.placeholder.id === r.id && u.splice(i, 1);
                return u;
              }),
              n
            );
          }),
          t.define("select2/dropdown/infiniteScroll", ["jquery"], function (n) {
            function t(n, t, i, r) {
              this.lastParams = {};
              n.call(this, t, i, r);
              this.$loadingMore = this.createLoadingMore();
              this.loading = !1;
            }
            return (
              (t.prototype.append = function (n, t) {
                this.$loadingMore.remove();
                this.loading = !1;
                n.call(this, t);
                this.showLoadingMore(t) &&
                  this.$results.append(this.$loadingMore);
              }),
              (t.prototype.bind = function (t, i, r) {
                var u = this;
                t.call(this, i, r);
                i.on("query", function (n) {
                  u.lastParams = n;
                  u.loading = !0;
                });
                i.on("query:append", function (n) {
                  u.lastParams = n;
                  u.loading = !0;
                });
                this.$results.on("scroll", function () {
                  var r = n.contains(
                      document.documentElement,
                      u.$loadingMore[0]
                    ),
                    t,
                    i;
                  !u.loading &&
                    r &&
                    ((t = u.$results.offset().top + u.$results.outerHeight(!1)),
                    (i =
                      u.$loadingMore.offset().top +
                      u.$loadingMore.outerHeight(!1)),
                    t + 50 >= i && u.loadMore());
                });
              }),
              (t.prototype.loadMore = function () {
                this.loading = !0;
                var t = n.extend({}, { page: 1 }, this.lastParams);
                t.page++;
                this.trigger("query:append", t);
              }),
              (t.prototype.showLoadingMore = function (n, t) {
                return t.pagination && t.pagination.more;
              }),
              (t.prototype.createLoadingMore = function () {
                var t = n(
                    '<li class="select2-results__option select2-results__option--load-more"role="treeitem" aria-disabled="true"></li>'
                  ),
                  i = this.options.get("translations").get("loadingMore");
                return t.html(i(this.lastParams)), t;
              }),
              t
            );
          }),
          t.define(
            "select2/dropdown/attachBody",
            ["jquery", "../utils"],
            function (n, t) {
              function i(t, i, r) {
                this.$dropdownParent =
                  r.get("dropdownParent") || n(document.body);
                t.call(this, i, r);
              }
              return (
                (i.prototype.bind = function (n, t, i) {
                  var r = this,
                    u = !1;
                  n.call(this, t, i);
                  t.on("open", function () {
                    if (
                      (r._showDropdown(), r._attachPositioningHandler(t), !u)
                    ) {
                      u = !0;
                      t.on("results:all", function () {
                        r._positionDropdown();
                        r._resizeDropdown();
                      });
                      t.on("results:append", function () {
                        r._positionDropdown();
                        r._resizeDropdown();
                      });
                    }
                  });
                  t.on("close", function () {
                    r._hideDropdown();
                    r._detachPositioningHandler(t);
                  });
                  this.$dropdownContainer.on("mousedown", function (n) {
                    n.stopPropagation();
                  });
                }),
                (i.prototype.destroy = function (n) {
                  n.call(this);
                  this.$dropdownContainer.remove();
                }),
                (i.prototype.position = function (n, t, i) {
                  t.attr("class", i.attr("class"));
                  t.removeClass("select2");
                  t.addClass("select2-container--open");
                  t.css({ position: "absolute", top: -999999 });
                  this.$container = i;
                }),
                (i.prototype.render = function (t) {
                  var i = n("<span></span>"),
                    r = t.call(this);
                  return i.append(r), (this.$dropdownContainer = i), i;
                }),
                (i.prototype._hideDropdown = function () {
                  this.$dropdownContainer.detach();
                }),
                (i.prototype._attachPositioningHandler = function (i, r) {
                  var u = this,
                    f = "scroll.select2." + r.id,
                    o = "resize.select2." + r.id,
                    s = "orientationchange.select2." + r.id,
                    e = this.$container.parents().filter(t.hasScroll);
                  e.each(function () {
                    n(this).data("select2-scroll-position", {
                      x: n(this).scrollLeft(),
                      y: n(this).scrollTop(),
                    });
                  });
                  e.on(f, function () {
                    var t = n(this).data("select2-scroll-position");
                    n(this).scrollTop(t.y);
                  });
                  n(window).on(f + " " + o + " " + s, function () {
                    u._positionDropdown();
                    u._resizeDropdown();
                  });
                }),
                (i.prototype._detachPositioningHandler = function (i, r) {
                  var u = "scroll.select2." + r.id,
                    f = "resize.select2." + r.id,
                    e = "orientationchange.select2." + r.id,
                    o = this.$container.parents().filter(t.hasScroll);
                  o.off(u);
                  n(window).off(u + " " + f + " " + e);
                }),
                (i.prototype._positionDropdown = function () {
                  var o = n(window),
                    u = this.$dropdown.hasClass("select2-dropdown--above"),
                    v = this.$dropdown.hasClass("select2-dropdown--below"),
                    t = null,
                    i = this.$container.offset(),
                    r,
                    s;
                  i.bottom = i.top + this.$container.outerHeight(!1);
                  r = { height: this.$container.outerHeight(!1) };
                  r.top = i.top;
                  r.bottom = i.top + r.height;
                  var h = { height: this.$dropdown.outerHeight(!1) },
                    c = {
                      top: o.scrollTop(),
                      bottom: o.scrollTop() + o.height(),
                    },
                    l = c.top < i.top - h.height,
                    a = c.bottom > i.bottom + h.height,
                    f = { left: i.left, top: r.bottom },
                    e = this.$dropdownParent;
                  e.css("position") === "static" && (e = e.offsetParent());
                  s = e.offset();
                  f.top -= s.top;
                  f.left -= s.left;
                  u || v || (t = "below");
                  a || !l || u ? !l && a && u && (t = "below") : (t = "above");
                  (t == "above" || (u && t !== "below")) &&
                    (f.top = r.top - h.height);
                  t != null &&
                    (this.$dropdown
                      .removeClass(
                        "select2-dropdown--below select2-dropdown--above"
                      )
                      .addClass("select2-dropdown--" + t),
                    this.$container
                      .removeClass(
                        "select2-container--below select2-container--above"
                      )
                      .addClass("select2-container--" + t));
                  this.$dropdownContainer.css(f);
                }),
                (i.prototype._resizeDropdown = function () {
                  var n = { width: this.$container.outerWidth(!1) + "px" };
                  this.options.get("dropdownAutoWidth") &&
                    ((n.minWidth = n.width), (n.width = "auto"));
                  this.$dropdown.css(n);
                }),
                (i.prototype._showDropdown = function () {
                  this.$dropdownContainer.appendTo(this.$dropdownParent);
                  this._positionDropdown();
                  this._resizeDropdown();
                }),
                i
              );
            }
          ),
          t.define("select2/dropdown/minimumResultsForSearch", [], function () {
            function n(t) {
              for (var i, r = 0, u = 0; u < t.length; u++)
                (i = t[u]), i.children ? (r += n(i.children)) : r++;
              return r;
            }
            function t(n, t, i, r) {
              this.minimumResultsForSearch = i.get("minimumResultsForSearch");
              this.minimumResultsForSearch < 0 &&
                (this.minimumResultsForSearch = Infinity);
              n.call(this, t, i, r);
            }
            return (
              (t.prototype.showSearch = function (t, i) {
                return n(i.data.results) < this.minimumResultsForSearch
                  ? !1
                  : t.call(this, i);
              }),
              t
            );
          }),
          t.define("select2/dropdown/selectOnClose", [], function () {
            function n() {}
            return (
              (n.prototype.bind = function (n, t, i) {
                var r = this;
                n.call(this, t, i);
                t.on("close", function () {
                  r._handleSelectOnClose();
                });
              }),
              (n.prototype._handleSelectOnClose = function () {
                var t = this.getHighlightedResults(),
                  n;
                t.length < 1 ||
                  ((n = t.data("data")),
                  (n.element != null && n.element.selected) ||
                    (n.element == null && n.selected)) ||
                  this.trigger("select", { data: n });
              }),
              n
            );
          }),
          t.define("select2/dropdown/closeOnSelect", [], function () {
            function n() {}
            return (
              (n.prototype.bind = function (n, t, i) {
                var r = this;
                n.call(this, t, i);
                t.on("select", function (n) {
                  r._selectTriggered(n);
                });
                t.on("unselect", function (n) {
                  r._selectTriggered(n);
                });
              }),
              (n.prototype._selectTriggered = function (n, t) {
                var i = t.originalEvent;
                (i && i.ctrlKey) || this.trigger("close", {});
              }),
              n
            );
          }),
          t.define("select2/i18n/en", [], function () {
            return {
              errorLoading: function () {
                return "The results could not be loaded.";
              },
              inputTooLong: function (n) {
                var t = n.input.length - n.maximum,
                  i = "Please delete " + t + " character";
                return t != 1 && (i += "s"), i;
              },
              inputTooShort: function (n) {
                var t = n.minimum - n.input.length;
                return "Please enter " + t + " or more characters";
              },
              loadingMore: function () {
                return "Loading more results…";
              },
              maximumSelected: function (n) {
                var t = "You can only select " + n.maximum + " item";
                return n.maximum != 1 && (t += "s"), t;
              },
              noResults: function () {
                return "No results found";
              },
              searching: function () {
                return "Searching…";
              },
            };
          }),
          t.define(
            "select2/defaults",
            [
              "jquery",
              "require",
              "./results",
              "./selection/single",
              "./selection/multiple",
              "./selection/placeholder",
              "./selection/allowClear",
              "./selection/search",
              "./selection/eventRelay",
              "./utils",
              "./translation",
              "./diacritics",
              "./data/select",
              "./data/array",
              "./data/ajax",
              "./data/tags",
              "./data/tokenizer",
              "./data/minimumInputLength",
              "./data/maximumInputLength",
              "./data/maximumSelectionLength",
              "./dropdown",
              "./dropdown/search",
              "./dropdown/hidePlaceholder",
              "./dropdown/infiniteScroll",
              "./dropdown/attachBody",
              "./dropdown/minimumResultsForSearch",
              "./dropdown/selectOnClose",
              "./dropdown/closeOnSelect",
              "./i18n/en",
            ],
            function (
              n,
              t,
              i,
              r,
              u,
              f,
              e,
              o,
              s,
              h,
              c,
              l,
              a,
              v,
              y,
              p,
              w,
              b,
              k,
              d,
              g,
              nt,
              tt,
              it,
              rt,
              ut,
              ft,
              et,
              ot
            ) {
              function st() {
                this.reset();
              }
              return (
                (st.prototype.apply = function (l) {
                  var vt, yt, pt, wt, bt, kt, dt, ct, lt, st, ot, ht, gt, at;
                  if (
                    ((l = n.extend(!0, {}, this.defaults, l)),
                    l.dataAdapter == null &&
                      ((l.dataAdapter =
                        l.ajax != null ? y : l.data != null ? v : a),
                      l.minimumInputLength > 0 &&
                        (l.dataAdapter = h.Decorate(l.dataAdapter, b)),
                      l.maximumInputLength > 0 &&
                        (l.dataAdapter = h.Decorate(l.dataAdapter, k)),
                      l.maximumSelectionLength > 0 &&
                        (l.dataAdapter = h.Decorate(l.dataAdapter, d)),
                      l.tags && (l.dataAdapter = h.Decorate(l.dataAdapter, p)),
                      (l.tokenSeparators != null || l.tokenizer != null) &&
                        (l.dataAdapter = h.Decorate(l.dataAdapter, w)),
                      l.query != null &&
                        ((vt = t(l.amdBase + "compat/query")),
                        (l.dataAdapter = h.Decorate(l.dataAdapter, vt))),
                      l.initSelection != null &&
                        ((yt = t(l.amdBase + "compat/initSelection")),
                        (l.dataAdapter = h.Decorate(l.dataAdapter, yt)))),
                    l.resultsAdapter == null &&
                      ((l.resultsAdapter = i),
                      l.ajax != null &&
                        (l.resultsAdapter = h.Decorate(l.resultsAdapter, it)),
                      l.placeholder != null &&
                        (l.resultsAdapter = h.Decorate(l.resultsAdapter, tt)),
                      l.selectOnClose &&
                        (l.resultsAdapter = h.Decorate(l.resultsAdapter, ft))),
                    l.dropdownAdapter == null &&
                      (l.multiple
                        ? (l.dropdownAdapter = g)
                        : ((pt = h.Decorate(g, nt)), (l.dropdownAdapter = pt)),
                      l.minimumResultsForSearch !== 0 &&
                        (l.dropdownAdapter = h.Decorate(l.dropdownAdapter, ut)),
                      l.closeOnSelect &&
                        (l.dropdownAdapter = h.Decorate(l.dropdownAdapter, et)),
                      (l.dropdownCssClass != null ||
                        l.dropdownCss != null ||
                        l.adaptDropdownCssClass != null) &&
                        ((wt = t(l.amdBase + "compat/dropdownCss")),
                        (l.dropdownAdapter = h.Decorate(
                          l.dropdownAdapter,
                          wt
                        ))),
                      (l.dropdownAdapter = h.Decorate(l.dropdownAdapter, rt))),
                    l.selectionAdapter == null &&
                      ((l.selectionAdapter = l.multiple ? u : r),
                      l.placeholder != null &&
                        (l.selectionAdapter = h.Decorate(
                          l.selectionAdapter,
                          f
                        )),
                      l.allowClear &&
                        (l.selectionAdapter = h.Decorate(
                          l.selectionAdapter,
                          e
                        )),
                      l.multiple &&
                        (l.selectionAdapter = h.Decorate(
                          l.selectionAdapter,
                          o
                        )),
                      (l.containerCssClass != null ||
                        l.containerCss != null ||
                        l.adaptContainerCssClass != null) &&
                        ((bt = t(l.amdBase + "compat/containerCss")),
                        (l.selectionAdapter = h.Decorate(
                          l.selectionAdapter,
                          bt
                        ))),
                      (l.selectionAdapter = h.Decorate(l.selectionAdapter, s))),
                    typeof l.language == "string" &&
                      (l.language.indexOf("-") > 0
                        ? ((kt = l.language.split("-")),
                          (dt = kt[0]),
                          (l.language = [l.language, dt]))
                        : (l.language = [l.language])),
                    n.isArray(l.language))
                  ) {
                    for (
                      ct = new c(),
                        l.language.push("en"),
                        lt = l.language,
                        st = 0;
                      st < lt.length;
                      st++
                    ) {
                      ot = lt[st];
                      ht = {};
                      try {
                        ht = c.loadPath(ot);
                      } catch (ni) {
                        try {
                          ot = this.defaults.amdLanguageBase + ot;
                          ht = c.loadPath(ot);
                        } catch (ti) {
                          l.debug &&
                            window.console &&
                            console.warn &&
                            console.warn(
                              'Select2: The language file for "' +
                                ot +
                                '" could not be automatically loaded. A fallback will be used instead.'
                            );
                          continue;
                        }
                      }
                      ct.extend(ht);
                    }
                    l.translations = ct;
                  } else
                    (gt = c.loadPath(this.defaults.amdLanguageBase + "en")),
                      (at = new c(l.language)),
                      at.extend(gt),
                      (l.translations = at);
                  return l;
                }),
                (st.prototype.reset = function () {
                  function i(n) {
                    function t(n) {
                      return l[n] || n;
                    }
                    return n.replace(/[^\u0000-\u007E]/g, t);
                  }
                  function t(r, u) {
                    var f, e, o, s, h, c;
                    if (n.trim(r.term) === "") return u;
                    if (u.children && u.children.length > 0) {
                      for (
                        f = n.extend(!0, {}, u), e = u.children.length - 1;
                        e >= 0;
                        e--
                      )
                        (o = u.children[e]),
                          (s = t(r, o)),
                          s == null && f.children.splice(e, 1);
                      return f.children.length > 0 ? f : t(r, f);
                    }
                    return ((h = i(u.text).toUpperCase()),
                    (c = i(r.term).toUpperCase()),
                    h.indexOf(c) > -1)
                      ? u
                      : null;
                  }
                  this.defaults = {
                    amdBase: "./",
                    amdLanguageBase: "./i18n/",
                    closeOnSelect: !0,
                    debug: !1,
                    dropdownAutoWidth: !1,
                    escapeMarkup: h.escapeMarkup,
                    language: ot,
                    matcher: t,
                    minimumInputLength: 0,
                    maximumInputLength: 0,
                    maximumSelectionLength: 0,
                    minimumResultsForSearch: 0,
                    selectOnClose: !1,
                    sorter: function (n) {
                      return n;
                    },
                    templateResult: function (n) {
                      return n.text;
                    },
                    templateSelection: function (n) {
                      return n.text;
                    },
                    theme: "default",
                    width: "resolve",
                  };
                }),
                (st.prototype.set = function (t, i) {
                  var f = n.camelCase(t),
                    r = {},
                    u;
                  r[f] = i;
                  u = h._convertData(r);
                  n.extend(this.defaults, u);
                }),
                new st()
              );
            }
          ),
          t.define(
            "select2/options",
            ["require", "jquery", "./defaults", "./utils"],
            function (n, t, i, r) {
              function u(t, u) {
                if (
                  ((this.options = t),
                  u != null && this.fromElement(u),
                  (this.options = i.apply(this.options)),
                  u && u.is("input"))
                ) {
                  var f = n(this.get("amdBase") + "compat/inputData");
                  this.options.dataAdapter = r.Decorate(
                    this.options.dataAdapter,
                    f
                  );
                }
              }
              return (
                (u.prototype.fromElement = function (n) {
                  var e = ["select2"],
                    f,
                    u,
                    i;
                  this.options.multiple == null &&
                    (this.options.multiple = n.prop("multiple"));
                  this.options.disabled == null &&
                    (this.options.disabled = n.prop("disabled"));
                  this.options.language == null &&
                    (n.prop("lang")
                      ? (this.options.language = n.prop("lang").toLowerCase())
                      : n.closest("[lang]").prop("lang") &&
                        (this.options.language = n
                          .closest("[lang]")
                          .prop("lang")));
                  this.options.dir == null &&
                    (this.options.dir = n.prop("dir")
                      ? n.prop("dir")
                      : n.closest("[dir]").prop("dir")
                      ? n.closest("[dir]").prop("dir")
                      : "ltr");
                  n.prop("disabled", this.options.disabled);
                  n.prop("multiple", this.options.multiple);
                  n.data("select2Tags") &&
                    (this.options.debug &&
                      window.console &&
                      console.warn &&
                      console.warn(
                        'Select2: The `data-select2-tags` attribute has been changed to use the `data-data` and `data-tags="true"` attributes and will be removed in future versions of Select2.'
                      ),
                    n.data("data", n.data("select2Tags")),
                    n.data("tags", !0));
                  n.data("ajaxUrl") &&
                    (this.options.debug &&
                      window.console &&
                      console.warn &&
                      console.warn(
                        "Select2: The `data-ajax-url` attribute has been changed to `data-ajax--url` and support for the old attribute will be removed in future versions of Select2."
                      ),
                    n.attr("ajax--url", n.data("ajaxUrl")),
                    n.data("ajax--url", n.data("ajaxUrl")));
                  f = {};
                  f =
                    t.fn.jquery &&
                    t.fn.jquery.substr(0, 2) == "1." &&
                    n[0].dataset
                      ? t.extend(!0, {}, n[0].dataset, n.data())
                      : n.data();
                  u = t.extend(!0, {}, f);
                  u = r._convertData(u);
                  for (i in u)
                    t.inArray(i, e) > -1 ||
                      (t.isPlainObject(this.options[i])
                        ? t.extend(this.options[i], u[i])
                        : (this.options[i] = u[i]));
                  return this;
                }),
                (u.prototype.get = function (n) {
                  return this.options[n];
                }),
                (u.prototype.set = function (n, t) {
                  this.options[n] = t;
                }),
                u
              );
            }
          ),
          t.define(
            "select2/core",
            ["jquery", "./options", "./utils", "./keys"],
            function (n, t, i, r) {
              var u = function (n, i) {
                var f, e, r, o, s, h, c;
                n.data("select2") != null && n.data("select2").destroy();
                this.$element = n;
                this.id = this._generateId(n);
                i = i || {};
                this.options = new t(i, n);
                u.__super__.constructor.call(this);
                f = n.attr("tabindex") || 0;
                n.data("old-tabindex", f);
                n.attr("tabindex", "-1");
                e = this.options.get("dataAdapter");
                this.dataAdapter = new e(n, this.options);
                r = this.render();
                this._placeContainer(r);
                o = this.options.get("selectionAdapter");
                this.selection = new o(n, this.options);
                this.$selection = this.selection.render();
                this.selection.position(this.$selection, r);
                s = this.options.get("dropdownAdapter");
                this.dropdown = new s(n, this.options);
                this.$dropdown = this.dropdown.render();
                this.dropdown.position(this.$dropdown, r);
                h = this.options.get("resultsAdapter");
                this.results = new h(n, this.options, this.dataAdapter);
                this.$results = this.results.render();
                this.results.position(this.$results, this.$dropdown);
                c = this;
                this._bindAdapters();
                this._registerDomEvents();
                this._registerDataEvents();
                this._registerSelectionEvents();
                this._registerDropdownEvents();
                this._registerResultsEvents();
                this._registerEvents();
                this.dataAdapter.current(function (n) {
                  c.trigger("selection:update", { data: n });
                });
                n.addClass("select2-hidden-accessible");
                n.attr("aria-hidden", "true");
                this._syncAttributes();
                n.data("select2", this);
              };
              return (
                i.Extend(u, i.Observable),
                (u.prototype._generateId = function (n) {
                  var t = "";
                  return (
                    (t =
                      n.attr("id") != null
                        ? n.attr("id")
                        : n.attr("name") != null
                        ? n.attr("name") + "-" + i.generateChars(2)
                        : i.generateChars(4)),
                    (t = t.replace(/(:|\.|\[|\]|,)/g, "")),
                    "select2-" + t
                  );
                }),
                (u.prototype._placeContainer = function (n) {
                  n.insertAfter(this.$element);
                  var t = this._resolveWidth(
                    this.$element,
                    this.options.get("width")
                  );
                  t != null && n.css("width", t);
                }),
                (u.prototype._resolveWidth = function (n, t) {
                  var u, f, e, o, i, s, h, r;
                  if (t == "resolve")
                    return ((u = this._resolveWidth(n, "style")), u != null)
                      ? u
                      : this._resolveWidth(n, "element");
                  if (t == "element")
                    return ((f = n.outerWidth(!1)), f <= 0) ? "auto" : f + "px";
                  if (t == "style") {
                    if (((e = n.attr("style")), typeof e != "string"))
                      return null;
                    for (
                      o = e.split(";"), i = 0, s = o.length;
                      i < s;
                      i = i + 1
                    )
                      if (
                        ((h = o[i].replace(/\s/g, "")),
                        (r = h.match(
                          /^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i
                        )),
                        r !== null && r.length >= 1)
                      )
                        return r[1];
                    return null;
                  }
                  return t;
                }),
                (u.prototype._bindAdapters = function () {
                  this.dataAdapter.bind(this, this.$container);
                  this.selection.bind(this, this.$container);
                  this.dropdown.bind(this, this.$container);
                  this.results.bind(this, this.$container);
                }),
                (u.prototype._registerDomEvents = function () {
                  var t = this,
                    r;
                  this.$element.on("change.select2", function () {
                    t.dataAdapter.current(function (n) {
                      t.trigger("selection:update", { data: n });
                    });
                  });
                  this._sync = i.bind(this._syncAttributes, this);
                  this.$element[0].attachEvent &&
                    this.$element[0].attachEvent(
                      "onpropertychange",
                      this._sync
                    );
                  r =
                    window.MutationObserver ||
                    window.WebKitMutationObserver ||
                    window.MozMutationObserver;
                  r != null
                    ? ((this._observer = new r(function (i) {
                        n.each(i, t._sync);
                      })),
                      this._observer.observe(this.$element[0], {
                        attributes: !0,
                        subtree: !1,
                      }))
                    : this.$element[0].addEventListener &&
                      this.$element[0].addEventListener(
                        "DOMAttrModified",
                        t._sync,
                        !1
                      );
                }),
                (u.prototype._registerDataEvents = function () {
                  var n = this;
                  this.dataAdapter.on("*", function (t, i) {
                    n.trigger(t, i);
                  });
                }),
                (u.prototype._registerSelectionEvents = function () {
                  var t = this,
                    i = ["toggle", "focus"];
                  this.selection.on("toggle", function () {
                    t.toggleDropdown();
                  });
                  this.selection.on("focus", function (n) {
                    t.focus(n);
                  });
                  this.selection.on("*", function (r, u) {
                    n.inArray(r, i) === -1 && t.trigger(r, u);
                  });
                }),
                (u.prototype._registerDropdownEvents = function () {
                  var n = this;
                  this.dropdown.on("*", function (t, i) {
                    n.trigger(t, i);
                  });
                }),
                (u.prototype._registerResultsEvents = function () {
                  var n = this;
                  this.results.on("*", function (t, i) {
                    n.trigger(t, i);
                  });
                }),
                (u.prototype._registerEvents = function () {
                  var n = this;
                  this.on("open", function () {
                    n.$container.addClass("select2-container--open");
                  });
                  this.on("close", function () {
                    n.$container.removeClass("select2-container--open");
                  });
                  this.on("enable", function () {
                    n.$container.removeClass("select2-container--disabled");
                  });
                  this.on("disable", function () {
                    n.$container.addClass("select2-container--disabled");
                  });
                  this.on("blur", function () {
                    n.$container.removeClass("select2-container--focus");
                  });
                  this.on("query", function (t) {
                    n.isOpen() || n.trigger("open", {});
                    this.dataAdapter.query(t, function (i) {
                      n.trigger("results:all", { data: i, query: t });
                    });
                  });
                  this.on("query:append", function (t) {
                    this.dataAdapter.query(t, function (i) {
                      n.trigger("results:append", { data: i, query: t });
                    });
                  });
                  this.on("keypress", function (t) {
                    var i = t.which;
                    n.isOpen()
                      ? i === r.ESC || i === r.TAB || (i === r.UP && t.altKey)
                        ? (n.close(), t.preventDefault())
                        : i === r.ENTER
                        ? (n.trigger("results:select", {}), t.preventDefault())
                        : i === r.SPACE && t.ctrlKey
                        ? (n.trigger("results:toggle", {}), t.preventDefault())
                        : i === r.UP
                        ? (n.trigger("results:previous", {}),
                          t.preventDefault())
                        : i === r.DOWN &&
                          (n.trigger("results:next", {}), t.preventDefault())
                      : (i === r.ENTER ||
                          i === r.SPACE ||
                          (i === r.DOWN && t.altKey)) &&
                        (n.open(), t.preventDefault());
                  });
                }),
                (u.prototype._syncAttributes = function () {
                  this.options.set("disabled", this.$element.prop("disabled"));
                  this.options.get("disabled")
                    ? (this.isOpen() && this.close(),
                      this.trigger("disable", {}))
                    : this.trigger("enable", {});
                }),
                (u.prototype.trigger = function (n, t) {
                  var r = u.__super__.trigger,
                    f = {
                      open: "opening",
                      close: "closing",
                      select: "selecting",
                      unselect: "unselecting",
                    },
                    e,
                    i;
                  if (
                    (t === undefined && (t = {}),
                    n in f &&
                      ((e = f[n]),
                      (i = { prevented: !1, name: n, args: t }),
                      r.call(this, e, i),
                      i.prevented))
                  ) {
                    t.prevented = !0;
                    return;
                  }
                  r.call(this, n, t);
                }),
                (u.prototype.toggleDropdown = function () {
                  this.options.get("disabled") ||
                    (this.isOpen() ? this.close() : this.open());
                }),
                (u.prototype.open = function () {
                  this.isOpen() || this.trigger("query", {});
                }),
                (u.prototype.close = function () {
                  this.isOpen() && this.trigger("close", {});
                }),
                (u.prototype.isOpen = function () {
                  return this.$container.hasClass("select2-container--open");
                }),
                (u.prototype.hasFocus = function () {
                  return this.$container.hasClass("select2-container--focus");
                }),
                (u.prototype.focus = function () {
                  this.hasFocus() ||
                    (this.$container.addClass("select2-container--focus"),
                    this.trigger("focus", {}));
                }),
                (u.prototype.enable = function (n) {
                  this.options.get("debug") &&
                    window.console &&
                    console.warn &&
                    console.warn(
                      'Select2: The `select2("enable")` method has been deprecated and will be removed in later Select2 versions. Use $element.prop("disabled") instead.'
                    );
                  (n == null || n.length === 0) && (n = [!0]);
                  var t = !n[0];
                  this.$element.prop("disabled", t);
                }),
                (u.prototype.data = function () {
                  this.options.get("debug") &&
                    arguments.length > 0 &&
                    window.console &&
                    console.warn &&
                    console.warn(
                      'Select2: Data can no longer be set using `select2("data")`. You should consider setting the value instead using `$element.val()`.'
                    );
                  var n = [];
                  return (
                    this.dataAdapter.current(function (t) {
                      n = t;
                    }),
                    n
                  );
                }),
                (u.prototype.val = function (t) {
                  if (
                    (this.options.get("debug") &&
                      window.console &&
                      console.warn &&
                      console.warn(
                        'Select2: The `select2("val")` method has been deprecated and will be removed in later Select2 versions. Use $element.val() instead.'
                      ),
                    t == null || t.length === 0)
                  )
                    return this.$element.val();
                  var i = t[0];
                  n.isArray(i) &&
                    (i = n.map(i, function (n) {
                      return n.toString();
                    }));
                  this.$element.val(i).trigger("change");
                }),
                (u.prototype.destroy = function () {
                  this.$container.remove();
                  this.$element[0].detachEvent &&
                    this.$element[0].detachEvent(
                      "onpropertychange",
                      this._sync
                    );
                  this._observer != null
                    ? (this._observer.disconnect(), (this._observer = null))
                    : this.$element[0].removeEventListener &&
                      this.$element[0].removeEventListener(
                        "DOMAttrModified",
                        this._sync,
                        !1
                      );
                  this._sync = null;
                  this.$element.off(".select2");
                  this.$element.attr(
                    "tabindex",
                    this.$element.data("old-tabindex")
                  );
                  this.$element.removeClass("select2-hidden-accessible");
                  this.$element.attr("aria-hidden", "false");
                  this.$element.removeData("select2");
                  this.dataAdapter.destroy();
                  this.selection.destroy();
                  this.dropdown.destroy();
                  this.results.destroy();
                  this.dataAdapter = null;
                  this.selection = null;
                  this.dropdown = null;
                  this.results = null;
                }),
                (u.prototype.render = function () {
                  var t = n(
                    '<span class="select2 select2-container"><span class="selection"></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>'
                  );
                  return (
                    t.attr("dir", this.options.get("dir")),
                    (this.$container = t),
                    this.$container.addClass(
                      "select2-container--" + this.options.get("theme")
                    ),
                    t.data("element", this.$element),
                    t
                  );
                }),
                u
              );
            }
          ),
          t.define("select2/compat/utils", ["jquery"], function (n) {
            function t(t, i, r) {
              var u,
                f = [],
                e;
              u = n.trim(t.attr("class"));
              u &&
                ((u = "" + u),
                n(u.split(/\s+/)).each(function () {
                  this.indexOf("select2-") === 0 && f.push(this);
                }));
              u = n.trim(i.attr("class"));
              u &&
                ((u = "" + u),
                n(u.split(/\s+/)).each(function () {
                  this.indexOf("select2-") !== 0 &&
                    ((e = r(this)), e != null && f.push(e));
                }));
              t.attr("class", f.join(" "));
            }
            return { syncCssClasses: t };
          }),
          t.define(
            "select2/compat/containerCss",
            ["jquery", "./utils"],
            function (n, t) {
              function r() {
                return null;
              }
              function i() {}
              return (
                (i.prototype.render = function (i) {
                  var o = i.call(this),
                    u = this.options.get("containerCssClass") || "",
                    f,
                    s,
                    e;
                  return (
                    n.isFunction(u) && (u = u(this.$element)),
                    (f = this.options.get("adaptContainerCssClass")),
                    (f = f || r),
                    u.indexOf(":all:") !== -1 &&
                      ((u = u.replace(":all:", "")),
                      (s = f),
                      (f = function (n) {
                        var t = s(n);
                        return t != null ? t + " " + n : n;
                      })),
                    (e = this.options.get("containerCss") || {}),
                    n.isFunction(e) && (e = e(this.$element)),
                    t.syncCssClasses(o, this.$element, f),
                    o.css(e),
                    o.addClass(u),
                    o
                  );
                }),
                i
              );
            }
          ),
          t.define(
            "select2/compat/dropdownCss",
            ["jquery", "./utils"],
            function (n, t) {
              function r() {
                return null;
              }
              function i() {}
              return (
                (i.prototype.render = function (i) {
                  var o = i.call(this),
                    u = this.options.get("dropdownCssClass") || "",
                    f,
                    s,
                    e;
                  return (
                    n.isFunction(u) && (u = u(this.$element)),
                    (f = this.options.get("adaptDropdownCssClass")),
                    (f = f || r),
                    u.indexOf(":all:") !== -1 &&
                      ((u = u.replace(":all:", "")),
                      (s = f),
                      (f = function (n) {
                        var t = s(n);
                        return t != null ? t + " " + n : n;
                      })),
                    (e = this.options.get("dropdownCss") || {}),
                    n.isFunction(e) && (e = e(this.$element)),
                    t.syncCssClasses(o, this.$element, f),
                    o.css(e),
                    o.addClass(u),
                    o
                  );
                }),
                i
              );
            }
          ),
          t.define("select2/compat/initSelection", ["jquery"], function (n) {
            function t(n, t, i) {
              i.get("debug") &&
                window.console &&
                console.warn &&
                console.warn(
                  "Select2: The `initSelection` option has been deprecated in favor of a custom data adapter that overrides the `current` method. This method is now called multiple times instead of a single time when the instance is initialized. Support will be removed for the `initSelection` option in future versions of Select2"
                );
              this.initSelection = i.get("initSelection");
              this._isInitialized = !1;
              n.call(this, t, i);
            }
            return (
              (t.prototype.current = function (t, i) {
                var r = this;
                if (this._isInitialized) {
                  t.call(this, i);
                  return;
                }
                this.initSelection.call(null, this.$element, function (t) {
                  r._isInitialized = !0;
                  n.isArray(t) || (t = [t]);
                  i(t);
                });
              }),
              t
            );
          }),
          t.define("select2/compat/inputData", ["jquery"], function (n) {
            function t(n, t, i) {
              this._currentData = [];
              this._valueSeparator = i.get("valueSeparator") || ",";
              t.prop("type") === "hidden" &&
                i.get("debug") &&
                console &&
                console.warn &&
                console.warn(
                  "Select2: Using a hidden input with Select2 is no longer supported and may stop working in the future. It is recommended to use a `<select>` element instead."
                );
              n.call(this, t, i);
            }
            return (
              (t.prototype.current = function (t, i) {
                function f(t, i) {
                  var r = [];
                  return (
                    t.selected || n.inArray(t.id, i) !== -1
                      ? ((t.selected = !0), r.push(t))
                      : (t.selected = !1),
                    t.children && r.push.apply(r, f(t.children, i)),
                    r
                  );
                }
                for (var e, r = [], u = 0; u < this._currentData.length; u++)
                  (e = this._currentData[u]),
                    r.push.apply(
                      r,
                      f(e, this.$element.val().split(this._valueSeparator))
                    );
                i(r);
              }),
              (t.prototype.select = function (t, i) {
                if (this.options.get("multiple")) {
                  var r = this.$element.val();
                  r += this._valueSeparator + i.id;
                  this.$element.val(r);
                  this.$element.trigger("change");
                } else
                  this.current(function (t) {
                    n.map(t, function (n) {
                      n.selected = !1;
                    });
                  }),
                    this.$element.val(i.id),
                    this.$element.trigger("change");
              }),
              (t.prototype.unselect = function (n, t) {
                var i = this;
                t.selected = !1;
                this.current(function (n) {
                  for (var r, f = [], u = 0; u < n.length; u++)
                    ((r = n[u]), t.id != r.id) && f.push(r.id);
                  i.$element.val(f.join(i._valueSeparator));
                  i.$element.trigger("change");
                });
              }),
              (t.prototype.query = function (n, t, i) {
                for (var f, r, e = [], u = 0; u < this._currentData.length; u++)
                  (f = this._currentData[u]),
                    (r = this.matches(t, f)),
                    r !== null && e.push(r);
                i({ results: e });
              }),
              (t.prototype.addOptions = function (t, i) {
                var r = n.map(i, function (t) {
                  return n.data(t[0], "data");
                });
                this._currentData.push.apply(this._currentData, r);
              }),
              t
            );
          }),
          t.define("select2/compat/matcher", ["jquery"], function (n) {
            function t(t) {
              function i(i, r) {
                var u = n.extend(!0, {}, r),
                  f,
                  e,
                  o;
                if (i.term == null || n.trim(i.term) === "") return u;
                if (r.children) {
                  for (f = r.children.length - 1; f >= 0; f--)
                    (e = r.children[f]),
                      (o = t(i.term, e.text, e)),
                      o || u.children.splice(f, 1);
                  if (u.children.length > 0) return u;
                }
                return t(i.term, r.text, r) ? u : null;
              }
              return i;
            }
            return t;
          }),
          t.define("select2/compat/query", [], function () {
            function n(n, t, i) {
              i.get("debug") &&
                window.console &&
                console.warn &&
                console.warn(
                  "Select2: The `query` option has been deprecated in favor of a custom data adapter that overrides the `query` method. Support will be removed for the `query` option in future versions of Select2."
                );
              n.call(this, t, i);
            }
            return (
              (n.prototype.query = function (n, t, i) {
                t.callback = i;
                var r = this.options.get("query");
                r.call(null, t);
              }),
              n
            );
          }),
          t.define("select2/dropdown/attachContainer", [], function () {
            function n(n, t, i) {
              n.call(this, t, i);
            }
            return (
              (n.prototype.position = function (n, t, i) {
                var r = i.find(".dropdown-wrapper");
                r.append(t);
                t.addClass("select2-dropdown--below");
                i.addClass("select2-container--below");
              }),
              n
            );
          }),
          t.define("select2/dropdown/stopPropagation", [], function () {
            function n() {}
            return (
              (n.prototype.bind = function (n, t, i) {
                n.call(this, t, i);
                this.$dropdown.on(
                  "blur change click dblclick focus focusin focusout input keydown keyup keypress mousedown mouseenter mouseleave mousemove mouseover mouseup search touchend touchstart",
                  function (n) {
                    n.stopPropagation();
                  }
                );
              }),
              n
            );
          }),
          t.define("select2/selection/stopPropagation", [], function () {
            function n() {}
            return (
              (n.prototype.bind = function (n, t, i) {
                n.call(this, t, i);
                this.$selection.on(
                  "blur change click dblclick focus focusin focusout input keydown keyup keypress mousedown mouseenter mouseleave mousemove mouseover mouseup search touchend touchstart",
                  function (n) {
                    n.stopPropagation();
                  }
                );
              }),
              n
            );
          }),
          (function (i) {
            typeof t.define == "function" && t.define.amd
              ? t.define("jquery-mousewheel", ["jquery"], i)
              : typeof exports == "object"
              ? (module.exports = i)
              : i(n);
          })(function (n) {
            function u(r) {
              var u = r || window.event,
                w = c.call(arguments, 1),
                l = 0,
                s = 0,
                e = 0,
                a = 0,
                b = 0,
                k = 0,
                v,
                y,
                p;
              if (
                ((r = n.event.fix(u)),
                (r.type = "mousewheel"),
                "detail" in u && (e = u.detail * -1),
                "wheelDelta" in u && (e = u.wheelDelta),
                "wheelDeltaY" in u && (e = u.wheelDeltaY),
                "wheelDeltaX" in u && (s = u.wheelDeltaX * -1),
                "axis" in u &&
                  u.axis === u.HORIZONTAL_AXIS &&
                  ((s = e * -1), (e = 0)),
                (l = e === 0 ? s : e),
                "deltaY" in u && ((e = u.deltaY * -1), (l = e)),
                "deltaX" in u && ((s = u.deltaX), e === 0 && (l = s * -1)),
                e !== 0 || s !== 0)
              )
                return (
                  u.deltaMode === 1
                    ? ((v = n.data(this, "mousewheel-line-height")),
                      (l *= v),
                      (e *= v),
                      (s *= v))
                    : u.deltaMode === 2 &&
                      ((y = n.data(this, "mousewheel-page-height")),
                      (l *= y),
                      (e *= y),
                      (s *= y)),
                  (a = Math.max(Math.abs(e), Math.abs(s))),
                  (!t || a < t) && ((t = a), o(u, a) && (t /= 40)),
                  o(u, a) && ((l /= 40), (s /= 40), (e /= 40)),
                  (l = Math[l >= 1 ? "floor" : "ceil"](l / t)),
                  (s = Math[s >= 1 ? "floor" : "ceil"](s / t)),
                  (e = Math[e >= 1 ? "floor" : "ceil"](e / t)),
                  i.settings.normalizeOffset &&
                    this.getBoundingClientRect &&
                    ((p = this.getBoundingClientRect()),
                    (b = r.clientX - p.left),
                    (k = r.clientY - p.top)),
                  (r.deltaX = s),
                  (r.deltaY = e),
                  (r.deltaFactor = t),
                  (r.offsetX = b),
                  (r.offsetY = k),
                  (r.deltaMode = 0),
                  w.unshift(r, l, s, e),
                  f && clearTimeout(f),
                  (f = setTimeout(h, 200)),
                  (n.event.dispatch || n.event.handle).apply(this, w)
                );
            }
            function h() {
              t = null;
            }
            function o(n, t) {
              return (
                i.settings.adjustOldDeltas &&
                n.type === "mousewheel" &&
                t % 120 == 0
              );
            }
            var s = [
                "wheel",
                "mousewheel",
                "DOMMouseScroll",
                "MozMousePixelScroll",
              ],
              r =
                "onwheel" in document || document.documentMode >= 9
                  ? ["wheel"]
                  : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
              c = Array.prototype.slice,
              f,
              t,
              e,
              i;
            if (n.event.fixHooks)
              for (e = s.length; e; )
                n.event.fixHooks[s[--e]] = n.event.mouseHooks;
            i = n.event.special.mousewheel = {
              version: "3.1.12",
              setup: function () {
                if (this.addEventListener)
                  for (var t = r.length; t; )
                    this.addEventListener(r[--t], u, !1);
                else this.onmousewheel = u;
                n.data(this, "mousewheel-line-height", i.getLineHeight(this));
                n.data(this, "mousewheel-page-height", i.getPageHeight(this));
              },
              teardown: function () {
                if (this.removeEventListener)
                  for (var t = r.length; t; )
                    this.removeEventListener(r[--t], u, !1);
                else this.onmousewheel = null;
                n.removeData(this, "mousewheel-line-height");
                n.removeData(this, "mousewheel-page-height");
              },
              getLineHeight: function (t) {
                var r = n(t),
                  i = r["offsetParent" in n.fn ? "offsetParent" : "parent"]();
                return (
                  i.length || (i = n("body")),
                  parseInt(i.css("fontSize"), 10) ||
                    parseInt(r.css("fontSize"), 10) ||
                    16
                );
              },
              getPageHeight: function (t) {
                return n(t).height();
              },
              settings: { adjustOldDeltas: !0, normalizeOffset: !0 },
            };
            n.fn.extend({
              mousewheel: function (n) {
                return n
                  ? this.bind("mousewheel", n)
                  : this.trigger("mousewheel");
              },
              unmousewheel: function (n) {
                return this.unbind("mousewheel", n);
              },
            });
          }),
          t.define(
            "jquery.select2",
            [
              "jquery",
              "jquery-mousewheel",
              "./select2/core",
              "./select2/defaults",
            ],
            function (n, t, i, r) {
              if (n.fn.select2 == null) {
                var u = ["open", "close", "destroy"];
                n.fn.select2 = function (t) {
                  if (((t = t || {}), typeof t == "object"))
                    return (
                      this.each(function () {
                        var r = n.extend(!0, {}, t),
                          u = new i(n(this), r);
                      }),
                      this
                    );
                  if (typeof t == "string") {
                    var r;
                    return (this.each(function () {
                      var i = n(this).data("select2"),
                        u;
                      i == null &&
                        window.console &&
                        console.error &&
                        console.error(
                          "The select2('" +
                            t +
                            "') method was called on an element that is not using Select2."
                        );
                      u = Array.prototype.slice.call(arguments, 1);
                      r = i[t].apply(i, u);
                    }),
                    n.inArray(t, u) > -1)
                      ? this
                      : r;
                  }
                  throw new Error("Invalid arguments for Select2: " + t);
                };
              }
              return (
                n.fn.select2.defaults == null && (n.fn.select2.defaults = r), i
              );
            }
          ),
          { define: t.define, require: t.require }
        );
      })(),
      i = t.require("jquery.select2");
    return (n.fn.select2.amd = t), i;
  });
!(function (n) {
  "use strict";
  var t = function (n, i, r) {
      var f,
        e,
        u = document.createElement("img");
      if (
        ((u.onerror = i),
        (u.onload = function () {
          !e || (r && r.noRevoke) || t.revokeObjectURL(e);
          i && i(t.scale(u, r));
        }),
        t.isInstanceOf("Blob", n) || t.isInstanceOf("File", n))
      )
        (f = e = t.createObjectURL(n)), (u._type = n.type);
      else {
        if ("string" != typeof n) return !1;
        f = n;
        r && r.crossOrigin && (u.crossOrigin = r.crossOrigin);
      }
      return f
        ? ((u.src = f), u)
        : t.readFile(n, function (n) {
            var t = n.target;
            t && t.result ? (u.src = t.result) : i && i(n);
          });
    },
    i =
      (window.createObjectURL && window) ||
      (window.URL && URL.revokeObjectURL && URL) ||
      (window.webkitURL && webkitURL);
  t.isInstanceOf = function (n, t) {
    return Object.prototype.toString.call(t) === "[object " + n + "]";
  };
  t.transformCoordinates = function () {};
  t.getTransformedOptions = function (n, t) {
    var i,
      r,
      u,
      f,
      e = t.aspectRatio;
    if (!e) return t;
    i = {};
    for (r in t) t.hasOwnProperty(r) && (i[r] = t[r]);
    return (
      (i.crop = !0),
      (u = n.naturalWidth || n.width),
      (f = n.naturalHeight || n.height),
      u / f > e
        ? ((i.maxWidth = f * e), (i.maxHeight = f))
        : ((i.maxWidth = u), (i.maxHeight = u / e)),
      i
    );
  };
  t.renderImageToCanvas = function (n, t, i, r, u, f, e, o, s, h) {
    return n.getContext("2d").drawImage(t, i, r, u, f, e, o, s, h), n;
  };
  t.hasCanvasOption = function (n) {
    return n.canvas || n.crop || !!n.aspectRatio;
  };
  t.scale = function (n, i) {
    function g() {
      var n = Math.max((y || e) / e, (p || o) / o);
      n > 1 && ((e *= n), (o *= n));
    }
    function nt() {
      var n = Math.min((s || e) / e, (h || o) / o);
      1 > n && ((e *= n), (o *= n));
    }
    i = i || {};
    var s,
      h,
      y,
      p,
      r,
      u,
      c,
      l,
      a,
      v,
      k,
      f = document.createElement("canvas"),
      d = n.getContext || (t.hasCanvasOption(i) && f.getContext),
      w = n.naturalWidth || n.width,
      b = n.naturalHeight || n.height,
      e = w,
      o = b;
    if (
      (d &&
        ((i = t.getTransformedOptions(n, i)),
        (c = i.left || 0),
        (l = i.top || 0),
        i.sourceWidth
          ? ((r = i.sourceWidth),
            void 0 !== i.right && void 0 === i.left && (c = w - r - i.right))
          : (r = w - c - (i.right || 0)),
        i.sourceHeight
          ? ((u = i.sourceHeight),
            void 0 !== i.bottom && void 0 === i.top && (l = b - u - i.bottom))
          : (u = b - l - (i.bottom || 0)),
        (e = r),
        (o = u)),
      (s = i.maxWidth),
      (h = i.maxHeight),
      (y = i.minWidth),
      (p = i.minHeight),
      d && s && h && i.crop
        ? ((e = s),
          (o = h),
          (k = r / u - s / h),
          0 > k
            ? ((u = (h * r) / s),
              void 0 === i.top && void 0 === i.bottom && (l = (b - u) / 2))
            : k > 0 &&
              ((r = (s * u) / h),
              void 0 === i.left && void 0 === i.right && (c = (w - r) / 2)))
        : ((i.contain || i.cover) && ((y = s = s || y), (p = h = h || p)),
          i.cover ? (nt(), g()) : (g(), nt())),
      d)
    ) {
      if (
        ((a = i.pixelRatio),
        a > 1 &&
          ((f.style.width = e + "px"),
          (f.style.height = o + "px"),
          (e *= a),
          (o *= a),
          f.getContext("2d").scale(a, a)),
        (v = i.downsamplingRatio),
        v > 0 && 1 > v && r > e && u > o)
      )
        for (; r * v > e; )
          (f.width = r * v),
            (f.height = u * v),
            t.renderImageToCanvas(f, n, c, l, r, u, 0, 0, f.width, f.height),
            (r = f.width),
            (u = f.height),
            (n = document.createElement("canvas")),
            (n.width = r),
            (n.height = u),
            t.renderImageToCanvas(n, f, 0, 0, r, u, 0, 0, r, u);
      return (
        (f.width = e),
        (f.height = o),
        t.transformCoordinates(f, i),
        t.renderImageToCanvas(f, n, c, l, r, u, 0, 0, e, o)
      );
    }
    return (n.width = e), (n.height = o), n;
  };
  t.createObjectURL = function (n) {
    return i ? i.createObjectURL(n) : !1;
  };
  t.revokeObjectURL = function (n) {
    return i ? i.revokeObjectURL(n) : !1;
  };
  t.readFile = function (n, t, i) {
    if (window.FileReader) {
      var r = new FileReader();
      if (((r.onload = r.onerror = t), (i = i || "readAsDataURL"), r[i]))
        return r[i](n), r;
    }
    return !1;
  };
  "function" == typeof define && define.amd
    ? define(function () {
        return t;
      })
    : "object" == typeof module && module.exports
    ? (module.exports = t)
    : (n.loadImage = t);
})(window),
  (function (n) {
    "use strict";
    "function" == typeof define && define.amd
      ? define(["./load-image"], n)
      : n(
          "object" == typeof module && module.exports
            ? require("./load-image")
            : window.loadImage
        );
  })(function (n) {
    "use strict";
    var t = n.hasCanvasOption,
      i = n.transformCoordinates,
      r = n.getTransformedOptions;
    n.hasCanvasOption = function (i) {
      return !!i.orientation || t.call(n, i);
    };
    n.transformCoordinates = function (t, r) {
      i.call(n, t, r);
      var u = t.getContext("2d"),
        f = t.width,
        e = t.height,
        s = t.style.width,
        h = t.style.height,
        o = r.orientation;
      if (o && !(o > 8))
        switch (
          (o > 4 &&
            ((t.width = e),
            (t.height = f),
            (t.style.width = h),
            (t.style.height = s)),
          o)
        ) {
          case 2:
            u.translate(f, 0);
            u.scale(-1, 1);
            break;
          case 3:
            u.translate(f, e);
            u.rotate(Math.PI);
            break;
          case 4:
            u.translate(0, e);
            u.scale(1, -1);
            break;
          case 5:
            u.rotate(0.5 * Math.PI);
            u.scale(1, -1);
            break;
          case 6:
            u.rotate(0.5 * Math.PI);
            u.translate(0, -e);
            break;
          case 7:
            u.rotate(0.5 * Math.PI);
            u.translate(f, -e);
            u.scale(-1, 1);
            break;
          case 8:
            u.rotate(-0.5 * Math.PI);
            u.translate(-f, 0);
        }
    };
    n.getTransformedOptions = function (t, i) {
      var f,
        e,
        u = r.call(n, t, i),
        o = u.orientation;
      if (!o || o > 8 || 1 === o) return u;
      f = {};
      for (e in u) u.hasOwnProperty(e) && (f[e] = u[e]);
      switch (u.orientation) {
        case 2:
          f.left = u.right;
          f.right = u.left;
          break;
        case 3:
          f.left = u.right;
          f.top = u.bottom;
          f.right = u.left;
          f.bottom = u.top;
          break;
        case 4:
          f.top = u.bottom;
          f.bottom = u.top;
          break;
        case 5:
          f.left = u.top;
          f.top = u.left;
          f.right = u.bottom;
          f.bottom = u.right;
          break;
        case 6:
          f.left = u.top;
          f.top = u.right;
          f.right = u.bottom;
          f.bottom = u.left;
          break;
        case 7:
          f.left = u.bottom;
          f.top = u.right;
          f.right = u.top;
          f.bottom = u.left;
          break;
        case 8:
          f.left = u.bottom;
          f.top = u.left;
          f.right = u.top;
          f.bottom = u.right;
      }
      return (
        u.orientation > 4 &&
          ((f.maxWidth = u.maxHeight),
          (f.maxHeight = u.maxWidth),
          (f.minWidth = u.minHeight),
          (f.minHeight = u.minWidth),
          (f.sourceWidth = u.sourceHeight),
          (f.sourceHeight = u.sourceWidth)),
        f
      );
    };
  }),
  (function (n) {
    "use strict";
    "function" == typeof define && define.amd
      ? define(["./load-image"], n)
      : n(
          "object" == typeof module && module.exports
            ? require("./load-image")
            : window.loadImage
        );
  })(function (n) {
    "use strict";
    var t =
      window.Blob &&
      (Blob.prototype.slice ||
        Blob.prototype.webkitSlice ||
        Blob.prototype.mozSlice);
    n.blobSlice =
      t &&
      function () {
        var n = this.slice || this.webkitSlice || this.mozSlice;
        return n.apply(this, arguments);
      };
    n.metaDataParsers = { jpeg: { 65505: [] } };
    n.parseMetaData = function (t, i, r) {
      r = r || {};
      var f = this,
        e = r.maxMetaDataSize || 262144,
        u = {},
        o = !(
          window.DataView &&
          t &&
          t.size >= 12 &&
          "image/jpeg" === t.type &&
          n.blobSlice
        );
      (o ||
        !n.readFile(
          n.blobSlice.call(t, 0, e),
          function (t) {
            if (t.target.error) return console.log(t.target.error), void i(u);
            var s,
              h,
              v,
              c,
              l = t.target.result,
              o = new DataView(l),
              e = 2,
              y = o.byteLength - 4,
              a = e;
            if (65496 === o.getUint16(0)) {
              for (
                ;
                y > e &&
                ((s = o.getUint16(e)),
                (s >= 65504 && 65519 >= s) || 65534 === s);

              ) {
                if (((h = o.getUint16(e + 2) + 2), e + h > o.byteLength)) {
                  console.log("Invalid meta data: Invalid segment size.");
                  break;
                }
                if ((v = n.metaDataParsers.jpeg[s]))
                  for (c = 0; c < v.length; c += 1) v[c].call(f, o, e, h, u, r);
                e += h;
                a = e;
              }
              !r.disableImageHead &&
                a > 6 &&
                (u.imageHead = l.slice
                  ? l.slice(0, a)
                  : new Uint8Array(l).subarray(0, a));
            } else console.log("Invalid JPEG file: Missing JPEG marker.");
            i(u);
          },
          "readAsArrayBuffer"
        )) &&
        i(u);
    };
  }),
  (function (n) {
    "use strict";
    "function" == typeof define && define.amd
      ? define(["./load-image", "./load-image-meta"], n)
      : "object" == typeof module && module.exports
      ? n(require("./load-image"), require("./load-image-meta"))
      : n(window.loadImage);
  })(function (n) {
    "use strict";
    n.ExifMap = function () {
      return this;
    };
    n.ExifMap.prototype.map = { Orientation: 274 };
    n.ExifMap.prototype.get = function (n) {
      return this[n] || this[this.map[n]];
    };
    n.getExifThumbnail = function (n, t, i) {
      var u, r, f;
      if (!i || t + i > n.byteLength)
        return void console.log("Invalid Exif data: Invalid thumbnail data.");
      for (u = [], r = 0; i > r; r += 1)
        (f = n.getUint8(t + r)), u.push((16 > f ? "0" : "") + f.toString(16));
      return "data:image/jpeg,%" + u.join("%");
    };
    n.exifTagTypes = {
      1: {
        getValue: function (n, t) {
          return n.getUint8(t);
        },
        size: 1,
      },
      2: {
        getValue: function (n, t) {
          return String.fromCharCode(n.getUint8(t));
        },
        size: 1,
        ascii: !0,
      },
      3: {
        getValue: function (n, t, i) {
          return n.getUint16(t, i);
        },
        size: 2,
      },
      4: {
        getValue: function (n, t, i) {
          return n.getUint32(t, i);
        },
        size: 4,
      },
      5: {
        getValue: function (n, t, i) {
          return n.getUint32(t, i) / n.getUint32(t + 4, i);
        },
        size: 8,
      },
      9: {
        getValue: function (n, t, i) {
          return n.getInt32(t, i);
        },
        size: 4,
      },
      10: {
        getValue: function (n, t, i) {
          return n.getInt32(t, i) / n.getInt32(t + 4, i);
        },
        size: 8,
      },
    };
    n.exifTagTypes[7] = n.exifTagTypes[1];
    n.getExifValue = function (t, i, r, u, f, e) {
      var l,
        c,
        h,
        o,
        a,
        v,
        s = n.exifTagTypes[u];
      if (!s) return void console.log("Invalid Exif data: Invalid tag type.");
      if (
        ((l = s.size * f),
        (c = l > 4 ? i + t.getUint32(r + 8, e) : r + 8),
        c + l > t.byteLength)
      )
        return void console.log("Invalid Exif data: Invalid data offset.");
      if (1 === f) return s.getValue(t, c, e);
      for (h = [], o = 0; f > o; o += 1)
        h[o] = s.getValue(t, c + o * s.size, e);
      if (s.ascii) {
        for (a = "", o = 0; o < h.length && ((v = h[o]), "\x00" !== v); o += 1)
          a += v;
        return a;
      }
      return h;
    };
    n.parseExifTag = function (t, i, r, u, f) {
      var e = t.getUint16(r, u);
      f.exif[e] = n.getExifValue(
        t,
        i,
        r,
        t.getUint16(r + 2, u),
        t.getUint32(r + 4, u),
        u
      );
    };
    n.parseExifTags = function (n, t, i, r, u) {
      var e, o, f;
      if (i + 6 > n.byteLength)
        return void console.log("Invalid Exif data: Invalid directory offset.");
      if (((e = n.getUint16(i, r)), (o = i + 2 + 12 * e), o + 4 > n.byteLength))
        return void console.log("Invalid Exif data: Invalid directory size.");
      for (f = 0; e > f; f += 1) this.parseExifTag(n, t, i + 2 + 12 * f, r, u);
      return n.getUint32(o, r);
    };
    n.parseExifData = function (t, i, r, u, f) {
      if (!f.disableExif) {
        var o,
          s,
          h,
          e = i + 10;
        if (1165519206 === t.getUint32(i + 4)) {
          if (e + 8 > t.byteLength)
            return void console.log("Invalid Exif data: Invalid segment size.");
          if (0 !== t.getUint16(i + 8))
            return void console.log(
              "Invalid Exif data: Missing byte alignment offset."
            );
          switch (t.getUint16(e)) {
            case 18761:
              o = !0;
              break;
            case 19789:
              o = !1;
              break;
            default:
              return void console.log(
                "Invalid Exif data: Invalid byte alignment marker."
              );
          }
          if (42 !== t.getUint16(e + 2, o))
            return void console.log("Invalid Exif data: Missing TIFF marker.");
          s = t.getUint32(e + 4, o);
          u.exif = new n.ExifMap();
          s = n.parseExifTags(t, e, e + s, o, u);
          s &&
            !f.disableExifThumbnail &&
            ((h = { exif: {} }),
            (s = n.parseExifTags(t, e, e + s, o, h)),
            h.exif[513] &&
              (u.exif.Thumbnail = n.getExifThumbnail(
                t,
                e + h.exif[513],
                h.exif[514]
              )));
          u.exif[34665] &&
            !f.disableExifSub &&
            n.parseExifTags(t, e, e + u.exif[34665], o, u);
          u.exif[34853] &&
            !f.disableExifGps &&
            n.parseExifTags(t, e, e + u.exif[34853], o, u);
        }
      }
    };
    n.metaDataParsers.jpeg[65505].push(n.parseExifData);
  }),
  (function (n) {
    "use strict";
    "function" == typeof define && define.amd
      ? define(["./load-image", "./load-image-exif"], n)
      : "object" == typeof module && module.exports
      ? n(require("./load-image"), require("./load-image-exif"))
      : n(window.loadImage);
  })(function (n) {
    "use strict";
    n.ExifMap.prototype.tags = {
      256: "ImageWidth",
      257: "ImageHeight",
      34665: "ExifIFDPointer",
      34853: "GPSInfoIFDPointer",
      40965: "InteroperabilityIFDPointer",
      258: "BitsPerSample",
      259: "Compression",
      262: "PhotometricInterpretation",
      274: "Orientation",
      277: "SamplesPerPixel",
      284: "PlanarConfiguration",
      530: "YCbCrSubSampling",
      531: "YCbCrPositioning",
      282: "XResolution",
      283: "YResolution",
      296: "ResolutionUnit",
      273: "StripOffsets",
      278: "RowsPerStrip",
      279: "StripByteCounts",
      513: "JPEGInterchangeFormat",
      514: "JPEGInterchangeFormatLength",
      301: "TransferFunction",
      318: "WhitePoint",
      319: "PrimaryChromaticities",
      529: "YCbCrCoefficients",
      532: "ReferenceBlackWhite",
      306: "DateTime",
      270: "ImageDescription",
      271: "Make",
      272: "Model",
      305: "Software",
      315: "Artist",
      33432: "Copyright",
      36864: "ExifVersion",
      40960: "FlashpixVersion",
      40961: "ColorSpace",
      40962: "PixelXDimension",
      40963: "PixelYDimension",
      42240: "Gamma",
      37121: "ComponentsConfiguration",
      37122: "CompressedBitsPerPixel",
      37500: "MakerNote",
      37510: "UserComment",
      40964: "RelatedSoundFile",
      36867: "DateTimeOriginal",
      36868: "DateTimeDigitized",
      37520: "SubSecTime",
      37521: "SubSecTimeOriginal",
      37522: "SubSecTimeDigitized",
      33434: "ExposureTime",
      33437: "FNumber",
      34850: "ExposureProgram",
      34852: "SpectralSensitivity",
      34855: "PhotographicSensitivity",
      34856: "OECF",
      34864: "SensitivityType",
      34865: "StandardOutputSensitivity",
      34866: "RecommendedExposureIndex",
      34867: "ISOSpeed",
      34868: "ISOSpeedLatitudeyyy",
      34869: "ISOSpeedLatitudezzz",
      37377: "ShutterSpeedValue",
      37378: "ApertureValue",
      37379: "BrightnessValue",
      37380: "ExposureBias",
      37381: "MaxApertureValue",
      37382: "SubjectDistance",
      37383: "MeteringMode",
      37384: "LightSource",
      37385: "Flash",
      37396: "SubjectArea",
      37386: "FocalLength",
      41483: "FlashEnergy",
      41484: "SpatialFrequencyResponse",
      41486: "FocalPlaneXResolution",
      41487: "FocalPlaneYResolution",
      41488: "FocalPlaneResolutionUnit",
      41492: "SubjectLocation",
      41493: "ExposureIndex",
      41495: "SensingMethod",
      41728: "FileSource",
      41729: "SceneType",
      41730: "CFAPattern",
      41985: "CustomRendered",
      41986: "ExposureMode",
      41987: "WhiteBalance",
      41988: "DigitalZoomRatio",
      41989: "FocalLengthIn35mmFilm",
      41990: "SceneCaptureType",
      41991: "GainControl",
      41992: "Contrast",
      41993: "Saturation",
      41994: "Sharpness",
      41995: "DeviceSettingDescription",
      41996: "SubjectDistanceRange",
      42016: "ImageUniqueID",
      42032: "CameraOwnerName",
      42033: "BodySerialNumber",
      42034: "LensSpecification",
      42035: "LensMake",
      42036: "LensModel",
      42037: "LensSerialNumber",
      0: "GPSVersionID",
      1: "GPSLatitudeRef",
      2: "GPSLatitude",
      3: "GPSLongitudeRef",
      4: "GPSLongitude",
      5: "GPSAltitudeRef",
      6: "GPSAltitude",
      7: "GPSTimeStamp",
      8: "GPSSatellites",
      9: "GPSStatus",
      10: "GPSMeasureMode",
      11: "GPSDOP",
      12: "GPSSpeedRef",
      13: "GPSSpeed",
      14: "GPSTrackRef",
      15: "GPSTrack",
      16: "GPSImgDirectionRef",
      17: "GPSImgDirection",
      18: "GPSMapDatum",
      19: "GPSDestLatitudeRef",
      20: "GPSDestLatitude",
      21: "GPSDestLongitudeRef",
      22: "GPSDestLongitude",
      23: "GPSDestBearingRef",
      24: "GPSDestBearing",
      25: "GPSDestDistanceRef",
      26: "GPSDestDistance",
      27: "GPSProcessingMethod",
      28: "GPSAreaInformation",
      29: "GPSDateStamp",
      30: "GPSDifferential",
      31: "GPSHPositioningError",
    };
    n.ExifMap.prototype.stringValues = {
      ExposureProgram: {
        0: "Undefined",
        1: "Manual",
        2: "Normal program",
        3: "Aperture priority",
        4: "Shutter priority",
        5: "Creative program",
        6: "Action program",
        7: "Portrait mode",
        8: "Landscape mode",
      },
      MeteringMode: {
        0: "Unknown",
        1: "Average",
        2: "CenterWeightedAverage",
        3: "Spot",
        4: "MultiSpot",
        5: "Pattern",
        6: "Partial",
        255: "Other",
      },
      LightSource: {
        0: "Unknown",
        1: "Daylight",
        2: "Fluorescent",
        3: "Tungsten (incandescent light)",
        4: "Flash",
        9: "Fine weather",
        10: "Cloudy weather",
        11: "Shade",
        12: "Daylight fluorescent (D 5700 - 7100K)",
        13: "Day white fluorescent (N 4600 - 5400K)",
        14: "Cool white fluorescent (W 3900 - 4500K)",
        15: "White fluorescent (WW 3200 - 3700K)",
        17: "Standard light A",
        18: "Standard light B",
        19: "Standard light C",
        20: "D55",
        21: "D65",
        22: "D75",
        23: "D50",
        24: "ISO studio tungsten",
        255: "Other",
      },
      Flash: {
        0: "Flash did not fire",
        1: "Flash fired",
        5: "Strobe return light not detected",
        7: "Strobe return light detected",
        9: "Flash fired, compulsory flash mode",
        13: "Flash fired, compulsory flash mode, return light not detected",
        15: "Flash fired, compulsory flash mode, return light detected",
        16: "Flash did not fire, compulsory flash mode",
        24: "Flash did not fire, auto mode",
        25: "Flash fired, auto mode",
        29: "Flash fired, auto mode, return light not detected",
        31: "Flash fired, auto mode, return light detected",
        32: "No flash function",
        65: "Flash fired, red-eye reduction mode",
        69: "Flash fired, red-eye reduction mode, return light not detected",
        71: "Flash fired, red-eye reduction mode, return light detected",
        73: "Flash fired, compulsory flash mode, red-eye reduction mode",
        77: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
        79: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
        89: "Flash fired, auto mode, red-eye reduction mode",
        93: "Flash fired, auto mode, return light not detected, red-eye reduction mode",
        95: "Flash fired, auto mode, return light detected, red-eye reduction mode",
      },
      SensingMethod: {
        1: "Undefined",
        2: "One-chip color area sensor",
        3: "Two-chip color area sensor",
        4: "Three-chip color area sensor",
        5: "Color sequential area sensor",
        7: "Trilinear sensor",
        8: "Color sequential linear sensor",
      },
      SceneCaptureType: {
        0: "Standard",
        1: "Landscape",
        2: "Portrait",
        3: "Night scene",
      },
      SceneType: { 1: "Directly photographed" },
      CustomRendered: { 0: "Normal process", 1: "Custom process" },
      WhiteBalance: { 0: "Auto white balance", 1: "Manual white balance" },
      GainControl: {
        0: "None",
        1: "Low gain up",
        2: "High gain up",
        3: "Low gain down",
        4: "High gain down",
      },
      Contrast: { 0: "Normal", 1: "Soft", 2: "Hard" },
      Saturation: { 0: "Normal", 1: "Low saturation", 2: "High saturation" },
      Sharpness: { 0: "Normal", 1: "Soft", 2: "Hard" },
      SubjectDistanceRange: {
        0: "Unknown",
        1: "Macro",
        2: "Close view",
        3: "Distant view",
      },
      FileSource: { 3: "DSC" },
      ComponentsConfiguration: {
        0: "",
        1: "Y",
        2: "Cb",
        3: "Cr",
        4: "R",
        5: "G",
        6: "B",
      },
      Orientation: {
        1: "top-left",
        2: "top-right",
        3: "bottom-right",
        4: "bottom-left",
        5: "left-top",
        6: "right-top",
        7: "right-bottom",
        8: "left-bottom",
      },
    };
    (n.ExifMap.prototype.getText = function (n) {
      var t = this.get(n);
      switch (n) {
        case "LightSource":
        case "Flash":
        case "MeteringMode":
        case "ExposureProgram":
        case "SensingMethod":
        case "SceneCaptureType":
        case "SceneType":
        case "CustomRendered":
        case "WhiteBalance":
        case "GainControl":
        case "Contrast":
        case "Saturation":
        case "Sharpness":
        case "SubjectDistanceRange":
        case "FileSource":
        case "Orientation":
          return this.stringValues[n][t];
        case "ExifVersion":
        case "FlashpixVersion":
          return String.fromCharCode(t[0], t[1], t[2], t[3]);
        case "ComponentsConfiguration":
          return (
            this.stringValues[n][t[0]] +
            this.stringValues[n][t[1]] +
            this.stringValues[n][t[2]] +
            this.stringValues[n][t[3]]
          );
        case "GPSVersionID":
          return t[0] + "." + t[1] + "." + t[2] + "." + t[3];
      }
      return String(t);
    }),
      (function (n) {
        var t,
          i = n.tags,
          r = n.map;
        for (t in i) i.hasOwnProperty(t) && (r[i[t]] = t);
      })(n.ExifMap.prototype);
    n.ExifMap.prototype.getAll = function () {
      var t,
        n,
        i = {};
      for (t in this)
        this.hasOwnProperty(t) &&
          ((n = this.tags[t]), n && (i[n] = this.getText(n)));
      return i;
    };
  }),
  (function (n) {
    "use strict";
    typeof define == "function" && define.amd
      ? define(["jquery"], n)
      : typeof exports == "object"
      ? n(require("jquery"))
      : n(window.jQuery);
  })(function (n) {
    "use strict";
    var t = 0;
    n.ajaxTransport("iframe", function (i) {
      if (i.async) {
        var e = i.initialIframeSrc || "javascript:false;",
          r,
          u,
          f;
        return {
          send: function (o, s) {
            r = n('<form style="display:none;"></form>');
            r.attr("accept-charset", i.formAcceptCharset);
            f = /\?/.test(i.url) ? "&" : "?";
            i.type === "DELETE"
              ? ((i.url = i.url + f + "_method=DELETE"), (i.type = "POST"))
              : i.type === "PUT"
              ? ((i.url = i.url + f + "_method=PUT"), (i.type = "POST"))
              : i.type === "PATCH" &&
                ((i.url = i.url + f + "_method=PATCH"), (i.type = "POST"));
            t += 1;
            u = n(
              '<iframe src="' +
                e +
                '" name="iframe-transport-' +
                t +
                '"></iframe>'
            ).bind("load", function () {
              var t,
                f = n.isArray(i.paramName) ? i.paramName : [i.paramName];
              u.unbind("load").bind("load", function () {
                var t;
                try {
                  if (((t = u.contents()), !t.length || !t[0].firstChild))
                    throw new Error();
                } catch (i) {
                  t = undefined;
                }
                s(200, "success", { iframe: t });
                n('<iframe src="' + e + '"></iframe>').appendTo(r);
                window.setTimeout(function () {
                  r.remove();
                }, 0);
              });
              r.prop("target", u.prop("name"))
                .prop("action", i.url)
                .prop("method", i.type);
              i.formData &&
                n.each(i.formData, function (t, i) {
                  n('<input type="hidden"/>')
                    .prop("name", i.name)
                    .val(i.value)
                    .appendTo(r);
                });
              i.fileInput &&
                i.fileInput.length &&
                i.type === "POST" &&
                ((t = i.fileInput.clone()),
                i.fileInput.after(function (n) {
                  return t[n];
                }),
                i.paramName &&
                  i.fileInput.each(function (t) {
                    n(this).prop("name", f[t] || i.paramName);
                  }),
                r
                  .append(i.fileInput)
                  .prop("enctype", "multipart/form-data")
                  .prop("encoding", "multipart/form-data"),
                i.fileInput.removeAttr("form"));
              r.submit();
              t &&
                t.length &&
                i.fileInput.each(function (i, r) {
                  var u = n(t[i]);
                  n(r)
                    .prop("name", u.prop("name"))
                    .attr("form", u.attr("form"));
                  u.replaceWith(r);
                });
            });
            r.append(u).appendTo(document.body);
          },
          abort: function () {
            u && u.unbind("load").prop("src", e);
            r && r.remove();
          },
        };
      }
    });
    n.ajaxSetup({
      converters: {
        "iframe text": function (t) {
          return t && n(t[0].body).text();
        },
        "iframe json": function (t) {
          return t && n.parseJSON(n(t[0].body).text());
        },
        "iframe html": function (t) {
          return t && n(t[0].body).html();
        },
        "iframe xml": function (t) {
          var i = t && t[0];
          return i && n.isXMLDoc(i)
            ? i
            : n.parseXML(
                (i.XMLDocument && i.XMLDocument.xml) || n(i.body).html()
              );
        },
        "iframe script": function (t) {
          return t && n.globalEval(n(t[0].body).text());
        },
      },
    });
  }),
  (function (n) {
    "use strict";
    typeof define == "function" && define.amd
      ? define(["jquery", "jquery.ui.widget"], n)
      : typeof exports == "object"
      ? n(require("jquery"), require("./vendor/jquery.ui.widget"))
      : n(window.jQuery);
  })(function (n) {
    "use strict";
    function t(t) {
      var i = t === "dragover";
      return function (r) {
        r.dataTransfer = r.originalEvent && r.originalEvent.dataTransfer;
        var u = r.dataTransfer;
        u &&
          n.inArray("Files", u.types) !== -1 &&
          this._trigger(t, n.Event(t, { delegatedEvent: r })) !== !1 &&
          (r.preventDefault(), i && (u.dropEffect = "copy"));
      };
    }
    n.support.fileInput = !(
      new RegExp(
        "(Android (1\\.[0156]|2\\.[01]))|(Windows Phone (OS 7|8\\.0))|(XBLWP)|(ZuneWP)|(WPDesktop)|(w(eb)?OSBrowser)|(webOS)|(Kindle/(1\\.0|2\\.[05]|3\\.0))"
      ).test(window.navigator.userAgent) ||
      n('<input type="file">').prop("disabled")
    );
    n.support.xhrFileUpload = !!(window.ProgressEvent && window.FileReader);
    n.support.xhrFormDataFileUpload = !!window.FormData;
    n.support.blobSlice =
      window.Blob &&
      (Blob.prototype.slice ||
        Blob.prototype.webkitSlice ||
        Blob.prototype.mozSlice);
    n.widget("blueimp.fileupload", {
      options: {
        dropZone: n(document),
        pasteZone: undefined,
        fileInput: undefined,
        replaceFileInput: !0,
        paramName: undefined,
        singleFileUploads: !0,
        limitMultiFileUploads: undefined,
        limitMultiFileUploadSize: undefined,
        limitMultiFileUploadSizeOverhead: 512,
        sequentialUploads: !1,
        limitConcurrentUploads: undefined,
        forceIframeTransport: !1,
        redirect: undefined,
        redirectParamName: undefined,
        postMessage: undefined,
        multipart: !0,
        maxChunkSize: undefined,
        uploadedBytes: undefined,
        recalculateProgress: !0,
        progressInterval: 100,
        bitrateInterval: 500,
        autoUpload: !0,
        messages: { uploadedBytes: "Uploaded bytes exceed file size" },
        i18n: function (t, i) {
          return (
            (t = this.messages[t] || t.toString()),
            i &&
              n.each(i, function (n, i) {
                t = t.replace("{" + n + "}", i);
              }),
            t
          );
        },
        formData: function (n) {
          return n.serializeArray();
        },
        add: function (t, i) {
          if (t.isDefaultPrevented()) return !1;
          (i.autoUpload ||
            (i.autoUpload !== !1 &&
              n(this).fileupload("option", "autoUpload"))) &&
            i.process().done(function () {
              i.submit();
            });
        },
        processData: !1,
        contentType: !1,
        cache: !1,
        timeout: 0,
      },
      _specialOptions: [
        "fileInput",
        "dropZone",
        "pasteZone",
        "multipart",
        "forceIframeTransport",
      ],
      _blobSlice:
        n.support.blobSlice &&
        function () {
          var n = this.slice || this.webkitSlice || this.mozSlice;
          return n.apply(this, arguments);
        },
      _BitrateTimer: function () {
        this.timestamp = Date.now ? Date.now() : new Date().getTime();
        this.loaded = 0;
        this.bitrate = 0;
        this.getBitrate = function (n, t, i) {
          var r = n - this.timestamp;
          return (
            (!this.bitrate || !i || r > i) &&
              ((this.bitrate = (t - this.loaded) * (1e3 / r) * 8),
              (this.loaded = t),
              (this.timestamp = n)),
            this.bitrate
          );
        };
      },
      _isXHRUpload: function (t) {
        return (
          !t.forceIframeTransport &&
          ((!t.multipart && n.support.xhrFileUpload) ||
            n.support.xhrFormDataFileUpload)
        );
      },
      _getFormData: function (t) {
        var i;
        return n.type(t.formData) === "function"
          ? t.formData(t.form)
          : n.isArray(t.formData)
          ? t.formData
          : n.type(t.formData) === "object"
          ? ((i = []),
            n.each(t.formData, function (n, t) {
              i.push({ name: n, value: t });
            }),
            i)
          : [];
      },
      _getTotal: function (t) {
        var i = 0;
        return (
          n.each(t, function (n, t) {
            i += t.size || 1;
          }),
          i
        );
      },
      _initProgressObject: function (t) {
        var i = { loaded: 0, total: 0, bitrate: 0 };
        t._progress ? n.extend(t._progress, i) : (t._progress = i);
      },
      _initResponseObject: function (n) {
        var t;
        if (n._response)
          for (t in n._response)
            n._response.hasOwnProperty(t) && delete n._response[t];
        else n._response = {};
      },
      _onProgress: function (t, i) {
        if (t.lengthComputable) {
          var r = Date.now ? Date.now() : new Date().getTime(),
            u;
          if (
            i._time &&
            i.progressInterval &&
            r - i._time < i.progressInterval &&
            t.loaded !== t.total
          )
            return;
          i._time = r;
          u =
            Math.floor(
              (t.loaded / t.total) * (i.chunkSize || i._progress.total)
            ) + (i.uploadedBytes || 0);
          this._progress.loaded += u - i._progress.loaded;
          this._progress.bitrate = this._bitrateTimer.getBitrate(
            r,
            this._progress.loaded,
            i.bitrateInterval
          );
          i._progress.loaded = i.loaded = u;
          i._progress.bitrate = i.bitrate = i._bitrateTimer.getBitrate(
            r,
            u,
            i.bitrateInterval
          );
          this._trigger(
            "progress",
            n.Event("progress", { delegatedEvent: t }),
            i
          );
          this._trigger(
            "progressall",
            n.Event("progressall", { delegatedEvent: t }),
            this._progress
          );
        }
      },
      _initProgressListener: function (t) {
        var r = this,
          i = t.xhr ? t.xhr() : n.ajaxSettings.xhr();
        i.upload &&
          (n(i.upload).bind("progress", function (n) {
            var i = n.originalEvent;
            n.lengthComputable = i.lengthComputable;
            n.loaded = i.loaded;
            n.total = i.total;
            r._onProgress(n, t);
          }),
          (t.xhr = function () {
            return i;
          }));
      },
      _isInstanceOf: function (n, t) {
        return Object.prototype.toString.call(t) === "[object " + n + "]";
      },
      _initXHRData: function (t) {
        var f = this,
          i,
          r = t.files[0],
          e = t.multipart || !n.support.xhrFileUpload,
          u = n.type(t.paramName) === "array" ? t.paramName[0] : t.paramName;
        t.headers = n.extend({}, t.headers);
        t.contentRange && (t.headers["Content-Range"] = t.contentRange);
        (e && !t.blob && this._isInstanceOf("File", r)) ||
          (t.headers["Content-Disposition"] =
            'attachment; filename="' + encodeURI(r.name) + '"');
        e
          ? n.support.xhrFormDataFileUpload &&
            (t.postMessage
              ? ((i = this._getFormData(t)),
                t.blob
                  ? i.push({ name: u, value: t.blob })
                  : n.each(t.files, function (r, f) {
                      i.push({
                        name:
                          (n.type(t.paramName) === "array" && t.paramName[r]) ||
                          u,
                        value: f,
                      });
                    }))
              : (f._isInstanceOf("FormData", t.formData)
                  ? (i = t.formData)
                  : ((i = new FormData()),
                    n.each(this._getFormData(t), function (n, t) {
                      i.append(t.name, t.value);
                    })),
                t.blob
                  ? i.append(u, t.blob, r.name)
                  : n.each(t.files, function (r, e) {
                      (f._isInstanceOf("File", e) ||
                        f._isInstanceOf("Blob", e)) &&
                        i.append(
                          (n.type(t.paramName) === "array" && t.paramName[r]) ||
                            u,
                          e,
                          e.uploadName || e.name
                        );
                    })),
            (t.data = i))
          : ((t.contentType = r.type || "application/octet-stream"),
            (t.data = t.blob || r));
        t.blob = null;
      },
      _initIframeSettings: function (t) {
        var i = n("<a></a>").prop("href", t.url).prop("host");
        t.dataType = "iframe " + (t.dataType || "");
        t.formData = this._getFormData(t);
        t.redirect &&
          i &&
          i !== location.host &&
          t.formData.push({
            name: t.redirectParamName || "redirect",
            value: t.redirect,
          });
      },
      _initDataSettings: function (n) {
        this._isXHRUpload(n)
          ? (this._chunkedUpload(n, !0) ||
              (n.data || this._initXHRData(n), this._initProgressListener(n)),
            n.postMessage && (n.dataType = "postmessage " + (n.dataType || "")))
          : this._initIframeSettings(n);
      },
      _getParamName: function (t) {
        var r = n(t.fileInput),
          i = t.paramName;
        return (
          i
            ? n.isArray(i) || (i = [i])
            : ((i = []),
              r.each(function () {
                for (
                  var t = n(this),
                    u = t.prop("name") || "files[]",
                    r = (t.prop("files") || [1]).length;
                  r;

                )
                  i.push(u), (r -= 1);
              }),
              i.length || (i = [r.prop("name") || "files[]"])),
          i
        );
      },
      _initFormSettings: function (t) {
        (t.form && t.form.length) ||
          ((t.form = n(t.fileInput.prop("form"))),
          t.form.length || (t.form = n(this.options.fileInput.prop("form"))));
        t.paramName = this._getParamName(t);
        t.url || (t.url = t.form.prop("action") || location.href);
        t.type = (
          t.type ||
          (n.type(t.form.prop("method")) === "string" &&
            t.form.prop("method")) ||
          ""
        ).toUpperCase();
        t.type !== "POST" &&
          t.type !== "PUT" &&
          t.type !== "PATCH" &&
          (t.type = "POST");
        t.formAcceptCharset ||
          (t.formAcceptCharset = t.form.attr("accept-charset"));
      },
      _getAJAXSettings: function (t) {
        var i = n.extend({}, this.options, t);
        return this._initFormSettings(i), this._initDataSettings(i), i;
      },
      _getDeferredState: function (n) {
        return n.state
          ? n.state()
          : n.isResolved()
          ? "resolved"
          : n.isRejected()
          ? "rejected"
          : "pending";
      },
      _enhancePromise: function (n) {
        return (
          (n.success = n.done), (n.error = n.fail), (n.complete = n.always), n
        );
      },
      _getXHRPromise: function (t, i, r) {
        var u = n.Deferred(),
          f = u.promise();
        return (
          (i = i || this.options.context || f),
          t === !0 ? u.resolveWith(i, r) : t === !1 && u.rejectWith(i, r),
          (f.abort = u.promise),
          this._enhancePromise(f)
        );
      },
      _addConvenienceMethods: function (t, i) {
        var r = this,
          u = function (t) {
            return n.Deferred().resolveWith(r, t).promise();
          };
        i.process = function (t, f) {
          return (
            (t || f) &&
              (i._processQueue = this._processQueue =
                (this._processQueue || u([this]))
                  .then(function () {
                    return i.errorThrown
                      ? n.Deferred().rejectWith(r, [i]).promise()
                      : u(arguments);
                  })
                  .then(t, f)),
            this._processQueue || u([this])
          );
        };
        i.submit = function () {
          return (
            this.state() !== "pending" &&
              (i.jqXHR = this.jqXHR =
                r._trigger(
                  "submit",
                  n.Event("submit", { delegatedEvent: t }),
                  this
                ) !== !1 && r._onSend(t, this)),
            this.jqXHR || r._getXHRPromise()
          );
        };
        i.abort = function () {
          return this.jqXHR
            ? this.jqXHR.abort()
            : ((this.errorThrown = "abort"),
              r._trigger("fail", null, this),
              r._getXHRPromise(!1));
        };
        i.state = function () {
          return this.jqXHR
            ? r._getDeferredState(this.jqXHR)
            : this._processQueue
            ? r._getDeferredState(this._processQueue)
            : void 0;
        };
        i.processing = function () {
          return (
            !this.jqXHR &&
            this._processQueue &&
            r._getDeferredState(this._processQueue) === "pending"
          );
        };
        i.progress = function () {
          return this._progress;
        };
        i.response = function () {
          return this._response;
        };
      },
      _getUploadedBytes: function (n) {
        var i = n.getResponseHeader("Range"),
          t = i && i.split("-"),
          r = t && t.length > 1 && parseInt(t[1], 10);
        return r && r + 1;
      },
      _chunkedUpload: function (t, i) {
        t.uploadedBytes = t.uploadedBytes || 0;
        var u = this,
          f = t.files[0],
          e = f.size,
          r = t.uploadedBytes,
          c = t.maxChunkSize || e,
          l = this._blobSlice,
          o = n.Deferred(),
          s = o.promise(),
          a,
          h;
        return !(this._isXHRUpload(t) && l && (r || c < e)) || t.data
          ? !1
          : i
          ? !0
          : r >= e
          ? ((f.error = t.i18n("uploadedBytes")),
            this._getXHRPromise(!1, t.context, [null, "error", f.error]))
          : ((h = function () {
              var i = n.extend({}, t),
                s = i._progress.loaded;
              i.blob = l.call(f, r, r + c, f.type);
              i.chunkSize = i.blob.size;
              i.contentRange =
                "bytes " + r + "-" + (r + i.chunkSize - 1) + "/" + e;
              u._initXHRData(i);
              u._initProgressListener(i);
              a = (
                (u._trigger("chunksend", null, i) !== !1 && n.ajax(i)) ||
                u._getXHRPromise(!1, i.context)
              )
                .done(function (f, c, l) {
                  r = u._getUploadedBytes(l) || r + i.chunkSize;
                  s + i.chunkSize - i._progress.loaded &&
                    u._onProgress(
                      n.Event("progress", {
                        lengthComputable: !0,
                        loaded: r - i.uploadedBytes,
                        total: r - i.uploadedBytes,
                      }),
                      i
                    );
                  t.uploadedBytes = i.uploadedBytes = r;
                  i.result = f;
                  i.textStatus = c;
                  i.jqXHR = l;
                  u._trigger("chunkdone", null, i);
                  u._trigger("chunkalways", null, i);
                  r < e ? h() : o.resolveWith(i.context, [f, c, l]);
                })
                .fail(function (n, t, r) {
                  i.jqXHR = n;
                  i.textStatus = t;
                  i.errorThrown = r;
                  u._trigger("chunkfail", null, i);
                  u._trigger("chunkalways", null, i);
                  o.rejectWith(i.context, [n, t, r]);
                });
            }),
            this._enhancePromise(s),
            (s.abort = function () {
              return a.abort();
            }),
            h(),
            s);
      },
      _beforeSend: function (n, t) {
        this._active === 0 &&
          (this._trigger("start"),
          (this._bitrateTimer = new this._BitrateTimer()),
          (this._progress.loaded = this._progress.total = 0),
          (this._progress.bitrate = 0));
        this._initResponseObject(t);
        this._initProgressObject(t);
        t._progress.loaded = t.loaded = t.uploadedBytes || 0;
        t._progress.total = t.total = this._getTotal(t.files) || 1;
        t._progress.bitrate = t.bitrate = 0;
        this._active += 1;
        this._progress.loaded += t.loaded;
        this._progress.total += t.total;
      },
      _onDone: function (t, i, r, u) {
        var f = u._progress.total,
          e = u._response;
        u._progress.loaded < f &&
          this._onProgress(
            n.Event("progress", { lengthComputable: !0, loaded: f, total: f }),
            u
          );
        e.result = u.result = t;
        e.textStatus = u.textStatus = i;
        e.jqXHR = u.jqXHR = r;
        this._trigger("done", null, u);
      },
      _onFail: function (n, t, i, r) {
        var u = r._response;
        r.recalculateProgress &&
          ((this._progress.loaded -= r._progress.loaded),
          (this._progress.total -= r._progress.total));
        u.jqXHR = r.jqXHR = n;
        u.textStatus = r.textStatus = t;
        u.errorThrown = r.errorThrown = i;
        this._trigger("fail", null, r);
      },
      _onAlways: function (n, t, i, r) {
        this._trigger("always", null, r);
      },
      _onSend: function (t, i) {
        i.submit || this._addConvenienceMethods(t, i);
        var r = this,
          o,
          s,
          f,
          h,
          u = r._getAJAXSettings(i),
          e = function () {
            return (
              (r._sending += 1),
              (u._bitrateTimer = new r._BitrateTimer()),
              (o =
                o ||
                (
                  ((s ||
                    r._trigger(
                      "send",
                      n.Event("send", { delegatedEvent: t }),
                      u
                    ) === !1) &&
                    r._getXHRPromise(!1, u.context, s)) ||
                  r._chunkedUpload(u) ||
                  n.ajax(u)
                )
                  .done(function (n, t, i) {
                    r._onDone(n, t, i, u);
                  })
                  .fail(function (n, t, i) {
                    r._onFail(n, t, i, u);
                  })
                  .always(function (n, t, i) {
                    if (
                      (r._onAlways(n, t, i, u),
                      (r._sending -= 1),
                      (r._active -= 1),
                      u.limitConcurrentUploads &&
                        u.limitConcurrentUploads > r._sending)
                    )
                      for (var f = r._slots.shift(); f; ) {
                        if (r._getDeferredState(f) === "pending") {
                          f.resolve();
                          break;
                        }
                        f = r._slots.shift();
                      }
                    r._active === 0 && r._trigger("stop");
                  }))
            );
          };
        return (this._beforeSend(t, u),
        this.options.sequentialUploads ||
          (this.options.limitConcurrentUploads &&
            this.options.limitConcurrentUploads <= this._sending))
          ? (this.options.limitConcurrentUploads > 1
              ? ((f = n.Deferred()), this._slots.push(f), (h = f.then(e)))
              : ((this._sequence = this._sequence.then(e, e)),
                (h = this._sequence)),
            (h.abort = function () {
              return ((s = [undefined, "abort", "abort"]), !o)
                ? (f && f.rejectWith(u.context, s), e())
                : o.abort();
            }),
            this._enhancePromise(h))
          : e();
      },
      _onAdd: function (t, i) {
        var a = this,
          w = !0,
          f = n.extend({}, this.options, i),
          u = i.files,
          v = u.length,
          o = f.limitMultiFileUploads,
          c = f.limitMultiFileUploadSize,
          b = f.limitMultiFileUploadSizeOverhead,
          p = 0,
          l = this._getParamName(f),
          s,
          e,
          h,
          r,
          y = 0;
        if (!v) return !1;
        if (
          (c && u[0].size === undefined && (c = undefined),
          (f.singleFileUploads || o || c) && this._isXHRUpload(f))
        )
          if (f.singleFileUploads || c || !o)
            if (!f.singleFileUploads && c)
              for (h = [], s = [], r = 0; r < v; r = r + 1)
                (p += u[r].size + b),
                  (r + 1 === v ||
                    p + u[r + 1].size + b > c ||
                    (o && r + 1 - y >= o)) &&
                    (h.push(u.slice(y, r + 1)),
                    (e = l.slice(y, r + 1)),
                    e.length || (e = l),
                    s.push(e),
                    (y = r + 1),
                    (p = 0));
            else s = l;
          else
            for (h = [], s = [], r = 0; r < v; r += o)
              h.push(u.slice(r, r + o)),
                (e = l.slice(r, r + o)),
                e.length || (e = l),
                s.push(e);
        else (h = [u]), (s = [l]);
        return (
          (i.originalFiles = u),
          n.each(h || u, function (r, u) {
            var f = n.extend({}, i);
            return (
              (f.files = h ? u : [u]),
              (f.paramName = s[r]),
              a._initResponseObject(f),
              a._initProgressObject(f),
              a._addConvenienceMethods(t, f),
              (w = a._trigger("add", n.Event("add", { delegatedEvent: t }), f))
            );
          }),
          w
        );
      },
      _replaceFileInput: function (t) {
        var i = t.fileInput,
          r = i.clone(!0),
          u = i.is(document.activeElement);
        t.fileInputClone = r;
        n("<form></form>").append(r)[0].reset();
        i.after(r).detach();
        u && r.focus();
        n.cleanData(i.unbind("remove"));
        this.options.fileInput = this.options.fileInput.map(function (n, t) {
          return t === i[0] ? r[0] : t;
        });
        i[0] === this.element[0] && (this.element = r);
      },
      _handleFileTreeEntry: function (t, i) {
        var s = this,
          r = n.Deferred(),
          u = function (n) {
            n && !n.entry && (n.entry = t);
            r.resolve([n]);
          },
          h = function (n) {
            s._handleFileTreeEntries(n, i + t.name + "/")
              .done(function (n) {
                r.resolve(n);
              })
              .fail(u);
          },
          e = function () {
            o.readEntries(function (n) {
              n.length ? ((f = f.concat(n)), e()) : h(f);
            }, u);
          },
          o,
          f = [];
        return (
          (i = i || ""),
          t.isFile
            ? t._file
              ? ((t._file.relativePath = i), r.resolve(t._file))
              : t.file(function (n) {
                  n.relativePath = i;
                  r.resolve(n);
                }, u)
            : t.isDirectory
            ? ((o = t.createReader()), e())
            : r.resolve([]),
          r.promise()
        );
      },
      _handleFileTreeEntries: function (t, i) {
        var r = this;
        return n.when
          .apply(
            n,
            n.map(t, function (n) {
              return r._handleFileTreeEntry(n, i);
            })
          )
          .then(function () {
            return Array.prototype.concat.apply([], arguments);
          });
      },
      _getDroppedFiles: function (t) {
        t = t || {};
        var i = t.items;
        return i && i.length && (i[0].webkitGetAsEntry || i[0].getAsEntry)
          ? this._handleFileTreeEntries(
              n.map(i, function (n) {
                var t;
                return n.webkitGetAsEntry
                  ? ((t = n.webkitGetAsEntry()),
                    t && (t._file = n.getAsFile()),
                    t)
                  : n.getAsEntry();
              })
            )
          : n.Deferred().resolve(n.makeArray(t.files)).promise();
      },
      _getSingleFileInputFiles: function (t) {
        t = n(t);
        var r = t.prop("webkitEntries") || t.prop("entries"),
          i,
          u;
        if (r && r.length) return this._handleFileTreeEntries(r);
        if (((i = n.makeArray(t.prop("files"))), i.length))
          i[0].name === undefined &&
            i[0].fileName &&
            n.each(i, function (n, t) {
              t.name = t.fileName;
              t.size = t.fileSize;
            });
        else {
          if (((u = t.prop("value")), !u))
            return n.Deferred().resolve([]).promise();
          i = [{ name: u.replace(/^.*\\/, "") }];
        }
        return n.Deferred().resolve(i).promise();
      },
      _getFileInputFiles: function (t) {
        return !(t instanceof n) || t.length === 1
          ? this._getSingleFileInputFiles(t)
          : n.when
              .apply(n, n.map(t, this._getSingleFileInputFiles))
              .then(function () {
                return Array.prototype.concat.apply([], arguments);
              });
      },
      _onChange: function (t) {
        var r = this,
          i = { fileInput: n(t.target), form: n(t.target.form) };
        this._getFileInputFiles(i.fileInput).always(function (u) {
          i.files = u;
          r.options.replaceFileInput && r._replaceFileInput(i);
          r._trigger("change", n.Event("change", { delegatedEvent: t }), i) !==
            !1 && r._onAdd(t, i);
        });
      },
      _onPaste: function (t) {
        var i =
            t.originalEvent &&
            t.originalEvent.clipboardData &&
            t.originalEvent.clipboardData.items,
          r = { files: [] };
        i &&
          i.length &&
          (n.each(i, function (n, t) {
            var i = t.getAsFile && t.getAsFile();
            i && r.files.push(i);
          }),
          this._trigger("paste", n.Event("paste", { delegatedEvent: t }), r) !==
            !1 && this._onAdd(t, r));
      },
      _onDrop: function (t) {
        t.dataTransfer = t.originalEvent && t.originalEvent.dataTransfer;
        var u = this,
          i = t.dataTransfer,
          r = {};
        i &&
          i.files &&
          i.files.length &&
          (t.preventDefault(),
          this._getDroppedFiles(i).always(function (i) {
            r.files = i;
            u._trigger("drop", n.Event("drop", { delegatedEvent: t }), r) !==
              !1 && u._onAdd(t, r);
          }));
      },
      _onDragOver: t("dragover"),
      _onDragEnter: t("dragenter"),
      _onDragLeave: t("dragleave"),
      _initEventHandlers: function () {
        this._isXHRUpload(this.options) &&
          (this._on(this.options.dropZone, {
            dragover: this._onDragOver,
            drop: this._onDrop,
            dragenter: this._onDragEnter,
            dragleave: this._onDragLeave,
          }),
          this._on(this.options.pasteZone, { paste: this._onPaste }));
        n.support.fileInput &&
          this._on(this.options.fileInput, { change: this._onChange });
      },
      _destroyEventHandlers: function () {
        this._off(this.options.dropZone, "dragenter dragleave dragover drop");
        this._off(this.options.pasteZone, "paste");
        this._off(this.options.fileInput, "change");
      },
      _setOption: function (t, i) {
        var r = n.inArray(t, this._specialOptions) !== -1;
        r && this._destroyEventHandlers();
        this._super(t, i);
        r && (this._initSpecialOptions(), this._initEventHandlers());
      },
      _initSpecialOptions: function () {
        var t = this.options;
        t.fileInput === undefined
          ? (t.fileInput = this.element.is('input[type="file"]')
              ? this.element
              : this.element.find('input[type="file"]'))
          : t.fileInput instanceof n || (t.fileInput = n(t.fileInput));
        t.dropZone instanceof n || (t.dropZone = n(t.dropZone));
        t.pasteZone instanceof n || (t.pasteZone = n(t.pasteZone));
      },
      _getRegExp: function (n) {
        var t = n.split("/"),
          i = t.pop();
        return t.shift(), new RegExp(t.join("/"), i);
      },
      _isRegExpOption: function (t, i) {
        return (
          t !== "url" && n.type(i) === "string" && /^\/.*\/[igm]{0,3}$/.test(i)
        );
      },
      _initDataAttributes: function () {
        var t = this,
          i = this.options,
          r = this.element.data();
        n.each(this.element[0].attributes, function (n, u) {
          var f = u.name.toLowerCase(),
            e;
          /^data-/.test(f) &&
            ((f = f.slice(5).replace(/-[a-z]/g, function (n) {
              return n.charAt(1).toUpperCase();
            })),
            (e = r[f]),
            t._isRegExpOption(f, e) && (e = t._getRegExp(e)),
            (i[f] = e));
        });
      },
      _create: function () {
        this._initDataAttributes();
        this._initSpecialOptions();
        this._slots = [];
        this._sequence = this._getXHRPromise(!0);
        this._sending = this._active = 0;
        this._initProgressObject(this);
        this._initEventHandlers();
      },
      active: function () {
        return this._active;
      },
      progress: function () {
        return this._progress;
      },
      add: function (t) {
        var i = this;
        t &&
          !this.options.disabled &&
          (t.fileInput && !t.files
            ? this._getFileInputFiles(t.fileInput).always(function (n) {
                t.files = n;
                i._onAdd(null, t);
              })
            : ((t.files = n.makeArray(t.files)), this._onAdd(null, t)));
      },
      send: function (t) {
        if (t && !this.options.disabled) {
          if (t.fileInput && !t.files) {
            var e = this,
              i = n.Deferred(),
              u = i.promise(),
              r,
              f;
            return (
              (u.abort = function () {
                return ((f = !0), r)
                  ? r.abort()
                  : (i.reject(null, "abort", "abort"), u);
              }),
              this._getFileInputFiles(t.fileInput).always(function (n) {
                if (!f) {
                  if (!n.length) {
                    i.reject();
                    return;
                  }
                  t.files = n;
                  r = e._onSend(null, t);
                  r.then(
                    function (n, t, r) {
                      i.resolve(n, t, r);
                    },
                    function (n, t, r) {
                      i.reject(n, t, r);
                    }
                  );
                }
              }),
              this._enhancePromise(u)
            );
          }
          if (((t.files = n.makeArray(t.files)), t.files.length))
            return this._onSend(null, t);
        }
        return this._getXHRPromise(!1, t && t.context);
      },
    });
  }),
  (function (n) {
    "use strict";
    typeof define == "function" && define.amd
      ? define(["jquery", "./jquery.fileupload"], n)
      : typeof exports == "object"
      ? n(require("jquery"))
      : n(window.jQuery);
  })(function (n) {
    "use strict";
    var t = n.blueimp.fileupload.prototype.options.add;
    n.widget("blueimp.fileupload", n.blueimp.fileupload, {
      options: {
        processQueue: [],
        add: function (i, r) {
          var u = n(this);
          r.process(function () {
            return u.fileupload("process", r);
          });
          t.call(this, i, r);
        },
      },
      processActions: {},
      _processFile: function (t, i) {
        var r = this,
          f = n.Deferred().resolveWith(r, [t]),
          u = f.promise();
        return (
          this._trigger("process", null, t),
          n.each(t.processQueue, function (t, f) {
            var e = function (t) {
              return i.errorThrown
                ? n.Deferred().rejectWith(r, [i]).promise()
                : r.processActions[f.action].call(r, t, f);
            };
            u = u.then(e, f.always && e);
          }),
          u
            .done(function () {
              r._trigger("processdone", null, t);
              r._trigger("processalways", null, t);
            })
            .fail(function () {
              r._trigger("processfail", null, t);
              r._trigger("processalways", null, t);
            }),
          u
        );
      },
      _transformProcessQueue: function (t) {
        var i = [];
        n.each(t.processQueue, function () {
          var r = {},
            f = this.action,
            u = this.prefix === !0 ? f : this.prefix;
          n.each(this, function (i, f) {
            r[i] =
              n.type(f) === "string" && f.charAt(0) === "@"
                ? t[
                    f.slice(1) ||
                      (u ? u + i.charAt(0).toUpperCase() + i.slice(1) : i)
                  ]
                : f;
          });
          i.push(r);
        });
        t.processQueue = i;
      },
      processing: function () {
        return this._processing;
      },
      process: function (t) {
        var i = this,
          r = n.extend({}, this.options, t);
        return (
          r.processQueue &&
            r.processQueue.length &&
            (this._transformProcessQueue(r),
            this._processing === 0 && this._trigger("processstart"),
            n.each(t.files, function (u) {
              var f = u ? n.extend({}, r) : r,
                e = function () {
                  return t.errorThrown
                    ? n.Deferred().rejectWith(i, [t]).promise()
                    : i._processFile(f, t);
                };
              f.index = u;
              i._processing += 1;
              i._processingQueue = i._processingQueue
                .then(e, e)
                .always(function () {
                  i._processing -= 1;
                  i._processing === 0 && i._trigger("processstop");
                });
            })),
          this._processingQueue
        );
      },
      _create: function () {
        this._super();
        this._processing = 0;
        this._processingQueue = n.Deferred().resolveWith(this).promise();
      },
    });
  }),
  (function (n) {
    "use strict";
    typeof define == "function" && define.amd
      ? define(
          [
            "jquery",
            "load-image",
            "load-image-meta",
            "load-image-exif",
            "canvas-to-blob",
            "./jquery.fileupload-process",
          ],
          n
        )
      : typeof exports == "object"
      ? n(
          require("jquery"),
          require("blueimp-load-image/js/load-image"),
          require("blueimp-load-image/js/load-image-meta"),
          require("blueimp-load-image/js/load-image-exif"),
          require("blueimp-canvas-to-blob"),
          require("./jquery.fileupload-process")
        )
      : n(window.jQuery, window.loadImage);
  })(function (n, t) {
    "use strict";
    n.blueimp.fileupload.prototype.options.processQueue.unshift(
      {
        action: "loadImageMetaData",
        disableImageHead: "@",
        disableExif: "@",
        disableExifThumbnail: "@",
        disableExifSub: "@",
        disableExifGps: "@",
        disabled: "@disableImageMetaDataLoad",
      },
      {
        action: "loadImage",
        prefix: !0,
        fileTypes: "@",
        maxFileSize: "@",
        noRevoke: "@",
        disabled: "@disableImageLoad",
      },
      {
        action: "resizeImage",
        prefix: "image",
        maxWidth: "@",
        maxHeight: "@",
        minWidth: "@",
        minHeight: "@",
        crop: "@",
        orientation: "@",
        forceResize: "@",
        disabled: "@disableImageResize",
      },
      {
        action: "saveImage",
        quality: "@imageQuality",
        type: "@imageType",
        disabled: "@disableImageResize",
      },
      { action: "saveImageMetaData", disabled: "@disableImageMetaDataSave" },
      {
        action: "resizeImage",
        prefix: "preview",
        maxWidth: "@",
        maxHeight: "@",
        minWidth: "@",
        minHeight: "@",
        crop: "@",
        orientation: "@",
        thumbnail: "@",
        canvas: "@",
        disabled: "@disableImagePreview",
      },
      {
        action: "setImage",
        name: "@imagePreviewName",
        disabled: "@disableImagePreview",
      },
      {
        action: "deleteImageReferences",
        disabled: "@disableImageReferencesDeletion",
      }
    );
    n.widget("blueimp.fileupload", n.blueimp.fileupload, {
      options: {
        loadImageFileTypes: /^image\/(gif|jpeg|png|svg\+xml)$/,
        loadImageMaxFileSize: 1e7,
        imageMaxWidth: 1920,
        imageMaxHeight: 1080,
        imageOrientation: !1,
        imageCrop: !1,
        disableImageResize: !0,
        previewMaxWidth: 80,
        previewMaxHeight: 80,
        previewOrientation: !0,
        previewThumbnail: !0,
        previewCrop: !1,
        previewCanvas: !0,
      },
      processActions: {
        loadImage: function (i, r) {
          if (r.disabled) return i;
          var e = this,
            u = i.files[i.index],
            f = n.Deferred();
          return (n.type(r.maxFileSize) === "number" &&
            u.size > r.maxFileSize) ||
            (r.fileTypes && !r.fileTypes.test(u.type)) ||
            !t(
              u,
              function (n) {
                n.src && (i.img = n);
                f.resolveWith(e, [i]);
              },
              r
            )
            ? i
            : f.promise();
        },
        resizeImage: function (i, r) {
          if (r.disabled || !(i.canvas || i.img)) return i;
          r = n.extend({ canvas: !0 }, r);
          var s = this,
            f = n.Deferred(),
            u = (r.canvas && i.canvas) || i.img,
            o = function (n) {
              n &&
                (n.width !== u.width ||
                  n.height !== u.height ||
                  r.forceResize) &&
                (i[n.getContext ? "canvas" : "img"] = n);
              i.preview = n;
              f.resolveWith(s, [i]);
            },
            e;
          if (i.exif) {
            if (
              (r.orientation === !0 &&
                (r.orientation = i.exif.get("Orientation")),
              r.thumbnail && ((e = i.exif.get("Thumbnail")), e))
            )
              return t(e, o, r), f.promise();
            i.orientation
              ? delete r.orientation
              : (i.orientation = r.orientation);
          }
          return u ? (o(t.scale(u, r)), f.promise()) : i;
        },
        saveImage: function (t, i) {
          if (!t.canvas || i.disabled) return t;
          var f = this,
            r = t.files[t.index],
            u = n.Deferred();
          if (t.canvas.toBlob)
            t.canvas.toBlob(
              function (n) {
                n.name ||
                  (r.type === n.type
                    ? (n.name = r.name)
                    : r.name &&
                      (n.name = r.name.replace(
                        /\.\w+$/,
                        "." + n.type.substr(6)
                      )));
                r.type !== n.type && delete t.imageHead;
                t.files[t.index] = n;
                u.resolveWith(f, [t]);
              },
              i.type || r.type,
              i.quality
            );
          else return t;
          return u.promise();
        },
        loadImageMetaData: function (i, r) {
          if (r.disabled) return i;
          var f = this,
            u = n.Deferred();
          return (
            t.parseMetaData(
              i.files[i.index],
              function (t) {
                n.extend(i, t);
                u.resolveWith(f, [i]);
              },
              r
            ),
            u.promise()
          );
        },
        saveImageMetaData: function (n, t) {
          if (!(n.imageHead && n.canvas && n.canvas.toBlob && !t.disabled))
            return n;
          var i = n.files[n.index],
            r = new Blob([n.imageHead, this._blobSlice.call(i, 20)], {
              type: i.type,
            });
          return (r.name = i.name), (n.files[n.index] = r), n;
        },
        setImage: function (n, t) {
          return (
            n.preview &&
              !t.disabled &&
              (n.files[n.index][t.name || "preview"] = n.preview),
            n
          );
        },
        deleteImageReferences: function (n, t) {
          return (
            t.disabled ||
              (delete n.img,
              delete n.canvas,
              delete n.preview,
              delete n.imageHead),
            n
          );
        },
      },
    });
  }),
  (function (n) {
    "use strict";
    typeof define == "function" && define.amd
      ? define(["jquery", "load-image", "./jquery.fileupload-process"], n)
      : typeof exports == "object"
      ? n(require("jquery"), require("load-image"))
      : n(window.jQuery, window.loadImage);
  })(function (n, t) {
    "use strict";
    n.blueimp.fileupload.prototype.options.processQueue.unshift(
      {
        action: "loadAudio",
        prefix: !0,
        fileTypes: "@",
        maxFileSize: "@",
        disabled: "@disableAudioPreview",
      },
      {
        action: "setAudio",
        name: "@audioPreviewName",
        disabled: "@disableAudioPreview",
      }
    );
    n.widget("blueimp.fileupload", n.blueimp.fileupload, {
      options: { loadAudioFileTypes: /^audio\/.*$/ },
      _audioElement: document.createElement("audio"),
      processActions: {
        loadAudio: function (i, r) {
          if (r.disabled) return i;
          var u = i.files[i.index],
            e,
            f;
          return this._audioElement.canPlayType &&
            this._audioElement.canPlayType(u.type) &&
            (n.type(r.maxFileSize) !== "number" || u.size <= r.maxFileSize) &&
            (!r.fileTypes || r.fileTypes.test(u.type)) &&
            ((e = t.createObjectURL(u)), e)
            ? ((f = this._audioElement.cloneNode(!1)),
              (f.src = e),
              (f.controls = !0),
              (i.audio = f),
              i)
            : i;
        },
        setAudio: function (n, t) {
          return (
            n.audio &&
              !t.disabled &&
              (n.files[n.index][t.name || "preview"] = n.audio),
            n
          );
        },
      },
    });
  }),
  (function (n) {
    "use strict";
    typeof define == "function" && define.amd
      ? define(["jquery", "load-image", "./jquery.fileupload-process"], n)
      : typeof exports == "object"
      ? n(require("jquery"), require("load-image"))
      : n(window.jQuery, window.loadImage);
  })(function (n, t) {
    "use strict";
    n.blueimp.fileupload.prototype.options.processQueue.unshift(
      {
        action: "loadVideo",
        prefix: !0,
        fileTypes: "@",
        maxFileSize: "@",
        disabled: "@disableVideoPreview",
      },
      {
        action: "setVideo",
        name: "@videoPreviewName",
        disabled: "@disableVideoPreview",
      }
    );
    n.widget("blueimp.fileupload", n.blueimp.fileupload, {
      options: { loadVideoFileTypes: /^video\/.*$/ },
      _videoElement: document.createElement("video"),
      processActions: {
        loadVideo: function (i, r) {
          if (r.disabled) return i;
          var u = i.files[i.index],
            e,
            f;
          return this._videoElement.canPlayType &&
            this._videoElement.canPlayType(u.type) &&
            (n.type(r.maxFileSize) !== "number" || u.size <= r.maxFileSize) &&
            (!r.fileTypes || r.fileTypes.test(u.type)) &&
            ((e = t.createObjectURL(u)), e)
            ? ((f = this._videoElement.cloneNode(!1)),
              (f.src = e),
              (f.controls = !0),
              (i.video = f),
              i)
            : i;
        },
        setVideo: function (n, t) {
          return (
            n.video &&
              !t.disabled &&
              (n.files[n.index][t.name || "preview"] = n.video),
            n
          );
        },
      },
    });
  }),
  (function (n) {
    "use strict";
    typeof define == "function" && define.amd
      ? define(["jquery", "./jquery.fileupload-process"], n)
      : typeof exports == "object"
      ? n(require("jquery"))
      : n(window.jQuery);
  })(function (n) {
    "use strict";
    n.blueimp.fileupload.prototype.options.processQueue.push({
      action: "validate",
      always: !0,
      acceptFileTypes: "@",
      maxFileSize: "@",
      minFileSize: "@",
      maxNumberOfFiles: "@",
      disabled: "@disableValidation",
    });
    n.widget("blueimp.fileupload", n.blueimp.fileupload, {
      options: {
        getNumberOfFiles: n.noop,
        messages: {
          maxNumberOfFiles: "Maximum number of files exceeded",
          acceptFileTypes: "File type not allowed",
          maxFileSize: "File is too large",
          minFileSize: "File is too small",
        },
      },
      processActions: {
        validate: function (t, i) {
          if (i.disabled) return t;
          var e = n.Deferred(),
            u = this.options,
            r = t.files[t.index],
            f;
          return (
            (i.minFileSize || i.maxFileSize) && (f = r.size),
            n.type(i.maxNumberOfFiles) === "number" &&
            (u.getNumberOfFiles() || 0) + t.files.length > i.maxNumberOfFiles
              ? (r.error = u.i18n("maxNumberOfFiles"))
              : !i.acceptFileTypes ||
                i.acceptFileTypes.test(r.type) ||
                i.acceptFileTypes.test(r.name)
              ? f > i.maxFileSize
                ? (r.error = u.i18n("maxFileSize"))
                : n.type(f) === "number" && f < i.minFileSize
                ? (r.error = u.i18n("minFileSize"))
                : delete r.error
              : (r.error = u.i18n("acceptFileTypes")),
            r.error || t.files.error
              ? ((t.files.error = !0), e.rejectWith(this, [t]))
              : e.resolveWith(this, [t]),
            e.promise()
          );
        },
      },
    });
  });
var interval, refresh;
$(function () {
  "use strict";
  function e() {
    n.length ? (h.show(), s.hide()) : (s.show(), h.hide());
  }
  function l() {
    $("#fileUploadList").empty();
    $("#ticketTextarea").val("");
    $("#ticketTextareaSelector").prop("disabled", !0);
    $("#ticketSubjectsSelector").prop("disabled", !0);
    $("#uploadFilesSection").prop("disabled", !0);
    $("#fileUploadBtn").addClass("inactiveButton");
    $("#fileUploadBtn").prop("disabled", !0);
    $("#fileUploadSubmitError").empty();
    $("#ticketsList option[id='ticketsList_placeholder']").attr(
      "selected",
      "selected"
    );
    $("#ticketSubjectsList option[id='ticketSubjectsList_placeholder']").attr(
      "selected",
      "selected"
    );
    $("#ticketsList").change();
    n = [];
    i = [];
    e();
  }
  function r(n) {
    $("#ticketTextareaSelector").prop("disabled", n);
    $("#uploadFilesSection").prop("disabled", n);
    $("#ticketTextarea").focus();
  }
  var a = function (n, t, i) {
      return (
        '<div class="up file-row" data-i="' +
        n +
        '" id="fileRow' +
        n +
        '"><div class="duplicate float-right"><div class="reg"><span class="up-icon"> </span><div><p><span id="uploadedFileName' +
        n +
        '" class="font-sm-plus" tabindex="0" data-toggle="tooltip" title="' +
        t +
        '">' +
        t.substring(0, 15) +
        (t.length > 15 ? "... | " : " | ") +
        '</span><span id="uploadedFileSize' +
        n +
        '" class="font-sm-plus">' +
        i +
        '</span></p><p><span tabindex="0" class="error-mes upload-err hidd">שגיאה בהעלאת הקובץ</span></p></div></div></div><a id="removeFile' +
        n +
        '" href="javascript:void(0)" class="remove-file font-sm-plus" role="button">הסר</a><a id="tryAgain' +
        n +
        '" href="javascript:void(0)" class="up-2 font-sm-plus upload-err hide ">נסה שנית</a></div>'
      );
    },
    f = $("#progressAttr").data("size") || 1,
    s = $("#popup-upload-file-default"),
    h = $("#popup-upload-file"),
    o,
    t;
  let u = !0;
  $("#ticketsList").change(function () {
    var n = document.querySelector("#ticketsList").selectedOptions[0];
    let t = !0;
    n &&
      n.index != 1 &&
      ((t = !1),
      $("#ticketTextareaSelector").prop("disabled") ||
        (document.querySelector("#ticketSubjectsList").selectedIndex = 1),
      $("#ticketSubjectsList > option").each(function () {
        n && $(this).data("ticketid") != n.value
          ? $(this).prop("disabled", !0).addClass("hide")
          : $(this).prop("disabled", !1).removeClass("hide");
      }));
    $("#ticketSubjectsList").prop("disabled", t);
    $("#ticketSubjectsList").selectpicker("refresh");
  });
  let c;
  $("#ticketSubjectsList").change(function () {
    var f = document.querySelector("#ticketSubjectsList").selectedOptions[0];
    let e = $(f).data("ismedical"),
      i = !0;
    $("#ticketSubjectMedicalMessage").css("visibility", "hidden");
    $('*[data-id="ticketSubjectsList"]').removeClass("row-error-select");
    e != "1" || c
      ? (f && f.index != 1 && (i = !1),
        r(i),
        (!u || n.length) && t.prop("disabled", !1))
      : (r(i),
        $.ajax({
          method: "GET",
          url: "/umbraco/surface/FileUploadSurface/GetOpenMedicalQuestionnaireUrl",
        })
          .done(function (n) {
            n
              ? ($("#ticketSubjectMedicalMessage").css("visibility", "visible"),
                $("#medicalMessageHref").attr("href", n),
                $('*[data-id="ticketSubjectsList"]').addClass(
                  "row-error-select"
                ),
                r(i),
                t.prop("disabled", !0))
              : ((i = !1), r(i));
          })
          .fail(function () {
            i = !1;
            r(i);
          }));
  });
  $("#uploadCompleteModal").on("hide.bs.modal", function () {
    refresh == 1 && location.reload();
    refresh == 0;
  });
  $(document.body).on("click", ".modal-btn", function () {
    var n = this.getAttribute("data-tsav-bareshet-apload-id"),
      r,
      u,
      t,
      i;
    c = this.getAttribute("data-source-type") == "medical";
    n &&
      ((r = !!$("#ticketSubjectsList option").filter(function () {
        return $(this).val() == n;
      }).length),
      r || (n = $("#ticketSubjectsList option.default").val()),
      $("#ticketSubjectsList").removeAttr("selected"),
      $("#ticketsList").removeAttr("selected"),
      $("#ticketSubjectsList").val(n),
      typeof Android != "undefined" && Android.selectionChangCallback(n),
      (u = $("#ticketSubjectsList option:selected").data("ticketid")),
      $("#ticketsList").val(u),
      $("#ticketSubjectsList").prop("disabled", !0),
      $("#ticketsList").prop("disabled", !0),
      $("#ticketSubjectsList").selectpicker("refresh"),
      $("#ticketsList").selectpicker("refresh"),
      $("#ticketSubjectsList").trigger("change"));
    t = this.getAttribute("data-question-code");
    t && $("#questionCode").val(t);
    i = this.getAttribute("group-type");
    i && $("#groupType").val(i);
  });
  $("#sendFileModal")
    .on("shown.bs.modal", function () {
      $("#progress .up").removeClass("error");
      var n = $(this).data(),
        t = n["bs.modal"].options.tsavBareshetAploadId;
      $("#fileUploadBtn").removeClass("inactiveButton");
      $(".progress-bar.duplicate.float-right").css("width", "0%");
    })
    .on("hidden.bs.modal", function () {
      l();
    });
  $("#ticketSubjectsList").on("change", function () {
    $("#fileUploadSubmit").show();
  });
  $("#fileUploadBtn").bind("click", function () {
    typeof Android != "undefined" &&
      (Android.uploadFileClickCallback(),
      (interval = setInterval(function () {
        var n = Android.getFileName();
        n != "" && ($("#fileUploadList").empty(), clearInterval(interval));
      }, 2e3)));
    $("#fileupload").click();
  });
  $("#removeFile").on("click", function () {
    $("#fileUploadBtn").removeClass("inactiveButton");
  });
  o = "/umbraco/surface/FileUploadSurface/FileUpload";
  t = $("#fileUploadSubmit")
    .prop("disabled", typeof Android == "undefined")
    .on("click", function () {
      var f, i, s, h, c, l, a, e, r;
      if (
        (ShowLoader(),
        (f = $(this)),
        (r = f.data()),
        typeof Android != "undefined")
      ) {
        var y = Android.uploadFileSubmit(0),
          t = jQuery.parseJSON(y),
          v = t.base64;
        for (i = 1; i < t.maxPacket; i++)
          (s = Android.uploadFileSubmit(i)),
            (h = jQuery.parseJSON(s)),
            (v += h.base64),
            (c = parseInt((i / t.maxPacket) * 100, 10)),
            $(".duplicate.float-right").css({
              width: c + "%",
              "background-color": "#00a6c7",
              color: "#fff",
            });
        t &&
          $.ajax({
            method: "POST",
            url: "/umbraco/surface/FileUploadSurface/FileUploadForApp",
            data: { file: v, ticketSubjectsList: t.ticket, fileType: t.exec },
          })
            .done(function (n) {
              $(".duplicate.float-right").css({
                width: "100%",
                "background-color": "#00a6c7",
                color: "#fff",
              });
              n &&
                ($("#sendFileModal").modal("hide"),
                $("#uploadCompleteModal").modal("show"));
            })
            .fail(function () {});
      } else {
        if (
          ($("#uploadFileForm").validate(),
          !$("#uploadFileForm").valid() ||
            $("#ticketSubjectsList").find(":selected").val() == "" ||
            (!n.length && u))
        )
          return (
            $("#ticketSubjectsList").find(":selected").val() == "" &&
              ($(".error-mes.upload-err").empty(),
              $(".error-mes.upload-err").text(
                $("#progressAttr").data("nosubjectselectederror")
              ),
              $(".upload-err").show()),
            HideLoader(),
            !1
          );
        l = $("#ticketsList").prop("disabled");
        a = $("#ticketSubjectsList").prop("disabled");
        $("#ticketsList").prop("disabled", !1);
        $("#ticketSubjectsList").prop("disabled", !1);
        e = n.length
          ? $("form#uploadFileForm").serializeArray()
          : $("#uploadFileForm").serialize();
        $("#ticketsList").prop("disabled", l);
        $("#ticketSubjectsList").prop("disabled", a);
        n.length
          ? ((r.formData = e),
            r.submit().always(function () {
              HideLoader();
              f.attr("disabled", "disabled");
              $("#progress").find(".up-2").focus();
            }))
          : ((r = e),
            $.ajax({ type: "POST", url: o, data: r })
              .done(function (n) {
                HideLoader();
                n != ""
                  ? $("#fileUploadSubmitError")
                      .empty()
                      .text($("#progressAttr").data("textuploaderror"))
                  : (f.attr("disabled", "disabled"),
                    $("#progress").find(".up-2").focus(),
                    $("#sendFileModal").modal("toggle"),
                    $("#uploadCompleteModal").modal("show"));
              })
              .fail(function (n) {
                HideLoader();
                console.log(n.statusText);
                $("#fileUploadSubmitError")
                  .empty()
                  .text($("#progressAttr").data("fileuploaderror"));
              }));
      }
    });
  $("#ticketSubjectsList").change(function () {
    typeof Android != "undefined" &&
      Android.selectionChangCallback($(this).val());
    $("#fileUploadSubmit").data().formData = $(
      "form#uploadFileForm"
    ).serializeArray();
  });
  let n = [],
    i = [];
  $("#fileupload")
    .fileupload({
      url: o,
      dataType: "json",
      autoUpload: !1,
      acceptFileTypes: /(\.|\/)(pdf|gif|jpe?g|png|tif|tiff)$/i,
      maxFileSize: $("#maxFileSizeKB").val() * 1024,
      minFileSize: 1,
      singleFileUploads: !1,
    })
    .on("fileuploadadd", function (r, o) {
      var c = ($("#fileUploadList .up").length || 0) + 1,
        s,
        h,
        l;
      if (c <= f) {
        o.files[0].size / 1024 >= 0 && o.files[0].size / 1048576 < 1
          ? ((s = (o.files[0].size / 1024).toFixed(2)), (h = "KB"))
          : o.files[0].size / 1048576 > 0 &&
            ((s = (o.files[0].size / 1048576).toFixed(2)), (h = "MB"));
        l = a(c, o.files[0].name, s + h);
        $("#fileUploadList").append(l);
        $(".remove-file").on("click", function () {
          var r = $(this).parent().data("i"),
            s;
          $(this).parent().remove();
          s = $("#fileUploadList .up").length;
          !$("#fileUploadList .file-row").length && u && t.prop("disabled", !0);
          s <= f && $("#fileUploadBtn").removeClass("inactiveButton");
          $("#fileUploadList .file-row").each(function () {
            var n = $(this).data("i");
            n > r && $(this).data("i", n - 1);
          });
          n.splice((r || 0) - 1, 1);
          i.splice((r || 0) - 1, 1);
          o.files = [...n];
          o.paramName = [...i];
          t.data(o);
          e();
        });
        t[0].style.display === "none" &&
          setTimeout(function () {
            $(".progress-bar").removeClass("progress-bar-error-bg");
            t.show();
          }, 600);
        n.push(o.files[0]);
        i.push(r.delegatedEvent.target.name);
        o.files = [...n];
        o.paramName = [...i];
        t.data(o);
      }
    })
    .on("fileuploadprocessalways", function (r, u) {
      var o = $("#fileUploadList .up").length,
        c = u.index,
        s = u.files[o - 1],
        h;
      if (s.error) {
        $("#fileRow" + o + " .error-mes.upload-err").empty();
        $("#fileRow" + o + " #tryAgain" + o).removeClass("hide");
        h =
          s.size / 1024 > $("#maxFileSizeKB").data("maxfile")
            ? $("#progressAttr").data("filesizeerror")
            : $("#progressAttr").data("filetypeerror");
        $("#fileRow" + o + " .error-mes.upload-err")
          .text(h)
          .show();
        $("#progress .up").last().addClass("error");
        $(".up-2.upload-err").on("click", function () {
          var n = $(this).closest(".up.file-row"),
            t = n.data("i");
          $("#fileUploadList #fileRow" + t).remove();
          $("#fileupload").click();
        });
        n.splice((o || 0) - 1, 1);
        i.splice((o || 0) - 1, 1);
        u.files = [...n];
        u.paramName = [...i];
        t.data(u);
      }
      e();
      c + 1 === u.files.length && t.prop("disabled", !!s.error);
      o === f || s.error
        ? $("#fileUploadBtn").addClass("inactiveButton")
        : o < f && $("#fileUploadBtn").removeClass("inactiveButton");
    })
    .on("fileuploadprogressall", function (n, t) {
      var i = parseInt((t.loaded / t.total) * 100, 10);
      $("#progress .progress-bar").css(
        "width",
        i + "%",
        "background-color",
        "transparent"
      );
    })
    .on("fileuploaddone", function () {
      $("#sendFileModal").modal("toggle");
      setTimeout(function () {
        $("#uploadCompleteModal").modal("show");
      }, 400);
    })
    .on("fileuploadfail", function (r, u) {
      var e = $("#fileUploadList .up").length,
        f = $(this).parent().data("i");
      $("#fileUploadSubmitError")
        .empty()
        .text($("#progressAttr").data("fileuploaderror"));
      $("#fileUploadBtn").addClass("inactiveButton");
      n.splice((f || 0) - 1, 1);
      i.splice((f || 0) - 1, 1);
      u.files = [...n];
      u.paramName = [...i];
      t.data(u);
    })
    .prop("disabled", !$.support.fileInput)
    .parent()
    .addClass($.support.fileInput ? undefined : "disabled");
  $("#ticketTextarea").on("input", function () {
    u = $(this).val().length != 0 ? !1 : !0;
    t.prop("disabled", u);
  });
}),
  (function (n) {
    "use strict";
    function i(t) {
      return (
        n.each(
          [
            { re: /[\xC0-\xC6]/g, ch: "A" },
            { re: /[\xE0-\xE6]/g, ch: "a" },
            { re: /[\xC8-\xCB]/g, ch: "E" },
            { re: /[\xE8-\xEB]/g, ch: "e" },
            { re: /[\xCC-\xCF]/g, ch: "I" },
            { re: /[\xEC-\xEF]/g, ch: "i" },
            { re: /[\xD2-\xD6]/g, ch: "O" },
            { re: /[\xF2-\xF6]/g, ch: "o" },
            { re: /[\xD9-\xDC]/g, ch: "U" },
            { re: /[\xF9-\xFC]/g, ch: "u" },
            { re: /[\xC7-\xE7]/g, ch: "c" },
            { re: /[\xD1]/g, ch: "N" },
            { re: /[\xF1]/g, ch: "n" },
          ],
          function () {
            t = t.replace(this.re, this.ch);
          }
        ),
        t
      );
    }
    function r(n) {
      var i = {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#x27;",
          "`": "&#x60;",
        },
        r = "(?:" + Object.keys(i).join("|") + ")",
        u = new RegExp(r),
        f = new RegExp(r, "g"),
        t = n == null ? "" : "" + n;
      return u.test(t)
        ? t.replace(f, function (n) {
            return i[n];
          })
        : t;
    }
    function u(i, r) {
      var e = arguments,
        u = i,
        s = r,
        f,
        o;
      return (
        [].shift.apply(e),
        (o = this.each(function () {
          var o = n(this),
            i,
            r,
            c,
            h;
          if (o.is("select")) {
            if (
              ((i = o.data("selectpicker")), (r = typeof u == "object" && u), i)
            ) {
              if (r) for (h in r) r.hasOwnProperty(h) && (i.options[h] = r[h]);
            } else
              (c = n.extend(
                {},
                t.DEFAULTS,
                n.fn.selectpicker.defaults || {},
                o.data(),
                r
              )),
                (c.template = n.extend(
                  {},
                  t.DEFAULTS.template,
                  n.fn.selectpicker.defaults
                    ? n.fn.selectpicker.defaults.template
                    : {},
                  o.data().template,
                  r.template
                )),
                o.data("selectpicker", (i = new t(this, c, s)));
            typeof u == "string" &&
              (f = i[u] instanceof Function ? i[u].apply(i, e) : i.options[u]);
          }
        })),
        typeof f != "undefined" ? f : o
      );
    }
    var t, f;
    String.prototype.includes ||
      (function () {
        var i = {}.toString,
          n = (function () {
            try {
              var n = {},
                t = Object.defineProperty,
                i = t(n, n, n) && t;
            } catch (r) {}
            return i;
          })(),
          r = "".indexOf,
          t = function (n) {
            var u, f;
            if (this == null) throw new TypeError();
            if (((u = String(this)), n && i.call(n) == "[object RegExp]"))
              throw new TypeError();
            var e = u.length,
              o = String(n),
              h = o.length,
              s = arguments.length > 1 ? arguments[1] : undefined,
              t = s ? Number(s) : 0;
            return (t != t && (t = 0),
            (f = Math.min(Math.max(t, 0), e)),
            h + f > e)
              ? !1
              : r.call(u, o, t) != -1;
          };
        n
          ? n(String.prototype, "includes", {
              value: t,
              configurable: !0,
              writable: !0,
            })
          : (String.prototype.includes = t);
      })();
    String.prototype.startsWith ||
      (function () {
        var n = (function () {
            try {
              var n = {},
                t = Object.defineProperty,
                i = t(n, n, n) && t;
            } catch (r) {}
            return i;
          })(),
          i = {}.toString,
          t = function (n) {
            var u, f, t;
            if (this == null) throw new TypeError();
            if (((u = String(this)), n && i.call(n) == "[object RegExp]"))
              throw new TypeError();
            var e = u.length,
              o = String(n),
              s = o.length,
              h = arguments.length > 1 ? arguments[1] : undefined,
              r = h ? Number(h) : 0;
            if (
              (r != r && (r = 0), (f = Math.min(Math.max(r, 0), e)), s + f > e)
            )
              return !1;
            for (t = -1; ++t < s; )
              if (u.charCodeAt(f + t) != o.charCodeAt(t)) return !1;
            return !0;
          };
        n
          ? n(String.prototype, "startsWith", {
              value: t,
              configurable: !0,
              writable: !0,
            })
          : (String.prototype.startsWith = t);
      })();
    Object.keys ||
      (Object.keys = function (n, t, i) {
        i = [];
        for (t in n) i.hasOwnProperty.call(n, t) && i.push(t);
        return i;
      });
    n.fn.triggerNative = function (n) {
      var i = this[0],
        t;
      i.dispatchEvent
        ? (typeof Event == "function"
            ? (t = new Event(n, { bubbles: !0 }))
            : ((t = document.createEvent("Event")), t.initEvent(n, !0, !1)),
          i.dispatchEvent(t))
        : (i.fireEvent &&
            ((t = document.createEventObject()),
            (t.eventType = n),
            i.fireEvent("on" + n, t)),
          this.trigger(n));
    };
    n.expr[":"].icontains = function (t, i, r) {
      var u = n(t),
        f = (u.data("tokens") || u.text()).toUpperCase();
      return f.includes(r[3].toUpperCase());
    };
    n.expr[":"].ibegins = function (t, i, r) {
      var u = n(t),
        f = (u.data("tokens") || u.text()).toUpperCase();
      return f.startsWith(r[3].toUpperCase());
    };
    n.expr[":"].aicontains = function (t, i, r) {
      var u = n(t),
        f = (
          u.data("tokens") ||
          u.data("normalizedText") ||
          u.text()
        ).toUpperCase();
      return f.includes(r[3].toUpperCase());
    };
    n.expr[":"].aibegins = function (t, i, r) {
      var u = n(t),
        f = (
          u.data("tokens") ||
          u.data("normalizedText") ||
          u.text()
        ).toUpperCase();
      return f.startsWith(r[3].toUpperCase());
    };
    t = function (i, r, u) {
      u && (u.stopPropagation(), u.preventDefault());
      this.$element = n(i);
      this.$newElement = null;
      this.$button = null;
      this.$menu = null;
      this.$lis = null;
      this.options = r;
      this.options.title === null &&
        (this.options.title = this.$element.attr("title"));
      this.val = t.prototype.val;
      this.render = t.prototype.render;
      this.refresh = t.prototype.refresh;
      this.setStyle = t.prototype.setStyle;
      this.selectAll = t.prototype.selectAll;
      this.deselectAll = t.prototype.deselectAll;
      this.destroy = t.prototype.destroy;
      this.remove = t.prototype.remove;
      this.show = t.prototype.show;
      this.hide = t.prototype.hide;
      this.init();
    };
    t.VERSION = "1.10.0";
    t.DEFAULTS = {
      noneSelectedText: "Nothing selected",
      noneResultsText: "No results matched {0}",
      countSelectedText: function (n) {
        return n == 1 ? "{0} item selected" : "{0} items selected";
      },
      maxOptionsText: function (n, t) {
        return [
          n == 1
            ? "Limit reached ({n} item max)"
            : "Limit reached ({n} items max)",
          t == 1
            ? "Group limit reached ({n} item max)"
            : "Group limit reached ({n} items max)",
        ];
      },
      selectAllText: "Select All",
      deselectAllText: "Deselect All",
      doneButton: !1,
      doneButtonText: "Close",
      multipleSeparator: ", ",
      styleBase: "btn",
      style: "btn-default",
      size: "auto",
      title: null,
      selectedTextFormat: "values",
      width: !1,
      container: !1,
      hideDisabled: !1,
      showSubtext: !1,
      showIcon: !0,
      showContent: !0,
      dropupAuto: !0,
      header: !1,
      liveSearch: !1,
      liveSearchPlaceholder: null,
      liveSearchNormalize: !1,
      liveSearchStyle: "contains",
      actionsBox: !1,
      iconBase: "glyphicon",
      tickIcon: "glyphicon-ok",
      showTick: !1,
      template: { caret: '<span class="caret"></span>' },
      maxOptions: !1,
      mobile: !1,
      selectOnTab: !1,
      dropdownAlignRight: !1,
    };
    t.prototype = {
      constructor: t,
      init: function () {
        var t = this,
          i = this.$element.attr("id");
        this.$element.addClass("bs-select-hidden");
        this.liObj = {};
        this.multiple = this.$element.prop("multiple");
        this.autofocus = this.$element.prop("autofocus");
        this.$newElement = this.createView();
        this.$element.after(this.$newElement).appendTo(this.$newElement);
        this.$button = this.$newElement.children("button");
        this.$menu = this.$newElement.children(".dropdown-menu");
        this.$menuInner = this.$menu.children(".inner");
        this.$searchbox = this.$menu.find("input");
        this.$element.removeClass("bs-select-hidden");
        this.options.dropdownAlignRight &&
          this.$menu.addClass("dropdown-menu-right");
        typeof i != "undefined" &&
          (this.$button.attr("data-id", i),
          n('label[for="' + i + '"]').click(function (n) {
            n.preventDefault();
            t.$button.focus();
          }));
        this.checkDisabled();
        this.clickListener();
        this.options.liveSearch && this.liveSearchListener();
        this.render();
        this.setStyle();
        this.setWidth();
        this.options.container && this.selectPosition();
        this.$menu.data("this", this);
        this.$newElement.data("this", this);
        this.options.mobile && this.mobile();
        this.$newElement.on({
          "hide.bs.dropdown": function (n) {
            t.$element.trigger("hide.bs.select", n);
          },
          "hidden.bs.dropdown": function (n) {
            t.$element.trigger("hidden.bs.select", n);
          },
          "show.bs.dropdown": function (n) {
            t.$element.trigger("show.bs.select", n);
          },
          "shown.bs.dropdown": function (n) {
            t.$element.trigger("shown.bs.select", n);
          },
        });
        if (t.$element[0].hasAttribute("required"))
          this.$element.on("invalid", function () {
            t.$button.addClass("bs-invalid").focus();
            t.$element.on({
              "focus.bs.select": function () {
                t.$button.focus();
                t.$element.off("focus.bs.select");
              },
              "shown.bs.select": function () {
                t.$element.val(t.$element.val()).off("shown.bs.select");
              },
              "rendered.bs.select": function () {
                this.validity.valid && t.$button.removeClass("bs-invalid");
                t.$element.off("rendered.bs.select");
              },
            });
          });
        setTimeout(function () {
          t.$element.trigger("loaded.bs.select");
        });
      },
      createDropdown: function () {
        var t = this.multiple || this.options.showTick ? " show-tick" : "",
          i = this.$element.parent().hasClass("input-group")
            ? " input-group-btn"
            : "",
          u = this.autofocus ? " autofocus" : "",
          f = this.options.header
            ? '<div class="popover-title"><button type="button" class="close" aria-hidden="true">&times;</button>' +
              this.options.header +
              "</div>"
            : "",
          e = this.options.liveSearch
            ? '<div class="bs-searchbox"><input type="text" class="form-control" autocomplete="off"' +
              (null === this.options.liveSearchPlaceholder
                ? ""
                : ' placeholder="' +
                  r(this.options.liveSearchPlaceholder) +
                  '"') +
              "></div>"
            : "",
          o =
            this.multiple && this.options.actionsBox
              ? '<div class="bs-actionsbox"><div class="btn-group btn-group-sm btn-block"><button type="button" class="actions-btn bs-select-all btn btn-default">' +
                this.options.selectAllText +
                '</button><button type="button" class="actions-btn bs-deselect-all btn btn-default">' +
                this.options.deselectAllText +
                "</button></div></div>"
              : "",
          s =
            this.multiple && this.options.doneButton
              ? '<div class="bs-donebutton"><div class="btn-group btn-block"><button type="button" class="btn btn-sm btn-default">' +
                this.options.doneButtonText +
                "</button></div></div>"
              : "",
          h =
            '<div class="btn-group bootstrap-select' +
            t +
            i +
            '"><button type="button" class="' +
            this.options.styleBase +
            ' dropdown-toggle" data-toggle="dropdown"' +
            u +
            '><span class="filter-option pull-left"></span>&nbsp;<span class="bs-caret">' +
            this.options.template.caret +
            '</span></button><div class="dropdown-menu open">' +
            f +
            e +
            o +
            '<ul class="dropdown-menu inner" role="menu"></ul>' +
            s +
            "</div></div>";
        return n(h);
      },
      createView: function () {
        var n = this.createDropdown(),
          t = this.createLi();
        return (n.find("ul")[0].innerHTML = t), n;
      },
      reloadLi: function () {
        this.destroyLi();
        var n = this.createLi();
        this.$menuInner[0].innerHTML = n;
      },
      destroyLi: function () {
        this.$menu.find("li").remove();
      },
      createLi: function () {
        var u = this,
          t = [],
          o = 0,
          s = document.createElement("option"),
          f = -1,
          e = function (n, t, i, r) {
            return (
              "<li" +
              ((typeof i != "undefined") & ("" !== i)
                ? ' class="' + i + '"'
                : "") +
              ((typeof t != "undefined") & (null !== t)
                ? ' data-original-index="' + t + '"'
                : "") +
              ((typeof r != "undefined") & (null !== r)
                ? 'data-optgroup="' + r + '"'
                : "") +
              ">" +
              n +
              "</li>"
            );
          },
          c = function (n, t, f, e) {
            return (
              '<a tabindex="0"' +
              (typeof t != "undefined" ? ' class="' + t + '"' : "") +
              (typeof f != "undefined" ? ' style="' + f + '"' : "") +
              (u.options.liveSearchNormalize
                ? ' data-normalized-text="' + i(r(n)) + '"'
                : "") +
              (typeof e != "undefined" || e !== null
                ? ' data-tokens="' + e + '"'
                : "") +
              ">" +
              n +
              '<span class="' +
              u.options.iconBase +
              " " +
              u.options.tickIcon +
              ' check-mark"></span></a>'
            );
          },
          h;
        return (
          this.options.title &&
            !this.multiple &&
            (f--,
            this.$element.find(".bs-title-option").length ||
              ((h = this.$element[0]),
              (s.className = "bs-title-option"),
              s.appendChild(document.createTextNode(this.options.title)),
              (s.value = ""),
              h.insertBefore(s, h.firstChild),
              n(h.options[h.selectedIndex]).attr("selected") === undefined &&
                (s.selected = !0))),
          this.$element.find("option").each(function (i) {
            var r = n(this),
              l;
            if ((f++, !r.hasClass("bs-title-option"))) {
              var a = this.className || "",
                v = this.style.cssText,
                s = r.data("content") ? r.data("content") : r.html(),
                y = r.data("tokens") ? r.data("tokens") : null,
                k =
                  typeof r.data("subtext") != "undefined"
                    ? '<small class="text-muted">' +
                      r.data("subtext") +
                      "</small>"
                    : "",
                h =
                  typeof r.data("icon") != "undefined"
                    ? '<span class="' +
                      u.options.iconBase +
                      " " +
                      r.data("icon") +
                      '"></span> '
                    : "",
                p = this.parentNode.tagName === "OPTGROUP",
                w = this.disabled || (p && this.parentNode.disabled);
              if (
                (h !== "" && w && (h = "<span>" + h + "</span>"),
                u.options.hideDisabled && w && !p)
              ) {
                f--;
                return;
              }
              if (
                (r.data("content") ||
                  (s = h + '<span class="text">' + s + k + "</span>"),
                p && r.data("divider") !== !0)
              ) {
                if (
                  ((l = " " + this.parentNode.className || ""), r.index() === 0)
                ) {
                  o += 1;
                  var b = this.parentNode.label,
                    d =
                      typeof r.parent().data("subtext") != "undefined"
                        ? '<small class="text-muted">' +
                          r.parent().data("subtext") +
                          "</small>"
                        : "",
                    g = r.parent().data("icon")
                      ? '<span class="' +
                        u.options.iconBase +
                        " " +
                        r.parent().data("icon") +
                        '"></span> '
                      : "";
                  b = g + '<span class="text">' + b + d + "</span>";
                  i !== 0 &&
                    t.length > 0 &&
                    (f++, t.push(e("", null, "divider", o + "div")));
                  f++;
                  t.push(e(b, null, "dropdown-header" + l, o));
                }
                if (u.options.hideDisabled && w) {
                  f--;
                  return;
                }
                t.push(e(c(s, "opt " + a + l, v, y), i, "", o));
              } else
                r.data("divider") === !0
                  ? t.push(e("", i, "divider"))
                  : r.data("hidden") === !0
                  ? t.push(e(c(s, a, v, y), i, "hidden is-hidden"))
                  : (this.previousElementSibling &&
                      this.previousElementSibling.tagName === "OPTGROUP" &&
                      (f++, t.push(e("", null, "divider", o + "div"))),
                    t.push(e(c(s, a, v, y), i)));
              u.liObj[i] = f;
            }
          }),
          this.multiple ||
            this.$element.find("option:selected").length !== 0 ||
            this.options.title ||
            this.$element
              .find("option")
              .eq(0)
              .prop("selected", !0)
              .attr("selected", "selected"),
          t.join("")
        );
      },
      findLis: function () {
        return (
          this.$lis == null && (this.$lis = this.$menu.find("li")), this.$lis
        );
      },
      render: function (t) {
        var i = this,
          o,
          r,
          u,
          f,
          e,
          s;
        t !== !1 &&
          this.$element.find("option").each(function (n) {
            var t = i.findLis().eq(i.liObj[n]);
            i.setDisabled(
              n,
              this.disabled ||
                (this.parentNode.tagName === "OPTGROUP" &&
                  this.parentNode.disabled),
              t
            );
            i.setSelected(n, this.selected, t);
          });
        this.tabIndex();
        r = this.$element
          .find("option")
          .map(function () {
            if (this.selected) {
              if (
                i.options.hideDisabled &&
                (this.disabled ||
                  (this.parentNode.tagName === "OPTGROUP" &&
                    this.parentNode.disabled))
              )
                return;
              var t = n(this),
                u =
                  t.data("icon") && i.options.showIcon
                    ? '<i class="' +
                      i.options.iconBase +
                      " " +
                      t.data("icon") +
                      '"></i> '
                    : "",
                r;
              return (
                (r =
                  i.options.showSubtext && t.data("subtext") && !i.multiple
                    ? ' <small class="text-muted">' +
                      t.data("subtext") +
                      "</small>"
                    : ""),
                typeof t.attr("title") != "undefined"
                  ? t.attr("title")
                  : t.data("content") && i.options.showContent
                  ? t.data("content")
                  : u + t.html() + r
              );
            }
          })
          .toArray();
        u = this.multiple ? r.join(this.options.multipleSeparator) : r[0];
        this.multiple &&
          this.options.selectedTextFormat.indexOf("count") > -1 &&
          ((f = this.options.selectedTextFormat.split(">")),
          ((f.length > 1 && r.length > f[1]) ||
            (f.length == 1 && r.length >= 2)) &&
            ((o = this.options.hideDisabled ? ", [disabled]" : ""),
            (e = this.$element
              .find("option")
              .not('[data-divider="true"], [data-hidden="true"]' + o).length),
            (s =
              typeof this.options.countSelectedText == "function"
                ? this.options.countSelectedText(r.length, e)
                : this.options.countSelectedText),
            (u = s
              .replace("{0}", r.length.toString())
              .replace("{1}", e.toString()))));
        this.options.title == undefined &&
          (this.options.title = this.$element.attr("title"));
        this.options.selectedTextFormat == "static" && (u = this.options.title);
        u ||
          (u =
            typeof this.options.title != "undefined"
              ? this.options.title
              : this.options.noneSelectedText);
        this.$button.attr("title", n.trim(u.replace(/<[^>]*>?/g, "")));
        this.$button.children(".filter-option").html(u);
        this.$element.trigger("rendered.bs.select");
      },
      setStyle: function (n, t) {
        this.$element.attr("class") &&
          this.$newElement.addClass(
            this.$element
              .attr("class")
              .replace(
                /selectpicker|mobile-device|bs-select-hidden|validate\[.*\]/gi,
                ""
              )
          );
        var i = n ? n : this.options.style;
        t == "add"
          ? this.$button.addClass(i)
          : t == "remove"
          ? this.$button.removeClass(i)
          : (this.$button.removeClass(this.options.style),
            this.$button.addClass(i));
      },
      liHeight: function (t) {
        var l;
        if (t || (this.options.size !== !1 && !this.sizeInfo)) {
          var e = document.createElement("div"),
            r = document.createElement("div"),
            o = document.createElement("ul"),
            a = document.createElement("li"),
            p = document.createElement("li"),
            v = document.createElement("a"),
            y = document.createElement("span"),
            s =
              this.options.header &&
              this.$menu.find(".popover-title").length > 0
                ? this.$menu.find(".popover-title")[0].cloneNode(!0)
                : null,
            u = this.options.liveSearch ? document.createElement("div") : null,
            h =
              this.options.actionsBox &&
              this.multiple &&
              this.$menu.find(".bs-actionsbox").length > 0
                ? this.$menu.find(".bs-actionsbox")[0].cloneNode(!0)
                : null,
            c =
              this.options.doneButton &&
              this.multiple &&
              this.$menu.find(".bs-donebutton").length > 0
                ? this.$menu.find(".bs-donebutton")[0].cloneNode(!0)
                : null;
          y.className = "text";
          e.className = this.$menu[0].parentNode.className + " open";
          r.className = "dropdown-menu open";
          o.className = "dropdown-menu inner";
          a.className = "divider";
          y.appendChild(document.createTextNode("Inner text"));
          v.appendChild(y);
          p.appendChild(v);
          o.appendChild(p);
          o.appendChild(a);
          s && r.appendChild(s);
          u &&
            ((l = document.createElement("span")),
            (u.className = "bs-searchbox"),
            (l.className = "form-control"),
            u.appendChild(l),
            r.appendChild(u));
          h && r.appendChild(h);
          r.appendChild(o);
          c && r.appendChild(c);
          e.appendChild(r);
          document.body.appendChild(e);
          var b = v.offsetHeight,
            k = s ? s.offsetHeight : 0,
            d = u ? u.offsetHeight : 0,
            g = h ? h.offsetHeight : 0,
            nt = c ? c.offsetHeight : 0,
            tt = n(a).outerHeight(!0),
            i =
              typeof getComputedStyle == "function" ? getComputedStyle(r) : !1,
            f = i ? null : n(r),
            w =
              parseInt(i ? i.paddingTop : f.css("paddingTop")) +
              parseInt(i ? i.paddingBottom : f.css("paddingBottom")) +
              parseInt(i ? i.borderTopWidth : f.css("borderTopWidth")) +
              parseInt(i ? i.borderBottomWidth : f.css("borderBottomWidth")),
            it =
              w +
              parseInt(i ? i.marginTop : f.css("marginTop")) +
              parseInt(i ? i.marginBottom : f.css("marginBottom")) +
              2;
          document.body.removeChild(e);
          this.sizeInfo = {
            liHeight: b,
            headerHeight: k,
            searchHeight: d,
            actionsHeight: g,
            doneButtonHeight: nt,
            dividerHeight: tt,
            menuPadding: w,
            menuExtras: it,
          };
        }
      },
      setSize: function () {
        var o, p, w;
        if (
          (this.findLis(),
          this.liHeight(),
          this.options.header && this.$menu.css("padding-top", 0),
          this.options.size !== !1)
        ) {
          var i = this,
            t = this.$menu,
            b = this.$menuInner,
            c = n(window),
            nt = this.$newElement[0].offsetHeight,
            k = this.sizeInfo.liHeight,
            l = this.sizeInfo.headerHeight,
            a = this.sizeInfo.searchHeight,
            v = this.sizeInfo.actionsHeight,
            y = this.sizeInfo.doneButtonHeight,
            tt = this.sizeInfo.dividerHeight,
            s = this.sizeInfo.menuPadding,
            f = this.sizeInfo.menuExtras,
            d = this.options.hideDisabled ? ".disabled" : "",
            r,
            u,
            e,
            h,
            g = function () {
              e = i.$newElement.offset().top - c.scrollTop();
              h = c.height() - e - nt;
            };
          if ((g(), this.options.size === "auto")) {
            o = function () {
              var o,
                p = function (t, i) {
                  return function (r) {
                    return i
                      ? r.classList
                        ? r.classList.contains(t)
                        : n(r).hasClass(t)
                      : !(r.classList
                          ? r.classList.contains(t)
                          : n(r).hasClass(t));
                  };
                },
                w = i.$menuInner[0].getElementsByTagName("li"),
                c = Array.prototype.filter
                  ? Array.prototype.filter.call(w, p("hidden", !1))
                  : i.$lis.not(".hidden"),
                d = Array.prototype.filter
                  ? Array.prototype.filter.call(c, p("dropdown-header", !0))
                  : c.filter(".dropdown-header");
              g();
              r = h - f;
              i.options.container
                ? (t.data("height") || t.data("height", t.height()),
                  (u = t.data("height")))
                : (u = t.height());
              i.options.dropupAuto &&
                i.$newElement.toggleClass("dropup", e > h && r - f < u);
              i.$newElement.hasClass("dropup") && (r = e - f);
              o = c.length + d.length > 3 ? k * 3 + f - 2 : 0;
              t.css({
                "max-height": r + "px",
                overflow: "hidden",
                "min-height": o + l + a + v + y + "px",
              });
              b.css({
                "max-height": r - l - a - v - y - s + "px",
                "overflow-y": "auto",
                "min-height": Math.max(o - s, 0) + "px",
              });
            };
            o();
            this.$searchbox
              .off("input.getSize propertychange.getSize")
              .on("input.getSize propertychange.getSize", o);
            c.off("resize.getSize scroll.getSize").on(
              "resize.getSize scroll.getSize",
              o
            );
          } else
            this.options.size &&
              this.options.size != "auto" &&
              this.$lis.not(d).length > this.options.size &&
              ((p = this.$lis
                .not(".divider")
                .not(d)
                .children()
                .slice(0, this.options.size)
                .last()
                .parent()
                .index()),
              (w = this.$lis.slice(0, p + 1).filter(".divider").length),
              (r = k * this.options.size + w * tt + s),
              i.options.container
                ? (t.data("height") || t.data("height", t.height()),
                  (u = t.data("height")))
                : (u = t.height()),
              i.options.dropupAuto &&
                this.$newElement.toggleClass("dropup", e > h && r - f < u),
              t.css({
                "max-height": r + l + a + v + y + "px",
                overflow: "hidden",
                "min-height": "",
              }),
              b.css({
                "max-height": r - s + "px",
                "overflow-y": "auto",
                "min-height": "",
              }));
        }
      },
      setWidth: function () {
        if (this.options.width === "auto") {
          this.$menu.css("min-width", "0");
          var n = this.$menu.parent().clone().appendTo("body"),
            t = this.options.container
              ? this.$newElement.clone().appendTo("body")
              : n,
            i = n.children(".dropdown-menu").outerWidth(),
            r = t.css("width", "auto").children("button").outerWidth();
          n.remove();
          t.remove();
          this.$newElement.css("width", Math.max(i, r) + "px");
        } else
          this.options.width === "fit"
            ? (this.$menu.css("min-width", ""),
              this.$newElement.css("width", "").addClass("fit-width"))
            : this.options.width
            ? (this.$menu.css("min-width", ""),
              this.$newElement.css("width", this.options.width))
            : (this.$menu.css("min-width", ""),
              this.$newElement.css("width", ""));
        this.$newElement.hasClass("fit-width") &&
          this.options.width !== "fit" &&
          this.$newElement.removeClass("fit-width");
      },
      selectPosition: function () {
        this.$bsContainer = n('<div class="bs-container" />');
        var t = this,
          i,
          r,
          u = function (n) {
            t.$bsContainer
              .addClass(n.attr("class").replace(/form-control|fit-width/gi, ""))
              .toggleClass("dropup", n.hasClass("dropup"));
            i = n.offset();
            r = n.hasClass("dropup") ? 0 : n[0].offsetHeight;
            t.$bsContainer.css({
              top: i.top + r,
              left: i.left,
              width: n[0].offsetWidth,
            });
          };
        this.$button.on("click", function () {
          var i = n(this);
          t.isDisabled() ||
            (u(t.$newElement),
            t.$bsContainer
              .appendTo(t.options.container)
              .toggleClass("open", !i.hasClass("open"))
              .append(t.$menu));
        });
        n(window).on("resize scroll", function () {
          u(t.$newElement);
        });
        this.$element.on("hide.bs.select", function () {
          t.$menu.data("height", t.$menu.height());
          t.$bsContainer.detach();
        });
      },
      setSelected: function (n, t, i) {
        i || (i = this.findLis().eq(this.liObj[n]));
        i.toggleClass("selected", t);
      },
      setDisabled: function (n, t, i) {
        i || (i = this.findLis().eq(this.liObj[n]));
        t
          ? i
              .addClass("disabled")
              .children("a")
              .attr("href", "#")
              .attr("tabindex", -1)
          : i
              .removeClass("disabled")
              .children("a")
              .removeAttr("href")
              .attr("tabindex", 0);
      },
      isDisabled: function () {
        return this.$element[0].disabled;
      },
      checkDisabled: function () {
        var n = this;
        this.isDisabled()
          ? (this.$newElement.addClass("disabled"),
            this.$button.addClass("disabled").attr("tabindex", -1))
          : (this.$button.hasClass("disabled") &&
              (this.$newElement.removeClass("disabled"),
              this.$button.removeClass("disabled")),
            this.$button.attr("tabindex") != -1 ||
              this.$element.data("tabindex") ||
              this.$button.removeAttr("tabindex"));
        this.$button.click(function () {
          return !n.isDisabled();
        });
      },
      tabIndex: function () {
        this.$element.data("tabindex") !== this.$element.attr("tabindex") &&
          this.$element.attr("tabindex") !== -98 &&
          this.$element.attr("tabindex") !== "-98" &&
          (this.$element.data("tabindex", this.$element.attr("tabindex")),
          this.$button.attr("tabindex", this.$element.data("tabindex")));
        this.$element.attr("tabindex", -98);
      },
      clickListener: function () {
        var t = this,
          i = n(document);
        this.$newElement.on(
          "touchstart.dropdown",
          ".dropdown-menu",
          function (n) {
            n.stopPropagation();
          }
        );
        i.data("spaceSelect", !1);
        this.$button.on("keyup", function (n) {
          /(32)/.test(n.keyCode.toString(10)) &&
            i.data("spaceSelect") &&
            (n.preventDefault(), i.data("spaceSelect", !1));
        });
        this.$button.on("click", function () {
          t.setSize();
        });
        this.$element.on("shown.bs.select", function () {
          var i, n;
          if (t.options.liveSearch || t.multiple) {
            if (!t.multiple) {
              if (
                ((i = t.liObj[t.$element[0].selectedIndex]),
                typeof i != "number" || t.options.size === !1)
              )
                return;
              n = t.$lis.eq(i)[0].offsetTop - t.$menuInner[0].offsetTop;
              n =
                n - t.$menuInner[0].offsetHeight / 2 + t.sizeInfo.liHeight / 2;
              t.$menuInner[0].scrollTop = n;
            }
          } else t.$menuInner.find(".selected a").focus();
        });
        this.$menuInner.on("click", "li a", function (i) {
          var s = n(this),
            e = s.parent().data("originalIndex"),
            k = t.$element.val(),
            d = t.$element.prop("selectedIndex"),
            l,
            a,
            b;
          if (
            (t.multiple && i.stopPropagation(),
            i.preventDefault(),
            !t.isDisabled() && !s.parent().hasClass("disabled"))
          ) {
            var h = t.$element.find("option"),
              f = h.eq(e),
              v = f.prop("selected"),
              y = f.parent("optgroup"),
              r = t.options.maxOptions,
              u = y.data("maxOptions") || !1;
            if (t.multiple) {
              if (
                (f.prop("selected", !v),
                t.setSelected(e, !v),
                s.blur(),
                (r !== !1 || u !== !1) &&
                  ((l = r < h.filter(":selected").length),
                  (a = u < y.find("option:selected").length),
                  (r && l) || (u && a)))
              )
                if (r && r == 1)
                  h.prop("selected", !1),
                    f.prop("selected", !0),
                    t.$menuInner.find(".selected").removeClass("selected"),
                    t.setSelected(e, !0);
                else if (u && u == 1)
                  y.find("option:selected").prop("selected", !1),
                    f.prop("selected", !0),
                    (b = s.parent().data("optgroup")),
                    t.$menuInner
                      .find('[data-optgroup="' + b + '"]')
                      .removeClass("selected"),
                    t.setSelected(e, !0);
                else {
                  var o =
                      typeof t.options.maxOptionsText == "function"
                        ? t.options.maxOptionsText(r, u)
                        : t.options.maxOptionsText,
                    p = o[0].replace("{n}", r),
                    w = o[1].replace("{n}", u),
                    c = n('<div class="notify"></div>');
                  o[2] &&
                    ((p = p.replace("{var}", o[2][r > 1 ? 0 : 1])),
                    (w = w.replace("{var}", o[2][u > 1 ? 0 : 1])));
                  f.prop("selected", !1);
                  t.$menu.append(c);
                  r &&
                    l &&
                    (c.append(n("<div>" + p + "</div>")),
                    t.$element.trigger("maxReached.bs.select"));
                  u &&
                    a &&
                    (c.append(n("<div>" + w + "</div>")),
                    t.$element.trigger("maxReachedGrp.bs.select"));
                  setTimeout(function () {
                    t.setSelected(e, !1);
                  }, 10);
                  c.delay(750).fadeOut(300, function () {
                    n(this).remove();
                  });
                }
            } else
              h.prop("selected", !1),
                f.prop("selected", !0),
                t.$menuInner.find(".selected").removeClass("selected"),
                t.setSelected(e, !0);
            t.multiple
              ? t.options.liveSearch && t.$searchbox.focus()
              : t.$button.focus();
            ((k != t.$element.val() && t.multiple) ||
              (d != t.$element.prop("selectedIndex") && !t.multiple)) &&
              t.$element
                .trigger("changed.bs.select", [e, f.prop("selected"), v])
                .triggerNative("change");
          }
        });
        this.$menu.on(
          "click",
          "li.disabled a, .popover-title, .popover-title :not(.close)",
          function (i) {
            i.currentTarget == this &&
              (i.preventDefault(),
              i.stopPropagation(),
              t.options.liveSearch && !n(i.target).hasClass("close")
                ? t.$searchbox.focus()
                : t.$button.focus());
          }
        );
        this.$menuInner.on("click", ".divider, .dropdown-header", function (n) {
          n.preventDefault();
          n.stopPropagation();
          t.options.liveSearch ? t.$searchbox.focus() : t.$button.focus();
        });
        this.$menu.on("click", ".popover-title .close", function () {
          t.$button.click();
        });
        this.$searchbox.on("click", function (n) {
          n.stopPropagation();
        });
        this.$menu.on("click", ".actions-btn", function (i) {
          t.options.liveSearch ? t.$searchbox.focus() : t.$button.focus();
          i.preventDefault();
          i.stopPropagation();
          n(this).hasClass("bs-select-all") ? t.selectAll() : t.deselectAll();
        });
        this.$element.change(function () {
          t.render(!1);
        });
      },
      liveSearchListener: function () {
        var t = this,
          u = n('<li class="no-results"></li>');
        this.$button.on(
          "click.dropdown.data-api touchstart.dropdown.data-api",
          function () {
            t.$menuInner.find(".active").removeClass("active");
            t.$searchbox.val() &&
              (t.$searchbox.val(""),
              t.$lis.not(".is-hidden").removeClass("hidden"),
              !u.parent().length || u.remove());
            t.multiple || t.$menuInner.find(".selected").addClass("active");
            setTimeout(function () {
              t.$searchbox.focus();
            }, 10);
          }
        );
        this.$searchbox.on(
          "click.dropdown.data-api focus.dropdown.data-api touchend.dropdown.data-api",
          function (n) {
            n.stopPropagation();
          }
        );
        this.$searchbox.on("input propertychange", function () {
          var f, e;
          t.$searchbox.val()
            ? ((f = t.$lis
                .not(".is-hidden")
                .removeClass("hidden")
                .children("a")),
              (f = t.options.liveSearchNormalize
                ? f.not(
                    ":a" +
                      t._searchStyle() +
                      '("' +
                      i(t.$searchbox.val()) +
                      '")'
                  )
                : f.not(
                    ":" + t._searchStyle() + '("' + t.$searchbox.val() + '")'
                  )),
              f.parent().addClass("hidden"),
              t.$lis.filter(".dropdown-header").each(function () {
                var i = n(this),
                  r = i.data("optgroup");
                t.$lis
                  .filter("[data-optgroup=" + r + "]")
                  .not(i)
                  .not(".hidden").length === 0 &&
                  (i.addClass("hidden"),
                  t.$lis
                    .filter("[data-optgroup=" + r + "div]")
                    .addClass("hidden"));
              }),
              (e = t.$lis.not(".hidden")),
              e.each(function (t) {
                var i = n(this);
                i.hasClass("divider") &&
                  (i.index() === e.first().index() ||
                    i.index() === e.last().index() ||
                    e.eq(t + 1).hasClass("divider")) &&
                  i.addClass("hidden");
              }),
              t.$lis.not(".hidden, .no-results").length
                ? !u.parent().length || u.remove()
                : (!u.parent().length || u.remove(),
                  u
                    .html(
                      t.options.noneResultsText.replace(
                        "{0}",
                        '"' + r(t.$searchbox.val()) + '"'
                      )
                    )
                    .show(),
                  t.$menuInner.append(u)))
            : (t.$lis.not(".is-hidden").removeClass("hidden"),
              !u.parent().length || u.remove());
          t.$lis.filter(".active").removeClass("active");
          t.$searchbox.val() &&
            t.$lis
              .not(".hidden, .divider, .dropdown-header")
              .eq(0)
              .addClass("active")
              .children("a")
              .focus();
          n(this).focus();
        });
      },
      _searchStyle: function () {
        return (
          { begins: "ibegins", startsWith: "ibegins" }[
            this.options.liveSearchStyle
          ] || "icontains"
        );
      },
      val: function (n) {
        return typeof n != "undefined"
          ? (this.$element.val(n), this.render(), this.$element)
          : this.$element.val();
      },
      changeAll: function (t) {
        var i, u;
        typeof t == "undefined" && (t = !0);
        this.findLis();
        var e = this.$element.find("option"),
          f = this.$lis
            .not(".divider, .dropdown-header, .disabled, .hidden")
            .toggleClass("selected", t),
          o = f.length,
          r = [];
        for (i = 0; i < o; i++)
          (u = f[i].getAttribute("data-original-index")),
            (r[r.length] = e.eq(u)[0]);
        n(r).prop("selected", t);
        this.render(!1);
        this.$element.trigger("changed.bs.select").triggerNative("change");
      },
      selectAll: function () {
        return this.changeAll(!0);
      },
      deselectAll: function () {
        return this.changeAll(!1);
      },
      toggle: function (n) {
        n = n || window.event;
        n && n.stopPropagation();
        this.$button.trigger("click");
      },
      keydown: function (t) {
        var e = n(this),
          l = e.is("input") ? e.parent().parent() : e.parent(),
          u,
          r = l.data("this"),
          f,
          h,
          a,
          v,
          p,
          w,
          k,
          s,
          c = ":not(.disabled, .hidden, .dropdown-header, .divider)",
          b = {
            32: " ",
            48: "0",
            49: "1",
            50: "2",
            51: "3",
            52: "4",
            53: "5",
            54: "6",
            55: "7",
            56: "8",
            57: "9",
            59: ";",
            65: "a",
            66: "b",
            67: "c",
            68: "d",
            69: "e",
            70: "f",
            71: "g",
            72: "h",
            73: "i",
            74: "j",
            75: "k",
            76: "l",
            77: "m",
            78: "n",
            79: "o",
            80: "p",
            81: "q",
            82: "r",
            83: "s",
            84: "t",
            85: "u",
            86: "v",
            87: "w",
            88: "x",
            89: "y",
            90: "z",
            96: "0",
            97: "1",
            98: "2",
            99: "3",
            100: "4",
            101: "5",
            102: "6",
            103: "7",
            104: "8",
            105: "9",
          },
          y,
          o,
          g,
          d;
        (r.options.liveSearch && (l = e.parent().parent()),
        r.options.container && (l = r.$menu),
        (u = n("[role=menu] li", l)),
        (s = r.$newElement.hasClass("open")),
        !s &&
          ((t.keyCode >= 48 && t.keyCode <= 57) ||
            (t.keyCode >= 96 && t.keyCode <= 105) ||
            (t.keyCode >= 65 && t.keyCode <= 90)) &&
          (r.options.container
            ? r.$button.trigger("click")
            : (r.setSize(), r.$menu.parent().addClass("open"), (s = !0)),
          r.$searchbox.focus()),
        r.options.liveSearch &&
          (/(^9$|27)/.test(t.keyCode.toString(10)) &&
            s &&
            r.$menu.find(".active").length === 0 &&
            (t.preventDefault(),
            r.$menu.parent().removeClass("open"),
            r.options.container && r.$newElement.removeClass("open"),
            r.$button.focus()),
          (u = n("[role=menu] li" + c, l)),
          e.val() ||
            /(38|40)/.test(t.keyCode.toString(10)) ||
            (u.filter(".active").length === 0 &&
              ((u = r.$menuInner.find("li")),
              (u = r.options.liveSearchNormalize
                ? u.filter(
                    ":a" + r._searchStyle() + "(" + i(b[t.keyCode]) + ")"
                  )
                : u.filter(
                    ":" + r._searchStyle() + "(" + b[t.keyCode] + ")"
                  ))))),
        u.length) &&
          (/(38|40)/.test(t.keyCode.toString(10))
            ? ((f = u.index(u.find("a").filter(":focus").parent())),
              (a = u.filter(c).first().index()),
              (v = u.filter(c).last().index()),
              (h = u.eq(f).nextAll(c).eq(0).index()),
              (p = u.eq(f).prevAll(c).eq(0).index()),
              (w = u.eq(h).prevAll(c).eq(0).index()),
              r.options.liveSearch &&
                (u.each(function (t) {
                  n(this).hasClass("disabled") || n(this).data("index", t);
                }),
                (f = u.index(u.filter(".active"))),
                (a = u.first().data("index")),
                (v = u.last().data("index")),
                (h = u.eq(f).nextAll().eq(0).data("index")),
                (p = u.eq(f).prevAll().eq(0).data("index")),
                (w = u.eq(h).prevAll().eq(0).data("index"))),
              (k = e.data("prevIndex")),
              t.keyCode == 38
                ? (r.options.liveSearch && f--,
                  f != w && f > p && (f = p),
                  f < a && (f = a),
                  f == k && (f = v))
                : t.keyCode == 40 &&
                  (r.options.liveSearch && f++,
                  f == -1 && (f = 0),
                  f != w && f < h && (f = h),
                  f > v && (f = v),
                  f == k && (f = a)),
              e.data("prevIndex", f),
              r.options.liveSearch
                ? (t.preventDefault(),
                  e.hasClass("dropdown-toggle") ||
                    (u
                      .removeClass("active")
                      .eq(f)
                      .addClass("active")
                      .children("a")
                      .focus(),
                    e.focus()))
                : u.eq(f).children("a").focus())
            : e.is("input") ||
              ((y = []),
              u.each(function () {
                n(this).hasClass("disabled") ||
                  (n
                    .trim(n(this).children("a").text().toLowerCase())
                    .substring(0, 1) == b[t.keyCode] &&
                    y.push(n(this).index()));
              }),
              (o = n(document).data("keycount")),
              o++,
              n(document).data("keycount", o),
              (g = n.trim(n(":focus").text().toLowerCase()).substring(0, 1)),
              g != b[t.keyCode]
                ? ((o = 1), n(document).data("keycount", o))
                : o >= y.length &&
                  (n(document).data("keycount", 0), o > y.length && (o = 1)),
              u
                .eq(y[o - 1])
                .children("a")
                .focus()),
          (/(13|32)/.test(t.keyCode.toString(10)) ||
            (/(^9$)/.test(t.keyCode.toString(10)) && r.options.selectOnTab)) &&
            s &&
            (/(32)/.test(t.keyCode.toString(10)) || t.preventDefault(),
            r.options.liveSearch
              ? /(32)/.test(t.keyCode.toString(10)) ||
                (r.$menuInner.find(".active a").click(), e.focus())
              : ((d = n(":focus")),
                d.click(),
                d.focus(),
                t.preventDefault(),
                n(document).data("spaceSelect", !0)),
            n(document).data("keycount", 0)),
          ((/(^9$|27)/.test(t.keyCode.toString(10)) &&
            s &&
            (r.multiple || r.options.liveSearch)) ||
            (/(27)/.test(t.keyCode.toString(10)) && !s)) &&
            (r.$menu.parent().removeClass("open"),
            r.options.container && r.$newElement.removeClass("open"),
            r.$button.focus()));
      },
      mobile: function () {
        this.$element.addClass("mobile-device");
      },
      refresh: function () {
        this.$lis = null;
        this.liObj = {};
        this.reloadLi();
        this.render();
        this.checkDisabled();
        this.liHeight(!0);
        this.setStyle();
        this.setWidth();
        this.$lis && this.$searchbox.trigger("propertychange");
        this.$element.trigger("refreshed.bs.select");
      },
      hide: function () {
        this.$newElement.hide();
      },
      show: function () {
        this.$newElement.show();
      },
      remove: function () {
        this.$newElement.remove();
        this.$element.remove();
      },
      destroy: function () {
        this.$newElement.before(this.$element).remove();
        this.$bsContainer ? this.$bsContainer.remove() : this.$menu.remove();
        this.$element
          .off(".bs.select")
          .removeData("selectpicker")
          .removeClass("bs-select-hidden selectpicker");
      },
    };
    f = n.fn.selectpicker;
    n.fn.selectpicker = u;
    n.fn.selectpicker.Constructor = t;
    n.fn.selectpicker.noConflict = function () {
      return (n.fn.selectpicker = f), this;
    };
    n(document)
      .data("keycount", 0)
      .on(
        "keydown.bs.select",
        '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="menu"], .bs-searchbox input',
        t.prototype.keydown
      )
      .on(
        "focusin.modal",
        '.bootstrap-select [data-toggle=dropdown], .bootstrap-select [role="menu"], .bs-searchbox input',
        function (n) {
          n.stopPropagation();
        }
      );
    n(window).on("load.bs.select.data-api", function () {
      n(".selectpicker").each(function () {
        var t = n(this);
        u.call(t, t.data());
      });
    });
  })(jQuery);
$(function () {
  function t() {
    var u = $(this),
      f = u.text(),
      t = u.data("id");
    t ? (i(f, t), $("#ticketSubjectsList").val(t).change()) : r();
    n.modal("show");
  }
  function i(n) {
    $("#specificUploadTitle").text(n);
    $("#genericUploadTitle, #genericUploadDescription").css("display", "none");
    $("#specificUploadTitle, #specificUploadDescription").css(
      "display",
      "inline"
    );
  }
  function r() {
    $("#specificUploadTitle, #specificUploadDescription").css(
      "display",
      "none"
    );
    $("#genericUploadTitle, #genericUploadDescription").css(
      "display",
      "inline"
    );
  }
  var n = $("#sendFileModal");
  $(".uploadContainer .list a").click(t);
});
