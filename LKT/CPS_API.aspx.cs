using com.ichsy.jyhnet.FrameWork;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace WebUI.LKT
{
    public partial class CPS_API : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Session["MerchantID_HJY"] != null)
            {
                if (ConfigurationManager.AppSettings["linktec_id"] == Session["MerchantID_HJY"].ToString())
                {
                    string script = "";
                    StringBuilder url = new StringBuilder();
                    switch (Request["action"])
                    {
                        case "merchant_order":
                            string WebUrl = "http://service.linktech.cn/purchase_cps.php";
                            try
                            {
                                url.Append("a_id=" + Request["a_id"].Split('|')[1].ToString());
                            }
                            catch (Exception)
                            {
                                url.Append("a_id=" + ConfigurationManager.AppSettings["linktec_a_id"]);
                            }
                            url.Append("&m_id=" + ConfigurationManager.AppSettings["linktec_m_id"]);
                            url.Append("&mbr_id=1");
                            url.Append("&o_cd=" + Request["order_code"]);
                            url.Append("&p_cd=1");
                            url.Append("&price=" + Request["product_price"]);
                            url.Append("&it_cnt=" + Request["product_count"]);
                            url.Append("&c_cd=1");
                            script = "<script src='" + url + "'></script>";
                            string errMsg = "";
                            Utils.GetPageContent(WebUrl, url.ToString(), "utf-8", "Get", false, out errMsg);
                            break;
                    }
                    Response.Write(script);
                }
            }
        }
    }
}