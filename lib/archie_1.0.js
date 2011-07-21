//ARCHIE 1.0

//grantd


(function($){
	var ARCHIE=this;
	
	var ARCHIE_ENGINE=Monomyth.Class.extend({
		
	});
	/**
	 * Inherits functions from Panel.js
	 * 
	 * Uses Ajax call to ArchPanel.xml to create 
	 * the HTML
	 */

	//super constructor
	var Panel=Monomyth.Class.extend({
		init:function(args){
			//call xml file to create HTML
			this.options=args;
			this.bibInfo = args.bibInfo;
		    this.initWidth=args.width;
			this.initHeight=args.height;
		    this.project = (args.project) ? args.project : "default";
		    this.curPage = (args.readyPage) ? parseInt(args.readyPage) : 1;
			this.zoom=(args.zoom)?args.zoom:null;
			this.center=(args.center)?args.center:null;
			this.loc=args.desktop;
			//create initial DOM and append to the workspace
			this.DOM=$("<div class=\"panel\"></div>");
			this.loc.append(this.DOM);
			if (args.id) {
				this.DOM.attr("id",args.id);
			}
			else {
				this.DOM.attr("id",function(){
					arr=$(".panel").length;
					return "panel_"+arr;
				});	
			}
			this.panelReady="panelReady";
			this.panelClicked="panelClicked";
			this.resetHeader="resetHeader"+this.DOM.attr("id");
			this.closeSelf="closeSelf"+this.DOM.attr("id");
			this.setPanelAlert="setPanelAlert"+this.DOM.attr("id");
			this.DOM.bind("click",{obj:this},this.handleClick);
			var url=args.url+"?id="+this.DOM.attr("id")+"&title="+this.bibInfo;

			this.DOM.html($.ajax({
				dataType:"text",
				async:false,
				url:url
			}).responseText);
		},
		setContents:function(obj){
			//to be defined by inheriting classes
		},
		changeCursor:function(e,obj){
			//YAHOO.util.Dom.setStyle(obj.header, 'cursor', obj.headerGrab);
		},
		changeCursorBack:function(e,obj){
			//YAHOO.util.Dom.setStyle(obj.header,'cursor',obj.normalPoint);
		},
		makePanelResize:function(obj){
			//make sure window is placed below project bar
			//Jquery code for making a draggable, resizable panel
			$("body").bind("resized"+obj.DOM.attr("id"),{obj:obj},function(e,ui){
				var obj=e.data.obj;
				obj.headerOffsetAdjust();
			});
			obj.DOM.resizable({
				handles:'all',
				stop:function(e,ui){
					$(this).trigger("resized"+$(ui.helper).attr("id"),[ui]);
				}
			});
		/*
		obj.contentBody.bind("mouseover",{obj:obj},function(e){
				e.stopPropagation();
				var obj=e.data.obj;
				obj.DOM.draggable('disable');
				obj.DOM.resizable('enable');
				return false;
			});
			obj.contentBody.bind("mouseout",{obj:obj},function(e){
				e.stopPropagation();
				var obj=e.data.obj;
				obj.DOM.resizable('disable');
				obj.DOM.draggable('enable');
				return false;
			});
	*/
			//OLD: contained by parent DOM element - workspace
			//NEW: can go anywhere
			obj.DOM.draggable({
				handle:("#"+obj.quartoInfoDiv.attr("id")),
				// containment:'parent',
				iFrameFix:true

			});

			$(".ui-resizable-handle").css("z-index",9999);	
		},
		handleClick:function(e){
			e.stopPropagation();
			var obj=e.data.obj;
			obj.DOM.trigger(obj.panelClicked,[obj]);
			return false;
		},
		headerOffsetAdjust:function(){

			var panelHeight=(this.DOM.height())?this.DOM.innerHeight():490;
			var panelWidth=(this.DOM.width())?this.DOM.innerWidth():630;
			//find border offset, if any
			var border=parseInt(this.DOM.css("border"));

			this.DOM.height(panelHeight);
			this.DOM.width(panelWidth);
			var headerOffset = (this.header.height());

			this.content.adjustResize(this.content, panelWidth, panelHeight, (headerOffset+3));
		},
		changeTransparency:function(e, args){

			panel = args.panel;
			more = false;
			more = args.more;
			percent=panel.DOM.css("opacity");
			//percent = YAHOO.util.Dom.getStyle(panel.DOM,"opacity");
			if (more) {
				if (percent > .1) {
					percent = percent - .1;
				}
			}
			else {
				if (percent < 1) {

					percent = parseFloat(percent) + .1;
				}
			}
			//YAHOO.util.Dom.setStyle(panel.DOM,"filter","alpha(opacity="+percent*100+");");
			//YAHOO.util.Dom.setStyle(panel.DOM,"opacity",percent);

		},
		adjustContentSize:function(contentObj){


		}
	});


	/********************************
	 * ArchiePanel
	 *  A generic draggable Panel, composed of three parts:
	 *  header, content, and footer.
	 *	Extends Panel.js
	 * 
	 * Constructor Call for ArchiePanel
	 * 
	 * Note: calls extension of Panel.js
	 * 
	 * Objects:
	 * ArchiePanelContent, PageText, PanelButton
	 * ButtonGroup, DropDown, AnnotationSelect
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
	var ArchiePanel = Panel.extend({
		init:function(args){
			//call superclass
			this.$super(args);
			this.notifyDropDown="notifyDropDown"+this.DOM.attr("id");

			this.pages=args.pages;
			this.manifest=args.manifest;
			this.xmlpath=args.xmlpath;
		    this.documentId = null;
		    this.idarray = null;
		    this.pageText = null;
		    this.baseURI = "";
		    this.imagePrefix = "";
		    this.lastPage = 62;
		    this.mode = "image";
		    this.shapeType = "off";
		    this.curArea = null;
		    this.objects = new Array();
		    this.boxes = new Array();
		    this.areas = new Array();
		    this.properties = new Array();
		    this.disabled = false;
		    this.user = args.user;
		    this.userid = args.userid;
			this.menuType=args.menuType;
		    this.annoSet = "None Open";
		    this.clickMode = "none";
			this.setContents(this);
		},
	setContents:function(obj){
		$("#"+obj.loc.attr("id")).append(obj.DOM);
		obj.header=$("#"+obj.DOM.attr("id")+"_header");
		obj.quartoInfoDiv=$("#"+obj.DOM.attr("id")+"_quartoinfo");
		obj.controlsDiv=$("#"+obj.DOM.attr("id")+"_controls");
		obj.contentdiv=$("#"+obj.DOM.attr("id")+"_content");
		obj.contentBody=$("#"+obj.DOM.attr("id")+"_contentBody");
		obj.footer=$("#"+obj.DOM.attr("id")+"_footer");
		if(obj.initWidth&&obj.initHeight){
			obj.DOM.width(obj.initWidth);
			obj.DOM.height(obj.initHeight);
		}

		obj.content = new TMSContent({
			width:obj.DOM.innerWidth(),
			height:obj.DOM.innerHeight(),
			contentdiv:obj.contentBody,
			xmlpath:obj.xmlpath,
			pages:obj.pages,
	        num: obj.curPage - 1,
	        panelId: obj.DOM.attr("id"),
	        zoom: (obj.zoom) ? obj.zoom : null,
	        center: (obj.center) ? obj.center : null,
			views:null
	    });
		$("body").bind("layerSet",{obj:obj},function(e){
			var obj=e.data.obj;
			obj.headerOffsetAdjust();
		});
		obj.setPanelAlert="setPanelAlert"+obj.DOM.attr("id");
		obj.stopXML="stopXML"+obj.DOM.attr("id");
	  /*
	  obj.setPanelAlert = new YAHOO.util.CustomEvent("setPanelAlert");
	    obj.stopXML = new YAHOO.util.CustomEvent("stopXML");
	*/
		//if options present, set coords, width, height

		if(obj.options){
			var coords=obj.options.coords;
			var width=parseInt(obj.options.width);
			var height=parseInt(obj.options.height);
			if(coords){
				obj.DOM.css("left",coords[0]+'px');
				obj.DOM.css("top",coords[1]+'px');
				//YAHOO.util.Dom.setStyle(obj.DOM,'left',coords[0]+'px');
				//YAHOO.util.Dom.setStyle(obj.DOM,'top',coords[1]+'px');
			}
			if(width){
				obj.DOM.width(width);

			}
			if(height){
				obj.DOM.height(height);
				var contentheight=height-(obj.quartoInfoDiv.height()+obj.controlsDiv.height());

				//YAHOO.util.Dom.setStyle(obj.content.DOM,'height',contentheight+'px');
				obj.content.DOM.height(contentheight);
				obj.headerOffsetAdjust();

				//obj.content.adjustResize(obj.content,parseInt(YAHOO.util.Dom.getStyle(obj.DOM,'width')),height,22);
			} else {
				obj.content.DOM.height(400);
				obj.headerOffsetAdjust();
			}

		} else {
			obj.headerOffsetAdjust();
		} 

		obj.makePanelResize(obj);
		obj.content.startContent();
		obj.DOM.trigger(obj.panelReady,[obj]);
		obj.setHeader(obj);
		obj.makeDropDown(obj,obj.content.manifestArray);

		obj.DOM.bind("layersChanged",{obj:obj},obj.layersChangedHandle);
	},
	layersChangedHandle:function(e,hidden){
		var obj=e.data.obj;
		obj.content.changeWidth(hidden);
	},
	updateDropDown:function(e, pass, obj){
	    if (!(obj.dropDown.DOM.selectedIndex == pass[0])) {
	        obj.dropDown.DOM.selectedIndex = parseInt(pass[0]);
	    }
	},
	setBaseUri:function(uri, panel){
	    panel.baseURI = uri;
	},
	zoomToggle:function(e, args){
	    if ((args.zoom.DOM.style.display) == "none" && (!(args.mode == "text"))) {
	        args.zoom.appear(args.zoom);
	    }
	    else {
	        if (args.zoom.DOM.style.display == "block") {
	            args.zoom.disappear(args.zoom);
	        }
	    }
	},
	changeInfo:function(obj){
		obj.quartoInfo.text(obj.bibInfo);
	},
	close:function(e){
		e.stopPropagation();
	    var obj=e.data.obj;


		obj.content.close();
		//$("#"+obj.content.DOM.attr("id")).empty();
		setTimeout(function(obj){
			obj.remove();
		},1,obj.controlsDiv);
		setTimeout(function(obj){
			obj.remove();
		},1,obj.DOM);
		//obj.DOM.trigger(obj.closeSelf,[obj]);
		return false;
	},
	exitListeners:function(e, pass, args){
	    if (pass[0].id == args.DOM.id) {
			args.clickMode="none";
			args.content.stopListeners();
	    }
	},
	toolCall:function(mode){
	    switch (mode) {
	        case "annotation":
	           // obj.content.setUpAnno(obj.content, [YAHOO.util.Event.getPageX(e), YAHOO.util.Event.getPageY(e)]);
	            //obj.clickMode = "annotate";
	            ///obj.yResize.lock();
	            break;
	        case "crop":
	            this.content.setUpCrop();
	            break;
	        case "none":
	            this.clickMode = "none";
	            break;
	    }

	},

	changePage:function(e, n){
		e.stopPropagation();
		var obj=e.data.obj;
	   if (obj.content.curPageNum != n) {
		   	obj.curPage = n;
		   	obj.content.curPageNum = n;

			setTimeout(function(obj){
				obj.content.showPage();
			},10,obj);

	   }
		return false;
	},
	incrementPage:function(e){
		e.stopPropagation();
		var obj=e.data.obj;
		var val=e.data.val;
		switch(val){
			case 1:

				obj.content.nextPage();
				obj.dropDown.updateSelf(obj.content.curPageNum);
				break;
			case -1:

				obj.content.prevPage();
				obj.dropDown.updateSelf(obj.content.curPageNum);
				break;
		}


		return false;
	},
	setHeader:function(){
	    this.backToMenuB=$("#"+this.DOM.attr('id')+"home");
		this.backToMenuB.bind("click",{obj:this},function(e){
			e.preventDefault();
			var obj=e.data.obj;
			//close window
			obj.close(e);
			$(this).trigger("backtothemenu",[obj.menuType]);

		});
	    this.pageBack = $("#"+this.DOM.attr("id")+"_pageBack");
	    this.dropDownSpan = $("#"+this.DOM.attr("id")+"_dropDown");
	    this.pageNext = $("#"+this.DOM.attr("id")+"_pageNext");
		this.pageBack.bind('click',{obj:this,val:-1},this.incrementPage);
		this.pageNext.bind('click',{obj:this,val:1},this.incrementPage);
	    this.zoomInButton = $("#"+this.DOM.attr("id")+"_zoomIn");
	    this.zoomOutButton = $("#"+this.DOM.attr("id")+"_zoomOut");
		this.zoomInButton.bind("click",{obj:this.content},this.content.zoomIn);
		this.zoomOutButton.bind("click",{obj:this.content},this.content.zoomOut);
		this.toggleLayersButton=$("#"+this.DOM.attr("id")+"_layerDisplayToggle");
		this.toggleLayersButton.bind("click",{obj:this},function(e){
			e.preventDefault();
			var obj=e.data.obj;
			obj.DOM.trigger(("TLD"+obj.DOM.attr("id")));
			if(obj.toggleLayersButton.hasClass("hideSidebar")){
				obj.toggleLayersButton.removeClass("hideSidebar").addClass("showSidebar");
			} else {
				obj.toggleLayersButton.removeClass("showSidebar").addClass("hideSidebar");
			}
		});
	   	// this.darker = $("#"+this.DOM.attr("id")+"_darker");
	   	//    	this.lighter = $("#"+this.DOM.attr("id")+"_lighter");
	   	//      this.darker.bind("click",{obj:this.content,more:false},this.content.changeTransparency);
	   	//    this.lighter.bind("click",{obj:this.content,more:true},this.content.changeTransparency);
	    this.cropB=$("#"+this.DOM.attr("id")+"_crop");
		this.cropB.bind("click",{obj:this},function(e){
			var obj=e.data.obj;
			//start cropping process
			obj.content.setUpCrop();
		});
	    this.showImageButton = $("#"+this.DOM.attr("id")+"_showImage");
	    this.showTextButton = $("#"+this.DOM.attr("id")+"_showText");
		this.showImageButton.bind("click",{obj:this},function(e){
			e.stopPropagation();
			var obj=e.data.obj;
			 if (obj.content.mode == "text") {
	            obj.content.mode = "image";
	            obj.content.toggleMode(e, obj.content);
	            //obj.content.applyAnnos(e, [], obj.content);
	        }
		});
		this.showTextButton.bind("click",{obj:this},function(e){
			e.stopPropagation();
			var obj=e.data.obj;
			if ((obj.clickMode == "none") && (obj.content.mode == "image")) {
	            obj.content.mode = "text";
	            obj.content.toggleMode(e, obj.content);
	        }
		});

		this.closeButton = $("#"+this.DOM.attr("id")+'_close');
	   // this.header.appendChild(this.closeButton.DOM);
	  	this.closeButton.bind("click",{obj:this},this.close);
	},
	makeDropDown:function(obj, options){
	    var startSig = (obj.curPage - 1);

		obj.dropDown = new ArchDropDown({
			location: $("#"+obj.DOM.attr("id") + "_select"),
			options: options,
			start: startSig
		});
		//attach listener to body tag
		$("body").bind(obj.dropDown.dropDownChanged,{obj:obj},obj.changePage);


	    var panelHeight = obj.DOM.height();
	    var panelWidth = obj.DOM.width();
	    var headerOffset=obj.header.innerHeight();

		obj.content.DOM.bind("click",{obj:obj},obj.handleClick);
	}
	});
	
	ARCHIE.ARCHIE_ENGINE=ARCHIE_ENGINE;
	
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
	/**
	 * Switches between overlays, as in the OpenLayers.Layer 'Overlay' object class
	 * 
	 * HTML UL object that stores array of data about each view of a page
	 * 
	 */

	OverlaySwitcher=Monomyth.Class.extend({
		init:function(args){
		this.loc=args.loc;
		this.panelid=args.panelid;
		this.DOM=$("#"+this.panelid+"_overlaySwitcher");

		this.options=[];//array for storing data about each page
		this.data=args.data;
		this.list=$("#"+this.panelid+"_imgType1");

		this.listgroup="items";
		this.draggedStartPos=null;

		this.changeOverlay="changeOverlay"+this.panelid;
		this.changeLayerVisibility="changeLayerVisibility"+this.panelid;
		this.changeLayerOpacity="changeLayerOpacity"+this.panelid;
		this.changeItemOrder="changeItemOrder"+this.panelid;


		this.handleAvailable();
		//YAHOO.util.Event.onAvailable(this.DOM.id,this.handleAvailable,this);
	},
		OrderLayers:function(layers){

			//do it backwards
			for(l=(layers.length-1);l>-1;l--){

				var item = new OverlayItem({
					name: (layers[l].name)?layers[l].name:layers[l],
					order: l,
					displayorder: 0,
					isVisible: true,
					displayopacity: 10,
					loc: this.list
				});
				this.options[item.DOM.attr("id")] = item;
				this.DOM.bind(item.changeVisibility, {
					obj: this
				}, this.handleVisibility);
				this.DOM.bind(item.sendOpacValue, {
					obj: this
				}, this.handleOpacity);
			}
		},
		reOrderLayers:function(layers){
			//erase existing li elements
			this.list.empty();
			//unbind elements from DOM
			this.DOM.unbind();
			this.options=[];
			this.OrderLayers(layers);
		},
		handleAvailable:function(){
			if (this.data) {
				//bind layer display
				$("body").bind(("TLD"+this.panelid),{obj:this},this.toggle);

				//bind changeorder
				$("body").bind('changeOrder'+this.DOM.children("ul").attr("id"),{obj:this},this.changeOrder);

				//make the entire UL into a sortable list
				//with JQuery
				/**
				 * Contains a lot of options
				 * items: specifies what elements can be dragged

				 * forceHelperSize: forces fixed w&h for helper element
				 * 
				 */
				this.list.sortable({
					handle:'span.overlay_item_handle',
					items:'li',
					scroll:true,
					stop:function(e,ui){
						if ($(ui.item)) {
							var triggah = "changeOrder" + $(ui.item).parent().attr("id");

							$(this).trigger(triggah, [ui]);
						}
					}
				});
			}
		},
		toggle:function(e){
			var obj=e.data.obj;
			if(obj.DOM.hasClass("hidden")){
				obj.show();
				obj.DOM.trigger("layersChanged",[false]);
			} else {
				obj.hide();
				obj.DOM.trigger("layersChanged",[true]);
			}
		},	
		hide:function(){
			this.DOM.addClass("hidden");
			//YAHOO.util.Dom.setStyle(this.DOM,'display','none');
		},
		show:function(e){
			this.DOM.removeClass("hidden");
			//YAHOO.util.Dom.setStyle(this.DOM,'display','block');
		},
		turnOffHandlers:function(e){
			//called by deactivate
			e.stopPropagation();
			var obj=e.data.obj;
			obj.list.sortable('disable');
			return false;
		},
		createSortable:function(e){
			//called by activate
			e.stopPropagation();
			var obj=e.data.obj;
			obj.list.sortable('enable');
			return false;

		},
		handleVisibility:function(e,args){
			e.stopPropagation();
			var obj=e.data.obj;
			var item=args.item;
			var layername=obj.options[item.DOM.attr("id")].name;
			var nextlayer=obj.options[item.DOM.next().attr("id")];
			var visible=item.isVisible;
			while(!nextlayer.isVisible){
				nextlayer=obj.options[nextlayer.DOM.next().attr("id")];
			}
			if (layername) {
				obj.DOM.trigger(obj.changeLayerVisibility,[{name:layername,nextname:nextlayer.name,visible:visible}]);
			}
			return false;
		},
		handleOpacity:function(e,args){
			e.stopPropagation();
			var obj=e.data.obj;
			var val=args.val;
			var layername=args.name;
			var nextlayername=(args.item.DOM.next())?obj.options[args.item.DOM.next().attr("id")].name:null;
			obj.DOM.trigger(obj.changeLayerOpacity,[{val:val,name:layername,nextname:nextlayername}]);
			return false;
		},
		setStartTop:function(e,ui){
			e.stopPropagation();
			//set the initial top value of the item that is being dragged
			var obj=e.data.obj;
			obj.draggedStartPos=$(ui.item).position().top;
			return false;
		},
		changeOrder:function(e,ui){
			e.stopPropagation();
			var obj=e.data.obj;
			//figure if element moved up or down
			// var curTop=$(ui.item).position().top;
			// 	var pastTop=$(ui.placeholder).position().top;
			// 	var itemmove=obj.options[$(ui.item).attr("id")];
			//gets the new order of items in the sortable list
			var itemorder=obj.list.sortable('toArray');
			var nameditemorder=[];
			for(i=(itemorder.length-1);i>=0;i--){
				var item=obj.options[$("#"+itemorder[i]).attr("id")];
				nameditemorder.push(item.name);
			}

			obj.list.trigger(obj.changeOverlay,[nameditemorder]);

			// if(curTop>pastTop){
			// 			//moved downward
			// 			var itemstatic=obj.options[$(ui.item).prev().attr("id")];
			// 	
			// 			itemmove.displayorder=itemstatic.displayorder;
			// 			itemstatic.displayorder=itemmove.displayorder-1;
			// 			itemstatic.order=itemmove.order-1;
			// 			itemstatic.isVisible=true;
			// 			itemmove.isVisible=true;
			// 			//itemmove.resetDisplay();
			// 			//itemstatic.resetDisplay();
			// 			obj.list.trigger(obj.changeOverlay,[{uplayer:itemmove.name,upvalue:itemmove.order,downlayer:itemstatic.name,downvalue:itemstatic.order}]);
			// 		
			// 		}else if(curTop<pastTop){
			// 			//moving upward
			// 		
			// 			var itemstatic=obj.options[$(ui.item).next().attr("id")];
			// 				alert('overlay says: itemstatic: '+itemstatic.name+", itemmove: "+itemmove.name); //for testing
			// 			itemmove.displayorder=itemstatic.displayorder;
			// 			itemstatic.order=itemmove.order-1;
			// 			itemstatic.displayorder=itemmove.displayorder+1;
			// 			itemstatic.isVisible=true;
			// 			itemmove.isVisible=true;
			// 			//itemmove.resetDisplay();
			// 			//itemstatic.resetDisplay();
			// 			obj.list.trigger(obj.changeOverlay,[{uplayer:itemmove.name,upvalue:itemmove.order,downlayer:itemstatic.name,downvalue:itemstatic.order}]);
			// 		
			// 		}

			return false;
		},
		clearLayerTags:function(){
			for(t in this.options){
				this.options[t].destroy();
			}
		}

	});

	OverlayItem=Monomyth.Class.extend({
		init:function(args){
		this.loc=args.loc;
		this.DOM=$("<li></li>");
		this.loc.append(this.DOM);
		this.DOM.attr("id","ovitem"+$(".overlay_item").length);

		this.DOM.addClass("overlay_item");

		this.handle=$("<span></span>");
		this.DOM.append(this.handle);
		this.handle.attr("id","han"+args.order);
		this.handle.addClass("overlay_item_handle");

		this.textwrap=$("<a></a>");
		this.textwrap.attr("id","tw"+args.order);

		this.textwrap.addClass("ovitem_textwrap");
		this.textwrap.text("On "+args.name);
		this.DOM.append(this.textwrap);
		this.opacUp=$("<span></span>");
		this.DOM.append(this.opacUp);
		this.opacUp.attr("id","oc"+args.order);
		this.opacUp.addClass("opacUpWrap");


		this.opacUpButton=$("<img src=\"./lib/OverlaySwitcher/assets/images/icon_opacPlus.gif\"></img>");
		this.opacUp.append(this.opacUpButton);
		this.opacUpButton.attr("id","opcd"+args.order);


		this.opacDown=$("<span></span>");
		this.DOM.append(this.opacDown);
		this.opacDown.attr("id","oc"+args.order);
		this.opacDown.addClass("opacDownWrap");

		this.opacDownButton=$("<img src=\"./lib/OverlaySwitcher/assets/images/icon_opacMinus.gif\"></img>");
		this.opacDown.append(this.opacDownButton);
		this.opacDownButton.attr("id","opcd"+args.order);
		this.opacityDisplay=$("<a></a>");
		this.DOM.append(this.opacityDisplay);
		this.opacityDisplay.attr("id","opacdisplay"+args.order);
		this.opacityDisplay.addClass("opacNum");

		this.name=args.name;
		this.isVisible=args.isVisible;
		this.order=args.order;//number for z-index in OpenLayers Map
		this.displayorder=args.displayorder;
		this.displayopacity=args.displayopacity;

		this.opacDown.append(this.opacDownButton);
		this.opacityDisplay.text(this.displayopacity);

		this.ready="ready"+this.DOM.attr("id");
		this.change="change"+this.DOM.attr("id");
		this.changeVisibility="changeVisibility"+this.DOM.attr("id");
		this.sendOpacValue="sendopacvalue"+this.DOM.attr("id");

		this.groupname="items";

		this.textwrap.bind("click",{obj:this},this.notifyHide);
		this.opacUp.bind("click",{obj:this,val:1},this.notifyOpac);
		this.opacDown.bind("click",{obj:this,val:-1},this.notifyOpac);

	},
		selectItem:function(e,obj){
			obj.change.fire(obj.name);
		},
		notifyOpac:function(e){
			e.stopPropagation();
			var obj=e.data.obj;
			var val=e.data.val;
			if(val>0){
				if(parseInt(obj.displayopacity)<10){
					var opacvalue=parseInt(obj.displayopacity)+1;

					obj.displayopacity=""+opacvalue;
					//obj.displayopacity=(typeof(obj.displayopacity)=="string")?obj.displayopacity.substring(0,3):obj.displayopacity.toPrecision(1);

					//obj.opacityDisplay.removeChild(obj.opacityDisplay.firstChild);
					obj.opacityDisplay.text(obj.displayopacity);
					obj.DOM.trigger(obj.sendOpacValue,[{val:val,name:obj.name,item:obj}]);
					//obj.sendOpacValue.fire({val:val,name:obj.name,item:obj});
				}
			} else {
				if(parseInt(obj.displayopacity)>1){
					var opacvalue=parseInt(obj.displayopacity)-1;
					obj.displayopacity=""+opacvalue;
					//obj.displayopacity=(typeof(obj.displayopacity)=="string")?obj.displayopacity.substring(0,3):obj.displayopacity.toPrecision(1);
					obj.opacityDisplay.text(obj.displayopacity);

					obj.DOM.trigger(obj.sendOpacValue,[{val:val,name:obj.name,item:obj}]);
					//obj.sendOpacValue.fire({val:val,name:obj.name,item:obj});
				}
			}
			return false;
		},
		nodeInsertNotice:function(e,pass,args){
			//passed array of upper and lower dom elements
			var upper=pass[0].upper;
			var lower=pass[0].lower;
			if(!(upper.id==lower.id)){
				//args.change.fire({upper:upper,lower:lower});
			}
		},
		resetDisplay:function(){
			this.textwrap.empty();
			txt=""+this.name;
			this.textwrap.text(txt);
			//if set to invisible, set back to visible
			if (!this.isVisible) {
				this.DOM.trigger(this.changeVisibility,[{item:this,visible:true}]);
			}
		},
		changeSelfOrder:function(e){
			var obj=e.data.obj;
			var num=pass[0].num;
			var move=pass[0].move;
			var name=pass[0].name;
			var dname=pass[0].dname;
			if(move=="up"){
				if((args.order<=num)&&(!(args.name==name))&&(!(args.name==dname))){
					var o=args.order;
					args.order=args.order-(num-args.order);
					if(args.textwrap.firstChild){
						while(args.textwrap.firstChild){
							args.textwrap.removeChild(args.textwrap.firstChild);
						}
					}
					args.displayorder=((num-o)>=o)?args.displayorder+(num-o):args.displayorder;
					txt=""+args.name;
					args.textwrap.appendChild(document.createTextNode(txt));
				}
			}else if(move=="down"){
				if((args.order>=num)&&(!(args.name==name))&&(!(args.name==dname))){
					var o=args.order;
					args.order=args.order+(args.order-num);
					if(args.textwrap.firstChild){
						while(args.textwrap.firstChild){
							args.DOM.removeChild(args.textwrap.firstChild);
						}
					}
					args.displayorder=((o-num)>=0)?args.displayorder-(o-num):args.displayorder;
					txt=""+args.name;
					args.textwrap.appendChild(document.createTextNode(txt));
				}
			}
		},
		notifyHide:function(e){
			//change object appearance
			var obj=e.data.obj;
			if(obj.textwrap.hasClass("overlayitem_checked")){
				//if classname is 'overlayitem_checked', change back to normal
				obj.textwrap.removeClass("overlayitem_checked");
				obj.textwrap.addClass("ovitem_textwrap");
				obj.textwrap.empty();
				obj.isVisible=true;
				txt="On "+obj.name;
				obj.textwrap.text(txt);
			} else {
				//else, change to 'hidden' mode
				obj.textwrap.toggleClass("ovitem_textwrap");
				obj.textwrap.addClass("overlayitem_checked");
				obj.textwrap.empty();
				obj.isVisible=false;
				txt="Off "+obj.name;
				obj.textwrap.text(txt);
			}
			obj.DOM.trigger(obj.changeVisibility,[{item:obj,visible:obj.textwrap.hasClass("ovitem_textwrap")}]);
		},
		destroy:function(){
			this.DOM.remove();

		}
	});
	
	/*
	 * PageText.js
	 * 
	 * 
	 * Create div for holding 
	 * text streamed in from XML 
	 * 
	 * Separates XML text into separate
	 * Divs (leaf, page1, page2,...)
	*/

	var PageText=Monomyth.Class.extend({
		init:function(args){
			this.panelid=args.panelid;
			this.DOM=$("#"+this.panelid+"_pagetext");

			this.DOM.css("display","none");
			//YAHOO.util.Dom.setStyle(this.DOM,'display','none');


			this.vLoaded = false;
			this.rLoaded = false;

			this.writing = false;
			this.docId = "097";
			this.set=null;
			this.page = 0;
			this.clearText="clearText"+this.panelid;
			this.retrieveHTML="retrieveHTML"+this.panelid;
			this.storeTextAnno="storeTextAnno"+this.panelid;
			this.pageLoaded="pageLoaded"+this.panelid;
			//this.pageLoaded.subscribe(this.handlePagesLoaded,this);
			/*
		this.clearText=new YAHOO.util.CustomEvent("clearText");
			this.retrieveHTML=new YAHOO.util.CustomEvent("retrieveHTML");
			this.storeTextAnno=new YAHOO.util.CustomEvent("storeTextAnno");
			this.pageLoaded=new YAHOO.util.CustomEvent("pageLoaded");
			this.pageLoaded.subscribe(this.handlePagesLoaded,this);
		*/
			this.annoMode = 0 // 0 = none , 1 = start, 2 = stop
			this.annoInfo = {
				startNodeParent: null,
				startChildNum: null,
				startNodeOffset: null,
				endNodeParent: null,
				endChildNum: null,
				endNodeOffset: null,
			};	
			this.annoBar = null;
			this.DOM.bind("click",{obj:this},this.clearNotes);

			//YAHOO.util.Event.addListener(this.DOM.id, "click", this.clearNotes, this);
			//YAHOO.util.Event.addListener(this.DOM.id, "mouseup", this.alertSelect, this);
			//YAHOO.util.Event.addListener(this.DOM.id, "dblclick", this.alertSelect, this);
		}, 
		loadXML:function(fname){
			      var xmlDoc;
		        // code for IE
		        if (window.ActiveXObject) {
					xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
				}
				// code for Mozilla, Firefox, Opera, etc.
				else {
					if (document.implementation &&
					document.implementation.createDocument) {

						xmlDoc = document.implementation.createDocument("", "", null);
					}
					else {
						alert('Your browser cannot handle this script');
					}
				}	
		        xmlDoc.async = false;

		        xmlDoc.load(fname);
				return xmlDoc;

		},
		retrieveContent:function(uri,target){
			XSLURI = "./quartos.xsl";

			xml = this.loadXML(uri);

			xsl = this.loadXML(XSLURI);

			if (window.ActiveXObject)
		  {
		    ex=xml.transformNode(xsl);

		   target.innerHTML = ex;
		  }
		  // code for Mozilla, Firefox, Opera, etc.
		  else if (document.implementation
		  && document.implementation.createDocument)
		  {
		    xsltProcessor=new XSLTProcessor();
		    xsltProcessor.importStylesheet(xsl);


		    resultDocument = xsltProcessor.transformToFragment(xml,document);
					var string = (new XMLSerializer()).serializeToString(resultDocument);



		target.innerHTML = string;

		  }

		  this.pageLoaded.fire(target);
		/*	var callback={
				success: function(o){
					tar = o.argument.target;




					tar.innerHTML = o.responseText;
						o.argument.pageText.pageLoaded.fire(tar);

				},
				failure: function(o){

				},
				argument: {
					target: target, pageText: this

				}
			};

			YAHOO.util.Connect.asyncRequest('GET', uri, callback);
			*/

		},

		handlePagesLoaded:function(e,pass,args){
			pageText = args;

			if (pass[0].className=="recto"){
				if (pageText.vLoaded) {
					pageText.setUpPage();
				}
				else {
					pageText.rLoaded = true;
				}
			}
			else{
				if (pageText.rLoaded) {
					pageText.setUpPage();
				}
				else{
					pageText.vLoaded=true;
				}

			}

		},
		fillPage:function(v,r,docId,curPage,set){
			this.docId = docId;
			this.page = curPage;
			this.set = set;	
			this.retrieveContent(v,this.verso);
			this.retrieveContent(r,this.recto);
		}
	});

	/**
	 * Inherits methods and properties from:
	 * PageText.js
	 */

	var ArchPageText=PageText.extend({
		init:function(args){
			//call superclass
			this.$super(args);
			this.xmlpath=args.xmlpath;
			this.xsluri="./archie.xsl";
			this.cururi=null;
			this.onCleared="onCleared"+this.panelid;
			this.pageLoaded="pageLoaded"+this.panelid;
		},
		fillPage:function(uri,docId,curPage,set){
			this.cururi=uri;
			this.xmlpath = docId;
			this.page = curPage;
			this.set = set;
			this.retrieveContent(this.cururi);
			this.alreadyLoaded=true;
		},
		retrieveContent:function(uri){
			var url="./lib/ArchPageText/retrieveContentScript.php?xmluri=../../"+uri+"&xsluri=../../"+this.xsluri;
			this.DOM.html($.ajax({
				url:url,
				async:false,
				dataType:"text"
			}).responseText);
		},
		retrieveContentJS:function(uri){
			var xml=this.loadXML(uri);
			var xsl=this.loadXML(this.xsluri);
			if (window.ActiveXObject){
		    	var ex=xml.transformNode(xsl);
		   		this.DOM.html(ex);
		  	}
		  // code for Mozilla, Firefox, Opera, etc.
		  else if (document.implementation
		  	&& document.implementation.createDocument){
		    	var xsltProcessor=new XSLTProcessor();
		    	xsltProcessor.importStylesheet(xsl);
		    	resultDocument = xsltProcessor.transformToFragment(xml,document);
				var string = (new XMLSerializer()).serializeToString(resultDocument);	
				this.DOM.html(string);
		 	}

		  this.DOM.trigger(this.pageLoaded,[this.DOM]);
		},
		clearArea:function(){
			this.DOM.empty();

			this.DOM.trigger(this.onCleared);
		},
		displayBlankPage:function(){
			this.DOM.html($("<div>Sorry, no transcript available.</div>"));
		}
	});

	OverMap=Monomyth.Class.extend({
		init:function(args){
			this.panelid=args.panelid;
			this.DOM=$("#"+this.panelid+"_ocontrol");
			this.image=$("#"+this.panelid+"_ocontrolimg");
			this.imageurl=args.imageurl;
			this.mapwidth=args.mapwidth;
			this.mapheight=args.mapheight;
			this.rect=$("<div></div>");
			this.DOM.append(this.rect);
			this.DOM.attr("id",function(arr){return "rect"+arr;});
			//YAHOO.util.Dom.generateId(this.rect,"rect");
			this.rect.addClass("ocontrol_boundingbox");
			//listeners
			this.boxMoved="boxMoved"+this.panelid;
			this.DOM.bind("click",{obj:this},this.handleClick);
			this.handleRectAvailable(this);
		},
		handleRectAvailable:function(obj){
			/*
	obj.rectDrag=new YAHOO.util.DD(obj.rect.id);
			obj.rectDrag.on("dragEvent",function(e,obj){
				YAHOO.util.Event.stopPropagation(e);
				var x=parseInt(YAHOO.util.Dom.getStyle(obj.rect.id,'left'));
				var y=parseInt(YAHOO.util.Dom.getStyle(obj.rect.id,'top'));
				var mapx=(x*obj.mapwidth)/parseInt(YAHOO.util.Dom.getStyle(obj.DOM.id,'width'));
				var mapy=(y*obj.mapheight)/parseInt(YAHOO.util.Dom.getStyle(obj.DOM.id,'height'));
				obj.boxMoved.fire([mapx,mapy]);
			},obj);
	*/
		},
		handleClick:function(e,obj){
			e.stopPropagation();
			//YAHOO.util.Event.stopPropagation(e);
		},
		setDimensions:function(e,pass,args){
			args.mapwidth=pass[0].width;
			args.mapheight=pass[0].height;
		},
		setBoxLoc:function(e,pass){
			var obj=e.data.obj;
			var x=pass[0].xy.x;
			var y=pass[0].xy.y;
			args.mapwidth=pass[0].mapw;
			args.mapheight=pass[0].maph;//alert(x+', '+y);
			if (x && y) {
				var ovx=(x*obj.DOM.width());
				var ovy=(y*obj.DOM.height());
				obj.rect.left(ovx);
				obj.rect.top(ovy);
				//var ovx = (x * parseInt(YAHOO.util.Dom.getStyle(args.DOM.id, 'width'))) / args.mapwidth;
				//var ovy = (y * parseInt(YAHOO.util.Dom.getStyle(args.DOM.id, 'height'))) / args.mapheight;
				//YAHOO.util.Dom.setStyle(args.rect.id, 'left', ovx + 'px');
				//YAHOO.util.Dom.setStyle(args.rect.id, 'top', ovy + 'px');
				//alert('setboxloc xy: '+x+', '+y+' oxy: ' + ovx + ', ' + ovy+' map dims: '+args.mapwidth+', '+args.mapheight);
			}
		}
	});
	/**
	 * Inherits from OverMap.js
	 * 
	 */

	ArchOverMap=OverMap.extend({
		init:function(args){
		this.$super(args);
		this.imageurl=args.url;

	},
		loadImage:function(obj){

		},
		setImageUrl:function(url){
			this.imageurl=url+"/0/0/0.png";
			this.image.src=this.imageurl;
		}
	});
	//extendOS(ArchOverMap,OverMap);

	var StateMgr = Monomyth.Class.extend({
		init:function(){
	    	this.uid = null;
		    this.stateCheckPath = "./lib/StateMgr/sessionWindowMgr.php";
		    this.project = null;
		   /*
		 this.stateReady = new YAHOO.util.CustomEvent("stateReady");
			this.sizeReady=new YAHOO.util.CustomEvent("sizeReady");
		    this.reset = new YAHOO.util.CustomEvent("reset");
	*/
		},
		setItem:function(obj, type, item){
	    	var params = "";
		    switch (type) {
		        case "win":
		            var page = (item.content.curPageNum == 0) ? 1 : (item.content.curPageNum + 1);
		            var zoom = item.content.getZoom();
		            var center = item.content.limg.map.getCenter();
		            var x=item.left();
					var y=item.top();
					//var ieuser = (YAHOO.util.Dom.getStyle(item.DOM,'left'));

					params += "&type=win&id=" + item.DOM.id + "&bibInfo="+ item.bibInfo + "&manifest=" + item.manifest + "&x=" + x + "&y=" + y + "&width=" + parseInt(YAHOO.util.Dom.getStyle(item.DOM, "width")) + "&height=" + parseInt(YAHOO.util.Dom.getStyle(item.DOM, "height")) + "&page=" + page + "&project=" + item.project + "&zoom=" + zoom + "&center=" + center.lon + "," + center.lat;

					break;
		        case "crop":
		            item.saveCrop(null, item);
		            params += "&" + item.sParams + "&type=crop";
		            break;
		        case "label":
		            item.keepChange(null, item);
		            params += item.sParams + "&type=label";
		            break;
		    }
		    var sUrl = obj.stateCheckPath + "?mode=set" + params;
			$.ajax({
				dataType:"text",
				async:true,
				url:sUrl
			});
		},
		removeItem:function(type, item){
		    var sUrl = "";
		    switch (type) {
		        case "win":
		            sUrl = this.stateCheckPath + "?mode=remove&type=win&id=" + item.DOM.id;
		            break;
		        case "crop":
		            sUrl = this.stateCheckPath + "?mode=remove&type=crop&id=" + item.DOM.id;
		            break;
		        case "label":
		            sUrl = this.stateCheckPath + "?mode=remove&type=label&id=" + item.DOM.id;
		    }
			$.ajax({
				dataType:"text",
				url:sUrl,
				async:true
			});

		},
		eraseState:function(obj){
		    var sUrl = "./lib/StateMgr/sessionWindowMgr.php?mode=reset";
			$.ajax({
				url:sUrl,
				async:true
			});

		},
		rememberSize:function(width,height){
			var sUrl="./lib/StateMgr/rememberSize.php?width="+width+"&height="+height;
			$.ajax({url:sUrl,dataType:"text",async:true});

		},
		checkSize:function(){
			var sUrl='./lib/StateMgr/checkSize.php';
			var rtext=$.ajax({
				dataType:"text",
				async:false,
				url:sUrl
			}).responseText;
			return rtext;
		}
	});
	
	/**
	 * ArchieLightbox
	 * 
	 * Displays warnings generated by various objects
	 * 
	 * Custom Events:
	 * displayWarning: 
	 * 	-display a message to the user in a light box
	 * 	-pass[0] is String Object text
	 * 
	 * Functions:
	 * close: 
	 * 	-Closes box once it is open
	 */


	 ArchieLightbox=Monomyth.Class.extend({
		init:function(loc){
		this.DOM=$("<div></div>");
		loc.append(this.DOM);
		this.DOM.attr("id",function(arr){
			return "ho"+arr;
		});


		this.backarea=$("<div></div>");
		this.DOM.append(this.backarea);
		this.backarea.attr("id",function(arr){
			return "dark"+arr;
		});
		this.backarea.addClass("dark");
		this.light=$("<div></div>");
		this.DOM.append(this.light);
		this.light.attr("id",function(arr){
			return "light" + arr;
		});
		this.light.addClass("light");
		this.closeButton=$("<span></span>");
		this.light.append(this.closeButton);
		this.closeButton.attr("id",function(arr){
			return "close"+arr;
		});
		this.closeButton.addClass("window_close");
		this.closeButton.text("Close");
		this.closeButton.bind("click",{obj:this},this.close);

		this.messagearea=$("<div></div>");
		this.light.append(this.messagearea);
		this.messagearea.attr("id",function(arr){
			return "ma"+arr;
		});
		this.messagearea.addClass("messagearea");


		this.message="";
		//this.displayWarning=YAHOO.util.CustomEvent("displayWarning");
		this.DOM.css("display","none");


		//YAHOO.util.Dom.setStyle(this.backarea,'display','none');
	 },

	 	close:function(e){
			var obj=e.data.obj;
			obj.DOM.css('display','none');
			//YAHOO.util.Dom.setStyle(obj.DOM,'display','none');
			//YAHOO.util.Dom.setStyle(this.backarea,'display','none');
		},
		setMessage:function(txt){
			this.message=txt;
			this.messagearea.empty();
			/*
	if(this.messagearea.firstChild){
				while(this.messagearea.firstChild){
					this.messagearea.removeChild(this.messagearea.firstChild);
				}
			}
	*/
			this.messagearea.text(this.message);
		},
		showBrowserWarning:function(){
			this.messagearea.empty();
			/*
	if(this.messagearea.firstChild){
				while(this.messagearea.firstChild){
					this.messagearea.removeChild(this.messagearea.firstChild);
				}
			}
	*/
			this.messagearea.text("Please note that this program works best on Mozilla Firefox 3.5 Internet Browser. If using another browser, most features may not show up or may not work properly.<br/><br/>Check for the most current release of Mozilla Firefox: ");

			el=$("<a href=\"http://www.mozilla.com/\">Here</a>");
			this.messagearea.append(el);
			this.DOM.css('display','block');

		}
	 });
	
	/***
	 * Creates a "New Panel" window for the
	 * Archimedes interface
	 * 
	 * Explains what the interface is and then goes to one of 
	 * three other windows
	 */

	 ArchSelect=Monomyth.Class.extend({
		init:function(args){
	 	this.setContents();

	 	//browse works
		this.bWorks=new bWorks({manifest:args.workmanifest});
		$("body").bind("bworkclosed",{obj:this},function(e){
			var obj=e.data.obj;
			obj.DOM.show();
		});
		$("body").bind("titleClicked",{obj:this},this.openNewPanel);
		$("body").bind("backtothemenu",{obj:this},this.backMenuHandle);
	 },
	 	setContents:function(){
			this.DOM=$("#archselect_dom");
			this.closebutton=$("#archselect_close");
			this.browseWorks=$("#archselect_bwork");
			this.browseOver=$("#archselect_bover");
			this.browseUnder=$("#archselect_bunder");
			//bind listeners
			this.closebutton.bind('click',{obj:this},this.close);
			this.browseWorks.bind('click',{obj:this},this.openWorksWin);
			this.browseOver.bind('click',{obj:this},this.openBrowseOver);
		 	this.browseUnder.bind('click',{obj:this},this.openBrowseUnder);
			this.open=true;
		},
		display:function(){
			this.DOM.show("slow");
			this.open=true;
		},
	 	close:function(e){
			e.data.obj.DOM.hide();
			e.data.obj.open=false;
			//YAHOO.util.Dom.setStyle(obj.DOM,'display','none');
		},
		openWorksWin:function(e){
			e.stopPropagation();
			var obj=e.data.obj;
			if (obj.DOM.css("z-index") < 1000) {
				obj.DOM.css("z-index", 1000);
				obj.bWorks.DOM.css("z-index", 1000);
			}
			obj.DOM.hide("slow",function(){
				obj.bWorks.DOM.show("slow");
			});
			obj.bWorks.resetDisplay();

			return false;
		},
		openNewPanel:function(e,args){
			if(e.isPropagationStopped()) return false;
			e.stopPropagation();
			var obj=e.data.obj;
			obj.DOM.hide();
			obj.open=false;
			obj.DOM.trigger("setManifest",[args]);
			return false;
		},
		openBrowseOver:function(e){
			if(e.isPropagationStopped()) return false;
			e.stopPropagation();
			var obj=e.data.obj;
			obj.DOM.hide();
			obj.open=false;
			var args={type:'prayerbook',manifest:'./manifest/prayerbook.xml',part:"Prayer Book"};

			obj.DOM.trigger("setManifest",[args]);
			return false;

		},
		openBrowseUnder:function(e,obj){
			if(e.isPropagationStopped()) return false;
			e.stopPropagation();
			var obj=e.data.obj;
			obj.DOM.hide();
			obj.open=false;
			obj.DOM.trigger("setManifest",[{type:'undertext',manifest:'./manifest/undertext.xml',part:"Undertext"}])
			return false;
		},
		backMenuHandle:function(e,t){
			var obj=e.data.obj;
			switch(t){
				case 'w':
					obj.DOM.hide();
					obj.bWorks.DOM.show("slow");
					obj.bWorks.resetDisplay();
					obj.open=true;
					break;
				case 'm':
					obj.DOM.show("slow");
					obj.bWorks.DOM.hide();
					obj.open=true;
					break;
				case 'c':
					obj.DOM.hide();
					obj.bWorks.DOM.hide();
					obj.open=false;
			}
		}
	 });

	 /**
	  * Browse By Works Window (Created in PHP)
	  */

	 var bWorks=Monomyth.Class.extend({
		init:function(args){

		this.manifest=args.manifest;
		this.options=null;
		this.setContents();
	 },
	 	setContents:function(){
			this.DOM=$("#bwork");
			this.closebutton=$('#bwork_close');
			this.closebutton.bind('click',{obj:this},this.close);
			this.bworks_select=$('#bwork_select');
			this.bwork_works=$('#bwork_works');
			this.backButton=$("#bworkBackButton");
			this.backButton.click(function(e){
				e.preventDefault();
				$(this).trigger("backtothemenu",["m"]);
			});
			this.handleReady(this);
		},
	 	close:function(e){
			var obj=e.data.obj;

			if($(".panel").length==0){
				obj.DOM.trigger("backtothemenu",["m"]);
			} else {
				obj.DOM.trigger("backtothemenu",["c"]);
			}
			//obj.closed.fire();
		},
		resetDisplay:function(){
			$(".listItem").each(function(i,o){
				$(o).removeClass("authItem_selected");
			});
			this.bwork_works.empty();
		},
		handleReady:function(obj){
			obj.readManifest(obj.manifest);
		},
		readManifest:function(manifest){
			var xml=$.ajax({
				async:false,
				dataType:"xml",
				url:manifest
			}).responseXML;

			var o=[];
			var authorarray=[];
			var authorstring="";
			$(xml).find("work").each(function(ox){

				var authorname=$(this).find("author").text();
				if(authorstring.indexOf(authorname,0)<0){
					authorstring+=" "+authorname;
					authorarray.push(authorname);
					var title=$(this).find("title").text();
					o[authorname]=[title];
				} else {
					var title=$(this).find("title").text();
					o[authorname].push(title);
				}
			});
			this.options=o;
			//create associative array of an author and his/her work(s)
			// for(i=0;i<workarray.length;i++){
			// 			var work=$(workarray[i]);
			// 			var authorname=work.find("author").text();
			// 			//var authorname=author.firstChild.nodeValue;
			// 			if(authorstring.indexOf(authorname,0)<0){
			// 				authorstring+=" "+authorname;
			// 				authorarray.push(authorname);
			// 				var title=work.find("title").text();
			// 				this.options[authorname]=[title];
			// 			} else {
			// 				var title=work.find("title").text();
			// 				this.options[authorname].push(title);
			// 			}		
			// 		}
			this.populateAuthorTable(authorarray);

			/*
	var callback={
				success:function(o){
					var obj=o.argument[0];
					var data=o.responseXML;
					var dom=data.documentElement;
					obj.options=[];
					var authorarray=[];
					var authorstring="";
					var workarray=dom.getElementsByTagName("work");
					//create associative array of an author and his/her work(s)
					for(i=0;i<workarray.length;i++){
						var work=workarray.item(i);
						var author=work.getElementsByTagName("author").item(0);
						var authorname=author.firstChild.nodeValue;
						if(authorstring.indexOf(authorname,0)<0){
							authorstring+=" "+authorname;
							authorarray.push(authorname);
							var title=work.getElementsByTagName("title").item(0).firstChild.nodeValue;
							obj.options[authorname]=[title];
						} else {
							var title=work.getElementsByTagName("title").item(0).firstChild.nodeValue;
							obj.options[authorname].push(title);
						}		
					}
					obj.populateAuthorTable(authorarray);
				},
				failure:function(o){
					alert("failure to access "+o.argument[1]);
				},
				argument:[this,manifest]

			};
			var connect=YAHOO.util.Connect.asyncRequest('GET',manifest,callback);
			setTimeout(function(){
				if(YAHOO.util.Connect.isCallInProgress(connect)){
					YAHOO.util.Connect.abort(connect);
				}
			},2000);
	*/
		},
		populateAuthorTable:function(authors){
			this.DOM.bind("authorClick",{obj:this},this.displayAuthorWorks);
			for(i=0;i<authors.length;i++){
				var el=new AuthorItem(authors[i]);
				this.bworks_select.append(el.DOM);
				//this.deselectNames.subscribe(el.unSelect,el);

				//el.authorClick.subscribe(this.displayAuthorWorks,this);
			}
		},

		displayAuthorWorks:function(e,authoritem){
			var obj=e.data.obj;

			//obj.deselectNames.fire();
			authoritem.DOM.addClass("authItem_selected");
			obj.bwork_works.empty();
			/*
	if(args.bwork_works.firstChild){
				while(args.bwork_works.firstChild){
					args.bwork_works.removeChild(args.bwork_works.firstChild);
				}
			}
	*/
			//work list cleared, display author's works 

			var works=obj.options[authoritem.name];
			//set up bind for title click
			obj.DOM.bind("titleClick",{obj:obj},obj.titleSelected);
			for(w=0;w<works.length;w++){
				var title=works[w];
				var el=new WorkItem(title);
				obj.bwork_works.append(el.DOM);

				//el.titleClick.subscribe(obj.titleSelected,args);
			}
		},
		titleSelected:function(e,workitem){
			if(e.isPropagationStopped()) return false;
			e.stopPropagation();
			var obj=e.data.obj;
			var manifest=obj.manifest;
			obj.DOM.hide();
			obj.DOM.trigger("titleClicked",[{type:'work',manifest:manifest,part:workitem.title}]);

			return false;
			//obj.DOM.trigger("titleClicked",[{type:'work',manifest:manifest,part:workitem.title}])
			//obj.titleClicked.fire({type:'work',manifest:manifest,part:workitem.title});

			//YAHOO.util.Dom.setStyle(args.DOM,'display','none');
		}

	 });

	var AuthorItem=Monomyth.Class.extend({
		init:function(name){
		this.DOM=$("<div></div>");
		this.DOM.attr("id",function(arr){
			return "author"+arr;
		});
		//YAHOO.util.Dom.generateId(this.DOM,"author");
		this.DOM.addClass("listItem");
		this.DOM.text(name);
		this.name=name;
		this.DOM.bind('click',{obj:this},this.notifyClick);
		//this.authorClick=new YAHOO.util.CustomEvent("authorClick");
		//YAHOO.util.Event.addListener(this.DOM.id,'click',this.notifyClick,this);
	},
		notifyClick:function(e){
			e.stopPropagation();
			var obj=e.data.obj;
			//un-select all elements
			$(".listItem").removeClass("authItem_selected");
			obj.DOM.trigger("authorClick",[obj]);
			return false;
		},
		unSelect:function(e,pass,args){
			if(!args.DOM.hasClass("listItem")) args.DOM.addClass("listItem");
		}
	});

	var WorkItem=Monomyth.Class.extend({
		init:function(title){
		this.DOM=$("<div></div>");
		//YAHOO.util.Dom.generateId(this.DOM,"work");
		this.DOM.addClass("listItem");
		this.DOM.text(title);

		this.title=title;
		//this.titleClick=new YAHOO.util.CustomEvent("titleClick");
		//YAHOO.util.Event.addListener(this.DOM.id,'click',this.notifyClick,this);
		this.DOM.bind("click",{obj:this},this.notifyClick);

	},
		notifyClick:function(e){
			if(e.isPropagationStopped()) return false;
			e.stopPropagation();

			e.data.obj.DOM.trigger("titleClick",[e.data.obj]);
			return false;
			//obj.titleClick.fire(obj);
		}
	});
	
	var ProjectBar = Monomyth.Class.extend({
		init:function(a){
		   	this.DOM=$("#nav");
			this.qselattach=a.qselattach;
			this.panelSelect=new ArchSelect({workmanifest:'./manifest/works.xml'});

		    this.projectName = "untitled";
		    this.projectId = null;
		    this.annoName = null;
		    this.topPanelId = null;
		    this.lock = false;
		    this.sendToSearch = null;
		    this.toggleMode = "none";

		   this.remoteButtonClick="remoteButtonClick";

		    //this.startProject.subscribe(this.loadProject, this);

			//load pbar elements once the DOM element is ready
			this.DOM.bind("projectBarReady",{obj:this},this.getPublicBarElements);

			this.DOM.trigger("projectBarReady");

		    /*
		YAHOO.util.Event.onAvailable(this.DOM.id, function(obj){

		        obj.getPublicBarElements();
				//obj.getUserBarElements();
		    }, this);
		*/



		},
		topPanel:function(e,panel){
			e.stopPropagation();
			var obj=e.data.obj;
			obj.topPanelId=panel.DOM.attr("id");
			return false;
		},
		getPublicBarElements:function(e){
			var obj=e.data.obj;
			obj.callNewPanel=$('#pb5');
			obj.callNewPanel.bind("click",{obj:obj},function(e){
				var obj=e.data.obj;
				var state=obj.panelWin.DOM.css("display");
				 if (state == "none") {
		            //c.qSel.winToggle("click", c.qSel);
		            obj.panelWin.DOM.css("display","block");

		           /*
	 obj.backWin([obj.extrasBox.DOM, obj.newWindow, obj.saveWindow, obj.openWindow, obj.searchBar.DOM]);
		            obj.frontWin(obj.qSel.DOM);
	*/
		        }
		        else {
					obj.panelWin.DOM.css("display","none");
		           /*
	 obj.backWin([obj.qSel.DOM]);
		            obj.IEunhidewindow.fire(obj.qSel.DOM);
	*/
		        }
			});
			/*
	YAHOO.util.Event.addListener(this.callNewPanel.id, "click", function(e, obj){
		        var state = YAHOO.util.Dom.getStyle(obj.qSel.DOM, "display");
		        if (state == "none") {
		            //c.qSel.winToggle("click", c.qSel);
		            YAHOO.util.Dom.setStyle(obj.qSel.DOM,'display','block');
					//obj.exhibitWindowClicked.fire(obj.qSel);
		            obj.backWin([obj.extrasBox.DOM, obj.newWindow, obj.saveWindow, obj.openWindow, obj.searchBar.DOM]);
		            obj.frontWin(obj.qSel.DOM);
		        }
		        else {
		            obj.backWin([obj.qSel.DOM]);
		            obj.IEunhidewindow.fire(obj.qSel.DOM);
		        }
		    }, this);
	*/
			//this.qSel.setManifest.subscribe(this.handleArchSelect,this);

			obj.cropToggle=$('#pb6');
			obj.cropToggle.bind("click",{obj:obj},obj.enterCrop);
			//YAHOO.util.Event.addListener(this.cropToggle.id, "click", this.enterCrop, this);

		},
		getUserBarElements:function(){
			/*
	this.openProject = document.getElementById('pb1');
		    YAHOO.util.Dom.setStyle(this.openProject, "display", "none");
		    YAHOO.util.Event.addListener(this.openProject.id, "click", function(f, c){
		        YAHOO.util.Event.addListener(document, "keypress", c.handleKeyPress, c);
		        var b = YAHOO.util.Dom.getStyle(c.openWindow, "display");
		        if (b == "none") {
		            c.frontWin(c.openWindow);
		            c.backWin([c.saveWindow, c.newWindow, c.qSel.DOM, c.extrasBox.DOM, c.searchBar.DOM]);
		          //  c.exhibitWindowClicked.fire(c.openWindow);
		        }
		        else {
		            c.backWin([c.openWindow]);
		            c.IEunhidewindow.fire(c.qSel.DOM);
		        }
		    }, this);
		    this.saveState = document.getElementById('pb2');
		    YAHOO.util.Dom.setStyle(this.saveState, "display", "none");
		    YAHOO.util.Event.addListener(this.saveState, "click", function(f, c){
		        var b = YAHOO.util.Dom.getStyle(c.saveWindow, "display");
		        if (b == "none") {
		           // c.exhibitWindowClicked.fire(c.saveWindow);
		            c.frontWin(c.saveWindow);
		            c.backWin([c.newWindow, c.openWindow, c.qSel.DOM, c.searchBar.DOM, c.extrasBox.DOM]);
		        }
		        else {
		            c.backWin([c.saveWindow]);
		            c.IEunhidewindow.fire(c.qSel.DOM);
		        }
		    }, this);
		    this.annoToggle = document.getElementById('pb3');

		    YAHOO.util.Dom.setStyle(this.annoToggle, "display", "none");

		    YAHOO.util.Event.addListener(this.annoToggle, "click", this.enterAnno, this);
		    this.lblNote = document.getElementById('pb4');
		    YAHOO.util.Dom.setStyle(this.lblNote, "display", "none");
		    YAHOO.util.Event.addListener(this.lblNote, "click", this.createLabel, this);
	*/
		},
		userEnters:function(e,pass,args){
			/*
	args.getOpenList(args.openWindow.openSelect, "mine", args);
	    	args.getSaveList(args.saveWindow.winSelect, "mine", args);

			if ((pass[0].loggedIn == true) && (YAHOO.util.Dom.getStyle(args.openProject, "display") == "none")) {
		        YAHOO.util.Dom.setStyle(args.openProject, "display", "block");
		        YAHOO.util.Dom.setStyle(args.saveState, "display", "block");
		        YAHOO.util.Dom.setStyle(args.annoToggle, "display", "block");
		        YAHOO.util.Dom.setStyle(args.lblNote, "display", "block");
		    }
		    else {
		        if ((pass[0].loggedIn == false) && (YAHOO.util.Dom.getStyle(args.openProject, "display") == "block")) {
		            YAHOO.util.Dom.setStyle(args.openProject, "display", "none");
		            YAHOO.util.Dom.setStyle(args.saveState, "display", "none");
		            YAHOO.util.Dom.setStyle(args.annoToggle, "display", "none");
		            YAHOO.util.Dom.setStyle(args.lblNote, "display", "none");
		            if (args.newWindow) {
		                if (YAHOO.util.Dom.getStyle(args.newWindow, "display") == "block") {
		                    YAHOO.util.Dom.setStyle(args.newWindow, "display", "none");
		                }
		            }
		            if (args.openWindow) {
		                if (YAHOO.util.Dom.getStyle(args.openWindow, "display") == "block") {
		                    YAHOO.util.Dom.setStyle(args.newWindow, "display", "none");
		                }
		            }
		            if (args.saveWindow) {
		                if (YAHOO.util.Dom.getStyle(args.saveWindow, "display") == "block") {
		                    YAHOO.util.Dom.setStyle(args.newWindow, "display", "none");
		                }
		            }
		        }
		    }
	*/
		},
		handleArchSelect:function(e,pass,args){
			//args.openManifest.fire({manifest:pass[0].manifest,bibInfo:pass[0].title,readyPage:1});
		},
		frontWin:function(obj){
			/*
	 YAHOO.util.Dom.setStyle(obj, "display", "block");
	    	YAHOO.util.Dom.setStyle(obj, "z-index", "1111");
	*/
		},
		backWin:function(args){
			/*
	for(i in args){
				YAHOO.util.Dom.setStyle(args[i],'display',"none");
			}
	*/
		},
		resetPublicBox:function(obj){
			obj.annoToggle.className = "projectBar_button";
		    obj.cropToggle.className = "projectBar_button";

		    if (obj.toggleMode == "annotate") {
		        obj.exitAnno("", obj);
		    }
		    else {
		        if (obj.toggleMode == "crop") {
		            obj.exitCrop("", obj);
		        }
		    }
		    obj.toggleMode = "none";
		},

		enterCrop:function(e){
			var obj=e.data.obj;
			if (obj.toggleMode == "annotate") {
		        obj.exitAnno("", obj);
		    }

		   /*
	 obj.remoteButtonClick.fire({
		        mode: "crop",
		        id: obj.topPanelId
		    });
	*/
		    obj.toggleMode = "crop";
		    obj.cropToggle.addClass("projectBar_button_selected");
		    obj.annoToggle.className = "projectBar_button";
		   // YAHOO.util.Event.removeListener(obj.cropToggle, "click", obj.enterCrop);
		    //YAHOO.util.Event.addListener(obj.cropToggle, "click", obj.exitCropHR, obj);
		},
		exitCropHR:function(e,obj){
			obj.toggleMode = "none";
		    obj.terminateListen.fire({
		        id: obj.topPanelId,
		        mode: "none"
		    });
			obj.cropToggle.removeClass("projectBar_button_selected");
		    obj.cropToggle.addClass("projectBar_button");
		    //YAHOO.util.Event.removeListener(obj.cropToggle, "click", obj.exitCropHR);
		    //YAHOO.util.Event.addListener(obj.cropToggle, "click", obj.enterCrop, obj);
		},
		exitCrop:function(e,obj){
			obj.toggleMode = "none";
		    obj.cropToggle.className = "projectBar_button";
		    //YAHOO.util.Event.removeListener(obj.cropToggle, "click", obj.exitCropHR);
		   // YAHOO.util.Event.addListener(obj.cropToggle, "click", obj.enterCrop, obj);
		},
		enterAnno:function(e,obj){
			 obj.annoToggle.className = "projectBar_button_selected";
		    if (obj.toggleMode == "crop") {
		        obj.exitCrop("", obj);
		    }
			 /*
	obj.remoteButtonClick.fire({
		        mode: "annotation",
		        id: obj.topPanelId
		    });
	*/
		    obj.toggleMode = "annotate";
		    obj.cropToggle.className = "projectBar_button";
		    //YAHOO.util.Event.removeListener(obj.annoToggle, "click", obj.enterAnno);
		   // YAHOO.util.Event.addListener(obj.annoToggle, "click", obj.exitAnnoHR, obj);
		},
		exitAnnoHR:function(e,obj){
			obj.toggleMode = "none";
		    obj.terminateListen.fire({
		        id: obj.topPanelId,
		        mode: "none"
		    });
		    obj.annoToggle.className = "projectBar_button";
		   // YAHOO.util.Event.removeListener(obj.annoToggle, "click", obj.exitAnnoHR);
		    //YAHOO.util.Event.addListener(obj.annoToggle, "click", obj.enterAnno, obj);
		},
		exitAnno:function(e,obj){
			obj.toggleMode = "none";
		    obj.annoToggle.className = "projectBar_button";
		    //YAHOO.util.Event.removeListener(obj.annoToggle, "click", obj.exitAnnoHR);
		   // YAHOO.util.Event.addListener(obj.annoToggle, "click", obj.enterAnno, obj);
		},
		setCurrPanel:function(e,args){
			if (!(args.sendToSearch == false)) {
		        var b = args.sendToSearch[4].indexOf("0");
		        var c = args.sendToSearch[4].substring(b);
		        if ((c.indexOf("a") >= 0)) {
		            c = c.substring(0, c.indexOf("a"));
		        }
		        else {
		            if ((c.indexOf("b") >= 0)) {
		                c = c.substring(0, c.indexOf("b"));
		            }
		        }
		        while ((c.indexOf("0") == 0)) {
		            c = c.substring(1);
		        }
		        a.curPageNum = parseInt(c,10);
		    }
		    else {
		        a.curPageNum = parseInt(c,10);
		        a.showPage(c);
		    }
		},

		checkOpenProjects:function(obj){
			 var a = "./lib/ProjectBar/getProjects.php?mode=current";
	    var c = {
	        success: function(g){
	            var e = g.responseText.split("\n");
	            var f = g.argument[0];
	            if (e[0] == "True") {
	                f.projectName = e[1];
	                f.projectId = e[2];
	                /*
	f.projectReady.fire({
	                    project: f.projectName,
	                    projectId: f.projectId
	                });
	*/
	            }
	        },
	        failure: function(e){
	            alert("Error in connecting to server");
	        },
	        argument: [obj]
	    };
		},
		createLabel:function(e,obj){
			var a = new LabelBox();
		    obj.qselattach.appendChild(a.DOM);
		   /*
	 a.objClosed.subscribe(function(e, pass, args){
		        args.objRemove.fire(pass[0]);
		    }, obj);
	*/

		    obj.backWin([obj.saveWindow, obj.newWindow, obj.openWindow, obj.extrasBox.DOM, obj.searchBar.DOM, obj.qSel.DOM]);
		    obj.objReady.fire(a);
		    /*
	if ((YAHOO.util.Dom.getY(a.DOM)) < 80) {
		        ttlLbl = YAHOO.util.Dom.getElementsByClassName("labelBox_window", "div");
		        var f = 10;
		        for (l in ttlLbl) {
		            if (YAHOO.util.Dom.getX(ttlLbl[l]) == f) {
		                f += 10;
		            }
		        }
		        YAHOO.util.Dom.setX(a.DOM, f);
		        YAHOO.util.Dom.setY(a.DOM, (85 + f));
		    }
	*/
		},
		panelClicked:function(e,pass,args){
			//args.backWin([args.newWindow, args.saveWindow, args.openWindow, args.qSel.DOm, args.searchBar.DOM, args.extrasBox.DOM]);
		}
	});

	/**
	 * Inherits from ProjectBar.js
	 */

	ArchProjectBar=ProjectBar.extend({
		init:function(args){
		//call super
		this.$super(args);

		this.openWorksManifest="openWorksManifest";
		//this.openWorksManifest=new YAHOO.util.CustomEvent("openWorksManifest");

	},
		getPublicBarElements:function(e){
			var obj=e.data.obj;
			obj.callNewPanel=$('#pb5');
			obj.callNewPanel.bind('click',{obj:obj},function(e){
				var obj=e.data.obj;

		        if (!obj.panelSelect.open) {
		            //c.qSel.winToggle("click", c.qSel);
					obj.panelSelect.display();
		           // YAHOO.util.Dom.setStyle(obj.qSel.DOM,'display','block');
					//obj.exhibitWindowClicked.fire(obj.qSel);
		            //obj.backWin([obj.extrasBox.DOM, obj.newWindow, obj.saveWindow, obj.openWindow, obj.searchBar.DOM]);

		        }

			});

			//open new panel window if no windows present
			$(function(){
				var total=$(".panel");
				if(total.length<1){
					obj.panelSelect.display();
				}
			});

			$("body").bind("setManifest",{obj:obj},obj.handleArchSelect);		
			//NEW: crop button now on the panel
			// obj.cropToggle=$('#pb6');
			// 		obj.cropToggle.bind("click",{obj:obj},obj.enterCrop);


			//OLD CODE WENT HERE
		},
		getUserBarElements:function(){
			//OLD CODE WENT HERE
		},
		handleArchSelect:function(e,args){
			if(e.isPropagationStopped()) return false;
			e.stopPropagation();
			var obj=e.data.obj;
			var type=args.type;
			switch(type){
				case 'work':
					obj.DOM.trigger("openWorksManifest",[{manifest:args.manifest,bibInfo:args.part,readyPage:1,menuType:'w'}]);
					//obj.openWorksManifest.fire({manifest:pass[0].manifest,bibInfo:pass[0].part,readyPage:1});
					return false;
					break;
				case 'undertext':
					//get every single set of pages
					var xml=$.ajax({
						dataType:"xml",
						url:args.manifest,
						async:false
					}).responseXML;
					var pages=$(xml).find('page');
					var auth=$(xml).find('auth').text();

					var pagearray=[];
					$(pages).each(function(i){

						var manifest="./manifest/"+$(this).attr("xml");
						pagearray.push({pageName:$(this).attr("auth"),pageSuffix:$(this).text(),manifest:manifest});
					});
					obj.DOM.trigger("openManifest",[{pages:pagearray,bibInfo:args.part,manifest:args.manifest,readyPage:1,menuType:'m'}]);
					//obj.openManifest.fire({pages:pagearray,bibInfo:bibInfo,manifest:manDocFile,readyPage:1});
					/*
	var callback={
						success:function(o){
							var obj=o.argument[0];
							var manDocFile=o.argument[1];
							var bibInfo=o.argument[2];
							var xml=o.responseXML;
							var pages=xml.getElementsByTagName('page');
							var pagearray=[];
							for(p=0;p<pages.length;p++){
								var el=pages.item(p);
								var manifest="./manifest/"+el.getAttribute("xml");
								pagearray.push({pageName:el.firstChild.nodeValue,manifest:manifest});
							}
							obj.openManifest.fire({pages:pagearray,bibInfo:bibInfo,manifest:manDocFile,readyPage:1});
						},
						failure:function(o){

						},
						argument:[obj,pass[0].manifest,pass[0].part]
					};

					var transact=YAHOO.util.Connect.asyncRequest("GET",pass[0].manifest,callback);

	*/
					return false;
					break;
				case 'prayerbook':
					//get the pages
					var xml=$.ajax({
						dataType:"text",
						url:args.manifest,
						async:false
					}).responseXML;
					var kids=$(xml).find("page");
					var pagearray=[];
					$(kids).each(function(i){
						pagearray.push({pageSuffix:$(this).attr("auth"),pageName:$(this).text(),manifest:"./manifest/"+$(this).attr("xml")});
					});

					/*
	var pages=xml.getElementsByTagName('page');
					var pagearray=[];
					for(p=0;p<pages.length;p++){
						var el=pages.item(p);
						var manifest="./manifest/"+el.getAttribute("xml");
						pagearray.push({pageName:el.firstChild.nodeValue,manifest:manifest});
					}
	*/

					obj.DOM.trigger("openManifest",[{pages:pagearray,bibInfo:args.part,manifest:args.manifest,readyPage:1,menuType:'m'}]);
					/*
	var callback={
						success:function(o){
							var obj=o.argument[0];
							var manDocFile=o.argument[1];
							var bibInfo=o.argument[2];
							var xml=o.responseXML;
							var pages=xml.getElementsByTagName('page');
							var pagearray=[];
							for(p=0;p<pages.length;p++){
								var el=pages.item(p);
								var manifest="./manifest/"+el.getAttribute("xml");
								pagearray.push({pageName:el.firstChild.nodeValue,manifest:manifest});
							}
							obj.openManifest.fire({pages:pagearray,bibInfo:bibInfo,manifest:manDocFile,readyPage:1});
						},
						failure:function(o){

						},
						argument:[args,pass[0].manifest,pass[0].part]
					};

					var transact=YAHOO.util.Connect.asyncRequest("GET",pass[0].manifest,callback);

	*/
					//obj.openManifest.fire({manifest:pass[0].manifest,bibInfo:pass[0].part,readyPage:1});
					return false;
					break;
			}
			//args.openManifest.fire({manifest:pass[0].manifest,bibInfo:pass[0].part,readyPage:1});
			return false;
		},
		/**CROP FUNCTIONS**/
		enterCrop:function(e){
			e.stopPropagation();
			var obj=e.data.obj;
			if (obj.toggleMode == "annotate") {
		        obj.exitAnno("", obj);
		    }

		   /*
	 obj.remoteButtonClick.fire({
		        mode: "crop",
		        id: obj.topPanelId
		    });
	*/
		    obj.toggleMode = "crop";
			obj.DOM.trigger(obj.remoteButtonClick,[{mode:"crop",id:obj.topPanelId}]);
			return false;
		    //obj.cropToggle.className = "projectBar_button_selected";
		    //obj.annoToggle.className = "projectBar_button";
		    //YAHOO.util.Event.removeListener(obj.cropToggle, "click", obj.enterCrop);
		    //YAHOO.util.Event.addListener(obj.cropToggle, "click", obj.exitCropHR, obj);
		},
		exitCrop:function(e,obj){
			obj.toggleMode = "none";
		   /*
	 obj.terminateListen.fire({
		        id: obj.topPanelId,
		        mode: "none"
		    });
	*/
		    obj.cropToggle.className = "projectBar_button";
		   // YAHOO.util.Event.removeListener(obj.cropToggle, "click", obj.exitCropHR);
		   // YAHOO.util.Event.addListener(obj.cropToggle, "click", obj.enterCrop, obj);
		},
		exitCropHR:function(e,obj){
			obj.toggleMode = "none";
		    obj.cropToggle.className = "projectBar_button";
		   // YAHOO.util.Event.removeListener(obj.cropToggle, "click", obj.exitCropHR);
		    //YAHOO.util.Event.addListener(obj.cropToggle, "click", obj.enterCrop, obj);
		},
		enterAnno:function(e,obj){
			 //obj.annoToggle.className = "projectBar_button_selected";
		   /*
	 if (obj.toggleMode == "crop") {
		        obj.exitCrop("", obj);
		    }
	*/
			/*
	 obj.remoteButtonClick.fire({
		        mode: "annotation",
		        id: obj.topPanelId
		    });
	*/
		    obj.toggleMode = "annotate";
		    //obj.cropToggle.className = "projectBar_button";
		   // YAHOO.util.Event.removeListener(obj.annoToggle, "click", obj.enterAnno);
		    //YAHOO.util.Event.addListener(obj.annoToggle, "click", obj.exitAnnoHR, obj);
		}
	});
	
	/**
	 * Creates a DropDown list of <option> elements
	 * from any given HTML <select> tag
	 * 
	 * Inheriting classes define the rest of the initialization
	 * and action methods
	 * 
	 * @param {Object} args
	 */

	DropDown = Monomyth.Class.extend({
		init:function(args){
			this.DOM = args.location;
			this.options=args.options;

			this.DOM.attr("selectedIndex",args.start);
			this.dropDownChanged="dropDownChanged"+this.DOM.attr("id");

			this.setContents();

		},
	setContents:function(e){
		//inheriting classes define this
	},
	updatePage:function(e){
		var obj=e.data.obj;
		obj.DOM.trigger(obj.dropDownChanged,[obj.DOM.attr("selectedIndex")]);
		//obj.dropDownChanged.fire(obj.DOM.selectedIndex);
	},
	updateSelf:function(e,index){
		e.stopPropagation();
		var obj=e.data.obj;
		//select the appropriate option
		$("#"+this.DOM.attr("id")+" option[value="+index+"]").attr('selected','selected');
		return false;
	}
	});


	/**
	 * Inherits from dropDown.js
	 * 
	 */

	ArchDropDown=DropDown.extend({
		init:function(args){
			//call superclass
			this.$super(args);
			this.alreadySelected=null;
		},
		setContents:function(){
			for (i in this.options){
				var item = $("<option></option>");
				var ind=parseInt(i,10);
				item.attr("value",ind);
				item.attr("id",ind);
				item.text(this.options[i].pageName+" : "+this.options[i].pageSuffix);
				this.DOM.append(item);	
				this.DOM.bind("click",{obj:this,num:i},this.pageSelect);
			}
		},
		pageSelect:function(e){
			e.stopPropagation();

			var obj=e.data.obj;
			var num=e.data.num;

			if (!obj.alreadySelected) {
				obj.alreadySelected = obj.DOM.val();
				obj.DOM.trigger(obj.dropDownChanged,[obj.DOM.val()]);
			} else if(obj.alreadySelected!=obj.DOM.val()){
				obj.DOM.trigger(obj.dropDownChanged,[obj.DOM.val()]);
			}	
			return false;
		},
		updateSelf:function(i){

			//unselect previously selected item
			//$("#"+this.DOM.attr('id')+" option:selected").attr("selected","");
			//set the options so that the newly elected item takes precedence
			//$("#"+this.DOM.attr('id')+" option[val="+i+"]").attr("selected","selected");
			$("#"+this.DOM.attr('id')).val(i);
		}
	});
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
	CropLayerBox = Monomyth.Class.extend({
		init:function(points, layer, nextlayer, mouse){
	    this.layer = layer;
	    this.mousePos = mouse;
	    this.bounds = new OpenLayers.Bounds();
	    this.bounds.extend(points);
	    var y1 = (parseInt(points.lon) + 200) + (200 * (6 - this.layer.map.getZoom()));
	    var y2 = (parseInt(points.lat) + 200) + (200 * (6 - this.layer.map.getZoom()));
	    this.bounds.extend(new OpenLayers.LonLat(y1, y2));
	    this.box = new OpenLayers.Marker.Box(this.bounds, "#985434", 2);


	    this.drag = null;
	    this.resize = null;
	    this.text = "";

	    this.box.events.includeXY = true;
	},
		setContents:function(){
			this.DOM = $("#"+this.box.div.id);
		    this.cropButton = $("<div></div>");

		    this.cropButton.addClass("cropButton");
		    this.DOM.append(this.cropButton);
			this.cropButton.bind("click",{obj:this},this.cropEvent);
		   	this.cropRegionClose = $("<div></div>");

		    this.cropRegionClose.addClass("cropRegionClose");
		    this.cropRegionClose.text("Close");
			this.cropRegionClose.bind("click",{obj:this},this.leaveCrop);
		  	this.DOM.append(this.cropRegionClose);
			//set up click handler
			this.DOM.bind('mousedown',function(e){
				e.stopPropagation();
				$(this).trigger("toggleMapMove",["off"]);
			});
			this.DOM.bind('mouseup',function(e){
				//e.stopPropagation();
				$(this).trigger("toggleMapMove",["on"]);
			});
			this.makeDraggable();
		},
		updateBoxCoords:function(e,ui){
			e.stopPropagation();
			var obj=e.data.obj;
			//get helper object
			var box=$(ui.helper);

			//get position info
	        var x = obj.mousePos.lastXy.x;
	        var y = obj.mousePos.lastXy.y;

	        var w = x + box.width();
	        var h = y + box.height();
	        var wh = obj.layer.getLonLatFromViewPortPx(new OpenLayers.Pixel(w, h));
	        var xy = obj.layer.getLonLatFromViewPortPx(new OpenLayers.Pixel(x, y));
	        obj.bounds = new OpenLayers.Bounds();
	        obj.bounds.extend(xy);
	        obj.bounds.extend(wh);
	        obj.box.bounds = obj.bounds;
			return false;
		},
	    makeDraggable: function(){

			this.DOM.bind(this.DOM.attr("id"),{obj:this},this.updateBoxCoords);
			this.DOM.draggable({

				start: function(e, ui){
					e.stopPropagation();
					//prevent layer from being moved 
					$(this).trigger("toggleMapMove",["off"]);
					return false;
				},
				stop: function(e, ui){
					e.stopPropagation();
					$(this).trigger("toggleMapMove",["on"]);
					/*
					var triggah=$(ui.helper).attr("id");
					$(this).trigger(triggah,[ui]);
					*/
					return false;
				}
			});
			this.DOM.resizable({
				start:function(e,ui){
					e.stopPropagation();
					$(this).trigger("toggleMapMove",["off"]);
					return false;
				},
				stop:function(e,ui){
					e.stopPropagation();
					$(this).trigger("toggleMapMove",["on"]);
					return false;
				}
			});

	       /*
	 if ((!(this.drag)) && (!(this.resize))) {
	            this.drag = new YAHOO.util.DD(this.DOM.id);
	            this.drag.setDelta(0, 0);
	            this.resize = new YAHOO.util.Resize(this.box.div, {
	                handles: "br"
	            });
	            i;
	            this.drag.on("endDragEvent", function(e, obj){
	                obj.box.div.className = "yui resize";
	                var x = obj.mousePos.lastXy.x;
	                var y = obj.mousePos.lastXy.y;
	                var w = x + parseInt(YAHOO.util.Dom.getStyle(obj.box.div, "width"));
	                var h = y + parseInt(YAHOO.util.Dom.getStyle(obj.box.div, "height"));
	                var wh = obj.layer.getLonLatFromViewPortPx(new OpenLayers.Pixel(w, h));
	                var xy = obj.layer.getLonLatFromViewPortPx(new OpenLayers.Pixel(x, y));
	                obj.bounds = new OpenLayers.Bounds();
	                obj.bounds.extend(xy);
	                obj.bounds.extend(wh);
	                obj.box.bounds = obj.bounds;
	            }, this);
	            this.resize.on("endResize", function(e, obj){
	                obj.bounds = new OpenLayers.Bounds();
	                var w = obj.mousePos.lastXy.x;
	                var x = obj.mousePos.lastXy.x - parseInt(YAHOO.util.Dom.getStyle(obj.box.div, "width"));
	                var y = obj.mousePos.lastXy.y - parseInt(YAHOO.util.Dom.getStyle(obj.box.div, "height"));
	                var h = obj.mousePos.lastXy.y;
	                var wh = obj.layer.getLonLatFromViewPortPx(new OpenLayers.Pixel(w, h));
	                var xy = obj.layer.getLonLatFromViewPortPx(new OpenLayers.Pixel(x, y));
	                obj.bounds.extend(xy);
	                obj.bounds.extend(wh);
	                obj.box.bounds = obj.bounds;
	            }, this);
	        }
	*/
	    },
		cropEvent:function(e){
			e.stopPropagation();
			var obj=e.data.obj;
			var box=$(e.target).parent();


			var x=box.position().left;
			var y=box.position().top;
			var w=box.width();
			var h=box.height();
			var matches=[];
			var attachAt=$("body");
			var layerchildren=$(".olTileImage");
			//alert(box.attr("id")+":  "+x+", "+y+", "+w+", "+h);
			for (c = 0; c < layerchildren.length; c++) {
	            var div = $(layerchildren[c]).parent();
				if (div.css("display")!="none") {
					//is visible on page
					var left = parseInt(div.css("left"));
					var top = parseInt(div.css("top"));
					var bottom = div.height() + top;
					var right = div.width() + left;

					if ((x >= left) && (x <= right) && (y >= top) && (y <= bottom)) {
						//alert(div.children("img").attr("src") + ":  " + left + ", " + bottom + ", " + top + ", " + right);
						matches.push({
							path:div.children("img").attr("src"),
							srcx:Math.abs(left - x),
							srcy:Math.abs(top - y),
							srcw:w,
							srch:h,
							loc:attachAt
						});
						//break;
					}
				}
	        }

	        var cropPortion = new CropBox(matches[1]);
			obj.DOM.trigger("cropDone");
			obj.DOM.hide();
			return false;
		},
		activate:function(bounds){
			if(this.DOM){
				if(bounds) this.box.bounds=bounds;
				this.DOM.show();
			}
		},
		leaveCrop:function(e){
			e.stopPropagation();
			var obj=e.data.obj;
			obj.DOM.hide();
			return false;
		}

		/*
	,
	    cropEvent: function(e, obj){
	        var points = obj.box.bounds.toArray();
	        var xy = obj.layer.getViewPortPxFromLonLat(new OpenLayers.LonLat(points[0], points[1]));
	        var x = parseInt(YAHOO.util.Dom.getStyle(obj.box.div, "left"));
	        var y = parseInt(YAHOO.util.Dom.getStyle(obj.box.div, "top"));
	        var w = parseInt(YAHOO.util.Dom.getStyle(obj.box.div, "width"));
	        var h = parseInt(YAHOO.util.Dom.getStyle(obj.box.div, "height"));
	        var layerchildren = obj.layer.div.childNodes;
	        var src = "";
	        for (c = 0; c < layerchildren.length; c++) {
	            var div = layerchildren[c];
	            var left = parseInt(YAHOO.util.Dom.getStyle(div, "left"));
	            var top = parseInt(YAHOO.util.Dom.getStyle(div, "top"));
	            var bottom = parseInt(YAHOO.util.Dom.getStyle(div, "height")) + top;
	            var right = parseInt(YAHOO.util.Dom.getStyle(div, "width")) + left;
	            if ((x >= left) && (x <= right) && (y >= top) && (y <= bottom)) {
	                src = div.firstChild.src;
	                x = Math.abs(left - x);
	                y = Math.abs(top - y);
	                break;
	            }
	        }
	        var values = {
	            path: src,
	            srcx: x,
	            srcy: y,
	            srcw: w,
	            srch: h,
	            iZoom: 1
	        };
	        var cropPortion = new CropBox(values);
	        document.getElementById("workspace").appendChild(cropPortion.DOM);
	        obj.removeBox.fire(obj.box);
	        obj.cropSaved.fire({
	            type: "crop",
	            obj: cropPortion
	        });
	    },
	    leaveCrop: function(e, obj){
	        obj.removeBox.fire(obj.box);
	    }
	*/
	});
	
	/**
	 * TMS Compliant layer 
	 * 
	 */

	var TMSLayer=Monomyth.Class.extend({
		init:function(args,loc){
			this.panelid=args.panelid;
			this.DOM=$("#"+this.panelid+"_mapdiv");

			//create map options
			this.mapextent=new OpenLayers.Bounds(-8192.0, -8912.0, 8912.0, 8912.0 );
			this.maxResolution=32.000000;
			this.mapZoomLevels=6;
			this.mapopacity=1;
		  	this.mapoptions={
				controls:[],
		       	maxExtent: this.mapextent,
		       	maxResolution: this.maxResolution,
		       	numZoomLevels: this.mapZoomLevels,
				allOverlays:true
			};
			//TMS has a standard URL set up:
			// '/serviceVersion/layername/zoomlevel/column/row'
			this.views=null;
			this.serviceVersion="";
			this.url="";
			this.viewlayers=[];
			//Other variables
			this.image="";
			this.doc=args.doc; //manifest filename
			this.map=null; //map and layer created later
			this.curLayer=null;
			this.annolayer=null;
			this.croplayer=null;

			this.mouseControl=new OpenLayers.Control.Navigation({zoomWheelEnabled:false});
			//map handler - toggles the map on or off
			this.dragHandler=new OpenLayers.Handler.Drag(this.mouseControl);
			this.ovControl=null;

			this.panelWidth=args.width;
			this.panelHeight=args.height;
			this.zoomlevel=0;
			this.zoomMax=0;
			this.opacity=1;
			this.page=1;
			this.zoomlevel=args.startzoom;
			this.center=args.startcenter;
			//objects for storing special crop and annotation 
			//boxes
			this.annobox=null;
			this.cropbox=null;
			this.MLL=null;
			this.CLL=null;
			//get MLL
			this.setLargeLayerList();
			this.exitAnno="exitAnno"+this.DOM.attr("id");
			this.passObject="passObject"+this.DOM.attr("id");
			this.onCleared="onCleared"+this.DOM.attr("id");
			this.onSizeAdjust="onSizeAdjust"+this.DOM.attr("id");
			this.onMapMove="onMapMove"+this.DOM.attr("id");
			this.mode="none";
		},
		setLargeLayerList:function(){
			//retrieve Master Layer List
			var s=$.ajax({
				url:"Contents/masterLayerList.php",
				dataType:'text',
				async:false
			}).responseText;
			// create an array of objects representing the server-image name of the layer
			// 		and the display name to be shown in the layer controls
			var a=s.split("%");
			this.MLL=this.CLL=[];
			for(x=0;x<a.length;x++){
				var t=a[x].split(":");
				//dn: displayname
				//ln: layername (actual image name found in file)

				this.MLL[x]={dn:t[1].replace(/^\s+|\s+$/g,""),ln:t[0].replace(/^\s+|\s+$/g,""),n:x};

				//CLL refers to what is being seen right now by the user
				//contains all layer displaynames
				this.CLL[t[1].replace(/^\s+|\s+$/g,"")]=null; //set during setLayer/fillMap

			}

		},
		restartCLL:function(list){
			var CLL=this.CLL;
			$.each(list,function(i,a){
				if(!CLL[a.name]){
					CLL[a.name]=i;
				} 
			});
			this.CLL=CLL;
		},
		updateCLL:function(){
			for(v=0;v<this.views.length;v++){
				this.CLL[this.views[v].name]=v;
			}
		},
		adjustResize:function(width,height){
			if (this.map) {
				this.DOM.width(width);
				this.DOM.height(height);
			}
		},
		setLayer:function(args){	
			//create TMS Layer/create new TMS Layer
			//also create map if it does not already exist

			if (!(this.map)) {
				if(this.panelWidth&&this.panelHeight){
					this.DOM.width(this.panelWidth);
					this.DOM.height(this.panelHeight);
				}
				this.map = new OpenLayers.Map(this.DOM.attr("id"), this.mapoptions);
				this.map.addControl(this.mouseControl);
			}
			if(!(this.croplayer)){
				this.croplayer=new CropLayer({name:"CropLayer",doc:this.doc,mouse:this.mouseControl});
				this.croplayer.layer.setZIndex(999);
				$("body").bind("toggleMapMove",{obj:this},this.handleMapMoves);
				this.map.addLayer(this.croplayer.layer);
			} else {
				this.croplayer.terminate();
			}
			//create layers
			//this.serviceVersion=args.sv;
			this.url=args.imgdir+"/";
			this.page=(args.page+1);
			var start="";
			var next="";
			this.viewlayers=[];

			if(args.layers&&this.CLL&&this.MLL){
				this.views=[];
				this.views=this.createTrueLayerArray(args.layers);
				//this.restartCLL(this.views);
				for (v = 0; v < this.views.length; v++) {
					var data = {
						sv: this.views[v].base,
						layername: this.views[v].lname,
						altname:this.views[v].name,
						url: this.url
					};
					var layer = new SubLayer(data);
					this.map.addLayer(layer.layer);
					layer.layer.setZIndex(v);
					this.viewlayers[this.views[v].name] = layer;

					next = start;
					start = this.views[v].name;
				}

			}


			// if(this.views&&(this.views.length>0)&&this.CLL&&this.MLL){
			// 		var newLayers=[];
			// 		
			// 		this.views=args.layers;
			// 		// for(v=0;v<args.layers;v++){
			// 		// 				//var temp=args.layers[v].name.replace(/^\s+|\s+$/g, "");
			// 		// 				var temp=args.layers[v];
			// 		// 				if(this.CLL[temp.name.replace(/^\s+|\s+$/g, "")]){
			// 		// 					this.views[this.CLL[temp.name.replace(/^\s+|\s+$/g, "")]]=temp;
			// 		// 				} else {
			// 		// 					newLayers.push(temp);
			// 		// 					
			// 		// 				}
			// 		// 			}
			// 		// 			for(x=0;x<newLayers.length;x++){
			// 		// 				this.views.push(newLayers[x]);
			// 		// 				this.CLL[newLayers[x].name.replace(/^\s+|\s+$/g, "")]=(this.views.length-1);
			// 		// 			}
			// 		
			// 		
			// 	} else {
			// 		this.views=[];
			// 	
			// 		for (v = 0; v < args.layers.length; v++) {
			// 			
			// 			this.views[v] = args.layers[v];
			// 			var view = this.findTrueLayerName(this.views[v].name.replace(/^\s+|\s+$/g, ""));
			// 			
			// 			var data = {
			// 				sv: this.views[v].base,
			// 				layername: view,
			// 				altname:this.views[v].name,
			// 				base:this.views[v].base,
			// 				url: this.url
			// 			};
			// 			var layer = new SubLayer(data);
			// 			this.map.addLayer(layer.layer);
			// 			layer.layer.setZIndex(v);
			// 			this.viewlayers[this.views[v].name] = layer;
			// 
			// 			next = start;
			// 			start = this.views[v].name;
			// 			
			// 		}
			// 	}

			this.map.zoomTo(this.zoomlevel);
			this.curLayer=this.viewlayers[start]; //top sublayer object
			this.nextLayer=this.viewlayers[next];
			this.ovcontrollayer=new SubLayer({sv:this.curLayer.serviceVersion,altname:this.curLayer.altname,layername:this.curLayer.layername,url:this.curLayer.url});
			this.ovControl=new OpenLayers.Control.OverviewMap({
				layers:[this.ovcontrollayer.layer],
				autoPan:true,
				mapOptions:{
					maxExtent: this.mapextent,
	       			maxResolution: this.maxResolution,
	       			numZoomLevels: this.mapZoomLevels
				}
			});
			this.map.addControl(this.ovControl);
			//open up the overlay map by default
			//e=null
			this.ovControl.maximizeControl(null);
			//adjust the image src for control
			$("#olControlOverviewMapMaximizeButton_innerImage").attr("src","images/layer-switcher-maximize.png");

			//find center if not already given by options

			if (this.center) {
				this.map.setCenter(new OpenLayers.LonLat(this.center[0],this.center[1]),this.zoomlevel);
			}
			else {
				var newCenter=new OpenLayers.LonLat(-3000,-4800);

				this.map.setCenter(newCenter, this.zoomlevel);
			}

			this.curLayer.changeVisibility(true);
			this.nextLayer.changeVisibility(true);
			this.DOM.trigger("layerSet");
			//this.adjustResize(this.DOM.parent().innerWidth(),this.DOM.parent().innerHeight());
			//this.annolayer.setTopLayer(this.curLayer.layer.id);

		},
		getOrder:function(){
			var v=this.views;
			return v;
		},
		handleMapMoves:function(e,handle){
			e.stopPropagation();
			//either turn the map handler on or off
			var obj=e.data.obj;

			switch(handle){
				case 'on':
					obj.mouseControl.activate();
					break;
				case 'off':
					obj.mouseControl.deactivate();
					break;
			}

			return false;
		},
		/**
		 * Receives call from PanelContent to change one 
		 * layers visibility
		 * @param {Object} layername
		 * @param {Object} visible
		 */
		setVisibility:function(layername,nextlayername,visible){
			var layer=this.viewlayers[layername];

			if (layer.visible) {
				switch(layer.layername){
					case this.curLayer.layername:
						this.curLayer.changeVisibility(false);
						this.curLayer=this.findNextAvailableLayer(this.curLayer.altname);
						this.nextLayer=null;
						if(this.curLayer) {
							this.curLayer.changeVisibility(true);
							//make next visible layer below it visible

							this.nextLayer = this.findNextAvailableLayer(this.curLayer.altname);
							if(this.nextLayer) this.nextLayer.changeVisibility(true);
						}
						break;
					case this.nextLayer.layername:
						this.nextLayer.changeVisibility(false);
						this.nextLayer = this.findNextAvailableLayer(this.nextLayer.altname);
						if(this.nextLayer) this.nextLayer.changeVisibility(true);
						break;
					default:
						layer.changeVisibility(false);
						break;
				}
			} else {
				var n=this.findNextAvailableLayer(layer.altname);
				switch(layer.layername){
					case this.curLayer.layername:
						this.curLayer.changeVisibility(true);
						if(n.layername==this.nextLayer.layername){
							this.nextLayer.changeVisibility(true);
						} else {
							this.nextLayer.changeVisibility(false);
							this.nextLayer=this.viewlayers[n.altname];
							this.nextLayer.changeVisibility(true);
						}
						break;
					case this.nextLayer.layername:
						this.nextLayer.changeVisibility(true);

						break;
					default:
						layer.changeVisibility(true);
						break;
				}
				// layer.changeVisibility(true);
				// 			if (this.nextLayer) {
				// 				this.nextLayer = this.findNextAvailableLayer(this.nextLayer.layername);
				// 				nextlayer.changeVisibility(false);
				// 			}
			}

		},
		setLayerOpacity:function(name,nextlayername,value){
			var layer=this.viewlayers[name];
			layer.changeDarkness(value);
			//make sure that the layers below the currently changed layer are showing
			if(layer.layername==this.curLayer.layername){
				if(this.nextLayer){
					this.nextLayer.changeVisibility(true);
				}
			} else if((layer.layername==this.nextLayer.layername)&&(this.curLayer.opacity!=1)){
				var n=this.findNextAvailableLayer(this.nextLayer.altname);
				if(n) n.changeVisibility(true);
			} else if((this.nextLayer.opacity!=1) && (this.curLayer.opacity!=1)){
				//both top layers are see-through, make this one visible if it's 
				//below these layers
				var n=this.findNextAvailableLayer(this.nextLayer.altname);
				if(n&&(n.layername==layer.layername)) n.changeVisibility(true);
			}

			// if (nextlayername) {
			// 			
			// 			var nextlayer = this.findNextAvailableLayer(nextlayername);
			// 			
			// 		}
			// 		
			// 		if(layer.opacity==1){
			// 			//layer all the way on, don't need to turn on nextlayer
			// 			nextlayer.layer.setVisibility(false);
			// 		} else {
			// 			if(nextlayer.visible) nextlayer.layer.setVisibility(true);
			// 		}
		},
		//returns Sublayer {Object} or Null
		findNextAvailableLayer:function(start){
			//start is name of layer to begin with
			var ok=true;
			var o=[];

			for(n in this.views){
				if(this.views[n].name==start){
					ok=false;
				}
				if(ok){
					o.push(this.viewlayers[this.views[n].name]);
				}

			}

			var f=false;
			for(n=(o.length-1);n>0;n--){
				if(o[n].visible){
					f=o[n];
					break;
				}
			}

			return f;
		},
		destroyAllLayers:function(){
			for(v in this.viewlayers){
				layer=this.viewlayers[v].layer;
				this.map.removeLayer(layer);
				//this.viewlayers[v].destroy();
			}
		},
		createTrueLayerArray:function(o){
			//o represents passed array of layers from archiecontent
			var finalarray=[];
			var self=this;

			$.each(this.MLL,function(i,a){
				$.each(o,function(b,c){
					if(a.dn==c.name.replace(/^\s+|\s+$/g, "")){
						finalarray.push({lname:a.ln,name:c.name,base:c.base});
					}
				});	

			});


			return finalarray.reverse();
		},
		findTrueLayerName:function(n){
			//n is {String} for name
			//returns actual layername value (as exists on server)
			var truename='';
			$.each(this.MLL,function(i,a){
				if(a.dn==n){
					truename=a.ln;
				}
			});
			return truename;
		},

		/**Change the top-most overlay to the passed layer ID
		 * and change value of curLayer
		 * @param {Object} args
		 */
		changeView:function(list){

			this.destroyAllLayers();

			//update this.views to current list of layers
			// this.views=list;
			var o=[];
			for(n in list){
				for(x in this.views){
					if(this.views[x].name==list[n]){
						o.push(this.views[x]);
					}

				}
			}
			this.views=o;
			var start="";
			var next="";
			for(v=0;v<this.views.length;v++){
				var view=this.findTrueLayerName(this.views[v].name);
				data={sv:this.views[v].base,layername:view,url:this.url,altname:this.views[v].name};

				var layer=new SubLayer(data);
				this.map.addLayer(layer.layer);
				this.map.setLayerIndex(layer.layer,v);
				if(this.viewlayers[layer.altname]){
					layer.visible=this.viewlayers[layer.altname].visible;
				}
				this.viewlayers[layer.altname]=layer;
				next=start;
				start=layer.altname;
			}

			this.curLayer=this.viewlayers[start];
			if(!this.curLayer.visible){
				this.curLayer=this.findNextAvailableLayer(start);

			} 
			this.nextLayer=this.findNextAvailableLayer(this.curLayer.altname);

			this.curLayer.changeVisibility(true);
			this.nextLayer.changeVisibility(true);
			//this.annolayer.setTopLayer(this.curLayer.layer.id);
			this.ovcontrollayer=new SubLayer({
				sv:this.curLayer.serviceVersion,
				url:this.curLayer.url,
				layername:this.curLayer.layername
			});
			//set up ovmap
			this.ovControl.destroy();
			this.ovControl=new OpenLayers.Control.OverviewMap({
				layers:[this.ovcontrollayer.layer],
				mapOptions:{
					maxExtent: this.mapextent,
	       			maxResolution: this.maxResolution,
	       			numZoomLevels: this.mapZoomLevels
				}
			});
			this.map.addControl(this.ovControl);
			//open up the control by default
			//e=null
			this.ovControl.maximizeControl(null);
			this.updateCLL();
		},

		clearMap:function(){
			this.destroyAllLayers();
			this.DOM.trigger(this.onCleared);
			//this.onCleared.fire();
		},
		showPage:function(args){
			this.croplayer.terminate();
			//create layers

			//this.views=(this.views)?this.views:args.layers;
			this.views=args.layers;

			this.serviceVersion=args.sv;
			this.url=args.imgdir+"/";
			this.page=(args.page+1);
			var start="";
			for(v=0;v<this.views.length;v++){
				temp=this.views[v];
				view=this.findTrueLayerName(temp.name.replace(/^\s+|\s+$/g,""));
				data={sv:this.serviceVersion,layername:view,url:this.url};
				layer=new SubLayer(data);
				this.map.addLayer(layer.layer);
				layer.layer.setZIndex(v);
				//this.map.setLayerIndex(layer.layer,v);
				this.viewlayers[layer.layername]=layer;
				start=layer.layername;	
			}
			this.map.zoomTo(this.zoomlevel);
			this.curLayer=this.viewlayers[start]; //top sublayer object

			//find center if not already given by options

			if (this.center) {
				this.map.setCenter(new OpenLayers.LonLat(this.center[0],this.center[1]),this.zoomlevel);
			}
			else {
				var dimensions = this.curLayer.layer.getImageSize();//openlayers.pixel returned
				var newCenter = this.map.getLonLatFromPixel((dimensions.x / 2), (dimensions.y / 2));

				this.map.setCenter(newCenter, this.zoomlevel);
			}
			/*
	if (args.initset && args.initlock) {
				this.applyAnnos(args.initset,args.initlock);
			}
	*/
		},
		enterAnno: function(){
	        if (this.mode == "crop") {
	            this.croplayer.terminate();//get rid of crop boxes
	           // this.exitCropMode();
	        }
	        this.mode = "anno";
			 this.annolayer.createAnno("", {
	                obj: this.annolayer,
	                page: this.page
	            });
	        //this.map.events.register("click", this, this.handleMapClick);
	    },
	    enterCrop: function(){
	        if (this.mode == "anno") { //exit out of annotation mode
	            //this.annolayer.terminate(); //get rid of anno boxes
	           // this.exitAnnoMode();
	        }
	        this.mode = "crop";
			//make a crop box
			this.croplayer.createCropBox({
	                obj: this.croplayer,
	                layer: this.curLayer.layer,
					nextlayer:this.nextLayer.layer
	          });
	        //this.map.events.register("click", this, this.handleMapClick);
	    },
		/**Un-attach listener for appending annotations**/
		exitAnnoMode:function(){
			//this.map.events.unregister('click',this,this.handleMapClick);
			this.mode="none";
			this.exitAnno.fire();
		},
		/**Hard stop for closing down 'clickable' actions on the map**/
		modeHalt:function(e,pass,args){
			args.mode="none";
		},
		onBoxMove:function(e,pass,args){
			var x=pass[0][0];
			var y=pass[0][1];

			var lonlatxy=args.map.getLonLatFromViewPortPx(new OpenLayers.Pixel(x,y));

			args.map.setCenter(lonlatxy);
		},
		// handleMapClick:function(e){
		// 		  if (this.mode == "anno") {
		//             this.annolayer.createAnno(e, {
		//                 obj: this.annolayer,
		//                 page: this.page
		//             });
		//         }
		//         else {
		//             if (this.mode == "crop") {
		// 				
		//                 this.croplayer.createCropBox(e, {
		//                     obj: this.croplayer,
		//                     layer: this.curLayer.layer
		//                 });
		//             }
		//         }
		// 	},
		handleMapUp:function(e,obj){
			var x=YAHOO.util.Event.getPageX(e)-parseInt(YAHOO.util.Dom.getX(obj.DOM),10);
			var y=YAHOO.util.Event.getPageY(e)-parseInt(YAHOO.util.Dom.getY(obj.DOM),10);

			obj.onMapMove.fire({
				xy: {x:x,y:y},
				mapw:parseInt(YAHOO.util.Dom.getStyle(obj.DOM.id,'width'),10),
				maph:parseInt(YAHOO.util.Dom.getStyle(obj.DOM.id,'height'),10)
			});
		},
		/**calls specified curlayer to change opacity**/
		changeDarkness:function(val){
			this.curLayer.changeDarkness(val);
		},
		/**Zooms in if given value is greater than 0, Zooms out if less than zero**/
		zoom:function(val){
			if(val>0){
				this.map.zoomIn();
			} else if(val<0){
				this.map.zoomOut();
			}
			this.zoomlevel=this.map.getZoom();

		},
		exitCropMode:function(){
			//this.map.events.unregister('click',this,this.handleMapClick);
			this.mode="none";
			this.exitCrop.fire();
		},
		applyAnnos:function(set,lock){
			this.annolayer.retrieveAnnos(this.page,set,lock);
		},
		changeAnnoSet:function(set,lock){
			this.annolayer.applyAnnoSet(this.page,set,lock);
		},
		hide:function(){
			/*
	for(v in this.viewlayers){
				layer=this.viewlayers[v];
				layer.layer.setVisibility(false);
			}
	*/
			//hide the map
			this.DOM.hide();
			//YAHOO.util.Dom.setStyle(this.map.div,'display','none');
		},
		show:function(){
			//show the map
			this.DOM.show();
			//YAHOO.util.Dom.setStyle(this.map.div,'display','block');
			/*
	for(v in this.viewlayers){
				layer=this.viewlayers[v];
				layer.layer.setVisibility(true);
			}	
	*/

		},
		darkenMap:function(){
			//all the way opaque?
			if(this.mapopacity<1){
				this.mapopacity+=.1;
				this.DOM.fadeTo(200,this.mapopacity);

				//YAHOO.util.Dom.setStyle(this.map.div,'opacity',this.mapopacity);
			}
		},
		lightenMap:function(){
			//all the way transparent?
			if(this.mapopacity>0.1){
				this.mapopacity-=.1;
				this.DOM.fadeTo(200,this.mapopacity);
				//YAHOO.util.Dom.setStyle(this.map.div,'opacity',this.mapopacity);
			}
		}
	});
	
	/**
	 * SubLayers for main TMS Layer
	 * 
	 * Display further versions of the same image
	 * 
	 * Stored in an array in TMSLayer
	 */
	//receives service version, layername, and url data
	 SubLayer=Monomyth.Class.extend({

		init:function(args){
	 	//extrapolate passed data
		this.serviceVersion=args.sv;
		this.layername=args.layername;//alert("sublayer layername: "+this.layername);
		this.altname=args.altname;
		this.url=args.url;
		this.bounds=new OpenLayers.Bounds(0.0,-2000.0,2000.0,0.0);
		this.loadspan=$("<span class=\"sublayer_loadingspan\">Image Is Loading...</span>");	
		//set options for layer
	 	this.layeroptions={
			bounds:this.bounds,
			serviceVersion:this.serviceVersion,
			layername:this.layername,
			displayInLayerSwitcher:false,
			type:'png',
			visibility:false,
			format: "image/png",
			transitionEffect:"resize"
		};
		//create TMS layer
		this.layer=new OpenLayers.Layer.TMS(this.layername,this.url,this.layeroptions);
		this.DOM=$("#"+this.layer.div.id);

		this.layer.events.register('loadstart',this,this.loadStart);
		this.layer.events.register('loadend',this,this.loadEnd);

		this.opacity=1;
		this.visible=true;
		//always display layer
		//this.layer.display(true);
	 },
	 	loadStart:function(e){
			if (this.layer) {
				//YAHOO.util.Dom.setStyle(this.layer.div, 'visibility', 'hidden');
				$("#"+this.layer.div.id).hide();
				$("#"+this.layer.map.div.id).append(this.loadspan);
			}

		},
		loadEnd:function(e){
			if (this.layer) {
				this.loadspan.remove();
				//this.layer.map.div.removeChild(this.loadspan);
				$("#"+this.layer.div.id).show();
				//YAHOO.util.Dom.setStyle(this.layer.div, 'visibility', '');

			}
		},
		//turn layer on/off
		changeVisibility:function(mode){

			this.layer.setVisibility(mode);
			this.visible=mode;
		},
	 	changeDarkness:function(value){

			if ((this.opacity > 0.1) && (this.opacity < 1.1)) {

				this.opacity=(value>0)?this.opacity+.1:this.opacity-.1;
				this.layer.setOpacity(this.opacity);
			} else {
				//reset
				this.opacity=1;
				this.layer.setOpacity(this.opacity);
			}
		},
		destroy:function(){
			this.layer=null;

		}
	 });
	
	/**
	 * Workspace
	 * 
	 * Creates a dynamic HTML zone for 
	 * creating and managing other 
	 * objects
	 * 
	 * Input:
	 * @param {Object} loc
	 * 	HTML element that Workspace attaches other objects to
	 * 	Must be a valid DOM object
	 * @param {Object} regPath
	 * 	Path (String) that represents the current server location
	 * 	to the root index of the project
	 * 	Ex: http://localhost:8888/quartos/
	 * 
	 * Creates:
	 * 	LoginBar
	 * 	ListenerMgr
	 * 	ProjectBar
	 */

	Workspace = Monomyth.Class.extend({
		init:function(args){
		    this.DOM = $("#"+args.loc);
		    this.header = $("#header");
		    this.header.addClass("header_Archie");
		    this.curPanel = null;
		    this.allPanels = new Array();
		    this.allCrops = new Array();
		    this.allLabels = new Array();

		    //this.setProp = new YAHOO.util.CustomEvent("setProp");
		    this.objects = new Array();
		    this.properties = new Array();
		    this.openProject = "default";
		    this.user = null;
		    this.userid = null;
			this.readytocreate=false;

		}
	});



	/**
	 * Inherits from Workspace.js
	 */

	ArchWorkspace=Workspace.extend({
		init:function(args){
			//call superclass
			this.$super(args);
			this.xmlpath=args.xmlpath;
			this.regPath=args.regpath;
			this.imgDir=args.imgdir;

			this.loadScreen(this);
		},
		loadScreen:function(obj){

			obj.stateMgr = new StateMgr();

		   //obj.login = new LoginBar(obj.header, obj.regPath);

		    obj.projectBar = new ArchProjectBar({
				attach: obj.header,
				qselattach: obj.DOM,
				regPath:obj.regPath
			});

		   	obj.lightbox = new ArchieLightbox($("body"));

			$("body").bind("sizeReady",{obj:obj},function(e,size){
				var obj=e.data.obj;
				obj.lastsize=size;
				obj.readytocreate=true;
			});

			/*
	obj.stateMgr.sizeReady.subscribe(function(e,pass,args){
				args.lastsize=pass[0];
				args.readytocreate=true;
			},obj);
	*/
			//project bar calls

			$("body").bind("openWorksManifest",{obj: obj},obj.findWork);
			$("body").bind("openManifest",{obj:obj},obj.createPanel);
			/*
	$("body").bind('setManifest',{
				obj: obj
			},obj.createPanel);
	*/
			$("body").bind("panelReady",{obj:obj},obj.setPanelCalls);


			//project bar calls
			/*
	obj.projectBar.openWorksManifest.subscribe(obj.findWork,obj);
			obj.projectBar.openManifest.subscribe(obj.createPanel,obj);
		    obj.projectBar.saveToProject.subscribe(obj.screenSnapshot, obj);
		    obj.projectBar.objReady.subscribe(obj.saveLabel, obj);
		    obj.projectBar.objRemove.subscribe(obj.removeLabel, obj);
		    obj.projectBar.setAlert.subscribe(function(g, f, a){
		        a.lightbox.setMessage(f[0]);
		        YAHOO.util.Dom.setStyle(a.lightbox.DOM, "display", "block");
		    }, obj);
	*/
		    //obj.userLoggedIn.subscribe(obj.projectBar.userEnters, obj.projectBar);
		    //obj.changeTopWindow.subscribe(obj.projectBar.topPanel, obj.projectBar);
		    //obj.userLoggedIn.subscribe(obj.login.hide, obj.login);
			$("body").bind("changeTopWindow",{obj:obj.projectBar},obj.projectBar.topPanel);

			$("body").bind(obj.projectBar.remoteButtonClick,{obj:obj},obj.pBarCall);
		    /*
	obj.login.setAlert.subscribe(function(e, j, a){
		        a.lightbox.setMessage(j[0]);
		        YAHOO.util.Dom.setStyle(a.lightbox.DOM, "display", "block");
		    }, obj);

			obj.login.stateOpen.subscribe(function(e,pass,args){
				var a=pass[0].split('/part/');
				var doc=a[0];
				var bib=a[1].replace("comma",",");
				var page=a[2];
				var option={
					readyPage:page,
					manifest:doc,
					bibInfo:bib,
					coords:[80,80],
					project:"default"
				};
				args.openProject='open';

				args.createPanel(e,[option],args);
			},obj);
	*/

			$("body").bind("unloadTrigger",{obj:obj},function(e){
				var obj=e.data.obj;
				if (obj.allPanels.length > 0) {
					var panel=obj.allPanels[obj.allPanels.length-1];
					var width=$("#"+panel.id).width();
					var height=$("#"+panel.id).height();
					obj.stateMgr.rememberSize(width, height);
				}
			});
			$(window).unload(function(e){
				e.stopPropagation();
				$(this).trigger("unloadTrigger");
			});
			obj.stateMgr.checkSize();
		},
		pBarCall:function(e,args){
			//filter out remotebuttonclick calls made from projectBar
			e.stopPropagation();
			var obj=e.data.obj;
			var id=args.id;
			var mode=args.mode;

			//find the panel
			var panel=null;
			if(mode&&(obj.allPanels.length>0)){

				//send to current panel
				obj.curPanel.toolCall("crop");
			}

			return false;
		},
		findWork:function(e,args){
			e.stopPropagation();
			var obj=e.data.obj;
			var manifest=args.manifest;
			var bibInfo=args.bibInfo;
			var readyPage=args.readyPage;
			var panelid=(args.panelid)?args.panelid:null;
			var data=$.ajax({
				dataType:"xml",
				async:false,
				url:manifest
			}).responseXML;
			var section=bibInfo;
			var pages=[];

			var works=$(data).find("work");

			for(w=0;w<works.length;w++){
				var work=$(works[w]);
				var title=work.find("title").text();
				if(title==section){
					work.find('page').each(function(o){
						var pmanifest="./manifest/"+$(this).attr("xml");
						pages.push({pageSuffix:$(this).attr("auth"),pageName:$(this).text(),manifest:pmanifest});
					});

									// 
									// var ps=work.find("page");
									// for(i=0;i<ps.length;i++){
									// 	var page=$(ps[i]);
									// 	var pmanifest="/manifest/"+page.attr("xml");
									// 	pages.push({pageSuffix:$(this).attr("auth"),pageName:page.text(),manifest:pmanifest});
									// }
					//add to options
					args.pages=pages;
					break;
				}
			}
			obj.DOM.trigger("openManifest",[args]);
			return false;
		},
		createPanel:function(e,args){
			e.stopPropagation();
			var obj=e.data.obj;

			if (args.pages && args.bibInfo && args.manifest) {
				var page = (args.readyPage) ? args.readyPage : 1;
				var pages = args.pages;
				// for(pa in pages){
				// 			pages[pa].manifest=obj.regPath+pages[pa].manifest.substring(1);
				// 			
				// 		}
				var id = (args.panelid) ? args.panelid : null;
				var width=(args.width)?args.width:(args.lastsize)?args.lastsize[0]:800;
				var height=(args.height)?args.height:(args.lastsize)?args.lastsize[1]:600;
				var coords=(args.coords)?args.coords:[10,30];

				panel = new ArchiePanel({
					url:'./lib/Archie_Panel/ArchiePanel.php',
					id: id,
					desktop: obj.DOM,
					manifest:args.manifest,
					xmlpath:obj.xmlpath,
					pages:pages,
					readyPage: page,
					bibInfo: args.bibInfo,
					project: obj.openProject,
					coords: coords,
					width:width,
					height:height,
					user: obj.user,
					userid: obj.userid,
					zoom: 2,
					menuType:args.menuType
				});

			}
			return false;
		},
		setPanelCalls:function(e,panel){

				var obj=e.data.obj;
				obj.curPanel = panel;
				//set property values
				var properties=(obj.options)?obj.options:null;

				//assign listeners
				obj.DOM.bind(panel.closeSelf,{obj:obj},obj.delPanel);
				/*
	panel.closeSelf.subscribe(function(f, a, b){
					b.delPanel(b, a[0].panel, a[0].mode);
				}, obj);
	*/

				$("body").bind(obj.projectBar.remoteButtonClick,{obj:obj},panel.toolCall);
				//obj.projectBar.remoteButtonClick.subscribe(panel.toolCall, panel);
				//obj.projectBar.terminateListen.subscribe(panel.exitListeners, panel);
				//obj.stopFunctioning.subscribe(panel.stopFunctions, panel);
				obj.DOM.bind(panel.resetHeader,{obj:obj},obj.resetPublicBox);
				obj.DOM.bind(panel.panelClicked,{obj:obj},obj.selectPanel);
				/*
	panel.resetHeader.subscribe(function(f, a, b){
					b.projectBar.resetPublicBox(b.projectBar);
				}, obj);

				panel.content.cropBoxIsOpen.subscribe(function(f, a, b){
					px = YAHOO.util.Dom.getX(a[0].DOM);
					py = YAHOO.util.Dom.getY(a[0].DOM);
					for (c in b.allCrops) {
						x = YAHOO.util.Dom.getX(b.allCrops[c].DOM);
						y = YAHOO.util.Dom.getY(b.allCrops[c].DOM);
						if ((x == px) || (y == py)) {
							YAHOO.util.Dom.setX(a[0].DOM, (x + 30));
							YAHOO.util.Dom.setY(a[0].DOM, (y + 30));
						}
					}
					a[0].closedCrop.subscribe(function(g, j, u){
						for (p in u.allCrops) {
							if (u.allCrops[p].DOM.id == j[0].DOM.id) {
								var v = u.allCrops.slice(0, p);
								var z = u.allCrops.slice(p, (u.allCrops.length - 1));
								z.shift();
								u.allCrops = v.concat(z);
								break;
							}
						}
					}, b);
					if (YAHOO.env.ua.ie > 0) {
						b.allCrops[b.allCrops.length] = a[0];
					}
					else {
						b.allCrops.push(a[0]);
					}
				}, obj);
				panel.panelClicked.subscribe(obj.selectPanel, obj);
				panel.panelClicked.subscribe(obj.projectBar.panelClicked, obj.projectBar);

				*/

				obj.allPanels[obj.allPanels.length] = panel;


				//panel.setPanelAlert.subscribe(obj.setLightBox, obj);
				//obj.changeTopWindow.fire(panel.DOM.id);
				//set on stack of panels
				var zindex=100+obj.allPanels.length;
				panel.DOM.css("z-index",zindex);
				return false;
			},
			selectPanel:function(e,panel){
				e.stopPropagation();
				var obj=e.data.obj;

				if(obj.allPanels.length>0){

					//var panelindex=parseInt(YAHOO.util.Dom.getStyle(panel.DOM,'z-index'))-100;
					if (!(panel.DOM.attr("id") == obj.curPanel.DOM.attr("id"))) {
						//need to rotate z-index of panels
						obj.rotatePanels(panel);
					}
				}
				return false;
			},
			rotatePanels:function(toppanel){
				var temp=[];
				for(p=0;p<this.allPanels.length;p++){
					var panel=this.allPanels[p];
					if(!(panel.DOM.attr("id")==toppanel.DOM.attr("id"))){
						temp.push(panel);
					} 
				}
				temp.push(toppanel);
				this.curPanel=toppanel;
				this.DOM.trigger("changeTopWindow",[toppanel]);
				for(t=0;t<temp.length;t++){
					var panel=temp[t];
					panel.DOM.css("z-index",(100+t));
					//YAHOO.util.Dom.setStyle(panel.DOM,'z-index',(100+t));
				}
			},
			delPanel:function(e,panel){
				e.stopPropagation();
				var obj=e.data.obj;

				if(obj.user) obj.stateMgr.removeItem("win", panel);
			    delId = panel.DOM.attr("id");
			    if (obj.allPanels.length == 1) {
			        obj.allPanels = [];
			        //panel.DOM.remove();
			    }
			    else {
			        var b = [];
			        for (p = 0; p < obj.allPanels.length; p++) {
			            if (obj.allPanels[p].DOM.attr("id") == delId) {
			                //panel.DOM.remove();
			            }
			            else {
			                b.push(obj.allPanels[p]);
			            }
			        }
			        obj.allPanels = b;
			    }
				return false;
			},
			restoreState:function(){

	    		/*
	var callback = {
	        	success: function(o){
		            var data = o.responseText.split("\n");
		            var obj = o.argument[0];
		            var panels = [];
		            var D = [];
		            var f = [];
		            for (i = 0; i < data.length; i++) {
		                var record = data[i].split("%");
		                if ((record[1]) && (record[1].length > 0)) {
		                    switch (record[0]) {
		                        case "win":
		                            var id = record[1];
		                            var E = [record[3], record[4]];
		                            var C = parseInt("" + record[10]);
		                            var B = record[11].split(",");

		                            panels[panels.length] = {
		                                panelid: id,
		                                coords: E,
		                                zoom: C,
		                                center: B,
		                                manifest: record[2],
		                                width: record[5],
		                                height: record[6],
		                                readyPage: record[7],
		                                bibInfo: record[8],
		                                project: record[9]
		                            };
		                            break;
		                        case "crop":
		                            var G = [record[1], record[2], record[3], record[4], record[5], record[6], record[7], record[8], record[9], record[10]];
		                            D[D.length] = G;
		                            break;
		                        case "label":
		                            var F = [record[1], record[2], record[3], record[4], record[5], record[6]];
		                            f[f.length] = F;
		                            break;
		                    }
		                }
	           		 }
		            obj.startrestore({
		                p: panels,
		                c: D,
		                l: f
		            });
		        },
		        failure: function(o){
		            alert("Error in retrieving data from server");
		        },
		        argument: [this]
		    };
		    var j = YAHOO.util.Connect.asyncRequest("GET", "./lib/StateMgr/sessionWindowMgr.php?mode=get", callback);
		    setTimeout(function(){
		        if (YAHOO.util.Connect.isCallInProgress(j)) {
		            YAHOO.util.Connect.abort(j);
		        }
		    }, 500);
	*/
		},
		startrestore:function(args){
			var panels=args.p;
			for(p=0;p<panels.length;p++){
				this.findWork("",[panels[p]],this);
			}
		}
	});

	/**
	 * Creates an OpenLayers.Layer Box layer that is used as the base for 
	 * determining where crops are made
	 */

	CropLayer = Monomyth.Class.extend({
		init:function(args){
	    this.layer = new OpenLayers.Layer.Boxes(args.name, {
	        displayInLayerSwitcher: false
	    });
	    this.page = 1;

	    this.boxes = [];
	    this.boxlonlat = 0;
		this.cropBox=null;
	    /*
	this.attachAnno = new YAHOO.util.CustomEvent("attachAnno");
	    this.exitCrop = new YAHOO.util.CustomEvent("exitcrop");
	    this.cropReady = new YAHOO.util.CustomEvent("cropready");
		this.stopCropListen=new YAHOO.util.CustomEvent("stopCropListen");
	*/
	    this.mousePos = args.mouse;
	    this.doc = args.doc;
	},
	    createCropBox: function(args){
	        var obj = args.obj;
			if (!obj.cropBox) {
				//stop if box already present
				var layer = args.layer;
				var nextlayer=args.nextlayer;
				var mapcenter=layer.getExtent().getCenterLonLat();

		       obj.cropBox = new CropLayerBox(mapcenter, layer, nextlayer, obj.mousePos);
		        obj.layer.addMarker(obj.cropBox.box);
				obj.cropBox.setContents();
			} else {
				var center=obj.layer.map.getCenter();
				var bounds=new OpenLayers.Bounds(center.lon,(center.lat+1000),(center.lon+1000),center.lat)
				obj.cropBox.activate(bounds);
			}

	    },
	    exitCropMode: function(){
	        this.exitCrop.fire();
	    },
	    terminate: function(){
	        if (this.layer.markers.length > 0) {
	            for (i = 0; i < this.layer.markers.length; i++) {
	                this.layer.removeMarker(this.layer.markers[i]);
	            }
	        }
	    },
	    destroy: function(e, pass, args){
	        var box = pass[0];
	        args.layer.removeMarker(box);

	    }
	});
	
	
	ARCHIE.ArchiePanelContent=ArchiePanelContent;
	ARCHIE.TMSContent=TMSContent;
	ARCHIE.OverMap=OverMap;
	ARCHIE.ArchOverMap=ArchOverMap;
	ARCHIE.StateMgr=StateMgr;
	ARCHIE.ArchieLightbox=ArchieLightbox;
	ARCHIE.ArchSelect=ArchSelect;
	ARCHIE.bWorks=bWorks;
	ARCHIE.WorkItem=WorkItem;
	ARCHIE.AuthorItem=AuthorItem;
	ARCHIE.ProjectBar=ProjectBar;
	ARCHIE.ArchProjectBar=ArchProjectBar;
	ARCHIE.DropDown=DropDown;
	ARCHIE.ArchDropDown=ArchDropDown;
	ARCHIE.Panel=Panel;
	ARCHIE.ArchiePanel=ArchiePanel;
	ARCHIE.PageText=PageText;
	ARCHIE.ArchPageText=ArchPageText;
	ARCHIE.CropBox=CropBox;
	ARCHIE.cropButton=cropButton;
	ARCHIE.CropLayerBox=CropLayerBox;
	ARCHIE.OverlaySwitcher=OverlaySwitcher;
	ARCHIE.OverlayItem=OverlayItem;
	ARCHIE.TMSLayer=TMSLayer;
	ARCHIE.SubLayer=SubLayer;
	ARCHIE.CropLayer=CropLayer;
	ARCHIE.Workspace=Workspace;
	ARCHIE.ArchWorkspace=ArchWorkspace;
})(jQuery);



