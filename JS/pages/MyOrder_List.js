

//滑动屏幕加载数据
var _PageNo = 1;
var _stop = true;
var OrderStr = "";
var _paytype=""


var scrollHandler = function () {
    //隐藏下拉回调层
    $("#div_scrolldown").hide();

    totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());
    if ($(document).height() <= totalheight) {
        if (_stop == true) {
            var jiazai = false;

            _PageNo = $("#sel_nextPage").val();

            if ((parseInt(_PageNo) + 1) <= parseInt($("#hid_sumpage").val())) {
                jiazai = true;
            }

            if (jiazai) {
                $("#waitdiv").show();
                _stop = false;
                _PageNo = (parseInt(_PageNo) + 1).toString();
                $("#sel_nextPage").val(_PageNo);
                //加载多页
                MyOrder_List.GetListByPage();
                if ((parseFloat($(window).scrollTop())/parseFloat($(window).height())) >= 3) {
                    //显示“至顶部”
                    $('.scroll-top').show();
                }
                else {
                    $('.scroll-top').hide();
                }
                _stop = true;
            }
        }
    }
};
/*
$(window).scroll(function () {
    //隐藏下拉回调层
    $("#div_scrolldown").hide();

    totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());
    if ($(document).height() <= totalheight) {
        if (_stop == true) {
            var jiazai = false;

            _PageNo = $("#sel_nextPage").val();

            if ((parseInt(_PageNo) + 1) <= parseInt($("#hid_sumpage").val())) {
                jiazai = true;
            }

            if (jiazai) {
                _stop = false;
                _PageNo = (parseInt(_PageNo) + 1).toString();
                $("#sel_nextPage").val(_PageNo);
                //加载多页
                MyOrder_List.GetListByPage();
                //显示“至顶部”
                $('.ch-up').show();
                _stop = true;
            }
        }
    }
});
*/

$(document).ready(function () {

    /* @ 全部订单下拉 */
    $('.order-menu').on('click', function () {
        var _this = $(this);
        var parentChild = _this.parent();
        var listChild = parentChild.find('.order-menu-list');
        listChild.is(':hidden') ? listChild.show() : listChild.hide();
        listChild.is(':hidden') ? _this.removeClass('menu-curr') : _this.addClass('menu-curr');
    });
    /* @ 返回顶部 */
    $('.scroll-top').on('click', function () {
        document.body.scrollTop = 0;
        $(this).hide();
    });
    //订单状态切换
    $("#sel_all_num").on("tap", function () {
        SelOrderStatus("");
    });
    $("#sel_dfk_num").click(function () {
        SelOrderStatus(g_const_orderStatus.DFK);//代付款
    });
    $("#sel_dfh_num").click(function () {
        SelOrderStatus(g_const_orderStatus.DFH);//代发货
    });
    $("#sel_dsh_num").click(function () {
        SelOrderStatus(g_const_orderStatus.DSH);//代收货
    });
    $("#sel_isok_num").click(function () {
        SelOrderStatus(g_const_orderStatus.JYCG);//交易成功
    });

    ////弹出确认窗口
    //$(".btns a").on("tap", function (e) {
    //    var objthis = e.target;
    //    switch ($(objthis).attr("operate")) {
    //        case "yes":
    //            switch ($("#sel_btn_name").val()) {
    //                case "qxdd"://取消订单按钮弹出的
    //                    //调用接口，删除订单，重新加载
    //                    MyOrder_List_qxdd.GetList();
    //                    $("#mask").hide();
    //                    $("#fbox_ftel").hide();

    //                    break;
    //                case "tksh"://退款售后按钮弹出的
    //                    //拨打电话
    //                    //$("#btn_tksh").attr("href", "wtai://wp/mc;400-867-8210");
    //                    //location = "wtai://wp/mc;400-867-8210";
    //                    window.location = "tel:" + g_const_Phone.sh + "#mp.weixin.qq.com";
    //                    $("#mask").hide();
    //                    $("#fbox_ftel").hide();

    //                    return false;
    //                    break;
    //            }

    //            break;
    //        case "no":
    //            $("#mask").hide();
    //            $("#fbox_ftel").hide();
    //            return false;
    //            break;
    //    }
    //});

    //返回
    $(".go-back").on("tap", function () {
        //alert("后退");
        //history.back();
        //if (document.referrer = "" || document.referrer.indexOf("login") > 0 || document.referrer.indexOf("MyOrder_pay") > 0 || document.referrer.indexOf("MyOrder_detail") > 0) {
        //    //window.location.href = g_const_PageURL.AccountIndex;
        //    window.location.replace(g_const_PageURL.AccountIndex);

        //}
        //else {
        //    //window.location.href = document.referrer
        //    window.location.replace(document.referrer);

        //}
        window.location.replace(PageUrlConfig.BackTo());
    });
    //传递的订单状态
    _paytype = GetQueryString("paytype")
    switch (_paytype) {
        case ""://全部
        case "ALL"://全部
            SelOrderStatus("");
            break;
        case "DFK"://待付款
            SelOrderStatus(g_const_orderStatus.DFK);
            break;
        case "DFH"://待发货
            SelOrderStatus(g_const_orderStatus.DFH);
            break;
        case "DSH"://待收货
            SelOrderStatus(g_const_orderStatus.DSH);
            break;
        case "JYCG"://交易成功
            SelOrderStatus(g_const_orderStatus.JYCG);
            break;
    }

    //下拉重新加载
    ScrollReload.Listen("MyOrder_list_article", "div_scrolldown", "MyOrder_list", "6", MyOrder_List.ScollDownCallBack);
    //上拉加载
    $(window).scroll(scrollHandler);

});

