var _storedistrict;
var _provincelist;
var _citylist;
var _districtlist;
var _addresstotal = 0;
//var _selectaddressid = 0;
//加载省
//var Prov_List = {
//    api_target: "com_cmall_newscenter_beauty_api_ProvinceApi",
//    api_input: { "version": 1.0 },
//    GetList: function () {
//        var s_api_input = JSON.stringify(this.api_input);
//        var obj_data = { "api_input": s_api_input, "api_target": this.api_target };
//        var purl = g_APIUTL;
//        var request = $.ajax({
//            url: purl,
//            cache: false,
//            method: g_APIMethod,
//            data: obj_data,
//            dataType: g_APIResponseDataType
//        });

//        request.done(function (msg) {
//            if (msg.resultCode == g_const_Success_Code) {
//                Prov_List.Load_List(msg.provinces);
//            }
//            else {
//                ShowMesaage(msg.resultMessage);
//            }
//        });

//        request.fail(function (jqXHR, textStatus) {
//            ShowMesaage(g_const_API_Message["7001"]);
//        });
//    },
//    Load_List: function (msg) {
//        Address_Edit.Set_Province(msg);
//    },

//};
////加载市
//var City_List = {
//    api_target: "com_cmall_newscenter_beauty_api_CityApi",
//    api_input: { "id": 0, "version": 1.0 },
//    GetList: function () {
//        var s_api_input = JSON.stringify(this.api_input);
//        var obj_data = { "api_input": s_api_input, "api_target": this.api_target };
//        var purl = g_APIUTL;
//        var request = $.ajax({
//            url: purl,
//            cache: false,
//            method: g_APIMethod,
//            data: obj_data,
//            dataType: g_APIResponseDataType
//        });

//        request.done(function (msg) {
//            if (msg.resultCode == g_const_Success_Code) {
//                City_List.Load_List(msg.city);
//            }
//            else {
//                ShowMesaage(msg.resultMessage);
//            }
//        });

//        request.fail(function (jqXHR, textStatus) {
//            ShowMesaage(g_const_API_Message["7001"]);
//        });
//    },
//    Load_List: function (msg) {
//        Address_Edit.Set_City(msg);
//    },
//};
////加载区
//var District_List = {
//    api_target: "com_cmall_newscenter_beauty_api_AreaApi",
//    api_input: { "id": 0, "version": 1.0 },
//    GetList: function () {
//        var s_api_input = JSON.stringify(this.api_input);
//        var obj_data = { "api_input": s_api_input, "api_target": this.api_target };
//        var purl = g_APIUTL;
//        var request = $.ajax({
//            url: purl,
//            cache: false,
//            method: g_APIMethod,
//            data: obj_data,
//            dataType: g_APIResponseDataType
//        });

//        request.done(function (msg) {
//            if (msg.resultCode == g_const_Success_Code) {
//                District_List.Load_List(msg);
//            }
//            else {
//                ShowMesaage(msg.resultMessage);
//            }
//        });

//        request.fail(function (jqXHR, textStatus) {
//            ShowMesaage(g_const_API_Message["7001"]);
//        });
//    },
//    Load_List: function (msg) {
//        Address_Edit.Set_District(msg);
//    },
//};

