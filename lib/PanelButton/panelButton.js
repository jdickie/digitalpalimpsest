//--------------panelButton-------------------------------------
//  panelButton.js
//  
//
//--------------------------------------------------------------


//---------Panel Button---------------
PanelButton = function(type,alt){

	this.DOM = document.createElement("a");
	YAHOO.util.Dom.generateId(this.DOM,"panelButton");
	
	this.DOM.className = type;
	this.DOM.alt = type;
	this.type=type;
	this.DOM.style.cursor = "default";

}

