var page_tvlive = {
    /*接口名称*/
    api_target: "com_cmall_familyhas_api_ApiForGetTVData",
    /*输入参数*/
    api_input: {
        /*会员编号*/
        "vipNo": "",
        /*排序*/
        "sort": g_const_tvlive_sort.DESC,
        /*用户类型*/
        "buyerType": "",//g_const_buyerType
        /*日期*/
        "date": new Date().Format("yyyy-MM-dd"),
        /*翻页选项*/
        "paging": {
            /*每页条数*/
            limit: 0,
            /*起码页号*/
            offset: 0
        },
        /*品牌编号*/
        "activity": "",
        "version":1.0
    },
    /*接口响应对象*/
    api_response: {},
    /*初始化*/
    "Init": function () {
        //设置置顶
        objTop.Start($(".d_go_top"));
        //设置后退
        $(".fl.d_jt_left").on("click", function (e) {
            //history.back();
            window.location.replace(PageUrlConfig.BackTo(1));

        });

        page_tvlive.MakeDateGuide(new Date().Format("yyyy-MM-dd"));
       
        page_tvlive.LoadData();
        $(".swiper-wrapper").empty();
    },
    /*生成日期导航*/
    MakeDateGuide: function (sdate) {
        //生成日期导航
        var day = 86400000;
        var arrDate = sdate.split("-");
        var objDate = new Date(parseInt(arrDate[0], 10), parseInt(arrDate[1], 10) - 1, parseInt(arrDate[2], 10));
        var bdate = new Date(objDate.getTime() - 6 * day);
        var edate = objDate;

        var timespan = edate - bdate;
        if (timespan < 0) {
            alert("开始时间必须小于等于结束时间.");
            return;
        }
        var weekday = new Array(7);
        weekday[0] = "周日";
        weekday[1] = "周一";
        weekday[2] = "周二";
        weekday[3] = "周三";
        weekday[4] = "周四";
        weekday[5] = "周五";
        weekday[6] = "周六";

        $("#date-picker").empty();
        var totaldays = (edate - bdate) / 86400000;

        var htm = "";

        for (var i = 0; i <= totaldays; i++) {
            var cday = new Date(bdate.getTime() + i * day);
            var strMonth = (cday.getMonth() + 1).toString();
            if (strMonth.length == 1)
                strMonth = "0" + strMonth;
            var strDay = (cday.getDate()).toString();
            if (strDay.length == 1)
                strDay = "0" + strDay;
            var strDate = strMonth + "-" + strDay;
            var strDataDate=cday.getFullYear().toString() + "-"+strMonth + "-" + strDay;
            var strWeekDay = weekday[cday.getDay()];
            var strclass = "";
            if (objDate - cday == 0) {
                strWeekDay = "今天";
                strclass = "active";
            }
            else
                strclass = "";
            htm += '<a class="' + strclass + '" id="tab' + i + '" data="' + strDataDate + '"><em>' + strWeekDay + '<br><i class="d_data">' + strDate + '</i></em></a>';
        }
        
        $("#date-picker").append(htm);
        //设置日期导航
        $(".tabs a").click(function (e) {
            e.preventDefault();

            var im = $(this).index();
            $(this).addClass('active').siblings().removeClass("active");
            $('#tabid' + im).css('display', 'block').siblings().css('display', 'none');

            var num = ($('.tabs a').outerWidth(true) * (im));
            $(".tabsw .a").animate({ scrollLeft: num }, 500);

            $(".swiper-wrapper").empty();
            page_tvlive.api_input.paging.limit = 0;
            page_tvlive.api_input.paging.offset = 0;
            page_tvlive.api_input.date = $(this).attr("data");            
            page_tvlive.LoadData();
        });
    },
    /*获取数据*/
    "LoadData": function () {
        var s_api_input = JSON.stringify(page_tvlive.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": page_tvlive.api_target };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            //$("#pageloading").css("display", "none");
            page_tvlive.api_response = msg;
            if (msg.resultCode == g_const_Success_Code) {
                page_tvlive.RenderData(msg);
                page_tvlive.api_input.paging.offset++;
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            //$("#pageloading").css("display", "none");
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    /*渲染数据*/
    RenderData: function (msg) {
        
        var html = "";
        var stpl = $("#tpl_tv_live_product")[0].innerHTML;
         
        for (var j = 0; j < msg.products.length; j++) {
            var product = msg.products[j];
            data = {
                "Class1": product.playStatus == g_const_YesOrNo.YES ? "pinp-sg" : "pinp-sg pinp-sg1",
                "pid":product.id,
                "Class2": product.playStatus == g_const_YesOrNo.YES ? "time-go" : "time-go d_c999",
                "TimeTitle": product.playStatus == g_const_YesOrNo.YES ? "正在直播" : "播出时间",
                "Time": Date.Parse(product.playTime).Format("hh:mm") + "-" + Date.Parse(product.endTime).Format("hh:mm"),
                "Class3": product.playStatus == g_const_YesOrNo.YES ? "lid" : "lid d_bdbe0e0df",
                "productLink": g_GetLocationByShowmoreLinktype(g_const_showmoreLinktype.ProductDetail, product.id),
                "productName": FormatText(product.name,19),
                "productPic": product.productPic,
                "activityList": page_tvlive.ListToText(product.activityList),
                "otherShow": page_tvlive.ListToText(product.otherShow),
                "salePrice": product.salePrice,
                "markPrice": product.markPrice,
                "saleNum": product.saleNum.toString()
            };
            html += renderTemplate(stpl, data);
        }

        stpl = $("#tpl_tv_live")[0].innerHTML;
        data = {               
            "productList": html == "" ? "已加载全部" : html
        };
        html = renderTemplate(stpl, data);
        $(".swiper-wrapper").append(html);
    },
    /*数组拼字*/
    ListToText: function (objlist) {
        var s = "";
        for (var k in objlist) {
            s += "<span>" + objlist[k] + "</span>"
        }
        if (s == "")
            s = "&nbsp;";
        return s;
    },
    /*转向商品详情页*/
    gotoprouduct: function (pid) {
        if (pid != "" && pid != null) {
            //window.location.replace(g_GetLocationByShowmoreLinktype(g_const_showmoreLinktype.ProductDetail, pid));
            window.location.replace(g_GetLocationByShowmoreLinktype(g_const_showmoreLinktype.ProductDetail, pid));

        }
    }
};