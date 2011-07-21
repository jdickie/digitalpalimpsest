PanelContent = function(num){
	
    this.HTML = document.createElement("div");
	this.id = YAHOO.util.Dom.generateId(this.HTML, "content");
    this.HTML.className = "panelBody";
    this.HTML.id = this.id;
	this.curPageNum = num;
	this.lastPage=62;
	this.imageDir = "";
	this.htmlDir = "";
	this.pages = [];
	this.copyInfo = null;
	this.mode = "image";
	this.image = null;
	this.openAnno=null;
	this.pageText = new PageText();
	this.pageText.storeTextAnno.subscribe(this.saveTextAnno,this);
	this.set= "default";
	this.docId = null;
	this.boxesOff=new YAHOO.util.CustomEvent("boxesOff");
	this.userOwnsSet = true;
	/*
this.panelContentReady=new YAHOO.util.CustomEvent("panelContentReady");
	this.pageChanged=new YAHOO.util.CustomEvent("pageChanged");
	this.cropBoxIsOpen = new YAHOO.util.CustomEvent("cropBoxIsOpen");
	this.resetClickMode = new YAHOO.util.CustomEvent("resetClickMode");
	
*/
	//crop button (initially invisible)
	this.cropButton = document.createElement("div");
	this.cropButton.id = YAHOO.util.Dom.generateId(this.cropButton, 'cropImg');
	this.cropButton.className = "cropButton";
	YAHOO.util.Event.addListener(this.cropButton.id, 'click', this.crop, this);
	/*
YAHOO.util.Dom.setStyle(this.cropButton, 'display', 'none');
	this.HTML.appendChild(this.cropButton);
*/
	
}
PanelContent.prototype.init = function(manifest){
	
	//this.copyInfo = new CopyInfo("123",manifest);
	//this.lastPage = this.copyInfo.pages.length;
	this.docId=manifest;
	var callback={
		success: function(o){
			george=false;
			manDom = o.responseXML;
		
			doc = manDom.documentElement;
			
			obj = o.argument.obj;
			
			obj.imageDir = doc.getAttribute("baseimg");
			
			obj.htmlDir = doc.getAttribute("basehtml");
			obj.pages = [];
		
			pagesArray = doc.getElementsByTagName("page");
			
			for (p=0;p<pagesArray.length;p++){
		
				text = {
				
					v: pagesArray[p].getElementsByTagName("ver")[0].firstChild.nodeValue,
					r: pagesArray[p].getElementsByTagName("rec")[0].firstChild.nodeValue
				};
			
				page = {
					img: pagesArray[p].getElementsByTagName("img")[0].firstChild.nodeValue,
					tiles: pagesArray[p].getElementsByTagName("tiledir")[0].firstChild.nodeValue, 
					html: text
				
				};
				obj.pages.push(page);
		
			}	
			
			url = obj.imageDir+'/'+obj.pages[obj.curPageNum].tiles;
			
			prefix=obj.pages[obj.curPageNum].img+'-';
			obj.addImage({baseURI: url, prefix: prefix},obj);
			
			obj.HTML.appendChild(obj.pageText.HTML);
			obj.pageText.fillPage(obj.htmlDir+"/"+obj.pages[obj.curPageNum].html.v,obj.htmlDir+"/"+obj.pages[obj.curPageNum].html.r);
			
			obj.showPage(obj);
			obj.panelContentReady.fire(obj.pages);
		},
		failure: function(o){
			alert("Error setting up images");
		},
		argument: {
			obj: this
		}
	};
	
	YAHOO.util.Connect.asyncRequest('GET', manifest, callback);
	//'/ppham-1604-22276x-fol-c01/ham-1604-22276x-fol-c01-001-tiles', panel.content);
}

/**
 * Called by Panel Resize event
 * 
 */
PanelContent.prototype.adjustResize = function(obj, nWidth, nHeight, offsetH){
	
	//var bodyWidth = (nWidth - offsetW);
	var bodyHeight = (nHeight - offsetH);
	
	YAHOO.util.Dom.setStyle(obj.HTML, 'width', nWidth+'px');
	YAHOO.util.Dom.setStyle(obj.HTML, 'height',bodyHeight+'px');
	
	obj.image.adjustResize(obj.image, nWidth, bodyHeight);
	
}

