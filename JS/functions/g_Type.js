/// <reference path="g_Const.js" />
/// <reference path="../g_header.js" />
/// <reference path="../jquery-2.1.4.js" />
/// <reference path="../ShortURL.js" />
/// <reference path="Payment.js" />

/*类型定义*/

/*购物车*/
var g_type_cart = {
    /*本地购物车精简版*/
    LocalCart: function () {
        var scart = localStorage[g_const_localStorage.Cart];
        if (typeof (scart) != "undefined") {
            return JSON.parse(scart);
        }
        else
            return null;
    },
    /*本地购物车完整版*/
    LocalCartFull: function () {
        var scart = localStorage[g_const_localStorage.CartFull];
        if (typeof (scart) != "undefined") {
            return JSON.parse(scart);
        }
        else
            return null;
    },
    /*云端购物车*/
    CloudCart: [],
    SalesAdv: function () {
        var scart = localStorage[g_const_localStorage.CartSalesAdv];
        if (typeof (scart) != "undefined") {
            return scart;
        }
        else
            return "所有商品全场包邮(西藏、新疆地区除外)";
    }(),
    /*同步购物车*/
    SyncCart: function () {
        if (g_type_cart.CloudCart.length != 0) {
            g_type_cart.Clear();
            for (var i = g_type_cart.CloudCart.length - 1; i >= 0 ; i--) {
                var objcartfull = g_type_cart.CloudCart[i];
                var goodLength = objcartfull.goods.length;
                for (var j = 0; j < goodLength; j++) {
                    var good = objcartfull.goods[j];
                    g_type_cart.ADD(good, false);
                }
            }
            for (var i = g_type_cart.DisableGoods.length - 1; i >= 0 ; i--) {
                g_type_cart.ADD(g_type_cart.DisableGoods[i], false);
            }
        }
    },
    /*清空本地购物车*/
    Clear: function () {
        try {
            localStorage.removeItem(g_const_localStorage.Cart);
            localStorage.removeItem(g_const_localStorage.CartFull);
        }
        catch (e) {
        }
    },
    /*清空本地和云端购物车*/
    ClearWithCloud: function () {
        var objLocalCart = g_type_cart.LocalCart();
        if (objLocalCart != null) {
            for (var i = 0; i < objLocalCart.GoodsInfoForAdd.length; i++) {
                objLocalCart.GoodsInfoForAdd[i].sku_num = 0;
            }
            localStorage[g_const_localStorage.Cart] = JSON.stringify(objLocalCart);
            g_type_cart.Upload();
        }
        g_type_cart.Clear();
    },
    /*单个产品的购物车对象*/
    objCartFull: {
        /*购买数量*/
        sku_num: 0,
        /*地区编号,可不填写，添加购物车不再需要区域编号*/
        area_code: "",
        /*商品编号*/
        product_code: "",
        /*sku编号*/
        sku_code: "",
        /*商品属性,商品规格,商品款式*/
        sku_property: [],
        /*其他相关显示语,比如赠品*/
        otherShow: "",
        /*商品价格*/
        sku_price: 0.0,
        /*促销描述*/
        sales_info: "",
        /*库存*/
        sku_stock: 0,
        /*促销种类*/
        sales_type: "",
        /*商品图片链接*/
        pic_url: "",
        /*每单限购数量*/
        limit_order_num: 0,
        /*库存是否足够*/
        flag_stock: g_const_YesOrNo.NO,
        /*商品活动相关显示语*/
        activitys: [],
        /*是否有效商品*/
        flag_product: g_const_YesOrNo.NO,
        /*商品名称(包含选中的SKU)*/
        sku_name: "",
        /*是否是海外购*/
        flagTheSea: "0",
        //是否选择	
        chooseFlag: g_const_YesOrNo.NO.toString(),
    },
    DisableGoods: [],
    /*加入购物车,isModify为true代表修改,否则为增加*/
    ADD: function (objcartfull, isModify, isUpdateCar) {
        //var objcartfull = g_type_cart.objCartFull;
        /*精简版单个产品购物车对象*/
        var objcart = {
            /*商品数量*/
            "sku_num": objcartfull.sku_num,
            /*地区编号,可不填写，添加购物车不再需要区域编号*/
            //"area_code": objcartfull.area_code,
            /*商品编号*/
            "product_code": objcartfull.product_code,
            /*sku编号*/
            "sku_code": objcartfull.sku_code,
            //是否选择
            chooseFlag: objcartfull.chooseFlag,
        };

        var objcarts = {
            "GoodsInfoForAdd": []
        };
        var scarts = localStorage[g_const_localStorage.Cart];
        if (typeof (scarts) != "undefined" && scarts != "null") {
            objcarts = JSON.parse(scarts);
        }

        var productisexist = false;
        for (var i = 0; i < objcarts.GoodsInfoForAdd.length; i++) {
            var objexistcart = objcarts.GoodsInfoForAdd[i];
            if (typeof (objexistcart) != "undefined") {
                if (objexistcart.product_code == objcart.product_code && objexistcart.sku_code == objcart.sku_code) {
                    if (!isModify) {
                        if (objcarts.GoodsInfoForAdd[i].sku_num + objcart.sku_num > 99) {
                            objcarts.GoodsInfoForAdd[i].sku_num = 99;
                        }
                        else {
                            objcarts.GoodsInfoForAdd[i].sku_num += objcart.sku_num;
                        }
                    }
                    else {
                        if (objcart.sku_num > 99) {
                            objcarts.GoodsInfoForAdd[i].sku_num = 99;
                        }
                        else {
                            objcarts.GoodsInfoForAdd[i].sku_num = objcart.sku_num;
                        }
                    }
                    productisexist = true;
                    break;
                }
            }
            else
                break;
        }
        if (!productisexist) {
            if (objcarts.GoodsInfoForAdd.length >= 99) {
                objcarts.GoodsInfoForAdd.splice(objcarts.GoodsInfoForAdd.length - 1, 1);
            }
            else {
                objcarts.GoodsInfoForAdd.unshift(objcart);
            }
        }

        try {
            localStorage[g_const_localStorage.Cart] = JSON.stringify(objcarts);
        } catch (oException) {
            if (oException.name == 'QuotaExceededError') {

            }
        }
        //向云端同步本地购物车*/
        if (!(isUpdateCar == undefined)) {
            g_type_cart.Upload();
        }
    },
    /*从本地购物车中移除*/
    Remove: function (product_code, sku_code) {

        var objLocalCart = g_type_cart.LocalCart();
        //   var objLocalCartFull = g_type_cart.LocalCartFull();

        if (objLocalCart != null) {

            for (var i = 0; i < objLocalCart.GoodsInfoForAdd.length; i++) {
                var objcart = objLocalCart.GoodsInfoForAdd[i];
                if (objcart.product_code == product_code && objcart.sku_code == sku_code) {
                    objLocalCart.GoodsInfoForAdd.splice(i, 1);
                    //     objLocalCartFull.GoodsInfoForQuery.splice(i, 1);
                    break;
                }
            }
            localStorage[g_const_localStorage.Cart] = JSON.stringify(objLocalCart);
            //  localStorage[g_const_localStorage.CartFull] = JSON.stringify(objLocalCartFull);
        }
    },
    /*从本地购物车和云端中移除*/
    RemoveWithCloud: function (product_code, sku_code) {
        var objLocalCart = g_type_cart.LocalCart();
        // var objLocalCartFull = g_type_cart.LocalCartFull();
        if (objLocalCart != null) {

            for (var i = 0; i < objLocalCart.GoodsInfoForAdd.length; i++) {
                var objcart = objLocalCart.GoodsInfoForAdd[i];
                if (objcart.product_code == product_code && objcart.sku_code == sku_code) {
                    objLocalCart.GoodsInfoForAdd[i].sku_num = 0;
                    //   objLocalCartFull.GoodsInfoForQuery[i].sku_num = 0;
                    break;
                }
            }
        }
        localStorage[g_const_localStorage.Cart] = JSON.stringify(objLocalCart);
        //   localStorage[g_const_localStorage.CartFull] = JSON.stringify(objLocalCartFull);
        g_type_cart.Upload();
        g_type_cart.Remove(product_code, sku_code);
    },
    /*从本地购物车和云端中批量移除,arrobjproduct格式：[[product_code, sku_code],[product_code, sku_code]]*/
    BatchRemoveWithCloud: function (arrobjproduct, callback) {
        var objLocalCart = g_type_cart.LocalCart();
        if (objLocalCart != null) {

            for (var i = 0; i < objLocalCart.GoodsInfoForAdd.length; i++) {
                var objcart = objLocalCart.GoodsInfoForAdd[i];
                for (var j = 0; j < arrobjproduct.length; j++) {
                    var product_code = arrobjproduct[j][0];
                    var sku_code = arrobjproduct[j][1];
                    if (objcart.product_code == product_code && objcart.sku_code == sku_code) {
                        objLocalCart.GoodsInfoForAdd[i].sku_num = 0;
                        break;
                    }
                }
            }
        }
        localStorage[g_const_localStorage.Cart] = JSON.stringify(objLocalCart);
        g_type_cart.Upload(callback);
        for (var k = 0; k < arrobjproduct.length; k++) {
            var product_code = arrobjproduct[k][0];
            var sku_code = arrobjproduct[k][1];
            g_type_cart.Remove(product_code, sku_code);
        }
    },
    api_target: "com_cmall_familyhas_api_APiShopCartForCache",
    /*输入参数*/
    api_input: { "goodsList": [], "buyer_code": "", "version": 1.0, "isPurchase": 1, "channelId": g_const_ChannelID },
    /*接口响应对象*/
    api_response: {},
    /*从云端下载购物车*/
    DownLoad: function (callback) {
        g_type_cart.api_input.goodsList = [];
        g_type_cart.SendToCloud(callback);
    },
    /*向云端同步本地购物车*/
    Upload: function (callback, clearcar) {
        
        if (g_type_cart.LocalCart() == null) {
            g_type_cart.api_input.goodsList = [];
        }
        else if (!(clearcar == undefined)) {
            /*登录后，清空本地购物车*/
            g_type_cart.api_input.goodsList = [];
        }
        else {
            g_type_cart.api_input.goodsList = g_type_cart.LocalCart().GoodsInfoForAdd;
        }
        g_type_cart.SendToCloud(callback);
    },
    /*向云端提交数据*/
    SendToCloud: function (callback) {
        var s_api_input = JSON.stringify(g_type_cart.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": g_type_cart.api_target, "api_token": g_const_api_token.Wanted };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {

            g_type_cart.api_response = msg;
            if (msg.resultCode == g_const_Success_Code) {
                g_type_cart.CloudCart = msg.shoppingCartList;
                for (var i = 0; i < msg.disableGoods.length; i++) {
                    g_type_cart.DisableGoods.push(msg.disableGoods[i]);
                }
                g_type_cart.SyncCart();
                g_type_cart.SalesAdv = msg.salesAdv;
                IndexCart.Init();
            }
            else {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    localStorage[g_const_localStorage.BackURL] = "cart.html";
                    //ShowMesaage(g_const_API_Message["100001"]);
                    setTimeout("window.location.replace(\"" + g_const_PageURL.Login + "?t=" + Math.random() + "\");", 2000);
                    return;
                }
                ShowMesaage(msg.resultMessage);
            }
            if (typeof (callback) == "function")
                callback(msg);
        });

        request.fail(function (jqXHR, textStatus) {

            ShowMesaage(g_const_API_Message["100002"]);
        });
    },

    /*本地购物车完整版*/
    LocalCompleteCart: function () {
        var scart = localStorage[g_const_localStorage.CompleteCart];
        if (typeof (scart) != "undefined") {
            return JSON.parse(scart);
        }
        else
            return null;
    },
    /*本地购物车完整版*/
    AddCompleteCart: function (objcarts) {
        localStorage[g_const_localStorage.CompleteCart] = JSON.stringify(objcarts);
    },
}
/*我的产品浏览历史*/
var g_type_history = {
    /*本地产品浏览历史*/
    LocalHistory: function () {
        var s = localStorage[g_const_localStorage.History];
        if (typeof (s) != "undefined") {
            return JSON.parse(s);
        }
        else
            return null;
    }(),
    /*历史对象*/
    ObjHistory: {
        /*产品编号*/
        "product_code": "",
        /*产品图形*/
        "picture": "",
        /*产品名称*/
        "pname": "",
        /*产品售价*/
        "SalePrice": "",
        /*产品市场价*/
        "marketPrice": "",
        /*产品月销售量*/
        "saleNum": ""
    },
    /*添加历史记录*/
    ADD: function (objhistory) {
        var objhistorys = {
            "PDHistory": []
        };
        if (g_type_history.LocalHistory != null)
            objhistorys = g_type_history.LocalHistory;
        var productisexist = false;

        for (var i = 0; i < objhistorys.PDHistory.length; i++) {
            var objexistproduct = objhistorys.PDHistory[i];
            if (typeof (objexistproduct) != "undefined") {
                if (objexistproduct.product_code == objhistory.product_code) {
                    objhistorys.PDHistory.splice(i, 1);
                    objhistorys.PDHistory.unshift(objhistory);
                    productisexist = true;
                    break;
                }
            }
            else
                break;
        }

        if (!productisexist) {
            if (objhistorys.PDHistory.length >= g_const_MaxHistoryCount) {
                objhistorys.PDHistory.splice(objhistorys.PDHistory.length - 1, 1);
                objhistorys.PDHistory.unshift(objhistory);
            }
            else {
                objhistorys.PDHistory.unshift(objhistory);

            }
        }
        localStorage[g_const_localStorage.History] = JSON.stringify(objhistorys);
    },
    /*清空*/
    Clear: function () {
        localStorage.removeItem(g_const_localStorage.History);
    }
}

