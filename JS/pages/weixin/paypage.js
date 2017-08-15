
function callpay()
{
    if (typeof WeixinJSBridge == "undefined")
    {
        if (document.addEventListener)
        {
            document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
        }
        else if (document.attachEvent)
        {
            document.attachEvent('WeixinJSBridgeReady', jsApiCall);
            document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
        }
    }
    else
    {
        jsApiCall();
    }
}