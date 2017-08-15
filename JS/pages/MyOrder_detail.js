$(document).ready(function () {
    //alert(document.referrer);

    //返回
    $(".go-back").on("tap", function () {
        //alert("后退");
        //history.back();
        //window.location.href = g_const_PageURL.MyOrder_List;
        //if (document.referrer = "" || document.referrer.indexOf("login") > 0 || document.referrer.indexOf("MyOrder_pay") > 0 || document.referrer.indexOf("OrderSuccess") > 0 || document.referrer.indexOf("Product_Detail") > 0) {
        //    window.location.replace(g_const_PageURL.MyOrder_List);
        //}
        //else {
        //    var backtourl=PageUrlConfig.BackTo(1);
        //    while(backtourl.indexOf("MyOrder_detail") > 0)
        //    {
        //        backtourl=PageUrlConfig.BackTo(1);
        //    }
        //    window.location.replace(backtourl);
        //}
        window.location.replace(PageUrlConfig.BackTo());
    });
    //获得传递的订单号
    $("#hid_order_code").val(GetQueryString("order_code"));
    //获得订单列表页选择的状态
    $("#hid_list_paytype").val(GetQueryString("paytype"));

    switch($("#hid_list_paytype").val()){
        case ""://全部
        case "ALL"://全部
            $("#hid_list_paytype").val("");
            break;
        case g_const_orderStatus.DFK://待付款
            $("#hid_list_paytype").val("DFK");
            break;
        case g_const_orderStatus.DFH://待发货
            $("#hid_list_paytype").val("DFH");
            break;
        case "DSH"://待收货
            SelOrderStatus(g_const_orderStatus.DSH);
            $("#hid_list_paytype").val("DSH");
            break;
        case "JYCG"://交易成功
            SelOrderStatus(g_const_orderStatus.JYCG);
            $("#hid_list_paytype").val("JYCG");
            break;
    }
    

    //点击物流跳转
    $(".order-detl-tp").on("tap", function () {
        if ($("#hid_order_code").val() != "") {
            location = g_const_PageURL.MyOrder_List_ckwl + "?order_code" + $("#hid_order_code").val() + "&t=" + Math.random();
        }
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


    //我的物流
    MyOrder_detaile.GetList();
});

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
    }
}


