// ========================================
// JS简易滚动条
// ========================================
// 作者：http://www.cnblogs.com/zjfree
// 日期：2012-04-01
// ========================================

var scrollMoveObj = null, scrollPageY = 0, scrollY = 0;
var scrollDivList = new Array();
var browser = window.navigator.userAgent.toLowerCase().indexOf('firefox');
// obj需要添加滚动条的对象 w滚动条宽度 className滚动条样式名称
// obj元素 必须指定高度，并设置overflow:hidden;
// 如要兼容IE6 必须给obj元素 指定 overflow:hidden; 
function jsScroll(obj, w, className, d) {

    var t = "b1";
    if (typeof (obj) == 'string') {
        obj = document.getElementById(obj);
        t = obj + d;
    }
    else {
        t = obj.id + d;
    }
    //当内容未超出现在高度时，不添加滚动条	
    if (!obj || obj.scrollHeight <= obj.clientHeight || obj.clientHeight == 0) {
        //return;
    }
    obj.scrollBarWidth = w || 6;
    obj.style.overflow = 'hidden';
    var current_scrollBar = document.getElementById(t);
    if (current_scrollBar) {
        obj.scrollBar = current_scrollBar;
    }
    else {
        obj.scrollBar = document.createElement('div');
        document.body.appendChild(obj.scrollBar);
        obj.scrollBarIndex = document.createElement('div');
        obj.scrollBar.appendChild(obj.scrollBarIndex);
        obj.scrollBar.style.position = 'absolute';
        obj.scrollBarIndex.style.position = 'absolute';
        obj.scrollBar.className = className || '';
        if (!className) {
            obj.scrollBar.style.backgroundColor = '';
            obj.scrollBarIndex.style.backgroundColor = '#b2b2b2';
        }
    }
    scrollDivList.push(obj);
    scrollResetSize(obj, d, t);

    //使用鼠标滚轮滚动
    obj.scrollBar.scrollDiv = obj;
    obj.scrollBarIndex.scrollDiv = obj;

    //兼容代码
    var browser = window.navigator.userAgent.toLowerCase().indexOf('firefox');
    if (browser != -1) {
        obj.addEventListener("DOMMouseScroll", function (e) {
            scrollMove(e, obj);
            e.preventDefault();
        }, false);
        obj.scrollBar.addEventListener("DOMMouseScroll", function (e) {
            scrollMove(e, obj.scrollBar);
            e.preventDefault();
        }, false);
        obj.scrollBarIndex.addEventListener("DOMMouseScroll", function (e) {
            scrollMove(e, obj.scrollBarIndex);
            e.preventDefault();
        }, false);
    }
    else {
        obj.onmousewheel = scrollMove;
        obj.scrollBar.onmousewheel = scrollMove;
        obj.scrollBarIndex.onmousewheel = scrollMove;
    }
    //拖动滚动条滚动
    obj.scrollBarIndex.onmousedown = function (evt) {
        evt = evt || event;
        scrollPageY = evt.clientY;
        scrollY = this.scrollDiv.scrollTop;
        isScrollMove = true;
        document.body.onselectstart = function () { return false };
        scrollMoveObj = this.scrollDiv;
        if (this.scrollDiv.scrollBar.className == '') {
            this.scrollDiv.scrollBarIndex.style.backgroundColor = '#b2b2b2';
        }
        return false;
    }
}

//当页面大小发生变化时，重新计算滚动条位置
window.onresize = function () {
    for (var i = 0; i < scrollDivList.length; i++) {
        scrollResetSize(scrollDivList[i]);
    }
}