function gotourlaa(id) {
    if (id=="qgg") {
        //window.location.href = g_const_PageURL.Index;
        PageUrlConfig.SetUrl();
        window.location.href = g_const_PageURL.Index + "?t=" + Math.random();

    }
    else if (id == "sc") {
        //window.location.href = g_const_PageURL.MyCollection;
        PageUrlConfig.SetUrl();
        window.location.href = g_const_PageURL.MyCollection + "?t=" + Math.random();

    }
}

//确认层回调方法
function CancelOrder() {
    switch ($("#sel_btn_name").val()) {
        case "qxdd"://取消订单按钮弹出的
            //调用接口，删除订单，重新加载
            MyOrder_List_qxdd.GetList();
            break;
        case "tksh"://退款售后按钮弹出的
            //拨打电话
            //$("#btn_tksh").attr("href", "wtai://wp/mc;400-867-8210");
            //location = "wtai://wp/mc;400-867-8210";
            window.location = "tel:" + g_const_Phone.sh + "#mp.weixin.qq.com";

            return false;
            break;
        case "qrsh"://确认收货
            MyOrder_List_qrsh.GetList();
            return false;
            break;

    }
}

//各种状态下按钮操作
function btncaozuo(btnname, order_code, order_money) {
    $("#sel_btn_name").val(btnname);
    switch (btnname) {
        case "qxdd"://取消订单
            $("#sel_order_code").val(order_code);

            Message.ShowConfirm("确定要取消订单吗？", "", "fbox_ftel", "确定", "CancelOrder", "取消");

            //$("#sc_jxtx").html("<span>确定要取消订单吗？</span>");
            //$("#mask").show();
            //$("#fbox_ftel").show();

            break;
        case "tksh"://退款售后
            Message.ShowConfirm("提示","确定拨打电话" + g_const_Phone.sh + "？", "fbox_ftel", "确定", "CancelOrder", "取消");

            //$("#sc_jxtx").html("提示<span>确定拨打电话400-867-8210？</span>");
            //$("#mask").show();
            //$("#fbox_ftel").show();

            break;
        case "ckwl"://查看物流
            PageUrlConfig.SetUrl();
            //location = g_const_PageURL.MyOrder_List_ckwl + "?order_code=" + order_code;
            window.location.href = g_const_PageURL.MyOrder_List_ckwl + "?order_code=" + order_code + "&t=" + Math.random();

            break;
        case "qrsh"://确认收货
            $("#sel_order_code").val(order_code);
            Message.ShowConfirm("确定收货吗？", "", "fbox_ftel", "确定", "CancelOrder", "取消");
            break;
        case "qfk"://去付款
            PageUrlConfig.SetUrl();
            //location = g_const_PageURL.MyOrder_pay + "?order_code=" + order_code + "&order_money=" + order_money;
            // window.location.href = g_const_PageURL.MyOrder_pay + "?order_code=" + order_code + "&order_money=" + order_money;
            if (IsInWeiXin.check()) {
                var wxUrl = g_const_PageURL.MyOrder_pay + "?order_code=" + order_code + "&order_money=" + order_money + "&t=" + Math.random() + "&showwxpaytitle=1";
                WxInfo.GetPayID(wxUrl);
            }
            else {
                window.location.href = g_const_PageURL.MyOrder_pay + "?order_code=" + order_code + "&order_money=" + order_money + "&t=" + Math.random();
            }
            break;


    }
}