//我的订单--订单详情
var MyOrder_detaile = {
    //家有汇--订单配送轨迹查询接口
    api_target: "com_cmall_familyhas_api_ApiOrderDetails",
    api_input: { "order_code": "" },
    GetList: function () {
        //赋值
        MyOrder_detaile.api_input.order_code = $("#hid_order_code").val();

        //组织提交参数
        var s_api_input = JSON.stringify(this.api_input);
        //提交接口[api_token不为空，公用方法会从sission中获取]
        var obj_data = { "api_input": s_api_input, "api_target": MyOrder_detaile.api_target, "api_token": g_const_api_token.Wanted };
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
                    UserRELogin.login(g_const_PageURL.MyOrder_detail + "?order_code=" + $("#hid_order_code").val())
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }

            if (msg.resultCode == g_const_Success_Code) {
                MyOrder_detaile.Load_Result(msg);
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


        $(".order-note .red").hide();
        switch (resultlist.order_status) {
            case g_const_orderStatus.DFK:
                $(".order-status").html("订单状态: <em>待付款</em>");
                $(".order-note .red").show();
                $(".transport-info").hide();
                $("#fktishi").show();
                break;
            case g_const_orderStatus.DFH:
                $(".order-status").html("订单状态: <em>待发货</em>");
                $(".transport-info").hide();

                break;
            case g_const_orderStatus.DSH:
                $(".transport-info").show();
                $(".order-status").html("订单状态: <em>待收货</em>");
                break;
            case g_const_orderStatus.JYCG:
                $(".transport-info").show();
                $(".order-status").html("订单状态: <em>交易成功</em>");
                break;
            case g_const_orderStatus.JYSB://交易关闭
                $(".transport-info").hide();
                $(".order-status").html("订单状态: <em>交易关闭</em>");
                break;
        }

        //订单金额
        var order_money = "<dt>订单金额:<em><i>￥" + resultlist.order_money + "</i></em></dt>";
        //商品总金额
        var due_money = "<dd>商品总金额：<em><i>￥" + parseFloat(resultlist.productMoney).toFixed(2) + "</i></em></dd>";
        //优惠活动
        var orderActivityDetailsResult = "";
        $.each(resultlist.orderActivityDetailsResult, function (i, n) {
            orderActivityDetailsResult += "<dd>" + n.activityType + "：<em>" + (n.plusOrMinus == 0 ? "-" : "+") + "<i>￥" + n.preferentialMoney + "</i></em></dd>";
        });
        //手机下单立减
        var telephoneSubtraction = "";
        if (resultlist.telephoneSubtraction > 0) {

            telephoneSubtraction = "<dd>手机下单立减：<em>-<i>￥" + resultlist.telephoneSubtraction + "</i></em></dd>";
        }
        //关税
        var tariffMoneySubtraction = "";
        if (resultlist.flagTheSea=="1") {
            tariffMoneySubtraction = "<dd>关税：<em>+<i>￥" + resultlist.tariffMoney + "</i></em></dd>";
        }
        //运费
        var freight = "<dd>运费：<em>+<i>￥" + resultlist.freight + "</i></em></dd>";
        //订单区域
        $(".order-price-details").html(order_money + due_money + orderActivityDetailsResult + telephoneSubtraction + tariffMoneySubtraction + freight);

        //收货人，收货电话、收货地址：
        $(".order-address").html("<h3 class=\"order-contacts\"><span>" + resultlist.consigneeName + "</span><em>" + resultlist.consigneeTelephone + "</em></h3><p>" + resultlist.consigneeAddress + "</p>");
        //物流信息
        var wlxx = "";
        $.each(resultlist.apiHomeOrderTrackingListResult, function (i, n) {
            if (i == 0) {
                wlxx += "<dd class=\"order-detl-tp\" onclick=\"btncaozuo('ckwl', '" + $("#hid_order_code").val() + "',0)\">"
                        + "<a>"
                        + n.orderTrackContent
                        + "<span>" + n.orderTrackTime.toString() + "</span>"
                        + "</a>"
                    + "</dd>";
            }
        });
        if (wlxx == "") {
            $(".transport-info").html("<dt>物流信息</dt><dd class=\"order-detl-tp\"><a href=\"\">暂无物流信息</a></dd>");
            $(".transport-info").on("tap", function () {
                btncaozuo('ckwl', $("#hid_order_code").val(), 0)
            });
        }
        else {
            wlxx = "<dt>物流信息</dt>" + wlxx;
            $(".transport-info").html(wlxx);
            //交易失败的订单，有物流信息的，显示
            if (resultlist.order_status == g_const_orderStatus.JYSB) {
                $(".transport-info").show();
            }
        }

        var tttmp = "";
        $.each(resultlist.orderActivityRemarkDetailsResult, function (i, n) {
            if(i==0){
                tttmp ="注：";
            }
            else if (i > 0) {
                tttmp += +",";
            }
            tttmp += n.remark;
            
        });
        $("#orderActivityRemarkDetailsResult").html(tttmp);

        //商品区
        var orderSellerList = "";
        //增加判断跨境通商品显示
        if (resultlist.isSeparateOrder == "0") {
            $.each(resultlist.apiOrderKjtParcelResult, function (s, m) {
                $.each(m.apiOrderKjtDetailsList, function (i, n) {
                    //商品规格款式
                    var ggks = "";
                    $.each(n.standardAndStyleList, function (j, k) {
                        ggks += "<p>" + k.standardAndStyleKey + "：" + k.standardAndStyleValue + "</p>";
                    });

                    orderSellerList += "<li>"
                            + "<div class=\"order-info\">"
                                + "<a onclick=\"MyOrder_detaile.gotodetail(" + n.productCodeKJT + ")\"  title=\"" + n.productNameKJT + "\">"
                                    + "<div class=\"order-shop-img\"><img src=\"" + n.mainpicUrlKJT + "\" alt=\"" + n.productNameKJT + "\"></div>"
                                    + "<div class=\"order-shop-info\">"
                                        + "<h1><span>" + n.productNameKJT + "</span><em>￥" + n.priceKJT + "</em></h1>"
                                        + "<h3>x " + n.numberKJT + "</h3>";
                    orderSellerList += ggks
                                    + "</div>"
                                + "</a>"
                            + "</div>"
                        + "</li>";
                });
            });
        }
        else {
            $.each(resultlist.orderSellerList, function (i, n) {
                //商品规格款式
                var ggks = "";
                $.each(n.standardAndStyleList, function (j, k) {
                    ggks += "<p>" + k.standardAndStyleKey + "：" + k.standardAndStyleValue + "</p>";
                });

                orderSellerList += "<li>"
                        + "<div class=\"order-info\">"
                            + "<a onclick=\"MyOrder_detaile.gotodetail(" + n.productCode + ")\"  title=\"" + n.productName + "\">"
                                + "<div class=\"order-shop-img\"><img src=\"" + n.mainpicUrl + "\" alt=\"" + n.productName + "\"></div>"
                                + "<div class=\"order-shop-info\">"
                                    + "<h1><span>" + n.productName + "</span><em>￥" + n.price.toFixed(2) + "</em></h1>"
                                    + "<h3>x " + n.number + "</h3>";
                orderSellerList += ggks
                                + "</div>"
                            + "</a>"
                        + "</div>"
                    + "</li>";
            });
        }
        $(".my-order-list").html(orderSellerList);

        //支付方式和发票
        var pay_type = "<dt>支付方式<em>" + MyOrder_detaile.Load_Pay_Type(resultlist.pay_type) + "</em></dt>";

        //发票信息
        var invoiceInformation = "";
        if (resultlist.invoiceInformation.invoiceInformationType == g_const_bill_Type.NotNeed || resultlist.invoiceInformation.invoiceInformationType == "") {
            invoiceInformation="<dt>发票信息<em>不开发票</em></dt>";
        }
        else {
            invoiceInformation = "<dt>发票信息</dt>";
            invoiceInformation += "<dd>发票类型：" + MyOrder_detaile.Load_Invoice_Type(resultlist.invoiceInformation.invoiceInformationType) + "</dd>"
                              + "<dd>发票抬头：" + resultlist.invoiceInformation.invoiceInformationTitle + "</dd>"
                              + "<dd>发票内容：" + resultlist.invoiceInformation.invoiceInformationValue + "</dd>";
        }
        $(".order-footer").html(pay_type+invoiceInformation);

        //订单信息
        $(".order-time").html("<p>订单号：" + resultlist.order_code + "</p><p>下单时间：" + resultlist.create_time + "</p>");
        
        //根据订单状态显示不同内容
        var payShow = "";
        switch (resultlist.order_status) {
            case g_const_orderStatus.DFK://待付款
                payShow = "<a id=\"btn_cxdd\" class=\"service-btn\" onclick=\"btncaozuo('qxdd','" + resultlist.order_code + "','');\">取消订单</a><a class=\"pay-btn\" onclick=\"btncaozuo('qfk','" + resultlist.order_code + "','" + resultlist.order_money + "');\">付款</a>";
                break;
            case g_const_orderStatus.DFH: //待发货
                payShow = "<a id=\"btn_tksh\" class=\"service-btn\"  onclick=\"return btncaozuo('tksh','" + resultlist.order_code + "','');\">退款/售后</a>";
                break;
            case g_const_orderStatus.DSH://待收货
                payShow = "<a id=\"btn_tksh\" class=\"service-btn\"  onclick=\"return btncaozuo('tksh','" + resultlist.order_code + "','');\">退款/售后</a><a class=\"service-btn\" onclick=\"btncaozuo('ckwl','" + resultlist.order_code + "','');\">查看物流</a><a onclick=\"btncaozuo('qrsh','" + resultlist.order_code + "','');\" class=\"receipt\">确认收货</a>";
                break;
            case g_const_orderStatus.YSH://已收货
            case g_const_orderStatus.JYCG://交易成功
                payShow = "<a id=\"btn_tksh\" class=\"service-btn\" onclick=\"return btncaozuo('tksh','" + resultlist.order_code + "','');\">退款/售后</a><a class=\"service-btn\" onclick=\"btncaozuo('ckwl','" + resultlist.order_code + "','');\">查看物流</a>";
                break;
        }
        $(".order-btn").html(payShow);
        
    },
    //接口返回失败后的处理
    Load_ResultErr: function (resultlist) {
    },
    //接口返回失败后的处理
    gotodetail: function (pid) {
        PageUrlConfig.SetUrl();
        window.location.href=g_const_PageURL.Product_Detail + "?pid=" + pid + "&t=" + Math.random();
    },

    Load_Invoice_Type: function (billType) {
        var invoiceType = "";
        switch (billType) {
            case g_const_bill_Type.Normal:
                invoiceType = "普通发票";
                break;
            case g_const_bill_Type.ZengZhi:
                invoiceType = "增值税发票";
                break;

        }
        return invoiceType;
    },
    Load_Pay_Type: function (payType) {
        switch (payType) {
            case g_pay_Type.Alipay:
                payType = "支付宝";
                break;
            case g_pay_Type.Getpay:
                payType = "货到付款";
                break;
            case g_pay_Type.WXpay:
                payType = "微信支付";
                break;
            case g_pay_Type.Online:
                payType = "在线支付";
                break;
            default:
                if (IsInWeiXin.check()) {
                    payType = "微信支付";
                }
                else {
                    payType = "支付宝";
                }
                
                break;
        }
        return payType;
    },
};

//各种状态下按钮操作
function btncaozuo(btnname, order_code,order_money) {
    $("#sel_btn_name").val(btnname);
    switch (btnname) {
        case "qxdd"://取消订单
            $("#sel_order_code").val(order_code);
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
            window.location.href = g_const_PageURL.MyOrder_List_ckwl + "?order_code=" + order_code + "&t=" + Math.random();
            break;
        case "qrsh"://确认收货
            $("#sel_order_code").val(order_code);
            MyOrder_List_qrsh.GetList();
            break;
        case "qfk"://去付款
            PageUrlConfig.SetUrl();
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
    api_input: { "order_code": "" },
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
                //$("#sel_nextPage").val("1");
                MyOrder_detaile.GetList();
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
                    UserRELogin.login(g_const_PageURL.MyOrder_List + "?paytype=" + $("#hid_list_paytype").val());
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }


            if (msg.resultCode == g_const_Success_Code) {
                ////重新加载页面
                //$("#sel_nextPage").val("1");
                //MyOrder_detaile.GetList();
                window.location.replace(g_const_PageURL.MyOrder_List + "?paytype=" + $("#hid_list_paytype").val());
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