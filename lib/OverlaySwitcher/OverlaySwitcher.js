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
