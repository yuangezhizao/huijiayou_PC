var isEdit = 0; //编辑状态 0 否定 1 肯定
var selectNum = 0;
$(document).ready(function () {
    //Merchant1.RecordValid();
    //下拉重新加载
    //ScrollReload.Listen("divCartList", "div_scrolldown", "Cart", "10", CartInfo.LoadData);
    //ScrollReload.Listen("divCartNull", "div_scrolldown", "Cart", "10", CartInfo.LoadData);
});

function ToIndex() {
    var p = "?t=" + Math.random();
    location.href = g_const_PageURL.Index + p;
}

function ToLogin() {
    PageUrlConfig.SetUrl(g_const_PageURL.MainIndex + "?u=Cart");
    var p = "&t=" + Math.random();
    g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.Login), p);
}

function CartLoadData() {
    $("#loadTip").show();
    CartInfo.checkLogin = UserLogin.LoginStatus;
    CartInfo.checkLoginname = UserLogin.LoginName;
    var api_input = { "goodsList": g_type_cart.LocalCart().GoodsInfoForAdd, "isPurchase": 1, "channelId": g_const_ChannelID };
    var api_target = "com_cmall_familyhas_api_APiShopCartForCache";
    var s_api_input = JSON.stringify(api_input);
    var obj_data = { "api_input": s_api_input, "api_target": api_target, "api_token": (CartInfo.checkLogin == g_const_YesOrNo.YES ? "1" : "") };
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
            CartInfo.SetList(msg);
        }
        else {
            ShowMesaage(msg.resultMessage);
            $("#loadTip").hide();
        }
    });

    request.fail(function (jqXHR, textStatus) {
        ShowMesaage(g_const_API_Message["7001"]);
        $("#loadTip").hide();
    });

    CartInfo.SetList();
}

function CartLoadData1() {

}

