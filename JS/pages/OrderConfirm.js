
var isflagTheSea = 0;
var is_exchange = 0;
var is_neigouaddress = 0;
var GlobalObjLabel = null;
var addressList = "";
var OrderParam = {
    //应付金额
    check_pay_money: 0,
    //送货地址ID
    buyer_address_id: "",
    //区编码
    buyer_address_code: "",
    //邮政编码
    buyer_postcode: "",
    //商品列表
    goods: [],
    //收货人电话
    buyer_mobile: "",
    //支付类型
    pay_type: g_pay_Type.Online,
    //详细地址
    buyer_address: "",
    //发票类型
    bill_type: g_const_bill_Type.NotNeed,
    //发票明细
    bill_detail: "明细",
    //发票抬头
    bill_title: "个人",
    //收货人
    buyer_name: "",
    //订单类型
    order_type: g_order_Type.Common,
    //优惠券
    coupon_codes: [],
    //订单编号
    order_code: "",
    //最大暂存款
    max_temporarystore: 0,
    //最大储值金
    max_storegold: 0,
    //最大积分
    max_point: 0,
    //使用暂存款
    use_temporarystore: 0,
    //使用储值金
    use_storegold: 0,
    //使用积分
    use_point: 0,
    //实际应付金额
    real_pay_money: 0,
    //优惠金额
    sub_money: 0,
    //产品编码
    productCodeList: "",
    //产品名称
    productNameList: "",
    //产品价格
    productPriceList: "",
    //产品数量
    productNumberList: "",
    //支付方式
    orderpaygate: 0,
    //网关类型
    paygatetype: 0,
    //接口类型账号的paygate
    paygatetypeaccount: 0,
    //支付接口类型
    orderpayment: 0,
    //订单编号
    ordercode: "",
    //是否需要身份证
    needverifyidnumber: 0,
    //身份证号
    idnumber: "",
    //LD 商品金额
    productMoneyForLD: 0,
}

//多麦--订单需要的商品参数
var duomai_goods_id = "";//商品编号
var duomai_goods_name = "";//商品名称
var duomai_goods_price = "";//商品单价
var duomai_goods_ta = "";//商品数量
var duomai_goods_cate = "";//商品分类编号
var duomai_totalPrice = "";//每个商品实际支付金额
var duomai_SumPrice = "";//商品应付总金额
var duomai_manjianPrice = "";//商品满减金额


$(document).ready(function () {
    UserLogin.Check(SetLoginDiv);
    if (localStorage.getItem(g_const_localStorage.OrderConfirm)) {
        OrderParam.goods = JSON.parse(localStorage.getItem(g_const_localStorage.OrderConfirm)).GoodsInfoForAdd;
    }
    if (OrderParam.goods.length == 0) {
        //var p = "&t=" + Math.random();
        //g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.Index), p);
        window.location.replace(PageUrlConfig.BackTo());
    }

    //if (localStorage.getItem(g_const_localStorage.OrderPrice)) {
    //    _goodsprice = JSON.parse(localStorage.getItem(g_const_localStorage.OrderPrice)).GoodsInfoPrice;
    //}
    //if (localStorage.getItem(g_const_localStorage.CouponCodes)) {
    //    _coupon_codes = JSON.parse(localStorage.getItem(g_const_localStorage.CouponCodes)).coupon_codes;
    //}
    //if (localStorage.getItem(g_const_localStorage.FaPiao)) {
    //    _fapiao = JSON.parse(localStorage.getItem(g_const_localStorage.FaPiao)).BillInfo;
    //}
    //else {
    //    localStorage.setItem(g_const_localStorage.FaPiao, JSON.stringify({ "BillInfo": { "bill_Type": "0", "bill_detail": "明细", "bill_title": "个人" } }));
    //}
    //有待修改
    //_order_type = g_order_Type.Common;
    // UserLogin.Check(SetLoginDiv);
    $("div.cont h2 a").on("click", function () {
        $("#div_address").css("display", "none");
    });
    $("#btn_saveaddress").on("click", function () {
        var idNumber = $("#txtIDno").val();
        if (idNumber != "") {
            var objdata = {
                s: idNumber,
                action: "aesencrypt"
            };
            g_type_self_api.LoadData(objdata, page_addresslist.CheckParamAndSubmit, "");
        }
        else {
            var msg = {
                resultmessage: "",
            }
            page_addresslist.CheckParamAndSubmit(msg);
        }

    });
    $("#btnOrderCreate").click(function () {
        if (OrderParam.buyer_address_id == 0) {
            ShowMesaage(g_const_API_Message["100030"], function () {
                page_addresslist.InitAddress();
                page_addresslist.SetValueToPopLayer();
                $("#div_address").css("display", "");
            });
            return;
        }
        //判断内购地址中的收件人姓名和电话是否填写
        if (is_neigouaddress == 1) {
            if (OrderParam.buyer_name.length == 0) {
                ShowMesaage("请设置内购地址中的收件人姓名", function () {
                    $("#div_neiGouAddress").show();
                });
                return false;
            }
            if (OrderParam.buyer_mobile.length == 0) {
                ShowMesaage("请设置内购地址中的收件人电话", function () {
                    $("#div_neiGouAddress").show();
                });
                return false;
            }
        }
        if (OrderParam.bill_type == g_const_bill_Type.Normal) {
            if (!$("#txtBillTitle").is(":hidden") && $("#txtBillTitle").val() == "") {
                ShowMesaage(g_const_API_Message["100019"]);
                return false;
            }
            else {
                if (!$("#txtBillTitle").is(":hidden")) {
                    OrderParam.bill_title = $("#txtBillTitle").val();
                }
            }
        }
        if (isflagTheSea == 1 && $("input[name=radio]:checked").parent().find("em[name=idNumber]").text().length == 0) {
            if (is_neigouaddress == 1) {
                ShowMesaage("内购商品与海外购商品无法同时下单，请重新选择商品下单");
            }
            else {
                ShowMesaage(g_const_API_Message["7909"], function () {
                    for (var k = 0; k < addressList.length; k++) {
                        var address = addressList[k];
                        if (address.id == $("input[name=radio]:checked").attr("aid"))
                            page_addresslist.selectAddress = address;
                    }
                    page_addresslist.SetValueToPopLayer();
                    $("#div_address").css("display", "");
                });
            }
            return false;
        }
        if (OrderParam.needverifyidnumber == g_const_YesOrNo.YES.toString()) {
            UserIdentity.Check(OrderParam.idnumber);
        }
        else {
            OrderCreate.CreateToJYH();
        }
    });
    //编辑地址
    $("#divAddressLogin").click(function () {
        //保存返回地址
        //PageUrlConfig.SetUrl(g_const_PageURL.MainIndex + "?u=OrderConfirm");
        //localStorage["fromOrderConfirm"] = "1";
        //var p = "&t=" + Math.random();
        //g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.AddressList), p);

        page_addresslist.InitAddress();
        page_addresslist.SetValueToPopLayer();
        $("#div_address").css("display", "");
    });

    //编辑优惠券
    $("#divyhq").click(function () {
        //PageUrlConfig.SetUrl(g_const_PageURL.MainIndex + "?u=OrderConfirm");
        //localStorage["fromOrderConfirm"] = "1";
        //var p = "&t=" + Math.random();
        //g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.MyCoupon), p);

        window.open(g_const_PageURL.MainIndex + "?u=MyCoupon");
    });
    //$("#rd_Coupon").on("click", function () {
    //    if ($("#selCoupon").prop("disabled")) {
    //        $("#selCoupon").prop("disabled", false);
    //    }
    //    else {
    //        $("#selCoupon").val("");
    //        CouponCodes.SetCouponCodes()
    //        $("#selCoupon").prop("disabled", true);
    //    }
    //});
    //兑换优惠券
    $("#btnOpenyhq").click(function () {
        $("#p_yhq").show();
    });
    //兑换优惠券
    $("#btnExchange").click(function () {
        if ($("#txtExchange").val() == "") {
            $("#spanExchange").show();
            return;
        }
        else {
            $("#spanExchange").hide();
        }
        CouponCodeExchange.GetList();
    });
    //后退至商品详情页
    $("#btnBackCart").click(function () {
        if (OrderCreate.OrderIng == 1) {
            return;
        }
        var p = "&t=" + Math.random();
        g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.Cart), p);
    });

    //银联Wap支付
    $("#divlinlianpay").click(function () {
        localStorage["selpaytype"] = "divlinlianpay";
    });
});

function SetLoginDiv() {
    if (UserLogin.LoginStatus == g_const_YesOrNo.YES) {
        Asset.GetPoint();
       // CouponCodes.GetCouponCodes();
        Address_Info.GetList();
    }
    else {
        PageUrlConfig.SetUrl(g_const_PageURL.MainIndex + "?u=OrderConfirm");
        var p = "&t=" + Math.random();
        g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.Login), p);
    }
}
function setPaytype(type) {
    switch (type) {
        case 1:
            OrderParam.pay_type = g_pay_Type.Online;
            break;
        case 0:
            OrderParam.pay_type = g_pay_Type.Getpay;
            break;
    }
}

function setBilltype(type) {

    switch (type) {
        case 1:
            OrderParam.bill_type = g_const_bill_Type.Normal;
            OrderParam.bill_title = "个人";
            OrderParam.bill_detail = $("input[name='radio4']:checked").parent().text();
            break;
        case 0:
            OrderParam.bill_type = g_const_bill_Type.NotNeed;
            OrderParam.bill_detail = "";
            OrderParam.bill_title = "";
            break;
    }
    return false;

}

function setBilltitle(type) {
    switch (type) {
        case 1:
            OrderParam.bill_title = "个人";
            $("#txtBillTitle").hide();
            break;
        case 0:
            OrderParam.bill_title = $("#txtBillTitle").val();
            $("#txtBillTitle").show();
            break;
    }
}

function setBilldetail(detail) {
    OrderParam.bill_detail = detail
}

function CheckPressNum() {
    var keyCode = event.keyCode;
    if ((keyCode >= 48 && keyCode <= 57)) {
        event.returnValue = true;
    } else {
        event.returnValue = false;
    }
}

function SetInputTemporaryStore() {
    if ($("#txt_TemporaryStore").prop("disabled")) {
        $("#txt_TemporaryStore").prop("disabled", false);
        $("#txt_TemporaryStore").val("0");
    }
    else {
        $("#txt_TemporaryStore").prop("disabled", true);
        $("#txt_TemporaryStore").val("0");
        $("#span_TemporaryStore").hide();
    }
    OrderParam.use_temporarystore = 0;
    CheckInputTemporaryStore();
    //SetLimit();
}

