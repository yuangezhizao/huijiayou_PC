var verifyFlag = g_const_SMSPic_Flag;
var smstype = 4
$(document).ready(function () {
    if (verifyFlag == 1) {
        $("#li_Verify").show();
        $("#Verify_codeImag").attr("src", "/Ajax/LoginHandler.ashx?action=code");

    }
    else {
        $("#li_Verify").hide();
        $("#Verify_codeImag").attr("src", "");
    }
    //控制IndexMain样式
    $("#nav1").parent().hide();
    $("#mainContent").removeClass("main");

    $("#txtPhoneNo").on("blur", function () {
        if (!isMobile($(this).val())) {
            SetRegisterMesaageInfo("emPhoneNo", "txtPhoneNo", g_const_API_Message["7902"]);
            return false;
        }
        //Register.PhoneCheck();
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
    $("#txtPass").on("blur", function () {
        if ($("#txtPass").val().length == 0) {
            SetRegisterMesaageInfo("emPass", "txtPass", g_const_API_Message["7903"]);
            return;
        }
        if ($("#txtPass").val().length < 6 || $("#txtPass").val().length > 16 || $("#txtPass").val().indexOf(' ') > -1) {
            SetRegisterMesaageInfo("emPass", "txtPass", g_const_API_Message["7904"]);
            return;
        }
        $("#emPass").html("").removeClass("e1").removeClass("e2").show();
        $(this).removeClass("curr");
    });
    $("#txtPassConfirm").on("blur", function () {
        if ($("#txtPassConfirm").val().length == 0) {
            SetRegisterMesaageInfo("emPassConfirm", "txtPassConfirm", g_const_API_Message["7907"]);
            $("#txtValidCode").focus();
            return;
        }
        if ($("#txtPassConfirm").val() != $("#txtPass").val()) {
            SetRegisterMesaageInfo("emPassConfirm", "txtPassConfirm", g_const_API_Message["7908"]);
            $("#txtValidCode").focus();
            return;
        }
        $("#emPassConfirm").html("").removeClass("e1").show();
        $(this).removeClass("curr");
    });

    $("#btnPhoneRegister").click(function () {
        PhoneRegisterV();
    });
    $("#btnCode").click(function () {
        var phoneNo = $("#txtPhoneNo").val();
        var action = "registervalidcode";
        if (phoneNo.length == 0) {
            SetRegisterMesaageInfo("emPhoneNo", "txtPhoneNo", g_const_API_Message["7902"]);
            return;
        }
        if (!isMobile(phoneNo)) {
            SetRegisterMesaageInfo("emPhoneNo", "txtPhoneNo", g_const_API_Message["7902"]);
            return;
        }
        var piccode = $("#txtPicCode").val();
        if (verifyFlag == 1) {
            if (piccode.length == 0) {
                SetRegisterMesaageInfo("emPicCode", "txtPicCode", g_const_API_Message["8904"]);
                $("#txtPicCode").attr("class", "text curr");
                //$("#span_msg").html(g_const_API_Message["8904"]);
                return;
            }
            else {
                $("#txtPicCode").attr("class", "text");
            }
        }
        $("em").hide();
        $("input[class=curr]").removeClass("curr");

        Register.PhoneCheck();
        //Send_ValidCode.stime(g_const_ValidCodeTime);
    });

    $("#btnAgree").on("click", function () {
        var checked = $(this).prop("checked");
        if (checked == false) {
            $("#btnPhoneRegister").unbind();
            $("#btnPhoneRegister").css("background", " #aaa");
        }
        else {
            $("#btnPhoneRegister").on("click", function () {
                PhoneRegisterV();
            });
            $("#btnPhoneRegister").css("background", " #dc0f50");
        }
    });
});
function PhoneRegisterV() {
    if ($("#txtPhoneNo").val().length == 0) {
        SetRegisterMesaageInfo("emPhoneNo", "txtPhoneNo", g_const_API_Message["7902"]);
        return;
    }
    if (!isMobile($("#txtPhoneNo").val())) {
        SetRegisterMesaageInfo("emPhoneNo", "txtPhoneNo", g_const_API_Message["7902"]);
        return;
    }
    if (verifyFlag == 1) {
        if ($("#txtPicCode").val().length == 0) {
            $("#txtPicCode").attr("class", "text curr");
            //$("#span_msg").html(g_const_API_Message["8904"]);
            SetRegisterMesaageInfo("emPicCode", "txtPicCode", g_const_API_Message["8904"]);

            return;
        }
        else {
            $("#txtPicCode").attr("class", "text");
        }
    }

    $("em").hide();
    $("input[class=curr]").removeClass("curr");
    if ($("#txtPass").val().length == 0) {
        SetRegisterMesaageInfo("emPass", "txtPass", g_const_API_Message["7903"]);
        return;
    }
    if ($("#txtPass").val().length < 6 || $("#txtPass").val().length > 16 || $("#txtPass").val().indexOf(' ') > -1) {
        SetRegisterMesaageInfo("emPass", "txtPass", g_const_API_Message["7904"]);
        return;
    }
    $("em").hide();
    $("input[class=curr]").removeClass("curr");
    if ($("#txtPassConfirm").val().length == 0) {
        SetRegisterMesaageInfo("emPassConfirm", "txtPassConfirm", g_const_API_Message["7907"]);
        return;
    }
    if ($("#txtPassConfirm").val() != $("#txtPass").val()) {
        SetRegisterMesaageInfo("emPassConfirm", "txtPassConfirm", g_const_API_Message["7908"]);
        return;
    }
    $("em").hide();
    $("input[class=curr]").removeClass("curr");
    if ($("#txtValidCode").val().length == 0) {
        //
        SetRegisterMesaageInfo("emValidCode", "txtValidCode", "请输入手机验证码");
        return;
    }
    $("em").hide();
    $("input[class=curr]").removeClass("curr");
    $("#btnPhoneRegister").hide();
    Register.PhoneRegister();
}
//注册
var Register = {
    PhoneCheck: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=phoneexist&phoneno=" + $("#txtPhoneNo").val(),
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Success_Code) {
                    $("#emPhoneNo").html("").removeClass("e1").show();
                    $(this).removeClass("curr");
                    var phoneNo = $("#txtPhoneNo").val();
                    var action = "registervalidcode";
                    var piccode = $("#txtPicCode").val();
                    Send_ValidCode.SendCodeImgEx(action, phoneNo, piccode, smstype);

                }
                else {
                    //该手机号已被使用
                    SetRegisterMesaageInfo("emPhoneNo", "txtPhoneNo", "该手机号已被使用");
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
            SetRegisterMesaageInfo("emPhoneNo", "txtPhoneNo", g_const_API_Message["7901"]);
        });
    },
    ///*图形验证码检验*/
    //PicCheck: function () {
    //    var purl = g_INAPIUTL;
    //    var request = $.ajax({
    //        url: purl,
    //        cache: false,
    //        method: g_APIMethod,
    //        data: "t=" + Math.random() + "&action=registerpiccode&phoneno=" + $("#txtPhoneNo").val() + "&piccode=" + $("#txtPicCode").val(),
    //        dataType: g_APIResponseDataType
    //    });
    //    request.done(function (msg) {
    //        if (msg.resultcode) {
    //            if (msg.resultcode == g_const_Success_Code) {
    //                Register.GetSmsCode();
    //            }
    //            else {
    //                //该手机号已被使用
    //                SetRegisterMesaageInfo("emPicCode", "txtPicCode", "图片验证码错误");
    //            }
    //        }
    //    });

    //    request.fail(function (jqXHR, textStatus) {
    //        SetRegisterMesaageInfo("emPhoneNo", "txtPhoneNo", g_const_API_Message["7901"]);
    //    });
    //},
    /*获取短信验证码*/
    GetSmsCode: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=registervalidcode&phoneno=" + $("#txtPhoneNo").val() + "&piccode=" + $("#txtPicCode").val(),
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Success_Code) {

                }
                else {
                    //该手机号已被使用
                    SetRegisterMesaageInfo("emPhoneNo", "txtPhoneNo", "该手机号已被使用");
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
            SetRegisterMesaageInfo("emPhoneNo", "txtPhoneNo", g_const_API_Message["7901"]);
        });
    },

    PhoneRegister: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=phonereg&phoneno=" + $("#txtPhoneNo").val() + "&validcode=" + $("#txtValidCode").val() + "&password=" + $("#txtPass").val() + "&piccode=" + $("#txtPicCode").val(),
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Success_Code) {
                    Register.Load_Result();
                }
                else {
                    $("#btnPhoneRegister").show();
                    if (msg.resultcode.indexOf("88") > -1) {
                        SetRegisterMesaageInfo("emValidCode", "txtValidCode", g_const_API_Message[msg.resultcode]);
                    }
                    else {
                        ShowMesaage(g_const_API_Message[msg.resultcode]);
                    }
                    
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_Result: function () {
        Merchant1.RecordReg();
        if (localStorage[g_const_localStorage.OrderFrom] != null) {
            if (localStorage[g_const_localStorage.OrderFrom] != "") {
                $.ajax({
                    type: "POST",//用POST方式传输
                    dataType: "text",//数据格式:JSON
                    url: '/Ajax/API.aspx',//目标地址
                    data: "t=" + Math.random() +
                            "&action=merchant_phone" +
                            "&merchantcode=" + escape(localStorage[g_const_localStorage.OrderFrom]) +
                            "&paramlist=" + escape(localStorage[g_const_localStorage.OrderFromParam].replace(/&/g, "@").replace(/=/g, "^")) +
                            "&phoneno=" + escape($("#txtPhoneNo").val()),
                    beforeSend: function () { },//发送数据之前
                    complete: function () { },//接收数据完毕
                    success: function (data) {
                    }
                });
            }
        }
        //if (localStorage.getItem(g_const_localStorage.BackURL) != null) {
        //    pageurl = localStorage.getItem(g_const_localStorage.BackURL);
        //}
        //else {
        //    pageurl = "/";
        //}
        //pageurl = g_const_PageURL.Recom;
        Message.ShowToPage(g_const_API_Message["7002"], g_const_PageURL.GetLink(g_const_PageURL.RegisterSuccess, ''), 1000, "");
    },
};

var Message = {
    ShowToPage: function (message, pageurl, time, str_callback) {
        ShowMesaage(message);
        setTimeout("window.location.replace(\"" + pageurl + "\");", time);
    }
};