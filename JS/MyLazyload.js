
function lazyload_class(className, beginHeight) {
    //功能：当div完整出现在屏幕时，加载。
    //参数className，需要进行懒加载的元素的类名，要取一样的名字
    //参数beginHeight，滚动条滚到哪里，开始监听
    //必须有inited熟悉你给，request-url属性，loading的图片自己准备。可以卸载.loading中。
    if (!className) {
        return;
    }
    if (!beginHeight) beginHeight = 0;
    lazyDivList = $("." + className);
    $(window).scroll(function () {
        srcTop = $(window).scrollTop();
        if (srcTop >= beginHeight) {
            lazyDivList.trigger("lazyme", $(window).scrollTop());
        }
    });
    lazyDivList.bind("lazyme", function (e, scrTop) {
        var offset = $(this).offset().top;
        var interval = $(window).height() - $(this).height();//当前页面可视高度
        var sumB = offset;
        var sumS = offset - interval;
        var url = $(this).attr("request-url");//从request-url属性中获得真正需要加载的内容

        if (scrTop >= sumS && scrTop <= sumB) {
            $(this).load(url, function (responseTxt, statusTxt, xhr) {
                if (statusTxt == "success") {
                    $(this).removeClass(className);
                    $(this).unbind("lazyme");
                };
            });
        }
    });
}


function lazyload_my(className, beginHeight,url) {
    //功能：当div完整出现在屏幕时，加载。
    //参数className，需要进行懒加载的元素的类名，要取一样的名字
    //参数beginHeight，滚动条滚到哪里，开始监听
    //必须有inited熟悉你给，request-url属性，loading的图片自己准备。可以卸载.loading中。
    if (!className) {
        return;
    }
    if (!beginHeight) beginHeight = 0;
    lazyDivList = $("." + className);
    $(window).scroll(function () {
        srcTop = $(window).scrollTop();
        if (srcTop >= beginHeight) {
            lazyDivList.trigger("lazyme", $(window).scrollTop());
        }
    });
    lazyDivList.bind("lazyme", function (e, scrTop) {
        var offset = $(this).offset().top;
        var interval = $(window).height() - $(this).height();//当前页面可视高度
        var sumB = offset;
        var sumS = offset - interval;
       // var url = $(this).attr("request-url");//从request-url属性中获得真正需要加载的内容
        var url = url;//从传入参数中读取需要加载的内容

        if (scrTop >= sumS && scrTop <= sumB) {
            $(this).load(url, function (responseTxt, statusTxt, xhr) {
                if (statusTxt == "success") {
                    $(this).removeClass(className);
                    $(this).unbind("lazyme");
                };
            });
        }
    });
}

function lazyload_allimg(divid, beginHeight) {
    //功能：当div完整出现在屏幕时，加载。
    //参数divid，需要进行懒加载的元素的类名，要取一样的名字
    //参数beginHeight，滚动条滚到哪里，开始监听
    //必须有inited熟悉你给，request-url属性，loading的图片自己准备。可以卸载.loading中。

    if (!beginHeight) beginHeight = 0;
    //lazyDivList = $("." + className);
    if (divid != "") {
        lazyDivList = $("#" + divid +" img");

    }
    else {
        lazyDivList = $("img");
    }
    $(window).scroll(function () {
        srcTop = $(window).scrollTop();
        if (srcTop >= beginHeight) {
            lazyDivList.trigger("lazyme", $(window).scrollTop());
        }
    });
    lazyDivList.bind("lazyme", function (e, scrTop) {
        var url = $(this).attr("request-url");//从request-url属性中获得真正需要加载的内容
        if (url != "" && !(url == undefined)){
            //图片距离顶部的距离
            var offset = $(this).offset().top;
            //滚动距离+体现加载高度+屏幕可视高度
            var temp = scrTop + beginHeight + $(window).height();

            if (temp >= offset && temp > 0) {
                $(this).attr("src", url);
                $(this).attr("request-url", "");//加载后防止再次加载
            }
            else {
                //$(this).attr("src", g_goods_Pic);
            }
        }
        else {
            
        }
    });
}
