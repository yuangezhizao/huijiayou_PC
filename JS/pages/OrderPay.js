/// <reference path="../functions/g_Const.js" />
/// <reference path="../functions/g_Type.js" />
/// <reference path="../jquery-2.1.4.js" />
/// <reference path="../g_header.js" />
/// <reference path="../functions/Payment.js" />


var page_order_pay = {
    //订单支持的全部支付方式
    OrderPayTypeAll:[],
    //订单号
    OrderNo: "",
    //支付方式
    Paygate:0,
    //初始化
    Init: function () {
        
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
                page_order_pay.Paygate = parseInt(spaygate,10);
        }
        //读取订单支持的全部支付方式
        page_order_pay.LoadOrderPayTypeAll();
        //if(!IsDebug)
            
        

        
    },
    //读取订单信息
    LoadOrderInfo: function () {
        g_type_api.api_input = {
            order_code: page_order_pay.OrderNo,
            deviceType: "WEB"
        };
        g_type_api.api_target = "com_cmall_familyhas_api_ApiOrderDetails";
        g_type_api.api_token = g_const_api_token.Wanted;
        g_type_api.LoadData(page_order_pay.AfterLoadOrderInfo, "");
    },
    //读取订单支持的全部支付方式
    LoadOrderPayTypeAll: function () {
        g_type_api.api_input = {
            order_code: page_order_pay.OrderNo,
            deviceType: "WEB"
        };
        g_type_api.api_target = "com_cmall_familyhas_api_ApiPaymentTypeAll";
        g_type_api.api_token = g_const_api_token.Wanted;
        g_type_api.LoadData(page_order_pay.LoadPayment, "");
    },

    AfterLoadOrderInfo: function (msg) {
       
        $("#font_failureTimeReminder").html(msg.failureTimeReminder);
        switch (msg.order_status) {
            case g_const_orderStatus.DFK:
                page_order_pay.AutoLoadOrderInfo();
                break;
            case g_const_orderStatus.DFH:               
            case g_const_orderStatus.DSH:                
            case g_const_orderStatus.JYCG:
                g_const_PageURL.GoByMainIndex(g_const_PageURL.OrderSuccess, "");
                break;
            case g_const_orderStatus.JYSB://交易关闭           
                g_const_PageURL.GoByMainIndex(g_const_PageURL.OrderFail, "");
            default:
                ShowMesaage("不支持的订单状态：" + msg.order_status + "。");
                break;
        }
    },
    //提交到支付网关
    SubmitToPayment: function () {
        $("body").css("display", "none");
        Payment.OrderNo = page_order_pay.OrderNo;
        Payment.Paygate = page_order_pay.Paygate;
        Payment.CallBack = function (payment) {
            var payment1 = JSON.parse(payment.resultmessage);
            $(g_const_wxPayQrcode).attr("src", payment1.qrcode_base64);
            page_order_pay.OrderNo = payment.orderno;
            page_order_pay.Paygate = payment.paygate;
            $("#wx_pay_orderno").html(payment.orderno);
            $("#wx_pay_orderamount").html(payment.orderamount);
            $("body").css("display", "");
            page_order_pay.AutoLoadOrderInfo();
        }
        Payment.Init();
        
    },
    //每5秒查询一次订单状态
    AutoLoadOrderInfo: function () {
        window.setTimeout(function () {
            page_order_pay.LoadOrderInfo();
        }, 5 * g_const_seconds);

    },
    //变更支付方式
    ChangePayment: function (defaultPaygate) {
        $("div.bd li").removeClass("curr");
        $("div.bd li[paygate='" + defaultPaygate.toString() + "']").addClass("curr");
        page_order_pay.SelectPaygate = defaultPaygate;
    },
    LoadPayment: function (msg) {
        page_order_pay.OrderPayTypeAll = msg.paymentTypeAll;
        //是否可以使用原有支付方式
        //var CanUseoldPaygate = false;
        var accountpayhtml = "";
        var bankpayhtml = "";
        var stpl = $("#tpl_bank").html();
        for (var k in PaymentCollect.BankList) {
            var bank = PaymentCollect.BankList[k];
            var data = {
                paygate: bank.Paygate.toString(),
                paygatetype: bank.paygatetype.toString(),
                paygatetypeaccount: bank.paygatetypeaccount.toString(),
                paygatepicture: cdn_path+"/img/bank/bank-" + bank.Paygate.toString() + ".jpg",
                paygatename:bank.BankName
            };
            if (bank.paygatetype == g_const_paygatetype.AlipayWeb) {
                bankpayhtml += renderTemplate(stpl, data);
            }
            //银联wap支付
            else if (bank.paygatetype == g_const_paygatetype.YinlianpayWap) {
                //判断是否可以显示也能联支付
                $.each(msg.paymentTypeAll, function (iii, nnn) {
                    if (nnn == g_pay_Type.YinLianpay) {
                        //CanUseoldPaygate = true;
                        accountpayhtml += renderTemplate(stpl, data);
                    }
                });
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
            Payment.ChangePayment(page_order_pay.SelectPaygate, page_order_pay.OrderNo, page_order_pay.AfterChangePayment)
            $(".pop_mode").css("display", "none");
        });

        $("div.bd li").on("click", function () {
            $("div.bd li").removeClass("curr");
            $(this).addClass("curr");
            page_order_pay.SelectPaygate = parseInt($(this).attr("paygate"), 10);            
        });

        //提交网关前判断是否支持原有支付方式【未完成】
        page_order_pay.SubmitToPayment();
    },
    SelectPaygate: 0,
    AfterChangePayment: function (msg) {
        page_order_pay.SubmitToPayment();
    }
};
