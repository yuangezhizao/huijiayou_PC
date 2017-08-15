/// <reference path="../functions/g_Type.js" />
/// <reference path="../functions/g_Const.js" />
/// <reference path="../g_header.js" />
/// <reference path="../jquery-2.1.4.js" />

var _productCode="";

function test_item(n) {
    var menu = document.getElementById("menu");
    var menuli = menu.getElementsByTagName("li");
    for (var i = 0; i < menuli.length; i++) {
        menuli[i].className = "";
        menuli[n].className = "on";
        document.getElementById("tabc" + i).className = "no";
        document.getElementById("tabc" + n).className = "tabc";
    }
}

//var _productinfo = { "productName": "", "sellPrice": "", "productpic": "", "productstylename": "", "productstylevalue": "", "buycount": "" };

$(document).ready(function () {
    if (window.parent && window.parent.location.href != window.location)
        window.parent.location = window.location;
    $(".app-close").on("click", function (e) {
        $(e.target).parent().css("display", "none");
    });
    $("#btnOpenApp1").click(function () {
        PageUrlConfig.SetUrl();
        openApp();
    });
    $("#btnOpenApp2").click(function () {
        PageUrlConfig.SetUrl();
        openApp();
    });
    $("#btnlqfxtq").click(function () {
        location.href = g_const_PageURL.Lqfxtq_Op + "?t=" + Math.random();
    });
});