//订单状态切换
function SelOrderStatus(selstr) {
    switch(selstr){
        case "":
            $(".order-menu").html("全部订单");
            $("#sel_order_status").val("");
            break;
        case g_const_orderStatus.DFK:
            $(".order-menu").html("待付款");
            $("#sel_order_status").val(g_const_orderStatus.DFK);
            break;
        case g_const_orderStatus.DFH:
            $(".order-menu").html("待发货");
            $("#sel_order_status").val(g_const_orderStatus.DFH);
            break;
        case g_const_orderStatus.DSH:
            $(".order-menu").html("待收货");
            $("#sel_order_status").val(g_const_orderStatus.DSH);
            break;
        case g_const_orderStatus.JYCG:
            $(".order-menu").html("交易成功");
            $("#sel_order_status").val(g_const_orderStatus.JYCG);
            break;
    }
    //重新查询默认第一页
    $("#sel_nextPage").val("1")
    $(".order-menu-list").hide();
    $('.order-menu').removeClass('menu-curr');

    //我的订单数量
    MyOrder_Num.GetList();
    //我的订单
    MyOrder_List.GetList();
}

//我的订单数量
var MyOrder_Num = {
    api_target: "com_cmall_familyhas_api_ApiOrderNumber ",
    api_input: {},//两个参数都是非必填
    GetList: function () {
        //返回参数
        var ApiOrderStateNumberResult = { "statusCode": "", "number": "", "orderStatus": "" };

        //赋值
        //api_input.api_input.buyer_code = $("#couponCode").val();

        //组织提交参数
        var s_api_input = JSON.stringify(this.api_input);
        //提交接口[api_token不为空，公用方法会从sission中获取]
        var obj_data = { "api_input": s_api_input, "api_target": MyOrder_Num.api_target, "api_token": g_const_api_token.Wanted };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });
        //正常返回
        request.done(function (msg) {

            if (msg.resultcode) {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    //Session失效，重新登录，传递回调地址
                    UserRELogin.login(g_const_PageURL.MyOrder_List + "?paytype=" + _paytype)
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }

            if (msg.resultCode == g_const_Success_Code) {
                MyOrder_Num.Load_Result(msg);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }


        });
        //接口异常
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    //接口返回成功后的处理
    Load_Result: function (resultlist) {
        $("#dfk_num").html("(0)");
        $("#dfh_num").html("(0)");
        $("#dsh_num").html("(0)");

        var bodyList = "<em></em><span>全部订单</span>";
        $.each(resultlist.list, function (i, n) {
            //statusCode
            //4497153900010001	下单成功-未付款
            //4497153900010002	下单成功-未发货
            //4497153900010003	已发货
            //4497153900010004	已收货(目前系统中  已收货 就是 交易成功)
            //4497153900010005	交易成功
            //4497153900010006	交易失败

            var showNum = parseInt(n.number) > 99 ? "99+" : n.number;

            switch (n.orderStatus) {
                case g_const_orderStatus.DFK:
                    $("#dfk_num").html("(" + showNum + ")");
                    if (showNum.toString() == "0") {
                        $("#dfk_num").removeClass("red")
                    }
                    else {
                        $("#dfk_num").attr("class","red")
                    }
                    break;
                case g_const_orderStatus.DFH:
                    $("#dfh_num").html("(" + showNum + ")");
                    if (showNum.toString() == "0") {
                        $("#dfh_num").removeClass("red")
                    }
                    else {
                        $("#dfh_num").attr("class", "red")
                    }

                    break;
                case g_const_orderStatus.DSH:
                    $("#dsh_num").html("(" + showNum + ")");
                    if (showNum.toString() == "0") {
                        $("#dsh_num").removeClass("red")
                    }
                    else {
                        $("#dsh_num").attr("class", "red")
                    }

                    break;
            }
        });
    },
    //接口返回失败后的处理
    Load_ResultErr: function (resultlist) {
    },
};

