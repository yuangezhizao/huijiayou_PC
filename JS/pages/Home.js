var Home = {
    pcHomeTopThreeColumnTag: "com_cmall_familyhas_api_ApiPcHomeColumn",
    pcHomeTopThreeColumnApiInput: { "viewType": "4497471600100003", "buyerType": "", "maxWidth": "0" },
    refreshFastBuyTag: "com_cmall_familyhas_api_ApiColumnDetail",
    refreshFastBuyInput: { pageType: "0", columnID: "" },
    Init: function () {
        if (Home.pcHomeTopThreeColumnTag == "com_cmall_familyhas_api_ApiPcHomeColumn") {
            if (typeof (web_index) != 'undefined') {
                Home.GetHomeDataStatic();
            }
            else {
                Home.GetHomeData();
            }
            
        }
        else {
            Home.GetHomeData();
        }
    },
    ServerDate: "",
    OtherColumnData: "",
    /*首页TopThree start*/
    //获取数据
    GetHomeData: function () {
        var s_api_input = JSON.stringify(Home.pcHomeTopThreeColumnApiInput);
        var obj_data = { "api_input": s_api_input, "api_target": Home.pcHomeTopThreeColumnTag };
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
                Home.ServerDate = msg.sysTime;
                Home.OtherColumnData = msg.columnList;
                Home.LoadTopThreeResult(msg.topThreeColumn.topThreeColumnList);

                var codeList = [];
                $(msg.columnList).each(function () {
                    var self = this;
                    $(self.ad1List).each(function () {
                        if (this.productInfo.productCode) {
                            codeList.push(this.productInfo.productCode);
                        }
                    });
                    $(self.ad3List).each(function () {
                        if (this.productInfo.productCode) {
                            codeList.push(this.productInfo.productCode);
                        }
                    });
                    $(self.contentList).each(function () {
                        if (this.productInfo.productCode) {
                            codeList.push(this.productInfo.productCode);
                        }
                    });
                    $(self.hotPointList).each(function () {
                        if (this.productInfo.productCode) {
                            codeList.push(this.productInfo.productCode);
                        }
                    });
                    $(self.logoList).each(function () {
                        if (this.productInfo.productCode) {
                            codeList.push(this.productInfo.productCode);
                        }
                    });
                });

                InnerBuy.GetList(codeList.join(","), Home.LoadOtherColumn);
                //    Home.LoadMaybeLove();
                g_index.Warrant();
                $("#prev1,#next1").hover(function () {
                    $(this).fadeTo("show", 1);
                }, function () {
                    $(this).fadeTo("show", 0.5);
                })
                $("#focus1").slide({ titCell: "#num1 ul", mainCell: "#cont1", effect: "fold", autoPlay: true, delayTime: 700, autoPage: true });

                $("a[name=prev2],a[name=next2]").hover(function () {
                    $(this).fadeTo("show", 1);
                }, function () {
                    $(this).fadeTo("show", 0.5);
                });
                $("div[name=focus2]").slide({ titCell: "div[name=num2] ul", mainCell: "ul[name=cont2]", effect: "fold", autoPlay: true, delayTime: 700, autoPage: true });

                $("div[name=fastButEnd]").on("click", function () {
                    var fast = "";
                    var tag = $(this).parent().find("ul").attr("id");
                    for (var i in Home.FastBuy) {
                        var f = Home.FastBuy[i];
                        if (f.id == tag) {
                            fast = f;
                        }
                    }
                    if (fast != "") {
                        Home.refreshFastBuyInput.columnID = fast.coId;
                        Home.RefreshFastBuy(fast);
                    }
                });

                //懒加载测试
                // lazyload_allimg("index_foot_div", 100);//id=“index_foot_div”中的img在距离距离显示在页面中100px前加载实际内容
                //  lazyload_allimg("", 100);//全部img元素在距离距离显示在页面中100px前加载实际内容

            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    GetHomeDataStatic: function () {

        //   alert(new Date().getTime() - Home.ttt);

        var msg = web_index;
        if (msg.resultCode == g_const_Success_Code) {
            Home.ServerDate = msg.sysTime;
            Home.OtherColumnData = msg.columnList;
            Home.LoadTopThreeResult(msg.topThreeColumn.topThreeColumnList);

            var codeList = [];
            $(msg.columnList).each(function () {
                var self = this;
                $(self.ad1List).each(function () {
                    if (this.productInfo.productCode) {
                        codeList.push(this.productInfo.productCode);
                    }
                });
                $(self.ad3List).each(function () {
                    if (this.productInfo.productCode) {
                        codeList.push(this.productInfo.productCode);
                    }
                });
                $(self.contentList).each(function () {
                    if (this.productInfo.productCode) {
                        codeList.push(this.productInfo.productCode);
                    }
                });
                $(self.hotPointList).each(function () {
                    if (this.productInfo.productCode) {
                        codeList.push(this.productInfo.productCode);
                    }
                });
                $(self.logoList).each(function () {
                    if (this.productInfo.productCode) {
                        codeList.push(this.productInfo.productCode);
                    }
                });
            });

            InnerBuy.GetList(codeList.join(","), Home.LoadOtherColumn);
            //Home.LoadOtherColumn();
            //    Home.LoadMaybeLove();
            g_index.Warrant();
            $("#prev1,#next1").hover(function () {
                $(this).fadeTo("show", 1);
            }, function () {
                $(this).fadeTo("show", 0.5);
            })
            $("#focus1").slide({ titCell: "#num1 ul", mainCell: "#cont1", effect: "fold", autoPlay: true, delayTime: 700, autoPage: true });

            $("a[name=prev2],a[name=next2]").hover(function () {
                $(this).fadeTo("show", 1);
            }, function () {
                $(this).fadeTo("show", 0.5);
            });
            $("div[name=focus2]").slide({ titCell: "div[name=num2] ul", mainCell: "ul[name=cont2]", effect: "fold", autoPlay: true, delayTime: 700, autoPage: true });

            $("div[name=fastButEnd]").on("click", function () {
                var fast = "";
                var tag = $(this).parent().find("ul").attr("id");
                for (var i in Home.FastBuy) {
                    var f = Home.FastBuy[i];
                    if (f.id == tag) {
                        fast = f;
                    }
                }
                if (fast != "") {
                    Home.refreshFastBuyInput.columnID = fast.coId;
                    Home.RefreshFastBuy(fast);
                }
            });

            //懒加载测试
            // lazyload_allimg("index_foot_div", 100);//id=“index_foot_div”中的img在距离距离显示在页面中100px前加载实际内容
            //  lazyload_allimg("", 100);//全部img元素在距离距离显示在页面中100px前加载实际内容

        }
        else {
            ShowMesaage(msg.resultMessage);
        }
    },
    //数据解析方法组
    LoadTopThreeResult: function (result) {
        var l = result.length;
        for (var i = 0; i < l; i++) {
            switch (result[i].columnType) {
                //轮播广告
                case g_const_columnType.SwipeSlide:
                    Home.LoadSlider(result[i]);
                    break;
                    //TwoADs
                case g_const_columnType.TwoADs:
                    Home.LoadSliderUnder(result[i]);
                    break;
                    //导航栏
                case g_const_columnType.Navigation:
                    Home.LoadRightAd(result[i]);
                    break;
            }
        }
        //
    },
    //轮播图数据解析方法
    LoadSlider: function (result) {
        $("#cont1").empty();
        var temp = "";
        var contentList = result.contentList;
        var l = contentList.length;
        if (l > 0) {
            for (var i = 0; i < l; i++) {
                var content = contentList[i];
                temp += '<li><a  onclick="Home.GetLocationByShowmoreLinktype(\'' + content.showmoreLinktype + '\', \'' + content.showmoreLinkvalue + '\')"><img src="' + content.picture + '" alt=""></a></li>';
            }
        }
        $("#cont1").html(temp);
    },
    //轮播图下面广告数据解析方法
    LoadSliderUnder: function (result) {
        var adList = result.contentList;
        var l = adList.length;
        var temp = "";
        if (l > 0) {
            for (var i = 0; i < l; i++) {
                var content = adList[i];
                temp += '<div class="ad1"><a  onclick="Home.GetLocationByShowmoreLinktype(\'' + content.showmoreLinktype + '\', \'' + content.showmoreLinkvalue + '\')"><img src="' + content.picture + '" alt=""></a></div>';
            }
            $("#topThree").append(temp);
        }
    },
    //用户信息下面广告数据解析方法
    LoadRightAd: function (result) {
        $("#rightAd").empty();
        var adList = result.contentList;
        var l = adList.length;
        var temp = "";
        if (l > 0) {
            temp += '<h2><span></span>' + result.columnName + '</h2><ul>';
            for (var i = 0; i < 2; i++) {
                var content = adList[i];
                if (content) {
                    temp += '<li><a onclick="Home.GetLocationByShowmoreLinktype(\'' + content.showmoreLinktype + '\', \'' + content.showmoreLinkvalue + '\') "><img src="' + content.picture + '" alt=""><i>立即抢购</i></a></li>';
                }
            }
            temp += "</ul>";
        }
        $("#rightAd").html(temp);
    },
    /*首页TopThree end*/

    //获取海外购标签，生鲜等
    GetMarkHtml: function (labelsList, flagTheSea) {
        return g_const_ProductLabel.GetLabelHtml(labelsList, flagTheSea);
    },
    InnerPriceData: "",
    /*加载其余的Column*/
    LoadOtherColumn: function (priceList) {
        Home.InnerPriceData = priceList;

        var otherlist = Home.OtherColumnData;
        for (var i = 0; i < otherlist.length; i++) {
            var other = otherlist[i];
            $(other.ad1List).each(function () {
                if (this.productInfo.productCode) {
                    this.productInfo.sellPrice = Home.GetInnerPrice(this.productInfo.productCode, this.productInfo.sellPrice);
                }
            });
            $(other.ad3List).each(function () {
                if (this.productInfo.productCode) {
                    this.productInfo.sellPrice = Home.GetInnerPrice(this.productInfo.productCode, this.productInfo.sellPrice);
                }
            });
            $(other.contentList).each(function () {
                if (this.productInfo.productCode) {
                    this.productInfo.sellPrice = Home.GetInnerPrice(this.productInfo.productCode, this.productInfo.sellPrice);
                }
            });
            $(other.hotPointList).each(function () {
                if (this.productInfo.productCode) {
                    this.productInfo.sellPrice = Home.GetInnerPrice(this.productInfo.productCode, this.productInfo.sellPrice);
                }
            });
            $(other.logoList).each(function () {
                if (this.productInfo.productCode) {
                    this.productInfo.sellPrice = Home.GetInnerPrice(this.productInfo.productCode, this.productInfo.sellPrice);
                }
            });

            switch (other.columnType) {
                //限时抢购
                case g_const_columnType.FastBuy:
                    Home.LoadFastBuy(other, i);
                    break;
                case g_const_columnType.CommonAD:
                    Home.LoadCommonAD(other, i);
                    break;
                case g_const_columnType.RecommendONE:
                    break;
                case g_const_columnType.RecommendRightTwo:
                    break;
                case g_const_columnType.RecommendLeftTwo:
                    break;
                case g_const_columnType.RecommendProduct:
                    Home.LoadRecommendProduct(other, Home.PageIndex, i);
                    break;
                case g_const_columnType.RecommendHot:
                    break;
                case g_const_columnType.TVLive:
                    Home.LoadTVLive(other, i);
                    break;
                case g_const_columnType.Floor:
                    Home.LoadFloor(other, i);
                    break;
            }
        }
        Home.LoadMaybeLove();
    },
    GetInnerPrice: function (productCode, sellIngPrice) {
        var innerPrice = sellIngPrice;
        if (Home.InnerPriceData && productCode) {
            if (Home.InnerPriceData.resultCode == g_const_Success_Code) {
                for (var key in Home.InnerPriceData.map)
                    if (key == productCode) {
                        innerPrice = Home.InnerPriceData.map[key];
                        break;
                    }
            }
        }
        return innerPrice;
    },
    //解析TVSHOW数据包
    LoadTVLive: function (other, i) {
        var html = '<div class="live-list"><div class="hd" module="' + other.columnType + '">';
        if (other.isShowmore == g_const_isShowmore.YES) {
            html += '<span><a onclick="Home.GetLocationByShowmoreLinktype(\'' + other.showmoreLinktype + '\',\'' + other.showmoreLinkvalue + '\')">' + other.showmoreTitle + '&gt;&gt;</a></span>';
        }
        html += '<h2>' + other.columnName + '</h2>';
        html += '</div> <div class="bd"><ul id="list' + i + '">';

        var tag = "list" + i;
        var stpl = $("#tmpTVShow").html();;
        Home.TempDataInit(tag);

        for (var j = 0; j < other.contentList.length; j++) {
            var other_content = other.contentList[j];
            var date_last = Date.Parse(other_content.endTime);
            var date_start = Date.Parse(other_content.startTime);
            var data_now = Date.Parse(Home.ServerDate);

            var state = '<span>' + date_start.Format("hh:mm") + " - " + date_last.Format("hh:mm") + '</span>';
            if (data_now >= date_start && data_now <= date_last) {
                state = '<span class="s1">正在直播...</span>';
            }
            var data = {
                "Link": "Home.GetLocationByShowmoreLinktype('" + other_content.showmoreLinktype + "','" + other_content.showmoreLinkvalue + "');",
                "ImgUrl": g_GetPictrue(other_content.picture) || g_goods_Pic,
                "State": state,
                "ProductName": Home.SubName(other_content.productInfo.productName),
                "SalePrice": other_content.productInfo.sellPrice,
                "OriginalPrice": other_content.productInfo.markPrice
            };
            Home.TempDataInsert(tag, data);
        }
        html += ' </ul><!--==禁止加class="static"==--><a class="prev static" onclick="Home.Previous(this);"></a><a class="next" onclick="Home.Next(this);"></a></div></div>';
        $("#mainContent").append(html);
        Home.PageInit(tag, stpl);
    },
    //解析通屏广告(一栏广告)数据包
    LoadCommonAD: function (other) {
        var html = "";
        var stpl = $("#tmpCommonAd").html();
        for (var j = 0; j < other.contentList.length; j++) {
            var other_content = other.contentList[j];
            var data = {
                "Module": other.columnType,
                "Link": "Home.GetLocationByShowmoreLinktype('" + other_content.showmoreLinktype + "','" + other_content.showmoreLinkvalue + "');",
                "ImgUrl": g_GetPictrue(other_content.picture) || g_goods_Pic,
            };
            html += renderTemplate(stpl, data);
        }
        $("#mainContent").append(html);
    },
    //解析楼层模板数据包
    LoadFloor: function (other) {
        var stmp = "";
        var data = {};
        var dataList = [];
        var l = 0;
        var html = "";

        var mainFloor = $("#tmpFloor").html();
        var mainData = {
            "Module": other.columnType,
            "FloorTitle": other.columnName,
            "BigImg": "",
            "BrandList": "",
            "SliderList": "",
            "AdUnderList": "",
            "AdRightListTitle": "本月热销榜",
            "AdRightList": ""
        };
        //AD2
        stmp = $("#tmpFloorBigImg").html();
        data = {
            "Link": "Home.GetLocationByShowmoreLinktype('" + other.ad2linktype + "','" + other.ad2linkvalue + "');",
            "ImgUrl": g_GetPictrue(other.ad2picture)
        };
        mainData.BigImg = renderTemplate(stmp, data);

        //LogoList
        mainData.BrandList = Home.DealCommonResult("tmpFloorBrandList", other.logoList);
        //AD1
        mainData.SliderList = Home.DealCommonResult("tmpFloorSliderList", other.ad1List);
        //AD3
        mainData.AdUnderList = Home.DealCommonResult("tmpFloorAdUnderList", other.ad3List);

        //右侧热销
        stmp = $("#tmpFloorAdRightList").html();
        dataList = other.hotPointList;
        l = dataList.length;
        html = "";
        for (var i = 0; i < l; i++) {
            var right = dataList[i];
            var num = "";
            if (i == 0 || i == 1 || i == 2) {
                num = '<i class="i' + (i + 1) + '">' + (i + 1) + '</i>';
            }
            data = {
                "Link": "Home.GetLocationByShowmoreLinktype('" + right.showmoreLinktype + "','" + right.showmoreLinkvalue + "');",
                "ImgUrl": g_GetPictrue(right.picture) || g_goods_Pic,
                "Number": num,
                "ProductName": Home.SubName(right.productInfo.productName),
                "SalePrice": right.productInfo.sellPrice,
            };
            html += renderTemplate(stmp, data);
        }
        mainData.AdRightList = html;

        html = renderTemplate(mainFloor, mainData);
        $("#mainContent").append(html);
    },
    //闪购（限时抢购）
    LoadFastBuy: function (other, i) {
        if (other.contentList) {
            var tag = "list" + i;
            var isRefresh = false;
            if ($("#" + tag).length > 0) {
                isRefresh = true;
            }

            Home.FastBuy.push({ id: tag, coId: other.columnID, end: other.endTime });
            var length = other.contentList.length;

            var html = '';
            if (!isRefresh) {
                html += '<div class="live-list panic-list" module="' + other.columnType + '">';
            }
            html += '<div class="hd">';
            if (other.isShowmore == g_const_isShowmore.YES) {
                html += '<span><a onclick="Home.GetLocationByShowmoreLinktype(\'' + other.showmoreLinktype + '\',\'' + other.showmoreLinkvalue + '\')">' + other.showmoreTitle + '&gt;&gt;</a></span>';
            }
            html += '<h2>' + other.columnName + '<font name="countDown">距离本次结束还有：<i>--</i>时<i>--</i>分<i>--</i>秒</font></h2>';
            html += '</div><div class="bd"><!--==结束的时候clas="end"做显示===--><div class="end" name="fastButEnd" style="display:none;">本场抢购<br>已结束</div><ul id="list' + i + '">';
            var stpl = $("#tmpFastBuy").html();
            Home.TempDataInit(tag);
            for (var j = 0; j < length; j++) {
                var other_content = other.contentList[j];
                var data = {
                    "Link": "Home.GetLocationByShowmoreLinktype('" + other_content.showmoreLinktype + "','" + other_content.showmoreLinkvalue + "');",
                    "Mark": Home.GetMarkHtml(other_content.productInfo.labelsList, other_content.productInfo.flagTheSea),
                    "ImgUrl": g_GetPictrue(other_content.picture) || g_goods_Pic,
                    "ProductName": Home.SubName(other_content.productInfo.productName),
                    "SalePrice": other_content.productInfo.sellPrice,
                    "OriginalPrice": other_content.productInfo.markPrice,
                    "Discount": other_content.productInfo.discount.length > 0 ? "<span>" + other_content.productInfo.discount + "折</span>" : "",
                    "BtnName": "立即抢购"
                };
                Home.TempDataInsert(tag, data);
            }
            html += '</ul><!--==禁止加class="static"==--><a class="prev static" onclick="Home.Previous(this);"></a><a class="next" onclick="Home.Next(this);"></a></div>';
            if (!isRefresh) {
                html += '</div>';
            }
            if (!isRefresh) {
                $("#mainContent").append(html);
            } else {
                $("#" + tag).parent().parent().html(html);
            }
            Home.PageInit(tag, stpl);
            Home.timeTag = tag;
            var timmer = self.setInterval(Home.ShowLeftTime, g_const_seconds);
            Home.flagCheapInterval.push({ k: tag, v: timmer });
        }
    },
    //解析推荐商品数据包
    LoadRecommendProduct: function (other, index, i) {
        var html = '<div class="live-list mg-bg" module="' + other.columnType + '"><div class="hd">';
        if (other.isShowmore == g_const_isShowmore.YES) {
            html += '<span><a onclick="Home.GetLocationByShowmoreLinktype(\'' + other.showmoreLinktype + '\',\'' + other.showmoreLinkvalue + '\')">' + other.showmoreTitle + '&gt;&gt;</a></span>';
        }
        html += '<h2>' + other.columnName + '</h2></div>';

        html += '<div class="bd"><!--==结束的时候clas="end"做显示===--><div class="end" style="display:none;">本场抢购<br>已结束</div><ul id="list' + i + '">';
        var tag = "list" + i;
        var stpl = $("#tmpRecommendProduct").html();
        Home.TempDataInit(tag);
        for (var j = 0; j < other.contentList.length; j++) {
            var other_content = other.contentList[j];
            var data = {
                "Mark": Home.GetMarkHtml(other_content.productInfo.labelsList, other_content.productInfo.flagTheSea),
                "Link": "Home.GetLocationByShowmoreLinktype('" + other_content.showmoreLinktype + "','" + other_content.showmoreLinkvalue + "');",
                "ImgUrl": g_GetPictrue(other_content.productInfo.mainpicUrl) || g_goods_Pic,
                "ProductName": Home.SubName(other_content.productInfo.productName),
                "SalePrice": other_content.productInfo.sellPrice
            };
            Home.TempDataInsert(tag, data);
        }
        html += '</ul><!--==禁止加class="static"==--><a class="prev static" onclick="Home.Previous(this);"></a><a class="next" onclick="Home.Next(this);"></a></div></div>'
        $("#mainContent").append(html);
        Home.PageInit(tag, stpl);
    },
    DealCommonResult: function (stmpTag, dataList) {
        var stmp = $("#" + stmpTag).html();
        var data = {};
        var l = dataList.length;
        var html = "";
        for (var i = 0; i < l; i++) {
            var item = dataList[i];
            data = {
                "Num": i < 2 ? "3" : "4",
                "Link": "Home.GetLocationByShowmoreLinktype('" + item.showmoreLinktype + "','" + item.showmoreLinkvalue + "');",
                "ImgUrl": g_GetPictrue(item.picture)
            };
            html += renderTemplate(stmp, data);
        }
        return html;
    },
    SubName: function (name) {
        return name.length > 25 ? (name.substring(0, 25) + "...") : name;
    },
    RefreshFastBuy: function (fast) {
        var s_api_input = JSON.stringify(Home.refreshFastBuyInput);
        var obj_data = { "api_input": s_api_input, "api_target": Home.refreshFastBuyTag };
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
                var tag = fast.id;
                var i = fast.id.replace("list", "");

                if (msg.columnList && msg.columnList.length > 0) {
                    Home.LoadFastBuy(msg.columnList[0], parseInt(i));
                    $("#" + tag).parent().find("div[name=fastButEnd]").hide();
                }
                else {
                    $("#" + tag).parent().find("div[name=fastButEnd]").html("暂无更多场次的闪购");
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
    FastBuy: [],
    timeTag: "",
    /*倒计时*/
    ShowLeftTime: function () {
        var tag = Home.timeTag;
        var fast = "";
        for (var i in Home.FastBuy) {
            var f = Home.FastBuy[i];
            if (f.id == tag) {
                fast = f;
            }
        }
        if (fast != "") {
            var date_last = Date.Parse(fast.end);
            var date_now = new Date();
            var ts = date_last.getTime() - date_now.getTime();  //时间差的毫秒数              
            if (ts > 0) {
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
                $("#" + tag).parent().parent().find("font[name=countDown]").html('距离本次结束还有：<i>' + hourstring + '</i>时<i>' + minutestring + '</i>分<i>' + secondstring + '</i>秒');;
                if (hours == 0 && minutes == 0 && seconds == 0) {

                    for (var i in Home.flagCheapInterval) {
                        var timer = Home.flagCheapInterval[i];
                        if (timer.k == tag) {
                            self.clearInterval(timer.v);
                        }
                    }
                    $("#" + tag).parent().parent().find("div[name=fastButEnd]").show();
                }
            }
            else {
                for (var i in Home.flagCheapInterval) {
                    var timer = Home.flagCheapInterval[i];
                    if (timer.k == tag) {
                        self.clearInterval(timer.v);
                    }
                }
                $("#" + tag).parent().parent().find("div[name=fastButEnd]").show();
            }
        } else {
            for (var i in Home.flagCheapInterval) {
                var timer = Home.flagCheapInterval[i];
                if (timer.k == tag) {
                    self.clearInterval(timer.v);
                }
            }
            $("#" + tag).parent().parent().find("div[name=fastButEnd]").show();
        }
    },
    flagCheapInterval: [],
    GetLocationByShowmoreLinktype: function (t, u) {
        //PageUrlConfig.SetUrl();
        window.open(g_GetLocationByShowmoreLinktype(t, u));
        return false;
    },
    LoadMaybeLove: function () {
        var html = '<div class="live-list" module="202006"> <div class="hd"> <h2>猜你喜欢</h2></div><div class="bd"><!--==结束的时候clas="end"做显示===--><div class="end" style="display:none;">本场抢购<br>已结束</div><ul id="maybeLove"> </ul><!--==禁止加class="static"==--><a class="prev static"  onclick="ForMaybeLove.Previous(this);"></a><a class="next"  onclick="ForMaybeLove.Next(this);"></a></div></div>';
        $("#mainContent").append(html);
        ForMaybeLove.LoadData($("#tempMaybeLove"), $("#maybeLove"));
    },
    //分页
    PageInit: function (main, temp) {
        Home.PageTemplate[main] = temp;
        Home.RecordCount[main] = Home.PageTemplateData[main].length;
        Home.PageCount[main] = 0;
        Home.PageMain[main] = main;
        Home.PageIndex[main] = 0;
        Home.RefreshPart(main);

        if (Home.PageTemplateData[main].length <= 5) {
            $("#" + main).parent().find("a[class='next']").addClass("static");
        }
        else {
            $("#" + main).parent().find("a").removeClass("static");
        }
    },
    TempDataInit: function (tag) {
        var arr = Home.PageTemplateData[tag] = [];
    },
    TempDataInsert: function (tag, tempdata) {
        Home.PageTemplateData[tag].push(tempdata);
    },
    PageIndex: {},
    PageMain: {},
    Count: 5,
    RecordCount: {},
    PageCount: {},
    PageTemplate: {},
    PageTemplateData: {},
    Next: function (obj) {
        var tag = $(obj).parent().find("ul").attr("id");
        var count = Home.PageTemplateData[tag].length;
        var timer = count - 5;
        if (count > 5) {
            //if (Home.PageIndex[tag] < timer) {
            ++Home.PageIndex[tag];
            var abs = Math.abs(233 * 5 * Home.PageIndex[tag]);
            var cheap = "-" + abs + "px";
            var marg = "+" + abs + "px";
            if (Home.PageIndex[tag] < 0) {
                cheap = "+" + abs + "px";
                marg = "-" + abs + "px";
            }
            $("#" + tag).animate({ left: cheap }, 300, function () {
                for (var i = 0; i < 5; i++) {
                    var first = $("#" + tag + " li:first");
                    $("#" + tag).append("<li>" + $(first).html() + "</li>");
                    $(first).remove();
                }
                $("#" + tag).css({ "margin-left": marg });
            });
            $("#" + tag).parent().find("a[class='prev static']").removeClass("static");
            //}
        }
    },
    Previous: function (obj) {
        var tag = $(obj).parent().find("ul").attr("id");
        var count = Home.PageTemplateData[tag].length;
        var timer = count - 5;
        if (count > 5) {
            //if (Home.PageIndex[tag] <= timer && Home.PageIndex[tag] >= 1) {
            --Home.PageIndex[tag];
            var abs = Math.abs(233 * 5 * Home.PageIndex[tag]);
            var cheap = "-" + abs + "px";
            var marg = "+" + abs + "px";
            if (Home.PageIndex[tag] < 0) {
                cheap = "+" + abs + "px";
                marg = "-" + abs + "px";
            }
            for (var i = 0; i < 5; i++) {
                var last = $("#" + tag + " li:last");
                $("#" + tag).prepend("<li>" + $(last).html() + "</li>");
                $(last).remove();
            }
            $("#" + tag).css({ "margin-left": marg });
            $("#" + tag).animate({ left: cheap }, 300);
            $("#" + tag).parent().parent().find("a[class='next static']").removeClass("static");

            //if (Home.PageIndex[tag] == 0) {
            //    $(obj).addClass("static");
            //}
            //}
        }
    },
    RefreshPart: function (tag) {
        //$("#" + tag).hide();
        var strhtml = "";
        $("#" + tag).empty();
        for (var j = 0; j < Home.PageTemplateData[tag].length; j++) {
            var other_content = Home.PageTemplateData[tag][j];
            if (other_content) {
                strhtml += renderTemplate(Home.PageTemplate[tag], Home.PageTemplateData[tag][j]);
            }
        }
        $("#" + tag).append(strhtml).show();//.fadeIn("slow");
        $("a").on("dblclick", function () {
            return false;
        });
    },

    //改变上一页，下一页的样式
    ChangeStyle: function (tag) {
        var $obj = $("#" + tag);
        if (Home.PageCount[tag] <= 1) {
            $obj.parent().find("a[class='next']").addClass("static");
        }
        if ((Home.PageIndex[tag] + 1) == Home.PageCount[tag]) {
            $obj.parent().find("a[class='next']").addClass("static");
        }
        if (Home.PageIndex[tag] <= 0) {
            $obj.parent().find("a[class='prev']").addClass("static");
        }
    }
};