var Product_Detail = {
    /*秒杀更新sku价格和限购信息*/
    UpdateSkuListBySecKill: function (msg) {
        if (Product_Detail.SkuSecKillLoaded) {
            var skulist = Product_Detail.api_response.skuList;
            var seckillskulist = msg.skus;
            for (var k in skulist) {
                var sku = skulist[k];
                var bfind = false;
                for (var kk in seckillskulist) {
                    var seckillsku = seckillskulist[kk];
                    if (sku.skuCode.Trim() == seckillsku.skuCode.Trim()) {
                        Product_Detail.api_response.skuList[k].sellPrice = seckillsku.sellPrice;
                        Product_Detail.api_response.skuList[k].skuMaxBuy = seckillsku.maxBuy;
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
            Product_Detail.api_response.skuList = skulist;
            if (Product_Detail.api_response.skuList.length == 1) {
                //只有1种样式
                Product_Detail.SelectSku.sellPrice = Product_Detail.api_response.skuList[0].sellPrice;
                Product_Detail.SelectSku.skuMaxBuy = Product_Detail.api_response.skuList[0].skuMaxBuy;
                $(".nprice").empty();
                $(".nprice").append("<em>￥" + Product_Detail.api_response.skuList[0].sellPrice + "</em>");
                $(".pprice").empty();
                $(".pprice").append("<b>￥</b>" + Product_Detail.api_response.skuList[0].sellPrice);
            }
        }
    },
    /*刷新秒杀库存信息*/
    RefreshSecKill: function () {

        if (Product_Detail.GetShowType() == Product_Detail.ShowType.SecKill) {
            var objInterval = window.setInterval(function () { Product_Detail.LoadSecKillInfo() }, 5 * g_const_minutes);
            Product_Detail.IntervalArr.push(objInterval);
        }
    },
    /*Interval*/
    IntervalArr:[],
    /*读取秒杀信息*/
    LoadSecKillInfo: function () {

        //if (Product_Detail.GetShowType() == Product_Detail.ShowType.SecKill||Product_Detail.GetShowType() == Product_Detail.ShowType.Qrcode) {
            Product_Detail.SkuSecKillLoaded = false;
            //UserLogin.Check(function () {
                if (UserLogin.LoginStatus == g_const_YesOrNo.YES)
                    g_type_api.api_token = g_const_api_token.Wanted;
                else
                    g_type_api.api_token = g_const_api_token.Unwanted;                
                g_type_api.api_input = {
                    version: 1.0,
                    /*用逗号分隔,传入活动明细编号IC开头的编号*/
                    code: Product_Detail.api_input.productCode,
                    /*用户编号，除非特别要求下默认情况下请传空*/
                    memberCode: "",
                    /*地址区域编号，用于分仓分库存使用，默认情况下传空*/
                    areaCode: "",
                    /*来源编号,用于分来源显示不同价格，默认情况下传空*/
                    sourceCode: ""
                };
                g_type_api.api_target = "com_srnpr_xmasproduct_api_ApiSkuInfo";
                g_type_api.api_url = g_APIUTL;
                g_type_api.LoadData(Product_Detail.LoadSecKill, "");                
           // });            
        //}        
    },
    /*分享而来时的操作*/
    FromShare: function () {
        var fromshare = GetQueryString("fromshare");
        var smember = localStorage[g_const_localStorage.Member];
        
        var phoneno = decodeURIComponent(GetQueryString("wxPhone"));
        if (phoneno == "")
            phoneno = decodeURIComponent(GetQueryString("phoneno"));
        
        if (fromshare.Trim() == g_const_YesOrNo.YES.toString()) {            
            if (phoneno.length == 11) {
                phoneno=phoneno.substr(0, 3) + "****" + phoneno.substr(7, 4);
            }
            $("#sharephone").text(phoneno);
            $("#bodycontent .top").css("display", "block");
            $("#bodycontent .btn-close").on("click", function (e) {
                $("#bodycontent .top").css("display", "none");
            });
            $("#bodycontent .app").css("display", "none");
        }
        else {
            $("#bodycontent .app").css("display", "block");
        }
    },
    /*设定微信分享按钮*/
    SetWXShare: function () {
        if (IsInWeiXin.check()) {
            var phoneno = "";
            var shareurl = "http://"+window.location.host + window.location.pathname;
            var shareparam = "pid=" + Product_Detail.api_input.productCode;
            shareparam += "&fromshare=" + g_const_YesOrNo.YES.toString();
            shareparam += "&_r=" + Math.random().toString();
            var smember = localStorage[g_const_localStorage.Member];
            var member = null;
            if (typeof (smember) != "undefined") {
                member = JSON.parse(smember);
            }
            if (member != null)
                shareparam += "&wxPhone=" + member.Member.phone;
            WX_JSAPI.wx = wx;
            WX_JSAPI.wxparam.debug = false;
            WX_JSAPI.dataUrl = "";
            WX_JSAPI.desc = Product_Detail.api_response.productName;
            WX_JSAPI.imgUrl = Product_Detail.api_response.mainpicUrl.picNewUrl;
            WX_JSAPI.link = shareurl + "?" + shareparam;
            WX_JSAPI.title = g_const_Share.DefaultTitle;
            WX_JSAPI.type = g_const_wx_share_type.link;
            WX_JSAPI.LoadParam(g_const_wx_AllShare);
        }
    },
    /*扫描购商品跳转*/
    CheckSMG_From: function () {
        if (Product_Detail.GetShowType() == Product_Detail.ShowType.Qrcode) {
            if (GetQueryString("from_smg") == "") {
                localStorage[g_const_localStorage.SMG_ProductID] = Product_Detail.api_input.productCode;
                window.top.location.replace(g_const_PageURL.SMG_Index + "?t=" + Math.random());
            }
        }
    },
    /*初始化*/
    Init: function () {
      //  Product_Detail.CheckSMG_From();
        Product_Detail.FromShare();
        
        $(".fl.jt").on("click", function () {
            //var gobackurl=PageUrlConfig.BackTo(1);
            //while(gobackurl.indexOf("OrderConfirm")>0 || gobackurl.indexOf("Product_Detail")>0){
            //    gobackurl=PageUrlConfig.BackTo(1);
            //}
            window.location.replace(PageUrlConfig.BackTo());
        });
        $(".bottom span").on("click", function () {
            Product_Detail.tostIsCall();
        });
        $("#mainaddtocart").on("click", function (e) {
            if ($("#mainaddtocart").attr("class")!="gray")
                Product_Detail.OpenSKULayer($(e.target).attr("operate"));
        });
        $("#mainbuy").on("click", function (e) {
            if ($("#mainbuy").attr("class") != "gray")
            Product_Detail.OpenSKULayer($(e.target).attr("operate"));
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
       
        $("#mask").css("display", "block");
        $("#pageloading").css("display", "block");
        Product_Detail.GetCartCount();
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
    /*记录浏览历史*/
    AddToHsitory: function () {
        g_type_history.ObjHistory.marketPrice = Product_Detail.api_response.marketPrice.toString();
        g_type_history.ObjHistory.picture = Product_Detail.api_response.mainpicUrl.picNewUrl.Trim();
        g_type_history.ObjHistory.pname = Product_Detail.api_response.productName.Trim();
        g_type_history.ObjHistory.product_code = Product_Detail.api_response.productCode;
        g_type_history.ObjHistory.saleNum = Product_Detail.api_response.saleNum;
        g_type_history.ObjHistory.SalePrice = Product_Detail.GetSalePrice();       
        g_type_history.ADD(g_type_history.ObjHistory);
    },
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
        Qrcode:3
    },
    /*接口名称*/
    api_target: "com_cmall_familyhas_api_ApiGetSkuInfo",
    /*输入参数*/
    api_input: { "picWidth": 0, "productCode": "", "buyerType": "", "version": 1.0 },
    /*用户Token*/
    api_token:"",
    /*接口响应对象*/
    api_response: {},
    /*获取商品详情*/
    GetDetail: function () {
        var s_api_input = JSON.stringify(Product_Detail.api_input);
        if (Product_Detail.IsUseEventAPI())
            Product_Detail.api_target = "com_cmall_familyhas_api_ApiGetEventSkuInfo";
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
            $("#mask").css("display", "none");
            $("#pageloading").css("display", "none");
            Product_Detail.api_response = msg;
            if (msg.resultCode == g_const_Success_Code) {
                if (Product_Detail.IsSoldOut()) {
                    $("#div_productStatus").empty();
                    $("#div_productStatus").append("没货啦,下次早点来哦~");
                    $("#mainaddtocart").attr("class", "gray");
                    $("#mainbuy").attr("class", "gray");
                }
                if (Product_Detail.api_response.productStatus!=g_const_productStatus.Common) {
                    $("#div_productStatus").empty();
                    $("#div_productStatus").append("该商品已下架,下次早点来哦~");
                    $("#addtocart").attr("class", "gray");
                    $("#mainaddtocart").attr("class", "gray");
                }
                Product_Detail.SetWXShare();

                $("#productName")[0].innerHTML = msg.productName.Trim();
                $(".bianh")[0].innerHTML = "商品编号：<span>" + msg.productCode + "</span>";
                $(".num-toal")[0].innerHTML = "<div>月销<span><b>" + msg.saleNum + "</b> 件</span></div><div>返利<span class=\"price\">￥<b>" + msg.disMoney + (UserLogin.LoginStatus == g_const_YesOrNo.YES?"":" 起")+"</b></span></div>";
                $(".sc .bh")[0].innerHTML = msg.productCode;

                //判断此商品是否已收藏
                _productCode = msg.productCode;
                MyCollection_Product.GetList();


                Product_Detail.LoadCollection(msg);
                Product_Detail.Load_pcPicList(msg);
                Product_Detail.LoadPrice(msg);
                Product_Detail.LoadflagCheap(msg);
                Product_Detail.LoadPromotion(msg);
                Product_Detail.LoadProductProperty(msg);
                Product_Detail.LoadAuthorityLogo(msg);
                Product_Detail.LoadDiscriptPicList(msg);
                Product_Detail.LoadPropertyInfoList(msg);
                Product_Detail.AddToHsitory();
                var _callback = GetQueryString("callback");
                if (_callback != "")
                    eval(_callback);
                Product_Detail.LoadSecKillInfo();
                
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
    /*判断是否有库存(售罄)*/
    IsSoldOut: function () {
        var bsoldout=true;
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
            if (skuSecKill!=null) {
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
    /*秒杀价格和库存接口响应对象*/
    SkuKillResponse:null,
    /*解析秒杀商品SKU的价格和库存*/
    LoadSecKill: function (msg) {
        Product_Detail.SkuKillResponse = msg;
        $("#mainseckillbuy").text(msg.buttonText);
        if (!Product_Detail.IsSoldOut()) {
            //var responsestr = JSON.stringify(msg);
            $("#div_productStatus").empty();
            switch (msg.buyStatus) {
                case g_const_buyStatus.YES:
                    $("#mainseckillbuy").attr("class", "star");
                    $("#mainseckillbuy").off("click");
                    $("#mainseckillbuy").on("click", function (e) {
                        if ($(this).attr("class") != "end")
                            Product_Detail.OpenSKULayer($(e.target).attr("operate"));
                    });

                    $("#sku_seckill_button").attr("class", "ch-seckill curr");
                    $("#sku_seckill_button").off("click");
                    $("#sku_seckill_button").on("click", function (e) {
                        if ($(this).attr("class") != "ch-seckill")
                            Product_Detail.OnBuyClick(e);
                    });
                    break;
                default:
                    $("#mainseckillbuy").attr("class", "end");
                    break;
            }
           
            for (var k in Product_Detail.TimeOutArr) {
                window.clearTimeout(Product_Detail.TimeOutArr[k].value);
            }
            Product_Detail.TimeOutArr = [];
            //for (var k in Product_Detail.IntervalArr) {
            //    window.clearInterval(Product_Detail.IntervalArr[k]);
            //}
            //Product_Detail.IntervalArr = [];
            var endTime = Date.Parse(Product_Detail.api_response.sysDateTime).AddSeconds(msg.limitSecond);
            Product_Detail.ShowLeftTimeButton(endTime, msg.buyStatus, $("#mainseckillbuy"));
            Product_Detail.ShowLeftTimeButton(endTime, msg.buyStatus, $("#sku_seckill_button"));
            Product_Detail.SkuSecKillLoaded = true;

            Product_Detail.UpdateSkuListBySecKill(msg);
        }
        else {
            $("#div_productStatus").empty();
            $("#div_productStatus").append("没货啦,下次早点来哦~");
            $("#mainaddtocart").attr("class", "gray");
            $("#mainbuy").attr("class", "gray");
            $("#mainseckillbuy").attr("class", "end");
        }
    },
    /*是否读取完毕秒杀价*/
    SkuSecKillLoaded:false,
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
        var mseconds =  Math.floor(leftmillionseconds / 100);
        

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
                showtext+="后结束,立即购买"
                break;
            case g_const_buyStatus.ActNotStart:
                showtext += "后开始"
                break;
            case g_const_buyStatus.ActIsEnd:
                showtext = "已结束"
                break;
        }
        objbutton.text(showtext);
        if ((days != 0 || hours != 0 || minutes != 0 || seconds != 0 || mseconds != 0) &&1==1){
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
                    if(objbutton.attr("id")=="mainseckillbuy")
                        objbutton.attr("class", "gray");
                    else
                        objbutton.attr("class", "ch-seckill");
                    break;
                case g_const_buyStatus.ActNotStart:
                    showtext = "已开始,立即购买"
                    if (objbutton.attr("id") == "mainseckillbuy")
                        objbutton.attr("class", "");
                    else
                        objbutton.attr("class", "ch-seckill curr");
                    break;
                    break;
                
            }
            objbutton.text(showtext);
        }
    },
    /*TimeOut数组*/
    TimeOutArr:[],
    /*读取收藏信息*/
    LoadCollection: function (msg) {
        if (msg.collectionProduct == g_const_collectionProduct.NO)
            $("#a_Collection").attr("class", "ch01 gray");
        $("#a_Collection").on("click", function (e) {
            Product_Detail.OperateCollection();
        });  
    },
    /*添加或者取消收藏*/
    OperateCollection: function () {
        //保存回跳页面
        localStorage[g_const_localStorage.BackURL] = g_const_PageURL.Product_Detail + "?pid=" + Product_Detail.api_input.productCode;
        PageUrlConfig.SetUrl(localStorage[g_const_localStorage.BackURL]);

        var productCode = ["" + Product_Detail.api_response.productCode + ""];
        var objcollecttion = $("#a_Collection");
        if (objcollecttion.attr("class") == "ch01 gray") {
            //添加收藏                
            Collection.Add(productCode, function () {
                objcollecttion.attr("class", "ch01");
            }, "Product_Detail.OperateCollection()");
        }
        else {
            //取消收藏
            Collection.Delete(productCode, function () {
                objcollecttion.attr("class", "ch01 gray");
            }, "Product_Detail.OperateCollection()");
        }
    },
    /*读取轮播图*/
    Load_pcPicList: function (msg) {
        var objpcPicList = $("#idSlider2");
        var picCount = msg.pcPicList.length;        
        objpcPicList.empty();
        //活动轮播图
        $("#idNum").empty();
        $("#idSlider2").css("width", (picCount * 100) + "%");
        $(".pic-num1").css("width", (picCount * 30) + "px");

        var html = "";
        for (var i = 0; i < picCount; i++) {
            var objpcPic = msg.pcPicList[i];
            html += "<li ><a><img src='" + g_GetPictrue(objpcPic.picNewUrl) + "' /></a></li>";
        }
        objpcPicList.append(html);

       
        var forEach = function (array, callback) {
            for (var i = 0, len = array.length; i < len; i++) { callback.call(this, array[i], i); }
        }
        st = createPicMove("idContainer2", "idSlider2", picCount);	//图片数量更改后需更改此数值
        var nums = [];
        //插入数字
        for (var i = 0, n = st._count - 1; i <= n; i++) {
            var li = document.createElement("li");
            nums[i] = document.getElementById("idNum").appendChild(li);
        }
        //如果只有一幅图则隐藏idNum
        if (picCount <= 1)
            $("#idNum").css("display", "none");
        //设置按钮样式
        st.onStart = function () {
            //forEach(nums, function(o, i){ o.className = ""})
            forEach(nums, function (o, i) { o.className = st.Index == i ? "new-tbl-cell on" : "new-tbl-cell"; })
        }
        // 重新设置浮动
        $("#idSlider2").css("position", "relative");
        st.Run();
        resetScrollEle();
    },
    /*读取价格信息*/LoadPrice: function (msg) {

        var html = '';
        if (msg.vipSpecialActivity == g_const_YesOrNo.YES)
            html += '<em class="nprice"><em>￥</em>' + msg.vipSpecialPrice + '</em>';
        else {
            if (msg.minSellPrice == msg.maxSellPrice)
                html += '<em class="nprice"><em>￥</em>' + msg.minSellPrice + '</em>';
            else
                html += '<em class="nprice"><em>￥</em>' + msg.minSellPrice + "-" + msg.maxSellPrice + '</em>';
        }
        html += '<span><em>￥</em>' + msg.marketPrice;
        if (msg.priceLabel != "")//Product_Detail.GetShowType() == Product_Detail.ShowType.SecKill && msg.vipSecKill==g_const_YesOrNo.YES&&
            html += '<font>'+msg.priceLabel+'</font>';
        html += '</span>';
        $(".price")[0].innerHTML = html;
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

        $("#div_left_time")[0].innerHTML = "剩 " + hourstring + ":" + minutestring + ":" + secondstring;
        if (hours == 0 && minutes == 0 && seconds == 0)
            self.clearInterval(Product_Detail.flagCheapInterval);
    },
    /*读取促销信息*/LoadPromotion: function (msg) {
        $(".sales").empty();
        var html = "";
        var saleshtml = '<div class="lid"><em>#类别#</em><div>#说明#</div></div>';
        var temp = "";
        if (msg.flagIncludeGift == g_const_YesOrNo.YES) {
            temp = saleshtml.replace("#类别#", "赠品");
            temp = temp.replace("#说明#", msg.gift);
            html += temp;
        }
        if (msg.flagCheap == g_const_YesOrNo.YES) {            
            if (Product_Detail.api_response.skuList.length > 0) {
                for (var k in Product_Detail.api_response.skuList[0].activityInfo) {
                    var activity = Product_Detail.api_response.skuList[0].activityInfo[k];
                    temp = saleshtml.replace("#类别#", activity.activityName);
                    temp = temp.replace("#说明#", activity.remark);
                    html += temp;
                }
            }
            else {
                temp = saleshtml.replace("#类别#", "闪购中");
                temp = temp.replace("#说明#", "本时段享超值优惠");
                html += temp;
            }
        }

        temp = "";
        if (msg.priceLabel.Trim() != "" && msg.priceLabel.Trim()!="闪购") {
            var arrpriceLabel = msg.priceLabel.Trim().split(",");
            for (var kkk in arrpriceLabel) {
                temp = saleshtml.replace("#类别#", arrpriceLabel[kkk]);
                temp = temp.replace("#说明#", "&nbsp;");
                html += temp;
            }
        }
        if (msg.otherShow.length >0) {
            var arrotherShow = msg.otherShow;
            for (var kkk in arrotherShow) {
                if (arrotherShow[kkk] != "" && arrotherShow[kkk] != "赠品")
                temp = saleshtml.replace("#类别#", arrotherShow[kkk]);
                temp = temp.replace("#说明#", "&nbsp;");
                html += temp;
            }
        }
        $(".sales").append(html);
        if (html == "") {
            $(".sales").css("display", "none");
        }
    },
    /*弹出SKU层*/
    OpenSKULayer: function (opentype) {
        
        $("#bodycontent").on("touchstart", function (e) {
            e.preventDefault();
           
        });
        $("#bodycontent").on("touchmove", function (e) {
            e.preventDefault();
            
        });
        $("#bodycontent").on("touchend", function (e) {
            e.preventDefault();            
        });
        
        
        var fth = $('.botline').offset().top - 40;
        $('.tabw').animate({ 'height': '100%' }, 300);
        $('#mask').css({ 'display': 'block', 'height': fth + 'px' });
        $('.tabw footer').css('display', 'block');

        

        if (Product_Detail.GetShowType() == Product_Detail.ShowType.SecKill) {
            $("footer .ch-seckill").css("display", "");
            $("footer .btn-buy").css("display", "none");
        }
        else if (Product_Detail.GetShowType() == Product_Detail.ShowType.Qrcode) {
            $("footer .ch-seckill").css("display", "none");
            $("#sku_addtocart").css("display", "none");
            $("#sku_buy").attr("class", "ch-seckill curr");
            $("#sku_buy").css("display", "");            
        }
        else {

            $("footer .ch-seckill").css("display", "none");
            //加入购物车时
            if (opentype == "addtocart") {
                $("#sku_addtocart").text("确定");
                $("#sku_buy").css("display", "none");
                $("#sku_addtocart").css("display", "");
            }
            else if (opentype == "stylechoose") {
                $("#sku_addtocart").text("加入购物车");
                $("#sku_buy").text("立即购买");
                $("#sku_buy").css("display", "");
                $("#sku_addtocart").css("display", "");
            }
            else {
                $("#sku_addtocart").css("display", "none"); //.text("加入购物车");
                $("#sku_buy").css("display", "");
                $("#sku_buy").text("确定");
            }
            //如果是闪购,隐藏加入购物车
            if (Product_Detail.api_response.flagCheap == g_const_YesOrNo.YES) {
                $("#sku_addtocart").css("display", "none");
            }
        }
    },
    /*关闭SKU层*/
    CloseSKULayer: function () {
        $("#bodycontent").off("touchstart");
        $("#bodycontent").off("touchmove");
        $("#bodycontent").off("touchend");

        $('.tabw').css('height', '0');
        $('#mask').css('display', 'none');
        $('.tabw footer').css('display', 'none');
        $('.mainw').css({ 'height': '100%', 'overflow': 'auto' });
        self.setTimeout('$(".bottom").css("display", "");', 100);
    },
    /*取销售价格*/
    GetSalePrice: function () {
        var msg = Product_Detail.api_response;
        if (msg.vipSpecialActivity == g_const_YesOrNo.YES)
            return msg.vipSpecialPrice.toString();
        else {
            if (msg.minSellPrice == msg.maxSellPrice)
                return msg.minSellPrice.toString();
            else
                return msg.minSellPrice.toString() + "-" + msg.maxSellPrice.toString();
        }
    },
    /*读取商品属性信息*/
    LoadProductProperty: function (msg) {
        $(".box.sizes").empty();
        var html = "";
        var temp = '<div class="lid"><span class="fr jt">跳转</span><em>查看：</em>';
        for (var i = 0; i < msg.propertyList.length; i++) {
            temp += msg.propertyList[i].propertyKeyName + " ";
        }
        temp += "</div>";
        if (msg.propertyList.length > 0) {
            html = temp;
            $(".box.sizes").on("click", function () {
                if ($("#mainbuy").attr("class") != "gray")
                    Product_Detail.OpenSKULayer("stylechoose");
            });            
        }
        $(".box.sizes").append(html);
        var tmpl = $("#tpl_sku")[0].innerHTML;
        //_productinfo.productName = msg.productName.Trim();
        //_productinfo.sellPrice = Product_Detail.GetSalePrice();
        //_productinfo.productpic = msg.mainpicUrl.picNewUrl.Trim();
        //for (var i = 0; i < msg.propertyList.length; i++) {
        //    _productinfo.productstylename += msg.propertyList[i].propertyKeyName + ",";
        //}
        var data = {
            "productpic": g_GetPictrue(msg.mainpicUrl.picNewUrl.Trim()),
            "productName": msg.productName.Trim(),
            "sellPrice": Product_Detail.GetSalePrice(),
            "productStyleName": function () {
                var s = "";
                for (var i = 0; i < msg.propertyList.length; i++) {
                    s += "<span>" + msg.propertyList[i].propertyKeyName + "</span>";
                }
                return s;
            }(),
            "productStyleList": function () {
                var html = '';
                for (var i = 0; i < msg.propertyList.length; i++) {
                    //测试for (var k = 0; k < 3; k++) {
                        var propertyList = msg.propertyList[i];
                        html += '<div class="sel">';
                        html += '   <div class="tdiv">' + propertyList.propertyKeyName + '</div>';
                        html += '       <div class="sdiv" data="' + propertyList.propertyKeyCode + '" index="' + i.toString() + '">';
                        for (var j = 0; j < propertyList.propertyValueList.length; j++) {
                            var propertyValueList = propertyList.propertyValueList[j];
                            html += '       <a data="' + propertyValueList.propertyValueCode + '" datatext="' + propertyValueList.propertyValueName.Trim() + '"><b>&nbsp;</b>' + propertyValueList.propertyValueName + '</a>';
                        }
                        //测试html += '<a data="' + (propertyValueList.propertyValueCode+1) + '" datatext="' + propertyValueList.propertyValueName.Trim()+"1" + '"><b>&nbsp;</b>' + propertyValueList.propertyValueName+"1" + '</a>'
                        html += '   </div>';
                        html += '</div>';
                    //}
                }            

                return html;
            }()           
        };
        html = renderTemplate(tmpl, data);
        $("body").append(html);
       

        $('.tabw .btn-close').on("click", function () {
            Product_Detail.CloseSKULayer();
        });

        /*数量减一*/
        $(".btn-minus").on("click", function (e) {
           
            var buycount = $("#buycount").val();
            var icount = parseInt(buycount, 10);
            if (icount == "NaN") {
                icount = 1;
            }
            if (icount <= 1)
                icount = 1;
            else
                icount = icount - 1;
            if (Product_Detail.SelectSku.stockNumSum == 0 || Product_Detail.api_response.maxBuyCount==0)
                icount = 0;
            $("#buycount").attr("value", icount.toString());
        });
        /*数量加一*/
        $(".btn-add").on("click", function (e) {
            var buycount = $("#buycount").val();
            var icount = parseInt(buycount, 10);
            if (icount == "NaN") {
                icount = 1;
            }
            if (Product_Detail.SelectSku.stockNumSum == 0)
                icount = 0;
            if (icount >=99)
                icount = 99;
            else
                icount = icount + 1;
            if (icount > Product_Detail.SelectSku.stockNumSum){
                ShowMesaage("对不起,您不能购买更多了.");
                icount = Product_Detail.SelectSku.stockNumSum;
            }
            if (icount > Product_Detail.SelectSku.skuMaxBuy) {
                ShowMesaage("对不起,您已达到限购数量上限.");
                icount = Product_Detail.SelectSku.skuMaxBuy;
            }
            $("#buycount").attr("value", icount.toString());
        });

        $(".btn-buy").on("click", Product_Detail.OnBuyClick);

        for (var i = 0; i < msg.propertyList.length; i++) {
            var propertyList = msg.propertyList[i];            
            var objgroup = $(".sdiv[data='" + propertyList.propertyKeyCode.Trim() + "']").children("a[class!='nosel']");
            objgroup.on("click", function (e) {
                var objthis = e.target;
                if ($(this).attr("class") == "nosel")
                    return;
                var obj_group = $(this).parent().children("a[class!='nosel']");
                obj_group.attr("class", "");                
                $(this).attr("class", "on");
                Product_Detail.StyleSelect($(this).parent().attr("index"), $(this).parent().attr("data"), $(this).attr("data"), $(this).attr("datatext"));
            });
        }
        if (msg.propertyList.length == 1) {
            Product_Detail.SetStockInfo("");            
        }
        /*如果只有1种sku则隐藏sku选择器*/
        if (msg.skuList.length == 1) {
            $(".pop-c .sel").css("display", "none");
            $(".pop-c .selnum").css("display", "");
            $(".imgr .size").css("display", "none");
            Product_Detail.SelectSku = msg.skuList[0];
            Product_Detail.RefershPrice(Product_Detail.SelectSku.keyValue)
        }
    },
    /*点击购买或者加入购物车时的操作*/
    OnBuyClick:function (e) {
        var objthis = e.target;
        var buycount = 0;
        $(".bottom").css("display", "none");
        var selectstylecount = $(".sdiv .on").length;
        var maxstylecount = Product_Detail.api_response.propertyList.length;
            
        if (Product_Detail.api_response.skuList.length > 1&&selectstylecount != maxstylecount) {
            ShowMesaage("请您选择你要购买的商品样式.");
            return;
        }
        buycount = parseInt($("#buycount").val(), 10);
        if (buycount > Product_Detail.SelectSku.stockNumSum) {
            ShowMesaage("库存不足,请您修改购买数量.");
            return;
        }
        if (buycount > Product_Detail.SelectSku.skuMaxBuy || buycount == 0) {
            ShowMesaage("对不起,您已达到限购数量上限.");
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
        };
            
        var objcartfull = g_type_cart.objCartFull;
        var objcartlist =[];
        objcartfull.sku_num = buycount;
        objcartfull.area_code = "";
        if (Product_Detail.GetShowType() == Product_Detail.ShowType.Normal) {
            objcartfull.product_code = Product_Detail.api_input.productCode;
            objcartfull.sku_code = Product_Detail.SelectSku.skuCode;
            
        }
        else{
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

        var arrpricelabel = Product_Detail.api_response.priceLabel.split(",");
        for (var i in arrpricelabel) {
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
        for (var i in arrstyle) {
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
            g_type_cart.ADD(objcartfull, false,true);                
            localStorage[g_const_localStorage.OrderConfirm] = localStorage[g_const_localStorage.Cart];
            Product_Detail.GetCartCount();
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
            //   localStorage[g_const_localStorage.BackURL] = location.href;
            PageUrlConfig.SetUrl();
            //window.location.href = g_const_PageURL.OrderConfirm + "?t=" + Math.random() + "&showwxpaytitle=1";
            if (IsInWeiXin.check()) {
                var wxUrl = g_const_PageURL.OrderConfirm + "?t=" + Math.random() + "&showwxpaytitle=1";
                WxInfo.GetPayID(wxUrl);
            }
            else {
                window.location.href = g_const_PageURL.OrderConfirm + "?t=" + Math.random() + "&showwxpaytitle=1";
            }
        }
        Product_Detail.CloseSKULayer();  
    },
    /*查询样式信息*/
    FindProperty: function (propertyKeyCode, propertyValueCode) {
        var objp = {propertyKey:"",propertyValue:""};
        for (var i = 0; i < Product_Detail.api_response.propertyList.length; i++) {
            var property = Product_Detail.api_response.propertyList[i];
            if (property.propertyKeyCode == propertyKeyCode) {
                objp.propertyKey = property.propertyKeyName;
                for (var j in property.propertyValueList) {
                    var propertyValue=property.propertyValueList[j];
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
    StyleSelect: function (selectindex, propertyKeyCode, propertyValue, propertyValueName) {
        var sprice = "<b>￥</b>";
        if (selectindex == 0) {
            Product_Detail.ChoosedStyle = "";
            Product_Detail.ChoosedStyleName = "已选择：";
            $(".pprice").empty();
            sprice += Product_Detail.GetSalePrice();
            $(".pprice").append(sprice);
        }
        var stylename = Product_Detail.ChoosedStyleName;
        var style = Product_Detail.ChoosedStyle;
        var arrstyle = style.split("&");
        var maxselectcount = Product_Detail.api_response.propertyList.length;
       
        //if (style.indexOf(propertyKeyCode + "=" + propertyValue) != -1)
        //    return;
        //else
        //{
        //    if(style.indexOf(propertyKeyCode + "=")!=-1){
        //        //把旧的用新的替换
        //        var regex = new RegExp(propertyKeyCode + "=" + "\\d+(&|$)", "ig");
        //        style = style.replace(regex, function (fullMatch, capture) {                    
        //            if (fullMatch.indexOf("&") != -1)
        //                return propertyKeyCode + "=" + propertyValue + "&";
        //            else
        //                return propertyKeyCode + "=" + propertyValue;
        //        });
        //        Product_Detail.RefershPrice(style);
        //    }
        //    else{
        //        if (arrstyle.length < maxselectcount) {
        //            style += propertyKeyCode + "=" + propertyValue + "&";
        //            //stylename += "<span class=\"fred\">" + propertyValueName + "</span>";
        //        }
        //        else if (arrstyle.length == maxselectcount) {
        //            style += propertyKeyCode + "=" + propertyValue;
        //            //stylename += "<span class=\"fred\">" + propertyValueName + "</span>";
        //            Product_Detail.RefershPrice(style);
        //        }
        //    }
        //}
        for (var i = 0; i < maxselectcount; i++) {
            
            if (i > selectindex) {
                //把所选样式下面的样式组设为未选择
                var objgroup = $(".sdiv[index='"+i.toString()+"']").children("a");
                objgroup.attr("class", "");               
            }
        }
        
        var selectstyles = $(".sdiv .on");
        var islength = selectstyles.length;
        style = "";
        stylename = "已选择：";
        productstylevalue = "";
        for (var i = 0; i < islength ; i++) {
            var ss = selectstyles[i];
            if (i != (islength - 1)) {
                style += $(ss).parent().attr("data") + "=" + $(ss).attr("data") + "&";
                
            }
            else {
               
                style += $(ss).parent().attr("data") + "=" + $(ss).attr("data");
                if (i == (maxselectcount - 2)) {
                    //只剩一项未选择
                    if (selectindex == i) {
                        //未选择的是倒数第2个
                        Product_Detail.SetStockInfo(style);
                        
                    }
                }
            }
            stylename += "<span class=\"fred\">" + $(ss).attr("datatext") + "</span>";
            //_productinfo.productstylevalue += $(ss).attr("datatext") + ",";
        }        
        //stylename = function (style) {
        //    var arrstyles = style.split("&");
        //    var s = "已选择：";
        //    for (var i = 0; i < arrstyles.length; i++) {
        //        var style = arrstyles[i];
        //        if (style.indexOf("=") != -1) {
        //            var arrstyle = style.split("=");
        //            var propertyKeyCode = arrstyle[0]
        //            var propertyValueCode = arrstyle[1];
        //            var msg = Product_Detail.api_response;
        //            for (var j = 0; j < msg.propertyList.length; j++) {                        
        //                var propertyList = msg.propertyList[j];
        //                if (propertyList.propertyKeyCode.toString().Trim() == propertyKeyCode.Trim()) {
        //                    for (var k = 0; k < propertyList.propertyValueList.length; k++) {
        //                        var propertyValueList = propertyList.propertyValueList[k];
        //                        if (propertyValueList.propertyValueCode.toString().Trim() == propertyValueCode.Trim()) {
        //                            s += "<span class=\"fred\">" + propertyValueList.propertyValueName.Trim() + "</span>";
        //                            break;
        //                        }
        //                    }
        //                    break;
        //                }
        //            }
        //        }
        //    }
        //    return s;
        //}(style);
        Product_Detail.ChoosedStyle = style;
        //ShowMesaage(style);
        $(".size").empty();        
        $(".size").append(stylename);
       // productstylevalue = stylename 
        if (islength == maxselectcount)
            Product_Detail.RefershPrice(style);

    },
    /*设定默认库存显示*/
    SetStockInfo: function (style) {
        var maxselectcount = Product_Detail.api_response.propertyList.length;
        var lastsyles = $(".sdiv[index='" + (maxselectcount - 1).toString() + "'] a");

        var skuList = Product_Detail.api_response.skuList;

        for (var istylecount = 0; istylecount < lastsyles.length; istylecount++) {
            var laststyle = lastsyles[istylecount];
            var fullstyle = style + "&" + $(laststyle).parent().attr("data") + "=" + $(laststyle).attr("data");
            if (style == "")
                fullstyle = $(laststyle).parent().attr("data") + "=" + $(laststyle).attr("data");
            if (Product_Detail.IsSkuCanSold(fullstyle))
                $(laststyle).attr("class", "");
            else
                $(laststyle).attr("class", "nosel");            
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
        var sprice = "<b>￥</b>";
        //获取对应的sku信息
        var sku = Product_Detail.FindSku(style);
        if (sku != null) {            
            Product_Detail.SelectSku = sku;
            $(".pprice").empty();
            //if (sku.activityInfo.length > 0) {
            //    for (var i = 0; i < sku.activityInfo.length ; i++) {
            //        var objactivityInfo = sku.activityInfo[i];
                        
            //    }
            //}
            sprice += sku.sellPrice.toString();
            $(".pprice").append(sprice);
            $(".bnum.fr span").empty();
            var limitcount = 0;            
            if (sku.skuMaxBuy >= sku.stockNumSum)
                limitcount = sku.stockNumSum;
            else
                limitcount = sku.skuMaxBuy;
            var slimitbuy = limitcount == 99 ? "" : "限购" + limitcount.toString() + "件";
            if (sku.skuMaxBuy == 0 && sku.limitBuyTip.indexOf("已达购买限制数") != -1)
                slimitbuy = sku.limitBuyTip;
            $(".bnum.fr span").append(slimitbuy);
            if(sku.stockNumSum<=0) {
                ShowMesaage("对不起,您选择的商品无货,请您重新选择.");
            }
        }
        else {
            $(".pprice").empty();
            sprice += Product_Detail.GetSalePrice();
            $(".pprice").append(sprice);
            $(".sdiv .on").attr("class", "");

            $(".size").empty();
            $(".size").append("请选择：");
            ShowMesaage(g_const_API_Message["100036"]);
           // ShowMesaage("对不起,您选择的商品无货,请您重新选择.");
        }
    },
    /*选中的SKU*/
    SelectSku:{},
    /*读取权威标志*/LoadAuthorityLogo: function (msg) {
        $(".bz").empty();
        var html = "";        
        for (var i = 0; i < msg.authorityLogo.length; i++) {
            var authorityLogo = msg.authorityLogo[i];
            html += "<span><b style=\"background: url(" + authorityLogo.logoPic.Trim() + ") no-repeat left top;background-size: 100% auto;\">&nbsp;</b>" + authorityLogo.logoContent.Trim() + "</span>";            
            //if (authorityLogo.logoContent.Trim().indexOf("全场包邮") != -1)
            //    html += '<span><b class="by">&nbsp;</b>全场包邮</span>';
            //else if (authorityLogo.logoContent.Trim().indexOf("正品保障") != -1)
            //    html += '<span><b class="zing">&nbsp;</b>正品保障</span>';
            //else if (authorityLogo.logoContent.Trim().indexOf("无理由") != -1)
            //    html += '<span class="sec"><b class="qi">&nbsp;</b>7天无理由退换货</span>';                 
        }
        $(".bz").append(html);
    },
    /*读取图文详情*/LoadDiscriptPicList: function (msg) {
        $("#tabc0").empty();
        var html = '<div class="imgs">';
        for (var i = 0; i < msg.discriptPicList.length; i++) {
            var discriptPicList = msg.discriptPicList[i];
            html += '<img src="' + discriptPicList.picNewUrl + '" style="width:100%" />';                 
        }
        html+='</div>';
        $("#tabc0").append(html);
    },
    /*读取规格参数*/LoadPropertyInfoList: function (msg) {
        $("#tabc1").empty();
        var html = '<div class="param">';
        for (var i = 0; i < msg.propertyInfoList.length; i++) {
            var propertyInfoList = msg.propertyInfoList[i];
            html += '<p><span class="st">【' + propertyInfoList.propertykey + '】</span><span>' + propertyInfoList.propertyValue + '</span></p>';
        }
        html += '</div>';
        $("#tabc1").append(html);
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
};

/*我的商品收藏列表(获取全部，用于判断商品是否已收藏)*/
var _MyCollection_pageNum = 1;
var _Total_MyCollection_pageNum = 1;
var MyCollection_Product = {
    api_target: "com_cmall_familyhas_api_APiGetMyCollectionProduct",
    api_input: { "pageNum": "" },
    GetList: function () {
        MyCollection_Product.api_input.pageNum = _MyCollection_pageNum;
        var s_api_input = JSON.stringify(MyCollection_Product.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": MyCollection_Product.api_target, "api_token": "1" };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            //Message.Operate('', "divAlert");
            if (msg.resultcode) {
                //if (msg.resultcode == g_const_Error_Code.UnLogin) {
                //    //Message.ShowToPage("您还没有登录或者已经超时.", g_const_PageURL.Login, 2000);
                //    Message.ShowToPage("", g_const_PageURL.Login, 2000, "");
                //    return;
                //}
                //if (msg.resultcode != g_const_Success_Code_IN) {
                //    ShowMesaage(msg.resultmessage);
                //    return;
                //}
            }
            if (msg.resultCode == g_const_Success_Code) {
                MyCollection_Product.Load_Data(msg);
            }
            else {
                //ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_Data: function (msg) {
        if (msg.pagination > 0) {
            _Total_MyCollection_pageNum = msg.pagination;
            if (_MyCollection_pageNum <= _Total_MyCollection_pageNum && $("#a_Collection").attr("class") == "ch01 gray") {
                //循环比较
                $.each(msg.collectionProductList, function (i, n) {
                    if (n.productCode == _productCode) {
                        $("#a_Collection").attr("class", "ch01");
                        return;
                    }
                });

                _MyCollection_pageNum += 1;
                //调用下一页数据
                if (_MyCollection_pageNum <= _Total_MyCollection_pageNum && $("#a_Collection").attr("class") == "ch01 gray") {
                    MyCollection_Product.GetList();
                }
            }
        }
    },
};
