

//滑动屏幕加载数据
var _PageNo = 0;
var _stop = true;
var OrderStr = "";
var _paytype = "";
var _maxPage = 0;

function pageSelect(page_id, jq) {
    if (_maxPage > page_id) {
        _PageNo = page_id;
        $('#loadTip').show();
        MyMobileCZ_Order_List.GetList();
    }
}

 

function gotourlaa(id) {
    if (id == "qcz") {//去充值
        PageUrlConfig.SetUrl();
        window.location.href = g_const_PageURL.MainIndex + "?u=" + g_const_PageURL.GetKey(g_const_PageURL.MobileCZ) + "&t=" + Math.random();;
    }
    //else if (id == "sc") {
    //    PageUrlConfig.SetUrl();
    //    window.location.href = g_const_PageURL.MyCollection + "?t=" + Math.random();
    //}
}

//确认层回调方法
function CancelOrder() {
    switch ($("#sel_btn_name").val()) {
        case "qxdd"://取消订单按钮弹出的
            //调用接口，删除订单，重新加载
            MyOrder.Cancelorder();
            break;
        case "del"://取消订单按钮弹出的
            //调用接口，删除订单，重新加载
            MyOrder.Deleteorder();
            break;
        case "tksh"://退款售后按钮弹出的
            //拨打电话
            window.location = "tel:" + g_const_Phone.sh + "#mp.weixin.qq.com";

            return false;
            break;

    }
}

//各种状态下按钮操作
function btncaozuo(btnname, order_code, order_money) {
    $("#sel_btn_name").val(btnname);
    switch (btnname) {
        case "qxdd"://取消订单
            $("#sel_order_code").val(order_code);

            ConfirmMessage("确定要取消订单吗？", fbox_ftel, CancelOrder, "取消", "确定");

            break;
        case "del"://取消订单
            $("#sel_order_code").val(order_code);

            ConfirmMessage("确定要删除订单吗？", fbox_ftel, CancelOrder, "取消", "确定");

            break;
        case "tksh"://退款售后
            ConfirmMessage("提示:确定拨打电话" + g_const_Phone.sh + "？", fbox_ftel, CancelOrder, "取消", "确定");

            break;
        case "qfk"://去付款
            PageUrlConfig.SetUrl();
         //   window.location.href = g_const_PageURL.MyMobileCZOrder_pay + "?order_code=" + order_code + "&order_money=" + order_money + "&t=" + Math.random();
            window.location.href = g_const_PageURL.MainIndex + "?u=" + g_const_PageURL.GetKey(g_const_PageURL.MyMobileCZOrder_pay) + "&order_code=" + order_code + "&order_money=" + order_money + "&t=" + Math.random();
            break;


    }
}

//订单状态切换
function SelOrderStatus(selstr) {
    switch (selstr) {
        case "":
            $(".order-menu").html("充值订单");
            $("#sel_order_status").val("");
            break;
        case g_const_mobilecz_orderStatus.DZF:
            $(".order-menu").html("待付款");
            $("#sel_order_status").val(g_const_mobilecz_orderStatus.DZF);
            break;
        case g_const_mobilecz_orderStatus.DCZ:
            $(".order-menu").html("待充值");
            $("#sel_order_status").val(g_const_mobilecz_orderStatus.DCZ);
            break;
        case g_const_mobilecz_orderStatus.CZCG:
            $(".order-menu").html("充值成功");
            $("#sel_order_status").val(g_const_mobilecz_orderStatus.CZCG);
            break;
        case g_const_mobilecz_orderStatus.CZSB:
            $(".order-menu").html("充值失败");
            $("#sel_order_status").val(g_const_mobilecz_orderStatus.CZSB);
            break;
    }
    //重新查询默认第一页
    $("#sel_nextPage").val("1")
    $(".order-menu-list").hide();
    $('.order-menu').removeClass('menu-curr');

    //我的订单
    MyMobileCZ_Order_List.GetList();
}


