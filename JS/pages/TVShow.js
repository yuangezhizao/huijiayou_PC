
//直播信息
var TvLive = {
    //页码
    PageNo: 0,
    //每页条数
    PageCount: 5,
    //总共页数
    PageTotal: 0,
    //总共记录数
    RecordCount: 0,
    //当前日期 yyyy-MM-dd 格式
    CurrentDate: "",
    //当前日期直播数据集合
    CurrentTvLiveList: [],
    //系统日期
    SysDate: "",
    //获取数据
    GetTvLive: function () {
        if (TvLive.CurrentDate == "" && typeof (web_tvdata) != 'undefined') {
            var msg = web_tvdata;
            if (msg.resultCode == g_const_Success_Code) {
                TvLive.SysDate = msg.systemDate;
                TvLive.PageTotal = parseInt((msg.products.length + TvLive.PageCount - 1) / TvLive.PageCount);
                TvLive.RecordCount = msg.products.length;
                TvLive.PageNo = 0;
                TvLive.CurrentTvLiveList = msg.products;
                TvLive.Sort();
                TvLive.ChangePlayingPosition();
                //加载方法
                TvLive.LoadSlider();
                TvLive.LoadTime();
                TvLive.LoadList();
                if (TvLive.RecordCount <= 5) {
                    $("#tvLiveList").parent().find("a[class='next']").addClass("static");
                }
                else {
                    $("#tvLiveList").parent().find("a").removeClass("static");
                }

            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        }
        else {
            var api_target = "com_cmall_familyhas_api_ApiForGetTVData";
            var api_input = { "date": TvLive.CurrentDate, "paging": { "limit": 0, "offset": 0 }, "activity": "467703130008000100070001" };
            var s_api_input = JSON.stringify(api_input);
            var obj_data = { "api_input": s_api_input, "api_target": api_target };
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
                    TvLive.SysDate = msg.systemDate;
                    TvLive.PageTotal = parseInt((msg.products.length + TvLive.PageCount - 1) / TvLive.PageCount);
                    TvLive.RecordCount = msg.products.length;
                    TvLive.PageNo = 0;
                    TvLive.CurrentTvLiveList = msg.products;
                    TvLive.Sort();
                    TvLive.ChangePlayingPosition();
                    //加载方法
                    TvLive.LoadSlider();
                    TvLive.LoadTime();
                    TvLive.LoadList();
                    if (TvLive.RecordCount <= 5) {
                        $("#tvLiveList").parent().find("a[class='next']").addClass("static");
                    }
                    else {
                        $("#tvLiveList").parent().find("a").removeClass("static");
                    }

                }
                else {
                    ShowMesaage(msg.resultMessage);
                }
            });

            request.fail(function (jqXHR, textStatus) {
                ShowMesaage(g_const_API_Message["7001"]);
            });
        }
    },
    Sort: function () {
        //对结果集进行排序（按照时间）
        TvLive.CurrentTvLiveList = TvLive.CurrentTvLiveList.sort(function (a, b) {
            return Date.Parse(a.playTime) > Date.Parse(b.playTime) ? 1 : -1;
        });
    },
    ChangePlayingPosition: function () {
        for (var i = 0; i < TvLive.RecordCount; i++) {
            var t = TvLive.CurrentTvLiveList[i];
            if (t && t.playStatus == "1") {
                TvLive.CurrentTvLiveList.splice(i, 1);
                //TvLive.Sort();
                TvLive.CurrentTvLiveList.unshift(t);
            }
        }
    },
    //加载正在直播的产品信息
    LoadSlider: function () {
        $("#cont3").empty();
        var html = "";

        var stmp = $("#tempTopSlider").html();
        var tvPlay = 0;
        for (var i = 0; i < TvLive.CurrentTvLiveList.length; i++) {
            var product = TvLive.CurrentTvLiveList[i];
            if (product && product.playStatus == "1") {
                tvPlay++;
                var imgs = '';
                if (product.pcPicList.length==0) {
                    imgs = "<a onclick=\"TvLive.LoadProductDetail('" + product.id + "')\"><img src=\"" + (product.productPic || g_goods_Pic) + "\"></a>";
                }
                else {
                    imgs = product.pcPicList[0] ? "<a onclick=\"TvLive.LoadProductDetail('" + product.id + "')\"><img src=\"" + (product.pcPicList[0].picNewUrl || g_goods_Pic) + "\"></a>" : "";
                }
                var imgs1 = product.pcPicList[1] ? "<a onclick=\"TvLive.LoadProductDetail('" + product.id + "')\"><img src=\"" + (product.pcPicList[1].picNewUrl || g_goods_Pic) + "\"></a>" : "";
                var imgs2 = product.pcPicList[2] ? "<a onclick=\"TvLive.LoadProductDetail('" + product.id + "')\"><img src=\"" + (product.pcPicList[2].picNewUrl || g_goods_Pic) + "\"></a>" : "";
                var stockState = product.stock
                var data = {
                    ProductName: product.name,
                    Img: imgs,
                    Img1: imgs1,
                    Img2: imgs2,
                    Link: "TvLive.LoadProductDetail('" + product.id + "')",
                    SalePrice: product.salePrice
                };
                html += renderTemplate(stmp, data);
            }
        }
        $("#cont3").html(html);
        /*鼠标移过某个按钮 高亮显示*/
        $("#focus3").slide({ titCell: "#num3 ul", mainCell: "#cont3", effect: "fold", autoPlay: true, delayTime: 700, autoPage: true });
        if (tvPlay<2) {
            $("#num3").hide();
        }
    },
    //加载tvShow的分页数据
    LoadList: function () {
        //$("#tvLiveList").empty().hide();
        var stpl = $("#tmpTVShow").html();
        var html = "";
        for (var j = 0; j < TvLive.RecordCount; j++) {
            var product = TvLive.CurrentTvLiveList[j];
            if (product) {
                var date_last = Date.Parse(product.endTime);
                var date_start = Date.Parse(product.playTime);
                var data_now = Date.Parse(TvLive.SysDate);

                var state = '<span>' + date_start.Format("hh:mm") + " - " + date_last.Format("hh:mm") + '</span>';
                if (data_now >= date_start && data_now <= date_last) {
                    state = '<span class="s1">正在直播...</span>';
                }
                var data = {
                    "StockClass": product.stock == 0 ? "sold" : "",
                    "StockName": product.stock == 0 ? "售罄" : "有货",
                    "Link": "TvLive.LoadProductDetail('" + product.id + "')",
                    "ImgUrl": product.productPic || g_goods_Pic,
                    "State": state,
                    "ProductName": product.name,
                    "SalePrice": product.salePrice,
                    "OriginalPrice": product.markPrice
                };
                html += renderTemplate(stpl, data);
            }
        }
        $("#tvLiveList").html(html);

        // TvLive.ChangeStyle();
    },
    //星期
    Week: {
        "0": "星期日",
        "1": "星期一",
        "2": "星期二",
        "3": "星期三",
        "4": "星期四",
        "5": "星期五",
        "6": "星期六",
    },
    //加载时间轴
    LoadTime: function () {
        //判断是否已经初始化时间抽
        if ($("#tvShowTime").data("iss") != "1") {
            var html = "";
            var dtNow = new Date();
            var week = dtNow.getDay();
            for (var i = 6; i >= 0; i--) {
                var dtDiff = dtNow.AddDays(-i);
                var date = dtDiff.Format("yyyy-MM-dd");
                var weekName = TvLive.Week[dtDiff.getDay()];

                html += '<li data-date="' + date + '" onclick="TvLive.RefreshTvLive(this);" class="' + (i == 0 ? "curr" : "") + '">' + (dtDiff.getMonth() + 1) + '月' + dtDiff.getDate() + '日<i>' + weekName + '</i></li>';
            }
            $("#tvShowTime").html(html).data("iss", "1");
        }
    },
    Index: 0,
    //下一页
    Next: function (obj) {
        //if ((TvLive.PageNo + 1) == TvLive.PageTotal) {
        //    return false;
        //}
        //else {
        //    if (TvLive.PageTotal > 1) {
        //        $(obj).parent().find("a[class='prev static']").removeClass("static");
        //    }
        //    ++TvLive.PageNo;
        //    TvLive.LoadList();
        //}

        var $tag = $("#tvLiveList");
        var count = TvLive.RecordCount;
        var timer = count - 5;
        if (count > 5) {
            ++TvLive.Index;
            var abs = Math.abs(233 * 5 * TvLive.Index);
            var cheap = "-" + abs + "px";
            var marg = "+" + abs + "px";
            if (TvLive.Index < 0) {
                cheap = "+" + abs + "px";
                marg = "-" + abs + "px";
            }
            $tag.animate({ "left": cheap }, 300, function () {
                for (var i = 0; i < 5; i++) {
                    var first = $("#" + $tag.attr("id") + " li:first");
                    $tag.append("<li>" + $(first).html() + "</li>");
                    $(first).remove();
                }
                $tag.css({ "margin-left": marg });
            });

            $tag.parent().find("a[class='prev static']").removeClass("static");
        }
    },
    //上一页
    Previous: function (obj) {
        //if (TvLive.PageNo <= 0) {
        //    return false;
        //}
        //else {
        //    if (TvLive.PageTotal > 1) {
        //        $(obj).parent().find("a[class='next static']").removeClass("static");
        //    }
        //    --TvLive.PageNo;
        //    TvLive.LoadList();
        //}
        var $tag = $("#tvLiveList");
        var count = TvLive.RecordCount;
        var timer = count - 5;
        if (count > 5) {
            //if (Home.PageIndex[tag] <= timer && Home.PageIndex[tag] >= 1) {
            --TvLive.Index;
            var abs = Math.abs(233 * 5 * TvLive.Index);
            var cheap = "-" + abs + "px";
            var marg = "+" + abs + "px";
            if (TvLive.Index < 0) {
                cheap = "+" + abs + "px";
                marg = "-" + abs + "px";
            }
            for (var i = 0; i < 5; i++) {
                var last = $("#" + $tag.attr("id") + " li:last");
                $tag.prepend("<li>" + $(last).html() + "</li>");
                $(last).remove();
            }
            $tag.css({ "margin-left": marg });
            $tag.animate({ left: cheap }, 300);
            $tag.parent().parent().find("a[class='next static']").removeClass("static");
        }

    },
    //刷新list
    RefreshTvLive: function (obj) {
        if (obj) {
            $(obj).addClass("curr").siblings().removeClass("curr");
            TvLive.CurrentDate = $(obj).data("date");
        }
        TvLive.GetTvLive();
    },
    //跳转产品详情
    LoadProductDetail: function (pid) {
        var p = "&pid=" + pid + "&t=" + Math.random();
        g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.ProductDetail), p);
        return false;
    },
    //改变上一页，下一页的样式
    ChangeStyle: function () {
        if (TvLive.PageTotal <= 1) {
            $("#tvLiveList").parent().find("a[class='next']").addClass("static");
        }
        if ((TvLive.PageNo + 1) == TvLive.PageTotal) {
            $("#tvLiveList").parent().find("a[class='next']").addClass("static");
        }
        if (TvLive.PageNo <= 0) {
            $("#tvLiveList").parent().find("a[class='prev']").addClass("static");
        }
    }
};

