//特价活动
var Promotion = {
    SysTime: "",
    ShowType: {
        /*进行中*/
        On: "OnSale",
        /*即将进行*/
        Will: "WillSale",
        /*已经结束*/
        Stop: "StopSale"
    },
    Title: "",
    GetData: function () {

        //控制IndexMain样式
        $("#nav1").parent().hide();
        $("#mainContent").removeClass("main");
        g_type_event_product_list.LoadData(Promotion.LoadResult);

    },
    //进行中集合
    OnList: [],
    //将要进行集合
    WillList: [],
    //停止集合
    StopList: [],
    //价格对象
    PriceList: {},
    /*定时刷新*/
    Refresh: function () {
        window.setInterval(function () { g_type_event_product_list.LoadData(Promotion.LoadResult); }, g_const_seconds);
    },
    /*解析结果*/
    LoadResult: function (msg) {
        //把数据按时间分组
        var dtnow = Date.Parse(msg.sysTime);

        var itemCodeList = [];
        Promotion.OnList = [];
        Promotion.WillList = [];
        Promotion.StopList = [];
        Promotion.PriceList = {};

        for (var k in msg.eventProduct) {

            var Product = msg.eventProduct[k];

            var dtbegin = Date.Parse(Product.beginTime);
            var dtend = Date.Parse(Product.endTime);

            itemCodeList.push(Product.itemCode);

            if (dtnow < dtbegin)
                Promotion.WillList.push(Product);
            else if (dtnow >= dtbegin && dtnow <= dtend)
                Promotion.OnList.push(Product);
            else
                Promotion.StopList.push(Product);
        }

        //topImg
        if (msg.imgTopUrl) {
            $("#promotionBanner").attr("style", 'background:url(' + msg.imgTopUrl + ') no-repeat center center;background-size:1200px 600px;');
            $("#promotionBanner").show();
        }
        else if (msg.imgTopUrlHref) {
           // $("#promotionBanner").attr("style", 'background:url(' + msg.imgTopUrlHref + ') no-repeat center center;background-size:1200px 600px;');
        }
        else {
            $("#PromotionList").css("margin-top", "50px");
        }
        Promotion.Title = msg.specialName;
        if (itemCodeList.length > 0) {
            g_type_event_product_price.api_input.itemCode = itemCodeList.join(",");
            g_type_event_product_price.LoadData(Promotion.LoadPrice);
        }
        //else {
        //    ShowMesaage(g_const_API_Message["100037"]);
        //}
    },
    LoadPrice: function (msg) {
        $("#PromotionList").empty();
        var html = "";
        Promotion.PriceList = msg.productPrice;

        html += Promotion.RenderOnList();
        html += Promotion.RenderWillList();
        html += Promotion.RenderStopList();

        $("#PromotionList").html(html);
    },
    Load_Product: function (pid) {
        var p = "&pid=" + pid + "&t=" + Math.random();
        g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.ProductDetail), p)
    },
    RenderOnList: function () {
        var html = "";
        if (Promotion.OnList.length > 0) {
            html += '<div class="box">';
            html += '<div class="hd"><h2 id="onTimmer"><font>距离本次结束还有：<i>--</i>时<i>--</i>分<i>--</i>秒</font></h2></div><ul>';
            for (var i in Promotion.OnList) {
                html += Promotion.RenderProduct(Promotion.OnList[i], Promotion.ShowType.On);
            }
            html += '</ul></div>'
        }
        return html;
    },
    RenderWillList: function () {
        var html = "";
        if (Promotion.WillList.length > 0) {
            html += '<div class="box"><div class="hd"><h2 id="willTimmer"><font>距离本场开始还有：<i>--</i>时<i>--</i>分<i>--</i>秒</font></h2></div><ul>';
            for (var i in Promotion.WillList) {
                html += Promotion.RenderProduct(Promotion.WillList[i], Promotion.ShowType.Will);
            }
            html += '</ul></div>'
        }
        return html;
    },
    RenderStopList: function () {
        var html = "";
        if (Promotion.StopList.length > 0) {
            html += '<div class="box"> <div class="hd"><h2 id="stopTimmer"><font>本场已结束</font></h2></div><ul>';
            for (var i in Promotion.StopList) {
                html += Promotion.RenderProduct(Promotion.StopList[i], Promotion.ShowType.Stop);
            }
            html += '</ul></div>'
        }
        return html;
    },
    RenderProduct: function (eventProduct, showType) {
        var html = "";
        var stmp = $("#stmpPromotion").html();
        var currentPrice = Promotion.PriceList[eventProduct.itemCode]

        //判断是否售光
        var isSaleOut = false;
        if (eventProduct.salesVolume <= 0) {
            isSaleOut = true;
        }
        var data = {
            Tag: eventProduct.itemCode,
            Link: "Promotion.Load_Product('" + eventProduct.itemCode + "')",
            EndStyle: isSaleOut ? "<em>已抢光</em>" : "",
            IsSaleOut: isSaleOut ? "sold" : "",
            Discount: eventProduct.discount,
            ImgUrl: eventProduct.mainpicUrl || g_goods_Pic,
            ProductName: eventProduct.skuName,
            SalePrice: currentPrice.favorablePrice,
            MarkPrice: currentPrice.marketPrice,

            ClassName: "",
            BtnBuy: "return false",
            BtnName: "立刻抢购",
        };
        switch (showType) {
            case Promotion.ShowType.On:
                data.BtnBuy = "Promotion.PayNow('" + eventProduct.skuCode + "');"
                break;
            case Promotion.ShowType.Will:
                data.ClassName = "s1";
                data.BtnName = "即将开始";
                data.BtnBuy = "Promotion.LoadProductDetail('" + eventProduct.skuCode + "');";
                data.Link = "Promotion.Load_Product('" + eventProduct.skuCode + "')";
                break;
            case Promotion.ShowType.Stop:
                data.ClassName = "s2";
                data.BtnBuy = "Promotion.LoadProductDetail('" + eventProduct.skuCode + "');";
                data.Link= "Promotion.Load_Product('" + eventProduct.skuCode + "')";
                data.EndStyle = "<em>结 束</em>";
                break;
        }
        html = renderTemplate(stmp, data);

        window.setTimeout(function () {
            Promotion.ShowLeftTime(eventProduct, showType);
        }, 100);

        return html;
    },
    /*显示倒计时*/
    ShowLeftTime: function (obj_product, srtype) {
        //全场1.5折起距离本次结束还有：<i>--</i>时<i>--</i>分<i>--</i>秒</font>
        var tag = "";
        var text = "";
        var title = "";
        var date_last;
        var date_now = new Date();
        var day_now = date_now.getDate();
        switch (srtype) {
            case Promotion.ShowType.On:
                tag = "#onTimmer"
                //正在进行中
                date_last = Date.Parse(obj_product.endTime);
                title = Promotion.Title;
                text = "距离本次结束还有：";
                Promotion.Current = Promotion.ShowType.On
                //正在进行中结束
                if (date_last.getTime() - date_now.getTime() <= 0) {
                    title = Date.Parse(obj_product.beginTime).Format("hh:mm") + "场";
                    text = "本场已结束";
                    Promotion.Current = Promotion.ShowType.Stop;
                }
                break;
            case Promotion.ShowType.Will:
                //即将开始
                tag = "#willTimmer";
                var my_Day = Date.Parse(obj_product.beginTime).Format("dd");
                var cc = "";
                if (my_Day == day_now) {
                    cc = "今天";
                }
                if (my_Day > day_now) {
                    cc = "明天";
                }
                title = cc + Date.Parse(obj_product.beginTime).Format("hh:mm") + "场";
                text = "距离本场开始还有：";
                date_last = Date.Parse(obj_product.beginTime);
                Promotion.Current = Promotion.ShowType.Will
                //即将开始变成正在进行中
                if (date_last.getTime() - date_now.getTime() <= 0) {

                    date_last = Date.Parse(obj_product.endTime);
                    title = Promotion.Title;
                    text = "距离本次结束还有：";
                    Promotion.Current = Promotion.ShowType.On;
                }

                break;
            case Promotion.ShowType.Stop:
                Promotion.Current = Promotion.ShowType.Stop
                date_last = Date.Parse(obj_product.endTime);
                var my_Day = Date.Parse(obj_product.beginTime).Format("dd");
                var cc = "";
                if (my_Day == day_now) {
                    cc = "今天";
                }
                if (my_Day < day_now) {
                    cc = "昨天";
                }
                title = cc + Date.Parse(obj_product.beginTime).Format("hh:mm") + "场";
                text = "本场已结束";
                tag = "#stopTimmer";

                $(tag).parent().parent().find("a").addClass("sold");
                break;
        }

        var ts = date_last.getTime() - date_now.getTime();  //时间差的毫秒数              

        var days = Math.floor(ts / g_const_days);
        var lefthourseconds = ts % g_const_days;
        var hours = Math.floor(lefthourseconds / g_const_hours);
        var leftmillionseconds = ts % g_const_hours;
        var minutes = Math.floor(leftmillionseconds / g_const_minutes);
        leftmillionseconds = leftmillionseconds % g_const_minutes;
        var seconds = Math.floor(leftmillionseconds / g_const_seconds);

        var hourstring = "0" + hours.toString();
        hourstring = hourstring.substr(hourstring.length - 2, 2);
        var minutestring = "0" + minutes.toString();
        minutestring = minutestring.substr(minutestring.length - 2, 2);

        var secondstring = "0" + seconds.toString();
        secondstring = secondstring.substr(secondstring.length - 2, 2);
        var timmerText = "";
        if (srtype != Promotion.ShowType.Stop) {
            timmerText = title + "<font>" + text + (days == 0 ? "" : '<i>' + days + '</i>天') + '<i>' + hourstring + '</i>时<i>' + minutestring + '</i>分<i>' + secondstring + '</i>秒</font>';
        }
        else {
            timmerText = title + "<font>" + text + '</font>';
        }
        $(tag).html(timmerText);

        if (hours == 0 && minutes == 0 && seconds == 0) {
            if (Promotion.Current == Promotion.ShowType.On) {
                date_last = Date.Parse(obj_product.endTime);
                var my_Day = Date.Parse(obj_product.beginTime).Format("dd");
                var cc = "";
                if (my_Day == day_now) {
                    cc = "今天";
                }
                if (my_Day < day_now) {
                    cc = "昨天";
                }
                var endtitle = cc + Date.Parse(obj_product.beginTime).Format("hh:mm") + "场";
                var endText = endtitle + "<font>本场已结束：</font>";
                $(tag).parent().parent().find("strong").addClass("s2").text("立刻抢购").attr("onclick", "Promotion.PayNow('" + obj_product.skuCode + "');");

                $(tag).parent().parent().find("a").addClass("sold");
                $(tag).parent().parent().find("a").prepend("<em>结 束</em>");
                $(tag).html(endText);

            }
            if (Promotion.Current == Promotion.ShowType.Will) {

                $(tag).parent().parent().find("strong").removeClass("s1").text("立刻抢购").attr("onclick", "Promotion.LoadProductDetail('" + obj_product.skuCode + "');");

                Promotion.ShowLeftTime(obj_product, srtype);
            }
        }
        else {
            window.setTimeout(function () { Promotion.ShowLeftTime(obj_product, srtype) }, 1000);
        }
    },
    Current: "",
    PayNow: function (skuCode) {

    },
    LoadProductDetail: function (pid) {

    },
    ChangeOnToStop: function () {

    },
    ChangeWillToOn: function () {

    }
};