PanelContent.prototype.changePage = function(e,pass,args){

	args.curPageNum = pass[0];
	args.showPage(args);
	
}
PanelContent.prototype.addImage=function(src, obj){
	
	obj.image = new LayerImage(src);
	obj.setContent(obj.image.HTML);
	obj.image.unInitImageClick.subscribe(function(e, pass, args){
		args.boxesOff.fire();
		args.image.uninitImageClick("anno");
	}, this);
	
	obj.image.saveImageAnnoEvent.subscribe(obj.saveImageAnno,obj);
	obj.image.layerImageReady.subscribe(obj.applyAnnos,obj);
	YAHOO.util.Event.onContentReady(obj.image.HTML,obj.applyAnnos,obj);
	obj.image.passImageAnnoClicked.subscribe(function(e,pass,args){
		
		args.showImgAnno(e,pass[0],[args,pass[0]]);
	},obj);
	obj.image.crop.subscribe(obj.prepareCrop,obj);
	obj.image.anno.subscribe(obj.createAnno,obj);
	
}
PanelContent.prototype.prepareCrop = function(){
		if (this.mode == "image") {
			this.image.initializeImageClick('crop', coords);
			this.image.crop.unsubscribe(this.prepareCrop,this);
			this.image.crop.subscribe(this.getCropBox,this);
			//YAHOO.util.Event.addListener(this.cropButton, "click", this.crop, this);
			//this.HTML.appendChild(this.cropButton);
			
		}
}
PanelContent.prototype.leaveCrop = function(){
	if(this.mode == "image"){
		if(obj.cropBox){
			obj.cropBox.HTML.removeChild(obj.cropButton);
			obj.image.cropDone(obj.cropBox, obj.image);
			obj.cropBox=null;
			
			//YAHOO.util.Dom.setStyle(obj.cropButton, 'display', 'none');
		}
		this.image.uninitImageClick('crop');
		this.image.crop.unsubscribe(this.getCropBox,this);
		this.resetClickMode.fire("none");
		//YAHOO.util.Event.removeListener(this.cropButton, "click", this.crop);
	}
}
PanelContent.prototype.getCropBox=function(e,pass,args){
	if (!obj.cropBox) {
		args.cropBox = pass[0];
		args.cropBox.HTML.appendChild(args.cropButton);
		//obj.image.cropDone(obj.cropBox,obj.image);
	} else {
		args.image.cropDone(pass[0], obj.image);
	}
	
	
}
PanelContent.prototype.crop = function(e, obj){
	
	if (obj.cropBox) {
	
		obj.image.viewerBean.getBoxMasterPos(obj.cropBox);
		//YAHOO.util.Dom.setStyle(obj.cropButton, 'display', 'none');
		obj.cropBox.HTML.removeChild(obj.cropButton);
		obj.image.crop.unsubscribe(obj.getCropBox, obj);
		
		cb = obj.cropBox.origCoords;
		len = obj.image.baseURI.length - 6;
		//jpg = "../../../"+obj.image.baseURI.substring(0,len)+".jpg";
		//jpg = obj.image.baseURI.substring(0, len) + ".jpg";
		/*
abbie = obj.image.baseURI.substring(0,len);
		abbie = abbie.replace('http://mith.info/archie/', '');
		abbie = abbie.split('/');
		jpg = '../../../../'+abbie[0]+'/cropped/'+abbie[1]+'_c.jpg';
*/

		//path is now the tile image reference
		jpg=obj.cropBox.reference;
		
		values = {
			path: jpg,
			srcx: cb[0],
			srcy: cb[1],
			srcw: cb[2],
			srch: cb[3],
			iZoom: cb[4]
		
		}
		
		cropPortion = new CropBox(values);
		document.getElementsByTagName("body")[0].appendChild(cropPortion.HTML);
		//remove red box
		obj.cropBoxIsOpen.fire(obj.cropBox); //sends cropBox to Archie panel 
		obj.image.cropDone(obj.cropBox, obj.image);
		obj.cropBox=null;
		obj.leaveCrop();
	} else if(!obj.cropBox) {
		alert("Click an area on the image before making a crop");
	}
}
PanelContent.prototype.clearContents= function(){
	
	contentDiv = this.HTML;
	kids = contentDiv.childNodes;
	if (kids) {
		for (i = 0; i < kids.length; i++) {
			contentDiv.removeChild(kids[i]);
		}
	}
}
PanelContent.prototype.setContent = function(contentObj){
	this.clearContents();	
	
	this.HTML.appendChild(contentObj);	
	
	
}
PanelContent.prototype.nextPage = function(e,obj){
			
				if (obj.curPageNum < (obj.lastPage)){
					obj.curPageNum++;
					obj.showPage(obj);
					
				} else {
					obj.curPage;
				}
			
}
PanelContent.prototype.prevPage = function(e,obj){
	
				if (obj.curPageNum > 0){
					obj.curPageNum--;
					obj.showPage(obj);
					
				} else {
					obj.curPage;
				}
	}
