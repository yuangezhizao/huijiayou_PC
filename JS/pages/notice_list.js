


var compaging = {
    //公告列表接口请求参数
    config: {
        page: { limit: 10, offset: 0 }
    },
    //先是分页
    init_paging: function (option) {//offset当前页，limit每页多少条，count总条数,containerClass 分页容器ID  clickFunc:点击页码后的调用方法
        var offset = option.offset;
        var limit = option.limit;
        var count = option.count;
        var containerClass = option.containerClass;
        var a = [];
        var pageNum = Math.ceil(count / limit);//总页数
        if (pageNum == 0)//如果没有数据则显示1页
            return;
        if (offset == 1) {
            a[a.length] = '<a style="cursor:pointer" class="on"><span id="spprev">← 上一页</span></a>';
        } else {
            a[a.length] = '<a style="cursor:pointer" ><span id="spprev">← 上一页</span></a>';
        }

        if (pageNum <= 7) {
            //总页数小于10
            for (var i = 1; i <= pageNum; i++) {
                compaging.setPageList(offset, i, a);
            }
        }
        else {
            if (offset <= 4) {
                for (var i = 1; i <= 5; i++) {
                    compaging.setPageList(offset, i, a);
                }
                a[a.length] = "...<a style=\"cursor:pointer\" href=\"#\">" + pageNum + "</a>";
            }
            else if (offset >= pageNum - 3) {
                a[a.length] = "<a style=\"cursor:pointer\" href=\"#\">1</a>...";
                for (var i = pageNum - 4; i <= pageNum; i++) {
                    compaging.setPageList(offset, i, a);
                }
            }
            else { //当前页在中间部分
                a[a.length] = "<a style=\"cursor:pointer\" href=\"#\">1</a>...";
                for (var i = offset - 2; i <= offset + 2; i++) {
                    compaging.setPageList(offset, i, a);
                }
                a[a.length] = "...<a href=\"#\">" + pageNum + "</a>";
            }
        }

        if (offset == pageNum) {
            a[a.length] = '<a style="cursor:pointer" class="on" href="#"><span id="spnext">下一页 →</span></a>';
        } else {
            a[a.length] = '<a style="cursor:pointer"href="#"><span id="spnext">下一页 →</span></a>';
        }

        //跳转按钮
        var totalPagenum = count / compaging.config.page.limit;
        if (parseInt(totalPagenum) * compaging.config.page.limit != count) {
            totalPagenum = parseInt(totalPagenum) + 1;
        }
        NoticeDF.count = totalPagenum;

        var tz = "<span id=\"PageSet\">"
                + "<em>共" + totalPagenum + "页 到第<input id=\"jumppage\" type=\"text\" value=\"" + (compaging.config.page.offset + 1) + "\">页</em><a id=\"btn_jump\"btn_jump style=\"cursor:pointer\" onclick=\"compaging.jumpPage();\">确定</a>"
                + "</span>";

        //页面显示分页页码
        $("#" + containerClass).html("<span id=\"PaginationTB\" >" + a.join("") + "</span>" + tz);

        //为所有分页按钮加事件
        $("#" + containerClass + " a").click(function () {
            if (this.id == "btn_jump") {
                var i = $("#jumppage").val();
                if (isNaN(i) || i == 0) {
                    i = 1;
                }

                if (i == 1) {
                    compaging.config.page.offset = 0;
                    option.clickFunc();
                }
                else {
                    compaging.config.page.offset = parseInt(i - 1);
                    option.clickFunc(parseInt(i));
                }

            }
            else {
                var index = this.innerHTML;
                if (index.indexOf("上一页") > -1) {
                    if (offset == 1)
                        return;
                    compaging.config.page.offset = parseInt(offset - 2);
                    option.clickFunc(offset - 2);
                }
                else if (index.indexOf("下一页") > -1) {
                    if (offset == pageNum)
                        return;
                    compaging.config.page.offset = parseInt(offset);
                    option.clickFunc(offset);
                }
                else {
                    compaging.config.page.offset = parseInt(index - 1);
                    option.clickFunc(index - 1);
                }
            }
        });
    },
    //设置页码
    setPageList: function (offset, i, a) {
        if (offset == i) {
            a[a.length] = "<a href=\"#\" class=\"curr\" id=\"page_" + i + "\">" + i + "</a>";
        } else {
            a[a.length] = "<a href=\"#\" id=\"page_" + i + "\">" + i + "</a>";
        }
    },
    //跳转
    jumpPage: function () {
        /*var i = $("#jumppage").val();
		compaging.config.page.offset = parseInt(i-1);


        if (isNaN(i) || i == 0) {
            i = 0;
        }
        else {
            i = i - 1;
        }
        NoticeDF.GetList(i);
		*/
    },

};