//计算滚动条位置
function scrollResetSize(o, d, t) {
    if (o.scrollHeight <= o.clientHeight) {
        o.scrollTop = 0;
        o.scrollBar.style.display = 'none';
    } else {
        o.scrollBar.style.display = 'block';
    }
    var x = 0, y = 0;
    var p = o;
    while (p) {
        x += p.offsetLeft;
        y += p.offsetTop;
        p = p.offsetParent;
    }
    var borderTop = parseInt(o.style.borderTopWidth || 0);
    var borderBottom = parseInt(o.style.borderBottomWidth || 0);
    o.scrollBar.id = t;
    o.scrollBar.style.zIndex = 1000;
    o.scrollBar.style.width = o.scrollBarWidth + 'px';
    o.scrollBar.style.height = o.clientHeight + 'px';
    o.scrollBar.style.top = y + borderTop + 'px';
    o.scrollBar.style.left = x + o.offsetWidth - o.scrollBarWidth - 3 + 'px';
    o.scrollBarIndex.style.borderRadius = 5 + 'px';
    o.scrollBarIndex.style.width = o.scrollBarWidth + 'px';
    var h = o.clientHeight - (o.scrollHeight - o.clientHeight);
    //当滚动条滑块最小20个像素
    if (h < 20) {
        h = 20;
    }
    o.scrollBarHeight = h;
    o.scrollBarIndex.style.height = h + 'px';
    o.scrollBarIndex.style.left = '0px';
    setScrollPosition(o);
}

function setScrollPosition(o) {
    o.scrollBarIndex.style.top = (o.clientHeight - o.scrollBarHeight) * o.scrollTop / (o.scrollHeight - o.clientHeight) + 'px';
    return false;
}

document.documentElement.onmousemove = function (evt) {
    if (!scrollMoveObj) return;
    evt = evt || event;
    var per = (scrollMoveObj.scrollHeight - scrollMoveObj.clientHeight) / (scrollMoveObj.clientHeight - scrollMoveObj.scrollBarHeight)
    scrollMoveObj.scrollTop = scrollY - (scrollPageY - evt.clientY) * per;
    setScrollPosition(scrollMoveObj);
}
document.documentElement.onmouseup = function (evt) {
    if (!scrollMoveObj) return;
    if (scrollMoveObj.scrollBar.className == '') {
        scrollMoveObj.scrollBarIndex.style.backgroundColor = '#aaa';
    }
    scrollMoveObj = null;
    document.body.onselectstart = function () { return true };
}

//$(document.documentElement).bind("mouseleave", function (evt) {
//    if (!scrollMoveObj) return;
//        evt = evt || event;
//        var per = (scrollMoveObj.scrollHeight - scrollMoveObj.clientHeight) / (scrollMoveObj.clientHeight - scrollMoveObj.scrollBarHeight)
//        scrollMoveObj.scrollTop = scrollY - (scrollPageY - evt.clientY) * per;
//        setScrollPosition(scrollMoveObj);
//});
//$(document.documentElement).bind("mouseenter", function (evt) {
//    if (!scrollMoveObj) return;
//    if (scrollMoveObj.scrollBar.className == '') {
//        scrollMoveObj.scrollBarIndex.style.backgroundColor = '#aaa';
//    }
//    scrollMoveObj = null;
//    document.body.onselectstart = function () { return true };
//});

// 鼠标滚轮滚动
function scrollMove(evt, obj) {
    var div = "";
    if (obj) {
        div = obj.scrollDiv || obj;
    }
    else {
        div = this.scrollDiv || this;
    }
    if (div.scrollHeight <= div.clientHeight) return false;
    evt = evt || event;
    var step = 20;
    var down = 1;
    if (browser != -1) {
        if (evt.detail < 0) {
            down = 1;
        }
        else {
            down = 0;
        }

    }
    else {
        if (evt.wheelDelta < 0) {
            down = 0;
        }
        else {
            down = 1;
        }
    }
    if (down == 0) {
        if (div.scrollTop >= (div.scrollHeight - div.clientHeight)) return false;
        div.scrollTop += step;
    } else {
        if (div.scrollTop == 0) return false;
        div.scrollTop -= step;
    }
    setScrollPosition(div);
    return false;
}