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