var Collection = {
    api_target: "com_cmall_familyhas_api_APiCollectionProduct",
    api_input: { "operateType": "", "productCode": [] },
    Add: function (pidlist, callback, str_callback) {
        Collection.api_input.operateType = "1";
        Collection.api_input.productCode = pidlist;
        var s_api_input = JSON.stringify(this.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": this.api_target, "api_token": "1" };
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
                if (typeof (callback) == "function")
                    callback();
                ShowMesaage(g_const_API_Message["100003"]);
            }
            else {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    //localStorage[g_const_localStorage.BackURL] = g_const_PageURL.Product_Detail + "?pid=" + Product_Detail.api_input.productCode;
                    //PageUrlConfig.SetUrl(localStorage[g_const_localStorage.BackURL]);
                    PageUrlConfig.SetReturnGoto(g_const_PageURL.Login, "ProductDetail", "pid=" + Product_Detail.api_input.productCode);
                    //Message.ShowToPage(g_const_API_Message["100001"], g_const_PageURL.Login, 2000, str_callback);
                    if (str_callback != "") {
                        Message.ShowToPage("", g_const_PageURL.Login + "?t=" + Math.random(), 500, str_callback);
                    }
                    else {
                        window.location.replace(g_const_PageURL.Login + "?t=" + Math.random());
                    }
                    return;
                }

                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Delete: function (pidlist, callback, str_callback) {
        Collection.api_input.operateType = "0";
        Collection.api_input.productCode = pidlist;
        var s_api_input = JSON.stringify(this.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": this.api_target, "api_token": "1" };
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
                if (typeof (callback) == "function")
                    callback();

                ShowMesaage(g_const_API_Message["100004"]);
            }
            else {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    //localStorage[g_const_localStorage.BackURL] = g_const_PageURL.Product_Detail + "?pid=" + Product_Detail.api_input.productCode;
                    //PageUrlConfig.SetUrl(localStorage[g_const_localStorage.BackURL]);
                    PageUrlConfig.SetReturnGoto(g_const_PageURL.Login, "ProductDetail", "pid=" + Product_Detail.api_input.productCode);
                    //Message.ShowToPage("您还没有登陆或者已经超时.", g_const_PageURL.Login, 2000, str_callback);
                    Message.ShowToPage("", g_const_PageURL.Login, 2000, str_callback);
                    return;
                }
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
};

var Message = {
    ShowToPage: function (message, pageurl, time, str_callback, setbackurl) {
        var backurl = window.location.href;
        if (str_callback != "") {
            if (backurl.indexOf("?") != -1) {
                backurl += "&callback=" + encodeURIComponent(str_callback);
            }
            else {
                backurl += "callback=" + encodeURIComponent(str_callback);
            }
        }

        if (setbackurl) {
            backurl = setbackurl;
        }
        PageUrlConfig.SetUrl(backurl);

        if (message != "") {
            ShowMesaage(message);
        }
        setTimeout("window.location.replace(\"" + pageurl + "\");", time);
    },
    //加载层（消息，显示控件）
    ShowLoading: function (message, divid) {
        $("#" + divid).html('');
        var body = "";
        body += "<div id=\"pageloading\" class=\"wrap-wait\">";
        body += "<div class=\"img\">";
        body += "<img src=\"/img/waiting.gif\" alt=\"\" />";
        body += "</div>";
        body += "<p>" + message + "<br />...</p>";
        body += "</div>";
        body += "<div id=\"mask\" style=\"display:block;\">&nbsp;</div>";

        $("#" + divid).html(body);
    },
    //确认提示层（消息，换行消息，显示控件，确定文字，确定操作，取消文字，取消操作[不传默认关闭层]）
    ShowConfirm: function (message, messageother, divid, yesstr, operateYes, nostr, operateNo) {
        $("#" + divid).html('');
        var body = "";
        body += "<div class=\"fbox ftel\">";
        body += "<div class=\"sc jxtx\"><span>" + message + "</span>" + messageother + "</div>";
        body += "<div class=\"btns\">";
        body += "<a onclick=\"Message.Operate(" + operateNo + ",'" + divid + "')\">" + nostr + "</a><a class=\"ok\" onclick=\"Message.Operate(" + operateYes + ",'" + divid + "')\">" + yesstr + "</a>";
        body += "</div>";
        body += "</div>";
        body += "<div id=\"mask\" style=\"z-index:20;\">&nbsp;</div>";
        $("#" + divid).html(body);
    },
    //普通提示层（消息，换行消息，显示控件，确定文字，确定操作[不传默认关闭层]）
    ShowAlert: function (message, messageother, divid, yesstr, operateYes) {
        $("#" + divid).html('');
        var body = "";
        body += "<div class=\"fbox ftel\">";
        body += "<div class=\"sc jxtx\"><span>" + message + "</span>" + messageother + "</div>";
        body += "<div class=\"btns\">";
        body += "<a class=\"ok\" onclick=\"Message.Operate(" + operateYes + ",'" + divid + "')\">" + yesstr + "</a>";
        body += "</div>";
        body += "</div>";
        body += "<div id=\"mask\" style=\"z-index:20;\">&nbsp;</div>";
        $("#" + divid).html(body);
    },
    Operate: function (callback, divid) {
        if (typeof (callback) == "function") {
            callback();
        }
        $("#" + divid).html('');
    },
};

//判断是否为微信浏览器
var IsInWeiXin = {
    check: function () {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    },
};
//判断是否为安卓客户端APP浏览器
var IsInAndroidAPP = {
    check: function (window) {
        try {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/hjy-android/i) == 'hjy-android') {
                return true;
            } else {
                return false;
            }
        }
        catch (e) {
            return false;
        }
    },
};

