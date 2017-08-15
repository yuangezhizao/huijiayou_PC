using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace com.ichsy.jyh.WebTouch.js.pages
{
    public partial class yaotv : System.Web.UI.Page
    {
        protected string sInit;
        protected string sHeader;
        protected string sContainer;
        protected string sFooter;
        protected void Page_Load(object sender, EventArgs e)
        {
            sInit = "window.location='http://s.jyh.com/tvlive.html?fromyaotv=1';";
            sFooter= "$('#footer').html('<div class=\"foot\" style=\"margin - bottom: 100px; margin - top: 20px; text - align: center; \">本页面内容和服务由“<span>家有购物频道</span>”提供</div>');";
        }
    }
}