

var page_MobileChz_Order = {
    //是否输入框获得焦点
    InputFocus: false,
    //初始化
    Init: function () {
        //var cType = ClientType.GetClientType();
        //if (cType == ClientType.JYH_Android || cType == ClientType.JYH_iOS) {
        //    //清除登录状态
        //    page_MobileChz_Order.Logout();
        //    //隐藏头部
        //    UseAppFangFa.CaoZuo('hidehead');
        //}

        //流量、资金点击
        $("ul.CZ_type li").on("click", page_MobileChz_Order.ProductTypeChange);
        $("ul.CZ_type li[productType='00001']").click();
        //手机号输入
        $("#chz_mobilephone_number").on("input propertychange", page_MobileChz_Order.OnTextChange);
        $("#chz_mobilephone_number").on("focus", function () {
            page_MobileChz_Order.InputFocus = true;
            page_MobileChz_Order.OpenHistory();
        });
        $("#chz_mobilephone_number").on("blur", function () {
            //console.log($(".re_history").css("display"));       
            page_MobileChz_Order.InputFocus = false;
            //if ($(".re_history").css("display") === "none" && $("#btn_chz_mobilephone_number_clear").css("display") === "none") {
            //    page_MobileChz_Order.InputFinish();
            //}
        });
        //取消输入
        //$("span.cancel").on("click", function () {
        //    page_MobileChz_Order.InputFinish();
        //    page_MobileChz_Order.CloseHistory();
        //});

        //重置按钮点击
        $("#btn_chz").on("click", function () {
            if ($(this).hasClass("gray"))
                return;
            var selectproduct = $("#balanceList li.curr");
            if (selectproduct.length == 0) {
                ShowMesaage("请选择您要充值的产品。");
                return;
            }
            //生成订单
            UserLogin.Check(page_MobileChz_Order.CreateOrder);
        });
        $("#btn_chz_mobilephone_number_clear").on("click", function () {
            $("#chz_mobilephone_number").val("");
            $("#btn_chz_mobilephone_number_clear").hide();
            var sel_productType = $("ul.CZ_type li.clearfix.curr").attr("productType");
            page_MobileChz_Order.ShowDefaultProduct(sel_productType);
        });

        ////后退
        //$("span.fl.jt").on("click", function () {
        //    try {
        //        if (ClientType.GetClientType() === ClientType.JYH_Android) {
        //            //关闭窗口
        //            UseAppFangFa.CaoZuo('close');
        //        }
        //        else if (ClientType.GetClientType() === ClientType.JYH_iOS) {
        //            //关闭窗口
        //            UseAppFangFa.CaoZuo('close');
        //        }
        //        else
        //            history.back();
        //    }
        //    catch (e) {

        //    }
        //});

        //充值记录
        //$("#czjl").on("click", function () {
        //    PageUrlConfig.SetUrl();
        //    window.location.replace(g_const_PageURL.MobileCZList + "?t=" + Math.random());
        //});

    },
    //退出登录，防止读取到之前的用户信息
    Logout: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=userlogout",
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode == g_const_Success_Code) {
            }
            else {
                ShowMesaage(msg.resultmessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    InputFinish: function () {
        $("span.cancel").css("visibility", "hidden");
        $("#balanceList").focus();
        //检查手机号
        page_MobileChz_Order.CheckAndQuery();
    },
    //生成订单
    CreateOrder: function () {
        //if (UserLogin.LoginStatus === g_const_YesOrNo.YES) {
        var productType = $("ul.CZ_type li.clearfix.curr").attr("productType");
        var objsend = {
            order: {
                ClientType: 5,//ClientType.GetClientType(),
                FQMobile: "",// UserLogin.LoginName,
                CZMobile: $("#chz_mobilephone_number").val(),
                CZType: productType,
                ProductID: $("#balanceList li.curr").attr("data-productid"),
                OrderNo: $("#balanceList li.curr").attr("data-orderno"),
                OrderMoney: parseFloat($("#balanceList li.curr").attr("data-faceprice")),
                memo: $("span.dealer").text() + $("#balanceList li.curr").attr("data-facename") + (productType === "00001" ? "话费" : "流量") + "充值",
            }
        };
        var senddata = {
            action: "CreateOrder",
            api_input: JSON.stringify(objsend)
        };
        g_type_self_api.LoadData(senddata, function (msg) {
            if (msg.resultcode === g_const_Success_Code_IN.toString()) {
                //PageUrlConfig.SetUrl();
                //window.location.replace(g_const_PageURL.MyMobileCZOrder_pay + "?order_code=" + encodeURIComponent(objsend.order.OrderNo) + "&t=" + Math.random());
                //Message.ShowToPage("", g_const_PageURL.MainIndex + "?u=" + g_const_PageURL.GetKey(g_const_PageURL.Login), 0, "", "/IndexMain.html?u=MyMobileCZOrder_pay&order_code=" + encodeURIComponent(objsend.order.OrderNo) + "&t=" + Math.random());
                page_MobileChz_Order.OrderNo = objsend.order.OrderNo;
                UserLogin.Check(page_MobileChz_Order.OrderConfirm);
            }
        }, "");
        //}
        //else {
        //    //ShowMesaage("请您登录后再充值。");
        //    PageUrlConfig.SetUrl();
        //    window.location.replace("/Account/login.html")
        //    reutrn;
        //}
    },
    OrderNo:"",
    OrderConfirm: function () {
        if (UserLogin.LoginStatus == g_const_YesOrNo.YES) {
            window.location.href = g_const_PageURL.MainIndex + "?u=" + g_const_PageURL.GetKey(g_const_PageURL.MyMobileCZOrder_pay) + "&order_code=" + encodeURIComponent(page_MobileChz_Order.OrderNo) + "&t=" + Math.random();;
        }
        else {
            Message.ShowToPage("", g_const_PageURL.MainIndex + "?u=" + g_const_PageURL.GetKey(g_const_PageURL.Login), 0, "", "/IndexMain.html?u=MyMobileCZOrder_pay&order_code=" + encodeURIComponent(page_MobileChz_Order.OrderNo) + "&t=" + Math.random());
        }
    },
    OnTextChange: function () {
        

        while (isNaN($(this).val()) && $(this).val().length > 1) {
            $(this).val($(this).val().substr(0, $(this).val().length - 1));
        }
        page_MobileChz_Order.OpenHistory();

        var stxt = $(this).val();
        var ilen = stxt.length;
        if (ilen > 0) {
            $("#chz_mobilephone_number").attr("class", "CZIn_rt act")
        }
        else {
            $("#chz_mobilephone_number").attr("class", "CZIn_rt")
        }

        //如果长度为11位检查手机号
        if (ilen === 11) {
            $(this).blur();
            page_MobileChz_Order.InputFinish();
            page_MobileChz_Order.CloseHistory();
        }
        else {
            var sel_productType = $("ul.CZ_type li.clearfix.curr").attr("productType");
            page_MobileChz_Order.ShowDefaultProduct(sel_productType);
            $("span.cancel").css("visibility", "visible");
        }


        if (ilen === 0) {
            $("#btn_chz_mobilephone_number_clear").hide();
        }
        else {
            if (ilen == 11) {
                if (isMobile(stxt)) {
                    $("#btn_chz_mobilephone_number_clear").hide();
                }
            }
            else {
                $("#btn_chz_mobilephone_number_clear").show();
            }
        }



    },
    //打开充值历史显示
    OpenHistory: function () {
        $("span.cancel").css("visibility", "visible");
        //var arr_chz_history = MobileCHZ_Hisroty.GetHistoryListFromCache();
        $("ul.re_history b").off("click");
        $("ul.re_history li").off("click")
        $("ul.re_history").empty();
        $("ul.re_history").hide();

        //历史电话
        //var stpl = $("#tpl_history").html();
        //var html = "";
        //for (var i = 0; i < arr_chz_history.length; i++) {
        //    var phone = arr_chz_history[i];
        //    var stxt = $("#chz_mobilephone_number").val();
        //    var ilen = stxt.length;
        //    if (phone.substr(0, ilen) === stxt) {
        //        var data = {
        //            phone: phone,
        //            name: "",
        //        }
        //        html += renderTemplate(stpl, data);
        //    }
        //}
        //if (html.trim() != "") {
        //    $("ul.re_history").show();
        //    $("ul.re_history").html(html);
        //    $("ul.re_history b").on("click", function () {
        //        MobileCHZ_Hisroty.Remove($(this).attr("data-phone"));
        //        page_MobileChz_Order.OpenHistory();
        //    });
        //    $("ul.re_history li a").on("click", function () {
        //        $("#chz_mobilephone_number").val($(this).attr("data-phone"));
        //        page_MobileChz_Order.CloseHistory();
        //        page_MobileChz_Order.InputFinish();
        //    });
        //}
        //else {
        //    page_MobileChz_Order.CloseHistory();
        //}
    },
    //关闭充值历史显示
    CloseHistory: function () {
        $("ul.re_history").hide();
        if (page_MobileChz_Order.InputFocus)
            $("span.cancel").css("visibility", "visible");
        else
            $("span.cancel").css("visibility", "hidden");

    },
    //检查手机号，如果合法则获取该手机号的充值信息
    CheckAndQuery: function () {
        
        var phone = $("#chz_mobilephone_number").val();
        if (phone.trim() == "")
            return;
        var sel_productType = $("ul.CZ_type li.curr.clearfix").attr("productType");
        $("span.dealer").html("");
        if (phone.length !== 11) {
            ShowMesaage("请填写正确手机号。");
            page_MobileChz_Order.ShowDefaultProduct(sel_productType);
            return;
        }
        if (isNaN(Number(phone))) {
            ShowMesaage("请填写正确手机号。");
            page_MobileChz_Order.ShowDefaultProduct(sel_productType);
            return;
        }
        if (phone.substr(0, 1) != "1") {
            ShowMesaage("请填写正确手机号。");
            page_MobileChz_Order.ShowDefaultProduct(sel_productType);
            return;
        }
        if (!isMobile(phone)) {
            ShowMesaage("请填写正确手机号。");
            page_MobileChz_Order.ShowDefaultProduct(sel_productType);
            return;
        }
        $("#btn_chz_mobilephone_number_clear").hide();
        $("#loadTip").show();
        g_type_self_api.api_url = "/Ajax/MobileCZAPI.aspx";
        var objsend = {
            PhoneNumber: phone,
        };
        var senddata = {
            action: "GetPhoneArea",
            api_input: JSON.stringify(objsend)
        };
        g_type_self_api.LoadData(senddata, function (msg) {
            if (msg.resultcode === g_const_Success_Code_IN.toString()) {
                var mname = msg.Province + Mtype.GetName(msg.Mtype);
                $("span.dealer").html(mname);
                page_MobileChz_Order.GetProductList(msg.Mtype, phone);
            }
        }, "", function (msg) {
            var sel_productType = $("ul.CZ_type li.clearfix.curr").attr("productType");
            page_MobileChz_Order.ShowDefaultProduct(sel_productType);

        });


    },
    //获取销售列表
    GetProductList: function (mtype, phone) {
        if (phone.length !== 11) {
            ShowMesaage("手机号不正确。");
            return;
        }
        if (isNaN(Number(phone))) {
            ShowMesaage("手机号不正确。");
            return;
        }
        g_type_self_api.api_url = "/Ajax/MobileCZAPI.aspx";
        var objsend = {
            PhoneNumber: phone,
            ProductType: $("ul.CZ_type li.clearfix.curr").attr("productType"),
            ProductList: function (mtype) {
                var ProductType = $("ul.CZ_type li.clearfix.curr").attr("productType");
                var ProductList = [];
                switch (mtype) {
                    case Mtype.ChinaMobile:
                        if (ProductType == "00001")
                            ProductList = MobileCHZ_Product_HF_ChinaMobile;
                        else
                            ProductList = MobileCHZ_Product_LL_ChinaMobile;
                        break;
                    case Mtype.ChinaTelCom:
                        if (ProductType == "00001")
                            ProductList = MobileCHZ_Product_HF_ChinaTelCom;
                        else
                            ProductList = MobileCHZ_Product_LL_ChinaTelCom;
                        break;
                    case Mtype.ChinaUniCom:
                        if (ProductType == "00001")
                            ProductList = MobileCHZ_Product_HF_ChinaUniCom;
                        else
                            ProductList = MobileCHZ_Product_LL_ChinaUniCom;
                        break;

                }
                return ProductList;


            }(mtype)
        };
        var senddata = {
            action: "GetSaleProductListByPhoneNumber",
            api_input: JSON.stringify(objsend)
        };
        g_type_self_api.LoadData(senddata, function (msg) {
            if (msg.resultcode === g_const_Success_Code_IN.toString()) {
                //console.log(JSON.stringify(msg));
                page_MobileChz_Order.ProdcuctList = msg.plist;
                page_MobileChz_Order.ShowProductList(false);
            }
        }, "");
    },
    ProdcuctList: [],
    //充值产品类型切换
    ProductTypeChange: function () {
        var objProductType = $(this);
        $("ul.CZ_type li").removeClass("curr");
        objProductType.addClass("curr");

        $("#chz_mobilephone_number").val("");
        $("span.dealer").html("");
        //$("span.pic").hide();
        //$("span.cancel").css("visibility", "hidden");
        $("#btn_chz_mobilephone_number_clear").hide();
        //$("ul.re_history").hide();
        //我的优惠券
        //$("div.myQuan").hide();
        $(".CZIn_rt.price").html("0.00");

        var sel_productType = objProductType.attr("productType");
        page_MobileChz_Order.ShowDefaultProduct(sel_productType);
        if (sel_productType === MobileCHZ_Product_Type.HuaFei) {
            $("#radioWrap").hide();
            $("#tipa").hide();
        }
        else {
            $("#radioWrap").show();
            $("#tipa").show();
        }

        //if (ClientType.GetClientType() === ClientType.JYH_iOS || ClientType.GetClientType() === ClientType.JYH_Android) {
        //    $(".lookTip").hide("");
        //    $(".record").show("");
        //    $("header").show("");

        //}
        //else if (ClientType.GetClientType() === ClientType.WeiXin) {
        //    $("header").hide("");
        //}
        //else {
            //$(".lookTip").show("");
            //$("header").show("");
            //$(".record").hide("");
        //}
    },
    //显示默认商品
    ShowDefaultProduct: function (sel_productType) {
        $(".CZIn_rt.price").html("0.00");
        $("span.dealer").html("");
        $("#btn_chz").addClass("gray");
        if (sel_productType === MobileCHZ_Product_Type.HuaFei)
            page_MobileChz_Order.ProdcuctList = MobileCHZ_Product_HF_ChinaUniCom;
        else
            page_MobileChz_Order.ProdcuctList = MobileCHZ_Product_LL_ChinaMobile;
        page_MobileChz_Order.ShowProductList(true);


    },
    ShowProductList: function (isDefault) {
        $("#balanceList li").off("click");
        $("#balanceList").empty();
        var html = "";
        var stpl = $("#tpl_product").html();
        for (var i = 0; i < page_MobileChz_Order.ProdcuctList.length; i++) {
            var pruduct = page_MobileChz_Order.ProdcuctList[i];
            var data = {
                classname: isDefault ? "gray" : (typeof (pruduct.ProductStatus) === "undefined" ? "gray" : (pruduct.ProductStatus === 1 ? (i === 4 ? "curr" : "") : "gray")),
                productid: typeof (pruduct.ProductID) === "undefined" ? "" : pruduct.ProductID,
                faceprice: pruduct.FacePrice,
                facename: pruduct.FaceName,
                saleprice: typeof (pruduct.SalePrice) === "undefined" ? "" : pruduct.SalePrice.toFixed(2).toString(),
                ProductOrderNumber: typeof (pruduct.ProductOrderNumber) === "undefined" ? "" : pruduct.ProductOrderNumber
            };
            html += renderTemplate(stpl, data);
        }

        $("#balanceList").html(html);
        if (!isDefault)
            $("#balanceList li").on("click", function () {
                //alert($(this).attr("data-productid"));
                if (!$(this).hasClass("gray")) {
                    $("#balanceList li").removeClass("curr");
                    $(this).addClass("curr");
                    $(".CZIn_rt.price").html($(this).attr("data-saleprice"));
                    $("#btn_chz").removeClass("gray");
                }
            });
        $("#balanceList li.curr").click();
        $("#loadTip").hide();
    }
};