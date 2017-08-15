/// <reference path="../functions/g_Const.js" />
/// <reference path="../functions/g_Type.js" />
/// <reference path="../g_header.js" />
/// <reference path="../jquery-2.1.4.js" />
var page_order_success = {
    Init: function () {
        $("#btn_orderinfo").on("click", function () {
            g_const_PageURL.GoByMainIndex(g_const_PageURL.MyOrder_List, "");
        });
        if (GetQueryString("succtype") == "1") {
            $("#pageshow").html("提交成功");
        }
        else {
            $("#pageshow").html("支付成功");
        }
    }
};