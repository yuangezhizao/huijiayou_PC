$(document).ready(function () {

    //控制IndexMain样式
    $("#nav1").parent().hide();
    $("#mainContent").removeClass("main");

    $('#us').click(function () {
        $(this).addClass('curr');
        $('#login').removeClass('curr');
        $('#user').show();
        $('#quick').hide();

        var $ckLogin = $("#ckLogin1");
        CheckRemember($ckLogin);
    });
    $('#login').click(function () {
        $(this).addClass('curr');
        $('#us').removeClass('curr');
        $('#user').hide();
        $('#quick').show();

        var $ckLogin = $("#ckLogin2");
        CheckRemember($ckLogin);
    });
    var $ckLogin = $("#ckLogin1");
    CheckRemember($ckLogin);

    $("#txtUserName,#txtPhone").on("blur", function () {
        if (!isMobile($(this).val())) {
            SetLoginMesaageInfo("txtUserName", g_const_API_Message["7902"]);
            return false;
        }
        SetLoginDefaultInfo("txtUserName", "");
    });
    $("#txtPhone").on("keyup", function () {
        if ($("#txtPhone").val().length == 0) {
            SetLoginNoneInfo("txtPhone");
        }
        else {
            if (!isMobile($(this).val())) {
                SetPhoneLoginMesaageInfo("txtPhone", g_const_API_Message["7902"]);
                return false;
            }
            SetPhoneLoginDefaultInfo("txtPhone");
        }

    });
    $("#txtUserName").on("keyup", function () {
        if ($("#txtUserName").val().length == 0) {
            SetLoginNoneInfo("txtUserName");
        }
    });
    $("#txtUserName,#txtPhone").on('input paste', function (n) {
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

    $("#txtPass").on("keyup", function () {
        if ($("#txtPass").val().length > 6) {
            if ($("#txtPass").val().length == 0) {
                SetLoginMesaageInfo("txtPass", g_const_API_Message["7906"]);
                return false;
            }
            if ($("#txtPass").val().length < 6 || $("#txtPass").val().length > 16 || $("#txtPass").val().indexOf(' ') > -1) {
                SetLoginMesaageInfo("txtPass", g_const_API_Message["7904"]);
                return false;
            }
            SetLoginDefaultInfo("txtPass", "");
        }
        else {
            if ($("#txtPass").val().length == 0) {
                SetLoginNoneInfo("txtPass");
            }
            return false;
        }
    });
    //登录
    $("#btnLogin").on("click", function () {
        AccountLogin.Login();
    });


    //获取验证码
    $("#btnCode").on("click", function () {
        var phoneNo = $("#txtPhone").val();
        var action = "loginvalidcode";
        if (phoneNo.length == 0) {
            //未填写手机号
            //g_const_API_Message["7906"]
            SetPhoneLoginMesaageInfo("txtPhone", "未填写手机号");
            return;
        };
        if (!isMobile(phoneNo)) {
            SetPhoneLoginMesaageInfo("txtPhone", g_const_API_Message["7902"]);
            return;
        }
        Send_ValidCode.SendCode(action, phoneNo);
    });

    //手机登录
    $("#btnPhoneLogin").on("click", function () {


        AccountLogin.PhoneLogin();
    });
    $("#txtUserName,#txtPass").keydown(function (e) {
        if (e.keyCode == 13) {
            AccountLogin.Login();
        }
    });
    $("#txtPhone,#txtCode").keydown(function (e) {
        if (e.keyCode == 13) {
            AccountLogin.PhoneLogin();
        }
    });
});
function CheckRemember(ckObj) {
    var rememberInfo = window.localStorage.getItem(g_const_localStorage.RememberLogin);
    if (rememberInfo) {
        var loginInfo = JSON.parse(rememberInfo);

        var dt_start = new Date(loginInfo.date).AddDays(loginInfo.expire);
        var dt_now = new Date();
        //未过期
        if (dt_start.getTime() > dt_now.getTime()) {
            window.isSuccess = true;
            var phone = loginInfo.phone;
            // ckObj.prop("checked", true);

            //自动登录
            RememberLogin(phone);
            //switch (ckObj.val()) {
            //    case "0":
            //        $("#txtUserName").val(phone);
            //        $("#txtPass").val("abvcagagagaga");
            //        break;
            //    case "1":
            //        $("#txtPhone").val(phone);
            //        break;
            //}
        }
    }
}
function RememberLogin(phone) {
    var purl = g_INAPIUTL;
    var request = $.ajax({
        url: purl,
        cache: false,
        method: g_APIMethod,
        data: "t=" + Math.random() + "&action=remberlogin&username=" + phone + "&password=",
        dataType: g_APIResponseDataType
    });

    request.done(function (msg) {
        if (msg._ResultCode == g_const_Success_Code) {
            var pageurl = PageUrlConfig.BackTo();
            Message.ShowToPage("正在自动登录中...", pageurl, 1000);
            window.localStorage.removeItem(g_const_localStorage.RememberLogin);
        }
        else {
            $("#message").show().html(msg._Description);
        }
    });

    request.fail(function (jqXHR, textStatus) {
        ShowMesaage(g_const_API_Message["7001"]);
    });
}
var AccountLogin = {
    LoginError: {
        "Phone": "",
        "Count": 0
    },
    LoginErrorSet: function (phone) {
        var s = localStorage[g_const_localStorage.LogingError];
        if (typeof (s) != "undefined") {
            var errors = JSON.parse(s);
            for (var i in errors) {
                var e = errors[i];
                if (e.Phone == phone) {
                    ++e.Count;
                }
                else {
                    AccountLogin.LoginError.Phone = phone;
                    AccountLogin.LoginError.Count = 1;
                    errors.push(AccountLogin.LoginError);
                }
            }
            localStorage[g_const_localStorage.LogingError] = JSON.stringify(errors);
        }
        else {
            var errors_list = [];
            AccountLogin.LoginError.Phone = phone;
            AccountLogin.LoginError.Count = 1;
            errors_list.push(AccountLogin.LoginError);
            localStorage[g_const_localStorage.LogingError] = JSON.stringify(errors_list);
        }
    },
    LoginErrorClear: function (phone) {
        var s = localStorage[g_const_localStorage.LogingError];
        if (typeof (s) != "undefined") {
            var errors = JSON.parse(s);
            for (var i in errors) {
                var e = errors[i];
                if (e.Phone == phone) {
                    errors.splice(i, 1);
                }
            }
            localStorage[g_const_localStorage.LogingError] = JSON.stringify(errors);
        }
    },
    LoginErrorGetCount: function (phone) {
        var s = localStorage[g_const_localStorage.LogingError];
        if (typeof (s) != "undefined") {
            var errors = JSON.parse(s);
            for (var i in errors) {
                var e = errors[i];
                if (e.Phone == phone) {
                    return e.Count;
                }
            }
        }
        else
            return 0;
    },
    ShowPicCode: function () {
        var errorCount = AccountLogin.LoginErrorGetCount($("#txtUserName").val());
        if (errorCount >= 3) {
            $("#li_Verify").show();
            $("#Verify_codeImag").attr("src", "/Ajax/LoginHandler.ashx?action=code");
        }
    },
    Login: function () {
        if ($("#txtUserName").val().length == 0 && $("#txtPass").val().length == 0) {
            SetLoginMesaageInfo("txtUserName", g_const_API_Message["7906"]);
            SetLoginMesaageInfo("txtPass", g_const_API_Message["7906"]);
            return false;
        }
        if ($("#txtUserName").val().length == 0) {
            SetLoginMesaageInfo("txtUserName", g_const_API_Message["7902"]);
            return false;
        }
        if (!isMobile($("#txtUserName").val())) {
            SetLoginMesaageInfo("txtUserName", g_const_API_Message["7902"]);
            return false;
        }
        if ($("#txtPass").val().length == 0) {
            SetLoginMesaageInfo("txtPass", g_const_API_Message["7906"]);
            return false;
        }
        if ($("#txtPass").val().length < 6 || $("#txtPass").val().length > 16 || $("#txtPass").val().indexOf(' ') > -1) {
            SetLoginMesaageInfo("txtPass", g_const_API_Message["7904"]);
            return false;
        }
        if (!$("#li_Verify").is(":hidden") && $("#txtPicCode").val().length == 0) {
            SetLoginMesaageInfo("txtPicCode", g_const_API_Message["8904"]);
            return false;
        }
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=userlogin&username=" + String.Replace($("#txtUserName").val()) + "&password=" + String.Replace($("#txtPass").val()) + "&piccode=" + String.Replace($("#txtPicCode").val()),
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg._ResultCode) {
                $("#message").show().html(msg._Description);
            }
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Success_Code) {
                    var $ckLogin = $("#ckLogin1");
                    AccountLogin.Remember($ckLogin);

                    AccountLogin.Load_Result(JSON.parse(msg.resultmessage));
                    if (msg.resultmessage.length > 0) {
                        localStorage[g_const_localStorage.Member] = msg.resultmessage;
                    }
                    AccountLogin.LoginErrorClear($("#txtUserName").val());
                }
                else if (msg.resultcode == "934105102") {
                    AccountLogin.LoginErrorSet($("#txtUserName").val());
                    AccountLogin.ShowPicCode();
                    SetLoginMesaageInfo("txtPass", "密码错误");
                }
                else if (msg.resultcode == "934105101") {
                    $("#message").show().html("不存在的用户名 ，电视用户请用快捷登录");
                }
                else {
                    $("#message").show().html(msg.resultmessage);
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    PhoneLogin: function () {
        if ($("#txtPhone").val().length == 0) {
            SetPhoneLoginMesaageInfo("txtPhone", "请填写手机号");
            return false;
        }
        SetPhoneLoginDefaultInfo("txtPhone");
        if ($("#txtCode").val().length == 0) {
            SetPhoneLoginMesaageInfo("txtCode", "请填写验证码");
            return false;
        }
        SetPhoneLoginDefaultInfo("txtCode");
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=phonelogin&phoneno=" + $("#txtPhone").val() + "&validcode=" + $("#txtCode").val(),
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Success_Code) {

                    var $ckLogin = $("#ckLogin2");
                    AccountLogin.Remember($ckLogin);

                    AccountLogin.Load_Result(JSON.parse(msg.resultmessage));
                }
                else {
                    SetPhoneLoginMesaageInfo("txtCode", msg.resultmessage);
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_Result: function (msg) {
        msg.returnurl = PageUrlConfig.BackTo();
        var str_loginjs = JSON.stringify(msg);
        g_type_loginjs.Execute(str_loginjs);
    },
    ClearInfo: function () {
        $("#txtPass").val("");
        $("#txtUserName").val("");
        $("#mobile").val("");
    },
    Remember: function (ckObj) {
        if (ckObj.is(":checked")) {
            var loginInfo = {
                phone: "",
                expire: 15,
                date: new Date()
            };
            if (ckObj.val() == "0") {
                loginInfo.phone = $("#txtUserName").val();
            }
            if (ckObj.val() == "1") {
                loginInfo.phone = $("#txtPhone").val();

            }
            window.localStorage.setItem(g_const_localStorage.RememberLogin, JSON.stringify(loginInfo));
        }
        else {
            window.localStorage.removeItem(g_const_localStorage.RememberLogin);
        }
    },
};
var Message = {
    ShowToPage: function (message, pageurl, time, str_callback) {
        ShowMesaage(message);
        setTimeout("window.location.replace( \"" + pageurl + "\");", time);
    }
};