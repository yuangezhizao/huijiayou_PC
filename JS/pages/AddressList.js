/// <reference path="../functions/AccountMenu.js" />
/// <reference path="../functions/g_Const.js" />
/// <reference path="../functions/g_Type.js" />
/// <reference path="../jquery-2.1.4.js" />
/// <reference path="../g_header.js" />
var page_addresslist = {
    TotalCount: 20,
    MenuName: "编辑收货地址",
    Init: function () {
        AccountMenu.ShowMenu("div.home ul.fl", "#tpl_menu", page_addresslist.MenuName);
        page_addresslist.LoadAreaData();
        page_addresslist.LoadAddressData();

        //添加邮编只能添加数字限制
        $("#txtPostcode").on('input paste', function (n) {
            var userName = $(this).val();
            var length = userName.length;
            for (var i = 0; i < length; i++) {
                var item = userName[i];
                if (!isIntegerOrNull(item)) {
                    $(this).val(userName.replace(item, ""));
                    return false;
                }
            }
        });
        $("div.cont h2 a").on("click", function () {
            $("#div_address").css("display", "none");
        });
        $("div.receiv h3 a").on("click", function () {
            page_addresslist.InitAddress();
            page_addresslist.SetValueToPopLayer();
            $("#div_address").css("display", "");
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
    },
    Check: function (idNumber) {
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
                    var aid = $("#txtAid").val();
                    var name = $("#txtName").val();
                    var provid = $("#selProv").val();
                    var cityid = $("#selCity").val();
                    var areaid = $("#selDistrict").val();
                    var street = $("#txtAddressDetail").val();
                    var mobile = $("#txtPhoneNo").val();
                    var isdefault = $("input[name='isdefault']:checked").val();
                    idNumber = msg.resultmessage;
                    var email = $("#txtEmail").val();
                    if (aid == "") {
                        //添加
                        g_type_api.api_input = {
                            phone: mobile,
                            email: email,
                            areaCode: areaid,
                            address: street,
                            isDefault: isdefault,
                            name: name,
                            province: $("#selProv option[value='" + provid + "']").html() + $("#selCity option[value='" + cityid + "']").html() + $("#selDistrict option[value='" + areaid + "']").html(),
                            postcode: $("#txtPostcode").val(),
                            idNumber: idNumber,
                            version: 1
                        }
                        g_type_api.api_target = "com_cmall_newscenter_beauty_api_AddAddress";
                        g_type_api.api_token = g_const_api_token.Wanted;
                        g_type_api.LoadData(function (msg) {
                            ShowMesaage("新增收货地址成功。");
                            $("#div_address").css("display", "none");
                            if (GetQueryString("u") == "OrderConfirm") {
                                Address_Info.GetList();
                            }
                            else {
                                page_addresslist.curPage = 0;
                                page_addresslist.LoadAddressData();
                            }
                        }, "");
                    } else {
                        //修改
                        g_type_api.api_input = {
                            id: aid,
                            mobile: mobile,
                            email: email,
                            areaCode: areaid,
                            street: street,
                            isdefault: isdefault,
                            name: name,
                            provinces: $("#selProv option[value='" + provid + "']").html() + $("#selCity option[value='" + cityid + "']").html() + $("#selDistrict option[value='" + areaid + "']").html(),
                            postcode: $("#txtPostcode").val(),
                            idNumber: idNumber,
                            version: 1
                        }
                        g_type_api.api_target = "com_cmall_newscenter_beauty_api_AddressUpdateApi";
                        g_type_api.api_token = g_const_api_token.Wanted;
                        g_type_api.LoadData(function (msg) {
                            if (GetQueryString("idno").length == 0) {
                                ShowMesaage("修改收货地址成功。");
                                $("#div_address").css("display", "none");
                                if (GetQueryString("u") == "OrderConfirm") {
                                    Address_Info.GetList();
                                }
                                else {
                                    page_addresslist.LoadAddressData();
                                }
                            }
                            else {
                                
                                ShowMesaageCallback("修改收货地址成功。", page_addresslist.ReturnConfirm);
                                $("#div_address").hide();
                            }
                        }, "");
                    }
                }
                else {
                    $("#txtIDno").parent().children("span").html(msg.resultmessage);
                    $("#txtIDno").parent().children("span").addClass("s1");
                    $("#txtIDno").addClass("curr");
                    iserror = true;
                  //  ShowMesaage(msg.resultmessage);
                }
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
            Message.Operate('', "divAlert");
        });
    },
    ReturnConfirm:function () {
        var pageurl = PageUrlConfig.BackTo();
        window.location.replace(pageurl)
    },
    //检查参数，通过后提交数据
    CheckParamAndSubmit: function (msg) {
        if (page_addresslist.TotalCount == 20 && $("#txtAid").val()=="") {
            $("#disSave").html("只能保存20个收货地址哦~").addClass("s1").show();
            return false;
        }
        //参数检查
        var name = $("#txtName").val();
        var provid = $("#selProv").val();
        var cityid = $("#selCity").val();
        var areaid = $("#selDistrict").val();
        var street = $("#txtAddressDetail").val();
        var mobile = $("#txtPhoneNo").val();
        var isdefault = $("input[name='isdefault']:checked").val();

        var email = $("#txtEmail").val();
        var postcode = $("#txtPostcode").val();
        var idNumber = msg.resultmessage;
        var iserror = false;

        $(".cont li span").css("display", "");
        $(".cont li span").html("");
        $(".cont li span").removeClass("s1");
        $(".cont li input").removeClass("curr");

        if (name.trim() == "") {
            $("#txtName").parent().children("span").html("请填写收货人姓名");
            $("#txtName").parent().children("span").addClass("s1");
            $("#txtName").addClass("curr");
            iserror = true;
        }
        if (name.trim().length < 2 || name.trim().length > 10) {
            $("#txtName").parent().children("span").html("请输入2-10个汉字");
            $("#txtName").parent().children("span").addClass("s1");
            $("#txtName").addClass("curr");
            iserror = true;
        }
        if (provid.trim() == "") {
            $("#selProv").parent().children("span").html("请填写所在地区");
            $("#selProv").parent().children("span").addClass("s1");
            $("#selProv").addClass("curr");
            iserror = true;
        }
        if (cityid.trim() == "") {
            $("#selCity").parent().children("span").html("请填写所在地区");
            $("#selCity").parent().children("span").addClass("s1");
            $("#selCity").addClass("curr");
            iserror = true;
        }
        if (areaid.trim() == "") {
            $("#selDistrict").parent().children("span").html("请填写所在地区");
            $("#selDistrict").parent().children("span").addClass("s1");
            $("#selDistrict").addClass("curr");
            iserror = true;
        }
        if (street.trim() == "") {
            $("#txtAddressDetail").parent().children("span").html("请填写详细地址");
            $("#txtAddressDetail").parent().children("span").addClass("s1");
            $("#txtAddressDetail").addClass("curr");
            iserror = true;
        }
        if (postcode.trim().length > 0 && !isZip(postcode.trim())) {
            $("#txtPostcode").parent().children("span").html("请输入正确的邮编").addClass("s1").show();
            $("#txtPostcode").addClass("curr");
            iserror = true;
        }
        else {
            $("#txtPostcode").parent().children("span").hide();
        }
        if (mobile.trim() == "") {
            $("#txtPhoneNo").parent().children("span").html(g_const_API_Message["107901"]);
            $("#txtPhoneNo").parent().children("span").addClass("s1");
            $("#txtPhoneNo").addClass("curr");
            iserror = true;
        }
        else if (!isMobile(mobile.trim())) {
            $("#txtPhoneNo").parent().children("span").html(g_const_API_Message["7902"]);
            $("#txtPhoneNo").parent().children("span").addClass("s1");
            $("#txtPhoneNo").addClass("curr");
            iserror = true;
        }
        $("#txtPostcode").on('input paste', function (n) {
            var userName = $(this).val();
            var length = userName.length;
            for (var i = 0; i < length; i++) {
                var item = userName[i];
                if (!isIntegerOrNull(item)) {
                    $(this).val(userName.replace(item, ""));
                    return false;
                }
            }
        });

        if (typeof (isflagTheSea) != 'undefined') {
            if (isflagTheSea == 1 && $("#txtIDno").val()=="") {
                $("#txtIDno").parent().children("span").html("请填写身份证号码");
                $("#txtIDno").parent().children("span").addClass("s1");
                $("#txtIDno").addClass("curr");
                iserror = true;
            }
        }
        else {
            $("#txtIDno").parent().children("span").hide();
        }


        //if (idNumber.trim() == "") {
        //    $("#txtIDno").parent().children("span").html("请填写身份证号码");
        //    $("#txtIDno").parent().children("span").addClass("s1");
        //    $("#txtIDno").addClass("curr");
        //    iserror = true;
        //}

        if (!iserror) {
            page_addresslist.Check($("#txtIDno").val());

        }
    },
    //读取地址列表信息
    LoadAddressData: function () {
        g_type_api.api_input = {
            version: 1,
            paging: {
                limit: page_addresslist.PageSize,
                offset: page_addresslist.curPage
            }
        };
        g_type_api.api_target = "com_cmall_newscenter_beauty_api_GetAddress";
        g_type_api.api_token = g_const_api_token.Wanted;
        g_type_api.LoadData(page_addresslist.AfterLoadAddressData, "")
    },
    PageSize: 7,
    curPage: 0,
    Repeat: function (s, n) {
        var r = "";
        while (n > 0) {
            r += s;
            n--;
        }
        return r;
    },

    AfterLoadAddressData: function (msg) {
        page_addresslist.TotalCount = msg.paged.total;
        var addresslist = msg.adress;
        var html = "";
        var stpl = $("#tpl_address_list").html();
        for (var k = 0; k < addresslist.length; k++) {
            var address = addresslist[k];
            var data = {
                name: address.name,
                provinces: address.provinces,
                street: address.street,
                idNumber: function (idNumber) {
                    g_type_self_api.api_async = false;
                    var objdata = {
                        action: "aesdecrypt",
                        s: idNumber
                    };
                    var idno = ""
                    g_type_self_api.LoadData(objdata, function (msg) {
                        idno = msg.resultmessage;
                        addresslist[k].idNumber = idno;
                        if (idno.length > 8)
                            idno = idno.substr(0, 4) + page_addresslist.Repeat("*", idno.length - 8) + idno.substr(idno.length - 4, 4);
                        else if (idno.trim() == "")
                            idno = "未绑定";

                    }, "");
                    return idno;
                }(address.idNumber),
                postcode: address.postcode,
                mobile: address.mobile.length == 11 ? address.mobile.substr(0, 3) + page_addresslist.Repeat("*", 4) + address.mobile.substr(address.mobile.length - 4, 4) : address.mobile,
                id: address.id,
                isdefault: address.isdefault == g_const_YesOrNo.YES.toString() ? "已默认" : "设置默认",
                trclass: address.isdefault == g_const_YesOrNo.YES.toString() ? "curr" : ""
            };
            html += renderTemplate(stpl, data);
        }

        $("tbody").html(html);
        //设置分页信息
        FormatTB(msg.paged.total, page_addresslist.PageSize, (page_addresslist.curPage), page_addresslist.PageNavigation);
        var addtotal = msg.paged.total;
        if (addtotal>20) {
            addtotal = 20;
        }
        $("div.receiv h3 i").html(addtotal.toString());

        if (GetQueryString("idno").length>0) {
            for (var k = 0; k < addresslist.length; k++) {
                var address = addresslist[k];
                if (address.id == GetQueryString("idno"))
                    page_addresslist.selectAddress = address;
            }
            page_addresslist.SetValueToPopLayer();
            $("#div_address").css("display", "");
            $("#txtIDno").focus();
        }
        $("tbody tr td a").on("click", function () {
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
                            page_addresslist.LoadAddressData();
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
                            page_addresslist.curPage = 0;
                            page_addresslist.LoadAddressData();
                        }, "");
                    }
                    break;
            }
        });
    },
    PageNavigation: function (pageno, jq) {
        page_addresslist.curPage = parseInt(pageno.toString(), 10);
        page_addresslist.LoadAddressData();
    },
    selectAddress: { "id": "", "name": "", "mobile": "", "postcode": "", "provinces": "", "areaCode": "", "street": "", "isdefault": "", "email": "", "idNumber": "" },
    //地址初始化
    InitAddress: function () {
        page_addresslist.selectAddress.id = "";
        page_addresslist.selectAddress.name = "";
        page_addresslist.selectAddress.mobile = "";
        page_addresslist.selectAddress.postcode = "";
        page_addresslist.selectAddress.provinces = "";
        page_addresslist.selectAddress.areaCode = "";
        page_addresslist.selectAddress.street = "";
        page_addresslist.selectAddress.isdefault = g_const_YesOrNo.NO.toString();
        page_addresslist.selectAddress.email = "";
        page_addresslist.selectAddress.idNumber = "";
    },
    //赋值
    SetValueToPopLayer: function () {
        var provid = "";
        var cityid = "";
        var areaid = "";
        if (page_addresslist.selectAddress.areaCode != "") {
            areaid = page_addresslist.selectAddress.areaCode;
            cityid = areaid.substr(0, 4) + "00";
            provid = areaid.substr(0, 2) + "0000";
        }
        $("#txtName").val(page_addresslist.selectAddress.name);
        $("#txtAddressDetail").val(page_addresslist.selectAddress.street);
        $("#txtPostcode").val(page_addresslist.selectAddress.postcode);
        $("#txtPhoneNo").val(page_addresslist.selectAddress.mobile);
        $("#txtIDno").val(page_addresslist.selectAddress.idNumber);
        $("#txtAid").val(page_addresslist.selectAddress.id);
        $("#txtEmail").val(page_addresslist.selectAddress.email);
        $("input[name='isdefault'][value='" + page_addresslist.selectAddress.isdefault + "']").click();
        $("#selProv").val(provid);
        page_addresslist.selProvChange();
        $("#selCity").val(cityid);
        page_addresslist.selCityChange();
        $("#selDistrict").val(areaid);
        //$("input[name='isdefault']:checked").val();
        $(".cont li span").css("display", "none");
        $(".cont li span").removeClass("s1");
        $(".cont li input").removeClass("curr");

        var stitle = (page_addresslist.selectAddress.id == "" ? "添加" : "修改") + "收货地址";
        $(".cont h2 span").html(stitle);
    },
    //获取区域信息
    LoadAreaData: function () {
        if (typeof (localStorage[g_const_localStorage.StoreDistrict]) == "undefined") {
            g_type_api.api_input = {
                version: 1
            };
            g_type_api.api_target = "com_cmall_familyhas_api_ApiForGetStoreDistrict";
            g_type_api.api_token = g_const_api_token.Unwanted;
            g_type_api.LoadData(page_addresslist.AfterLoadAreaData, "");
        }
        else {
            page_addresslist.AfterLoadAreaData(JSON.parse(localStorage[g_const_localStorage.StoreDistrict]));
        }
    },
    //解析区域信息
    AfterLoadAreaData: function (msg) {
        localStorage[g_const_localStorage.StoreDistrict] = JSON.stringify(msg);

        var provinceList = msg.list;
        var provhtml = "<option value=\"\">请选择</option>";
        for (var k = 0; k < provinceList.length; k++) {
            var prov = provinceList[k];
            provhtml += "<option value=\"" + prov.provinceID + "\">" + prov.provinceName + "</option>";
        }
        $("#selProv").html(provhtml);
        page_addresslist.selProvChange();

        $("#selProv").on("change", page_addresslist.selProvChange);
    },
    //省份变化
    selProvChange: function () {
        var provid = $("#selProv").val();
        var citylist = function (provid) {
            var provinceList = JSON.parse(localStorage[g_const_localStorage.StoreDistrict]).list;
            for (var k = 0 ; k < provinceList.length; k++) {
                var prov = provinceList[k];
                if (prov.provinceID == provid)
                    return prov.cityList;
            }
            return [];
        }(provid);
        page_addresslist.selCityList = citylist;
        var cityhtml = "<option value=\"\">请选择</option>";
        for (var k = 0; k < citylist.length; k++) {
            var city = citylist[k];
            cityhtml += "<option value=\"" + city.cityID + "\">" + city.cityName + "</option>";
        }
        $("#selCity").html(cityhtml);
        page_addresslist.selCityChange();
        $("#selCity").on("change", page_addresslist.selCityChange);
    },
    selCityList: [],
    //市变化
    selCityChange: function () {
        var cityid = $("#selCity").val();
        var areaList = function (cityid) {
            for (var k = 0; k < page_addresslist.selCityList.length; k++) {
                var city = page_addresslist.selCityList[k];
                if (city.cityID == cityid)
                    return city.districtList;
            }
            return [];
        }(cityid);
        var areahtml = "<option value=\"\">请选择</option>";
        for (var k = 0; k < areaList.length; k++) {
            var area = areaList[k];
            areahtml += "<option value=\"" + area.districtID + "\">" + area.district + "</option>";;
        }
        $("#selDistrict").html(areahtml);
    }
};