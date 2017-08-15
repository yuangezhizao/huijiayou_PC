$(function () {
    FriendLinks.GetData();
});
var FriendLinks = {
    api_target: "com_cmall_homepool_api_ApiForFriendLinks",
    api_input: { version: "" },
    GetData: function () {
        var s_api_input = JSON.stringify(this.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": this.api_target };
        var purl = g_Help_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultCode == g_const_Success_Code) {
                FriendLinks.LoadResult(msg.messList);
            }
            else {
              //  ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    LoadResult: function (result) {
        $("#friendLinkList").empty();
        var html = "友情链接：";
        $(result).each(function () {
            html += ' <a href="' + this.detail_url + '"  target="_blank">' + this.category_note + '</a>';
        });
        $("#friendLinkList").html(html);
    }
};