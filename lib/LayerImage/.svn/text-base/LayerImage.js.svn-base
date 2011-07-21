//--------------LayerImage--------------------------------------------
//  LayerImage.js 
//  Last modified by dreside @ 4/16/09

//--------------------------------------------------------------
/*
 * Constructor Call for ArchiePanelContent
 * 
 * 
 * Objects:
 * PanoJS, TileURLProvider 
 * 
 * 
 * inherited events: 
 * panelClicked, panelReady, resetHeader, closeSelf
 * 
 * @param {Object} args
 * 	desktop: workspace,
 *	manifest: pointers to images,
 *	readyPage: start page,
 *	bibInfo: bibliographic info
 *
 *********************************/
var viewerBean = null;
var maximized = false;
LayerImage = function(pageData){
	this.baseURI = pageData.baseURI;
	this.prefix=pageData.prefix;
	this.DOM = document.createElement("div");
	this.DOM.className = "viewer";
	YAHOO.util.Dom.generateId(this.DOM,"viewer");
	this.well = document.createElement("div");
	this.well.className = "well";
	YAHOO.util.Dom.generateId(this.well,"well");
	this.well.innerHTML="<!-- -->";
	this.surface = document.createElement("div");
	this.surface.className = "surface";
	YAHOO.util.Dom.generateId(this.surface,"surface");
	this.surface.innerHTML="<!-- -->";
	this.openAnno = null;
	this.DOM.appendChild(this.well);
	this.DOM.appendChild(this.surface);
	this.unInitImageClick=new YAHOO.util.CustomEvent("unInitImageClick");
	this.layerImageReady=new YAHOO.util.CustomEvent("layerImageReady");
	this.saveImageAnnoEvent=new YAHOO.util.CustomEvent("saveImageAnno");
	this.passImageAnnoClicked = new YAHOO.util.CustomEvent("passImageAnnoClicked");
	this.passImageZoomed = new YAHOO.util.CustomEvent("imageZoomed");
	this.passAlert=new YAHOO.util.CustomEvent("passAlert");
	this.crop = new YAHOO.util.CustomEvent("crop");
	this.anno = new YAHOO.util.CustomEvent("anno");	
	this.viewerBean = null;
}
LayerImage.prototype.initializeGraphic = function(limg) {
	
	// opera triggers the onload twice
	if (limg.viewerBean == null) {

		limg.viewerBean = new PanoJS(limg.DOM.id, {
			tileBaseUri: limg.baseURI,
			tileSize: 256,
			tilePrefix: limg.prefix,
			tileExtension: 'png',
			maxZoom: 5,
			initialZoom: 2,
			
			blankTile: './lib/Panojs/assets/gfx/blank.gif',
			loadingTile: './lib/Panojs/assets/gfx/progress.jpg'
		});
		//viewerBean.fitToWindow(0);
		
		limg.viewerBean.panoJSReady.subscribe(limg.panoReady,limg);
	limg.viewerBean.movedBox.subscribe(limg.moveAnno,limg);
	limg.viewerBean.zoomed.subscribe(function(e,obj,args){args.zoomed(limg);},limg);
	limg.viewerBean.makeZAlert.subscribe(function(e,pass,args){
		args.passAlert.fire(pass[0]);
	},limg);
		limg.viewerBean.init();
		YAHOO.util.Event.onAvailable(limg.viewerBean.surface.id,limg.panoReady,limg)
	}
		//limg.viewerBean.scaleMaster([665,715,500,500]);
	
	
}
LayerImage.prototype.zoomed=function(args){
	
	args.clearBoxes();
	args.passImageZoomed.fire();
	
}
LayerImage.prototype.clearBoxes=function(){

	var annos = YAHOO.util.Dom.getElementsByClassName("anno", "div", this.viewerBean.surface);
	var infos = YAHOO.util.Dom.getElementsByClassName("infoPopUp", "div", this.viewerBean.surface);
	var imgAnnos=YAHOO.util.Dom.getElementsByClassName("imageAnnotation","div",this.viewerBean.surface);
	for (an in annos) {
		annos[an].parentNode.removeChild(annos[an]);
	}
	for(im in imgAnnos){
		imgAnnos[im].parentNode.removeChild(imgAnnos[im]);
	}
	for (info in infos) {
		infos[info].parentNode.removeChild(infos[info]);
	}
		
	
}
LayerImage.prototype.changePage=function(args,baseURI,prefix){
	
	if (args.viewerBean) {
		//args.viewerBean.boxes=[];
		
		args.clearBoxes();
		deadBoxes = YAHOO.util.Dom.getElementsByClassName("imageAnnotation","div",args.surface);
		for (i in deadBoxes){
			args.surface.removeChild(deadBoxes[i]);
		}
		deadBoxes = YAHOO.util.Dom.getElementsByClassName("imageMarker","div",args.surface);
		for (i in deadBoxes){
			if (deadBoxes[i]) {
				args.surface.removeChild(deadBoxes[i]);
			}
		}
		//alert('layerimage: '+baseURI + '  '+prefix);
		tup = new TileUrlProvider(baseURI, prefix, "png");
		
		args.baseURI = baseURI;
		
		args.viewerBean.changeImg(args.viewerBean, tup);
		
		args.reinitializeGraphic(null, args);
	}
	else{
	
		args.baseURI = baseURI;
		args.prefix = prefix;
		args.initializeGraphic(args);
	}
} 