function CheckInputTemporaryStore() {
    var can_use = OrderParam.productMoneyForLD - OrderParam.use_storegold - OrderParam.use_point;
    if (OrderParam.max_temporarystore <= can_use) {
        can_use = OrderParam.max_temporarystore;
    }
    if (parseFloat($("#txt_TemporaryStore").val()) > can_use) {
        $("#txt_TemporaryStore").val(can_use);
        OrderParam.use_temporarystore = can_use;
        $("#span_TemporaryStore").html("本次可用最大值￥" + can_use).show();
    } else {
        OrderParam.use_temporarystore = parseFloat($("#txt_TemporaryStore").val());
        //if (OrderParam.use_temporarystore > can_use) {
        //    OrderParam.use_temporarystore = can_use;
        //    $("#txt_TemporaryStore").val(can_use);
        //}
        $("#span_TemporaryStore").hide();
    }
    SetLimit();
    OrderParam.real_pay_money = OrderParam.check_pay_money - OrderParam.use_storegold - OrderParam.use_point - OrderParam.use_temporarystore;
    $("#spsub_money").html("-￥" + parseFloat(OrderParam.sub_money + OrderParam.use_storegold + OrderParam.use_point + OrderParam.use_temporarystore).toFixed(2));
    $("#b_pay_money").html("￥" + parseFloat(OrderParam.real_pay_money).toFixed(2));
}
function SetLimit() {
    var leftTemporary = leftStoreGold = OrderParam.productMoneyForLD - OrderParam.use_storegold - OrderParam.use_temporarystore - OrderParam.use_point;
    if (leftTemporary < OrderParam.max_temporarystore) {
        leftTemporary = OrderParam.productMoneyForLD - OrderParam.use_storegold - OrderParam.use_temporarystore - OrderParam.use_point;
    }
    else {
        leftTemporary = OrderParam.max_temporarystore - OrderParam.use_temporarystore;
    }
    if (leftStoreGold < OrderParam.max_storegold) {
        leftStoreGold = OrderParam.productMoneyForLD - OrderParam.use_storegold - OrderParam.use_temporarystore - OrderParam.use_point;
    }
    else {
        leftStoreGold = OrderParam.max_storegold - OrderParam.use_storegold;
    }
    $("#i_TemporaryStoreCanUse").html("￥" + (leftTemporary <= 0 ? 0 : leftTemporary));
    $("#i_StoreGoldCanUse").html("￥" + (leftStoreGold <= 0 ? 0 : leftStoreGold));
}
function SetInputPoint() {
    if ($("#txt_Point").prop("disabled")) {
        $("#txt_Point").prop("disabled", false);
        $("#txt_Point").val("0");
    }
    else {
        $("#txt_Point").prop("disabled", true);
        $("#txt_Point").val("");
        $("#span_Point").hide();
    }
    OrderParam.use_point = 0;
}
function CheckInputPoint() {
    if (parseFloat($("#txt_Point").val()) > OrderParam.max_point) {
        $("#txt_Point").val(OrderParam.max_point);
        $("#span_Point").show();
    }
    else {
        OrderParam.use_point = parseFloat($("#txt_Point").val());
        if (OrderParam.use_point > OrderParam.productMoneyForLD - OrderParam.use_storegold - OrderParam.use_temporarystore) {
            OrderParam.use_point = OrderParam.productMoneyForLD - OrderParam.use_storegold - OrderParam.use_temporarystore;
            $("#txt_Point").val(OrderParam.use_point);
        }
        OrderParam.real_pay_money = OrderParam.check_pay_money - OrderParam.use_storegold - OrderParam.use_temporarystore - OrderParam.use_point;
        $("#span_Point").hide();
    }
    $("#spsub_money").html("-￥" + parseFloat(OrderParam.sub_money + OrderParam.use_storegold + OrderParam.use_point + OrderParam.use_temporarystore).toFixed(2));
    $("#b_pay_money").html("￥" + parseFloat(OrderParam.real_pay_money).toFixed(2));
}
function SetInputStoreGold() {
    if ($("#txt_StoreGold").prop("disabled")) {
        $("#txt_StoreGold").prop("disabled", false);
        $("#txt_StoreGold").val("0");
    }
    else {
        $("#txt_StoreGold").prop("disabled", true);
        $("#txt_StoreGold").val("0");
        $("#span_StoreGold").hide();
    }
    OrderParam.use_storegold = 0;
    CheckInputStoreGold();
    // SetLimit();
}
function CheckInputStoreGold() {
    var can_use = OrderParam.productMoneyForLD - OrderParam.use_point - OrderParam.use_temporarystore;
    if (OrderParam.max_storegold <= can_use) {
        can_use = OrderParam.max_storegold;
    }
    if (parseFloat($("#txt_StoreGold").val()) > can_use) {
        $("#txt_StoreGold").val(can_use);
        OrderParam.use_storegold = can_use;
        $("#span_StoreGold").html("本次可用最大值￥" + can_use).show();
    }
    else {
        OrderParam.use_storegold = parseFloat($("#txt_StoreGold").val());
        //if (OrderParam.use_storegold > can_use) {
        //    OrderParam.use_storegold = can_use;
        //    $("#txt_StoreGold").val(can_use);
        //}
        $("#span_StoreGold").hide();
    }
    SetLimit();
    OrderParam.real_pay_money = OrderParam.check_pay_money - OrderParam.use_storegold - OrderParam.use_temporarystore - OrderParam.use_point;
    $("#spsub_money").html("-￥" + parseFloat(OrderParam.sub_money + OrderParam.use_storegold + OrderParam.use_point + OrderParam.use_temporarystore).toFixed(2));
    $("#b_pay_money").html("￥" + parseFloat(OrderParam.real_pay_money).toFixed(2));
}

function CancelOrder() {
    //回退到商品详情页
    window.location.replace(PageUrlConfig.BackTo());
}


var OrderPayment = {
    Load: function (msg) {
        var pay_type=msg.pay_type
        if (pay_type.indexOf(g_pay_Type.Getpay) > -1) {
            $("#rd_hdfk").closest("dt").show();
        }

        var paydefaultHtml = "";
        var payotherHtml = "";
        var payClass = "";

        //$.each(PaymentCollect.BankList, function (i, n) {
        //    if (localStorage[g_const_localStorage.OrderPaygate] != null) {
        //        //有缓存取之前选的
        //        if (n.Paygate == localStorage[g_const_localStorage.OrderPaygate]) {
        //            payClass = "class=\"curr\"";
        //            OrderPayment.Set(n.Paygate, n.paygatetype, n.paygatetypeaccount);
        //        }
        //        else {
        //            payClass = "";
        //        }
        //    }
        //    else {
        //        //没有缓存取第一个
        //        if (i == 0) {
        //            payClass = "class=\"curr\"";
        //            OrderPayment.Set(n.Paygate, n.paygatetype, n.paygatetypeaccount);
        //        }
        //        else {
        //            payClass = "";
        //        }
        //    }
        //    if (payClass != "") {
        //        paydefaultHtml += "<a " + payClass + " onclick=\"OrderPayment.Set('" + n.Paygate.toString() + "','" + n.paygatetype.toString() + "','" + n.paygatetypeaccount.toString() + "')\"><i></i><img src=\"/img/bank/bank-" + n.Paygate.toString() + ".jpg\" alt=\"" + n.BankName.toString() + "\"></a>";
        //    }
        //    else {
        //        payotherHtml += "<a " + payClass + " onclick=\"OrderPayment.Set('" + n.Paygate.toString() + "','" + n.paygatetype.toString() + "','" + n.paygatetypeaccount.toString() + "')\"><i></i><img src=\"/img/bank/bank-" + n.Paygate.toString() + ".jpg\" alt=\"" + n.BankName.toString() + "\"></a>";
        //    }
        //});
        paydefaultHtml += "<p id=\"p1\">";
        payotherHtml += "<p id=\"p2\">";

        //判断是否支持上一次的支付方式
        var canuseoldpaytype = false;
        var lastpaytype = localStorage[g_const_localStorage.OrderPaygate] == undefined ? "" : localStorage[g_const_localStorage.OrderPaygate];
        //转换为hjy的代码
        switch (lastpaytype) {
            case "":
                canuseoldpaytype = false;
                break;
            case "76":
                lastpaytype = g_pay_Type.WXpay;
                break;
            case "62":
                lastpaytype = g_pay_Type.YinLianpay;
                break;
            default:
                lastpaytype = g_pay_Type.Alipay;

        }
        $.each(msg.paymentTypeAll, function (iii, nnn) {
            if (nnn == lastpaytype) {
                canuseoldpaytype = true;
            }
        });

        $.each(PaymentCollect.BankList, function (i, n) {
            if (localStorage[g_const_localStorage.OrderPaygate] != null && canuseoldpaytype) {
                //有缓存取之前选的
                if (n.Paygate == localStorage[g_const_localStorage.OrderPaygate]) {
                    payClass = "class=\"curr\"";
                    OrderPayment.Set(n.Paygate, n.paygatetype, n.paygatetypeaccount);
                }
                else {
                    payClass = "";
                }
            }
            else {
                //没有缓存取第一个
                if (i == 0) {
                    payClass = "class=\"curr\"";
                    OrderPayment.Set(n.Paygate, n.paygatetype, n.paygatetypeaccount);
                }
                else {
                    payClass = "";
                }
            }
            if (n.paygatetype == g_const_paygatetype.AlipayWeb) {
                payotherHtml += "<a " + payClass + " onclick=\"OrderPayment.Set('" + n.Paygate.toString() + "','" + n.paygatetype.toString() + "','" + n.paygatetypeaccount.toString() + "')\"><i></i><img src=\"" + cdn_path + "/img/bank/bank-" + n.Paygate.toString() + ".jpg\" alt=\"" + n.BankName.toString() + "\"></a>";
            }
            //银联wap支付
            else if (n.paygatetype == g_const_paygatetype.YinlianpayWap) {
                //判断是否可以显示也能联支付
                $.each(msg.paymentTypeAll, function (iii, nnn) {
                    if (nnn == g_pay_Type.YinLianpay) {
                        paydefaultHtml += "<a " + payClass + " onclick=\"OrderPayment.Set('" + n.Paygate.toString() + "','" + n.paygatetype.toString() + "','" + n.paygatetypeaccount.toString() + "')\"><i></i><img src=\"" + cdn_path + "/img/bank/bank-" + n.Paygate.toString() + ".jpg\" alt=\"" + n.BankName.toString() + "\"></a>";
                    }
                });
            }

            else {

                paydefaultHtml += "<a " + payClass + " onclick=\"OrderPayment.Set('" + n.Paygate.toString() + "','" + n.paygatetype.toString() + "','" + n.paygatetypeaccount.toString() + "')\"><i></i><img src=\"" + cdn_path + "/img/bank/bank-" + n.Paygate.toString() + ".jpg\" alt=\"" + n.BankName.toString() + "\"></a>";
            }
        });
        paydefaultHtml += "</p>";
        payotherHtml += "</p>";
        $("#quan").html(paydefaultHtml + payotherHtml + "<span>更多</span>");
        $('#p1 a').click(function () {
            $('#p2 a').removeClass('curr');
        });
        $('#p2 a').click(function () {
            $('#p1 a').removeClass('curr');
        });
        $('.payment .bd dd a').click(function () {
            $(this).addClass('curr').siblings().removeClass('curr');
        });


        $('.payment .bd dd span').click(function () {
            var cla = $(this).attr('id');
            if (undefined == cla || null == cla || '' == cla) {
                $(this).attr('id', 'curr');
                $(this).html('收起');
                $('.payment .bd dd').css('height', 'auto');
            } else {
                $(this).attr('id', '');
                $(this).html('更多');
                $('.payment .bd dd').css('height', '125px');
            }
        });
    },

    Set: function (orderpaygate, paygatetype, paygatetypeaccount, orderpayment) {
        setPaytype(1);
        localStorage[g_const_localStorage.OrderPaygate] = orderpaygate;
        OrderParam.orderpaygate = orderpaygate;
        OrderParam.paygatetype = 1;
        OrderParam.paygatetypeaccount = paygatetypeaccount;
        OrderParam.orderpayment = paygatetype;
        //switch (orderpaygate) {
        //    case 65:
        //        OrderParam.orderpayment = paygatetype;
        //        break;
        //    case 76:
        //        OrderParam.orderpayment = 3;
        //        break;
        //    default:
        //        OrderParam.orderpayment = 0;
        //        break;
        //}
    },
};

