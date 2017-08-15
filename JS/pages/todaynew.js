//页面上滚3屏出现置顶
$(window).scroll(function () {
    if ($(window).scrollTop() / $(this).height() >= 3) {
        $("#totop").show();
    }
    else {
        $("#totop").hide();
    }
});


$(document).ready(function () {
    ////返回
    //$(".fl .d_jt_left").on("tap", function () {
    //    //history.back();
    //});
    //后退
    $("#btnBack").click(function () {
        window.location.replace(PageUrlConfig.BackTo());
    });
    $("#totop").hide();
    //加载
    page_todaynew.LoadData();

});



var page_todaynew = {
    /*初始化*/
    Init: function () {

    },
    /*接口名称*/
    api_target: "com_cmall_familyhas_api_ApiForNewProducts",
    /*输入参数*/
    api_input: { "activity": g_const_ActivityType.Todaynew, "buyerType": GetQueryString("buyerType"), "version": 1.0 },
    /*接口响应对象*/
    api_response: {},
    /*获取数据*/
    LoadData: function () {
        var s_api_input = JSON.stringify(page_todaynew.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": page_todaynew.api_target };
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
            page_todaynew.api_response = msg;
            if (msg.resultCode == g_const_Success_Code) {
                page_todaynew.Load_Result(msg);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            //$("#pageloading").css("display", "none");
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    //接口返回成功后的处理
    Load_Result: function (result) {
        //头部标题
        var banner_name=result.banner_name;
        if (banner_name=="") {
            banner_name = g_const_ActivityName.Todaynew;
        }
        $("#d_go_top").html("<a class=\"fl d_jt_left\" href=\"/index.html\"></a>" + banner_name);
        /*显示头部广告*/
        if (result.banner_img != "" && result.banner_img != null) {
            var banner_link = result.banner_link;
            if (banner_link != null && banner_link != "") {
                if (banner_link.indexOf("goods_num:") != -1)
                    banner_link = g_GetLocationByShowmoreLinktype(g_const_showmoreLinktype.ProductDetail, banner_link.split(":")[1]);
                $(".d_add_banner").html("<a href=\"" + banner_link + "\"><img src=\"" + result.banner_img + "\"></a>");
            }
            else {
                $(".d_add_banner").html("<img src=\"" + result.banner_img + "\">");
            }
        }
        else
            $(".d_add_banner").empty();
        var goodsInfo = "";
        var i = 0;
        var first = true;
        $.each(result.items, function (i, n) {
            //每个订单的商品信息
            goodsInfo += "<div class=\"d_today_new\" onclick=\"page_todaynew.GoToGoodsDetail('" + n.goods_num + "');\">"
                        + "<a class=\"d_today_new_img\" >"
                            + "<img src=\"" + g_GetPictrue(n.img_url) + "\">"
                        +"</a>"
                        +"<div class=\"d_products\">"
                            +"<div class=\"d_products_p\">"
                                + "<h3>" + n.goods_name + "</h3>"
                                +"<h4>"
                                    + "<b>现价：￥<span>" + n.current_price.toFixed(2) + "</span></b>"
                                    + "<strong>市场价:<del>￥" + n.list_price.toFixed(2) + "</del></strong>"
                                +"</h4>"
                            +"</div>"
                        +"</div>"
                    + "</div>";
                if (first) {
                    first = false;
                    $(".d_jrxp_content").html(goodsInfo);
                }
                else{
                    $(".d_jrxp_content").append(goodsInfo);
                }
                goodsInfo = "";
        });
        //$(".d_jrxp_content").html(goodsInfo);
    },
    GoToGoodsDetail: function (goods_num) {
        PageUrlConfig.SetUrl();
        window.location.replace(g_const_PageURL.Product_Detail + "?pid=" + goods_num + "&t=" + Math.random());
    }
}

