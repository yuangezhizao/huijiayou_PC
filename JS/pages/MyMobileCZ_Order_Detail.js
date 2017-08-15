var MyOrder = {
    MenuName: "充值订单",
    Init: function () {
        AccountMenu.ShowMenu("div.home ul.fl", "#tpl_menu", MyOrder.MenuName);
        $("#btnPay").on("click", function () {
            PageUrlConfig.SetUrl();
            window.location.href = g_const_PageURL.MainIndex + "?u=" + g_const_PageURL.GetKey(g_const_PageURL.MyMobileCZOrder_pay) + "&order_code=" + $("#hid_order_code").val() + "&t=" + Math.random();;
        });
        $("#btnCancelOrder").on("click", function () {
            ConfirmMessage("确定要取消订单吗？", fbox_ftel, MyOrder.Cancelorder, "取消", "确定");
        });
        $("#btnDelete").on("click", function () {
            ConfirmMessage("确定要删除订单吗？", fbox_ftel, MyOrder.Deleteorder, "取消", "确定");
        });
        MyOrder.GetDetail();

    },
    GetDetail: function () {
        var purl = "/Ajax/MobileCZAPI.aspx";
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "action=getmobileczorderbyorderno&t=" + Math.random() + "&orderno=" + $("#hid_order_code").val(),
            type: "POST",
            dataType: "text"
        });
        //正常返回
        request.done(function (msg) {
            if (msg == "需登录") {
                Message.ShowToPage("", g_const_PageURL.MainIndex + "?u=" + g_const_PageURL.GetKey(g_const_PageURL.MobileCZList), 500, "");
                return;
            }
            else if (msg == "缺少参数") {
                ShowMesaage("缺少参数");
                return;
            }

            else {
                msg = JSON.parse(msg);
                MyOrder.Load_Result(msg.ResultTable);
            }
        });
        //接口异常
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    //接口返回成功后的处理
    Load_Result: function (result) {
        var order_statusTemp = '';
        var strRefund = "";
        switch (result[0].status) {
            case "0":
            case "10":
                order_statusTemp = "待付款";
                $("#div_orderbtn").show();
                $("#div_idnumber_warm").show();
                break;
            case "110":
            case "190":
                order_statusTemp = "充值中";
                break;
            case "1":
                order_statusTemp = "交易成功";
                break;
            case "3":
            case "200":
            case "100":
            case "90":
            case "95":
            case "20":
                order_statusTemp = "交易关闭";
                if (result[0].status == "200") {
                    strRefund = "退款中";
                } else if (result[0].status == "20") {
                    strRefund = "退款中";
                } else if (result[0].status == "90") {
                    strRefund = "退款中";
                } else if (result[0].status == "100") {
                    strRefund = "退款成功";
                } else if (result[0].status == "95") {
                    strRefund = "退款失败";
                }
                $("#div_orderbtn_del").show();
                if (result[0].status != "3") {
                    $("#div_refund_warm").show();
                }
                break;
        }
        $("#b_refund").html(strRefund);
        $("#i_orderstatus").html(order_statusTemp);
        $("#i_ordermoney").html("￥" + result[0].paymoney);
        $("#i_productmoney").html("￥" + result[0].paymoney + "<em>x1</em>");
        $("#i_paymoney").html("￥" + result[0].paymoney);
        $("#span_mobileno").html(result[0].czmobile);
        $("#span_title").html(result[0].memo);
        $("#p_mobile").html("充值手机号："+result[0].czmobile.substr(0, 3) + "****" + result[0].czmobile.substr(7, 4));
        switch (result[0].paygate) {
            case "76":
            case "762":
            case "761":
            case "763":
                $("#em_paytype").html("微信");
                break;
            case "65":
                if (result[0].paytype=="0") {
                    $("#em_paytype").html("支付宝");
                }
                else{
                    $("#em_paytype").html("银联支付");
                }
                break;
            case "654":
            case "651":
            case "653":
                $("#em_paytype").html("支付宝");
                break;
            case "77":
            case "771":
                $("#em_paytype").html("易付宝");
                break;
            case "62":
                $("#em_paytype").html("银联支付");
                break;

            default:
                $("#em_paytype").html("未知");
                break;
        }
        var ord = result[0].orderno.split('-');
        if (ord.length > 1) {
            ord = ord[1];
        }
        else {
            ord = ord[0];
        }
        $("#p_orderno").html("订单号：" + ord);
        $("#p_ordertime").html("下单时间：" + result[0].datatime);

        MyOrder.GetType(result[0].czmobile);
        //金额
        //var order_money = "<i>￥</i>" + result[0].paymoney;
        //$("#payMoney").html(order_money)
        ////订单面值金额
        //$("#hid_ordermoney").val(result[0].ordermoney);
        ////
        //$("#hid_productid").val(result[0].productid);
        ////
        //$("#hid_cztype").val(result[0].cztype);
        ////
        //$("#hidmobileNum").val(result[0].czmobile);
        ////
        //$("#hidLoginName").val(result[0].fqmobile);
        ////
        //$("#hid_orderno").val(result[0].orderno);
        //$("#hid_memo").val(result[0].memo);
        //$("#hid_paymoney").val(result[0].paymoney);

        //支付方式


        // $("#div_pay_type").html(all_pay_type);

        var productImg = "/img/hfcz.jpg";
        if (result[0].memo.indexOf('联通') > -1) {
            productImg = "/img/1.png";
        }
        else if (result[0].memo.indexOf('移动') > -1) {
            productImg = "/img/2.png";
        }
        else if (result[0].memo.indexOf('电信') > -1) {
            productImg = "/img/3.png";
        }
        else {
            productImg = "/img/hfcz.jpg";
        }
        var productType = "话费";
        var productCss = "bill_class_01";
        if (result[0].memo.indexOf('话费') > -1) {
            productType = "话费";
            productCss = "bill_class_01";
        }
        else {
            productType = "流量";
            productCss = "bill_class_02";
            $("#p_mobilememo").show();
        }
        $("#img_productimg").attr("src", productImg);
        $("#span_producttype").html(productType);
        $("#span_producttype").attr("class", productCss);
        $("#loadTip").hide();
    },
    GetType: function (phone) {
        g_type_self_api.api_url = "/Ajax/MobileCZAPI.aspx";
        var objsend = {
            PhoneNumber: phone,
        };
        var senddata = {
            action: "GetPhoneArea",
            api_input: JSON.stringify(objsend)
        };
        g_type_self_api.LoadData(senddata, function (msg) {
            if (msg.resultcode === g_const_Success_Code_IN.toString()) {
                var mname = msg.Province + Mtype.GetName(msg.Mtype);
                $("#span_mobiletype").html(mname);
                //if (mname.indexOf('联通')>-1) {
                //    $("#img_productimg").attr("src", "/img/1.png");
                //}
                //else if (mname.indexOf('移动') > -1) {
                //    $("#img_productimg").attr("src", "/img/2.png");
                //}
                //else {
                //    $("#img_productimg").attr("src", "/img/hfcz.jpg");
                //}
            }
        }, "", function (msg) {

        });
    },
    //接口返回失败后的处理
    Load_ResultErr: function (resultlist) {
    },
    Cancelorder: function () {
        var purl = "/Ajax/MobileCZAPI.aspx";
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "action=cancelorder&t=" + Math.random() + "&orderno=" + $("#hid_order_code").val(),
            type: "POST",
            dataType: "text"
        });
        //正常返回
        request.done(function (msg) {
            if (msg == "需登录") {
                Message.ShowToPage("", g_const_PageURL.MainIndex + "?u=" + g_const_PageURL.GetKey(g_const_PageURL.MobileCZList), 500, "");
                return;
            }
            else if (msg == "缺少参数") {
                ShowMesaage("缺少参数");
                return;
            }

            else {
                Message.ShowToPage(msg, g_const_PageURL.MainIndex + "?u=" + g_const_PageURL.GetKey(g_const_PageURL.MobileCZList), 2000, "");
            }
        });
        //接口异常
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Deleteorder: function () {
        var purl = "/Ajax/MobileCZAPI.aspx";
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "action=deleteorder&t=" + Math.random() + "&orderno=" + $("#hid_order_code").val(),
            type: "POST",
            dataType: "text"
        });
        //正常返回
        request.done(function (msg) {
            if (msg == "需登录") {
                Message.ShowToPage("", g_const_PageURL.MainIndex + "?u=" + g_const_PageURL.GetKey(g_const_PageURL.MobileCZList), 500, "");
                return;
            }
            else if (msg == "缺少参数") {
                ShowMesaage("缺少参数");
                return;
            }

            else {
                Message.ShowToPage(msg, g_const_PageURL.MainIndex + "?u=" + g_const_PageURL.GetKey(g_const_PageURL.MobileCZList), 2000, "");
            }
        });
        //接口异常
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
};