//function object to use for generating random IDS
function MakeRandomId(){
	var startseed=(Math.random())*1000;
	var endseed=startseed.toPrecision(3);
	return endseed;
}

/**
 * Loading Tiers
 * Loads scripts using the JQ .getScript()
 * 
 * 
 */
//FIRST TIER OF LOADING
//$.getScript("./lib/ArchWorkspace/ArchWorkspace.js",function(){
	//SECOND TIER OF LOADING
	$(function(){
		//create a loadscreen for users
		var load=$("<div class=\"load\"><p>Loading Interface...</p></div>");
		$("#workspace").append(load);
		var loadprogress=$("<div id=\"loadpBar\" class=\"testPBAR\"></div>");
		load.append(loadprogress);
		loadprogress.progressbar({value:25});
		/*
$.getScript("./lib/StateMgr/stateMgr.js");
		$.getScript("./lib/ArchieLightbox/ArchieLightbox.js");
		$.getScript("./lib/ArchSelect/ArchSelect.js");
		$.getScript("./lib/ArchProjectBar/ArchProjectBar.js");
		$.getScript("./lib/ArchDropDown/ArchDropDown.js");
		$("#loadpBar").progressbar('option','value','45');
		$.getScript("./lib/Archie_Panel/ArchiePanel.js");
		$.getScript("./lib/Crop/crop.js");		
		$.getScript("./lib/CropLayerBox/CropLayerBox.js");
		$("#loadpBar").progressbar('option','value','55');
		$.getScript("./lib/ArchPageText/ArchPageText.js");
		$.getScript("./lib/OverMap/ArchOverMap.js");
		$.getScript("./lib/OverlaySwitcher/OverlaySwitcher.js");
		$.getScript("./lib/ArchiePanelContent/TMSContent.js");
	
		$.getScript("./lib/TMSLayer/TMSLayer.js");
		
		$("#loadpBar").progressbar('option','value','75');
		$.getScript("./lib/CropLayer/CropLayer.js");
*/
		/*
$.getScript("./lib/TMSLayer/SubLayer.js",function(){
*/
		
		$("#loadpBar").progressbar('option','value','98');
				
			setTimeout(function(){
					$(function(){
						var data = $.ajax({
							async: false,
							dataType: "text",
							url: "./Global_Files/findDomain.php"
						}).responseText;
						
						data=data.split("%");
						var rp = data[0];
						IMGDIR = data[1];
						var xpath = data[2];
						//header=document.getElementById("header");
						$(".load").remove();
						var desktop = new ArchWorkspace({
							loc: "workspace",
							regpath: rp,
							imgdir: IMGDIR,
							xmlpath: xpath
						});

					});
				
			}, 200);
		});
	//});
//});

//$.getScript("./lib/ArchieLoad/ArchieGlobalFunctions.js");