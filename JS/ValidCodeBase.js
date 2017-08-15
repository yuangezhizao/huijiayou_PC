//获取验证码
var Send_ValidCode = {
    MerchantID: "",
    SendCode: function (codeaction, phoneno) {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=" + codeaction + "&mobileno=" + phoneno,
            dataType: "json"
        });

        request.done(function (msg) {
            if (msg.resultcode == g_const_Success_Code_IN) {
                if (codeaction == "loginvalidcode") {
                    Send_ValidCode.stime(g_const_ValidCodeTime);
                }
                else if (codeaction == "lqfxtqvalidcode") {
                    Send_ValidCode.stime_lqfxtq(g_const_ValidCodeTime);

                }
                else if (codeaction == "couponcodeexchange_" + Send_ValidCode.MerchantID) {
                    Send_ValidCode.stime_change(g_const_ValidCodeTime);
                }
                else {
                    Send_ValidCode.stime(g_const_ValidCodeTime);
                }

                ShowMesaage(g_const_API_Message["7801"]);
                setTimeout(function () {
                    $("#messageShow").hide();
                }, 1000);
            }
            else {
                //if (codeaction == "lqfxtqvalidcode") {
                //    $("#div_step1").show();
                //    $("#div_step2").hide();
                //}
                ShowMesaage(msg.resultmessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    SendCodeImg: function (codeaction, phoneno, piccode) {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=" + codeaction + "&mobileno=" + phoneno + "&piccode=" + piccode,
            dataType: "json"
        });

        request.done(function (msg) {
            if (msg.resultcode == g_const_Success_Code_IN) {
                if (codeaction == "loginvalidcode") {
                    Send_ValidCode.stime(g_const_ValidCodeTime);
                }
                else if (codeaction == "lqfxtqvalidcode") {
                    Send_ValidCode.stime_lqfxtq(g_const_ValidCodeTime);

                }
                else if (codeaction == "couponcodeexchange_" + Send_ValidCode.MerchantID) {
                    Send_ValidCode.stime_change(g_const_ValidCodeTime);
                }
                else {
                    Send_ValidCode.stime(g_const_ValidCodeTime);
                }

                ShowMesaage(g_const_API_Message["7801"]);
            }
            else {
                //if (codeaction == "lqfxtqvalidcode") {
                //    $("#div_step1").show();
                //    $("#div_step2").hide();
                //}
                ShowMesaage(msg.resultmessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    SendCodeImgEx: function (codeaction, phoneno, piccode, smstype) {
        var purl = g_INAPIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: "t=" + Math.random() + "&action=" + codeaction + "&mobileno=" + phoneno + "&piccode=" + piccode + "&smstype=" + smstype,
            dataType: "json"
        });

        request.done(function (msg) {
            //ToggleCode("Verify_codeImag", '/Ajax/LoginHandler.ashx');
            if (msg.resultcode == g_const_Success_Code_IN) {
                if (codeaction == "loginvalidcode") {
                    Send_ValidCode.stime(g_const_ValidCodeTime);
                }
                else if (codeaction == "lqfxtqvalidcode") {
                    Send_ValidCode.stime_lqfxtq(g_const_ValidCodeTime);

                }
                else if (codeaction == "couponcodeexchange") {
                    Send_ValidCode.stime_change(g_const_ValidCodeTime);
                }
                //else if (codeaction == "registervalidcode") {
                //    Register.PicCheck();
                //}
                else {
                    Send_ValidCode.stime(g_const_ValidCodeTime);
                }
                if ($("#span_msg")) {
                    $("#span_msg").html(g_const_API_Message["7801"]);
                }
                else {
                    ShowMesaage(g_const_API_Message["7801"]);
                }

            }
            else {
                //if (codeaction == "lqfxtqvalidcode") {
                //    $("#div_step1").show();
                //    $("#div_step2").hide();
                //}
                if (codeaction == "registervalidcode") {
                    if (msg.resultcode == "8903") {
                        SetRegisterMesaageInfo("emPicCode", "txtPicCode", "图片验证码错误");
                    }
                    else {
                        SetRegisterMesaageInfo("emValidCode", "txtValidCode", msg.resultmessage);
                    }
                }
                else  if ($("#span_msg")) {
                    $("#span_msg").html(msg.resultmessage);
                }
               
                else {
                    ShowMesaage(msg.resultmessage);
                }

            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    stime: function (count) {
        if (count == 0) {
            $('#btnCode').html("获取验证码").prop('disabled', false).removeClass("curr");
            return false;
        } else {
            $('#btnCode').html('获取验证码</br>(' + count + 's)').prop('disabled', true).addClass('curr');
            count--;
        }
        setTimeout(function () { Send_ValidCode.stime(count); }, 1000)
    },
    stimebind: function (count) {
        if (count == 0) {
            $('#btnCode').attr('disabled', false);
            $('#btnCode').html('获取验证码');
            return false;
        } else {
            $('#btnCode').attr('disabled', 'disabled');
            $('#btnCode').html(count + 's后可重发');
            $('#btnCode').addClass('curr');
            count--;
        }
        setTimeout(function () { Send_ValidCode.stimebind(count); }, 1000)
    },
    stime_lqfxtq: function (count) {
        if (count == 0) {
            $('#btnCode').attr('disabled', false);
            $('#btnCode').text("重发验证码");
            $("#p_code").html(g_const_API_Message["108904"]);
            return false;
        } else {
            $('#btnCode').attr('disabled', 'disabled');
            $('#btnCode').val(count + "s后可重发");
            count--;
        }
        setTimeout(function () { Send_ValidCode.stime_lqfxtq(count); }, 1000)
    },
    stime_change: function (count) {
        if (count == 0) {
            sendflag = 0;

            $('#btnCode').html("重发验证码");
            return false;
        } else {
            sendflag = 1;

            $('#btnCode').html(count + "s后可重发");
            count--;
        }
        setTimeout(function () { Send_ValidCode.stime_change(count); }, 1000)
    },
};

//=============================切换验证码======================================
function ToggleCode(obj, codeurl) {
    //$("#txtCode").val("");
    $("#" + obj).attr("src", codeurl + "?action=code&time=" + Math.random());
}