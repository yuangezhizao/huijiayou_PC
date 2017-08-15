/// <reference path="../functions/g_Const.js" />
/// <reference path="../functions/g_Type.js" />
/// <reference path="../jquery-2.1.4.js" />
/// <reference path="../g_header.js" />
/// <reference path="../functions/Payment.js" />


var page_order_pay = {
    //订单号
    OrderNo: "",
    //支付方式
    Paygate: 0,
    //初始化
    Init: function () {

        page_order_pay.LoadPayment();
        if (typeof (localStorage[g_const_localStorage.OrderInfo]) != "undefined") {
            var Order = JSON.parse(localStorage[g_const_localStorage.OrderInfo]);
            page_order_pay.OrderNo = Order.OrderNo;
            page_order_pay.Paygate = Order.Paygate;
        }
        else {
            page_order_pay.OrderNo = GetQueryString("OrderNo");
            var spaygate = GetQueryString("Paygate");
            if (spaygate == "")
                page_order_pay.Paygate = 0;
            else
                page_order_pay.Paygate = parseInt(spaygate, 10);
        }
        //if(!IsDebug)
        page_order_pay.SubmitToPayment();



    },
    LoadOrderInfo: function () {
        var purl = "/Ajax/MobileCZAPI.aspx";
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getmobileczorderbyorderno&orderno=" + page_order_pay.OrderNo,
            dataType: "text"
        });

        request.done(function (msg) {
            if (msg == "需登录") {
                //Session失效，重新登录，传递回调地址
                // UserRELogin.login(g_const_PageURL.MyMobileCZOrder_pay + "?orderno=" + page_order_pay.OrderNo)
                //  return;
            }
            else if (msg == "缺少参数") {
                ShowMesaage("缺少参数");
                return;
            }

            else {
                msg = JSON.parse(msg);
                page_order_pay.LoadResult(msg.ResultTable);
            }
            //if (msg.resultCode == g_const_Success_Code) {

            //}
            //else {

            //    ShowMesaage(msg.resultMessage);
            //}
        });

        request.fail(function (jqXHR, textStatus) {
        });
    },
    LoadResult: function (result) {
        
        //金额
        var order_money = "￥" + result[0].paymoney;// "<dt>请支付：<em><i>￥</i>" + result[0].paymoney + "</em></dt>";
        //支付金额
        $("#wx_pay_orderamount").html(order_money)
        //订单号
        $("#wx_pay_orderno").val(result[0].orderno);
        //订单号
        $("#hid_orderno").val(result[0].orderno);
        ////充值手机号
        //$("#ulAddressList").html(result[0].czmobile)
        ////订单面值金额
        //$("#hid_ordermoney").val(result[0].ordermoney);
        ////
        //$("#hid_productid").val(result[0].productid);
        ////
        //$("#hid_cztype").val(result[0].cztype);
        ////
        //$("#hidmobileNum").val(result[0].czmobile);
        ////
        //$("#hidLoginName").val(UserLogin.LoginName);
        
        //$("#hid_memo").val(result[0].memo);
        //$("#hid_paymoney").val(result[0].paymoney);

        //switch (result[0].status) {
        //    case "":
        //    case g_const_orderStatus.DSH:
        //    case g_const_orderStatus.JYCG:
        //        g_const_PageURL.GoByMainIndex(g_const_PageURL.OrderSuccess, "");
        //        break;
        //    case "200"://交易关闭           
        //        g_const_PageURL.GoByMainIndex(g_const_PageURL.OrderFail, "");
        //    default:
        //        ShowMesaage("不支持的订单状态：" + msg.order_status + "。");

        //        break;
        //}
        
        if (result[0].status == "110" || result[0].status == "3" || result[0].status == "1" || result[0].status == "190" || result[0].status == "200") {
            //支付成功、失败，充值成功、发起充值、充值失败，跳转至结果页
            window.location.href = "/IndexMain.html?u=MobileCZResult&c_order=" + result[0].orderno + "&c_succmark=" + result[0].succmark;
        }
    },
    //提交到支付网关
    SubmitToPayment: function () {
        $("body").css("display", "none");
        Payment_MobileCHZ.OrderNo = page_order_pay.OrderNo;
        Payment_MobileCHZ.Paygate = page_order_pay.Paygate;
        Payment_MobileCHZ.CallBack = function (payment) {
            var payment1 = JSON.parse(payment.resultmessage);
            $(g_const_wxPayQrcode).attr("src", payment1.qrcode_base64);
            page_order_pay.OrderNo = payment.orderno;
            page_order_pay.Paygate = payment.paygate;
            $("#wx_pay_orderno").html(payment.orderno);
            $("#wx_pay_orderamount").html(payment.orderamount);
            $("body").css("display", "");
            page_order_pay.AutoLoadOrderInfo();
        }
        Payment_MobileCHZ.Init();

    },
    //每5秒查询一次订单状态
    AutoLoadOrderInfo: function () {
        window.setInterval(function () {
            page_order_pay.LoadOrderInfo();
        }, 5 * g_const_seconds);

    },
    //变更支付方式
    ChangePayment: function (defaultPaygate) {
        $("div.bd li").removeClass("curr");
        $("div.bd li[paygate='" + defaultPaygate.toString() + "']").addClass("curr");
        page_order_pay.SelectPaygate = defaultPaygate;
    },
    LoadPayment: function () {
        var accountpayhtml = "";
        var bankpayhtml = "";
        var stpl = $("#tpl_bank").html();
        for (var k in PaymentCollect.BankList) {
            var bank = PaymentCollect.BankList[k];
            var data = {
                paygate: bank.Paygate.toString(),
                paygatetype: bank.paygatetype.toString(),
                paygatetypeaccount: bank.paygatetypeaccount.toString(),
                paygatepicture: cdn_path + "/img/bank/bank-" + bank.Paygate.toString() + ".jpg",
                paygatename: bank.BankName
            };
            if (bank.paygatetype == g_const_paygatetype.AlipayWeb) {
                bankpayhtml += renderTemplate(stpl, data);
            }
            //银联wap支付
            else if (bank.paygatetype == g_const_paygatetype.YinlianpayWap) {
                bankpayhtml += renderTemplate(stpl, data);
            }
            else {
                accountpayhtml += renderTemplate(stpl, data);
            }
        }
        $("#accountpay").html(accountpayhtml);
        $("#bankpay").html(bankpayhtml);

        $(".pop_mode .cont h2 a").on("click", function () {
            $(".pop_mode").css("display", "none");
        });

        $("#btn_ChangePayment").on("click", function () {
            page_order_pay.ChangePayment(page_order_pay.Paygate);
            $(".pop_mode").css("display", "");
        });

        $("#btn_ok").on("click", function () {
            Payment_MobileCHZ.ChangePayment(page_order_pay.SelectPaygate, page_order_pay.OrderNo, page_order_pay.AfterChangePayment)
            $(".pop_mode").css("display", "none");
        });

        $("div.bd li").on("click", function () {
            $("div.bd li").removeClass("curr");
            $(this).addClass("curr");
            page_order_pay.SelectPaygate = parseInt($(this).attr("paygate"), 10);
        });

    },
    SelectPaygate: 0,
    AfterChangePayment: function (msg) {
        page_order_pay.SubmitToPayment();
    }
};