//我的订单列表
var MyOrder_List = {
    api_target: "com_cmall_familyhas_api_ApiOrderList",
    api_input: { "nextPage": "", "order_status": "" },
    //加载多页
    GetListByPage: function () {
        
        var all_sel_order_list = "";
        var _LasePageNo = $("#sel_nextPage").val();
        //for (var pageno = 1; parseInt(pageno) <= parseInt(_LasePageNo) ; pageno = parseInt(pageno) + 1) {
            //赋值
        MyOrder_List.api_input.nextPage = _PageNo;
            MyOrder_List.api_input.order_status = $("#sel_order_status").val();

            //组织提交参数
            var s_api_input = JSON.stringify(MyOrder_List.api_input);
            //提交接口[api_token不为空，公用方法会从sission中获取]
            var obj_data = { "api_input": s_api_input, "api_target": MyOrder_List.api_target, "api_token": g_const_api_token.Wanted };
            var purl = g_APIUTL;
            var request = $.ajax({
                url: purl,
                cache: false,
                method: g_APIMethod,
                data: obj_data,
                dataType: g_APIResponseDataType
            });
            //正常返回
            request.done(function (msg) {
                
                if (msg.resultcode) {
                    if (msg.resultcode == g_const_Error_Code.UnLogin) {
                        //Session失效，重新登录，传递回调地址
                        UserRELogin.login(g_const_PageURL.MyOrder_List + "?paytype=" + _paytype);
                        return;
                    }
                    if (msg.resultcode != g_const_Success_Code_IN) {
                        ShowMesaage(msg.resultmessage);
                        return;
                    }
                }

                if (msg.resultCode == g_const_Success_Code) {
                    var temp_OrderStr = "";
                    $("#hid_sumpage").val(msg.countPage);
                    if (msg.countPage == 0) {
                        $("#MyOrder_list_article").attr("class", "no-data");
                        //没有数据
                        var emptyStr = "<article class=\"my-order\">"
                             + "<div class=\"order-nodata\">"
                                 + "<p>暂无该状态的订单信息<br>去发现一下心仪的宝贝吧！</p>"
                                 + "<div class=\"order-nodata-btn\">"
                                     + "<a id=\"btnqgg\" onclick=\"gotourlaa('qgg')\">去逛逛</a><a id=\"btnsc\" onclick=\"gotourlaa('sc')\">去收藏夹</a>"
                                 + "</div>"
                             + "</div>"
                         + "</article>";
                        $("#waitdiv").hide();
                        $(".my-order").html(emptyStr);
                    }
                    else {
                        $("#MyOrder_list_article").attr("class", "my-order pb-55");

                        temp_OrderStr = MyOrder_List.Load_Result(msg);
                        $("#waitdiv").hide();
                        //追加下一页页全部内容
                        $(".my-order").append(temp_OrderStr);
                        
                    }
                }
                else {
                        ShowMesaage(msg.resultMessage);
                }
            });
            //接口异常
            request.fail(function (jqXHR, textStatus) {
                $("#waitdiv").hide();
                ShowMesaage(g_const_API_Message["7001"]);
            });
        //}

    },
    //加载单页
    GetList: function () {
        //赋值
        MyOrder_List.api_input.nextPage = $("#sel_nextPage").val();
        MyOrder_List.api_input.order_status = $("#sel_order_status").val();
        
        //组织提交参数
        var s_api_input = JSON.stringify(MyOrder_List.api_input);
        //提交接口[api_token不为空，公用方法会从sission中获取]
        var obj_data = { "api_input": s_api_input, "api_target": MyOrder_List.api_target, "api_token": g_const_api_token.Wanted };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });
        //正常返回
        request.done(function (msg) {

            if (msg.resultcode) {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    //Session失效，重新登录，传递回调地址
                    UserRELogin.login(g_const_PageURL.MyOrder_List + "?paytype=" + _paytype);
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }

            if (msg.resultCode == g_const_Success_Code) {
                //隐藏下拉回调层
                $("#div_scrolldown").hide();
                $("#hid_sumpage").val(msg.countPage);
                if (msg.countPage == 0) {
                    $("#MyOrder_list_article").attr("class", "no-data");

                    //没有数据
                    var emptyStr = "<p>暂无该状态的订单信息<br>去发现一下心仪的宝贝吧！</p>"
			                 + "<div class=\"no-data-btn\">"
                                 + "<a id=\"btnqgg\" onclick=\"gotourlaa('qgg')\">去逛逛</a><a id=\"btnsc\" onclick=\"gotourlaa('sc')\">去收藏夹</a>"
			                 + "</div>";
                    $("#MyOrder_list_article").html(emptyStr);
                    //location = "/Feedback.html";
                }
                else {
                    $("#MyOrder_list_article").attr("class", "my-order pb-55");

                    OrderStr = "<ul id=\"my_order_list_str\" class=\"my-order-list\">";
                    OrderStr+=MyOrder_List.Load_Result(msg);
                    OrderStr += " </ul>"
                    $(".my-order").html(OrderStr);

                }
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });
        //接口异常
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    //接口返回成功后的处理
    Load_Result: function (resultlist, pageno) {
        //组织商品列表
        var OrderStrTemp;
        $.each(resultlist.sellerOrderList, function (i, n) {
            //每个订单的商品信息
            OrderStrTemp = MyOrder_List.Load_apiSellerList(n);

            OrderStr += OrderStrTemp;
        });

        return OrderStr;

    },
    //每个订单的商品信息
    Load_apiSellerList: function (resultlist) {
        var temp="";

            var order_statusTemp = "";
            var kgks = "";//规格款式
            var payShow = "";//订单下方按钮

            switch (resultlist.order_status) {
                case g_const_orderStatus.DFK:
                    order_statusTemp = "待付款";
                    break;
                case g_const_orderStatus.DFH:
                    order_statusTemp = "待发货";
                    break;
                case g_const_orderStatus.DSH:
                    order_statusTemp = "待收货";
                    break;
                case g_const_orderStatus.YSH:
                    order_statusTemp = "已收货";
                    break;
                case g_const_orderStatus.JYCG:
                    order_statusTemp = "交易成功";
                    break;
                case g_const_orderStatus.JYSB://交易关闭
                    order_statusTemp = "交易关闭";
                    break;

            }
            var totalnum=0;
            temp = "<li>"
                + "<h3 class=\"order-number\"><em class=\"fl\">订单号:" + resultlist.order_code + "</em><i class=\"fr\">" + order_statusTemp + "</i></h3>";
                
                //循环显示定单商品
                $.each(resultlist.apiSellerList, function (iii, nnn) {
                    temp += "<div class=\"order-info\" onclick=\"GoToOrderDetail('','" + resultlist.order_code + "','')\">"
                        + "<a href=\"#\" title=\"" + nnn.product_name + "\">"
                            + "<div class=\"order-shop-img\"><img src=\"" + nnn.mainpic_url + "\" alt=\"\"></div>"
                            + "<div class=\"order-shop-info\">"
                                + "<h1><span>" + nnn.product_name + "</span><em>￥" + nnn.sell_price + "</em></h1>"
                                + "<h3>x " + nnn.product_number + "</h3>";
                    //循环规格款式
                    kgks="";
                    $.each(nnn.standardAndStyleList, function (ii, nn) {
                        kgks += "<p>" + nn.standardAndStyleKey + "：" + nn.standardAndStyleValue + "</p>"
                    });
               
            temp += kgks
            temp += "</div></a></div>";

            totalnum = parseInt(totalnum) + parseInt(nnn.product_number);
                });
         temp += "<div class=\"order-price\">共<i>" + totalnum + "</i>件<span>实付:<i>￥" + resultlist.due_money + "</i></span></div>"
         + "<div class=\"order-service\">";
            //根据状态显示不同内容
            switch (resultlist.order_status) {
                case g_const_orderStatus.DFK://待付款
                    payShow = "<a id=\"btn_cxdd\" onclick=\"btncaozuo('qxdd','" + resultlist.order_code + "','');\">取消订单</a><a class=\"receipt\"  onclick=\"btncaozuo('qfk','" + resultlist.order_code + "','" + resultlist.apiSellerList[0].sell_price + "');\">付款</a>";
                    break;
                case g_const_orderStatus.DFH: //待发货
                    payShow = "<a id=\"btn_tksh\" onclick=\"return btncaozuo('tksh','" + resultlist.order_code + "','');\">退款/售后</a>";
                    break;
                case g_const_orderStatus.DSH://待收货
                    payShow = "<a id=\"btn_tksh\"  onclick=\"return btncaozuo('tksh','" + resultlist.order_code + "','');\">退款/售后</a><a onclick=\"btncaozuo('ckwl','" + resultlist.order_code + "','');\">查看物流</a><a href=\"#\" onclick=\"btncaozuo('qrsh','" + resultlist.order_code + "','');\" class=\"receipt\">确认收货</a>";
                    break;
                case g_const_orderStatus.YSH://已收货
                case g_const_orderStatus.JYCG://交易成功
                    payShow = "<a id=\"btn_tksh\" onclick=\"return btncaozuo('tksh','" + resultlist.order_code + "','');\">退款/售后</a><a onclick=\"btncaozuo('ckwl','" + resultlist.order_code + "','');\">查看物流</a>";
                    break;

            }

            temp += payShow;
            temp += "</div></li>";
        return temp;
    },
    //下拉回调
    ScollDownCallBack: function (resultlist) {
        selstr = $("#sel_order_status").val();
        switch (selstr) {
            case "":
                $(".order-menu").html("全部订单");
                $("#sel_order_status").val("");
                break;
            case g_const_orderStatus.DFK:
                $(".order-menu").html("待付款");
                $("#sel_order_status").val(g_const_orderStatus.DFK);
                break;
            case g_const_orderStatus.DFH:
                $(".order-menu").html("待发货");
                $("#sel_order_status").val(g_const_orderStatus.DFH);
                break;
            case g_const_orderStatus.DSH:
                $(".order-menu").html("待收货");
                $("#sel_order_status").val(g_const_orderStatus.DSH);
                break;
            case g_const_orderStatus.JYCG:
                $(".order-menu").html("交易成功");
                $("#sel_order_status").val(g_const_orderStatus.JYCG);
                break;
        }
        //重新查询默认第一页
        $("#sel_nextPage").val("1")
        $(".order-menu-list").hide();

        //我的订单数量
        MyOrder_Num.GetList();
        //我的订单
        MyOrder_List.GetList();

    },

    //接口返回失败后的处理
    Load_ResultErr: function (resultlist) {
    },
};

