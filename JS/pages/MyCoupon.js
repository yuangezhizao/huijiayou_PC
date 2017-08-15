
var MyCoupon = {
    MenuName: "我的优惠券",
    Pagination: 0,
    Init: function () {
        AccountMenu.ShowMenu("div.home ul.fl", "#tpl_menu", MyCoupon.MenuName);

        MyCoupon.api_input.couponLocation = 0;
        MyCoupon.api_input.pageNum = 1;
        MyCoupon.GetCouponCodes();
        $("#spanCode").hide();
    },
    PageSet: function (type) {
        if (MyCoupon.api_input.pageNum == 1 && type == -1) {
            return;
        }
        if (MyCoupon.api_input.pageNum == MyCoupon.Pagination && type == 1) {
            return;
        }
        MyCoupon.api_input.pageNum += type;
        MyCoupon.GetCouponCodes();
    },
    SetCouponLocation: function (CouponLocation) {
        $("#divChange").hide();
        $("#divCoupon").hide();
        $("#divHistory").hide();
        $("#spanCode").hide();
        $("#txtExchangeCode").val("");
        if (CouponLocation == 2) {
            $("#divChange").show();
        }
        else {
            MyCoupon.api_input.couponLocation = CouponLocation;
            MyCoupon.api_input.pageNum = 1;
            MyCoupon.GetCouponCodes();
            if (CouponLocation == 0) {
                $("#divCoupon").show();
            }
            else {
                $("#divHistory").show();
            }
        }
        $("#nav").find("li").each(function (i) {
            if (i == CouponLocation) {
                $(this).attr("class", "curr");
            }
            else {
                $(this).attr("class", "");
            }
        });
    },
    /*可用优惠劵使用查询*/
    api_target: "com_cmall_familyhas_api_ApiGetAllCoupon",
    /*输入参数*/
    api_input: { "couponLocation": 0, "pageNum": 1, "channelId": "" },
    /*接口响应对象*/
    api_response: {},
    /*获取优惠劵*/
    GetCouponCodes: function () {
        //赋值
        MyCoupon.api_input.channelId = g_const_ChannelID;
        var s_api_input = JSON.stringify(MyCoupon.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": MyCoupon.api_target, "api_token": g_const_api_token.Wanted };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    //Session失效，重新登录，传递回调地址
                    Message.ShowToPage("", g_const_PageURL.MainIndex + "?u=" + g_const_PageURL.GetKey(g_const_PageURL.Login), 500, "");
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }

            if (msg.resultCode == g_const_Success_Code) {

                MyCoupon.Pagination = msg.pagination;
                if (msg.pagination == 0) {
                    if (MyCoupon.api_input.couponLocation == g_const_couponLocation.NoUse) {
                        //无未使用优惠卷
                        var showStr = '<p class="couponwu"><img src="/img/wu_bg.png" alt="">暂无可用优惠券</p>';
                        $("#divCoupon").html(showStr);
                    }
                    else {
                        //无历史优惠卷
                        var showStr = '<p class="couponwu"><img src="/img/wu_bg.png" alt="">暂无历史优惠券</p>';
                        $("#divHistory").html(showStr);
                    }
                }
                else {
                    var showStr = MyCoupon.Load_Result(msg);
                    if (MyCoupon.api_input.couponLocation == g_const_couponLocation.NoUse) {
                        //     $("#hid_sumpage_weishiyong").val(msg.pagination);
                        //未使用区域
                        $("#ulCoupon").html(showStr);
                    }
                    else {
                        //  $("#hid_sumpage_lishi").val(msg.pagination);
                        //历史区域
                        $("#ulCouponHistory").html(showStr);
                    }
                }
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    //接口返回成功后的处理
    Load_Result: function (resultlist) {
        var wlxx = "";
        var kk = 0;
        var li_css = "";
        $.each(resultlist.couponInfoList, function (i, n) {

            wlxx += "<li>";
            wlxx += "<a>";
            wlxx += "<p class=\"left\">";
            wlxx += "<b><i>¥</i>" + n.initialMoney + "</b>";
            if (parseInt(n.limitMoney) == 0) {
                wlxx += "<span>不限</span>";
            }
            else {
                wlxx += "<span>满" + n.limitMoney.toFixed(0) + "元可用</span>";
            }
            if (n.channelLimit == "1") {
                wlxx += "<strong>网站专享</strong>";
            }
            wlxx += "</p>";
            wlxx += "<p class=\"right\">";
            if (n.useLimit.length > 0) {
                wlxx += "<b>" + n.useLimit + "</b>";
            }
            wlxx += "<span>使用期限：<i>" + getFormatDate(n.startTime, "yyyy.MM.dd") + "-" + getFormatDate(n.endTime, "yyyy.MM.dd") + "</i></span>";
            
            wlxx += "</p>";
            if (n.status == g_Coupon_Status.Used) {
                //已使用
                wlxx += "<em>已使用</em>";
            }
            if (n.status == g_Coupon_Status.CanUse) {
                if (n.limitExplain.length > 0) {
                    wlxx += "<font>";
                    wlxx += "<i>" + n.limitExplain.replace("\n", "<br>") + "</i>";
                    wlxx += "</font>";
                }
            }
            if (n.status == g_Coupon_Status.Expired) {
                //过期
                wlxx += "<em class=\"e1\">已过期</em>";
            }

            wlxx += "</a>";
            wlxx += "</li>"

        });
        return wlxx
    },
    /*优惠卷展开*/
    ShowCouponDIV: function (id) {
        if ($("#" + id).attr("class") == "coupon-caption") {
            //展开说明层
            $("#" + id).attr("class", "");
            $("#p_" + id).show();
        }
        else {
            //隐藏说明层
            $("#" + id).attr("class", "coupon-caption");
            $("#p_" + id).hide();
        }
    },

}
//优惠码兑换
var CouponCodeExchange = {
    api_target: "com_cmall_familyhas_api_ApiForCouponCodeExchange",
    api_input: { "version": 1, "couponCode": "" },
    GetList: function () {
        if ($("#txtExchangeCode").val().length <= 0) {
            $("#spanCode").html(g_const_API_Message["100013"]).show();
            return false;
        }
        CouponCodeExchange.api_input.couponCode = Base64.base64encode(Base64.utf16to8($("#txtExchangeCode").val()));
        var s_api_input = JSON.stringify(CouponCodeExchange.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": CouponCodeExchange.api_target, "api_token": g_const_api_token.Wanted };
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
                $("#spanCode").html(g_const_API_Message["100017"]).show();
                MyCoupon.SetCouponLocation(0);

            }
            else if (msg.resultCode == "939301311") {//已兑换过
                $("#spanCode").html(g_const_API_Message["100047"]).show();
            }
            else {
                $("#spanCode").html(msg.resultMessage).show();
            }
        });
        //接口异常
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
};
