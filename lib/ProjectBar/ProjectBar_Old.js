ProjectBar = function(a){
    this.DOM = document.createElement("div");
    this.DOM.id = "nav";
    this.DOM.className = "projectBar_main";
    //this.qSel = new QuartoSelect();
	this.qSel=new ArchSelect;
    this.userBox = document.createElement("div");
    YAHOO.util.Dom.generateId(this.userBox, "pUserBox");
    this.userBox.className = "projectBar_userBox";
    this.publicBox = document.createElement("div");
    YAHOO.util.Dom.generateId(this.publicBox, "pPublicBox");
    this.publicBox.className = "projectBar_publicBox";
    this.DOM.appendChild(this.userBox);
    this.DOM.appendChild(this.publicBox);
    this.startProject = new YAHOO.util.CustomEvent("startProject");
    this.closeProject = new YAHOO.util.CustomEvent("closeProject");
    this.saveToProject = new YAHOO.util.CustomEvent("saveToProject");
    this.startUpWindow = new YAHOO.util.CustomEvent("startUpWindow");
    this.remoteButtonClick = new YAHOO.util.CustomEvent("remoteButtonClick");
    this.projectReady = new YAHOO.util.CustomEvent("projectReady");
    this.changeOpenPanel = new YAHOO.util.CustomEvent("changeOpenPanel");
    this.exhibitWindowClicked = new YAHOO.util.CustomEvent("exhibitWindowClicked");
    this.IEunhidewindow = new YAHOO.util.CustomEvent("IEunhidewindow");
    this.objReady = new YAHOO.util.CustomEvent("objReady");
    this.objRemove = new YAHOO.util.CustomEvent("objRemove");
    this.setAlert = new YAHOO.util.CustomEvent("setAlert");
    this.terminateListen = new YAHOO.util.CustomEvent("terminateListen");
    this.projectName = "untitled";
    this.projectId = null;
    this.annoName = null;
    this.properties = new Array();
    this.lock = false;
    this.sendToSearch = null;
    this.toggleMode = "none";
    this.topPanelId = null;
    this.info = document.createElement("div");
    this.info.id = "thishereinfo";
    YAHOO.util.Dom.setStyle(this.info, "width", "100px");
    YAHOO.util.Dom.setStyle(this.info, "height", "100px");
    this.startProject.subscribe(this.loadProject, this);
    YAHOO.util.Event.onAvailable(this.DOM.id, function(b){
        b.createOpenWindow("", {
            obj: b,
            type: "open an exhibit"
        });
        b.createSaveWindow("", {
            obj: b,
            type: "save to..."
        });
        b.createNewWindow("", {
            obj: b,
            type: "New Exhibit..."
        });
        b.setUpUserBox(b);
        b.setUpPublicBox(b);
    }, this);
	
	this.qselattach=a.qselattach;
    a.attach.appendChild(this.DOM);
};
ProjectBar.prototype.initSelect = function(a){
    wins = YAHOO.util.Dom.getElementsByClassName("panel_InBckGrnd yui-resize", "div");
    if (wins.length == 0) {
       // a.qSel.winToggle(null, a.qSel);
	   //alert(a.qSel.DOM);
       YAHOO.util.Dom.setStyle(a.qSel.DOM,'display','block');
	   // a.exhibitWindowClicked.fire(a.qSel);
        a.backWin([a.extrasBox.DOM, a.newWindow, a.saveWindow, a.openWindow, a.searchBar.DOM]);
        a.frontWin(a.qSel.DOM);
    }
};
ProjectBar.prototype.topPanel = function(c, b, a){
    a.topPanelId = b[0];
};
ProjectBar.prototype.setUpPublicBox = function(a){
	if(a.qselattach){
		a.qselattach.appendChild(a.qSel.DOM);
	} else {
		a.DOM.parentNode.appendChild(a.qSel.DOM);
	}
    
	/*
a.qSel.quartoSelected.subscribe(function(f, c, b){
        b.startUpWindow.fire(c[0]);
        b.IEunhidewindow.fire();
    }, a);
    a.qSel.closed.subscribe(function(f, c, b){
        b.IEunhidewindow.fire();
    }, a);
    YAHOO.util.Event.addListener(a.qSel.windowCloseBar, "click", function(f, c, b){
        b.exhibitWindowClicked.fire(b.qSel.DOM);
    }, a);
*/
    a.callNewPanel = document.createElement("li");
    YAHOO.util.Dom.generateId(a.callNewPanel, "nav");
    a.callNewPanel.appendChild(document.createTextNode("New Panel"));
    a.callNewPanel.className = "projectBar_button";
    a.publicBox.appendChild(a.callNewPanel);
    YAHOO.util.Event.addListener(a.callNewPanel, "click", function(f, c){
        var b = YAHOO.util.Dom.getStyle(c.qSel.DOM, "display");
        if (b == "none") {
            //c.qSel.winToggle("click", c.qSel);
            YAHOO.util.Dom.setStyle(c.qSel.DOM,'display','block');
			//c.exhibitWindowClicked.fire(c.qSel);
            c.backWin([c.extrasBox.DOM, c.newWindow, c.saveWindow, c.openWindow, c.searchBar.DOM]);
            c.frontWin(c.qSel.DOM);
        }
        else {
            c.backWin([c.qSel.DOM]);
            c.IEunhidewindow.fire(c.qSel.DOM);
        }
    }, a);
    a.cropToggle = document.createElement("li");
    YAHOO.util.Dom.generateId(a.cropToggle, "nav");
    a.cropToggle.className = "projectBar_button";
    a.cropToggle.appendChild(document.createTextNode("Crop"));
    a.publicBox.appendChild(a.cropToggle);
    YAHOO.util.Event.addListener(a.cropToggle, "click", a.enterCrop, a);
    a.searchBar = new searchBox(a.qselattach);
    a.searchBar.remotePanelOpen.subscribe(function(f, c, b){
        b.startUpWindow.fire(c[0]);
    }, a);
    a.searchToggle = document.createElement("li");
    YAHOO.util.Dom.generateId(a.searchToggle, "search");
    a.searchToggle.className = "projectBar_button";
    a.searchToggle.appendChild(document.createTextNode("Search"));
    YAHOO.util.Event.addListener(a.searchToggle, "click", function(f, c){
        c.searchBar.closeWin("", c.searchBar);
        //c.exhibitWindowClicked.fire(c.searchBar.DOM);
        c.backWin([c.newWindow, c.openWindow, c.saveWindow, c.qSel.DOM, c.extrasBox.DOM]);
        c.sendToSearch = false;
        var b = YAHOO.util.Dom.getStyle(c.searchBar.DOM, "display");
        if (b == "none") {
            c.IEunhidewindow.fire(c.searchBar.DOM);
        }
    }, a);
    a.searchBar.closed.subscribe(function(f, c, b){
        b.IEunhidewindow.fire(b.searchBar.DOM);
    }, a);
    a.publicBox.appendChild(a.searchToggle);
    a.extrasBox = new QueLines(a.qselattach);
    YAHOO.util.Dom.setStyle(a.extrasBox.DOM, "display", "none");
    a.callExtras = document.createElement("li");
    YAHOO.util.Dom.generateId(a.callExtras, "nav");
    a.callExtras.appendChild(document.createTextNode("Text Search"));
    a.callExtras.className = "projectBar_button";
    YAHOO.util.Event.addListener(a.callExtras, "click", function(f, c){
        
        var b = YAHOO.util.Dom.getStyle(c.extrasBox.DOM, "display");
        if (b == "none") {
            c.extrasBox.findLimiters(c.extrasBox);
            //c.exhibitWindowClicked.fire(c.extrasBox.DOM);
            c.frontWin(c.extrasBox.DOM);
            c.backWin([c.qSel.DOM, c.searchBar.DOM, c.newWindow, c.saveWindow, c.openWindow]);
        }
        else {
            c.backWin([c.extrasBox.DOM]);
            c.IEunhidewindow.fire(c.qSel.DOM);
        }
    }, a);
    a.extrasBox.closed.subscribe(function(f, c, b){
        b.IEunhidewindow.fire(b.extrasBox.DOM);
    }, a);
    a.publicBox.appendChild(a.callExtras);
};
ProjectBar.prototype.frontWin = function(a){
    YAHOO.util.Dom.setStyle(a, "display", "block");
    YAHOO.util.Dom.setStyle(a, "z-index", "1111");
};
ProjectBar.prototype.backWin = function(a){
    for (i in a) {
        YAHOO.util.Dom.setStyle(a[i], "display", "none");
    }
};
ProjectBar.prototype.resetPublicBox = function(a){
    a.annoToggle.className = "projectBar_button";
    a.cropToggle.className = "projectBar_button";
	
    if (a.toggleMode == "annotate") {
        a.exitAnno("", a);
    }
    else {
        if (a.toggleMode == "crop") {
            a.exitCrop("", a);
        }
    }
    a.toggleMode = "none";
};
ProjectBar.prototype.enterCrop = function(b, a){
    if (a.toggleMode == "annotate") {
        a.exitAnno("", a);
    }
    a.remoteButtonClick.fire({
        mode: "crop",
        id: a.topPanelId
    });
    a.toggleMode = "crop";
    a.cropToggle.className = "projectBar_button_selected";
    a.annoToggle.className = "projectBar_button";
    YAHOO.util.Event.removeListener(a.cropToggle, "click", a.enterCrop);
    YAHOO.util.Event.addListener(a.cropToggle, "click", a.exitCropHR, a);
};
ProjectBar.prototype.exitCropHR = function(b, a){
    a.toggleMode = "none";
    a.terminateListen.fire({
        id: a.topPanelId,
        mode: "none"
    });
    a.cropToggle.className = "projectBar_button";
    YAHOO.util.Event.removeListener(a.cropToggle, "click", a.exitCropHR);
    YAHOO.util.Event.addListener(a.cropToggle, "click", a.enterCrop, a);
};
ProjectBar.prototype.exitCrop = function(b, a){
    a.toggleMode = "none";
    a.cropToggle.className = "projectBar_button";
    YAHOO.util.Event.removeListener(a.cropToggle, "click", a.exitCropHR);
    YAHOO.util.Event.addListener(a.cropToggle, "click", a.enterCrop, a);
};
ProjectBar.prototype.enterAnno = function(b, a){
   
    a.annoToggle.className = "projectBar_button_selected";
    if (a.toggleMode == "crop") {
        a.exitCrop("", a);
    }
	 a.remoteButtonClick.fire({
        mode: "annotation",
        id: a.topPanelId
    });
    a.toggleMode = "annotate";
    a.cropToggle.className = "projectBar_button";
    YAHOO.util.Event.removeListener(a.annoToggle, "click", a.enterAnno);
    YAHOO.util.Event.addListener(a.annoToggle, "click", a.exitAnnoHR, a);
};
ProjectBar.prototype.exitAnnoHR = function(b, a){
    a.toggleMode = "none";
    a.terminateListen.fire({
        id: a.topPanelId,
        mode: "none"
    });
    a.annoToggle.className = "projectBar_button";
    YAHOO.util.Event.removeListener(a.annoToggle, "click", a.exitAnnoHR);
    YAHOO.util.Event.addListener(a.annoToggle, "click", a.enterAnno, a);
};
ProjectBar.prototype.exitAnno = function(b, a){
    a.toggleMode = "none";
    a.annoToggle.className = "projectBar_button";
    YAHOO.util.Event.removeListener(a.annoToggle, "click", a.exitAnnoHR);
    YAHOO.util.Event.addListener(a.annoToggle, "click", a.enterAnno, a);
};
ProjectBar.prototype.changeInfo = function(a, b){
    if (b.quartoDisplay.firstChild) {
        b.quartoDisplay.removeChild(b.quartoDisplay.firstChild);
    }
    b.quartoDisplay.appendChild(document.createTextNode(a));
};
ProjectBar.prototype.setCurrPanel = function(a, e){
    if (!(e.sendToSearch == false)) {
        var b = e.sendToSearch[4].indexOf("0");
        var c = e.sendToSearch[4].substring(b);
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
        a.curPageNum = parseInt(c);
    }
    else {
        a.curPageNum = parseInt(c);
        a.showPage(c);
    }
};
ProjectBar.prototype.userEnters = function(f, c, b){
    var a = c[0];
    b.properties.user = a.user;
    b.properties.uID = a.userid;
    b.getOpenList(b.openWindow.openSelect, "mine", b);
    b.getSaveList(b.saveWindow.winSelect, "mine", b);
    if ((a.loggedIn == true) && (YAHOO.util.Dom.getStyle(b.openProject, "display") == "none")) {
        YAHOO.util.Dom.setStyle(b.openProject, "display", "block");
        YAHOO.util.Dom.setStyle(b.saveState, "display", "block");
        YAHOO.util.Dom.setStyle(b.annoToggle, "display", "block");
        YAHOO.util.Dom.setStyle(b.lblNote, "display", "block");
    }
    else {
        if ((a.loggedIn == false) && (YAHOO.util.Dom.getStyle(b.openProject, "display") == "block")) {
            YAHOO.util.Dom.setStyle(b.openProject, "display", "none");
            YAHOO.util.Dom.setStyle(b.saveState, "display", "none");
            YAHOO.util.Dom.setStyle(b.annoToggle, "display", "none");
            YAHOO.util.Dom.setStyle(b.lblNote, "display", "none");
            if (b.newWindow) {
                if (YAHOO.util.Dom.getStyle(b.newWindow, "display") == "block") {
                    YAHOO.util.Dom.setStyle(b.newWindow, "display", "none");
                }
            }
            if (b.openWindow) {
                if (YAHOO.util.Dom.getStyle(b.openWindow, "display") == "block") {
                    YAHOO.util.Dom.setStyle(b.newWindow, "display", "none");
                }
            }
            if (b.saveWindow) {
                if (YAHOO.util.Dom.getStyle(b.saveWindow, "display") == "block") {
                    YAHOO.util.Dom.setStyle(b.newWindow, "display", "none");
                }
            }
        }
    }
};
ProjectBar.prototype.checkOpenProjects = function(b){
    var a = "./lib/ProjectBar/getProjects.php?mode=current";
    var c = {
        success: function(g){
            var e = g.responseText.split("\n");
            var f = g.argument[0];
            if (e[0] == "True") {
                f.projectName = e[1];
                f.projectId = e[2];
                f.projectReady.fire({
                    project: f.projectName,
                    projectId: f.projectId
                });
            }
        },
        failure: function(e){
            alert("Error in connecting to server");
        },
        argument: [b]
    };
};
ProjectBar.prototype.setUpUserBox = function(a){
    a.openProject = document.createElement("li");
    YAHOO.util.Dom.generateId(a.openProject, "nav");
    a.openProject.className = "projectBar_button";
    a.openProject.appendChild(document.createTextNode("Open Exhibit"));
    a.userBox.appendChild(a.openProject);
    YAHOO.util.Dom.setStyle(a.openProject, "display", "none");
    YAHOO.util.Event.addListener(a.openProject.id, "click", function(f, c){
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
    }, a);
    a.saveState = document.createElement("li");
    YAHOO.util.Dom.generateId(a.saveState, "nav");
    a.saveState.className = "projectBar_button";
    a.saveState.appendChild(document.createTextNode("Save Exhibit"));
    a.userBox.appendChild(a.saveState);
    YAHOO.util.Dom.setStyle(a.saveState, "display", "none");
    YAHOO.util.Event.addListener(a.saveState, "click", function(f, c){
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
    }, a);
    a.annoToggle = document.createElement("li");
    YAHOO.util.Dom.generateId(a.annoToggle, "nav");
    a.annoToggle.className = "projectBar_button";
    a.annoToggle.appendChild(document.createTextNode("Annotate Page"));
    YAHOO.util.Dom.setStyle(a.annoToggle, "display", "none");
    a.userBox.appendChild(a.annoToggle);
    YAHOO.util.Event.addListener(a.annoToggle, "click", a.enterAnno, a);
    a.lblNote = document.createElement("li");
    YAHOO.util.Dom.generateId(a.lblNote, "nav");
    a.lblNote.className = "projectBar_button";
    a.lblNote.appendChild(document.createTextNode("Label"));
    YAHOO.util.Dom.setStyle(a.lblNote, "display", "none");
    a.userBox.appendChild(a.lblNote);
    YAHOO.util.Event.addListener(a.lblNote, "click", a.createLabel, a);
};
ProjectBar.prototype.createLabel = function(c, b){
    var a = new LabelBox();
    b.qselattach.appendChild(a.DOM);
    a.objClosed.subscribe(function(j, h, g){
        g.objRemove.fire(h[0]);
    }, b);
	
    b.backWin([b.saveWindow, b.newWindow, b.openWindow, b.extrasBox.DOM, b.searchBar.DOM, b.qSel.DOM]);
    b.objReady.fire(a);
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
};