//点击商品区域，跳转
function GoToOrderDetail(btnname, order_code, order_money) {
    if (btnname == "") {
        PageUrlConfig.SetUrl();
        //location = g_const_PageURL.MyOrder_detail + "?order_code=" + order_code + "&paytype=" + $("#sel_order_status").val();
        window.location.href = g_const_PageURL.MyOrder_detail + "?order_code=" + order_code + "&paytype=" + $("#sel_order_status").val() + "&t=" + Math.random();

    }

    switch (btnname) {
        case "qxdd"://取消订单
            Message.ShowConfirm("确定要取消订单吗？","", "fbox_ftel", "确定", "CancelOrder", "取消");

            //$("#sc_jxtx").html("<span>确定要取消订单吗？</span>");
            //$("#mask").show();
            //$("#fbox_ftel").show();

            break;
        case "tksh"://退款售后
            Message.ShowConfirm("提示","确定拨打电话" + g_const_Phone.sh + "？", "fbox_ftel", "确定", "CancelOrder", "取消");

            //$("#sc_jxtx").html("提示<span>确定拨打电话400-867-8210？</span>");
            //$("#mask").show();
            //$("#fbox_ftel").show();

            break;
        case "ckwl"://查看物流
            PageUrlConfig.SetUrl();
            //location = g_const_PageURL.MyOrder_List_ckwl + "?order_code=" + order_code;
            window.location.href = g_const_PageURL.MyOrder_List_ckwl + "?order_code=" + order_code + "&t=" + Math.random();

            break;
        case "qrsh"://确认收货
            $("#sel_order_code").val(order_code);
            Message.ShowConfirm("确定收货吗？", "", "fbox_ftel", "确定", "CancelOrder", "取消");
            
            break;
        case "qfk"://去付款
            PageUrlConfig.SetUrl();
            //location = g_const_PageURL.MyOrder_pay + "?order_code=" + order_code + "&order_money=" + order_money;
            // window.location.href = g_const_PageURL.MyOrder_pay + "?order_code=" + order_code + "&order_money=" + order_money;
            if (IsInWeiXin.check()) {
                var wxUrl = g_const_PageURL.MyOrder_pay + "?order_code=" + order_code + "&order_money=" + order_money + "&t=" + Math.random() + "&showwxpaytitle=1";
                WxInfo.GetPayID(wxUrl);
            }
            else {
                window.location.href = g_const_PageURL.MyOrder_pay + "?order_code=" + order_code + "&order_money=" + order_money + "&t=" + Math.random();
            }
            break;

    }
}