//检测登录
var UserLogin = {
    Check: function (callback) {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=checklogin",
            dataType: "json"
        });
        request.done(function (msg) {
            //登录状态 0 未登录； 1 已登录
            if (msg.resultcode == g_const_Success_Code_IN) {
                UserLogin.LoginStatus = g_const_YesOrNo.YES;
                UserLogin.LoginName = msg.resultmessage;
            }
            else {
                UserLogin.LoginStatus = g_const_YesOrNo.NO;
            }
            if (typeof (callback) == "function")
                callback();
        });

        request.fail(function (jqXHR, textStatus) {
            //ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    LoginStatus: 0,
    LoginName: "",
};
//设定当前页面路径
//localStorage[g_const_localStorage.BackURL] = location.href;

//Session失效，重新登录
var UserRELogin = {
    login: function (callbackURL) {
        localStorage[g_const_localStorage.BackURL] = callbackURL;

        //ShowMesaage(g_const_API_Message["100001"]);
        setTimeout("window.location.replace(\"" + g_const_PageURL.Login + "?t=" + Math.random() + "\");", 500);
    },
};
/*促销系统:活动商品接口*/
var g_type_event_product_list = {
    /*接口地址*/
    api_url: g_Temp_APIUTL,
    /*接口名*/
    api_target: "com_cmall_eventcall_api_APiEventProductInfo",
    /*输入参数*/
    api_input: { "special_code": GetQueryString("pageCode"), "img_Width": window.screen.availWidth, "version": 1.0 },
    /*是否需要token*/
    api_token: g_const_api_token.Unwanted,
    /*接口响应包*/
    api_response: {
        /*专题名称,以ZT开头的编号*/
        specialName: "",
        /*专题头图href*/
        imgTopUrlHref: "",
        /*商品数据*/
        eventProduct: [this.EventProduct],
        /*返回消息*/
        resultMessage: "",
        /*专题尾图href*/
        imgTailUrlHref: "",
        /*关联模板*/
        selectTemplate: "",
        /*系统时间*/
        sysTime: "",
        /*专题编号*/
        specialCode: "",
        /*专题描述*/
        dpecialDescription: "",
        /*专题头图*/
        imgTopUrl: "",
        /*返回标记*/
        resultCode: g_const_Success_Code,
        /*专题尾图*/
        imgTailUrl: ""
    },
    /*商品数据*/
    EventProduct: {
        /*多长时间抢光,如果可卖库存数为0的时间，才会显示多长时间抢完，返回的数字以：秒 为单位*/
        longProduct: 0,
        /*商品编号*/
        productCode: "",
        /*促销库存*/
        salesNum: 0,
        /*商品主图*/
        mainpicUrl: "",
        /*商品名称*/
        skuName: "",
        /*开始时间*/
        beginTime: "",
        /*后台维护商品自动带回的库存数*/
        storeNum: "",
        /*结束时间*/
        endTime: "",
        /*销量值,代表该商品剩余可以卖的库存数，该数字从缓存里面取*/
        salesVolume: 0,
        /*sku编号*/
        skuCode: "",
        /*折扣,这有特价活动的时间该字段不为0，别的活动都为0,*/
        discount: "",
        /*商品位置*/
        seat: 0,
        /*阶梯价类型:4497473400010001为时间(分钟)， 4497473400010002为销量，如果值为空代表是活动的商品，活动商品是没有阶梯价*/
        sortType: g_const_event_product_sortType.Other,
        /*是否为阶梯价:449746250001 是阶梯价， 449746250002不是阶梯价，如果值为空代表是活动的商品，活动商品是没有阶梯价*/
        priceIs: g_const_event_product_priceIs.Unknown,
        /*明细编号*/
        itemCode: ""
    },
    /*读取数据*/
    LoadData: function (callback) {
        var api = g_type_api;
        api.api_url = g_type_event_product_list.api_url;
        api.api_token = g_type_event_product_list.api_token;
        api.api_input = g_type_event_product_list.api_input;
        api.api_target = g_type_event_product_list.api_target;
        api.LoadData(function (msg) {
            g_type_event_product_list.api_response = msg;
            if (typeof (callback) == "function")
                callback(msg);
        }, "");
    }

}
/*促销系统:活动商品商品价格接口*/
var g_type_event_product_price = {
    /*接口地址*/
    api_url: g_Temp_APIUTL,
    /*接口名*/
    api_target: "com_cmall_eventcall_api_APiEventProductPriceInfo",
    /*输入参数*/
    api_input: { "itemCode": "", "version": 1.0 },
    /*是否需要token*/
    api_token: g_const_api_token.Unwanted,
    /*接口响应包*/
    api_response: {},
    /*读取数据*/
    LoadData: function (callback) {
        var api = g_type_api;
        api.api_url = g_type_event_product_price.api_url;
        api.api_token = g_type_event_product_price.api_token;
        api.api_input = g_type_event_product_price.api_input;
        api.api_target = g_type_event_product_price.api_target;
        api.LoadData(function (msg) {
            g_type_event_product_price.api_response = msg;
            if (typeof (callback) == "function")
                callback(msg);
        }, "");
    }
}
var g_type_api = {
    /*接口地址*/
    api_url: g_APIUTL,
    /*接口名*/
    api_target: "",
    /*输入参数*/
    api_input: {},
    //是否异步
    api_async: true,
    /*是否需要token*/
    api_token: g_const_api_token.Unwanted,
    /*接口响应包*/
    api_response: {},
    /*调用接口*/
    LoadData: function (callback, str_callback) {
        if ($("#loadTip")) {
            if (g_type_api.api_target == "com_cmall_familyhas_api_ApiCancelOrderForFamily"
             || g_type_api.api_target == "com_cmall_familyhas_api_ApiForOrderDelete"
             || g_type_api.api_target == "com_cmall_familyhas_api_ApiOrderNumber"
             || g_type_api.api_target == "com_cmall_familyhas_api_ApiOrderList"
             || g_type_api.api_target == "com_cmall_familyhas_api_ApiConfirmReceiveForFamily") {
                $("#loadTip").show();
            }
        }
        
        var s_api_input = JSON.stringify(g_type_api.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": g_type_api.api_target };
        if (g_type_api.api_token == g_const_api_token.Wanted)
            obj_data = { "api_input": s_api_input, "api_target": g_type_api.api_target, "api_token": g_const_api_token.Wanted };

        var request = $.ajax({
            url: g_type_api.api_url,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType,
            async: g_type_api.api_async
        });

        request.done(function (msg) {
            if ($("#loadTip")) {
                $("#loadTip").hide();
            }
            g_type_api.api_response = msg;
            if (msg.resultCode == g_const_Success_Code) {
                if (typeof (callback) == "function")
                    callback(msg);
            }
            else {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    //Message.ShowToPage("您还没有登陆或者已经超时.", g_const_PageURL.Login, 2000, str_callback);
                    //Message.ShowToPage("", g_const_PageURL.Login, 2000, str_callback);
                    Message.ShowToPage("", g_const_PageURL.MainIndex + "?u=" + g_const_PageURL.GetKey(g_const_PageURL.Login), 2000, str_callback);
                    return;
                }
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            if ($("#loadTip")) {
                $("#loadTip").hide();
            }
            ShowMesaage(g_const_API_Message["7001"]);
        });

    }
}

/*下拉刷新*/
var ScrollReload = {
    //增加监听（监听滚动的DIV的ID，显示加载中文字DIV的ID，来源Key【用于更新不同来源页面上次刷新的时间】，滚动的距离[不需要判断距离传0]，回调执行的方法）
    Listen: function (ScrollInDivId, ShowMessDivId, FromKey, length_number, callback) {
        var tagId = ScrollInDivId;
        var pressX = 0, pressY = 0;
        var obj = document.getElementById(tagId);//$(tagId);
        obj.addEventListener('touchmove', function (event) {
            // 如果这个元素的位置内只有一个手指的话
            if (event.targetTouches.length == 1) {
                var touch = event.targetTouches[0];
                var spanX = touch.pageX - pressX;
                var spanY = touch.pageY - pressY;
                var direct = "none";
                if (Math.abs(spanX) > Math.abs(spanY)) {
                    //水平方向
                    if (spanX > 0) {
                        direct = "right";//向右
                        //do right function
                    } else {
                        direct = "left";//向左
                        //do left function
                    }
                } else {
                    //垂直方向
                    if (spanY > 0 && $(window).scrollTop() == 0) {
                        direct = "down";//向下

                        if (spanY > parseInt(length_number)) {
                            $("#" + ShowMessDivId).show();

                            //获取上次刷新时间
                            var proTime = "";
                            FromKey = "LastReloadTime_" + FromKey;
                            if (localStorage[FromKey] == null) {
                                //localStorage.setItem(g_const_localStorage.OrderConfirm, JSON.stringify({ "GoodsInfoForAdd": [{ "sku_num": 2, "area_code": "", "product_code": "120903", "sku_code": "120903" }] }))
                                proTime = getNowFormatDate();
                                localStorage[FromKey] = proTime;
                            }
                            else {
                                proTime = localStorage[FromKey];
                            }

                            //localStorage[FromKey] = JSON.stringify(objhistorys);

                            //显示层内容
                            var showStr = "<div class=\"d_refresh\">"
                                            + "<div class=\"d_refresh_div\">"
                                                + "<div>下拉可以刷新</div>"
                                                + "<div  class=\"d_cfs9\">上次刷新时间：" + proTime + "</div>"
                                            + "</div>"
                                        + "</div>";
                            $("#" + ShowMessDivId).html(showStr);

                            //更新上次刷新时间
                            localStorage[FromKey] = getNowFormatDate();

                            //执行回调
                            ScrollReload.CallbackDown(callback);
                        }
                        else {
                            $("#" + ShowMessDivId).hide();
                        }

                    } else {
                        direct = "up";//向上
                        //do up function

                        //隐藏下拉层
                        $("#" + ShowMessDivId).hide();
                    }
                }
                // 把元素放在手指所在的位置
                touchMove.value = direct + "(" + spanX + ';' + spanY + ")";
            }
        }, false);
        obj.addEventListener('touchstart', function (event) {
            // 如果这个元素的位置内只有一个手指的话
            if (event.targetTouches.length == 1) {
                var touch = event.targetTouches[0];
                // 把元素放在手指所在的位置
                pressX = touch.pageX;
                pressY = touch.pageY;
                touchStart.value = pressX + ';' + pressY;
            }
        }, false);
        obj.addEventListener('touchend', function (event) {
            // 如果这个元素的位置内只有一个手指的话
            if (event.targetTouches.length == 1) {
                //var touch = event.targetTouches[0];
                //// 把元素放在手指所在的位置
                //touchEnd.value=touch.pageX + ';' + touch.pageY;

            }
        }, false);
    },
    //回调下拉方法
    CallbackDown: function (callback) {
        if (typeof (callback) == "function") {
            callback();
        }
    },
};

/*置顶的显示与隐藏*/
var objTop = {
    Start: function (objtop) {
        $(window).on("touchstart", objTop.OnTouchStart);
        $(window).on("touchmove", objTop.OnTouchMove);
        //$(window).on("touchend", objTop.OnTouchEnd);
        objTop.oTop = objtop;
        objTop.oTop.css("display", "none");
        objTop.oTop.on("click", function (e) {
            //$(e.target).css("display", "none");
            objTop.oTop.css("display", "none");
            window.scrollTo(0, 0);
        });
    },
    oTop: {},
    StartY: 0,
    OnTouchStart: function (e) {
        var objthis = e.target;
        objTop.StartY = $(objthis).offset().top;


    },
    OnTouchMove: function (e) {
        var i_body_hegiht = $("body").height();
        var i_scroll_height = $(document).scrollTop();
        var i_window_height = window.screen.availHeight;
        if (i_scroll_height >= i_window_height * 3)
            objTop.oTop.css("display", "block");
        else {
            objTop.oTop.css("display", "none");
        }

    },
    OnTouchEnd: function (e) {
        var i_body_hegiht = $("body").height();
        var i_scroll_height = $(document).scrollTop();
        var i_window_height = window.screen.availHeight;
        if (i_scroll_height >= i_window_height * 3)
            objTop.oTop.css("display", "block");
        else {
            objTop.oTop.css("display", "none");
        }
    },
    End: function () {
        $(window).off("touchstart", objTop.OnTouchStart);
        $(window).off("touchmove", objTop.OnTouchMove);
        //$(window).off("touchend", objTop.OnTouchEnd);
    }
}

//检测登录
var WeiXinLogin = {
    Check: function (callback) {
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
                WeiXinLogin.WeiXinStatus = g_const_YesOrNo.YES;
                WeiXinLogin.WeiXinName = msg.resultmessage;
            }
            else {
                WeiXinLogin.WeiXinStatus = g_const_YesOrNo.NO;
                if (localStorage[g_const_localStorage.Member]) {
                    WeiXinLogin.WeiXinName = (JSON.parse(localStorage[g_const_localStorage.Member]).Member).uid;
                }
            }
            // if (WeiXinLogin.WeiXinName.length == 0) {
            //var pageurl="";
            //if (localStorage.getItem(g_const_localStorage.BackURL).length > 0) {
            //    pageurl = localStorage.getItem(g_const_localStorage.BackURL);
            //}
            //else {
            //    pageurl = "/";
            //}
            //    location = "/Account/OauthLogin.aspx?oauthtype=WeiXin";
            //    return;
            //}
            if (typeof (callback) == "function")
                callback();
        });

        request.fail(function (jqXHR, textStatus) {
            //ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    WeiXinStatus: 0,
    WeiXinName: "",
};

/*Base64编码和解码*/
var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
var Base64 = {

    /** 
     * base64编码 
     * @param {Object} str 
     */
    base64encode: function (str) {
        var out, i, len;
        var c1, c2, c3;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += base64EncodeChars.charAt(c1 >> 2);
                out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += base64EncodeChars.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += base64EncodeChars.charAt(c3 & 0x3F);
        }
        return out;
    },
    /** 
     * base64解码 
     * @param {Object} str 
     */
    base64decode: function (str) {
        var c1, c2, c3, c4;
        var i, len, out;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            /* c1 */
            do {
                c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            }
            while (i < len && c1 == -1);
            if (c1 == -1)
                break;
            /* c2 */
            do {
                c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            }
            while (i < len && c2 == -1);
            if (c2 == -1)
                break;
            out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
            /* c3 */
            do {
                c3 = str.charCodeAt(i++) & 0xff;
                if (c3 == 61)
                    return out;
                c3 = base64DecodeChars[c3];
            }
            while (i < len && c3 == -1);
            if (c3 == -1)
                break;
            out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
            /* c4 */
            do {
                c4 = str.charCodeAt(i++) & 0xff;
                if (c4 == 61)
                    return out;
                c4 = base64DecodeChars[c4];
            }
            while (i < len && c4 == -1);
            if (c4 == -1)
                break;
            out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
        }
        return out;
    },
    /** 
     * utf16转utf8 
     * @param {Object} str 
     */
    utf16to8: function (str) {
        var out, i, len, c;
        out = "";
        len = str.length;
        for (i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if ((c >= 0x0001) && (c <= 0x007F)) {
                out += str.charAt(i);
            }
            else
                if (c > 0x07FF) {
                    out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                    out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                    out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                }
                else {
                    out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                    out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                }
        }
        return out;
    },
    /** 
     * utf8转utf16 
     * @param {Object} str 
     */
    utf8to16: function (str) {
        var out, i, len, c;
        var char2, char3;
        out = "";
        len = str.length;
        i = 0;
        while (i < len) {
            c = str.charCodeAt(i++);
            switch (c >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    // 0xxxxxxx  
                    out += str.charAt(i - 1);
                    break;
                case 12:
                case 13:
                    // 110x xxxx 10xx xxxx  
                    char2 = str.charCodeAt(i++);
                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                    break;
                case 14:
                    // 1110 xxxx10xx xxxx10xx xxxx  
                    char2 = str.charCodeAt(i++);
                    char3 = str.charCodeAt(i++);
                    out += String.fromCharCode(((c & 0x0F) << 12) | ((char2 & 0x3F) << 6) | ((char3 & 0x3F) << 0));
                    break;
            }
        }
        return out;
    },
};

