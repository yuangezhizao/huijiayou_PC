
//(function () {
//    var ajaxBack = $.ajax;
//    var ajaxCount = 0;
//    var allAjaxDone = function () { $('#test').append('all done!<br>'); } //一行代码，就可以知道所有ajax请求什么时候结束
//    //由于get/post/getJSON等，最后还是调用到ajax，因此只要改ajax函数即可
//    $.ajax = function (setting) {
//        ajaxCount++;
//        var cb = setting.complete;
//        setting.complete = function () {
//            if ($.isFunction(cb)) { cb.apply(setting.context, arguments); }
//            ajaxCount--;
//            if (ajaxCount == 0 && $.isFunction(allAjaxDone)) {
//                allAjaxDone();
//            }
//        }
//        ajaxBack(setting);
//    }

//})();

$(function () {
    IndexCart.Init();
    $("#btnCart").click(function () {
        g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.Cart), "");
    });

});
var g_index = {
    PageUrl: g_const_PageURL[GetQueryString("u")],
    Tag: "#mainContent",
    Init: function () {
        var id = GetQueryString("u");
        if (id) {
            $(".nav a").removeClass("curr");
            $("#" + id).addClass("curr");
        }
        var title = g_const_PageTitle[GetQueryString("u")];
        if (title) {
            document.title = g_const_PageTitle.Base + "-" + title;
        }
        if (g_index.PageUrl) {
            $(g_index.Tag).load(g_index.PageUrl);
        }
        else {
            var web_from = "";
            if (GetQueryString("from") != '') {
                web_from += "&from=" + GetQueryString("from");
            }
            if (GetQueryString("etc_s") != '') {
                web_from += "&etc_s=" + GetQueryString("etc_s");
            }
            if (GetQueryString("etc_k") != '') {
                web_from += "&etc_k=" + GetQueryString("etc_k");
            }
            if (GetQueryString("etc_g") != '') {
                web_from += "&etc_g=" + GetQueryString("etc_g");
            }
            if (GetQueryString("etc_c") != '') {
                web_from += "&etc_c=" + GetQueryString("etc_c");
            }
            if (GetQueryString("etc_d") != '') {
                web_from += "&etc_d=" + GetQueryString("etc_d");
            }
            var _r = Math.random().toString();
            window.location.href = "Index.html?t=" + _r + web_from;
        }
        if ($("#ul_warrant")) {
            g_index.Warrant();
        }
    },
    Load: function (u, p) {
        $(g_index.Tag).load(g_const_PageURL[u] + p);
    },
    GoTo: function (u, p, isOpen,openNew) {
        var web_from = "";
        if (GetQueryString("from")!='') {
            web_from += "&from="+GetQueryString("from");
        }
        if (GetQueryString("etc_s") != '') {
            web_from += "&etc_s=" + GetQueryString("etc_s");
        }
        if (GetQueryString("etc_k") != '') {
            web_from += "&etc_k=" + GetQueryString("etc_k");
        }
        if (GetQueryString("etc_g") != '') {
            web_from += "&etc_g=" + GetQueryString("etc_g");
        }
        if (GetQueryString("etc_c") != '') {
            web_from += "&etc_c=" + GetQueryString("etc_c");
        }
        if (GetQueryString("etc_d") != '') {
            web_from += "&etc_d=" + GetQueryString("etc_d");
        }
        if (isOpen || u == "ProductDetail" || u == "SearchList" || u == "Cart" || u == "Register" || u == "Login") {
            var openLink = $("#com_a");
            if (openNew == 'true') {
                openLink.attr('target', '_blank')
            }
            openLink.attr('href', g_const_PageURL.MainIndex + "?u=" + u + p+web_from);
            openLink[0].click();
            return false;
        }
        else {
            window.location.href = g_const_PageURL.MainIndex + "?u=" + u + p+web_from
        }
    },
    Warrant: function () {
        var ul_html = "";
        ul_html += "<li class=\"l1\">";
        ul_html += "<b>100%正品保证</b>";
        ul_html += "<i>质量有保障</i>";
        ul_html += "</li>";
        ul_html += "<li class=\"l2\">";
        ul_html += "<b>在线支付 全场包邮</b>";
        ul_html += "<i>送货上门</i>";
        ul_html += "</li>";
        ul_html += "<li class=\"l3\">";
        ul_html += "<b>支持银联刷卡付款</b>";
        ul_html += "<i>付款更安全</i>";
        ul_html += "</li>";
        ul_html += "<li class=\"l4\">";
        ul_html += "<b>货到付款 开箱验货</b>";
        ul_html += "<i>满意才收货</i>";
        ul_html += "</li>";
        ul_html += "<li class=\"l5\">";
        ul_html += "<b>7x24小时人工服务</b>";
        ul_html += "<i>微笑无时无刻 4008-678-210</i>";
        ul_html += "</li>";
        $("#ul_warrant").html(ul_html);
    }
};
var IndexCart = {
    Init: function () {
        if (g_type_cart.LocalCart() != null) {
            if (g_type_cart.LocalCart().GoodsInfoForAdd.length == 0) {
                $("#cart_yes").hide();
                $("#cart_no").show();
                $("#i_totalnum").html(0);
                $("#i_totalnum_top").html(0);
                $("#shoppingCartNum").html(0);
            }
            else {
                UserLogin.Check(IndexCart.LoadData);
            }
        }
        else {
            $("#cart_yes").hide();
            $("#cart_no").show();
            $("#i_totalnum").html(0);
            $("#i_totalnum_top").html(0);
            $("#shoppingCartNum").html(0);
        }
    },
    checkLogin: 0,
    checkLoginname: "",
    LoadData: function () {
        //var completeCart = g_type_cart.LocalCompleteCart();
        //if (completeCart) {
        //    if (completeCart.resultCode == g_const_Success_Code) {
        //        {
        //            IndexCart.SetCartList(completeCart);
        //            return false;
        //        }
        //    }
        //}
        var objcarts = [];
        if (g_type_cart.LocalCart() && UserLogin.LoginStatus==g_const_YesOrNo.NO) {
            objcarts = g_type_cart.LocalCart().GoodsInfoForAdd;
        }
        IndexCart.checkLogin = UserLogin.LoginStatus;
        IndexCart.checkLoginname = UserLogin.LoginName;
        var api_input = { "goodsList": objcarts, "isPurchase": 1, "channelId": g_const_ChannelID };
        var api_target = "com_cmall_familyhas_api_APiShopCartForCache";
        var s_api_input = JSON.stringify(api_input);
        var obj_data = { "api_input": s_api_input, "api_target": api_target, "api_token": (IndexCart.checkLogin == g_const_YesOrNo.YES ? "1" : "") };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultCode == g_const_Success_Code) {
                g_type_cart.AddCompleteCart(msg);
                IndexCart.SetCartList(msg);
            }
            else {
                $("#cart_yes").hide();
                $("#cart_no").show();
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    SetCartList: function (msg) {
        var divHtml = "";
        var totalPrice = 0;
        var totalNum = 0;
        var list_price = 0;
        $.each(msg.shoppingCartList, function (k, o) {
            if (o.derateMoney > 0) {
                divHtml += "<li class=\"curr\"><span>立减：<strong>￥" + o.derateMoney + "</strong></span><i>" + o.event.tagname + "</i>" + o.event.description + "</li>";
            }
            list_price = 0;
            $.each(o.goods, function (i, n) {

                divHtml += "<li>";
                divHtml += "<a onclick=\"IndexCart.Load_Product(" + n.product_code + ")\" class=\"product\" style=\"cursor:pointer\">";
                divHtml += "<img src=\"" + g_GetPictrue(n.pic_url) + "\" alt=\"\" style=\"width:60px;height:60px\">";
                divHtml += "<font>";
                $.each(n.activitys, function (j, m) {
                    if (m.activity_name == "赠品") {
                        divHtml += "<i class=\"i1\">" + m.activity_name + "</i>";
                    }
                    else if (m.activity_name) {
                        divHtml += "<i>" + m.activity_name + "</i>";
                    }
                });
                $.each(n.otherShow, function (j, m) {
                    if (m.activity_name == "赠品") {
                        divHtml += "<i class=\"i1\">" + m + "</i>";
                    }
                    else {
                        divHtml += "<i>" + m + "</i>";
                    }
                });
                divHtml += String.DelHtmlTag(n.sku_name) + "</font>";
                divHtml += "</a>";
                divHtml += "<span>" + parseFloat(n.sku_price).toFixed(2) + " X " + n.sku_num + "<a style=\"cursor:pointer\" class=\"delete\" onclick=\"IndexCart.DeleteSelect('" + n.product_code + "','" + n.sku_code + "')\">删除</a></span>";
                divHtml += "</li>";
                list_price += parseFloat((n.sku_price * n.sku_num));
                // totalPrice += parseFloat((n.sku_price * n.sku_num));
                totalNum += n.sku_num;
            });
            if (o.payMoney == 0) {
                totalPrice += list_price;
            }
            else {
                totalPrice += parseFloat(o.payMoney);
            }
        });

        $("#wrasList").html(divHtml);
        $("#i_totalnum").html(totalNum);
        $("#i_totalnum_top").html(totalNum);
        $("#shoppingCartNum").html(totalNum);
        if (totalNum > 99) {
            $("#i_totalnum_top").html("99+");
        }
        $("#i_totalprice").html(msg.allPayMoney);
        $("#cart_yes").show();
        $("#cart_no").hide();
        ///  jsScroll(document.getElementById('wrasList'), 5, '', 'b');
        $("#wrasList").each(function () {
            $(this).perfectScrollbar();
        })
    },
    DeleteSelect: function (del_product_code, del_sku_code) {
        var del_list = [];
        if (IndexCart.checkLogin == 1) {
            del_list.push([del_product_code, del_sku_code]);
            g_type_cart.BatchRemoveWithCloud(del_list);
        }
        else {
            //未登录
            g_type_cart.Remove(del_product_code, del_sku_code);
        }
        IndexCart.Init();
        var u = GetQueryString("u");
        if (u == "Cart" && CartInfo) {
            CartInfo.LoadData(CartInfo.checkLogin, CartInfo.checkLoginname);
        }
    },
    Load_Product: function (pid) {
        var p = "&pid=" + pid + "&t=" + Math.random();
        g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.ProductDetail), p)
    },
};