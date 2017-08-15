/// <reference path="../functions/g_Const.js" />
/// <reference path="../functions/g_Type.js" />
/// <reference path="../g_header.js" />
var page_BrandPreferenceList = {
    //初始化
    Init: function () {
        if (typeof (web_brand) != 'undefined') {
            page_BrandPreferenceList.AfterLoadBrandPreferenceList(web_brand);
        }
        else {
            page_BrandPreferenceList.LoadBrandPreferenceList();
        }
        if (typeof (web_hotbrand) != 'undefined') {
            page_BrandPreferenceList.AfterLoadHotBrandList(web_hotbrand);
        }
        else {
            page_BrandPreferenceList.LoadHotBrandList();
        }
        if (typeof (web_hotsale) != 'undefined') {
            page_BrandPreferenceList.AfterLoadHotSaleList(web_hotsale);
        }
        else {
            page_BrandPreferenceList.LoadHotSaleList();
        }
    },
    //读取品牌会列表
    LoadBrandPreferenceList: function () {
        g_type_api.api_input = {
            picWidth: 612,
            buyerType: GetQueryString("buyerType"),
            activity: g_const_ActivityType.BrandPreference,
            version: 1
        };
        g_type_api.api_target = "com_cmall_familyhas_api_ApiPcForBrandPreference";
        g_type_api.api_token = g_const_api_token.Wanted;
        g_type_api.LoadData(page_BrandPreferenceList.AfterLoadBrandPreferenceList, "");
    },
    AfterLoadBrandPreferenceList: function (msg) {
        var html = "";
        var stpl = $("#tpl_brandlist").html();
        for (var k in msg.items) {
            var item = msg.items[k];
            var objdata = {
                brand_logo: item.brandPic || g_brand_logo_Pic,
                brand_Name: item.hasOwnProperty("brandName") ? item.brandName : "",
                brand_Content: item.hasOwnProperty("branddesc") ? item.branddesc : "",
                discount: item.discount.length > 0 ? "<em>" + item.discount + "</em>折起" : "",
                brand_link: function (item) {
                    var sparam = "&id=" + item.infoCode + "&t=" + Math.random();
                    if (item.shareFlag == g_const_shareFlag.YES) {
                        sparam += "&wx_st=" + encodeURIComponent(item.share_info.share_title);
                        sparam += "&wx_sc=" + encodeURIComponent(item.share_info.share_content);
                        sparam += "&wx_si=" + encodeURIComponent(item.share_info.share_img_url);
                    }
                    return g_const_PageURL.GetLink(g_const_PageURL.BrandPreferenceDetail, sparam);
                }(item),
                brand_picture: (item.img_url == "" || item.img_url == null) ? g_brand_Pic : item.img_url
            };
            html += renderTemplate(stpl, objdata);
        }
        $("div.brand div.fl").html(html);
    },
    //读取热销品牌
    LoadHotBrandList: function () {
        g_type_api.api_input = {
            paging: {
                limit: 10,
                offset: 0
            },
            version: 1
        };
        g_type_api.api_target = "com_cmall_familyhas_api_ApiGetHotBrand";
        g_type_api.api_token = g_const_api_token.Wanted;
        g_type_api.LoadData(page_BrandPreferenceList.AfterLoadHotBrandList, "");
    },
    AfterLoadHotBrandList: function (msg) {
        var html = "";
        var stpl = $("#tpl_hotbrand").html();
        for (var k in msg.brands) {
            var brand = msg.brands[k];
            var objdata = {
                brand_logo: brand.pic || g_brand_logo_Pic,
                brand_Name: brand.hasOwnProperty("brandName") ? brand.brandName : "",
                brand_link: brand.link,

            };
            html += renderTemplate(stpl, objdata);
        }
        $("div.hot ul").html(html);
        if (msg.brands.length == 0)
            $("div.hot").css("display", "none");
    },
    //读取热销商品
    LoadHotSaleList: function () {
        g_type_api.api_input = {
            categoryOrBrand: "top50",
            screenWidth: "1",
            pageNo: 1,
            pageSize: 10,
            sortType: "1",
            baseValue: "base64",
            keyWord: "dG9wNTA=",
            version: 1
        };
        g_type_api.api_target = "com_cmall_productcenter_service_api_ApiSearchResults ";
        g_type_api.api_token = g_const_api_token.Wanted;
        g_type_api.LoadData(page_BrandPreferenceList.AfterLoadHotSaleList, "");
    },
    AfterLoadHotSaleList: function (msg) {
        var html = "";
        var stpl = $("#tpl_hotsalelist").html();
        for (var i = 0; i < msg.item.length; i++) {
            var item = msg.item[i];
            var objdata = {
                product_picture: item.hasOwnProperty("imgUrl") ? item.imgUrl : "",
                product_index: (i + 1).toString(),
                product_link: g_GetLocationByShowmoreLinktype(g_const_showmoreLinktype.ProductDetail, item.productCode),
                product_name: item.productName,
                product_price: item.currentPrice.toString(),
                product_index_style: "display:none"
            };
            if (i < 3)
                objdata.product_index_style = "display:block";
            html += renderTemplate(stpl, objdata);
        }
        $("div.selling ul.bd").html(html);
    }
};
