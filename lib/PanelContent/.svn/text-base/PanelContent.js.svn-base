PanelContent = function(content){
	
	this.DOM = document.createElement("div");
	YAHOO.util.Dom.generateId(this.DOM,"panelBody");
	this.DOM.className="PanelBody";
	this.panelContentReady=new YAHOO.util.CustomEvent("panelContentReady");
	this.setContent(content);
}
PanelContent.prototype = {
	
	setContent: function(obj){
		
		if (obj) {
			
			if (this.DOM.firstChild) {
			
				this.DOM.parentNode.removeChild(this.DOM);
				this.DOM = document.createElement("div");
				this.DOM.appendChild(obj);
			}
			else {
			
				this.DOM.appendChild(obj);
			}
		}
	
	},
	adjustResize : function(obj, nWidth, nHeight, offsetH){
	
	//var bodyWidth = (nWidth - offsetW);
	var bodyHeight = (nHeight - offsetH);
	
	YAHOO.util.Dom.setStyle(obj.DOM, 'width', nWidth+'px');
	YAHOO.util.Dom.setStyle(obj.DOM, 'height',bodyHeight+'px');
	
	obj.image.adjustResize(obj.image, nWidth, bodyHeight);
	}

}
