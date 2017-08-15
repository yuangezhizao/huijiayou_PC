var HelpMsg = {
    api_target: "com_cmall_homepool_api_ApiForIndexWebMes",
    api_input: { "version": 1 },
    CategoryID:GetQueryString("cid"),
    GetList: function () {
        var s_api_input = JSON.stringify(HelpMsg.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": HelpMsg.api_target, "api_token": "" };
        var purl = g_Help_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            var bodyList = "";
            $("#div_title").html("");
            var defaultCategory = "";
            $.each(msg.messList, function (i, n) {

                bodyList += "<dl><dt>" + n.category_note + "</dt>";
                $.each(n.messList, function (j, m) {
                    if (i == 0 && j == 0) {
                        defaultCategory = m.category_code;
                    }
                    bodyList += "<dd><a id=\"a_" + m.category_code + "\" onclick=\"HelpMsg.GetMsg('" + m.category_code + "')\">&gt; " + m.category_note + "</a></dd>";
                });
                bodyList += "</dl>";
            });
            $("#div_title").append(bodyList);
            if (HelpMsg.CategoryID == "") {
                HelpMsg.GetMsg(defaultCategory);
            }
            else {
                HelpMsg.GetMsg(HelpMsg.CategoryID);
            }
        });
        //接口异常
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    GetListIndex: function () {
        var s_api_input = JSON.stringify(HelpMsg.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": HelpMsg.api_target, "api_token": "" };
        var purl = g_Help_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            var bodyList = "";
            $("#div_title_index").html("");
            var defaultCategory = "";
            $.each(msg.messList, function (i, n) {

                bodyList += "<dl><dt><a>" + n.category_note + "</a></dt>";
                $.each(n.messList, function (j, m) {
                    if (i == 0 && j == 0) {
                        defaultCategory = m.category_code;
                    }
                    bodyList += "<dd><a id=\"a_" + m.category_code + "\" onclick=\"HelpMsg.HelpUrl('" + m.category_code + "')\">" + m.category_note + "</a></dd>";
                });
                bodyList += "</dl>";
            });
            $("#div_title_index").append(bodyList);
        });
        //接口异常
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    GetMsg: function (category) {
        $("#div_title").find("a").each(function () {
            $(this).attr("class", "");
        });
        $("#a_" + category).attr("class", "on");
        var obj_data = { "api_input": "action=hpmsg&category=" + category };
        var psurl = g_HelpMsg_APIUTL;
        var request = $.ajax({
            url: psurl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });
        request.done(function (msg) {
            var bodyList = "";
            $("#div_content").html("");
            $("#div_content").append(msg.mess_note);
        });
        //接口异常
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    HelpUrl: function (category) {
        g_const_PageURL.GoByMainIndex(g_const_PageURL.Help, '&cid=' + category, '', '1');
    }
};