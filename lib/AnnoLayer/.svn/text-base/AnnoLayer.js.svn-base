/**
 * Using OpenLayers.Layer.Boxes to create an annotation system
 * 
 * Args Contains:
 * name - Name - name of layer
 * 
 *
 */
AnnoLayer=function(args){
	this.layer=new OpenLayers.Layer.Boxes(args.name);
	this.page=1;
	this.set="default";
	this.annobox=null;
	this.boxes=[];//array for storing boxes attached to the layer
	this.boxlonlat=0;//lonlat for storing box position
	this.attachAnno="attachAnno";
	this.exitMode="exitMode";
	this.stopAnnoListen="stopAnnoListen";
	/*
this.attachAnno=new YAHOO.util.CustomEvent("attachAnno");
	this.exitMode=new YAHOO.util.CustomEvent("exitmode");
	this.stopAnnoListen=new YAHOO.util.CustomEvent("stopAnnoListen");
*/
	this.mousePos=args.mouse;
	this.doc=args.doc;
	this.topLayer=(args.topLayer)?args.topLayer:null;
}
AnnoLayer.prototype={
	setTopLayer:function(id){
		this.topLayer=id;
	},
	enterAnnoMode: function(){
        
		//YAHOO.util.Event.addListener(this.layer.div, "click", this.createAnno, this);
    },
    exitAnnoMode: function(){
        this.exitMode.fire();
		this.stopAnnoListen.fire();
    },
    createAnno: function(e, args){
        YAHOO.util.Event.stopPropagation(e);
        var obj = args.obj;
        var page = args.page;
    
       /*
 var f = YAHOO.util.Event.getPageX(j);
        var c = YAHOO.util.Event.getPageY(j);
        h.boxlonlat = h.layer.getLonLatFromViewPortPx(j.xy);
*/
		//var layer=obj.layer.map.getLayerById(obj.topLayer);
		var mapcenter=obj.layer.map.getCenter();
        obj.annobox = new AnnoLayerBox(mapcenter, obj.layer, obj.mousePos, page);
        obj.layer.addMarker(obj.annobox.box);
        obj.annobox.annoSaved.subscribe(obj.saveAnno, obj);
        obj.annobox.footnotecancelled.subscribe(function(e, pass, args){
            args.annobox = null;
        }, obj);
        obj.exitAnnoMode();
		
    },
    saveAnno: function(E, c, j){
        var D = c[0].box;
        var f = c[0].text;
        var w = c[0].setId;
        this.set = w;
        var G = j.doc;
        var p = c[0].page;
        var C = c[0].bounds.toArray();
        var B = C[0] + "," + C[1] + "," + C[2] + "," + C[3];
        var k = c[0].security;
        this.lock = true;
        var m = YAHOO.util.Dom.getElementsBy(function(e){
            if (e.selected == true) {
                return e;
            }
        }, "option", YAHOO.util.Dom.getElementsByClassName("dropDown")[0]);
        var l = m[0].firstChild.nodeValue;
        var u = j.layer.map.getLayer(j.topLayer).div;
        var A = u.getElementsByTagName("div");alert('divs in baselayer: '+A.length);
        var v = j.layer.map.getViewPortPxFromLonLat(new OpenLayers.LonLat(C[0], C[1]));
        var q = A[0].getElementsByTagName("img")[0].src;
        var b = parseInt(YAHOO.util.Dom.getStyle(D.div, "left"));
        var a = parseInt(YAHOO.util.Dom.getStyle(D.div, "top"));
        for (i = 0; i < A.length; i++) {
            var h = A[i];
            var t = parseInt(YAHOO.util.Dom.getStyle(h, "left"));
            var s = parseInt(YAHOO.util.Dom.getStyle(h, "top"));
            var F = parseInt(YAHOO.util.Dom.getStyle(h, "width")) + t;
            var r = parseInt(YAHOO.util.Dom.getStyle(h, "height")) + s;
            if ((b >= t) && (a >= s) && (a <= r) && (b <= F)) {
                q = h.getElementsByTagName("img")[0].src;
                b = Math.abs(b - t);
                a = Math.abs(a - s);
                break;
            }
        }
        var z = "?src=" + q + "AMPERsrcx=" + b + "AMPERsrcy=" + a + "AMPERsrcw=" + parseInt(YAHOO.util.Dom.getStyle(D.div, "width")) + "AMPERsrch=" + parseInt(YAHOO.util.Dom.getStyle(D.div, "height"));
        c[0].annolayer = j;
        var n = "./lib/AnnoLayerBox/saveMarker.php?text=" + f + "&set=" + w + "&coords=" + B + "&page=" + p + "&security=" + k + "&doc=" + G + "&sigvalue=" + l + "&link=" + q + "&crpsrc=" + z;
        alert(z+'     '+n);
		j.boxes[j.boxes.length] = j.annobox;
        j.annobox = null;
        var o = {
            success: function(H){
                var y = H.argument[0].obj;
                var x = H.argument[0].annolayer;
                var e = H.argument[0].security;
                var I = H.responseText;
                y.changeMarker("", {
                    security: e,
                    id: I
                });
                x.clearLayer();
                x.retrieveAnnos(H.argument[0].page, H.argument[0].setId, true);
            },
            failure: function(e){
                alert("");
            },
            argument: [c[0]]
        };
        var g = YAHOO.util.Connect.asyncRequest("GET", n, o);
    },
    destroyNote: function(g, f, c){
        var j = f[0].dbid;
        var b = "./lib/AnnoLayerBox/deleteMarker.php?id=" + j;
        var h = {
            success: function(){
            },
            failure: function(){
            }
        };
        var a = YAHOO.util.Connect.asyncRequest("GET", b, h);
        setTimeout(function(){
            if (YAHOO.util.Connect.isCallInProgress(a)) {
                YAHOO.util.Connect.abort(a);
            }
        }, 10000);
    },
    removeAnno: function(c, b, a){
        a.layer.div.removeChild(a.annobox.DOM);
        a.layer.div.removeChild(a.annobox.box.DOM);
        a.annobox = null;
    },
    retrieveAnnos: function(e, g, c){
        this.set = g;
        this.lock = c;
        var b = "./lib/AnnoLayerBox/loadMarker.php?doc=" + this.doc + "&page=" + e + "&set=" + g;
        var f = {
            success: function(h){
                obj = h.argument[0];
                c = h.argument[1];
                data = h.responseText.split("\n");
                obj.clearLayer();
                for (d in data) {
                    marker = data[d].split("%");
                    if (marker.length > 1) {
                        points = marker[2].split(",");
                        box = new AnnoLayerBox(new OpenLayers.LonLat(points[0], points[1]), obj.layer, null);
                        box.createMarker({
                            left: points[0],
                            bottom: points[1],
                            right: points[2],
                            top: points[3],
                            comment: marker[1],
                            id: marker[0],
                            lock: c
                        });
                        box.footnoteDestroyed.subscribe(obj.destroyNote, obj);
                        obj.boxes.push(box);
                    }
                }
            },
            failure: function(h){
                alert("Failure in retrieving Annotations");
            },
            argument: [this, c]
        };
        var a = YAHOO.util.Connect.asyncRequest("GET", b, f);
    },
    applyAnnoSet: function(b, c, a){
        this.clearLayer();
        this.retrieveAnnos(b, c, a);
    },
    clearLayer: function(){
        for (i = 0; i < this.boxes.length; i++) {
            box = this.boxes[i];
            this.layer.removeMarker(box.box);
        }
        this.boxes = [];
    },
    terminate: function(){
        if (this.annobox) {
            this.annobox.removeMarker(null, null, this.annobox);
            this.annobox = null;
        }
    }
}
