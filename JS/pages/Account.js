$(function () {
    UserLogin.Check(Account.LoadInfo);
});
var Account = {
    LoadInfo: function () {
        var body = "";
        $("#shoppingCartNum,#fontShoppingCart").on("click", function () {
            g_const_PageURL.GoByMainIndex(g_const_PageURL.Cart, '','','1');
        });
        if (UserLogin.LoginStatus == g_const_YesOrNo.NO) {
            $("#accountInfo").children("div[class=no]").show();
            var u = GetQueryString("u");
            var url = window.location.href;
            var num = url.indexOf("?")
            var par = "";
            if (num > 0) {
                url = url.substr(num + 1);
                par = url.replace("u=" + u, "");
            }

            $("#topLoginName,#discountNum,#fontDiscount,#myJYH,#myFavourites").on("click", function () {
                PageUrlConfig.SetReturnGoto(g_const_PageURL.Login, u, par);
            });
            $("#topLogin").on("click", function () {
                PageUrlConfig.SetReturnGoto(g_const_PageURL.Login, u, par);
            });
            $("#topRegister").on("click", function () {
                PageUrlConfig.SetReturnGoto(g_const_PageURL.Register, u, par);
            });
        }
        else {
            $("#accountInfo").children("div[class=yes]").show();
           

            $("#topLoginOut").show();
            $("#topRegister").hide();
            $("#topLogin").hide();

            $("#topLoginName,#myJYH").on("click", function () {
                g_const_PageURL.GoByMainIndex(g_const_PageURL.AccountIndex, '');
            });
            $("#discountNum,#fontDiscount").on("click", function () {
                g_const_PageURL.GoByMainIndex(g_const_PageURL.MyCoupon, '');
            });
            $("#myFavourites").on("click", function () {
                g_const_PageURL.GoByMainIndex(g_const_PageURL.MyCollection, '');
            });
            OrderNumber.GetList();
            OrderNumber.GetAccountInfo();
        }
    },
};
var OrderNumber = {
    api_target: "com_cmall_familyhas_api_ApiOrderNumber",
    api_input: { "version": 1.0, "channelId": "" },
    GetList: function () {
        OrderNumber.api_input.channelId = g_const_ChannelID;
        var s_api_input = JSON.stringify(OrderNumber.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": OrderNumber.api_target, "api_token": 1 };
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
                OrderNumber.Load_List(msg);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    SetNumber: function (count) {
        if (count > 99) {
            return "99+";
        }
        else {
            return count;
        }
    },
    Load_List: function (msg) {
        $("#discountNum").text(msg.couponCount);
        $.each(msg.list, function (i, n) {
            switch (n.orderStatus) {
                case g_const_orderStatus.DFK:
                    if (n.number > 0) {
                        $("#DFK").html(OrderNumber.SetNumber(n.number));
                    }
                    break;
                case g_const_orderStatus.DFH:
                    if (n.number > 0) {
                        $("#DFH").html(OrderNumber.SetNumber(n.number));
                    }
                    break;
                case g_const_orderStatus.DSH:
                    if (n.number > 0) {
                        $("#DSH").html(OrderNumber.SetNumber(n.number));
                    }
                    break;
            }
        });
    },
    GetAccountInfo: function () {
        g_type_api.api_input = {
            version: 1
        };
        g_type_api.api_url = g_APIUTL;
        g_type_api.api_target = "com_cmall_membercenter_api_GetMemberInfo";
        g_type_api.api_token = g_const_api_token.Wanted;
        g_type_api.LoadData(OrderNumber.AfterGetAccountInfo, "")
    },
    AfterGetAccountInfo: function (msg) {
        var phoneNo = (msg.user.nickname.length > 0 ? (msg.user.nickname) : (UserLogin.LoginName.substr(0, 3) + "****" + UserLogin.LoginName.substr(7, 4)));
        $("#topLoginName").html("hi！" + phoneNo).show();
        try {
            $("#LoginName").html("hi！" + phoneNo);
            $("#headImg").attr("src", (msg.user.avatar.thumb || g_head_pic));
        } catch (e) {}
    },
};
var UserInfo = {
    UploadCart: function () {
        //退出登录中
        $("#atcHead").attr("class", "portrait-hd");
        body = "<p class=\"user-index-login\">退出登录中，请稍候</p>";
        $("#divUser").html(body);
        $("#btnloginout").hide();

        Message.ShowLoading("退出登录中，请稍候", "divAlert");

        g_type_cart.Upload(UserInfo.Logout);
    },
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
                UserInfo.Load_List(msg);
            }
            else {
                ShowMesaage(msg.resultmessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_List: function (msg) {
        UserLogin.LoginStatus = g_const_YesOrNo.NO;
        g_const_localStorage.Member = null;
        var OrderFrom = '';
        var OrderFromParam = '';
        var OrderConfirm = "";
        if (localStorage[g_const_localStorage.OrderFrom] != null) {
            if (localStorage[g_const_localStorage.OrderFrom] != "") {
                OrderFrom = localStorage[g_const_localStorage.OrderFrom];
            }
        }
        if (localStorage[g_const_localStorage.OrderFromParam] != null) {
            if (localStorage[g_const_localStorage.OrderFromParam] != "") {
                OrderFromParam = localStorage[g_const_localStorage.OrderFromParam];
            }
        }
        if (localStorage[g_const_localStorage.OrderConfirm] != null) {
            if (localStorage[g_const_localStorage.OrderConfirm] != "") {
                OrderConfirm = localStorage[g_const_localStorage.OrderConfirm];
            }
        }
        localStorage.clear();
        if (OrderFrom != '') {
            localStorage[g_const_localStorage.OrderFrom] = OrderFrom;
        }
        if (OrderFromParam != '') {
            localStorage[g_const_localStorage.OrderFromParam] = OrderFromParam;
        }
        if (OrderConfirm != '') {
            localStorage[g_const_localStorage.OrderConfirm] = OrderConfirm;
        }
        g_type_cart.Clear();
        location.reload();
    },
};