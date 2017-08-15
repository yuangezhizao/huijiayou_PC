var login = "";
$(document).ready(function () {

    if (IsDebug) {
        //清空本地缓存
        $(".copyright").on("click", function (e) {
            localStorage.clear();
            UserInfo.UploadCart();
            // alert("清空localStorage成功");
        });
    }
    //后退
    $("#btnback").click(function () {
        //window.location.replace(PageUrlConfig.BackTo());
        //返回首页
        window.location.replace(g_const_PageURL.Index);
    });

    /*日期点击*/
    //每日00：00自动切换活动
    var today = getToday();
    $("#a11_" + today).click(function () {
        ActMain_click(today);
    });

    
    $("#a11_1").click(function () {
        ActMain_click("1");
    });
    $("#a11_2").click(function () {
        ActMain_click("2");
    });
    $("#a11_3").click(function () {
        ActMain_click("3");
    });
    $("#a11_4").click(function () {
        ActMain_click("4");
    });
    $("#a11_5").click(function () {
        ActMain_click("5");
    });
    $("#a11_6").click(function () {
        ActMain_click("6");
    });
    $("#a11_7").click(function () {
        ActMain_click("7");
    });
    $("#a11_8").click(function () {
        ActMain_click("8");
    });
    $("#a11_9").click(function () {
        ActMain_click("9");
    });
    $("#a11_10").click(function () {
        ActMain_click("10");
    });
    $("#a11_11").click(function () {
        ActMain_click("11");
    });
    
    //11日隐藏头部日期栏位
    if (parseInt(today) == 11) {
        $("#act-head").hide();
        $("#act-div").hide();
    }

    //加载当日默认活动
    ActMain_click(today);
    setTimeout("AutoShowAct('" + today + "')", 1000);

});

//获取当天日期
function getYear() {
    var mydate = new Date();
    var str = mydate.getFullYear();
    return str;
}
function getMonth() {
    var mydate = new Date();
    var str = mydate.getMonth() + 1;
    return str;
}
function getToday() {
    var mydate = new Date();
    var str = mydate.getDate();
    return str;
}

//点击日期切换展示页
function ActMain_click(id) {
    //判断当天日期
    var Year = getYear();
    var Month = getMonth();
    var today = getToday();

    if (parseInt(Month) < 11) {
        ShowMesaage("活动还未开始！");
        setTimeout("GotoIndex()", 3000);
    }
    else if (parseInt(Month) > 11 || (parseInt(Month) == 11 && parseInt(today) > 11)) {
        ShowMesaage("活动已经结束了！");
        setTimeout("GotoIndex()", 3000);
    }
    else if ((parseInt(Month) == 11 && parseInt(today) <= 11) && (parseInt(id) < parseInt(today))) {
        ShowMesaage("活动已经结束了！,看看今天的吧");
        ActMain_click(today);
    }
    else if ((parseInt(Month) == 11 && parseInt(today) <= 11) && (parseInt(id) > parseInt(today))) {
        ShowMesaage("活动还未开始！,看看今天的吧");
        ActMain_click(today);
    }
    else {
        //全部按钮不选中
        $("#riqi-number a").each(function () {
            $(this).attr("class", "");
        });
        //点击按钮选中
        var riqi_id = "a11_" + id;
        $("#"+riqi_id).attr("class", "sel");

        //切换活动页
        $("#iframe_showhtml").attr("src", id + ".html");
    }
}

//显示当天活动
function showTodayAct() {
    var Year = getYear();
    var Month = getMonth();
    var today = getToday();
    if (parseInt(Month) != 2015) {
        ShowMesaage("活动还未开始！");
        setTimeout("GotoIndex()", 3000);
    }
    else if (parseInt(Month)<11) {
        ShowMesaage("活动还未开始！");
        setTimeout("GotoIndex()", 3000);
    }
    else if (parseInt(Month) > 11 || (parseInt(Month) == 11 && parseInt(today) > 11)) {
        ShowMesaage("活动已经结束了！");
        setTimeout("GotoIndex()", 3000);
    }
    else {
        $("#iframe_showhtml").attr("src", today + ".html");
    }
}

//每日00：00自动切换活动
function AutoShowAct(proday) {
    var today = getToday();
    /*
    var Year = getYear();
    var Month = getMonth();
    
    if (parseInt(Month) != 2015) {
        ShowMesaage("活动还未开始！");
        setTimeout("GotoIndex()", 3000);
    }
    else if (parseInt(Month)<11) {
        ShowMesaage("活动还未开始！");
        setTimeout("GotoIndex()", 3000);
    }
    else if (parseInt(Month) > 11 || (parseInt(Month)== 11 && parseInt(today) >11)) {
        ShowMesaage("活动已经结束了！");
        setTimeout("GotoIndex()", 3000);
    }
    else {
    */
    if (parseInt(today) > parseInt(proday)) {
        if ($("#iframe_showhtml").attr("src") != today + ".html") {
            //$("#iframe_showhtml").attr("src", today + ".html");
            ActMain_click(today)
        }
    }
        setTimeout("AutoShowAct('" + today + "')", 1000);
    /*}*/
}
//跳转首页
function GotoIndex() {
    //返回首页
    //window.location.replace(g_const_PageURL.Index);
}
