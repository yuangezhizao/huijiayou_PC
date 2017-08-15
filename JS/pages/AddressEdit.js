var addressid = "";
var login = "";
var isDefault = 0;
$(document).ready(function () {
    
    addressid = GetQueryString("addressid");
    login = GetQueryString("login");
    if (login=="1") {
        $("#liCode").hide();
        $("#btnCode").hide();
    }
    else {
        $("#liCode").show();
        $("#btnCode").show();
        addressid = "0";
    }
    if (localStorage.getItem(g_const_localStorage.StoreDistrict)) {
        Address_Edit.Set_Province();
    }
    else {
        Address_All.GetList(Address_All.Load_List());
    }
    if (addressid == "0") {
        $("#spDefault").show();
    }
    $("#selProv").change(function () {
        var selectid = $(this).val();
        $.each(_provincelist, function (i, n) {
            if (n.provinceID == selectid) {
                Address_Edit.Set_City(n.cityList);
            }
        });
    });
    $("#selCity").change(function () {
        var selectid = $(this).val();
        $.each(_citylist, function (i, n) {
            if (n.cityID == selectid) {
                Address_Edit.Set_District(n.districtList);
            }
        });
        //District_List.api_input.id = $(this).val();
        //District_List.GetList();
    });
    $("#btnSave").click(function () {
        if ($("#txtUserName").val().length == 0) {
            ShowMesaage(g_const_API_Message["100007"]);
            return;
        }
        if ($("#txtPhoneNo").val().length == 0) {
            ShowMesaage(g_const_API_Message["7901"]);
            return;
        }
        if ($("#txtValidCode").val().length == 0 && login=="0") {
            ShowMesaage(g_const_API_Message["7802"]);
            return;
        }
        //判断省
        if ($("#selProv").val() == "0") {
            ShowMesaage(g_const_API_Message["100041"]);
            return;
        }
        //判断市
        if ($("#selCity").val() == "0") {
            ShowMesaage(g_const_API_Message["100042"]);
            return;
        }
        //判断区
        if ($("#selDistrict").val() == "0") {
            ShowMesaage(g_const_API_Message["100009"]);
            return;
        }
        if ($("#txtAddressDetail").val().length == 0) {
            ShowMesaage(g_const_API_Message["100010"]);
            return;
        }
        if ($("#txtUserName").val().length < 2 || $("#txtUserName").val().length > 10) {
            ShowMesaage(g_const_API_Message["100011"]);
            return;
        }
        if (!isMobile($("#txtPhoneNo").val())) {
            ShowMesaage(g_const_API_Message["7902"]);
            return;
        }
        if ($("#txtAddressDetail").val().length < 5 || $("#txtAddressDetail").val().length > 40) {
            ShowMesaage(g_const_API_Message["100012"]);
            return;
        }
        Message.ShowLoading("收货地址信息提交中", "divAlert");
        if (addressid != "0") {
            Address_Update.api_input.id = addressid;
            Address_Update.api_input.mobile = $("#txtPhoneNo").val();
            Address_Update.api_input.areaCode = $("#selDistrict").val();
            Address_Update.api_input.street = String.Replace($("#txtAddressDetail").val());
            Address_Update.api_input.name = String.Replace($("#txtUserName").val());
            Address_Update.api_input.provinces = $("#selProv").find("option:selected").text() +
                                            $("#selCity").find("option:selected").text() +
                                            $("#selDistrict").find("option:selected").text();
            Address_Update.api_input.isdefault = isDefault;
            Address_Update.EditInfo();
        }
        else {
            Address_Add.api_input.phone = $("#txtPhoneNo").val();
            Address_Add.api_input.areaCode = $("#selDistrict").val();
            Address_Add.api_input.address = String.Replace($("#txtAddressDetail").val());
            Address_Add.api_input.name = String.Replace($("#txtUserName").val());
            Address_Add.api_input.province = $("#selProv").find("option:selected").text() +
                                            $("#selCity").find("option:selected").text() +
                                            $("#selDistrict").find("option:selected").text();
            Address_Add.api_input.isDefault = isDefault;
            Address_Add.AddInfo();
        }
    });
    $("#btnCode").click(function () {
        var phoneNo = $("#txtPhoneNo").val();
        var action = "addressvalidcode";
        if (phoneNo.length == 0) {
            ShowMesaage(g_const_API_Message["7901"]);
            return;
        }
        if (!isMobile(phoneNo)) {
            ShowMesaage(g_const_API_Message["7902"]);
            return;
        }
        Send_ValidCode.SendCode(action, phoneNo);
    });

    $("#btnBack").click(function () {
        Message.ShowConfirm("放弃填写的内容吗？","", "divAlert", "放弃", "Address_Edit.GoBack", "继续填写");
    });
    $("#spDefault").click(function () {
        //if (addressid!="0") {
        //  //  Address_Default.SetByID(addressid);
        //    isDefault = 1;
        //    $("#spDefault").attr("class", "address-default curr");
        //}
        //else {
            if (isDefault == 0) {
                isDefault = 1;
                $("#spDefault").attr("class", "address-default curr");
            }
            else {
                isDefault = 0;
                $("#spDefault").attr("class", "address-default");
            }
        //}
    });
});
function stime(count) {
    if (count == 0) {
        $('.submit button').attr('disabled', false).removeClass('curr');
        $('.submit button').removeClass('curr');
        $('.submit button').html('获取验证码');
        return false;
    } else {
        $('.submit button').attr('disabled', 'disabled').addClass('curr');
        $('.submit button').html(count + 's后可重发');
        $('.submit button').addClass('curr');
        count--;
    }
    setTimeout(function () {
        stime(count);
    }, 1000)
}
var Address_Edit = {
    GoBack: function () {
        window.location.replace(PageUrlConfig.BackTo(1));
    },
    LoadInfo:function () {
        if (addressid != "0")
        {
            $("#spoperate").html("编辑");
            Address_Info.GetByID(addressid);
        }
        else {
            $("#spoperate").html("新增");
        }
    },
    Set_Province: function () {
        result = JSON.parse(localStorage.getItem(g_const_localStorage.StoreDistrict)).list
        _provincelist = result;
        var optionstring="";
        optionstring += "<option value=\"0\">请选择省</option>";
        $("#selCity").html("<option value=\"0\">请选择市</option>");
        $("#selDistrict").html("<option value=\"0\">请选择区</option>");
        $.each(result, function (i, n) {
            optionstring += "<option value=\"" + n.provinceID + "\" >" + n.provinceName + "</option>";
        });
        $("#selProv").html(optionstring);
        Address_Edit.LoadInfo();
    },
    Set_City:function(result,address)
    {
        _citylist = result;
        var optionstring = "<option value=\"0\">请选择市</option>";
        $("#selDistrict").html("<option value=\"0\">请选择区</option>");
        $.each(result, function (i, n) {
            optionstring += "<option value=\"" + n.cityID + "\" >" + n.cityName + "</option>";
        });
        $("#selCity").html(optionstring);
        if (address) {
            Address_Info.SetCitysInfo(address);
        }
    },
    Set_District: function (result, address)
    {
        _districtlist = result;
        var optionstring = "<option value=\"0\">请选择区</option>";
        $.each(result, function (i, n) {
            optionstring += "<option value=\"" + n.districtID + "\" >" + n.district + "</option>";
        });
        $("#selDistrict").html(optionstring);
        Address_Info.SetDistrictsInfo(address);
    }
};