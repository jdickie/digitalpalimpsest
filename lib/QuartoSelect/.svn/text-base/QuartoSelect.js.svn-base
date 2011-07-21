/***
 * QuartoSelect.js
 * 
 * For generating a window to select
 * which quarto version is to be viewed
 */
QuartoSelect=function(){
	
	//this.quartoSelected = new YAHOO.util.CustomEvent("quartoSelected");
    this.manifestPrefix = "./manifest/";
    this.DOM = $("<div></div>");
    YAHOO.util.Dom.generateId(this.DOM, "ho");
	this.background=document.createElement("div");
	YAHOO.util.Dom.generateId(this.background,'dark');
	this.background.className="project_back";
	this.main=document.createElement("div");
	YAHOO.util.Dom.generateId(this.main,'ma');
	this.main.className = "qSelect";
	
   
    this.body = document.createElement("div");
    this.body.className = "window_body";
    YAHOO.util.Dom.generateId(this.body, "body");
    this.windowClosebar = document.createElement("div");
    this.windowClosebar.className = "window_closebar";
    YAHOO.util.Dom.generateId(this.windowClosebar, "handle");
    this.windowClose = document.createElement("a");
    this.windowClose.className = "window_close";
    this.windowClose.appendChild(document.createTextNode("Close"));
    this.windowTitle = document.createElement("span");
    this.windowTitle.className = "window_title";
    this.windowTitle.appendChild(document.createTextNode("Shakespeare Quartos Archive Library"));
    this.windowContent = document.createElement("div");
    this.windowContent.className = "window_content";
    this.windowClosebar.appendChild(this.windowClose);
    this.windowClosebar.appendChild(this.windowTitle);
	this.DOM.appendChild(this.background);
	this.DOM.appendChild(this.main);
    this.main.appendChild(this.windowClosebar);
    this.main.appendChild(this.body);
    this.body.appendChild(this.windowContent);
    this.quartoSelect = document.createElement("span");
    this.quartoSelect.className = "listBox";
    this.quartoSelect.id = YAHOO.util.Dom.generateId(this.quartoSelect, "select");
    this.windowContent.appendChild(this.quartoSelect);
    this.sampleSidebar = document.createElement("div");
    this.sampleSidebar.className = "qSelect_sidebar";
    this.sampleImage = document.createElement("div");
    this.sampleImage.className = "qSelect_sampleImage";
    this.sampleImage.id = YAHOO.util.Dom.generateId(this.sampleImage, "sampleImage");
    this.sampleSidebar.appendChild(this.sampleImage);
    this.leftSample = document.createElement("div");
    this.leftSample.className = "qSelect_leftSample";
    this.sampleImage.appendChild(this.leftSample);
    this.rightSample = document.createElement("div");
    YAHOO.util.Dom.generateId(this.rightSample, 'rsp');
    this.rightSample.className = "qSelect_rightSample";
    this.sampleImage.appendChild(this.rightSample);
    this.windowContent.appendChild(this.sampleSidebar);
    this.infoDisplay = document.createElement("div");
    this.infoDisplay.className = "qSelect_infoSelect";
    this.infoDisplay.id = YAHOO.util.Dom.generateId(this.infoDisplay, "infoDisplay");
    this.body.appendChild(this.infoDisplay);
    this.buttonSet = document.createElement("div");
    this.buttonSet.className = "qSelect_button_group";
    this.windowContent.appendChild(this.buttonSet);
    this.sQuartoButton = document.createElement("span");
    YAHOO.util.Dom.generateId(this.sQuartoButton, "sqb");
    this.sQuartoButton.className = "qSelect_button";
    this.sQuartoButton.appendChild(document.createTextNode("Open"));
    this.windowContent.appendChild(this.sQuartoButton);
    this.chosenFileName = "";
    this.chosenFileId = "";
    this.chosenExpInfo = "";
    this.dragQSel = null;
    this.readyPage = 1;
    this.chosenManifest = "";
    this.closed = new YAHOO.util.CustomEvent("closed");
    YAHOO.util.Dom.setStyle(this.DOM,'display','none');
    YAHOO.util.Event.addListener(this.DOM.id, "click", this.handleClick, this);
    YAHOO.util.Event.addListener(this.rightSample.id, 'click', this.imageClicked, this);
    YAHOO.util.Event.addListener(this.sQuartoButton.id, "click", this.handleOpenClick, this);
    YAHOO.util.Event.addListener(this.windowClose, "click", function(e, obj){
        YAHOO.util.Dom.setStyle(obj.DOM, "display", "none");
        obj.closed.fire();
    }, this);
    YAHOO.util.Event.onContentReady(this.DOM.id, this.makeDragBox, this);
}

