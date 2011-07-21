//--------------ArchiePanelContent--------------------------------------------
//  ArchiePanelContent.js 
//  Last modified by dreside @ 4/16/09

//--------------------------------------------------------------
/*
 * Constructor Call for ArchiePanelContent
 * 
 * 
 * Objects:
 * LayerImage, CropBox, InfoPopUp, Annotation, PageText
 * 
 * 
 * Events:  
 * PanelContentReady, PageChanged, cropBoxIsOpen, resetClickMode
 * 
 *
 *********************************/
var ArchiePanelContent = Monomyth.Class.extend({

init:function(args){
    this.DOM = args.contentdiv; 
	this.panelId=args.panelId;
	this.body=$("#"+args.panelId+"_contentBody");
	this.disabled = false;
	this.clickMode = "none";
	this.curPageNum = (args.page)?args.page:0;
	
	this.lastPage=62;
	this.imageDir = "";
	this.htmlDir = "";
	this.xmlDir = "";
	this.pages =null;
	this.copyInfo = null;
	this.mode = "image";
	this.image = null;
	this.openAnno=null;
	this.cropPortions=[];
	this.set= "default";
	this.docId = null;
	
	this.userOwnsSet = true;
	this.panelContentReady="panelContentReady"+this.panelId;
	this.pageChanged="pageChanged"+this.panelId;
	this.cropBoxIsOpen = "cropBoxIsOpen"+this.panelId;
	this.resetClickMode = "resetClickMode"+this.panelId;
	
	//this.setAlert=new YAHOO.util.CustomEvent("setAlert");
	this.map;//OpenLayers Map to be added to MapDiv
	
	//crop button (initially invisible)
	/*
this.cropButton = document.createElement("div");
	YAHOO.util.Dom.generateId(this.cropButton, 'cropImg');
	this.cropButton.className = "cropButton";
	YAHOO.util.Event.addListener(this.cropButton.id, 'click', this.crop, this);
	this.cropRegionClose=document.createElement("div");
	YAHOO.util.Dom.generateId(this.cropRegionClose,'regionClose');
	this.cropRegionClose.className="cropRegionClose";
	this.cropRegionClose.appendChild(document.createTextNode("Close"));
	YAHOO.util.Event.addListener(this.cropRegionClose.id,'click',this.leaveCrop);
*/
},
buildLayer:function(obj,image){
	
	var fullimage='http://localhost:8888/'+obj.base+image;
	var url='./lib/Djatoka_resources/getMetadata.php?url='+fullimage;
	var callback={
		success:function(o){
			var obj=o.argument.obj;
			var img=o.argument.image;
			var imgMeta=eval('('+o.responseText+')');
			var metadataUrl = "http://localhost:8888/lib/Djatoka_resources/getMetadata.php?url="+img;
			obj.curLayer=new OpenLayers.Layer.OpenURL("OpenURL", "http://localhost:8083", {layername: 'basic', format:"img/jpeg",rft_id:img, imgMetadata: imgMeta, metadataUrl: metadataUrl} );
			var metadata = imgMeta;
		   
			//if no mapdiv or map, then create both
			if(!(obj.mapDiv)){
				//create OpenLayers mapdiv - map is attached to this
				obj.mapDiv=document.createElement("div");
				//YAHOO.util.Dom.generateId(obj.mapDiv,'map');
				//YAHOO.util.Dom.setStyle(obj.mapDiv,'height','100%');
				obj.mapDiv.className="mapDiv";
				//set up options for the map
				var resolutions = obj.curLayer.getResolutions();
			    var maxExtent = new OpenLayers.Bounds(0, 0, metadata.width, metadata.height);
			    var tileSize = obj.curLayer.getTileSize();
			    var options = {resolutions: resolutions, maxExtent: maxExtent, tileSize: tileSize};
			    
				obj.DOM.appendChild(obj.mapDiv);
				obj.map = new OpenLayers.Map(obj.mapDiv.id,options);
				//obj.map.addControl(new OpenLayers.Control.MousePosition());
			   	obj.map.addControl(new OpenLayers.Control.MouseDefaults());
			}		   
		   
		  	obj.map.addLayer(obj.curLayer);
			obj.map.setBaseLayer(obj.curLayer);
			
			var newCenter=new OpenLayers.LonLat((metadata.width/2),(metadata.height/2));
			obj.map.setCenter(newCenter,1);
			
		},failure:function(o){o.argument.obj.setAlert.fire("OpenURL failed");},
		argument:{obj:obj,image:fullimage}
	};

},
/**
 * Initializes ArchiePanelContent using a TMS Layer
 * @param {Object} manifest
 */
initTMS:function(manifest){
	this.docId=manifest;
	
	var callback={
		success:function(o){
			obj=o.argument.obj;
			manDom=o.responseXML;
			doc=manDom.documentElement;
			//Populate pages array with image files	
			obj.pages=null;
			obj.base=doc.getAttribute("base");
			pagesArray=doc.getElementsByTagName("page");
			for(p=0;p<pagesArray.length;p++){
				if((pagesArray.item(p)!==null)){
					imgpaths=pagesArray.item(p).getElementsByTagName("layer");
					layers=[];
					if (obj.startviews) {
						//layers=obj.startviews;
						for(s in obj.startviews){
							layers.push(obj.startviews[s].replace(/^\s+|\s+$/g,""));
						}
					}
					else {
						for (l = 0; l < imgpaths.length; l++) {
							layer = imgpaths.item(l).firstChild.nodeValue;
							layers.push(layer);
						}
					}
					img={
						sv:obj.base,
						layers:layers,
						imgdir:'http://localhost:8888/ArchTest',
						img:layers[0],
						page:p
					};
					
					obj.pages.push(img);
				}
			}
			
			//send off to ArchiePanel to create DropDown
			obj.panelContentReady.fire(obj.pages);
			//create TMS Layer object
			obj.limg=new TMSLayer({doc:obj.docId,startzoom:obj.startzoom,startcenter:obj.startcenter,startviews:obj.startviews},obj.DOM);
			obj.limg.exitAnno.subscribe(function(e,pass,args){
				args.resetClickMode.fire("none");
			},obj);
			obj.limg.exitCrop.subscribe(function(e,pass,args){
				args.resetClickMode.fire("none");
			},obj);
			obj.limg.passObject.subscribe(obj.receiveObject,obj);
			//get the current page data
			var curimg=obj.pages[obj.curPageNum];
			curimg.initset='default';
			curimg.initlock=true;
			obj.limg.setLayer(curimg);
		},
		failure:function(o){
			o.argument.obj.setAlert.fire("Error in setting up images");
		},
		argument:{obj:this}
	};
	var connect=YAHOO.util.Connect.asyncRequest("GET",manifest,callback);
},
/**
 * Initializes ArchiePanelContent using a Djatoka Layer
 * @param {Object} manifest
 */
initDJ2K:function(manifest){
	
	this.docId=manifest;
	
	var callback={
		success: function(o){
			obj=o.argument.obj;
			manDom=o.responseXML;
			doc=manDom.documentElement;
			//Populate pages array with image files	
			obj.pages=[];
			obj.base=doc.getAttribute("base")+'/';
			pagesArray=doc.getElementsByTagName("page");
		
			for(p=0;p<pagesArray.length;p++){
				
				if((pagesArray.item(p)!==null)){
					imgpaths=pagesArray.item(p).getElementsByTagName("imgPath");
					obj.pages.push(imgpaths.item(0).firstChild.nodeValue);
				}
			}
			image=obj.pages[obj.curPageNum];
			//attach the current page onto the map
			obj.limg=new ArchieOpenLayer({base:obj.base,doc:obj.docId},obj.DOM);
			obj.limg.exitAnno.subscribe(function(e,pass,args){
				args.resetClickMode.fire("none");
			},obj);
			obj.limg.showPage(image,obj.curPageNum);
			obj.limg.applyAnnos(obj.curPageNum,obj.annoId,obj.userOwnsSet);
			//fire off event to trigger creation of dropdown (ArchiePanel)
			obj.panelContentReady.fire(obj.pages);

		},
		failure: function(o){
			o.argument.obj.setAlert.fire("Error in setting up images");
		},
		argument: {
			obj: this
		}
	};
	YAHOO.util.Connect.asyncRequest('GET', manifest, callback);
	
},

/**
 * Called by Panel Resize event
 * 
 */
adjustResize:function(obj, nWidth, nHeight, offsetH){
	var bodyHeight = (nHeight - offsetH);
	obj.DOM.width(nWidth);
	obj.DOM.height(bodyHeight);
	//YAHOO.util.Dom.setStyle(obj.DOM, 'width', nWidth+'px');
	//YAHOO.util.Dom.setStyle(obj.DOM, 'height',bodyHeight+'px');
},
/**Get Zoom level from layer**/
getZoom:function(){
	return this.limg.map.getZoom();
},
changePage:function(e,pass,args){

	args.curPageNum = pass[0];
	img=args.pages[args.curPageNum];
	args.limg.showPage(img,args.curPageNum);
	//rgs.limg.applyAnnos(args.curPageNum,args.set,args.userOwnsSet);
	//if(args.mode=="image") args.applyAnnos('changepage',[],args);
},
changeLayerView:function(e,pass,args){
	//pass[0] is overlayid
	
	args.limg.changeView(pass[0],args.limg);
},
changeLayerVisibility:function(e,pass,args){
	var layername=pass[0].name;
	var nextlayername=pass[0].nextname;
	var visible=pass[0].visible;
	args.limg.setVisibility(layername,nextlayername,visible);
},
receiveObject:function(e,pass,args){
	//Get object and type
	var type=pass[0].type;
	var obj=pass[0].obj;
	switch(type){
		case 'crop':
			args.cropBoxIsOpen.fire(obj);
			break;
		case 'anno':
			break;
	}
},
addImage:function(src, obj){

	obj.image = new LayerImage(src);
	obj.image.passImageZoomed.subscribe(function(e,args,obj){obj.applyAnnos(e,args,obj);},obj);
	obj.setContent(obj.image.DOM);
	obj.image.unInitImageClick.subscribe(function(e, pass, args){
		args.boxesOff.fire();
		args.image.uninitImageClick("anno");
	}, this);
	obj.image.saveImageAnnoEvent.subscribe(obj.saveImageAnno,obj);
	
	YAHOO.util.Event.onContentReady(obj.image.DOM,obj.imageReady,obj);
		
	obj.image.passImageAnnoClicked.subscribe(function(e,pass,args){
		YAHOO.util.Event.stopEvent(e);
		
		args.showImgAnno(e,pass[0],[args,pass[0]]);
	},obj);
	obj.image.crop.subscribe(obj.prepareCrop,obj);
	obj.image.anno.subscribe(obj.createAnno,obj);
	obj.image.passAlert.subscribe(function(e,pass,args){
		args.setAlert.fire(pass[0]);
	},obj);
	
},
imageReady:function(e,obj){
	
	obj.image.initializeGraphic(obj.image);
	//obj.applyAnnos(e,obj);
},
prepareCrop:function(){
		if (this.mode == "image") {
			obj.limg.setCrop();
			/*
this.image.initializeImageClick('crop', coords);
			this.image.crop.unsubscribe(this.prepareCrop,this);
			this.image.crop.subscribe(this.getCropBox,this);
*/	
		}
},
leaveCrop:function(){
	
	if(this.mode == "image"){
		if(this.cropBox){
			
			this.cropBox.DOM.removeChild(this.cropButton);
			this.image.cropDone(this.cropBox, this.image);
			this.cropBox=null;
	}
		this.image.uninitImageClick('crop');
		this.image.crop.unsubscribe(this.getCropBox,this);
	}
},
delCrop:function(crop){
	id=crop.DOM.id;
	if (this.cropPortions.length == 1) {
		this.cropPortions = [];
	}
	else if(this.cropPortions.length>1){
		for (i in this.cropPortions) {
			if (this.cropPortions[i].DOM.id == id) {
				arr1 = this.cropPortions.slice(0,i);
				arr2=this.cropPortions.slice(i);
				arr2.shift();
				this.cropPortions=arr1.concat(arr2);
			}
		}
	}
},
getCropBox:function(e,pass,args){
	if (!obj.cropBox) {
		args.cropBox = pass[0];
		args.cropBox.DOM.appendChild(args.cropButton);
		
		//args.cropBox.DOM.appendChild(args.cropRegionClose);
	} else {
		args.image.cropDone(pass[0], obj.image);
	}
},
crop:function(e, obj){
	if (obj.cropBox) {
	
		obj.image.viewerBean.getBoxMasterPos(obj.cropBox);
		obj.cropBox.DOM.removeChild(obj.cropButton);
		obj.image.crop.unsubscribe(obj.getCropBox, obj);		
		cb = obj.cropBox.origCoords;
		len = obj.image.baseURI.length - 6;
		//path is now the tile image reference
		jpg=obj.cropBox.reference;	
		values = {
			path: jpg,
			srcx: cb[0],
			srcy: cb[1],
			srcw: cb[2],
			srch: cb[3],
			iZoom: cb[4]
		};
		//create the crop holder from CROP.js
		cropPortion = new CropBox(values);
		document.getElementsByTagName("body")[0].appendChild(cropPortion.DOM);
		
		//remove red box
		obj.cropBoxIsOpen.fire(cropPortion); //sends cropBox to Archie panel 
		obj.image.cropDone(obj.cropBox, obj.image);
		obj.cropBox=null;
		obj.leaveCrop();
	} else if(!obj.cropBox) {
		alert("Click an area on the image before making a crop");
	}
},
clearContents:function(){
	
	contentDiv = this.DOM;
	kids = contentDiv.childNodes;
	if (kids) {
		for (i = 0; i < kids.length; i++) {
			contentDiv.removeChild(kids[i]);
		}
	}
},
setContent:function(contentObj){
	this.clearContents();	
	
	this.DOM.appendChild(contentObj);	
	
	
},
nextPage:function(e,obj){
				if (obj.curPageNum < (obj.lastPage)){
					obj.curPageNum++;
					obj.pageChanged.fire(obj.curPageNum);
					img=obj.pages[obj.curPageNum];
					obj.limg.showPage(img,obj.curPageNum);
					obj.limg.applyAnnos(obj.curPageNum,obj.set,obj.userOwnsSet);
				
				} else {
					obj.curPage;
				}
			
},
prevPage:function(e,obj){
	
				if (obj.curPageNum > 0){
					obj.curPageNum--;
					obj.pageChanged.fire(obj.curPageNum);
					img=obj.pages[obj.curPageNum];
					obj.limg.showPage(img,obj.curPageNum);
					obj.limg.applyAnnos(obj.curPageNum,obj.set,obj.userOwnsSet);
					
				} else {
					obj.curPage;
				}
	},
showPage:function(obj){
if (obj) {
		
		if (obj.mode == "text") {
			vURI = obj.xmlDir+"/"+obj.pages[obj.curPageNum].xml.v;
			rURI = obj.xmlDir+"/"+obj.pages[obj.curPageNum].xml.r;
			obj.pageText.fillPage(vURI,rURI,obj.docId,obj.curPageNum,obj.set);
		}
		else{
			img=obj.pages[obj.curPageNum];
			obj.limg.showPage(img);
			
		}
	}
},
applyAnnos:function(e,pass,pc){
	
	if(!(pc.docId=="")){
		if(pc.set==""){
			pc.set="default";
		}
		var params = '?type=image&proj=none&doc=' + pc.docId + '&page=' + (pc.curPageNum+1) +'&set='+pc.set;
		var sUrl = './lib/Annotation/retrieveAnno.php'+params;
		
		var callback = {
			success: function(o){
				annosOnPage = o.responseText;
				pc=o.argument[0];
				//clear out boxes
				//pc.image.clearBoxes();
				annoRows = annosOnPage.split("\n");
				pc.userOwnsSet=(annoRows[0]=="True")?true:false;
				for (i in annoRows){
					row = annoRows[i];
					piece = row.split("%");
					id = piece[0];
					coords = piece[1];
					ref = piece[2];
					text = piece[3];
					if (coords) {
						c = coords.split(",");
						ca = [];
						ca.push(parseFloat(c[0]));
						ca.push(parseFloat(c[1]));
						ca.push(parseFloat(c[3]));
						ca.push(parseFloat(c[2]));
						pc.image.addBox(pc.image, id, ref, ca, text);
					}
				}
			},
			failure: function(o){
				alert("Notes could not be loaded. This may be due to your connection. ArchiePanelContent 346");
			},argument: [pc]
		};
		var request = YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);
	}
		
},
/**
 * Make call to the database to retrieve
 * information on user priviledges for 
 * annotation set in use
 * 
 * activated by Panel call
 * @param {Array} values
 * @param {Object} obj
 */
callChangeAnnoSet:function(values, obj){

	obj.set=values.annoId;
	obj.setName=values.annoName;
	obj.userOwnsSet=values.priv;
	
	obj.showPage(obj);
	
	if(obj.mode=="image"){
		//obj.applyAnnos('callchangeannoset',[],obj);
		obj.limg.changeAnnoSet(obj.set,obj.userOwnsSet);
	} 

},

toggleMode:function(e, obj){
	if (obj.mode=="text") {
			obj.limg.hide();
			YAHOO.util.Dom.setStyle(obj.pageText.DOM,'display','block');
			YAHOO.util.Dom.setStyle(obj.DOM,"overflow","auto");
		}
		else {
			obj.limg.show();
			obj.pageText.DOM.style.display="none";
			if (obj.annoBar) {
				document.getElementsByTagName("body")[0].removeChild(obj.pageText.annoBar.DOM);
			}
		}
		img=obj.pages[obj.curPageNum];
		obj.limg.showPage(img);
		
	},
//-----------Zoom----------------------

zoomOut:function(e, obj){
	if(obj.mode=="image"){
		obj.limg.zoom(-1);
	}
},
zoomIn:function(e, obj){
	if(obj.mode=="image"){
		obj.limg.zoom(1);
	}
},
resetViewer:function(e,obj){
	obj.image.resetViewerBean(obj.image);
	obj.applyAnnos(null,null,obj);
	//obj.image.reinitializeGraphic(null,obj.image);
},
// saveImageAnno:function(e,pass,args){
// 	
// 	anno=pass[0].obj;
// 	box=pass[0].box;
// 	
// 	var comment=anno.textInput.value;
// 	if ((!(args.docId == "")) && (!(anno.annoId == ""))) { //anno is defined?
// 		
// 		//get signature
// 		var options=YAHOO.util.Dom.getElementsBy(function(el){if(el.selected==true){return el}},'option',YAHOO.util.Dom.getElementsByClassName("dropDown")[0]);
// 		var sigValue=options[0].firstChild.nodeValue;
// 		args.set=anno.annoId;
// 		var params = '?type=image&text=' + comment + '&ref='+args.openAnno.box.reference+'&doc=' + args.docId + '&coords=' + args.openAnno.box.origCoords.toString() + '&link=null&page=' + (args.curPageNum+1) + '&set=' + anno.annoId+
// 		"&security="+anno.publicMode+'&sigValue='+sigValue;
// 		var sUrl = './lib/Annotation/saveAnno.php' + params;
// 		var callback = {
// 			success: function(o){
// 				arg = o.argument;
// 				pc = o.argument.panelContent;
// 				box = arg.box;
// 				id=o.responseText;
// 				box.changeToMarker(id,o.argument.comment);
// 				box.imageAnnoClicked.subscribe(pc.showImgAnno, [pc, box]);
// 				pc.leaveAnno(null,null,pc);
// 				pc.applyAnnos('saveimganno',null,pc);
// 			},
// 			failure: function(o){
// 				alert("Error loading data.");
// 			},
// 			argument: {
// 				box: box,
// 				panelContent: args,
// 				comment: comment
// 			}
// 		}
// 		
// 		var request = YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);
// 	} else {
// 		//no annotation set selected - save to a default	
// 		args.leaveAnno(args);
// 	}
// 	
// },

// setUpCrop:function(obj, coords){
// 	if (obj.mode == "image") {
// 		obj.limg.setCrop();
// 		/*
// if (obj.cropBox) {
// 			if (document.getElementById(obj.cropButton.id)) {
// 				obj.DOM.removeChild(obj.cropButton);
// 				
// 			}
// 			if (document.getElementById(obj.cropBox.id)) {
// 			
// 				obj.image.cropDone(obj.cropBox, obj.image);
// 			}
// 		}
// 		obj.image.initializeImageClick('crop', coords);
// 			
// 		obj.image.crop.subscribe(obj.getCropBox,obj);
// */
// 	}
// },
// showImgAnno:function(e,pass,args){
// 		
// 		pc = args[0];
// 		marker = args[1];
// 		marker.editLock=pc.userOwnsSet;
// 		
// 		if (marker.tempBox==null) {
// 			
// 			marker.tempBox = new InfoPopUp(marker.id, marker.annoText, marker.editLock, 'image');
// 			
// 			pc.image.viewerBean.surface.appendChild(marker.tempBox.DOM);
// 			
// 			marker.tempBox.deleteFootnote.subscribe(pc.destroyNote, [marker,pc]);
// 			marker.tempBox.notifyEdit.subscribe(pc.image.viewerBean.lockMove,pc.image.viewerBean);
// 			marker.boxAdjusted.subscribe(marker.tempBox.move,[marker.tempBox,pc]);
// 		}	
// 		marker.tempBox.showWin("",marker.tempBox);
// 		YAHOO.util.Dom.setX(marker.tempBox.DOM, YAHOO.util.Dom.getX(marker.DOM)+parseInt(YAHOO.util.Dom.getStyle(marker.DOM, 'width'),10)+10);
// 		YAHOO.util.Dom.setY(marker.tempBox.DOM, YAHOO.util.Dom.getY(marker.DOM));
// 		marker.tempBox.move("",[marker],[marker.tempBox,pc]);
// },
// destroyNote:function(e,pass,args){
// 
// 	box = args[0];
// 	obj = args[1];
// 	infoPopup=pass[0];
// 	var id=box.DOM.id.substring(2);
// 	var sUrl="./lib/Annotation/deleteAnno.php?id="+infoPopup.annoId+"&type=image&set="+obj.set;
// 	
// 	
// 	var callback = {
// 			success: function(o){
// 					box=o.argument.box;
// 					
// 					if (box.DOM.parentNode) {
// 						box.DOM.parentNode.removeChild(box.tempBox.DOM);
// 						box.DOM.parentNode.removeChild(box.DOM);
// 						
// 					}
// 			},
// 			failure: function(o){
// 				alert("Error connecting to database");
// 			},
// 			argument: {
// 				box: box
// 			}
// 		
// 		}
// 		
// 		var request = YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);
// },
// saveTextAnno:function(e,pass,args){
// 
// 	panelContent = args;
// 	pageText = pass[0][0];
// 	sel = pageText.annoInfo;
// 	anno = pass[0][1];
// 
// 
// 	var comment=anno.textInput.value;
// 	
// 	var startParent = sel.startNodeParent;
// 	var startCount = sel.startChildNum;
// 	var startOffset = sel.startOffset;
// 	
// 	var endParent = sel.endNodeParent;
// 	var endCount = sel.endChildNum;
// 	var endOffset = sel.endOffset;
// 
// 
// 	var docId = panelContent.docId;
// 	var prefix = panelContent.set+"_"+docId+"_"+panelContent.curPageNum+"_";
// 	var params='?type=text&text='+comment+'&doc='+docId+'&node1='+startParent.id+'&startCount='+startCount+'&node2='+endParent.id+'&endCount='+endCount+'&startValue='+startOffset+
// '&endValue='+endOffset+'&page='+panelContent.curPageNum+'&set='+panelContent.set;
// 		
// 		
// 		
// 		var sUrl = './lib/Annotation/saveAnno.php'+params;
// 	
// 		var callback = {
// 			success: function(o){
// 			
// 				o.argument.pageText.createTextAnno({id: o.responseText,endNode: o.argument.endNode, offset2: o.argument.offset2,node2: o.argument.node2,pageText: o.argument.pageText});
// 			},
// 			failure: function(o){
// 				alert("Error loading data.");
// 			}
// 			,
// 			argument: {node2: endParent.id, endNode: endCount, offset2: endOffset, pageText: pageText}
// 			
// 		}
// 		
// 		var request = YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);
// },
//-----------Annotation-----------------
createAnno:function(e,pass,args){
	//passed box variable to be attached to annotation object
	if(args.mode=="image"){
		if(args.openAnno){
			args.openAnno.destroy("",args.openAnno);
		}
		args.openAnno=new Annotation("image",pass[0]);
		pass[0].movedEvent.subscribe(args.openAnno.moveWithBox,{pc:args,anno:args.openAnno});
		pass[0].startMove.subscribe(args.openAnno.hideAnno,args.openAnno);
		args.openAnno.saveAnnoCall.subscribe(args.saveImageAnno,args);
		args.openAnno.annoClosed.subscribe(args.leaveAnno,args);
		args.image.handleAnno(args.openAnno,"add");
		
	}
},
changeOpacity:function(e,args){
	args.obj.limg.changeDarkness(args.value);
},
setUpAnno:function(obj,coords){
	if (obj.mode == "image") {
		if(document.getElementById(obj.cropButton.id)){
			obj.DOM.removeChild(obj.cropButton);
			obj.image.crop.unsubscribe(obj.getCropBox, obj);
		if(obj.cropBox){
				obj.image.cropDone(obj.cropBox, obj.image);
			}
		}
		
		obj.limg.initAnnoMode();
		//obj.image.initializeImageClick('anno', coords);
	}
	/*
else {
		obj.pageText.startAnno();
	}
*/

},
leaveAnno:function(e,pass,args){
	
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
});

