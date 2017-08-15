/**
 * This jQuery plugin displays pagination links inside the selected elements.
 *
 * @author Gabriel Birke (birke *at* d-scribe *dot* de)
 * @version 1.1
 * @param {int} maxentries Number of entries to paginate
 * @param {Object} opts Several options (see README for documentation)
 * @return {Object} jQuery Object
 */
jQuery.fn.pagination = function(maxentries, opts) {
    opts = jQuery.extend({
        items_per_page: 10,
        num_display_entries: 10,
        current_page: 0,
        num_edge_entries: 0,
        link_to: "#",
        prev_text: "Prev",
        next_text: "Next",
        ellipse_text: "...",
        prev_show_always: true,
        next_show_always: true,
        callback: function() { return false; }
    }, opts || {});

    return this.each(function() {
        /**
        * Calculate the maximum number of pages
        */
        function numPages() {
            return Math.ceil(maxentries / opts.items_per_page);
        }

        /**
        * Calculate start and end point of pagination links depending on 
        * current_page and num_display_entries.
        * @return {Array}
        */
        function getInterval() {
            var ne_half = Math.ceil(opts.num_display_entries / 2);
            var np = numPages();
            var upper_limit = np - opts.num_display_entries;
            var start = current_page > ne_half ? Math.max(Math.min(current_page - ne_half, upper_limit), 0) : 0;
            var end = current_page > ne_half ? Math.min(current_page + ne_half, np) : Math.min(opts.num_display_entries, np);
            return [start, end];
        }

        /**
        * This is the event handling function for the pagination links. 
        * @param {int} page_id The new page number
        */
        function pageSelected(page_id, evt) {
            current_page = page_id;
            drawLinks();
            var continuePropagation = opts.callback(page_id, panel);
            if (!continuePropagation) {
                if (evt.stopPropagation) {
                    evt.stopPropagation();
                }
                else {
                    evt.cancelBubble = true;
                }
            }
            return continuePropagation;
        }

        /**
        * This function inserts the pagination links into the container element
        */
        function drawLinks() {
            panel.empty();
            var interval = getInterval();
            var np = numPages();
            // This helper function returns a handler function that calls pageSelected with the right page_id
            var getClickHandler = function(page_id) {
                return function(evt) { return pageSelected(page_id, evt); }
            }
            // Helper function for generating a single link (or a span tag if it'S the current page)
            var appendItem = function(page_id, appendopts) {
                //alert(page_id)
                page_id = page_id < 0 ? 0 : (page_id < np ? page_id : np - 1); // Normalize page id to sane value
                //page_id = page_id < np ? page_id : np - 1;
                appendopts = jQuery.extend({ text: page_id + 1, classes: "number" }, appendopts || {});
                
                if (page_id == current_page) {
                    var lnk = $("<a style=\"cursor:pointer\" >" + (appendopts.text) + "</a>");
                    if (appendopts.text.toString().indexOf("←") == -1 && appendopts.text.toString().indexOf("→") == -1) {
                        lnk.removeAttr('class'); lnk.addClass("curr");
                    }
                    else {
                        lnk.removeAttr('class'); lnk.addClass("on");
                    }
                }
                else {
                    var lnk = $("<a style=\"cursor:pointer\">" + (appendopts.text) + "</a>")
						.bind("click", getClickHandler(page_id))
						.attr('href', opts.link_to.replace(/__id__/, page_id));
                  //  lnk.removeAttr('class'); lnk.addClass("number");

                }
                //if (appendopts.classes) { lnk.removeAttr('class'); lnk.addClass(appendopts.classes); }
                panel.append(lnk);
            }
            // Generate "Previous"-Link
            if (opts.prev_text && (current_page > 0 || opts.prev_show_always)) {
                appendItem(current_page - 1, { text: opts.prev_text, classes: "on" });
            }
            // Generate starting points
            if (interval[0] > 0 && opts.num_edge_entries > 0) {
                var end = Math.min(opts.num_edge_entries, interval[0]);
                for (var i = 0; i < end; i++) {
                    appendItem(i);
                }
                if (opts.num_edge_entries < interval[0] && opts.ellipse_text) {
                    jQuery("<span>" + opts.ellipse_text + "</span>").appendTo(panel);
                }
            }
            // Generate interval links
            for (var i = interval[0]; i < interval[1]; i++) {
                appendItem(i);
            }
            // Generate ending points
            if (interval[1] < np && opts.num_edge_entries > 0) {
                if (np - opts.num_edge_entries > interval[1] && opts.ellipse_text) {
                    jQuery("<span>" + opts.ellipse_text + "</span>").appendTo(panel);
                }
                var begin = Math.max(np - opts.num_edge_entries, interval[1]);
                for (var i = begin; i < np; i++) {
                    appendItem(i);
                }

            }
            // Generate "Next"-Link
            if (opts.next_text && (current_page < np - 1 || opts.next_show_always)) {
                appendItem(current_page + 1, { text: opts.next_text, classes: "on" });
            }
        }

        // Extract current_page from options
        var current_page = opts.current_page;
        // Create a sane value for maxentries and items_per_page
        maxentries = (!maxentries || maxentries < 0) ? 1 : maxentries;
        opts.items_per_page = (!opts.items_per_page || opts.items_per_page < 0) ? 1 : opts.items_per_page;
        // Store DOM element for easy access from all inner functions
        var panel = jQuery(this);
        // Attach control functions to the DOM element 
        this.selectPage = function(page_id) { pageSelected(page_id); }
        this.prevPage = function() {
            if (current_page > 0) {
                pageSelected(current_page - 1);
                return true;
            }
            else {
                return false;
            }
        }
        this.nextPage = function() {
            if (current_page < numPages() - 1) {
                pageSelected(current_page + 1);
                return true;
            }
            else {
                return false;
            }
        }
        // When all initialisation is done, draw the links
        drawLinks();
    });
}