//根据ID获取地址
var Address_Info = {
    api_input: {},
    api_target: "com_cmall_newscenter_beauty_api_GetAddress",
    GetList: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=addresslist",
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultCode == g_const_Success_Code) {
                Address_Info.LoadResult(msg.adress);
            }
            else {

                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
        });
    },
    LoadResult: function (result) {
        //多于3条记录显示“更多”；
        if (result.length > 1) {
            $('.address .bd .more').show();
        }
        else {
            $('.address .bd .more').hide();
        }

        if (result.length > 0) {
            var body = "";
            var body_common = "";
            var body_default = "";
            var body_lastused = "";
            var input_check = "checked";
            addressList = result;
            var addresslist = result;
            page_addresslist.TotalCount = addresslist.length;
            $.each(result, function (i, n) {

                if (n.isdefault == "1") {
                    //if (localStorage[g_const_localStorage.OrderAddress] != null) {
                    //    if (n.id == localStorage[g_const_localStorage.OrderAddress]) {
                    //        body_default += "<li class=\"curr\">";
                    //        input_check = "checked";
                    //        Address_Info.OrderAddress(n.id, n.areaCode, n.street, n.mobile, n.name, n.postcode);
                    //    }
                    //    else {
                    //        body_default += "<li>";
                    //        input_check = "";
                    //    }
                    //}
                    //else {
                    body_default += "<li class=\"curr\">";
                    input_check = "checked";
                    Address_Info.OrderAddress(n.id, n.areaCode, n.street, n.mobile, n.name, n.postcode, n.idNumber);
                    //}
                    body_default += "<label><input type=\"radio\" aid=\"" + n.id + "\" name=\"radio\" value=\"\" " + input_check + " onclick=\"Address_Info.OrderAddress('" + n.id + "','" + n.areaCode + "','" + n.street + "','" + n.mobile + "','" + n.name + "','" + n.postcode + "','" + n.postcode + "','" + n.idNumber + "')\">";
                    body_default += n.provinces + n.street + "<b><i>" + n.name + "</i>收</b>" + n.mobile + "<em name=\"idNumber\">" + (n.idNumber.substr(0, 4) + (n.idNumber.length > 0 ? "**********" : "") + n.idNumber.substr(14)) + "</em></label>";
                    body_default += "<div class=\"ad_ope\" style=\"display:none\"><a operate=\"setdefault\" style=\"cursor:pointer\" aid=\"" + n.id + "\">设置默认</a><a operate=\"modify\" style=\"cursor:pointer\" aid=\"" + n.id + "\">修改</a><a operate=\"delete\" style=\"cursor:pointer\" aid=\"" + n.id + "\">删除</a></div></li>";
                }
                else if (localStorage.getItem(g_const_localStorage.OrderAddress) != null && n.id == localStorage.getItem(g_const_localStorage.OrderAddress)) {
                    Address_Info.OrderAddress(n.id, n.areaCode, n.street, n.mobile, n.name, n.postcode, n.idNumber);
                    body_lastused += "<li class=\"curr\">";
                    body_lastused += "<label><input type=\"radio\" aid=\"" + n.id + "\" name=\"radio\" value=\"\" checked onclick=\"Address_Info.OrderAddress('" + n.id + "','" + n.areaCode + "','" + n.street + "','" + n.mobile + "','" + n.name + "','" + n.postcode + "','" + n.idNumber + "')\">";
                    body_lastused += n.provinces + n.street + "<b><i>" + n.name + "</i>收</b>" + n.mobile + "<em name=\"idNumber\">" + (n.idNumber.substr(0, 4) + (n.idNumber.length > 0 ? "**********" : "") + n.idNumber.substr(14)) + "</em></label>";
                    body_lastused += "<div class=\"ad_ope\" style=\"display:none\"><a operate=\"setdefault\" style=\"cursor:pointer\" aid=\"" + n.id + "\">设置默认</a><a operate=\"modify\" style=\"cursor:pointer\" aid=\"" + n.id + "\">修改</a><a operate=\"delete\" style=\"cursor:pointer\" aid=\"" + n.id + "\">删除</a></div></li>";
                }
                else {
                    body_common += "<li>";
                    body_common += "<label><input type=\"radio\" aid=\"" + n.id + "\" name=\"radio\" value=\"\" onclick=\"Address_Info.OrderAddress('" + n.id + "','" + n.areaCode + "','" + n.street + "','" + n.mobile + "','" + n.name + "','" + n.postcode + "','" + n.idNumber + "')\">";
                    body_common += n.provinces + n.street + "<b><i>" + n.name + "</i>收</b>" + n.mobile + "<em name=\"idNumber\">" + (n.idNumber.substr(0, 4) + (n.idNumber.length > 0 ? "**********" : "") + n.idNumber.substr(14)) + "</em></label>";
                    body_common += "<div class=\"ad_ope\" style=\"display:none\"><a operate=\"setdefault\" style=\"cursor:pointer\" aid=\"" + n.id + "\">设置默认</a><a operate=\"modify\" style=\"cursor:pointer\" aid=\"" + n.id + "\">修改</a><a operate=\"delete\" style=\"cursor:pointer\" aid=\"" + n.id + "\">删除</a></div></li>";
                }
            });

            body = body_default + body_lastused + body_common;
            $("#ulAddressList").html(body);
            //$('.address .bd li').click(function () {

            //    $(this).addClass('curr').siblings().removeClass('curr');
            //    $(this).find("div").show()
            //});
            $('.address .bd .more').unbind();
            $('.address .bd .more').click(function () {
                var cla = $(this).attr('id');
                if (undefined == cla || null == cla || '' == cla) {
                    $(this).attr('id', 'curr');
                    $(this).html('收起');
                    $('.address .bd ul').css('height', 'auto');
                } else {
                    $(this).attr('id', '');
                    $(this).html('更多');

                    var select = $("#ulAddressList").find("input[type=radio]:checked").parent().parent();
                    $("#ulAddressList").prepend($(select).clone());
                    $(select).remove();

                    $('.address .bd li').mouseenter(function () {
                        $(".ad_ope").hide();
                        $(this).addClass('curr').siblings().removeClass('curr');
                        $(this).find("div").show()
                    });
                    $('.address .bd li').mouseleave(function () {
                        $(this).find("div").hide()
                    });
                    $(".address .bd .ad_ope a").on("click", function () {
                        var operate = $(this).attr("operate");
                        var aid = $(this).attr("aid");
                        switch (operate) {
                            case "setdefault":
                                if ($(this).html() == "设置默认") {
                                    g_type_api.api_input = {
                                        address: aid,
                                        version: 1
                                    };
                                    g_type_api.api_target = "com_cmall_newscenter_beauty_api_AddressSelectApi";
                                    g_type_api.api_token = g_const_api_token.Wanted;
                                    g_type_api.LoadData(function (msg) {
                                        ShowMesaage("设置为默认收货地址成功。");
                                        Address_Info.GetList();
                                    }, "");
                                }
                                break;
                            case "modify":
                                for (var k = 0; k < addresslist.length; k++) {
                                    var address = addresslist[k];
                                    if (address.id == aid)
                                        page_addresslist.selectAddress = address;
                                }
                                page_addresslist.SetValueToPopLayer();
                                $("#div_address").css("display", "");
                                break;
                            case "delete":
                                if (window.confirm("确认要删除这条收货地址吗？")) {
                                    g_type_api.api_input = {
                                        address: aid,
                                        version: 1
                                    };
                                    g_type_api.api_target = "com_cmall_newscenter_beauty_api_AddressDeleteApi";
                                    g_type_api.api_token = g_const_api_token.Wanted;
                                    g_type_api.LoadData(function (msg) {
                                        ShowMesaage("删除收货地址成功。");
                                        Address_Info.GetList();
                                    }, "");
                                }
                                break;
                        }
                    });
                    $('.address .bd ul').css('height', '36px');
                }
            });


            $('.address .bd li').mouseenter(function () {
                $(".ad_ope").hide();
                $(this).addClass('curr').siblings().removeClass('curr');
                $(this).find("div").show()
            });
            $('.address .bd li').mouseleave(function () {
                $(this).find("div").hide()
            });
            $(".address .bd .ad_ope a").on("click", function () {
                var operate = $(this).attr("operate");
                var aid = $(this).attr("aid");
                switch (operate) {
                    case "setdefault":
                        if ($(this).html() == "设置默认") {
                            g_type_api.api_input = {
                                address: aid,
                                version: 1
                            };
                            g_type_api.api_target = "com_cmall_newscenter_beauty_api_AddressSelectApi";
                            g_type_api.api_token = g_const_api_token.Wanted;
                            g_type_api.LoadData(function (msg) {
                                ShowMesaage("设置为默认收货地址成功。");
                                Address_Info.GetList();
                            }, "");
                        }
                        break;
                    case "modify":
                        for (var k = 0; k < addresslist.length; k++) {
                            var address = addresslist[k];
                            if (address.id == aid)
                                page_addresslist.selectAddress = address;
                        }
                        page_addresslist.SetValueToPopLayer();
                        $("#div_address").css("display", "");
                        break;
                    case "delete":
                        if (window.confirm("确认要删除这条收货地址吗？")) {
                            g_type_api.api_input = {
                                address: aid,
                                version: 1
                            };
                            g_type_api.api_target = "com_cmall_newscenter_beauty_api_AddressDeleteApi";
                            g_type_api.api_token = g_const_api_token.Wanted;
                            g_type_api.LoadData(function (msg) {
                                ShowMesaage("删除收货地址成功。");
                                Address_Info.GetList();
                            }, "");
                        }
                        break;
                }
            });
            //$("#atcList").show();
            //$("#atcListNull").hide();
        }
        else {
            $("#ulAddressList").html("");
            OrderDetail.OrderConfirm();
            page_addresslist.TotalCount = 0;
            //$("#divAddressLogin").html();
            //$("#atcList").hide();
            //$("#atcListNull").show();
        }
    },
    OrderAddress: function (addressid, areacode, street, mobile, name, postcode, idnumber, state) {

        localStorage[g_const_localStorage.OrderAddress] = addressid;
        OrderParam.buyer_address_id = addressid;
        OrderParam.buyer_address_code = areacode;
        OrderParam.buyer_mobile = mobile;
        OrderParam.buyer_address = street;
        OrderParam.buyer_name = name;
        OrderParam.buyer_postcode = postcode;
        OrderParam.idnumber = idnumber;
        OrderDetail.OrderConfirm();
    },
};
//内购地址
var neiGouAddress = {
    api_input: {},
    api_target: "com_cmall_familyhas_api_ApiNcStaffAddress",
    getList: function () {
        var s_api_input = JSON.stringify(neiGouAddress.api_input);
        var obj_data = {
            "api_input": s_api_input, "api_target": neiGouAddress.api_target, "api_token": "1"
        };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode != g_const_Success_Code) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }
            if (msg.resultCode) {
                if (msg.resultCode == g_const_Success_Code) {
                    neiGouAddress.loadResult(msg.apiFamilyConsigneeAddressSelectListResult);
                }
                else {
                    ShowMesaage(g_const_API_Message["7001"]);
                }
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
            Message.Operate('', "divAlert");
        });
    },
    loadResult: function (list) {
        //多于3条记录显示“更多”；
        if (list.length > 1) {
            $('.address .bd .more').show();
        }
        else {
            $('.address .bd .more').hide();
        }

        if (list.length > 0) {
            var body = "";
            var body_common = "";
            var body_default = "";
            var body_lastused = "";
            var input_check = "checked";
            var addresslist = list;
            $.each(list, function (i, n) {

                if (n.flag_default == "1") {
                    body_default += "<li class=\"curr\" aid=\"" + n.address_id + "\">";
                    input_check = "checked";
                    neiGouAddress.OrderAddress("", n.address_id, n.area_code, n.address, n.mobilephone, n.receive_person, n.postcode, "");
                    body_default += "<label><input type=\"radio\" name=\"radio\" value=\"\" " + input_check + " onclick=\"neiGouAddress.OrderAddress(this,'" + n.address_id + "','" + n.area_code + "','" + n.address + "','" + n.mobilephone + "','" + n.receive_person + "','" + n.postcode + "','')\">";
                    body_default += (n.prov_name || "") + (n.address || "") + "<b name=\"neiBuyerName\"></b><b name=\"neiBuyerPhone\"></b><em name=\"idNumber\"></em></label>";
                    body_default += "<div class=\"ad_ope\" style=\"display:none\"><a name=\"setNeiGou\" onclick=\"neiGouAddress.SetNeiGouInfo(this,'" + n.address_id + "','" + n.area_code + "','" + n.address + "','" + n.mobilephone + "','" + n.receive_person + "','" + n.postcode + "','');\" style=\"cursor:pointer;\" aid=\"" + n.address_id + "\">编辑</a></div></li>";
                }
                else if (localStorage.getItem(g_const_localStorage.OrderAddress) != null && n.address_id == localStorage.getItem(g_const_localStorage.OrderAddress)) {
                    neiGouAddress.OrderAddress("", n.address_id, n.area_code, n.address, n.mobilephone, n.receive_person, n.postcode, "");
                    body_lastused += "<li class=\"curr\" aid=\"" + n.address_id + "\">";
                    body_lastused += "<label><input type=\"radio\" name=\"radio\" value=\"\" checked onclick=\"neiGouAddress.OrderAddress(this,'" + n.address_id + "','" + n.area_code + "','" + n.address + "','" + n.mobilephone + "','" + n.receive_person + "','" + n.postcode + "','')\">";
                    body_lastused += (n.prov_name || "") + (n.address || "") + "<b name=\"neiBuyerName\"></b><b name=\"neiBuyerPhone\"></b><em name=\"idNumber\"></em></label>";
                    body_lastused += "<div class=\"ad_ope\" style=\"display:none\"><a name=\"setNeiGou\" onclick=\"neiGouAddress.SetNeiGouInfo(this,'" + n.address_id + "','" + n.area_code + "','" + n.address + "','" + n.mobilephone + "','" + n.receive_person + "','" + n.postcode + "','');\" style=\"cursor:pointer;\" aid=\"" + n.address_id + "\">编辑</a></div></li>";
                }
                else {
                    body_common += "<li aid=\"" + n.address_id + "\">";
                    body_common += "<label><input type=\"radio\" name=\"radio\" value=\"\" onclick=\"neiGouAddress.OrderAddress(this,'" + n.address_id + "','" + n.area_code + "','" + n.address + "','" + n.mobilephone + "','" + n.receive_person + "','" + n.postcode + "','')\">";
                    body_common += (n.prov_name || "") + (n.address || "") + "<b name=\"neiBuyerName\"></b><b name=\"neiBuyerPhone\"></b><em name=\"idNumber\"></em></label>";
                    body_common += "<div class=\"ad_ope\" style=\"display:none\"><a name=\"setNeiGou\" onclick=\"neiGouAddress.SetNeiGouInfo(this,'" + n.address_id + "','" + n.area_code + "','" + n.address + "','" + n.mobilephone + "','" + n.receive_person + "','" + n.postcode + "','');\" style=\"cursor:pointer;\" aid=\"" + n.address_id + "\">编辑</a></div></li>";
                }
            });

            body = body_default + body_lastused + body_common;
            $("#ulAddressList").html(body);
            GlobalObjLabel = $("#ulAddressList").find("input[type=radio]:checked").parent();
            $('.address .bd .more').unbind();
            $('.address .bd .more').click(function () {
                var cla = $(this).attr('id');
                if (undefined == cla || null == cla || '' == cla) {
                    $(this).attr('id', 'curr');
                    $(this).html('收起');
                    $('.address .bd ul').css('height', 'auto');
                } else {
                    $(this).attr('id', '');
                    $(this).html('更多');

                    var select = $("#ulAddressList").find("input[type=radio]:checked").parent().parent();
                    $("#ulAddressList").prepend($(select).clone());
                    $(select).remove();
                    $("#divAddressLogin").hide();
                    $('.address .bd li').mouseenter(function () {
                        $(".ad_ope").hide();
                        $(this).addClass('curr').siblings().removeClass('curr');
                        $(this).find("div").show()
                    });
                    $('.address .bd ul').css('height', '36px');
                }
            });
            $("#divAddressLogin").hide();
            $('.address .bd li').mouseenter(function () {
                $(".ad_ope").hide();
                $(this).addClass('curr').siblings().removeClass('curr');
                $(this).find("div").show()
            });
            $("#div_neiGouAddress").find("input[type = text]").removeClass("curr");
            $("#div_neiGouAddress").find("span").hide();
            $("div.cont h2 a").on("click", function () {
                $("#div_neiGouAddress").hide();
            });
            $("#btn_NeiGouSaveaddress").on("click", function () {
                var name = $("#txtNeiGouName").val();
                var moblie = $("#txtNeiGouPhoneNo").val();
                // var idNo = $("#txtNeiGouIDno").val();
                $(".cont li span").css("display", "");
                $(".cont li span").html("");
                $(".cont li span").removeClass("s1");
                $(".cont li input").removeClass("curr");
                var iserror = false;
                if (name.length == 0) {
                    $("#txtNeiGouName").parent().children("span").html("请填写收货人姓名").show();
                    $("#txtNeiGouName").parent().children("span").addClass("s1");
                    $("#txtNeiGouName").addClass("curr");
                    iserror = true;
                }
                if (moblie.trim() == "") {
                    $("#txtNeiGouPhoneNo").parent().children("span").html(g_const_API_Message["107901"]).show();
                    $("#txtNeiGouPhoneNo").parent().children("span").addClass("s1");
                    $("#txtNeiGouPhoneNo").addClass("curr");
                    iserror = true;
                }
                else if (!isMobile(moblie.trim())) {
                    $("#txtNeiGouPhoneNo").parent().children("span").html(g_const_API_Message["7902"]).show();
                    $("#txtNeiGouPhoneNo").parent().children("span").addClass("s1");
                    $("#txtNeiGouPhoneNo").addClass("curr");
                    iserror = true;
                }
                if (!iserror) {
                    // neiGouAddress.Check(idNo, name, moblie);

                    var objLabel = GlobalObjLabel;//$("#ulAddressList").find("input[type=radio]:checked").parent();
                    OrderParam.buyer_mobile = moblie;
                    OrderParam.buyer_name = name;
                    // OrderParam.idnumber = idNumber;
                    $(objLabel).find("b[name=neiBuyerName]").html('<i >' + name + '</i>收');
                    $(objLabel).find("b[name=neiBuyerPhone]").html('<i >' + moblie + '</i>');
                    // $(objLabel).find("em[name=idNumber]").html(idNumber.substr(0, 4) + (idNumber.length > 0 ? "**********" : "") + idNumber.substr(14));
                    $("#div_neiGouAddress").hide();
                }
            });
        }
        else {
            OrderDetail.OrderConfirm();
        }
    },
    Check: function (idNumber, name, moblie) {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=checkuseridentity&idnumber=" + idNumber,
            dataType: "json"
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Success_Code) {

                    var objLabel = GlobalObjLabel;//$("#ulAddressList").find("input[type=radio]:checked").parent();
                    OrderParam.buyer_mobile = moblie;
                    OrderParam.buyer_name = name;
                    OrderParam.idnumber = idNumber;
                    $(objLabel).find("b[name=neiBuyerName]").html('<i >' + name + '</i>收');
                    $(objLabel).find("b[name=neiBuyerPhone]").html('<i >' + moblie + '</i>');
                    $(objLabel).find("em[name=idNumber]").html(idNumber.substr(0, 4) + (idNumber.length > 0 ? "**********" : "") + idNumber.substr(14));
                    $("#div_neiGouAddress").hide();
                }
                else {
                    $("#txtNeiGouIDno").parent().children("span").html(msg.resultmessage).show();
                    $("#txtNeiGouIDno").parent().children("span").addClass("s1");
                    $("#txtNeiGouIDno").addClass("curr");
                }
            }
        });
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
            Message.Operate('', "divAlert");
        });
    },
    OrderAddress: function (obj, addressid, areacode, street, mobile, name, postcode, idnumber, state) {
        localStorage[g_const_localStorage.OrderAddress] = addressid;
        OrderParam.buyer_address_id = addressid;
        OrderParam.buyer_address_code = areacode;
        OrderParam.buyer_address = street;
        OrderParam.buyer_postcode = postcode;
        var objLabel = GlobalObjLabel;
        if (obj) {
            objLabel = $(obj).parent();
            GlobalObjLabel = objLabel;
        }
        var iName = $(objLabel).find("b[name=neiBuyerName]").find("i");
        var iPhone = $(objLabel).find("b[name=neiBuyerPhone]").find("i");
        // var eIDNum = $(objLabel).find("em[name=idNumber]");
        if ($(iName).length <= 0) {
            OrderParam.buyer_mobile = "";
            OrderParam.buyer_name = "";
            OrderParam.idnumber = "";
            $("#txtNeiGouName").val("");
            $("#txtNeiGouPhoneNo").val("");
            // $("#txtNeiGouIDno").val("");
        }
        else {
            OrderParam.buyer_mobile = $(iPhone).html();
            OrderParam.buyer_name = $(iName).html();
           // OrderParam.idnumber = $(eIDNum).html();
            $("#txtNeiGouName").val($(iName).html());
            $("#txtNeiGouPhoneNo").val($(iPhone).html());
            // $("#txtNeiGouIDno").val($(eIDNum).html());
        }
        OrderDetail.OrderConfirm();
    },
    SetNeiGouInfo: function (obj, addressid, areacode, street, mobile, name, postcode, idnumber, state) {
        $("#div_neiGouAddress").find("input[type = text]").removeClass("curr");
        $("#div_neiGouAddress").find("span").hide();

        localStorage[g_const_localStorage.OrderAddress] = addressid;
        OrderParam.buyer_address_id = addressid;
        OrderParam.buyer_address_code = areacode;
        OrderParam.buyer_address = street;
        OrderParam.buyer_postcode = postcode;
        var objLabel = $(obj).parent().parent().find("label");
        GlobalObjLabel = objLabel;
        var iName = $(objLabel).find("b[name=neiBuyerName]").find("i");
        var iPhone = $(objLabel).find("b[name=neiBuyerPhone]").find("i");
        //var eIDNum = $(objLabel).find("em[name=idNumber]");
        if ($(iName).length <= 0) {
            OrderParam.buyer_mobile = "";
            OrderParam.buyer_name = "";
            OrderParam.idnumber = "";
            $("#txtNeiGouName").val("");
            $("#txtNeiGouPhoneNo").val("");
            //$("#txtNeiGouIDno").val("");
        }
        else {
            OrderParam.buyer_mobile = $(iPhone).html();
            OrderParam.buyer_name = $(iName).html();
           // OrderParam.idnumber = $(eIDNum).html();
            $("#txtNeiGouName").val($(iName).html());
            $("#txtNeiGouPhoneNo").val($(iPhone).html());
            //$("#txtNeiGouIDno").val($(eIDNum).html());
        }
        $("#div_neiGouAddress").show();
        OrderDetail.OrderConfirm();
    },
};


