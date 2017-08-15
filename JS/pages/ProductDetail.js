$(document).ready(function () {
    $("#btnAllProduct").on("click", function () {
        var p = "&showtype=&keyword=&t=" + Math.random();
        g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.SearchList), p);
    });
});
var Product_Detail = {
    /*秒杀更新sku价格和限购信息*/
    UpdateSkuListBySecKill: function (msg) {
        if (Product_Detail.SkuSecKillLoaded) {

            var skulist = Product_Detail.api_response.skuList;
            var seckillskulist = msg.skus;
            for (var k = 0; k < skulist.length; k++) {
                var sku = skulist[k];
                var bfind = false;
                for (var kk = 0; kk < seckillskulist.length; kk++) {
                    var seckillsku = seckillskulist[kk];
                    if (sku.skuCode.Trim() == seckillsku.skuCode.Trim()) {

                        Product_Detail.api_response.skuList[k].sellPrice = seckillsku.sellPrice;
                        Product_Detail.api_response.skuList[k].skuMaxBuy = seckillsku.maxBuy;

                        Product_Detail.api_response.skuList[k].stockNumSum = seckillsku.limitStock;
                        Product_Detail.api_response.skuList[k].itemCode = seckillsku.itemCode;
                        Product_Detail.api_response.skuList[k].limitBuyTip = "已达购买限制数" + seckillsku.limitBuy + "件";
                        bfind = true;
                        break;
                    }
                }
                if (!bfind) {

                    Product_Detail.api_response.skuList[k].stockNumSum = 0;
                    Product_Detail.api_response.skuList[k].itemCode = "";
                }
            }
            //if (Product_Detail.api_response.skuList.length == 1) {
            //    //只有1种样式
            //    Product_Detail.SelectSku = Product_Detail.api_response.skuList[0];
            //    Product_Detail.RefershPrice(Product_Detail.SelectSku.keyValue);
            //    $(".nprice").empty();
            //    $(".nprice").append("<em>￥" + Product_Detail.api_response.skuList[0].sellPrice + "</em>");
            //    $(".pprice").empty();
            //    $(".pprice").append("<b>￥</b>" + Product_Detail.api_response.skuList[0].sellPrice);
            //}
            Product_Detail.AfterLoadDetail(Product_Detail.api_response);
        }
    },
    /*读取秒杀信息*/
    LoadSecKillInfo: function (msg) {

        Product_Detail.SkuSecKillLoaded = false;

        if (UserLogin.LoginStatus == g_const_YesOrNo.YES)
            g_type_api.api_token = g_const_api_token.Wanted;
        else
            g_type_api.api_token = g_const_api_token.Unwanted;



        g_type_api.api_input = {
            version: 1.0,
            /*用逗号分隔,传入活动明细编号IC开头的编号*/
            code: Product_Detail.api_input.productCode,
            /*用户编号，除非特别要求下默认情况下请传空*/
            memberCode: Product_Detail.MemberCode,
            /*地址区域编号，用于分仓分库存使用，默认情况下传空*/
            areaCode: "",
            /*来源编号,用于分来源显示不同价格，默认情况下传空*/
            sourceCode: "",
            /*是否显示内购	默认值为0，显示内购活动传递1*/
            isPurchase: Product_Detail.isPurchase,
        };
        g_type_api.api_target = "com_srnpr_xmasproduct_api_ApiSkuInfo";
        g_type_api.api_url = g_APIUTL;
        g_type_api.LoadData(Product_Detail.LoadSecKill, "");
    },
    /*秒杀价格和库存接口响应对象*/
    SkuKillResponse: null,
    /*解析秒杀商品SKU的价格和库存*/
    LoadSecKill: function (msg) {
        Product_Detail.SkuKillResponse = msg;

        Product_Detail.SkuSecKillLoaded = true;

        Product_Detail.UpdateSkuListBySecKill(msg);

        Product_Detail.LoadBtnInfo(msg);

        Product_Detail.LoadProductProperty();

        Product_Detail.LoadAddress(Product_Detail.api_response);
    },
    /*是否读取完毕秒杀价*/
    SkuSecKillLoaded: false,
    /*刷新秒杀库存信息*/
    RefreshSecKill: function () {

        if (Product_Detail.GetShowType() == Product_Detail.ShowType.SecKill) {
            var objInterval = window.setInterval(function () { Product_Detail.LoadSecKillInfo() }, 5 * g_const_minutes);
            Product_Detail.IntervalArr.push(objInterval);
        }
    },
    /*会员编号*/
    MemberCode: "",
    /*是否显示内购*/
    isPurchase: "",
    /*Interval*/
    IntervalArr: [],
    /*初始化*/
    Init: function () {
        //   Product_Detail.FromShare();
        $("#div_productinfo").on("click", function () {
            $("#div_productinfo").attr("class", "dui");
        });

        switch (Product_Detail.GetShowType()) {
            case Product_Detail.ShowType.SecKill:
                $("#mainbuy").css("display", "none");
                $("#mainaddtocart").css("display", "none");
                $("#maintelbuy").css("display", "none");
                $("#mainseckillbuy").css("display", "");
                $(".ch-icon .ch01").css("display", "none");
                break;
            case Product_Detail.ShowType.Normal:
                $("#mainbuy").css("display", "");
                $("#mainaddtocart").css("display", "");
                $("#maintelbuy").css("display", "");
                $("#mainseckillbuy").css("display", "none");
                $(".ch-icon .ch01").css("display", "");
                break;
            case Product_Detail.ShowType.Qrcode:
                $("#mainbuy").css("display", "");
                $("#mainbuy").attr("class", "star");
                $("#sku_buy").attr("class", "star");
                $("#maintelbuy").css("display", "none");
                $("#mainaddtocart").css("display", "none");
                $("#mainseckillbuy").css("display", "none");
                $(".ch-icon .ch01").css("display", "");
                break;
        }
        Product_Detail.isPurchase = "0";
        if (UserLogin.LoginStatus == g_const_YesOrNo.YES) {
            if (localStorage[g_const_localStorage.Member]) {
                Product_Detail.MemberCode = JSON.parse(localStorage[g_const_localStorage.Member]).Member.membercode;
                Product_Detail.isPurchase = "1";
            }
        } else {
            Product_Detail.MemberCode = "";
        }
    },
    /*获取购物车的中商品的数量*/
    "GetCartCount": function () {
        $(".ch-icon .ch02").empty();
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
        var html = "<i>" + scount + "</i>";
        if (icount == 0)
            html = "";
        $(".ch-icon .ch02").append(html);
        $(".ch-icon .ch02").on("click", function (e) {

            //  localStorage[g_const_localStorage.BackURL] = location.href;

            PageUrlConfig.SetUrl();
            window.location.href = g_const_PageURL.Cart + "?t=" + Math.random();
        });
    },
    ///*记录浏览历史*/
    //AddToHsitory: function () {
    //    g_type_history.ObjHistory.marketPrice = Product_Detail.api_response.marketPrice.toString();
    //    g_type_history.ObjHistory.picture = Product_Detail.api_response.mainpicUrl.picNewUrl.Trim();
    //    g_type_history.ObjHistory.pname = Product_Detail.api_response.productName.Trim();
    //    g_type_history.ObjHistory.product_code = Product_Detail.api_response.productCode;
    //    g_type_history.ObjHistory.saleNum = Product_Detail.api_response.saleNum;
    //    g_type_history.ObjHistory.SalePrice = Product_Detail.GetSalePrice();
    //    g_type_history.ADD(g_type_history.ObjHistory);
    //},
    /*是否使用Event接口*/
    IsUseEventAPI: function () {
        if (Product_Detail.GetShowType() != Product_Detail.ShowType.Normal) {
            return true;
        }
        else
            return false;
    },
    /*获取显示类型*/
    GetShowType: function () {
        if (Product_Detail.api_input.productCode.indexOf("IC_SMG_") == 0)
            return Product_Detail.ShowType.Qrcode;
        else if (Product_Detail.api_input.productCode.indexOf("IC") == 0)
            return Product_Detail.ShowType.SecKill;
        else
            return Product_Detail.ShowType.Normal;
    },
    /*显示模板类型*/
    ShowType: {
        /*普通(特价,闪购)*/
        Normal: 1,
        /*秒杀*/
        SecKill: 2,
        /*扫码购*/
        Qrcode: 3
    },
    /*接口名称*/
    api_target: "com_cmall_familyhas_api_ApiGetEventSkuInfoNew",
    /*输入参数*/
    api_input: { "picWidth": "0", "productCode": decodeURI(GetQueryString("pid")), "buyerType": "", "version": 1.0, "channelId": "" },
    /*用户Token*/
    api_token: "",
    /*接口响应对象*/
    api_response: {},
    /*获取商品详情*/
    GetDetail: function () {
        Product_Detail.api_input.channelId = g_const_ChannelID;
        var s_api_input = JSON.stringify(Product_Detail.api_input);
        if (UserLogin.LoginStatus == g_const_YesOrNo.YES)
            Product_Detail.api_token = g_const_api_token.Wanted;
        else
            Product_Detail.api_token = g_const_api_token.Unwanted;
        var obj_data = { "api_input": s_api_input, "api_target": Product_Detail.api_target, "api_token": Product_Detail.api_token };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            Product_Detail.api_response = msg;
            $("#isSoldOut").hide();
            if (msg.resultCode == g_const_Success_Code) {

                Product_Detail.LoadSecKillInfo(msg);

                return;


                if (Product_Detail.IsSoldOut()) {
                    $("#isSoldOut").show();
                    $("#btnBuy").attr("class", "on");
                }
                if (Product_Detail.api_response.productStatus != g_const_productStatus.Common) {
                    $("#isSoldOut").text("该商品已下架,下次早点来哦~");
                    $("#isSoldOut").show();
                }
                if (msg.labelsList && msg.labelsList.length > 0) {
                    var label = g_const_ProductLabel.find(msg.labelsList[0]);
                    if (label) {
                        if (label.spicture.length > 0) {
                            $("#productName").html('<span style="background: url(' + label.productdetailpic + ');"></span>' + msg.productName.Trim());
                        }
                    }
                    else {
                        $("#productName").html((msg.flagTheSea == 1 ? "<span></span>" : "") + msg.productName.Trim());
                    }
                }
                else {
                    $("#productName").html((msg.flagTheSea == 1 ? "<span></span>" : "") + msg.productName.Trim());
                }
                $(".num").html("<b>商品编号</b><span>" + msg.productCode + "</span>");
                $(".shou").html("<b>月销</b><span>" + msg.saleNum + "件</span>");
                //$(".shou")[0].innerHTML = "<div>月销<span><b>" + msg.saleNum + "</b> 件</span></div><div>返利<span class=\"price\">￥<b>" + msg.disMoney + (UserLogin.LoginStatus == g_const_YesOrNo.YES ? "" : " 起") + "</b></span></div>";
                //$(".sc .bh")[0].innerHTML = msg.productCode;

                //判断此商品是否已收藏
                _productCode = msg.productCode;
                // MyCollection_Product.GetList();
                Product_Detail.LoadCategoryList(msg);
                Product_Detail.LoadPropertyInfoList(msg);
                Product_Detail.LoadAddress(msg);
                Product_Detail.LoadCommonProblem(msg);
                Product_Detail.LoadButtons(msg);

                Product_Detail.LoadCollection(msg);
                Product_Detail.Load_pcPicList(msg);
                Product_Detail.LoadPrice(msg);
                Product_Detail.LoadflagCheap(msg);
                Product_Detail.LoadPromotion(msg);
                Product_Detail.LoadProductProperty(msg);
                Product_Detail.LoadAuthorityLogo(msg);
                Product_Detail.LoadDiscriptPicList(msg);

                //Product_Detail.AddToHsitory();
                var _callback = GetQueryString("callback");
                if (_callback != "")
                    eval(_callback);
                //Product_Detail.LoadSecKillInfo();

            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            $("#mask").css("display", "none");
            $("#pageloading").css("display", "none");
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    //调用商品详情接口后
    AfterLoadDetail: function (msg) {
        if (Product_Detail.IsSoldOut()) {
            $("#btnBuy").attr("class", "on");
            $("#btnAddShoppingCart").attr("class", "on");
            $("#isSoldOut").show();
        }
        if (Product_Detail.api_response.productStatus != g_const_productStatus.Common) {
            $("#btnBuy").attr("class", "on");
            $("#btnAddShoppingCart").attr("class", "on");
            $("#isSoldOut").text("下架");
            $("#isSoldOut").show();
        }

        if (msg.labelsList && msg.labelsList.length > 0) {
            var label = g_const_ProductLabel.find(msg.labelsList[0]);
            if (label) {
                if (label.spicture.length > 0) {
                    $("#productName").html('<span style="background: url(' + label.productdetailpic + ') no-repeat;background-size: 86px 27px;">&nbsp;&nbsp;&nbsp;</span>' + msg.productName.Trim());
                }
                else {
                    $("#productName").html((msg.flagTheSea == 1 ? '<span style="background: url(' + g_const_ProductLabel.OverSea.productdetailpic + ') no-repeat;background-size: 86px 27px;">&nbsp;&nbsp;&nbsp;</span>' : "") + msg.productName.Trim());
                }
            }
            else {
                $("#productName").html((msg.flagTheSea == 1 ? '<span style="background: url(' + g_const_ProductLabel.OverSea.productdetailpic + ') no-repeat;background-size: 86px 27px;">&nbsp;&nbsp;&nbsp;</span>' : "") + msg.productName.Trim());
            }
        }
        else {
            $("#productName").html((msg.flagTheSea == 1 ? '<span style="background: url(' + g_const_ProductLabel.OverSea.productdetailpic + ') no-repeat;background-size: 86px 27px;">&nbsp;&nbsp;&nbsp;</span>' : "") + msg.productName.Trim());
        }
        $(".num").html("<b>商品编号</b><span>" + msg.productCode + "</span>");
        $(".shou").html("<b>月销</b><span>" + msg.saleNum + "件</span>");


        _productCode = msg.productCode;

        Product_Detail.LoadCategoryList(msg);
        Product_Detail.LoadPropertyInfoList(msg);
        if (msg.flagTheSea == 1) {
            Product_Detail.GetCommonQuestion(msg);
        }
        else {
            $("#nav").width(320);
            $("#commonProblem").hide();
            $("#commonProblemContent").hide();
        }
        //Product_Detail.GetCommonQuestion(msg);
        // Product_Detail.LoadButtons(msg);

        Product_Detail.LoadCollection(msg);
        Product_Detail.Load_pcPicList(msg);
        Product_Detail.LoadPrice(msg);
        Product_Detail.LoadflagCheap(msg);
        Product_Detail.LoadPromotion(msg);
        Product_Detail.LoadAuthorityLogo(msg);
        Product_Detail.LoadDiscriptPicList(msg);
        Product_Detail.SetSecKill();
        var _callback = decodeURIComponent(GetQueryString("callback"));
        if (_callback != "")
            eval(_callback);
    },
    //更新底部按钮
    LoadBtnInfo: function (msg) {
        var control = msg.buttonControl;
        //1：加入购物车，立即购买，2：电话订购+加入购物车+立即购买，3：电话订购+立即购买，4：立即购买，5：按钮上带倒计时的立即购买
        switch (control) {
            case 1:
                $("#btnBuy").show();
                $("#btnAddShoppingCart").show();
                break;
            case 2:
                $("#btnBuy").show();
                $("#btnAddShoppingCart").show();
                $("#btnPhone").show();
                break;
            case 3:
                $("#btnBuy").show();
                $("#btnPhone").show();
                break;
            case 4:
                $("#btnBuy").hide();
                break;
            case 5:
                $("#mainseckillbuy").show();
                break;
        }
    },
    /*判断是否有库存(售罄)*/
    IsSoldOut: function () {
        var bsoldout = true;
        if (Product_Detail.GetShowType() == Product_Detail.ShowType.Normal) {
            var skulist = Product_Detail.api_response.skuList;
            if (skulist.length == 0)
                bsoldout = true;
            else {
                for (var k in skulist) {
                    var sku = skulist[k];
                    if (sku.stockNumSum > 0) {
                        bsoldout = false;
                        break;
                    }
                }
            }
        }
        else {
            var skuSecKill = Product_Detail.SkuKillResponse;
            if (skuSecKill != null) {
                if (skuSecKill.buyStatus == g_const_buyStatus.ActIsEnd || skuSecKill.buyStatus == g_const_buyStatus.No || skuSecKill.buyStatus == g_const_buyStatus.Other)
                    bsoldout = true;
                else
                    bsoldout = false;
            }
            else
                bsoldout = false;
        }
        //if (bsoldout) {
        //    window.location = "Product_NotExist.html?pid=" + Product_Detail.api_input.productCode;
        //}
        return bsoldout;
    },
    //设定秒杀
    SetSecKill: function () {
        var msg = Product_Detail.SkuKillResponse;
        $("#mainseckillbuy").text(msg.buttonText);
        switch (msg.buyStatus) {
            case g_const_buyStatus.YES:
                $("#mainseckillbuy").attr("class", "star");
                $("#mainseckillbuy").off("click");
                //$("#mainseckillbuy").on("click", function (e) {
                //    if ($(this).attr("class").indexOf("end") == -1)
                //        Product_Detail.OpenSKULayer($(e.target).attr("operate"));
                //});
                $("#mainseckillbuy").on("click", Product_Detail.OnBuyClick);
                // $("#btnBuy").attr("class", "on");
                Product_Detail.SetSecKillButton();
                break;
            case g_const_buyStatus.ActNotStart:
                Product_Detail.SetSecKillButton();
                $("#mainseckillbuy").attr("class", "on");
            default:
                $("#mainseckillbuy").attr("class", "on");
                break;
        }
    },
    //设定秒杀活动按钮
    SetSecKillButton: function () {

        var msg = Product_Detail.SkuKillResponse;
        if (Product_Detail.GetShowType() == Product_Detail.ShowType.SecKill) {
            for (var k in Product_Detail.TimeOutArr) {
                window.clearTimeout(Product_Detail.TimeOutArr[k].value);
            }
            Product_Detail.TimeOutArr = [];

            var endTime = Date.Parse(Product_Detail.api_response.sysDateTime).AddSeconds(msg.limitSecond);
            Product_Detail.ShowLeftTimeButton(endTime, msg.buyStatus, $("#mainseckillbuy"));
        }
    },
    /*是否读取完毕秒杀价*/
    SkuSecKillLoaded: false,
    /*秒杀倒计时*/
    ShowLeftTimeButton: function (date_last, buystatus, objbutton) {
        var showtext, fintval = 100;

        var date_now = new Date();
        var ts = date_last.getTime() - date_now.getTime();  //时间差的毫秒数             

        var days = Math.floor(ts / g_const_days);
        var leftmillionseconds = ts % g_const_days;

        var hours = Math.floor(leftmillionseconds / g_const_hours);
        leftmillionseconds = leftmillionseconds % g_const_hours;

        var minutes = Math.floor(leftmillionseconds / g_const_minutes);
        leftmillionseconds = leftmillionseconds % g_const_minutes;

        var seconds = Math.floor(leftmillionseconds / g_const_seconds);

        //leftmillionseconds = leftmillionseconds % 100;
        var mseconds = Math.floor(leftmillionseconds / 100);


        var hourstring = "0" + hours.toString();
        hourstring = hourstring.substr(hourstring.length - 2, 2);
        var minutestring = "0" + minutes.toString();
        minutestring = minutestring.substr(minutestring.length - 2, 2);

        var secondstring = "0" + seconds.toString();
        secondstring = secondstring.substr(secondstring.length - 2, 2);
        var msecondstring = mseconds.toString();
        msecondstring = msecondstring.substr(msecondstring.length - 1, 1);

        showtext = days.toString() + "天" + hourstring + ":" + minutestring + ":" + secondstring + "." + msecondstring;
        switch (buystatus) {
            case g_const_buyStatus.YES:
                showtext += "后结束,立即购买"
                break;
            case g_const_buyStatus.ActNotStart:
                showtext += "后开始"
                break;
            case g_const_buyStatus.ActIsEnd:
                showtext = "已结束"
                break;
        }
        objbutton.text(showtext);
        if ((days != 0 || hours != 0 || minutes != 0 || seconds != 0 || mseconds != 0) && 1 == 1) {
            var objtimeout = { id: objbutton.attr("id"), value: 0 };
            objtimeout.value = window.setTimeout(function () { Product_Detail.ShowLeftTimeButton(date_last, buystatus, objbutton) }, fintval);
            var bexist = false;
            for (var k in Product_Detail.TimeOutArr) {
                if (Product_Detail.TimeOutArr[k].id == objtimeout.id) {
                    Product_Detail.TimeOutArr[k].value = objtimeout.value;
                    bexist = true;
                }
            }
            if (!bexist)
                Product_Detail.TimeOutArr.push(objtimeout);
        }
        else {
            switch (buystatus) {
                case g_const_buyStatus.YES:
                    showtext = "已结束"
                    if (objbutton.attr("id") == "mainseckillbuy")
                        objbutton.attr("class", "on");
                    else
                        objbutton.attr("class", "");
                    break;
                case g_const_buyStatus.ActNotStart:
                    showtext = "已开始,立即购买"
                    if (objbutton.attr("id") == "mainseckillbuy")
                        objbutton.attr("class", "");
                    else
                        objbutton.attr("class", "on");
                    break;
                    break;

            }
            objbutton.text(showtext);
        }
    },
    /*TimeOut数组*/
    TimeOutArr: [],
    /*读取收藏信息*/
    LoadCollection: function (msg) {
        if (msg.collectionProduct == g_const_collectionProduct.NO) {
            //   return;
        }
        else {
            $("#sc").addClass("curr").text("已收藏");
        }
        $("#sc").on("click", function (e) {
            Product_Detail.OperateCollection();
        });
    },
    /*添加或者取消收藏*/
    OperateCollection: function () {
        //保存回跳页面


        var productCode = ["" + Product_Detail.api_response.productCode + ""];
        var objcollecttion = $("#sc");
        if (!objcollecttion.hasClass("curr")) {
            //添加收藏                
            Collection.Add(productCode, function () {
                objcollecttion.addClass("curr").text("已收藏");
            }, "Product_Detail.OperateCollection()");
        }
        else {
            //取消收藏
            Collection.Delete(productCode, function () {
                objcollecttion.removeClass("curr").text("收藏");
            }, "Product_Detail.OperateCollection()");
        }
    },
    /*读取分类信息*/
    LoadCategoryList: function (msg) {
        var htmlStr = "";
        var nextLevel = "";
        $.each(msg.categoryList, function (i, n) {
            nextLevel = n.
            htmlStr += "<span>/</span><a style=\"cursor:pointer\" onclick=\"Product_Detail.LoadSearchList('" + n.categoryName + "')\">" + n.categoryName + "</a>";
        });
        $("#span_Category").html(htmlStr);
    },
    LoadSearchList: function (keyword) {
        var p = "&showtype=category&keyword=" + encodeURI(keyword) + "&t=" + Math.random();
        g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.SearchList), p);
    },
    /*读取轮播图*/
    Load_pcPicList: function (msg) {
        var objpcPicList = $("#ulSlider");
        var up = $(".up")
        var down = $(".down")
        var picCount = msg.pcPicList.length;
        objpcPicList.empty();
        var html = "";
        for (var i = 0; i < picCount; i++) {
            var objpcPic = msg.pcPicList[i];
            html += "<li><img src='" + g_GetPictrue(objpcPic.picNewUrl) + "' /></li>";
        }
        objpcPicList.append(html);
        $("#ulSlider li").on("click", function () {
            $(this).addClass("curr").siblings().removeClass("curr");
            $("#mainImg").attr("src", $(this).find("img").attr("src"));
            $("#b").find("img").attr("src", $(this).find("img").attr("src"));
        });
        var timer = picCount - 6;
        var index = 0;
        if (picCount > 6) {
            down.on("click", function () {
                if (index < timer) {
                    ++index;
                    $("#ulSlider").animate({ "top": "-" + 74 * index + "px" }, "slow");
                    up.removeClass("curr");
                    if (index == timer) {
                        down.addClass("curr");
                    }
                }
            });
            up.on("click", function () {
                if (index <= timer && index >= 1) {
                    --index;
                    $("#ulSlider").animate({ "top": "-" + 74 * index + "px" }, "slow");
                    down.removeClass("curr");
                    if (index == 0) {
                        up.addClass("curr");
                    }
                }
            });
        } else {
            up.addClass("curr");
            down.addClass("curr");
        }
    },
    GetSeller: function () {
        var p = "&sellername=1&showtype=category&keyword=" + encodeURI(Product_Detail.api_response.sellerCompanyName) + "&t=" + Math.random();
        g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.SearchList), p,true)
    },
    /*读取价格信息*/LoadPrice: function (msg) {
        var html = '';
        //button相关
        if (msg.buttonMap.callBtn == 1) {
            html += "<span id=\"btnPhone\"  style=\"display:none\">拨打<i>4008-678-888</i>，快速语音下单！</span>";
        }
        if (msg.vipSpecialActivity == g_const_YesOrNo.YES)
            html += "<b>¥" + msg.vipSpecialPrice + "</b>";
        else {
            //if (msg.minSellPrice == msg.maxSellPrice)
            //    html += '<b>¥' + msg.minSellPrice + '</b>';
            //else
            //    html += '<b>¥' + msg.minSellPrice + "-" + msg.maxSellPrice + '</b>';
            html += '<b>¥' + Product_Detail.GetSalePrice() + '</b>';
        }
        //priceLabel多个
        //if (msg.priceLabel != "") {
        //    $(msg.priceLabel.split(',')).each(function () {
        //        html += '<font>' + this + '</font>';
        //    });
        //}
        html += '<em>¥' + Product_Detail.SkuKillResponse.marketPrice + '</em>';
        html += '<a class="goShop" style="cursor:pointer" href="/IndexMain.html?u=SearchList&sellername=' + Product_Detail.api_response.sellerCompanyName + '&keyword=' + encodeURI(Product_Detail.api_response.smallSellerCode) + "&t=" + Math.random() + '"  target="_blank" >进入店铺</a>';
        $(".price").empty();
        $(".price").html(html);
    },
    GetCommonQuestion: function (msgOld) {
        var s_api_input = JSON.stringify({ "type": "449747890002" });
        var obj_data = { "api_input": s_api_input, "api_target": "com_cmall_familyhas_api_ApiQuestionOnline", "api_token": "" };
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
                Product_Detail.LoadCommonQuestion(msg);
            }
            else {

            }
        });

        request.fail(function (jqXHR, textStatus) {
            Product_Detail.LoadCommonQuestion(msgOld);
        });
    },
    LoadCommonQuestion: function (msg) {
        var strhtml = "";
        //if (msg.flagTheSea == 1) {
        //    if (msg.commonProblem) {
        //        $.each(msg.commonProblem, function (i, n) {
        //            strhtml += "<b>" + n.title + "</b>";
        //            strhtml += "<p>" + n.content + "</p>";
        //        });
        //    }
        //    $("#div_commonquestion").html(strhtml);
        //    $("#div_detaillist").attr("class", "box overseas");
        //    $("#li_commonquestion").show();
        //}
        //else {
        if (msg.questionList) {
            var commonProblemList = msg.questionList;
            var cpLength = commonProblemList.length;
            if (cpLength == 0) {
                $("#commonProblem").hide();
                $("#commonProblemContent").hide();
            } else {
                var temp = "";
                for (var i = 0; i < cpLength; i++) {
                    temp += "<h3>Q" + (i + 1) + "、" + commonProblemList[i].title + "</h3>";
                    temp += "<p>" + commonProblemList[i].content + "</p>";
                }
                $("#commonProblemContent").html(temp);
            }
        }
        //$("#div_commonquestion").html(strhtml);
        //$("#div_detaillist").attr("class", "box overseas");
        //$("#li_commonquestion").show();
        //  }
    },
    //读取常见问题
    LoadCommonProblem: function (msg) {
        var commonProblemList = msg.commonProblem;
        var cpLength = commonProblemList.length;
        if (cpLength == 0) {
            $("#commonProblem").hide();
            $("#commonProblemContent").hide();
        } else {
            var temp = "";
            for (var i = 0; i < cpLength; i++) {
                temp += "<h3>Q" + (i + 1) + "、" + commonProblemList[i].title + "</h3>";
                temp += "<p>" + commonProblemList[i].content + "</p>";
            }
            $("#commonProblemContent").html(temp);
        }

    },
    //读取页面button
    LoadButtons: function (msg) {
        var buttonMap = msg.buttonMap;
        if (!buttonMap.buyBtn == 1) {
            $("#btnBuy").hide();
        }
        if (!buttonMap.shopCarBtn == 1) {
            $("#btnAddShoppingCart").hide();
        }

    },
    /*读取闪购信息*/
    LoadflagCheap: function (msg) {
        if (msg.flagCheap == g_const_YesOrNo.YES) {
            $("#div_left_time").empty();
            $("#div_left_time").css("display", "");
            $("#mainaddtocart").css("display", "none");
            $("#sku_addtocart").css("display", "none");
            Product_Detail.flagCheapInterval = self.setInterval("Product_Detail.ShowLeftTime();", g_const_seconds);
        }
    },
    /*读取地址相关*/
    LoadAddress: function (msg) {
        if (msg.addressList.length > 0) {
            $("#addressSelect").show();
            var defaultCity = Product_Detail.GetDefaultAddress(msg);
            $("#defaultAddress").text(defaultCity.cityName).attr("cityid", defaultCity.cityID);
            $("#usedAddress").text(defaultCity.cityName);
            Product_Detail.LoadProvince(msg.addressList);
            Product_Detail.showAndHide();
            Product_Detail.ShowAddressTip(msg.addressList);
            $("#selectProvince").click(function () {
                var oI = $("<i><\/i>");
                $(this).append(oI).siblings().find("i").remove();
                Product_Detail.LoadProvince(msg.addressList);
            });
            $("#selectCity").click(function () {
                var oI = $("<i><\/i>");
                $(this).append(oI).siblings().find("i").remove();
                var provinceid = $("#addressContent").find("li[class='act']").attr("proviceid");
                Product_Detail.LoadCitys(provinceid || 0, msg.addressList);
            });
            $(".dia_close").on("click", function () {
                $('.song_dialog').hide();
            });
        }
    },
    ShowAddressTip: function (addressList) {
        var arrLis = $("#addressContent").find("li[class='act']");
        if (arrLis.length > 0) {
            var li = arrLis[0];
            if (Product_Detail.IsInShippingArea($(li).attr("proviceid"), $(li).attr("cityid"), addressList)) {
                $("#tipMessage").show().find("span[class='you']").show();
            }
            else {
                $("#tipMessage").show().find("span[class='wu']").show().find("span[class='please']").show();
            }
        }
        else {
            $("#tipMessage").show().find("span[class='you']").show();
        }
    },
    showAndHide: function () {
        $(".songAddr_btn").mouseenter(function () {
            $('.song_dialog').show();
            $(this).addClass("act");
        });
        $(".songAddr_btn").mouseleave(function () {
            $('.song_dialog').hide();
            $(this).removeClass("act");
        });
        $('.song_dialog').mouseleave(function () {
            $(this).hide();
            $(".songAddr_btn").removeClass("act");
        });
        $('.song_dialog').mouseenter(function () {
            $(this).show();
            $(".songAddr_btn").addClass("act");
        });
    },
    GetDefaultAddress: function (msg) {
        var l_defaultcitycode = localStorage[g_const_localStorage.DefaultCity];
        var defaultcity = {
            cityID: "",
            cityName: ""
        };
        if (typeof (l_defaultcitycode) != "undefined") {
            defaultcity = JSON.parse(l_defaultcitycode);
        } else {
            defaultcity = msg.defaultAddress;
            localStorage[g_const_localStorage.DefaultCity] = JSON.stringify(defaultcity);
        }
        return defaultcity;
    },
    LoadProvince: function (addressList) {
        var html = [];
        $(addressList).each(function () {
            html.push('<li proviceid="' + this.provinceID + '" cityid="0">' + this.provinceName + '</li>');
        });
        $("#addressContent").html(html.join(''));
        Product_Detail.SelectShippingArea(addressList);
    },
    LoadCitys: function (proviceid, addressList) {
        var html = [];
        $(addressList).each(function () {
            if (this.provinceID == proviceid) {
                $(this.cityList).each(function () {
                    html.push('<li proviceid="' + proviceid + '" cityid="' + this.cityID + '">' + this.cityName + '</li>');
                });
                return false;
            }
        });
        $("#addressContent").html(html.join(''));
        $("#addressNav li:eq(1)").append('<i><\/i>').siblings().find("i").remove();
        Product_Detail.SelectShippingArea(addressList);
    },
    /*判断是否在配送区域*/
    IsInShippingArea: function (proviceid, cityid, addressList) {
        var isIn = false;
        if (addressList.length <= 0) {
            isIn = true;
        }
        $(addressList).each(function () {
            if (proviceid != 0) {
                if (this.provinceID == proviceid) {
                    $(this.cityList).each(function () {
                        if (this.cityID == cityid) {
                            isIn = true;
                            return false;
                        }
                    });
                    return false;
                }
            }
        });
        return isIn;
    },
    SelectShippingArea: function (addressList) {
        var defaultcity = {
            cityID: "",
            cityName: ""
        };
        $("#addressContent li").on("click", function () {
            $(this).addClass("act").siblings().removeClass("act");
            $("#defaultAddress").text($(this).html()).attr("cityid", $(this).attr("cityid"));
            defaultcity.cityID = $(this).attr("cityid");
            defaultcity.cityName = $(this).html();
            localStorage[g_const_localStorage.DefaultCity] = JSON.stringify(defaultcity);
            if ($(this).attr("cityid") == "0") {
                Product_Detail.LoadCitys($(this).attr("proviceid"), addressList)
            }
            else {
                Product_Detail.ShowAddressTip(addressList);
            }
        });
    },
    flagCheapInterval: 0,
    ShowLeftTime: function () {
        var date_last = Date.Parse(Product_Detail.api_response.endTime);
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

        $("#div_left_time").html("剩 " + hourstring + ":" + minutestring + ":" + secondstring);
        if (hours == 0 && minutes == 0 && seconds == 0)
            self.clearInterval(Product_Detail.flagCheapInterval);
    },
    /*读取促销信息*/LoadPromotion: function (msg) {
        $("#promotion").empty();
        var headhtml = '<b>促销</b><span>';
        var html = '';
        var temp = "";
        var count = 0;
        if (msg.flagIncludeGift == g_const_YesOrNo.YES) {
            //<label><i>赠品</i><font><a href>毛巾毛巾毛巾毛巾毛巾20cmX20cm *5</a><a href>毛巾毛巾毛巾毛巾毛巾20cmX20cm *5</a><a href>毛巾毛巾毛巾毛巾毛巾20cmX20cm *5</a><a href>毛巾毛巾毛巾毛巾毛巾20cmX20cm *5</a></font>
            temp += "<label><i>赠品</i>";
            temp += "<font><a>" + msg.gift + "</a></font>";
            temp += "</label>";
            html += temp;
            count++;
        }
        if (msg.flagCheap == g_const_YesOrNo.YES) {
            if (Product_Detail.api_response.skuList.length > 0) {
                for (var k in Product_Detail.api_response.skuList[0].activityInfo) {
                    var activity = Product_Detail.api_response.skuList[0].activityInfo[k];
                    temp += ' <label><i>' + activity.activityName + '</i><strong>' + activity.remark + '</strong></label>';
                    html += temp;
                    count++;
                }
            }
        }

        temp = "";
        //if (msg.priceLabel.Trim() != "" && msg.priceLabel.Trim() != "闪购") {
        //    var arrpriceLabel = msg.priceLabel.Trim().split(",");
        //    for (var kkk in arrpriceLabel) {
        //        temp += ' <label><i>' + arrpriceLabel[kkk] + '</i><strong>&nbsp;</strong></label>';
        //        html += temp;
        //        count++;
        //    }
        //}
        if (msg.otherShow.length > 0) {
            var arrotherShow = msg.otherShow;
            for (var kkk in arrotherShow) {
                if (arrotherShow[kkk] != "" && arrotherShow[kkk] != "赠品")
                    temp += ' <label><i>' + arrotherShow[kkk] + '</i><strong>&nbsp;</strong></label>';
                html += temp;
                count++;
            }
        }
        //增加满减活动
        for (var k in Product_Detail.SkuKillResponse.saleMessage) {
            var activity = Product_Detail.SkuKillResponse.saleMessage[k];
            html += "<label><i>" + activity.eventName + "</i><strong title=" + activity.saleMessage + ">" + activity.saleMessage + "</strong><a style=\"cursor:pointer\" onclick=\"Product_Detail.OpenFullCut('" + activity.eventCode + "','" + activity.beginTime + "','" + activity.endTime + "')\" class=\"xq\">详情 &gt;&gt;</a></label>";
            count++;
        }
        for (var k in Product_Detail.SkuKillResponse.events) {
            var innerBuy = Product_Detail.SkuKillResponse.events[k];
            if (innerBuy.eventType == g_const_Act_Event_Type.Insourced) {
                html += "<label><i>" + innerBuy.eventName + "</i><strong>" + Product_Detail.api_response.vipSpecialTip + "</strong></label>";
                break;
            }
            if (innerBuy.eventType == g_const_Act_Event_Type.SpecialPrice) {
                html += "<label><i>" + innerBuy.eventName + "</i><strong>" + Product_Detail.api_response.vipSpecialTip + "</strong></label>";
                break;
            }
            count++;
        }
        for (var k in Product_Detail.SkuKillResponse.events) {
            var innerBuy = Product_Detail.SkuKillResponse.events[k];
            if (innerBuy.eventType == g_const_Act_Event_Type.Insourced) {
                var innerBuyInfo = "<span class=\"num_tip\"><i>注意：员工每月内购数量为5件  ，同一个商品最多订购两件！</i></span>";
                $(".number span").append(innerBuyInfo);
                break;
            }
        }
        var endhtml = '</span>';
        $("#promotion").append(headhtml + html + endhtml);

        $("#promotion").find("label:last").css("padding-bottom", "0px");
        if (html == "") {
            $("#promotion").hide();
            $("#more").hide();
        }
        if (count <= 2) {
            $("#more").hide();
        }
        else {
            var showHight = $("#promotion").find("label:eq(0)").outerHeight(false) + $("#promotion").find("label:eq(1)").outerHeight(false);
            $("#promotion").css("height", showHight + "px");
            $("#promotion").find("label:last").css("padding-bottom", "10px");
            $("#more").show();

            $('#more').click(function () {
                var m = $(this).data('more');
                if (m == 1) {
                    $(this).data("more", "0");
                    $(this).html('收起');
                    $('#promotion').css('height', 'auto');
                } else {
                    $(this).data("more", "1");
                    $(this).html('更多');
                    $('#promotion').css('height', showHight + 'px');
                }
            });
        }
    },
    OpenFullCut: function (activityCode, startTime, endTime) {
        PageUrlConfig.SetUrl();
        g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.FullCut), "&t=" + Math.random()
                                    + "&activitycode=" + activityCode
                                    + "&begintime=" + startTime
                                    + "&endtime=" + endTime, true);
    },
    /*取销售价格*/
    GetSalePrice: function () {
        if (Product_Detail.SkuSecKillLoaded) {
            if (Product_Detail.SkuKillResponse.events.length > 0) {
                var jyhactevents = Product_Detail.SkuKillResponse.events;
                var jyhactevent = jyhactevents[0];
                if (jyhactevent.eventType == g_const_Act_Event_Type.Insourced)
                    return Product_Detail.SkuKillResponse.sellPrice;
                else
                    return Product_Detail.SkuKillResponse.sellPrice;
            }
            else
                return Product_Detail.SkuKillResponse.sellPrice;
        } else {
            return "";
        }
    },
    /*读取商品属性信息*/
    LoadProductProperty: function () {
        var temp = '';
        var _propertyList = Product_Detail.api_response.propertyList;
        var sku_keyname = '';
        var a_class = "";
        for (var i = 0; i < _propertyList.length; i++) {
            temp += '<p module="202041" class="option" data-keycode="' + _propertyList[i].propertyKeyCode + '" index="' + i.toString() + '"><b>' + _propertyList[i].propertyKeyName + '</b>';
            temp += '<font>';
            var propertyValueList = _propertyList[i].propertyValueList;
            for (var j = 0; j < propertyValueList.length; j++) {
                a_class = "";
                temp += '<a class="' + a_class + '" data-valuecode="' + propertyValueList[j].propertyValueCode + '" data-namecode="' + propertyValueList[j].propertyValueName + '">' + propertyValueList[j].propertyValueName + '</a>'
            }
            temp += '</font></p>';
        }
        // $("#divProductProperty").empty();
        $("#divPropertyList").html(temp);
        //商品主图片
        $("#mainImg").attr("src", g_GetPictrue(Product_Detail.api_response.mainpicUrl.picNewUrl.Trim()));
        $("#b").find("img").attr("src", g_GetPictrue(Product_Detail.api_response.mainpicUrl.picNewUrl.Trim()));

        /*数量减一*/
        $(".jian").on("click", function (e) {

            var buycount = $("#buycount").val();
            var icount = parseInt(buycount, 10);
            if (icount == "NaN") {
                icount = 1;
            }
            if (icount <= 1)
                icount = 1;
            else
                icount = icount - 1;
            if (Product_Detail.SelectSku.stockNumSum == 0 || Product_Detail.api_response.maxBuyCount == 0)
                icount = 0;
            $("#buycount").val(icount.toString());
        });
        /*数量加一*/
        $(".jia").on("click", function (e) {
            var buycount = $("#buycount").val();
            var icount = parseInt(buycount, 10);
            if (icount == "NaN") {
                icount = 1;
            }
            if (Product_Detail.SelectSku.stockNumSum == 0)
                icount = 0;
            if (icount >= 99)
                icount = 99;
            else
                icount = icount + 1;
            if (icount > Product_Detail.SelectSku.stockNumSum) {
                ShowMesaage("对不起,您不能购买更多了.");
                icount = Product_Detail.SelectSku.stockNumSum;
            }
            if (icount > Product_Detail.SelectSku.skuMaxBuy) {
                ShowMesaage("对不起,您已达到限购数量上限.");
                icount = Product_Detail.SelectSku.skuMaxBuy;
            }
            $("#buycount").val(icount.toString());
        });

        $("#btnBuy").on("click", Product_Detail.OnBuyClick);
        $("#btnAddShoppingCart").on("click", Product_Detail.OnBuyClick);
        for (var i = 0; i < Product_Detail.api_response.propertyList.length; i++) {
            var propertyList = Product_Detail.api_response.propertyList[i];
            var objgroup = $(".option[data-keycode='" + propertyList.propertyKeyCode.Trim() + "']").find("a[class='']");
            objgroup.on("click", function (e) {
                var objthis = e.target;
                if ($(this).attr("class") == "on")
                    return;
                var obj_group = $(this).parent().parent().find("a[class='curr']");
                obj_group.removeClass("curr");
                $(this).addClass("curr");
                Product_Detail.StyleSelect($(this).parent().parent().attr("index"), $(this).parent().parent().attr("data-keycode"), $(this).attr("data-valuecode"), "");
            });
        }
        for (var i = 1; i < Product_Detail.api_response.propertyList.length; i++) {
            var propertyList = Product_Detail.api_response.propertyList[i];
            $.each($(".option[data-keycode='" + propertyList.propertyKeyCode.Trim() + "']").find("a[class='']"), function (j, n) {
                $(this).attr("class", "on");
                //  Product_Detail.AutoStyleSelect($(this).parent().parent().attr("index"), $(this).parent().parent().attr("data-keycode"), $(this).attr("data-valuecode"), $(this));
            });
        }
        for (var i = 0; i < Product_Detail.api_response.propertyList.length - 1; i++) {
            var propertyList = Product_Detail.api_response.propertyList[i];
            $.each($(".option[data-keycode='" + propertyList.propertyKeyCode.Trim() + "']").find("a[class='']"), function (j, n) {
                Product_Detail.AutoStyleSelect($(this).parent().parent().attr("index"), $(this).parent().parent().attr("data-keycode"), $(this).attr("data-valuecode"), $(this));
            });
        }
        //$.each(Product_Detail.SkuKillResponse.skus, function (i, n) {
        //    if (i == 0) {
        //        classstr = "class = \"curr\"";
        //    }
        //    else {
        //        classstr = "";
        //    }
        //    body += '<a onclick="Category.Load_ProductList(\'category\',\'' + n.categoryName + '\');" id="li_level_' + i + '">' + n.categoryName + '</a>';
        //});
        if (Product_Detail.api_response.propertyList.length == 1) {
            Product_Detail.SetStockInfo("");
        }
        /*如果只有1种sku则隐藏sku选择器*/
        if (Product_Detail.api_response.skuList.length == 1) {
            //$(".pop-c .sel").css("display", "none");
            //$(".pop-c .selnum").css("display", "");
            //$(".imgr .size").css("display", "none");
            $("#divPropertyList").hide();
            Product_Detail.SelectSku = Product_Detail.api_response.skuList[0];
            Product_Detail.RefershPrice(Product_Detail.SelectSku.keyValue)
        }
    },
    /*点击购买或者加入购物车时的操作*/
    OnBuyClick: function (e) {

        if (Product_Detail.IsSoldOut()) {
            return;
        }
        if (Product_Detail.api_response.productStatus != g_const_productStatus.Common) {
            return;
        }
        var objthis = e.target;
        var buycount = 0;
        $(".bottom").css("display", "none");
        var selectstylecount = $(".option .curr").length;
        var maxstylecount = Product_Detail.api_response.propertyList.length;

        buycount = parseInt($("#buycount").val(), 10);

        //除扫码购和满减外，其他活动都有此限制，判断限购总数量
        try {
            var tttt = ""
            if (Product_Detail.SkuKillResponse.events.length > 0) {
                tttt = Product_Detail.SkuKillResponse.events;
            }
            if (tttt != "" && (tttt[0].eventType == g_const_Act_Event_Type.SMG || tttt[0].eventType == g_const_Act_Event_Type.ManJian)) {
                //扫码购和满减,不用判断
            }
            else {
                //获取限购的sku数量
                var temp_skuMaxBuy = 0;
                var stockNumSum = 0;
                Product_Detail.SelectSku.forEach(function (e) {
                    if (e.limitBuyTip) {
                        temp_skuMaxBuy = e.skuMaxBuy;
                        temp_stockNumSum = e.stockNumSum
                    }
                })

                if (temp_stockNumSum == 0 || temp_skuMaxBuy < buycount) {
                    if (temp_stockNumSum == 0) {
                        //Product_Detail.ShowPropertyError("对不起,您已达到购买数量上限.");
                        ShowMesaage("对不起,您已达到购买数量上限.");

                        return;
                    }
                    else if (temp_skuMaxBuy < buycount) {
                        //Product_Detail.ShowPropertyError("该商品超值限购，最多可购买" + Product_Detail.api_response.skuList[0].skuMaxBuy + "个.");
                        ShowMesaage("该商品超值限购，最多可购买" + temp_skuMaxBuy + "个.");

                        return;
                    }
                }
            }
        } catch (e) { }

        if (Product_Detail.api_response.skuList.length > 1 && selectstylecount != maxstylecount) {
            Product_Detail.ShowPropertyError("请您选择你要购买的商品样式.");
            return;
        }

        if (buycount > Product_Detail.SelectSku.stockNumSum) {
            Product_Detail.ShowPropertyError("库存不足,请您修改购买数量.");
            return;
        }
        if (buycount > Product_Detail.SelectSku.skuMaxBuy || buycount == 0) {
            Product_Detail.ShowPropertyError("对不起,您已达到限购数量上限.");
            return;
        }

        var objcart = {
            /*商品数量*/
            "sku_num": buycount,
            /*地区编号,可不填写，添加购物车不再需要区域编号*/
            "area_code": "",
            /*商品编号*/
            "product_code": Product_Detail.api_input.productCode,//Product_Detail.api_response.productCode,
            /*sku编号*/
            "sku_code": Product_Detail.SelectSku.skuCode,
            chooseFlag: g_const_YesOrNo.YES.toString()
        };

        var objcartfull = g_type_cart.objCartFull;
        var objcartlist = [];
        objcartfull.sku_num = buycount;
        objcartfull.area_code = "";
        if (Product_Detail.GetShowType() == Product_Detail.ShowType.Normal) {
            objcartfull.product_code = Product_Detail.api_input.productCode;
            objcartfull.sku_code = Product_Detail.SelectSku.skuCode;

        }
        else {
            objcartfull.product_code = Product_Detail.api_response.productCode;
            objcartfull.sku_code = Product_Detail.SelectSku.itemCode;
            objcart.sku_code = objcartfull.sku_code;
            objcart.product_code = objcartfull.product_code;

        }

        objcartfull.otherShow = Product_Detail.api_response.otherShow;
        objcartfull.sku_price = Product_Detail.SelectSku.sellPrice;
        objcartfull.sku_stock = Product_Detail.SelectSku.stockNumSum;
        objcartfull.pic_url = Product_Detail.api_response.mainpicUrl.picNewUrl.Trim();
        objcartfull.limit_order_num = Product_Detail.SelectSku.skuMaxBuy;
        objcartfull.flag_stock = g_const_YesOrNo.YES;
        objcartfull.flag_product = g_const_YesOrNo.YES;
        objcartfull.sku_name = Product_Detail.SelectSku.skuName;//Product_Detail.api_response.productName.Trim() + " " + $(".imgr .size span").text();
        objcartfull.sales_type = "";//已过时,不再用
        objcartfull.sales_info = "";//已过时,不再用
        objcartfull.chooseFlag = "1";

        var arrpricelabel = Product_Detail.api_response.priceLabel.split(",");
        for (var i = 0; i < arrpricelabel.length; i++) {
            var pricelabel = arrpricelabel[i];
            if (pricelabel != "") {
                var activity = {
                    activity_name: pricelabel,
                    activity_info: ""
                };
                objcartfull.activitys.push(activity);
            }
        }
        var arrstyle = Product_Detail.SelectSku.keyValue.split("&");
        for (var i = 0; i < arrstyle.length; i++) {
            var s_style = arrstyle[i];
            if (s_style.indexOf("=") != -1) {
                var arr_s_style = s_style.split("=");
                var objp = Product_Detail.FindProperty(arr_s_style[0], arr_s_style[1]);
                var PcPropertyinfoForFamily = { sku_code: objcartfull.sku_code, propertyKey: objp.propertyKey, propertyValue: objp.propertyValue };
                objcartfull.sku_property.push(PcPropertyinfoForFamily);
            }
        }

        // objcartfull.activitys
        var objcarts = {
            "GoodsInfoForAdd": []
        };

        if ($(objthis).attr("operate") == "addtocart") {
            //加入购物车   
            g_type_cart.ADD(objcartfull,false,true);
            localStorage[g_const_localStorage.OrderConfirm] = localStorage[g_const_localStorage.Cart];
            Product_Detail.GetCartCount();
            
            $('#biao').show();
            $('.ware_list').show();
            $('#b1').show();
        }
        else if ($(objthis).attr("operate") == "orderconfim") {
            //立即购买
            objcarts = {
                "GoodsInfoForAdd": [objcart]
            };
            localStorage[g_const_localStorage.ImmediatelyBuy] = JSON.stringify(objcarts);
            localStorage[g_const_localStorage.OrderConfirm] = localStorage[g_const_localStorage.ImmediatelyBuy];
            //_productinfo.buycount = $("#buycount").val();
            objcartlist.push(objcartfull);
            localStorage[g_const_localStorage.GoodsInfo] = JSON.stringify(objcartlist);
            UserLogin.Check(Product_Detail.OrderConfirm);

        }
    },
    OrderConfirm: function () {
        if (UserLogin.LoginStatus == g_const_YesOrNo.YES) {
            g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.OrderConfirm), "");
        }
        else {
            //PageUrlConfig.SetUrl(g_const_PageURL.MainIndex + "?u=OrderConfirm");
            //var p = "&t=" + Math.random();
            //g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.Login), p);
            PageUrlConfig.SetReturnGoto(g_const_PageURL.Login, "OrderConfirm", "");
            //Message.ShowToPage("11", g_const_PageURL.MainIndex + "?u=" + g_const_PageURL.GetKey(g_const_PageURL.Login), 2000, "",g_const_PageURL.MainIndex + "?u=OrderConfirm");
        }
    },
    /*查询样式信息*/
    FindProperty: function (propertyKeyCode, propertyValueCode) {
        var objp = { propertyKey: "", propertyValue: "" };
        for (var i = 0; i < Product_Detail.api_response.propertyList.length; i++) {
            var property = Product_Detail.api_response.propertyList[i];
            if (property.propertyKeyCode == propertyKeyCode) {
                objp.propertyKey = property.propertyKeyName;
                for (var j in property.propertyValueList) {
                    var propertyValue = property.propertyValueList[j];
                    if (propertyValue.propertyValueCode == propertyValueCode) {
                        objp.propertyValue = propertyValue.propertyValueName;
                        break;
                    }
                }
                break;
            }
        }
        return objp;
    },
    /*选中的样式编号串*/
    ChoosedStyle: "",
    /*选中的样式名称串*/
    ChoosedStyleName: "",
    /*样式选择方法*/
    StyleSelect: function (selectindex, propertyKeyCode, propertyValue) {
        var sprice = "";
        if (selectindex == 0) {
            //Product_Detail.ChoosedStyle = "";
            //Product_Detail.ChoosedStyleName = "已选择：";
            $(".price").empty();

            sprice += '<b>¥' + Product_Detail.GetSalePrice() + "</b>";

            //if (Product_Detail.api_response.priceLabel != "") {
            //    $(Product_Detail.api_response.priceLabel.split(',')).each(function () {
            //        sprice += '<font>' + this + '</font>';
            //    });
            //}
            for (var k in Product_Detail.SkuKillResponse.events) {
                var innerBuy = Product_Detail.SkuKillResponse.events[k];
                sprice += '<font>' + innerBuy.eventName + '</font>';
                break;
            }

            sprice += '<em>¥' + Product_Detail.SkuKillResponse.marketPrice + '</em>';
            sprice += '<a class="goShop" style="cursor:pointer" href="/IndexMain.html?u=SearchList&sellername=' + Product_Detail.api_response.sellerCompanyName + '&keyword=' + encodeURI(Product_Detail.api_response.smallSellerCode) + "&t=" + Math.random() + '"  target="_blank" >进入店铺</a>';
            $(".price").append(sprice);
        }
        // var stylename = Product_Detail.ChoosedStyleName;
        var style = Product_Detail.ChoosedStyle;
        var arrstyle = style.split("&");
        var maxselectcount = Product_Detail.api_response.propertyList.length;

        for (var i = 0; i < maxselectcount; i++) {

            if (i > selectindex) {
                //把所选样式下面的样式组设为未选择
                var objgroup = $(".option[index='" + i.toString() + "']").find("a");
                objgroup.attr("class", "");
            }
        }

        var selectstyles = $(".option .curr");
        var islength = selectstyles.length;
        style = "";
        //  stylename = "已选择：";
        productstylevalue = "";
        for (var i = 0; i < islength ; i++) {
            var ss = selectstyles[i];
            if (i != (islength - 1)) {
                style += $(ss).parent().parent().attr("data-keycode") + "=" + $(ss).attr("data-valuecode") + "&";

            }
            else {

                style += $(ss).parent().parent().attr("data-keycode") + "=" + $(ss).attr("data-valuecode");
                if (i == (maxselectcount - 2)) {
                    if (selectindex == i) {
                        Product_Detail.SetStockInfo(style);
                    }
                }
            }
        }

        Product_Detail.ChoosedStyle = style;

        if (islength == maxselectcount)
            Product_Detail.RefershPrice(style);

    },
    /*设定默认库存显示*/
    SetStockInfo: function (style) {
        var maxselectcount = Product_Detail.api_response.propertyList.length;
        var lastsyles = $(".option[index='" + (maxselectcount - 1).toString() + "'] a");

        var skuList = Product_Detail.api_response.skuList;

        for (var istylecount = 0; istylecount < lastsyles.length; istylecount++) {
            var laststyle = lastsyles[istylecount];
            var fullstyle = style + "&" + $(laststyle).parent().parent().attr("data-keycode") + "=" + $(laststyle).attr("data-valuecode");
            if (style == "")
                fullstyle = $(laststyle).parent().parent().attr("data-keycode") + "=" + $(laststyle).attr("data-valuecode");
            if (Product_Detail.IsSkuCanSold(fullstyle))
                $(laststyle).attr("class", "");
            else
                $(laststyle).attr("class", "on");
        }
    },

    /*选中的样式编号串*/
    AutoChoosedStyle: "",
    /*选中的样式名称串*/
    AutoChoosedStyleName: "",
    /*样式选择方法*/
    AutoStyleSelect: function (selectindex, propertyKeyCode, propertyValue, obj) {
        // var stylename = Product_Detail.ChoosedStyleName;
        var style = Product_Detail.AutoChoosedStyle;
        var arrstyle = style.split("&");
        var maxselectcount = Product_Detail.api_response.propertyList.length;

        //for (var i = 0; i < maxselectcount; i++) {

        //    if (i > selectindex) {
        //        //把所选样式下面的样式组设为未选择
        //        var objgroup = $(".option[index='" + i.toString() + "']").find("a");
        //            objgroup.attr("class", "on");
        //    }
        //}
        var selectstyles = obj;
        var islength = selectstyles.length;
        style = "";
        //  stylename = "已选择：";
        productstylevalue = "";
        for (var i = 0; i < islength ; i++) {
            var ss = selectstyles[i];
            if (i != (islength - 1)) {
                style += $(ss).parent().parent().attr("data-keycode") + "=" + $(ss).attr("data-valuecode") + "&";

            }
            else {

                style += $(ss).parent().parent().attr("data-keycode") + "=" + $(ss).attr("data-valuecode");
                if (i == (maxselectcount - 2)) {
                    if (selectindex == i) {
                        Product_Detail.AutoSetStockInfo(style);
                    }
                }
            }
        }

        Product_Detail.AutoChoosedStyle = style;
    },
    /*设定默认库存显示*/
    AutoSetStockInfo: function (style) {
        var maxselectcount = Product_Detail.api_response.propertyList.length;
        var lastsyles = $(".option[index='" + (maxselectcount - 1).toString() + "'] a");

        var skuList = Product_Detail.api_response.skuList;

        for (var istylecount = 0; istylecount < lastsyles.length; istylecount++) {
            var laststyle = lastsyles[istylecount];
            var fullstyle = style + "&" + $(laststyle).parent().parent().attr("data-keycode") + "=" + $(laststyle).attr("data-valuecode");
            if (style == "")
                fullstyle = $(laststyle).parent().parent().attr("data-keycode") + "=" + $(laststyle).attr("data-valuecode");
            if (Product_Detail.IsSkuCanSold(fullstyle))
                $(laststyle).attr("class", "");
            //else
            //    $(laststyle).attr("class", "on");
        }
    },

    /*查找制定样式的sku是否有货*/
    IsSkuCanSold: function (fullstyle) {
        var skuList = Product_Detail.api_response.skuList;
        var bcansold = false;
        for (var iskuindex = 0; iskuindex < skuList.length; iskuindex++) {
            var sku = skuList[iskuindex];
            if (sku.keyValue.indexOf(fullstyle) != -1) {
                //$(laststyle).attr("class", "nosel");
                bcansold = true;
                if (sku.stockNumSum <= 0)
                    bcansold = false;
                break;
            }
        }
        return bcansold;
    },
    /*根据单个的SKU信息更新页面*/
    RefershPrice: function (style) {
        var sprice = "";
        //获取对应的sku信息
        var sku = Product_Detail.FindSku(style);
        if (sku != null) {
            Product_Detail.SelectSku = sku;
            $(".price").empty();
            //if (sku.activityInfo.length > 0) {
            //    for (var i = 0; i < sku.activityInfo.length ; i++) {
            //        var objactivityInfo = sku.activityInfo[i];

            //    }
            //}
            sprice += '<b>¥' + parseFloat(sku.sellPrice).toFixed(2).toString() + "</b>";
            //if (Product_Detail.api_response.priceLabel != "") {
            //    $(Product_Detail.api_response.priceLabel.split(',')).each(function () {
            //        sprice += '<font>' + this + '</font>';
            //    });
            //}
            for (var k in Product_Detail.SkuKillResponse.events) {
                var innerBuy = Product_Detail.SkuKillResponse.events[k];
                    sprice += '<font>' + innerBuy.eventName + '</font>';
                    break;
            }
            sprice += '<em>¥' + Product_Detail.SkuKillResponse.marketPrice + '</em>';
            sprice += '<a class="goShop" style="cursor:pointer" href="/IndexMain.html?u=SearchList&sellername=' + Product_Detail.api_response.sellerCompanyName + '&keyword=' + encodeURI(Product_Detail.api_response.smallSellerCode) + "&t=" + Math.random() + '"  target="_blank" >进入店铺</a>';
            $(".price").append(sprice);
            $(".number span").empty();
            var limitcount = 0;
            if (sku.skuMaxBuy >= sku.stockNumSum)
                limitcount = sku.stockNumSum;
            else
                limitcount = sku.skuMaxBuy;
            var slimitbuy = limitcount >= 99 ? "" : "限购<i>" + limitcount.toString() + "</i>件";
            //if (sku.skuMaxBuy <= 0 && sku.limitBuyTip.indexOf("已达购买限制数") != -1)
            //    slimitbuy = sku.limitBuyTip;
            $(".number span").append(slimitbuy);
            if (sku.stockNumSum <= 0) {
                Product_Detail.ShowPropertyError(g_const_API_Message["100036"]);
            }
            for (var k in Product_Detail.SkuKillResponse.events) {
                var innerBuy = Product_Detail.SkuKillResponse.events[k];
                if (innerBuy.eventType == g_const_Act_Event_Type.Insourced) {
                    var innerBuyInfo = "<span class=\"num_tip\"><i>注意：员工每月内购数量为5件  ，同一个商品最多订购两件！</i></span>";
                    $(".number span").append(innerBuyInfo);
                    break;
                }
            }
        }
        else {
            $(".pprice").empty();
            sprice += '<b>¥' + Product_Detail.GetSalePrice() + "</b>";
            if (Product_Detail.api_response.priceLabel != "") {
                $(Product_Detail.api_response.priceLabel.split(',')).each(function () {
                    sprice += '<font>' + this + '</font>';
                });
            }
            sprice += '<em>¥' + Product_Detail.SkuKillResponse.marketPrice + '</em>';
            sprice += '<a class="goShop" style="cursor:pointer" href="/IndexMain.html?u=SearchList&sellername=' + Product_Detail.api_response.sellerCompanyName + '&keyword=' + encodeURI(Product_Detail.api_response.smallSellerCode) + "&t=" + Math.random() + '"  target="_blank" >进入店铺</a>';
            $(".price").append(sprice);
            $(".option .curr").attr("class", "");
            Product_Detail.ShowPropertyError(g_const_API_Message["100036"]);
            //$(".size").empty();
            //$(".size").append("请选择：");
            // ShowMesaage("对不起,您选择的商品无货,请您重新选择.");
        }
    },
    /*选中的SKU*/
    SelectSku: {},
    /*读取权威标志*/LoadAuthorityLogo: function (msg) {
        $("#pAuthorityLogo").empty();
        var html = "";
        for (var i = 0; i < msg.authorityLogo.length; i++) {
            var authorityLogo = msg.authorityLogo[i];
            if (msg.authorityLogo[i].logoContent == "正品保障" || msg.authorityLogo[i].logoContent == "海关监督") {
                html += '<a href="/IndexMain.html?u=SellerInfo&pid=' + msg.productCode + '"  target="_blank"><span class="s1" style=\"background: url(' + authorityLogo.logoPic.Trim() + ') no-repeat left top;background-size: 20px auto;\">' + authorityLogo.logoContent.Trim() + '</span></a>';
            }
            else {
                html += '<span class="s1" style=\"background: url(' + authorityLogo.logoPic.Trim() + ') no-repeat left top;background-size: 20px auto;\">' + authorityLogo.logoContent.Trim() + '</span>';
            }
        }
        $("#pAuthorityLogo").append(html);
    },
    /*读取图文详情*/LoadDiscriptPicList: function (msg) {
        $("#productImgContent").empty();
        var html = '';
        for (var i = 0; i < msg.discriptPicList.length; i++) {
            var discriptPicList = msg.discriptPicList[i];
            html += '<img src="' + discriptPicList.picNewUrl + '" style="width:100%" />';
        }
        $("#productImgContent").append(html);
        $("#span_sellerCompanyName").html(msg.sellerCompanyName);
    },
    /*读取规格参数*/LoadPropertyInfoList: function (msg) {
        $("#ulProductPropertyInfo").empty();
        var piLength = msg.propertyInfoList.length;
        var arrPropertyInfo = [];
        // //规格tab
        var html = "<ul>";
        for (var i = 0; i < piLength; i++) {
            var propertyInfoList = msg.propertyInfoList[i];
            html += "<li><b>【" + propertyInfoList.propertykey + "】</b><span>" + propertyInfoList.propertyValue + "</span></li>";
            arrPropertyInfo.push("<i>" + propertyInfoList.propertykey + "：" + propertyInfoList.propertyValue + "</i>");
        }
        html += "</ul>";
        $("#ulProductPropertyInfo").html(html);

        //详情中的三排规格参数
        var tempTopNine = "";
        //tempTopNine += "<p>" + arrPropertyInfo.slice(0, 3).join("") + "</p>"
        //tempTopNine += "<p>" + arrPropertyInfo.slice(3, 6).join("") + "</p>"
        //tempTopNine += "<p>" + arrPropertyInfo.slice(6, 9).join("") + "</p>"
        $("#topNinePropertyInfo").prepend(tempTopNine);
    },
    /*根据选中的样式查找SKU信息*/
    FindSku: function (style) {
        var skuList = Product_Detail.api_response.skuList;
        for (var i = 0; i < skuList.length; i++) {
            var sku = skuList[i];
            if (sku.keyValue == style) {
                return sku;
            }
        }
        return null;
    },
    tostIsCall: function () {
        $("#mask").show();
        $(".ftel").show();
    },
    exitCall: function () {
        setTimeout(function () {
            $("#mask").hide();
            $(".ftel").hide();
        }, 100);
    },
    Load_Product: function () {
        PageUrlConfig.SetUrl();
        window.location.href = g_const_PageURL.Cart + "?t=" + Math.random();
    },
    ShowPropertyError: function (message) {
        $("#divProductProperty").html(message);
        $("#div_productinfo").attr("class", "cuo");
    }
};
function pageSelect(page_id, jq) {
    _pageNo = page_id;
    reviewList.InitData();
}
var _pageNo = 0;
var _pageSize = "20";

