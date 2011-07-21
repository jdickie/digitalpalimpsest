//------------Crop----------------------------
//
//	crop.js
//	For generating cropped portions out 
//	of for (var i=0; i<x; i++) {
//
//	Crop
//	Properties
//		panel: Reference to main panel
//		desktop: Reference to main workspace
//		image:	Reference to image object
//		src: Image file source
//		srcx: Left property of image
//		srcy: Top property of image
//		pstringout: URI GET value
//		printimg: Crop Image element
//		croppedHolder: DIV element containing 
//			cropped image
//
//	Methods
//		openPanel: sets up the crop Panel bar
//			Parameters: 
//				e: listens for mouseover
//				obj: CropBox object
//
//		closePanel: Removes crop panel bar
//			Parameters: 
//				e: listens for mouseout
//				obj: CropBox object
//
//		close: Removes crop panel from screen
//			Parameters:
//				e: listens for mouseclick
//				obj: CropBox object
//
//		saveCrop: Stores cropped area information
//			into database
//			Parameters: 
//				e: listens for mouseclick
//				obj: CropBox object
//
//		makeDraggable: Creates a resizable and draggable
//			CropBox
//-----------------------------------------------

CropBox = Monomyth.Class.extend({
	init:function(values) {
		this.values=values;
		this.DOM = $("<div></div>");
		values.loc.append(this.DOM);
		if(values.id){
			this.DOM.attr("id",values.id);
			
		} else {
			this.DOM.attr("id",function(arr){
				return "crop"+$(".croppedHolder").length;
			});
		}
		this.id=this.DOM.id;
		this.DOM.addClass("croppedHolder");
		
		this.header=$("<div></div>");
		this.DOM.append(this.header);
		this.header.attr("id",function(arr){
			return "_handle" + arr;
		});
		
		//Header Buttons
		this.closeButton=$("<span class=\"panelButton\"></span>");
		this.closeButton.attr("id",function(){
			return "closeCrop"+$(".croppedHolder").length;
		});
		this.closeButton.text("Close");
		this.header.append(this.closeButton);
		this.closeButton.bind("click",{obj:this},this.close);
		
		this.savePNGButton=$("<span class=\"panelButton\"></span>");
		this.savePNGButton.attr("id",function(){
			return "savePNG"+$(".croppedHolder");
		});
		this.savePNGButton.text("Download");
		this.header.append(this.savePNGButton);
		this.savePNGButton.bind("click",{obj:this},this.saveAsPNG);
		/*
this.closeButton=new cropButton("","delete",this.header,this.close,this);
		this.savePNGButton=new cropButton("","| download",this.header,this.saveAsPNG,this);
		
*///set up crop variables
		this.path=values.path;
		this.srcx=parseInt(values.srcx,10);
		this.srcy=parseInt(values.srcy,10);
		this.srcw=parseInt(values.srcw,10);
		this.srch=parseInt(values.srch,10);
		
		this.maxWidth=null;
		this.maxHeight=null;
		this.minWidth=null;
		this.minHeight=null;
		this.pstringout=null;
		this.printimg=null;	
		this.loadPic(this);
		
		this.closedCrop='closedCrop';
		this.cropClicked='cropClicked';
		this.cropReadyState='cropReadyState';
		
	},
	focusObj:function(e,pass,obj){
	obj.DOM.className="crop_InBckGrnd";
},
loadPic:function(obj){
	
	obj.pstringout = "?src=" + obj.path + "&srcx=" + obj.srcx + "&srcy=" + obj.srcy +
	"&srcw=" +
	obj.srcw +
	"&srch=" +
	obj.srch;
	sUrl = "./lib/Crop/assets/cropImg.php"+obj.pstringout;
	
	obj.printimg = $("<img></img>");
	obj.printimg.attr("src",sUrl);
	obj.printimg.attr("alt","Loading...");
	obj.DOM.append(obj.printimg);
	obj.printimg.attr("id",function(arr){
		return "pringSrc"+arr;
	});
	
	var nWidth = parseInt(obj.srcw,10)+'px';
	var nHeight = parseInt(obj.srch,10)+'px';
	
	//resize the HTML
	obj.DOM.width(nWidth);
	obj.DOM.height(nHeight);
	obj.makeDraggable();
	//YAHOO.util.Dom.setStyle(obj.DOM,'width',nWidth);
	//YAHOO.util.Dom.setStyle(obj.DOM, 'height', nHeight);
	/*
	YAHOO.util.Event.onContentReady(obj.printimg.id,function(obj){
			obj.saveCrop(null,obj);
		},obj);
*/
	},
	setHeader:function(e, obj){
		/*
	YAHOO.util.Event.stopEvent(e);
	
		obj.ratio = obj.DOM.childNodes[1].width/obj.DOM.childNodes[1].height;
	
		YAHOO.util.Dom.setStyle(obj.header, 'display', 'block');
*/
	},
	unsetHeader:function(e, obj){
		//YAHOO.util.Event.stopEvent(e);
		//YAHOO.util.Dom.setStyle(obj.header, 'display', 'none');
	},
	close:function(e) {
		e.stopPropagation();
		var obj=e.data.obj;
		obj.DOM.remove();
		return false;
	},
	saveAsPNG:function(e){
		e.stopPropagation();
		var obj=e.data.obj;
		var sUrl="./lib/Crop/assets/downloadPNG.php"+obj.pstringout;
		window.location=sUrl;
		return false;
	},
	makeDraggable:function() {
		this.DOM.draggable();		
	}
});

var cropButton=Monomyth.Class.extend({
	init:function(img,type,loc,clickEvent,panel){
		this.panel=panel;
		/*
	this.image = document.createElement("span");
		this.image.src = img;
		this.image.alt = type;
*/
		this.type=type;
	
		this.loc = loc;
		this.DOM = $("<span></span>");
		this.DOM.addClass("panelButton");
		loc.append(this.DOM);
		//this.DOM.appendChild(this.image);
	
		this.DOM.text(type);
		this.DOM.attr("id",function(arr){
			"cropbutton"+arr;
		});
		this.id=this.DOM.attr("id");
	
		this.DOM.bind("click",{obj:this.panel},clickEvent);
		//YAHOO.util.Event.addListener(this.DOM, "click", eval(clickEvent),this.panel);
	}
});
