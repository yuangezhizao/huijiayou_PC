

/*396 微信支付支持可配置*/
var WxPay = {
    //获得微信支付方式
    GetWxPayType: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=GetWxPayRetflag",
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {

            $("#hid_wxpaytype").val("2");

        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    /*396 跳转网关支付*/
    GoPayGatePay: function (orderNo) {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=gopaygatepayment_mobileCZ&OrderNo=" + orderNo,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            $("#btn_pay_wait").hide();
            $("#btn_pay").show();
            
            //$("#waitdiv").hide();


            if (msg.resultcode == "0") {

                if (IsInWeiXin.check()) {
                        //跳转网关处理
                        window.location.replace(msg.resultmessage);
                }
                else {
                    //跳转网关处理
                    window.location.replace(msg.resultmessage);
                }
            } else {

                ShowMesaage(msg.resultmessage);
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
}

//=======================================================================================================

var isflagTheSea = 0;
var is_exchange = 0;
var is_neigouaddress = 0;
var GlobalObjLabel = null;
var addressList = "";
var OrderParam = {
    //应付金额
    check_pay_money: 0,
    //送货地址ID
    buyer_address_id: "",
    //区编码
    buyer_address_code: "",
    //邮政编码
    buyer_postcode: "",
    //商品列表
    goods: [],
    //收货人电话
    buyer_mobile: "",
    //支付类型
    pay_type: g_pay_Type.Online,
    //详细地址
    buyer_address: "",
    //发票类型
    bill_type: g_const_bill_Type.NotNeed,
    //发票明细
    bill_detail: "明细",
    //发票抬头
    bill_title: "个人",
    //收货人
    buyer_name: "",
    //订单类型
    order_type: g_order_Type.Common,
    //优惠券
    coupon_codes: [],
    //订单编号
    order_code: "",
    //最大暂存款
    max_temporarystore: 0,
    //最大储值金
    max_storegold: 0,
    //最大积分
    max_point: 0,
    //使用暂存款
    use_temporarystore: 0,
    //使用储值金
    use_storegold: 0,
    //使用积分
    use_point: 0,
    //实际应付金额
    real_pay_money: 0,
    //优惠金额
    sub_money: 0,
    //产品编码
    productCodeList: "",
    //产品名称
    productNameList: "",
    //产品价格
    productPriceList: "",
    //产品数量
    productNumberList: "",
    //支付方式
    orderpaygate: 0,
    //网关类型
    paygatetype: 0,
    //接口类型账号的paygate
    paygatetypeaccount: 0,
    //支付接口类型
    orderpayment: 0,
    //订单编号
    ordercode: "",
    //是否需要身份证
    needverifyidnumber: 0,
    //身份证号
    idnumber: "",
    //LD 商品金额
    productMoneyForLD: 0,
}

////多麦--订单需要的商品参数
//var duomai_goods_id = "";//商品编号
//var duomai_goods_name = "";//商品名称
//var duomai_goods_price = "";//商品单价
//var duomai_goods_ta = "";//商品数量
//var duomai_goods_cate = "";//商品分类编号
//var duomai_totalPrice = "";//每个商品实际支付金额
//var duomai_SumPrice = "";//商品应付总金额
//var duomai_manjianPrice = "";//商品满减金额


//支付方式
var OrderPayment = {
    Load: function () {

        //if (pay_type.indexOf(g_pay_Type.Getpay) > -1) {
        //    $("#rd_hdfk").closest("dt").show();
        //}

        var paydefaultHtml = "";
        var payotherHtml = "";
        var payClass = "";


        paydefaultHtml += "<p id=\"p1\">";
        payotherHtml += "<p id=\"p2\">";
        $.each(PaymentCollect.BankList, function (i, n) {
            if (localStorage[g_const_localStorage.OrderPaygate] != null) {
                //有缓存取之前选的
                if (n.Paygate == localStorage[g_const_localStorage.OrderPaygate]) {
                    payClass = "class=\"curr\"";
                    OrderPayment.Set(n.Paygate, n.paygatetype, n.paygatetypeaccount);
                }
                else {
                    payClass = "";
                }
            }
            else {
                //没有缓存取第一个
                if (i == 0) {
                    payClass = "class=\"curr\"";
                    OrderPayment.Set(n.Paygate, n.paygatetype, n.paygatetypeaccount);
                }
                else {
                    payClass = "";
                }
            }
            if (n.paygatetype == g_const_paygatetype.AlipayWeb) {
                payotherHtml += "<a " + payClass + " onclick=\"OrderPayment.Set('" + n.Paygate.toString() + "','" + n.paygatetype.toString() + "','" + n.paygatetypeaccount.toString() + "')\"><i></i><img src=\"" + cdn_path + "/img/bank/bank-" + n.Paygate.toString() + ".jpg\" alt=\"" + n.BankName.toString() + "\"></a>";
            }
            //银联Wap支付
            else if (n.paygatetype == g_const_paygatetype.YinlianpayWap) {
                payotherHtml += "<a " + payClass + " onclick=\"OrderPayment.Set('" + n.Paygate.toString() + "','" + n.paygatetype.toString() + "','" + n.paygatetypeaccount.toString() + "')\"><i></i><img src=\"" + cdn_path + "/img/bank/bank-" + n.Paygate.toString() + ".jpg\" alt=\"" + n.BankName.toString() + "\"></a>";
            }
            else {

                paydefaultHtml += "<a " + payClass + " onclick=\"OrderPayment.Set('" + n.Paygate.toString() + "','" + n.paygatetype.toString() + "','" + n.paygatetypeaccount.toString() + "')\"><i></i><img src=\"" + cdn_path + "/img/bank/bank-" + n.Paygate.toString() + ".jpg\" alt=\"" + n.BankName.toString() + "\"></a>";
            }
        });
        paydefaultHtml += "</p>";
        payotherHtml += "</p>";
        $("#quan").html(paydefaultHtml + payotherHtml + "<span>更多</span>");
        $('#p1 a').click(function () {
            $('#p2 a').removeClass('curr');
        });
        $('#p2 a').click(function () {
            $('#p1 a').removeClass('curr');
        });
        $('.payment .bd dd a').click(function () {
            $(this).addClass('curr').siblings().removeClass('curr');
        });


        $('.payment .bd dd span').click(function () {
            var cla = $(this).attr('id');
            if (undefined == cla || null == cla || '' == cla) {
                $(this).attr('id', 'curr');
                $(this).html('收起');
                $('.payment .bd dd').css('height', 'auto');
            } else {
                $(this).attr('id', '');
                $(this).html('更多');
                $('.payment .bd dd').css('height', '125px');
            }
        });
    },

    Set: function (orderpaygate, paygatetype, paygatetypeaccount, orderpayment) {
        setPaytype(1);
        localStorage[g_const_localStorage.OrderPaygate] = orderpaygate;
        OrderParam.orderpaygate = orderpaygate;
        OrderParam.paygatetype = 1;
        OrderParam.paygatetypeaccount = paygatetypeaccount;
        OrderParam.orderpayment = paygatetype;
    },
};


$(document).ready(function () {
    //获得传递的订单号
    $("#hid_orderno").val(GetQueryString("order_code"));
    OrderParam.ordercode = GetQueryString("order_code");
    $("#hidclienttype").val("5");//web

    $("#hid_suoshu").val(unescape(GetQueryString("tttt")));

    UserLogin.Check(SetLoginDiv);
    //if (localStorage.getItem(g_const_localStorage.MyMobileCZOrder_pay)) {
    //    OrderParam.goods = JSON.parse(localStorage.getItem(g_const_localStorage.MyMobileCZOrder_pay)).GoodsInfoForAdd;
    //}
    //if (OrderParam.goods.length == 0) {
    //    //var p = "&t=" + Math.random();
    //    //g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.Index), p);
    //    window.location.replace(PageUrlConfig.BackTo());
    //}

    //加载支付方式
    OrderPayment.Load();

    //提交订单
    $("#btnOrderCreate").click(function () {
        
        if (UserLogin.LoginStatus == g_const_YesOrNo.YES) {

            if ($("#hidmobileNum").val() == "") {
                UserRELogin.login(g_const_PageURL.MyMobileCZOrder_pay + "?order_code=" + $("#hid_orderno").val() + "&tttt=" +escape($("#hid_suoshu").val()))
                return;
            }
            else {

                $("#btn_pay_wait").show();
                $("#btn_pay").hide();
                //资金充值
                var _cztype = $("#hid_cztype").val();

                var bankid = 0;
                //if (OrderParam.paygatetype == 1) {
                    bankid = OrderParam.orderpaygate;
                //}

                $.ajax({
                    type: "POST", //用POST方式传输
                    dataType: "text",//"json", //数据格式:JSON
                    url: '/Ajax/MobileCZAPI.aspx', //目标地址
                    data: "t=" + Math.random() +
                            "&action=createOrder_mobileCZ" +
                            "&paytype=" + OrderParam.orderpayment +//_payType +
                            "&cztype=" + _cztype +
                            "&paygate=" + OrderParam.paygatetypeaccount +//_paygate +
                            "&orderno=" + $("#hid_orderno").val() +
                            "&clienttype=" + $("#hidclienttype").val() +
                            "&fqmobile=" + UserLogin.LoginName +//$("#hidLoginName").val() +
                            "&czmobile=" + $("#hidmobileNum").val() +
                            "&czmoney=" + $("#hid_ordermoney").val() +
                            "&paymoney=1" +
                            "&memo=" + $("#hid_memo").val() +
                            "&bankid=" + bankid +//
                            "&productID=" + $("#hid_productid").val(),
                    beforeSend: function () { }, //发送数据之前
                    complete: function () { }, //接收数据完毕
                    success: function (json) {
                        json = JSON.parse(json);
                        if (json.resultcode == "0") {
                            //提交网关处理，跳转至网关支付页面
                            var OrderInfo = {
                                "OrderNo": "", "Paygate": 0
                            };
                            OrderInfo.OrderNo = OrderParam.ordercode;
                            OrderInfo.Paygate = OrderParam.orderpaygate;
                            localStorage[g_const_localStorage.OrderInfo] = JSON.stringify(OrderInfo);
                            window.location.href = "/IndexMain.html?u=OrderPay_MobileCHZ";
                        }
                        else {
                            window.location.replace(PageUrlConfig.BackTo());
                        }
                    }
                });

            }
        }
        else {
            PageUrlConfig.SetUrl(g_const_PageURL.MainIndex + "?u=MyMobileCZOrder_pay&order_code=" + $("#hid_orderno").val() + "&tttt=" +escape($("#hid_suoshu").val()));
            var p = "&t=" + Math.random();
            g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.Login), p);
        }
    });
    
    
    ////后退
    //$("#btnBackCart").click(function () {
    //    if (OrderCreate.OrderIng == 1) {
    //        return;
    //    }
    //    var p = "&t=" + Math.random();
    //    g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.Cart), p);
    //});

    //OrderPayment.Load(msg.pay_type);
});

function SetLoginDiv() {
    if (UserLogin.LoginStatus == g_const_YesOrNo.YES) {
        //Asset.GetPoint();
        // CouponCodes.GetCouponCodes();
        OrderInfo.GetList();
    }
    else {
        PageUrlConfig.SetUrl(g_const_PageURL.MainIndex + "?u=MyMobileCZOrder_pay&order_code=" + $("#hid_orderno").val() + "&tttt=" +escape($("#hid_suoshu").val()));
        var p = "&t=" + Math.random();
        g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.Login), p);
    }
}
function setPaytype(type) {
    switch (type) {
        case 1:
            OrderParam.pay_type = g_pay_Type.Online;
            break;
        //case 0:
        //    OrderParam.pay_type = g_pay_Type.Getpay;
        //    break;
    }
}


