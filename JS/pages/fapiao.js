/// <reference path="../jquery-2.1.4.js" />
/// <reference path="../g_header.js" />
/// <reference path="../functions/g_Const.js" />

var FaPiao = {
    /*初始化*/
    "Init": function () {
        for (var i = 1; i < 3; i++) {
            $(".sela[index='" + i.toString() + "'] a").on("click", FaPiao.OnButtonClick);
        }

        var sFaPiao = localStorage[g_const_localStorage.FaPiao];
        if (typeof (sFaPiao) != "undefined") {
            var fapiao = JSON.parse(sFaPiao);
            FaPiao.FType = fapiao.BillInfo.bill_Type;
            FaPiao.FDetail = fapiao.BillInfo.bill_detail;
            FaPiao.FTitle = fapiao.BillInfo.bill_title;
        }
        var sDetailType = localStorage[g_const_localStorage.FaPiaoNR];
        if (typeof (sDetailType) != "undefined") {
            FaPiao.FDetailType = JSON.parse(sDetailType);
        }
        $("#fpnrtype").empty();
        var html = "";
        for (var i = 0; i < FaPiao.FDetailType.bills.length; i++) {
            var s = FaPiao.FDetailType.bills[i];
            if (FaPiao.FDetail==s)
                html += "<option selected='selected'>" + s + "</option>";
            else
                html += "<option>" + s + "</option>";
        }
        $("#fpnrtype").append(html);
       
        FaPiao.OnButtonClick(null);

        $("textarea").on("input propertychange", function () {
            var stxtfeed = $("textarea").val().Trim();

            if (stxtfeed.length > 49) {
                var snew = stxtfeed.substr(0, 50);
                $("textarea").val(snew);                
            }            
        });
    },
    /*选中时的操作*/
    "OnButtonClick": function (e) {
        
        if (e != null) {
            var objthis = e.target;
            $(objthis).parent().children("a").attr("class", "");
            $(objthis).attr("class", "on");
            switch ($(objthis).attr("operate")) {
                case "1":
                    FaPiao.FType = g_const_bill_Type.Normal;
                    break;
                case "0":
                    FaPiao.FType = g_const_bill_Type.NotNeed;
                    break;
                case "2":
                    FaPiao.FTitle = "个人";
                    
                    break;
                case "3":                    
                    var stitle = String.Replace($("textarea").val());
                    FaPiao.FTitle = stitle;
                    
                    break;
            }
        }
        
        if (FaPiao.FTitle == "个人") {
            $(".sela[index='2'] a[operate='2']").attr("class", "on");
            $("textarea").css("display", "none");
        }
        else {
            $(".sela[index='2'] a[operate='3']").attr("class", "on");
            $("textarea")[0].innerHTML = FaPiao.FTitle;
            $("textarea").css("display", "");
        }
        switch (FaPiao.FType) {
            case g_const_bill_Type.NotNeed:
                $(".sela[index='1'] a[operate='0']").attr("class", "on");
                $(".sbox.seld.sel-lx").css("display", "none");
                $(".sbox.mx").css("display", "none");
                $(".tip").css("display", "none");
                $("textarea").css("display", "none");
                break;
            case g_const_bill_Type.Normal:
                $(".sela[index='1'] a[operate='1']").attr("class", "on");
                $(".sbox.seld.sel-lx").css("display", "");
                $(".sbox.mx").css("display", "");
                $(".tip").css("display", "");
                break;
        }
    },
    /*发票类型*/
    "FType": g_const_bill_Type.NotNeed,
    /*发票抬头*/
    "FTitle": "个人",
    /*发票内容*/
    "FDetail": "明细",
    /*发票内容类型*/
    "FDetailType": { "bills": ["明细", "床上用品", "服装", "日用品", "数码产品", "家用电器", "护肤品", "美容用品"] },
    /*取消*/
    "Cancel": function () {        
        //$("#mask").css("display", "block");
        //$(".fbox.ftel").css("display", "");
        //FaPiao.FTitle = $("textarea").val();
        //FaPiao.WriteTolocalStorage();
        Message.ShowConfirm("<span>提示</span>放弃填写的内容吗？", "", "divAlert", "放弃", "FaPiao.Back", "继续填写");
    },
    "Back": function () {
        window.location.replace(g_const_PageURL.OrderConfirm + "?t=" + Math.random());
    },
    /*保存*/
    "Save": function () {
        var objselect = $(".sela a[class='on']");
        if (FaPiao.FType != g_const_bill_Type.NotNeed) {
            if (objselect.length != 2) {
                ShowMesaage(g_const_API_Message["100018"]);
                return;
            }
            if ($(objselect[1]).attr("operate") == "3") {
                if ($("textarea").val().Trim() == "") {
                    ShowMesaage(g_const_API_Message["100019"]);
                    return;
                }
                else {
                    FaPiao.FTitle = String.Replace($("textarea").val());
                }
            }
            FaPiao.FDetail = $("#fpnrtype").val();
        }
       
        FaPiao.WriteTolocalStorage();
        window.location.replace(g_const_PageURL.OrderConfirm + "?t=" + Math.random());
    },
    /*写入缓存*/
    WriteTolocalStorage: function () {
        var objFaPiaoInfo = {
            "BillInfo": {
                "bill_Type": FaPiao.FType,
                "bill_detail": FaPiao.FDetail,
                "bill_title": FaPiao.FTitle
            }
        };
        localStorage[g_const_localStorage.FaPiao] = JSON.stringify(objFaPiaoInfo);
    }
}