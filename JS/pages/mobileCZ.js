

//滑动屏幕加载数据
var _PageNo = 1;
var _PageSize = 20;
var _OrderCol = "datetime";
var _OrderType = "desc";
var _stop = true;
var OrderStr = "";
var _paytype = "";
var allProduct = [];
var allProduct_ll = [];
var _selPriceOrLiuliang = "";
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

/*
var scrollHandler = function () {

    //隐藏下拉回调层
    //$("#div_scrolldown").hide();

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
                if ((parseFloat($(window).scrollTop()) / parseFloat($(window).height())) >= 3) {
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


$(window).scroll(function () {
    隐藏下拉回调层
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
                加载多页
                MyOrder_List.GetListByPage();
                显示“至顶部”
                $('.ch-up').show();
                _stop = true;
            }
        }
    }
});
*/

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
    $(".go-back").click(function () {
        window.location.replace(g_const_PageURL.AccountIndex);
    });


    var fqmobile = GetQueryString("fqmobile");
    $("#hidLoginName").val(fqmobile);
    $("#mobileNumInput").val(fqmobile);

    $("#mobileNumInput").on("input propertychange", function () {
        var stxtfeed = $("#mobileNumInput").val().Trim();

        if (stxtfeed.length == 11 && isMobile($("#mobileNumInput").val())) {
            $("#mb_submit").show();
            //所有商品不可选
            $("#value_sel li").each(function (index) {
                $(this).attr("disabled", "");
                $(this).attr("class", "");
            });

            $("#value_sel_ll li").each(function (index) {
                $(this).attr("disabled", "");
                $(this).attr("class", "");
            });

            if (_selPriceOrLiuliang == "") {
                mobile.showData();
            }
            if (_selPriceOrLiuliang == "ll") {
                //流量
                liuliang.showData();
            }
        }
        else {
            //所有商品不可选
            //$("#value_sel li").each(function (index) {
            //    $(this).attr("disabled", "disabled");
            //    $(this).attr("class","");
            //});

            //$("#value_sel_ll li").each(function (index) {
            //    $(this).attr("disabled", "disabled");
            //    $(this).attr("class", "");
            //});
            $("#mb_submit").hide();
        }
    });

    /*  
    $("#mobileNumInput").on('keyup', function () {
        if ($("#mobileNumInput").val().length == 11 && isMobile($("#mobileNumInput").val())) {

            //所有商品不可选
            $("#value_sel li").each(function (index) {
                $(this).attr("disabled", "");
                $(this).attr("class", "");
            });

            $("#value_sel_ll li").each(function (index) {
                $(this).attr("disabled", "");
                $(this).attr("class", "");
            });

            if (_selPriceOrLiuliang == "") {
                mobile.showData();
            }
            if (_selPriceOrLiuliang == "ll") {
                //流量
                liuliang.showData();
            }
        }
        else {
            //所有商品不可选
            $("#value_sel li").each(function (index) {
                $(this).attr("disabled", "disabled");
                $(this).attr("class","");
            });

            $("#value_sel_ll li").each(function (index) {
                $(this).attr("disabled", "disabled");
                $(this).attr("class", "");
            });


        }

        
    });
    */

    //充值金额
    mobile.showData();

    /* 显示资金充值 */
    $('#cz1').on('click', function () {
        _selPriceOrLiuliang = "";
        showDIV("cz1");
        //$("#mb_submit_wite").hide();
        //$("#mb_submit").show();

    });
    /* 显示流量充值 */
    $('#cz2').on('click', function () {
        _selPriceOrLiuliang = "ll";
        showDIV("cz2");
        //$("#mb_submit_wite").hide();
        //$("#mb_submit").show();
    });

    /* 提交 */
    $('#mb_submit').on('click', function () {
        if (!isMobile($("#mobileNumInput").val())) {
            ShowMesaage("请填写正确的手机号码");
        }
        else if ($("#hidselorderno").val()=="") {
            ShowMesaage("请先选择商品");
        }
        else {
            
            $("#mb_submit_wite").show();
            $("#mb_submit").hide();
            $("#waitdiv").show();
            //资金充值
            var _cztype = "00001";
            var _paygate = "762";
            if (IsInWeiXin.check() == false) {
                _paygate = "651";
            }

            if (_selPriceOrLiuliang == "ll") {
                //流量充值
                _cztype = "00002";
            }

            $("#hidselcztype").val(_cztype);

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
                            "&paygate=" +_paygate+
                            "&orderno=" + $("#hidselorderno").val() +
                            "&clienttype=" + $("#hidclienttype").val() +
                            "&fqmobile=" + $("#hidLoginName").val() +
                            "&czmobile=" + $("#mobileNumInput").val() +
                            "&czmoney=" + $("#hidczmoney").val() +
                            "&paymoney=" + $("#mb_price").html() +
                            "&memo=" + $("#mb_area").html() +
                            "&productID=" + $("#hidselProductID").val(),
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
                            eval(json.replace("<script>","").replace("</script>",""))
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
    

    ////下拉重新加载
    //ScrollReload.Listen("MyOrder_list_article", "div_scrolldown", "MyOrder_list", "6", MyOrder_List.ScollDownCallBack);
    ////上拉加载
    //$(window).scroll(scrollHandler);

});

function showDIV(id) {
    $("#mb_area").html("");
    $("#mb_price").html("");
    $("#Discount_p").val("");

    $("#tabList a").each(function (index) {
        $(this).attr("class", "");
    })
    $("#" + id).attr("class", "cur");

    //$("#chongform div").each(function (index) {
    //    $(this).hide();
    //})
    //$("#" + id + "_div").show();
    switch (id) {
        case "cz1":
            $("#value_sel").show();
            $("#value_sel_ll").hide();
            //充值金额
            mobile.showData();
            break;
        case "cz2":
            $("#value_sel").hide();
            $("#value_sel_ll").show();

            //充值流量
            liuliang.showData();
            break;
    }
}

function gotourlaa(id) {
    if (id == "qgg") {
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

//资金充值
var mobile = {
    showData: function () {
        //组织提交参数
        $.ajax({
            type: "POST", //用POST方式传输
            dataType: "text",//"json", //数据格式:JSON
            url: '/Ajax/MobileCZAPI.aspx', //目标地址
            data: "t=" + Math.random() +
                 "&action=getcplist" +
                 "&cztype=00001" +
                 "&clientType=" + $("#hidclienttype").val()+
                 "&mobileno=" + $("#mobileNumInput").val() +
                 "&allChzAmount=" + $("#hidallChzAmount").val() +
                 "&page=" + _PageNo +
                 "&pagesize=" + _PageSize +
                 "&ordercol=" + _OrderCol +
                 "&ordertype=" + _OrderType,

            beforeSend: function () {}, //发送数据之前
            complete: function () {}, //接收数据完毕
            success: function (data) {

                $("#hidselProductID").val("");
                $("#hidselorderno").val("");
                $("#hidczmoney").val("");
                $("#mb_area").html("");
                $("#mb_price").html("");
                $("#hidmemo").val("");
                $("#Discount_p").html("");

                if (data == "") {
                    //ShowMesaage("未发现任何商品");
                    $("#value_sel").html("没有支持此手机号的产品");

                    if (_selPriceOrLiuliang == "") {
                        $(".charge-info").hide();
                        $("#mb_submit").hide();
                        $("#mb_submit").hide();
                    }

                }
                else {
                    //充值流量【单个返回参数：折扣率|销售价格|运营商|省份名字|面额|产品销售状态(0产品不存在,1正常销售,2暂停销售) |订单编号（发起充值时的订单编号）^折扣率|销售价格|运营商|省份名字|面额|产品销售状态(0产品不存在,1正常销售,2暂停销售) |提交订单号】
                    var trs = "";
                    //var productData = data.ResultTable;
                    var productData = data.split('^');
                    allProduct = [];
                    tbody = "";
                    var classstr = "";
                    var sel = "";


                    $.each(productData, function (i, n) {
                        $(".charge-info").show();
                        $("#mb_submit").show();

                        allProduct.push(n);
                        var ttmp = n.split('|');
                        trs = "";
                        if (ttmp[5] == "1") {
                            if (sel == "") {
                                classstr = "class=\"cur\"";
                                sel = "1";
                                $("#hidselProductID").val(ttmp[7]);
                                $("#hidselorderno").val(ttmp[6]);
                                $("#hidczmoney").val(ttmp[4]);
                                $("#mb_area").html(ttmp[8]);

                                $("#hidmemo").val(ttmp[8]);

                                $("#mb_price").html(parseFloat(ttmp[1]).toFixed(2));
                                var tttt = parseFloat(ttmp[0] / 10).toFixed(6);
                                if (parseFloat(tttt)<10) {
                                        $("#Discount_p").html(tttt.substr(0, 4) + "折，1-10分钟到账");
                                }
                                else {
                                    if (tttt.substr(0, 5) == "10.00") {
                                        $("#Discount_p").html("1-10分钟到账");
                                    }
                                    else {
                                        $("#Discount_p").html(tttt.substr(0, 5) + "折，1-10分钟到账");
                                    }
                                }

                            }
                            else {
                                classstr = "";
                            }
                            //可销售
                            trs += "<li><input id=\"price_" + ttmp[6] + "\" type=\"button\" data=\"" + ttmp[1] + "\" value=\"" + ttmp[4] + "元\" onclick=\"ShowProduct('price_" + ttmp[6] + "','1')\" " + classstr + " /></li>";
                        }
                        else {
                            //产品不存在或暂停销售 
                            trs += "<li style=\"\"><input id=\"price_" + ttmp[6] + "\" type=\"button\" data=\"" + ttmp[1] + "\" value=\"" + ttmp[4] + "元\" disabled=\"disabled\"></li>";
                        }
                        tbody += trs;
                    });

                    $("#value_sel").html(tbody);
                }
            }
        });
    },
};

//获得流量产品
function GetallChzAmountbymobile(mobile) {
    var tt = "";
    var mobile=mobile.substr(0,3);
    switch (mobile) {
        case "134":
        case "135":
        case "136":
        case "137":
        case "138":
        case "139":
        case "150":
        case "151":
        case "152":
        case "157":
        case "158":
        case "159":
        case "188":
            tt = $("#hidallChzAmountLiuliang_yd").val();
            break;
        case "130":
        case "131":
        case "132":
        case "155":
        case "156":
        case "186":
            tt = $("#hidallChzAmountLiuliang_lt").val();
            break;
        case "133":
        case "153":
        case "177":
        case "189":
            tt = $("#hidallChzAmountLiuliang_dx").val();
            break;
    }
    $("#hidallChzAmountLiuliang").val(tt);

}

//流量充值
var liuliang = {
    showData: function () {
        GetallChzAmountbymobile($("#mobileNumInput").val());

        if ($("#hidallChzAmountLiuliang").val() == "") {
            $("#value_sel_ll").html("没有支持此手机号的产品");
            if (_selPriceOrLiuliang == "ll") {
                $(".charge-info").hide();
                $("#mb_submit").hide();
            }
        }
        else {
            //组织提交参数
            $.ajax({
                type: "POST", //用POST方式传输
                dataType: "text",//"json", //数据格式:JSON
                url: '/Ajax/MobileCZAPI.aspx', //目标地址
                data: "t=" + Math.random() +
                     "&action=getcplist" +
                     "&cztype=00002" +
                     "&clientType=" + $("#hidclienttype").val() +
                     "&allChzAmount=" + $("#hidallChzAmountLiuliang").val() +
                     "&mobileno=" + $("#mobileNumInput").val() +
                     "&page=" + _PageNo +
                     "&pagesize=" + _PageSize +
                     "&ordercol=" + _OrderCol +
                     "&ordertype=" + _OrderType,

                beforeSend: function () { }, //发送数据之前
                complete: function () { }, //接收数据完毕
                success: function (json) {


                    $("#hidselProductID").val("");
                    $("#hidselorderno").val("");
                    $("#hidczmoney").val("");
                    $("#mb_area").html("");
                    $("#mb_price").html("");
                    $("#hidmemo").val("");
                    $("#Discount_p").html("");


                    $(".charge-info").show();
                    $("#mb_submit").show();


                    //                   0        1    2       3     4      5                                           6           7        8   ^
                    //单个返回参数：折扣率|销售价格|运营商|省份名字|面额|产品销售状态(0产品不存在,1正常销售,2暂停销售)|充值订单号|产品ID|产品名称^折扣率|销售价格|运营商|省份名字|面额|产品销售状态(0产品不存在,1正常销售,2暂停销售)|充值订单号|产品ID|产品名称
                    var trs = "";
                    //var productData = data.ResultTable;
                    var productData = json.split('^');
                    allProduct_ll = [];
                    tbody = "";
                    var classstr = "";
                    var sel = "";

                    $.each(productData, function (i, n) {
                        allProduct_ll.push(n);
                        var ttmp = n.split('|');
                        trs = "";
                        if (ttmp[5] == "1") {
                            if (sel == "") {
                                classstr = "class=\"cur\"";
                                sel = "1";
                                $("#hidselProductID").val(ttmp[7]);
                                $("#hidselorderno").val(ttmp[6]);
                                $("#hidczmoney").val(ttmp[4].split('元')[0]);

                                $("#mb_area").html(ttmp[8]);
                                $("#hidmemo").val(ttmp[8]);


                                $("#mb_price").html(parseFloat(ttmp[1]).toFixed(2));
                                var tttt = parseFloat(ttmp[0] / 10).toFixed(6);
                                if (parseFloat(tttt)<10) {
                                    $("#Discount_p").html(tttt.substr(0, 4) + "折，1-10分钟到账");
                                }
                                else {
                                    if (tttt.substr(0, 5) == "10.00") {
                                        $("#Discount_p").html("1-10分钟到账");
                                    }
                                    else {
                                        $("#Discount_p").html(tttt.substr(0, 5) + "折，1-10分钟到账");
                                    }
                                }

                            }
                            else {
                                classstr = "";
                            }
                            //可销售
                            trs += "<li><input id=\"price_" + ttmp[6] + "\" type=\"button\" data=\"" + ttmp[1] + "\" value=\"" + ttmp[4] + "\" onclick=\"ShowProduct('price_" + ttmp[6] + "','2')\" " + classstr + " /></li>";
                        }
                        else {
                            //产品不存在或暂停销售 
                            trs += "<li style=\"\"><input id=\"price_" + ttmp[6] + "\" type=\"button\" data=\"" + ttmp[1] + "\" value=\"" + ttmp[4] + "\" disabled=\"disabled\"></li>";
                        }
                        tbody += trs;
                    });

                    $("#value_sel_ll").html(tbody);
                }
            });
        }
    },
};

function ShowProduct(id,type) {
    //全部li内容不选中
    if (type == "1") {
        $("#value_sel input").each(function (index) {
            $(this).attr("class", "");
        })
    }
    if (type == "2") {
        $("#value_sel_ll input").each(function (index) {
            $(this).attr("class", "");
        })
    }
    $("#" + id).attr("class", "cur");

    //var productid = id.split('_')[1];
    var orderid = id.split('_')[1];
    //$("#hidselProductID").val(productid);
    $("#hidselorderno").val(orderid);

    if (type == "1") {
        for (var i = 0; i < allProduct.length; i++) {
            //                   0        1    2       3     4      5                                           6           7        8
            //单个返回参数：折扣率|销售价格|运营商|省份名字|面额|产品销售状态(0产品不存在,1正常销售,2暂停销售)|充值订单号|产品ID|产品名称
            var group = allProduct[i].split('|');
            if (group[6] == orderid) {
                $("#mb_area").html(group[8]);
                $("#hidmemo").val(group[8]);
                $("#mb_price").html(group[1]);
                $("#hidczmoney").val(group[4]);
                var tttt = parseFloat(group[0] / 10).toFixed(6);
                if (parseFloat(tttt) < 10) {
                    $("#Discount_p").html(tttt.substr(0, 4) + "折，1-10分钟到账");
                }
                else {
                    if (tttt.substr(0, 5) == "10.00") {
                        $("#Discount_p").html("1-10分钟到账");
                    }
                    else {
                        $("#Discount_p").html(tttt.substr(0, 5) + "折，1-10分钟到账");
                    }
                }
                $("#hidselorderno").val(group[6]);
                $("#hidselProductID").val(group[7]);
                break;
            }
        }
    }
    else {
        for (var i = 0; i < allProduct_ll.length; i++) {
            //                   0        1    2       3     4      5                                           6           7        8
            //单个返回参数：折扣率|销售价格|运营商|省份名字|面额|产品销售状态(0产品不存在,1正常销售,2暂停销售)|充值订单号|产品ID|产品名称
            var group = allProduct_ll[i].split('|');
            if (group[6] == orderid) {
                $("#mb_area").html(group[8]);
                $("#hidmemo").val(group[8]);
                $("#mb_price").html(group[1]);
                $("#hidczmoney").val(group[4].split('元')[0]);
                var tttt = parseFloat(group[0] / 10).toFixed(6);
                if (parseFloat(tttt)<10) {
                    $("#Discount_p").html(tttt.substr(0, 4) + "折，1-10分钟到账");
                }
                else {
                    if (tttt.substr(0, 5) == "10.00") {
                        $("#Discount_p").html("1-10分钟到账");
                    }
                    else {
                        $("#Discount_p").html(tttt.substr(0, 5) + "折，1-10分钟到账");
                    }
                }
                $("#hidselorderno").val(group[6]);
                $("#hidselProductID").val(group[7]);
                break;
            }
        }
    }
}


function callpay(jsapiparam, orderno, orderamount) {
    //alert(orderamount);

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

