var Foot = {
    Warrant: function () {
        var ul_html = "";
        ul_html += "<li class=\"l1\">";
        ul_html += "<b>100%正品保证</b>";
        ul_html += "<i>质量有保障</i>";
        ul_html += "</li>";
        ul_html += "<li class=\"l2\">";
        ul_html += "<b>在线支付 全场包邮</b>";
        ul_html += "<i>送货上门</i>";
        ul_html += "</li>";
        ul_html += "<li class=\"l3\">";
        ul_html += "<b>支持银联刷卡付款</b>";
        ul_html += "<i>付款更安全</i>";
        ul_html += "</li>";
        ul_html += "<li class=\"l4\">";
        ul_html += "<b>货到付款 开箱验货</b>";
        ul_html += "<i>满意才收货</i>";
        ul_html += "</li>";
        //ul_html += "<li class=\"l5\">";
        //ul_html += "<b>7x24小时人工服务</b>";
        //ul_html += "<i>微笑无时无刻 4008-678-888</i>";
        //ul_html += "</li>";
        $("#ul_warrant").html(ul_html);
    }
};