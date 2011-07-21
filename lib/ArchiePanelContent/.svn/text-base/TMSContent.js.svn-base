var TMSContent = ArchiePanelContent.extend({
	init:function(args){
    	//call superclass
		this.$super(args);
		this.manifestArray=args.pages;
	    this.startzoom = args.zoom;
	    this.startcenter = args.center;
		this.startviews=args.views;
		this.panelid=args.panelId;
		this.xmlpath=args.xmlpath;
		this.panelWidth=args.width;
		this.panelHeight=args.height;
	},

    startContent: function(){
		//create pageText element
		this.pageText=new ArchPageText({xmlpath:this.xmlpath,panelid:this.panelid});
		
		this.DOM.bind(this.pageText.onCleared,{obj:this},this.fillMap);
       	this.docId=this.manifestArray[this.curPageNum].manifest;
		$("body").bind("getTMSPages",{obj:this},this.getXMLData);
		//var doc=manDom.documentElement;
		this.pageName=this.manifestArray[this.curPageNum].pageName;
		//Populate pages array with image files	
		this.pages=[];
		$.ajax({
			dataType:"xml",
			url:this.docId,
			async:false,
			success:function(xml){
				//using each statement to go through the individual pages
				var base=$(xml).find("doc").attr("base");
				$(xml).find("page").each(function(arr){
					
					var layers=$(this).children("layer");
					var layerargs=[];
					for(i=0;i<layers.length;i++){
						layerargs.push($(layers[i]).text());
					}
					var xmlpath=$(this).find("pagetext").attr("xmluri");
					var img={
						sv:base,
						page:arr,
						layers:layerargs,
						img:layerargs[0],
						xml:xmlpath
					};
					$("body").trigger("getTMSPages",[img]);
					
				});
			}
		});
		$("body").unbind("getTMSPages",this.getXMLData);
		this.setUpLayers();
    },
	getXMLData:function(e,img){
		var obj=e.data.obj;
		
		img.imgdir = IMGDIR;
		img.name = obj.pageName;
		obj.pages.push(img);
		return false;
	},
	setUpLayers:function(){
		//this.panelContentReady.fire(this.manifestArray);
		//set up width and height - if specified
		if(this.panelWidth&&this.panelHeight){
			this.DOM.height(this.panelHeight);
			this.DOM.width(this.panelWidth);
			this.panelWidth=null;
			this.panelHeight=null;
		}
		if (!this.switcher) {
			
			this.switcher = new OverlaySwitcher({
				panelid: this.panelid,
				data: this.pages,
				loc: this.DOM
			});
			$("body").bind(this.switcher.changeOverlay,{obj:this},this.changeLayerView);
			$("body").bind(this.switcher.changeLayerVisibility,{obj:this},this.changeLayerVisibility);
			$("body").bind(this.switcher.changeLayerOpacity,{obj:this},this.changeLayerOpacity);
		}
		else {
			this.switcher.reOrderLayers(this.pages[0].layers);
		}
		if(!this.startviews) this.startviews=this.pages[0].layers;
		
		if (!this.limg) {
			//create TMS Layer thisect
			
			this.limg = new TMSLayer({
				panelid: this.panelid,
				doc: this.docId,
				startzoom: this.startzoom,
				startcenter: this.startcenter,
				startviews: this.startviews,
				width:this.panelWidth,
				height:this.panelHeight
			}, this.DOM);
			this.DOM.bind(this.limg.onCleared,{obj:this},this.fillMap);
			//send off to ArchiePanel to create DropDown
			this.DOM.trigger(this.panelContentReady,[this.manifestArray]);
		}
		
		
		if (this.mode == "image") {
			this.pages[0].initset = 'default';
			this.pages[0].initlock = true;
			
			this.limg.setLayer(this.pages[0]);
		}
		else if (this.mode == "text") {
				if (typeof(this.pages[0].xml)!=="undefined") {
					var URI = this.xmlpath + "/" + this.pages[0].xml;
					this.pageText.fillPage(URI, this.docId, this.curPageNum, this.set);
				}
			}
		
	},
	fillMap:function(e){
		var obj=e.data.obj;
		//alert(obj.curPageNum+", manifest array total: "+obj.manifestArray.length);
		obj.docId=obj.manifestArray[obj.curPageNum].manifest;
		var manDom=$.ajax({
			dataType:"xml",
			async:false,
			url:obj.docId
		}).responseXML;
		
		var pageName=obj.manifestArray[obj.curPageNum].pageName;
		//Populate pages array with image files	
		obj.pages=[];
		obj.base=$(manDom).find("doc").attr("base");
		pagesArray=$(manDom).find("page");
		for(p=0;p<pagesArray.length;p++){
			if((pagesArray[p]!==null)){
				imgpaths=$(pagesArray[p]).find("layer");
				layers=[];
				if (obj.startviews) {
					
					for(s in obj.startviews){
						layers.push(obj.startviews[s].replace(/^\s+|\s+$/g,""));
					}
				}
				else {
					for (l = 0; l < imgpaths.length; l++) {
						layer = $(imgpaths[l]).text();
						layers.push(layer);
					}
				}
				var xmlpath=$(pagesArray[p]).find("pagetext").attr("xmluri");
				
				var img={
					sv:obj.base,
					layers:layers,
					imgdir:IMGDIR,
					img:layers[0],
					page:p,
					name:pageName,
					xml:xmlpath
				};
				obj.pages.push(img);
			}
		}				
		obj.setUpLayers();
	},
	close:function(){
		//programmatically empty out all HTML contents
		$(".overlay_item").hide();
		setTimeout(function(obj){
			obj.remove();
		},1,this.limg.DOM);
		setTimeout(function(obj){
			obj.remove();
		},1,this.DOM);
		
	},
	changeLayerView:function(e,list){
		e.stopPropagation();
		var obj=e.data.obj;
		obj.limg.changeView(list);
		return false;
	},
	changeLayerVisibility:function(e,args){
		e.stopPropagation();
		var obj=e.data.obj;
		var layername=args.name;
		var nextlayername=args.nextname;
		var visible=args.visible;
		
		obj.limg.setVisibility(layername,nextlayername,visible);
		return false;
	},
	changeLayerOpacity:function(e,args){
		e.stopPropagation();
		var obj=e.data.obj;
		obj.limg.setLayerOpacity(args.name,args.nextname,args.val);
		return false;
	},
	changeTransparency:function(e){
		e.stopPropagation();
		var obj=e.data.obj;
		var more=e.data.more;
		switch(more){
			case true:
				obj.limg.lightenMap();
				break;
			case false:
				obj.limg.darkenMap();
				break;
		};
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
		obj.DOM.width(nWidth);
		obj.DOM.height(bodyHeight);
		//obj.body.width("auto");
		obj.body.height(bodyHeight);
		if(obj.pageText){
			obj.pageText.DOM.width(nWidth);
			obj.pageText.DOM.height(bodyHeight);
		}
		if(obj.limg) obj.limg.adjustResize((obj.DOM.innerWidth()-obj.switcher.DOM.width()),obj.DOM.innerHeight());
    },
    getZoom: function(){
        return this.limg.map.getZoom();
    },
    getCenter: function(){
        var center = this.limg.map.getCenter();
        return [center.lon, center.lat];
    },
    zoomIn: function(e){
		e.stopPropagation();
		var obj=e.data.obj;
        obj.limg.zoom(1);
    },
    zoomOut: function(e){
		e.stopPropagation();
		var obj=e.data.obj;
        obj.limg.zoom(-1);
    },
	turnOnScroll:function(){
		this.limg.activateZoomScroll();
	},
	turnOffScroll:function(){
		this.limg.deactivateZoomScroll();
	},
    nextPage: function(){
        if (this.curPageNum < (this.manifestArray.length)) {
            this.curPageNum++;
            this.showPage();
        }
       
    },
    prevPage: function(e){
        if (this.curPageNum >= 0) {
            this.curPageNum--;
            this.showPage();
        }
        
    },
    changePage: function(e, pass, args){
        args.curPageNum = pass[0];
        args.showPage();
    },
    toggleMode: function(e, obj){
        if (obj.mode == "text") {
			//get sizes
			var width=obj.limg.DOM.innerWidth()+obj.switcher.DOM.innerWidth();
			var height=obj.limg.DOM.innerHeight();
            obj.limg.hide();
			obj.switcher.hide();
			obj.pageText.DOM.width(width);
			obj.pageText.DOM.height(height);
			obj.pageText.DOM.show();
            obj.showPage();
        }
        else {
            if (obj.mode == "image") {
                obj.limg.show();
				obj.switcher.show();
               	obj.pageText.DOM.hide();
				obj.showPage();
            }
        }
    },
    showPage: function(){
        if (this.curPageNum<(this.manifestArray.length)) {
            
            if (this.mode == "text") {
				this.pageText.clearArea();
               
            }
            else {
              	this.limg.clearMap();//tmslayer object will fire a call when it's 
              	//done clearing the map div
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
        obj.applyAnnos();
    },
    setUpAnno: function(obj, coords){
        if (obj.mode == "image") {
            obj.limg.enterAnno(coords);
        }
    },
    setUpCrop: function(){
        if (this.mode == "image") {
            this.limg.enterCrop();
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
//extendOS(TMSContent,ArchiePanelContent);
