$(document).ready(function () {
    $("#hidProductCode").val(GetQueryString("pid"));
    $("#Verify_codeImag").attr("src", "/Ajax/LoginHandler.ashx?action=code");
    $("#btnValid").click(function () {
        if ($("#txtPicCode").val().length==4) {
            ShowLicense();
        }
        else {
            ShowMesaage("请输入正确的验证码");
        }
    });
    UserLogin.Check(UserLicense);
});

function UserLicense() {
    if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
        ToLogin();
    }
}
function ToLogin() {
    PageUrlConfig.SetUrl(g_const_PageURL.MainIndex + "?u=SellerInfo&pid=" + $("#hidProductCode").val());
    var p = "&t=" + Math.random();
    g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.Login), p);
}
function ToggleCode(obj, codeurl) {
    $("#" + obj).attr("src", codeurl + "?action=code&time=" + Math.random());
}
function ShowLicense() {
    $("#loadTip").show();
    var purl = g_INAPIUTL;
    var request = $.ajax({
        url: purl,
        cache: false,
        method: g_APIMethod,
        data: "t=" + Math.random() + "&action=showlicense&piccode=" + $("#txtPicCode").val() + "&pid=" + $("#hidProductCode").val(),
        dataType: g_APIResponseDataType
    });

    request.done(function (msg) {
        if (msg.resultcode == g_const_Success_Code) {
            $("#img_bizLicensePic").attr("src", JSON.parse(msg.resultmessage).bizLicensePic);
            $("#divValid").hide();
            $("#btnValid").hide();
            $("#img_bizLicensePic").show();
        }
        else {
            ShowMesaage(msg.resultmessage);
        }
        $("#loadTip").hide();
    });

    request.fail(function (jqXHR, textStatus) {
        ShowMesaage(g_const_API_Message["7001"]);
        $("#loadTip").hide();
    });
}