var CartInfo = {
    //提交购物车信息
    UploadDate: function () {
        var api_input = { "goodsList": g_type_cart.LocalCart().GoodsInfoForAdd, "isPurchase": 1, "channelId": g_const_ChannelID };
        var api_target = "com_cmall_familyhas_api_APiShopCartForCache";
        var s_api_input = JSON.stringify(api_input);
        var obj_data = { "api_input": s_api_input, "api_target": api_target, "api_token": "1" };
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
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    LoadData: function () {
        $("#loadTip").show();
        var objcarts = [];
        if (g_type_cart.LocalCart()) {
            objcarts = g_type_cart.LocalCart().GoodsInfoForAdd;
        }
        CartInfo.checkLogin = UserLogin.LoginStatus;
        CartInfo.checkLoginname = UserLogin.LoginName;
        var api_input = { "goodsList": objcarts, "isPurchase": 1, "channelId": g_const_ChannelID };
        var api_target = "com_cmall_familyhas_api_APiShopCartForCache";
        var s_api_input = JSON.stringify(api_input);
        var obj_data = { "api_input": s_api_input, "api_target": api_target, "api_token": (CartInfo.checkLogin == g_const_YesOrNo.YES ? "1" : "") };
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
                CartInfo.SetCartList(msg);
            }
            else {
                $("#divCartNull").show();
                if (UserLogin.LoginStatus == g_const_YesOrNo.YES) {
                    $("#p_login").show();
                    $("#p_unlogin").hide();
                }
                else {
                    $("#p_login").hide();
                    $("#p_unlogin").show();
                }
                $("#loadTip").hide();
                CartInfo.ShowView();
                Message.Operate("", "divAlert");
            }
        });

        request.fail(function (jqXHR, textStatus) {
            $("#loadTip").hide();
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    ShowView: function () {
        if (isEdit == 0) {
            $("#btnEdit").show();
            $("#btnFinish").hide();
            $("#divFootView").show();
            $("#divFootEdit").hide();
            // $("#btnClear").hide();
        }
        else {
            $("#btnEdit").hide();
            $("#btnFinish").show();
            $("#divFootView").hide();
            $("#divFootEdit").show();
            //  $("#btnClear").show();
        }

    },
    //设置页面信息
    SetCartList: function (msg) {
        $("#btnClear").hide();
        //g_type_cart.Clear();
        if (msg.acount_num > 0) {
            var divHtml = "";
            var divInvalid = "";
            var special_price = "";
            var invalidnum = 0;
            var selectClass = "";
            var subClass = "";
            var addClass = "";
            var trClass = "";
            $("#spanTitle").html(msg.salesAdv);
            divHtml += "<tr>";
            divHtml += "<th colspan=\"2\" width=\"98\"><label><input id=\"cbseletall_top\" type=\"checkbox\" name=\"\" value=\"\" onclick=\"CartInfo.SelectAll(this)\">全选</label></th>";
            divHtml += "<th width=\"560\"><span>商品</span></th>";
            divHtml += "<th width=\"125\">单价( 元）</th>";
            divHtml += "<th width=\"150\">数量</th>";
            divHtml += "<th width=\"105\">小计（元）</th>";
            divHtml += "<th width=\"102\">操作</th>";
            divHtml += "</tr>";

            $.each(msg.shoppingCartList, function (k, o) {
                if (o.event.tagname.length > 0) {

                    divHtml += "<tr><td colspan=\"7\" class=\"tdd\"><span>立减：<b>￥" + o.derateMoney + "</b></span><i>" + o.event.tagname + "</i>" + o.event.description + " <a onclick=\"CartInfo.OpenFullCut('" + o.eventCode + "','" + o.start_time + "','" + o.end_time + "')\">详情</a></td></tr>";
                }
                $.each(o.goods, function (i, n) {

                    //if (n.sku_num > n.limit_order_num) {
                    //    n.sku_num = n.limit_order_num;
                    //}
                    if (n.chooseFlag == "1") {
                        selectClass = "checked";
                        trClass = "class=\"curr\"";
                    }
                    else {
                        selectClass = "";
                        trClass = "";
                    }
                    divHtml += "<tr id=\"tr_" + n.product_code + "_" + n.sku_code + "\" " + trClass + ">";
                    divHtml += "<td width=\"60\"><input type=\"checkbox\" name=\"\" id=\"cb_" + n.product_code + "_" + n.sku_code + "\" onclick=\"CartInfo.SelectProduct('" + n.product_code + "','" + n.sku_code + "')\" " + selectClass + "></td>";
                    divHtml += "<td width=\"560\" colspan=\"2\">";
                    divHtml += '<a onclick="CartInfo.Load_Product(\'' + n.product_code + '\')">';
                    divHtml += "<img src=\"" + g_GetPictrue(n.pic_url) + "\" alt=\"\" width=\"83\" height=\"83\">";
                    divHtml += "<p><font>";
                    divHtml += "</font><b>" + String.DelHtmlTag(n.sku_name) + "</b>";
                    $.each(n.otherShow, function (j, m) {
                        divHtml += "<em>" + m + "</em>";
                    });
                    divHtml += "</p>";
                    divHtml += "<strong>";
                    $.each(n.sku_property, function (j, m) {
                        if (j == 0) {
                            divHtml += m.propertyKey + "：" + m.propertyValue;
                        }
                        else {
                            divHtml += "<br>" + m.propertyKey + "：" + m.propertyValue;
                        }
                    });
                    divHtml += "</strong>";
                    divHtml += "</a>";
                    divHtml += "<input type=\"hidden\" id=\"hidName_" + n.product_code + "_" + n.sku_code + "\" value=\"" + n.sku_name + "\" />";
                    divHtml += "<input type=\"hidden\" id=\"hidNum_" + n.product_code + "_" + n.sku_code + "\" value=\"" + n.sku_num + "\" />";
                    divHtml += "<input type=\"hidden\" id=\"hidPrice_" + n.product_code + "_" + n.sku_code + "\" value=\"" + (n.sku_price * n.sku_num) + "\" />";
                    divHtml += "<input type=\"hidden\" id=\"hidlimit_" + n.product_code + "_" + n.sku_code + "\" value=\"" + n.limit_order_num + "\" />";
                    divHtml += "<input type=\"hidden\" id=\"hidPriceUnit_" + n.product_code + "_" + n.sku_code + "\" value=\"" + n.sku_price + "\" />";
                    divHtml += "</td>";
                    divHtml += "<td width=\"125\"><span>" + parseFloat(n.sku_price).toFixed(2);
                    $.each(n.activitys, function (j, m) {
                        if (m.activity_name) {
                            divHtml += "<i>" + m.activity_name + "</i>";
                        }
                    });
                    if (n.sku_num == 1) {
                        subClass = "class=\"curr\"";
                    }
                    else {
                        subClass = "";
                    }
                    if (n.sku_num == n.sku_stock) {
                        addClass = "class=\"curr\"";
                    }
                    else {
                        addClass = "";
                    }
                    divHtml += "</span></td><td width=\"150\"><label><i style=\"cursor:pointer\" id=\"i_sub_" + n.product_code + "_" + n.sku_code + "\" " + subClass + " onclick=\"CartInfo.SetSkuNum('" + n.product_code + "','" + n.sku_code + "',-1,'" + n.sku_stock + "')\">-</i><input id=\"txtSkuNum_" + n.product_code + "_" + n.sku_code + "\" onkeyup=\"CartInfo.SetSkuNum('" + n.product_code + "','" + n.sku_code + "',0,'" + n.sku_stock + "')\" type=\"tel\" value=\"" + n.sku_num + "\"><i style=\"cursor:pointer\" id=\"i_add_" + n.product_code + "_" + n.sku_code + "\" " + addClass + " onclick=\"CartInfo.SetSkuNum('" + n.product_code + "','" + n.sku_code + "',1,'" + n.sku_stock + "')\">+</i></label><br>";
                    if (n.flag_stock == "0") {
                        divHtml += "<span class=\"s2\">库存不足</span>";
                    }
                    else {
                        if (n.limit_order_num > 0) {
                            divHtml += "<span class=\"s2\">限购" + n.limit_order_num + "件</span>";
                        }
                    }
                    divHtml += "</td><td width=\"105\"><span class=\"s1\">" + parseFloat((n.sku_price * n.sku_num)).toFixed(2) + "</span></td>";
                    divHtml += "<td width=\"102\"><a style=\"cursor:pointer\" class=\"del\" onclick=\"CartInfo.DeleteSelect('" + n.product_code + "','" + n.sku_code + "')\">删除</a></td>";
                    divHtml += "</tr>";
                });
                if (o.event.tagname.length > 0) {
                    divHtml += "<tr><td colspan=\"7\" class=\"tdd\"><span>小计：<b>￥" + o.payMoney + "</b></span></td></tr>";
                }
            });
            $.each(msg.disableGoods, function (i, n) {
                divInvalid += "<tr class=\"invalid\" id=\"tr_" + n.product_code + "_" + n.sku_code + "\">";
                divInvalid += "<td width=\"60\">失效</td>";
                divInvalid += "<td colspan=\"2\" width=\"598\">";
                divInvalid += '<a onclick="CartInfo.Load_Product(\'' + n.product_code + '\')">';
                divInvalid += "<span></span>";
                divInvalid += "<img src=\"" + g_GetPictrue(n.pic_url) + "\" alt=\"\" width=\"83\" height=\"83\">";
                divInvalid += "<p><font>";

                divInvalid += "</font><b>" + String.DelHtmlTag(n.sku_name) + "</b>";
                $.each(n.otherShow, function (j, m) {
                    divInvalid += "<em>" + m + "</em>";
                });
                divInvalid += "</p>";
                divInvalid += "<strong>";
                $.each(n.sku_property, function (j, m) {
                    if (j == 0) {
                        divInvalid += m.propertyKey + "：" + m.propertyValue;
                    }
                    else {
                        divInvalid += "<br>" + m.propertyKey + "：" + m.propertyValue;
                    }
                });
                divInvalid += "</strong>";
                divInvalid += "</a>";
                divInvalid += "</td>";
                divInvalid += "<td width=\"125\"><span>" + parseFloat(n.sku_price).toFixed(2);
                $.each(n.activitys, function (j, m) {
                    if (m.activity_name) {
                        divInvalid += "<i>" + m.activity_name + "</i>";
                    }
                });
                divInvalid += "</span></td><td width=\"150\"><label><i>-</i><input type=\"text\" readonly value=\"" + n.sku_num + "\"><i>+</i></label></td>";
                divInvalid += "<td width=\"105\"><span class=\"s1\">" + parseFloat((n.sku_price * n.sku_num)).toFixed(2) + "</span></td>";
                divInvalid += "<td width=\"102\"><a style=\"cursor:pointer\" class=\"del\" onclick=\"CartInfo.DeleteSelect('" + n.product_code + "','" + n.sku_code + "')\">删除</a></td>";
                divInvalid += "</tr>";
                invalidnum++;
            });

            $("#spinvalidnum").html(invalidnum);
            if (invalidnum > 0) {
                $("#h3_invalid").show();
                $("#btnClear").show();
            }
            else {
                $("#h3_invalid").hide();
                $("#btnClear").hide();
            }
            $("#tbCartList").html(divHtml);

            //全选样式处理
            CartInfo.SelectAllStyleChange();

            $("#tbCartList").show();
            $("#tbCartInvalid").html(divInvalid);
            // CartInfo.SetGoodsNum();
            $("#divCart").show();
            if (invalidnum > 0) {
                $("#divCartInvalid li").find("img").each(function () {
                    grayscale($(this));
                });
            }
        }
        else {
            $("#divCartList").html("");
            $("#divCartNull").show();
            if (UserLogin.LoginStatus == g_const_YesOrNo.YES) {
                $("#p_login").show();
                $("#p_unlogin").hide();
            }
            else {
                $("#p_login").hide();
                $("#p_unlogin").show();
            }
            $("#divCart").hide();
            $("#btnClear").hide();
        }
        selectNum = msg.chooseGoodsNum;
        $("#sp_total").html(msg.chooseGoodsNum);
        $("#pay_money").html("￥" + parseFloat(msg.allPayMoney).toFixed(2));
        if (msg.allDerateMoney > 0) {
        //    $("#total_money").html("总计：￥" + parseFloat(msg.allNormalMoney).toFixed(2));
            $("#discount_money").html("优惠：<em>￥" + msg.allDerateMoney + "</em>");
        }
        else {
          //  $("#total_money").html("总计：￥" + msg.allNormalMoney);
        }
        if (IndexCart.SetIng == 0) {
            IndexCart.SetIng = 1;
        }
        $("#loadTip").hide();
        setTimeout("$(\"#div_scrolldown\").hide()", 1000);
        Message.Operate("", "divAlert");
    //........[去结算]offsetTop大于多少时悬浮在底部。
        var haha =document.getElementById('ft_01');
        var hehe=document.getElementById('ft_02');
        var oHeight= haha.offsetTop+ haha.offsetHeight;
        // var oT=haha.offsetTop;
        // var oH=haha.offsetHeight;
        var oT=$(haha).offset().top;
        var oH = $(haha).outerHeight();
        window.onscroll=function() {
                console.log($(haha).offset().top);
                var scrollT = document.documentElement.scrollTop||document.body.scrollTop;
                var clientH = document.documentElement.clientHeight;
                var scrollB = scrollT+clientH;
                if(oT+oH>scrollB) {
                    haha.style.position='fixed';
                    haha.style.left='0';
                    haha.style.bottom='0';
                    hehe.style.display='block';
                    $(haha).addClass('botm');
                    } else {
                    hehe.style.display = 'none';
                    haha.style.position='';
                    $(haha).removeClass('botm');
                    }
            }
    },
    OpenFullCut: function (activityCode, startTime, endTime) {
        PageUrlConfig.SetUrl();
        g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.FullCut), "&t=" + Math.random()
                                    + "&activitycode=" + activityCode
                                    + "&begintime=" + startTime
                                    + "&endtime=" + endTime, true);
    },
    SetList: function (msg) {
        $("#btnClear").hide();
        if (!g_type_cart.LocalCartFull()) {
            $("#divCartNull").show();
            // CartInfo.ShowView();
            if (UserLogin.LoginStatus == g_const_YesOrNo.YES) {
                $("#p_login").show();
                $("#p_unlogin").hide();
            }
            else {
                $("#p_login").hide();
                $("#p_unlogin").show();
            }
            return;
        }
        if (g_type_cart.LocalCartFull().GoodsInfoForQuery.length > 0) {

            //隐藏下拉回调层
            var divHtml = "";
            var divInvalid = "";
            var special_price = "";
            var invalidnum = 0;
            var selectClass = "";
            var subClass = "";
            var addClass = "";
            $("#spanTitle").html(g_type_cart.SalesAdv);
            $("#tbCartList").empty();
            $.each(g_type_cart.LocalCartFull().GoodsInfoForQuery, function (i, n) {
                special_price = "";
                selectClass = "";
                subClass = "";
                addClass = "";
                if (n.flag_product == "1") {


                    divHtml += "<tr id=\"tr_" + n.product_code + "_" + n.sku_code + "\">";
                    divHtml += "<td width=\"60\"><input type=\"checkbox\" name=\"\" id=\"cb_" + n.product_code + "_" + n.sku_code + "\" onclick=\"CartInfo.SelectProduct('" + n.product_code + "','" + n.sku_code + "')\"></td>";
                    divHtml += "<td width=\"560\" colspan=\"2\">";
                    divHtml += '<a onclick="CartInfo.Load_Product(\'' + n.product_code + '\')">';
                    divHtml += "<img src=\"" + g_GetPictrue(n.pic_url) + "\" alt=\"\" width=\"83\" height=\"83\">";
                    divHtml += "<p><font>";
                    $.each(n.otherShow, function (j, m) {
                        divHtml += "<i>" + m + "</i>";
                    });
                    divHtml += "</font><b>" + String.DelHtmlTag(n.sku_name) + "</b>";
                    divHtml += "<em>赠：XXXXXXXXXXXXXXXXXX显示一行，显示不下....</em>";
                    divHtml += "</p>";
                    divHtml += "<strong>";
                    $.each(n.sku_property, function (j, m) {
                        if (j == 0) {
                            divHtml += m.propertyKey + "：" + m.propertyValue;
                        }
                        else {
                            divHtml += "<br>" + m.propertyKey + "：" + m.propertyValue;
                        }
                    });
                    divHtml += "</strong>";
                    divHtml += "</a>";
                    divHtml += "<input type=\"hidden\" id=\"hidNum_" + n.product_code + "_" + n.sku_code + "\" value=\"" + n.sku_num + "\" />";
                    divHtml += "<input type=\"hidden\" id=\"hidPrice_" + n.product_code + "_" + n.sku_code + "\" value=\"" + (n.sku_price * n.sku_num) + "\" />";
                    divHtml += "<input type=\"hidden\" id=\"hidlimit_" + n.product_code + "_" + n.sku_code + "\" value=\"" + n.limit_order_num + "\" />";
                    divHtml += "<input type=\"hidden\" id=\"hidPriceUnit_" + n.product_code + "_" + n.sku_code + "\" value=\"" + n.sku_price + "\" />";
                    divHtml += "</td>";
                    divHtml += "<td width=\"125\"><span>" + parseFloat(n.sku_price).toFixed(2);
                    $.each(n.activitys, function (j, m) {
                        // if (m.activity_name == "特价" || m.activity_name == "闪购") {
                        divHtml += "<i>" + m.activity_name + "</i>";
                        //}
                        //else {
                        //  divHtml += "<i>" + m.activity_name + "</i>";
                        //}
                    });
                    if (n.sku_num == 1) {
                        subClass = "class=\"curr\"";
                    }
                    if (n.sku_num == n.limit_order_num) {
                        addClass = "class=\"curr\"";
                    }
                    divHtml += "</span></td><td width=\"150\"><label><i id=\"i_sub_" + n.product_code + "_" + n.sku_code + "\" " + subClass + " onclick=\"CartInfo.SetSkuNum('" + n.product_code + "','" + n.sku_code + "',-1)\">-</i><input id=\"txtSkuNum_" + n.product_code + "_" + n.sku_code + "\" onkeyup=\"CartInfo.SetSkuNum('" + n.product_code + "','" + n.sku_code + "',0)\" type=\"tel\" value=\"" + n.sku_num + "\"><i id=\"i_add_" + n.product_code + "_" + n.sku_code + "\" " + addClass + " onclick=\"CartInfo.SetSkuNum('" + n.product_code + "','" + n.sku_code + "',1)\">+</i></label><br>";
                    if (n.flag_stock == "0") {
                        divHtml += "<span class=\"s2\">库存不足</span>";
                    }
                    else {
                        if (n.limit_order_num > 0) {
                            divHtml += "<span class=\"s2\">限购" + n.limit_order_num + "件</span>";
                        }
                    }
                    divHtml += "</td><td width=\"105\"><span class=\"s1\">" + parseFloat((n.sku_price * n.sku_num)).toFixed(2) + "</span></td>";
                    divHtml += "<td width=\"102\"><a style=\"cursor:pointer\" class=\"del\" onclick=\"CartInfo.DeleteSelect('" + n.product_code + "','" + n.sku_code + "')\">删除</a></td>";
                    divHtml += "</tr>";


                    //  divHtml += "<div class=\"ch-box\" >";
                    //divHtml += "<h2><em>闪  购</em>距离结束<i>15：45：35</i></h2>";
                    //divHtml += "<h2><em>满  赠</em>活动商品购满99.0元，即可获得赠品</h2>";
                    // $.each(n.activitys, function (j, m) {
                    //     if (m.activity_name == "特价" || m.activity_name == "闪购") {
                    //         special_price = "<em>" + m.activity_name + "</em>";
                    //     }
                    //     else {
                    //         special_price = "<em>" + m.activity_name + "</em>";
                    //        // divHtml += "<h2><em>" + m.activity_name + "</em>" + m.activity_info + "</h2>";
                    //     }
                    // });
                    //// special_price = "<em>闪购</em>";
                    // $.each(n.otherShow, function (j, m) {
                    //     divHtml += "<h2><em>" + m + "</em></h2>";
                    // });
                    // divHtml += "<ul>";
                    // if (isEdit == 0) {
                    //     selectClass = "class=\"curr\"";
                    // }
                    // else {
                    //     if (true) {

                    //     }
                    //     selectClass = "";
                    // }
                    // divHtml += "<li id=\"liProduct_" + n.product_code + "_" + n.sku_code + "\" " + selectClass + " onclick=\"CartInfo.SelectProduct('" + n.product_code + "','" + n.sku_code + "')\">";
                    // divHtml += "<img src=\"" + g_GetPictrue(n.pic_url) + "\" alt=\"\">";
                    // //  divHtml += "<strong>限购" + n.limit_order_num + "件</strong>";
                    // if (n.flag_stock=="0") {
                    //     divHtml += "<strong>库存不足</strong>";
                    // }
                    // divHtml += "<font>";
                    // if (isEdit == 0) {
                    //     divHtml += "<b onclick=\"CartInfo.Load_Product('" + n.product_code + "')\">" + String.DelHtmlTag(n.sku_name) + "</b>";
                    // }
                    // else {
                    //     divHtml += " <label><i onclick=\"CartInfo.SetSkuNum('" + n.product_code + "','" + n.sku_code + "',-1)\">-</i><input readonly=\"readonly\" id=\"txtSkuNum_" + n.product_code + "_" + n.sku_code + "\" onkeyup=\"CartInfo.SetSkuNum('" + n.product_code + "','" + n.sku_code + "',0)\" type=\"tel\" value=\"" + n.sku_num + "\"><i onclick=\"CartInfo.SetSkuNum('" + n.product_code + "','" + n.sku_code + "',1)\">+</i></label>";
                    // }
                    // $.each(n.sku_property, function (j, m) {
                    //     divHtml += "<em>" + m.propertyKey + "：" + m.propertyValue + "</em>";
                    // });
                    // divHtml += "</font>";
                    // divHtml += "<input type=\"hidden\" id=\"hidNum_" + n.product_code + "_" + n.sku_code + "\" value=\"" + n.sku_num + "\" />";
                    // divHtml += "<span>￥" + n.sku_price + "<i>x" + n.sku_num + "</i>";
                    // divHtml += special_price;
                    // divHtml += "</span></li>";
                    // divHtml += "<input type=\"hidden\" id=\"hidPrice_" + n.product_code + "_" + n.sku_code + "\" value=\"" + (n.sku_price * n.sku_num) + "\" />";
                    // divHtml += "<input type=\"hidden\" id=\"hidlimit_" + n.product_code + "_" + n.sku_code + "\" value=\"" + n.limit_order_num + "\" />";
                    // divHtml += "<input type=\"hidden\" id=\"hidPriceUnit_" + n.product_code + "_" + n.sku_code + "\" value=\"" + n.sku_price + "\" />";
                    // divHtml += "</ul>";
                    // divHtml += "</div>";
                }
                else {
                    divInvalid += "<tr class=\"invalid\" id=\"tr_" + n.product_code + "_" + n.sku_code + "\">";
                    divInvalid += "<td width=\"60\">失效</td>";
                    divInvalid += "<td colspan=\"2\" width=\"598\">";
                    divInvalid += '<a onclick="CartInfo.Load_Product(\'' + n.product_code + '\')">';
                    divInvalid += "<span></span>";
                    divInvalid += "<img src=\"" + g_GetPictrue(n.pic_url) + "\" alt=\"\" width=\"83\" height=\"83\">";
                    divInvalid += "<p><font>";
                    $.each(n.otherShow, function (j, m) {
                        divInvalid += "<i>" + m + "</i>";
                    });
                    divInvalid += "</font><b>" + String.DelHtmlTag(n.sku_name) + "</b>";
                    divInvalid += "<em>赠：XXXXXXXXXXXXXXXXXX显示一行，显示不下....</em>";
                    divInvalid += "</p>";
                    divInvalid += "<strong>";
                    $.each(n.sku_property, function (j, m) {
                        if (j == 0) {
                            divInvalid += m.propertyKey + "：" + m.propertyValue;
                        }
                        else {
                            divInvalid += "<br>" + m.propertyKey + "：" + m.propertyValue;
                        }
                    });
                    divInvalid += "</strong>";
                    divInvalid += "</a>";
                    divInvalid += "</td>";
                    divInvalid += "<td width=\"125\"><span>" + parseFloat(n.sku_price).toFixed(2);
                    $.each(n.activitys, function (j, m) {
                        // if (m.activity_name == "特价" || m.activity_name == "闪购") {
                        divInvalid += "<i>" + m.activity_name + "</i>";
                        //}
                        //else {
                        //  divHtml += "<i>" + m.activity_name + "</i>";
                        //}
                    });
                    divInvalid += "</span></td><td width=\"150\"><label><i>-</i><input type=\"text\" readonly value=\"" + n.sku_num + "\"><i>+</i></label></td>";
                    divInvalid += "<td width=\"105\"><span class=\"s1\">" + parseFloat((n.sku_price * n.sku_num)).toFixed(2) + "</span></td>";
                    divInvalid += "<td width=\"102\"><a style=\"cursor:pointer\" class=\"del\" onclick=\"CartInfo.DeleteSelect('" + n.product_code + "','" + n.sku_code + "')\">删除</a></td>";
                    divInvalid += "</tr>";
                    //selectClass = "class=\"curr\"";
                    //divInvalid += "<li id=\"liInvalid_" + n.product_code + "_" + n.sku_code + "\">";
                    //divInvalid += "<img src=\"" + n.pic_url + "\" alt=\"\">";
                    //divInvalid += "<font>";
                    //divInvalid += "<b>" + n.sku_name + "</b>";
                    //$.each(n.sku_property, function (j, m) {
                    //    divInvalid += "<em>" + m.propertyKey + "：" + m.propertyValue + "</em>";
                    //});
                    //divInvalid += "</font>";
                    //divInvalid += "<span>￥" + n.sku_price + "</span>";
                    //divInvalid += "</li>";
                    //divInvalid += "";
                    invalidnum++;
                }
            });
            $("#spinvalidnum").html(invalidnum);
            if (invalidnum > 0) {
                $("#h3_invalid").show();
                //if (isEdit == 1) {
                $("#btnClear").show();
                //}
                //$("#divCartInvalid li").find("img").each(function () {
                //    grayscale($(this));
                //});

                // $("#invalid").show();
            }
            else {
                $("#h3_invalid").hide();
                $("#btnClear").hide();
            }
            $("#tbCartList").append(divHtml);
            $("#tbCartList").show();
            // $("#divCartNull").hide();
            $("#tbCartInvalid").html(divInvalid);
            // CartInfo.SetGoodsNum();
            //  $("#spEdit").show();
            $("#divCart").show();
            //  CartInfo.ShowView();
            if (invalidnum > 0) {
                $("#divCartInvalid li").find("img").each(function () {
                    grayscale($(this));
                });

                // $("#invalid").show();
            }
        }
        else {
            $("#divCartList").html("");
            $("#divCartNull").show();
            if (UserLogin.LoginStatus == g_const_YesOrNo.YES) {
                $("#p_login").show();
                $("#p_unlogin").hide();
            }
            else {
                $("#p_login").hide();
                $("#p_unlogin").show();
            }
            $("#divCart").hide();
            $("#btnClear").hide();
            // CartInfo.ShowView();
        }
        selectNum = msg.chooseGoodsNum;
        $("#sp_total").html("(" + msg.chooseGoodsNum + ")");
        $("#sp_price").html(msg.allPayMoney);
        if (msg.allDerateMoney > 0) {
            $("#font_money").html("总计：￥" + msg.allNormalMoney + " 优惠：￥" + msg.allDerateMoney);
        }
        else {
            $("#font_money").html("总计：￥" + msg.allNormalMoney);
        }
        $("#loadTip").hide();
        setTimeout("$(\"#div_scrolldown\").hide()", 1000);
        Message.Operate("", "divAlert");
    },
    SelectProduct: function (product_code, sku_code) {
        var pid = "#tr_" + product_code + "_" + sku_code;
        if ($(pid).attr("class") == "curr") {
            $(pid).attr("class", "");
            CartInfo.SetChooseFlag(product_code, sku_code, g_const_YesOrNo.NO.toString());
        }
        else {
            $(pid).attr("class", "curr");
            CartInfo.SetChooseFlag(product_code, sku_code, g_const_YesOrNo.YES.toString());
        }
        CartInfo.SetGoodsNum();
    },
    SelectAllStyleChange: function () {
        var objcarts = [];
        if (g_type_cart.LocalCart()) {
            objcarts = g_type_cart.LocalCart().GoodsInfoForAdd;
        }
        var isSelectAll = true;
        $(objcarts).each(function () {
            if (this.chooseFlag == "0") {
                isSelectAll = false;
                return false;
            }
        });
        if (isSelectAll) {
            $("#cbseletall_top").prop('checked', true);
            $("#cbseletall_foot").prop('checked', true);
        }
        else {
            $("#cbseletall_top").prop('checked', false);
            $("#cbseletall_foot").prop('checked', false);
        }
    },
    SelectAll: function (obj) {
        var objcarts = g_type_cart.LocalCart();
        $("#tbCartList").find("tr").each(function () {
            if ($(this).attr("class") == "curr") {
                $(this).attr("class", "");
                $(":checkbox").prop('checked', false);
                for (var i = 0; i < objcarts.GoodsInfoForAdd.length; i++) {
                    objcarts.GoodsInfoForAdd[i].chooseFlag = "0";
                }
            }
            else {
                $(this).attr("class", "curr");
                $(":checkbox").prop('checked', true);
                for (var i = 0; i < objcarts.GoodsInfoForAdd.length; i++) {
                    objcarts.GoodsInfoForAdd[i].chooseFlag = "1";
                }
            }
        });
        localStorage[g_const_localStorage.Cart] = JSON.stringify(objcarts);
        CartInfo.SetGoodsNum();
    },
    SetGoodsNum: function () {
        CartInfo.LoadData();
        IndexCart.Init();
        return;
        var goodrecordnum = 0;
        var goodsnum = 0;
        var goodsprice = 0.00;
        var curr_product_code = "";
        var curr_sku_code = "";
        $("#tbCartList").find("tr").each(function () {
            if ($(this).attr("class") == "curr") {
                goodrecordnum++;
                curr_product_code = $(this).attr("id").split('_')[1];
                curr_sku_code = $(this).attr("id").split('_')[2];
                goodsnum += parseInt($("#hidNum_" + curr_product_code + "_" + curr_sku_code).val());
                goodsprice += parseFloat($("#hidPrice_" + curr_product_code + "_" + curr_sku_code).val(), 10);
            }
        });
        $("#sp_total").html(goodsnum);
        $("#sp_price").html("￥" + goodsprice.toFixed(2));
        if (goodrecordnum == $("#tbCartList").find("tr").length) {
            $("#cbseletall_top").prop('checked', true);
            $("#cbseletall_foot").prop('checked', true);
        }
        else {
            $("#cbseletall_top").prop('checked', false);
            $("#cbseletall_foot").prop('checked', false);
        }
        if (goodsnum == 0) {
            $("#btnSubmit").attr("class", "curr");
            $("#btnDel").attr("class", "curr");
            $('#btnSubmit').attr('disabled', 'disabled');
            $('#btnDel').attr('disabled', 'disabled');

        }
        else {
            $("#btnSubmit").attr("class", "");
            $("#btnDel").attr("class", "");
            $('#btnSubmit').attr('disabled', false);
            $('#btnDel').attr('disabled', false);
        }
        selectNum = goodsnum;
    },
    //设置缓存选中
    SetChooseFlag: function (product_code, sku_code, choose_flag) {
        var objcarts = g_type_cart.LocalCart();
        for (var i = 0; i < objcarts.GoodsInfoForAdd.length; i++) {
            var objcart = objcarts.GoodsInfoForAdd[i];
            if (objcart.product_code == product_code && objcart.sku_code == sku_code) {
                objcarts.GoodsInfoForAdd[i].chooseFlag = choose_flag;
            }
        }
        localStorage[g_const_localStorage.Cart] = JSON.stringify(objcarts);
    },
    //设置缓存选中
    SetCartSkuNum: function (product_code, sku_code, sku_num) {
        var objcarts = g_type_cart.LocalCart();
        for (var i = 0; i < objcarts.GoodsInfoForAdd.length; i++) {
            var objcart = objcarts.GoodsInfoForAdd[i];
            if (objcart.product_code == product_code && objcart.sku_code == sku_code) {
                objcarts.GoodsInfoForAdd[i].sku_num = sku_num;
            }
        }
        localStorage[g_const_localStorage.Cart] = JSON.stringify(objcarts);
    },
    SetIng: 1,
    SetSkuNum: function (product_code, sku_code, num, max) {
        if (IndexCart.SetIng == 0) {
            return;
        }
        IndexCart.SetIng = 0;
        var pid = "#txtSkuNum_" + product_code + "_" + sku_code;
        if (!isInteger($(pid).val())) {
            $(pid).val("1")
        }
        var result = parseInt($(pid).val()) + num;
        if (result < 1) {
            result = 1;
        }
        if (result > max) {
            result = max;
        }
        if (result == 1) {
            // $("#hidlimit_" + product_code + "_" + sku_code)
            $("#i_sub_" + product_code + "_" + sku_code).attr("class", "curr");
        }
        else {
            $("#i_sub_" + product_code + "_" + sku_code).attr("class", "");
        }
        if (result.toString() >= $("#hidlimit_" + product_code + "_" + sku_code).val()) {
            // $("#hidlimit_" + product_code + "_" + sku_code)
            $("#i_add_" + product_code + "_" + sku_code).attr("class", "curr");
            $(pid).val($("#hidlimit_" + product_code + "_" + sku_code).val());
            //  return false;
        }
        else {
            $("#i_add_" + product_code + "_" + sku_code).attr("class", "");
        }
        $(pid).val(result);
        CartInfo.SetCartSkuNum(product_code, sku_code, result);
        CartInfo.LoadData(CartInfo.checkLogin, CartInfo.checkLoginname);

    },
    checkLogin: 0,
    checkLoginname: "",
    DeleteSelect: function (del_product_code, del_sku_code) {
        var del_list = [];
        if (CartInfo.checkLogin == 1) {
            del_list.push([del_product_code, del_sku_code]);
            g_type_cart.BatchRemoveWithCloud(del_list);
        }
        else {
            //未登录
            g_type_cart.Remove(del_product_code, del_sku_code);
        }
        CartInfo.LoadData(CartInfo.checkLogin, CartInfo.checkLoginname);
        IndexCart.Init();
    },
    DeleteCheck: function () {
        var del_product_code = "";
        var del_sku_code = "";
        var del_list = [];
        if (CartInfo.checkLogin == 1) {
            //登录
            $("#tbCartList").find("tr").each(function () {
                if ($(this).attr("class") == "curr") {
                    del_product_code = $(this).attr("id").split('_')[1];
                    del_sku_code = $(this).attr("id").split('_')[2];
                    del_list.push([del_product_code, del_sku_code]);
                }
            });
            g_type_cart.BatchRemoveWithCloud(del_list);
        }
        else {
            //未登录
            $("#tbCartList").find("tr").each(function () {
                if ($(this).attr("class") == "curr") {
                    del_product_code = $(this).attr("id").split('_')[1];
                    del_sku_code = $(this).attr("id").split('_')[2];
                    g_type_cart.Remove(del_product_code, del_sku_code);
                }
            });
        }
        CartInfo.LoadData(CartInfo.checkLogin, CartInfo.checkLoginname);
        IndexCart.Init();
    },
    DeleteSelectAll: function () {
        var del_list = [];
        var objcarts = g_type_cart.LocalCart();
        for (var i = 0; i < objcarts.GoodsInfoForAdd.length; i++) {
            var objcart = objcarts.GoodsInfoForAdd[i];
            if (objcart.chooseFlag == 1) {
                del_list.push([objcart.product_code, objcart.sku_code]);
            }
        }
        if (CartInfo.checkLogin == 1) {
            g_type_cart.BatchRemoveWithCloud(del_list);
        }
        else {
            //未登录
            for (var i in del_list) {
                var item = del_list[i];
                g_type_cart.Remove(item[0], item[1]);
            }
        }
        CartInfo.LoadData(CartInfo.checkLogin, CartInfo.checkLoginname);
        IndexCart.Init();
    },
    EditSelect: function () {
        var del_product_code = "";
        var del_sku_code = "";
        var sku_num = 0;
        var pid = "";
        for (var i = 0; i < g_type_cart.LocalCartFull().GoodsInfoForQuery.length; i++) {
            var objcart = g_type_cart.LocalCartFull().GoodsInfoForQuery[i];
            pid = "#txtSkuNum_" + objcart.product_code + "_" + objcart.sku_code;
            if (!isInteger($(pid).val())) {
                sku_num = 1;
            }
            sku_num = parseInt($(pid).val());
            objcart.sku_num = sku_num;
            g_type_cart.ADD(objcart, true);
        }
        if (CartInfo.checkLogin == 1) {
            g_type_cart.Upload();
        }
    },
    SubmitSelect: function () {

        localStorage[g_const_localStorage.OrderConfirm] = "";
        var sub_product_code = "";
        var sub_sku_code = "";
        var orderconfirmlist = "";
        var orderpricelist = "";
        var limitordernum = 0;
        var unitprice = 0;
        var objcartfull = [];
        var limitorderflag = "";
        $("#tbCartList").find("tr").each(function () {
            if ($(this).attr("class") == "curr") {
                sub_product_code = $(this).attr("id").split('_')[1];
                sub_sku_code = $(this).attr("id").split('_')[2];
                limitordernum = parseInt($("#hidlimit_" + sub_product_code + "_" + sub_sku_code).val());
                unitprice = parseFloat($("#hidPriceUnit_" + sub_product_code + "_" + sub_sku_code).val())
                for (var i = 0; i < g_type_cart.LocalCart().GoodsInfoForAdd.length; i++) {
                    var objcart = g_type_cart.LocalCart().GoodsInfoForAdd[i];
                    if (objcart.product_code == sub_product_code && objcart.sku_code == sub_sku_code) {
                        if (limitordernum < objcart.sku_num) {
                            limitorderflag += "[" + $("#hidName_" + sub_product_code + "_" + sub_sku_code).val() + "]";

                        }
                        orderconfirmlist += JSON.stringify(objcart) + ",";
                        orderpricelist += "{ \"sku_price\": " + unitprice + ", \"product_code\": \"" + objcart.product_code + "\", \"sku_code\": \"" + objcart.sku_code + "\" },";
                    }
                }
                for (var i = 0; i < g_type_cart.LocalCart().GoodsInfoForAdd.length; i++) {
                    var objcart = g_type_cart.LocalCart().GoodsInfoForAdd[i];
                    if (objcart.product_code == sub_product_code && objcart.sku_code == sub_sku_code) {
                        objcartfull.push(g_type_cart.LocalCart().GoodsInfoForAdd[i]);
                    }
                }
            }
        });
        if (limitorderflag.length > 0) {
            ShowMesaage(limitorderflag + g_const_API_Message["100039"]);
            return;
        }
        localStorage[g_const_localStorage.OrderConfirm] = "{ \"GoodsInfoForAdd\": [" + orderconfirmlist.substr(0, orderconfirmlist.length - 1) + "] }";
        localStorage[g_const_localStorage.OrderPrice] = "{ \"GoodsInfoPrice\": [" + orderpricelist.substr(0, orderpricelist.length - 1) + "] }";
        UserLogin.Check(CartInfo.OrderConfirm);
    },
    OrderConfirm: function () {
        if (UserLogin.LoginStatus == g_const_YesOrNo.YES) {
            g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.OrderConfirm), "");
        }
        else {
            PageUrlConfig.SetUrl(g_const_PageURL.MainIndex + "?u=OrderConfirm");
            var p = "&t=" + Math.random();
            g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.Login), p);
        }
    },
    DeleteInvalid: function () {
        var del_product_code = "";
        var del_sku_code = "";
        var del_list = [];

        //if (CartInfo.checkLogin == 1) {
        //    //登录
        //    $("#tbCartInvalid").find("tr").each(function () {
        //        del_product_code = $(this).attr("id").split('_')[1];
        //        del_sku_code = $(this).attr("id").split('_')[2];
        //        g_type_cart.Remove(del_product_code, del_sku_code);
        //    });
        //  //  g_type_cart.BatchRemoveWithCloud(del_list);
        //}
        //else {
        //    //未登录
        //    $("#tbCartInvalid").find("tr").each(function () {
        //        del_product_code = $(this).attr("id").split('_')[1];
        //        del_sku_code = $(this).attr("id").split('_')[2];
        //        g_type_cart.Remove(del_product_code, del_sku_code);
        //    });
        //}
        $("#tbCartInvalid").find("tr").each(function () {
            del_product_code = $(this).attr("id").split('_')[1];
            del_sku_code = $(this).attr("id").split('_')[2];
            del_list.push([del_product_code, del_sku_code]);
        });
        g_type_cart.BatchRemoveWithCloud(del_list);
        CartInfo.LoadData(CartInfo.checkLogin, CartInfo.checkLoginname);
        $("#btnClear").hide();
        $("#h3_invalid").hide();
    },
    Load_Product: function (pid) {
        var p = "&pid=" + pid + "&t=" + Math.random();
        g_const_PageURL.GoByMainIndex(g_const_PageURL.ProductDetail, p);
        //PageUrlConfig.SetUrl();
        //window.location.href = g_const_PageURL.Product_Detail + "?pid=" + pid + "&t=" + Math.random();
    }
}

