/// <reference path="../jquery-2.1.4.js" />
/// <reference path="../iscroll.js" />
/// <reference path="../g_header.js" />
/// <reference path="../functions/g_Const.js" />
/// <reference path="../functions/g_Type.js" />

var Page_Index = {
    /*接口名称*/
    api_target: "com_cmall_familyhas_api_ApiHomeColumn",
    /*输入参数*/
    api_input: { "sysDateTime": new Date().Format("yyyy-MM-dd hh:mm:ss"), "buyerType": "", "maxWidth": "", "version": 1.0, "viewType": g_const_viewType.WXSHOP },
    /*接口响应对象*/
    api_response: {},
    /*初始化*/
    "Init": function () {
        //清除浏览路径
        PageUrlConfig.Clear();
        PageUrlConfig.SetUrl();
        $(".header .hd-search").on("click", function (e) {
            PageUrlConfig.SetUrl();
            window.location.href = g_const_PageURL.Search + "?t=" + Math.random();;//"search.html";
        });
        $(".header .hd-classify").on("click", function (e) {
            PageUrlConfig.SetUrl();
            window.location.href = g_const_PageURL.Category + "?t=" + Math.random();
        });
        $(".header .user-content").on("click", function (e) {
            PageUrlConfig.SetUrl();
            window.location.href = g_const_PageURL.AccountIndex + "?t=" + Math.random();//"Account/index.html";
        });
        $(".app-close").on("click", function (e) {
            $(e.target).parent().css("display", "none");
        });
        
        Page_Index.GetCartCount();
        Page_Index.GetWXOpenID();
    },
    /*获取购物车的中商品的数量*/
    "GetCartCount": function () {
        $(".shop-cart").empty();
        var sCart = localStorage[g_const_localStorage.Cart];
        var objCart = null;
        if (typeof (sCart) != "undefined") {
            objCart = JSON.parse(sCart);
        }
        var icount = 0;
        var scount = ""
        if (objCart != null) {
            for (var i = 0; i < objCart.GoodsInfoForAdd.length; i++) {
                var GoodsInfo = objCart.GoodsInfoForAdd[i];
                icount += GoodsInfo.sku_num;
            }
        }
        if (icount > 99)
            scount = "99+";
        else
            scount = icount.toString();
        var html = "";
        if (icount != 0)
            html = "<em>" + scount + "</em>";
        $(".shop-cart").append(html);
    },
    "GetWXOpenID": function () {
        if (GetQueryString("tc") == "WeiXin") {
            var purl = g_INAPIUTL;
            var request = $.ajax({
                url: purl,
                cache: false,
                method: g_APIMethod,
                data: "t=" + Math.random() + "&action=getwxopenid",
                dataType: "json"
            });
            request.done(function (msg) {
                if (msg.resultcode == g_const_Success_Code_IN) {
                    localStorage[g_const_localStorage.Member] = msg.resultmessage;
                }
            });
            request.fail(function (jqXHR, textStatus) {
            });
        }
    },
    /*获取数据*/
    "LoadData": function () {
        var s_api_input = JSON.stringify(Page_Index.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": Page_Index.api_target };
        var purl = g_APIUTL;
        //g_APIMethod = "get";
        //purl = "/JYH/index1.txt";
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            //$("#pageloading").css("display", "none");
            Page_Index.api_response = msg;
            if (msg.resultCode == g_const_Success_Code) {
                Page_Index.LoadTop3();
                Page_Index.LoadOther();
                Page_Index.LoadGuessYourLikeData();

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
    /*读取Top3*/
    LoadTop3: function () {
        var top3list = Page_Index.api_response.topThreeColumn.topThreeColumnList;
        $(".menu-list.clearfix").css("display", "none");
        $(".index-ad.clearfix").css("display", "none");
        for (var i = 0; i < top3list.length; i++) {
            var top3 = top3list[i];
            switch (top3.columnType) {
                case g_const_columnType.swipeSlide:
                    $(".swipe-slide").empty();
                    if (top3.contentList.length > 0) {
                        var swipehtml = " <ul>";
                        var swipeNum = " <div class='swipe-num'> ";
                        // <li><a href=""><img src="./img/w-demo/demo-15.jpg"></a></li>
                        for (var iswipe = 0; iswipe < top3.contentList.length; iswipe++) {
                            var swipe = top3.contentList[iswipe];
                            var surl = Page_Index.GetLocationByShowmoreLinktype(swipe.showmoreLinktype, swipe.showmoreLinkvalue);
                            if (swipe.isShare == g_const_isShowmore.YES) {
                                surl += "&wx_st=" + encodeURIComponent(swipe.shareTitle);
                                surl += "&wx_sc=" + encodeURIComponent(swipe.shareContent);
                                surl += "&wx_si=" + encodeURIComponent(swipe.sharePic);
                            }                                
                            swipehtml += '<li><a href="' + surl + '"><img src="' + g_GetPictrue(swipe.picture) + '"></a></li>';
                            swipeNum += '<a href="javascript:;"></a>';
                        }
                        swipehtml += "</ul>";
                        swipeNum += "</div>";
                        $(".swipe-slide").append(swipehtml).append(swipeNum);
                    }
                    break;
                case g_const_columnType.TwoADs:
                    var twoadshtml = "";
                    $(".index-ad.clearfix").empty();
                    $(".index-ad.clearfix").css("display", "");
                    if (top3.contentList.length == 2) {
                        for (var itwoads = 0; itwoads < top3.contentList.length; itwoads++) {
                            var ad = top3.contentList[itwoads];
                            twoadshtml += '<li><a <a href="' + Page_Index.GetLocationByShowmoreLinktype(ad.showmoreLinktype, ad.showmoreLinkvalue) + '" title=""><img src="' + g_GetPictrue(ad.picture) + '" alt=""></a></li>';
                        }
                        $(".index-ad.clearfix").append(twoadshtml);
                    }
                    break;
                case g_const_columnType.Navigation:
                    var navhtml = "";
                    $(".menu-list.clearfix").empty();
                    $(".menu-list.clearfix").css("display", "");
                    if (top3.contentList.length > 0) {
                        for (var inav = 0; inav < top3.contentList.length; inav++) {
                            var nav = top3.contentList[inav];
                            navhtml += '<li class="clearfix"><a href="' + Page_Index.GetLocationByShowmoreLinktype(nav.showmoreLinktype, nav.showmoreLinkvalue) + '" title=""><img src="' + g_GetPictrue(nav.picture) + '" alt=""><em>' + nav.title + '</em></a></li>';
                        }
                        $(".menu-list.clearfix").append(navhtml);
                    }
                    else
                        $(".menu-list.clearfix").css("display", "none");
                    break;
            }
        }
        /* @ 首页焦点图 */
        $('.swipe-slide').swipeSlide({
            continuousScroll: true,
            speed: 3000,
            transitionType: 'cubic-bezier(0.22, 0.69, 0.72, 0.88)',
            callback: function (i) {
                $('.swipe-num').children().eq(i).addClass('curr').siblings().removeClass('curr');
            }
        });
    },
    /*根据链接类型转换链接地址*/
    GetLocationByShowmoreLinktype: function (t, u) {
        //PageUrlConfig.SetUrl();
        return g_GetLocationByShowmoreLinktype(t, u);
    },    
    /*读取其它模板*/
    LoadOther: function () {
        var otherlist = Page_Index.api_response.columnList;
        var stpl = "";//页面模板内容
        var data = {};//渲染模板时的对象
        var html = "";
        for (var i = 0; i < otherlist.length; i++) {
            var other = otherlist[i];
            switch (other.columnType) {
                case g_const_columnType.FastBuy:
                    //闪购(限时抢购)
                    Page_Index.FastBuy = other;
                    html = "";

                    stpl = $("#tpl_fastbuy_productList")[0].innerHTML;
                    for (var j = 0; j < other.contentList.length; j++) {
                        var other_content = other.contentList[j];
                        data = {
                            "showmoreLink": Page_Index.GetLocationByShowmoreLinktype(other_content.showmoreLinktype, other_content.showmoreLinkvalue),
                            "picture": g_GetPictrue(other_content.picture),
                            "discount": other_content.productInfo.discount,
                            "productName": FormatText(other_content.productInfo.productName, 9),
                            "sellPrice": other_content.productInfo.sellPrice
                        };
                        html += renderTemplate(stpl, data);
                    }

                    stpl = $("#tpl_fastbuy")[0].innerHTML;
                    data = {
                        "columnName": other.columnName,
                        "showmoreLink": Page_Index.GetLocationByShowmoreLinktype(other.showmoreLinktype, other.showmoreLinkvalue),
                        "showmoreTitle": other.showmoreTitle,
                        "CountDown": '<i>距离结束</i><em class=""></em><b>:</b><em class=""></em><b>:</b><em class=""></em>',
                        "productList": html
                    };
                    html = renderTemplate(stpl, data);

                    $("#bodycontent").append(html);
                    Page_Index.flagCheapInterval = self.setInterval("Page_Index.ShowLeftTime();", g_const_seconds);
                    //<i>距离结束</i><em class="">15</em><b>:</b><em class="">20</em><b>:</b><em class="">30</em>
                    break;
                case g_const_columnType.CommonAD:
                    //通屏广告
                    var commonAD = other.contentList[0];
                    stpl = $("#tpl_commonAD")[0].innerHTML;
                    data = {
                        "showmoreLink": Page_Index.GetLocationByShowmoreLinktype(commonAD.showmoreLinktype, commonAD.showmoreLinkvalue),
                        "picture": g_GetPictrue(commonAD.picture)
                    };
                    html = renderTemplate(stpl, data);
                    $("#bodycontent").append(html);
                    break;
                case g_const_columnType.RecommendONE:
                    stpl = $("#tpl_recommendone")[0].innerHTML;
                    data = {
                        "columnName": other.columnName,
                        "showmoreLink": Page_Index.GetLocationByShowmoreLinktype(other.showmoreLinktype, other.showmoreLinkvalue),
                        "showmoreTitle": Page_Index.showmoreTitle(other),
                        "classmore": Page_Index.classmore(other),
                        "pshowmoreLink": Page_Index.GetLocationByShowmoreLinktype(other.contentList[0].showmoreLinktype, other.contentList[0].showmoreLinkvalue),
                        "titleColor": "color:" + other.contentList[0].titleColor,
                        "title": FormatText(other.contentList[0].title, 6),
                        "descriptionColor": "color:" + other.contentList[0].descriptionColor,
                        "description": FormatText(other.contentList[0].description, 10),
                        "picture": g_GetPictrue(other.contentList[0].picture)
                    };
                    html = renderTemplate(stpl, data);
                    $("#bodycontent").append(html);
                    break;
                case g_const_columnType.RecommendRightTwo:
                case g_const_columnType.RecommendLeftTwo:
                    html = "";
                    stpl = $("#tpl_recommend_leftorright_two_product")[0].innerHTML;
                    for (var j = 0; j < other.contentList.length; j++) {
                        var other_content = other.contentList[j];
                        data = {
                            "showmoreLink": Page_Index.GetLocationByShowmoreLinktype(other_content.showmoreLinktype, other_content.showmoreLinkvalue),
                            "picture": g_GetPictrue(other_content.picture),
                            "titleColor": "color:" + other_content.titleColor,
                            "title": FormatText(other_content.title, 5),
                            "descriptionColor": "color:" + other_content.descriptionColor,
                            "description": FormatText(other_content.description, 9)
                        };
                        html += renderTemplate(stpl, data);
                    }

                    stpl = $("#tpl_recommend_leftorright_two")[0].innerHTML;
                    data = {
                        "columnName": other.columnName,
                        "showmoreLink": Page_Index.GetLocationByShowmoreLinktype(other.showmoreLinktype, other.showmoreLinkvalue),
                        "classmore": Page_Index.classmore(other),
                        "showmoreTitle": Page_Index.showmoreTitle(other),
                        "classcolumn": g_const_columnType.RecommendLeftTwo == other.columnType ? "column-left" : "column-right",
                        "productList": html
                    };
                    html = renderTemplate(stpl, data);
                    $("#bodycontent").append(html);
                    break;
                case g_const_columnType.RecommendProduct:
                    html = "";
                    stpl = $("#tpl_recommend_product_product")[0].innerHTML;
                    for (var j = 0; j < other.contentList.length; j++) {
                        var other_content = other.contentList[j];
                        data = {
                            "showmoreLink": Page_Index.GetLocationByShowmoreLinktype(other_content.showmoreLinktype, other_content.showmoreLinkvalue),
                            "picture": g_GetPictrue(other_content.productInfo.mainpicUrl),
                            "productName": FormatText(other_content.productInfo.productName, 10),
                            "sellPrice": other_content.productInfo.sellPrice,

                        };
                        html += renderTemplate(stpl, data);
                    }

                    stpl = $("#tpl_recommend_product")[0].innerHTML;
                    data = {
                        "columnName": other.columnName,
                        "showmoreLink": Page_Index.GetLocationByShowmoreLinktype(other.showmoreLinktype, other.showmoreLinkvalue),
                        "classmore": Page_Index.classmore(other),
                        "showmoreTitle": Page_Index.showmoreTitle(other),
                        "productList": html,
                        "touchwrapid":"touchwrapid_"+i.toString()
                    };
                    html = renderTemplate(stpl, data);
                    $("#bodycontent").append(html);
                    Page_Index.touchInit(data.touchwrapid);                    
                    break;
                case g_const_columnType.RecommendHot:
                    html = "";
                    stpl = $("#tpl_RecommendHot_product")[0].innerHTML;
                    for (var j = 0; j < other.contentList.length; j++) {
                        var other_content = other.contentList[j];
                        data = {
                            "showmoreLink": Page_Index.GetLocationByShowmoreLinktype(other_content.showmoreLinktype, other_content.showmoreLinkvalue),
                            "picture": g_GetPictrue(other_content.picture),
                            "titleColor": "color:"+other_content.titleColor,
                            "title": FormatText(other_content.title, 5),
                            "descriptionColor": "color:" + other_content.descriptionColor,
                            "description": FormatText(other_content.description, 9)
                        };
                        html += renderTemplate(stpl, data);
                    }

                    stpl = $("#tpl_RecommendHot")[0].innerHTML;
                    data = {
                        "columnName": other.columnName,
                        "showmoreLink": Page_Index.GetLocationByShowmoreLinktype(other.showmoreLinktype, other.showmoreLinkvalue),
                        "classmore": Page_Index.classmore(other),
                        "showmoreTitle": Page_Index.showmoreTitle(other),
                        "productList": html
                    };
                    html = renderTemplate(stpl, data);
                    $("#bodycontent").append(html);
                    break;
                case g_const_columnType.TVLive:
                    html = "";
                    var numhtml = "";
                    var numstpl = "";
                    //<i class="f18">{{sellPrice}}</i>.<i class="f14">10</i>
                    stpl = $("#tpl_tvlive_product")[0].innerHTML;
                    numstpl = $("#tpl_tvlive_num")[0].innerHTML;
                    for (var j = 0; j < other.contentList.length; j++) {
                        var other_content = other.contentList[j];
                        data = {
                            "showmoreLink": Page_Index.GetLocationByShowmoreLinktype(other_content.showmoreLinktype, other_content.showmoreLinkvalue),
                            "picture": g_GetPictrue(other_content.picture),
                            "productName": FormatText(other_content.productInfo.productName, 25),
                            "sellPrice": function (sellPrice) {
                                var arrmoney = sellPrice.split(".");
                                if (arrmoney.length = 1)
                                    return '<i class="f18">' + sellPrice + '</i>';
                                else if (arrmoney.length = 2)
                                    return '<i class="f18">' + arrmoney[0] + '</i>.<i class="f14">' + arrmoney[1] + '</i>';
                                else
                                    return '<i class="f18">' + sellPrice + '</i>';

                            }(other_content.productInfo.sellPrice),
                            "startTime": Date.Parse(other_content.startTime).Format("hh:mm"),
                            "endTime": Date.Parse(other_content.endTime).Format("hh:mm")
                        };
                        html += renderTemplate(stpl, data);
                        data = {
                            "classcurr": "class=\"\""
                        };
                        numhtml += renderTemplate(numstpl, data);
                    }
                    if (other.contentList.length <= 1) {
                        numhtml = "&nbsp;"
                    }
                    stpl = $("#tpl_tvlive")[0].innerHTML;
                    data = {
                        "columnName": other.columnName,
                        "showmoreLink": "/tvlive.html",//Page_Index.GetLocationByShowmoreLinktype(other.showmoreLinktype, other.showmoreLinkvalue),
                        "classmore": Page_Index.classmore(other),
                        "showmoreTitle": Page_Index.showmoreTitle(other),
                        "productList": html,
                        "NumList": numhtml
                    };
                    html = renderTemplate(stpl, data);
                    $("#bodycontent").append(html);
                    /* @ 首页焦点图 */
                    $('.module-live').swipeSlide({
                        continuousScroll: true,
                        speed: 3000,
                        transitionType: 'cubic-bezier(0.22, 0.69, 0.72, 0.88)',
                        callback: function (i) {
                            $('.live-goods-num').children().eq(i).addClass('curr').siblings().removeClass('curr');
                        }
                    });
                    break;
            }
        }
    },
    /*横向滚动初始化*/
    touchInit: function (touchwrapid) {
        var iWidth = $(window).innerWidth();
        var wrap = $('.touch-wrap');
        var goodsWrap = $('.goods-recomd');
        goodsWrap.each(function(){
        		var aLi = $(this).find('li');
        		var len = aLi.length;
	        aLi.css({
	            'width': Math.ceil(iWidth / 3)
	        });
	        $(this).css({
	            'width': Math.ceil(aLi.outerWidth()) * aLi.length
	        });
        });
        
        wrap.css({
            'width': iWidth,
            'overflow': 'hidden'
        });
        
        var myscroll = new IScroll("#" + touchwrapid, {
            scrollX: true, scrollY: false, mouseWheel: true, preventDefault: false
        });
    },
    /*快速购买数据*/
    FastBuy: {},
    /*倒计时*/
    ShowLeftTime: function () {
        var date_last = Date.Parse(Page_Index.FastBuy.endTime);
        var date_now = new Date();
        var ts = date_last.getTime() - date_now.getTime();  //时间差的毫秒数              

        var hours = Math.floor(ts / g_const_hours);
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
        $(".count-down")[0].innerHTML = '<i>距离结束</i><em class="">' + hourstring + '</em><b>:</b><em class="">' + minutestring + '</em><b>:</b><em class="">' + secondstring + '</em>';
        if (hours == 0 && minutes == 0 && seconds == 0)
            self.clearInterval(Page_Index.flagCheapInterval);
    },
    flagCheapInterval: 0,
    /*获取更多的Class*/
    classmore: function (other) {
        if (other.isShowmore == g_const_isShowmore.YES) {
            return other.showmoreTitle == "" ? "" : "more";
        }
        else
            return "";
    },
    /*更多的文字标题*/
    showmoreTitle: function (other) {
        if (other.isShowmore == g_const_isShowmore.YES) {
            return other.showmoreTitle == "" ? "&nbsp;" : other.showmoreTitle;
        }
        else
            return "&nbsp;";

    },
    /*猜你喜欢当前页数*/
    GuessYourLike_pageNum: 1,
    /*猜你喜欢总页数*/
    GuessYourLike_TotalPages: 1,
    /*猜你喜欢响应对象*/
    GuessYourLike_api_response: 1,
    /*获取猜你喜欢数据*/
    "LoadGuessYourLikeData": function () {
        Page_Index.api_input = { buyerType: "", SwiftNumber: "", version: 1.0, pageNum: Page_Index.GuessYourLike_pageNum };
        Page_Index.api_target = "com_cmall_familyhas_api_ApiForMaybeLove";
      //  Page_Index.api_input.picWidth = 500;
        var s_api_input = JSON.stringify(Page_Index.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": Page_Index.api_target };
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
            Page_Index.GuessYourLike_api_response = msg;
            if (msg.resultCode == g_const_Success_Code) {
                if (Page_Index.Pagination == -1)
                    Page_Index.Pagination = msg.pagination
                if (Page_Index.GuessYourLike_pageNum <= Page_Index.Pagination || Page_Index.Pagination == -1) {
                    Page_Index.LoadGuessYourLike();
                    Page_Index.GuessYourLike_pageNum++;
                }
                else
                    ShowMesaage(g_const_API_Message["100021"]);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            //$("#pageloading").css("display", "none");
            ShowMesaage(g_const_API_Message["100022"]);
        });
    },
    /*猜你喜欢的总页数*/
    Pagination: -1,
    /*渲染猜你喜欢*/
    LoadGuessYourLike: function () {
        var html = "";
        var stpl = $("#tpl_GuessYourLike_product")[0].innerHTML;
        var guessyoulike = Page_Index.GuessYourLike_api_response;
        for (var j = 0; j < guessyoulike.productMaybeLove.length; j++) {
            var productMaybeLove = guessyoulike.productMaybeLove[j];
            data = {
                "ProductDetailURL": Page_Index.GetLocationByShowmoreLinktype(g_const_showmoreLinktype.ProductDetail, productMaybeLove.procuctCode),
                "picture": g_GetPictrue(productMaybeLove.mainpic_url),
                //"discount": function (a, b) {
                //    var float_a = parseFloat(a);
                //    var float_b = parseFloat(b);
                //    var float_c = float_a / float_b * 10;
                //    var s = float_c.toFixed(1).toString();
                //    if (s == "10.0" || s == "Infinity")
                //        s = "&nbsp;";
                //    return s;
                //}(productMaybeLove.productPrice, productMaybeLove.market_price),
                "productNameString": FormatText(productMaybeLove.productNameString, 10),
                "productPrice": productMaybeLove.productPrice,
                "market_price": productMaybeLove.market_price
            };
            html += renderTemplate(stpl, data);
        }




        if (Page_Index.GuessYourLike_pageNum == 1) {
            stpl = $("#tpl_GuessYourLike")[0].innerHTML;
            data = {
                "productList": html
            };
            html = renderTemplate(stpl, data);
            var iheight;
            if (Page_Index.GuessYourLike_pageNum == 1) {
                iheight = $(document).height();
            }
            //$("#ichsy_jyh_wrapper").css("top", iheight-90);
            $("#bodycontent").append(html);
            Page_Index.InitScroll();
        }
        else {
            $("#ichsy_jyh_scroller").append(html);
        }

    },
    InitScroll: function () {
        var iHeight = 0;
        var winHeight = $(window).height();
        $(window).on('scroll', function () {
            var el = $(this);
            var iScrollTop = el.scrollTop();
            iHeight = $('body').height();
            if ((iScrollTop + winHeight) >= iHeight) {
                if (Page_Index.GuessYourLike_pageNum <= Page_Index.Pagination) {
                    Page_Index.LoadGuessYourLikeData();
                } else {
                    ShowMesaage(g_const_API_Message["100021"]);
                }
            }
        });
    }
};