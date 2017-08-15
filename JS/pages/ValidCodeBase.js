//获取验证码
var Send_ValidCode = {
    SendCode: function (codeaction,phoneno) {
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
                    $("#div_step1").hide();
                    $("#div_step2").show();
                }
                else if (codeaction == "couponcodeexchange") {
                    Send_ValidCode.stime_change(g_const_ValidCodeTime);
                }
                else
                {
                    Send_ValidCode.stime(g_const_ValidCodeTime);
                }
                
                ShowMesaage(g_const_API_Message["7801"]);
            }
            else {
                if (codeaction == "lqfxtqvalidcode") {
                    $("#div_step1").show();
                    $("#div_step2").hide();
                }
                ShowMesaage(msg.resultmessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    stime: function (count) {
        if (count == 0) {
            $('#btnCode').attr('disabled', false);
            $('#btnCode').removeClass('curr');
            $('#btnCode').attr("class", "d_get_code");
            $('#btnCode').html('获取验证码');
            return false;
        } else {
            $('#btnCode').attr('disabled', 'disabled');

            $('#btnCode').attr("class", "d_get_code bgcccc");
            $('#btnCode').html(count + 's后可重发');
            $('#btnCode').addClass('curr');
            count--;
        }
        setTimeout(function () { Send_ValidCode.stime(count); }, 1000)
    },
    stimebind: function (count) {
        if (count == 0) {
            $('#btnCode').attr('disabled', false);
            $('#btnCode').removeClass('curr');
            $('#btnCode').attr("class", "d_get_code");
            $('#btnCode').html('获取验证码');
            return false;
        } else {
            $('#btnCode').attr('disabled', 'disabled');
            //$('#btnCode').removeAttr("onclick");
            $('#btnCode').attr("class", "d_get_code bgcccc");
            $('#btnCode').html(count + 's后可重发');
            $('#btnCode').addClass('curr');
            count--;
        }
        setTimeout(function () { Send_ValidCode.stimebind(count); }, 1000)
    },
    stime_lqfxtq:function (count) {
        if (count == 0) {
            $('#btnCode').attr('disabled', false);
            $('#btnCode').val("重发验证码");
            $('#btnCode').css("background", "#dc0f50");
            $('#btnCode').css("color", "#fff");
            $("#p_code").html(g_const_API_Message["108904"]);
            return false;
        } else {
            $('#btnCode').attr('disabled', 'disabled');
            $('#btnCode').val(count + "s后可重发");
            $('#btnCode').css("background", "#ccc");
            $('#btnCode').css("color", "#666");
            count--;
        }
        setTimeout(function () { Send_ValidCode.stime_lqfxtq(count); }, 1000)
    },
    stime_change: function (count) {
        if (count == 0) {
            sendflag = 0;
     
            $('#btnCode').html("重发验证码");
            $('#btnCode').css("background", "#dc0f50");
            $('#btnCode').css("color", "#fff");
            return false;
        } else {
            sendflag = 1;
    
            $('#btnCode').html(count + "s后可重发");
            $('#btnCode').css("background", "#a3a3a3");
            $('#btnCode').css("color", "#666");
            count--;
        }
        setTimeout(function () { Send_ValidCode.stime_change(count); }, 1000)
    },
};