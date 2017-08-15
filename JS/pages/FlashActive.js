$(document).ready(function () {
    if (null == browser || "" == browser) {
        loadInit();
    }
    ServerTime.GetList();
    //后退
    $("#btnBack").click(function () {
        //window.location.href = PageUrlConfig.BackTo();
        window.location.replace(PageUrlConfig.BackTo());

    });
});
var activity = { "end_time": "", "start_time": "", "activity_name": "", "activity_code": "" };
var activityList;
var serverTime = "";
var alarmTime = 3 * 60 * 1000;//提前几分钟闹钟提醒
var openAlarmClockInfo = '';
var openClockList = [];
var browser = '';



//加载列表
var FlashActive = {
    api_target: "com_cmall_eventcall_api_ApiForFlashActive",
    api_input: { "sellerCode":"SI2003"},
    GetList: function () {
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
                classstr = "class=\"active\"";
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
            body += "<a id=\'tab_" + n.activity_code + "\' onclick=\"ActiveProduct.GetList('" + n.activity_code + "', '" + n.start_time + "', '" + n.end_time + "')\" " + classstr + "><em>" + strDay + strHour + ":" + strMin + "</em><span>&nbsp;</span></a>";
        });
        $("#divActivitylist").html(body);
        if (activityList.length>0) {
            ActiveProduct.GetList(activityList[0].activity_code, activityList[0].start_time, activityList[0].end_time);
        }
        
        
    },
    //Load_Product: function (pid) {
    //    location = "/Product_Detail.html?pid=" + pid
    //}
};
//加载列表
var ServerTime = {
    api_target: "com_cmall_familyhas_api_ApiForGetServerTime",
    api_input: {},
    GetList: function () {
        var s_api_input = JSON.stringify(this.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": this.api_target };
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
                ServerTime.Load_Result(msg);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_Result: function (result) {
        serverTime = result.serverTime;
        FlashActive.GetList();
    },
    //Load_Product: function (pid) {
    //    location = "/Product_Detail.html?pid=" + pid
    //}
};

//加载列表
var ActiveProduct = {
    api_target: "com_cmall_eventcall_api_ApiForFlashActiveProduct ",
    api_input: { "event_code": ""},
    GetList: function (activity_code, start_time, end_time) {
        $("#divActivitylist").find("a").each(function () {
            $(this).attr("class","");
        });
        $("#tab_" + activity_code).attr("class", "active");
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
        if (localStorage.getItem(g_const_localStorage.FlashActive)!=null) {
            openClockList = localStorage.getItem(g_const_localStorage.FlashActive).split(',');
        }
        
        $.each(productList, function (i, n) {
            //判断闹钟是否已经开启
            var isHadOpenClock = false;
            for (var k = 0; k < openClockList.length; k++) {
                var clockInof = openClockList[k];
                if (clockInof == n.product_code) {
                    isHadOpenClock = true;
                    break;
                }
            }

            bodyPr += "<div class=\"lid\" onclick=\"ActiveProduct.Load_Product(" + n.product_code + ")\">";
            bodyPr += "<div class=\"imgd\"><img src=\"" + g_GetPictrue(n.img_url) + "\" alt=\"\" /></div>";
            bodyPr += "<div class=\"txtd\">";
            bodyPr += "<h3>" + n.product_name + "</h3>";
            bodyPr += "<div class=\"price\"><b>¥</b>" + n.vip_price + "<span>¥" + n.sell_price + "</span></div>";
            var discountRateStr ="";
            if (parseFloat(n.discountRate) % 10 == 0) {
                discountRateStr = (parseFloat(n.discountRate) / 10).toFixed(0).toString();
            }
            else {
                discountRateStr = (parseFloat(n.discountRate) / 10).toFixed(1).toString();
            }
            bodyPr += "<div class=\"icod\"><span>" + discountRateStr + "折</span></div>";
            if (Date.Parse(serverTime) < Date.Parse(start_time)) {
                //还未开始
                if (isHadOpenClock) {
                    bodyPr += '<div class="clock-open clock-close" onclick="openAlarmClock(this,\'' + 0 + '\',\'' + n.product_code + '\',\'' + start_time + '\',\'' + end_time + '\',\'' + n.product_name + '\',\'' + n.vip_price + '\')"><b>&nbsp;</b>已开启</div>';
                } else {
                    bodyPr += '<div class="clock-open" onclick="openAlarmClock(this,\'' + 1 + '\',\'' + n.product_code + '\',\'' + start_time + '\',\'' + end_time + '\',\'' + n.product_name + '\',\'' + n.vip_price + '\')"><b>&nbsp;</b>抢购提醒</div>';
                }
            }
            else {
                //if (n.sales_num > 0) {
                //    if (n.sell_count >= n.sales_num) {
                //        bodyPr += "<div class=\"sche-open sche-close\"><span></span><em>已抢光</em></div>";
                //    }
                //    else {
                //        sellover = parseInt((n.sell_count / n.sales_num) * 100)
                //        bodyPr += "<div class=\"sche-open\"><span style=\"width:" + sellover + "%;\"></span><em>已抢" + sellover + "%</em></div>";
                //    }
                //}
                //else {
                //    bodyPr += "<div class=\"sche-open\"><span style=\"width:0%;\"></span><em>已抢0%</em></div>";
                //}
            }
            bodyPr += "</div>";
            bodyPr += "</div>";
        });
        $("#divActivityProduct").html(bodyPr);
        var timer=0;
        if (Date.Parse(serverTime) > Date.Parse(start_time) && Date.Parse(serverTime) < Date.Parse(end_time)) {
            $("#sptimeshow").html("距离结束");
            timer = Date.Parse(end_time) - Date.Parse(serverTime);
        }
        else if(Date.Parse(serverTime) < Date.Parse(start_time)){
            $("#sptimeshow").html("距离开始");
            timer = Date.Parse(start_time) - Date.Parse(serverTime);
        }
        else if (Date.Parse(serverTime) > Date.Parse(end_time)) {
            $("#sptimeshow").html("已结束");
        }
        Set_Countdown(timer/1000);
    },
    Load_Product: function (pid) {
        PageUrlConfig.SetUrl();
        //location = g_const_PageURL.Product_Detail + "?pid=" + pid
        window.location.replace(g_const_PageURL.Product_Detail + "?pid=" + pid + "&t=" + Math.random());

    }
};

//倒计时牌设置 periodinfo当前销售期相关信息实体
var Set_CountdownTimer;
Set_Countdown = function (second) {
    clearTimeout(Set_CountdownTimer);
    var time = { dd: parseInt(second / (24 * 60 * 60)), hh: parseInt(second / (60 * 60) % 24), mm: parseInt(second % (60 * 60) / 60), ss: parseInt(second % (60 * 60) % 60) };
    $("#sptimehh").html((parseInt(time.hh) + parseInt(time.dd * 24)) < 10 ? ("0" + (parseInt(time.hh) + parseInt(time.dd * 24))) : (parseInt(time.hh) + parseInt(time.dd * 24)));
    $("#sptimemm").html(parseInt(time.mm) < 10 ? ("0" + time.mm) : parseInt(time.mm));
    $("#sptimess").html(parseInt(time.ss) < 10 ? ("0" + time.ss) : parseInt(time.ss));
    if (second - 1 > 0) {
        Set_CountdownTimer = setTimeout(function () { Set_Countdown(second - 1) }, 1000);
    }
};
function openAlarmClock(obj, switchStatus, productCode, startTime, endTime, productName, productMoney) {
    stopBubble($(obj).parent().parent()[0]);

    //判断是否可以开启
    if (switchStatus == 1 || switchStatus == '1') {
        var t_start_time = getCountDown(startTime);
        var t_start_timeArr = t_start_time.split(':');
        var sTime = new Date(startTime.replace(/-/g, "/"));
        var leftTime = eval(sTime.getTime() - new Date(serverTime.replace(/-/g, "/")).getTime());
        if (t_start_timeArr[0] == "00" && t_start_timeArr[1] == "00" && t_start_timeArr[2] == "00") {
            //活动已开始
            new Toast({ context: $('body'), message: '活动已开始', top: '40%' }).show();
            return false;
        } else if (leftTime <= alarmTime) {
            //活动即将开始
            new Toast({ context: $('body'), message: '活动即将开始', top: '40%' }).show();
            return false;
        }

    }


    if (switchStatus == '1' || switchStatus == 1) {
        //open
        WXMsgSend.BtnObj = obj;
        WXMsgSend.ProductCode = productCode;
        WXMsgSend.StartTime = startTime;
        WXMsgSend.EndTime = endTime;
        WXMsgSend.ProductName = productName;
        WXMsgSend.ProductMoney = productMoney;
        WXMsgSend.Main();
    } else if (switchStatus == '0' || switchStatus == 0) {
        //close
    }

}

//编辑地址信息
var WXMsgSend = {
    BtnObj: null,
    ProductCode: "",
    StartTime: "",
    EndTime: "",
    ProductName: "",
    ProductMoney: "",
    Main: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=wxtpmsg&fixtime=" + WXMsgSend.StartTime + "&productname=" + WXMsgSend.ProductName + "&productmoney=" + WXMsgSend.ProductMoney + "&productid=" + WXMsgSend.ProductCode,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Success_Code_IN) {
                    WXMsgSend.Load_Result_Succ();
                }
                else {
                    WXMsgSend.Load_Result_Fail();
                    ShowMesaage(msg.resultmessage);
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
            WXMsgSend.Load_Result_Fail();
            ShowMesaage(msg.resultmessage);
        });
    },
    Load_Result_Succ: function () {
        $(WXMsgSend.BtnObj).html('<b>&nbsp;</b>已开启');
        $(WXMsgSend.BtnObj).attr('class', 'clock-open clock-close');
        $(WXMsgSend.BtnObj).attr("onclick", "openAlarmClock(this,0,'" + WXMsgSend.ProductCode + "','" + WXMsgSend.StartTime + "','" + WXMsgSend.EndTime + "','" + WXMsgSend.ProductName + "','" + WXMsgSend.ProductMoney + "')");
        if (localStorage.getItem(g_const_localStorage.FlashActive) != null) {
            openClockList = localStorage.getItem(g_const_localStorage.FlashActive).split(',');
        }
        openClockList.push(WXMsgSend.ProductCode);
        localStorage[g_const_localStorage.FlashActive] = openClockList.join(",");;
    },
    Load_Result_Fail: function () {
        $(WXMsgSend.BtnObj).html('<b>&nbsp;</b>抢购提醒');
        $(WXMsgSend.BtnObj).attr('class', 'clock-open');
        $(WXMsgSend.BtnObj).attr("onclick", "openAlarmClock(this,1,'" + WXMsgSend.ProductCode + "','" + WXMsgSend.StartTime + "','" + WXMsgSend.EndTime + "','" + WXMsgSend.ProductName + "','" + WXMsgSend.ProductMoney + "')");
    },
};
function stopBubble(e) {
    if (e && e.stopPropagation) {//非IE
        e.stopPropagation();
    }
    else {//IE
        window.event.cancelBubble = true;
    }
}
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

function getCountDown(t_time) {
    //计算当前剩余时间
    var EndTime = new Date(t_time.replace(/-/g, "/"));
    var leftTime = eval(EndTime.getTime() - new Date(serverTime.replace(/-/g, "/")).getTime());
    if (leftTime >= 0) {
        var leftsecond = parseInt(leftTime / 1000);
        var day1 = Math.floor(leftsecond / (60 * 60 * 24));
        var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
        var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
        var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
        if (hour < 10) {
            hour = "0" + hour
        }
        if (minute < 10) {
            minute = "0" + minute
        }
        if (second < 10) {
            second = "0" + second
        }
        return hour + ":" + minute + ":" + second;
    } else {
        return "00:00:00";
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

function loadInit() {
    browser = {
        versions: function () {
            var u = navigator.userAgent, app = navigator.appVersion;
            return {//移动终端浏览器版本信息  
                trident: u.indexOf('Trident') > -1, //IE内核 
                presto: u.indexOf('Presto') > -1, //opera内核 
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核 
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核 
                mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端 
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端 
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器 
                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器 
                iPad: u.indexOf('iPad') > -1, //是否iPad 
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部 
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    }
}