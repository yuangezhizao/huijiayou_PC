/// <reference path="../functions/AccountMenu.js" />
/// <reference path="../functions/g_Const.js" />
/// <reference path="../functions/g_Type.js" />
/// <reference path="../jquery-2.1.4.js" />
/// <reference path="../g_header.js" />
var page_orderdetail = {
    MenuName: "我的订单",
    Init: function () {
        AccountMenu.ShowMenu("div.home ul.fl", "#tpl_menu", page_orderdetail.MenuName);
        page_orderdetail.LoadOrderDetailData();

    },
    //读取订单详情
    LoadOrderDetailData: function () {
        g_type_api.api_input = {
            buyer_code: GetQueryString("buyer_code"),
            order_code: GetQueryString("orderno"),
            version: 1,
            deviceType: "WEB"
        };
        g_type_api.api_target = "com_cmall_familyhas_api_ApiOrderDetails";
        g_type_api.api_token = g_const_api_token.Wanted;
        g_type_api.LoadData(page_orderdetail.AfterLoadOrderDetailData, "");
    },
    //取到订单详情后
    AfterLoadOrderDetailData: function (msg) {
        page_orderdetail.Render_order_consignee(msg);
        page_orderdetail.Render_order_product(msg);
        page_orderdetail.Render_order_pay(msg);
    },
    //渲染收货人信息
    Render_order_consignee: function (msg) {
        var html = "";
        var stpl = $("#tpl_order_consignee").html();
        var data = {
            consigneeName: msg.consigneeName,
            consigneeTelephone: msg.consigneeTelephone,
            consigneeAddress: msg.consigneeAddress,
            invoiceInformationTitle: (msg.invoiceInformation.invoiceInformationType == "" || msg.invoiceInformation.invoiceInformationType == g_const_bill_Type.NotNeed) ? "不开发票" : msg.invoiceInformation.invoiceInformationTitle,
            invoiceInformationValue: msg.invoiceInformation.invoiceInformationValue,
            invoiceInformationValuestyle: (msg.invoiceInformation.invoiceInformationType == "" || msg.invoiceInformation.invoiceInformationType == g_const_bill_Type.NotNeed) ? "display:none" : "",
            idNumberValue: msg.flagTheSea == "1" ? "<p id=\"p_idNumber\"></p>" : "",
        }
        html = renderTemplate(stpl, data);
        $("#address").html(html);
        if (msg.idNumber.length > 0) {
            page_orderdetail.UnCheck(msg.idNumber);
        }
    },
    UnCheck: function (idNumber) {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getidnumber&idnumber=" + String.Replace(idNumber),
            dataType: "json"
        });

        request.done(function (msg) {
            if (msg.resultcode) {
            $("#p_idNumber").html("身份证号码：" + (msg.resultmessage.substr(0, 4) + (msg.resultmessage.length > 0 ? "**********" : "") + msg.resultmessage.substr(14)));
        }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
            Message.Operate('', "divAlert");
        });
    },
    //渲染订单产品信息
    Render_order_product: function (msg) {
        var html = "";
        var stpl = $("#tpl_order_Info").html();
        var noPassCustom = false;
        var data = {
            ordertitle: function (msg) {
                var html = "";
                var style = "";
                if (msg.order_status == g_const_orderStatus.DFK || msg.order_status == g_const_orderStatus.DFH || msg.order_status == g_const_orderStatus.JYSB) {
                    style = "display:none;";
                }
                else {
                    if (msg.isSeparateOrder == "0") {
                        var packagelist = msg.apiOrderKjtParcelResult;
                        //暂时去除“通关标志”关联“物流信息”显示隐藏，等待接口技术确认
                        //var k = 0;
                        //for (var i = 0; i < packagelist.length; i++) {
                        //    orderlist = packagelist[i].apiOrderKjtDetailsList;
                        //    for (var j = 0; j < orderlist.length; j++) {
                        //        var product = orderlist[j];
                        //        if (product.noPassCustom == g_const_YesOrNo.YES.toString() || product.noPassCustom=="") {
                        //            //style = "display:none;";
                        //            k++
                        //        }
                        //    }
                        //}
                        ////全部包裹都没过海关或为空，隐藏
                        //if (k == packagelist.length) {
                        //    style = "display:none;";
                        //}
                    }
                    else {
                        orderlist = msg.orderSellerList;
                        //暂时去除“通关标志”关联“物流信息”显示隐藏，等待接口技术确认
                        //for (var k = 0; k < orderlist.length; k++) {
                        //    var product = orderlist[k];
                        //    if (product.noPassCustom == g_const_YesOrNo.YES.toString())
                        //        style = "display:none;";
                        //}
                    }
                }

                var stpl = $("#tpl_order_title_normal").html();
                if (msg.isSeparateOrder == "0") {
                    stpl = $("#tpl_order_title_SeparateOrder").html();
                    var stpl1 = $("#tpl_order_title_normal").html();

                    var data1 = {
                        ordertime: msg.create_time,
                        orderexpresslink: "",
                        orderexpresslinkstyle: "display:none;",
                        orderno: msg.order_code,
                        orderstatus: g_const_orderStatus.GetStatusText(msg.order_status)
                    };
                    var html1 = renderTemplate(stpl1, data1);
                    $("div.ft").html(html1);
                    $("div.ft").css("display", "");
                }
                else {
                    $("div.ft").css("display", "none");

                    var data = {
                        ordertime: msg.create_time,
                        orderexpresslink: g_const_PageURL.GetLink(g_const_PageURL.MyOrder_List_ckwl, "&orderno=" + msg.order_code),
                        orderexpresslinkstyle: style,
                        orderno: msg.order_code,
                        orderstatus: g_const_orderStatus.GetStatusText(msg.order_status)
                    };
                    html = renderTemplate(stpl, data);
                }
                return html;
            }(msg),
            orderproductlist: function (msg) {
                var html = "";
                var stpl = $("#tpl_orderproductlist").html();
                var orderlist;
                page_orderdetail.TotalProductCount = 0;
                var style = "";
                if (msg.isSeparateOrder == "0") {
                    var packagelist = msg.apiOrderKjtParcelResult;

                    for (var i = 0; i < packagelist.length; i++) {
                        orderlist = packagelist[i].apiOrderKjtDetailsList;

                        if (packagelist[i].localStatus == g_const_orderStatus.DFK || packagelist[i].localStatus == g_const_orderStatus.DFH || msg.order_status == g_const_orderStatus.JYSB) {
                            style = "display:none;";
                        }
                        //暂时去除“通关标志”，等待接口技术确认
                        //if (orderlist[i].noPassCustom == g_const_YesOrNo.YES.toString() || orderlist[i].noPassCustom =="") {
                        //            style = "display:none;";
                        //}
                        var stpl1 = $("#tpl_order_title_SeparateOrder").html();

                        var orderexpresslink_temp = g_const_PageURL.GetLink(g_const_PageURL.MyOrder_List_ckwl, "&orderno=" + msg.order_code);
                        if (packagelist.length > 1) {
                            //调用分包裹物流方法
                            orderexpresslink_temp = g_const_PageURL.GetLink(g_const_PageURL.MyOrder_List_ckwl, "&orderno=" + msg.order_code + "&baoguoid=" + (i + 1).toString());
                        }

                        var data1 = {
                            orderexpresslink: orderexpresslink_temp,
                            orderexpresslinkstyle: style,
                            packgeName: "包裹" + (i + 1).toString(),
                            orderstatus: g_const_orderStatus.GetPacketStatusText(packagelist[i].localStatus)
                        };
                        var html1 = renderTemplate(stpl1, data1);
                        var html2 = "";
                        for (var j = 0; j < orderlist.length; j++) {
                            var product = orderlist[j];
                            var pdata = {
                                productlink: g_const_PageURL.GetLink(g_const_PageURL.ProductDetail, "&pid=" + product.productCodeKJT),
                                productpicture: g_GetPictrue(product.mainpicUrlKJT),
                                productlabel: product.promotionTypeKJT == "" ? "" : "<em>" + product.promotionTypeKJT + "</em>",
                                productname: product.productNameKJT,
                                productsku: function (product) {
                                    var html = "";
                                    for (var k = 0 ; k < product.standardAndStyleList.length; k++) {
                                        var productstyle = product.standardAndStyleList[k];
                                        var style = productstyle.standardAndStyleKey + ":" + productstyle.standardAndStyleValue;
                                        if (k == 0)
                                            html += style;
                                        else
                                            html += "<i>" + style + "</i>";
                                    }
                                    return html;
                                }(product),
                                productprice: product.priceKJT.toString(),
                                productbuycount: product.numberKJT
                            };
                            page_orderdetail.TotalProductCount += parseInt(product.numberKJT, 10);
                            if (product.noPassCustom == g_const_YesOrNo.YES.toString())
                                noPassCustom = true;


                            html2 += renderTemplate(stpl, pdata);
                        }
                        var data2 = {
                            ordertitle: html1,
                            orderproductlist: html2
                        }
                        var stpl2 = $("#tpl_order_Info").html();
                        html += renderTemplate(stpl2, data2);
                    }
                    return html;
                }
                else {
                    orderlist = msg.orderSellerList;

                    for (var k = 0; k < orderlist.length; k++) {
                        var product = orderlist[k];


                        var pdata = {
                            productlink: g_const_PageURL.GetLink(g_const_PageURL.ProductDetail, "&pid=" + product.productCode),
                            productpicture: g_GetPictrue(product.mainpicUrl),
                            productlabel: product.promotionType == "" ? "" : "<em>" + product.promotionType + "</em>",
                            productname: product.productName,
                            productsku: function () {
                                var html = "";
                                for (var p = 0 ; p < product.standardAndStyleList.length; p++) {
                                    var productstyle = product.standardAndStyleList[p];
                                    var style = productstyle.standardAndStyleKey + ":" + productstyle.standardAndStyleValue;
                                    if (p == 0)
                                        html += style;
                                    else
                                        html += "<i>" + style + "</i>";
                                }
                                return html;
                            }(),
                            productprice: product.price.toString(),
                            productbuycount: product.number
                        };
                        page_orderdetail.TotalProductCount += parseInt(product.number, 10);
                        html += renderTemplate(stpl, pdata);
                        if (product.noPassCustom == g_const_YesOrNo.YES.toString())
                            noPassCustom = true;
                    }
                    return html;
                }
            }(msg),
            ulclass: noPassCustom ? "closed" : ""
        };
        html = renderTemplate(stpl, data);
        $("#orderListInfo").html(html);

    },
    //产品总数
    TotalProductCount: 0,
    //渲染支付信息
    Render_order_pay: function (msg) {
        var html = "";
        var stpl = $("#tpl_order_pay").html();
        var data = {
            couponstyle: msg.orderActivityDetailsResult.length > 0 ? "" : "display:none",
            couponTitle: msg.orderActivityDetailsResult.length > 0 ? msg.orderActivityDetailsResult[0].activityType : "",
            couponplusOrMinus: msg.orderActivityDetailsResult.length > 0 ? (msg.orderActivityDetailsResult[0].plusOrMinus == 0 ? "-" : "+") : "",
            couponMoney: msg.orderActivityDetailsResult.length > 0 ? msg.orderActivityDetailsResult[0].preferentialMoney : "",
            tariffstyle: msg.tariffMoney == "" ? "display:none" : "",
            tariffMoney: msg.tariffMoney,
            freight: msg.freight.toString(),
            pay_type: g_pay_Type.GetPayTypeText(msg.pay_type),
            totalcount: page_orderdetail.TotalProductCount.toString(),
            orderamount: msg.order_money,
            telephoneSubtractionstyle: msg.telephoneSubtraction > 0 ? "" : "display:none",
            telephoneSubtraction: msg.telephoneSubtraction.toString(),
            czjAmtstyle: msg.czjAmt == "" ? "display:none" : "",
            zckAmtstyle: msg.zckAmt == "" ? "display:none" : "",
            fullSubstyle: msg.fullSubtraction == "" ? "display:none" : "",
            fullSubMoney: msg.fullSubtraction,
            czjAmtMoney: msg.czjAmt,
            zckAmtMoney: msg.zckAmt,
            buttonlist: function (order_code, orderButtonList) {
                var stpl = $("#tpl_orderbutton").html();
                var html = "";
                var data = {
                    buttonclass: "",
                    buttonoperate: "",
                    buttonorder: "",
                    btnname: ""
                };
                //if (IsDebug)
                //    order_status = g_const_orderStatus.DSH;
                $(orderButtonList).each(function () {
                    switch (this.buttonCode) {
                        case g_const_afterButtonCode.QXDD://取消订单
                            data.buttonclass = "";
                            data.btnname = "取消订单";
                            data.buttonoperate = g_const_OrderOperate.Cancel;
                            data.buttonorder = order_code;
                            html += renderTemplate(stpl, data);
                            break;
                        case g_const_afterButtonCode.FK://付款
                            data.buttonclass = "lj";
                            data.btnname = "立即付款";
                            data.buttonoperate = g_const_OrderOperate.Pay;
                            data.buttonorder = order_code;
                            html += renderTemplate(stpl, data);
                            break;
                        case g_const_afterButtonCode.QXFH://取消发货

                            break;
                        case g_const_afterButtonCode.CKWL://查看物流
                            data.buttonclass = "";
                            data.btnname = "查看物流";
                            data.buttonoperate = g_const_OrderOperate.Express;
                            data.buttonorder = order_code;
                            html += renderTemplate(stpl, data);
                            break;
                        case g_const_afterButtonCode.DHTH://电话退款
                            data.buttonclass = "";
                            data.btnname = "电话退款";
                            data.buttonoperate = g_const_OrderOperate.Refund;
                            data.buttonorder = order_code;
                            html += renderTemplate(stpl, data);
                            break;
                        case g_const_afterButtonCode.QRSH://确认收货
                            data.buttonclass = "lj";
                            data.btnname = "确认收货";
                            data.buttonoperate = g_const_OrderOperate.Delivered;
                            data.buttonorder = order_code;
                            html += renderTemplate(stpl, data);
                            break;
                        //case g_const_afterButtonCode.PJSD://评价晒单
                        //    data.buttonclass = "";
                        //    data.btnname = "评价晒单";
                        //    data.buttonoperate = g_const_OrderOperate.Comment;
                        //    data.buttonorder = order_code;
                        //    html += renderTemplate(stpl, data);
                        //    break;
                    }
                });

                //switch (order_status) {
                //    case g_const_orderStatus.DFK:
                //        data.buttonclass = "";
                //        data.btnname = "取消订单";
                //        data.buttonoperate = g_const_OrderOperate.Cancel;
                //        data.buttonorder = order_code;
                //        html += renderTemplate(stpl, data);

                //        data.buttonclass = "lj";
                //        data.btnname = "立即付款";
                //        data.buttonoperate = g_const_OrderOperate.Pay;
                //        data.buttonorder = order_code;
                //        html += renderTemplate(stpl, data);
                //        break;

                //    case g_const_orderStatus.DFH:
                //        data.buttonclass = "";
                //        data.btnname = "电话退款";
                //        data.buttonoperate = g_const_OrderOperate.Refund;
                //        data.buttonorder = order_code;
                //        html += renderTemplate(stpl, data);
                //        break;
                //    case g_const_orderStatus.DSH:
                //        data.buttonclass = "";
                //        data.btnname = "查看物流";
                //        data.buttonoperate = g_const_OrderOperate.Express;
                //        data.buttonorder = order_code;
                //        html += renderTemplate(stpl, data);
                //        data.buttonclass = "";
                //        data.btnname = "电话退款";
                //        data.buttonoperate = g_const_OrderOperate.Refund;
                //        data.buttonorder = order_code;
                //        html += renderTemplate(stpl, data);
                //        data.buttonclass = "lj";
                //        data.btnname = "确认收货";
                //        data.buttonoperate = g_const_OrderOperate.Delivered;
                //        data.buttonorder = order_code;
                //        html += renderTemplate(stpl, data);
                //        break;
                //    case g_const_orderStatus.JYCG:
                //    case g_const_orderStatus.YSH:
                //        data.buttonclass = "";
                //        data.btnname = "电话退款/售后";
                //        data.buttonoperate = g_const_OrderOperate.Refund;
                //        data.buttonorder = order_code;
                //        html += renderTemplate(stpl, data);
                //        data.buttonclass = "lj";
                //        data.btnname = "查看物流";
                //        data.buttonoperate = g_const_OrderOperate.Express;
                //        data.buttonorder = order_code;
                //        html += renderTemplate(stpl, data);
                //        break;
                //    case g_const_orderStatus.JYSB:
                //        data.buttonclass = "";
                //        data.btnname = "删除订单";
                //        data.buttonoperate = g_const_OrderOperate.Delete;
                //        data.buttonorder = order_code;
                //        html += renderTemplate(stpl, data);
                //        break

                //}
                return html;
            }(msg.order_code, msg.orderButtonList)
        }
        html = renderTemplate(stpl, data);
        $("#payInfo").html(html);

        $("#tipInfo").html(msg.failureTimeReminder);

        //按钮点击事件
        $("p.ft a").on("click", function () {
            var operate = $(this).attr("operate");
            var orderno = $(this).attr("orderno");
            page_orderdetail.selectOrderNo = orderno;
            switch (operate) {
                case g_const_OrderOperate.Refund:
                    ShowMesaage("客服电话：<strong>" + g_const_Phone.sh + "</strong>");
                    break;
                case g_const_OrderOperate.Cancel:
                    g_type_api.api_input = {
                        buyer_code: GetQueryString("buyer_code"),
                        order_code: orderno,
                        version: 1
                    };
                    g_type_api.api_target = "com_cmall_familyhas_api_ApiCancelOrderForFamily";
                    g_type_api.api_token = g_const_api_token.Wanted;
                    g_type_api.LoadData(function (msg) {
                        page_orderdetail.LoadOrderDetailData();
                        ShowMesaage("订单取消成功。");
                        g_const_PageURL.GoByMainIndex(g_const_PageURL.MyOrder_List, "", true);
                    }, "");
                    break;
                case g_const_OrderOperate.Delete:
                    g_type_api.api_input = {
                        orderCode: orderno,
                        version: 1
                    };
                    g_type_api.api_target = "com_cmall_familyhas_api_ApiForOrderDelete";
                    g_type_api.api_token = g_const_api_token.Wanted;
                    g_type_api.LoadData(function (msg) {
                        page_orderdetail.LoadOrderDetailData();
                        ShowMesaage("订单删除成功。");
                        g_const_PageURL.GoByMainIndex(g_const_PageURL.MyOrder_List, "", true);
                    }, "");
                    break;
                case g_const_OrderOperate.Delivered:
                    g_type_api.api_input = {
                        buyer_code: GetQueryString("buyer_code"),
                        order_code: orderno,
                        version: 1
                    };
                    g_type_api.api_target = "com_cmall_familyhas_api_ApiConfirmReceiveForFamily";
                    g_type_api.api_token = g_const_api_token.Wanted;
                    g_type_api.LoadData(function (msg) {
                        page_orderdetail.LoadOrderDetailData();
                        ShowMesaage("确认收货成功。");
                    }, "");
                    break;
                case g_const_OrderOperate.Express:
                    g_const_PageURL.GoByMainIndex(g_const_PageURL.MyOrder_List_ckwl, "&orderno=" + orderno, true);
                    break;
                case g_const_OrderOperate.Pay:
                    var objdata = {
                        action: "orderpaycheck",
                        orderno: orderno
                    }
                    g_type_self_api.LoadData(objdata, function (msg) {
                        var orderinfo = {
                            OrderNo: page_orderdetail.selectOrderNo,
                            Paygate: 0
                        };
                        localStorage[g_const_localStorage.OrderInfo] = JSON.stringify(orderinfo);
                        g_const_PageURL.GoByMainIndex(g_const_PageURL.OrderPay, "");
                    }, "");

                    break;
                case g_const_OrderOperate.Comment:
                    g_const_PageURL.GoByMainIndex(g_const_PageURL.Comment, "&orderno=" + orderno + "&s=d", true);
                    break;
            }
        });
    },
    selectOrderNo: GetQueryString("orderno")
};