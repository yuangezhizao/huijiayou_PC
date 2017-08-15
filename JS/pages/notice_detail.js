

var compaging = {
    //公告列表接口请求参数
    config: {
        page: { limit: 1, offset: 0 }
    },
};


//加在公告列表
var NoticeD = {
    uid:"",
    api_target: "com_cmall_familyhas_api_ApiForAnnounce",
    api_input: {"uid":"","paging": compaging.config.page },
    //公告
    GetList: function () {
        //参数赋值
        NoticeD.api_input.uid = NoticeD.uid;
        NoticeD.api_input.paging = compaging.config.page;
        var s_api_input = JSON.stringify(NoticeD.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": NoticeD.api_target };
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
                NoticeD.Load_Data(msg);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_Data: function (data) {
        if (data.resultCode == 1) {
            var notices = data.announceList;
            //标题
            $("#title11").html(notices[0].title);
            $("#title22").html(notices[0].title);
            //更新日期
            $("#time11").html("发表于 "+notices[0].update_time);
            //内容
            $("#contenf11").html(notices[0].content);
        }
    },
};

var page = 0;
$(document).ready(function () {

    NoticeD.uid = GetQueryString("uid");
    page = GetQueryString("page");

    //返回公告列表
    $("#tonoticelist").on("click", function () {
        //PageUrlConfig.SetUrl(g_const_PageURL.MainIndex + "?u=NoticeDetail&page=" + page);
        //var p = "&t=" + Math.random();
        //g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.NoticeList), p);
        window.location.href = g_const_PageURL.MainIndex + "?u=NoticeList&page=" + page + "t=" + Math.random()

    });
    //首页
    $("#toindex").on("click", function () {
        //PageUrlConfig.SetUrl(g_const_PageURL.MainIndex + "?u=NoticeDetail&page=" + page);
        //var p = "&t=" + Math.random();
        //g_index.GoTo(g_const_PageURL.Index, p);
        window.location.href = g_const_PageURL.Index + "?t=" + Math.random()

    });


    if (NoticeD.uid != "") {
        NoticeD.GetList();
    }
    else {
       // window.location.replace(_const_PageURL.MainIndex + "?u=NoticeList&t=" + Math.random());
        window.location.href = g_const_PageURL.MainIndex + "?u=NoticeList&page=" + page + "&t=" + Math.random()

        //$("#tonoticelist").click();
    }
});
