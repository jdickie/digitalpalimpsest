/****
 * ImageRegion
 * 
 * Set a draggable, resizeable object
 * as place marker
 * 
 * Properties:
 * -regionClick: customEvent, sent out when user
 * double-clicks on imageregion area
 * 
 * Methods:
 * -zoomIn: changes position and size of imageregion
 * depending upon a given scale
 * -zoomOut: changes position and size of imageregion
 * depending upon a given scale
 * -changed: (deprecated)
 * -capture: fires regionClick
 * -getPoints: returns width, height, left, and top
 * -handleOnAvailable: (private) sets up drag and drop and 
 * resize
 * 
 * 
 */

ImageRegion = function(points, reconstruct){
	this.DOM = document.createElement("div");
	YAHOO.util.Dom.generateId(this.DOM,"imageRegion");
	this.id=this.DOM.id;
	this.DOM.className = "imageRegion";
	this.left=parseFloat(points[0]);
	this.top = parseFloat(points[1]);
	
	YAHOO.util.Dom.setStyle(this.DOM, 'top', this.top+'px');
	YAHOO.util.Dom.setStyle(this.DOM, 'left', this.left+'px');
	YAHOO.util.Dom.setStyle(this.DOM, 'width', points[3]+'px');
	YAHOO.util.Dom.setStyle(this.DOM,'height',points[2]+'px');
	this.diffX=0;
	this.diffY=0;
	this.X=0;
	this.Y=0;
	this.origCoords = [0,0,0,0];
	this.regionClick=new YAHOO.util.CustomEvent("regionClick");
	this.reference = "";
	this.stop = false;
	this.annoText="";
	this.movedEvent = new YAHOO.util.CustomEvent("regionMoved");
	this.boxResizedNow=new YAHOO.util.CustomEvent("boxResizedNow");
	this.boxAdjusted=new YAHOO.util.CustomEvent("boxAdjusted"); //for when PanoJS calls positionTiles
	this.startMove=new YAHOO.util.CustomEvent("startMove");
	this.tempBox=null;
	YAHOO.util.Event.onAvailable(this.id, this.handleOnAvailable, this); 
	YAHOO.util.Dom.setStyle(this.DOM, 'display', 'block');
	this.imageAnnoClicked=new YAHOO.util.CustomEvent("imageAnnoClicked");	
}
ImageRegion.prototype.setOriginalCoords = function(origArray){
	
	this.origCoords = origArray;
	
}
ImageRegion.prototype.changeToMarker=function(id,text){
	
	this.draggableBox.lock();
	this.resizeBox.destroy();
	this.DOM.className = "imageAnnotation";
	this.DOM.id=id+"_"+this.DOM.id;
	this.id=this.DOM.id;
	this.annoText=text;
	
	YAHOO.util.Dom.setStyle(this.DOM, 'display', 'block');
	YAHOO.util.Event.addListener(this.DOM.id,"click",this.handleMarkerClick,this);
}
ImageRegion.prototype.handleMarkerClick=function(e,box){
	
	box.imageAnnoClicked.fire(box);
}
ImageRegion.prototype.destroy=function(e, pass, args){
	args.DOM.parentNode.removeChild(args.DOM);
}
ImageRegion.prototype.capture=function(e, obj){
	//send out relevant data
	obj.regionClick.fire({rectangle: obj});
	obj.DOM.parentNode.removeChild(obj.DOM);
}
ImageRegion.prototype.getPoints = function(){
	
	return ([this.DOM.style.left,this.DOM.style.top,this.DOM.style.width,this.DOM.style.height]);
}
ImageRegion.prototype.handleOnAvailable = function(obj){
	
	obj.resizeBox = new YAHOO.util.Resize(obj.id, {
		
		handles: 'all',
		autoRatio: false,
		minWidth: 1,
		minHeight: 1
	});
	
	obj.resizeBox.on('endResize',function(e,obj){
		obj.boxResizedNow.fire(obj);
	},obj);
	
	obj.draggableBox = new YAHOO.util.DD(obj.id);	
	obj.draggableBox.on('dragEvent',function(e,obj){
		obj.startMove.fire(obj);
	},obj);
	obj.draggableBox.on('endDragEvent',function(e,obj){
		obj.movedEvent.fire(obj);
	},obj);
}