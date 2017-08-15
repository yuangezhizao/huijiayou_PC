//登录切换效果
$('#us').click(function () {
    $(this).addClass('curr');
    $('#login').removeClass('curr');
    $('#user').show();
    $('#quick').hide();
});
$('#login').click(function () {
    $(this).addClass('curr');
    $('#us').removeClass('curr');
    $('#user').hide();
    $('#quick').show();
});

$('#quick button').click(function () {
    var mobile = $('#mobile').val();
    if (mobile == null || mobile == undefined || mobile == "" || 11 != mobile.length) {
        $('#mobile').addClass('curr');
        $('#tips').html('请填写11位正确手机号');
        $('#tips').removeClass('f1');
        return false;
    }
    stime(60);
});


$('.search input').click(function () {
    $('.relevance').show();
});

/*=获取验证码倒计时*/
function stime(countdown) {
    if (countdown == 0) {
        $('#quick button').attr('disabled', false);
        $('#quick button').removeClass('curr');
        $('#quick button').html('获取验证码');
        return false;
    } else {
        $('#quick button').attr('disabled', 'disabled');
        $('#quick button').html(countdown + 's后<br>重新获取');
        $('#quick button').addClass('curr');
        countdown--;
    }
    setTimeout(function () {
        stime(countdown);
    }, 1000)
}

/*=获取验证码倒计时*/
function time(countdown) {
    if (countdown == 0) {
        $('#register button').attr('disabled', false);
        $('#register button').removeClass('curr');
        $('#register button').html('获取验证码');
        return false;
    } else {
        $('#register button').attr('disabled', 'disabled');
        $('#register button').html('获取验证码<br>(' + countdown + 's)');
        $('#register button').addClass('curr');
        countdown--;
    }
    setTimeout(function () {
        time(countdown);
    }, 1000)
}

/*=返回顶部*/
$(function () {
    $(window).scroll(function () {
        if ($(window).scrollTop() > 100) {
            $("#back-to-top").fadeIn(500);
        } else {
            $("#back-to-top").fadeOut(500);
        }
    });
    $("#back-to-top").click(function () {
        $('body,html').animate({ scrollTop: 0 }, 1000);
        return false;
    });
});


/*=颜色选择*/
$('.option a').click(function () {
    $(this).addClass('curr').siblings().removeClass('curr');
});


//收藏取消
$('#sc').click(function () {
    var clas = $(this).attr('class');
    if (null == clas || undefined == clas || '' == clas) {
        //$(this).addClass('curr');
        $(this).html('已收藏');
    } else {
        //$(this).removeClass('curr');
        $(this).html('收藏');
    }
});

$('.popup .close').click(function () {
    $('.popup').hide(500);
});


//公用头部的js

$('.pop').hide();
$('#a1').hide();
var obj1 = document.getElementById("nav1");
var obj2 = document.getElementById("a1");
$("#nav1").bind("mouseleave", function () {
    if (!(location.href.toLowerCase().indexOf("index.html") > -1 || location.pathname.toLowerCase() == "/")) {
        $('.pop').hide();
        $('#a1').hide();
        $(this).addClass("curr");
    }

    $("#popb").hide();
    return false;
});
$("#nav1").bind("mouseenter", function () {
    $('.pop').show();
    $('#a1').show();
    $(this).removeClass("curr");
    //  jsScroll(document.getElementById('pop'), 6, '', 'b');
    $(".pop").each(function () {
        $(this).perfectScrollbar();
    })
    return false;
});
if (location.pathname.toLowerCase().indexOf("index.html") > -1 || location.pathname.toLowerCase() == "/") {
    $('.pop').show();
    $('#a1').show();
}

/*搜索列表*/
$('.term .hd dd span').click(function () {
    var cla = $(this).attr('class');
    if (undefined == cla || '' == cla) {
        $(this).addClass('curr');
        $(this).html('收起');
        $(this).parent().css('height', 'auto');
        var heg = $(this).parent().height();
        $(this).parent().siblings().css('height', heg);
    } else {
        $(this).removeClass('curr');
        $(this).html('更多');
        $(this).parent().css('height', '58px');
        var heg = $(this).parent().height();
        $(this).parent().siblings().css('height', heg);
    }
});

$('.term .hd dd a').click(function () {
    $(this).addClass('curr').siblings().removeClass('curr');
});



//jsScroll(document.getElementById('wrasList'),6,'','b');
$('#biao').hide();
$('.ware_list').hide();
//$('#wrasListb').hide();
var obj3 = document.getElementById("gou");
var obj4 = document.getElementById("b1");
var obj31 = document.getElementById("ware_list");

$("#gou").bind("mouseleave", function () {
    $('#biao').hide();
    $('.ware_list').hide();
    $('#wrasListb').hide();
    return false;
});
$("#gou").bind("mouseenter", function () {
    $('#biao').show();
    $('.ware_list').show();
    // jsScroll(document.getElementById('wrasList'), 5, '', 'b');
    return false;
});
//if (obj4 != 'null' && obj4 != null) {
//    obj4.onmousemove = function () {
//        $('#biao').show();
//        $('.ware_list').show();
//        $('#b1').show();
//    }
//}





/*=订单确认*/
$('.address .bd li').click(function () {
    $(this).addClass('curr').siblings().removeClass('curr');
});

$('.payment .bd dd a').click(function () {
    $(this).addClass('curr').siblings().removeClass('curr');
});

$('.payment .bd dd span').click(function () {
    var cla = $(this).attr('id');
    if (undefined == cla || null == cla || '' == cla) {
        $(this).attr('id', 'curr');
        $(this).html('收起');
        $('.payment .bd dd').css('height', 'auto');
    } else {
        $(this).attr('id', '');
        $(this).html('更多');
        $('.payment .bd dd').css('height', '125px');
    }
});

$('.payment .bd dt').click(function () {
    $(this).addClass('curr').siblings().removeClass('curr');
});

$('#rd_zxzf').click(function () {
    $('#quan').show(100);
});

$('#rd_hdfk').click(function () {
    $('#quan').hide(100);
});


$('.bill input[name=radio2]').click(function () {
    $(this).closest("p").addClass('curr').siblings().removeClass('curr');
});





