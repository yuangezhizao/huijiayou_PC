

var g_birthDay = {
    $YearSelector: "#sel_year",
    $MonthSelector: "#sel_month",
    $DaySelector: "#sel_day",
    FirstText: "请选择",
    FirstValue: 0,
    Init: function (opts) {
        g_birthDay.$YearSelector = $(opts.YearSelector);
        g_birthDay.$MonthSelector = $(opts.MonthSelector);
        g_birthDay.$DaySelector = $(opts.DaySelector);
        g_birthDay.FirstText = opts.FirstText || g_birthDay.FirstText;
        g_birthDay.FirstValue = opts.FirstValue || g_birthDay.FirstValue;

        g_birthDay.InitDefaultOp();
        g_birthDay.InitYear();
        g_birthDay.InitMonth();

        g_birthDay.$MonthSelector.change(function () {
            g_birthDay.InitDay();
        });
        g_birthDay.$YearSelector.change(function () {
            g_birthDay.InitDay();
        });
    },
    InitDefaultOp: function () {
        var str = "<option value=\"" + g_birthDay.FirstValue + "\">" + g_birthDay.FirstText + "</option>";
        g_birthDay.$YearSelector.html(str);
        g_birthDay.$MonthSelector.html(str);
        g_birthDay.$DaySelector.html(str);
    },
    InitYear: function () {
        // 年份列表
        var yearNow = new Date().getFullYear();
        for (var i = yearNow; i >= 1900; i--) {
            var yearStr = "<option value=\"" + i + "\">" + i + "</option>";
            g_birthDay.$YearSelector.append(yearStr);
        }
    },
    InitMonth: function () {
        // 月份列表
        for (var i = 1; i <= 12; i++) {
            var monthStr = "<option value=\"" + i + "\">" + i + "</option>";
            g_birthDay.$MonthSelector.append(monthStr);
        }
    },
    InitDay: function () {
        var str = "<option value=\"" + g_birthDay.FirstValue + "\">" + g_birthDay.FirstText + "</option>";
        // 日列表(仅当选择了年月)
        if (g_birthDay.$YearSelector.val() == 0 || g_birthDay.$MonthSelector.val() == 0) {
            // 未选择年份或者月份
            g_birthDay.$DaySelector.html(str);
        } else {
            g_birthDay.$DaySelector.html(str);
            var year = parseInt(g_birthDay.$YearSelector.val());
            var month = parseInt(g_birthDay.$MonthSelector.val());
            var dayCount = 0;
            switch (month) {
                case 1:
                case 3:
                case 5:
                case 7:
                case 8:
                case 10:
                case 12:
                    dayCount = 31;
                    break;
                case 4:
                case 6:
                case 9:
                case 11:
                    dayCount = 30;
                    break;
                case 2:
                    dayCount = 28;
                    if ((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0)) {
                        dayCount = 29;
                    }
                    break;
                default:
                    break;
            }

            for (var i = 1; i <= dayCount; i++) {
                var dayStr = "<option value=\"" + i + "\">" + i + "</option>";
                g_birthDay.$DaySelector.append(dayStr);
            }
        }
    }

};