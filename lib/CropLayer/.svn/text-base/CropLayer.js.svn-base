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
