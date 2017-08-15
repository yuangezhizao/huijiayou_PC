
var browser = '';
function loadInit() {
    browser = {
        versions: function () {
            var u = navigator.userAgent, app = navigator.appVersion;
            return {//移动终端浏览器版本信息  
                trident: u.indexOf('Trident') > -1, //IE内核 
                presto: u.indexOf('Presto') > -1, //opera内核 
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核 
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核 
                mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端 
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端 
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器 
                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器 
                iPad: u.indexOf('iPad') > -1, //是否iPad 
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部 
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    }
}

$(document).ready(function () {

    loadInit();
    if (browser.versions.android) {
        $("#hidclienttype").val("3");
    }
    else if (browser.versions.ios) {
        $("#hidclienttype").val("4");
    }
    else {
        $("#hidclienttype").val("5");//web
    }
    //返回
    $("#go_back").click(function () {
        //window.location.replace(PageUrlConfig.BackTo());
        window.location.replace(g_const_PageURL.MobileCZList);

    });

    //获得传递的订单号
    $("#hid_orderno").val(GetQueryString("order_code"));

    //加载订单详情和在线支付方式
    onlinePayType.getList();

    /* 提交 */
    $('#btn_pay').on('click', function () {
        if ($("#hidmobileNum").val()=="") {
            UserRELogin.login(g_const_PageURL.MyMobileCZOrder_pay + "?orderno=" + $("#hid_orderno").val())
            return;
        }
        else {

            $("#btn_pay_wait").show();
            $("#btn_pay").hide();
            $("#waitdiv").show();
            //资金充值
            var _cztype = $("#hid_cztype").val();
            var _paygate = "762";
            if (IsInWeiXin.check() == false) {
                _paygate = "651";
            }

            //微信中使用微信支付，浏览器中使用支付宝支付
            var _payType = "1";
            if (IsInWeiXin.check() == false) {
                //支付宝
                _payType = "2";
            }
            $.ajax({
                type: "POST", //用POST方式传输
                dataType: "text",//"json", //数据格式:JSON
                url: '/Ajax/MobileCZAPI.aspx', //目标地址
                data: "t=" + Math.random() +
                        "&action=cztopaygate" +
                        "&paytype=" + _payType +
                        "&cztype=" + _cztype +
                        "&paygate=" + _paygate +
                        "&orderno=" + $("#hid_orderno").val() +
                        "&clienttype=" + $("#hidclienttype").val() +
                        "&fqmobile=" + $("#hidLoginName").val() +
                        "&czmobile=" + $("#hidmobileNum").val() +
                        "&czmoney=" + $("#hid_ordermoney").val() +
                        "&paymoney=" + $("#hid_paymoney").val() +
                        "&memo=" + $("#hid_memo").val() +
                        "&productID=" + $("#hid_productid").val(),
                beforeSend: function () { $("#waitdiv").show() }, //发送数据之前
                complete: function () { }, //接收数据完毕
                success: function (json) {
                    //alert(json);


                    $("#mb_submit_wite").hide();
                    $("#mb_submit").show();

                    $("#waitdiv").hide();

                    if (_payType == "2") {
                        //支付宝支付
                        //window.location.replace(g_Alipay_url + _orderid + "/" + g_pay_Type.Alipay);
                        eval(json.replace("<script>", "").replace("</script>", ""))
                    }
                    else {
                        //字符串转换为json对象
                        var obj = JSON.parse(json);

                        // alert(obj.result);
                        if (obj.result == "90") {
                            ShowMesaage(obj.msg);
                        }
                        else {
                            //微信支付
                            //alert(obj.msg.resultcode);
                            //alert(obj.msg.jsapiparam);
                            //alert(obj.msg.orderno);
                            //alert(obj.msg.orderamount);

                            if (obj.msg.resultcode == 0) {
                                if (typeof (obj.msg.jsapiparam) != "undefined") {
                                    callpay(obj.msg.jsapiparam, obj.orderno, obj.orderamount);
                                }
                                else {
                                    ShowMesaage("缺少参数");
                                }
                            }
                                //else if (obj.msg.resultcode == 5) {
                                //    noty({ text: "您还没有绑定微信,不能使用微信支付." });
                                //}
                            else {
                                ShowMesaage(obj.msg.resultmsg);
                            }
                        }
                    }
                }
            });
        }
    });


});

function SavePayType11(paytype) {

    $("#alpayicq").removeClass();
    $("#weixinicq").removeClass();
    //$("selother").attr("class", "");

    switch (paytype) {
        case "alipay":
            $("#alpayicq").attr("class", "curr");
            //保存支付方式对应代码
            $("#hid_selpaytype").val("alipay");

            break;
        case "weixin":
            $("#weixinicq").attr("class", "curr");
            //保存支付方式对应代码
            $("#hid_selpaytype").val("weixin");
            break;
            //case "other":
            //    $("#selother").attr("class", "curr");
            //    //保存支付方式对应代码
            //    $("#hid_selpaytype").val("other");
            //    break;
    }

}

//在线支付包含的支付方式
var onlinePayType = {
    getList: function () {
        var purl = "/Ajax/MobileCZAPI.aspx";
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "action=getmobileczorderbyorderno&t=" + Math.random() + "&orderno=" + $("#hid_orderno").val(),
            type: "POST",
            dataType: "text"
        });
        //正常返回
        request.done(function (msg) {
            if (msg == "需登录") {
                //Session失效，重新登录，传递回调地址
                UserRELogin.login(g_const_PageURL.MyMobileCZOrder_pay + "?orderno=" + $("#hid_orderno").val())
                return;
            }
            else if (msg == "缺少参数") {
                ShowMesaage("缺少参数");
                return;
            }

            else {
                msg = JSON.parse(msg);
                onlinePayType.Load_Result(msg.ResultTable);
            }
        });
        //接口异常
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    //接口返回成功后的处理
    Load_Result: function (result) {
        //金额
        var order_money = "<dt>请支付：<em><i>￥</i>" + result[0].paymoney + "</em></dt>";

        //订单面值金额
        $("#hid_ordermoney").val(result[0].ordermoney);
        //
        $("#hid_productid").val(result[0].productid);
        //
        $("#hid_cztype").val(result[0].cztype);
        //
        $("#hidmobileNum").val(result[0].czmobile);
        //
        $("#hidLoginName").val(result[0].fqmobile);
        //
        $("#hid_orderno").val(result[0].orderno);
        $("#hid_memo").val(result[0].memo);
        $("#hid_paymoney").val(result[0].paymoney);
        
        //支付方式
        var all_pay_type = "";
        var sel = "curr";
        if (IsInWeiXin.check() == false) {
            all_pay_type += "<dd id=\"selalipay\" onclick=\"javascript: $('#alpayicq').removeClass(); $('#weixinicq').removeClass();$('#alpayicq').attr('class', 'curr');$('#hid_selpaytype').val('alipay');\" ><em class=\"alipay\"></em>支付宝<a id=\"alpayicq\" href=\"#\" class='" + sel + "' ></a></dd>";
        }
        else {
            all_pay_type += "<dd id=\"selweixin\" onclick=\"javascript:$('#alpayicq').removeClass(); $('#weixinicq').removeClass();$('#weixinicq').attr('class', 'curr');$('#hid_selpaytype').val('weixin');\" ><em class=\"weixin\"></em>微信支付<a id=\"weixinicq\" href=\"#\" class='" + sel + "' ></a></dd>";
        }

       
        $(".pay-method").html(order_money + all_pay_type);

    },
    //接口返回失败后的处理
    Load_ResultErr: function (resultlist) {
    },
};

function callpay(jsapiparam, orderno, orderamount) {
    //alert(typeof WeixinJSBridge);

    if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
        }
        else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', jsApiCall);
            document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
        }
    }
    else {
        jsApiCall(jsapiparam, orderno, orderamount);
    }
    //jsApiCall(jsapiparam, orderno, orderamount);
}
function jsApiCall(jsapiparam, orderno, orderamount) {
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        jsapiparam,//josn串
        function (res) {

            var sparam = "c_cztype=" + $("#hidselcztype").val() + "&c_transnum=null&c_order=" + orderno + "&c_paygate=763&c_orderamount=" + orderamount + "&dealtime=" + new Date().Format("yyyyMMddhhmmss");
            //alert(sparam);
            WeixinJSBridge.log(res.err_msg);
            if (res.err_msg == "get_brand_wcpay_request:ok") {
                sparam += "&wxpay=ok";
                //var sparam = "c_transnum=null&c_order=" + JSAPI.orderno + "&c_paygate=762&c_orderamount=" + JSAPI.orderamount + "&dealtime=" + new Date().Format("yyyyMMddhhmmss");
                window.location = "/MobileCZ/handleshow.aspx?" + sparam;
            }
            else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                ShowMesaage(g_const_API_Message["100028"]);
                sparam += "&wxpay=fail";
                window.location = "/MobileCZ/handleshow.aspx?" + sparam;

            }
            else if (res.err_msg == "get_brand_wcpay_request:fail") {
                sparam += "&wxpay=fail";
                window.location = "/MobileCZ/handleshow.aspx?" + sparam;
            }
            else {
                alert("很遗憾，支付失败了。");
            }

        }
     );
}


