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
		
		this.content.adjustResize(this.content, panelWidth, panelHeight, (headerOffset+1));
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