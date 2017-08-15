/// <reference path="../functions/g_Const.js" />
/// <reference path="../functions/g_Type.js" />
/// <reference path="../g_header.js" />
/// <reference path="../jquery-2.1.4.js" />
var page_order_fail = {
    Init: function () {
        $("#btn_orderinfo").on("click", function () {
            g_const_PageURL.GoByMainIndex(g_const_PageURL.MyOrder_List, "");
        });
    }
};