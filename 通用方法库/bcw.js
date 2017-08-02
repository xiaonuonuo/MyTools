/**
 * Created by CC on 2017/8/2 0002.
 */

function getSessionStore(a) {
    if (!a) {
        return
    }
    return window.sessionStorage.getItem(a)
}
function getCookie(b) {
    var a, c = new RegExp("(^| )" + b + "=([^;]*)(;|$)");
    if (a = document.cookie.match(c)) {
        return unescape(a[2])
    } else {
        return null
    }
}
function Tools() {
}
Tools.prototype.DateToString = function (a) {
    return a.getFullYear() + "-" + (a.getMonth() > 8 ? (a.getMonth() + 1) : "0" + (a.getMonth() + 1)) + "-" + (a.getDate() > 9 ? a.getDate() : "0" + a.getDate()) + " " + (a.getHours() > 9 ? a.getHours() : "0" + a.getHours()) + ":" + (a.getMinutes() > 9 ? a.getMinutes() : "0" + a.getMinutes()) + ":" + (a.getSeconds() > 9 ? a.getSeconds() : "0" + a.getSeconds())
};
Tools.prototype.encrypt = function (a) {
    var f = getCookie("token") ? getCookie("token") : getSessionStore("token") ? getSessionStore("token") : "";
    var b = {
        data: JSON.stringify(a),
        device: "WechatMall/1.0/2.0.0",
        timestemp: Date.parse(new Date()) / 1000,
        token: f
    };
    b.sign = this.getSign(b);
    b.openid = getSessionStore("openid") ? getSessionStore("openid") : "";
    var e = JSON.stringify(b);
    var i = "b92dff3973ebdc1786803c2ce976a627";
    var d = i.substring(0, 16);
    i = CryptoJS.enc.Utf8.parse(i);
    d = CryptoJS.enc.Utf8.parse(d);
    var c = CryptoJS.enc.Utf8.parse(e);
    var g = CryptoJS.AES.encrypt(c, i, {iv: d, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding});
    var h = {params: g.toString()};
    return h
};
Tools.prototype.getSign = function (c) {
    var d = Object.keys(c);
    d = d.sort();
    var b = "";
    var e = "";
    for (var a = 0; a < d.length; a++) {
        e += b + d[a] + "=" + (typeof c[d[a]] === "object" ? JSON.stringify(c[d[a]]) : c[d[a]]);
        b = "&"
    }
    e = e + "FD92DF750B32765DA01A119BE1601D46";
    return hexMD5(utf8.encode(e))
};
;
var local = "https://testapipay.vipbcw.com";
var _url = window.location.href;
if (_url.indexOf("prem.vipbcw.com") > 0) {
    local = "https://preapi3.vipbcw.com"
} else {
    if (_url.indexOf("m.vipbcw.com") > 0) {
        local = "https://api3.vipbcw.com"
    }
}
var _userAgent = navigator.userAgent;
var wxConfig = {};
var Tools = new Tools();
var _data = Tools.encrypt({url: _url});
$(document).ajaxSuccess(function (c, b, a) {
    if (b.responseJSON.result_code == "1003" && a.url.indexOf("unLogin") < 0) {
        if (typeof(b.responseJSON.result_data.openid) != "undefined") {
            setSessionStore("bindInfo", b.responseJSON.result_data);
            window.location.href = "/user-info/bind-phone"
        } else {
            $("#J_appLogin").find("span").trigger("click")
        }
    }
    if (b.responseJSON.result_code === "1008" || b.responseJSON.result_code === "1009") {
        window.location.href = b.responseJSON.result_data.url;
        return false
    }
});
if (_userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
    $.ajax({
        url: local + "/Wechat/getConfig?v=2.0",
        type: "post",
        data: _data,
        async: false,
        dataType: "json",
        success: function (a) {
            wxConfig = a.result_data
        }
    })
}
function popHandle(a) {
    var b = $('<div class="tip-box">' + a + "</div>");
    $("body").append(b);
    b.fadeIn();
    var d = 0;
    var c = setInterval(function () {
        d = d + 1;
        if (d == 1) {
            b.fadeOut(function () {
                $(this).remove()
            });
            clearInterval(c)
        }
    }, 1500)
}
function $G() {
    var b = location.search;
    var a = new Object();
    if (b.indexOf("?") != -1) {
        var e = b.substr(1);
        var d = e.split("&");
        for (var c = 0; c < d.length; c++) {
            a[d[c].split("=")[0]] = (d[c].split("=")[1])
        }
    }
    return a
}
function $H() {
    var b = window.location.pathname;
    var a = b.split("/");
    var c = a[a.length - 1];
    c = c.split(".")[0];
    return c
}
function addCard() {
    $(".J_cart").click(function () {
        addCartFun($(this))
    })
}
function addCartFun(e) {
    var c = 1;
    var a = $(e).parents("li").attr("data-id");
    var d = navigator.userAgent;
    if (d.indexOf("bcwmall") > 0) {
        $("#J_appAddCart").attr({href: "/record/addCart?id=" + a});
        $("#J_appAddCart").find("span").trigger("click")
    }
    var b = Tools.encrypt({goods_id: a, count: c});
    $.ajax({
        type: "POST", url: local + "/goods/cart?v=2.0", data: b, dataType: "json", success: function (h) {
            if (h.result_code == 0) {
                var f = $("#J_goodsNum").html();
                if (f != "9+") {
                    var g = Number(f) + 1;
                    if (g >= 10) {
                        $("#J_goodsNum").html("9+")
                    } else {
                        $("#J_goodsNum").html(g).show()
                    }
                }
                popHandle("æˆåŠŸä¸¢å…¥è´­ç‰©è½¦")
            } else {
                popHandle(h.result_info)
            }
        }
    })
}
function getCartNumber() {
    var a = Tools.encrypt({});
    $.ajax({
        type: "POST",
        url: local + "/cart/goods?v=2.0&unLogin=1",
        data: a,
        dataType: "json",
        async: false,
        success: function (c) {
            var b = 0;
            if (c.result_code == 0) {
                b = c.result_data.total_goods_count
            }
            if (b == 0) {
                $("#J_goodsNum").hide()
            } else {
                $("#J_goodsNum").show();
                if (b >= 10) {
                    b = "9+"
                }
            }
            $("#J_goodsNum").html(b)
        }
    })
}
function addBackHomeBtn() {
    var e = $('<div style="top:60px;" class="backHome"><a href="/home/index">å›žåˆ°é¦–é¡µ</a></div>');
    var f = $('<div class="fixed-top appDownload-top" style="overflow:hidden;">        <img src="http://img2.vipbcw.com/wap/appLogo.jpg"/>        <p>ä¸‹è½½APP</p>        <p>é¦–å•ç«‹å‡10å…ƒï¼Œæ»¡49åŒ…é‚®å†é€50å…ƒç¤¼åˆ¸</p>        <a href="http://www.vipbcw.com/app_download.html?_f=mo_top">ç«‹å³é¢†å–</a>        </div>');
    var d = document.referrer;
    var c = getUA().uid;
    if (c != 0) {
        var b = $("#J_shareUrl").html();
        $("#J_shareUrl").html(b + "?uid=" + c)
    }
    if (_userAgent.indexOf("bcwmall") < 0 && d.indexOf("vipbcw.com") < 0) {
        $("body").append(e);
        $("body").prepend(f);
        if (_userAgent.toLowerCase().match(/MicroMessenger/i) != "micromessenger" && $("body").attr("data-openApp") != "1") {
            var a = GetUrlRelativePath();
            window.location.href = "bcwvipmall:" + a
        }
    }
    if (_userAgent.indexOf("bcwmall") > 0) {
        $("body").addClass("bcwmall")
    }
}
function getUA() {
    var d = {v: 0, uid: 0};
    var c = navigator.userAgent;
    if (c.indexOf("bcwmall") > 0) {
        var b = c.slice(c.indexOf("bcwmall"));
        var a = b.split("/");
        d.v = Number(a[1].replace(/\./g, ""));
        d.uid = a[2]
    }
    return d
}
function GetUrlRelativePath() {
    var a = document.location.toString();
    var c = a.split("//");
    var d = c[1].indexOf("/");
    var b = c[1].substring(d);
    return b
}
function toTopShow() {
    var a = document.documentElement.scrollTop || document.body.scrollTop;
    var b = $("#J_toTop");
    if (a > 300) {
        b.fadeIn()
    } else {
        b.fadeOut()
    }
}
function lazyLoadImg(a) {
    $(a).lazyload({effect: "fadeIn", threshold: 300})
}
function getCoup() {
    $("#J_coup").find("li").click(function () {
        var a = $(this).attr("data-id");
        if (a != "") {
            getCoupFun(a)
        }
    })
}
function getCoupFun(b) {
    var a = Tools.encrypt({coupon: b});
    $.ajax({
        type: "post", url: local + "/coupon/getCoupon?v=2.0", data: a, dataType: "json", success: function (c) {
            popHandle(c.result_info)
        }
    })
}
function now_floor() {
    var a = document.documentElement.scrollTop || document.body.scrollTop;
    var e = $(".part");
    var d = [];
    var g = [];
    for (var c = 0; c < e.length; c++) {
        d.push($(e[c]).offset().top - 40);
        g.push($(e[c]).height())
    }
    for (var b = 0; b < e.length; b++) {
        if (a + 50 > d[b] && a < d[b] + g[b] * 0.5) {
            $("#J_nav").find("li:eq(" + b + ")").addClass("cur").siblings("li").removeClass("cur");
            break
        }
    }
    if (a >= 0 && a < $(".part:eq(0)").offset().top) {
        $("#J_nav").find("li:eq(0)").addClass("cur").siblings("li").removeClass("cur")
    }
}
function checkNavSwiper() {
    var a = $("#J_nav").find("li.cur").index();
    var b = a - 2;
    navSwiper.slideTo(b, 500, false)
}
function getGoodsList() {
    if ($(".J_goodsListBox").length > 0) {
        var h = $(".J_goodsListBox")[0];
        var b = document.documentElement.scrollTop || document.body.scrollTop;
        var e = $(h).position().top;
        var d = document.body.clientHeight;
        if (e <= b + d + 100) {
            $(h).removeClass("J_goodsListBox");
            var f = $(h).attr("data-template-id");
            var a = $(h).attr("data-box-id");
            var g = $(h).attr("data-goods-id").split(",");
            var i = $(h).attr("data-add-obj") ? $(h).attr("data-add-obj") : "";
            var c = Tools.encrypt({goods_id: g});
            $.ajax({
                type: "POST",
                url: local + "/goods/goodsListByGoodsIds?v=2.0",
                data: c,
                dataType: "json",
                async: false,
                success: function (p) {
                    if (p.result_code == 0) {
                        var q = {};
                        if (i) {
                            var o = p.result_data.list;
                            var m = [];
                            var r = addGoodsObj[i];
                            for (var n = 0; n < o.length; n++) {
                                if (r[o[n].id]) {
                                    var l = $.extend({}, o[n], r[o[n].id]);
                                    m.push(l)
                                } else {
                                    m.push(o[n])
                                }
                            }
                            q = {content: m}
                        } else {
                            q = {content: p.result_data.list}
                        }
                        var k = template(f, q);
                        $("#" + a).html(k);
                        $("#" + a).find(".J_cart").unbind("click");
                        $("#" + a).find(".J_cart").click(function () {
                            addCartFun($(this))
                        });
                        lazyLoadImg($("#" + a).find("img.lazy"))
                    } else {
                        $(h).addClass("J_goodsListBox")
                    }
                }
            })
        }
    }
}
$(window).scroll(function () {
    getGoodsList()
});
function checkFun() {
    addBackHomeBtn();
    lazyLoadImg($("img.lazy"));
    var b = $("body").attr("data-cart");
    var d = $("body").attr("data-top");
    var a = $("body").attr("data-coup");
    var c = $("body").attr("data-topNav");
    if (b == "1") {
        $("body").append($('<div class="fixed-cart" id="J_cartLink">            <a href="/user-event/list-cart">            <p id="J_goodsNum" class="num-box">0</p>            <img src="http://img2.vipbcw.com/wap/icon_cart3.png"/>            </a>            </div>'));
        addCard();
        getCartNumber();
        $("#J_cartLink").show();
        if (_url.indexOf("substance") > 0 || _url.indexOf("apphome") > 0) {
            $("#J_cartLink").hide()
        }
    }
    if (d == "1" && _url.indexOf("apphome") < 0) {
        $("body").append($('<div class="fixed-cart topBtn" id="J_toTop"><img src="http://img2.vipbcw.com/wap/icon_goTop.png"/></div>'));
        if (_url.indexOf("substance") > 0 && _userAgent.indexOf("bcwmall") < 0) {
            $("#J_toTop").css({bottom: "52px"})
        } else {
            $("#J_cartLink").css({bottom: "65px"})
        }
        $(window).scroll(function () {
            toTopShow()
        });
        $("#J_toTop").click(function () {
            $("html,body").animate({scrollTop: 0}, 500)
        })
    }
    if (a == "1") {
        getCoup()
    }
    if (c == "1") {
        is_scroll = false;
        if ($(".navBox").length > 0) {
            now_floor();
            $(window).scroll(function () {
                if (typeof navSwiper != "undefined" && $("#J_slideTit").length > 0) {
                    checkNavSwiper()
                }
                var e = $(".navBox").position().top;
                var f = document.documentElement.scrollTop || document.body.scrollTop;
                if (e <= f) {
                    $(".fixedBox").addClass("fixed")
                } else {
                    $(".fixedBox").removeClass("fixed")
                }
                if (!is_scroll) {
                    now_floor()
                }
            });
            $("#J_nav").find("li").click(function () {
                if (!$("html,body").is(":animated")) {
                    is_scroll = true;
                    var f = $(this).index();
                    var e = $(".part").eq(f);
                    $("html,body").animate({scrollTop: e.offset().top - 35}, 500, function () {
                        is_scroll = false
                    });
                    $(this).addClass("cur").siblings("li").removeClass("cur")
                }
            })
        }
    }
    getGoodsList();
    if ($(".J_point").length > 0) {
        $(".J_point").click(function () {
            var e = $(this).attr("data-target");
            var f = $("#" + e).offset().top;
            $("html,body").animate({scrollTop: f}, "fast")
        })
    }
    if ($("#J_limitBox").length > 0) {
        limitFun()
    }
}
function limitFun() {
    var d = $("#J_limitBox");
    var a = new Date($(d).attr("data-start-time"));
    var c = new Date($(d).attr("data-end-time"));
    var b = new Date();
    if ($(d).hasClass("before")) {
        _timer = setInterval(function () {
            GetRTime(a, c)
        }, 1000)
    } else {
        if ($(d).hasClass("active")) {
            _timer2 = setInterval(function () {
                GetETime(c)
            }, 1000)
        }
    }
    $(d).find("li").each(function () {
        if ($(this).attr("data-goods-num") <= 0) {
            $(this).addClass("end")
        }
    })
}
function GetRTime(b, i) {
    console.log(b);
    var g = new Date();
    var c = b.getTime() - g.getTime();
    var j = 0;
    var f = 0;
    var a = 0;
    var e = 0;
    if (c >= 0) {
        j = Math.floor(c / 1000 / 60 / 60 / 24);
        f = Math.floor(c / 1000 / 60 / 60 % 24) + j * 24;
        a = Math.floor(c / 1000 / 60 % 60);
        e = Math.floor(c / 1000 % 60)
    } else {
        clearInterval(_timer);
        $("#J_limitBox").removeClass("before").addClass("active");
        _timer2 = setInterval(function () {
            GetETime(i)
        }, 1000)
    }
    document.getElementById("t_h").innerHTML = f;
    document.getElementById("t_m").innerHTML = a;
    document.getElementById("t_s").innerHTML = e
}
function GetETime(g) {
    var f = new Date();
    var b = g.getTime() - f.getTime();
    var i = 0;
    var e = 0;
    var a = 0;
    var c = 0;
    if (b >= 0) {
        i = Math.floor(b / 1000 / 60 / 60 / 24);
        e = Math.floor(b / 1000 / 60 / 60 % 24) + i * 24;
        a = Math.floor(b / 1000 / 60 % 60) + e * 60;
        c = Math.floor(b / 1000 % 60)
    } else {
        clearInterval(_timer2);
        $("#J_limitBox").removeClass("active").addClass("over")
    }
    document.getElementById("t_m1").innerHTML = a;
    document.getElementById("t_s1").innerHTML = c
}
function getCookie(b) {
    var a, c = new RegExp("(^| )" + b + "=([^;]*)(;|$)");
    if (a = document.cookie.match(c)) {
        return unescape(a[2])
    } else {
        return null
    }
}
function delCookie(a) {
    var c = new Date();
    c.setTime(c.getTime() - 1);
    var b = getCookie(a);
    if (b != null) {
        document.cookie = a + "=" + b + ";expires=" + c.toGMTString()
    }
}
function addCookie(c, e, b) {
    var d = c + "=" + escape(e);
    if (b > 0) {
        var a = new Date();
        a.setTime(a.getTime + b * 3600 * 1000);
        d = d + "; expires=" + a.toGMTString()
    }
    document.cookie = d
}
function setSessionStore(a, b) {
    if (!a) {
        return
    }
    if (typeof b !== "string") {
        b = JSON.stringify(b)
    }
    window.sessionStorage.setItem(a, b)
}
function getSessionStore(a) {
    if (!a) {
        return
    }
    return window.sessionStorage.getItem(a)
}
function delSessionStore(a) {
    if (!a) {
        return
    }
    window.sessionStorage.removeItem(a)
}
function DateToString(a) {
    var a = new Date(Number(a) * 1000);
    return a.getFullYear() + "-" + (a.getMonth() > 8 ? (a.getMonth() + 1) : "0" + (a.getMonth() + 1)) + "-" + (a.getDate() > 9 ? a.getDate() : "0" + a.getDate()) + " " + (a.getHours() > 9 ? a.getHours() : "0" + a.getHours()) + ":" + (a.getMinutes() > 9 ? a.getMinutes() : "0" + a.getMinutes()) + ":" + (a.getSeconds() > 9 ? a.getSeconds() : "0" + a.getSeconds())
};
;

;
