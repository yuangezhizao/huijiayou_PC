$(document).ready(function () {
    $("#btnResetPassword").click(function () {
        if ($("#txtPhoneNo").val().length == 0) {
            ShowMesaage("请填写登录手机号");
            return;
        }
        if ($("#txtValidCode").val().length == 0) {
            ShowMesaage("请填写验证码");
            return;
        }
        if ($("#txtPass").val().length == 0) {
            ShowMesaage("请填写登录密码");
            return;
        }
        // Password.Reset()
        Password_Ichsy.SendCode($("#txtPhoneNo").val(), $("#txtPass").val(), $("#txtValidCode").val());
    });
    $("#btnCode").click(function () {
        var phoneNo = $("#txtPhoneNo").val();
        //var action = "resetpasswordvalidcode";
        var action = "forgetpassword";
        if (phoneNo.length == 0) {
            ShowMesaage("请填写手机号码");
            return;
        }
        if (!isMobile(phoneNo)) {
            ShowMesaage("请填写正确的手机号码");
            return;
        }
        Send_IchsyValidCode.SendCode(action, phoneNo);
        Send_IchsyValidCode.stime(10);
    });
});
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
            ShowMesaage("系统繁忙,请稍后再试.");
        });
    },
    Load_Result: function () {
        ShowMesaage("重新设置密码成功。");
        if (localStorage.getItem(g_const_localStorage.BackURL).length > 0) {
            location.href = localStorage.getItem(g_const_localStorage.BackURL);
        }
        else {
            location.href = "/";
        }
    },
};

//加载热词
var Password_Ichsy = {
    api_target: "com_cmall_groupcenter_third_api_GroupForgetPasswordApi",
    api_input: { "login_name": "", "client_source": "", "password": "", "verify_code": "" },
    SendCode: function (phoneno, password, validcode) {
        Password_Ichsy.api_input.login_name = phoneno;
        Password_Ichsy.api_input.client_source = "site";
        Password_Ichsy.api_input.password = password;
        Password_Ichsy.api_input.verify_code = validcode;
        var s_api_input = JSON.stringify(Password_Ichsy.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": Password_Ichsy.api_target };
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
                Password_Ichsy.Load_Result();
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage("系统繁忙,请稍后再试.");
        });
    },
    Load_Result: function () {
        localStorage[g_const_localStorage.BackURL] = "/index.html";
        Message.ShowToPage("密码修改成功，请重新登录.", "/login.html", 2000, "");
    }
};