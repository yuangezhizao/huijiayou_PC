var MemberInfo = {
    MenuName: "设置个人信息",

    Init: function () {
        AccountMenu.ShowMenu("div.home ul.fl", "#tpl_menu", MemberInfo.MenuName);
        if (UserLogin.LoginStatus == g_const_YesOrNo.YES) {
            MemberInfo.GetMemberInfo();
        }
        else {
            UserLogin.Check(MemberInfo.GetMemberInfo);
        }
        
    },

    ImgType: [".jpg", ".jpeg", ".png"],
    UpdateApiInput: { "birthday": "", "email": "", "nickname": "", "gender": "", "headPic": "", "mobile": "" },
    CheckMemberInfo: function () {
        var nickName = $("#txtNickName").val();
        var nickLength = nickName.length;
        if (nickLength <= 0) {
            $("#txtNickName").addClass("curr");
            $("#emNickName").show();
            return false;
        }
        if (nickLength < 2 || nickLength > 7) {
            $("#txtNickName").addClass("curr");
            $("#emNickName").html(g_const_API_Message["106005"]).show();
            return false;
        }
        for (var i = 0; i < nickLength; i++) {
            var char = nickName[i];
            if (!(isInteger(char) || isEnglishStr(char) || isChinese(char) || char == "-" || char == "_")) {
                $("#txtNickName").addClass("curr");
                $("#emNickName").html(g_const_API_Message["106005"]).show();
                return false;
            }
        }
        $("#txtNickName").removeClass("curr");
        $("#emNickName").hide();
        if (!isEmail($("#txtEmail").val()) && $("#txtEmail").val().length > 0) {
            $("#txtEmail").addClass("curr");
            $("#emEmail").addClass("e1").show();
            return false;
        }
        $("#txtEmail").removeClass("curr");
        $("#emEmail").hide();

        //设置需要修改的信息
        var gender = $("input[name='rdSex']:checked").val();
        MemberInfo.UpdateApiInput.gender = g_const_Gender[gender];
        MemberInfo.UpdateApiInput.nickname = $("#txtNickName").val();
        MemberInfo.UpdateApiInput.email = $("#txtEmail").val();
        MemberInfo.UpdateApiInput.birthday = $("#birYear").val() + '-' + $("#birMonth").val() + '-' + $("#birDate").val();
        MemberInfo.UpdateApiInput.headPic = $("#imgHeadUrl").data("url");
        MemberInfo.UpdateApiInput.mobile = $("#phone").data("phone");

        MemberInfo.UpdateMemberInfo();
    },
    //获取会员信息
    GetMemberInfo: function () {
        var api_tag = "com_cmall_membercenter_api_GetMemberInfo";
        var api_input = {};
        var s_api_input = JSON.stringify(api_input);
        var obj_data = { "api_input": s_api_input, "api_target": api_tag, "api_token": g_const_api_token.Wanted };

        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });

        request.done(function (msg) {
            if (msg.resultcode == g_const_Error_Code.UnLogin) {
                Message.ShowToPage(msg.resultmessage, 1000);
            }
            if (msg.resultCode == g_const_Success_Code) {
                MemberInfo.LoadMemberInfoResult(msg);
            }
            else {
                ShowMesaage(msg.resultmessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    LoadMemberInfoResult: function (msg) {
        var memberInfo = msg.user;

        if (memberInfo.avatar.thumb) {
            $("#imgHeadUrl").attr("src", memberInfo.avatar.thumb).data("url", memberInfo.avatar.thumb);
        }
        if (memberInfo.mobile.length == 11) {
            $("#phone").html("<b>手&emsp;机</b>" + memberInfo.mobile.substr(0, 3) + "****" + memberInfo.mobile.substr(7, 4));
        }
        else {
            $("#phone").html("<b>手&emsp;机</b>" + UserLogin.LoginName.substr(0, 3) + "****" + UserLogin.LoginName.substr(7, 4));
        }
        if (memberInfo.nickname.length == 0) {
            if (memberInfo.mobile.length == 0) {
                $("#txtNickName").val(UserLogin.LoginName.substr(0, 3) + "****" + UserLogin.LoginName.substr(7, 4));
            }
            else {
                $("#txtNickName").val(memberInfo.mobile.substr(0, 3) + "****" + memberInfo.mobile.substr(7, 4));
            }
        }
        else {
            $("#txtNickName").val(memberInfo.nickname);
        }

        var key = g_const_Gender.GetKey(memberInfo.gender);
        $("input[value='" + key + "']").prop("checked", true);

        var arrbirthDay = [];
        if (memberInfo.birthday) {
            arrbirthDay = memberInfo.birthday.split('-');
        }
        if (arrbirthDay.length > 0) {
            
            $("#birYear").val(parseInt(arrbirthDay[0]) || 0);
            $("#birMonth").val(parseInt(arrbirthDay[1]) || 0);
            g_birthDay.InitDay();
            $("#birDate").val(parseInt(arrbirthDay[2]) || 0);
        }

        $("#txtEmail").val(memberInfo.email);
    },
    //jquery.form.min.js 上传图片
    UpLoadImg: function () {

        var $form = $("#formImg");
        var options = {
            dataType: "json",
            beforeSubmit: function () {
                var file = $("#fileHeadImg").val();
                if (file.length > 0) {
                    var exName = file.substring(file.lastIndexOf('.'), file.length);
                    var isFind = MemberInfo.ImgType.indexOf(exName);

                    if (isFind == -1) {
                        ShowMesaage("上传图片类型错误，请重新选择。</br>仅支持JPG、PNG、JPEG格式。");
                        return false;
                    }
                }
                else {
                    return false;
                }
            },
            success: function (result) {
                if (result.resultcode == g_const_Success_Code) {
                    $("#imgHeadUrl").attr("src", result.resultmessage).data("url", result.resultmessage);
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
    //更新会员信息
    UpdateMemberInfo: function () {
        var api_tag = "com_cmall_familyhas_api_ApiForPcChangeMemberInfo";
        var s_api_input = JSON.stringify(MemberInfo.UpdateApiInput);

        var obj_data = { "api_input": s_api_input, "api_target": api_tag, "api_token": g_const_api_token.Wanted };
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
                MemberInfo.LoadMemberInfoResult(msg);
                ShowMesaage("保存成功");
                setTimeout(function () {
                    $("#messageShow").hide();
                }, 1000);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    }
};

var DefaultAddress = {
    api_input: {},
    api_target: "com_cmall_newscenter_beauty_api_GetAddress",
    GetDefaultAddress: function () {
        var s_api_input = JSON.stringify(DefaultAddress.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": DefaultAddress.api_target, "api_token": g_const_api_token.Wanted };
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
                DefaultAddress.LoadResult(msg.adress);
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
        var html = " <span>收货地址：</span><em>[默认]</em>";
        var defaultAddress = "您还没有添加收货地址信息";
        if (result.length > 0) {
            $(result).each(function () {
                if (this.isdefault == 1) {
                    defaultAddress = this.provinces + " " + this.street;
                }
            });
            defaultAddress = "您还没有设置默认收货地址信息！";
        }
        $("#defaultAddress").html(html + defaultAddress);
    },
}
var Message = {
    ShowToPage: function (message, time) {
        ShowMesaage(message);
        var u = GetQueryString("u");
        setTimeout("PageUrlConfig.SetReturnGoto(g_const_PageURL.Login, '" + u + "', '');", time);
    }
};