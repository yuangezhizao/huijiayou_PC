$(document).ready(function () {
    Month_Top.loadData();
    $("#btnBack").click(function () {
        //location = g_const_PageURL.Index;
        window.location.replace(PageUrlConfig.BackTo());
    });
    var pid = GetQueryString("pid");
    if (pid.indexOf("IC") != -1) {
        $("#sMessage").empty();
        $("#sMessage").append("抱歉您来晚一步，活动已结束，<br />来看看最新优惠商品吧~");
    }

});

var Month_Top = {
    api_target: "com_cmall_productcenter_service_api_ApiSearchResults",
    api_input: { "categoryOrBrand": "", "screenWidth": "", "pageNo": "", "pageSize": "", "sortType": "", "baseValue": "", "keyWord": "", },
    loadData: function () {
        Month_Top.api_input.categoryOrBrand = "top50";
        Month_Top.api_input.screenWidth = "1";
        Month_Top.api_input.pageNo = "1";
        Month_Top.api_input.pageSize = "10";
        Month_Top.api_input.sortType = "1";
        Month_Top.api_input.baseValue = "base64";
        Month_Top.api_input.keyWord = "dG9wNTA=";
        var s_api_input = JSON.stringify(this.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": this.api_target };
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
                Month_Top.Load_Result(msg.item);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_Result: function (resultlist) {
        var body = "";
        var classstr = "";
        var sellover = "";
        $.each(resultlist, function (i, n) {

            if (i % 2 == 0) {
                classstr = "fl";
            }
            else {
                classstr = "fr";
            }
            if (n.storeFlag == "0")
                sellover = "<span>&nbsp;</span>";
            else
                sellover = "";
            body += "<div class=\"lid " + classstr + "\" onclick=\"Month_Top.Load_Product(" + n.productCode + ")\">";
            body += "<div class=\"imgd\">" + sellover + "<img src=\"" + g_GetPictrue(n.imgUrl) + "\" alt=\"\" /></div>";
            body += "<div class=\"txtd\">";
            body += "<h3>" + n.productName + "</h3>";
            body += "<div class=\"price\"><b>¥</b>" + n.currentPrice + "<span>¥" + n.originalPrice + "</span></div>";
            body += "<div class=\"d_yx\">月销" + n.productNumber + "件</div>";
            body += "</div>";
            body += "</div>";



        });
        $("#MonthTopProduct").html(body);
    },
    Load_Product: function (pid) {
        window.location.replace(g_const_PageURL.Product_Detail + "?pid=" + pid + "&t=" + Math.random());
    }
};