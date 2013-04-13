; (function($) {
    var p = {
        cache: {}
    };
    p.M = function(cfg) {
        this.$d = cfg.$d;
        this.flag = cfg.flag;
        this.id = this.$d[0].id;
        this.text = cfg.text || true;
        this.speed = parseInt(cfg.speed) || 5000;
        this.hoverStop = cfg.hoverStop;
        this.type = cfg.type || 1;
        this.place = cfg.place || 'fi_tabRB';
        this.myHtml = cfg.myHtml || "";
        this.ptStepX = cfg.ptStepX || 92;
        this.ptStepY = cfg.ptStepY || 81;
        this.ptStepX_ = cfg.ptStepX_ || 4;
        this.ptStepY_ = cfg.ptStepY_ || -1;
        this.clickTabToNav = cfg.clickTabToNav || false;
        this.autoPlay = null;
        this.autoPlay1 = null;
        this._fiObj = null;
        this._$tabC = null;
        this._$tabs = null;
        this._$curTab = null;
        this._$titleC = null;
        this._$img = null;
        this._$transparentOvl = null;
        this._$desc = null;
        this._$pointer = null;
        this._cfg = cfg;
        this._curLink = null;
        this._$curImg = null;
        this._tabNum = 0;
        this.$d.data("apple", {
            a: cfg
        });
        this.init();
    };
    p.M.prototype = {
        init: function() {
            this._fiObj = p.cache[this.flag];
            if (!this._fiObj) return;
            this._fiObj.init(this);
            this.$d.find(".fi_ct").append(this.myHtml);
            this.spring();
        },
        spring: function() {
            var that = this;
            var gogo = function(i) {
                var _index = i || 0;
                that.alternation(_index);
                that.autoPlay = setInterval(function() {
                    that.alternation((++_index) == that._tabNum ? _index = 0: _index);
                },
                that.speed);
            };
            gogo();
            this._$tabs.each(function(i) { (function(i, o) {
                    o = jQuery(o).click(function() {
                        if (this.className != "now") {
                            clearTimeout(that.autoPlay1);
                            clearInterval(that.autoPlay);
                            gogo(i);
                        };
                        if (that.clickTabToNav) {
                            window.open(fi._curLink);
                        };
                        return false;
                    });
                    if (that.hoverStop) {
                        o.mouseenter(function() {
                            clearInterval(that.autoPlay);
                            clearTimeout(that.autoPlay1);
                            if (this.className != "now") {
                                that.alternation(i);
                            };
                            return false;
                        }).mouseleave(function() {
                            clearInterval(that.autoPlay);
                            clearTimeout(that.autoPlay1);
                            var j = (i + 1) == that._tabNum ? 0: (i + 1);
                            that.autoPlay1 = window.setTimeout(function() {
                                gogo(j);
                            },
                            that.speed);
                        });
                    };
                })(i, this)
            });
            if (this._fiObj.initEvts) {
                this._fiObj.initEvts(this, gogo);
            };
        },
        alternation: function(i) {
            var continueCommon = true;
            if (this._fiObj.alt) continueCommon = this._fiObj.alt(this, i);
           if (!continueCommon) return;
            this._$img.attr("src", this._$curTab.find("img").attr("src")).css({
                opacity: 0
            }).stop().animate({
                opacity: 1
            },
            500);
			this._$tabs.filter(".now").removeClass().end().eq(i).addClass("now");
        }
    };
    $.fn.focusImg = function(cfg) {
        return this.each(function() {
            cfg.$d = $(this);
            new p.M(cfg);
        });
    };
    $.fn.focusImg.Register = function(key, fiObj) {
        p.cache[key] = fiObj;
    };
})(jQuery);

; (function($) {
    $.fn.focusImg.Register("fi10", {
        init: function(fi) {
            fi._$tabC = fi.$d.find(".fi_tab");
            fi._$tabs = fi._$tabC.find("li");
            fi._tabNum = fi._$tabs.length;
            var w = fi._$tabs.outerWidth(true) * fi._tabNum;
            if ($.browser.msie && $.browser.version < 7) {
                w += 5;
            };
            fi._$tabC.width(w);
            fi._$ctItems = fi.$d.find(".fi_ct li");
            if (fi._cfg.lazyload) {
                fi._$loading = $('<div class="fi_lazyload"></div>').appendTo(fi.$d);
                $(document).ready(function() {
                    fi.$d.find("[data-src]").each(function(i, o) {
                        o = $(o); (function($t) {
                            var src = $t.attr("data-src"),
                            tempImg = $("<img/>");
                            tempImg.load(function() {
                                $t.removeAttr("data-src").attr("src", src);
                                tempImg = null;
                            }).attr("src", src);
                        })(o);
                    });
                });
            };
            fi._cfg.lazyload_t = fi._cfg.lazyload_t || 450;
        },
        initEvts: function(fi, gogo) {
            var _this = this;
            fi._$tabC.find("a").click(function(e) {
                e.preventDefault();
                return true;
            }).end().parent().click(function() {
                return false;
            });
        },
        setTab: function(fi, i, cbk) {
            fi._$curTab = fi._$tabs.removeClass("fi_now").eq(i).addClass("fi_now");
            fi._$curItem = fi._$ctItems.filter(":visible").fadeOut(600).end();
            fi._$curItem.eq(i).fadeIn(1000);
			fi._$curImg = fi._$curItem.find("img");
            fi._curLink = fi._$curTab.find("a:first").attr("href");
        },
        alt: function(fi, i, cbk) {
            this.setTab(fi, i, cbk);
            var src = null;
            window.clearTimeout(fi._timer3);
            if ((src = fi._$curImg.attr("data-src"))) {
                if (fi._$loading) {
                    fi._timer3 = window.setTimeout(function() {
                        fi._$loading.show();
                    },
                    fi._cfg.lazyload_t);
                } else {
                    fi._$curImg.attr("src", src);
                };
            } else {
                if (fi._$loading) {
                    fi._$loading.hide();
                };
            };
            return false;
        }
    });
})(jQuery);