$(document).ready(function () {
    $("#txtSearch").focus();
    Hotword.GetList();
    //$("#txtSearch").keyup(function () {
    //    if ($("#txtSearch").length > 0) {
    //        $("#divHotwordout").hide();
    //        $("#divAssociateout").show();
    //        Associate.GetList();
    //    }
    //    else {
    //        $("#divHotwordout").show();
    //        $("#divAssociateout").hide();
    //    }
        
    //});
    $("#txtSearch").on('input paste', function () {
        if ($("#txtSearch").length > 0) {
            $("#divHotwordout").hide();
            $("#divAssociateout").show();
            Associate.GetList();
        }
        else {
            $("#divHotwordout").show();
            $("#divAssociateout").hide();
        }
    });
    $("#btnSearch").click(function () {
        if ($("#txtSearch").val().Trim().length > 0) {
            PageUrlConfig.SetUrl();
            window.location.href=g_const_PageURL.Product_List + "?showtype=&keyword=" + encodeURI($("#txtSearch").val()) + "&t=" + Math.random();
        }
        else {
          //  location.reload();
        }
    });
    //后退
    $("#btnBack").click(function () {
        window.location.replace(PageUrlConfig.BackTo());
    });
});

//加载热词
var Hotword = {
    api_target: "com_cmall_productcenter_service_api_ApiSearchHotword",
    api_input: {"num":""},
    GetList: function () {
        Hotword.api_input.num = "10";
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
                Hotword.Load_Result(msg.hotwordList);
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
        $.each(resultlist, function (i, n) {
            body += "<a onclick=\"Hotword.SetSearch('" + n.hotWord + "')\" >" + n.hotWord + "</a> ";
        });
        $("#divHotword").html(body);
    },
    SetSearch: function (keyword) {
        $("#txtSearch").val(keyword);
        PageUrlConfig.SetUrl();
        window.location.href = g_const_PageURL.Product_List + "?showtype=&keyword=" + encodeURI($("#txtSearch").val()) + "&t=" + Math.random();
    },
};
//加载联想
var Associate = {
    api_target: "com_cmall_productcenter_service_api_ApiSearchAssociate",
    api_input: { "num": "", "baseValue": "", "keyword": "" },
    GetList: function () {
        if ($("#txtSearch").val().length == 0) {
            $("#divAssociate").empty();
            return;
        }
        Associate.api_input.num = "10";
        Associate.api_input.baseValue = "";
        Associate.api_input.keyword = $("#txtSearch").val();
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
                Associate.Load_Result(msg.searchList);
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
        $.each(resultlist, function (i, n) {
            body += "<p onclick=\"Associate.SetSearch('" + n.associateWord + "')\" >";
            for (var i = 0; i < n.associateWord.length; i++) {
                if (Associate.api_input.keyword.indexOf(n.associateWord.substr(i, 1))>-1) {
                    body += "<i>" + n.associateWord.substr(i, 1) + "</i>";
                }
                else {
                    body += n.associateWord.substr(i, 1);
                }
            }
            body += "</p >";
        });
        $("#divAssociate").html(body);
    },
    SetSearch: function (keyword) {
        $("#txtSearch").val(keyword);
    },
};
//搜索
var SearchResult = {
    api_target: "com_cmall_productcenter_service_api_ApiSearchResults",
    api_input: { "categoryOrBrand": "", "screenWidth": "", "pageNo": "", "pageSize": "", "sortType": "", "baseValue": "", "keyWord": "", },
    GetList: function () {
        if ($("#txtSearch").val().length == 0) {
            $("#divAssociate").empty();
            return;
        }
        SearchResult.api_input.categoryOrBrand = "";
        SearchResult.api_input.screenWidth = "1";
        SearchResult.api_input.pageNo = "1";
        SearchResult.api_input.pageSize = "10";
        SearchResult.api_input.sortType = "1";
        SearchResult.api_input.baseValue = "";
        SearchResult.api_input.keyWord = $("#txtSearch").val();
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
                if (msg.number == "1") {
                    SearchResult.Load_Result(msg.item);
                }
                else {
                    SearchResult.Load_Recom(msg.item);
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
    Load_Result: function (resultlist) {
        var bodyList = "";
        var bodyPic = "";
        $.each(resultlist, function (i, n) {
            bodyList += "<div onclick=\"SearchResult.Load_Product('" + n.productCode + "')\" >";
            bodyList += "<img src=\"" + n.imgUrl + "\" alt=\"\" />";
            bodyList += "商品名称：<span>" + n.productName + "</span >";
            bodyList += "商品价格：<span>" + n.currentPrice + "</span >";
            bodyList += "商品原价：<span>" + n.originalPrice + "</span >";
            bodyList += "商品销量：<span>" + n.productNumber + "</span >";
            bodyList += "</div ><br>";
        });
        $("#divResultList").html(bodyList);
    },
    Load_Recom: function (resultlist) {
        var bodyList = "";
        var bodyPic = "";
        $.each(resultlist, function (i, n) {
            bodyList += "<div onclick=\"SearchResult.Load_Product('" + n.productCode + "')\" >";
            bodyList += "<img src=\"" + n.imgUrl + "\" alt=\"\" />";
            bodyList += "推荐商品名称：<span>" + n.productName + "</span >";
            bodyList += "商品价格：<span>" + n.currentPrice + "</span >";
            bodyList += "商品原价：<span>" + n.originalPrice + "</span >";
            bodyList += "商品销量：<span>" + n.productNumber + "</span >";
            bodyList += "</div ><br>";
        });
        $("#divResultList").html(bodyList);
    },
    Load_Product: function (pid) {
        PageUrlConfig.SetUrl();
        window.location.href = g_const_PageURL.Product_Detail + "?pid=" + pid + "&t=" + Math.random();
    }
};