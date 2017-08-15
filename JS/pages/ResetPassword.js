/// <reference path="../functions/g_Const.js" />
/// <reference path="../functions/g_Type.js" />
/// <reference path="../g_header.js" />
/// <reference path="../jquery-2.1.4.js" />
/// <reference path="ValidCodeBase.js" />

$(document).ready(UserLogin.Check(function () {
    if (document.referrer.indexOf("MyAccount.html") > 0) {
        $("#titleshowname").html("修改密码");
    }

    $(".d_go_back").click(function () {
        history.back();
        //window.location.replace(PageUrlConfig.BackTo(1));

    });
    //$(".d_go_back").on("tap", function () {
    //    history.back();
    //});

    if (UserLogin.LoginStatus == g_const_YesOrNo.YES) {
        $("#txtPhoneNo").attr("readonly", true);
        var sloginmember = localStorage[g_const_localStorage.Member];
        var loginmember = null;
        if (typeof (sloginmember) != "undefined") {
            loginmember= JSON.parse(sloginmember);
        }
        if (loginmember != null) {
            var phoneno = loginmember.Member.phone;
            if (phoneno.length == 11) {
                phoneno = phoneno.substr(0, 3) + "****" + phoneno.substr(7, 4);
            }
            $("#txtPhoneNo").val(phoneno);
        }
        else {
            $("#txtPhoneNo").css("display", "none");
            Message.ShowToPage(g_const_API_Message["100001"], g_const_PageURL.Login, 2000, "");
        }
    }
    else
        $("#txtPhoneNo").val("");

    $("#btnResetPassword").click(function () {
        if ($("#txtPhoneNo").val().length == 0 && UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            ShowMesaage(g_const_API_Message["7901"]);
            return;
        }
        if ($("#txtValidCode").val().length == 0) {
            ShowMesaage(g_const_API_Message["7802"]);
            return;
        }
        if ($("#txtPass").val().length == 0) {
            ShowMesaage(g_const_API_Message["7903"]);
            return;
        }
        if ($("#txtPass").val().Trim().length < 6 || $("#txtPass").val().Trim().length > 16) {
            ShowMesaage(g_const_API_Message["100044"]);
            return;
        }
        if ($("#txtPass").val().length < 6 || $("#txtPass").val().length > 16 || $("#txtPass").val().indexOf(' ') > -1) {
            ShowMesaage(g_const_API_Message["7904"]);
            return;
        }
        Password.Reset();
        
        //Password_Ichsy.SendCode($("#txtPhoneNo").val(), $("#txtPass").val(), $("#txtValidCode").val());
    });
    $("#btnCode").click(function () {
        var phoneNo = $("#txtPhoneNo").val();
        var action = "resetpasswordvalidcode";
        //var action = "forgetpassword";
        if (phoneNo.length == 0 && UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            ShowMesaage(g_const_API_Message["7901"]);
            return;
        }
        if (!isMobile(phoneNo) && UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            ShowMesaage(g_const_API_Message["7902"]);
            return;
        }
        Send_ValidCode.SendCode(action, phoneNo);
        //Send_ValidCode.stime(g_const_ValidCodeTime);
    });

    //密码是否可见
    $("#d_emp").click(function () {
        if ($("#txtPass").attr("type") == "password") {
            //密码可见
            $("#txtPass").attr("type", "text");
            $("#d_emp").removeClass("d_emp");
        }
        else {
            //密码隐藏
            $("#txtPass").attr("type", "password");
            $("#d_emp").attr("class", "d_emp");
        }
    });
}));
//重置密码
var Password = {
    Reset: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=passwordreset&phoneno=" + $("#txtPhoneNo").val() + "&validcode=" + $("#txtValidCode").val() + "&password=" + $("#txtPass").val(),
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Success_Code) {
                    Password.Load_Result();
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
    Load_Result: function () {
        //if (localStorage.getItem(g_const_localStorage.BackURL).length > 0) {
        //    pageurl = localStorage.getItem(g_const_localStorage.BackURL);
        //}
        //else {
        //    pageurl = "/";
        //}
        if (UserLogin.LoginStatus == g_const_YesOrNo.YES)
            Message.ShowToPage(g_const_API_Message["7003"], g_const_PageURL.AccountIndex, 2000, "");
        else
            Message.ShowToPage(g_const_API_Message["7003"], g_const_PageURL.Login, 2000, "");
    },
};