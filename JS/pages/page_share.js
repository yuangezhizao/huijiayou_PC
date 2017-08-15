/// <reference path="../jquery-2.1.4.js" />
/// <reference path="../functions/g_Const.js" />
/// <reference path="../functions/g_Type.js" />
/// <reference path="../g_header.js" />
/// <reference path="../shareGoodsDetail.js" />

$(document).on("ready", function () {
    page_Share.Init();
});
var page_Share = {
    Init: function () {
        $(".btn-close").on("click", function () {
            $(".top").css("display", "none");
            $("#ifr").css("top", "0px");
        });
        var strsrc = decodeURIComponent(GetQueryString("wxLink"));
        if (strsrc == "") {
            strsrc = "about:blank";
        }
        else {
            if (strsrc.indexOf("fromshare") == -1) {
                if (strsrc.indexOf("?") == -1)
                    strsrc += "?fromshare=" + g_const_YesOrNo.YES;
                else
                    strsrc += "&fromshare=" + g_const_YesOrNo.YES;
            }
        }
            
        var strTitle = decodeURIComponent(GetQueryString("wxTilte"));
        if (strTitle == "") {
            strTitle = "惠家有购物商城";
        }
        var strPhone = decodeURIComponent(GetQueryString("wxPhone"));
        if (strPhone.length == 11) {
            strPhone = strPhone.substr(0, 3) + "****" + strPhone.substr(7, 4);
        }
        $("#sharephone").text(strPhone);
        $("#ifr").attr("src", strsrc);
        $("title").text(strTitle);

        $(".rspan a").on("click", function () {
            window.location = g_const_PageURL.Lqfxtq_Op + "?t=" + Math.random();
        });
        $(".lspan a").on("click", function () {
            openApp();
        });
    }
};