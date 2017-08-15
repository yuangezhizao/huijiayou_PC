var _activityCode = "";
var _beginTime = "";
var _endTime = "";
var _pageNo = 0;
var _pageSize = 10;
var _sortType = "1";
var _productData = {};
var _issort = 0;
var _stop = true;

$(document).ready(function () {


    //_activityCode = "CX2016011100005";
    //_beginTime = "2015-01-01";
    //_endTime = "2017-01-01";


    $("#btnback").click(function () {
        window.location.replace(PageUrlConfig.BackTo());
    });

    $("#btnCar").click(function () {
        PageUrlConfig.SetUrl();
        g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.Cart), "&t=" + Math.random());
    });

    $(".scroll-top").click(function () {
        $('body,html').animate({ scrollTop: 0 }, 1000);
        return false;
    });
});
function pageSelect(page_id, jq) {

    _pageNo = page_id;
    Product.GetList();
}
var Product = {
    api_target: "com_cmall_familyhas_api_ApiEventFullCutProdcut",
    api_input: { "activityCode": "", "pageNo": 0, "pageSize": 10, "sortType": 1, "beginTime": "", "endTime": "" },
    GetList: function () {
        Product.api_input.activityCode = _activityCode;
        Product.api_input.pageNo = _pageNo;
        Product.api_input.pageSize = _pageSize;
        Product.api_input.sortType = _sortType;
        Product.api_input.beginTime = _beginTime;
        Product.api_input.endTime = _endTime;
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
                _productData = msg.fullCutProduct;
                $("#div_fullCutDescription").html(msg.fullCutDescription || "以下商品参与满减活动");
                Product.Load_Result();
                FormatTB(msg.recordNum, _pageSize, _pageNo, pageSelect);
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
    Load_Result: function () {
        var limitStockTotal = 0;
        var bodyList = "";
        $.each(_productData, function (i, n) {
            bodyList += "<li onclick=\"Product.Load_Product('" + n.commodityCode + "')\">";
            bodyList += "<a style=\"cursor:pointer\">";
            bodyList += g_const_ProductLabel.GetLabelHtml(n.labelsList, n.flagTheSea);
            bodyList += "<img src=\"" + g_GetPictrue(n.commodityPic) + "\" alt=\"\">";
            bodyList += "<b>" + (n.commodityName.length > 25 ? (n.commodityName.substring(0, 25) + "...") : n.commodityName) + "</b>";
            bodyList += "<font>￥" + n.currentPrice + "<i>月销" + n.saleNum + "件</i></font>";
            bodyList += "<strong>立 刻抢 购</strong></a>";
            bodyList += "</li>";

        });
        $("#divResultList").html(bodyList);
    },
    Load_Product: function (pid) {
        PageUrlConfig.SetUrl();
        g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.ProductDetail), "&pid=" + pid + "&t=" + Math.random());
    },
    Change_Sort: function (tid) {
        _issort = 1;
        $("#liot1").attr("class", "");
        $("#liot2").attr("class", "");
        _sortType = tid;
        $("#liot" + tid).attr("class", "curr");
        _pageSize = "10";
        _pageNo = 0;
        Product.GetList();
    },
};