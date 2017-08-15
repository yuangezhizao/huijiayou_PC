/// <reference path="../functions/AccountMenu.js" />
/// <reference path="../functions/g_Const.js" />
/// <reference path="../functions/g_Type.js" />
/// <reference path="../jquery-2.1.4.js" />
/// <reference path="../g_header.js" />
var page_my_jifen = {
    MenuName: "我的积分",
    Init: function () {
        AccountMenu.ShowMenu("div.home ul.fl", "#tpl_menu", page_my_jifen.MenuName);
        page_my_jifen.InitSelectYear();        
        page_my_jifen.LoadJiFen();

    },
    PageNavigation: function (pageno, jq) {
        page_my_jifen.curPage = parseInt(pageno.toString(), 10) + 1;
        page_my_jifen.LoadJiFen();
    },
    //初始化年份选择下拉框
    InitSelectYear: function () {
        var html = "<option value=\"\">全部时间</option>";
        var now = new Date();
        var minyear = 2012;
        for (var year = now.getFullYear(); year >= minyear; year--)
            html += "<option value=\"" + year.toString() + "\">" + year.toString() + "年</option>";
        html += "<option value=\"-" + minyear.toString() + "\">" + minyear.toString() + "年之前</option>";
        $("#sel_year").html(html);

        $("#sel_year").on("change", function () {
            page_my_jifen.curPage = 1;
            page_my_jifen.LoadJiFen();
        });
    },
    //获取积分数据
    LoadJiFen: function () {
        g_type_api.api_input = {
            //查询年份.如果是空则查询所有，非空刚查询相应年份数据,如果为 XXXX年以前，请输入 -XXXX
            time: $("#sel_year").val(),
            //查询类型.0：用户积分、1：用户礼金卷、2：用户储值金、3：用户暂存款
            type: "0",
            paging: {
                //每页条数	
                limit: page_my_jifen.PageSize,
                offset: page_my_jifen.curPage
            },
            version: 1
        };
        g_type_api.api_target = "com_cmall_familyhas_api_ApiUserInfoQueryFromHomePc";
        g_type_api.api_token = g_const_api_token.Wanted;
        g_type_api.LoadData(page_my_jifen.AfterLoadJiFen, "");
    },
    //
    AfterLoadJiFen: function (msg) {
        var html = "";
        var stpl = $("#tpl_jifenlist").html();
        for (var k = 0 ; k < msg.points.length;k++) {
            var jifen = msg.points[k];
            var data = {
                jifentime: jifen.etr_date,
                jifenin: jifen.get_point,
                jifenout: jifen.consume_point,
                jifenmemo: jifen.remark
            };
            html += renderTemplate(stpl,data);
        }
        $("table tbody").html(html);

        $(".saving h2 b").html(msg.availablePoint);
        $(".saving h2 i").html(msg.pointTip);
        FormatTB(msg.paged.total, page_my_jifen.PageSize, (page_my_jifen.curPage - 1), page_my_jifen.PageNavigation);
    },
    //当前页
    curPage: 1,
    //每页记录数
    PageSize: 10
};