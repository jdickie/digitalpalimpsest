//--------------Panel--------------------------------------------
//  Panel.js 
//  Last modified by dreside 10/13/08
//
//  A generic draggable Panel, composed of three parts:
//  header, content, and footer.
//
//	Properties:
//		id:  Unique id of the panel
//  	HTML:  the HTML code for the panel
//		header:  the top part, also the handle for dragging
//		content:  the content DIV for the panel
//		footer:  the footer
//
//	Methods:
//		clearContents():  Removes every child of panel content 
//		close():  Removes the Panel HTML from the document;
//		hide():  Changes the Panel display style to none;
//		show():  Changes the Panel display style to block;
//
//	Events:
//		onAvailable:  Add YUI draggable property
//
//--------------------------------------------------------------

Panel = function(){
    this.id = YAHOO.util.Dom.generateId(this, "panel");
    
    this.header = new PanelHeader();
    this.content = new PanelContent();
    this.footer = new PanelFooter();
    
    this.HTML = document.createElement("div");
    this.HTML.className = "panel";
    this.HTML.id = this.id;
    
    this.HTML.appendChild(this.header.HTML);
    this.HTML.appendChild(this.content.HTML);
    this.HTML.appendChild(this.footer.HTML);
    
    YAHOO.util.Event.onAvailable(this.id, this.handleOnAvailable, this);
}

Panel.prototype.close = function(){
    obj.HTML.parentNode.removeChild(obj.HTML);
}
Panel.prototype.hide = function(){
    YAHOO.util.Dom.setStyle("display", "none");
}
Panel.prototype.show = function(){
    YAHOO.util.Dom.setStyle("display", "block");
}
Panel.prototype.clearContents = function(){
    contents = this.content.HTML.childNodes;
    
    for (i = 0; i < contents.length; i++) {
        contents[i].parentNode.removeChild(contents[i]);
    }
    
}
Panel.prototype.setContent = function(contentObj){
    this.content.HTML.appendChild(contentObj);
}
Panel.prototype.handleOnAvailable = function(panel){
    panel.draggable = new YAHOO.util.DD(panel.id);
    panel.draggable.setHandleElId(panel.header.id);
}
//-------Panel header-----------------------
PanelHeader = function(){
    this.id = YAHOO.util.Dom.generateId(this, "header");
    this.HTML = document.createElement("div");
    this.HTML.className = "hd";
    this.HTML.id = this.id;
}

//-------Panel Content-----------------
PanelContent = function(){
    this.id = YAHOO.util.Dom.generateId(this, "content");
    this.HTML = document.createElement("div");
    this.HTML.className = "panelBody";
    this.HTML.id = this.id;
}

//--------Panel Footer-----------------
PanelFooter = function(){
    this.id = YAHOO.util.Dom.generateId(this, "footer");
    this.HTML = document.createElement("div");
    this.HTML.className = "ft";
    this.HTML.id = this.id;
}

//---------------------------------------------------


