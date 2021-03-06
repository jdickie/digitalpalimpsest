var ProjectBar = Monomyth.Class.extend({
	init:function(a){
	   	this.DOM=$("#nav");
		this.qselattach=a.qselattach;
		this.panelSelect=new ArchSelect({workmanifest:'./manifest/works.xml'});
		
	    this.projectName = "untitled";
	    this.projectId = null;
	    this.annoName = null;
	    this.topPanelId = null;
	    this.lock = false;
	    this.sendToSearch = null;
	    this.toggleMode = "none";
	   
	   this.remoteButtonClick="remoteButtonClick";
	   
	    //this.startProject.subscribe(this.loadProject, this);
		
		//load pbar elements once the DOM element is ready
		this.DOM.bind("projectBarReady",{obj:this},this.getPublicBarElements);
		
		this.DOM.trigger("projectBarReady");
		
	    /*
	YAHOO.util.Event.onAvailable(this.DOM.id, function(obj){
	      
	        obj.getPublicBarElements();
			//obj.getUserBarElements();
	    }, this);
	*/
		
		
	    
	},
	topPanel:function(e,panel){
		e.stopPropagation();
		var obj=e.data.obj;
		obj.topPanelId=panel.DOM.attr("id");
		return false;
	},
	getPublicBarElements:function(e){
		var obj=e.data.obj;
		obj.callNewPanel=$('#pb5');
		obj.callNewPanel.bind("click",{obj:obj},function(e){
			var obj=e.data.obj;
			var state=obj.panelWin.DOM.css("display");
			 if (state == "none") {
	            //c.qSel.winToggle("click", c.qSel);
	            obj.panelWin.DOM.css("display","block");
			
	           /*
 obj.backWin([obj.extrasBox.DOM, obj.newWindow, obj.saveWindow, obj.openWindow, obj.searchBar.DOM]);
	            obj.frontWin(obj.qSel.DOM);
*/
	        }
	        else {
				obj.panelWin.DOM.css("display","none");
	           /*
 obj.backWin([obj.qSel.DOM]);
	            obj.IEunhidewindow.fire(obj.qSel.DOM);
*/
	        }
		});
		/*
YAHOO.util.Event.addListener(this.callNewPanel.id, "click", function(e, obj){
	        var state = YAHOO.util.Dom.getStyle(obj.qSel.DOM, "display");
	        if (state == "none") {
	            //c.qSel.winToggle("click", c.qSel);
	            YAHOO.util.Dom.setStyle(obj.qSel.DOM,'display','block');
				//obj.exhibitWindowClicked.fire(obj.qSel);
	            obj.backWin([obj.extrasBox.DOM, obj.newWindow, obj.saveWindow, obj.openWindow, obj.searchBar.DOM]);
	            obj.frontWin(obj.qSel.DOM);
	        }
	        else {
	            obj.backWin([obj.qSel.DOM]);
	            obj.IEunhidewindow.fire(obj.qSel.DOM);
	        }
	    }, this);
*/
		//this.qSel.setManifest.subscribe(this.handleArchSelect,this);
		
		obj.cropToggle=$('#pb6');
		obj.cropToggle.bind("click",{obj:obj},obj.enterCrop);
		//YAHOO.util.Event.addListener(this.cropToggle.id, "click", this.enterCrop, this);
		
	},
	getUserBarElements:function(){
		/*
this.openProject = document.getElementById('pb1');
	    YAHOO.util.Dom.setStyle(this.openProject, "display", "none");
	    YAHOO.util.Event.addListener(this.openProject.id, "click", function(f, c){
	        YAHOO.util.Event.addListener(document, "keypress", c.handleKeyPress, c);
	        var b = YAHOO.util.Dom.getStyle(c.openWindow, "display");
	        if (b == "none") {
	            c.frontWin(c.openWindow);
	            c.backWin([c.saveWindow, c.newWindow, c.qSel.DOM, c.extrasBox.DOM, c.searchBar.DOM]);
	          //  c.exhibitWindowClicked.fire(c.openWindow);
	        }
	        else {
	            c.backWin([c.openWindow]);
	            c.IEunhidewindow.fire(c.qSel.DOM);
	        }
	    }, this);
	    this.saveState = document.getElementById('pb2');
	    YAHOO.util.Dom.setStyle(this.saveState, "display", "none");
	    YAHOO.util.Event.addListener(this.saveState, "click", function(f, c){
	        var b = YAHOO.util.Dom.getStyle(c.saveWindow, "display");
	        if (b == "none") {
	           // c.exhibitWindowClicked.fire(c.saveWindow);
	            c.frontWin(c.saveWindow);
	            c.backWin([c.newWindow, c.openWindow, c.qSel.DOM, c.searchBar.DOM, c.extrasBox.DOM]);
	        }
	        else {
	            c.backWin([c.saveWindow]);
	            c.IEunhidewindow.fire(c.qSel.DOM);
	        }
	    }, this);
	    this.annoToggle = document.getElementById('pb3');
	    
	    YAHOO.util.Dom.setStyle(this.annoToggle, "display", "none");
	   
	    YAHOO.util.Event.addListener(this.annoToggle, "click", this.enterAnno, this);
	    this.lblNote = document.getElementById('pb4');
	    YAHOO.util.Dom.setStyle(this.lblNote, "display", "none");
	    YAHOO.util.Event.addListener(this.lblNote, "click", this.createLabel, this);
*/
	},
	userEnters:function(e,pass,args){
		/*
args.getOpenList(args.openWindow.openSelect, "mine", args);
    	args.getSaveList(args.saveWindow.winSelect, "mine", args);
		
		if ((pass[0].loggedIn == true) && (YAHOO.util.Dom.getStyle(args.openProject, "display") == "none")) {
	        YAHOO.util.Dom.setStyle(args.openProject, "display", "block");
	        YAHOO.util.Dom.setStyle(args.saveState, "display", "block");
	        YAHOO.util.Dom.setStyle(args.annoToggle, "display", "block");
	        YAHOO.util.Dom.setStyle(args.lblNote, "display", "block");
	    }
	    else {
	        if ((pass[0].loggedIn == false) && (YAHOO.util.Dom.getStyle(args.openProject, "display") == "block")) {
	            YAHOO.util.Dom.setStyle(args.openProject, "display", "none");
	            YAHOO.util.Dom.setStyle(args.saveState, "display", "none");
	            YAHOO.util.Dom.setStyle(args.annoToggle, "display", "none");
	            YAHOO.util.Dom.setStyle(args.lblNote, "display", "none");
	            if (args.newWindow) {
	                if (YAHOO.util.Dom.getStyle(args.newWindow, "display") == "block") {
	                    YAHOO.util.Dom.setStyle(args.newWindow, "display", "none");
	                }
	            }
	            if (args.openWindow) {
	                if (YAHOO.util.Dom.getStyle(args.openWindow, "display") == "block") {
	                    YAHOO.util.Dom.setStyle(args.newWindow, "display", "none");
	                }
	            }
	            if (args.saveWindow) {
	                if (YAHOO.util.Dom.getStyle(args.saveWindow, "display") == "block") {
	                    YAHOO.util.Dom.setStyle(args.newWindow, "display", "none");
	                }
	            }
	        }
	    }
*/
	},
	handleArchSelect:function(e,pass,args){
		//args.openManifest.fire({manifest:pass[0].manifest,bibInfo:pass[0].title,readyPage:1});
	},
	frontWin:function(obj){
		/*
 YAHOO.util.Dom.setStyle(obj, "display", "block");
    	YAHOO.util.Dom.setStyle(obj, "z-index", "1111");
*/
	},
	backWin:function(args){
		/*
for(i in args){
			YAHOO.util.Dom.setStyle(args[i],'display',"none");
		}
*/
	},
	resetPublicBox:function(obj){
		obj.annoToggle.className = "projectBar_button";
	    obj.cropToggle.className = "projectBar_button";
		
	    if (obj.toggleMode == "annotate") {
	        obj.exitAnno("", obj);
	    }
	    else {
	        if (obj.toggleMode == "crop") {
	            obj.exitCrop("", obj);
	        }
	    }
	    obj.toggleMode = "none";
	},
	
	enterCrop:function(e){
		var obj=e.data.obj;
		if (obj.toggleMode == "annotate") {
	        obj.exitAnno("", obj);
	    }
		
	   /*
 obj.remoteButtonClick.fire({
	        mode: "crop",
	        id: obj.topPanelId
	    });
*/
	    obj.toggleMode = "crop";
	    obj.cropToggle.addClass("projectBar_button_selected");
	    obj.annoToggle.className = "projectBar_button";
	   // YAHOO.util.Event.removeListener(obj.cropToggle, "click", obj.enterCrop);
	    //YAHOO.util.Event.addListener(obj.cropToggle, "click", obj.exitCropHR, obj);
	},
	exitCropHR:function(e,obj){
		obj.toggleMode = "none";
	    obj.terminateListen.fire({
	        id: obj.topPanelId,
	        mode: "none"
	    });
		obj.cropToggle.removeClass("projectBar_button_selected");
	    obj.cropToggle.addClass("projectBar_button");
	    //YAHOO.util.Event.removeListener(obj.cropToggle, "click", obj.exitCropHR);
	    //YAHOO.util.Event.addListener(obj.cropToggle, "click", obj.enterCrop, obj);
	},
	exitCrop:function(e,obj){
		obj.toggleMode = "none";
	    obj.cropToggle.className = "projectBar_button";
	    //YAHOO.util.Event.removeListener(obj.cropToggle, "click", obj.exitCropHR);
	   // YAHOO.util.Event.addListener(obj.cropToggle, "click", obj.enterCrop, obj);
	},
	enterAnno:function(e,obj){
		 obj.annoToggle.className = "projectBar_button_selected";
	    if (obj.toggleMode == "crop") {
	        obj.exitCrop("", obj);
	    }
		 /*
obj.remoteButtonClick.fire({
	        mode: "annotation",
	        id: obj.topPanelId
	    });
*/
	    obj.toggleMode = "annotate";
	    obj.cropToggle.className = "projectBar_button";
	    //YAHOO.util.Event.removeListener(obj.annoToggle, "click", obj.enterAnno);
	   // YAHOO.util.Event.addListener(obj.annoToggle, "click", obj.exitAnnoHR, obj);
	},
	exitAnnoHR:function(e,obj){
		obj.toggleMode = "none";
	    obj.terminateListen.fire({
	        id: obj.topPanelId,
	        mode: "none"
	    });
	    obj.annoToggle.className = "projectBar_button";
	   // YAHOO.util.Event.removeListener(obj.annoToggle, "click", obj.exitAnnoHR);
	    //YAHOO.util.Event.addListener(obj.annoToggle, "click", obj.enterAnno, obj);
	},
	exitAnno:function(e,obj){
		obj.toggleMode = "none";
	    obj.annoToggle.className = "projectBar_button";
	    //YAHOO.util.Event.removeListener(obj.annoToggle, "click", obj.exitAnnoHR);
	   // YAHOO.util.Event.addListener(obj.annoToggle, "click", obj.enterAnno, obj);
	},
	setCurrPanel:function(e,args){
		if (!(args.sendToSearch == false)) {
	        var b = args.sendToSearch[4].indexOf("0");
	        var c = args.sendToSearch[4].substring(b);
	        if ((c.indexOf("a") >= 0)) {
	            c = c.substring(0, c.indexOf("a"));
	        }
	        else {
	            if ((c.indexOf("b") >= 0)) {
	                c = c.substring(0, c.indexOf("b"));
	            }
	        }
	        while ((c.indexOf("0") == 0)) {
	            c = c.substring(1);
	        }
	        a.curPageNum = parseInt(c,10);
	    }
	    else {
	        a.curPageNum = parseInt(c,10);
	        a.showPage(c);
	    }
	},
	
	checkOpenProjects:function(obj){
		 var a = "./lib/ProjectBar/getProjects.php?mode=current";
    var c = {
        success: function(g){
            var e = g.responseText.split("\n");
            var f = g.argument[0];
            if (e[0] == "True") {
                f.projectName = e[1];
                f.projectId = e[2];
                /*
f.projectReady.fire({
                    project: f.projectName,
                    projectId: f.projectId
                });
*/
            }
        },
        failure: function(e){
            alert("Error in connecting to server");
        },
        argument: [obj]
    };
	},
	createLabel:function(e,obj){
		var a = new LabelBox();
	    obj.qselattach.appendChild(a.DOM);
	   /*
 a.objClosed.subscribe(function(e, pass, args){
	        args.objRemove.fire(pass[0]);
	    }, obj);
*/
		
	    obj.backWin([obj.saveWindow, obj.newWindow, obj.openWindow, obj.extrasBox.DOM, obj.searchBar.DOM, obj.qSel.DOM]);
	    obj.objReady.fire(a);
	    /*
if ((YAHOO.util.Dom.getY(a.DOM)) < 80) {
	        ttlLbl = YAHOO.util.Dom.getElementsByClassName("labelBox_window", "div");
	        var f = 10;
	        for (l in ttlLbl) {
	            if (YAHOO.util.Dom.getX(ttlLbl[l]) == f) {
	                f += 10;
	            }
	        }
	        YAHOO.util.Dom.setX(a.DOM, f);
	        YAHOO.util.Dom.setY(a.DOM, (85 + f));
	    }
*/
	},
	panelClicked:function(e,pass,args){
		//args.backWin([args.newWindow, args.saveWindow, args.openWindow, args.qSel.DOm, args.searchBar.DOM, args.extrasBox.DOM]);
	}
});