var OrderDetail = {
    //api_target: "com_cmall_familyhas_api_APiOrderConfirm",
    api_target: "com_cmall_familyhas_api_TeslaOrderConfirm",
    api_input: {
        "area_code": "", "coupon_codes": [], "goods": [], "buyer_code": "", "order_type": "", "channelId": "", "isPurchase": 1
    },
    OrderConfirm: function () {

        $("#loadTip").show();
        if (OrderParam.buyer_address_code != "") {
            OrderDetail.api_input.area_code = OrderParam.buyer_address_code;
        }
        OrderDetail.api_input.coupon_codes = OrderParam.coupon_codes;
        OrderDetail.api_input.goods = OrderParam.goods;
        OrderDetail.api_input.order_type = OrderParam.order_type;
        OrderDetail.api_input.channelId = g_const_ChannelID;
        OrderDetail.api_input.isPurchase = 1;
        if (localStorage[g_const_localStorage.Member]) {
            OrderDetail.api_input.buyer_code = JSON.parse(localStorage[g_const_localStorage.Member]).Member.membercode;
        }
        var s_api_input = JSON.stringify(OrderDetail.api_input);
        var obj_data = {
            "api_input": s_api_input, "api_target": OrderDetail.api_target, "api_token": "1"
        };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode != g_const_Success_Code) {
                    $("#loadTip").hide();
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }
            if (msg.resultCode) {
                if (msg.resultCode == g_const_Success_Code) {
                    OrderDetail.LoadOrderInfo(msg)
                }
                else {
                    //backurl = PageUrlConfig.BackTo();
                    //Message.ShowToPage(msg.resultMessage, backurl, 4000, "");
                    ////ShowMesaage(msg.resultMessage);
                    //Message.Operate('', "divAlert");
                    $("#loadTip").hide();
                    ShowMesaage(msg.resultMessage);
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
            $("#loadTip").hide();
            ShowMesaage(g_const_API_Message["7001"]);
            Message.Operate('', "divAlert");
        });
    },
    //显示订单内容
    LoadOrderInfo: function (msg) {
        OrderDetail.LoadGoodsList(msg.resultGoodsInfo, msg.orders)
        OrderDetail.LoadMoney(msg);
        OrderDetail.LoadOrderType(msg.resultGoodsInfo);
        OrderPayment.Load(msg);
        OrderDetail.EnableNeiGou(msg.resultGoodsInfo);
        // // OrderDetail.LoadPayType(msg);
        OrderDetail.LoadFaPiao(msg.bills, msg.billRemark);
        OrderDetail.LoadVerifyIdNumber(msg)
        //
        if (msg.coupons.length == 0) {
            CouponCodes.GetCouponCodes();
        }
        else {
            OrderDetail.LoadCouponCodes(msg);
        }
        if (!$("#txt_TemporaryStore").prop("disabled")) {
            CheckInputTemporaryStore();
        }
        if (!$("#txt_StoreGold").prop("disabled")) {
            CheckInputStoreGold();
        }
        $("#loadTip").hide();
        //  CheckInputPoint();
    },
    EnableNeiGou: function (goods) {
        $(goods).each(function () {
            if (this.eventType == "4497472600010006") {
                is_neigouaddress = 1;
                return false;
            }
        });
        if (is_neigouaddress == 1) {
            if ($("#divAddressLogin").is(":hidden")) {
                return false;
            }
            else {
                neiGouAddress.getList();
            }
        }
    },
    LoadVerifyIdNumber: function (list) {
        if (list.isVerifyIdNumber == g_const_YesOrNo.YES.toString()) {
            OrderParam.needverifyidnumber = list.isVerifyIdNumber;
        }
    },
    LoadOrderType: function (list) {
        _order_souce = g_order_Souce.Normal;
        OrderParam.order_type = g_order_Type.Common;
        if (list) {
            if (list[0].sku_code.indexOf("IC_SMG_") > -1) {
                _order_souce = g_order_Souce.QRCode;
                OrderParam.order_type = g_order_Type.QRCode;
            }
            else {
                $.each(list[0].activitys, function (j, m) {
                    if (m.activity_name == "闪购") {
                        OrderParam.order_type = g_order_Type.Quick;
                    }
                    else if (m.activity_name == "内购") {
                        OrderParam.order_type = g_order_Type.Inner;
                    }
                });
            }
        }
    },
    //显示商品列表
    LoadGoodsList: function (list, order) {
        var ulHtml = "";
        var ordernum = 0;
        var pricemsg = "";

        //推送多麦CPS订单时需要的商品参数清空--开始
        duomai_goods_id = "";//商品编号
        duomai_goods_name = "";//商品名称
        duomai_goods_price = "";//商品单价
        duomai_goods_ta = "";//商品数量
        duomai_goods_cate = "";//商品分类编号
        duomai_totalPrice = "";//商品总净金额，商品总价减去此件商品使用的优惠券/现金券等其他非实付金额
        duomai_SumPrice = 0;//商品应付总金额
        //结束
        $.each(list, function (i, n) {
            //存储推送多麦CPS订单时需要的商品参数--开始
            if (n.flagTheSea == "1") {
                isflagTheSea = 1;
            }
            //商品编号
            if (duomai_goods_id == "") {
                duomai_goods_id = n.product_code
            }
            else {
                duomai_goods_id += "|" + n.product_code
            }

            //商品名称
            if (duomai_goods_name == "") {
                duomai_goods_name = n.sku_name
            }
            else {
                duomai_goods_name += "|" + n.sku_name
            }

            //商品单价
            if (duomai_goods_price == "") {
                duomai_goods_price = n.sku_price
            }
            else {
                duomai_goods_price += "|" + n.sku_price
            }

            //商品数量
            if (duomai_goods_ta == "") {
                duomai_goods_ta = n.sku_num
            }
            else {
                duomai_goods_ta += "|" + n.sku_num
            }

            //商品分类编号
            if (duomai_goods_cate == "") {
                duomai_goods_cate = n.sku_code
            }
            else {
                duomai_goods_cate += "|" + n.sku_code
            }

            //商品总净金额
            if (duomai_totalPrice == "") {
                duomai_totalPrice = (parseFloat(n.sku_price) * parseFloat(n.sku_num)).toFixed(2);
            }
            else {
                duomai_totalPrice += "|" + (parseFloat(n.sku_price) * parseFloat(n.sku_num)).toFixed(2);
            }

            //全部商品应付金额
            duomai_SumPrice = parseFloat(duomai_SumPrice) + parseFloat(n.sku_price) * parseFloat(n.sku_num);

            //结束

            OrderParam.productCodeList += '||' + n.sku_code;
            OrderParam.productNameList += '||' + n.sku_name;
            OrderParam.productPriceList += '||' + n.sku_price;
            OrderParam.productNumberList += '||' + n.sku_num;
            ordernum = 0;
            ulHtml += '<li>';
            ulHtml += '<a style="cursor:pointer;" onclick="OrderDetail.LoadProductDetail(\'' + n.product_code + '\')">';
            ulHtml += "<img src=\"" + n.pic_url + "\" alt=\"\" width=\"83\" height=\"83\">";
            
            ulHtml += "<b>" + n.sku_name + "</b>";


            if (n.otherShow.length > 0 || n.authorityLogo) {
                ulHtml += "<div class=\"tipWrap\">";
                //if (n.sales_type) {
                //    if (n.sales_type == "赠品" || n.sales_type == "满减") {
                //        ulHtml += "<span class=\"zengpin\">" + n.sales_type + "</span>";
                //    }
                //}
                //else {
                    $.each(n.otherShow, function (j, m) {
                        if (m == "赠品" && m == "满减") {
                            ulHtml += "<span class=\"zengpin\">" + m + "</span>";
                        }
                    });
                //}
                //2017-03-03增加权威标识显示
                if (n.authorityLogo.length > 0) {
                    $.each(n.authorityLogo, function (j, m) {
                        ulHtml += '<span class="sevenday" style=\"background: url(' + m.logoPic.Trim() + ') no-repeat left top;background-size: 20px auto;\">' + m.logoContent.Trim() + '</span>';
                    });
                }
                ulHtml += "</div>";
            }
            

            
            
            ulHtml += "<span>";
            $.each(n.sku_property, function (j, m) {
                if (j > 0) {
                    ulHtml += "<i>" + m.propertyKey + "：" + m.propertyValue + "</i>";
                }
                else {
                    ulHtml += m.propertyKey + "：" + m.propertyValue;
                }
            });
            ulHtml += "</span>";
            ulHtml += "</a>";
            ulHtml += "<font class=\"f1\"><b>￥" + parseFloat(n.sku_price).toFixed(2) + "</b>";
            if (n.sales_type) {
                if (n.sales_type == "特价" || n.sales_type == "闪购" || n.sales_type == "内购") {
                    ulHtml += "<i>" + n.sales_type + "</i>";
                }

            }
            else {
                $.each(n.otherShow, function (j, m) {
                    if (m == "特价" && m == "闪购") {
                        ulHtml += "<i>" + m + "</i>";
                    }
                });
            }
            
            ulHtml += "</font><font class=\"f2\">x" + n.sku_num + "</font>";
            ulHtml += "<font class=\"f3\"><span>￥" + parseFloat(n.sku_price * n.sku_num).toFixed(2) + "</span></font>";
            ulHtml += "</li>";
            //if (o.tranMoney > 0) {
            //    ulHtml += "<div class='shipment'>运费：" + o.tranMoney + "</div>";
            //}
            //else {
            //    if (order.length > 1) {
            //        ulHtml += "<div class='shipment'>运费：免邮</div>";
            //    }
            //}

        });

        //多麦全部商品总价
        duomai_SumPrice = parseFloat(duomai_SumPrice).toFixed(2);

        //if (pricemsg.length>0) {
        // //   ShowMesaage(pricemsg);
        //    Message.ShowConfirm(pricemsg, "", "divAlertPrice", "取消订单", "CancelOrder", "继续购买");
        //}
        localStorage[g_const_localStorage.OrderPrice] = "";
        $("#ulGoodsList").html(ulHtml);
    },
    //显示金额
    LoadMoney: function (moneymsg) {
        //多麦--记录满减金额
        //duomai_manjianPrice = moneymsg.sub_money;
        var fullcut = 0;
        OrderParam.sub_money = 0;
        $(moneymsg.disList).each(function () {
            if (this.dis_name.indexOf("满减") > -1) {
                duomai_manjianPrice = this.dis_price;

            }
            if (this.dis_type == "0") {
                OrderParam.sub_money += this.dis_price;
            }
            else {
                OrderParam.sub_money -= this.dis_price;
            }
        });
        //完
        //判断是否内购
        var innerBuyTip = "";
        $(moneymsg.resultGoodsInfo).each(function () {
            if (this.eventType == "4497472600010006") {
                innerBuyTip = "<span>注意：<i>员工每月内购数量为5件  ，同一个商品最多订购两件！</i></span>";
                return false;
            }
        });
        $("#spcost_money").html(innerBuyTip+"商品总金额：￥" + parseFloat(moneymsg.cost_money).toFixed(2));

        $("#spsub_money").html("-￥" + parseFloat(OrderParam.sub_money + OrderParam.use_storegold + OrderParam.use_point + OrderParam.use_temporarystore).toFixed(2));

        if (duomai_manjianPrice > 0) {
            $("#li_fullcut").show();
            $("#st_fullcut").html("￥" + parseFloat(duomai_manjianPrice).toFixed(2));
        }
        else {
            $("#li_fullcut").hide();
        }

        var disListHmtml = "";
        $(moneymsg.disList).each(function () {
            disListHmtml += "&nbsp;&nbsp;&nbsp;" + this.dis_name + "：￥" + parseFloat(this.dis_price).toFixed(2);
        });

        $("#i_sent_money").html("运费：￥" + parseFloat(moneymsg.sent_money).toFixed(2) + disListHmtml);
        $("#b_pay_money").html("￥" + parseFloat(moneymsg.pay_money).toFixed(2));
        OrderParam.check_pay_money = moneymsg.pay_money;
        OrderParam.real_pay_money = moneymsg.pay_money;
        //_cash_money = moneymsg.cash_back

        //$("#divdisRemarks").html("<span>注：</span>"+moneymsg.disRemarks);

        //var tmpl = $("#tpl_order")[0].innerHTML;
        //var data = {
        //    "sppay_money": moneymsg.pay_money.toString(),
        //    "spcash_back": "购买立返:￥"+moneymsg.cash_back
        //};
        //html = renderTemplate(tmpl, data);
        //$("body").append(html);

        //显示暂存款和储值金最大使用多少
        OrderParam.productMoneyForLD = parseInt(moneymsg.productMoneyForLD);
        SetLimit();
    },
    //显示支付类型【作废】
    LoadPayType: function (paymsg) {

        //获得缓存的支付方式
        var selpayType = "";
        if (localStorage["selpaytype"] != null && localStorage["selpaytype"] != "") {
            selpayType = localStorage["selpaytype"];

            $("#btnAlipay").attr("class", "sela");
            $("#btnGetpay").attr("class", "sela");
            $("#btnWeixin").attr("class", "sela");
            $("#btnAlipay").hide();
            $("#btnGetpay").hide();
            $("#btnWeixin").hide();



            if (paymsg.pay_type.indexOf(g_pay_Type.Online) > -1) {
                if (IsInWeiXin.check()) {
                    switch (selpayType) {
                        case "divweixin":
                            $("#divweixin").show();
                            $("#btnWeixin").attr("class", "sela on");
                            $("#btnWeixin").show();
                            _pay_type = g_pay_Type.WXpay;

                            break;
                    }
                }
                else {
                    switch (selpayType) {
                        case "divalipay":
                            $("#divalipay").show();
                            $("#btnAlipay").attr("class", "sela on");
                            $("#btnAlipay").show();
                            _pay_type = g_pay_Type.Alipay;
                            break;
                        case "divlinlianpay"://银联支付
                            $("#divlinlianpay").show();
                            $("#btnYinLianPay").attr("class", "sela on");
                            $("#btnYinLianPay").show();
                            _pay_type = g_pay_Type.YinLianpay;
                            break;
                    }
                }

            }
            if (paymsg.pay_type.indexOf(g_pay_Type.Getpay) > -1) {
                if (IsInWeiXin.check()) {
                    $("#divweixin").show();
                    $("#btnWeixin").attr("class", "sela");
                    $("#btnWeixin").show();
                }
                else {
                    $("#divalipay").show();
                    $("#btnAlipay").attr("class", "sela");
                    $("#btnAlipay").show();
                }

                switch (selpayType) {
                    case "divgetpay":
                        _pay_type = g_pay_Type.Getpay;
                        $("#btnGetpay").attr("class", "sela on");
                        $("#btnGetpay").show();
                        break;
                    case "divlinlianpay"://银联支付
                        $("#divlinlianpay").show();
                        $("#btnYinLianPay").attr("class", "sela");
                        $("#btnYinLianPay").show();
                        break;
                }
                $("#divgetpay").show();
                $("#btnGetpay").show();

            }


        }
        else {
            if (paymsg.pay_type.indexOf(g_pay_Type.Online) > -1) {
                if (IsInWeiXin.check()) {
                    $("#divweixin").show();
                    _pay_type = g_pay_Type.WXpay;
                    $("#btnWeixin").attr("class", "sela on");
                }
                else {
                    $("#divalipay").show();
                    // $("#divweixin").show();
                    _pay_type = g_pay_Type.Alipay;
                    $("#btnAlipay").attr("class", "sela on");
                }
                
                $.each(paymsg.paymentTypeAll, function (iii, nnn) {
                    if (nnn == g_pay_Type.YinLianpay) {
                        //银联WAP支付
                        $("#divlinlianpay").show();
                        $("#btnYinLianPay").attr("class", "sela");
                    }
                });
            }
            if (paymsg.pay_type.indexOf(g_pay_Type.Getpay) > -1) {
                if (IsInWeiXin.check()) {
                    $("#divweixin").show();
                    _pay_type = g_pay_Type.WXpay;
                    $("#btnWeixin").attr("class", "sela on");
                }
                else {
                    $("#divalipay").show();
                    //   $("#divweixin").show();
                    _pay_type = g_pay_Type.Alipay;
                    $("#btnAlipay").attr("class", "sela on");
                }
                
                $.each(paymsg.paymentTypeAll, function (iii, nnn) {
                    if (nnn == g_pay_Type.YinLianpay) {
                        //银联WAP支付
                        $("#divlinlianpay").show();
                        $("#btnYinLianPay").attr("class", "sela");
                    }
                });
                $("#divgetpay").show();
            }
        }

        // _fapiaonr = paymsg.bills;
    },
    LoadFaPiao: function (fplist, remark) {
        // <label><input type="radio" value="" name="radio4">明细</label><label><input type="radio" value="" name="radio4">日用品</label>
        var fpHtml = "";
        var checkStr = "";
        fpHtml += "<i>发票内容： </i>";
        $.each(fplist, function (i, n) {
            if (i == 0) {
                checkStr = "checked";
                _bill_Detail = n;
            }
            else {
                checkStr = "";
            }
            fpHtml += "<label><input type=\"radio\" value=\"\" name=\"radio4\" " + checkStr + "  onclick=\"setBilldetail('" + n + "')\">" + n + "</label>";
        });
        $("#spanFplist").html(fpHtml);
        $("#spanFpMark").html("备注：" + remark);
    },
    LoadCouponCodes: function (msg) {

    },
    LoadProductDetail: function (pid) {
        var p = "&pid=" + pid + "&t=" + Math.random();
        g_const_PageURL.GoByMainIndex(g_const_PageURL.ProductDetail, p, '', 1);
    }
};