PanelContent.prototype.showPage = function(obj){
	

if (obj) {
		obj.pageChanged.fire(obj.curPageNum);
		if (obj.mode == "text") {
		
			vURI = obj.htmlDir+"/"+obj.pages[obj.curPageNum].html.v;
			rURI = obj.htmlDir+"/"+obj.pages[obj.curPageNum].html.r;
			obj.pageText.fillPage(vURI,rURI,obj.docId,obj.curPageNum,obj.set);
			
		}
		else{
			
			tileurl = obj.imageDir+'/'+obj.pages[obj.curPageNum].tiles;
			prefix = obj.pages[obj.curPageNum].img+"-";
		
			//obj.applyAnnos(null,null,obj);
			obj.image.changePage(obj.image, tileurl, prefix);
				
		
			//YAHOO.util.Event.onContentReady(obj.image.HTML,obj.applyAnnos,obj)	
		}
		
	}
}
PanelContent.prototype.applyAnnos=function(e,pass,pc){
		//clear out boxes
		pc.image.clearBoxes();
	if(!(pc.docId=="")){
		if(pc.set==""){
			pc.set="default";
		}
		var params = '?type=image&proj=none&doc=' + pc.docId + '&page=' + (pc.curPageNum+1) +'&set='+pc.set;
	
	
		var sUrl = './lib/Annotation/retrieveAnno.php'+params;
		
		var callback = {
			success: function(o){
				annosOnPage = o.responseText;
				annoRows = annosOnPage.split("\n");
				for (i in annoRows){
					row = annoRows[i];
					piece = row.split("%");
					id = piece[0];
					coords = piece[1];
					ref=piece[2];
					text=piece[3];
					if (coords) {
						c = coords.split(",");
						ca = [];
						ca.push(parseFloat(c[0]));
						ca.push(parseFloat(c[1]));
						ca.push(parseFloat(c[2]));
						ca.push(parseFloat(c[3]));
					
						pc.image.addBox(pc.image,id,ref,ca,text);
					}
				}
				
			
			},
			failure: function(o){
				alert("Notes could not be loaded. This may be due to your connection.");
			}
			,
			argument: {pc: pc}
			
		}
		
		var request = YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);
	}
		
}
/**
 * Make call to the database to retrieve
 * information on user priviledges for 
 * annotation set in use
 * 
 * activated by Panel call
 * @param {Array} values
 * @param {Object} obj
 */
PanelContent.prototype.callChangeAnnoSet = function(values, obj){
	//obj.set={name: values.annoName, id: values.annoId};
	
	obj.set=values.annoId;
	obj.docId=values.docId;
	obj.userOwnsSet=values.priv;
	
	obj.showPage(obj);
	
}

PanelContent.prototype.toggleMode = function(e, obj){


	
if (obj.mode=="text") {
			
			//panel.desktopCall.fire({obj: [panel.zoom], callback: ["obj.disappear"], type: "zoomToggle", data: panel.zoom});
			obj.image.HTML.style.display="none";
			obj.pageText.HTML.style.display="block";
			YAHOO.util.Dom.setStyle(obj.HTML,"overflow","auto");
			
		//	obj.zoom.mode="off";
		}
		else {
		
			obj.image.HTML.style.display="block";
			obj.pageText.HTML.style.display="none";
			if (obj.annoBar) {
				document.getElementsByTagName("body")[0].removeChild(obj.pageText.annoBar.HTML);
			}
			//obj.zoom.mode="on";
			
		}
		obj.showPage(obj);
		
	}
//-----------Zoom----------------------

