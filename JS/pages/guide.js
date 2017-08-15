var guidelist = "{\"list\":[";
guidelist += "{\"start_time\":\"2014-10-01 00:00:00\",\"end_time\":\"2015-10-01 00:00:00\",\"ImgPath\":\"/img/w_img/guide.png\",\"TitleStr\":\"买买买买\"},";
guidelist += "{\"start_time\":\"2015-10-01 00:00:00\",\"end_time\":\"2015-10-08 00:00:00\",\"ImgPath\":\"/img/w_img/guide_pwjj.png\",\"TitleStr\":\"品味家居\"},";
guidelist += "{\"start_time\":\"2015-10-08 00:00:00\",\"end_time\":\"2015-10-15 00:00:00\",\"ImgPath\":\"/img/w_img/guide_yxtm.png\",\"TitleStr\":\"优选特卖\"},";
guidelist += "{\"start_time\":\"2015-10-15 00:00:00\",\"end_time\":\"2015-10-22 00:00:00\",\"ImgPath\":\"/img/w_img/guide_pwjj.png\",\"TitleStr\":\"购物返利\"},";
guidelist += "{\"start_time\":\"2015-10-22 00:00:00\",\"end_time\":\"2015-11-01 00:00:00\",\"ImgPath\":\"/img/w_img/guide_pwjj.png\",\"TitleStr\":\"限时抢购\"}";
guidelist += "]}";
function SetHtmlByDate() {
    //var JsonGuidelist = JSON.parse(guidelist);
    //var DateNow = new Date().getTime();
    //var DateStart = new Date().getTime();
    //var DateEnd = new Date().getTime();
    //$("#sp_guide").html("买买买买");
    //$.each(JsonGuidelist.list, function (i, n) {
    //    DateStart = new Date(n.start_time.replace(/-/g, "/"));
    //    DateEnd = new Date(n.end_time.replace(/-/g, "/"));
    //    if (DateNow > DateStart && DateNow < DateEnd) {
    //        $("#sp_guide").html(n.TitleStr);
    //        if ($("#img_guide")) {
    //            $("#img_guide").attr("src", n.ImgPath);
    //        }
    //    }
    //});
    
    Guide.Main();
}

var Guide = {
    Main: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getguideconfig&shopid=hjy",
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.list) {
                if (localStorage[g_const_localStorage.OrderFrom] == "wy" || GetQueryString("exchange")=="1") {
                    $("#sp_guide").html("\"摇一摇\"立获30元红包");
                }
                else {
                    $("#sp_guide").html(msg.list[0].TitleStr);
                }
                if ($("#img_guide")) {
                    //alert(GetQueryString("exchange"));
                    if (localStorage[g_const_localStorage.OrderFrom] == "wy" || GetQueryString("exchange") == "1") {
                        $("#img_guide").attr("src", "/img/w_img/guide_yyy.png");
                    }
                    else {
                        $("#img_guide").attr("src", msg.list[0].ImgPath);
                    }
                    
                   // 
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
        });
    },
};