var reviewList = {
    api_target: "com_cmall_familyhas_api_ApiGetProductCommentListCf",
    api_input: { "screenWidth": "0", "productCode": "", "gradeType": "全部", "paging": { "limit": "10", "offset": "0" }, "version": "" },
    PageNum: 0,
    //最大页数
    MaxNum: 0,
    reviewType: {
        all: "全部",
        good: "好评",
        middle: "中评",
        bad: "差评",
        pic: "有图"
    },
    reviewNoMessage: {
        all: "暂无评价",
        good: "暂无好评",
        middle: "暂无中评",
        bad: "暂无差评",
        pic: "暂无评价"
    },
    NoMessage: "",
    InitData: function () {
        var currentType = $("#gradeType input[type='radio']:checked").parent().attr("gradeType");
        reviewList.api_input.gradeType = reviewList.reviewType[currentType];
        reviewList.NoMessage = reviewList.reviewNoMessage[currentType];
        reviewList.api_input.paging.offset = _pageNo;
        reviewList.api_input.productCode = GetQueryString("pid");

        var s_api_input = JSON.stringify(reviewList.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": reviewList.api_target };
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
                reviewList.LoadResult(msg);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    LoadResult: function (msg) {
        console.log(msg);
        reviewList.LoadCount(msg);
        $("#gradeType").show();
        if (msg.paged.total > 0) {
            FormatTB(msg.paged.total, msg.paged.count, _pageNo, pageSelect, 0);
            reviewList.MaxNum = parseInt((msg.paged.total + 10 - 1) / 10);
            $("#reviewNo").hide();
            $("#reviewList").empty();
            reviewList.LoadReview(msg);
            $("#reviewList").show();
            $("#reviewPage").show();
            $(".com_imgs li").on("click", function () {
                $(".com_imgs b").css({ "display": "none" });
                $(this).addClass("act").siblings().removeClass("act");
                $(this).find("b").css({ "display": "inline" });
                $(this).parent().parent().find("div[class='img2big']").show().find("img").attr("src", $(this).find("img").attr("big"));
            });
            $(".img_delete2").on("click", function () {
                $(this).parent().hide();
            });
            $(".img2big img").on("click", function () {
                $(this).parent().hide();
            });
        }
        else {
            $("#noMessage").html(reviewList.NoMessage);
            $("#reviewNo").show();
            $("#reviewList").hide();
            $("#reviewPage").hide();
        }
    },
    LoadCount: function (msg) {
        $("#reviewCount").html("（" + msg.commentSumCounts + "）");
        $("#gradeType li").each(function () {
            var self = $(this);
            var type = self.attr("gradeType");
            var typeText = reviewList.reviewType[type];
            var label = $(this).find("label");
            switch (type) {
                case "all": //全部数量
                    label.html(typeText + "(" + msg.commentSumCounts + ")");
                    break;
                case "good"://好评数量
                    label.html(typeText + "(" + (msg.highPraiseCounts > 999 ? "999+" : msg.highPraiseCounts) + ")");
                    break;
                case "middle"://中评数量
                    label.html(typeText + "(" + (msg.commonPraiseCounts > 999 ? "999+" : msg.commonPraiseCounts) + ")");
                    break;
                case "bad"://差评数量
                    label.html(typeText + "(" + (msg.lowPraiseCounts > 999 ? "999+" : msg.lowPraiseCounts) + ")");
                    break;
                case "pic": //有图数量
                    label.html(typeText + "(" + (msg.pictureCounts > 999 ? "999+" : msg.pictureCounts) + ")");
                    break;
                default:
                    label.html(typeText + "(0)");
                    break;
            }
        });
    },
    LoadReview: function (msg) {
        var data = msg.productComment;
        var html = "";
        var stpl = $("#tmpReview").html();
        var dataTemp = {};
        $(data).each(function () {
            dataTemp.userFace = this.userFace || g_head_pic;
            var grade = [];
            for (var i = 1; i <= 5 ; i++) {
                if (i <= parseInt(this.grade)) {
                    grade.push('<li class="on"></li>');
                }
                else {
                    grade.push('<li class=""></li>');
                }
            }
            dataTemp.grade = grade.join("");
            dataTemp.userMobile = this.userMobile;
            dataTemp.commentContent = this.commentContent;
            dataTemp.commentTime = this.commentTime;
            dataTemp.attribute = (this.skuColor.length == 0 ? '' : '<p>款式：' + this.skuColor + '</p>') + (this.skuStyle.length == 0 ? '' : '<p>规格：' + this.skuStyle + '</p>');
            var imgs = "";
            $(this.commentPhotoList).each(function () {
                //smallPicInfo 小图
                //bigPicInfo 大图
                //picInfo 原图
                //class="act"
                imgs += '<li>';
                imgs += '<img src="' + (this.picInfo.picUrl || g_comment_pic) + '" big="' + (this.picInfo.picUrl || g_comment_big_pic) + '" alt="">';
                imgs += '<b class="img_arrow" style="display: none;"></b>';
                imgs += '</li>'
            });
            dataTemp.imgs = imgs;
            if (this.replyContent) {
                dataTemp.replyContent = this.replyContent;
                dataTemp.replyTime = this.replyTime;
            }
            html = renderTemplate(stpl, dataTemp);
            $("#reviewList").append(html);

            if (!imgs) {
                $("#bigPic").hide();
            }
            else {
                // $("#imgList li:eq(0)").addClass("act");
                //$("#bigPic").find("img").attr("src", $("#imgList li:eq(0)").find("img").attr("big"));
            }
        });
    },
    InitEvent: function () {
        //点击tap不同评论类型
        $("#gradeType li").on("click", function () {
            $(this).find("input").prop("checked", true).siblings().prop("checked", false);
            reviewList.PageNum = "0";
            reviewList.InitData();
        });
    }
};