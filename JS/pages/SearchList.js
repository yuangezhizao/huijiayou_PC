var _showtypepara = "";
var _keyword = "";
var _pageNo = 0;
var _pageSize = "20";
var _sortType = "0";//0、默认；  1、销量；  2、上架时间；  3、价格；  4、人气,   默认为：0
var _sortFlag = "1";//1、正序；2、倒序，默认为：2
var _baseValue = "";
var _showType = "1";
var _productData = {};
var _issort = 0;
var _stop = true;
var _pageNum = 0;
var _recodNum = 0;

var _brand = "";
var _type = "";
var _minPrice = "0";
var _maxPrice = "0";

function pageSelect(page_id, jq) {
    _pageNo = page_id;
    Product.GetList();
}
var InnerBuyPrice = {
    GetList: function (codeList, callback) {
        var innerMemberCode = "";
        if (localStorage[g_const_localStorage.Member]) {
            innerMemberCode = JSON.parse(localStorage[g_const_localStorage.Member]).Member.membercode;
        }
        if (codeList=="") {
            callback();
            return;
        }
        var api_input = { "version": 1, "code": codeList, "memberCode": innerMemberCode, "areaCode": "", "sourceCode": "", "isPurchase": 1 };
        var obj_data = { "api_input": JSON.stringify(api_input), "api_target": "com_srnpr_xmasproduct_api_ApiSkuPrice ", "api_token": "" };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            callback(msg);
        });

        request.fail(function (jqXHR, textStatus) {
            callback();
        });
    }
}
var Product = {
    api_target: "com_cmall_productcenter_service_api_ApiSearchResultsHjyNew",
    hot_api_target: "com_cmall_productcenter_service_api_ApiSearchResults",
    api_input: { "categoryOrBrand": "top50", "screenWidth": "", "pageNo": "1", "pageSize": "20", "sortType": "0", "baseValue": "", "keyWord": "1", "sortFlag": "2", "channelId": g_const_ChannelID },
    hot_api_input: { "categoryOrBrand": "", "screenWidth": "", "pageNo": "", "pageSize": "", "sortType": "", "baseValue": "", "keyWord": "", },
    HotProducts: [],
    GetHotProducts: function () {
        Product.hot_api_input.categoryOrBrand = "top50";
        Product.hot_api_input.screenWidth = "80";
        Product.hot_api_input.pageNo = 1;
        Product.hot_api_input.pageSize = 10;
        Product.hot_api_input.sortType = "1";
        Product.hot_api_input.baseValue = "base64";
        Product.hot_api_input.keyWord = "dG9wNTA=";
        var s_api_input = JSON.stringify(this.hot_api_input);
        var obj_data = { "api_input": s_api_input, "api_target": this.hot_api_target };
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
                Product.HotProducts = msg.item;
                var codeList = "";
                $(Product.HotProducts).each(function () {
                    if (codeList == "") {
                        codeList += this.productCode;
                    }
                    else {
                        codeList += "," + this.productCode;
                    }
                });
                InnerBuy.GetList(codeList, Product.Load_RightHotProducts);
              //  Product.Load_RightHotProducts();
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    GetList: function () {
        Product.api_input.categoryOrBrand = _showtypepara;
        Product.api_input.screenWidth = "0";
        Product.api_input.pageNo = _pageNo + 1;
        Product.api_input.pageSize = _pageSize;
        Product.api_input.sortType = _sortType;
        Product.api_input.baseValue = _baseValue;
        if (_keyword) {
            Product.api_input.keyWord = _keyword;
        }
        Product.api_input.sortFlag = _sortFlag;
        Product.api_input.brandKeyWord = _brand;
        Product.api_input.categerkeyWord = _type;
        Product.api_input.maxPrice = _maxPrice;
        Product.api_input.minPrice = _minPrice;
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
                _pageNum = msg.pager.pageNum;
                _recodNum = msg.pager.recordNum;
                if (_recodNum > 0) {
                    Product.Load_Data();
                    Product.QueryPageInit();
                }
                else {
                    $("#searchNothing").fadeIn("slow");
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
    ResultProductsList: [],
    Load_Data: function () {
        if (_productData.number == "1") {
            Product.Load_BrandAndType(_productData.categoryBrand);
            Product.ResultProductsList = _productData.item;
            var codeList = "";
            $(Product.ResultProductsList).each(function () {
                if (codeList == "") {
                    codeList += this.productCode;
                }
                else {
                    codeList += "," + this.productCode;
                }
            });
            InnerBuyPrice.GetList(codeList, Product.Load_Result);
            FormatTB(_productData.pager.recordNum, _productData.pager.pageSize, _pageNo, pageSelect, 0);
            Product.Load_Event();
            ForMaybeLove.LoadData($("#tempMaybeLove"), $("#maybeLove"));
            $("#searchList").fadeIn("slow");
        }
        else {
            Product.Load_Recommend(_productData.item);
            ForMaybeLove.LoadData($("#tempMaybeLove"), $("#maybeLoveNothing"));
            $("#searchNothing").fadeIn("slow");
            $("#searchList").hide();
        }
        $("#dlBrand").css('height', "auto");
        $("#dlType").css('height', "auto");
        _issort = 0;
    },
    Load_Recommend: function (result) {
        var stmp = $("#tempRecommendProduct").html();
        var html = "";

        $(result).each(function (i, n) {
            if (i < 5 && n) {
                var img = g_goods_Pic;
                if (n.imgUrl && n.imgUrl != "null") {
                    img = n.imgUrl;
                }
                var data = {
                    Link: "Product.Load_Product(" + n.productCode + ")",
                    Style: n.stockNum == '有货' ? "" : "class='sold'",
                    State: n.stockNum == '有货' ? "" : "<em>售 罄</em>",
                    ImgUrl: img,
                    Mark: g_const_ProductLabel.GetLabelHtml(n.labelsList, n.flagTheSea),
                    ProductName: String.DelHtmlTag(n.productName).length > 30 ? (String.DelHtmlTag(n.productName).substring(0, 25) + "...") : String.DelHtmlTag(n.productName),
                    MarkPrice: n.originalPrice,
                    SalePrice: n.currentPrice,
                };
                html += renderTemplate(stmp, data);
            }
        });
        $("#recommendProduct").html(html);
    },
    Load_Event: function () {
        /*搜索列表*/
        $('.term .hd span').click(function () {
            var cla = $(this).attr('class');
            if (undefined == cla || '' == cla) {
                $(this).addClass('curr');
                $(this).html('收起');
                $(this).parent().find("dd").css('height', 'auto');
                var heg = $(this).parent().find("dd").height();
                $(this).parent().find("dd").css('height', heg);
                $(this).parent().css('height', heg);
            } else {
                $(this).removeClass('curr');
                $(this).html('更多');
                $(this).parent().find("dd").css('height', '58px');
                var heg = $(this).parent().find("dd").height();
                $(this).parent().find("dd").css('height', heg);
                $(this).parent().css('height', heg);
            }
        });

        $('.term .hd dd a').click(function () {
            $(this).addClass('curr').siblings().removeClass('curr');
            Product.Load_TypeOrBrandSearch($(this));
        });
        $("#btnPriceSearch").click(function () {
            Product.Load_PriceSearch();
        });
    },
    Load_PriceSearch: function () {

        _minPrice = $("#minPrice").val();
        _maxPrice = $("#maxPrice").val();
        if (!_minPrice) {
            ShowMesaage("请填写最小价格！");
            return false;
        }
        if (!_maxPrice) {
            ShowMesaage("请填写最大价格！");
            return false;
        }
        if (isNaN(_minPrice) || isNaN(_maxPrice)) {
            ShowMesaage("请填写数字！");
            return false;
        }
        if (parseFloat(_minPrice) > parseFloat(_maxPrice)) {
            ShowMesaage("最小价格不能大于最大价格！");
            return false;
        }
        Product.GetList();
    },
    Load_Result: function (innerRes) {
        var stmp = $("#tempProduct").html();
        var html = "";
        if (innerRes) {
            if (innerRes.resultCode == g_const_Success_Code) {
                $(innerRes.map).each(function () {
                    for (var i = 0; i < Product.ResultProductsList.length; i++) {
                        if (Product.ResultProductsList[i].currentPrice != this[Product.ResultProductsList[i].productCode]) {
                            Product.ResultProductsList[i].currentPrice = this[Product.ResultProductsList[i].productCode];
                         //   Product.ResultProductsList[i].activityList = JSON.parse('["内购"]');
                        }
                    }
                });
            }
        }
        $(Product.ResultProductsList).each(function () {
            var activityLabel = "";
            if (this.activityList) {
                $(this.activityList).each(function () {
                    activityLabel += "<strong>" + this + "</strong>";
                });
            }
            var otherLabel = "<span>";
            if (this.otherShow) {
                $(this.otherShow).each(function () {
                    otherLabel += "<strong>" + this + "</strong>";
                });
            }
            otherLabel += "</span>";
            var img = g_goods_Pic;
            if (this.imgUrl && this.imgUrl != "null") {
                img = this.imgUrl;
            }
            var data = {
                Link: "Product.Load_Product(" + this.productCode + ")",
                Style: this.stockNum == '有货' ? "" : "class='sold'",
                State: this.stockNum == '有货' ? "" : "<em>售 罄</em>",
                Mark: g_const_ProductLabel.GetLabelHtml(this.labelsList, this.flagTheSea),
                ImgUrl: img,
                Title: String.DelHtmlTag(this.productName),
                ProductName: String.DelHtmlTag(this.productName).length > 30 ? (String.DelHtmlTag(this.productName).substring(0, 25) + "...") : String.DelHtmlTag(this.productName),
                MarkPrice: this.originalPrice || "0",
                SalePrice: this.currentPrice,
                Label: activityLabel,
                OtherLabel: otherLabel,
                SaleCount: this.productNumber
            };
            html += renderTemplate(stmp, data);
        });
        $("#productList").html(html);
    },
    Load_RightHotProducts: function (innerRes) {
        var stmp = $("#tempHotProduct").html();
        var html = "";
        if (innerRes) {
            if (innerRes.resultCode == g_const_Success_Code) {
                $(innerRes.map).each(function () {
                    for (var i = 0; i < Product.HotProducts.length; i++) {
                        Product.HotProducts[i].currentPrice = this[Product.HotProducts[i].productCode];
                    }
                });
            }
        }
        $(Product.HotProducts).each(function (i, n) {
            if (i < 10 && n) {
                var data = {
                    Link: "Product.Load_Product(" + n.productCode + ")",
                    Top: i < 3 ? '<i class="i' + (i + 1) + '">' + (i + 1) + '</i>' : '',
                    ImgUrl: n.imgUrl,
                    Title: String.DelHtmlTag(n.productName),
                    ProductName: String.DelHtmlTag(n.productName).length > 30 ? (String.DelHtmlTag(n.productName).substring(0, 25) + "...") : String.DelHtmlTag(n.productName),
                    SalePrice: n.currentPrice,
                };
                html += renderTemplate(stmp, data);
            }
        });

        $("#hotProductsList").html(html);
    },
    Load_Product: function (pid) {
        var p = "&pid=" + pid + "&t=" + Math.random();
        g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.ProductDetail), p,'','true')
    },

    Load_BrandAndType: function (result) {
        if (result) {
            $("#dlType").empty();
            $("#dlBrand").empty();

            var arrTypeName = result.categoryTwoName;
            var arrBrandName = result.brandName;

            var typeHtml = ' <dt>分类</dt><dd module="202022"><a data-t="all">全部</a>';
            $(arrTypeName).each(function (i) {
                typeHtml += '<a data-t="type">' + this + '</a>';
            });
            typeHtml += '</dd>';
            if (arrTypeName.length >= 10) {
                typeHtml += ' <span>更多</span>';
            };
            $("#dlType").html(typeHtml);
            var brandHtml = '<dt>品牌</dt><dd module="202023"><a data-t="all">全部</a>';
            $(arrBrandName).each(function (i) {
                brandHtml += '<a data-t="brand">' + this + '</a>';
            });
            brandHtml += '</dd>';
            if (arrBrandName.length >= 10) {
                brandHtml += '<span>更多</span>';
            };
            $("#dlBrand").html(brandHtml);
        }
    },

    Load_TypeOrBrandSearch: function (obj) {
        var html = '<a >全部商品</a>';
        var t = $(obj).data("t");
        if (t == "type") {
            _type = $(obj).text();
            _showtypepara = "category";
        }
        if (t == "brand") {
            _brand = $(obj).text();
            _showtypepara = "brand";
        }
        if (t == "all") {
            _type = "";
            _brand = "";
            _showtypepara = "";
        }
        if (_type) {
            html += '<span>/</span><a >' + _type + '</a>'
        }
        if (_brand) {
            html += '<span>/</span><a >' + _brand + '</a>'
        }
        $("#searchMark").html(html);

        $("#txtSearch").val($(obj).text());
        $("#txtAgainSearch").val($(obj).text());
        $("#txtSK").text($(obj).text());
        Product.GetList();
    },
    Change_Sort: function (obj) {
        $(obj).addClass("curr").siblings().removeClass("curr");
        $("#on").addClass("curr");
        var sortType = $(obj).attr("data-sortype");
        var sortFlag = $(obj).attr("data-sortflag");

        //价格
        if (sortType == "3") {
            if (sortFlag == "2") {
                $(obj).attr("data-sortflag", "1");
                $(obj).find("b").attr("class", "down");
            }
            else {
                $(obj).attr("data-sortflag", "2");
                $(obj).find("b").attr("class", "up");
            }
        }
        else {
            $(".filter ul li b").removeClass("up");
            $(".filter ul li b").removeClass("down");
        }
        _sortType = sortType;
        _sortFlag = sortFlag;
        Product.GetList();
    },

    /*分页*/
    QueryPageInit: function () {
        var html = Product.RefreshQueryPageInfo();
        $("#queryPage").html(html);
        Product.AddAndClearStyle();
    },
    Next: function () {
        if (_pageNo == _pageNum) {
            return false;
        }
        ++_pageNo;
        Product.GetList();
    },
    Previous: function () {
        if (_pageNo == 1) {
            return false;
        }
        --_pageNo;
        Product.GetList();
    },
    Skip: function (i) {
        if (i) {
            _pageNo = parseInt(i);
        }
        else {
            _pageNo = parseInt($("#txtPageNo").val());
        }
        Product.GetList();
    },
    AddAndClearStyle: function () {
        $("#queryPage").find("a[data-i=" + _pageNo + "]").addClass("curr").siblings().removeClass("curr");
        $("#txtPageNo").val(_pageNo);
        $('body,html').animate({
            scrollTop: 0
        }, 100);
    },
    RefreshQueryPageInfo: function () {
        var html = "";
        html += '<a  class="' + (_pageNo == 1 ? "on" : "") + '" disabled="' + (_pageNo == 1 ? "disabled" : "false") + '" onclick="Product.Previous();" id="pre">← 上一页</a>';
        html += '<a  onclick="Product.Skip(\'' + 1 + '\');" data-i="' + 1 + '">' + 1 + '</a>';

        if ((_pageNo - 2) == 1 || (_pageNo - 2) == 2) {
            for (var i = 2; i <= _pageNo; i++) {
                html += '<a  onclick="Product.Skip(\'' + i + '\');" data-i="' + i + '">' + i + '</a>';
            }
        }
        if ((_pageNo - 2) > 2) {
            html += '<span>···</span>';
            for (var i = _pageNo - 2; i <= _pageNo; i++) {
                if (i != _pageNum) {
                    html += '<a  onclick="Product.Skip(\'' + i + '\');" data-i="' + i + '">' + i + '</a>';
                }
            }
        }
        if ((_pageNo + 2) < _pageNum - 1) {
            for (var i = _pageNo + 1; i <= _pageNo + 2; i++) {
                html += '<a  onclick="Product.Skip(\'' + i + '\');" data-i="' + i + '">' + i + '</a>';
            }
            html += '<span>···</span>';
            html += '<a  onclick="Product.Skip(\'' + _pageNum + '\');" data-i="' + _pageNum + '">' + _pageNum + '</a>';
        }

        if ((_pageNo + 2) >= _pageNum) {
            for (var i = _pageNo + 1; i <= _pageNum; i++) {
                html += '<a  onclick="Product.Skip(\'' + i + '\');" data-i="' + i + '">' + i + '</a>';
            }
        }
        if (_pageNo == _pageNum && _pageNum != 1) {
            html += '<a  onclick="Product.Skip(\'' + _pageNum + '\');" data-i="' + _pageNum + '">' + _pageNum + '</a>';
        }
        html += '<a  class="' + (_pageNo == _pageNum ? "on" : "") + '" disabled="' + (_pageNo == _pageNum ? "disabled" : "false") + '" onclick="Product.Next();" id="next">下一页 →</a>';
        html += '<em>共' + _pageNum + '页 到第<input type="text" value="' + _pageNo + '" id="txtPageNo">页</em>';
        html += '<a  onclick="Product.Skip();">确定</a>';
        return html;
    }
};