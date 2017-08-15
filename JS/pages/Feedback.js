/// <reference path="../functions/g_Const.js" />
/// <reference path="../functions/g_Type.js" />
/// <reference path="../g_header.js" />
/// <reference path="../jquery-2.1.4.js" />

$(document).ready(function () {
    $("#btn_tj").click(function () {
        Feedback.GetList();
    });
    
    $("#txtFeed").on("input propertychange", function () {
        var stxtfeed = $("#txtFeed").val().Trim();

        if (stxtfeed.length > 199) {
            var snew = stxtfeed.substr(0, 200);
            $("#txtFeed").val(snew);            
            $("#textlen").text(snew.length);
        }
        else {
           
            $("#textlen").text(stxtfeed.length);
            
            //event.returnValue = true;
        }
    });
    
    //返回
    $(".go-back").on("click", function () {
        //alert("后退");
        //history.back();
        //window.location.href = PageUrlConfig.BackTo();
        //window.location.href = g_const_PageURL.Feedback_Index;
        window.location.replace(g_const_PageURL.Feedback_Index + "?t=" + Math.random());
    });

    $("#txtFeed").focus();

});

function GetValueCount() {
    return false;
}

//提交
var Feedback = {
    api_target: "com_cmall_familyhas_api_ApiForSuggestionFeedback",
    api_input: { "suggestionFeedback": "", "serialNumber": "", "version": 1 },
    GetList: function () {
        if ($("#txtFeed").val().length == 0) {
            $("#txtFeed").empty();
            return;
        }
        var suggestion = $("#txtFeed").val();
        if (suggestion.trim() == "") {
            ShowMesaage("对不起，请输入您要反馈的建议。");
            return;
        }
        suggestion = Base64.utf16to8(suggestion);
        Feedback.api_input.suggestionFeedback = Base64.base64encode(suggestion);//String.Replace($("#txtFeed").val()); 
        Feedback.api_input.serialNumber = "";
        
        var s_api_input = JSON.stringify(Feedback.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": Feedback.api_target, "api_token": g_const_api_token.Wanted };

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
                ShowMesaage(g_const_API_Message["100020"]);
                setTimeout(function () {
                    //location = g_const_PageURL.Feedback_Index;//"/Feedback_Index.html";
                    window.location.replace(g_const_PageURL.Feedback_Index + "?t=" + Math.random());

                }, 2000);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
};