//我的订单列表--确认收货
var MyOrder_List_qrsh = {
    api_target: "com_cmall_familyhas_api_ApiConfirmReceiveForFamily",
    api_input: { "order_code": ""},
    GetList: function () {
        //赋值
        MyOrder_List_qrsh.api_input.order_code = $("#sel_order_code").val();

        //组织提交参数
        var s_api_input = JSON.stringify(MyOrder_List_qrsh.api_input);
        //提交接口[api_token不为空，公用方法会从sission中获取]
        var obj_data = { "api_input": s_api_input, "api_target": MyOrder_List_qrsh.api_target, "api_token": g_const_api_token.Wanted };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });
        //正常返回
        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    //Session失效，重新登录，传递回调地址
                    UserRELogin.login(g_const_PageURL.MyOrder_List + "?paytype=" + _paytype);
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }

            if (msg.resultCode == g_const_Success_Code) {
                //重新加载页面
                $("#sel_nextPage").val("1");
                MyOrder_List.GetList();
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });
        //接口异常
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
};

//我的订单列表--取消订单
var MyOrder_List_qxdd = {
    api_target: "com_cmall_familyhas_api_ApiCancelOrderForFamily",
    api_input: { "order_code": "" },
    GetList: function () {
        //赋值
        MyOrder_List_qxdd.api_input.order_code = $("#sel_order_code").val();

        //组织提交参数
        var s_api_input = JSON.stringify(MyOrder_List_qxdd.api_input);
        //提交接口[api_token不为空，公用方法会从sission中获取]
        var obj_data = { "api_input": s_api_input, "api_target": MyOrder_List_qxdd.api_target, "api_token": g_const_api_token.Wanted };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });
        //正常返回
        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    //Session失效，重新登录，传递回调地址
                    UserRELogin.login(g_const_PageURL.MyOrder_List+"?paytype=" + _paytype);
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }


            if (msg.resultCode == g_const_Success_Code) {
                //重新加载页面
                $("#sel_nextPage").val("1");
                MyOrder_List.GetList();
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });
        //接口异常
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
};