/*微信JSAPI*/
var WX_JSAPI = {
    /*分享标题*/
    title: "",
    /*分享链接*/
    link: "",
    /*分享图标*/
    imgUrl: "",
    /*分享描述*/
    desc: "",
    /*分享类型*/
    type: g_const_wx_share_type.link,
    /*如果type是music或video，则要提供数据链接，默认为空*/
    dataUrl: "",
    /*腾讯对象wx,请先赋值*/
    wx: null,
    IsTest: function () {
        if (GetQueryString("fromtest") == "1")
            return true;
        else
            return false;
    },
    /*JSAPI参数对象*/
    wxparam: {
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: '', // 必填，公众号的唯一标识
        timestamp: 0, // 必填，生成签名的时间戳
        nonceStr: '', // 必填，生成签名的随机串
        signature: '',// 必填，签名，见附录1
        jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    },
    func_CallBack: function () { },
    /*从接口获取参数,参数jsApiList是要调用的接口名,多个逗号分隔*/
    LoadParam: function (jsApiList) {
        WX_JSAPI.jsApiList = jsApiList;
        var obj_data = { action: "wxshare", jsApiList: WX_JSAPI.jsApiList, surl: window.location.href, debug: WX_JSAPI.wxparam.debug };
        var request = $.ajax({
            url: g_INAPIUTL,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode == "0") {
                WX_JSAPI.wxparam.appId = msg.appId;
                WX_JSAPI.wxparam.timestamp = msg.timestamp;
                WX_JSAPI.wxparam.nonceStr = msg.nonceStr;
                WX_JSAPI.wxparam.jsApiList = msg.jsApiList;
                WX_JSAPI.jsApiList = msg.jsApiList;
                WX_JSAPI.wxparam.signature = msg.signature;
                if (WX_JSAPI.IsTest()) {
                    $("#showlog").append("微信JSAPI基础配置接口发送的参数：<br>" + JSON.stringify(WX_JSAPI.wxparam) + "<br>");
                }
                WX_JSAPI.CallWeiXin();
            }
            else {
                if (WX_JSAPI.IsTest()) {
                    $("#showlog").append("微信JSAPI基础配置发生错误：<br>" + msg.resultmessage + "<br>");
                }
                ShowMesaage(msg.resultmessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage("调用接口出错!")
        });
    },
    LoadCardParam: function (cardid, openid, callback) {

        var obj_data = { action: "wxaddcard", wxcardid: cardid, debug: WX_JSAPI.wxparam.debug };
        var request = $.ajax({
            url: g_INAPIUTL,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode == "0") {
                WX_JSAPI.cardList = msg.cardList;
                if (typeof (callback) == "function")
                    callback(msg);
            }
            else {
                ShowMesaage(msg.resultmessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage("调用接口出错!")
        });
    },
    //卡券包
    cardList: [{}],
    /*调用微信接口,参数wx为腾讯wx对象*/
    CallWeiXin: function () {

        WX_JSAPI.wx.config(WX_JSAPI.wxparam);
        WX_JSAPI.wx.ready(WX_JSAPI.WX_Ready);
        WX_JSAPI.wx.error(function (res) {
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            ShowMesaage(JSON.stringify(res));
            //$("#showlog").append(JSON.stringify(res)+"<br>");
        });
    },
    /*jsApiList*/
    jsApiList: g_const_wx_AllShare,
    //微信卡券接口是否已经准备好
    IsCardReady: false,
    /*微信准备好后执行的函数*/
    WX_Ready: function () {
        //$("#showlog").text(JSON.stringify(WX_JSAPI.jsApiList));
        if (typeof (WX_JSAPI.func_CallBack) == "function")
            WX_JSAPI.func_CallBack();
        if (WX_JSAPI.jsApiList[0].toLowerCase().indexOf("share") != -1) {
            WX_JSAPI.WX_ShareReady();
        }
    },
    WX_Card_ID: "pjaSfwzyh75fjPRp1oMWgDnswf5s",
    WX_CardReady: function () {
        //测试环境的p-voTt1p_VGTGdPt0YAoOh6MUiOU 
        WX_JSAPI.LoadCardParam(WX_JSAPI.WX_Card_ID, "", function (msg) {
            if (WX_JSAPI.IsTest()) {
                $("#showlog").append("领取卡券发送的数据：<br>" + JSON.stringify(msg) + "<br>");
            }
            var objcard = {
                cardList: WX_JSAPI.cardList,
                success: function (res) {
                    if (WX_JSAPI.IsTest()) {
                        $("#showlog").append("领取卡券返回的数据：<br>" + JSON.stringify(res.cardList) + "<br>");
                    }
                }

            };
            WX_JSAPI.wx.addCard(objcard);
        });
    },
    WX_ShareReady: function () {
        var objdata = {
            title: WX_JSAPI.desc, // 分享标题
            link: WX_JSAPI.link, // 分享链接
            imgUrl: WX_JSAPI.imgUrl, // 分享图标
            ///*分享描述*/
            //desc: WX_JSAPI.desc,
            ///*分享类型*/
            //type: WX_JSAPI.type,
            ///*如果type是music或video，则要提供数据链接，默认为空*/
            //dataUrl: WX_JSAPI.dataUrl,
            success: function () {
                // 用户确认分享后执行的回调函数
                WX_JSAPI.WX_Success(g_const_wx_jsapi.onMenuShareTimeline);
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                WX_JSAPI.WX_Cancel(g_const_wx_jsapi.onMenuShareTimeline);
            }
        };

        WX_JSAPI.wx.onMenuShareTimeline(objdata);
        objdata = {
            title: WX_JSAPI.title, // 分享标题
            link: WX_JSAPI.link, // 分享链接
            imgUrl: WX_JSAPI.imgUrl, // 分享图标
            /*分享描述*/
            desc: WX_JSAPI.desc,
            /*分享类型*/
            type: WX_JSAPI.type,
            /*如果type是music或video，则要提供数据链接，默认为空*/
            dataUrl: WX_JSAPI.dataUrl,
            success: function () {
                // 用户确认分享后执行的回调函数
                WX_JSAPI.WX_Success(g_const_wx_jsapi.onMenuShareAppMessage);
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                WX_JSAPI.WX_Cancel(g_const_wx_jsapi.onMenuShareAppMessage);
            }
        };
        WX_JSAPI.wx.onMenuShareAppMessage(objdata);
        objdata = {
            title: WX_JSAPI.title, // 分享标题
            link: WX_JSAPI.link, // 分享链接
            imgUrl: WX_JSAPI.imgUrl, // 分享图标
            /*分享描述*/
            desc: WX_JSAPI.desc,
            /*分享类型*/
            type: WX_JSAPI.type,
            /*如果type是music或video，则要提供数据链接，默认为空*/
            dataUrl: WX_JSAPI.dataUrl,
            success: function () {
                // 用户确认分享后执行的回调函数
                WX_JSAPI.WX_Success(g_const_wx_jsapi.onMenuShareQQ);
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                WX_JSAPI.WX_Cancel(g_const_wx_jsapi.onMenuShareQQ);
            }
        };
        WX_JSAPI.wx.onMenuShareQQ(objdata);
        objdata = {
            title: WX_JSAPI.title, // 分享标题
            link: WX_JSAPI.link, // 分享链接
            imgUrl: WX_JSAPI.imgUrl, // 分享图标
            /*分享描述*/
            desc: WX_JSAPI.desc,
            /*分享类型*/
            type: WX_JSAPI.type,
            /*如果type是music或video，则要提供数据链接，默认为空*/
            dataUrl: WX_JSAPI.dataUrl,
            success: function () {
                // 用户确认分享后执行的回调函数
                WX_JSAPI.WX_Success(g_const_wx_jsapi.onMenuShareWeibo);
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                WX_JSAPI.WX_Cancel(g_const_wx_jsapi.onMenuShareWeibo);
            }
        };
        WX_JSAPI.wx.onMenuShareWeibo(objdata);
        objdata = {
            title: WX_JSAPI.title, // 分享标题
            link: WX_JSAPI.link, // 分享链接
            imgUrl: WX_JSAPI.imgUrl, // 分享图标
            /*分享描述*/
            desc: WX_JSAPI.desc,
            /*分享类型*/
            type: WX_JSAPI.type,
            /*如果type是music或video，则要提供数据链接，默认为空*/
            dataUrl: WX_JSAPI.dataUrl,
            success: function () {
                // 用户确认分享后执行的回调函数
                WX_JSAPI.WX_Success(g_const_wx_jsapi.onMenuShareQZone);
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
                WX_JSAPI.WX_Cancel(g_const_wx_jsapi.onMenuShareQZone);
            }
        };
        WX_JSAPI.wx.onMenuShareQZone(objdata);
    },
    /*操作完成时回调的函数*/
    WX_Success: function (wx_jsapi_type) {
        Merchant1.RecordPageAct("wxshare", wx_jsapi_type);
    },
    /*操作取消时回调的函数*/
    WX_Cancel: function (wx_jsapi_type) {
        //ShowMesaage(wx_jsapi_type+"操作取消");
    }
};
var g_type_loginjs = {
    /*登陆会员信息*/
    Member: {
        Member: {
            /*账号绑定类型*/
            accounttype: g_const_accounttype.ICHSY,
            /*来源*/
            from: "",
            /*手机号*/
            phone: "",
            /*三方绑定唯一编号*/
            uid: "",
            /*用户编号*/
            memberCode: ""
        }
    },
    /*登陆成功后要调用的方法数组*/
    calls: [],
    /*登陆成功后要转向的地址*/
    returnurl: "",
    /*登陆会员绑定信息到前台缓存*/
    SetMemberInfo: function () {
        try {
            localStorage[g_const_localStorage.Member] = JSON.stringify(g_type_loginjs.Member);
            return true;
        }
        catch (e) {
            //alert('本地缓存已满')
            localStorage.clear();
            g_type_cart.Upload(g_type_loginjs.AfterCartUpload);
            return false;
        }
    },
    /*执行*/
    Execute: function (str_loginjs) {
        if (str_loginjs != '') {
            // $("body").css("display", "none");
            var loginjs;
            eval('loginjs=' + str_loginjs);
            g_type_loginjs.returnurl = loginjs.returnurl;
            g_type_loginjs.Member.Member = loginjs.Member;
            for (var k in loginjs.calls) {
                var call = loginjs.calls[k];
                eval(call);
            }
            if (loginjs.Member.phone != "")
                g_type_cart.Upload(g_type_loginjs.AfterCartUpload,true);
            else
            g_type_loginjs.AfterCartUpload();
        }
    },
    /*同步购物车完成执行的操作*/
    AfterCartUpload: function (msg) {
        if (g_type_loginjs.SetMemberInfo()) {
            if (g_type_loginjs.returnurl != "") {
                var rurl = g_type_loginjs.returnurl;
                var r = rurl.split("^");
                var shortkey = r[0];
                if (typeof (ShortURL) != "undefined") {
                    for (var k in ShortURL) {
                        var shorturl = ShortURL[k];
                        if (shortkey.Trim() == shorturl.key.Trim()) {
                            rurl = shorturl.value;
                            break;
                        }
                    }
                }
                if (rurl.toLowerCase().indexOf("login") > -1) {
                    window.location.replace("/Index.html");
                }
                else {
                    window.location.replace(rurl);
                }
            }
        }
    }
};

//加载列表
var ServerTime = {
    api_target: "com_cmall_familyhas_api_ApiForGetServerTime",
    api_input: {},
    SysTime: "",
    Load: function (callback) {
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
                ServerTime.SysTime = msg.serverTime;
                if (typeof (callback) == "function")
                    callback(msg);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
};

//加载列表
var Fun = {
    Load: function (callback) {
        if (typeof (callback) == "function")
            callback();
    },
};
//内部接口调用
var g_type_self_api = {
    /*接口地址*/
    api_url: g_INAPIUTL,
    /*接口响应包*/
    api_response: {},
    //是否异步
    api_async: true,
    /*调用接口*/
    LoadData: function (obj_data, callback, str_callback) {

        var request = $.ajax({
            url: g_type_self_api.api_url,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType,
            async: g_type_self_api.api_async
        });

        request.done(function (msg) {
            g_type_self_api.api_response = msg;
            if (msg.resultcode == g_const_Success_Code_IN) {
                if (typeof (callback) == "function")
                    callback(msg);
            }
            else {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    Message.ShowToPage("", g_const_PageURL.Login, 2000, str_callback);
                    return;
                }
                if (msg.resultcode == g_const_Success_Code) {
                    if (typeof (callback) == "function")
                        callback(msg);
                }
                else {
                    if ($("#txtValidCode")) {
                        if (msg.resultcode == g_const_Error_Code.UnValid) {
                            $("#spanValidCode").css("display", "");
                            $("#spanValidCode").addClass("s1");
                            $("#txtValidCode").addClass("curr");
                            $("#spanValidCode").html(msg.resultmessage);
                            $("#txtValidCode").focus();
                        }
                    }
                    else {
                        ShowMesaage(msg.resultmessage);
                    }
                }

            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });

    }
}
var Payment = {
    action: "gotopayment",
    OrderNo: "",
    Paygate: 0,
    senddata: {
        action: "",
        OrderNo: ""
    },
    CallBack: function (payment) { },
    Init: function () {
        if (typeof (localStorage[g_const_localStorage.OrderInfo]) != "undefined") {
            var Order = JSON.parse(localStorage[g_const_localStorage.OrderInfo]);
            Payment.OrderNo = Order.OrderNo;
            Payment.Paygate = Order.Paygate;
        }
        else {
            Payment.OrderNo = GetQueryString("OrderNo");
            var spaygate = GetQueryString("Paygate");
            if (spaygate == "")
                Payment.Paygate = 0;
            else
                Payment.Paygate = parseInt(spaygate, 10);
        }
        Payment.GetPaymentParams();
    },
    //获取支付需要的参数
    GetPaymentParams: function () {
        Payment.senddata.action = Payment.action;
        if (Payment.senddata.OrderNo.trim() == "")
            Payment.senddata.OrderNo = Payment.OrderNo;
        if (Payment.senddata.OrderNo.trim() == "")
            return;
        g_type_self_api.LoadData(Payment.senddata, Payment.AfterGetPaymentParams, "");
    },
    //取得支付需要的数据后执行的操作
    AfterGetPaymentParams: function (msg) {

        var payment = msg;
        if (payment.PageType == g_const_PayPageType.Redirect) {
            window.location.replace(payment.resultmessage);
        }
        else if (payment.PageType == g_const_PayPageType.Capture) {
            var payment1 = JSON.parse(payment.resultmessage);
            if (payment1.resultcode == 0) {
                if (typeof (Payment.CallBack) == "function")
                    Payment.CallBack(payment);
            }
            else {
                alert("支付方式暂时不可用，请稍后重试。");
            }
        }
        else {
            alert("不支持的页面类型.")
        }
    },
    //变更支付方式
    ChangePayment: function (paygate, orderno, callback) {
        var bank = PaymentCollect.GetBank(paygate);
        if (bank != null) {
            var objdata = {
                action: "changepayment",
                OrderNo: orderno,
                paygate: bank.Paygate,
                paygatetypeaccount: bank.paygatetypeaccount,
                paygatetype: bank.paygatetype
            };
            g_type_self_api.LoadData(objdata, callback, "");
        }
        else {
            alert("错误的支付方式.")
        }
    }
}


var InnerBuy = {
    GetList: function (codeList, callback) {
        var innerMemberCode = "";
        if (localStorage[g_const_localStorage.Member]) {
            innerMemberCode = JSON.parse(localStorage[g_const_localStorage.Member]).Member.membercode;
        }
        if (innerMemberCode != "" && codeList!="") {
            var api_input = { "version": 1, "code": codeList, "memberCode": innerMemberCode, "areaCode": "", "sourceCode": "", "isPurchase": 1 };
            var obj_data = { "api_input": JSON.stringify(api_input), "api_target": "com_srnpr_xmasproduct_api_ApiSkuPrice ", "api_token": "" };
            var purl = g_APIUTL;
            var request = $.ajax({
                url: purl,
                cache: false,
                method: g_APIMethod,
                data: obj_data,
                dataType: g_APIResponseDataType
            });

            request.done(function (msg) {
                callback(msg);
            });

            request.fail(function (jqXHR, textStatus) {
                callback();
            });
        }
        else {
            callback();
        }
    }
}

/*上传图片*/
var Upload = {
    /*支持类型*/
    ImgType: [".jpg", ".jpeg", ".png"],
    /*支持类型文字*/
    ImgTypeStr: "JPG、PNG、JPEG",

    /*基于jquery.form.min.js的 上传图片
    FormID：FormID
    FileControlName:file控件ID
    ShowControlID:显示上传图片控件ID
    */
    UpLoadImg: function (FormID, callback) {
        var $form = $("#" + FormID);
        var options = {
            dataType: "json",
            beforeSubmit: function () {
                var file = $form.find("input[type=file]").val();
                if (file.length > 0) {
                    var exName = file.substring(file.lastIndexOf('.'), file.length);
                    var isFind = Upload.ImgType.indexOf(exName);

                    if (isFind == -1) {
                        ShowMesaage("上传图片类型错误，请重新选择。</br>仅支持" + Upload.ImgTypeStr + "格式。");
                        return false;
                    }
                }
                else {
                    return false;
                }
            },
            success: function (result) {
                if (result.resultcode == g_const_Success_Code) {
                    if (typeof callback == "function") {
                        callback(FormID, result.resultmessage);
                    }
                }
                else {
                    ShowMesaage(result.resultmessage);
                }
            },
            error: function (result) {
                ShowMesaage(g_const_API_Message["7001"]);
            }
        };
        $form.ajaxSubmit(options);
    },
};

//手机充值提交网关
var Payment_MobileCHZ = {
    action: "gopaygatepayment_mobileCZ",
    OrderNo: "",
    Paygate: 0,
    senddata: {
        action: "",
        OrderNo: ""
    },
    CallBack: function (payment) { },
    Init: function () {
        if (typeof (localStorage[g_const_localStorage.OrderInfo]) != "undefined") {
            var Order = JSON.parse(localStorage[g_const_localStorage.OrderInfo]);
            Payment_MobileCHZ.OrderNo = Order.OrderNo;
            Payment_MobileCHZ.Paygate = Order.Paygate;
        }
        else {
            Payment_MobileCHZ.OrderNo = GetQueryString("OrderNo");
            var spaygate = GetQueryString("Paygate");
            if (spaygate == "")
                Payment_MobileCHZ.Paygate = 0;
            else
                Payment_MobileCHZ.Paygate = parseInt(spaygate, 10);
        }
        Payment_MobileCHZ.GetPaymentParams();
    },
    //获取支付需要的参数
    GetPaymentParams: function () {
        Payment_MobileCHZ.senddata.action = Payment_MobileCHZ.action;
        if (Payment_MobileCHZ.senddata.OrderNo.trim() == "")
            Payment_MobileCHZ.senddata.OrderNo = Payment_MobileCHZ.OrderNo;
        if (Payment_MobileCHZ.senddata.OrderNo.trim() == "")
            return;
        g_type_self_api.LoadData(Payment_MobileCHZ.senddata, Payment_MobileCHZ.AfterGetPaymentParams, "");
    },
    //取得支付需要的数据后执行的操作
    AfterGetPaymentParams: function (msg) {

        var payment = msg;
        if (payment.PageType == g_const_PayPageType.Redirect) {
            window.location.replace(payment.resultmessage);
        }
        else if (payment.PageType == g_const_PayPageType.Capture) {
            var payment1 = JSON.parse(payment.resultmessage);
            if (payment1.resultcode == 0) {
                if (typeof (Payment_MobileCHZ.CallBack) == "function")
                    Payment_MobileCHZ.CallBack(payment);
            }
            else {
                alert("支付方式暂时不可用，请稍后重试。");
            }
        }
        else {
            alert("不支持的页面类型.")
        }
    },
    //变更支付方式
    ChangePayment: function (paygate, orderno, callback) {
        var bank = PaymentCollect.GetBank(paygate);
        if (bank != null) {
            var objdata = {
                action: "changepayment_mobileCZ",
                OrderNo: orderno,
                paygate: bank.Paygate,
                paygatetypeaccount: bank.paygatetypeaccount,
                paygatetype: bank.paygatetype
            };
            g_type_self_api.LoadData(objdata, callback, "");
        }
        else {
            alert("错误的支付方式.")
        }
    }
}

