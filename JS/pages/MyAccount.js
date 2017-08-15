$(document).ready(function () {
    $("#li_AddressList").on("tap", function () {
        //保存下一页用于返回的url
        PageUrlConfig.SetUrl();
        localStorage["fromOrderConfirm"] = "0";
        window.location.replace(g_const_PageURL.AddressList+ "?t=" + Math.random());
    });

    $("#li_ResetPassword").on("tap", function () {
        //保存下一页用于返回的url
        PageUrlConfig.SetUrl();
        window.location.href = g_const_PageURL.ResetPassword + "?t=" + Math.random();

    });
    $("#go-back").on("tap", function () {
        window.location.replace(g_const_PageURL.AccountIndex + "?t=" + Math.random());

    });
    
});