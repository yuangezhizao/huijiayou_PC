var cateresultlist;

$(document).ready(function () {
    if (typeof (web_category) != 'undefined') {
        Category.GetStaticList();
    }
    else {
        Category.GetList();
    }
    //$("#txtSearch").keyup(function () {
    //    if ($("#txtSearch").length > 0) {
    //        $("#divHotwordout").hide();
    //        $("#divAssociateout").show();
    //        Associate.GetList();
    //    }
    //    else {
    //        $("#divHotwordout").show();
    //        $("#divAssociateout").hide();
    //    }
    //});
    //$("#btnSearch").click(function () {
    //    PageUrlConfig.SetUrl();
    //    window.location.href = g_const_PageURL.Search + "?t=" + Math.random();
    //});
    //$("#btnBack").click(function () {
    //    window.location.replace(PageUrlConfig.BackTo());

    //});
});

//加载热词
var Category = {
    api_target: "com_cmall_familyhas_api_APiForCategory",
    api_input: {},
    GetList: function () {
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
                Category.Load_Result(msg.scs);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    GetStaticList:function myfunction() {
        var msg = web_category;
        Category.Load_Result(msg.scs);
    },
    Load_Result: function (resultlist) {
        cateresultlist = resultlist
        var body = "";
        var classstr = "";
        $.each(resultlist, function (i, n) {
            if (i == 0) {
                classstr = "class = \"curr\"";
            }
            else {
                classstr = "";
            }
            body += '<a onclick="Category.Load_ProductList(\'category\',\'' + n.categoryName + '\');" id="li_level_' + i + '">' + n.categoryName + '</a>';
        });
        $("#pop").html(body);
        // jsScroll(document.getElementById('pop'), 6, '', 'b');
        $("#pop").each(function () {
          //  $(this).perfectScrollbar();
        })
    },
    Load_ProductList: function (showtype, keyword) {
        var p = "&showtype=" + showtype + "&keyword=" + encodeURI(keyword) + "&t=" + Math.random();
        g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.SearchList), p)
    }
};