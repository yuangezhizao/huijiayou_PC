
$(document).ready(function () {
    $("#syshuoming").click(function () {
        PageUrlConfig.SetUrl(location.href);
        location.href =g_const_PageURL.shiyongshuoming + "?t=" + Math.random();
    });
});


var CouponCodes = {
    /*可用优惠劵使用查询*/
    api_target: "com_cmall_familyhas_api_ApiGetAvailableCoupon",
    /*输入参数*/
    api_input: { "shouldPay": 0, "goods": [], "skuCodeEntitylist": [], "version": 1.0, "channelId": "" },
    /*接口响应对象*/
    api_response: {},
    /*获取可用优惠劵*/
    GetCouponCodes: function () {
        Message.ShowLoading("优惠券拼命加载中", "divAlert");
        var sgoods = localStorage[g_const_localStorage.OrderConfirm];
        if (typeof (sgoods) != "undefined") {
            CouponCodes.api_input.goods = JSON.parse(sgoods).GoodsInfoForAdd;
        }
        CouponCodes.api_input.channelId = g_const_ChannelID;
        var s_api_input = JSON.stringify(CouponCodes.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": CouponCodes.api_target, "api_token": g_const_api_token.Wanted };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            Message.Operate('', "divAlert");
            CouponCodes.api_response = msg;
            if (msg.resultCode == g_const_Success_Code) {
                if (msg.couponCount == 0 && msg.disableCouponCount == 0) {
                    ShowMesaage(g_const_API_Message["100014"]);
                    return;
                }                
                var html = "";
                var s_tpl_couponcodes = $("#tpl_couponcodes")[0].innerHTML;               
                var data = {
                    "CanUseList": CouponCodes.Render(msg.couponList, "1"),
                    "CanNotUseList": CouponCodes.RenderUN(msg.disableCouponList, "0")
                };
                html = renderTemplate(s_tpl_couponcodes, data);
                $("body").append(html);

                if (msg.couponCount == 0) {
                    $(".btn-buy").css("display", "none");
                    $("#div_coupon_used").hide();
                }
                if (msg.disableCouponCount == 0) {
                    $("#div_coupon_usedun").hide();
                }
                $(".sela").on("click", function (e) {
                    var objthis = e.target;
                    
                    if ($(objthis).attr("class")=="sela on") {
                        $(objthis).attr("class", "sela");
                    }
                    else {
                        $(".sela").attr("class", "sela");
                        $(objthis).attr("class", "sela on");
                    }
                });

                $(".btn-buy").on("click", function (e) {
                    var objselect = $(".sela.on");
                    //if (objselect.length == 0) {
                    //    ShowMesaage(g_const_API_Message["100015"]);
                    //    return;
                    //}
                    var objselectcoupon = {
                        "coupon_codes": [""]
                    };
                    if (objselect.length>0) {
                        objselectcoupon = {
                            "coupon_codes": [objselect.attr("datacode")]
                        };
                    }

                    localStorage[g_const_localStorage.CouponCodes] = JSON.stringify(objselectcoupon);
                    //window.location = "OrderConfirm.html";
                    //window.location.replace(g_const_PageURL.OrderConfirm + "?t=" + Math.random());
                    window.location.replace(PageUrlConfig.BackTo());
                });
            }
            else {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    //ShowMesaage(g_const_API_Message["100001"]);
                    setTimeout("window.location.replace(\"" + g_const_PageURL.Login + "?t=" + Math.random() + "\")", 2000);
                    return;
                }
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            Message.Operate('', "divAlert");
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    /*渲染模板*/
    Render: function (couponcodes,ctype) {
        var html = "";
        var s_tpl_couponcode = $("#tpl_couponcode")[0].innerHTML;
        for (var i = 0; i < couponcodes.length; i++) {
            var couponcode = couponcodes[i];
            var aclass = "sela";
            if (localStorage[g_const_localStorage.CouponCodes]) {
                if (localStorage[g_const_localStorage.CouponCodes].indexOf(couponcode.couponCode) > -1) {
                    aclass = "sela on";
                }
            }
            var data = {
                "surplusMoney": couponcode.surplusMoney,
                "useLimit": couponcode.useLimit,
                "limitMoney": function () {
                    if (couponcode.limitMoney == 0) {
                        return "不限";
                    }
                    else {
                        return "满" + couponcode.limitMoney + "元可用";
                    }
                }(),
                "ExpireTime": CouponCodes.FormatDateTime(couponcode.startTime) + "-" + CouponCodes.FormatDateTime(couponcode.endTime),
                "couponCode": couponcode.couponCode,
                //"aclass": ctype == "1" ? "sela" : "",
                "aclass": aclass
            };
            html += renderTemplate(s_tpl_couponcode, data)
        }
        if (html == "")
            html = "&nbsp;";
        return html;
    },
    RenderUN: function (couponcodes, ctype) {
        var html = "";
        var s_tpl_couponcode = $("#tpl_couponcode_un")[0].innerHTML;
        for (var i = 0; i < couponcodes.length; i++) {
            var couponcode = couponcodes[i];
            var data = {
                "surplusMoney": couponcode.surplusMoney,
                "useLimit" : couponcode.useLimit,
                "limitMoney": function () {
                    if (couponcode.limitMoney == 0) {
                        return "不限";
                    }
                    else {
                        return "满" + couponcode.limitMoney + "元可用";
                    }
                    }(),
                "ExpireTime": CouponCodes.FormatDateTime(couponcode.startTime) + "-" +CouponCodes.FormatDateTime(couponcode.endTime),
                //"couponCode": couponcode.couponCode,
                //    "aclass" : ctype =="1"?"sela": ""
                    };
                html += renderTemplate(s_tpl_couponcode, data)
                }
                if (html == "")
            html = "&nbsp;";
        return html;
        },
    /*格式化时间*/
    FormatDateTime: function (stime) {
        var s = "";
        var arrtime = stime.split(" ");
        if(arrtime.length==2){
            s = arrtime[0].replace("-", ".");
            s = s.replace("-", ".");
        }
        return s;
    },
    /*添加优惠券*/
    AddCoupon: function () {
        var objinput = $(".coupon.coupon2 input[type='text']");
        if (objinput.val() == "") {
            ShowMesaage(g_const_API_Message["100016"]);
            return;
        }
        var api_target = "com_cmall_familyhas_api_ApiForCouponCodeExchange";
        var api_input = { "couponCode": Base64.base64encode(Base64.utf16to8(objinput.val())) ,"version":1.0 };
        var s_api_input = JSON.stringify(api_input);
        var obj_data = { "api_input": s_api_input, "api_target": api_target, "api_token": g_const_api_token.Wanted };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {           
            CouponCodes.api_response = msg;
            if (msg.resultCode == g_const_Success_Code) {
                ShowMesaage(g_const_API_Message["100017"]);
                setTimeout('window.location.reload();', 2000);
            }
            else {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    //ShowMesaage(g_const_API_Message["100001"]);
                    setTimeout("window.location.replace(\"" + g_const_PageURL.Login + "?t=" + Math.random() + "\")", 2000);
                    return;
                }
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {            
            ShowMesaage(g_const_API_Message["7001"]);
        });
    }
}