var Address_All = {
    api_target: "com_cmall_familyhas_api_ApiForGetStoreDistrict",
    api_input: { "version": 1.0 },
    GetList: function (callback) {
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
                // Prov_List.Load_List(msg);
                localStorage[g_const_localStorage.StoreDistrict] = JSON.stringify(msg);
                // _storedistrict = msg;
                
               // Address_All.Load_List();
                if (typeof (callback) == "function")
                    callback();
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_List: function () {
        Address_Edit.Set_Province();
    },

};
//新增地址信息
var Address_Add = {
    api_input: { "phone": "", "areaCode": "", "address": "", "name": "", "province": "","isDefault":"" },
    AddInfo: function () {
        var s_api_input = JSON.stringify(this.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": this.api_target };
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=addressadd&api_input=" + s_api_input + "&validcode=" + $("#txtValidCode").val(),
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultCode) {
                if (msg.resultCode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultMessage);
                    return;
                }
            }
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Success_Code) {
                    Address_Add.Load_Result(msg);
                }
                else {
                    ShowMesaage(msg.resultmessage);
                }
            }
            Message.Operate('', "divAlert");
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
            Message.Operate('', "divAlert");
        });
    },
    Load_Result: function (msg) {
        if (msg.resultmessage == "isnew") {
            localStorage[g_const_localStorage.IsnewReg] = 1;
            g_type_loginjs.Member.phone = Address_Add.api_input.phone;
            localStorage[g_const_localStorage.Member] = JSON.stringify(g_type_loginjs);
            if (IsInWeiXin.check()) {
                Address_Add.Load_WxInfo();
               // return;
            }
            //else {
            //    localStorage[g_const_localStorage.IsnewReg] = 0;
            //}
        }
        else {
            localStorage[g_const_localStorage.IsnewReg] = 0;
            //if (IsInWeiXin.check()) {
            //    Address_Add.Load_WxInfo();
               // return;
            // }
            var backurl = PageUrlConfig.BackTo(1);
            Message.ShowToPage(g_const_API_Message["100005"], backurl, 2000, "");
        }
        //ShowMesaage(g_const_API_Message["100005"]);
        //location.href = localStorage.getItem(g_const_localStorage.BackURL);



    },
    Load_WxInfo: function () {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getwxopenidbyphone&phone_no=" + Address_Add.api_input.phone,
            dataType: "json"
        });

        request.done(function (msg) {
            if (msg.resultcode != g_const_Success_Code_IN) {
                //去获得微信ID
                var backurl = PageUrlConfig.BackTo(1) + "&showwxpaytitle=1";
                window.location.replace(g_const_PageURL.OauthLogin + "?oauthtype=WeiXin&returnurl=" + encodeURIComponent(backurl) + "&scope=b");
            }
            else {
                var backurl = PageUrlConfig.BackTo(1);
                Message.ShowToPage(g_const_API_Message["100005"], backurl, 2000, "");
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
};
//编辑地址信息
var Address_Update = {
    api_input: { "id": "", "mobile": "", "areaCode": "", "street": "", "name": "", "provinces": "", "isdefault": "" },
    EditInfo: function () {
        var s_api_input = JSON.stringify(this.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": this.api_target };
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=addressedit&api_input=" + s_api_input + "&validcode=" + $("#txtValidCode").val(),
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultCode) {
                if (msg.resultCode == g_const_Success_Code_IN) {
                    Address_Update.Load_Result();
                }
                else {
                    ShowMesaage(msg.resultMessage);
                }
            }
            if (msg.resultcode) {
                if (msg.resultcode == g_const_Success_Code) {
                    Address_Update.Load_Result();
                }
                else {
                    ShowMesaage(msg.resultmessage);
                }
            }
            Message.Operate('', "divAlert");
          //  Message.Operate('', "divAlert");
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
            Message.Operate('', "divAlert");
        });
    },
    Load_Result: function () {
        var backurl = PageUrlConfig.BackTo(1);
        Message.ShowToPage(g_const_API_Message["100005"], backurl, 2000, "");
    },
};


