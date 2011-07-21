PanelHeader = function(){
	this.HTML =document.createElement("div");
    this.HTML.className = "hd";
    this.HTML.id = YAHOO.util.Dom.generateId(this.header, "header");
 	//mouse grab cursor
	this.headerGrab = (navigator.userAgent.search(/KHTML|Opera/i) >= 0 ? 'pointer' : (document.attachEvent ? 'url(grab.cur)' : '-moz-grab'));
}
Panel.prototype.setHeader = function(panel){


	


	// Zoom Controls
	
	PanelHeader.zoomInButton = new PanelButton("zoomIn", "Zoom In");
	PanelHeader.zoomOutButton = new PanelButton("zoomOut", "Zoom Out");
	PanelHeader.zoomControls = new ButtonGroup("Zoom", [Panel.zoomInButton, PanelHeader.zoomOutButton], "zoomControls");
	PanelHeader.header.appendChild(Panel.zoomControls.HTML);
	YAHOO.util.Event.addListener(Panel.zoomInButton.HTML, 'click', PanelHeader.content.zoomIn, PanelHeader.content);
	YAHOO.util.Event.addListener(Panel.zoomOutButton.HTML, 'click', PanelHeader.content.zoomOut, PanelHeader.content);
	// Opacity Controls
	
	PanelHeader.darker = new PanelButton("darker", "More Opaque");
	PanelHeader.lighter = new PanelButton("lighter", "More Transparent");
	PanelHeader.opacityControls = new ButtonGroup("Opacity", [Panel.darker, PanelHeader.lighter], "opacityControls");
	PanelHeader.header.appendChild(Panel.opacityControls.HTML);
	YAHOO.util.Event.addListener(Panel.darker.HTML, 'click', PanelHeader.changeTransparency, {
		panel: panel,
		more: false
	});
	YAHOO.util.Event.addListener(Panel.lighter.HTML, 'click', PanelHeader.changeTransparency, {
		panel: panel,
		more: true
	});
	
	// Image / Text Toggle
	PanelHeader.showImageButton = new PanelButton("showImage", "Show image");
	PanelHeader.showTextButton = new PanelButton("showText", "Show text");
	
	PanelHeader.imgToggle = new ButtonGroup("View", [Panel.showImageButton, PanelHeader.showTextButton], "imageToggle");
	PanelHeader.header.appendChild(Panel.imgToggle.HTML);
	YAHOO.util.Event.addListener(Panel.showImageButton.HTML, 'click', function(e,panel){
		PanelHeader.content.mode="image";
		PanelHeader.content.toggleMode(e,Panel.content);
		
	}, panel);
	YAHOO.util.Event.addListener(Panel.showTextButton.HTML, 'click', function(e,panel){
		PanelHeader.content.mode="text";
		PanelHeader.content.toggleMode(e,Panel.content);
		
	}, panel);
	
	PanelHeader.annoPrefs = new AnnotationSelect(Panel.manifest);
	
	PanelHeader.HTML.parentNode.appendChild(Panel.annoPrefs.HTML);
	PanelHeader.HTML.parentNode.appendChild(Panel.annoPrefs.annoWindow.HTML);
	PanelHeader.annoViewPref = new PanelButton("annoViewPref", "Annotation Sets");
	PanelHeader.annoGroup = new ButtonGroup("Select annotation set...", [Panel.annoViewPref], "annoGroup");
	PanelHeader.header.appendChild(Panel.annoGroup.HTML);
	YAHOO.util.Event.addListener(Panel.annoGroup.HTML, 'click', PanelHeader.annoPrefs.closeWin, PanelHeader.annoPrefs);
	
	PanelHeader.annoPrefs.changeCall.subscribe(function(e,pass,args){
		
		args.content.callChangeAnnoSet(pass[0], args.content);
		args.annoGroup.textLabelSpan.replaceChild(document.createTextNode(pass[0].annoId),args.annoGroup.textLabelSpan.firstChild);
		
	}, panel);
	


	
	PanelHeader.closeButton = new PanelButton("closeButton", "Close");
	PanelHeader.header.appendChild(Panel.closeButton.HTML);
	YAHOO.util.Event.addListener(Panel.closeButton.HTML, 'click', PanelHeader.close, panel);
	
}