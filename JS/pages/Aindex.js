/// <reference path="../functions/AccountMenu.js" />
/// <reference path="../functions/g_Const.js" />
/// <reference path="../functions/g_Type.js" />
/// <reference path="../jquery-2.1.4.js" />
/// <reference path="../g_header.js" />
//个人中心首页
var page_account_index = {
    MenuName: "我的主页",
    Init: function () {
        AccountMenu.ShowMenu("div.home ul.fl", "#tpl_menu", page_account_index.MenuName);
        page_account_index.GetAccountInfo();
        page_account_index.GetOrderInfo();
        $("#btn_allorder").attr("href", g_const_PageURL.GetLink(g_const_PageURL.MyOrder_List, ""));
    },
    AccountInfo: {
        //头像
        accountpicture: "",
        //手机号
        accountphone: "",
        //默认地址
        defaultaddress: "",
        //设置个人中心的链接
        accountinfolink: "",
        //修改密码的链接
        passwordresetlink: "",
        //编辑收货地址的链接
        editaddresslink: ""
    },
    //获取账户信息
    GetAccountInfo: function () {
        g_type_api.api_input = {
            version: 1
        };
        g_type_api.api_target = "com_cmall_membercenter_api_GetMemberInfo";
        g_type_api.api_token = g_const_api_token.Wanted;
        g_type_api.LoadData(page_account_index.AfterGetAccountInfo, "")
    },
    AfterGetAccountInfo: function (msg) {
        page_account_index.AccountInfo.accountinfolink = g_const_PageURL.GetLink(g_const_PageURL.AccountInfo, "");
        page_account_index.AccountInfo.accountphone = (msg.user.nickname.length > 0 ? (msg.user.nickname) : (UserLogin.LoginName.substr(0, 3) + "****" + UserLogin.LoginName.substr(7, 4)));
        page_account_index.AccountInfo.accountpicture = msg.user.avatar.thumb || g_head_pic;
        page_account_index.AccountInfo.editaddresslink = g_const_PageURL.GetLink(g_const_PageURL.AddressList, "");
        page_account_index.AccountInfo.passwordresetlink = g_const_PageURL.GetLink(g_const_PageURL.AccountPasswordReset, "");
        page_account_index.GetDefaultAddress();
    },
    //获取默认地址
    GetDefaultAddress: function () {
        g_type_api.api_input = {
            version: 1,
            paging: {
                limit: 0,
                offset: 0
            }
        };
        g_type_api.api_target = "com_cmall_newscenter_beauty_api_GetAddress";
        g_type_api.api_token = g_const_api_token.Wanted;
        g_type_api.LoadData(page_account_index.AfterGetDefaultAddress, "")
    },
    AfterGetDefaultAddress: function (msg) {
        for (var k in msg.adress) {
            var adress = msg.adress[k];
            if (adress.isdefault == g_const_YesOrNo.YES.toString()) {
                page_account_index.AccountInfo.defaultaddress = adress.provinces + "&nbsp;" + adress.street;
                break;
            }
        }
        var stpl = $("#tpl_accountinfo").html();
        var html = renderTemplate(stpl, page_account_index.AccountInfo);
        $("div.homepage div.hd").html(html);
    },
    //获取订单信息
    GetOrderInfo: function () {
        g_type_api.api_input = {
            nextPage: 1,
            buyer_code: "",
            order_status: g_const_orderStatus.ALL,
            version: 1
        }
        g_type_api.api_target = "com_cmall_familyhas_api_ApiOrderList";
        g_type_api.api_token = g_const_api_token.Wanted;
        g_type_api.LoadData(page_account_index.AfterGetOrderInfo, "")
    },
    AfterGetOrderInfo: function (msg) {
        var stpl_product = $("#tpl_orderproductlist").html();
        var stpl_order = $("#tpl_orderlist").html();
        var producthtml = "";
        var orderhtml = "";
        if (msg.sellerOrderList.length == 0) {
            orderhtml = '<p class="orderwu"><img src="/img/wu_bg.png" alt="">暂无订单</p>';
        }
        else {
            var sellerOrder = msg.sellerOrderList[0];
            producthtml = "";
            //for (var j = 0; j < sellerOrder.apiSellerList.length; j++) {
            if (sellerOrder.apiSellerList.length > 0) {
                var product = sellerOrder.apiSellerList[0];
                var pdata = {
                    productlink: g_const_PageURL.GetLink(g_const_PageURL.ProductDetail, "&pid=" + product.product_code),
                    productpicture: g_GetPictrue(product.mainpic_url),
                    productlabel: product.labels == "" ? "" : "<em>" + product.labels + "</em>",
                    productname: product.product_name,
                    productsku: function (product) {
                        var html = "";
                        for (var k = 0 ; k < product.standardAndStyleList.length; k++) {
                            var productstyle = product.standardAndStyleList[k];
                            var style = productstyle.standardAndStyleKey + ":" + productstyle.standardAndStyleValue;
                            if (k == 0)
                                html += style;
                            else
                                html += "<i>" + style + "</i>";
                        }
                        return html;
                    }(product),
                    productprice: product.sell_price,
                    productbuycount: product.product_number
                };
                producthtml += renderTemplate(stpl_product, pdata);
            }
            //}
            var odata = {
                ordertime: sellerOrder.create_time,
                orderno: sellerOrder.order_code,
                orderstatus: g_const_orderStatus.GetStatusText(sellerOrder.order_status),
                productlist: producthtml,
                orderdetaillink: g_const_PageURL.GetLink(g_const_PageURL.MyOrder_detail, "&orderno=" + sellerOrder.order_code)
            };
            orderhtml += renderTemplate(stpl_order, odata);
        }
        $("div.order-list").html(orderhtml);
    },
};