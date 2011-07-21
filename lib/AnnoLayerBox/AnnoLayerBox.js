AnnoLayerBox = function(points, layer, mouse, page){
    this.bounds = new OpenLayers.Bounds();
    this.bounds.extend(points);
    this.bounds.extend(new OpenLayers.LonLat((points.lon + 100), (points.lat + 100)));
    this.layer = layer;
    this.page = page;
    this.mousePos = mouse;
    this.box = new OpenLayers.Marker.Box(this.bounds, "red", 2);
    this.DOM = this.box.div;
    this.drag = null;
    this.resize = null;
    this.text = "";
    this.infobox = null;
    this.makeDraggable();
    this.attachAnnoBox();
    this.annoSaved = new YAHOO.util.CustomEvent("annoSaved");
    this.footnoteDestroyed = new YAHOO.util.CustomEvent("footnotedestroyed");
    this.footnotecancelled = new YAHOO.util.CustomEvent("footnotecancelled");
    this.box.events.includeXY = true;
};
AnnoLayerBox.prototype = {
    makeDraggable: function(){
        if ((!(this.drag)) && (!(this.resize))) {
            this.drag = new YAHOO.util.DD(this.DOM.id);
            this.resize = new YAHOO.util.Resize(this.box.div, {
                handles: "br"
            });
            if (YAHOO.env.ua.ie > 0) {
                YAHOO.util.Dom.setStyle(this.box.div, "z-index", "1001");
                YAHOO.util.Dom.setStyle(this.box.div, "background", "red");
                this.handle = document.createElement("div");
                YAHOO.util.Dom.generateId(this.handle, "hl");
                this.handle.className = "alb_handle";
                this.box.div.appendChild(this.handle);
                if (YAHOO.env.ua.ie > 6) {
                    YAHOO.util.Dom.setStyle(this.box.div, "filter", "alpha(opacity=40)");
                }
                else {
                    if (YAHOO.env.ua.ie == 6) {
                        YAHOO.util.Dom.setStyle(this.box.div, "filter", "alpha(opacity=40)");
                    }
                }
            }
 
            this.drag.on("endDragEvent", function(e, obj){
                var x = parseInt(YAHOO.util.Dom.getX(obj.box.div)) - parseInt(YAHOO.util.Dom.getX(obj.layer.map.div));
                var y = parseInt(YAHOO.util.Dom.getY(obj.box.div)) - parseInt(YAHOO.util.Dom.getY(obj.layer.map.div));
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
                var x = parseInt(YAHOO.util.Dom.getX(obj.box.div)) - parseInt(YAHOO.util.Dom.getX(obj.layer.map.div));
                var y = parseInt(YAHOO.util.Dom.getY(obj.box.div)) - parseInt(YAHOO.util.Dom.getY(obj.layer.map.div));
                var w = x + parseInt(YAHOO.util.Dom.getStyle(obj.box.div, "width"));
                var h = y + parseInt(YAHOO.util.Dom.getStyle(obj.box.div, "height"));
                var wh = obj.layer.getLonLatFromViewPortPx(new OpenLayers.Pixel(w, h));
                var xy = obj.layer.getLonLatFromViewPortPx(new OpenLayers.Pixel(x, y));
                obj.bounds.extend(xy);
                obj.bounds.extend(wh);
                obj.box.bounds = obj.bounds;
            }, this);
        }
    },
    attachAnnoBox: function(){
        this.anno = new Annotation();
        this.anno.saveAnnoCall.subscribe(function(e, pass, args){
            var params = {
                obj: args,
                box: args.box,
                bounds: args.bounds,
                text: args.anno.textInput.value,
                setId: args.anno.annoId,
                security: args.anno.publicMode,
                page: args.page
            };
            args.annoSaved.fire(params);
        }, this);
        this.anno.annoClosed.subscribe(this.removeMarker, this);
        document.getElementsByTagName("body")[0].appendChild(this.anno.DOM);
        YAHOO.util.Dom.setStyle(this.anno.DOM, "top", "80px");
    },
    createMarker: function(args){
        this.drag.lock();
        this.resize.destroy();
        this.dbid = args.id;
        this.bounds = new OpenLayers.Bounds();
        this.bounds.extend(new OpenLayers.LonLat(args.left, args.bottom));
        this.bounds.extend(new OpenLayers.LonLat(args.right, args.top));
        this.box = new OpenLayers.Marker.Box(this.bounds, "red");
        this.layer.addMarker(this.box);
        YAHOO.util.Dom.setStyle(this.box.div, "border", "none");
        YAHOO.util.Dom.setStyle(this.box.div, "background-color", "red");
        if (YAHOO.env.ua.ie == 0) {
            YAHOO.util.Dom.setStyle(this.box.div, "opacity", "0.55");
        }
        if (YAHOO.env.ua.ie > 6) {
            YAHOO.util.Dom.setStyle(this.box.div, "filter", "alpha(opacity=40)");
        }
        else {
            if (YAHOO.env.ua.ie == 6) {
                YAHOO.util.Dom.setStyle(this.box.div, "filter", "alpha(opacity=40)");
            }
        }
        document.getElementsByTagName("body")[0].removeChild(this.anno.DOM);
        this.anno.saveAnnoCall.unsubscribeAll();
        this.anno.annoClosed.unsubscribeAll();
        this.anno = null;
        this.infobox = new InfoPopUp(args.id, args.comment, args.lock, "image");
        document.getElementsByTagName("body")[0].appendChild(this.infobox.DOM);
        YAHOO.util.Dom.setStyle(this.infobox.DOM, "top", "80px");
        this.infobox.deleteFootnote.subscribe(this.destroy, this);
        this.box.events.register("click", this, function(e){
            this.infobox.showWin(e, this.infobox);
        });
    },
    saveMarker: function(e){
        this.security = this.anno.publicMode;
        this.setId = this.anno.annoId;
        document.getElementsByTagName("body")[0].removeChild(this.anno.DOM);
        this.saveAnnoCall.fire(this);
    },
    changeMarker: function(e, args){
        this.drag.lock();
        this.resize.destroy();
        this.dbid = args.id;
        YAHOO.util.Dom.setStyle(this.box.div, "border", "none");
        YAHOO.util.Dom.setStyle(this.box.div, "background-color", "red");
        YAHOO.util.Dom.setStyle(this.box.div, "opacity", "0.55");
        if (YAHOO.env.ua.ie > 6) {
            YAHOO.util.Dom.setStyle(this.box.div, "filter", "alpha(opacity=.40)");
        }
        else {
            if (YAHOO.env.ua.ie == 6) {
                YAHOO.util.Dom.setStyle(this.box.div, "filter", "alpha(opacity=40)");
            }
        }
        this.text = this.anno.textInput.value;
        this.infobox = new InfoPopUp(this.dbid, this.text, args.security, "image");
        YAHOO.util.Dom.setStyle(this.infobox.DOM, "top", "80px");
        document.getElementsByTagName("body")[0].appendChild(this.infobox.DOM);
        this.box.events.register("click", this, function(e){
            this.infobox.showWin(e, this.infobox);
        });
        this.infobox.deleteFootnote.subscribe(this.destroy, this);
        document.getElementsByTagName("body")[0].removeChild(this.anno.DOM);
        this.anno.saveAnnoCall.unsubscribeAll();
        this.anno.annoClosed.unsubscribeAll();
        this.anno = null;
    },
    removeMarker: function(e, pass, args){
        args.layer.removeMarker(args.box);
        args.footnotecancelled.fire(args);
        document.getElementsByTagName("body")[0].removeChild(args.anno.DOM);
        args.annoSaved.unsubscribeAll();
        args.anno.saveAnnoCall.unsubscribeAll();
        args.anno.annoClosed.unsubscribeAll();
    },
    destroy: function(e, pass, args){
        args.footnoteDestroyed.fire(args);
        args.layer.removeMarker(args.box);
        if (args.infobox) {
            document.getElementsByTagName("body")[0].removeChild(args.infobox.DOM);
            args.layer.div.removeChild(args.infobox.DOM);
        }
    }
};