PanelContent.prototype.zoomOut = function(e, obj){
	obj.image.viewerBean.zoom(-1);
}
PanelContent.prototype.zoomIn = function(e, obj){
	obj.image.viewerBean.zoom(1);
}
PanelContent.prototype.saveImageAnno=function(e,pass,args){
	
	anno=pass[0].obj;
	box=pass[0].box;
	
	var comment=anno.textInput.value;
	if ((!(args.docId == "")) && (!(args.set == ""))) { //anno is defined?
		var params = '?type=image&text=' + comment + '&ref='+args.openAnno.box.reference+'&doc=' + args.docId + '&coords=' + args.openAnno.box.origCoords.toString() + '&link=null&page=' + (args.curPageNum+1) + '&set=' + args.set;
		
		
		var sUrl = './lib/Annotation/saveAnno.php' + params;
		
		var callback = {
			success: function(o){
				arg = o.argument;
				pc = o.argument.panelContent;
				box = arg.box;
				id=o.responseText;
				box.changeToMarker(id,o.argument.comment);
				/*box.draggableBox.lock();
			 box.HTML.className = "imageAnnotation";
			 box.HTML.id="fn"+o.responseText;*/
				box.imageAnnoClicked.subscribe(pc.showImgAnno, [pc, box]);
				
				pc.leaveAnno(null,null,pc);
				pc.applyAnnos(null,null,pc);
			//YAHOO.util.Event.addListener(box.HTML.id,"click",pc.showImgAnno,[pc,box]);
			
			},
			failure: function(o){
				alert("Error loading data.");
			},
			argument: {
				box: box,
				panelContent: args,
				comment: comment
			}
		
		}
		
		var request = YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);
	} else {
		//no annotation set selected - save to a default
		
		
		
		args.leaveAnno(args);
	}
	
}

PanelContent.prototype.setUpCrop=function(obj, coords){
	if (obj.mode == "image") {
		if (obj.cropBox) {
			if (document.getElementById(obj.cropButton.id)) {
				obj.HTML.removeChild(obj.cropButton);
				
			}
			if (document.getElementById(obj.cropBox.id)) {
			
				obj.image.cropDone(obj.cropBox, obj.image);
			}
		}
		obj.image.initializeImageClick('crop', coords);
			
		obj.image.crop.subscribe(obj.getCropBox,obj);
		//YAHOO.util.Event.addListener(obj.cropButton, "click", obj.crop, obj);
		
	}
}

PanelContent.prototype.showImgAnno=function(e,pass,args){

		pc = args[0];
		marker = args[1];
		marker.editLock=pc.userOwnsSet;
		
		if (!(marker.tempBox)) {
			
			marker.tempBox = new InfoPopUp(marker.id, marker.annoText, marker.editLock, 'image');
			pc.HTML.appendChild(marker.tempBox.HTML);
			marker.tempBox.deleteFootnote.subscribe(pc.destroyNote, [marker,pc]);
			
			//tempBox.appendChild(txt);
		}
		
		marker.tempBox.showWin("",marker.tempBox);
		YAHOO.util.Dom.setX(marker.tempBox.HTML, YAHOO.util.Dom.getX(marker.HTML));
		YAHOO.util.Dom.setY(marker.tempBox.HTML, YAHOO.util.Dom.getY(marker.HTML));
		//id = marker.HTML.id.substring(2);
		
		
		/*
params = "?type=image&id=" + id+"&doc="+pc.docId+"&set="+pc.set+"&page="+pc.curPageNum+"&proj=none";
		var sUrl = './lib/Annotation/showAnno.php' + params;
		
		var callback = {
			success: function(o){
				
				//txt = document.createTextNode(o.responseText);
				var values=o.responseText.split('%');
				marker = o.argument.marker;
				marker.editLock=(parseInt(values[1])==1) ? true : false;
				if (!(marker.tempBox)) {
					marker.tempBox = new InfoPopUp(id, values[0], marker.editLock, 'image');
				//tempBox.appendChild(txt);
				}
				pc.HTML.appendChild(marker.tempBox.HTML);
				marker.tempBox.showWin("", marker.tempBox);
				marker.tempBox.deleteFootnote.subscribe(obj.destroyNote, [marker,obj]);
				//marker.tempBox.editFootnote.subscribe(marker.changeText, obj);
				YAHOO.util.Dom.setX(marker.tempBox.HTML, YAHOO.util.Dom.getX(marker.HTML));
				YAHOO.util.Dom.setY(marker.tempBox.HTML, YAHOO.util.Dom.getY(marker.HTML));
				
			},
			failure: function(o){
				alert("Error loading data");
			},
			argument: {
				marker: marker, pc:pc
			}
		
		}
		
		var request = YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);
*/
	
	
}
/**
 * Called after InfoPopUp destroyFootnote Event
 * 
 * @param {Object} e
 * @param {Object} pass
 * @param {Object} args
 */