ProjectBar.prototype.createButton = function(a, c, b){
    HTML = document.createElement("li");
    YAHOO.util.Dom.generateId(HTML, "nav");
    li = document.createElement("li");
    li.className = "navlink";
    img = document.createElement("img");
    img.src = "./images/icon_" + a + ".png";
    li.appendChild(img);
    li.appendChild(document.createTextNode(a));
    HTML.appendChild(li);
};
ProjectBar.prototype.setExhibitWindow = function(c, b, a){
    if (!(a.id == b[0])) {
    }
};
ProjectBar.prototype.panelClicked = function(c, b, a){
    a.backWin([a.newWindow, a.saveWindow, a.openWindow, a.qSel.DOm, a.searchBar.DOM, a.extrasBox.DOM]);
};
ProjectBar.prototype.createNewWindow = function(f, a){
    var c = a.obj;
    var b = a.type;
    c.newWindow = document.createElement("div");
	YAHOO.util.Dom.generateId(c.newWindow,'ho');
	c.newWindow.dark=document.createElement("div");
	YAHOO.util.Dom.generateId(c.newWindow.dark,'dark');
	c.newWindow.dark.className="project_back";
	
	c.newWindow.main=document.createElement("div");
	 YAHOO.util.Dom.generateId(c.newWindow.main, "nWin");
    c.newWindow.main.className = "newWindow";
   
    c.newWindow.body = document.createElement("div");
    c.newWindow.body.className = "window_body";
    c.newWindow.content = document.createElement("div");
    c.newWindow.content.className = "window_content";
    c.newWindow.body.appendChild(c.newWindow.content);
    c.newWindow.closeBar = document.createElement("div");
    YAHOO.util.Dom.generateId(c.newWindow.closeBar, "handle");
    c.newWindow.closeBar.className = "window_closebar";
    c.newWindow.closeA = document.createElement("a");
    //c.newWindow.closeA.appendChild(document.createTextNode("Close"));
    c.newWindow.closeA.className = "window_close";
    YAHOO.util.Event.addListener(c.newWindow.closeA, "click", function(h, g){
		YAHOO.util.Dom.setStyle(g.newWindow,'display','none');
		YAHOO.util.Dom.setStyle(g.saveWindow,'display','block');
       }, c);
    c.newWindow.closeBar.appendChild(c.newWindow.closeA);
	c.newWindow.appendChild(c.newWindow.dark);
	c.newWindow.appendChild(c.newWindow.main);
    c.newWindow.main.appendChild(c.newWindow.closeBar);
    c.newWindow.main.appendChild(c.newWindow.body);
    c.newWindow.openTitle = document.createElement("span");
    YAHOO.util.Dom.generateId(c.newWindow.openTitle, "handle");
    c.newWindow.openTitle.className = "window_title";
    c.newWindow.openTitle.appendChild(document.createTextNode("Create a New Exhibit"));
    c.newWindow.closeBar.appendChild(c.newWindow.openTitle);
    c.newWindow.newBarText = document.createElement("input");
    c.newWindow.newBarText.type = "text";
    c.newWindow.newBarText.className = "init_text";
    c.newWindow.newBarText.value = "";
    c.newWindow.newBarText.id = "projectname";
    c.newWindow.newDescText = document.createElement("textarea");
    YAHOO.util.Dom.generateId(c.newWindow.newDescText,'txt');
    c.newWindow.newDescText.className = "init_desc";
	c.newWindow.newDescText.cols="22"
    c.newWindow.newDescText.value = "";
    c.newWindow.newDescText.id = "pID";
    c.newWindow.body.appendChild(document.createTextNode("Name:"));
    c.newWindow.body.appendChild(c.newWindow.newBarText);
    c.newWindow.body.appendChild(c.newWindow.newDescText);
    c.newWindow.body.insertBefore(document.createTextNode("Description for the Exhibit: (Users will see this when they select the project)"), c.newWindow.newDescText);
    c.newWindow.initiate = document.createElement("span");
    c.newWindow.initiate.className = "window_button";
    c.newWindow.initiate.appendChild(document.createTextNode("Create"));
    YAHOO.util.Dom.generateId(c.newWindow.initiate, "ini");
    
    c.newWindow.back = document.createElement("span");
    c.newWindow.back.className = "window_button";
    c.newWindow.back.appendChild(document.createTextNode("Back to 'Save To...'"));
    c.newWindow.body.appendChild(c.newWindow.back);
	c.newWindow.body.appendChild(c.newWindow.initiate);
    c.newWindow.infoWin = document.createElement("div");
    c.newWindow.infoWin.className = "window_infoWin";
    c.newWindow.body.appendChild(c.newWindow.infoWin);
	
	c.newWindow.warningwrapper=document.createElement("span");
	YAHOO.util.Dom.generateId(c.newWindow.warningwrapper,'warn');
	c.newWindow.warningwrapper.className="warningwrapper";
	c.newWindow.warningwrapper.appendChild(document.createTextNode("**NOTE: All exhibits are PUBLIC. This means all users can see what you have created."));
	c.newWindow.body.appendChild(c.newWindow.warningwrapper);
    c.qselattach.appendChild(c.newWindow);
    YAHOO.util.Dom.setStyle(c.newWindow, "display", "none");
    YAHOO.util.Event.onAvailable(c.newWindow.id, function(e){
        e.newDrag = new YAHOO.util.DD(e.main.id);
        e.newDrag.setHandleElId(e.closeBar.id);
        e.newResize = new YAHOO.util.Resize(e.main.id, {
            handles: "all"
        });
    }, c.newWindow);
    YAHOO.util.Event.addListener(c.newWindow.back, "click", function(h, g){
        g.frontWin(g.saveWindow);
        g.backWin([g.newWindow, g.openWindow, g.qSel.DOM, g.searchBar.DOM, g.extrasBox.DOM]);
    }, c);
    YAHOO.util.Event.addListener(c.newWindow.initiate.id, "click", c.initializeNewProject, {
        obj: c,
        win: c.newWindow
    });
};
ProjectBar.prototype.createSaveWindow = function(b, a){
    obj = a.obj;
    type = a.type;
    obj.saveWindow = document.createElement("div");
	YAHOO.util.Dom.generateId(obj.saveWindow, "ho");
	
	obj.saveWindow.dark=document.createElement("div");
	YAHOO.util.Dom.generateId(obj.saveWindow,'dark');
	obj.saveWindow.dark.className="project_back";
	
	
	obj.saveWindow.main=document.createElement("div");
    obj.saveWindow.main.className = "saveWindow";
    YAHOO.util.Dom.generateId(obj.saveWindow.main, "sWin");
    obj.saveWindow.body = document.createElement("div");
    obj.saveWindow.body.className = "window_body";
    obj.saveWindow.content = document.createElement("div");
    obj.saveWindow.content.className = "window_content";
    obj.saveWindow.body.appendChild(obj.saveWindow.content);
    obj.saveWindow.closeBar = document.createElement("div");
    YAHOO.util.Dom.generateId(obj.saveWindow.closeBar, "handle");
    obj.saveWindow.closeBar.className = "window_closebar";
    obj.saveWindow.closeA = document.createElement("a");
    //obj.saveWindow.closeA.appendChild(document.createTextNode("Close"));
    obj.saveWindow.closeA.className = "window_close";
    YAHOO.util.Event.addListener(obj.saveWindow.closeA, "click", function(f, c){
        YAHOO.util.Dom.setStyle(c.saveWindow, "display", "none");
        c.IEunhidewindow.fire(c.saveWindow);
    }, obj);
    obj.saveWindow.closeBar.appendChild(obj.saveWindow.closeA);
	obj.saveWindow.appendChild(obj.saveWindow.dark);
	obj.saveWindow.appendChild(obj.saveWindow.main);
    obj.saveWindow.main.appendChild(obj.saveWindow.closeBar);
    obj.saveWindow.main.appendChild(obj.saveWindow.body);
    obj.saveWindow.openTitle = document.createElement("span");
    YAHOO.util.Dom.generateId(obj.saveWindow.openTitle, "handle");
    obj.saveWindow.openTitle.className = "window_title";
    obj.saveWindow.openTitle.appendChild(document.createTextNode("Save To..."));
    obj.saveWindow.closeBar.appendChild(obj.saveWindow.openTitle);
    obj.saveWindow.winSelect = document.createElement("div");
    obj.saveWindow.winSelect.id = "docList_open";
    obj.saveWindow.winSelect.className = "window_select";
    obj.saveWindow.body.appendChild(obj.saveWindow.winSelect);
    obj.saveWindow.body.insertBefore(document.createTextNode("You've Already Made:"), obj.saveWindow.winSelect);
    obj.saveWindow.infoWin = document.createElement("div");
    obj.saveWindow.infoWin.className = "window_infoWin";
    obj.saveWindow.body.insertBefore(obj.saveWindow.infoWin, obj.saveWindow.winSelect);
    a1 = document.createElement("span");
    YAHOO.util.Dom.generateId(a1, "a");
    a1.appendChild(document.createTextNode("Save"));
    a1.className = "window_button";
    obj.saveWindow.body.appendChild(a1);
    YAHOO.util.Event.addListener(a1.id, "click", obj.saveSelectedProj, {
        obj: obj,
        win: obj.saveWindow
    });
    a2 = document.createElement("a");
    a2.appendChild(document.createTextNode("Cancel"));
    a2.className = "window_button";
    YAHOO.util.Event.addListener(a2, "click", function(f, c){
        YAHOO.util.Dom.setStyle(c.saveWindow, "display", "none");
        c.IEunhidewindow.fire(c.saveWindow);
    }, obj);
    obj.saveWindow.body.appendChild(a2);
    a3 = document.createElement("span");
    a3.appendChild(document.createTextNode("New..."));
    a3.className = "window_button";
    YAHOO.util.Event.addListener(a3, "click", function(f, c){
        YAHOO.util.Dom.setStyle(c.newWindow, "display", "block");
        YAHOO.util.Dom.setStyle(c.saveWindow, "display", "none");
        c.frontWin(c.newWindow);
        c.backWin([c.saveWindow, c.openWindow, c.searchBar.DOM, c.extrasBox.DOM, c.qSel.DOM]);
    }, obj);
    obj.saveWindow.body.appendChild(a3);
    obj.floatClear = document.createElement("div");
    obj.floatClear.className = "clear";
    obj.saveWindow.body.appendChild(obj.floatClear);
    YAHOO.util.Dom.setStyle(obj.saveWindow, "display", "none");
    YAHOO.util.Event.onAvailable(obj.saveWindow.id, function(c){
        c.saveDrag = new YAHOO.util.DD(c.main.id);
        c.saveDrag.setHandleElId(c.closeBar.id);
        c.saveResize = new YAHOO.util.Resize(c.main.id, {
            handles: "all"
        });
    }, obj.saveWindow);
    obj.qselattach.appendChild(obj.saveWindow);
};
ProjectBar.prototype.createOpenWindow = function(b, a){
    obj = a.obj;
    type = a.type;
    if (!obj.openWindow) {
		obj.openWindow=document.createElement("div");
		YAHOO.util.Dom.generateId(obj.openWindow,'ho');
		
        obj.openWindow.main = document.createElement("div");
        obj.openWindow.main.className = "openWindow";
        YAHOO.util.Dom.generateId(obj.openWindow.main, "oWin");
        obj.openWindow.body = document.createElement("div");
        obj.openWindow.body.className = "window_body";
		
		obj.openWindow.dark=document.createElement("div");
		YAHOO.util.Dom.generateId(obj.openWindow,'dark');
		obj.openWindow.dark.className="project_back";
		
		
        obj.openWindow.content = document.createElement("div");
        obj.openWindow.content.className = "window_content";
        obj.openWindow.body.appendChild(obj.openWindow.content);
        obj.openWindow.closeBar = document.createElement("div");
        YAHOO.util.Dom.generateId(obj.openWindow.closeBar, "handle");
        obj.openWindow.closeBar.className = "window_closebar";
        obj.openWindow.closeA = document.createElement("a");
        //obj.openWindow.closeA.appendChild(document.createTextNode("Close"));
        obj.openWindow.closeA.className = "window_close";
        YAHOO.util.Event.addListener(obj.openWindow.closeA, "click", function(f, c){
            YAHOO.util.Event.removeListener(document, "keypress", c.handleKeyPress);
            c.backWin([c.openWindow]);
            c.IEunhidewindow.fire(c.openWindow);
        }, obj);
        obj.openWindow.closeBar.appendChild(obj.openWindow.closeA);
		obj.openWindow.appendChild(obj.openWindow.dark);
		obj.openWindow.appendChild(obj.openWindow.main);
        obj.openWindow.main.appendChild(obj.openWindow.closeBar);
        obj.openWindow.main.appendChild(obj.openWindow.body);
        YAHOO.util.Dom.setStyle(obj.openWindow.main, "display", "block");
        obj.openWindow.openTitle = document.createElement("span");
        obj.openWindow.openTitle.className = "window_title";
        obj.openWindow.openTitle.appendChild(document.createTextNode("Open an Existing Exhibit"));
        obj.openWindow.closeBar.appendChild(obj.openWindow.openTitle);
        obj.openWindow.openSelect = document.createElement("div");
        obj.openWindow.openSelect.id = "docList_open";
        obj.openWindow.openSelect.className = "window_select";
        obj.openWindow.body.appendChild(obj.openWindow.openSelect);
        obj.openWindow.viewForm = document.createElement("div");
        obj.openWindow.viewForm.className = "viewForm";
        YAHOO.util.Dom.generateId(obj.openWindow.viewForm);
        obj.openWindow.viewAll = document.createElement("span");
        YAHOO.util.Dom.generateId(obj.openWindow.viewAll);
        obj.openWindow.viewAll.className = "viewChoice";
        obj.openWindow.viewAll.appendChild(document.createTextNode("Public Exhibits"));
        YAHOO.util.Event.addListener(obj.openWindow.viewAll.id, "click", function(f, c){
            c.obj.openWindow.viewAll.className = "viewChoice_hl";
            c.obj.openWindow.viewMine.className = "viewChoice";
            c.obj.getOpenList(c.list, c.mode, c.obj);
        }, {
            obj: obj,
            list: obj.openWindow.openSelect,
            mode: "all"
        });
        obj.openWindow.viewForm.appendChild(obj.openWindow.viewAll);
        obj.openWindow.viewMine = document.createElement("span");
        YAHOO.util.Dom.generateId(obj.openWindow.viewMine);
        obj.openWindow.viewMine.className = "viewChoice_hl";
        obj.openWindow.viewMine.appendChild(document.createTextNode("My Exhibits"));
        YAHOO.util.Event.addListener(obj.openWindow.viewMine.id, "click", function(f, c){
            c.obj.openWindow.viewMine.className = "viewChoice_hl";
            c.obj.openWindow.viewAll.className = "viewChoice";
            c.obj.getOpenList(c.list, c.mode, c.obj);
        }, {
            obj: obj,
            list: obj.openWindow.openSelect,
            mode: "mine"
        });
        obj.openWindow.viewForm.appendChild(obj.openWindow.viewMine);
        obj.openWindow.body.appendChild(obj.openWindow.viewForm);
        obj.openWindow.infoWin = document.createElement("div");
        obj.openWindow.infoWin.className = "window_infoWin";
        obj.openWindow.body.insertBefore(obj.openWindow.infoWin, obj.openWindow.openSelect);
        obj.openWindow.searchBox = document.createElement("div");
        YAHOO.util.Dom.generateId(obj.openWindow.searchBox);
        obj.openWindow.searchBox.className = "proj_searchBox";
        obj.openWindow.body.appendChild(obj.openWindow.searchBox);
        obj.openWindow.searchInput = document.createElement("input");
        obj.openWindow.searchInput.className = "proj_searchInput";
        obj.openWindow.searchInput.type = "text";
        obj.openWindow.searchInput.name = "open_InputText";
        YAHOO.util.Dom.generateId(obj.openWindow.searchInput);
        obj.openWindow.searchBox.appendChild(obj.openWindow.searchInput);
        obj.openWindow.searchGoClick = document.createElement("input");
        YAHOO.util.Dom.generateId(obj.openWindow.searchGoClick);
        obj.openWindow.searchGoClick.type = "button";
        obj.openWindow.searchGoClick.value = "Find";
        obj.openWindow.searchBox.appendChild(obj.openWindow.searchGoClick);
        YAHOO.util.Event.addListener(obj.openWindow.searchGoClick.id, "click", obj.findExhibit, {
            pb: obj,
            obj: obj.openWindow,
            list: obj.openWindow.openSelect
        });
        obj.openWindow.openButtonClick = document.createElement("a");
        obj.openWindow.openButtonClick.appendChild(document.createTextNode("Open"));
        obj.openWindow.openButtonClick.className = "window_button";
        YAHOO.util.Event.addListener(obj.openWindow.openButtonClick, "click", obj.submitOpen, {
            obj: obj,
            win: obj.openWindow
        });
        obj.openWindow.body.appendChild(obj.openWindow.openButtonClick);
        obj.openWindow.openCancelClick = document.createElement("a");
        obj.openWindow.openCancelClick.appendChild(document.createTextNode("Cancel"));
        obj.openWindow.openCancelClick.className = "window_button";
        YAHOO.util.Event.addListener(obj.openWindow.openCancelClick, "click", function(f, c){
            YAHOO.util.Event.removeListener(document, "keypress", c.handleKeyPress);
            YAHOO.util.Dom.setStyle(c.openWindow, "display", "none");
            c.backWin([c.saveWindow, c.newWindow, c.qSel.DOM, c.extrasBox.DOM, c.searchBar.DOM]);
            //c.exhibitWindowClicked.fire(c.openWindow);
            c.IEunhidewindow.fire(c.openWindow);
        }, obj);
        obj.openWindow.body.appendChild(obj.openWindow.openCancelClick);
        obj.floatClear = document.createElement("div");
        obj.floatClear.className = "clear";
        obj.openWindow.body.appendChild(obj.floatClear);
        YAHOO.util.Dom.setStyle(obj.openWindow, "display", "none");
        YAHOO.util.Event.onAvailable(obj.openWindow.id, function(c){
            c.openDrag = new YAHOO.util.DD(c.main.id);
            c.openDrag.setHandleElId(c.closeBar.id);
            c.openResize = new YAHOO.util.Resize(c.main.id, {
                handles: "all"
            });
        }, obj.openWindow);
		
        obj.qselattach.appendChild(obj.openWindow);
    }
};
ProjectBar.prototype.handleKeyPress = function(b, a){
    if (b.keyCode == 13) {
        a.findExhibit(null, {
            pb: a,
            obj: a.openWindow,
            list: a.openWindow.openSelect
        });
    }
};
ProjectBar.prototype.findExhibit = function(f, a){
    obj = a.obj;
    pb = a.pb;
    list = a.list;
    text = obj.searchInput.value;
    var c = "./lib/ProjectBar/findExhibit.php?text=" + text;
    var g = {
        success: function(e){
            data = e.responseText.split("\n");
            obj = e.argument[0];
            list = e.argument[1];
            win = e.argument[2];
            if (list.firstChild) {
                temp = list.firstChild;
                while (temp.nextSibling) {
                    list.removeChild(temp.nextSibling);
                }
                list.removeChild(list.firstChild);
            }
            for (d in data) {
                record = data[d].split("%");
                if (!(record[0] == "")) {
                    el = document.createElement("div");
                    el.id = record[0];
                    el.className = "fileitem";
                    el.appendChild(document.createTextNode(record[1]));
                    choiceSection = document.createElement("div");
                    choiceSection.className = "proj_choiceSection";
                    el.appendChild(choiceSection);
                    if (parseInt(record[3]) == 1) {
                        sel = document.createElement("input");
                        YAHOO.util.Dom.generateId(sel);
                        sel.type = "checkbox";
                        sel.className = "proj_addMine";
                        choiceSection.appendChild(document.createTextNode("Select: "));
                        choiceSection.appendChild(sel);
                        YAHOO.util.Event.addListener(sel.id, "click", obj.selectFile, {
                            obj: obj,
                            file: record[1],
                            id: record[0],
                            info: [record[2], record[3]]
                        });
                    }
                    else {
                        if (parseInt(record[3]) == 0) {
                            addMine = document.createElement("input");
                            YAHOO.util.Dom.generateId(addMine);
                            addMine.className = "proj_addMine";
                            addMine.type = "checkbox";
                            choiceSection.appendChild(document.createTextNode("Add to mine: "));
                            choiceSection.appendChild(addMine);
                            YAHOO.util.Event.addListener(addMine.id, "click", obj.addToUserExhibit, {
                                obj: obj,
                                file: record[1],
                                id: record[0],
                                list: list,
                                el: el
                            });
                        }
                    }
                    list.appendChild(el);
                }
            }
            YAHOO.util.Dom.setStyle(win.DOM, "display", "none");
        },
        failure: function(e){
            alert("Problem Connecting to server [ProjectBar.js 818]");
        },
        argument: [pb, list, obj]
    };
    var b = YAHOO.util.Connect.asyncRequest("GET", c, g);
};
ProjectBar.prototype.setProperties = function(f, c, b){
    var a = c[0];
};
ProjectBar.prototype.saveSelectedProj = function(h, a){
    var g = a.obj;
    var f = a.win;
    if (g.properties.selectName && g.properties.selectId && (!(g.properties.selectName == ""))) {
        g.projectName = g.properties.selectName;
        g.projectId = g.properties.selectId;
        var c = "./lib/ProjectBar/eraseProject.php?id=" + g.projectId;
        var j = {
            success: function(e){
                g = e.argument[0];
                g.saveToProject.fire({
                    name: g.projectName,
                    id: g.projectId
                });
                g.IEunhidewindow.fire();
            },
            failure: function(e){
                alert("Failure connecting to server [ProjectBar.js li800]");
            },
            argument: [g]
        };
        var b = YAHOO.util.Connect.asyncRequest("GET", c, j);
        YAHOO.util.Dom.setStyle(g.saveWindow, "display", "none");
    }
    else {
        g.saveWindow.infoWin.removeChild(g.saveWindow.infoWin.firstChild);
        g.saveWindow.infoWin.appendChild(document.createTextNode("Please select a project, first"));
    }
};
ProjectBar.prototype.initializeNewProject = function(f, b){
    obj = b.obj;
    win = b.win;
    if (!(obj.newWindow.newBarText.value == "")) {
        var a = obj.newWindow.newBarText.value;
        var g = obj.newWindow.newDescText.value;
        var c = "./lib/ProjectBar/writeProject.php?mode=new&projectName=" + a + "&desc=" + g;
        var h = {
            success: function(e){
                if (e.responseText == "Exhibit already exists") {
                    e.argument.obj.newWindow.infoWin.innerHTML = "";
                    e.argument.obj.newWindow.infoWin.appendChild(document.createTextNode(e.responseText));
                }
                else {
                    data = e.responseText.split("\n");
                    obj.projectName = data[1];
                    obj.projectId = data[0];
                    YAHOO.util.Dom.setStyle(e.argument.obj.newWindow, "display", "none");
                    YAHOO.util.Dom.setStyle(e.argument.obj.saveWindow, "display", "none");
                    obj.saveToProject.fire({
                        name: obj.projectName,
                        id: obj.projectId
                    });
                    obj.getOpenList(obj.openWindow.openSelect, "mine", obj);
                    obj.getSaveList(obj.saveWindow.winSelect, "mine", obj);
                    obj.setAlert.fire("The screen state has been saved in exhibit: " + obj.projectName);
                    obj.IEunhidewindow.fire();
                }
            },
            failure: function(e){
                alert("Failure in saving - please try again");
            },
            argument: {
                obj: obj
            }
        };
        YAHOO.util.Connect.asyncRequest("GET", c, h, null);
    }
};
ProjectBar.prototype.loadProject = function(c, b, a){
    var f = {
        success: function(g){
            var e = g.argument[0];
            e.projectReady.fire();
        },
        failure: function(e){
            alert("Failure to load exhibit");
        },
        argument: [a]
    };
    YAHOO.util.Connect.asyncRequest("GET", "./lib/ProjectBar/loadProject.php?pID=" + a.projectId + "&project=" + a.projectName, f);
};
ProjectBar.prototype.startSave = function(c, a){
    obj = a.obj;
    win = a.win;
    var b = "./php/archielogin/writeProject.php?mode=save&project=" + obj.projectName;
    YAHOO.util.Connect.asyncRequest("GET", b, "");
    obj.closeWindow(c, win.DOM);
};
ProjectBar.prototype.submitOpen = function(b, a){
    obj = a.obj;
    win = a.win;
    var c = {
        success: function(g){
            var f = g.argument[0];
            var e = g.argument[1];
            f.projectName = f.properties.selectName;
            f.projectId = f.properties.selectId;
            f.projectReady.fire({
                project: f.properties.selectName,
                id: f.properties.selectId
            });
            YAHOO.util.Dom.setStyle(f.openWindow, "display", "none");
        },
        failure: function(e){
            alert("Failure loading exhibit (ProjectBar.js 1010)");
        },
        argument: [obj, win]
    };
    YAHOO.util.Connect.asyncRequest("GET", "./lib/ProjectBar/loadProject.php?pID=" + obj.properties.selectId + "&project=" + obj.properties.selectName, c);
};
ProjectBar.prototype.delComponent = function(f, a, c){
    var e = "./lib/ProjectBar/delWindow.php?type=" + c + "&id=" + a;
    var g = {
        success: function(j){
            var h = j.argument[0];
            if (j.responseText == "True") {
            }
        },
        failure: function(h){
        },
        argument: [f]
    };
    var b = YAHOO.util.Connect.asyncRequest("GET", e, g);
};
ProjectBar.prototype.addToUserExhibit = function(b, a){
};
ProjectBar.prototype.getOpenList = function(c, f, e){
    if (c.firstChild) {
        temp = c.firstChild;
        while (temp.nextSibling) {
            c.removeChild(temp.nextSibling);
        }
        c.removeChild(c.firstChild);
    }
    var b = "./lib/ProjectBar/getProjects.php?mode=" + f;
    var g = {
        success: function(h){
            e = h.argument[2];
            c = h.argument[0];
            f = h.argument[1];
            data = h.responseText.split("\n");
            for (d in data) {
                record = data[d].split("%");
                if (!(record[0] == "")) {
                    el = document.createElement("div");
                    el.id = record[0];
                    el.className = "fileitem";
                    el.appendChild(document.createTextNode(record[1]));
                    choiceSection = document.createElement("div");
                    choiceSection.className = "proj_choiceSection";
                    el.appendChild(choiceSection);
                    if (YAHOO.env.ua.ie == 6) {
                        YAHOO.util.Event.addListener(el.id, "mouseover", function(k, j){
                            j.className = "fileitem_hover";
                        }, el);
                        YAHOO.util.Event.addListener(el.id, "mouseout", function(k, j){
                            j.className = "fileitem";
                        }, el);
                    }
                    if (f == "all") {
                        addMine = document.createElement("input");
                        YAHOO.util.Dom.generateId(addMine);
                        addMine.className = "proj_addMine";
                        addMine.type = "checkbox";
                        choiceSection.appendChild(document.createTextNode("Add to mine: "));
                        choiceSection.appendChild(addMine);
                        YAHOO.util.Event.addListener(addMine.id, "click", e.addToUserExhibit, {
                            obj: e,
                            file: record[1],
                            id: record[0],
                            list: c,
                            el: el
                        });
                    }
                    else {
                        if (f == "mine") {
                            deleteButton = document.createElement("input");
                            deleteButton.type = "checkbox";
                            YAHOO.util.Dom.generateId(deleteButton, "dl");
                            choiceSection.appendChild(document.createTextNode("Delete"));
                            choiceSection.appendChild(deleteButton);
                            YAHOO.util.Event.addListener(deleteButton.id, "click", e.deleteProject, {
                                obj: e,
                                id: record[0]
                            });
                            YAHOO.util.Event.addListener(el, "click", function(k, j){
                                if (j.list.firstChild) {
                                    temp = j.list.firstChild;
                                    while (temp.nextSibling) {
                                        temp.nextSibling.className = "fileitem";
                                        temp = temp.nextSibling;
                                    }
                                    j.list.firstChild.className = "fileitem";
                                }
                                j.el.className = "fileitemselected";
                                j.obj.selectFile(null, j);
                            }, {
                                obj: e,
                                file: record[1],
                                id: record[0],
                                info: [record[2], record[3]],
                                el: el,
                                list: c
                            });
                            YAHOO.util.Event.addListener(el.id, "dblclick", e.submitOpen, {
                                obj: e,
                                win: e.openWindow
                            });
                        }
                    }
                    c.appendChild(el);
                }
            }
        },
        failure: function(h){
            alert("Failure to connect to server [ProjectBar.js 1079]");
        },
        argument: [c, f, e]
    };
    var a = YAHOO.util.Connect.asyncRequest("GET", b, g);
    setTimeout(function(){
        if (YAHOO.util.Connect.isCallInProgress(a)) {
            YAHOO.util.Connect.abort(a);
        }
    }, 5000);
};
ProjectBar.prototype.deleteProject = function(f, b){
    var c = b.obj;
    var h = b.id;
    var a = "./lib/ProjectBar/deleteProject.php?id=" + h;
    var g = {
        success: function(e){
            c = e.argument[0];
            h = e.argument[1];
            c.getSaveList(c.saveWindow.winSelect, "mine", c);
            c.getOpenList(c.openWindow.openSelect, "mine", c);
        },
        failure: function(e){
            c = e.argument[0];
            h = e.argument[1];
            c.getSaveList(c.saveWindow.winSelect, "mine", c);
            c.getOpenList(c.openWindow.openSelect, "mine", c);
        },
        argument: [c, h]
    };
    connect = YAHOO.util.Connect.asyncRequest("GET", a, g);
};
ProjectBar.prototype.getSaveList = function(c, f, e){
    if (c) {
        if (c.firstChild) {
            temp = c.firstChild;
            while (temp.nextSibling) {
                c.removeChild(temp.nextSibling);
            }
            c.removeChild(c.firstChild);
        }
        var b = "./lib/ProjectBar/getProjects.php?mode=mine";
        var g = {
            success: function(h){
                e = h.argument[2];
                c = h.argument[0];
                f = h.argument[1];
                data = h.responseText.split("\n");
                for (d in data) {
                    record = data[d].split("%");
                    if (!(record[0] == "")) {
                        el = document.createElement("div");
                        el.id = record[0];
                        el.className = "fileitem";
                        el.appendChild(document.createTextNode(record[1]));
                        choiceSection = document.createElement("div");
                        choiceSection.className = "proj_choiceSection";
                        el.appendChild(choiceSection);
                        deleteButton = document.createElement("input");
                        deleteButton.type = "checkbox";
                        YAHOO.util.Dom.generateId(deleteButton, "dl");
                        choiceSection.appendChild(document.createTextNode("Delete"));
                        choiceSection.appendChild(deleteButton);
                        if (YAHOO.env.ua.ie == 6) {
                            YAHOO.util.Event.addListener(el.id, "mouseover", function(k, j){
                                j.className = "fileitem_hover";
                            }, el);
                            YAHOO.util.Event.addListener(el.id, "mouseout", function(k, j){
                                j.className = "fileitem";
                            }, el);
                        }
                        YAHOO.util.Event.addListener(deleteButton.id, "click", e.deleteProject, {
                            obj: e,
                            id: record[0]
                        });
                        YAHOO.util.Event.addListener(el, "click", function(k, j){
                            if (j.list.firstChild) {
                                temp = j.list.firstChild;
                                while (temp.nextSibling) {
                                    temp.nextSibling.className = "fileitem";
                                    temp = temp.nextSibling;
                                }
                                j.list.firstChild.className = "fileitem";
                            }
                            j.el.className = "fileitemselected";
                            j.obj.selectFile(null, j);
                        }, {
                            obj: e,
                            file: record[1],
                            id: record[0],
                            info: [record[2], record[3]],
                            el: el,
                            list: c
                        });
                        YAHOO.util.Event.addListener(el, "dblclick", e.saveSelectedProj, {
                            obj: e,
                            win: e.saveWindow
                        });
                        c.appendChild(el);
                    }
                }
            },
            failure: function(h){
                alert("Failure to connect to server [ProjectBar.js 1146]");
            },
            argument: [c, f, e]
        };
        var a = YAHOO.util.Connect.asyncRequest("GET", b, g);
        setTimeout(function(){
            if (YAHOO.util.Connect.isCallInProgress(a)) {
                YAHOO.util.Connect.abort(a);
            }
        }, 5000);
    }
};
ProjectBar.prototype.addToUserExhibit = function(f, a){
    YAHOO.util.Event.stopEvent(f);
    obj = a.obj;
    file = a.file;
    id = a.id;
    el = a.el;
    list = a.list;
    var c = "./lib/ProjectBar/copyExhibitData.php?name=" + file + "&id=" + id;
    var g = {
        success: function(e){
            obj = e.argument[0];
            el = e.argument[1];
            list = e.argument[2];
            file = e.argument[3];
            notify = document.createElement("div");
            notify.className = "projectNotify";
            notify.appendChild(document.createTextNode("Exhibit " + file + " was copied into your account."));
            list.replaceChild(notify, el);
        },
        failure: function(e){
        },
        argument: [obj, el, list, file]
    };
    var b = YAHOO.util.Connect.asyncRequest("GET", c, g);
    setTimeout(function(){
        if (YAHOO.util.Connect.isCallInProgress(b)) {
            YAHOO.util.Connect.abort(b);
        }
    }, 5000);
};
ProjectBar.prototype.getProjectList = function(b, c){
    if (b) {
        if (b.firstChild) {
            temp = b.firstChild;
            while (temp.nextSibling) {
                b.removeChild(temp.nextSibling);
            }
            b.removeChild(b.firstChild);
        }
        var e = {
            success: function(h){
                var f = h.responseText;
                var g = h.argument.list;
                if (f == "No exhibits selected.") {
                    g.appendChild(document.createTextNode(h.responseText));
                }
                else {
                    records = f.split("\n");
                    for (i = 0; i < records.length; i++) {
                        if (records[i] != "") {
                            temp = records[i].split("%");
                            el = document.createElement("div");
                            el.className = "fileitem";
                            YAHOO.util.Dom.generateId(el, "" + temp[0]);
                            el.appendChild(document.createTextNode(temp[1]));
                            g.appendChild(el);
                            YAHOO.util.Event.addListener(el, "click", function(k, j){
                                c = j.obj;
                                c.selectFile(k, j);
                                if (c.saveWindow) {
                                    if (c.saveWindow.infoWin.firstChild) {
                                        temp = c.saveWindow.infoWin.firstChild;
                                        while (temp.nextSibling) {
                                            el = temp.nextSibling;
                                            c.saveWindow.infoWin.removeChild(el);
                                        }
                                        c.saveWindow.infoWin.removeChild(temp);
                                    }
                                    c.saveWindow.infoWin.appendChild(document.createTextNode("Description: " + j.info[0]));
                                    c.saveWindow.infoWin.appendChild(document.createElement("br"));
                                    c.saveWindow.infoWin.appendChild(document.createTextNode(j.file));
                                    c.saveWindow.infoWin.appendChild(document.createElement("br"));
                                    c.saveWindow.infoWin.appendChild(document.createTextNode("Creator: " + j.info[1]));
                                }
                                if (c.openWindow) {
                                    if (YAHOO.util.Dom.getStyle(c.openWindow, "display") == "block") {
                                        if (c.openWindow.infoWin.firstChild) {
                                            temp = c.openWindow.infoWin.firstChild;
                                            while (temp.nextSibling) {
                                                el = temp.nextSibling;
                                                c.openWindow.infoWin.removeChild(el);
                                            }
                                            c.openWindow.infoWin.removeChild(temp);
                                        }
                                        c.openWindow.infoWin.appendChild(document.createTextNode("Description: " + j.info[0]));
                                        c.openWindow.infoWin.appendChild(document.createElement("br"));
                                        c.openWindow.infoWin.appendChild(document.createTextNode(j.file));
                                        c.openWindow.infoWin.appendChild(document.createElement("br"));
                                        c.openWindow.infoWin.appendChild(document.createTextNode(j.info[1]));
                                        c.openBarText.value = j.file;
                                    }
                                }
                                if (c.newWindow) {
                                    if (YAHOO.util.Dom.getStyle(c.newWindow, "display") == "block") {
                                        c.newWindow.infoWin.innerHTML = j.info;
                                    }
                                }
                            }, {
                                obj: c,
                                file: temp[1],
                                id: temp[0],
                                info: [temp[2], temp[3]]
                            });
                        }
                    }
                }
            },
            failure: function(f){
            },
            argument: {
                list: b
            }
        };
        var a = YAHOO.util.Connect.asyncRequest("GET", "./lib/ProjectBar/getProjects.php?mode=all", e, null);
        setTimeout(function(){
            if (YAHOO.util.Connect.isCallInProgress(a)) {
                YAHOO.util.Connect.abort(a);
            }
        }, 5000);
    }
};
ProjectBar.prototype.selectFile = function(b, a){
    obj = a.obj;
    tname = a.file;
    tID = a.id;
    obj.properties.selectName = tname;
    obj.properties.selectId = tID;
};
;
