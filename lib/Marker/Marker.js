/***
 * AnnotationMarker.js
 * 
 * 
 */

 /****
  * AnnotationMarker:
  * Constructor Call for 
  * creating a text annotation marker
  * 
  * data: array of variables for 
  * populating the annotation space
  */
 AnnotationMarker = function(markerChar, id){
 	this.values=null;
 	this.HTML = document.createElement("span");
	this.HTML.id = id;
	this.HTML.className="annoMarker";
	this.HTML.appendChild(document.createTextNode(markerChar));
	
	this.showNote = new YAHOO.util.CustomEvent("showNote");
	this.delFire=new YAHOO.util.CustomEvent("delFire");
	
	this.editLock=false;
	
	YAHOO.util.Event.addListener(this.HTML,"click",this.markerClicked,this);
		
 }
 AnnotationMarker.prototype.hideBox=function(e,box){
 	YAHOO.util.Dom.setStyle(box,"display","none");
 	
 }
 AnnotationMarker.prototype.markerClicked=function(e,obj){
	
	//YAHOO.util.Event.addListener(tempBox,"click",obj.hideBox,tempBox);
	if (obj.tempBox) {
		
		obj.tempBox.showWin(e, obj.tempBox);
	}


 }
 AnnotationMarker.prototype.closeNote = function(e,obj,args){

	obj.parentNode.removeChild(obj);
 }




 
 