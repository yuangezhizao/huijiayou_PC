
var MobileCHZ_Hisroty = {
    //获取历史列表
    GetHistoryListFromCache: function () {
        var obj_history = localStorage[g_const_localStorage.MobileCZHistory];
        if (typeof (obj_history) === "undefined") {
            return [];
        }
        else {
            try {
                var arr_history = JSON.parse(obj_history);
                return arr_history;
            }
            catch (e) {
                return [];
            }
        }
    },
    //记录数
    iCount: 5,
    //增加记录
    Add: function (phone) {
        if (phone.length == 11) {
            var arr_history = MobileCHZ_Hisroty.GetHistoryListFromCache();
            for (var i = 0; i < arr_history.length; i++) {
                if (arr_history[i].trim() == phone.trim())
                    return;
            }
            arr_history.unshift(phone);
            if (arr_history.length > MobileCHZ_Hisroty.iCount) {
                arr_history.pop();
            }
            localStorage[g_const_localStorage.MobileCZHistory] = JSON.stringify(arr_history);
        }
    },
    //删除记录
    Remove: function (phone) {

        var arr_history = MobileCHZ_Hisroty.GetHistoryListFromCache();
        for (var i = 0; i < arr_history.length; i++) {
            if (arr_history[i].trim() == phone.trim()) {
                arr_history.splice(i, 1);
            }

        }

        localStorage[g_const_localStorage.MobileCZHistory] = JSON.stringify(arr_history);
    }

}