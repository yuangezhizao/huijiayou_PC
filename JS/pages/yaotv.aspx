<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="yaotv.aspx.cs" Inherits="com.ichsy.jyh.WebTouch.js.pages.yaotv" %>
<script>
var page_yaotv={
    Init: function () {
        LoadHeader();
        LoadContainer();
        LoadFooter();
        <%=sInit%>
    },
    LoadHeader: function () {
        <%=sHeader%>
    },
    LoadContainer: function () {
        <%=sContainer%>
    },
    LoadFooter: function () {
        <%=sFooter%>
    }
};
</script>