function CheckPressNum() {
    var keyCode = event.keyCode;
    if ((keyCode >= 48 && keyCode <= 57)) {
        event.returnValue = true;
    } else {
        event.returnValue = false;
    }
}


function CheckInputPoint() {
    OrderParam.real_pay_money = OrderParam.check_pay_money;// - OrderParam.use_storegold - OrderParam.use_temporarystore - OrderParam.use_point;
    $("#b_pay_money").html("￥" + parseFloat(OrderParam.real_pay_money).toFixed(2));
}

function CancelOrder() {
    //回退到商品详情页
    window.location.replace(PageUrlConfig.BackTo());
}

//获取订单信息
var OrderInfo = {
    GetList: function () {
        var purl = "/Ajax/MobileCZAPI.aspx";
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getmobileczorderbyorderno&orderno=" + $("#hid_orderno").val(),
            dataType: "text"
        });

        request.done(function (msg) {
            if (msg == "需登录") {
                //Session失效，重新登录，传递回调地址
                // UserRELogin.login(g_const_PageURL.MyMobileCZOrder_pay + "?orderno=" + $("#hid_orderno").val())
                //  return;
            }
            else if (msg == "缺少参数") {
                ShowMesaage("缺少参数");
                return;
            }

            else {
                msg = JSON.parse(msg);
                OrderInfo.LoadResult(msg.ResultTable);
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
        $("#b_pay_money").html(order_money)

        //订单面值金额
        $("#hid_ordermoney").val(result[0].ordermoney);
        //
        $("#hid_productid").val(result[0].productid);
        //
        $("#hid_cztype").val(result[0].cztype);
        //
        $("#hidmobileNum").val(result[0].czmobile);
        //
        $("#hidLoginName").val(UserLogin.LoginName);
        //
        $("#hid_orderno").val(result[0].orderno);
        $("#hid_memo").val(result[0].memo);
        $("#hid_paymoney").val(result[0].paymoney);

        OrderInfo.GetType(result[0].czmobile);

        //订单信息
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
        }

        var ulHtml = '<li>';
        ulHtml += '<a>';
        ulHtml += "<img src=\"" + productImg + "\" alt=\"\" width=\"83\" height=\"83\"><i class=" + productCss + ">" + productType + "</i>";
        ulHtml += "<b>" + result[0].memo + "</b>";
        //ulHtml += "<span>";
       // ulHtml += "<i>充值账号：" + result[0].fqmobile + "</i>";
       //ulHtml += "</span>";
        ulHtml += "</a>";
        ulHtml += "<font class=\"f1\"><b>￥" + parseFloat(result[0].paymoney).toFixed(2) + "</b>";
        ulHtml += "</font><font class=\"f2\">x1</font>";
        ulHtml += "<font class=\"f3\"><span>￥" + parseFloat(result[0].paymoney).toFixed(2) + "</span></font>";
        ulHtml += "</li>";

        $("#ulGoodsList").html(ulHtml);
        $("#spcost_money").html("订单总金额：￥" + parseFloat(result[0].paymoney).toFixed(2));
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
                $("#hid_suoshu").val(mname);
                $("#ulAddressList").html("<li class=\"curr\">" + $("#hid_suoshu").val() + "  " + phone + "</li>")

            }
        }, "", function (msg) {

        });
    },
};


