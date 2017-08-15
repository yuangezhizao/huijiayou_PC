$(document).ready(function () {
    $("#mainContent").attr("class", "");

    UserLogin.Check("");

    $("#txtPhone").on("keyup", function () {
        if ($.trim($("#txtPhone").val()).length >= 11) {
            var reg = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
            if (!reg.test($.trim($(this).val()))) {
                ShowMesaage("请填入正确的手机号！");
                return false;
            }
        }
    });


    //报名
    $("#btnBaoMing").on("click", function () {
        YY_Act.BaoMing();
    });
});

var YY_Act = {
    BaoMing: function () {
		
        if ($.trim($("#txtUserName").val()).length == 0) {
            ShowMesaage("请填入中文姓名！");
            return false;
        }
		
        if ($.trim($("#txtUserName").val()).length > 10) {
            ShowMesaage("姓名超长了！");
            return false;
        }
        reg = /^([\u4e00-\u9fa5]|[\ufe30-\uffa0])+$/;
        if (!reg.test($.trim($("#txtUserName").val()))) {
            ShowMesaage("请填入中文姓名！");
            return false;
        }

        if ($.trim($("#txtPhone").val()).length == 0) {
            ShowMesaage("请填入手机号！");
            return false;
        }
        var reg = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
        if (!reg.test($.trim($("#txtPhone").val()))) {
            ShowMesaage("请填入正确的手机号！");
            return false;
        }
        $("#loadTip").show();
        var loginname = "";
        if (UserLogin.LoginStatus == g_const_YesOrNo.YES) {
            loginname = UserLogin.LoginName;
        }

        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=YY_ACT&loginname=" + loginname + "&name=" + String.Replace($("#txtUserName").val()) + "&mobile=" + String.Replace($("#txtPhone").val()) + "&actid=1",
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Success_Code) {
                    ShowMesaageShort("报名成功啦，期待您的到来。");
                    $("#txtUserName").val("");
                    $("#txtPhone").val("");

                }
                else {
                    ShowMesaage(msg.resultmessage);
                }
            }
            $("#loadTip").hide();
        });

        request.fail(function (jqXHR, textStatus) {
            $("#loadTip").hide();
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
};
