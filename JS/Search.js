$(document).ready(function () {
    $("#txtSearch").focus();
    //Hotword.GetList();
    if (typeof (web_hotword) != 'undefined') {
        Hotword.GetStaticList();
    }
    else {
        Hotword.GetList();
    }
    $("#txtSearch").on('input paste', function () {
        if ($("#txtSearch").length > 0) {
            Associate.GetList();
        }
        else {
            $("#divAssociate").hide();
        }
    });
    $("#btnSearch").on("click", function () {
        if ($("#txtSearch").val().Trim().length > 0) {
            var p = "&showtype=&keyword=" + encodeURI($("#txtSearch").val()) + "&t=" + Math.random();
            g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.SearchList), p);
        }
        else {
            return false;
        }
    });

    $("#txtSearch").on("keydown", function (e) {
        var event = e || window.event;
        if (event.keyCode == 13) {
            if ($("#txtSearch").val().Trim().length > 0) {
                var p = "&showtype=&keyword=" + encodeURI($("#txtSearch").val()) + "&t=" + Math.random();
                g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.SearchList), p);
            }
            else {
                return false;
            }
        }
    });
});
//加载热词
var Hotword = {
    api_target: "com_cmall_productcenter_service_api_ApiSearchHotword",
    api_input: { "num": "" },
    GetList: function () {
        Hotword.api_input.num = "6";
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
                Hotword.Load_Result(msg.hotwordList);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    GetStaticList: function myfunction() {
        var msg = web_hotword;
        Hotword.Load_Result(msg.hotwordList);
    },
    Load_Result: function (resultlist) {
        var html = "";
        $.each(resultlist, function (i, n) {
            html += "<a class='" + (i == 0 ? 'curr' : '') + "' onclick=\"Hotword.SetSearch('" + n.hotWord + "')\" >" + n.hotWord + "</a> ";
        });
        $("#hotWord").html(html);
    },
    SetSearch: function (keyword) {
        $("#txtSearch").val(keyword);
        var p = "&showtype=&keyword=" + encodeURI($("#txtSearch").val()) + "&t=" + Math.random();
        g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.SearchList), p);
    },
};
//加载联想
var Associate = {
    api_target: "com_cmall_productcenter_service_api_ApiSearchAssociateHjyNew",
    api_input: { "num": "", "baseValue": "", "keyword": "", "associateType": "lxcProductName" },
    GetList: function () {
        if ($("#txtSearch").val().length == 0) {
            $("#divAssociate").empty();
            return;
        }
        Associate.api_input.num = "10";
        Associate.api_input.baseValue = "";
        Associate.api_input.keyword = $("#txtSearch").val();
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

                Associate.Load_Result(msg.searchList);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
      //      ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_Result: function (resultlist) {
        var keyWord = Associate.api_input.keyword;
        var kLength = Associate.api_input.keyword.length;
        var html = "";
        var max = 400 - 2 * 10;
        $.each(resultlist, function (i, n) {
            var oLength = n.associateWord.length;
            var otherWord = n.associateWord.substr(kLength, oLength);
            var now = 13 * oLength;
            if (now > max) {
                var length = parseInt(max / 13);
                otherWord = otherWord.substr(0, length - keyWord.length - 3) + "...";
            }
            html += '<a  onclick="Associate.SetSearch(\'' + n.associateWord + '\')"><i style=" font-weight: bold;">' + keyWord + '</i>' + otherWord + '</a>'
        });
        if (!$("#divAssociate").is(":hidden")) {

            $("#divAssociate").show().html(html);
        }
        else {
            $("#divAssociate").html(html);
        }
    },
    SetSearch: function (keyword) {
        $("#txtSearch").val(keyword);
        var p = "&showtype=&keyword=" + encodeURI($("#txtSearch").val()) + "&t=" + Math.random();
        g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.SearchList), p);
    },
};