function SortTB(ordercolumn,ordertipid)
{
    var jqorderimg = $("#"+ordertipid);
    if(jqorderimg.html()!="")
    {
        if(jqorderimg.html().indexOf("up")==-1){
            $(".ordertip").empty();
            jqorderimg.html("<span id=\"spup\" class=\"up\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>");
                
            ot = "asc";
        }
        else
        { $(".ordertip").empty();
            jqorderimg.html("<span id=\"spdown\" class=\"down\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>");
                   
            ot = "desc";
        }
    }
    else
    {
        $(".ordertip").empty();
            jqorderimg.html("<span id=\"spup\" class=\"up\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>");
            ot = "asc";
    }
    oc = ordercolumn;
            
    InitDataTB();
}
//分页方法 数量，每页大小，页序号，回调方法
function FormatTB(datacount, pagesize, pageindex, callback,startpage) {
    var start = 0;
    if (startpage) {
        start = startpage;
    }
    $("#PaginationTB").pagination(datacount, {
        callback: callback,
        prev_text: '<span id="spprev" >← 上一页</span>',
        next_text: '<span id="spnext" >下一页 →</span>',
        items_per_page: pagesize,
        num_display_entries: 4,
        current_page: pageindex - start,
        num_edge_entries: 2
    });
    var pagecount = Math.ceil(datacount / pagesize);
    //}
    if ($("#PageSet")) {
        $("#PageSet").html("<em>共" + pagecount + "页 到第<input id=\"txtPageCount\" type=\"text\" value=\"" + (pageindex + 1) + "\">页</em><a style=\"cursor:pointer\" onclick=\"pageSet(" + callback + "," + start + ")\">确定</a>");
    }
    
    //  $("#pageInfo").html("第" + (pi + 1) + "页/共" + pagecount + "页");
}
function pageSet(callback, start)
{
    if (typeof (callback) == "function")
        callback(parseInt($("#txtPageCount").val()) - 1 + start);
}
function SetTableTdTitle()
{
    var classList =["tip-yellow"];
    try{
        $('.example tr td').poshytip({
            className: classList[parseInt(Math.random()*6+0)],
	        showTimeout: 1,
	        alignTo: 'target',
	        alignX: 'center',
	        offsetY: 5,
	        allowTipHover: false
        });
    }
    catch(e){}
}

function FormatKB(datacount,tablename,tbody,showPage)
{
    $("#"+tablename+" tr:gt(0)").remove();
    $("#"+tablename).append(tbody);

    $("#"+tablename+" tr:gt(0):odd").attr("class", "alt");
    $("#"+tablename+" tr:gt(0):even").attr("class", "");
            
    $("#tb_"+tablename+" tr:gt(0)").hover(function(){
        $(this).addClass('mouseover');
    },function(){
        $(this).removeClass('mouseover');
    });

}
function GetEmptyTD(n){
    var i=0;
    var retStr = '';
    while(i<n){
        retStr +="<td style=\"text-align: center;\"></td>";
        i++;
    }
    return retStr;
}