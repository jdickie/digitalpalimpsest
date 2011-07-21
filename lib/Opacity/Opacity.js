//--------Opacity---------------------
//
// Opacity slider controller for 
//	image opacity
//

Opacity = function(){
	//this.panel = panel;
	this.sliderObj = null;
	this.HTML = document.createElement("div");
	this.HTML.id = YAHOO.util.Dom.generateId(this.HTML,"sliderContainer");
	this.HTML.className="slideContainer";
	this.HTML.style.display="none";
	//this.callback = callback;
	
		//this.id = YAHOO.util.Dom.generateId(this,"sliderObj");
	
	this.Bg = document.createElement("div");
	this.Bg.id = YAHOO.util.Dom.generateId(this.Bg,"sliderBg");
	this.Bg.className = "slideBack";

	this.Bg.setAttribute("tabindex","-1");
	
	
	
	this.Handle = document.createElement("div");
	this.Handle.className="slideHandle";

	this.Handle.id = YAHOO.util.Dom.generateId(this.Handle,"sliderHandle");
	//this.HandleImg = document.createElement("img");
	//this.HandleImg.src = "./assets/images/slider.png";
	//this.Handle.appendChild(this.HandleImg);

	this.Bg.appendChild(this.Handle);
	this.HTML.appendChild(this.Bg);
	//loc.appendChild(this.HTML);
	this.changeOpac=new YAHOO.util.CustomEvent("changeOpac");
	this.desktopCall=new YAHOO.util.CustomEvent("desktopCallOpac");
	YAHOO.util.Event.onAvailable(this.HTML.id, this.handleOnAvailable, this); 
	
}

/***
 * Controls when the slider is moved
 * @param {Object} e
 * @param {Object} obj
 */
Opacity.prototype.sliderMove = function(e, obj) {
	if(obj) {
		var left = YAHOO.util.Dom.getX(obj.panel);
		var top = YAHOO.util.Dom.getY(obj.panel);
		YAHOO.util.Dom.setX(obj.HTML, left);
		YAHOO.util.Dom.setY(obj.HTML, top);
	} else {
		return false;
	}
}
Opacity.prototype.appear = function(obj){
	obj.HTML.style.display=(obj.HTML.style.display=="none") ? "block" : "none";
}
Opacity.prototype.destroy = function(obj){
//	obj.loc.removeChild(obj.Bg);	
obj.HTML.style.display="none";
//	obj.loc.removeChild(obj.Handle);
}
Opacity.prototype.handleOnAvailable = function(obj){	
	slideleft = (YAHOO.util.Dom.getX(obj.HTML.parentNode))-parseInt(obj.HTML.style.width/2);
	obj.HTML.style.left= slideleft+"px";
	slidetop = (YAHOO.util.Dom.getY(obj.HTML.parentNode)-YAHOO.util.Dom.getY(obj.HTML.parentNode.parentNode))+parseInt(obj.HTML.style.height);
	obj.HTML.style.top= slidetop+"px";	
	obj.sliderObj=YAHOO.widget.Slider.getHorizSlider(obj.HTML.id,obj.Handle.id,0,90,1);
	
	obj.sliderObj.subscribe("change",function(){
		
		bTop = YAHOO.util.Dom.getX(obj.HTML);
		
		sTop = YAHOO.util.Dom.getX(obj.Handle);
		val = parseInt(sTop)-parseInt(bTop);
		
		//obj.changeOpac.fire(val);
		obj.desktopCall.fire({obj: [obj], type: "changeOpac", data: val});
		
		/*
execFunction = obj.callback+"("+val+")";
		
		eval(execFunction);
*/
	});
	obj.sliderObj.subscribe("slideEnd",function(){
		YAHOO.util.Dom.setStyle(obj.HTML, 'display', 'none');
	});
	/*
slideleft = YAHOO.util.Dom.getX(obj.panel.opacButton.HTML)-YAHOO.util.Dom.getX(obj.panel.HTML);
	obj.panel.slider.HTML.style.left= slideleft+"px";
	slidetop = YAHOO.util.Dom.getY(obj.panel.content.HTML)-YAHOO.util.Dom.getY(obj.panel.HTML);
	obj.panel.slider.HTML.style.top= slidetop+"px";	
	//alert(obj.Bg.parentNode.innerHTML);
	obj.sliderObj = YAHOO.widget.Slider.getHorizSlider(obj.HTML.id,obj.Handle.id,0,90,1);
   //alert(obj.sliderObj.type);

	
	obj.sliderObj.subscribe("change",function(){
		
		bTop = YAHOO.util.Dom.getX(obj.HTML);
		
		sTop = YAHOO.util.Dom.getX(obj.Handle);
		val = parseInt(sTop)-parseInt(bTop);
		
		execFunction = obj.callback+"("+val+")";
		
		eval(execFunction);
	});
	
	
	
	//obj.sliderObj
	obj.sliderObj.subscribe("slideEnd",function(){
	
 		
	bTop = YAHOO.util.Dom.getX(obj.HTML);
	sTop = YAHOO.util.Dom.getX(obj.Handle);
	val = parseInt(sTop)-parseInt(bTop);
	
	execFunction = obj.callback+"("+val+")";
	eval(execFunction);
	obj.HTML.style.display="none";
		//alert("CHANGE: "+imgY-sTop);
	
	});
*/
	
	//create listener for when panel is moved
	//YAHOO.util.Event.addListener(obj.HTML.id, "mousemove", obj.sliderMove, obj);
	

}
Opacity.prototype.changed = function(obj){
		if (obj) {
		
			
		
		//	changeFunc = "obj.panel." + obj.callback + "(" + obj.slider.getValue() + ")";
	//		alert(changeFunc);
	//		eval(changeFunc);
		}
}