/**
 * Member Functions
 */
QuartoSelect.prototype = {
	makeDragBox: function(obj){
        obj.dragQSel = new YAHOO.util.DDProxy(obj.main.id);
        obj.dragQSel.setHandleElId(obj.windowClosebar.id);
        obj.dragQResize = new YAHOO.util.Resize(obj.main.id, {
            handles: "all",
            minWidth: 1000,
            minHeight: 450
        });
        obj.setUpQuartoList();
    },
    winToggle: function(e, obj){
        var state = YAHOO.util.Dom.getStyle(obj.DOM, "display");
        if (obj.infoDisplay.firstChild) {
            temp = obj.infoDisplay.firstChild;
            while (temp.nextSibling) {
                obj.infoDisplay.removeChild(temp.nextSibling);
            }
            obj.infoDisplay.removeChild(obj.infoDisplay.firstChild);
        }
        if (obj.rightSample.firstChild) {
            obj.rightSample.removeChild(obj.rightSample.firstChild);
        }
        //var left = (YAHOO.util.Dom.getViewportWidth() * 0.005);
        //YAHOO.util.Dom.setX(obj.DOM, left);
    },
    setUpQuartoList: function(){
        var sUrl = "./lib/QuartoSelect/getQuartoItemList.php?type=list";
        if (this.quartoSelect.firstChild) {
            temp = this.quartoSelect.firstChild;
            while (temp.nextSibling) {
                this.quartoSelect.removeChild(temp.nextSibling);
            }
            this.quartoSelect.removeChild(temp);
        }
        this.quartoSelect.appendChild(document.createTextNode("Loading..."));
        var callback = {
            success: function(o){
                var obj = o.argument[0];
                if (obj.quartoSelect.firstChild) {
                    temp = obj.quartoSelect.firstChild;
                    while (temp.nextSibling) {
                        obj.quartoSelect.removeChild(temp.nextSibling);
                    }
                    obj.quartoSelect.removeChild(temp);
                }
                var data = o.responseText.split("/new/");
                for (i in data) {
                    record = data[i].split("%");
                    if (record[1]) {
                        var item = new QuartoTMSItem(record);
                        obj.quartoSelect.appendChild(item.DOM);
                        item.quartoSelectItemClick.subscribe(obj.handleItemClick, obj);
                        item.quartoSelectItemSelected.subscribe(obj.quartoIsFinalized, obj);
                    }
                }
            },
            failure: function(o){
                alert("Error retrieving data from server");
            },
            argument: [this]
        };
        var transact = YAHOO.util.Connect.asyncRequest("GET", sUrl, callback);
        setTimeout(function(){
            if (YAHOO.util.Connect.isCallInProgress(transact)) {
                YAHOO.util.Connect.abort(transact);
            }
        }, 15000);
    },
    handleItemClick: function(e, pass, args){
        args.chosenFileName = pass[0].filename;
        args.chosenFileId = pass[0].fileId;
        args.chosenExpInfo = pass[0].info;
        args.readyPage = (pass[0].readyPage)?pass[0].readyPage:0;
        args.chosenManifest = pass[0].manifest;
        if (args.rightSample.firstChild) {
            args.rightSample.removeChild(args.rightSample.firstChild);
        }
        var prefix = args.chosenFileName.replace("-manifest.xml", "");
       // var imageDir = imgdir + prefix + "/" + prefix + "-001-tiles/" + prefix + "-001-0-0-0.png";
        var imageDir=IMGDIR+prefix+"/1.0.0/365nm - UV/0/0/0.png";
		var el = document.createElement("img");
        el.src = imageDir;
        el.alt = "Loading...";
        args.rightSample.appendChild(el);
        if (args.infoDisplay.firstChild) {
            temp = args.infoDisplay.firstChild;
            while (temp.nextSibling) {
                args.infoDisplay.removeChild(temp.nextSibling);
            }
            args.infoDisplay.removeChild(temp);
        }
       args.infoDisplay.appendChild(document.createTextNode(pass[0].info));
    },
    imageClicked: function(e, obj){
        if ((!(obj.chosenFileName == "")) && (!(obj.chosenFileId == ""))) {
            var manifest = obj.manifestPrefix + obj.chosenManifest;
            obj.quartoSelected.fire({
                manifest: manifest,
                bibInfo: obj.chosenExpInfo,
                readyPage: obj.readyPage,
                project: "default",
                coords: [0, 80]
            });
            YAHOO.util.Dom.setStyle(obj.DOM, "display", "none");
        }
    },
    quartoIsFinalized: function(e, pass, args){
        if ((!(args.chosenFileName == "")) && (!(args.chosenFileId == ""))) {
            var manifest = args.manifestPrefix + args.chosenManifest;
			
            args.quartoSelected.fire({
                manifest: manifest,
                bibInfo: args.chosenExpInfo,
                readyPage: args.readyPage,
                project: "default",
                coords: [0, 80]
            });
            YAHOO.util.Dom.setStyle(args.DOM, "display", "none");
        }
    },
    handleOpenClick: function(e, obj){
        if ((!(obj.chosenFileName == "")) && (!(obj.chosenFileId == ""))) {
            var manifest = obj.manifestPrefix + obj.chosenManifest;
            obj.quartoSelected.fire({
                manifest: manifest,
                bibInfo: obj.chosenExpInfo,
                readyPage: obj.readyPage,
                project: "default",
                coords: [0, 80]
            });
            YAHOO.util.Dom.setStyle(obj.DOM, "display", "none");
        }
    }

}

