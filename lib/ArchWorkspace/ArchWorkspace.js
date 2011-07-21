/**
 * Workspace
 * 
 * Creates a dynamic HTML zone for 
 * creating and managing other 
 * objects
 * 
 * Input:
 * @param {Object} loc
 * 	HTML element that Workspace attaches other objects to
 * 	Must be a valid DOM object
 * @param {Object} regPath
 * 	Path (String) that represents the current server location
 * 	to the root index of the project
 * 	Ex: http://localhost:8888/quartos/
 * 
 * Creates:
 * 	LoginBar
 * 	ListenerMgr
 * 	ProjectBar
 */

Workspace = Monomyth.Class.extend({
	init:function(args){
	    this.DOM = $("#"+args.loc);
	    this.header = $("#header");
	    this.header.addClass("header_Archie");
	    this.curPanel = null;
	    this.allPanels = new Array();
	    this.allCrops = new Array();
	    this.allLabels = new Array();
	   
	    //this.setProp = new YAHOO.util.CustomEvent("setProp");
	    this.objects = new Array();
	    this.properties = new Array();
	    this.openProject = "default";
	    this.user = null;
	    this.userid = null;
		this.readytocreate=false;
	  
	}
});



/**
 * Inherits from Workspace.js
 */

ArchWorkspace=Workspace.extend({
	init:function(args){
		//call superclass
		this.$super(args);
		this.xmlpath=args.xmlpath;
		this.regPath=args.regpath;
		this.imgDir=args.imgdir;
		
		this.loadScreen(this);
	},
	loadScreen:function(obj){
		
		obj.stateMgr = new StateMgr();
		
	   //obj.login = new LoginBar(obj.header, obj.regPath);
	  
	    obj.projectBar = new ArchProjectBar({
			attach: obj.header,
			qselattach: obj.DOM,
			regPath:obj.regPath
		});
	
	   	obj.lightbox = new ArchieLightbox($("body"));
		
		$("body").bind("sizeReady",{obj:obj},function(e,size){
			var obj=e.data.obj;
			obj.lastsize=size;
			obj.readytocreate=true;
		});
		
		/*
obj.stateMgr.sizeReady.subscribe(function(e,pass,args){
			args.lastsize=pass[0];
			args.readytocreate=true;
		},obj);
*/
		//project bar calls
		
		$("body").bind("openWorksManifest",{obj: obj},obj.findWork);
		$("body").bind("openManifest",{obj:obj},obj.createPanel);
		/*
$("body").bind('setManifest',{
			obj: obj
		},obj.createPanel);
*/
		$("body").bind("panelReady",{obj:obj},obj.setPanelCalls);
		
		
		//project bar calls
		/*
obj.projectBar.openWorksManifest.subscribe(obj.findWork,obj);
		obj.projectBar.openManifest.subscribe(obj.createPanel,obj);
	    obj.projectBar.saveToProject.subscribe(obj.screenSnapshot, obj);
	    obj.projectBar.objReady.subscribe(obj.saveLabel, obj);
	    obj.projectBar.objRemove.subscribe(obj.removeLabel, obj);
	    obj.projectBar.setAlert.subscribe(function(g, f, a){
	        a.lightbox.setMessage(f[0]);
	        YAHOO.util.Dom.setStyle(a.lightbox.DOM, "display", "block");
	    }, obj);
*/
	    //obj.userLoggedIn.subscribe(obj.projectBar.userEnters, obj.projectBar);
	    //obj.changeTopWindow.subscribe(obj.projectBar.topPanel, obj.projectBar);
	    //obj.userLoggedIn.subscribe(obj.login.hide, obj.login);
		$("body").bind("changeTopWindow",{obj:obj.projectBar},obj.projectBar.topPanel);
		
		$("body").bind(obj.projectBar.remoteButtonClick,{obj:obj},obj.pBarCall);
	    /*
obj.login.setAlert.subscribe(function(e, j, a){
	        a.lightbox.setMessage(j[0]);
	        YAHOO.util.Dom.setStyle(a.lightbox.DOM, "display", "block");
	    }, obj);
		
		obj.login.stateOpen.subscribe(function(e,pass,args){
			var a=pass[0].split('/part/');
			var doc=a[0];
			var bib=a[1].replace("comma",",");
			var page=a[2];
			var option={
				readyPage:page,
				manifest:doc,
				bibInfo:bib,
				coords:[80,80],
				project:"default"
			};
			args.openProject='open';
			
			args.createPanel(e,[option],args);
		},obj);
*/

		$("body").bind("unloadTrigger",{obj:obj},function(e){
			var obj=e.data.obj;
			if (obj.allPanels.length > 0) {
				var panel=obj.allPanels[obj.allPanels.length-1];
				var width=$("#"+panel.id).width();
				var height=$("#"+panel.id).height();
				obj.stateMgr.rememberSize(width, height);
			}
		});
		$(window).unload(function(e){
			e.stopPropagation();
			$(this).trigger("unloadTrigger");
		});
		obj.stateMgr.checkSize();
	},
	pBarCall:function(e,args){
		//filter out remotebuttonclick calls made from projectBar
		e.stopPropagation();
		var obj=e.data.obj;
		var id=args.id;
		var mode=args.mode;
		
		//find the panel
		var panel=null;
		if(mode&&(obj.allPanels.length>0)){
			
			//send to current panel
			obj.curPanel.toolCall("crop");
		}
		
		return false;
	},
	findWork:function(e,args){
		e.stopPropagation();
		var obj=e.data.obj;
		var manifest=args.manifest;
		var bibInfo=args.bibInfo;
		var readyPage=args.readyPage;
		var panelid=(args.panelid)?args.panelid:null;
		var data=$.ajax({
			dataType:"xml",
			async:false,
			url:manifest
		}).responseXML;
		var section=bibInfo;
		var pages=[];
		
		var works=$(data).find("work");
		
		for(w=0;w<works.length;w++){
			var work=$(works[w]);
			var title=work.find("title").text();
			if(title==section){
				work.find('page').each(function(o){
					var pmanifest="./manifest/"+$(this).attr("xml");
					pages.push({pageSuffix:$(this).attr("auth"),pageName:$(this).text(),manifest:pmanifest});
				});
				
								// 
								// var ps=work.find("page");
								// for(i=0;i<ps.length;i++){
								// 	var page=$(ps[i]);
								// 	var pmanifest="/manifest/"+page.attr("xml");
								// 	pages.push({pageSuffix:$(this).attr("auth"),pageName:page.text(),manifest:pmanifest});
								// }
				//add to options
				args.pages=pages;
				break;
			}
		}
		obj.DOM.trigger("openManifest",[args]);
		return false;
	},
	createPanel:function(e,args){
		e.stopPropagation();
		var obj=e.data.obj;
		
		if (args.pages && args.bibInfo && args.manifest) {
			var page = (args.readyPage) ? args.readyPage : 1;
			var pages = args.pages;
			// for(pa in pages){
			// 			pages[pa].manifest=obj.regPath+pages[pa].manifest.substring(1);
			// 			
			// 		}
			var id = (args.panelid) ? args.panelid : null;
			var width=(args.width)?args.width:(args.lastsize)?args.lastsize[0]:800;
			var height=(args.height)?args.height:(args.lastsize)?args.lastsize[1]:600;
			var coords=(args.coords)?args.coords:[10,30];
			
			panel = new ArchiePanel({
				url:'./lib/Archie_Panel/ArchiePanel.php',
				id: id,
				desktop: obj.DOM,
				manifest:args.manifest,
				xmlpath:obj.xmlpath,
				pages:pages,
				readyPage: page,
				bibInfo: args.bibInfo,
				project: obj.openProject,
				coords: coords,
				width:width,
				height:height,
				user: obj.user,
				userid: obj.userid,
				zoom: 2,
				menuType:args.menuType
			});
			
		}
		return false;
	},
	setPanelCalls:function(e,panel){
			
			var obj=e.data.obj;
			obj.curPanel = panel;
			//set property values
			var properties=(obj.options)?obj.options:null;
			
			//assign listeners
			obj.DOM.bind(panel.closeSelf,{obj:obj},obj.delPanel);
			/*
panel.closeSelf.subscribe(function(f, a, b){
				b.delPanel(b, a[0].panel, a[0].mode);
			}, obj);
*/

			$("body").bind(obj.projectBar.remoteButtonClick,{obj:obj},panel.toolCall);
			//obj.projectBar.remoteButtonClick.subscribe(panel.toolCall, panel);
			//obj.projectBar.terminateListen.subscribe(panel.exitListeners, panel);
			//obj.stopFunctioning.subscribe(panel.stopFunctions, panel);
			obj.DOM.bind(panel.resetHeader,{obj:obj},obj.resetPublicBox);
			obj.DOM.bind(panel.panelClicked,{obj:obj},obj.selectPanel);
			/*
panel.resetHeader.subscribe(function(f, a, b){
				b.projectBar.resetPublicBox(b.projectBar);
			}, obj);

			panel.content.cropBoxIsOpen.subscribe(function(f, a, b){
				px = YAHOO.util.Dom.getX(a[0].DOM);
				py = YAHOO.util.Dom.getY(a[0].DOM);
				for (c in b.allCrops) {
					x = YAHOO.util.Dom.getX(b.allCrops[c].DOM);
					y = YAHOO.util.Dom.getY(b.allCrops[c].DOM);
					if ((x == px) || (y == py)) {
						YAHOO.util.Dom.setX(a[0].DOM, (x + 30));
						YAHOO.util.Dom.setY(a[0].DOM, (y + 30));
					}
				}
				a[0].closedCrop.subscribe(function(g, j, u){
					for (p in u.allCrops) {
						if (u.allCrops[p].DOM.id == j[0].DOM.id) {
							var v = u.allCrops.slice(0, p);
							var z = u.allCrops.slice(p, (u.allCrops.length - 1));
							z.shift();
							u.allCrops = v.concat(z);
							break;
						}
					}
				}, b);
				if (YAHOO.env.ua.ie > 0) {
					b.allCrops[b.allCrops.length] = a[0];
				}
				else {
					b.allCrops.push(a[0]);
				}
			}, obj);
			panel.panelClicked.subscribe(obj.selectPanel, obj);
			panel.panelClicked.subscribe(obj.projectBar.panelClicked, obj.projectBar);
			
			*/
			
			obj.allPanels[obj.allPanels.length] = panel;
			
			
			//panel.setPanelAlert.subscribe(obj.setLightBox, obj);
			//obj.changeTopWindow.fire(panel.DOM.id);
			//set on stack of panels
			var zindex=100+obj.allPanels.length;
			panel.DOM.css("z-index",zindex);
			return false;
		},
		selectPanel:function(e,panel){
			e.stopPropagation();
			var obj=e.data.obj;
			
			if(obj.allPanels.length>0){
				
				//var panelindex=parseInt(YAHOO.util.Dom.getStyle(panel.DOM,'z-index'))-100;
				if (!(panel.DOM.attr("id") == obj.curPanel.DOM.attr("id"))) {
					//need to rotate z-index of panels
					obj.rotatePanels(panel);
				}
			}
			return false;
		},
		rotatePanels:function(toppanel){
			var temp=[];
			for(p=0;p<this.allPanels.length;p++){
				var panel=this.allPanels[p];
				if(!(panel.DOM.attr("id")==toppanel.DOM.attr("id"))){
					temp.push(panel);
				} 
			}
			temp.push(toppanel);
			this.curPanel=toppanel;
			this.DOM.trigger("changeTopWindow",[toppanel]);
			for(t=0;t<temp.length;t++){
				var panel=temp[t];
				panel.DOM.css("z-index",(100+t));
				//YAHOO.util.Dom.setStyle(panel.DOM,'z-index',(100+t));
			}
		},
		delPanel:function(e,panel){
			e.stopPropagation();
			var obj=e.data.obj;
			
			if(obj.user) obj.stateMgr.removeItem("win", panel);
		    delId = panel.DOM.attr("id");
		    if (obj.allPanels.length == 1) {
		        obj.allPanels = [];
		        //panel.DOM.remove();
		    }
		    else {
		        var b = [];
		        for (p = 0; p < obj.allPanels.length; p++) {
		            if (obj.allPanels[p].DOM.attr("id") == delId) {
		                //panel.DOM.remove();
		            }
		            else {
		                b.push(obj.allPanels[p]);
		            }
		        }
		        obj.allPanels = b;
		    }
			return false;
		},
		restoreState:function(){
			
    		/*
var callback = {
        	success: function(o){
	            var data = o.responseText.split("\n");
	            var obj = o.argument[0];
	            var panels = [];
	            var D = [];
	            var f = [];
	            for (i = 0; i < data.length; i++) {
	                var record = data[i].split("%");
	                if ((record[1]) && (record[1].length > 0)) {
	                    switch (record[0]) {
	                        case "win":
	                            var id = record[1];
	                            var E = [record[3], record[4]];
	                            var C = parseInt("" + record[10]);
	                            var B = record[11].split(",");
								
	                            panels[panels.length] = {
	                                panelid: id,
	                                coords: E,
	                                zoom: C,
	                                center: B,
	                                manifest: record[2],
	                                width: record[5],
	                                height: record[6],
	                                readyPage: record[7],
	                                bibInfo: record[8],
	                                project: record[9]
	                            };
	                            break;
	                        case "crop":
	                            var G = [record[1], record[2], record[3], record[4], record[5], record[6], record[7], record[8], record[9], record[10]];
	                            D[D.length] = G;
	                            break;
	                        case "label":
	                            var F = [record[1], record[2], record[3], record[4], record[5], record[6]];
	                            f[f.length] = F;
	                            break;
	                    }
	                }
           		 }
	            obj.startrestore({
	                p: panels,
	                c: D,
	                l: f
	            });
	        },
	        failure: function(o){
	            alert("Error in retrieving data from server");
	        },
	        argument: [this]
	    };
	    var j = YAHOO.util.Connect.asyncRequest("GET", "./lib/StateMgr/sessionWindowMgr.php?mode=get", callback);
	    setTimeout(function(){
	        if (YAHOO.util.Connect.isCallInProgress(j)) {
	            YAHOO.util.Connect.abort(j);
	        }
	    }, 500);
*/
	},
	startrestore:function(args){
		var panels=args.p;
		for(p=0;p<panels.length;p++){
			this.findWork("",[panels[p]],this);
		}
	}
});

