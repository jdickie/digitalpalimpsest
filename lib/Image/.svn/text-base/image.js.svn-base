//-------------image-------------------
//
// image.js
//
//	Image Object
// creates an image that consists of the image holder,
// page number, and information on related image regions
// polygons, etc.
//
//-------------------------------------

//--------------Image--------------------
Image = function(){
	//Initial src is './'
	this.HTML = document.createElement("img");
	this.HTML.src='./';
	this.id = YAHOO.util.Dom.generateId(this.HTML,"image");
	this.HTML.id = this.id;
	this.HTML.style.display="block";
	this.src = './';
	this.origWidth = this.HTML.width;
	this.origHeight = this.HTML.height;
	//this.panel = loc;
	
	//instantiate click listener
	this.imageClicked=new YAHOO.util.CustomEvent("imageClicked");
	this.desktopCall=new YAHOO.util.CustomEvent("desktopCall");
	YAHOO.util.Event.addListener(this.HTML, "click", this.imageClick, this);
}
Image.prototype.change=function(e, pass, args){
	src=pass[0].data;
	srcTest = src.substring((src.length-4));
	
	if (srcTest == '.jpg') {
	
		args.HTML.src = src;
		args.src = src;
		
	}
		
}
Image.prototype.insertShape=function(e, pass, args){
	shape=pass[0];
	args.HTML.appendChild(shape);
}
Image.prototype.imageClick = function(e,imageObj){
	
	imageObj.desktopCall.fire({obj: [imageObj], callback: [""], type: "imageClicked", data: {obj: imageObj.HTML,
		mousex: YAHOO.util.Event.getPageX(e),
		mousey: YAHOO.util.Event.getPageY(e)}});
	/*
imageObj.imageClicked.fire({
		obj: imageObj.HTML,
		mousex: YAHOO.util.Event.getPageX(e),
		mousey: YAHOO.util.Event.getPageY(e)
	});
*/
	/*
if (args.panel.mode == "image") {
		switch (args.panel.shapeType) {
			case "poly":
			
				if (args.curArea) {
					aNode = new Node(args, [mouseX, mouseY, 10, 10],false, false);
					args.curArea.nodes.push(aNode);
				}
				else{
					aNode = new Node(args, [mouseX, mouseY, 10, 10], true, false);
					aNode.HTML.className = "firstNode";
					args.curArea = new Area(args,"poly");
					args.curArea.nodes.push(aNode);
					args.areas.push(args.curArea);
					//YAHOO.util.Event.addListener(aNode,"mousedown",args.curArea.clearLines,args.curArea);
					
				}	
				//YAHOO.util.Event.addListener(aNode.dot.id,"mousedown",args.curArea.clearLines,args.curArea);
			
				aNode.area = args.curArea;
				
				break;
			case "box":
				it = new ImageRegion(args, [mouseX, mouseY, 40, 40], false);
				args.imageRegions.push(it);
				//args.curArea = new Archie.area(args, "box");
				//map = new Archie.map(args,"box",[mouseX, mouseY, 10, 10]);
				
				break;
				
		}
	}
*/
	
}
Image.prototype.zoomIn=function(e, pass, args){
	scale=parseInt(pass[0].data.scale);
	newW = (parseInt(YAHOO.util.Dom.getStyle(args.HTML, "width")) * scale);
			
	newH = (parseInt(YAHOO.util.Dom.getStyle(args.HTML, "height")) * scale);
			
	YAHOO.util.Dom.setStyle(args.HTML, "width", newW + "px");
	YAHOO.util.Dom.setStyle(args.HTML, "height", newH + "px");
}
Image.prototype.zoomOut=function(e,pass, args){
	scale=parseInt(pass[0].data.scale);
	
	newW = (parseInt(YAHOO.util.Dom.getStyle(args.HTML, "width")) / scale);
			
	newH = (parseInt(YAHOO.util.Dom.getStyle(args.HTML, "height")) / scale);
			
	YAHOO.util.Dom.setStyle(args.HTML, "width", newW + "px");
	YAHOO.util.Dom.setStyle(args.HTML, "height", newH + "px");
}
Image.prototype.clearCoords=function(obj){
	//clear contents
		/*
nodes = YAHOO.util.Dom.getElementsByClassName("node", "div", panel.HTML);
		fnodes = YAHOO.util.Dom.getElementsByClassName("firstNode", "div", panel.HTML);
		dots = YAHOO.util.Dom.getElementsByClassName("dot", "div", panel.HTML);
		boxes = YAHOO.util.Dom.getElementsByClassName("box yui-resize", "div", panel.HTML);
*/
		
		//alert("panel.image.nodes thing length:     " + panel.image.nodes[1].area.nodes.length);
	
	for (x in obj.areas) {
		area = obj.areas[x];
		for (i in area.nodes) {
			//curr.nodes[i].dot.HTML.parentNode);
			//panel.HTML.removeChild(curr.nodes[i].dot.HTML);
			area.nodes[i].HTML.parentNode.removeChild(area.nodes[i].HTML);
			
		}
		area.nodes[x].length = 0;
		for(i in area.lines) {
			area.lines[i].remove();
		}
		
	}
	obj.areas.length = 0;
	obj.curArea = null;
	/*
panel.image.areas = [];
	for(i in panel.image.alines) {
		panel.image.lines[i].remove();
		
	}
	panel.image.lines.length = 0;
*/
		/*
for(i in dots) {
			dots[i].parentNode.removeChild(dots[i]);
		}
*/
	
		for(i in obj.imageRegions) {
			
			obj.imageRegions[i].HTML.parentNode.removeChild(panel.image.imageRegions[i].HTML);
			
		}
		obj.imageRegions.length = 0;
}
Image.prototype.getCoordOnOrig = function(img,x,y){
	xCor = parseInt(x);
	yCor = parseInt(y);
	
	imgObj = img.desktop.objects[img.id];
	xPercent = xCor/parseInt(img.offsetWidth);
	yPercent = yCor/parseInt(img.offsetHeight);
	realX = Math.round(xPercent * parseInt(imgObj.origWidth));
	realY = Math.round(yPercent * parseInt(imgObj.origHeight));
	result = [realX,realY];
	
	return  result;
	
}
Image.prototype.getCoordOnCur = function (img,x,y){
		xCor = parseInt(x);
		yCor = parseInt(y);
		imgObj = img.desktop.objects[img.id];
	
		xPercent = xCor/imgObj.origWidth;
	yPercent = yCor/imgObj.origHeight;
	
	realX = Math.round(xPercent * parseInt(img.offsetWidth));
	realY = Math.round(yPercent * parseInt(img.offsetHeight));
	result = [realX,realY];
	
	return  result;
}
