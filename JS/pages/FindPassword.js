/// <reference path="../functions/g_Const.js" />
/// <reference path="../functions/g_Type.js" />
/// <reference path="../g_header.js" />
/// <reference path="../jquery-2.1.4.js" />
/// <reference path="ValidCodeBase.js" />
var verifyFlag = g_const_SMSPic_Flag;
var smstype = 5
//$(document).ready(UserLogin.Check(function () {
//    if (verifyFlag == 1) {
//        $("#li_Verify").show();
//        $("#Verify_codeImag").attr("src", "/Ajax/LoginHandler.ashx?action=code");

//    }
//    else {
//        $("#li_Verify").hide();
//        $("#Verify_codeImag").attr("src", "");
//    }
//    if (document.referrer.indexOf("MyAccount.html") > 0) {
//        $("#titleshowname").html("修改密码");
//    }

//    $(".d_go_back").click(function () {
//        history.back();
//        //window.location.replace(PageUrlConfig.BackTo(1));

//    });
//    //$(".d_go_back").on("tap", function () {
//    //    history.back();
//    //});

//    if (UserLogin.LoginStatus == g_const_YesOrNo.YES) {
//        $("#txtPhoneNo").attr("readonly", true);
//        var sloginmember = localStorage[g_const_localStorage.Member];
//        var loginmember = null;
//        if (typeof (sloginmember) != "undefined") {
//            loginmember= JSON.parse(sloginmember);
//        }
//        if (loginmember != null) {
//            var phoneno = loginmember.Member.phone;
//            if (phoneno.length == 11) {
//                phoneno = phoneno.substr(0, 3) + "****" + phoneno.substr(7, 4);
//            }
//            $("#txtPhoneNo").val(phoneno);
//        }
//        else {
//            $("#txtPhoneNo").css("display", "none");
//            Message.ShowToPage(g_const_API_Message["100001"], g_const_PageURL.Login, 2000, "");
//        }
//    }
//    else
//        $("#txtPhoneNo").val("");

//    $("#btnResetPassword").click(function () {
//        if ($("#txtPhoneNo").val().length == 0 && UserLogin.LoginStatus == g_const_YesOrNo.NO) {
//            ShowMesaage(g_const_API_Message["7901"]);
//            return;
//        }
//        if ($("#txtValidCode").val().length == 0) {
//            ShowMesaage(g_const_API_Message["7802"]);
//            return;
//        }
//        if ($("#txtPass").val().length == 0) {
//            ShowMesaage(g_const_API_Message["7903"]);
//            return;
//        }
//        if ($("#txtPass").val().Trim().length < 6 || $("#txtPass").val().Trim().length > 16) {
//            ShowMesaage(g_const_API_Message["100044"]);
//            return;
//        }
//        if ($("#txtPass").val().length < 6 || $("#txtPass").val().length > 16 || $("#txtPass").val().indexOf(' ') > -1) {
//            ShowMesaage(g_const_API_Message["7904"]);
//            return;
//        }
//        Password.Reset();

//        //Password_Ichsy.SendCode($("#txtPhoneNo").val(), $("#txtPass").val(), $("#txtValidCode").val());
//    });
//    $("#btnCode").click(function () {
//        var phoneNo = $("#txtPhoneNo").val();
//        var action = "resetpasswordvalidcode";
//        var piccode = $("#txtPicCode").val();
//        if (verifyFlag == 1) {
//            if (piccode.length == 0) {
//                ShowMesaage(g_const_API_Message["8904"]);
//                return;
//            }
//        }
//        //var action = "forgetpassword";
//        if (phoneNo.length == 0 && UserLogin.LoginStatus == g_const_YesOrNo.NO) {
//            ShowMesaage(g_const_API_Message["7901"]);
//            return;
//        }
//        if (!isMobile(phoneNo) && UserLogin.LoginStatus == g_const_YesOrNo.NO) {
//            ShowMesaage(g_const_API_Message["7902"]);
//            return;
//        }
//        Send_ValidCode.SendCodeImgEx(action, phoneNo, piccode, smstype);
//        //Send_ValidCode.stime(g_const_ValidCodeTime);
//    });

