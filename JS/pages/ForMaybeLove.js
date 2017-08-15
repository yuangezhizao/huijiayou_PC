
var ForMaybeLove = {
    PageNum: 1,
    TotalPages: 1,
    PageCount: 20,
    MaybeLoveData: [],
    TempHtml: "",
    TempTag: {},
    Index: 0,
    Record: 10,
    LoadData: function (stmp, tag) {

        if (ForMaybeLove.PageNum == 1 && typeof (web_maybelove) != 'undefined') {
            var msg = web_maybelove;
            if (msg.resultCode == g_const_Success_Code) {
                ForMaybeLove.TotalPages = msg.pagination;

                ForMaybeLove.MaybeLoveData = msg.productMaybeLove;
                ForMaybeLove.Record += msg.productMaybeLove.length;
                ForMaybeLove.TempHtml = stmp;
                ForMaybeLove.TempTag = tag;
                var codeList = [];
                $(ForMaybeLove.MaybeLoveData).each(function () {
                    codeList.push(this.procuctCode);
                });
                InnerBuy.GetList(codeList.join(","), ForMaybeLove.LoadResult);
                if (ForMaybeLove.Record <= 5) {
                    $(tag).parent().find("a[class='next']").addClass("static");
                }
                else {
                    $(tag).parent().find("a").removeClass("static");
                }
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
            
        }
        else {
            var api_input = { pageSize: ForMaybeLove.PageCount, operFlag: "maybelove", pageIndex: ForMaybeLove.PageNum };
            var api_target = "com_cmall_familyhas_api_ApiRecProductInfo";
            var s_api_input = JSON.stringify(api_input);
            var obj_data = { "api_input": s_api_input, "api_target": api_target };
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
                    ForMaybeLove.TotalPages = msg.pagination;

                    ForMaybeLove.MaybeLoveData = msg.productMaybeLove;
                    ForMaybeLove.Record += msg.productMaybeLove.length;
                    ForMaybeLove.TempHtml = stmp;
                    ForMaybeLove.TempTag = tag;
                    var codeList = [];
                    $(ForMaybeLove.MaybeLoveData).each(function () {
                        codeList.push(this.procuctCode);
                    });
                    InnerBuy.GetList(codeList.join(","), ForMaybeLove.LoadResult);
                    if (ForMaybeLove.Record <= 5) {
                        $(tag).parent().find("a[class='next']").addClass("static");
                    }
                    else {
                        $(tag).parent().find("a").removeClass("static");
                    }
                }
                else {
                    ShowMesaage(msg.resultMessage);
                }
            });

            request.fail(function (jqXHR, textStatus) {
                ShowMesaage(g_const_API_Message["100022"]);
            });
            
        }
    },
    /*渲染猜你喜欢*/
    LoadResult: function (innerRes) {
        // $(ForMaybeLove.TempTag).hide();
        if (innerRes) {
            if (innerRes.resultCode == g_const_Success_Code) {
                for (var i = 0; i < ForMaybeLove.MaybeLoveData.length; i++) {
                    var item = ForMaybeLove.MaybeLoveData[i];
                    item.productPrice = innerRes.map[item.procuctCode];
                }
            }
        }
        var html = "";
        for (var j = 0; j < ForMaybeLove.PageCount ; j++) {
            var productMaybeLove = ForMaybeLove.MaybeLoveData[j];
            if (productMaybeLove) {
                var data = {
                    Mark: g_const_ProductLabel.GetLabelHtml(productMaybeLove.labelsList, productMaybeLove.flagTheSea),
                    Link: "ForMaybeLove.LoadProduct('" + productMaybeLove.procuctCode + "');",
                    Style: ForMaybeLove.IsSaleOut() ? "class='sold'" : "",
                    State: "<em>售 罄</em>",
                    ImgUrl: productMaybeLove.mainpic_url || g_goods_Pic,
                    ProductName: String.DelHtmlTag(productMaybeLove.productNameString).length > 30 ? (String.DelHtmlTag(productMaybeLove.productNameString).substring(0, 25) + "...") : String.DelHtmlTag(productMaybeLove.productNameString),
                    MarkPrice: productMaybeLove.market_price,
                    SalePrice: productMaybeLove.productPrice,
                };
                html += renderTemplate(ForMaybeLove.TempHtml.html(), data);
            }
        }
        $(ForMaybeLove.TempTag).append(html);
        // ForMaybeLove.ChangeStyle();
    },
    Next: function (obj) {
        if (ForMaybeLove.TotalPages == 0) {
            return false;
        }
        else {
            var $tag = $(ForMaybeLove.TempTag);
            var count = ForMaybeLove.Record;
            var timer = count - 5;
            if (count > 5) {
                ++ForMaybeLove.Index;
                var abs = Math.abs(233 * 5 * ForMaybeLove.Index);
                var cheap = "-" + abs + "px";
                var marg = "+" + abs + "px";
                if (ForMaybeLove.Index < 0) {
                    cheap = "+" + abs + "px";
                    marg = "-" + abs + "px";
                }
                $tag.animate({ "left": cheap }, 300, function () {
                    for (var i = 0; i < 5; i++) {
                        var first = $("#" + $tag.attr("id") + " li:first");
                        $tag.append("<li>" + $(first).html() + "</li>");
                        $(first).remove();
                    }
                    $tag.css({ "margin-left": marg });
                });

                $tag.parent().find("a[class='prev static']").removeClass("static");
            }
            if ((ForMaybeLove.PageNum + 1) > ForMaybeLove.TotalPages) {
                return false;
            }
            else {
                if (ForMaybeLove.TotalPages > 1) {
                    $(obj).parent().find("a[class='prev static']").removeClass("static");
                }
                ++ForMaybeLove.PageNum;
                ForMaybeLove.LoadData(ForMaybeLove.TempHtml, ForMaybeLove.TempTag);
            }
        }
    },
    Previous: function (obj) {
        if (ForMaybeLove.TotalPages == 0) {
            return false;
        }
        else {
            var $tag = $(ForMaybeLove.TempTag);
            var count = ForMaybeLove.Record;
            var timer = count - 5;
            if (count > 5) {
                //if (Home.PageIndex[tag] <= timer && Home.PageIndex[tag] >= 1) {
                --ForMaybeLove.Index;
                var abs = Math.abs(233 * 5 * ForMaybeLove.Index);
                var cheap = "-" + abs + "px";
                var marg = "+" + abs + "px";
                if (ForMaybeLove.Index < 0) {
                    cheap = "+" + abs + "px";
                    marg = "-" + abs + "px";
                }
                for (var i = 0; i < 5; i++) {
                    var last = $("#" + $tag.attr("id") + " li:last");
                    $tag.prepend("<li>" + $(last).html() + "</li>");
                    $(last).remove();
                }
                $tag.css({ "margin-left": marg });
                $tag.animate({ left: cheap }, 300);
                $tag.parent().parent().find("a[class='next static']").removeClass("static");
            }
        }
    },
    Refresh: function () {
        if (ForMaybeLove.PageNum == ForMaybeLove.TotalPages && ForMaybeLove.TotalPages > 1) {
            --ForMaybeLove.PageNum;
        }
        if (ForMaybeLove.PageNum >= 1 && ForMaybeLove.PageNum < ForMaybeLove.TotalPages && ForMaybeLove.TotalPages > 1) {
            ++ForMaybeLove.PageNum;
        }
        ForMaybeLove.LoadData(ForMaybeLove.TempHtml, ForMaybeLove.TempTag);
    },
    LoadProduct: function (pid) {
        var p = "&pid=" + pid + "&t=" + Math.random();
        g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.ProductDetail), p)
    },
    IsSaleOut: function () {
        var isSaleOut = false
        return isSaleOut;
    },
    //改变上一页，下一页的样式
    ChangeStyle: function () {
        if (ForMaybeLove.TotalPages <= 1) {
            $(ForMaybeLove.TempTag).parent().find("a[class='next']").addClass("static");
        }
        if ((ForMaybeLove.PageNum + 1) > ForMaybeLove.TotalPages) {
            $(ForMaybeLove.TempTag).parent().find("a[class='next']").addClass("static");
        }
        if (ForMaybeLove.PageNum <= 1) {
            $(ForMaybeLove.TempTag).parent().find("a[class='prev']").addClass("static");
        }
    }
}