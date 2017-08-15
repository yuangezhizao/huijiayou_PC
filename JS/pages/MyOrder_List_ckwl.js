

//我的订单--物流[不拆包的]
var MyOrder_wl = {
    //家有汇--订单配送轨迹查询接口
    api_target: "com_cmall_groupcenter_account_api_ApiHomeOrderTracking",
    api_input: { "order_code": "" },
    GetList: function () {
        if (GetQueryString("baoguoid") != "") {
            MyOrder_wl_chaibao.GetList();
        }
        else {
            //赋值
            MyOrder_wl.api_input.order_code = GetQueryString("orderno");
            $("#i_orderno").html(GetQueryString("orderno"));
            //组织提交参数
            var s_api_input = JSON.stringify(this.api_input);
            //提交接口[api_token不为空，公用方法会从sission中获取]
            var obj_data = { "api_input": s_api_input, "api_target": MyOrder_wl.api_target, "api_token": g_const_api_token.Wanted };
            var purl = g_APIUTL;
            var request = $.ajax({
                url: purl,
                cache: false,
                method: g_APIMethod,
                data: obj_data,
                dataType: g_APIResponseDataType
            });
            //正常返回
            request.done(function (msg) {

                if (msg.resultcode) {
                    if (msg.resultcode == g_const_Error_Code.UnLogin) {
                        //Session失效，重新登录，传递回调地址 http://localhost:6338/IndexMain.html?u=MyOrder_detail&orderno=DD23138104
                        Message.ShowToPage("", g_const_PageURL.MainIndex + "?u=" + g_const_PageURL.GetKey(g_const_PageURL.MyOrder_List_ckwl) + "&orderno=" + MyOrder_wl.api_input.order_code, 500, "");
                        return;
                    }
                    if (msg.resultcode != g_const_Success_Code_IN) {
                        ShowMesaage(msg.resultmessage);
                        return;
                    }
                }

                if (msg.resultCode == g_const_Success_Code) {
                    if (msg.apiHomeOrderTrackingListResult.length > 0) {
                        MyOrder_wl.Load_Result(msg);
                    }
                    else {
                        var showstr = "<h2>物流动态</h2><span>暂无物流信息</span>"
                        $("#ul_wl").html(showstr);
                        $("#ul_wl").show();
                    }
                }
                else {
                    ShowMesaage(msg.resultMessage);
                }
            });
            //接口异常
            request.fail(function (jqXHR, textStatus) {
                ShowMesaage(g_const_API_Message["7001"]);
            });
        }
    },
    //接口返回成功后的处理
    Load_Result: function (resultlist) {
        var bodyList = "";
        var dis_time = "";
        for (var i = resultlist.apiHomeOrderTrackingListResult.length - 1; i > 0; i--) {
            if (resultlist.apiHomeOrderTrackingListResult[i].orderTrackTime.split(' ')[0] != dis_time) {
                dis_time = resultlist.apiHomeOrderTrackingListResult[i].orderTrackTime.split(' ')[0];
                if (i > 0) {
                    bodyList += "</p>";
                    bodyList += "</li>";
                }
                bodyList += "<li>";
                bodyList += "<b>" + dis_time + "</b>";
                bodyList += "<p>";
            }
            bodyList += "<span>" + resultlist.apiHomeOrderTrackingListResult[i].orderTrackTime.split(' ')[1].substr(0, 8) + "<i>" + resultlist.apiHomeOrderTrackingListResult[i].orderTrackContent + "</i></span>";
        }
        $("#ul_wl").html(bodyList);

    },
    //接口返回失败后的处理
    Load_ResultErr: function (resultlist) {
    },
};

//我的订单--物流[拆包的]
var MyOrder_wl_chaibao = {
    
    //惠家有--跨境通物流轨迹接口
    api_target: "com_cmall_familyhas_api_ApiKJTOrderTrace",
    api_input: { "order_code": "" },
    GetList: function () {
        //赋值
        MyOrder_wl_chaibao.api_input.order_code = GetQueryString("orderno");
        var baoguoid = GetQueryString("baoguoid");
        $("#i_orderno").html(GetQueryString("orderno"));
        $("#i_baoguoshow").html("【包裹" + baoguoid + "】");
        //组织提交参数
        var s_api_input = JSON.stringify(this.api_input);
        //提交接口[api_token不为空，公用方法会从sission中获取]
        var obj_data = { "api_input": s_api_input, "api_target": MyOrder_wl_chaibao.api_target, "api_token": g_const_api_token.Wanted };
        var purl = g_APIUTL;
        var request = $.ajax({
            url: purl,
            cache: false,
            method: g_APIMethod,
            data: obj_data,
            dataType: g_APIResponseDataType
        });
        //正常返回
        request.done(function (msg) {

            if (msg.resultcode) {
                if (msg.resultcode == g_const_Error_Code.UnLogin) {
                    //Session失效，重新登录，传递回调地址 http://localhost:6338/IndexMain.html?u=MyOrder_detail&orderno=DD23138104
                    Message.ShowToPage("", g_const_PageURL.MainIndex + "?u=" + g_const_PageURL.GetKey(g_const_PageURL.MyOrder_List_ckwl) + "&orderno=" + MyOrder_wl_chaibao.api_input.order_code + "&baoguoid=" + baoguoid, 500, "");
                    return;
                }
                if (msg.resultcode != g_const_Success_Code_IN) {
                    ShowMesaage(msg.resultmessage);
                    return;
                }
            }

            if (msg.resultCode == g_const_Success_Code) {
                if (msg.orderTraceInfos.length > 0) {
                    MyOrder_wl_chaibao.Load_Result(msg, baoguoid);
                }
                else {
                    var showstr = "<h2>物流动态</h2><span>暂无物流信息</span>"
                    $("#ul_wl").html(showstr);
                    $("#ul_wl").show();
                }
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });
        //接口异常
        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    //接口返回成功后的处理
    Load_Result: function (resultlist, baoguoid) {
        var bodyList = "";
        var dis_time = "";
        for (var i = resultlist.orderTraceInfos.length - 1; i >= 0; i--) {
            var code_seq=$("#i_orderno").html()+"#"+baoguoid;
            if (resultlist.orderTraceInfos[i].order_code_seq != null) {
                if (resultlist.orderTraceInfos[i].order_code_seq == code_seq) {


                    //是传递进来的包裹
                    var j = 0;
                    resultlist.orderTraceInfos[i].expressList.forEach(function (e) {

                        if (e.time.split(' ')[0].substr(0, 10) != dis_time) {
                            dis_time = e.time.split(' ')[0];
                            if (j > 0) {
                                bodyList += "</p>";
                                bodyList += "</li>";
                            }
                            bodyList += "<li>";
                            bodyList += "<b>" + dis_time + "</b>";
                            bodyList += "<p>";
                        }
                        else {
                            bodyList += "<li>";
                            bodyList += "<b></b>";
                            bodyList += "<p>";
                        }
                        bodyList += "<span>" + e.time.split(' ')[1].substr(0, 8) + "<i>" + e.context + "</i></span>";
                        j++;
                    });
                }
            }
        }
        $("#ul_wl").html(bodyList);

        if (bodyList == "") {
            var showstr = "<h2>物流动态</h2><span>暂无物流信息</span>"
            $("#ul_wl").html(showstr);
            $("#ul_wl").show();
        }


    },
    //接口返回失败后的处理
    Load_ResultErr: function (resultlist) {
    },
};