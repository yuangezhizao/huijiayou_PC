
var page_seckill = {
    /*秒杀类型*/
    event_product_sortType: g_const_event_product_sortType.Other,
    /*显示类型*/
    ShowType: {
        /*进行中*/
        On: "NowOnSale",
        /*即将进行*/
        Will: "WillSale",
        /*已经结束*/
        Stop: "StopSale"
    },
    /*初始化*/
    Init: function () {

        //控制IndexMain样式
        $("#nav1").parent().hide();
        $("#mainContent").removeClass("main");

        g_type_event_product_list.LoadData(page_seckill.LoadPrice);
    },
    /*定时刷新*/
    Refresh: function () {
        window.setInterval(function () { g_type_event_product_list.LoadData(page_seckill.LoadPrice); }, 5 * g_const_seconds);
    },
    ItemCodes: [],
    /*读取价格信息*/
    LoadPrice: function (msg) {
        //把数据按时间分组
        var dtnow = Date.Parse(g_type_event_product_list.api_response.sysTime);
        page_seckill.ItemCodes = [];
        page_seckill.NowOnSaleList = [];
        page_seckill.StopSaleList = [];
        page_seckill.WillSaleList = [];
        page_seckill.PriceList = {};
        for (var k in g_type_event_product_list.api_response.eventProduct) {
            var Product = g_type_event_product_list.EventProduct;
            Product = g_type_event_product_list.api_response.eventProduct[k];
            var dtbegin = Date.Parse(Product.beginTime);
            var dtend = Date.Parse(Product.endTime);
            page_seckill.ItemCodes.unshift(Product.itemCode);
            if (dtnow < dtbegin)
                page_seckill.WillSaleList.unshift(Product);
            else if (dtnow >= dtbegin && dtnow <= dtend)
                page_seckill.NowOnSaleList.unshift(Product);
            else
                page_seckill.StopSaleList.unshift(Product);
        }
        //topImg
        if (msg.imgTopUrl) {
            $("#seckillBanner").attr("style", 'background:url(' + msg.imgTopUrl + ') no-repeat center center;background-size:1200px 600px;');
            $("#seckillBanner").show();
        }
        else if (msg.imgTopUrlHref) {
            $("#seckillBanner").attr("style", 'background:url(' + msg.imgTopUrlHref + ') no-repeat center center;background-size:1200px 600px;');
        }
        else {
            $("#seckillList").css("margin-top", "20px");
        }

        if (page_seckill.ItemCodes.length > 0) {
            g_type_event_product_price.api_input.itemCode = page_seckill.ItemCodes.join(",");
            g_type_event_product_price.LoadData(page_seckill.RenderIsPriceHtml);
        }
        else {
            ShowMesaage(g_const_API_Message["100037"]);
        }
    },
    /*渲染阶梯价数据*/
    RenderIsPriceHtml: function (msg) {
        var html = "";
        page_seckill.PriceList = msg.productPrice;

        html += page_seckill.RenderNowOnSale();
        html += page_seckill.RenderWillSale();
        html += page_seckill.RenderStopSale();


        $("#seckillList").empty();
        $("#seckillList").html(html);

        page_seckill.RefreshCurrentPrice();

    },
    /*价格信息*/
    PriceList: {},
    /*渲染正在进行中*/
    RenderNowOnSale: function () {
        var html = "";

        for (var k in page_seckill.NowOnSaleList) {
            var obj_product = page_seckill.NowOnSaleList[k];
            html += page_seckill.RenderSingleProduct(obj_product, page_seckill.ShowType.On);
        }
        return html;
    },
    /*渲染即将开始*/
    RenderWillSale: function () {
        var html = "";
        for (var k in page_seckill.WillSaleList) {
            var obj_product = page_seckill.WillSaleList[k];
            html += page_seckill.RenderSingleProduct(obj_product, page_seckill.ShowType.Will);
        }
        return html;
    },
    /*渲染已经结束*/
    RenderStopSale: function () {
        var html = "";
        var stpl = "";
        var data = {};

        for (var k in page_seckill.StopSaleList) {
            var obj_product = page_seckill.StopSaleList[k];
            html += page_seckill.RenderSingleProduct(obj_product, page_seckill.ShowType.Stop);
        }
        return html;
    },
    /*渲染单个产品*/
    RenderSingleProduct: function (obj_product, srtype) {
        var html = "";
        var stpl = "";
        var data = {};

        var showTypeClass = "";
        switch (srtype) {
            case page_seckill.ShowType.On:
                showTypeClass = "e1"
                break;
            case page_seckill.ShowType.Will:
                showTypeClass = "e2"
                break;
            case page_seckill.ShowType.Stop:
                showTypeClass = "e3"
                break;
        }

        stpl = $("#stmpSeckill").html();
        var objprice = eval("page_seckill.PriceList." + obj_product.itemCode);
        //判断是否售光
        var isSaleOut = false;
        //if (obj_product.salesNum < obj_product.salesVolume || obj_product.salesVolume == 0) {
        if (obj_product.salesVolume <= 0) {
                isSaleOut = true;
        }
        if (page_seckill.event_product_sortType != g_const_event_product_sortType.Other) {
            data = {
                Tag: obj_product.itemCode,
                Link: isSaleOut ? "return false" : "page_seckill.LoadProductDetail('" + obj_product.itemCode + "')",
                ClassName: isSaleOut ? "curr" : "",
                ImgUrl: obj_product.mainpicUrl || g_goods_Pic,
                SeckillState: showTypeClass,
                IsSaleOut: isSaleOut ? "" : "display:none;",
                IsSaleOutInfo: isSaleOut ? "已抢光" : "已结束",

                Progress: page_seckill.GetLeftTimePercent(obj_product, srtype) + "%",
                PriceList: page_seckill.GetccurPriceListHMTL(obj_product, srtype),
                TimeStage: page_seckill.Getccurtimeornumlist(obj_product),

                Timer: '<i></i>--天--时--分--秒后结束',
                ProductName: obj_product.skuName,
                SalePrice: objprice.favorablePrice,
                MarkPrice: objprice.marketPrice,
                Residue: isSaleOut ? "0" : page_seckill.GetLeftCount(obj_product, srtype),
            };
        }
        else {
            data = {
                Tag: obj_product.itemCode,
                Link: isSaleOut ? "return false" : "page_seckill.LoadProductDetail('" + obj_product.itemCode + "')",
                ClassName: isSaleOut ? "curr" : "",
                ImgUrl: obj_product.mainpicUrl == "" ? g_goods_Pic : obj_product.mainpicUrl,
                SeckillState: showTypeClass,
                IsSaleOut: isSaleOut ? "" : "display:none;",
                IsSaleOutInfo: isSaleOut ? "已抢光" : "已结束",
                Timer: '<i></i>--天--时--分--秒后结束',
                ProductName: obj_product.skuName,
                SalePrice: objprice.favorablePrice,
                MarkPrice: objprice.marketPrice,
                Residue: isSaleOut ? "0" : page_seckill.GetLeftCount(obj_product, srtype),
            }
        }
        html = renderTemplate(stpl, data);

        window.setTimeout(function () {
            page_seckill.ShowLeftTime(obj_product, srtype);
        }, 100);

        return html;
    },
    /*取得非阶梯剩余数量*/
    GetLeftCount: function (obj_product, srtype) {
        var num = "0";
        switch (srtype) {
            case page_seckill.ShowType.On:
                num = obj_product.salesVolume;
                break;
            case page_seckill.ShowType.Will:
                num = obj_product.salesNum;
                break;
            case page_seckill.ShowType.Stop:
                num = obj_product.salesVolume;
                break;
        }
        return num;
    },
    Width: 800,
    /*取得时间或者数量阶梯*/
    Getccurtimeornumlist: function (obj_product) {
        var objprice = eval("page_seckill.PriceList." + obj_product.itemCode);
        var flastprice = parseFloat(objprice.favorablePrice);
        var html = "";
        var stack = page_seckill.Width - ((objprice.list.length + 1) * 38);

        switch (page_seckill.event_product_sortType) {
            case g_const_event_product_sortType.Time:
                var starttime = Date.Parse(obj_product.beginTime);

                var endtime = Date.Parse(obj_product.endTime);

                var ts_total = endtime.getTime() - starttime.getTime();

                var dtnow = Date.Parse(g_type_event_product_list.api_response.sysTime);


                html = '<i  data-percent=0%" data-price="' + flastprice + '" style="margin-left:0px;">' + starttime.Format("hh:mm") + '</i>'
                var last = 0;
                for (var k in objprice.list) {
                    var l = objprice.list[k];
                    for (var key in l) {

                        var iminutes = parseInt(key) / 60;
                        var totime = starttime.AddMinutes(iminutes);
                        var fpercent = iminutes * g_const_minutes / ts_total;
                        var spercent = (fpercent.toFixed(2) * 100).toString();

                        var fprice = parseFloat(l[key]);
                        html += '<i name="timmer"  data-percent="' + spercent + '%" data-price="' + fprice + '" style="margin-left:' + ((parseInt(stack) * fpercent) - last) + 'px;">' + totime.Format("hh:mm") + '</i>';
                        last = parseInt(stack) * fpercent;
                    }
                }
                break;
            case g_const_event_product_sortType.SaleCount:
                var bcount = 0;
                var ecount = obj_product.salesNum;
                var salecount = obj_product.salesNum - obj_product.salesVolume;
                html = '<i  data-percent=0%" data-price="' + flastprice + '" style="margin-left:0px;">' + bcount.toString() + '</i>';
                var last = 0;
                for (var k in objprice.list) {
                    var l = objprice.list[k];
                    for (var key in l) {

                        var icount = parseInt(key);
                        var tocount = bcount + icount;
                        var fpercent = icount / ecount;
                        var spercent = (fpercent * 100).toFixed(2).toString();

                        var fprice = parseFloat(l[key]);
                        html += '<i name="timmer"  data-percent="' + spercent + '%" data-price="' + fprice + '" style="margin-left:' + ((parseInt(stack) * fpercent) - last) + 'px;">' + tocount.toString() + '件</i>';
                        last = parseInt(stack) * fpercent;
                    }
                }
                break;
        }
        return html;
    },
    /*取得当前时间所占百分比*/
    GetLeftTimePercent: function (obj_product, srtype) {
        if (srtype == page_seckill.ShowType.On) {
            switch (page_seckill.event_product_sortType) {
                case g_const_event_product_sortType.Time:

                    var starttime = Date.Parse(obj_product.beginTime);
                    var endtime = Date.Parse(obj_product.endTime);
                    var ts_total = endtime.getTime() - starttime.getTime();
                    var dtnow = Date.Parse(g_type_event_product_list.api_response.sysTime);
                    var current = dtnow.getTime() - starttime.getTime();
                    var fpercent = (current / ts_total).toFixed(2) * 100;
                    var spercent = fpercent.toString();

                    return spercent;

                case g_const_event_product_sortType.SaleCount:
                    var fpercent = ((obj_product.salesNum - obj_product.salesVolume) / obj_product.salesNum).toFixed(2) * 100;
                    var spercent = fpercent.toString();
                    return spercent;
                    break;
            }

        }
        else if (srtype == page_seckill.ShowType.Will)
            return "0";
        else if (srtype == page_seckill.ShowType.Stop)
            return "100";
        else
            return "0";
    },
    CurrentPrice: "",
    /*取得价格列表HTML*/
    GetccurPriceListHMTL: function (obj_product, srtype) {
        var html = "";
        var objprice = eval("page_seckill.PriceList." + obj_product.itemCode);

        var starttime = Date.Parse(obj_product.beginTime);
        var endtime = Date.Parse(obj_product.endTime);

        var ts_total = endtime.getTime() - starttime.getTime();

        var dtnow = Date.Parse(g_type_event_product_list.api_response.sysTime);

        var arrstepprice = [];
        var maxlength = objprice.list.length;

        var fprice = 0.00;

        var flastprice = parseFloat(objprice.favorablePrice);



        var bcount = 0;
        var ecount = obj_product.salesNum;
        var salecount = obj_product.salesNum - obj_product.salesVolume;

        var btime = starttime;
        var etime;
        var addMinutes = 0;

        var last1 = 0;
        for (var k = 0; k < objprice.list.length; k++) {
            var currentPrice = objprice.list[k];
            for (var key in currentPrice) {
                var fpercent = 0;
                var spercent = "";
                switch (page_seckill.event_product_sortType) {
                    case g_const_event_product_sortType.Time:
                        addMinutes = parseInt(key) / 60;
                        var totime = starttime.AddMinutes(addMinutes);
                        fpercent = addMinutes * g_const_minutes / ts_total;
                        spercent = (fpercent.toFixed(2) * 100).toString();

                        break;
                    case g_const_event_product_sortType.SaleCount:
                        var icount = parseInt(key);
                        var tocount = bcount + icount;
                        fpercent = icount / ecount;
                        spercent = (fpercent * 100).toFixed(2).toString();

                        break;
                }
                fprice = parseFloat(currentPrice[key]);
            }

            //if (k == 0) {
            //    html += '<span style="width:' + (page_seckill.Width * fpercent - last + 19) + 'px;" data-percent="' + 0 + '">￥' + flastprice + '</span>';
            //    html += '<span style="width:' + (page_seckill.Width * fpercent - last) + 'px;" data-percent="' + spercent + '">￥' + fprice + '</span>';
            //}
            //if (k == 1) {
            //    html += '<span style="width:' + (page_seckill.Width * fpercent - last - 38 - 19) + 'px;" data-percent="' + spercent + '">￥' + fprice + '</span>';
            //}
            //if (k == 2) {
            //    html += '<span style="width:38px;" data-percent="' + spercent + '">￥' + fprice + '</span>';
            //}

            if (k == 0) {
                html += '<span style="width:' + (page_seckill.Width * fpercent - last1 - 2) + 'px;" data-percent="' + 0 + '">￥' + flastprice + '</span>';
                html += '<span style="width:' + (page_seckill.Width * fpercent - last1 - 2) + 'px;" data-percent="' + spercent + '">￥' + fprice + '</span>';
            }
            if (k == 1) {
                html += '<span style="width:' + (page_seckill.Width * fpercent - last1 - 2) + 'px;" data-percent="' + spercent + '">￥' + fprice + '</span>';
            }
            if (k == 2) {
                html += '<span style="width:38px;" data-percent="' + spercent + '">￥' + fprice + '</span>';
            }



           //if (k !== 0) {
                last1 += page_seckill.Width * fpercent;
            //}
        }
        return html;
    },
    /*是否在数组内*/
    ExistInArray: function (obj, arr) {
        for (var i in arr) {
            var o = arr[i];
            if (obj.begintime == o.begintime && obj.endtime == o.endtime)
                return o;
        }
        return null;
    },
    /*正在进行中的销售列表*/
    NowOnSaleList: [],
    /*即将开始的销售列表*/
    WillSaleList: [],
    /*已经停止的销售列表*/
    StopSaleList: [],
    Current: "",
    /*显示倒计时*/
    ShowLeftTime: function (obj_product, srtype) {
        var date_last, showtext;
        var objTimer = $("#" + obj_product.itemCode).find("h2");
        var objMsg = $("#" + obj_product.itemCode).find("strong");
        var objEm = $("#" + obj_product.itemCode).find("em");
        var objBtn = $("#" + obj_product.itemCode).find("a[name='btn']");
        var date_now = new Date();
        switch (srtype) {
            case page_seckill.ShowType.On:
                //正在进行中
                date_last = Date.Parse(obj_product.endTime);
                page_seckill.Current = page_seckill.ShowType.On;

                $(objEm).attr("class", "e1");
                showtext = "结束";

                //正在进行中结束
                if (date_last.getTime() - date_now.getTime() <= 0) {
                    page_seckill.Current = page_seckill.ShowType.Stop;

                    showtext = "活动日期" + Date.Parse(obj_product.beginTime).Format("MM月dd日");
                }
                break;
            case page_seckill.ShowType.Will:
                //即将开始
                showtext = "开始";

                date_last = Date.Parse(obj_product.beginTime);
                page_seckill.Current = page_seckill.ShowType.Will;

                $(objEm).attr("class", "e2");
                $(objBtn).addClass("curr").attr('disabled', 'disabled');

                //即将开始变成正在进行中
                if (date_last.getTime() - date_now.getTime() <= 0) {

                    date_last = Date.Parse(obj_product.endTime);
                    page_seckill.Current = page_seckill.ShowType.On;

                    showtext = "结束";
                    $(objEm).attr("class", "e1");
                    $(objBtn).removeClass("curr").attr('disabled', false);
                }

                break;
            case page_seckill.ShowType.Stop:
                page_seckill.Current = page_seckill.ShowType.Stop
                date_last = Date.Parse(obj_product.endTime);

                $(objEm).attr("class", "e3");
                showtext = "活动日期" + Date.Parse(obj_product.beginTime).Format("MM月dd日");
                $(objMsg).show();
                $(objBtn).addClass("curr").attr('disabled', 'disabled');
                break;
        }


        var date_now = new Date();
        var ts = date_last.getTime() - date_now.getTime();  //时间差的毫秒数              
        if (ts > 0) {
            var days = Math.floor(ts / g_const_days);
            var leftmillionseconds = ts % g_const_days;

            var hours = Math.floor(leftmillionseconds / g_const_hours);
            leftmillionseconds = leftmillionseconds % g_const_hours;

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
            if (srtype != page_seckill.ShowType.Stop) {
                timmerText = '<i></i>' + days.toString() + '天' + hourstring + '时' + minutestring + '分' + secondstring + '秒后' + showtext;

            }
            else {
                timmerText = '<i></i>' + showtext;
            }
            $(objTimer).html(timmerText);

            if (days == 0 && hours == 0 && minutes == 0 && seconds == 0) {
                if (page_seckill.Current == page_seckill.ShowType.On) {
                    date_last = Date.Parse(obj_product.endTime);

                    $(objEm).attr("class", "e3");
                    var endtext = '<i></i>活动日期' + Date.Parse(obj_product.beginTime).Format("MM月dd日");
                    $(objMsg).show();
                    $(objBtn).addClass("curr").attr('disabled', 'disabled');
                    $(objTimer).html(endtext);

                }
                if (page_seckill.Current == page_seckill.ShowType.Will) {
                    $(objEm).attr("class", "e1");
                    page_seckill.ShowLeftTime(obj_product, srtype);
                }
            }
            else {
                window.setTimeout(function () {
                    page_seckill.ShowLeftTime(obj_product, srtype);
                }, 1000);
            }
        }
    },
    //多久抢光多少件显示状态
    SackTime: function (obj_product) {
        var html = "";
        var date_now = new Date();
        var date_last = Date.Parse(obj_product.endTime);
        var ts = date_last.getTime() - date_now.getTime();

        //判断服务器是否还有可卖库存数量
        if (obj_product.salesVolume == 0) {

            //多久抢光(获取服务器秒数)
            var longProduct = obj_product.longProduct;

            ts = longProduct * 1000;
        }
        var days = Math.floor(ts / g_const_days);
        var leftmillionseconds = ts % g_const_days;

        var hours = Math.floor(leftmillionseconds / g_const_hours);
        leftmillionseconds = leftmillionseconds % g_const_hours;

        var minutes = Math.floor(leftmillionseconds / g_const_minutes);
        leftmillionseconds = leftmillionseconds % g_const_minutes;

        var seconds = Math.floor(leftmillionseconds / g_const_seconds);

        var hourstring = "0" + hours.toString();
        hourstring = hourstring.substr(hourstring.length - 2, 2);
        var minutestring = "0" + minutes.toString();
        minutestring = minutestring.substr(minutestring.length - 2, 2);

        var secondstring = "0" + seconds.toString();
        secondstring = secondstring.substr(secondstring.length - 2, 2);

        html = '<i></i>' + days.toString() + '天' + hourstring + '时' + minutestring + '分' + secondstring + '秒 抢光' + (obj_product.salesNum - obj_product.salesVolume);

        return html;
    },

    RefreshCurrentPrice: function () {
        $(page_seckill.ItemCodes).each(function () {

            var objprice = eval("page_seckill.PriceList." + this);
            var $obj = $("#" + this);
            var arrobjTimmer = $obj.find("i[name=timmer]");
            var $currentPriceObj = $obj.find("b[name=currentPrice]");
            var $progresser = $obj.find("i[name=progresser]");

            var progresse = $progresser.data("progress");

            var currentPrice = parseFloat(objprice.favorablePrice);
            $(arrobjTimmer).each(function () {

                if ($(this).data("percent") == progresse) {
                    currentPrice = $(this).data("price");
                    return false;
                }
            });
            $currentPriceObj.html('￥' + currentPrice);
        });
    },
    LoadProductDetail: function (pid) {
        var p = "&pid=" + pid + "&t=" + Math.random();
        g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.ProductDetail), p);
    }
}