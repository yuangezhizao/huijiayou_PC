var strMenu = "";
strMenu += "<div class=\"nav_top\"><ul>";
strMenu += "<li><a onClick=\"MenuHref('/index.html')\">";
strMenu += "<p><img src=\"http://img.jyh.com/images/login/wode5.png\" width=\"30\" alt=\"\"/></p>";
strMenu += "<p class=\"nav_title\">首页</p></a></li>";
strMenu += "<li><a onClick=\"MenuHref('/Category.html')\">";
strMenu += "<p><img src=\"http://img.jyh.com/images/login/wode4.jpg\" width=\"30\" alt=\"\"/></p>";
strMenu += "<p class=\"nav_title\">分类导航</p></a></li>";
strMenu += "<li><a onClick=\"MenuHref('/cart.html')\">";
strMenu += "<p><img src=\"http://img.jyh.com/images/login/wode1.jpg\" width=\"30\" alt=\"\"/></p>";
strMenu += "<p class=\"nav_title\">购物车</p></a></li>";
strMenu += "<li><a onClick=\"MenuHref('/Account/index.html')\">";
strMenu += "<p><img src=\"http://img.jyh.com/images/login/wode.jpg\" width=\"30\" alt=\"\"/></p>";
strMenu += "<p class=\"nav_title\">我的</p></a></li>";
strMenu += "</ul></div>";
document.write(strMenu);



function MenuHref(url) {
    PageUrlConfig.SetUrl();
    window.location.href = url + "?t=" + Math.random();
}