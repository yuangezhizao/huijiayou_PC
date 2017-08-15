/// <reference path="../functions/g_Const.js" />
/// <reference path="../functions/g_Type.js" />
/// <reference path="../jquery-2.1.4.js" />
/// <reference path="../g_header.js" />
var page_BrandPreferenceDetail = {
    Init: function () {

        //控制IndexMain样式
        $("#mainContent").removeClass("main");

        g_type_api.api_input = {
            infoCode: GetQueryString("id")
        };
        g_type_api.api_token = g_const_api_token.Wanted;
        g_type_api.api_target = "com_cmall_familyhas_api_ApiForBrandPreferenceContent";
        g_type_api.LoadData(page_BrandPreferenceDetail.AfterLoadData, "");
    },
    AfterLoadData: function (msg) {
        var html = "";
        var stpl = $("#tpl_productlist").html();
        for (var k = 0; k < msg.productList.length; k++) {
            var product = msg.productList[k];
            var objdata = {
                product_link: g_GetLocationByShowmoreLinktype(g_const_showmoreLinktype.ProductDetail, product.procuctCode),
                product_class: product.storeFlag.trim() == "0" ? "sold" : "",
                product_status: product.storeFlag.trim() == "0" ? "<em>售 罄</em>" : "",
                product_picture: g_GetPictrue(product.pic),
                product_name: product.productName.length > 30 ? (product.productName.substring(0, 25) + "...") : product.productName,
                product_marketPrice: product.marketPrice.toString(),
                product_salePrice: product.salePrice.toString(),
                product_lb1: "",
                product_lb2: "",
                product_lb3: "",
                product_salecount: product.discount.length>0?product.discount+"折":"",
            }
            html += renderTemplate(stpl, objdata);
        }
        $("ul.ac-list").html(html);
        for (var k = 0; k < msg.brandPicList.length; k++) {
            var brandPic = msg.brandPicList[k];
            var info = "";//<img src="img/dome_21.jpg" style="width:100%" />
            info += "<a href='" + g_GetLocationByShowmoreLinktype(brandPic.linkType, brandPic.linkValue) + "'\"><img src=\"" + g_GetPictrue(brandPic.brandPic) + "\" style=\"width:100%\"/></a>";

            if (brandPic.brandLocation.toString().Trim() == g_const_brandLocation.Header.toString()) {
                //info += "<h1><b>&nbsp;</b>全场<span>" + msg.discount + "</span>折起</h1>";
                $(".banner").html(info);
            }
            else
                $(".adfooter").html(info);
        }
    }
};