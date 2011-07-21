/**
 * Create a Div to contain an OpenLayers map object
 * 
 * Input: 
 * 	loc (Object): DOM object to attach div to
 * 
 * Outpu:
 * 	HTML DOM object with OpenLayers map attached - along with layer
 */

ArchieOpenLayer=function(args,loc){
	this.DOM=document.createElement("div");
	YAHOO.util.Dom.generateId(this.DOM,'map');
	YAHOO.util.Dom.setStyle(this.DOM,'height','100%');
	this.DOM.className="mapDiv";
	//set up options for the map - set to defaults
	this.resolutions = "";
    this.maxExtent = "";
   	this.tileSize = "";
    this.options = {};
    //set map to null - created later
	this.map = null;
	
	//Other variables
	this.imgBase=args.base;
	this.image="";
	this.doc=args.doc; //manifest filename
	this.curLayer=null;
	this.mouseControl=new OpenLayers.Control.MousePosition();
	this.annoLayer=new AnnoLayer({name:"Annotations",mouse:this.mouseControl,doc:this.doc});
	this.zoomlevel=0;
	this.zoomMax=0;
	this.opacity=1;
	//objects for storing special crop and annotation 
	//boxes
	this.annobox=null;
	this.cropbox=null;
	
	this.exitAnno=new YAHOO.util.CustomEvent('exitAnno');
	this.exitCrop=new YAHOO.util.CustomEvent('exitCrop');
	//register openlayers marker layer with an onclick property
	
	loc.appendChild(this.DOM);
}
ArchieOpenLayer.prototype={
	/**Set new layer**/
	showPage:function(img,page){
		this.annoLayer.page=page;
		this.image=img;
		if (this.map) {
			this.zoomlevel = this.map.getZoom();
		}
		if(this.curLayer){
			this.curLayer.destroy(); //removes the layer and all popups associated with it
		}
		this.getMetadata();
		
	},
	changeDarkness:function(value){
		if ((this.opacity > 0) && (this.opacity < 1.1)) {
			this.opacity+=value;
			layers = this.map.layers;
			for (i = 0; i < layers.length; i++) {
				layer = layers[i];
				layer.setOpacity(parseFloat(this.opacity));
			}
		} else {
			//reset
			this.opacity=1;
			layers = this.map.layers;
			for (i = 0; i < layers.length; i++) {
				layer = layers[i];
				layer.setOpacity(parseFloat(this.opacity));
			}
		}
	},
	/**Get metadata and then add on layer**/
	getMetadata:function(){
		//call metadata function and attach new layer
		var fullimage='http://localhost:8888/'+this.imgBase+this.image;
		url='./lib/Djatoka_resources/getMetadata.php?url='+fullimage;
		callback={
			success:function(o){
				var obj=o.argument.obj;
				var img=o.argument.image;
				var imgMeta=eval('('+o.responseText+')');
				var metadataUrl = "http://localhost:8888/lib/Djatoka_resources/getMetadata.php?url="+img;
				obj.curLayer=new OpenLayers.Layer.OpenURL("OpenURL", "http://localhost:8083", {layername: 'basic', format:"img/jpeg",rft_id:img, imgMetadata: imgMeta, metadataUrl: metadataUrl} );
				obj.metadata = imgMeta;
				//initial options should be changed based on new metadata
			    obj.resolutions = obj.curLayer.getResolutions();
			    obj.maxExtent = new OpenLayers.Bounds(0, 0, obj.metadata.width, obj.metadata.height);
			    obj.tileSize = obj.curLayer.getTileSize();
			    obj.options = {resolutions: obj.resolutions, maxExtent: obj.maxExtent, tileSize: obj.tileSize};
				if(!obj.map){
					obj.map = new OpenLayers.Map(obj.DOM.id,obj.options);
					obj.map.addLayer(obj.annoLayer.layer);
					
					obj.annoLayer.exitMode.subscribe(function(e,pass,args){args.exitAnnoMode();},obj);
					//add additional controls to the map
					obj.map.addControl(obj.mouseControl);
			   		//obj.map.addControl(new OpenLayers.Control.MouseDefaults());
					obj.map.addControl(new OpenLayers.Control.LayerSwitcher());
				} else {
					obj.map.setOptions(obj.options);//sets new options
				}
				
			   //add Layer to the map
			  	obj.map.addLayer(obj.curLayer);
				obj.map.setBaseLayer(obj.curLayer);
				
				var newCenter=new OpenLayers.LonLat((obj.metadata.width/2),(obj.metadata.height/2));
				obj.map.setCenter(newCenter,1);
				obj.map.zoomTo(obj.zoomlevel);
				
			},
			failure:function(o){obj.setAlert.fire("OpenURL failed");},
			argument:{obj:this,image:fullimage}
		}

		connect=YAHOO.util.Connect.asyncRequest('GET',url,callback);
	},
	/**Called by OpenLayers.Events to handle clicks to Map**/
	handleMapClick:function(e){
		this.annoLayer.createAnno(e,this.annoLayer);
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
	/**Crop a portion (returns a getRegion command from Djatoka)**/
	crop:function(){
		
	},
	initCropMode:function(){
		
	},
	/**Attach listener for appending Annotations with mouse click**/
	initAnnoMode:function(){
		//add listener to append a Marker every time user clicks on DOM surface
		//this.annoLayer.enterAnnoMode();
		this.map.events.register('click',this,this.handleMapClick);
		//YAHOO.util.Event.addListener(this.DOM.id,"click",this.annoLayer.createAnno,this.annoLayer);
		//set z-index to zero on current layer, more on annolayer
		if(this.curLayer.getZIndex()>0){
			this.curLayer.setZIndex(-1);
			this.annoLayer.setZIndex(999);
		}
		
		
	},
	/**Un-attach listener for appending annotations**/
	exitAnnoMode:function(){
		this.map.events.unregister('click',this,this.handleMapClick);
		this.exitAnno.fire();
	},
	/**
	 * Call the annolayer's function for loading and displaying annotations
	 * from the database
	 */
	applyAnnos:function(page,set,lock){
		this.annoLayer.retrieveAnnos(page,set,lock);
	}
}
