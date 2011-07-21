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
