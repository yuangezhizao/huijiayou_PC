var EventProductPrice = {
    api_target: "com_cmall_eventcall_api_APiEventProductPriceInfo",
    api_input: { "itemCode": "", "version": 1.0 },
    GetPrice: function (callback) {
        var s_api_input = JSON.stringify(EventProductPrice.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": EventProductPrice.api_target };
        var purl = g_Temp_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultCode == g_const_Success_Code) {
                if (typeof (callback) == "function") {
                    callback(msg);
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
};