//    //密码是否可见
//    $("#d_emp").click(function () {
//        if ($("#txtPass").attr("type") == "password") {
//            //密码可见
//            $("#txtPass").attr("type", "text");
//            $("#d_emp").removeClass("d_emp");
//        }
//        else {
//            //密码隐藏
//            $("#txtPass").attr("type", "password");
//            $("#d_emp").attr("class", "d_emp");
//        }
//    });
//}));
//重置密码
var FindPassword = {
    Init: function () {
        //控制IndexMain样式
        $("#nav1").parent().hide();
        $("#mainContent").removeClass("main");

        $("#step1").show();
        $("#ul_top").attr("class", "u1");
        $("#step2").hide();
        $("#step3").hide();
        if (verifyFlag == 1) {
            $("#li_Verify").show();
            $("#Verify_codeImag").attr("src", "/Ajax/LoginHandler.ashx?action=code");

        }
        else {
            $("#li_Verify").hide();
            $("#Verify_codeImag").attr("src", "");
        }

        $("#txtPhoneNo").on("blur", function () {
            $("#span_msg").show();
            var phoneNo = $("#txtPhoneNo").val();
            if (phoneNo.length == 0 && UserLogin.LoginStatus == g_const_YesOrNo.NO) {
                $("#txtPhoneNo").attr("class", "curr");
                $("#span_msg").html(g_const_API_Message["7901"]);
                return;
            }
            else {
                $("#txtPhoneNo").attr("class", "");
            }
            if (!isMobile(phoneNo) && UserLogin.LoginStatus == g_const_YesOrNo.NO) {
                $("#txtPhoneNo").attr("class", "curr");
                $("#span_msg").html(g_const_API_Message["7902"]);
                return;
            }
            else {
                $("#txtPhoneNo").attr("class", "");
            }
            $("#span_msg").hide();
        });
        $("#txtPhoneNo").on('input paste', function (n) {
            var userName = $(this).val();
            var length = userName.length;
            for (var i = 0; i < length; i++) {
                var item = userName[i];
                if (!isIntegerOrNull(item)) {
                    $(this).val(userName.replace(item, ""));
                    return false;
                }
            }
        });

        $("#btnCode").click(function () {
            var phoneNo = $("#txtPhoneNo").val();
            var action = "resetpasswordvalidcode";
            var piccode = $("#txtPicCode").val();
            $("#span_msg").show();
            if (phoneNo.length == 0 && UserLogin.LoginStatus == g_const_YesOrNo.NO) {
                $("#txtPhoneNo").attr("class", "curr");
                $("#span_msg").html(g_const_API_Message["7901"]);
                return;
            }
            else {
                $("#txtPhoneNo").attr("class", "");
            }
            if (!isMobile(phoneNo) && UserLogin.LoginStatus == g_const_YesOrNo.NO) {
                $("#txtPhoneNo").attr("class", "curr");
                $("#span_msg").html(g_const_API_Message["7902"]);
                return;
            }
            else {
                $("#txtPhoneNo").attr("class", "");
            }
            if (verifyFlag == 1) {
                if (piccode.length == 0) {
                    $("#txtPicCode").attr("class", "text curr");
                    $("#span_msg").html(g_const_API_Message["8904"]);
                    return;
                }
                else {
                    $("#txtPicCode").attr("class", "text");
                }
            }
            //var action = "forgetpassword";


            Send_ValidCode.SendCodeImgEx(action, phoneNo, piccode, smstype);
            //Send_ValidCode.stime(g_const_ValidCodeTime);
        });
        $("#btnResetPassword").click(function () {
            $("#span_msgpass").show();
            //if ($("#txtPhoneNo").val().length == 0 && UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            //    $("#span_msgpass").html(g_const_API_Message["7901"]);
            //    return;
            //}
            //if ($("#txtValidCode").val().length == 0) {
            //    $("#span_msgpass").html(g_const_API_Message["7802"]);
            //    return;
            //}
            if ($("#txtPass").val().length == 0) {
                $("#txtPass").attr("class", "curr");
                $("#span_msgpass").html(g_const_API_Message["7903"]);
                return;
            }
            else {
                $("#txtPass").attr("class", "");
            }
            if ($("#txtPass").val().Trim().length < 6 || $("#txtPass").val().Trim().length > 16) {
                $("#txtPass").attr("class", "curr");
                $("#span_msgpass").html(g_const_API_Message["100044"]);
                return;
            }
            else {
                $("#txtPass").attr("class", "");
            }
            if ($("#txtPass").val().length < 6 || $("#txtPass").val().length > 16 || $("#txtPass").val().indexOf(' ') > -1) {
                $("#txtPass").attr("class", "curr");
                $("#span_msgpass").html(g_const_API_Message["7904"]);
                return;
            }
            else {
                $("#txtPass").attr("class", "");
            }
            if ($("#txtPassComfrim").val().length == 0) {
                $("#txtPassComfrim").attr("class", "curr");
                $("#span_msgpass").html(g_const_API_Message["7907"]);
                return;
            }
            else {
                $("#txtPassComfrim").attr("class", "");
            }
            if ($("#txtPassComfrim").val() != $("#txtPass").val()) {
                $("#txtPassComfrim").attr("class", "curr");
                $("#span_msgpass").html(g_const_API_Message["7908"]);
                return;
            }
            else {
                $("#txtPassComfrim").attr("class", "");
            }
            $("#span_msgpass").hide();
            FindPassword.Reset();

            //Password_Ichsy.SendCode($("#txtPhoneNo").val(), $("#txtPass").val(), $("#txtValidCode").val());
        });
        $("#btnNext").click(function () {
            $("#span_msg").show();
            var phoneNo = $("#txtPhoneNo").val();
            if (phoneNo.length == 0 && UserLogin.LoginStatus == g_const_YesOrNo.NO) {
                $("#txtPhoneNo").attr("class", "curr");
                $("#span_msg").html(g_const_API_Message["7901"]);
                return;
            }
            else {
                $("#txtPhoneNo").attr("class", "");
            }
            if (!isMobile(phoneNo) && UserLogin.LoginStatus == g_const_YesOrNo.NO) {
                $("#txtPhoneNo").attr("class", "curr");
                $("#span_msg").html(g_const_API_Message["7902"]);
                return;
            }
            else {
                $("#txtPhoneNo").attr("class", "");
            }
            if ($("#txtValidCode").val().length == 0) {
                $("#txtValidCode").attr("class", "text curr");
                $("#span_msg").html(g_const_API_Message["7802"]);
                return;
            }
            else {
                $("#txtValidCode").removeClass("curr");
            }

            $("#hidPhoneNo").val($("#txtPhoneNo").val());
            $("#hidValidCode").val($("#txtValidCode").val());
            FindPassword.Valid();
        });
        $("#btnLogin").click(function () {
            var p = "&t=" + Math.random();
            g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.Login), p);
        });
    },
    Reset: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=passwordreset&phoneno=" + $("#hidPhoneNo").val() + "&password=" + $("#txtPass").val(),
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Success_Code_IN) {
                    FindPassword.Load_Result();
                    $("#span_msg").hide();
                }
                else {
                    $("#span_msg").html(msg.resultmessage);
                }
            }

        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Valid: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=passwordresetvalid&phoneno=" + $("#hidPhoneNo").val() + "&validcode=" + $("#hidValidCode").val(),
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Success_Code_IN) {
                    $("#step1").hide();
                    $("#step2").show();
                    $("#ul_top").attr("class", "u2");
                    $("#step3").hide();
                    $("#span_msg").hide();
                }
                    //验证码错误
                else if (msg.resultcode == '8801' || msg.resultcode == '8802') {
                    $("#span_msg").html(msg.resultmessage);
                    $("#txtValidCode").attr("class", "text curr");
                }
                else {
                    $("#span_msg").html(msg.resultmessage);
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
        //if (UserLogin.LoginStatus == g_const_YesOrNo.YES) {
        $("#step1").hide();
        $("#step2").hide();
        $("#step3").show();
        $("#ul_top").attr("class", "u3");
        // Message.ShowToPage(g_const_API_Message["7003"], g_const_PageURL.MainIndex + "?u=" + g_const_PageURL.GetKey(g_const_PageURL.AccountIndex), 2000, "");
        // }
        // else
        //     Message.ShowToPage(g_const_API_Message["7003"], g_const_PageURL.MainIndex + "?u=" + g_const_PageURL.GetKey(g_const_PageURL.Login), 2000, "");
    },
};