//根据ID获取地址
var Address_Info = {
    GetByID: function (addressid) {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=getaddressbyid&addressid=" + addressid,
            dataType: "json"
        });

        request.done(function (msg) {
            if (msg.resultcode == g_const_Success_Code_IN) {
                Address_Info.SetAddressInfo(msg);
            }
            else {
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    SetAddressInfo: function (result) {
        $("#txtUserName").val(result.name);
        $("#txtPhoneNo").val(result.mobile);
        $("#txtAddressDetail").val(result.street);

        isDefault = result.isdefault;
            if (isDefault == 0) {
                $("#spDefault").show();//("class", "address-default");
            }
            else {
                $("#spDefault").hide();//.attr("class", "address-default curr");
            }
           
        Address_Info.SetProvincesInfo(result.provinces);
    },
    SetProvincesInfo: function (result) {
        var selectid = 0;
        $("#selProv option").each(function () {
            if (result.indexOf($(this).text()) > -1) {
                selectid = $(this).val();
                $.each(_provincelist, function (i, n) {
                    if (n.provinceID == selectid) {
                        Address_Edit.Set_City(n.cityList, result);
                        return false;
                    }
                });
            }
        });
        $("#selProv").val(selectid);
    },
    SetCitysInfo: function (result) {
        var selectid = 0;
        $("#selCity option").each(function () {
            if (result.indexOf($(this).text()) > -1) {
                selectid = $(this).val();
                $.each(_citylist, function (i, n) {
                    if (n.cityID == selectid) {
                        Address_Edit.Set_District(n.districtList, result);
                        return false;
                    }
                });
            }
        });
        $("#selCity").val(selectid);
    },
    SetDistrictsInfo: function (result) {
        var selectid = 0;
        $("#selDistrict option").each(function () {
            if (result.indexOf($(this).text()) > -1) {
                selectid = $(this).val();
                return false;
            }
        });
        $("#selDistrict").val(selectid);
    },
    api_input: {},
    api_target: "com_cmall_newscenter_beauty_api_GetAddress",
    GetList: function () {
        var s_api_input = JSON.stringify(Address_Info.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": Address_Info.api_target, "api_token": "1" };
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
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    //Message.ShowToPage("您还没有登陆或者已经超时.", g_const_PageURL.Login, 2000, "");
                    Message.ShowToPage("", g_const_PageURL.Login, 2000, "");
                    return;
                } 
            }
            if (msg.resultCode == g_const_Success_Code) {
                Address_Info.LoadResult(msg.adress);
                _addresstotal = msg.paged.total;
            }
            else {
                
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    LoadResult: function (result) {
        if (result.length>0) {
            var body = "";
            var body_common = "";
            var body_default = "";
            var body_lastused = "";
            $.each(result, function (i, n) {
                if (n.isdefault == "1") {
                    if (localStorage.getItem(g_const_localStorage.OrderAddress) != null && n.id == localStorage.getItem(g_const_localStorage.OrderAddress)) {
                        body_default += "<li class=\"curr\">";
                    }
                    else {
                        body_default += "<li>";
                    }
                    body_default += "<section class=\"address-txt\" onclick=\"Address_Info.OrderAddress('" + n.id + "')\">";
                    body_default += "<h3>" + n.name + "<em>" + n.mobile + "</em></h3>";
                    body_default += "<p>";
                    body_default += "<em>[默认]</em>";
                    body_default += n.provinces + n.street + "</p>";
                    body_default += "</section>";
                    body_default += "<aside class=\"address-modify\">";
                    body_default += "<a onclick=\"DeleteAddress('" + n.id + "')\" class=\"address-del\">删除</a><a  onclick=\"Address_Info.EditAddress('" + g_const_PageURL.AddressEdit + "?addressid=" + n.id + "&login=" + UserLogin.LoginStatus + "')\" class=\"address-edit\">编辑</a>";
                    body_default += "</aside>";
                    body_default += "</li>";
                }
                else if (localStorage.getItem(g_const_localStorage.OrderAddress) != null && n.id == localStorage.getItem(g_const_localStorage.OrderAddress)) {
                    body_lastused += "<li class=\"curr\">";
                    body_lastused += "<section class=\"address-txt\" onclick=\"Address_Info.OrderAddress('" + n.id + "')\">";
                    body_lastused += "<h3>" + n.name + "<em>" + n.mobile + "</em></h3>";
                    body_lastused += "<p>";
                    body_lastused += n.provinces + n.street + "</p>";
                    body_lastused += "</section>";
                    body_lastused += "<aside class=\"address-modify\">";
                    body_lastused += "<a onclick=\"DeleteAddress('" + n.id + "')\" class=\"address-del\">删除</a><a  onclick=\"Address_Info.EditAddress('" + g_const_PageURL.AddressEdit + "?addressid=" + n.id + "&login=" + UserLogin.LoginStatus + "')\" class=\"address-edit\">编辑</a>";
                    body_lastused += "</aside>";
                    body_lastused += "</li>";
                }
                else {
                    body_common += "<li>";
                    body_common += "<section class=\"address-txt\" onclick=\"Address_Info.OrderAddress('" + n.id + "')\">";
                    body_common += "<h3>" + n.name + "<em>" + n.mobile + "</em></h3>";
                    body_common += "<p>" + n.provinces + n.street + "</p>";
                    body_common += "</section>";
                    body_common += "<aside class=\"address-modify\">";
                    body_common += "<a onclick=\"DeleteAddress('" + n.id + "')\" class=\"address-del\">删除</a><a  onclick=\"Address_Info.EditAddress('" + g_const_PageURL.AddressEdit + "?addressid=" + n.id + "&login=" + UserLogin.LoginStatus + "')\"  class=\"address-edit\">编辑</a>";
                    body_common += "</aside>";
                    body_common += "</li>";
                }
            });
            body = body_default + body_lastused + body_common;
            $("#divAddressList").html(body);
            $("#atcList").show();
            $("#atcListNull").hide();
        }
        else {
            $("#atcList").hide();
            $("#atcListNull").show();
        }
    },
    OrderAddress: function (addressid) {
        if (localStorage["fromOrderConfirm"] == "1") {
            localStorage[g_const_localStorage.OrderAddress] = addressid;
            window.location.replace(PageUrlConfig.BackTo());
        }
    },
    EditAddress: function (addressURL) {
        //保存下一页用于返回的url
        PageUrlConfig.SetUrl(g_const_PageURL.AddressList);
        window.location.replace(addressURL + "&t=" + Math.random());
    },

};


var Address_Del = {
    api_input: {"address":""},
    api_target: "com_cmall_newscenter_beauty_api_AddressDeleteApi",
    DeleteByID: function (addressid) {
        Address_Del.api_input.address = addressid;
        var s_api_input = JSON.stringify(Address_Del.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": Address_Del.api_target, "api_token": "1" };
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
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    //Message.ShowToPage("您还没有登陆或者已经超时.", g_const_PageURL.Login, 2000, "");
                    Message.ShowToPage("", g_const_PageURL.Login, 2000, "");
                    return;
                }
            }
            if (msg.resultCode == g_const_Success_Code) {
                Address_Del.LoadResult(msg);
            }
            else {

                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    LoadResult: function (result) {
        if (localStorage.getItem(g_const_localStorage.OrderAddress) != null) {
            if (Address_Del.api_input.address == localStorage.getItem(g_const_localStorage.OrderAddress)) {
                localStorage[g_const_localStorage.OrderAddress] = 0;
            }
        }
        Address_Info.GetList();
    },
};
var Address_Default = {
    api_input: { "address": "" },
    api_target: "com_cmall_newscenter_beauty_api_AddressSelectApi",
    SetByID: function (addressid) {
        Address_Default.api_input.address = addressid;
        var s_api_input = JSON.stringify(Address_Default.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": Address_Default.api_target, "api_token": "1" };
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
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    //Message.ShowToPage("您还没有登陆或者已经超时.", g_const_PageURL.Login, 2000, "");
                    Message.ShowToPage("", g_const_PageURL.Login, 2000, "");
                    return;
                }
            }
            if (msg.resultCode == g_const_Success_Code) {
                Address_Default.LoadResult(msg);
            }
            else {

                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    LoadResult: function (result) {
        ShowMesaage(g_const_API_Message["100006"]);
    },
};