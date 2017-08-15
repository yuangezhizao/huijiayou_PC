/// <reference path="g_Const.js" />
/// <reference path="g_Type.js" />
/// <reference path="../jquery-2.1.4.js" />

var AccountMenu = {
    //账户中心导航菜单
    MenuList: [
        { MenuName: "我的主页", PageURL: g_const_PageURL.AccountIndex },        
        { MenuName: "我的订单", PageURL: g_const_PageURL.MyOrder_List },
        { MenuName: "充值订单", PageURL: g_const_PageURL.MobileCZList },
        { MenuName: "我的收藏", PageURL: g_const_PageURL.MyCollection },
        //{ MenuName: "我的浏览历史", PageURL: g_const_PageURL.MyBrowse },
        { MenuName: "我的优惠券", PageURL: g_const_PageURL.MyCoupon },
        { MenuName: "我的储值金", PageURL: g_const_PageURL.MyCZJ },
        { MenuName: "我的暂存款", PageURL: g_const_PageURL.MyZCK },
        { MenuName: "我的积分", PageURL: g_const_PageURL.MyJifen },
        //{ MenuName: "设置个人信息", PageURL: g_const_PageURL.AccountInfo },
        //{ MenuName: "修改密码", PageURL: g_const_PageURL.AccountPasswordReset },
        //{ MenuName: "编辑收货地址", PageURL: g_const_PageURL.AddressList },
    ],
    //显示菜单jMenuID:要显示菜单的标签的ID，要用来渲染的模版ID
    ShowMenu: function (jMenuID,jTemplateID,selectMenuName) {
        var menuhtml = "";
        var stpl = $(jTemplateID).html();
        for (var k in AccountMenu.MenuList) {
            var menu = AccountMenu.MenuList[k];
            var data = {
                menuname: menu.MenuName,
                menulink: g_const_PageURL.GetLink(menu.PageURL, ""),
                menuclass: menu.MenuName == selectMenuName ? "curr" : ""
            };
            menuhtml += renderTemplate(stpl, data);
        }
        $(jMenuID).html(menuhtml);
    }

};