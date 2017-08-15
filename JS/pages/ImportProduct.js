$(document).ready(function () {
    ImportProduct.GetList();
    //$(window).scroll(function () {
    //    if ($(window).scrollTop() > 2) {
    //        $('.d_go_top').show();
    //    } else {
    //        $('.d_go_top').hide();
    //    }
    //});
    $("#btnback").click(function () {
        //window.location.href = PageUrlConfig.BackTo();
        window.location.replace(PageUrlConfig.BackTo());

    });
});
$(window).scroll(function () {
    //if ($(window).scrollTop() == $(document).height() - $(window).height()) {
    if ($(window).scrollTop() > g_const_MaxScroll) {
            $('.d_go_top').show();
        } else {
            $('.d_go_top').hide();
        }
   // }
});
//加载列表
var ImportProduct = {
    api_target: "com_cmall_familyhas_api_ApiForImportGoods",
    api_input: { "activity": "" },
    GetList: function () {
        ImportProduct.api_input.activity = g_const_ActivityType.ImportProduct;
        var s_api_input = JSON.stringify(ImportProduct.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": ImportProduct.api_target };
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
                ImportProduct.Load_Result(msg.items);
                if (msg.banner_name.length>0) {
                    $("#spactname").html(msg.banner_name);
                }
                else {
                    $("#spactname").html(g_const_ActivityName.ImportProduct);
                }
                /*显示头部广告*/
                if (msg.banner_img != "" && msg.banner_img != null) {
                    var banner_link = msg.banner_link;
                    if (banner_link != null && banner_link != "") {
                        if (banner_link.indexOf("goods_num:") != -1)
                            banner_link = g_GetLocationByShowmoreLinktype(g_const_showmoreLinktype.ProductDetail, banner_link.split(":")[1]);
                        $(".d_add_banner").html("<a href=\"" + banner_link + "\"><img src=\"" + msg.banner_img + "\"></a>");
                    }
                    else {
                        $(".d_add_banner").html("<img src=\"" + msg.banner_img + "\">");
                    }
                }
                else
                    $(".d_add_banner").empty();
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
            body += "<div class=\"d_today_new\" onclick=\"ImportProduct.Load_Detail('" + n.goods_num + "')\">";
            body += "<a class=\"d_today_new_img\">";
            body += "<img src=\"" + g_GetPictrue(n.img_url) + "\">";
            body += "</a>";
            body += "<div class=\"d_products\">";
            body += "<div class=\"d_products_p\">";
            body += "<h3>" + n.goods_name + "</h3>";
            body += "<p>" + n.goods_description + "</p>";
            body += "<h4>";
            body += "<b>现价：￥<span>" + n.current_price + "</span></b>";
            body += "<strong>市场价:<del>￥" + n.list_price + "</del></strong>";
            body += "</h4>";
            body += "</div>";
            body += "</div>";
            body += "</div>";
        });
        $("#ulResultList").html(body);
    },
    Load_Detail: function (pid) {
        PageUrlConfig.SetUrl();
        //location = g_const_PageURL.Product_Detail + "?pid=" + pid + "&t=" + Math.random();
        window.location.href = g_const_PageURL.Product_Detail + "?pid=" + pid + "&t=" + Math.random();

    }
};