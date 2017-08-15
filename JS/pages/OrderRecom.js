$(document).ready(function () {
    $("#btnSave").click(function () {
        

        if ($("#txtPhone").val().length == 0) {
            ShowMesaage(g_const_API_Message["100032"]);
            return;
        }
        if (!isMobile($("#txtPhone").val())) {
            ShowMesaage(g_const_API_Message["7902"]);
            return;
        }
        //获得登录手机号
        UserLogin.Check(Recommend.CheckResult);
    });
    //取消操作
    //$(".btns a").on("click", function (e) {
    //    var objthis = e.target;
    //    switch ($(objthis).attr("operate")) {
    //        case "no":
    //            //返回提交前的页面
    //            history.back;
    //            break;
    //        case "yes":
    //            $("#mask").css("display", "none");
    //            $(".fbox.ftel").css("display", "none");
    //            break;
    //    }
    //});
    //返回
    $("#btnBack").click(function () {
        Message.ShowConfirm("确定不填写推荐人吗？", "仅有这一次机会哦~", "divAlert", "确定", "Recommend.GiveUp", "取消");
        //$("#mask").css("display", "block");
        //$(".fbox.ftel").css("display", "");
    });
    //返回
    $("#btnOver").click(function () {
        Message.ShowConfirm("确定不填写推荐人吗？", "仅有这一次机会哦~", "divAlert", "确定", "Recommend.GiveUp", "取消");
    });
});
var Recommend = {
    CheckResult: function () {
        if (UserLogin.LoginName == $("#txtPhone").val()) {
            ShowMesaage(g_const_API_Message["100045"]);
            return;
        }
        else {
            Recommend.SetParent();
        }
    },
    SetParent: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=setrecom&phoneno=" + $("#txtPhone").val(),
            dataType: "json"
        });
        request.done(function (msg) {
            if (msg.resultcode == g_const_Success_Code) {
                $("#btnOver").hide();
                Message.ShowToPage(g_const_API_Message["100033"], g_const_PageURL.AccountIndex, 2000, "");
            }
            else {
                if (msg.resultmessage.indexOf("已有上级") > 0) {
                    ShowMesaage(g_const_API_Message["100046"]);
                }
                else {
                    ShowMesaage(msg.resultmessage);
                }
                
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    GiveUp: function () {
        localStorage[g_const_localStorage.IsnewReg] = "0";
        window.location.replace(g_const_PageURL.AccountIndex + "?t=" + Math.random());//localStorage.getItem(g_const_localStorage.BackURL);
    }
};