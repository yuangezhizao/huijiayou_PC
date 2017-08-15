$(document).ready(function () {
    //LoginOauth.GetWXOpenID();
    //LoginOauth.GotoURL();
    $("#btn_login").click(function () {
        if ($("#text_mobile").val() == "") {
            ShowMesaage(g_const_API_Message["100023"]);
            return;
        }
        if ($("#text_captcha_mobile").val() == "") {
            ShowMesaage(g_const_API_Message["7802"]);
            return;
        }
        LoginOauth.PhoneBind();
    });

    $("#btnCode").on("click", function () {
        var phoneNo = $("#text_mobile").val();
        var action = "oauthvalidcode";
        if (phoneNo.length == 0) {
            ShowMesaage(g_const_API_Message["7901"]);
            return;
        }
        //if (!isMobile(phoneNo)) {
        //    ShowMesaage(g_const_API_Message["7902"]);
        //    return;
        //}
        Send_ValidCode.SendCode(action, phoneNo);
        //Send_ValidCode.stime(g_const_ValidCodeTime);
    });

    //返回
    $(".d_go_back").click(function () {
        //history.back();
        window.location.replace(PageUrlConfig.BackTo(1));

    });
    //协议
    $(".span_xy").click(function () {
        window.location.replace(g_const_PageURL.xieyi + "?t=" + Math.random());
    });


    //输入显示清除内容
    $("#text_mobile").keyup(function () {
        //只能输入数字
        this.value = this.value.replace(/\D/g, '')
        if ($("#text_mobile").val() != "") {
            $("#d_close_tel").show();
        }
        else {
            $("#d_close_tel").hide();
        }
    });
    $("#text_mobile").on("tap", function () {
        //只能输入数字
        this.value = this.value.replace(/\D/g, '')
        if ($("#text_mobile").val() != "") {
            $("#d_close_tel").show();
        }
        else {
            $("#d_close_tel").hide();
        }
    });
    //点击清除
    $("#d_close_tel").on("tap", function () {
        $("#text_mobile").val("");
        $("#d_close_tel").hide();
    });

    //输入显示清除内容
    $("#text_captcha_mobile").keyup(function () {
        if ($("#text_captcha_mobile").val() != "") {
            $("#d_close").show();
        }
        else {
            $("#d_close").hide();
        }
    });
    $("#text_captcha_mobile").on("tap", function () {
        if ($("#text_captcha_mobile").val() != "") {
            $("#d_close").show();
        }
        else {
            $("#d_close").hide();
        }
    });

    //点击清除
    $("#d_close").on("tap", function () {
        $("#text_captcha_mobile").val("");
        $("#d_close").hide();
    });
});

//编辑地址信息
var LoginOauth = {
    PhoneBind: function () {
        $("#form_login").submit();
    },
    GetWXOpenID: function () {
        //localStorage[g_const_localStorage.Member] = $("#hidWxOpenID").val();
       // alert(localStorage[g_const_localStorage.Member]);
       // alert((JSON.parse(localStorage[g_const_localStorage.Member]).Member).uid);
        //alert(JSON.parse(localStorage[g_const_localStorage.Member]).phone);
        //alert(JSON.parse(localStorage[g_const_localStorage.Member]).accounttype);
    },
    GotoURL: function () {
       // alert(1111);
        //localStorage[g_const_localStorage.JSAPI_Access_token] = $("#hidToken").val();
        // alert(localStorage.getItem(g_const_localStorage.JSAPI_Access_token));
        var pageurl = "";
        if (localStorage.getItem(g_const_localStorage.BackURL).length > 0) {
            pageurl = localStorage.getItem(g_const_localStorage.BackURL);
        }
        else {
            pageurl = "/index.html";
        }
        window.location.replace(pageurl);
    },
    //SetLocal: function () {
    //    localStorage[g_const_localStorage.JSAPI_Access_token] = $("#hidToken").val();
    //    // alert(localStorage.getItem(g_const_localStorage.JSAPI_Access_token));
    //    //location = url;
    //},
};