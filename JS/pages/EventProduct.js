$(document).ready(function () {
    special_code = GetQueryString("scode");
    
    //返回
    $("#btngoback").on("click", function () {
        //alert("后退");
        //window.location.replace(g_const_PageURL.Index);
        window.location.replace(PageUrlConfig.BackTo());
    });

    ServerTime.GetList();
});
var serverTime = "";
var ServerTime_t = 0;
var special_code = "";
var Set_CountdownTimer;

var endT = "";
var startT = "";
//加载列表
var EventProduct = {
    api_target: "com_cmall_eventcall_api_APiEventProductInfo",
    api_input: { "special_code": "", "img_Width": "0" },
    GetList: function () {
        EventProduct.api_input.special_code = special_code;
        EventProduct.api_input.img_Width = "0";
        var s_api_input = JSON.stringify(this.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": this.api_target };
        var purl = "/JYH/API_Temp.aspx";
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultCode == g_const_Success_Code) {
                serverTime = msg.sysTime;
                EventProductType = msg.selectTemplate;
                EventProduct.Load_Result(msg.eventProduct);
                //var second = (Date.Parse(msg.sysTime) - Date.Parse(serverTime)) / 1000;
                //EventProduct.Load_Activity(msg, second);
                if (msg.imgTopUrl == "") {
                    $("#topimg").hide();
                }
                else {
                    $("#topimg").attr("src", msg.imgTopUrl);
                }
                if (msg.imgTailUrl == "") {
                    $("#bottomimg").hide();
                }
                else {
                    $("#bottomimg").attr("src", msg.imgTailUrl);
                }

            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    EventProductType:"",
    Load_Result: function (resultlist) {
        var itemCode = [];
        activityList = resultlist;
        var body = "";
        var classstr = "";
        var starttime;
        var endT = "";
        var startT = "";
        var zk = "";
        var pCode = "";
        var sc = "";
        $.each(activityList, function (i, n) {
            //全场最低折扣
            if (zk == "") {
                zk = n.discount;
            } else {
                if (eval(zk) > eval(n.discount)) {
                    zk = n.discount;
                }
            }

            if(i==0){
                startT = n.beginTime;
                endT = n.endTime;
            }
            
            if (sc.indexOf(n.productCode) == -1) {
                sc = n.productCode + "," + sc;
                if (i % 2 == 0) {
                    classstr = "fl";
                }
                else {
                    classstr = "fr";
                }

                var shouqing = "";
                if (parseInt(n.salesVolume) == 0) {
                    shouqing = "<span>&nbsp;</span>";
                }
                itemCode.push(n.itemCode);
                if (EventProductType == g_const_EventProductType.Flash) {
                    pCode = n.itemCode;
                }
                else if (EventProductType == g_const_EventProductType.Event) {
                    pCode = n.productCode;
                }
                else {
                    pCode = n.itemCode;
                }
                body += "<li onclick=\"EventProduct.ShowDetail('" + pCode + "')\" class=\"fl\">";
                body += "<div class=\"d_sale_li_top\">" + shouqing + "<img src=\"" + g_GetPictrue(n.mainpicUrl) + "\"><em class=\"d_fix_icod\">" + n.discount + "折</em></div>";
                body += "<div class=\"d_sale_intr\">";
                body += "<h3>" + n.skuName + "</h3>";
                body += "<div class=\"d_sale_price\"><b>¥</b><span id=\"xianjia_" + n.itemCode + "\"></span><span class=\"d_sale_price_span\" id=\"yuanjia_" + n.itemCode + "\"></span></div>";
                body += "</div>";
                body += "</li>";
            }
        });
        $("#divActivityProduct").html(body);
        $(".d_sale_det_bg").html("全场" + zk + "折起");

        //获得商品价格
        g_type_event_product_price.api_input.itemCode = itemCode.join(",");
        g_type_event_product_price.LoadData(EventProduct.SetPrice);

        EventProduct.ShowActivityTime(0, startT, endT);

    },
    Load_Activity: function (result, second) {
        
        //clearTimeout(Set_CountdownTimer);
        //var time = { dd: parseInt(second / (24 * 60 * 60)), hh: parseInt(second / (60 * 60) % 24), mm: parseInt(second % (60 * 60) / 60), ss: parseInt(second % (60 * 60) % 60) };
        //var sptimedd = parseInt(time.dd);
        //var sptimehh = parseInt(time.hh);
        //var sptimemm = parseInt(time.mm);
        //var sptimess = parseInt(time.ss);
        

        //var body = "";
        //body += "<div class=\"d_sale_img1\">";
        //body += "<img src=\"" + result.imgTopUrlHref + "\" alt=\"\">";
        //body += "<div class=\"d_sale_det\"><span class=\"d_sale_det_bg\">" + result.dpecialDescription + "</span><span class=\"c333 fr\">后结束&emsp;&emsp;</span><span id=\"se_time\" class=\"d_count_down fr\"><i>" + sptimedd + "</i>天<i>" + sptimehh + "</i>时<i>" + sptimemm + "</i>分<i>" + sptimess + "</i>秒&emsp;</span></div>";
        //body += "</div>";
        //$("#divActivityInfoHead").html(body);

        //body = "";
        //body += "<div class=\"d_sale_img1\">";
        //body += "<img src=\"" + result.imgTailUrlHref + "\" alt=\"\">";
        //body += "<div class=\"d_sale_det\"><span class=\"d_sale_det_bg\">" + result.dpecialDescription + "</span><span class=\"c333 fr\">后结束&emsp;&emsp;</span><span id=\"se_time_b\" class=\"d_count_down fr\"><i>" + sptimedd + "</i>天<i>" + sptimehh + "</i>时<i>" + sptimemm + "</i>分<i>" + sptimess + "</i>秒&emsp;</span></div>";
        //body += "</div>";
        //$("#divActivityInfoFoot").html(body);
        //if (second - 1 > 0) {
        //    setTimeout(function () { EventProduct.Load_Activity(result, (second - 1)) }, 1000);
        //}

    },
    /*显示活动剩余时间*/
    ShowActivityTime: function (i,beginTime, endTime) {
        //活动时间--开始
        if (i == 0) {
            startT = beginTime;
            endT = endTime;
        }
        if (startT != "") {
            interval = setInterval('EventProduct.GetSTime("' + startT + '",' + 0 + ')', 1000);
        }
        var d_sale_det_bg = $("#d_sale_det_bg").html();
        if (EventProduct.getTimeMillisecondValue(startT) - ServerTime_t > 0) {
            //即将开始
            var temp_time = EventProduct.getCountDown(startT, 0);
            var temp_timeArr = temp_time.split(":");
            head_tHtml = '<span class="d_sale_det_bg">' + d_sale_det_bg + '</span><span id="se_time" class="d_count_down fr"><i>' + temp_timeArr[0] + '</i>天<i>' + temp_timeArr[1] + '</i>时<i>' + temp_timeArr[2] + '</i>分<i>' + temp_timeArr[3] + '</i>秒<em class="c333 fr">后开始</em></span>';
            head_tHtml_b = '<span class="d_sale_det_bg">' + d_sale_det_bg + '</span><span id="se_time_b" class="d_count_down fr"><i>' + temp_timeArr[0] + '</i>天<i>' + temp_timeArr[1] + '</i>时<i>' + temp_timeArr[2] + '</i>分<i>' + temp_timeArr[3] + '</i>秒<em class="c333 fr">后开始</em></span>';
        } else if (EventProduct.getTimeMillisecondValue(endT) - ServerTime_t > 0) {
            //正在进行
            var temp_time = EventProduct.getCountDown(endT, 0);
            var temp_timeArr = temp_time.split(":");
            head_tHtml = '<span class="d_sale_det_bg">' + d_sale_det_bg + '</span><span id="se_time" class="d_count_down fr"><i>' + temp_timeArr[0] + '</i>天<i>' + temp_timeArr[1] + '</i>时<i>' + temp_timeArr[2] + '</i>分<i>' + temp_timeArr[3] + '</i>秒<em class="c333 fr">后结束</em></span>';
            head_tHtml_b = '<span class="d_sale_det_bg">' + d_sale_det_bg + '</span><span id="se_time_b" class="d_count_down fr"><i>' + temp_timeArr[0] + '</i>天<i>' + temp_timeArr[1] + '</i>时<i>' + temp_timeArr[2] + '</i>分<i>' + temp_timeArr[3] + '</i>秒<em class="c333 fr">后结束</em></span>';
        } else {
            //已经结束
            head_tHtml = '<span class="d_sale_det_bg">' + d_sale_det_bg + '</span><span id="se_time" class="d_count_down fr"><em class="c333 fr">活动已结束</em></span>';
            head_tHtml_b = '<span class="d_sale_det_bg">' + d_sale_det_bg + '</span><span id="se_time_b" class="d_count_down fr"><em class="c333 fr">活动已结束</em></span>';
        }
        $("#d_sale_det").html(head_tHtml);
        $("#d_sale_det_b").html(head_tHtml_b);

        //活动时间--结束

    },
    ShowDetail: function (itemCode) {
        PageUrlConfig.SetUrl();
        window.location.href = g_const_PageURL.Product_Detail + "?pid=" + itemCode + "&t=" + Math.random();
    },
    SetPrice: function (msg) {
        $.each(msg.productPrice, function (i, n) {
            $("#xianjia_" + i).html(n.sellingPrice);
            $("#yuanjia_" + i).html(n.marketPrice);

        });
    },
    ShowDetail: function (itemCode) {
        PageUrlConfig.SetUrl();
        window.location.href = g_const_PageURL.Product_Detail + "?pid=" + itemCode + "&t=" + Math.random();
    },
    //获取时间的毫秒值
    getTimeMillisecondValue : function(time){
        var sTime = new Date(time.replace(/-/g, "/"));
        return sTime.getTime();
    },
    GetSTime: function (mydate, i) {
        var startt = EventProduct.getCountDown(mydate);
        var tm = startt.split(":");
        var ems = $('#se_time').find('i');

        if (tm[0] == "00" && tm[1] == "00" && tm[2] == "00" && tm[3] == "00") {
            clearInterval(interval);
            if (endT != "") {
                interval = setInterval('EventProduct.GetRTime("' + endT + '",' + 0 + ')', 1000);
            }
        } else {
            ems[0].innerHTML = tm[0];
            ems[1].innerHTML = tm[1];
            ems[2].innerHTML = tm[2];
            ems[3].innerHTML = tm[3];
            $('#se_time').find('em').html("后开始");
            $('#se_time_b').html($('#se_time').html());
        };

    },
    getCountDown: function(t_time) {
        //计算剩余多少时间结束
        //ServerTime.GetList();
        //serverTime = EventProduct.getTimeMillisecondValue(serverTime) - 1000;
        var EndTime = new Date(t_time.replace(/-/g, "/"));
        var leftTime = eval(EndTime.getTime() - ServerTime_t);
        if (leftTime >= 0) {
            var leftsecond = parseInt(leftTime / 1000);
            var day1 = Math.floor(leftsecond / (60 * 60 * 24));
            var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
            var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
            var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
            if (day1 < 10) {
                day1 = "0" + day1;
            }
            if (hour < 10) {
                hour = "0" + hour;
            }
            if (minute < 10) {
                minute = "0" + minute;
            }
            if (second < 10) {
                second = "0" + second;
            }
            return day1+":"+hour+":"+minute+":"+second;
        } else {
            return "00:00:00:00";
        };
    },
    GetRTime: function (t_time) {
        var endt = EventProduct.getCountDown(t_time);
        var tm = endt.split(":");
        var ems = $('#se_time').find('i');

        if (tm[0] == "00" && tm[1] == "00" && tm[2] == "00" && tm[3] == "00") {
            $('#se_time').html("<em>活动已结束</em>");
            clearInterval(interval);
        } else {
            ems[0].innerHTML = tm[0];
            ems[1].innerHTML = tm[1];
            ems[2].innerHTML = tm[2];
            ems[3].innerHTML = tm[3];
            $('#se_time').find('em').html("后结束");
            $('#se_time_b').html($('#se_time').html());
        }
    }
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
        ServerTime_t = EventProduct.getTimeMillisecondValue(serverTime);
        setInterval(function () {
            ServerTime_t = eval(ServerTime_t + 1000);
        }, 1000);

        EventProduct.GetList();
    },
    //Load_Product: function (pid) {
    //    location = "/Product_Detail.html?pid=" + pid
    //}
};