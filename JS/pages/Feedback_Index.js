
$(document).ready(function () {
    //$("#btn_Feedback_Index").click(function () {
    //    location = g_const_PageURL.Feedback;//"/Feedback.html";
    //});
    $("#btn_Feedback_Index").on("tap", function () {
        PageUrlConfig.SetUrl();
        //window.location.href = g_const_PageURL.Feedback + "?t=" + Math.random();//"/Feedback.html";
        window.location.replace(g_const_PageURL.Feedback + "?t=" + Math.random());

    });

    $(".go-back").on("tap", function () {
        //alert("后退");
        //history.back();
        //window.location.href = PageUrlConfig.BackTo();
        //window.location.href = g_const_PageURL.AccountIndex;
        window.location.replace(g_const_PageURL.AccountIndex + "?t=" + Math.random());

    });
});