PanelContent.prototype.destroyNote=function(e,pass,args){

	box = args[0];
	obj = args[1];

	var id=box.HTML.id.substring(2);
	var sUrl="./lib/Annotation/deleteAnno.php?id="+id+"&type=image&set="+obj.set;
	
	
	var callback = {
			success: function(o){
					box=o.argument.box;
					obj=o.argument.obj;
					obj.HTML.removeChild(box.tempBox.HTML);
					obj.HTML.removeChild(box.HTML);
					
			},
			failure: function(o){
				alert("Error connecting to database");
			},
			argument: {
				box: box,obj:obj
			}
		
		}
		
		var request = YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);
}
PanelContent.prototype.saveTextAnno=function(e,pass,args){

	panelContent = args;
	pageText = pass[0][0];
	sel = pageText.annoInfo;
	anno = pass[0][1];


	var comment=anno.textInput.value;
	
	var startParent = sel.startNodeParent;
	var startCount = sel.startChildNum;
	var startOffset = sel.startOffset;
	
	var endParent = sel.endNodeParent;
	var endCount = sel.endChildNum;
	var endOffset = sel.endOffset;


	var docId = panelContent.docId;
	var prefix = panelContent.set+"_"+docId+"_"+panelContent.curPageNum+"_";
	var params='?type=text&text='+comment+'&doc='+docId+'&node1='+startParent.id+'&startCount='+startCount+'&node2='+endParent.id+'&endCount='+endCount+'&startValue='+startOffset+
'&endValue='+endOffset+'&page='+panelContent.curPageNum+'&set='+panelContent.set;
		
		
		
		var sUrl = './lib/Annotation/saveAnno.php'+params;
	
		var callback = {
			success: function(o){
			
				o.argument.pageText.createTextAnno({id: o.responseText,endNode: o.argument.endNode, offset2: o.argument.offset2,node2: o.argument.node2,pageText: o.argument.pageText});
			},
			failure: function(o){
				alert("Error loading data.");
			}
			,
			argument: {node2: endParent.id, endNode: endCount, offset2: endOffset, pageText: pageText}
			
		}
		
		var request = YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);

		
		
	
	
	

}
//-----------Annotation-----------------
PanelContent.prototype.createAnno=function(e,pass,args){
	//passed box variable to be attached to annotation object
	
	if(args.mode=="image"){
		if(args.openAnno){
			args.openAnno.destroy("",args.openAnno);
		}
		
		args.openAnno=new Annotation("image",pass[0]);
		args.openAnno.saveAnnoCall.subscribe(args.saveImageAnno,args);
		args.openAnno.annoClosed.subscribe(args.leaveAnno,args);
		args.image.handleAnno(args.openAnno,"add");
	
	}
}
PanelContent.prototype.setUpAnno=function(obj, coords){
	if (obj.mode == "image") {
		if(document.getElementById(obj.cropButton.id)){
			obj.HTML.removeChild(obj.cropButton);
			obj.image.crop.unsubscribe(obj.getCropBox, obj);
			//YAHOO.util.Event.removeListener(obj.cropButton, 'click', obj.crop);
			if(obj.cropBox){
				obj.image.cropDone(obj.cropBox, obj.image);
			}
		}
		
		obj.image.initializeImageClick('anno', coords);
	}
	else {
		obj.pageText.startAnno();
	}

}
PanelContent.prototype.leaveAnno = function(e,pass,args){
	
	if(args.openAnno){
		args.openAnno.annoClosed.unsubscribeAll();
		args.openAnno.saveAnnoCall.unsubscribeAll();
		args.image.handleAnno(args.openAnno,"remove");
		if(args.openAnno.box){
			args.image.cropDone(args.openAnno.box,args.image);
		}
	}
	args.image.uninitImageClick('anno');
	args.resetClickMode.fire("none");
}