///*购物车*/
//var page_Cart = {
//    /*接口名称*/
//    api_target: "com_cmall_familyhas_api_APiAddSkuToShopCart",
//    /*输入参数*/
//    api_input: { "goodsList": [], "buyer_code": "","version": 1.0 },
//    /*接口响应对象*/
//    api_response: {},
//    /*把本地购物车加入到云端*/
//    AddCartToCloud: function () {
//        var s_api_input = JSON.stringify(page_Cart.api_input);
//        var obj_data = { "api_input": s_api_input, "api_target": page_Cart.api_target, "api_token": g_const_api_token.Wanted };
//        var purl = g_APIUTL;
//        var request = $.ajax({
//            url: purl,
//            cache: false,
//            method: g_APIMethod,
//            data: obj_data,
//            dataType: g_APIResponseDataType
//        });

//        request.done(function (msg) {
//            //$("#pageloading").css("display", "none");
//            page_Cart.api_response = msg;
//            if (msg.resultCode == g_const_Success_Code) {
//                g_type_cart.CloudCart = msg.shoppingCartList;
//                g_type_cart.SyncCart();
//            }
//            else {
//                if (msg.resultcode == g_const_Error_Code.UnLogin) {
//                    localStorage[g_const_localStorage.BackURL] = "cart.html";
//                    ShowMesaage(g_const_API_Message["100001"]);
//                    setTimeout("window.location = \""+g_const_PageURL.Login+"\"", 2000);
//                    return;
//                }
//                ShowMesaage(msg.resultMessage);
//            }
//        });

//        request.fail(function (jqXHR, textStatus) {
//            //$("#pageloading").css("display", "none");
//            ShowMesaage(g_const_API_Message["7001"]);
//        });
//    }
//}