var TMSContent = ArchiePanelContent.extend({
	init:function(args){
    	//call superclass
		this.$super(args);
		this.manifestArray=args.pages;
	    this.startzoom = args.zoom;
	    this.startcenter = args.center;
		this.startviews=args.views;
		
		this.panelid=args.panelId;
		this.xmlpath=args.xmlpath;
		this.panelWidth=args.width;
		this.panelHeight=args.height;
		//this.DOM.bind("layersChanged",{obj:this},this.changeLayersHandle);
	},
	changeWidth:function(hidden){
		if(hidden){
			this.limg.adjustResize(this.DOM.width(),this.DOM.height());
		} else {
			this.limg.adjustResize((this.DOM.width()-this.switcher.DOM.width()),this.DOM.height());
		}
	},
    startContent: function(){
		//create pageText element
		this.pageText=new ArchPageText({xmlpath:this.xmlpath,panelid:this.panelid});
		
		this.DOM.bind(this.pageText.onCleared,{obj:this},this.fillMap);
       	this.docId=this.manifestArray[this.curPageNum].manifest;
		$("body").bind("getTMSPages",{obj:this},this.getXMLData);
		//var doc=manDom.documentElement;
		this.pageName=this.manifestArray[this.curPageNum].pageName;
		//Populate pages array with image files	
		this.pages=[];
		var P=this.curPageNum;
		$.ajax({
			dataType:"xml",
			url:this.docId,
			async:false,
			success:function(xml){
				//using each statement to go through the individual pages
				var docs=$(xml).find("doc");
				var xmlpath=$(xml).find("pagetext").attr("xmluri");
				var auth=$(xml).find("auth").text();
				var layerargs=[];
				$(docs).each(function(d){
					var base=$(this).attr("base");
					var layers=$(this).children("layer");
					for(i=0;i<layers.length;i++){
						layerargs.push({name:$(layers[i]).text(),base:base});
					}
				});	
				
				var img={
					auth:auth,
					page:P,
					layers:layerargs,
					img:layerargs[0],
					xml:(xmlpath)?xmlpath:null
				};
				$("body").trigger("getTMSPages",[img]);
		
			}
			
		});
		
		this.setUpLayers();
    },
	getXMLData:function(e,img){
		var obj=e.data.obj;
		
		img.imgdir = IMGDIR;
		img.name = obj.pageName;
		obj.pages=img;
		$("body").unbind("getTMSPages",this.getXMLData);
	},
	setUpLayers:function(){
		//this.panelContentReady.fire(this.manifestArray);
		//set up width and height - if specified
		if(this.panelWidth&&this.panelHeight){
			this.DOM.height(this.panelHeight);
			this.DOM.width(this.panelWidth);
			this.panelWidth=null;
			this.panelHeight=null;
		}
		
		if (!this.switcher) {
			
			this.switcher = new OverlaySwitcher({
				panelid: this.panelid,
				data: this.pages,
				loc: this.DOM
			});
			$("body").bind(this.switcher.changeOverlay,{obj:this},this.changeLayerView);
			$("body").bind(this.switcher.changeLayerVisibility,{obj:this},this.changeLayerVisibility);
			$("body").bind(this.switcher.changeLayerOpacity,{obj:this},this.changeLayerOpacity);
		}
	
		//OLD: using startviews to add/remove new layers - keep user's order of layers active from page to page
		//this.startviews=this.pages.layers;
		
		if (!this.limg) {
			//create TMS Layer thisect
			
			this.limg = new TMSLayer({
				panelid: this.panelid,
				doc: this.docId,
				startzoom: this.startzoom,
				startcenter: this.startcenter,
				startviews: this.pages.layers,
				width:this.panelWidth,
				height:this.panelHeight
			}, this.DOM);
			this.DOM.bind(this.limg.onCleared,{obj:this},this.fillMap);
			//send off to ArchiePanel to create DropDown
			this.DOM.trigger(this.panelContentReady,[this.manifestArray]);
		}
		
		
		if (this.mode == "image") {
			this.pages.initset = 'default';
			this.pages.initlock = true;
			
			this.limg.setLayer(this.pages);
			this.switcher.reOrderLayers(this.limg.getOrder());
				
		}
		else if (this.mode == "text") {
				if (this.pages.xml&&(typeof(this.pages.xml)!=="undefined")) {
					var URI = this.xmlpath + "/" + this.pages.xml;
					this.pageText.fillPage(URI, this.docId, this.curPageNum, this.set);
				} else {
					this.pageText.displayBlankPage();
				}
			}
		
	},
	displayBlankPage:function(){
		alert('blank');
	},
	fillMap:function(e){
		var obj=e.data.obj;
		obj.docId=obj.manifestArray[obj.curPageNum].manifest;
		
		var manDom=$.ajax({
			dataType:"xml",
			async:false,
			url:obj.docId
		}).responseXML;
		
		if((!manDom)||(manDom=="undefined")) {
			obj.displayBlankPage();
			return;
		}
		
		var pageName=obj.manifestArray[obj.curPageNum].pageName;
		 
		if(obj.mode=="image"){
		//Populate pages array with image files	
			var layers=[];
			var xmlpath=$(manDom).find("pagetext").attr("xmluri");
			$(manDom).find("doc").each(function(){
				var base=$(this).attr('base');
				$(this).find("layer").each(function(){
					
					layers.push({name:$(this).text(),base:base});
				});
				 
			
			});
			
			obj.pages={
				layers:layers,
				imgdir:IMGDIR,
				page:obj.curPageNum,
				img:layers[0],
				name:pageName,
				xml:(xmlpath)?xmlpath:null
			};
		
			// obj.base=$(manDom).find("doc").attr("base");
			// 			
			// 			pagesArray=$(manDom).find("page");
			// 			for(p=0;p<pagesArray.length;p++){
			// 				if((pagesArray[p]!==null)){
			// 					imgpaths=$(pagesArray[p]).find("layer");
			// 					layers=[];
			// 					if (obj.startviews) {
			// 						obj.startviews=[];
			// 					}
			// 					for (l = 0; l < imgpaths.length; l++) {
			// 					
			// 						layer = $(imgpaths[l]).text();
			// 						layers.push({name:layer,base:""});
			// 					}
			// 				
			// 					var xmlpath=$(pagesArray[p]).find("pagetext").attr("xmluri");
			// 				
			// 					var img={
			// 						sv:obj.base,
			// 						layers:layers,
			// 						imgdir:IMGDIR,
			// 						img:layers[0],
			// 						page:p,
			// 						name:pageName,
			// 						xml:(xmlpath)?xmlpath:null
			// 					};
			// 					obj.pages=img;
			// 				}
			// }	
		} else if(obj.mode=="text") {
			//just get the xml path
			$(manDom).find("pagetext").attr("xmluri");
			var pageName=$(manDom).find("value").text();
			var c=0;
			pagesArray=$(manDom).find("doc").each(function(){
				//var xmlpath=$(pagesArray[p]).find("pagetext").attr("xmluri");
				
				var img={
					sv:$(this).attr('base'),
					page:c,
					name:pageName,
					xml:(xmlpath)?xmlpath:null
				};
				c++;
				obj.pages=img;
			});
			// for(p=0;p<pagesArray.length;p++){
			// 			if((pagesArray[p]!==null)){
			// 				
			// 
			// 				var xmlpath=$(pagesArray[p]).find("pagetext").attr("xmluri");
			// 
			// 				var img={
			// 					sv:obj.base,
			// 					page:p,
			// 					name:pageName,
			// 					xml:(xmlpath)?xmlpath:null
			// 				};
			// 				obj.pages=img;
			// 			}
			// 		}
		}		
		
		obj.setUpLayers();
	},
	close:function(){
		//programmatically empty out all HTML contents
		$("#"+this.DOM.attr("id")+".overlay_item").hide();
		setTimeout(function(obj){
			obj.remove();
		},1,this.limg.DOM);
		setTimeout(function(obj){
			obj.remove();
		},1,this.DOM);
		
	},
	changeLayerView:function(e,list){
		e.stopPropagation();
		var obj=e.data.obj;
	
		obj.limg.changeView(list);
		return false;
	},
	changeLayerVisibility:function(e,args){
		e.stopPropagation();
		var obj=e.data.obj;
		var layername=args.name;
		var nextlayername=args.nextname;
		var visible=args.visible;
		
		obj.limg.setVisibility(layername,nextlayername,visible);
		return false;
	},
	changeLayerOpacity:function(e,args){
		e.stopPropagation();
		var obj=e.data.obj;
		obj.limg.setLayerOpacity(args.name,args.nextname,args.val);
		return false;
	},
	changeTransparency:function(e){
		e.stopPropagation();
		var obj=e.data.obj;
		var more=e.data.more;
		switch(more){
			case true:
				obj.limg.lightenMap();
				break;
			case false:
				obj.limg.darkenMap();
				break;
		};
	},
    startImage: function(obj){
        obj.limg.init();
        obj.limg.cropBoxIsOpenPJSOL.subscribe(function(e, pass, args){
            args.cropBoxIsOpen.fire(pass[0]);
        }, obj);
        obj.applyAnnos();
    },
    adjustResize: function(obj, nWidth, nHeight, offsetH){
	
        var bodyHeight = (nHeight - offsetH);
		obj.DOM.width(nWidth);
		obj.DOM.height(bodyHeight);
		//obj.body.width("auto");
		obj.body.height(bodyHeight);
		if(obj.pageText){
			obj.pageText.DOM.width(nWidth);
			obj.pageText.DOM.height(bodyHeight);
		}
		if(obj.limg) obj.limg.adjustResize((obj.DOM.innerWidth()-obj.switcher.DOM.width()),obj.DOM.innerHeight());
    },
    getZoom: function(){
        return this.limg.map.getZoom();
    },
    getCenter: function(){
        var center = this.limg.map.getCenter();
        return [center.lon, center.lat];
    },
    zoomIn: function(e){
		e.stopPropagation();
		var obj=e.data.obj;
        obj.limg.zoom(1);
    },
    zoomOut: function(e){
		e.stopPropagation();
		var obj=e.data.obj;
        obj.limg.zoom(-1);
    },
	turnOnScroll:function(){
		this.limg.activateZoomScroll();
	},
	turnOffScroll:function(){
		this.limg.deactivateZoomScroll();
	},
    nextPage: function(){
        if (this.curPageNum < (this.manifestArray.length)) {
            this.curPageNum++;
            this.showPage();
        }
       
    },
    prevPage: function(e){
        if (this.curPageNum >= 0) {
            this.curPageNum--;
            this.showPage();
        }
        
    },
    changePage: function(e, pass, args){
        args.curPageNum = pass[0];
        args.showPage();
    },
    toggleMode: function(e, obj){
        if (obj.mode == "text") {
			//get sizes
			var width=obj.limg.DOM.innerWidth()+obj.switcher.DOM.innerWidth();
			var height=obj.limg.DOM.innerHeight();
            obj.limg.hide();
			obj.switcher.hide();
			obj.pageText.DOM.width(width);
			obj.pageText.DOM.height(height);
			obj.pageText.DOM.show();
            obj.showPage();
        }
        else {
            if (obj.mode == "image") {
                obj.limg.show();
				obj.switcher.show();
               	obj.pageText.DOM.hide();
				obj.showPage();
            }
        }
    },
    showPage: function(){
        if (this.curPageNum<(this.manifestArray.length)) {
            
            if (this.mode == "text") {
				this.pageText.clearArea();
               
            }
            else {
				//clear sidebar area
				this.switcher.clearLayerTags();
              	this.limg.clearMap();//tmslayer object will fire a call when it's 
              	//done clearing the map div
            }
        }
    },
    applyAnnos: function(){
        this.limg.applyAnnos(this.set, this.userOwnsSet);
    },
    callChangeAnnoSet: function(values, obj){
        obj.set = values.annoId;
        obj.setName = values.annoName;
        obj.userOwnsSet = values.priv;
        obj.applyAnnos();
    },
    setUpAnno: function(obj, coords){
        if (obj.mode == "image") {
            obj.limg.enterAnno(coords);
        }
    },
    setUpCrop: function(){
        if (this.mode == "image") {
            this.limg.enterCrop();
        }
    },
    leaveAnno: function(e, pass, args){
        args.resetClickMode.fire({
            id: args.panelid,
            mode: "none"
        });
    },
    leaveCrop: function(e, pass, args){
       
		args.resetClickMode.fire({
            id: args.panelid,
            mode: "none"
        });

    },
    stopListeners: function(){
        this.limg.stopListeners();
    }
});