$(document).ready(function ($) {
    //侧边栏滚动条
    var $container = $('.description');
    $container.each(function () {
        var $status = $('#status');
        $(this).perfectScrollbar();
        $(this).scroll(function (e) {
            if ($(this).scrollTop() === 0) {
                $status.text('it reaches the top!');
            }
            else if ($(this).scrollTop() === $(this).prop('scrollHeight') - $(this).height()) {
                $status.text('it reaches the end!');
            } else {
                $status.text('');
            }
        });
    })
    //购物车滚动条
    


});

function initCartScroll() {
    var $container2 = $('.description2');
    $container2.each(function () {
      //  var $status = $('#status');
        $(this).perfectScrollbar();
        //$(this).scroll(function (e) {
        //    if ($(this).scrollTop() === 0) {
        //        $status.text('it reaches the top!');
        //    }
        //    else if ($(this).scrollTop() === $(this).prop('scrollHeight') - $(this).height()) {
        //        $status.text('it reaches the end!');
        //    } else {
        //        $status.text('');
        //    }
        //});
    })
}