/// <reference path="../functions/AccountMenu.js" />
/// <reference path="../functions/g_Const.js" />
/// <reference path="../functions/g_Type.js" />
/// <reference path="../jquery-2.1.4.js" />
/// <reference path="../g_header.js" />
var page_myorderlist = {
    MenuName: "我的订单",
    Init: function () {
        AccountMenu.ShowMenu("div.home ul.fl", "#tpl_menu", page_myorderlist.MenuName);

        //获取页面跳转查询的订单状态
        var orderStatu = GetQueryString("s");

        if (!orderStatu) {
            page_myorderlist.LoadNavData(g_const_orderStatus.ALL);
            page_myorderlist.LoadOrderInfoData(g_const_orderStatus.ALL);
        }
        else {
            //根据跳转状态显示不同订单的数据和nav
            page_myorderlist.SelectOrderStatus = g_const_orderStatus[orderStatu];
            page_myorderlist.LoadNavData(g_const_orderStatus[orderStatu]);
            page_myorderlist.LoadOrderInfoData(g_const_orderStatus[orderStatu]);
        }

    },
    PageNavigation: function (pageno, jq) {
        page_myorderlist.curPage = parseInt(pageno.toString(), 10) + 1;
        page_myorderlist.LoadOrderInfoData($("#nav .curr").attr("data-status"));
    },
    //查询的订单状态
    SelectOrderStatus: "",
    //获取导航数据
    LoadNavData: function () {
        g_type_api.api_input = {
            buyer_code: "",
            version: 1,
            channelId : g_const_ChannelID
        }
        g_type_api.api_target = "com_cmall_familyhas_api_ApiOrderNumber";
        g_type_api.api_token = g_const_api_token.Wanted;
        g_type_api.LoadData(page_myorderlist.AfterLoadNavData, "");
    },
    AfterLoadNavData: function (msg) {
        var navhtml = "";
        var stpl = $("#tpl_orderstatus_nav").html();
        var totalcount = 0;
        var selled = 0;
        var order_StatusList = ["4497153900010001", "4497153900010002", "4497153900010003", "4497153900010005", "4497153900010006"];
        for (var j = 0; j < order_StatusList.length; j++) {
            for (var k = 0; k < msg.list.length; k++) {
                var OrderStateNumberResult = msg.list[k];
                if (order_StatusList[j] == OrderStateNumberResult.orderStatus) {
                    totalcount += parseInt(OrderStateNumberResult.number, 10);
                    if (!(OrderStateNumberResult.orderStatus == g_const_orderStatus.YSH || OrderStateNumberResult.orderStatus == g_const_orderStatus.JYWX)) {
                        var data = {
                            navclass: page_myorderlist.SelectOrderStatus == OrderStateNumberResult.orderStatus ? "curr" : "",
                            orderstatus: OrderStateNumberResult.orderStatus,
                            orderstatustext: g_const_orderStatus.GetStatusText(OrderStateNumberResult.orderStatus),
                            ordercount: OrderStateNumberResult.number
                        };
                        navhtml += renderTemplate(stpl, data);
                    }
                    break;
                }
                
            }
        }
        for (var k = 0; k < msg.list.length; k++) {
            if (msg.list[k].orderStatus == "4497153900010107") {
                selled = parseInt(msg.list[k].number, 10);
            }
        }
        if (msg.otherOrderNumber) {
            totalcount += parseInt(msg.otherOrderNumber, 10);
        }
        totalcount += selled;
        var data = {
            navclass: page_myorderlist.SelectOrderStatus == g_const_orderStatus.ALL ? "curr" : "",
            orderstatus: g_const_orderStatus.ALL,
            orderstatustext: g_const_orderStatus.GetStatusText(g_const_orderStatus.ALL),
            ordercount: totalcount.toString()
        };
        var firstnavhtml = renderTemplate(stpl, data);
        navhtml = firstnavhtml + navhtml;
        $("#nav").html(navhtml);

        $("#nav li").on("click", function () {
            $("#nav li").removeClass("curr");
            $(this).addClass("curr");
            $("#u_cont").empty();
            page_myorderlist.curPage = 1;
            page_myorderlist.LoadOrderInfoData($(this).attr("data-status"));
        });


    },
    //获取订单数据
    LoadOrderInfoData: function (orderstatus) {
        page_myorderlist.SelectOrderStatus = orderstatus;
        g_type_api.api_input = {
            nextPage: page_myorderlist.curPage.toString(),
            buyer_code: "",
            order_status: orderstatus,
            version: 1
        }
        g_type_api.api_target = "com_cmall_familyhas_api_ApiOrderList";
        g_type_api.api_token = g_const_api_token.Wanted;
        g_type_api.LoadData(page_myorderlist.AfterLoadOrderInfoData, "");

    },
    AfterLoadOrderInfoData: function (msg) {
        page_myorderlist.curPage = msg.nowPage;
        var stpl_product = $("#tpl_orderproductlist").html();
        var stpl_order = $("#tpl_orderlist").html();
        var stpl = $("#tpl_orderinfo").html();
        var producthtml = "";
        var orderhtml = "";
        var html = "";
        console.log(msg.sellerOrderList);
        //订单信息
        if (msg.sellerOrderList.length == 0) {
            orderhtml = "<p class=\"wu\">暂无订单！</p>";
        }
        else {
            for (var i = 0; i < msg.sellerOrderList.length; i++) {
                var sellerOrder = msg.sellerOrderList[i];
                var noPassCustom = false;
                producthtml = "";
                for (var j = 0; j < sellerOrder.apiSellerList.length; j++) {
                    var product = sellerOrder.apiSellerList[j];
                    var pdata = {
                        productlink: g_const_PageURL.GetLink(g_const_PageURL.ProductDetail, "&pid=" + product.product_code),
                        productpicture: g_GetPictrue(product.mainpic_url),
                        productlabel: product.labels == "" ? "" : "<em>" + product.labels + "</em>",
                        productname: product.product_name,
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
                        productprice: product.sell_price,
                        productbuycount: product.product_number
                    };
                    producthtml += renderTemplate(stpl_product, pdata);
                    if (product.noPassCustom == g_const_YesOrNo.YES.toString())
                        noPassCustom = true;
                }

                var odata = {
                    ordertime: sellerOrder.create_time,
                    orderno: sellerOrder.order_code,
                    orderstatus: g_const_orderStatus.GetStatusText(sellerOrder.order_status),
                    ulclass: noPassCustom ? "closed" : "",
                    productlist: producthtml,
                    totalcount: sellerOrder.orderStatusNumber.toString(),
                    orderamount: sellerOrder.due_money.toString(),
                    orderdetaillink: g_const_PageURL.GetLink(g_const_PageURL.MyOrder_detail, "&orderno=" + sellerOrder.order_code),
                    orderbutton: function (sellerOrder) {
                        var stpl = $("#tpl_orderbutton").html();
                        var html = "";
                        var data = {
                            buttonclass: "",
                            buttonoperate: "",
                            buttonorder: "",
                            btnname: ""
                        };
                        //if (IsDebug)
                        //    sellerOrder.order_status = g_const_orderStatus.DSH;
                        $(sellerOrder.orderButtonList).each(function () {
                            switch (this.buttonCode) {
                                case g_const_afterButtonCode.QXDD://取消订单
                                    data.buttonclass = "";
                                    data.btnname = "取消订单";
                                    data.buttonoperate = g_const_OrderOperate.Cancel;
                                    data.buttonorder = sellerOrder.order_code;
                                    html += renderTemplate(stpl, data);
                                    break;
                                case g_const_afterButtonCode.FK://付款
                                    data.buttonclass = "lj";
                                    data.btnname = "立即付款";
                                    data.buttonoperate = g_const_OrderOperate.Pay;
                                    data.buttonorder = sellerOrder.order_code;
                                    html += renderTemplate(stpl, data);
                                    break;
                                case g_const_afterButtonCode.QXFH://取消发货

                                    break;
                                case g_const_afterButtonCode.CKWL://查看物流
                                    data.buttonclass = "";
                                    data.btnname = "查看物流";
                                    data.buttonoperate = g_const_OrderOperate.Express;
                                    data.buttonorder = sellerOrder.order_code;
                                    html += renderTemplate(stpl, data);
                                    break;
                                case g_const_afterButtonCode.DHTH://电话退款
                                    data.buttonclass = "";
                                    data.btnname = "电话退款";
                                    data.buttonoperate = g_const_OrderOperate.Refund;
                                    data.buttonorder = sellerOrder.order_code;
                                    html += renderTemplate(stpl, data);
                                    break;
                                case g_const_afterButtonCode.QRSH://确认收货
                                    data.buttonclass = "lj";
                                    data.btnname = "确认收货";
                                    data.buttonoperate = g_const_OrderOperate.Delivered;
                                    data.buttonorder = sellerOrder.order_code;
                                    html += renderTemplate(stpl, data);
                                    break;
                                case g_const_afterButtonCode.PJSD://评价晒单
                                    data.buttonclass = "";
                                    data.btnname = "评价晒单";
                                    data.buttonoperate = g_const_OrderOperate.Comment;
                                    data.buttonorder = sellerOrder.order_code;
                                    html += renderTemplate(stpl, data);
                                    break;
                            }
                        });
                        //switch (sellerOrder.order_status) {
                        //    case g_const_orderStatus.DFK:
                        //        data.buttonclass = "";
                        //        data.btnname = "取消订单";
                        //        data.buttonoperate = g_const_OrderOperate.Cancel;
                        //        data.buttonorder = sellerOrder.order_code;
                        //        html += renderTemplate(stpl, data);

                        //        data.buttonclass = "lj";
                        //        data.btnname = "立即付款";
                        //        data.buttonoperate = g_const_OrderOperate.Pay;
                        //        data.buttonorder = sellerOrder.order_code;
                        //        html += renderTemplate(stpl, data);
                        //        break;

                        //    case g_const_orderStatus.DFH:
                        //        data.buttonclass = "";
                        //        data.btnname = "电话退款";
                        //        data.buttonoperate = g_const_OrderOperate.Refund;
                        //        data.buttonorder = sellerOrder.order_code;
                        //        html += renderTemplate(stpl, data);
                        //        break;
                        //    case g_const_orderStatus.DSH:
                        //        data.buttonclass = "";
                        //        data.btnname = "查看物流";
                        //        data.buttonoperate = g_const_OrderOperate.Express;
                        //        data.buttonorder = sellerOrder.order_code;
                        //        html += renderTemplate(stpl, data);
                        //        data.buttonclass = "";
                        //        data.btnname = "电话退款";
                        //        data.buttonoperate = g_const_OrderOperate.Refund;
                        //        data.buttonorder = sellerOrder.order_code;
                        //        html += renderTemplate(stpl, data);
                        //        data.buttonclass = "lj";
                        //        data.btnname = "确认收货";
                        //        data.buttonoperate = g_const_OrderOperate.Delivered;
                        //        data.buttonorder = sellerOrder.order_code;
                        //        html += renderTemplate(stpl, data);
                        //        break;
                        //    case g_const_orderStatus.JYCG:
                        //    case g_const_orderStatus.YSH:
                        //        data.buttonclass = "";
                        //        data.btnname = "电话退款/售后";
                        //        data.buttonoperate = g_const_OrderOperate.Refund;
                        //        data.buttonorder = sellerOrder.order_code;
                        //        html += renderTemplate(stpl, data);
                        //        data.buttonclass = "lj";
                        //        data.btnname = "查看物流";
                        //        data.buttonoperate = g_const_OrderOperate.Express;
                        //        data.buttonorder = sellerOrder.order_code;
                        //        html += renderTemplate(stpl, data);
                        //        break;
                        //    case g_const_orderStatus.JYSB:
                        //        data.buttonclass = "";
                        //        data.btnname = "删除订单";
                        //        data.buttonoperate = g_const_OrderOperate.Delete;
                        //        data.buttonorder = sellerOrder.order_code;
                        //        html += renderTemplate(stpl, data);
                        //        break

                        //}
                        return html;
                    }(sellerOrder)
                };
                orderhtml += renderTemplate(stpl_order, odata);
            }
        }

        //分页信息
        var pagehtml = $("#tpl_page").html();
        if (msg.sellerOrderList.length == 0)
            pagehtml = "";
        var data = {
            OrderInfo: orderhtml,
            PageInfo: pagehtml
        };

        html = renderTemplate(stpl, data);
        $("#u_cont").html(html);
        //设置分页信息
        FormatTB(msg.countPage * page_myorderlist.PageSize, page_myorderlist.PageSize, (page_myorderlist.curPage - 1), page_myorderlist.PageNavigation);

        //按钮点击事件
        $("p.ft a").on("click", function () {
            var operate = $(this).attr("operate");
            var orderno = $(this).attr("orderno");
            page_myorderlist.selectOrderNo = orderno;
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
                        page_myorderlist.LoadOrderInfoData(page_myorderlist.SelectOrderStatus);
                        page_myorderlist.LoadNavData(page_myorderlist.SelectOrderStatus);
                        ShowMesaage("订单取消成功。");
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
                        page_myorderlist.LoadOrderInfoData(page_myorderlist.SelectOrderStatus);
                        page_myorderlist.LoadNavData(page_myorderlist.SelectOrderStatus);
                        ShowMesaage("订单删除成功。");
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
                        page_myorderlist.LoadOrderInfoData(page_myorderlist.SelectOrderStatus);
                        page_myorderlist.LoadNavData(page_myorderlist.SelectOrderStatus);
                        ShowMesaage("确认收货成功。");
                    }, "");
                    break;
                case g_const_OrderOperate.Express:
                    g_const_PageURL.GoByMainIndex(g_const_PageURL.MyOrder_List_ckwl, "&orderno=" + orderno, false);
                    break;
                case g_const_OrderOperate.Pay:
                    var objdata = {
                        action: "orderpaycheck",
                        orderno: orderno
                    }
                    g_type_self_api.LoadData(objdata, function (msg) {
                        var orderinfo = {
                            OrderNo: page_myorderlist.selectOrderNo,
                            Paygate: 0
                        };
                        localStorage[g_const_localStorage.OrderInfo] = JSON.stringify(orderinfo);
                        g_const_PageURL.GoByMainIndex(g_const_PageURL.OrderPay, "");
                    }, "");

                    break;
                case g_const_OrderOperate.Comment:
                    g_const_PageURL.GoByMainIndex(g_const_PageURL.Comment, "&orderno=" + orderno, true);
                    break;
            }
        });


    },
    //当前页
    curPage: 1,
    //要操作的订单号
    selectOrderNo: "",
    //每页记录数
    PageSize: 10
};