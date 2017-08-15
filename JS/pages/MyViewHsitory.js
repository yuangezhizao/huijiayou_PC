/// <reference path="../functions/g_Const.js" />
/// <reference path="../functions/g_Type.js" />
/// <reference path="../g_header.js" />
/// <reference path="../jquery-2.1.4.js" />


var page_myviewhistory = {
    /*初始化*/
    Init: function () {

        $("aside.fixed .btn").on("click", function (e) {
            g_type_history.Clear();
            page_myviewhistory.ChooseDisplay(false);
        });
        $("#btnBack").click(function () {
            window.location.replace(PageUrlConfig.BackTo());
        });
        if (g_type_history.LocalHistory != null) {
            if (g_type_history.LocalHistory.PDHistory.length > 0) {
                page_myviewhistory.ChooseDisplay(true);
                page_myviewhistory.LoadHistory();
                return;
            }
        }

        $("#btnqugg").on("click", function (e) {
            window.location.replace(g_const_PageURL.Index + "?t=" + Math.random());
        });

        page_myviewhistory.ChooseDisplay(false);

        
        
    },
    /*显示选择*/
    ChooseDisplay: function (bDisplay) {
        if (bDisplay) {
            $(".no-data").css("display", "none");
            $(".history.pb-55").css("display", "");
            $(".fixed").css("display", "");
        }
        else {
            $(".no-data").css("display", "");
            $(".history.pb-55").css("display", "none");
            $(".fixed").css("display", "none");
            $("#btnqugg").on("click", function (e) {
                window.location.href = g_const_PageURL.Index + "?t=" + Math.random();
            });
        }
    },
    /*读取历史数据*/
    LoadHistory: function () {
        $("article .cols-one.clearfix").empty();
        var html = "";
        var objhistorys = g_type_history.LocalHistory.PDHistory;
        var stpl = $("#tpl_h_p")[0].innerHTML;
        for (var k in objhistorys) {
            var objhistory = objhistorys[k];
            var data = {
                purl: g_GetLocationByShowmoreLinktype(g_const_showmoreLinktype.ProductDetail, objhistory.product_code),
                picture: g_GetPictrue(objhistory.picture),
                pname: FormatText(objhistory.pname, 25),
                mprice: objhistory.marketPrice,
                sprice: objhistory.SalePrice,
                salenum: objhistory.saleNum
            };
            html += renderTemplate(stpl, data);
        }
        $("article .cols-one.clearfix").append(html);
    },
    Load_Product: function (url) {
        PageUrlConfig.SetUrl();
        window.location.href = url;
    },
};