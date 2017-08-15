var _showtypepara = "";
var _keyword = "";
var _pageNo = "1";
var _pageSize = "10";
var _sortType = "0";
var _sortFlag = "2";
var _baseValue = "";
var _showType = "1";
var _productData = {};
var _issort = 0;
var _stop = true;
$(window).scroll(function () {
    if (_issort==0) {
        totalheight = parseFloat($(window).height()) + parseFloat($(window).scrollTop());
        if ($(document).height() <= totalheight) {
            if (_stop == true) {
                _stop = false;
                _pageSize = (parseInt(_pageSize) + 10).toString();
                Product.GetList();
                _stop = true;
            }
        }
        //alert($(document).height() + "<=" + (totalheight * 3));
        if ($(document).height() <= (totalheight * 3)) {
            $("#curr").hide();
            $("#ulResultMenu").hide();
        }
        else {
            $("#curr").show();
            $("#ulResultMenu").show();
        }
    }

});

$(document).ready(function () {
    _showtypepara = GetQueryString("showtype");
    _keyword = decodeURI(GetQueryString("keyword"));
    //if (_showtype == "category") {
    //    $("#txtSearch").val(decodeURI(GetQueryString("showword")));
    //}
    //else {
        $("#txtSearch").val(_keyword);
    //}
    Product.GetList();
    $("#txtSearch").click(function () {
        PageUrlConfig.SetUrl();
        //location = g_const_PageURL.Search;//"/Search.html";
        window.location.replace(g_const_PageURL.Search + "?t=" + Math.random());

    });
    $("#btnback").click(function () {
        window.location.replace(PageUrlConfig.BackTo());


    });
    $("#btnCancel").click(function () {
        window.location.replace(PageUrlConfig.BackTo());


    });
    $("#btnShowType").click(function () {
        if (_showType=="0") {
            _showType = "1";
        }
        else {
            _showType = "0";
        }
        Product.Load_Data();
    });
    $(".ch-up").click(function () {
      //  objTop.Start($(".ch-up"));
        $('.ch-header').show();
        $('.ch-nav').show();
    });
    
});

var Product = {
    api_target: "com_cmall_productcenter_service_api_ApiSearchResults",
    api_input: { "categoryOrBrand": "", "screenWidth": "", "pageNo": "", "pageSize": "", "sortType": "", "baseValue": "", "keyWord": "", "sortFlag": "" },
    GetList: function () {
        Product.api_input.categoryOrBrand = _showtypepara;
        Product.api_input.screenWidth = "1";
        Product.api_input.pageNo = _pageNo;
        Product.api_input.pageSize = _pageSize;
        Product.api_input.sortType = _sortType;
        Product.api_input.baseValue = _baseValue;
        Product.api_input.keyWord = _keyword;
        Product.api_input.sortFlag = _sortFlag;
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
                _productData = msg;
                Product.Load_Data();
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_Data: function () {
        if (_productData.number == "1") {
            Product.Load_Result(_productData.item);
        }
        else {
            Product.Load_Recom(_productData.item);
        }
        _issort = 0;
    },
    Load_Result: function (resultlist) {
        
        $("#divResultNull").hide();
        $("#h2ResultRecom").hide();
        $("#ulResultRecom").hide();
        if ($('.ch-nav').is(":visible")) {
            $("#ulResultMenu").show();
        }
        $("#ulResultList").show();
        var bodyList = "";
        var bodyPic = "";
        var bodyAction = "";
        var actnum = 0;
        $.each(resultlist, function (i, n) {
            bodyAction = "";
            actnum = 0;
            if (_showType != "0") {
                $.each(n.activityList, function (j, m) {
                    if (actnum==0) {
                        bodyAction += "<strong>" + m + "</strong>";
                    }
                    else {
                        bodyAction += "<strong class=\"s" + actnum + "\">" + m + "</strong>";
                    }
                    actnum++;
                });
                $.each(n.otherShow, function (j, m) {
                    if (actnum == 0) {
                        bodyAction += "<strong>" + m + "</strong>";
                    }
                    else {
                        bodyAction += "<strong class=\"s" + actnum + "\">" + m + "</strong>";
                    }
                    actnum++;
                });
            }
            bodyList += "<li onclick=\"Product.Load_Product('" + n.productCode + "')\">";
            bodyList += "<a>";
            bodyList += "<img src=\"" + g_GetPictrue(n.imgUrl) + "\" alt=\"\">";
            
            bodyList += "<font><b>" + n.productName + "</b>" + bodyAction + "<span>¥" + n.currentPrice + "<i>¥" + n.originalPrice + "</i></span><em>月销" + n.productNumber + "件</em>";
            bodyList += "</font>";
            bodyList += "</a>";
            bodyList += "</li>";
        });
        if (_showType == "0") {
            $("#btnShowType").attr("class", "pressed");
            $("#ulResultList").attr("class", "ch-list");
        }
        else {
            $("#btnShowType").attr("class", "grid");
            $("#ulResultList").attr("class", "ch-small");
        }
        $("#divResultList").html(bodyList);
    },
    Load_Recom: function (resultlist) {
        $("#divResultNull").show();
        $("#h2ResultRecom").show();
        $("#ulResultRecom").show();
        if ($('.ch-nav').is(":hidden")) {
            $("#ulResultMenu").hide();
        }
        $("#ulResultList").hide();
        var bodyList = "";
        var bodyPic = "";
        var bodyAction = "";
        $.each(resultlist, function (i, n) {
            $.each(n.activityList, function (j, m) {
                bodyAction = "<strong>" + m + "</strong>";
            });
            $.each(n.otherShow, function (j, m) {
                bodyAction = "<strong>" + m + "</strong>";
            });
            bodyList += "<li><a onclick=\"Product.Load_Product('" + n.productCode + "')\"><img src=\"" + n.imgUrl + "\" alt=\"\"><font><b>" + n.productName + "</b>" + bodyAction + "<span>¥" + n.currentPrice + "<i>¥" + n.originalPrice + "</i></span></font></a></li>";
        });
        if (_showType == "0") {
            $("#btnShowType").attr("class", "pressed");
            $("#ulResultRecom").attr("class", "ch-list");
        }
        else {
            $("#btnShowType").attr("class", "grid");
            $("#ulResultRecom").attr("class", "ch-small");
        }
        $("#divResultRecom").html(bodyList);
    },
    Load_Product: function (pid) {
        PageUrlConfig.SetUrl();
        //location = g_const_PageURL.Product_Detail + "?pid=" + pid + "&t=" + Math.random();
        window.location.href = g_const_PageURL.Product_Detail + "?pid=" + pid + "&t=" + Math.random();

    },
    Change_Sort: function (tid) {
        _issort = 1;
        $("#liot0").attr("class", "");
        $("#liot1").attr("class", "");
        $("#liot3").attr("class", "");
        $("#liot4").attr("class", "");
        _sortType = tid;
        if (tid != "3") {
            _sortFlag = "2";
            
            $("#liot" + tid).attr("class", "curr")
        }
        else {
            
            if (_sortFlag == "2") {
                _sortFlag = "1";
                $("#liot" + tid).attr("class", "curr")
            }
            else {
                _sortFlag = "2";
                $("#liot" + tid).attr("class", "curr up")
            }
        };
        Product.GetList();
    },
};