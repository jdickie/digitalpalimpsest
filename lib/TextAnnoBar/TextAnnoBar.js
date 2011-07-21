/**
 * Created for Text Annotations in PageText.js
 * 
 * Deprecated as of March 2009
 */
TextAnnoBar= function(){
	
	this.HTML = document.createElement("div");
	this.HTML.className = "textAnnoBar";
	this.content = document.createElement("div");
	this.content.className = "textAnnoBarContent";
	this.content.appendChild(document.createTextNode("First click a start point..."));
	
	this.HTML.appendChild(this.content);	
	
	this.mode = 0; // mode is 0 or 1, 0=start 1=end
	
	this.markerSelect=new YAHOO.util.CustomEvent("markerSelect");
	this.markerCancel=new YAHOO.util.CustomEvent("markerCancel");
}
TextAnnoBar.prototype.handleButtonClick=function(e,button){
	if (bar.mode==0){
		bar.markerSelect.fire("start");
		
		bar.mode = 1;
		this.content.removeChild(this.content.firstChild);
	this.content.appendChild(document.createTextNode("Now click the ending point."))
	
	}
	else{
		bar.markerSelect.fire("end");
		bar.closeBar();
	}
}
TextAnnoBar.prototype.initEnd=function(){
	this.mode = 1;
	this.content.removeChild(this.content.firstChild);
	this.content.appendChild(document.createTextNode("Now click the ending point."));
	this.markerSelect.fire("end");
}

TextAnnoBar.prototype.cancelBar=function(e,bar){
	bar.markerCancel.fire();
	
	bar.closeBar();
}
TextAnnoBar.prototype.closeBar = function(){
	this.mode =0;
	this.HTML.parentNode.removeChild(this.HTML);

}