function pageSelect(page_id) {
    if (NoticeDF.count > page_id) {
        compaging.config.page.offset = page_id;
        //$('#loadTip').show();
        NoticeDF.GetList(page_id);
    }
    else {
        NoticeDF.GetList(NoticeDF.count);
    }
}


//加在公告列表
var NoticeDF = {
    count: 0,
    api_target: "com_cmall_familyhas_api_ApiForAnnounce",
    api_input: { "paging": compaging.config.page },
    //家友公告
    GetList: function (offset) {
        //参数赋值
        if (!(offset == undefined)) {
            if (isNaN(offset)) {
                offset = 0;
            }
            if (parseInt(offset) > NoticeDF.count) {
                offset = NoticeDF.count;
            }
            //compaging.config.page.offset =parseInt(offset) ;
        }
        NoticeDF.api_input.paging = compaging.config.page;

        var s_api_input = JSON.stringify(NoticeDF.api_input);
        var obj_data = { "api_input": s_api_input, "api_target": NoticeDF.api_target };

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
                NoticeDF.Load_Data(msg);
            }
            else {
                ShowMesaage(msg.resultMessage);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            ShowMesaage(g_const_API_Message["7001"]);
        });
    },
    Load_Data: function (data) {
        if (data.resultCode == 1) {
            var notices = data.announceList;
            //NoticeDF.count = data.paged.total;

            var totalPagenum = data.paged.total / compaging.config.page.limit;
            if (parseInt(totalPagenum) * compaging.config.page.limit != data.paged.total) {
                totalPagenum = parseInt(totalPagenum) + 1;
            }
            NoticeDF.count = totalPagenum;

            var noticeHtml = "";
            for (i in notices) {
                noticeHtml += "<li><a onclick=\"NoticeDF.GoTo('" + notices[i].id + "')\" >" + notices[i].title + "</a> <span>" + notices[i].update_time + "</span></li>";
            }
            //显示当前页列表
            $("#notice_content").html(noticeHtml);
            //分页处理
            FormatTB(data.paged.total, compaging.config.page.limit, compaging.config.page.offset, pageSelect);
            //compaging.init_paging({ offset: compaging.config.page.offset + 1, limit: compaging.config.page.limit, count: data.paged.total, containerClass: "PaginationTB", clickFunc: NoticeDF.GetList });
        }
    },
    GoTo: function (uid) {
        //PageUrlConfig.SetUrl(g_const_PageURL.MainIndex + "?u=NoticeList&page=" + compaging.config.page.offset);
        //window.location.replace(g_const_PageURL.MainIndex + "?u=NoticeDetail&uid=" + uid + "&page=" + compaging.config.page.offset + "&t=" + Math.random());
        window.location.href = g_const_PageURL.MainIndex + "?u=NoticeDetail&uid=" + uid + "&page=" + compaging.config.page.offset + "&t=" + Math.random()
    },
};


$(document).ready(function () {

    $("#toindex").on("click", function () {
        //PageUrlConfig.SetUrl(g_const_PageURL.MainIndex + "?u=NoticeList&page=" + compaging.config.page.offset);
        //var p = "&t=" + Math.random();
        //g_index.GoTo(g_const_PageURL.Index, p);
        window.location.href = g_const_PageURL.Index + "?t=" + Math.random()

    });

    var page = GetQueryString("page");
    if (!isNaN(page) && page != "") {
        NoticeDF.GetList(page);
    }
    else {
        NoticeDF.GetList();
    }

});