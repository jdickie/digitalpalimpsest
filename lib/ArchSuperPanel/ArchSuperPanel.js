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
		
		obj.DOM.draggable({
			handle:("#"+obj.quartoInfoDiv.attr("id")),
			containment:'parent',
			iFrameFix:true
			
		});
		/*
obj.quartoInfoDiv.bind('mouseover',{obj:obj},function(e){
			e.stopPropagation();
			var obj=e.data.obj;
			obj.DOM.resizable('disable');
			obj.DOM.draggable('enable');
			return false;
		});
		obj.quartoInfoDiv.bind('mouseout',{obj:obj},function(e){
			e.stopPropagation();
			var obj=e.data.obj;
			obj.DOM.draggable('disable');
			obj.DOM.resizable('enable');
			return false;
		});
*/
		
		
		
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
		
		this.content.adjustResize(this.content, panelWidth, panelHeight, (headerOffset));
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