//我的订单列表
var MyMobileCZ_Order_List = {
    MenuName: "充值订单",
    Init: function () {
        
        AccountMenu.ShowMenu("div.home ul.fl", "#tpl_menu", MyMobileCZ_Order_List.MenuName);
        $("#sel_nextPage").val("1");
        //我的订单
        MyMobileCZ_Order_List.GetList();
    },

    //加载多页
    GetListByPage: function () {

        var all_sel_order_list = "";
        var _LasePageNo = $("#sel_nextPage").val();
        //for (var pageno = 1; parseInt(pageno) <= parseInt(_LasePageNo) ; pageno = parseInt(pageno) + 1) {
        //赋值
        //MyMobileCZ_Order_List.api_input.nextPage = _PageNo;
        //MyMobileCZ_Order_List.api_input.order_status = $("#sel_order_status").val();

        var purl = "/Ajax/MobileCZAPI.aspx";;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "action=getmobileczorder&t=" + Math.random() + "&status=" + $("#sel_order_status").val() + "&page=" + _PageNo + "&pagesize=10&ordercol=id&ordertype=desc",
            type: "POST",
            dataType: "text"
        });
        //正常返回
        request.done(function (msg) {
            if (msg == "缺少参数") {
                ShowMesaage("缺少参数");
                return;
            }
            else {
                msg = JSON.parse(msg);
                
                if (msg.resultcode == "80") {
                    //Session失效，重新登录，传递回调地址
                    PageUrlConfig.SetUrl();
                    UserRELogin.login(g_const_PageURL.MobileCZList + "?paytype=" + _paytype);
                        return;
                    }
                if (msg.resultcode == "90") {
                        ShowMesaage(msg.resultmessage);
                        return;
                    }
               

                    if (msg.resultcode == "1") {
                    var temp_OrderStr = "";
                    $("#hid_sumpage").val(msg.countPage);
                    if (msg.countPage == 0) {
                        $("#MyOrder_list_article").attr("class", "no-data");
                        //没有数据
                        var emptyStr = "<article class=\"my-order\">"
                             + "<div class=\"order-nodata\">"
                                 + "<p>暂无该状态的订单信息<br></p>"
                                 + "<div class=\"order-nodata-btn\">"
                                     + "<a id=\"btnqgg\" onclick=\"gotourlaa('qcz')\">去充值</a>"
                                 + "</div>"
                             + "</div>"
                         + "</article>";
                        $("#waitdiv").hide();
                        $(".my-order").html(emptyStr);
                    }
                    else {
                        $("#MyOrder_list_article").attr("class", "my-order pb-55");

                        temp_OrderStr = MyMobileCZ_Order_List.Load_Result(msg);
                        $("#waitdiv").hide();
                        //追加下一页页全部内容
                        $(".my-order-list").append(temp_OrderStr);

                    }
                }
                else {
                    ShowMesaage(msg.resultMessage);
                }
            }
        });
        //接口异常
        request.fail(function (jqXHR, textStatus) {
            $("#waitdiv").hide();
            ShowMesaage(g_const_API_Message["7001"]);
        });
        //}

    },
    //加载单页
    GetList: function () {
        //赋值
        //MyMobileCZ_Order_List.api_input.nextPage = $("#sel_nextPage").val();
        //MyMobileCZ_Order_List.api_input.order_status = $("#sel_order_status").val();

        var purl = "/Ajax/MobileCZAPI.aspx";;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "action=getmobileczorder&t=" + Math.random() + "&status=" + $("#sel_order_status").val() + "&page=" + _PageNo + "&pagesize=10&ordercol=id&ordertype=desc",
            type: "POST",
            dataType: "text"
        });
        //正常返回
        request.done(function (msg) {
            msg = JSON.parse(msg);
                
                if (msg.resultcode == "80") {
                    Message.ShowToPage("", g_const_PageURL.MainIndex + "?u=" + g_const_PageURL.GetKey(g_const_PageURL.Login), 500, "");
                    return;
                }
                if (msg.resultcode == "90") {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
           

                if (msg.resultcode == "1") {
                    OrderStr = "";
                //隐藏下拉回调层
                $("#hid_sumpage").val(msg.countPage);
                if (msg.countPage == 0) {
                    $("#MyOrder_list_article").attr("class", "no-data");

                    //没有数据
                   // var emptyStr = "<p class=\"wu\">暂无订单！</p>"
			                 //+ "<div class=\"no-data-btn\">"
                                 //+ " <a id=\"btnqgg\" onclick=\"gotourlaa('qcz')\">去充值</a>"
                    //+ "</div>";

                    var emptyStr = "<p class=\"collectionwu\"><img src=\"/img/wu_bg.png\" alt=\"\"\>暂无订单~<a id=\"btnqgg\" onclick=\"gotourlaa('qcz')\">去充值</a></p>";
                    $("#my_order_list_str").html(emptyStr);

                }
                else {



                    OrderStr += MyMobileCZ_Order_List.Load_Result(msg);
                    OrderStr += "<p class=\"pag\"><span id=\"PaginationTB\"></span><span id=\"PageSet\"></span></p>";
                    _maxPage = msg.countPage;
                    $("#my_order_list_str").html(OrderStr);
                    FormatTB(msg.RowsCount, 10, _PageNo, pageSelect);
                    
                }
                $("#loadTip").hide();
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
    Load_Result: function (resultlist, pageno) {
        //组织商品列表
        var OrderStrTemp;
        var OrderStr_t = "";
        $.each(resultlist.ResultTable, function (i, n) {
            //每个订单的商品信息
            OrderStrTemp = MyMobileCZ_Order_List.Load_apiSellerList(n);

            OrderStr_t += OrderStrTemp;
        });

        return OrderStr_t;

    },
    //每个订单的商品信息
    Load_apiSellerList: function (resultlist) {
        var temp = "";

        var order_statusTemp = "";
        var kgks = "";//规格款式
        var payShow = "";//订单下方按钮

        switch (resultlist.status) {
            case "0":
            case "10":
                order_statusTemp = "待付款";
                break;
            case "110":
            case "190":
                order_statusTemp = "待充值";
                break;
            case "1":
                order_statusTemp = "交易成功";
                break;
            case "3":
                order_statusTemp = "交易关闭";
                break;
            case "200":
            case "100":
                order_statusTemp = "交易失败";
                break;
        }
        var totalnum = 0;
        //temp = "<li>"
        //    + "<h3 class=\"order-number\"><em class=\"fl\">订单号:" + resultlist.orderno + "</em><i class=\"fr\">" + order_statusTemp + "</i></h3>";
        //temp += "<div class=\"order-price\">充值手机号：<i>" + resultlist.czmobile + "</i><span>面额:<i>" + resultlist.ordermoney + "</i></span></div>"
        //+ "<div class=\"order-service\">";
        ////根据状态显示不同内容
        //switch (resultlist.status) {
        //    case "0"://待付款
        //        payShow = "<a class=\"receipt\"  onclick=\"btncaozuo('qfk','" + resultlist.orderno + "','" + resultlist.ordermoney + "');\">付款</a>";
        //        break;
        //    case "110"://待充值
        //    case "190":
        //        payShow = "<a id=\"btn_tksh\">充值中</a>";
        //        break;
        //    case "1":
        //        payShow = "<a id=\"btn_tksh\" >充值成功</a>";
        //        break;
        //    case "200":
        //        payShow = "<a id=\"btn_tksh\" >充值失败</a>";
        //        break;

        //}

        //temp += payShow;
        //temp += "</div></li>";


        ////////////////////
        //根据状态显示不同内容
        var qq = "";
        var strRefund = "";
        switch (resultlist.status) {
            case "0"://待付款
            case "10"://待付款
                payShow = "<a class=\"\"  onclick=\"btncaozuo('qxdd','" + resultlist.orderno + "','" + resultlist.ordermoney + "');\">取消订单</a> <a class=\"lj\"  onclick=\"btncaozuo('qfk','" + resultlist.orderno + "','" + resultlist.ordermoney + "');\">付款</a>";
                qq="待付款";
                break;
            case "110"://待充值
            case "190":
                //payShow = "<a id=\"btn_tksh\">充值中</a>";
                qq="充值中";
                break;
            case "1":
                //payShow = "<a id=\"btn_tksh\" >充值成功</a>";
                qq = "交易成功";
                break;
            //case "100":
            //    //payShow = "<a id=\"btn_tksh\" >充值失败</a>";
            //    payShow = "<a class=\"\"  onclick=\"btncaozuo('del','" + resultlist.orderno + "','" + resultlist.ordermoney + "');\">删除订单</a>";
            //    qq = "交易失败";
            //    break;
            //case "100":
            //    //payShow = "<a id=\"btn_tksh\" >充值失败</a>";
            //    payShow = "<a class=\"\"  onclick=\"btncaozuo('del','" + resultlist.orderno + "','" + resultlist.ordermoney + "');\">删除订单</a>";
            //    qq = "已退款";
            //    break;
            case "3":
            case "20":
            case "90":
            case "100":
            case "95":
            case "200":
                if (resultlist.status=="200") {
                    strRefund = "退款中";
                } else if (resultlist.status == "20") {
                    strRefund = "退款中";
                } else if (resultlist.status == "90") {
                    strRefund = "退款中";
                } else if (resultlist.status == "100") {
                    strRefund = "退款成功";
                } else if (resultlist.status == "95") {
                    strRefund = "退款失败";
                }
                payShow = "<a class=\"\"  onclick=\"btncaozuo('del','" + resultlist.orderno + "','" + resultlist.ordermoney + "');\">删除订单</a>";
                qq = "交易关闭";
                break;
        }
        var tt = resultlist.memo;//GetallChzAmountbymobile(resultlist.czmobile);
        var ord = resultlist.orderno.split('-');
        if (ord.length > 1) {
            ord = ord[1];
        }
        else {
            ord = ord[0];
        }
        var productImg = "/img/hfcz.jpg";
        if (resultlist.memo.indexOf('联通')>-1) {
            productImg = "/img/1.png";
        }
        else if (resultlist.memo.indexOf('移动') > -1) {
            productImg = "/img/2.png";
        }
        else if (resultlist.memo.indexOf('电信') > -1) {
            productImg = "/img/3.png";
        }
        else {
            productImg = "/img/hfcz.jpg";
        }
        var productType = "话费";
        var productCss = "bill_class_01";
        if (resultlist.memo.indexOf('话费')>-1) {
            productType = "话费";
            productCss = "bill_class_01";
        }
        else {
            productType = "流量";
            productCss = "bill_class_02";
        }

        temp =

            "<h2><span>下单时间： " + resultlist.datatime + "<a href=\"" + g_const_PageURL.MainIndex + "?u=" + g_const_PageURL.GetKey(g_const_PageURL.MobileCZDetail) + "&order_code=" + resultlist.orderno + "&t=" + Math.random() + "\" target=\"_blank\" style=\"cursor:pointer\">订单详情</a></span>订单号：" + ord + "<i>" + qq + "</i></h2>"
                    +"<ul class=\"\" module=\"202071\">"
                        +"<li>"
                            + "<a style=\"cursor:default\">"
                                + "<img src=" + productImg + " width=\"90\" height=\"90\"><i class=" + productCss + ">" + productType + "</i>"
                                + "<b>" + tt + "</b>"
                                + "<p>充值手机号："
                                + (resultlist.czmobile.substr(0, 3) + "****" + resultlist.czmobile.substr(7, 4)) + "</p>"
                                + "<span>￥" + resultlist.paymoney + "<em>x1</em></span>"
                                + "<b class=\"del_state\">" + strRefund + "</b>"
                            +"</a>"
                        +"</li>"
                    +"</ul>"
                    + "<p class=\"ft\">共<i>1</i>件<span>实付款：<em>￥" + resultlist.paymoney + "</em></span>" + payShow + "</p>"


        return temp;
    },
    //下拉回调
    ScollDownCallBack: function (resultlist) {
        selstr = $("#sel_order_status").val();
        switch (selstr) {
            case "":
                $(".order-menu").html("全部订单");
                $("#sel_order_status").val("");
                break;
            case g_const_mobilecz_orderStatus.DZF:
                $(".order-menu").html("待付款");
                $("#sel_order_status").val(g_const_mobilecz_orderStatus.DZF);
                break;
            case g_const_mobilecz_orderStatus.DCZ:
                $(".order-menu").html("待充值");
                $("#sel_order_status").val(g_const_mobilecz_orderStatus.DCZ);
                break;
            case g_const_mobilecz_orderStatus.CZCG:
                $(".order-menu").html("充值成功");
                $("#sel_order_status").val(g_const_mobilecz_orderStatus.CZCG);
                break;
            case g_const_mobilecz_orderStatus.CZSB:
                $(".order-menu").html("充值失败");
                $("#sel_order_status").val(g_const_mobilecz_orderStatus.CZSB);
                break;
        }
        //重新查询默认第一页
        $("#sel_nextPage").val("1")
        $(".order-menu-list").hide();

        //我的订单数量
        MyMobileCZOrder_Num.GetList();
        //我的订单
        MyMobileCZ_Order_List.GetList();

    },

    //接口返回失败后的处理
    Load_ResultErr: function (resultlist) {
    },
};



////点击商品区域，跳转
function GoToOrderDetail(order_code) {
        PageUrlConfig.SetUrl();
        //location = g_const_PageURL.MyOrder_detail + "?order_code=" + order_code + "&paytype=" + $("#sel_order_status").val();
        window.location.href = g_const_PageURL.MainIndex + "?u=" + g_const_PageURL.GetKey(g_const_PageURL.MobileCZDetail) + "&order_code=" + order_code + "&t=" + Math.random();


}

var MyOrder = {
    Cancelorder: function () {
        var purl = "/Ajax/MobileCZAPI.aspx";
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "action=cancelorder&t=" + Math.random() + "&orderno=" + $("#sel_order_code").val(),
            type: "POST",
            dataType: "text"
        });
        //正常返回
        request.done(function (msg) {
            if (msg == "需登录") {
                Message.ShowToPage("", g_const_PageURL.MainIndex + "?u=" + g_const_PageURL.GetKey(g_const_PageURL.Login), 500, "");
                return;
            }
            else if (msg == "缺少参数") {
                ShowMesaage("缺少参数");
                return;
            }

            else {
                ShowMesaage(msg);
                $("#loadTip").show();
                MyMobileCZ_Order_List.GetList();
                
            }
        });
        //接口异常
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Deleteorder: function () {
        var purl = "/Ajax/MobileCZAPI.aspx";
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "action=deleteorder&t=" + Math.random() + "&orderno=" + $("#sel_order_code").val(),
            type: "POST",
            dataType: "text"
        });
        //正常返回
        request.done(function (msg) {
            if (msg == "需登录") {
                Message.ShowToPage("", g_const_PageURL.MainIndex + "?u=" + g_const_PageURL.GetKey(g_const_PageURL.Login), 500, "");
                return;
            }
            else if (msg == "缺少参数") {
                ShowMesaage("缺少参数");
                return;
            }

            else {
                ShowMesaage(msg);
                $("#loadTip").show();
                MyMobileCZ_Order_List.GetList();
            }
        });
        //接口异常
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
};