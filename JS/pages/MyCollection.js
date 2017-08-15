var _pageNo = 0;
var _productData = [];
var api_target = "com_cmall_familyhas_api_APiGetMyCollectionProduct";
var ps = 10;
var _maxPage = 0;
//分页方法
function pageSelect(page_id, jq) {
    if (_maxPage > page_id) {
        _pageNo = page_id;
        Product.GetList();
    }
}

var Product = {
    MenuName: "我的收藏",
    Init: function () {
        AccountMenu.ShowMenu("div.home ul.fl", "#tpl_menu", Product.MenuName);
        Product.GetList();
    },
    // api_target: "com_cmall_familyhas_api_APiGetMyCollectionProduct",
    api_input: { "pageNum": "" },
    GetList: function () {
        Product.api_input.pageNum = _pageNo + 1;
        var s_api_input = JSON.stringify(Product.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": api_target, "api_token": "1" };
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
                    Message.ShowToPage("", g_const_PageURL.MainIndex + "?u=" + g_const_PageURL.GetKey(g_const_PageURL.Login), 500, "");
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }
            if (msg.resultCode == g_const_Success_Code) {
                // _allpagenum = msg.pagination;
                _maxPage = msg.pagination;
                if (msg.pagination > 0) {
                    if (msg.pagination == 1) {
                        $("#count").html(msg.collectionProductList.length);
                    }
                    else {
                        $("#count").html(msg.pagination * ps);
                    }
                    Product.Load_Result(msg.collectionProductList);
                    FormatTB(msg.pagination * ps, ps, _pageNo, pageSelect);
                }
                else {
                    $("#myCollectionList").html('<p class="collectionwu"><img src="/img/wu_bg.png" alt="">没有收藏~<a href=\"Index.html\">去逛逛吧</a></p>');
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
        $("#tbCollection").html("");
        bodyList += "<tr>";
        bodyList += "<th width=\"510\">商品</th>";
        bodyList += "<th width=\"280\">价格</th>";
        bodyList += "<th width=\"210\">操作</th>";
        bodyList += "</tr>";
        $.each(resultlist, function (i, n) {
            bodyList += "<tr>";
            bodyList += "<td>";
            bodyList += "<a style=\"cursor:pointer\" class=\"cp\" onclick=\"Product.Load_Product('" + n.productCode + "')\">";
            bodyList += g_const_ProductLabel.GetLabelHtml(n.labelsList, n.flagTheSea);
            bodyList += g_const_productStatus.GetStatusName(n.productStatus);
            bodyList += "<img src=\"" + g_GetPictrue(n.picture) + "\" width=\"90\" height=\"90\">";
            bodyList += "<p></p>";//<em>赠品</em>
            bodyList += "<b>" + n.productName + "</b>";
            bodyList += "</a>";
            bodyList += "</td>";
            bodyList += "<td>￥" + n.sellPrice + "</td>";
            bodyList += "<td><a style=\"cursor:pointer\" onclick=\"Product.Load_Product('" + n.productCode + "')\">查看商品详情</a><a  style=\"cursor:pointer\" onclick=\"CollectionDelete('" + n.productCode + "')\">取消收藏</a></td>";
            bodyList += "</tr>";
        });
        $("#tbCollection").append(bodyList);

    },
    Load_Product: function (pid) {
        PageUrlConfig.SetUrl(g_const_PageURL.MainIndex + "?u=MyCollection");
        var p = "&pid=" + pid + "&t=" + Math.random();
        g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.ProductDetail), p);
    },
};

function CollectionDelete(productCode) {
    ConfirmMessage("确认取消收藏么？", function () {
        return false;
    }, function () {
        var pidlist = JSON.parse("[\"" + productCode + "\"]");
        Collection.Delete(pidlist, Product.GetList)
    });
}