var ispay = 0;
var OrderCreate = {
    OrderIng: 0,
    api_target: "com_cmall_familyhas_api_WebCreateOrder ",
    api_input: {
        "check_pay_money": "", "buyer_address_id": "", "buyer_address_code": "", "goods": [], "buyer_mobile": "", "pay_type": "", "buyer_address": "", "billInfo": [], "app_vision": "1.0.0", "buyer_name": "", "order_type": "", "coupon_codes": "", "order_souce": "", "channelId": "", "os": "", "czj_money": "", "zck_money": "", "isPurchase": 0
    },
    CreateToJYH: function () {
        if (OrderCreate.OrderIng == 1) {
            return;
        }
        $("#loadTip").show();
        OrderCreate.OrderIng = 1;
        $("#btnOrderCreate").attr("class", "tj on");
        $("#btnOrderCreate").html("提交中...");
        OrderCreate.api_input.check_pay_money = OrderParam.real_pay_money;
        OrderCreate.api_input.buyer_address_id = OrderParam.buyer_address_id;
        OrderCreate.api_input.buyer_address_code = OrderParam.buyer_address_code;
        OrderCreate.api_input.goods = OrderParam.goods;;
        OrderCreate.api_input.buyer_mobile = OrderParam.buyer_mobile;
        OrderCreate.api_input.pay_type = OrderParam.pay_type;
        OrderCreate.api_input.buyer_address = OrderParam.buyer_address;
        OrderCreate.api_input.billInfo = JSON.parse("{ \"bill_Type\": \"" + OrderParam.bill_type + "\", \"bill_detail\": \"" + OrderParam.bill_detail + "\", \"bill_title\": \"" + OrderParam.bill_title + "\"}");
        OrderCreate.api_input.buyer_name = OrderParam.buyer_name;
        OrderCreate.api_input.order_type = OrderParam.order_type;
        OrderCreate.api_input.coupon_codes = OrderParam.coupon_codes;
        OrderCreate.api_input.order_souce = g_order_Souce.Normal;
        OrderCreate.api_input.channelId = g_const_ChannelID;
        OrderCreate.api_input.app_vision = "1.0.0";
        OrderCreate.api_input.os = "";
        if (is_neigouaddress == 1) {
            OrderCreate.api_input.isPurchase = 1;
        }
        //储值金使用金额
        OrderCreate.api_input.czj_money = OrderParam.use_storegold;
        //暂存款使用金额
        OrderCreate.api_input.zck_money = OrderParam.use_temporarystore;

        if (localStorage[g_const_localStorage.OrderFrom] != null) {
            if (localStorage[g_const_localStorage.OrderFrom] != "") {
                OrderCreate.api_input.app_vision = localStorage[g_const_localStorage.OrderFrom];
            }
        }
        if (localStorage[g_const_localStorage.OrderFromParam] != null) {
            if (localStorage[g_const_localStorage.OrderFromParam] != "") {
                OrderCreate.api_input.os = localStorage[g_const_localStorage.OrderFromParam];
            }
        }


        var s_api_input = JSON.stringify(OrderCreate.api_input);
        var obj_data = {
            "api_input": s_api_input, "api_target": OrderCreate.api_target, "api_token": "1"
        };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    Message.Operate('', "divAlert");
                    return;
                }
            }
            if (msg.resultCode) {
                if (msg.resultCode == g_const_Success_Code) {
                    //记录CPS页面
                    OrderCreate.Record_From(msg);

                    /*以下代码转移到OrderCreate.Record_From中
                    var del_list = [];
                    $.each(OrderParam.goods, function (j, m) {
                        del_list.push([m.product_code, m.sku_code]);
                    });
                    g_type_cart.BatchRemoveWithCloud(del_list);
                    OrderParam.ordercode = msg.order_code;

                    switch (OrderParam.pay_type) {
                        case g_pay_Type.Online:
                            if (OrderParam.real_pay_money > 0) {
                                OrderCreate.ToPay();
                            }
                            else {
                                OrderCreate.LoadOrdernoDetail(0);
                                // window.location.replace("/Order/OrderSuccess.html?paytype=alipay&orderid=" + _orderid + "&t=" + Math.random());
                            }
                            break;
                        default:
                            OrderCreate.LoadOrdernoDetail(1);
                            break;
                    }
                    */
                }
                else {
                    $("#btnOrderCreate").attr("class", "tj");
                    $("#btnOrderCreate").html("提交订单");
                    $("#loadTip").hide();
                    ShowMesaage(msg.resultMessage);
                }

            }
            OrderCreate.OrderIng = 0;

        });

        request.fail(function (jqXHR, textStatus) {
            $("#btnOrderCreate").attr("class", "tj");
            $("#btnOrderCreate").html("提交订单");
            $("#loadTip").hide();
            ShowMesaage(g_const_API_Message["100029"]);
        });
    },
    LoadOrdernoDetail: function (type) {
        var p = "&succtype=" + type + "&t=" + Math.random();
        g_const_PageURL.GoByMainIndex(g_const_PageURL.OrderSuccess, p, false);
    },
    Record_From: function (paymsg) {
        var OrderFrom_1 = localStorage[g_const_localStorage.OrderFrom];
        if (localStorage[g_const_localStorage.OrderFrom] != null) {
            if (localStorage[g_const_localStorage.OrderFrom] != "") {
                $.ajax({
                    type: "POST",//用POST方式传输
                    dataType: "json",//数据格式:JSON
                    url: '/Ajax/API.aspx',//目标地址
                    data: "t=" + Math.random() +
                                "&action=merchant_order" +
                                "&merchantcode=" + escape(localStorage[g_const_localStorage.OrderFrom]) +
                                "&paramlist=" + escape(localStorage[g_const_localStorage.OrderFromParam].replace(/&/g, "@").replace(/=/g, "^")) +
                                "&orderno=" + escape(paymsg.order_code),
                    beforeSend: function () { },//发送数据之前
                    complete: function () { },//接收数据完毕
                    success: function (data) {


                    }
                });
            }
        }

        //爱德
        if (OrderFrom_1 == Merchant1.Code) {
            try {
                productCodeList = OrderParam.productCodeList.substring(2);
                productNameList = OrderParam.productNameList.substring(2);
                productPriceList = OrderParam.productPriceList.substring(2);
                productNumberList = OrderParam.productNumberList.substring(2);
                //处理爱德数据
                Merchant1.productid = productCodeList.split('||')[0];
                Merchant1.productname = productNameList.split('||')[0];
                Merchant1.productprice = productPriceList.split('||')[0];
                Merchant1.orderid = paymsg.order_code;
                Merchant1.orderprice = OrderParam.real_pay_money;//paymsg.order_money;
                Merchant1.RecordValid(Merchant1.RecordOrder);
            }
            catch (e) {
                OrderCreate.GoToPay(paymsg.order_code);

            }
        }
            //处理领克特
        else if (OrderFrom_1 == Merchant_LKT.Code) {
            try {
                //Merchant_LKT.order_code = paymsg.order_code;
                //$.each(paymsg.orderSellerList, function (i, n) {
                //    Merchant_LKT.product_code += '||' + n.productCode;
                //    Merchant_LKT.product_price += '||' + n.price;
                //    Merchant_LKT.product_count += '||' + n.number;
                //    Merchant_LKT.product_cd += '||' + n.productCode;
                //})
                //Merchant_LKT.product_code = OrderParam.productCodeList.substring(2);
                //Merchant_LKT.product_price = OrderParam.productPriceList.substring(2);
                //Merchant_LKT.product_count = OrderParam.productNumberList.substring(2);
                //Merchant_LKT.product_cd = OrderParam.productCodeList.substring(2);
                //Merchant_LKT.order_code = paymsg.order_code;
                //Merchant_LKT.RecordOrder();
                OrderCreate.GoToPay(paymsg.order_code);
            }
            catch (e) {
                OrderCreate.GoToPay(paymsg.order_code);

            }
        }
            //多麦--订单推送
        else if (localStorage[g_const_localStorage.OrderFrom] == Merchant_duomai.Code && localStorage[g_const_localStorage.OrderFromRefer] != "") {
            try {
                Merchant_duomai.order_sn = paymsg.order_code;//订单编号
                Merchant_duomai.order_time = Merchant1.GetNowTime();//用户下单时间
                if (parseFloat(duomai_manjianPrice) > 0) {
                    //对于满减的订单，此参数值为满减的金额；如若没有满减，则传0
                    Merchant_duomai.discount_amount = duomai_manjianPrice;//优惠金额=应付总金额-实际支付金额
                    Merchant_duomai.orders_price = (parseFloat(duomai_manjianPrice) + parseFloat(OrderParam.real_pay_money)).toFixed(2);//订单金额包含满减金额
                }
                else {
                    Merchant_duomai.discount_amount = "0";
                    Merchant_duomai.orders_price = OrderParam.real_pay_money;//订单金额包含满减金额

                }
                Merchant_duomai.order_status = "0";//订单状态,目前-1表示无效，0表示未支付状态，其它直接给出状态描述，或者使用1、2、3这样的正整数

                //一个订单，多个商品时，每个商品属性都用“|”分隔多个，
                Merchant_duomai.goods_id = duomai_goods_id;//商品编号
                Merchant_duomai.goods_name = duomai_goods_name;//商品名称
                Merchant_duomai.goods_price = duomai_goods_price;//商品单价
                Merchant_duomai.goods_ta = duomai_goods_ta;//商品数量
                Merchant_duomai.goods_cate = duomai_goods_cate;//商品分类编号
                Merchant_duomai.totalPrice = duomai_totalPrice;//商品总净金额，商品总价减去此件商品使用的优惠券/现金券等其他非实付金额
                Merchant_duomai.RecordOrder();
            }
            catch (e) {
                OrderCreate.GoToPay(paymsg.order_code);
            }

        }
        else {
            //一般订单
            OrderCreate.GoToPay(paymsg.order_code);
        }

    },
    GoToPay: function (order_code) {
        //跳转支付页面
        var del_list = [];
        $.each(OrderParam.goods, function (j, m) {
            del_list.push([m.product_code, m.sku_code]);
        });
        g_type_cart.BatchRemoveWithCloud(del_list);
        OrderParam.ordercode = order_code;//msg.order_code;

        switch (OrderParam.pay_type) {
            case g_pay_Type.Online:
                if (OrderParam.real_pay_money > 0) {
                    OrderCreate.ToPay();
                }
                else {
                    OrderCreate.LoadOrdernoDetail(0);
                    // window.location.replace("/Order/OrderSuccess.html?paytype=alipay&orderid=" + _orderid + "&t=" + Math.random());
                }
                break;
            default:
                OrderCreate.LoadOrdernoDetail(1);
                break;
        }
    },
    //显示支付类型
    ToPay: function () {
        $.ajax({
            type: "POST",//用POST方式传输
            dataType: "json",//数据格式:JSON
            url: '/Ajax/API.aspx',//目标地址
            data: "t=" + Math.random() +
                    "&action=initpayment" +
                    "&orderno=" + OrderParam.ordercode +
                    "&orderamount=" + OrderParam.real_pay_money +
                    "&buyer_name=" + OrderParam.buyer_name +
                    "&buyer_address=" + OrderParam.buyer_address +
                    "&buyer_postcode=" + OrderParam.buyer_postcode +
                    "&orderpaytype=" + OrderParam.pay_type.substring(11) +
                    "&orderpayment=" + OrderParam.orderpayment +
                    "&orderpaygate=" + OrderParam.orderpaygate +
                    "&paygatetype=" + OrderParam.paygatetype +
                    "&productid=" + OrderParam.productCodeList.substring(2) +
                        "&paygatetypeaccount=" + OrderParam.paygatetypeaccount,
            beforeSend: function () {
            },//发送数据之前
            complete: function () { },//接收数据完毕
            success: function (msg) {
                if (msg.resultcode) {
                    $("#btnOrderCreate").attr("class", "tj");
                    $("#btnOrderCreate").html("提交订单");
                    if (msg.resultcode == "0") {
                        var OrderInfo = {
                            "OrderNo": "", "Paygate": 0
                        };
                        OrderInfo.OrderNo = OrderParam.ordercode;
                        OrderInfo.Paygate = OrderParam.orderpaygate;
                        localStorage[g_const_localStorage.OrderInfo] = JSON.stringify(OrderInfo);
                        window.location.href = "/IndexMain.html?u=OrderPay";
                    }
                    else {
                        window.location.replace(PageUrlConfig.BackTo());
                    }
                }
            }
        });

        //localStorage[g_const_localStorage.FaPiao] = "";
        //OrderParam.order_code = paymsg.order_code;
        //switch (OrderParam.pay_type) {
        //    case g_pay_Type.Alipay:
        //        if (OrderParam.check_pay_money>0) {
        //            window.location.replace(g_Alipay_url + _orderid + "/4497153900010001");
        //        }
        //        else {
        //            window.location.replace("/Order/OrderSuccess.html?paytype=alipay&orderid=" + _orderid + "&t=" + Math.random());
        //        }
        //        break;
        //    case g_pay_Type.Getpay:
        //        window.location.replace("/Order/OrderSuccess.html?paytype=getpay&orderid=" + _orderid + "&t=" + Math.random());
        //        break;
        //    case g_pay_Type.WXpay:
        //        if (OrderParam.check_pay_money>0) {
        //            OrderCreate.WxPay(OrderParam.check_pay_money);
        //        }
        //        else {
        //            window.location.replace("/Order/OrderSuccess.html?paytype=wxpay&orderid=" + _orderid + "&t=" + Math.random());
        //        }
        //        break;
        //}
    },
};


