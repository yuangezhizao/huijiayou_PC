var callBack = function () {
    var source = GetQueryString("s");
    var order_code = GetQueryString("orderno");
    if (source == "d") {
        g_const_PageURL.GoByMainIndex(g_const_PageURL.MyOrder_detail, "&orderno=" + order_code, false);
    }
    else {
        g_const_PageURL.GoByMainIndex(g_const_PageURL.MyOrder_List, "", false);
    }
};
(function () {
    var reviewRelease = {};
    reviewRelease.api_target = "com_cmall_familyhas_api_ApiProductCommentAddCf",
    reviewRelease.api_input = { "comments": [], "version": "" };
    reviewRelease.order_code = "";
    //发布事件
    reviewRelease.Release = function () {
        $("#btnRelease").hide();
        reviewRelease.InitParameter();
        var s_api_input = JSON.stringify(reviewRelease.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": reviewRelease.api_target, "api_token": g_const_api_token.Wanted };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode == g_const_Error_Code.UnLogin) {
                var par = "&orderno=" + GetQueryString("orderno");
                PageUrlConfig.SetReturnGoto(g_const_PageURL.Login, "Comment", par);
                return;
            }
            if (msg.resultCode == g_const_Success_Code) {
                // g_type_Evaluate.changeCommented(reviewRelease.order_code);
                ShowMesaage(g_const_API_Message["109001"]);
                window.setTimeout(callBack, 1000);
            }
            else {
                $("#btnRelease").show();
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    };
    //为发布评价post数据整理
    reviewRelease.InitParameter = function () {
        var par = {};
        $("#productList li[class='com']").each(function () {
            var textArea = $(this).find("textarea");
            par.order_code = reviewRelease.order_code;
            par.sku_code = $(this).attr("sku_code");
            par.product_code = $(this).attr("product_Code");
            par.grade = $(this).find("ul[name='grade']").attr("grade");
            par.comment_content = $(textArea).val() || "没有填写评价！";
            var photo = [];
            var imgs = $(this).find("ul[class='com_imgs']");
            $(imgs).find("li").each(function () {
                photo.push($(this).find("img").attr("src"));
            });
            par.comment_photo = photo;
            console.log(photo);
            reviewRelease.api_input.comments.push(par);
        });
    };
    //获取该订单下面的产品数据
    reviewRelease.GetProductList = function () {
        var api_target = "com_cmall_familyhas_api_ApiOrderDetails";
        reviewRelease.order_code = GetQueryString("orderno");
        var api_input = { "buyer_code": "", "order_code": reviewRelease.order_code, "version": "" };
        var s_api_input = JSON.stringify(api_input);
        var obj_data = { "api_input": s_api_input, "api_target": api_target, "api_token": g_const_api_token.Wanted };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode == g_const_Error_Code.UnLogin) {
                var par = "&orderno=" + GetQueryString("orderno");
                PageUrlConfig.SetReturnGoto(g_const_PageURL.Login, "Comment", par);
                return;
            }
            if (msg.resultCode == g_const_Success_Code) {
                reviewRelease.LoadProductList(msg.orderSellerList);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    };
    //渲染需要评价的商品列表
    reviewRelease.LoadProductList = function (result) {
        var html = "";
        var temHtml = $("#tmpReviewProduct").html();
        var temData = {};
        console.log(result);
        $(result).each(function () {
            var style = [];
            $(this.standardAndStyleList).each(function () {
                style.push('<p><label>' + this.standardAndStyleKey + '</label>' + this.standardAndStyleValue + '</p>');
            });
            temData.ProductCode = this.productCode;
            temData.SkuCode = this.skutCode;
            temData.ProductImg = this.mainpicUrl;
            temData.ProductName = this.productName;
            temData.Style = style.join('');
            html += renderTemplate(temHtml, temData);
        });
        $("#productList").html(html);

        reviewRelease.InitEvent();
    };
    //页面元素事件绑定初始化
    reviewRelease.InitEvent = function () {
        //发布事件
        $("#btnRelease").on("click", function () {
            reviewRelease.Release();
        });
        //评星事件
        $(".com_star li").on("click", function () {
            var grade = $(this).attr("grade");
            $(this).parent().attr("grade", grade);
            for (var i = 5; i > 0; i--) {
                if (i > parseInt(grade)) {
                    $(".com_star li[grade=" + i + "]").removeClass("on");
                }
                else {
                    $(".com_star li[grade=" + i + "]").addClass("on");
                }
            }
            $(".com_con").find("li[grade=" + grade + "]").show().siblings().hide();
        });

        $("#imgFile").on("change", function () {
            Upload.UpLoadImg("upLoadImg", reviewRelease.ShowUploadImg);
        });
        $(".uploadimg").on("click", function () {

        });
        //返回事件
        $(".go-back").on("click", function () {
            Message.ShowConfirm("评价未完成，确定放弃吗？", "", "fbox_freview", "确定", "callBack", "取消");
        });
    };
    reviewRelease.ShowUploadImg = function (formid, imgurl) {
        var html = '<li><img src="' + imgurl + '" /><b class="img_delete"></b><b class="img_arrow"></b></li>';
        $("#" + formid).parent().parent().find("ul").append(html);
        if ($(".com_imgs li").length >= 6) {
            $(".uploadimg").hide();
        }
        $(".com_imgs li").on("click", function () {
            $(this).addClass("act").siblings().removeClass("act");
            $(this).parent().parent().find("div[class=img2big]").show().find("img").attr("src", $(this).find("img").attr("src"));
        });
        $(".img_delete").on("click", function () {
            $(this).parent().remove();
            if ($(".com_imgs li").length < 6) {
                $(".uploadimg").show();
            }
        });
        $(".img_delete2").on("click", function () {
            $(this).parent().hide();
            $(this).parent().parent().find("ul").find("img[src='" + $(this).parent().find("img").attr("src") + "']").parent().remove();
            if ($(".com_imgs li").length < 6) {
                $(".uploadimg").show();
            }
        });
        $(".img2big img").on("click", function () {
            $(this).parent().hide();
        });
    };
    //初始化主程序
    (reviewRelease.Init = function () {
        $(function () {
            reviewRelease.GetProductList();
        });
    })();
})();