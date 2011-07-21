PJSContent = function(args){
    PJSContent.superclass.constructor.call(this, args);
    this.startzoom = args.zoom;
    this.startcenter = args.center;
};
extendOS(PJSContent, ArchiePanelContent, {
    init: function(manifest){
        this.docId = manifest;
        var callback = {
            success: function(o){
                var obj = o.argument.obj;
                var img = o.argument.image;
                var manDom = o.responseXML;
                var doc = manDom.documentElement;
                obj.base = doc.getAttribute("base");
                obj.imageDir = imgdir + obj.base;
                obj.xmlDir = xmldir + "XML_" + obj.base;
                obj.pages = [];
                var pagesArray = doc.getElementsByTagName("page");
                for (p = 0; p < pagesArray.length; p++) {
                    if (pagesArray.item(p).getElementsByTagName("img").item(0).firstChild) {
                        img = pagesArray.item(p).getElementsByTagName("img").item(0).firstChild.nodeValue;
                    }
                    else {
                        curr = p + 1;
                        img = obj.docId.replace("manifest.xml", "0" + curr + ".jpg");
                    }
                    img = img.substring(0, img.lastIndexOf("."));
                    text = {
                        v: pagesArray.item(p).getElementsByTagName("ver").item(0).getElementsByTagName("xml")[0].firstChild.nodeValue,
                        r: pagesArray.item(p).getElementsByTagName("rec").item(0).getElementsByTagName("xml")[0].firstChild.nodeValue
                    };
                    sig = pagesArray.item(p).getElementsByTagName("ver").item(0).getAttribute("sig") + pagesArray[p].getElementsByTagName("rec")[0].getAttribute("sig");
                    page = {
                        img: img,
                        tiles: pagesArray.item(p).getElementsByTagName("tiledir").item(0).firstChild.nodeValue,
                        xml: text,
                        sig: sig
                    };
                    obj.pages.push(page);
                }
                url = obj.imageDir + "/" + obj.pages[obj.curPageNum].tiles;
                prefix = obj.pages[obj.curPageNum].img + "-";
                obj.limg = new PJSOL({
                    base: obj.pages[obj.curPageNum].tiles,
                    basename: obj.pages[obj.curPageNum].tiles,
                    prefix: prefix,
                    url: url,
                    loc: obj.DOM,
                    doc: obj.docId,
                    page: (obj.curPageNum + 1),
                    zoom: obj.startzoom,
                    center: obj.startcenter
                });
                obj.limg.exitAnno.subscribe(obj.leaveAnno, obj);
                obj.limg.exitCrop.subscribe(obj.leaveCrop, obj);
                YAHOO.util.Event.onContentReady(obj.limg.DOM.id, obj.startImage, obj);
                obj.DOM.appendChild(obj.pageText.DOM);
                obj.pageText.fillPage(obj.xmlDir + "/" + obj.pages[obj.curPageNum].xml.v, obj.xmlDir + "/" + obj.pages[obj.curPageNum].xml.r);
                obj.panelContentReady.fire(obj.pages);
            },
            failure: function(o){
                o.argument.obj.setAlert.fire("Page Image Loading failed");
            },
            argument: {
                obj: this
            }
        };
        var connect = YAHOO.util.Connect.asyncRequest("GET", manifest, callback);
        setTimeout(function(){
            if (YAHOO.util.Connect.isCallInProgress(connect)) {
                YAHOO.util.Connect.Abort(connect);
            }
        }, 1000);
    },
    startImage: function(obj){
        obj.limg.init();
        obj.limg.cropBoxIsOpenPJSOL.subscribe(function(e, pass, args){
            args.cropBoxIsOpen.fire(pass[0]);
        }, obj);
        obj.applyAnnos();
    },
    adjustResize: function(obj, nWidth, nHeight, offsetH){
        var bodyHeight = (nHeight - offsetH);
        YAHOO.util.Dom.setStyle(obj.DOM, "width", nWidth + "px");
        YAHOO.util.Dom.setStyle(obj.DOM, "height", bodyHeight + "px");
    },
    getZoom: function(){
        return this.limg.map.getZoom();
    },
    getCenter: function(){
        var center = this.limg.map.getCenter();
        return [center.lon, center.lat];
    },
    zoomIn: function(e, obj){
        obj.limg.zoom(1);
    },
    zoomOut: function(e, obj){
        obj.limg.zoom(-1);
    },
    nextPage: function(e, obj){
        if (obj.curPageNum < (obj.lastPage)) {
            obj.curPageNum++;
            obj.showPage();
            if (obj.mode == "image") {
                obj.applyAnnos();
            }
        }
        else {
            obj.curPage;
        }
    },
    prevPage: function(e, obj){
        if (obj.curPageNum > 0) {
            obj.curPageNum--;
            obj.showPage();
            if (obj.mode == "image") {
                obj.applyAnnos();
            }
        }
        else {
            obj.curPage;
        }
    },
    changePage: function(e, pass, args){
        args.curPageNum = pass[0];
        args.showPage();
    },
    toggleMode: function(e, obj){
        if (obj.mode == "text") {
            obj.limg.hide();
            YAHOO.util.Dom.setStyle(obj.pageText.DOM, "display", "block");
            YAHOO.util.Dom.setStyle(obj.DOM, "overflow", "auto");
            obj.showPage();
        }
        else {
            if (obj.mode == "image") {
                obj.showPage();
                obj.limg.unhide();
                YAHOO.util.Dom.setStyle(obj.pageText.DOM, "display", "none");
            }
        }
    },
    showPage: function(){
        if (this) {
            this.pageChanged.fire(this.curPageNum);
            if (this.mode == "text") {
                vURI = this.xmlDir + "/" + this.pages[this.curPageNum].xml.v;
                rURI = this.xmlDir + "/" + this.pages[this.curPageNum].xml.r;
                this.pageText.fillPage(vURI, rURI, this.docId, this.curPageNum, this.set);
            }
            else {
                tileurl = this.imageDir + "/" + this.pages[this.curPageNum].tiles;
                prefix = this.pages[this.curPageNum].img.substring(-4);
                this.limg.changePage(this.pages[this.curPageNum].tiles, tileurl, this.curPageNum);
                this.applyAnnos();
            }
        }
    },
    applyAnnos: function(){
        this.limg.applyAnnos(this.set, this.userOwnsSet);
    },
    callChangeAnnoSet: function(values, obj){
        obj.set = values.annoId;
        obj.setName = values.annoName;
        obj.userOwnsSet = values.priv;
        obj.showPage();
    },
    setUpAnno: function(obj, coords){
        if (obj.mode == "image") {
            obj.limg.enterAnno(coords);
        }
    },
    setUpCrop: function(obj, coords){
        if (obj.mode == "image") {
            obj.limg.enterCrop();
        }
    },
    leaveAnno: function(e, pass, args){
        args.resetClickMode.fire({
            id: args.panelid,
            mode: "none"
        });
    },
    leaveCrop: function(e, pass, args){
        args.resetClickMode.fire({
            id: args.panelid,
            mode: "none"
        });
    },
    stopListeners: function(){
        this.limg.stopListeners();
    }
});
