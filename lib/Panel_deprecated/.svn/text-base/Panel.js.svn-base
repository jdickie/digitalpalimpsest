//--------------Panel--------------------------------------------
//  Panel.js 
//  Last modified by dreside @ 4/16/09
//
//	panel
//  A generic draggable Panel, composed of three parts:
//  header, content, and footer.
//
//  Objects:  PanelContent
//
//  args: 
//	id: panel id if one exists
//
//	Custom Events 
//	panelClicked, panelReady, resetHeader, closeSelf
//
//--------------------------------------------------------------

Panel = function(args){
	this.DOM = document.createElement("div");
    this.DOM.className = "panel";
	if (args.id){
		this.DOM.id = 'panel'+args.id;
	}
	else{
		 YAHOO.util.Dom.generateId(this.DOM, "panel");
	}
 
 
    this.header =document.createElement("div");
    this.header.className = "hd";
    YAHOO.util.Dom.generateId(this.header, "header");
 	//mouse grab cursor
	this.headerGrab = (navigator.userAgent.search(/KHTML|Opera/i) >= 0 ? 'pointer' : (document.attachEvent ? 'url(grab.cur)' : '-moz-grab'));
	//normal cursor
	this.normalCursor="default";

	this.content = new PanelContent(null);

	this.footer = document.createElement("div");
	this.footer.id = YAHOO.util.Dom.generateId(this.footer, "footer");
    this.footer.className = "ft";

	//insert quarto version in footer
    this.DOM.appendChild(this.header);
    this.DOM.appendChild(this.content.DOM);
	this.DOM.appendChild(this.footer);

	// Custom Events
	this.panelClicked=new YAHOO.util.CustomEvent("panelClicked");
	this.panelReady=new YAHOO.util.CustomEvent("panelReady");
	this.resetHeader=new YAHOO.util.CustomEvent("resetHeader");
	this.closeSelf = new YAHOO.util.CustomEvent("closeSelf");
	//Default Events
	YAHOO.util.Event.onAvailable(this.DOM.id, this.makePanelResize, this);
	YAHOO.util.Event.addListener(this.DOM.id,"mousedown",this.handleClick,this);		
	YAHOO.util.Event.addListener(this.header.id,'mouseover',this.changeCursor,this);
	YAHOO.util.Event.addListener(this.header.id,'mousemove',this.changeCursor,this);
	YAHOO.util.Event.addListener(this.header.id,'mouseout',this.changeCursorBack,this);
	
}
Panel.prototype.changeCursor=function(e,obj){
	YAHOO.util.Dom.setStyle(obj.header, 'cursor', obj.headerGrab);
}
Panel.prototype.changeCursorBack=function(e,obj){
	YAHOO.util.Dom.setStyle(obj.header,'cursor',obj.normalPoint);
}
Panel.prototype.makePanelResize = function(Panel){

	//make sure window is placed below project bar
	if (YAHOO.util.Dom.getY(Panel.DOM) <= 79) {
		YAHOO.util.Dom.setY(Panel.DOM, 80);	
	}
	
	//Yahoo code for making a resizable panel	
	Panel.draggable = new YAHOO.util.DD(Panel.DOM.id);
	Panel.draggable.setHandleElId(Panel.header.id); //can only drag by clicking on handle	
	Panel.draggable.on('mouseDownEvent', function(e, obj){

		var xconstrain = parseInt(YAHOO.util.Dom.getStyle(obj.DOM, 'left')) - parseInt(YAHOO.util.Dom.getX(obj.DOM));
		var yconstrain = parseInt(YAHOO.util.Dom.getStyle(obj.DOM, 'top')) - parseInt(YAHOO.util.Dom.getY(obj.DOM));
		obj.draggable.resetConstraints();
		
		obj.draggable.setXConstraint(parseInt(YAHOO.util.Dom.getX(obj.DOM))-xconstrain, (4000-parseInt(YAHOO.util.Dom.getX(obj.DOM))));
		obj.draggable.setYConstraint(parseInt(YAHOO.util.Dom.getY(obj.DOM))-60, (4000-parseInt(YAHOO.util.Dom.getY(obj.DOM))));		
		
	
	}, Panel);
	Panel.yResize = new YAHOO.util.Resize(Panel.DOM.id, {
                handles: 'all',
				proxy: true,
                autoRatio: false,
                minWidth: 100,
                minHeight: 460
            });
            // Setup resize handler to update the size of the Panel's body element
            // whenever the size of the 'resizablepanel' DIV changes
      Panel.yResize.on('resize', function(e, panel) {
  			var panelHeight = parseInt(YAHOO.util.Dom.getStyle(panel.DOM, 'height'));
			var panelWidth = parseInt(YAHOO.util.Dom.getStyle(panel.DOM, 'width'));
			var headerOffset = parseInt(YAHOO.util.Dom.getStyle(panel.header, 'height'));
			headerOffset = parseInt(YAHOO.util.Dom.getStyle(panel.footer, 'height')) + headerOffset;
			//get true size of header
			if (panel.header.childNodes[1]) {
				addOn=parseInt(YAHOO.util.Dom.getY(panel.content.DOM));
				if(addOn>headerOffset){
					n=addOn-headerOffset;
					headerOffset+=n;
					headerOffset-=parseInt(YAHOO.util.Dom.getY(panel.DOM));
				}
			}
			panel.content.adjustResize(panel.content, panelWidth, panelHeight, headerOffset);
        }, Panel);
		Panel.panelReady.fire(Panel);
}
Panel.prototype.handleClick = function(e,obj){
	//YAHOO.util.Event.stopEvent(e);
	obj.panelClicked.fire({panel: obj});
	//put in the foreground	
	//obj.DOM.className = "panel yui-resize";
}

Panel.prototype.changeTransparency = function(e, args){
	
	panel = args.panel;
	more = false;
	more = args.more;


	percent = YAHOO.util.Dom.getStyle(panel.DOM,"opacity");
	if (more) {
		if (percent > .1) {
			percent = percent - .1;
		}
	}
	else {
		if (percent < 1) {
			
			percent = parseFloat(percent) + .1;
		}
	}
	
	
	
	YAHOO.util.Dom.setStyle(panel.DOM,"filter","alpha(opacity="+percent*100+");");
	YAHOO.util.Dom.setStyle(panel.DOM,"opacity",percent);

}


		


Panel.prototype.adjustContentSize = function(contentObj){

	YAHOO.util.Dom.setStyle(contentObj,"width",YAHOO.util.Dom.getStyle(contentObj.parentNode,"width"));

}








