
$(document).ready(function () {
    $("#btn_CouponCodeExchange").click(function () {
        CouponCodeExchange.GetList();
    });

    //$("#txtFeed").keyup(function () {
    //    if (this.value.length >= 200) {
    //        $("#textlen").val("200");
    //        //ShowMesaage("");
    //        event.returnValue = false;
    //    }
    //    else {
    //        $("#textlen").html(this.value.length + 1);
    //        event.returnValue = true;
    //    }
    //});

    //返回
    $(".go-back").on("click", function () {
        //alert("后退");
        //history.back();
        window.location.replace(g_const_PageURL.MyCoupon + "?t=" + Math.random());

    });

});

//优惠码兑换
var CouponCodeExchange = {
    api_target: "com_cmall_familyhas_api_ApiForCouponCodeExchange",
    api_input: { "version": 1, "couponCode": "" },
    GetList: function () {
        //赋值
        CouponCodeExchange.api_input.couponCode = Base64.base64encode(Base64.utf16to8($("#couponCode").val()));

        if (CouponCodeExchange.api_input.couponCode=="") {
            ShowMesaage(g_const_API_Message["100013"]);
            return false;
        }

        //组织提交参数
        var s_api_input = JSON.stringify(this.api_input);
        //提交接口[api_token不为空，公用方法会从sission中获取]
        var obj_data = { "api_input": s_api_input, "api_target": CouponCodeExchange.api_target, "api_token": g_const_api_token.Wanted };
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
                    Message.ShowToPage("", g_const_PageURL.Login, 2000,""); 
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }

            if (msg.resultCode == g_const_Success_Code) {
                CouponCodeExchange.Load_Result();
            }
            else {
                ShowMesaage(msg.resultMessage);
                $("#couponCode").val("");

            }
        });
        //接口异常
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    //接口返回成功后的处理
    Load_Result: function () {
        Message.ShowToPage(g_const_API_Message["100017"], g_const_PageURL.MyCoupon, 2000, "");
        return;
    },
    //接口返回失败后的处理
    Load_ResultErr: function (resultlist) {
    },
};