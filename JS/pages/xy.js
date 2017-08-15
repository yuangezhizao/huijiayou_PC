
$(document).ready(function () {
    //返回
    $("#d_go_back").click(function () {
        //history.back();
        window.location.replace(document.referrer);

    });

});