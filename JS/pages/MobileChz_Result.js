/// <reference path="../functions/g_Const.js" />
/// <reference path="../functions/g_Type.js" />
/// <reference path="../g_header.js" />
/// <reference path="../jquery-2.1.4.js" />
var page_order_success = {
    Init: function () {
        $("#btn_orderinfo").on("click", function () {
            var p = "&order_code=" + GetQueryString("c_order") + "&t=" + Math.random();
            g_const_PageURL.GoByMainIndex(g_const_PageURL.MobileCZList, p);
        });
        if (GetQueryString("c_succmark") == "Y") {
            $("#pageshow").html("支付成功");
        }
        else {
            $("#pageshow").html("支付失败");
        }
    }
};