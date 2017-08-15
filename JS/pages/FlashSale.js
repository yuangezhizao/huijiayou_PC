var activity = { "end_time": "", "start_time": "", "activity_name": "", "activity_code": "" };
var activityList;
var serverTime = "";
var alarmTime = 3 * 60 * 1000;//提前几分钟闹钟提醒

//加载列表
var FlashActive = {
    Error:"",
    api_target: "com_cmall_eventcall_api_ApiForFlashActive",
    api_input: { "sellerCode":"SI2003"},
    GetList: function () {
        var s_api_input = JSON.stringify(FlashActive.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": FlashActive.api_target };
        var purl = g_Temp_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultCode == g_const_Success_Code) {
                serverTime = msg.systemTime;
                FlashActive.Load_Result(msg.activeList);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_Result: function (resultlist) {
        activityList = resultlist;
        var body = "";
        var classstr = "";
        var starttime;
        var strHour = "";
        var strMin = "";
        var strDay = "";
        $.each(activityList, function (i, n) {
            if (i==0) {
                classstr = "class=\"curr\"";
            }
            else {
                classstr = "";
            }
            strDay = "";
            bool = new Date(Date.parse(n.start_time.replace(/-/g, "/"))) < new Date(Date.parse(serverTime.replace(/-/g, "/")));
            if (bool) {
                //判断是否是昨天场
                if (isTomorrow(n.start_time, reverTime(serverTime))) {
                    strDay = "昨天";
                }
                
            } else {
                //判断是否是明天场
                if (isTomorrow(reverTime(serverTime), n.start_time)) {
                    strDay += "明天";
                }
            }
            starttime = Date.Parse(n.start_time);
            strHour = starttime.getHours() < 10 ? ("0" + starttime.getHours().toString()) : starttime.getHours().toString();
            strMin = starttime.getMinutes() < 10 ? ("0" + starttime.getMinutes().toString()) : starttime.getMinutes().toString();
           // body += "<a id=\'tab_" + n.activity_code + "\' onclick=\"ActiveProduct.GetList('" + n.activity_code + "', '" + n.start_time + "', '" + n.end_time + "')\" " + classstr + "><em>" + strDay + strHour + ":" + strMin + "</em><span>&nbsp;</span></a>";
            body += "<li id=\'tab_" + n.activity_code + "\' onclick=\"ActiveProduct.GetList('" + n.activity_code + "', '" + n.start_time + "', '" + n.end_time + "')\" " + classstr + ">"
            body += "<b>" + strDay + strHour + ":" + strMin + "场</b><font><span id=\"sptimeshow_" + n.activity_code + "\"></span>"
            body += "<em><span id=\"sptimehh_" + n.activity_code + "\"></span></em>:<em><span id=\"sptimemm_" + n.activity_code + "\"></span></em>:<em><span id=\"sptimess_" + n.activity_code + "\"></span></em></font></li>";
        });
        $("#divActivitylist").html(body);
        if (activityList.length>0) {
            ActiveProduct.GetList(activityList[0].activity_code, activityList[0].start_time, activityList[0].end_time);
        }
        
        
    },
};


//加载列表
var ActiveProduct = {
    api_target: "com_cmall_eventcall_api_ApiForFlashActiveProduct ",
    api_input: { "event_code": ""},
    GetList: function (activity_code, start_time, end_time) {
        $("#divActivitylist").find("li").each(function () {
            $(this).attr("class","");
        });
        $("#tab_" + activity_code).attr("class", "curr");

        var timer = 0;
        if (Date.Parse(serverTime) > Date.Parse(start_time) && Date.Parse(serverTime) < Date.Parse(end_time)) {
            $("#sptimeshow_" + activity_code).html("距离结束");
            timer = Date.Parse(end_time) - Date.Parse(serverTime);
        }
        else if (Date.Parse(serverTime) < Date.Parse(start_time)) {
            $("#sptimeshow_" + activity_code).html("距离开始");
            timer = Date.Parse(start_time) - Date.Parse(serverTime);
        }
        else if (Date.Parse(serverTime) > Date.Parse(end_time)) {
            $("#sptimeshow_" + activity_code).html("已结束");
        }
        Set_Countdown((timer / 1000), activity_code);

        ActiveProduct.api_input.event_code = activity_code;
        ActiveProduct.api_input.imgWidth = 200;
        var s_api_input = JSON.stringify(this.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": this.api_target };
        var purl = g_Temp_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultCode == g_const_Success_Code) {
                ActiveProduct.Load_Result(msg.productList, start_time, end_time);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_Result: function (productList, start_time, end_time) {
        var bodyPr = "";
        var sellover;

        
        $.each(productList, function (i, n) {
            var discountRateStr = "";
            if (parseFloat(n.discountRate) % 10 == 0) {
                discountRateStr = (parseFloat(n.discountRate) / 10).toFixed(0).toString();
            }
            else {
                discountRateStr = (parseFloat(n.discountRate) / 10).toFixed(1).toString();
            }
            bodyPr += "<li onclick=\"ActiveProduct.Load_Product(" + n.product_code + ")\">";
            if (n.sell_count >= n.sales_num) {
                bodyPr += "<a class=\"sold\">";
                bodyPr += "<em>售罄</em>";
            }
            else {
                bodyPr += "<a style=\"cursor:pointer\">";
            }
            bodyPr += "<img src=\"" + g_GetPictrue(n.img_url) + "\" alt=\"\">";
            bodyPr += "<span>" + discountRateStr + "折</span>";
            bodyPr += "<b>" + n.product_name + "</b>";
            bodyPr += "<font>￥" + n.vip_price + "<i>￥" + n.sell_price + "</i></font>";
            if (Date.Parse(serverTime) < Date.Parse(start_time)) {
                bodyPr += "<strong class=\"s1\">即将开始</strong>";
            }
            else {
                bodyPr += "<strong>立刻抢购</strong>";
            }
            bodyPr += "</a>";
            bodyPr += "</li>";
        });
        $("#divActivityProduct").html(bodyPr);
        
    },
    Load_Product: function (pid) {
        g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.ProductDetail), "&pid=" + pid + "&t=" + Math.random());
    }
};

//倒计时牌设置 periodinfo当前销售期相关信息实体
var Set_CountdownTimer;
Set_Countdown = function (second, activity_code) {
    clearTimeout(Set_CountdownTimer);
    var time = { dd: parseInt(second / (24 * 60 * 60)), hh: parseInt(second / (60 * 60) % 24), mm: parseInt(second % (60 * 60) / 60), ss: parseInt(second % (60 * 60) % 60) };
    $("#sptimehh_" + activity_code).html((parseInt(time.hh) + parseInt(time.dd * 24)) < 10 ? ("0" + (parseInt(time.hh) + parseInt(time.dd * 24))) : (parseInt(time.hh) + parseInt(time.dd * 24)));
    $("#sptimemm_" + activity_code).html(parseInt(time.mm) < 10 ? ("0" + time.mm) : parseInt(time.mm));
    $("#sptimess_" + activity_code).html(parseInt(time.ss) < 10 ? ("0" + time.ss) : parseInt(time.ss));
    if (second - 1 > 0) {
        Set_CountdownTimer = setTimeout(function () { Set_Countdown((second - 1), activity_code) }, 1000);
    }
};

//判断是否是明天场
function isTomorrow(pre_time, end_time) {
    var preT = new Date(pre_time.replace(/-/g, "/"));
    var endT = new Date(end_time.replace(/-/g, "/"));
    if (endT.getDate() - preT.getDate() > 0) {
        return true;
    } else {
        return false;
    }

}


function reverTime(time, format) {
    var format = function (time, format) {
        var t = new Date(time);
        var tf = function (i) { return (i < 10 ? '0' : '') + i };
        return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
            switch (a) {
                case 'yyyy':
                    return tf(t.getFullYear());
                    break;
                case 'MM':
                    return tf(t.getMonth() + 1);
                    break;
                case 'mm':
                    return tf(t.getMinutes());
                    break;
                case 'dd':
                    return tf(t.getDate());
                    break;
                case 'HH':
                    return tf(t.getHours());
                    break;
                case 'ss':
                    return tf(t.getSeconds());
                    break;
            }
        })
    }
    //return format(new Date().getTime(), 'yyyy-MM-dd HH:mm:ss');
    return format(time, 'yyyy-MM-dd HH:mm:ss');
}


