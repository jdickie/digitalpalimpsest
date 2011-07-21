
/***
 * 
 * AnnotationSelect.js
 * 
 * Generate a window for viewing 
 * view options for annotations
 * within the image or PageText object
 * of a Archie_panel
 * 
 * Updates ArchiePanelContent Object
 * 
 * Includes AnnoWindow:
 * Window for creating new annotation sets
 * that then appear in the set list
 */

 AnnotationSelect = function(loc, docId, userid){
 	this.DOM = document.createElement("div");
    YAHOO.util.Dom.generateId(this.DOM, "view");
    this.DOM.className = "window anno_window";
	this.loc=loc;
    this.userid = userid;
    this.selectedName = null;
    this.selectedId = null;
    this.docId = docId;
    this.populationType = "current";
    this.addMine = [];
   	this.loc.appendChild(this.DOM);
	
	//listeners
	this.properties = new Array();
    this.changeCall = new YAHOO.util.CustomEvent("changeCall");
    this.visibleNow = new YAHOO.util.CustomEvent("visibleNow");
	//this.initComplete=new YAHOO.util.CustomEvent("initComplete");
	
	YAHOO.util.Event.onContentReady(this.DOM.id,this.init,this);
	
    /*
this.body = document.createElement("div");
    this.body.className = "window_body";
    this.closeBar = document.createElement("div");
    this.closeBar.className = "window_closebar";
    YAHOO.util.Dom.generateId(this.closeBar, "handle");
    this.closeBarText = document.createElement("span");
    YAHOO.util.Dom.generateId(this.closeBarText, "txt");
    this.closeBarText.className = "window_title";
    this.closeBarText.appendChild(document.createTextNode("Open Notes"));
    this.closeBar.appendChild(this.closeBarText);
    this.closeA = document.createElement("a");
    this.closeA.appendChild(document.createTextNode("Close"));
    this.closeA.className = "window_close notes_close";
    this.winSelect = document.createElement("div");
    this.winSelect.id = "docList_open";
    this.winSelect.className = "window_select";
    this.body.appendChild(this.winSelect);
    this.viewType = document.createElement("form");
    this.viewType.className = "viewType";
    this.viewAll = document.createElement("span");
    this.viewAll.className = "viewChoice";
    YAHOO.util.Dom.generateId(this.viewAll, "all");
    this.viewType.appendChild(this.viewAll);
    YAHOO.util.Event.addListener(this.viewAll.id, "click", this.viewAllUsers, this);
    this.viewAll.appendChild(document.createTextNode("Public Sets"));
    this.viewMine = document.createElement("span");
    this.viewMine.className = "viewChoice_hl";
    YAHOO.util.Dom.generateId(this.viewMine, "mine");
    this.viewType.appendChild(this.viewMine);
    YAHOO.util.Event.addListener(this.viewMine.id, "click", this.viewCurrUser, this);
    this.viewMine.appendChild(document.createTextNode("My Sets"));
    this.body.insertBefore(this.viewType, this.winSelect);
    this.searchBox = document.createElement("div");
    YAHOO.util.Dom.generateId(this.searchBox);
    this.searchBox.className = "searchBox";
    this.body.appendChild(this.searchBox);
    this.searchInput = document.createElement("input");
    YAHOO.util.Dom.generateId(this.searchInput);
    this.searchInput.type = "text";
    this.searchBox.appendChild(this.searchInput);
    this.searchClickGo = document.createElement("input");
    YAHOO.util.Dom.generateId(this.searchClickGo);
    this.searchClickGo.type = "submit";
    this.searchClickGo.value = "Find";
    this.searchBox.appendChild(this.searchClickGo);
    YAHOO.util.Event.addListener(this.searchClickGo.id, "click", this.findAnnoSet, this);

	this.importWindow=new ImportWin(this.DOM);
	this.annoWindow = new AnnoWindow(this.DOM);
    this.annoWindow.newAnnoMade.subscribe(this.startSavingNew, this);
    YAHOO.util.Event.addListener(this.closeA, "click", this.closeWin, this);
	this.importWindow.closed.subscribe(function(e,pass,args){
		args.displayImportWindow(e,args);
	},this);
	this.importWindow.annoimported.subscribe(function(e,pass,args){
		args.displayImportWindow(e,args);
		args.populateTables(args);
	},this);
    this.closeBar.appendChild(this.closeA);
    this.DOM.appendChild(this.closeBar);
    this.DOM.appendChild(this.body);
    YAHOO.util.Dom.setStyle(this.DOM, "display", "none");
	this.importButton=document.createElement("span");
	YAHOO.util.Dom.generateId(this.importButton,'imp');
	this.importButton.className="window_button";
	this.importButton.appendChild(document.createTextNode("Import Set"));
	YAHOO.util.Event.addListener(this.importButton.id,'click',this.displayImportWindow,this);
    this.createButton = document.createElement("span");
    YAHOO.util.Dom.generateId(this.createButton, "select");
    this.createButton.className = "window_button";
    this.createButton.appendChild(document.createTextNode("Create New Set"));
    YAHOO.util.Event.addListener(this.createButton.id, "click", this.displayNewWindow, this);
    this.body.appendChild(this.createButton);
	this.body.appendChild(this.importButton);
    YAHOO.util.Dom.setStyle(this.createButton, "display", "none");
	YAHOO.util.Dom.setStyle(this.importButton,"display","none");
    this.properties = new Array();
    this.changeCall = new YAHOO.util.CustomEvent("changeCall");
    this.visibleNow = new YAHOO.util.CustomEvent("visibleNow");
    loc.appendChild(this.DOM);
    loc.appendChild(this.annoWindow.DOM);
	loc.appendChild(this.importWindow.DOM);*/
    
};
AnnotationSelect.prototype.init=function(obj){
	var url="./lib/AnnotationSelect/AnnotationSelect.php?id="+obj.DOM.id;
	var callback={
		success:function(o){
			var obj=o.argument[0];
			obj.DOM.innerHTML=o.responseText;
			obj.setContents(obj);
		},
		failure:function(o){
			alert(o.statusText);
		},
		argument:[obj]
	}
	var connect=YAHOO.util.Connect.asyncRequest("GET",url,callback);
	setTimeout(function(){
		if(YAHOO.util.Connect.isCallInProgress(connect)){
			YAHOO.util.Connect.abort(connect);
		}
	},550);
}
AnnotationSelect.prototype.setContents=function(obj){
	obj.body = document.getElementById(obj.DOM.id+"_windowbody");
    
    obj.closeBar = document.getElementById(obj.DOM.id+"_closebar");
    obj.closeBarText = document.getElementById(obj.DOM.id+"windowtitle");
    obj.closeA = document.getElementById(obj.DOM.id+"_close");
    
    obj.winSelect = document.getElementById(obj.DOM.id+"_windowselect");
   
    obj.viewType = document.getElementById(obj.DOM.id+"_viewform");
    
    obj.viewAll = document.getElementById(obj.DOM.id+"_publicsets");
  
    YAHOO.util.Event.addListener(obj.viewAll.id, "click", obj.viewAllUsers, obj);
    
    obj.viewMine = document.getElementById(obj.DOM.id+"_mysets");
    
  
    YAHOO.util.Event.addListener(obj.viewMine.id, "click", obj.viewCurrUser, obj);
    
    obj.searchBox = document.getElementById(obj.DOM.id+"_searchbox");
    
    obj.searchInput = document.getElementById(obj.DOM.id+"_searchtext");
    
    obj.searchClickGo = document.getElementById(obj.DOM.id+"_searchsubmit");
    
    YAHOO.util.Event.addListener(obj.searchClickGo.id, "click", obj.findAnnoSet, obj);

	obj.importWindow=new ImportWin(obj.DOM);
	obj.annoWindow = new AnnoWindow(obj.DOM);
    obj.annoWindow.newAnnoMade.subscribe(obj.startSavingNew, obj);
    YAHOO.util.Event.addListener(obj.closeA, "click", obj.closeWin, obj);
	obj.importWindow.closed.subscribe(function(e,pass,args){
		args.displayImportWindow(e,args);
	},obj);
	obj.importWindow.annoimported.subscribe(function(e,pass,args){
		args.displayImportWindow(e,args);
		args.populateTables(args);
	},obj);
    
   
	obj.importButton=document.getElementById(obj.DOM.id+"_importset");
	
	YAHOO.util.Event.addListener(obj.importButton.id,'click',obj.displayImportWindow,obj);
    obj.createButton = document.getElementById(obj.DOM.id+"_newset");
   
    YAHOO.util.Event.addListener(obj.createButton.id, "click", obj.displayNewWindow, obj);
  
    YAHOO.util.Dom.setStyle(obj.createButton, "display", "none");
	YAHOO.util.Dom.setStyle(obj.importButton,"display","none");
    
	obj.makeDraggable(obj);
	
	
}
AnnotationSelect.prototype.makeDraggable = function(obj){
    obj.viewDrag = new YAHOO.util.DD(obj.DOM.id);
    obj.viewDrag.setHandleElId(obj.closeBar.id);
    obj.viewResize = new YAHOO.util.Resize(obj.DOM.id, {
        handles: "all"
    });
};
AnnotationSelect.prototype.displayNewWindow = function(e, obj){
    var state = YAHOO.util.Dom.getStyle(obj.annoWindow.DOM, "display");
    if (state == "block") {
        
        YAHOO.util.Dom.setStyle(obj.DOM, "display", "block");
        YAHOO.util.Dom.setStyle(obj.annoWindow.DOM, "display", "none");
        obj.DOM.className = "window anno_window";
    }
    else {
        if (state == "none") {
            YAHOO.util.Dom.setStyle(obj.DOM, "display", "none");
            YAHOO.util.Dom.setStyle(obj.annoWindow.DOM, "display", "block");
        }
    }
};
AnnotationSelect.prototype.displayImportWindow=function(e,obj){
	var state=YAHOO.util.Dom.getStyle(obj.importWindow.DOM,'display');
	if(state=="block"){
		
		YAHOO.util.Dom.setStyle(obj.importWindow.DOM,'display','none');
		YAHOO.util.Dom.setStyle(obj.DOM,'display','block');
	} else {
		YAHOO.util.Dom.setStyle(obj.DOM,'display','none');
		YAHOO.util.Dom.setStyle(obj.importWindow.DOM,'display','block');
	}
}
AnnotationSelect.prototype.makeDisabled = function(obj){
    obj.submitButton.className = "viewPref_button_Disabled";
	obj.importButton.className = "viewPref_button_Disabled";
    obj.createButton.className = "viewPref_button_Disabled";
    YAHOO.util.Event.removeListener(obj.createButton, "click", obj.createAnnoWindow);
    YAHOO.util.Event.removeListener(obj.submitButton, "click", obj.changeAnnoSet);
};
AnnotationSelect.prototype.makeAbled = function(obj){
    obj.submitButton.className = "window_button";
	obj.importButton.className = "window_button";
    obj.createButton.className = "window_button";
    YAHOO.util.Event.addListener(obj.createButton.id, "click", obj.createAnnoWindow, {
        obj: obj,
        value: obj.nameBox.value
    });
    YAHOO.util.Event.addListener(obj.submitButton.id, "click", obj.changeAnnoSet, {
        obj: obj,
        value: obj.nameBox.value
    });
};
AnnotationSelect.prototype.findAnnoSet = function(e, obj){
    text = obj.searchInput.value;
    sUrl = "./lib/ProjectBar/findAnnoSet.php?text=" + text;
    var callback = {
        success: function(o){
            obj = o.argument[0];
            data = o.responseText.split("\n");
            if (obj.winSelect.firstChild) {
                temp = obj.winSelect.firstChild;
                while (temp.nextSibling) {
                    obj.winSelect.removeChild(temp.nextSibling);
                }
                obj.winSelect.removeChild(obj.winSelect.firstChild);
            }
            for (i = 0; i < data.length; i++) {
                values = data[i].split("%");
                if ((!(values[0] == "")) && (!(values[0] == "No sets chosen."))) {
                    mode = (parseInt(values[4]) == 0) ? "all" : "mine";
                    el = new AnnoListItem(values[1], values, mode, "add", obj.userid);
                    obj.winSelect.appendChild(el.DOM);
                    el.choose.subscribe(obj.changeNameBox, obj);
                    el.add.subscribe(obj.addToMyList, obj);
                    el.clicked.subscribe(obj.changeAnnoSet, obj);
                }
                else {
                    if (values[0] == "No sets chosen.") {
                        obj.winSelect.appendChild(document.createTextNode(values[0]));
                    }
                }
            }
        },
        failure: function(o){
            alert("Problem connecting to server [AnnotationSelect.js 143]");
        },
        argument: [obj]
    };
    var transact = YAHOO.util.Connect.asyncRequest("GET", sUrl, callback);
};
AnnotationSelect.prototype.setProperties = function(obj, values){
    obj.properties = values;
};
AnnotationSelect.prototype.closeWin = function(e, obj){
    var state = YAHOO.util.Dom.getStyle(obj.DOM, "display");
    if (state == "none") {
        YAHOO.util.Dom.setStyle(obj.DOM, "display", "block");
        obj.populateTables(obj);
        obj.visibleNow.fire("open");
        obj.DOM.className = "window anno_window";
        if (obj.userid) {
            YAHOO.util.Dom.setStyle(obj.createButton, "display", "block");
			YAHOO.util.Dom.setStyle(obj.importButton, "display","block");
        }
        else {
            YAHOO.util.Dom.setStyle(obj.createButton, "display", "none");
			YAHOO.util.Dom.setStyle(obj.importButton, "display","none");
        }
    }
    else {
        if (state == "block") {
            YAHOO.util.Dom.setStyle(obj.DOM, "display", "none");
            obj.visibleNow.fire("close");
        }
    }
};
AnnotationSelect.prototype.openWin = function(e, pass, args){
    pass[0].data.appendChild(args.DOM);
    args.populateTables(args);
};
AnnotationSelect.prototype.addToMyList = function(e, pass, args){
    YAHOO.util.Event.stopEvent(e);
    litem = pass[0];
    var sUrl = "./lib/AnnotationSelect/copyAnnoSet.php?id=" + litem.values[1] + "&name=" + litem.values[0] + "&olduser=" + litem.values[3];
    var callback = {
        success: function(o){
            as = o.argument[0];
            litem = o.argument[1];
            el = document.createElement("div");
            el.className = "annoNotify";
            el.appendChild(document.createTextNode("Set " + litem.values[0] + " has been added to Mine"));
            as.winSelect.replaceChild(el, litem.DOM);
        },
        failure: function(o){
        },
        argument: [args, litem]
    };
    var transact = YAHOO.util.Connect.asyncRequest("GET", sUrl, callback);
};
AnnotationSelect.prototype.takeFromList = function(e, pass, args){
    YAHOO.util.Event.stopEvent(e);
    value = pass[0];
    el = document.createElement("div");
    el.className = "annoNotify";
    el.appendChild(document.createTextNode("Note set " + value.values[0] + " was deleted"));
    args.winSelect.replaceChild(el, value.DOM);
};
AnnotationSelect.prototype.viewCurrUser = function(e, obj){
    obj.populationType = "current";
    obj.populateTables(obj);
    obj.viewMine.className = "viewChoice_hl";
    obj.viewAll.className = "viewChoice";
};
AnnotationSelect.prototype.viewAllUsers = function(e, obj){
    obj.populationType = "full";
    obj.populateTables(obj);
    obj.viewAll.className = "viewChoice_hl";
    obj.viewMine.className = "viewChoice";
};
AnnotationSelect.prototype.clearTable = function(obj){
    if (obj.winSelect.firstChild) {
        temp = obj.winSelect.firstChild;
        while (temp.nextSibling) {
            a = temp.nextSibling;
            obj.winSelect.removeChild(a);
        }
        obj.winSelect.removeChild(temp);
    }
};
AnnotationSelect.prototype.populateTables = function(obj){
    var params = "?type=" + obj.populationType + "&user=" + obj.properties.uID + "&doc=" + obj.docId;
    var sUrl = "./lib/Annotation/AnnoSet.php" + params;
    var callback = {
        success: function(o){
            var obj = o.argument[0];
            var records = o.responseText.split("\n");
            obj.clearTable(obj);
            for (i = 0; i < records.length; i++) {
                values = records[i].split("%");
                if (obj.populationType == "full") {
                    if ((!(values[0] == "")) && (!(values[0] == "No sets chosen."))) {
                        check = false;
                        if (!check) {
                            el = new AnnoListItem(values[1], values, "all", "add", obj.userid);
                            obj.winSelect.appendChild(el.DOM);
                            el.choose.subscribe(obj.changeNameBox, obj);
                            el.add.subscribe(obj.addToMyList, obj);
                            el.clicked.subscribe(obj.changeAnnoSet, obj);
                            el.reload.subscribe(function(e, pass, args){
                                args.populateTables(args);
                            }, obj);
                        }
                    }
                    else {
                        if (values[0] == "No sets chosen.") {
                            obj.winSelect.appendChild(document.createTextNode(values[0]));
                        }
                    }
                }
                else {
                    if (obj.populationType == "current") {
                        if (i == 0) {
                            obj.selectedId = values[1];
                            obj.selectedName = values[0];
                            priv = (values[4] == "true") ? true : false;
                            obj.selectedPriv = priv;
                        }
                        if (!(values[0] == "")) {
                            el = new AnnoListItem(values[1], values, "mine", null, obj.userid);
                            obj.winSelect.appendChild(el.DOM);
                            el.choose.subscribe(obj.changeNameBox, obj);
                            el.clicked.subscribe(obj.changeAnnoSet, obj);
                            el.removeItem.subscribe(function(e, pass, args){
                                obj.winSelect.removeChild(pass[0]);
                            }, obj);
                            el.reload.subscribe(function(e, pass, args){
                                args.populateTables(args);
                            }, obj);
                        }
                    }
                }
            }
            if (!obj.winSelect.firstChild) {
                el = document.createElement("div");
                el.className = "fileitem";
                warning = (obj.populationType == "current") ? ((obj.userid) ? "No Sets found in My Sets" : "Must be logged in to use this feature") : "No Public Sets Available";
                el.appendChild(document.createTextNode(warning));
                obj.winSelect.appendChild(el);
            }
        },
        failure: function(o){
            alert("Failure loading annotation sets");
        },
        argument: [obj]
    };
    var transact = YAHOO.util.Connect.asyncRequest("GET", sUrl, callback);
    setTimeout(function(e, pass, args){
        if (YAHOO.util.Connect.isCallInProgress(transact)) {
            YAHOO.util.Connect.abort(transact);
        }
    }, 5000);
};
AnnotationSelect.prototype.changeNameBox = function(e, pass, args){
    var name = pass[0].name;
    var id = pass[0].id;
    var userCheck = pass[0].priv;
    args.selectedName = name;
    args.selectedId = id;
    args.selectedPriv = (userCheck == 1) ? true : false;
};
AnnotationSelect.prototype.changeAnnoSet = function(e, pass, obj){
    obj.changeCall.fire({
        docId: obj.docId,
        annoId: obj.selectedId,
        annoName: obj.selectedName,
        priv: obj.selectedPriv
    });
    obj.clearAll(e, obj);
};
AnnotationSelect.prototype.startSavingNew = function(e, pass, args){
    var name = pass[0].name;
    var desc = pass[0].desc;
    var sec = pass[0].sec;
    var win = pass[0].self;
    var params = "?type=set&name=" + name + "&desc=" + desc + "&sec=" + sec;
    var file = "./lib/Annotation/saveAnnoSet.php" + params;
    var callback = {
        success: function(o){
            var test = o.responseText;
            var obj = o.argument.obj;
            var win = o.argument.win;
            if ((test == "Unique name already taken, please choose another") || (test == "Entries Blank")) {
                obj.annoWindow.body.insertBefore(document.createTextNode(test), obj.annoWindow.body.childNodes[2]);
            }
            else {
                obj.annoName = o.argument.name;
                obj.changeCall.fire({
                    annoName: obj.annoName,
                    annoId: o.responseText,
                    priv: true
                });
                obj.visibleNow.fire("open");
                obj.populateTables(obj);
            }
        },
        failure: function(o){
            alert("Failure connecting to server");
        },
        argument: {
            obj: args,
            win: win,
            name: name
        }
    };
    var transact = YAHOO.util.Connect.asyncRequest("GET", file, callback);
};
AnnotationSelect.prototype.clearAll = function(e, obj){
    footnotes = YAHOO.util.Dom.getElementsByClassName("infoFootnote");
    for (i = 0; i < footnotes.length; i++) {
        temp = footnotes[i];
        temp.parentNode.removeChild(temp);
    }
};
AnnoWindow = function(loc){
    this.loc = loc;
    this.DOM = document.createElement("div");
    this.DOM.className = "window newAnnoWindow";
    YAHOO.util.Dom.generateId(this.DOM, "window_anno");
    this.body = document.createElement("div");
    this.body.className = "window_body";
    this.permSelect = "public";
    this.content = document.createElement("div");
    this.content.className = "window_content";
    this.body.appendChild(this.content);
    this.closeBar = document.createElement("div");
    this.closeBar.className = "window_closebar";
    this.closeA = document.createElement("a");
    this.closeA.appendChild(document.createTextNode("Close"));
    this.closeA.className = "window_close";
    YAHOO.util.Event.addListener(this.closeA, "click", this.close, this);
    this.closeBar.appendChild(this.closeA);
    this.wintext = document.createElement("span");
    YAHOO.util.Dom.generateId(this.wintext);
    this.wintext.className = "window_text_anno";
    this.wintext.appendChild(document.createTextNode("Create New Annotation Set"));
    this.closeBar.appendChild(this.wintext);
    this.DOM.appendChild(this.closeBar);
    this.annoName = document.createElement("input");
    this.annoName.type = "text";
    this.annoName.className = "init_text";
    this.annoName.value = "";
    this.annoName.id = "annoName";
    this.annoDesc = document.createElement("input");
    this.annoDesc.type = "text";
    this.annoDesc.className = "init_text";
    this.annoDesc.value = "";
    this.annoDesc.id = "annoDesc";
    this.annoPrivate = document.createElement("input");
    this.annoPrivate.type = "checkbox";
    this.annoPrivate.className = "anno_radio";
    this.annoPrivate.name = "radio_group_anno1";
    YAHOO.util.Dom.generateId(this.annoPrivate, "annoPrivate");
    YAHOO.util.Event.addListener(this.annoPrivate.id, "click", function(e, obj){
        obj.permSelect = (obj.annoPrivate.checked) ? "private" : "public";
    }, this);
    this.body.appendChild(document.createTextNode("Name:"));
    this.body.appendChild(this.annoName);
    this.body.appendChild(document.createTextNode("Description:"));
    this.body.appendChild(this.annoDesc);
    this.body.appendChild(document.createElement("br"));
    this.body.appendChild(this.annoPrivate);
    this.body.appendChild(document.createTextNode(" Set to Private?"));
    this.startSave = document.createElement("span");
    YAHOO.util.Dom.generateId(this.startSave, "a");
    this.startSave.appendChild(document.createTextNode("Initialize"));
    this.startSave.className = "window_button";
    this.body.appendChild(this.startSave);
    YAHOO.util.Event.addListener(this.startSave.id, "click", this.initializeNewAnno, this);
    this.cancel = document.createElement("a");
    this.cancel.id = "annoNewCancel";
    this.cancel.className = "window_button";
    this.cancel.appendChild(document.createTextNode("Cancel"));
    YAHOO.util.Event.addListener(this.cancel.id, "click", this.close, this);
    this.body.appendChild(this.cancel);
    YAHOO.util.Dom.setStyle(this.DOM, "display", "none");
    this.newAnnoMade = new YAHOO.util.CustomEvent("newAnnoMade");
    this.DOM.appendChild(this.body);
};
AnnoWindow.prototype.close = function(e, obj){
    YAHOO.util.Dom.setStyle(obj.DOM, "display", "none");
    YAHOO.util.Dom.setStyle(obj.loc, "display", "block");
};
AnnoWindow.prototype.show = function(e, obj){
    YAHOO.util.Dom.setStyle(obj.DOM, "display", "block");
};
AnnoWindow.prototype.setPriv = function(e, obj){
};
AnnoWindow.prototype.initializeNewAnno = function(e, obj){
    obj.newAnnoMade.fire({
        name: obj.annoName.value,
        desc: obj.annoDesc.value,
        sec: obj.permSelect,
        self: obj
    });
    obj.annoName.value = "";
    obj.annoDesc.value = "";
    obj.close(e, obj);
};
AnnoListItem = function(id, values, type, mode, userid){
    this.values = values;
    this.DOM = document.createElement("div");
    YAHOO.util.Dom.generateId(this.DOM, id + "_");
    this.DOM.className = "fileitem";
    this.secure = values[5];
    this.fillValue = document.createElement("span");
    YAHOO.util.Dom.generateId(this.fillValue, "annoset");
    this.fillValue.className = "setDetails";
    this.setName = document.createElement("p");
    this.setName.appendChild(document.createTextNode(values[0]));
    this.setName.className = "setName";
    this.fillValue.appendChild(document.createTextNode(values[2]));
    this.fillValue.appendChild(document.createElement("br"));
    this.fillValue.appendChild(document.createTextNode("Creator: " + values[3] + " (" + values[5] + ")"));
    this.DOM.appendChild(this.setName);
    this.DOM.appendChild(this.fillValue);
    this.DOM.appendChild(this.fillValue);
    this.printViewSpace = document.createElement("div");
    YAHOO.util.Dom.generateId(this.printViewSpace, "pvs");
    this.printViewSpace.className = "PrintView";
    this.DOM.appendChild(this.printViewSpace);
    this.genLink(this);
    if (type == "mine") {
        this.edit = document.createElement("div");
		YAHOO.util.Dom.generateId(this.edit);
        this.edit.className = "annoEditButton";
        this.DOM.appendChild(this.edit);
        this.editText = document.createElement("a");
        this.editText.appendChild(document.createTextNode("Edit"));
        this.editText.id = "edit" + id;
        this.edit.appendChild(this.editText);
        YAHOO.util.Event.addListener(this.edit.id, "click", this.editShow, this);
        this.editBox = document.createElement("div");
        YAHOO.util.Dom.generateId(this.editBox, "editBox");
        this.editBox.className = "annoListEditBox";
        YAHOO.util.Dom.setStyle(this.editBox, "display", "none");
        this.DOM.appendChild(this.editBox);
        this.clearEdits = document.createElement("div");
        this.DOM.appendChild(this.clearEdits);
        this.secureSwitch = document.createElement("div");
        this.secureSwitch.className = "annoSecure";
        YAHOO.util.Dom.generateId(this.secureSwitch, "sw");
        this.editBox.appendChild(this.secureSwitch);
        if (this.secure == "public") {
            this.switchPrivate = document.createElement("a");
            this.switchPrivate.appendChild(document.createTextNode("Set to Private"));
            YAHOO.util.Dom.generateId(this.switchPrivate, "private");
            this.secureSwitch.appendChild(this.switchPrivate);
            this.secureSwitch.appendChild(document.createTextNode("When selected, this set will be invisible to other users. (You can access this set in the 'My Sets' panel.)"));
            YAHOO.util.Event.addListener(this.switchPrivate.id, "click", this.changeSecure, {
                obj: this,
                value: "private"
            });
        }
        else {
            if (this.secure == "private") {
                this.switchPublic = document.createElement("a");
                this.switchPublic.appendChild(document.createTextNode("Set to Public"));
                YAHOO.util.Dom.generateId(this.switchPublic, "public");
                this.secureSwitch.appendChild(this.switchPublic);
                this.secureSwitch.appendChild(document.createTextNode("When selected, this set will be visible to all other users."));
                YAHOO.util.Event.addListener(this.switchPublic.id, "click", this.changeSecure, {
                    obj: this,
                    value: "public"
                });
            }
        }
        this.delBox = document.createElement("div");
        this.delBox.className = "annoDelItem";
        this.delItem = document.createElement("a");
        this.delItem.appendChild(document.createTextNode("Delete Set"));
        this.delItem.id = "del" + id;
        this.delBox.appendChild(this.delItem);
        this.delBox.appendChild(document.createTextNode("Delete Annotation Set and all accompanying Annotations."));
        this.editBox.appendChild(this.delBox);
       /*
 this.editBoxClear = document.createElement("div");
        this.editBoxClear.className = "clear";
        this.editBox.appendChild(this.editBoxClear);
*/
        this.warn = document.createElement("span");
        this.warn.className = "annoWarn";
        this.warn.id = "warn" + id;
        this.warn.appendChild(document.createTextNode("Warning: This will erase the set and any annotations associated with this set. Continue?"));
        YAHOO.util.Dom.setStyle(this.warn, "display", "none");
        this.yes = document.createElement("a");
        this.yes.appendChild(document.createTextNode("Delete"));
        this.yes.className = "annoWarnButton";
        this.yes.id = "yes" + id;
        this.warn.appendChild(this.yes);
        YAHOO.util.Event.addListener(this.yes.id, "click", this.delThisEl, this);
        this.no = document.createElement("a");
        this.no.appendChild(document.createTextNode("Cancel"));
        this.no.className = "annoWarnButton";
        this.no.id = "cancel" + id;
        this.warn.appendChild(this.no);
        this.DOM.appendChild(this.warn);
		 YAHOO.util.Event.addListener(this.no.id, "click", function(e, obj){
            YAHOO.util.Dom.setStyle(obj.warn, "display", "none");
        }, this);
        YAHOO.util.Event.addListener(this.delItem.id, "click", function(e, obj){
            YAHOO.util.Dom.setStyle(obj.warn, "display", "block");
        }, this);
		//exporting sets
		this.exportdiv=document.createElement("div");
		YAHOO.util.Dom.generateId(this.exportdiv,'exp');
		this.exportdiv.className="exportHolder";
		this.exportset=document.createElement("div");
		YAHOO.util.Dom.generateId(this.exportset,'exp');
		this.exportset.className="annoExportItem";
		this.exporttext=document.createElement("a");
		YAHOO.util.Dom.generateId(this.exporttext);
		this.exporttext.className="cleartext";
		this.exporttext.appendChild(document.createTextNode("Export Set"));
		this.exporttext.href="./lib/Annotation/annoSetExport.php?set="+id;
		this.exportset.appendChild(this.exporttext);
		this.exportdiv.appendChild(this.exportset);
		this.exportdiv.appendChild(document.createTextNode("Export this annotation set into an XML file."));
		this.editBox.appendChild(this.exportdiv);
		this.clearElement=document.createElement("div");
		this.clearElement.className="clear";
		this.editBox.appendChild(this.clearElement);
		//YAHOO.util.Event.addListener(this.exportset.id,"click",this.exportAnnoSet,this);
       
    }
    else {
        if ((type == "all") && (userid)) {
            this.choiceField = document.createElement("div");
            this.choiceField.className = "annoAllChoiceField";
            YAHOO.util.Dom.generateId(this.choiceField, "choice");
            this.choice = document.createElement("input");
            this.choice.type = "checkbox";
            YAHOO.util.Dom.generateId(this.choice, "addtoMine");
            this.choiceField.appendChild(this.choice);
            txt = (mode == "add") ? "Add to My Sets: " : "Remove from My Sets: ";
            this.choiceField.insertBefore(document.createTextNode(txt), this.choice);
            if (mode == "add") {
                YAHOO.util.Event.addListener(this.choice.id, "click", this.addList, this);
            }
            else {
                YAHOO.util.Event.addListener(this.choice.id, "click", this.removeList, this);
            }
            this.DOM.appendChild(this.choiceField);
        }
    }
    this.choose = new YAHOO.util.CustomEvent("choose");
    this.removeItem = new YAHOO.util.CustomEvent("removeItem");
    this.clicked = new YAHOO.util.CustomEvent("clicked");
    this.dbclicked = new YAHOO.util.CustomEvent("dblclicked");
    this.add = new YAHOO.util.CustomEvent("add");
    this.reload = new YAHOO.util.CustomEvent("reload");
    YAHOO.util.Event.addListener(this.DOM.id, "mouseover", function(e, obj){
        priv = (obj.values[4] == "true") ? true : false;
        obj.choose.fire({
            id: obj.values[1],
            name: obj.values[0],
            priv: priv
        });
    }, this);
    YAHOO.util.Event.addListener(this.DOM.id, "dblclick", this.handleClick, this);
};
AnnoListItem.prototype.changeSecure = function(e, args){
    YAHOO.util.Event.stopEvent(e);
    obj = args.obj;
    value = args.value;
    n = obj.DOM.id.indexOf("_");
    tId = obj.DOM.id.substring(0, n);
    var sUrl = "./lib/Annotation/changeAnno.php?type=set&id=" + tId + "&change=" + value;
    var callback = {
        success: function(o){
            obj = o.argument[0];
            value = o.argument[1];
            obj.secure = value;
            obj.reload.fire();
        },
        failure: function(o){
            alert("Failure to connect to server [AnnotationSelect.js 647]");
        },
        argument: [obj, value]
    };
    var transact = YAHOO.util.Connect.asyncRequest("GET", sUrl, callback);
    setTimeout(function(){
        if (YAHOO.util.Connect.isCallInProgress(transact)) {
            YAHOO.util.Connect.abort(transact);
            alert("Server Timed Out");
        }
    }, 5000);
};
AnnoListItem.prototype.genLink = function(obj){
    el = document.createElement("a");
    el.href = "./lib/AnnotationSelect/markerHTML.php?setId=" + obj.values[1];
    el.target = "_blank";
    el.appendChild(document.createTextNode("Print View"));
    obj.printViewSpace.appendChild(el);
};
AnnoListItem.prototype.addList = function(e, obj){
    YAHOO.util.Event.stopEvent(e);
    obj.add.fire(obj);
};
AnnoListItem.prototype.removeList = function(e, obj){
    YAHOO.util.Event.stopEvent(e);
    obj.remove.fire(obj);
};
AnnoListItem.prototype.remove = function(e, obj){
    YAHOO.util.Event.stopEvent(e);
    obj.remove.fire(obj.DOM);
};
AnnoListItem.prototype.editShow = function(e, obj){
    YAHOO.util.Event.stopPropagation(e);
    YAHOO.util.Event.removeListener(obj.edit.id, "click", obj.editShow);
    YAHOO.util.Event.addListener(obj.edit.id, "click", obj.editHide, obj);
    YAHOO.util.Dom.setStyle(obj.editBox, "display", "block");
};
AnnoListItem.prototype.editHide = function(e, obj){
    YAHOO.util.Event.stopEvent(e);
    YAHOO.util.Event.removeListener(obj.edit.id, "click", obj.ediHide);
    YAHOO.util.Event.addListener(obj.edit.id, "click", obj.editShow, obj);
    YAHOO.util.Dom.setStyle(obj.editBox, "display", "none");
};
AnnoListItem.prototype.handleClick = function(e, obj){
    obj.clicked.fire(obj.values);
};
AnnoListItem.prototype.handleDblClick = function(e, obj){
    obj.dblclicked.fire(obj.values);
};
AnnoListItem.prototype.delThisEl = function(e, obj){
    YAHOO.util.Event.stopEvent(e);
    var sUrl = "./lib/Annotation/deleteAnno.php?type=set&id=" + obj.values[1];
    callback = {
        success: function(o){
            o.argument[0].removeItem.fire(obj.DOM);
        },
        failure: function(o){
            alert("Failure connecting to server");
        },
        argument: [obj]
    };
    var transact = YAHOO.util.Connect.asyncRequest("GET", sUrl, callback);
    setTimeout(function(){
        if (YAHOO.util.Connect.isCallInProgress(transact)) {
            YAHOO.util.Connect.abort(transact);
            alert("Server Timed Out");
        }
    }, 5000);
};