/**
 * Inherits from ProjectBar.js
 */

ArchProjectBar=ProjectBar.extend({
	init:function(args){
	//call super
	this.$super(args);
	
	this.openWorksManifest="openWorksManifest";
	//this.openWorksManifest=new YAHOO.util.CustomEvent("openWorksManifest");
	
},
	getPublicBarElements:function(e){
		var obj=e.data.obj;
		obj.callNewPanel=$('#pb5');
		obj.callNewPanel.bind('click',{obj:obj},function(e){
			var obj=e.data.obj;
			
	        if (!obj.panelSelect.open) {
	            //c.qSel.winToggle("click", c.qSel);
				obj.panelSelect.display();
	           // YAHOO.util.Dom.setStyle(obj.qSel.DOM,'display','block');
				//obj.exhibitWindowClicked.fire(obj.qSel);
	            //obj.backWin([obj.extrasBox.DOM, obj.newWindow, obj.saveWindow, obj.openWindow, obj.searchBar.DOM]);
	           
	        }
	       
		});
		
		//open new panel window if no windows present
		$(function(){
			var total=$(".panel");
			if(total.length<1){
				obj.panelSelect.display();
			}
		});
		
		$("body").bind("setManifest",{obj:obj},obj.handleArchSelect);		
		//NEW: crop button now on the panel
		// obj.cropToggle=$('#pb6');
		// 		obj.cropToggle.bind("click",{obj:obj},obj.enterCrop);
		
		
		//OLD CODE WENT HERE
	},
	getUserBarElements:function(){
		//OLD CODE WENT HERE
	},
	handleArchSelect:function(e,args){
		if(e.isPropagationStopped()) return false;
		e.stopPropagation();
		var obj=e.data.obj;
		var type=args.type;
		switch(type){
			case 'work':
				obj.DOM.trigger("openWorksManifest",[{manifest:args.manifest,bibInfo:args.part,readyPage:1,menuType:'w'}]);
				//obj.openWorksManifest.fire({manifest:pass[0].manifest,bibInfo:pass[0].part,readyPage:1});
				return false;
				break;
			case 'undertext':
				//get every single set of pages
				var xml=$.ajax({
					dataType:"xml",
					url:args.manifest,
					async:false
				}).responseXML;
				var pages=$(xml).find('page');
				var auth=$(xml).find('auth').text();
				
				var pagearray=[];
				$(pages).each(function(i){
					
					var manifest="./manifest/"+$(this).attr("xml");
					pagearray.push({pageName:$(this).attr("auth"),pageSuffix:$(this).text(),manifest:manifest});
				});
				obj.DOM.trigger("openManifest",[{pages:pagearray,bibInfo:args.part,manifest:args.manifest,readyPage:1,menuType:'m'}]);
				//obj.openManifest.fire({pages:pagearray,bibInfo:bibInfo,manifest:manDocFile,readyPage:1});
				/*
var callback={
					success:function(o){
						var obj=o.argument[0];
						var manDocFile=o.argument[1];
						var bibInfo=o.argument[2];
						var xml=o.responseXML;
						var pages=xml.getElementsByTagName('page');
						var pagearray=[];
						for(p=0;p<pages.length;p++){
							var el=pages.item(p);
							var manifest="./manifest/"+el.getAttribute("xml");
							pagearray.push({pageName:el.firstChild.nodeValue,manifest:manifest});
						}
						obj.openManifest.fire({pages:pagearray,bibInfo:bibInfo,manifest:manDocFile,readyPage:1});
					},
					failure:function(o){
						
					},
					argument:[obj,pass[0].manifest,pass[0].part]
				};
				
				var transact=YAHOO.util.Connect.asyncRequest("GET",pass[0].manifest,callback);
			
*/
				return false;
				break;
			case 'prayerbook':
				//get the pages
				var xml=$.ajax({
					dataType:"text",
					url:args.manifest,
					async:false
				}).responseXML;
				var kids=$(xml).find("page");
				var pagearray=[];
				$(kids).each(function(i){
					pagearray.push({pageSuffix:$(this).attr("auth"),pageName:$(this).text(),manifest:"./manifest/"+$(this).attr("xml")});
				});
			
				/*
var pages=xml.getElementsByTagName('page');
				var pagearray=[];
				for(p=0;p<pages.length;p++){
					var el=pages.item(p);
					var manifest="./manifest/"+el.getAttribute("xml");
					pagearray.push({pageName:el.firstChild.nodeValue,manifest:manifest});
				}
*/
				
				obj.DOM.trigger("openManifest",[{pages:pagearray,bibInfo:args.part,manifest:args.manifest,readyPage:1,menuType:'m'}]);
				/*
var callback={
					success:function(o){
						var obj=o.argument[0];
						var manDocFile=o.argument[1];
						var bibInfo=o.argument[2];
						var xml=o.responseXML;
						var pages=xml.getElementsByTagName('page');
						var pagearray=[];
						for(p=0;p<pages.length;p++){
							var el=pages.item(p);
							var manifest="./manifest/"+el.getAttribute("xml");
							pagearray.push({pageName:el.firstChild.nodeValue,manifest:manifest});
						}
						obj.openManifest.fire({pages:pagearray,bibInfo:bibInfo,manifest:manDocFile,readyPage:1});
					},
					failure:function(o){
						
					},
					argument:[args,pass[0].manifest,pass[0].part]
				};
				
				var transact=YAHOO.util.Connect.asyncRequest("GET",pass[0].manifest,callback);
			
*/
				//obj.openManifest.fire({manifest:pass[0].manifest,bibInfo:pass[0].part,readyPage:1});
				return false;
				break;
		}
		//args.openManifest.fire({manifest:pass[0].manifest,bibInfo:pass[0].part,readyPage:1});
		return false;
	},
	/**CROP FUNCTIONS**/
	enterCrop:function(e){
		e.stopPropagation();
		var obj=e.data.obj;
		if (obj.toggleMode == "annotate") {
	        obj.exitAnno("", obj);
	    }
		
	   /*
 obj.remoteButtonClick.fire({
	        mode: "crop",
	        id: obj.topPanelId
	    });
*/
	    obj.toggleMode = "crop";
		obj.DOM.trigger(obj.remoteButtonClick,[{mode:"crop",id:obj.topPanelId}]);
		return false;
	    //obj.cropToggle.className = "projectBar_button_selected";
	    //obj.annoToggle.className = "projectBar_button";
	    //YAHOO.util.Event.removeListener(obj.cropToggle, "click", obj.enterCrop);
	    //YAHOO.util.Event.addListener(obj.cropToggle, "click", obj.exitCropHR, obj);
	},
	exitCrop:function(e,obj){
		obj.toggleMode = "none";
	   /*
 obj.terminateListen.fire({
	        id: obj.topPanelId,
	        mode: "none"
	    });
*/
	    obj.cropToggle.className = "projectBar_button";
	   // YAHOO.util.Event.removeListener(obj.cropToggle, "click", obj.exitCropHR);
	   // YAHOO.util.Event.addListener(obj.cropToggle, "click", obj.enterCrop, obj);
	},
	exitCropHR:function(e,obj){
		obj.toggleMode = "none";
	    obj.cropToggle.className = "projectBar_button";
	   // YAHOO.util.Event.removeListener(obj.cropToggle, "click", obj.exitCropHR);
	    //YAHOO.util.Event.addListener(obj.cropToggle, "click", obj.enterCrop, obj);
	},
	enterAnno:function(e,obj){
		 //obj.annoToggle.className = "projectBar_button_selected";
	   /*
 if (obj.toggleMode == "crop") {
	        obj.exitCrop("", obj);
	    }
*/
		/*
 obj.remoteButtonClick.fire({
	        mode: "annotation",
	        id: obj.topPanelId
	    });
*/
	    obj.toggleMode = "annotate";
	    //obj.cropToggle.className = "projectBar_button";
	   // YAHOO.util.Event.removeListener(obj.annoToggle, "click", obj.enterAnno);
	    //YAHOO.util.Event.addListener(obj.annoToggle, "click", obj.exitAnnoHR, obj);
	}
});