/// <reference path="../functions/AccountMenu.js" />
/// <reference path="../functions/g_Const.js" />
/// <reference path="../functions/g_Type.js" />
/// <reference path="../jquery-2.1.4.js" />
/// <reference path="../g_header.js" />
/// <reference path="../main.js" />

//重置密码
var InResetPassword = {
    MenuName: "修改密码",
    Init: function () {
        AccountMenu.ShowMenu("div.home ul.fl", "#tpl_menu", InResetPassword.MenuName);
        UserLogin.Check(InResetPassword.ShowInfo);

        $("#btn_getsmscode").on("click", function () {
            if ($(this).attr("disabled") != "disabled") {
                //调用发送短信接口
                UserLogin.Check(InResetPassword.SendSMS);
            }
        });

        $("#btn_resetpassword").on("click", function () {
            InResetPassword.PageInit();
            if ($("#txtValidCode").val().length == 0) {
                $("#spanValidCode").css("display", "");
                $("#spanValidCode").addClass("s1");
                $("#txtValidCode").addClass("curr");
                $("#spanValidCode").html(g_const_API_Message["7802"]);
                $("#txtValidCode").focus();
                return;
            }
            if ($("#txtPass").val().length == 0) {
                $("#spanPass").css("display", "");
                $("#spanPass").addClass("s1");
                $("#txtPass").addClass("curr");
                $("#spanPass").html(g_const_API_Message["7903"]);
                $("#txtPass").focus();
                return;
            }
            if ($("#txtPass").val().Trim().length < 6 || $("#txtPass").val().Trim().length > 16 || $("#txtPass").val().indexOf(' ') > -1) {
                $("#spanPass").css("display", "");
                $("#spanPass").addClass("s1");
                $("#txtPass").addClass("curr");
                $("#spanPass").html(g_const_API_Message["100044"]);
                $("#txtPass").focus();
                return;
            }
            if ($("#txtPassc").val().length == 0) {
                $("#spanPassc").css("display", "");
                $("#spanPassc").addClass("s1");
                $("#txtPassc").addClass("curr");
                $("#spanPassc").html(g_const_API_Message["7907"]);
                $("#txtPassc").val("");
                $("#txtPassc").focus();
            }
            if ($("#txtPass").val() != $("#txtPassc").val()) {
                $("#spanPassc").css("display", "");
                $("#spanPassc").addClass("s1");
                $("#txtPassc").addClass("curr");
                $("#spanPassc").html(g_const_API_Message["7908"]);
                $("#txtPassc").val("");
                $("#txtPassc").focus();
                return;
            }

            $("#spanValidCode").empty();
            $("#spanValidCode").css("display", "none");
            $("#spanPass").empty();
            $("#spanPass").css("display", "");
            $("#spanPassc").empty();
            $("#spanPassc").css("display", "");
            var senddata = {
                action: "passwordupdate",
                phoneno: "",
                validcode: $("#txtValidCode").val(),
                password: $("#txtPass").val(),
            };

            g_type_self_api.LoadData(senddata, InResetPassword.Reset, "");

        });
    },
    Reset: function (msg) {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=userlogout",
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultcode == g_const_Success_Code) {
                InResetPassword.Logout();
            }
            else {
                ShowMesaage(msg.resultmessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
        
    },
    Logout: function () {
        Message.ShowToPage("密码修改成功。", g_const_PageURL.GetLink(g_const_PageURL.Login), 2000, "");
    },
    PageInit: function () {
        $("#spanValidCode").css("display", "none");
        $("#spanValidCode").removeClass("s1");
        $("#txtValidCode").removeClass("curr");
        $("#spanPass").css("display", "none");
        $("#spanPass").removeClass("s1");
        $("#txtPass").removeClass("curr");
        $("#spanPassc").css("display", "none");
        $("#spanPassc").removeClass("s1");
        $("#txtPassc").removeClass("curr");
    },

    ShowInfo: function () {
        if (UserLogin.LoginStatus == g_const_YesOrNo.YES) {
            var phoneno = UserLogin.LoginName;
            if (phoneno.length == 11) {
                phoneno = phoneno.substr(0, 3) + "****" + phoneno.substr(7, 4);
            }

            $("#mobleno").html("<b>手机号</b>" + phoneno);
        }
        else
            Message.ShowToPage("", g_const_PageURL.GetLink(g_const_PageURL.Login), 100, "");
    },
    SendSMS: function () {
        if (UserLogin.LoginStatus == g_const_YesOrNo.YES) {
            var objsenddata = {
                action: "resetpasswordvalidcode",
                mobileno: ""
            };
            g_type_self_api.LoadData(objsenddata, InResetPassword.AfterSendSMS, "");
        }
        else
            Message.ShowToPage("", g_const_PageURL.GetLink(g_const_PageURL.Login), 100, "");
    },
    //短信发送完毕 
    AfterSendSMS: function (msg) {
        //alert("短信发送成功");
        //等待时间（秒）
        var seconds = 70;
        time(seconds);
    },
};