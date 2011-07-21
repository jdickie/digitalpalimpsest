var StateMgr = Monomyth.Class.extend({
	init:function(){
    	this.uid = null;
	    this.stateCheckPath = "./lib/StateMgr/sessionWindowMgr.php";
	    this.project = null;
	   /*
	 this.stateReady = new YAHOO.util.CustomEvent("stateReady");
		this.sizeReady=new YAHOO.util.CustomEvent("sizeReady");
	    this.reset = new YAHOO.util.CustomEvent("reset");
*/
	},
	setItem:function(obj, type, item){
    	var params = "";
	    switch (type) {
	        case "win":
	            var page = (item.content.curPageNum == 0) ? 1 : (item.content.curPageNum + 1);
	            var zoom = item.content.getZoom();
	            var center = item.content.limg.map.getCenter();
	            var x=item.left();
				var y=item.top();
				//var ieuser = (YAHOO.util.Dom.getStyle(item.DOM,'left'));
	 
				params += "&type=win&id=" + item.DOM.id + "&bibInfo="+ item.bibInfo + "&manifest=" + item.manifest + "&x=" + x + "&y=" + y + "&width=" + parseInt(YAHOO.util.Dom.getStyle(item.DOM, "width")) + "&height=" + parseInt(YAHOO.util.Dom.getStyle(item.DOM, "height")) + "&page=" + page + "&project=" + item.project + "&zoom=" + zoom + "&center=" + center.lon + "," + center.lat;
          
				break;
	        case "crop":
	            item.saveCrop(null, item);
	            params += "&" + item.sParams + "&type=crop";
	            break;
	        case "label":
	            item.keepChange(null, item);
	            params += item.sParams + "&type=label";
	            break;
	    }
	    var sUrl = obj.stateCheckPath + "?mode=set" + params;
		$.ajax({
			dataType:"text",
			async:true,
			url:sUrl
		});
	},
	removeItem:function(type, item){
	    var sUrl = "";
	    switch (type) {
	        case "win":
	            sUrl = this.stateCheckPath + "?mode=remove&type=win&id=" + item.DOM.id;
	            break;
	        case "crop":
	            sUrl = this.stateCheckPath + "?mode=remove&type=crop&id=" + item.DOM.id;
	            break;
	        case "label":
	            sUrl = this.stateCheckPath + "?mode=remove&type=label&id=" + item.DOM.id;
	    }
		$.ajax({
			dataType:"text",
			url:sUrl,
			async:true
		});
 
	},
	eraseState:function(obj){
	    var sUrl = "./lib/StateMgr/sessionWindowMgr.php?mode=reset";
		$.ajax({
			url:sUrl,
			async:true
		});
   
	},
	rememberSize:function(width,height){
		var sUrl="./lib/StateMgr/rememberSize.php?width="+width+"&height="+height;
		$.ajax({url:sUrl,dataType:"text",async:true});
	
	},
	checkSize:function(){
		var sUrl='./lib/StateMgr/checkSize.php';
		var rtext=$.ajax({
			dataType:"text",
			async:false,
			url:sUrl
		}).responseText;
		return rtext;
	}
});
