
$(document).ready(function () {

    //返回
    $("#go-back").click(function () {
        window.location.replace(g_const_PageURL.MobileCZList);
    });

    //返回首页
    $("#goIndex").click(function () {
        var cType = GetClientType();

        if (cType == ClientType.JYH_Android) {
            //关闭
            UseAppFangFa.CaoZuo('close');
        }
        else if (cType == ClientType.JYH_iOS) {
            //关闭
            UseAppFangFa.CaoZuo('close');
        }
        else {
            window.location.replace(g_const_PageURL.Index + "?t=" + Math.random());
        }
    });
    //订单详情
    $("#goDetail").click(function () {
        window.location.replace(g_const_PageURL.MobileCZList);
    });

    tj_SearchResult.GetList();
});

var OrderFail = {
    GoIndex: function () {
        window.location.replace(g_const_PageURL.Index + "?t=" + Math.random());
    },
    GoDetail: function (order_code) {
        window.location.replace(g_const_PageURL.MyOrder_List + "?paytype=ALL&t=" + Math.random());

    },
};


//推荐商品
var tj_SearchResult = {
    api_target: "com_cmall_productcenter_service_api_ApiSearchResults",
    api_input: { "categoryOrBrand": "", "screenWidth": "", "pageNo": "", "pageSize": "", "sortType": "", "baseValue": "", "keyWord": "", "channelId": g_const_ChannelID },
    GetList: function () {
        tj_SearchResult.api_input.categoryOrBrand = "";
        tj_SearchResult.api_input.screenWidth = "1";
        tj_SearchResult.api_input.pageNo = "1";
        tj_SearchResult.api_input.pageSize = "10";
        tj_SearchResult.api_input.sortType = "1";
        tj_SearchResult.api_input.baseValue = "";
        tj_SearchResult.api_input.keyWord = "推荐";
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
                //if (msg.number == "1") {
                //    tj_SearchResult.Load_Result(msg.item);
                //}
                //else {
                tj_SearchResult.Load_Recom(msg.item);
                //}
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_Recom: function (resultlist) {
        var bodyList = "";
        var bodyPic = "";
        $.each(resultlist, function (i, n) {
            var cla = "fl";
            if (i % 2 == 1) {
                cla = "fr";
            }

            bodyList += "<div class=\"lid " + cla + "\" onclick=\"tj_SearchResult.Load_Product('" + n.productCode + "')\" num=\"202064-div-1\">"
                + "<div class=\"imgd\">"
                    + "<img src=\"" + n.imgUrl + "\" alt=\"\"></div>"
                + "<div class=\"txtd\">"
                        + "<h3>" + n.productName + "</h3>"
                        + "<div class=\"price\"><b>¥</b>" + n.currentPrice + "<span>¥" + n.originalPrice + "</span></div>"
                    + "</div></div>";
        });
        $("#MonthTopProduct").html(bodyList);
    },
    Load_Product: function (pid) {
        PageUrlConfig.SetUrl();
        window.location.href = g_const_PageURL.Product_Detail + "?pid=" + pid + "&t=" + Math.random();
    }
};