var Asset = {
    /*PC版我的资产*/
    api_target: "com_cmall_familyhas_api_ApiForAsset ",
    /*输入参数*/
    api_input: {
        "version": 1.0
    },
    /*接口响应对象*/
    api_response: {},
    /*我的资产*/
    GetPoint: function () {
        var s_api_input = JSON.stringify(Asset.api_input);
        var obj_data = {
            "api_input": s_api_input, "api_target": Asset.api_target, "api_token": g_const_api_token.Wanted
        };
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
                OrderParam.max_temporarystore = msg.availableTemporaryStore;
                OrderParam.max_storegold = msg.availableStoreGold;
                OrderParam.max_point = msg.availablePoint;
                $("#i_TemporaryStore").html("￥" + OrderParam.max_temporarystore);
                $("#i_StoreGold").html("￥" + OrderParam.max_storegold);
                $("#i_Point").html(OrderParam.max_point + "点积分");
                $("#span_TemporaryStore").html("本次可用最大值￥" + OrderParam.max_temporarystore);
                $("#span_StoreGold").html("本次可用最大值￥" + OrderParam.max_storegold);
                $("#span_Point").html("本次可用" + OrderParam.max_point + "点");
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


var CouponCodes = {
    /*可用优惠劵使用查询*/
    api_target: "com_cmall_familyhas_api_ApiGetAvailableCoupon",
    /*输入参数*/
    api_input: { "shouldPay": 0, "goods": [], "skuCodeEntitylist": [], "version": 1.0, "channelId": "" },
    /*接口响应对象*/
    api_response: {},
    /*获取可用优惠劵*/
    GetCouponCodes: function () {
        CouponCodes.api_input.goods = OrderParam.goods;
        CouponCodes.api_input.shouldPay = OrderParam.check_pay_money;
        CouponCodes.api_input.channelId = g_const_ChannelID;
        var s_api_input = JSON.stringify(CouponCodes.api_input);
        var obj_data = {
            "api_input": s_api_input, "api_target": CouponCodes.api_target, "api_token": g_const_api_token.Wanted
        };
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
                var optionstring = "";
                if (msg.couponCount == 0) {
                    optionstring += "<option value=\"\">无可用优惠券</option>";
                }
                else {
                    var sel = "";
                    optionstring += "<option selected=\"selected\" value=\"\">不使用优惠券</option>";
                    $.each(msg.couponList, function (i, n) {
                        //显示不限平台的优惠卷
                        if (JSON.stringify(OrderParam.coupon_codes).indexOf(n.couponCode) != -1) {
                            sel = "selected";
                        }
                        else {
                            sel = "";
                        }
                        optionstring += "<option value=\"" + n.couponCode + "\" " + sel + " >" + n.surplusMoney + "元</option>";
                        // }
                    });
                }
                if (is_exchange == 1) {
                    $("#selCoupon").html(optionstring);//.prop("disabled", false);
                   // $("#rd_Coupon").prop("checked", true);
                }
                else {
                    $("#selCoupon").html(optionstring);//.prop("disabled", true);
                }
                OrderParam.coupon_codes = JSON.parse("[\"" + $("#selCoupon").val() + "\"]");
                //if ($("#selCoupon").val().length == 0) {
                //    $("#rd_Coupon").prop("checked", false);
                //}
            }
            else {

                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    SetCouponCodes: function () {
        OrderParam.coupon_codes = JSON.parse("[\"" + $("#selCoupon").val() + "\"]");
        OrderParam.sub_money = 0;
        OrderParam.use_storegold = 0;
        OrderParam.use_point = 0;
        OrderParam.use_temporarystore = 0;
        //$("#txt_StoreGold").attr("disabled", "disabled");
        //$("#txt_TemporaryStore").attr("disabled", "disabled");
        //$("#txt_Point").attr("disabled", "disabled");
        $("#txt_StoreGold").val("0");
        $("#txt_TemporaryStore").val("0");
        $("#txt_Point").val("0");
        //$("#rd_StoreGold").attr("checked", false);
        //$("#rd_TemporaryStore").attr("checked", false);
        //$("#rd_Point").attr("checked", false);
        OrderDetail.OrderConfirm();
    },
};

var ApiPayment = {
    GetInfo: function (order_code, paytype) {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=topayment&order_code=" + order_code + "&paytype=" + paytype,
            dataType: "json"
        });

        request.done(function (msg) {
            if (msg.resultcode == g_const_Success_Code_IN) {

            }
            else {

            }

        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
};

//优惠码兑换
var CouponCodeExchange = {
    api_target: "com_cmall_familyhas_api_ApiForCouponCodeExchange",
    api_input: { "version": 1, "couponCode": "" },
    GetList: function () {
        CouponCodeExchange.api_input.couponCode = Base64.base64encode(Base64.utf16to8($("#txtExchange").val()));
        var s_api_input = JSON.stringify(this.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": CouponCodeExchange.api_target, "api_token": g_const_api_token.Wanted };
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
                ShowMesaage(g_const_API_Message["100017"]);
                $("#p_yhq").hide();
                $("#txtExchange").val("");
                is_exchange = 1;
                CouponCodes.GetCouponCodes();
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });
        //接口异常
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
};


//在线支付包含的支付方式
var onlinePayType = {
    api_target: "com_cmall_familyhas_api_ApiPaymentTypeAll",
    api_input: { "order_code": "", "deviceType": "WEB" },

    getList: function () {
        //赋值
        onlinePayType.api_input.order_code = $("#hid_order_code").val();

        //组织提交参数
        var s_api_input = JSON.stringify(this.api_input);
        //提交接口[api_token不为空，公用方法会从sission中获取]
        var obj_data = { "api_input": s_api_input, "api_target": onlinePayType.api_target, "api_token": g_const_api_token.Wanted };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });
        //正常返回
        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    //Session失效，重新登录，传递回调地址
                    UserRELogin.login(g_const_PageURL.MyOrder_pay + "?order_code=" + $("#hid_order_code").val() + "&order_money=" + $("#hid_order_money").val())
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }

            if (msg.resultCode == g_const_Success_Code) {
                onlinePayType.Load_Result(msg);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });
        //接口异常
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    //接口返回成功后的处理
    Load_Result: function (result) {
        //金额
        var order_money = "<dt>请支付：<em><i>￥</i>" + $("#hid_order_money").val() + "</em></dt>";
        //支付方式
        var all_pay_type = "";
        //判断是否在为新内置浏览器
        var sel = "curr";
        $.each(result.paymentTypeAll, function (i, n) {
            switch (n) {
                case g_pay_Type.Alipay:
                    if (IsInWeiXin.check() == false) {
                        all_pay_type += "<dd id=\"selalipay\" onclick=\"javascript: $('#alpayicq').removeClass(); $('#weixinicq').removeClass();$('#alpayicq').attr('class', 'curr');$('#hid_selpaytype').val('alipay');\" ><em class=\"alipay\"></em>支付宝<a id=\"alpayicq\" href=\"#\" class='" + sel + "' ></a></dd>";
                        if (sel != "") {
                            $("#hid_selpaytype").val("alipay");
                            sel = "";
                        }
                    }
                    break;
                case g_pay_Type.WXpay:
                    all_pay_type += "<dd id=\"selweixin\" onclick=\"javascript:$('#alpayicq').removeClass(); $('#weixinicq').removeClass();$('#weixinicq').attr('class', 'curr');$('#hid_selpaytype').val('weixin');\" ><em class=\"weixin\"></em>微信支付<a id=\"weixinicq\" href=\"#\" class='" + sel + "' ></a></dd>";
                    if (sel != "") {
                        $("#hid_selpaytype").val("weixin");
                        sel = "";
                    }
                    break;
                    //case 2:
                    //    all_pay_type += "<dd><em class=\"blank\"></em>银联支付<a href=\"javascript:;\" class=\"" + sel + "\" ></a></dd>";
                    //    sel = "";
                    //    break;
            }
        });
        $(".pay-method").html(order_money + all_pay_type);

    },

    //接口返回失败后的处理
    Load_ResultErr: function (resultlist) {
    },
};

var UserIdentity = {
    api_target: "com_cmall_familyhas_api_ApiUserIdentityInfo",
    api_input: { "idNumber": "", "operFlag": "CHECK" },
    Type: 1,
    Check: function (idNumber) {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=checkuseridentityhjy&idnumber=" + idNumber,
            dataType: "json"
        });

        request.done(function (msg) {
            if (msg.resultcode) {
                if (msg.resultcode != g_const_Success_Code) {
                    ConfirmMessage("您的身份证曾被海关退回，若继续使用，可能再次通关失败！", UserIdentity.Load_Address, OrderCreate.CreateToJYH, "修改身份证", "继续使用");
                }
                else {
                    OrderCreate.CreateToJYH();
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_Address: function () {
        PageUrlConfig.SetUrl(g_const_PageURL.MainIndex + "?u=OrderConfirm");
        var p = "&t=" + Math.random() + "&idno=" + OrderParam.buyer_address_id;
        g_index.GoTo(g_const_PageURL.GetKey(g_const_PageURL.AddressList), p);
    },
};