QuartoTMSItem=function(values){
	this.DOM=document.createElement("li");
	YAHOO.util.Dom.generateId(this.DOM,'qtms');
	this.DOM.className="listItem";
	
	this.uri=values[0];
	this.title=values[1];
	this.startPage=0;
	this.titleText=document.createElement("div");
	YAHOO.util.Dom.generateId(this.titleText,'ti');
	this.titleText.className="listItem_info";
	this.titleText.appendChild(document.createTextNode(this.title));
	this.DOM.appendChild(this.titleText);
	
	this.quartoSelectItemClick = new YAHOO.util.CustomEvent("quartoSelectItemClick");
	this.quartoSelectItemSelected=new YAHOO.util.CustomEvent("quartoSelectItemSelected");
	YAHOO.util.Event.addListener(this.DOM.id, 'click', this.handleMouse, this);
	YAHOO.util.Event.addListener(this.DOM.id, 'dblclick', this.handleClick,this);
	if (YAHOO.env.ua.ie == 6) {
        YAHOO.util.Event.addListener(this.DOM.id, "mouseover", this.handleOver, this);
        YAHOO.util.Event.addListener(this.DOM.id, "mouseout", this.handleOut, this);
    }
}
QuartoTMSItem.prototype={
	/**
	 * Fire custom event for when the item is clicked
	 */
	handleMouse: function(e, obj){
	
		obj.quartoSelectItemClick.fire({
			
			filename: obj.uri,
			fileId: obj.uri,
			info: obj.title,
			readyPage: obj.startPage,
			manifest: obj.uri,
		});
	},
	handleClick: function(e, obj){
		obj.quartoSelectItemSelected.fire(obj);
	},
	 handleOver: function(e, obj){
        obj.DOM.className = "listItem_hover";
    },
    handleOut: function(e, obj){
        obj.DOM.className = "listItem";
    }
}
