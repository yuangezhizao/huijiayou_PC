var oHeadInput = $('.ch-header input');
var oCloseBtn = $('.ch-header i');
var winWidth = $(window).width();
var winHeight = $(window).height();
$('.category-right').css('width', winWidth - 100);
$('.category-wrap').css('height', winHeight - 45);
window.onload = function () {
    oCloseBtn.css('display', oHeadInput.val() ? 'block' : 'none');
}

oHeadInput.click(function () {
    $('.ch-header').attr('id', 'curr');
});
oHeadInput.on('input', function () {
    var el = $(this);
    var val = el.val();
    oCloseBtn.css('display', val ? 'block' : 'none');
})
oCloseBtn.click(function () {
    $('.ch-header input').val('');
    $('.ch-header').attr('id', '');
});



$('.ch-big').scroll(function () {
    if ($('.ch-big').scrollTop() > 90) {
        $('.ch-up').show();
    } else {
        $('.ch-up').hide();
    }
});

// $('.ch-classify .fl li').click(function(){
//     $(this).addClass('curr').siblings().removeClass('curr');    
// });

function setScroll() {
    var myscroll = new IScroll("#category-wrap");

    // var oResultHeight=$('.category-wrap').find('ul').height();
    // var wrapHeight=$('.category-wrap').height();
    // var aLi=$('.category-wrap').find('ul li');
    // var space=oResultHeight - wrapHeight;

    // aLi.on('click',function(){
    //     var offSetTop=$(this).offset().top - 55;
    //     console.log(offSetTop)
    //     //transform: translate(0px, 0px) translateZ(0px);
    //     $('.category-wrap').find('ul').css('transform', 'translate(0px, ' + -offSetTop + 'px) translateZ(0px)')
    // })
}


$('.ch-box li').click(function () {
    var name = $(this).attr('class');
    if ('' == name || undefined == name) {
        $(this).addClass('curr');
    } else {
        $(this).removeClass('curr');
    }
});


function touchSatrtFunc(evt) {
    try {
        //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等 
        var touch = evt.touches[0]; //获取第一个触点 
        var x = Number(touch.pageX); //页面触点X坐标 
        var y = Number(touch.pageY); //页面触点Y坐标 
        //记录触点初始位置 
        startX = x;
        startY = y;
    } catch (e) {
        alert('touchSatrtFunc：' + e.message);
    }
}
//touchmove事件，这个事件无法获取坐标 
function touchMoveFunc(evt) {
    try {
        //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等 
        var touch = evt.touches[0]; //获取第一个触点 
        var x = Number(touch.pageX); //页面触点X坐标 
        var y = Number(touch.pageY); //页面触点Y坐标 
        //判断滑动方向 上下 
        if (y - startY > 0) {
            $('.ch-header').show();
            $('.ch-nav').show();
        } else if (y - startY < -0) {
            $('.ch-header').hide();
            $('.ch-nav').hide();
            $('.ch-up').show();
        }
    } catch (e) {
        alert('touchMoveFunc：' + e.message);
    }

}
//touchend事件 
function touchEndFunc(evt) {
    try {
        //evt.preventDefault(); //阻止触摸时浏览器的缩放、滚动条滚动等
    } catch (e) {
        alert('touchEndFunc：' + e.message);
    }
}
//绑定事件 
function bindEvent() {
    document.addEventListener('touchstart', touchSatrtFunc, false);
    document.addEventListener('touchmove', touchMoveFunc, false);
    document.addEventListener('touchend', touchEndFunc, false);
}
//判断是否支持触摸事件 

function isTouchDevice() {
    //document.getElementById("version").innerHTML = navigator.appVersion; 
    try {
        //document.createEvent("TouchEvent"); 
        //alert("支持TouchEvent事件！"); 
        bindEvent(); //绑定事件 
    } catch (e) {
        alert("不支持TouchEvent事件！" + e.message);
    }

}

