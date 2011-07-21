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
