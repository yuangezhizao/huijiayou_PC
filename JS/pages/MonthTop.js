var _pageNo = "1";
var _pageSize = "10";

var _stop = true;
$(window).scroll(function () {
    totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());
    if ($(document).height() <= totalheight) {
        if (_stop == true) {
            _stop = false;
            if (parseInt(_pageNo) >= 5) {
                $("#waitdiv").html("<span>没有更多数据了</span>");
                $("#waitdiv").show();
                setTimeout("$(\"#waitdiv\").hide();", 3000);

                //ShowMesaage(g_const_API_Message["100026"]);
                return;
            }

            if ($("#waitdiv").attr("style") == "" || $("#waitdiv").attr("style").indexOf("none")>0) {
                //_pageSize = (parseInt(_pageSize) + 10).toString();
                _pageNo = (parseInt(_pageNo) + 1).toString();
                $("#waitdiv").html("<img src=\"/img/loading.jpg\"><span>努力加载中~</span>");
                $("#waitdiv").show();
                Month_Top.Search();
            }
            _stop = true;
        }
    }
    else {
        if ((parseFloat($(window).scrollTop()) / parseFloat($(window).height())) >= 3) {
            //显示“至顶部”
            $('#totop').show();
        }
        else {
            $('#totop').hide();
        }

        if (parseInt(_pageNo) >= 5) {
            $("#waitdiv").html("<span>没有更多数据了</span>");
            $("#waitdiv").show();
            setTimeout("$(\"#waitdiv\").hide();", 3000);
        }
    }


});

$(document).ready(function () {
    $("#waitdiv").html("<img src=\"/img/loading.jpg\"><span>努力加载中~</span>");
    $("#waitdiv").show();
    Month_Top.Search();
    $("#btnBack").click(function () {
        //window.location.href = PageUrlConfig.BackTo();
        window.location.replace(PageUrlConfig.BackTo());
    });
});

//加载列表
var Month_Top = {
    api_target: "com_cmall_productcenter_service_api_ApiSearchResults",
    api_input: { "categoryOrBrand": "", "screenWidth": "", "pageNo": "", "pageSize": "", "sortType": "", "baseValue": "", "keyWord": "", },
    Search: function () {
        Month_Top.api_input.categoryOrBrand = "top50";
        Month_Top.api_input.screenWidth = "1";
        Month_Top.api_input.pageNo = _pageNo;
        Month_Top.api_input.pageSize = _pageSize;
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
            //$("#pageloading").css("display", "none");
            //$("#mask").css("display", "none");
            if (msg.resultCode == g_const_Success_Code) {
                Month_Top.Load_Result(msg.item);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            //$("#pageloading").css("display", "none");
            //$("#mask").css("display", "none");
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_Result: function (resultlist) {
        var html = "";
        var s_tpl_result = $("#tpl_result")[0].innerHTML;
        for (var i = 0; i < resultlist.length; i++) {
            var result = resultlist[i];
            var data = {
                "numclass": function () {
                    if (i < 3 && parseInt(_pageNo)==1)
                        return "num" + ((10 * (parseInt(_pageNo) - 1)) + (i + 1)).toString();
                    else
                        return "&nbsp;";
                }(),
                "productCode": result.productCode,
                "numorder": ((10 * (parseInt(_pageNo) - 1)) + (i + 1)).toString(),
                "stockNum": function () {
                    if (result.stockNum == "售罄")
                        return "<span>&nbsp;</span>";
                    else
                        return "&nbsp;";
                }(),
                "imgUrl": function () {
                    if (result.imgUrl.length > 0)
                        return result.imgUrl;
                    else
                        return g_goods_Pic;
                }(),
                "productName": result.productName,
                "otherShow": function () {
                    if (result.activityList.length > 0 || result.otherShow.length) {
                        var otherShowStr = "";
                        for (var j = 0; j < result.activityList.length; j++) {
                            otherShowStr += "<span>" + result.activityList[j] + "</span>";
                        }
                        for (var j = 0; j < result.otherShow.length; j++) {
                            otherShowStr += "<span>" + result.otherShow[j] + "</span>";
                        }
                        return otherShowStr
                    }
                    else
                        return "&nbsp;";
                }(),
                "currentPrice": result.currentPrice.toString(),
                "originalPrice": result.originalPrice.toString(),
                "productNumber": result.productNumber.toString()
            };
            html += renderTemplate(s_tpl_result, data)
        }
        if (parseInt(_pageNo) == 1) {
            $("#divResult").html(html);
        }
        else {
            $("#divResult").append(html);
        }

        if (parseInt(_pageNo) >= 5) {
            setTimeout("$(\"#waitdiv\").hide();", 3000);
        }
        else {
            $("#waitdiv").hide();
        }

    },
    Load_Product: function (pid) {
        $("#waitdiv").hide();
        PageUrlConfig.SetUrl();
        //location = g_const_PageURL.Product_Detail + "?pid=" + pid + "&t=" + Math.random();
        window.location.href = g_const_PageURL.Product_Detail + "?pid=" + pid + "&t=" + Math.random();

    }
};
function OpenProduct(pid) {
    Month_Top.Load_Product(pid);
}