LayerImage.prototype.initializeImageClick=function(mode, coords){
	
	this.viewerBean.EnterImageClickMode(mode);
	YAHOO.util.Event.addListener(this.surface, 'click', this.handleImageClick, this);
	YAHOO.util.Event.addListener(this.surface,'dblclick',this.handleDblClick,this);
}
LayerImage.prototype.uninitImageClick=function(mode){
	this.viewerBean.ExitImageClickMode();
	YAHOO.util.Event.removeListener(this.surface, 'click', this.handleImageClick);
	YAHOO.util.Event.removeListener(this.surface,'dblclick',this.handleDblClick);
}
/**
 * Attach the obj to the surface
 * @param {Object} obj
 */
LayerImage.prototype.handleAnno=function(obj,mode){
	
	if(mode=="add"){
		
		this.DOM.appendChild(obj.DOM);
	} else if(mode=="remove"){
		this.DOM.removeChild(obj.DOM);
		
	}
}
LayerImage.prototype.handleDblClick=function(e,obj){
	var warn=(obj.viewerBean.imageClickMode=="anno")?"Zoom locked. To zoom, first de-select Annotate Page.":"Zoom locked. To zoom, first de-select Crop.";
	obj.passAlert.fire(warn);
}
LayerImage.prototype.handleImageClick=function(e,obj){
	mouseX = YAHOO.util.Event.getPageX(e)-YAHOO.util.Dom.getX(obj.surface);
	mouseY = YAHOO.util.Event.getPageY(e)-YAHOO.util.Dom.getY(obj.surface);
	
	box = obj.viewerBean.createRedBox([mouseX-50,mouseY-50,100,100]);
	//YAHOO.util.Event.removeListener(obj.surface, 'click', obj.handleImageClick);

	if (obj.viewerBean.imageClickMode == "anno") {
		
		obj.anno.fire(box);
		YAHOO.util.Event.removeListener(obj.surface, 'click', obj.handleImageClick);
		
	}
	else{
		
		obj.crop.fire(box);
		YAHOO.util.Event.removeListener(obj.surface,'click',obj.handleImageClick);
	}

}
/**
 * Called by panelContent's adjustResize method
 * @param {Object} obj
 * @param {Object} nWidth
 * @param {Object} nHeight
 */
LayerImage.prototype.adjustResize = function(obj, nWidth, nHeight){
	YAHOO.util.Dom.setStyle(obj.DOM, 'width', nWidth+'px');
	YAHOO.util.Dom.setStyle(obj.DOM, 'height', nHeight+'px');
	
	//obj.viewerBean.resize();
}


LayerImage.prototype.cropDone = function(box, obj){
	obj.viewerBean.removeRedBox(box);
}
LayerImage.prototype.crop = function(e,args){

	args[0].crop.fire(args);
}
LayerImage.prototype.saveAnno=function(e,pass,args){
	
	args[2].saveImageAnnoEvent.fire({box: args[0], anno: pass[0]});
	args[2].viewerBean.ExitImageClickMode();
}
LayerImage.prototype.moveAnno=function(e,pass,args){
	
	args.positionAnno(pass[0],args);	
	
	
	
}
/**
 * remove the anno box and crop box
 * @param {Object} box
 * @param {Object} limg
 */
/*
LayerImage.prototype.closeAnno=function(e,pass,args){
	var box = args[0];
	var obj = args[1];
	obj.openAnno.saveAnnoCall.unsubscribeAll("saveAnnoCall");
	obj.openAnno.annoClosed.unsubscribeAll("annoClosed");
	obj.viewerBean.movedBox.unsubscribeAll("movedBox");
	obj.DOM.removeChild(obj.openAnno.DOM);
	obj.openAnno = null;
	obj.viewerBean.removeRedBox(box);
	obj.unInitImageClick.fire();
	obj.viewerBean.ExitImageClickMode();
}
*/
LayerImage.prototype.positionAnno=function(box,limg){
	if (limg.openAnno) {
		anno = limg.openAnno;
		width = parseInt(YAHOO.util.Dom.getStyle(box.DOM, "width"));
		YAHOO.util.Dom.setStyle(anno.DOM, "display", "block");
		YAHOO.util.Dom.setY(anno.DOM, YAHOO.util.Dom.getY(box.DOM));
		YAHOO.util.Dom.setX(anno.DOM, YAHOO.util.Dom.getX(box.DOM) + width + 10);
	}
}
LayerImage.prototype.panoReady=function(args){
	
	args.reinitializeGraphic(null,args);
}

LayerImage.prototype.addBox=function(limg,id,ref,coords,text){

	limg.viewerBean.scaleMaster(id,coords,ref,text);
	limg.viewerBean.imageAnnoClicked.subscribe(limg.handleImageAnnoClicked,limg)
}
LayerImage.prototype.handleImageAnnoClicked = function(e,pass,args){
	
	args.passImageAnnoClicked.fire(pass[0]);
}
LayerImage.prototype.resetViewerBean=function(limg){
	limg.viewerBean.blank();
	limg.viewerBean.clear();
	limg.viewerBean.init();
	limg.viewerBean.resize();
}
LayerImage.prototype.reinitializeGraphic=function(e,limg) {
	
	limg.viewerBean.resize();
}
