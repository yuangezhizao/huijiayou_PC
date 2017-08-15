var orderid = "";
var pagetype = "";
//获取订单信息
var OrderInfo = {
    api_target: "com_cmall_familyhas_api_ApiOrderDetails",
    api_input: { "order_code": "" },
    LoadData: function () {
        this.api_input.order_code = orderid;
        var s_api_input = JSON.stringify(this.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": this.api_target, "api_token": "1" };
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
                if (msg.resultcode != g_const_Success_Code_IN)
                {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }
            if (msg.resultCode) {
                if (msg.resultCode == g_const_Success_Code) {
                    switch (pagetype) {
                        case "succ":
                            OrderSuccess.LoadOrderInfo(msg);
                            break;
                        case "fail":
                            OrderFail.LoadOrderInfo(msg);
                            break;
                    }
                }
                else {
                    ShowMesaage(msg.resultMessage);
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["100028"]);
        });
    }
};

//验证支付宝返回信息
var Alipay = {
    Check: function () {
        var s_api_input = JSON.stringify(this.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": this.api_target };
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: "get",
            data: "t=" + Math.random() + "&action=alipaycheck&" + location.search.substr(1),
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode == g_const_Success_Code_IN) {
                OrderInfo.LoadData();
            }
            else {
                ShowMesaage(msg.resultmessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    }
};