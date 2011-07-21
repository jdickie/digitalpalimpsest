QueLines = function(loc){
    this.DOM = document.createElement("div");
    YAHOO.util.Dom.generateId(this.DOM,'ho');
	this.dark=document.createElement("div");
	YAHOO.util.Dom.generateId(this.dark,'dark');
	this.dark.className="project_back";
	this.main=document.createElement("div");
	YAHOO.util.Dom.generateId(this.main, "queline");
    this.main.className = "queLines window";
	this.DOM.appendChild(this.dark);
	this.DOM.appendChild(this.main);
    this.header = document.createElement("div");
    YAHOO.util.Dom.generateId(this.header, "header");
    this.header.className = "window_closebar";
    this.main.appendChild(this.header);
    this.body = document.createElement("div");
    YAHOO.util.Dom.generateId(this.body);
    this.body.className = "window_body";
    this.main.appendChild(this.body);
    this.closeHead = document.createElement("a");
    this.closeHead.className = "window_close";
    YAHOO.util.Dom.generateId(this.closeHead, "close");
    this.closeHead.appendChild(document.createTextNode("Close"));
    this.header.appendChild(this.closeHead);
    this.closeSpan = document.createElement("span");
    this.closeSpan.className = "window_title";
    this.closeSpan.appendChild(document.createTextNode("Cue Lines Search"));
    this.header.appendChild(this.closeSpan);
    YAHOO.util.Event.addListener(this.closeHead.id, "click", this.exitWin, this);
    this.who = document.createElement("select");
    YAHOO.util.Dom.generateId(this.who);
    this.who.className = "queLines_who";
    this.body.appendChild(this.who);
    this.searchLinesFrom = document.createElement("span");
    YAHOO.util.Dom.generateId(this.searchLinesFrom, "sp");
    this.searchLinesFrom.className = "queLines_text";
    this.searchLinesFrom.appendChild(document.createTextNode("Search for Lines from:"));
    this.body.insertBefore(this.searchLinesFrom, this.who);
    this.printViewSpace = document.createElement("div");
    YAHOO.util.Dom.generateId(this.printViewSpace, "pvs");
    this.printViewSpace.className = "PrintView quelinesPrint";
    this.body.appendChild(this.printViewSpace);
    this.results = document.createElement("div");
    YAHOO.util.Dom.generateId(this.results, "results");
    this.results.className = "resultsBox";
    this.body.appendChild(this.results);
    this.resultsTable = document.createElement("ul");
    this.resultsTable.className = "resultsTable";
    YAHOO.util.Dom.generateId(this.resultsTable, "rt");
    this.results.appendChild(this.resultsTable);
    this.setName = "queLineValue";
    this.limitBox = new Archie.Limiter(this.setName, ["quarto", "act", "scene"]);
    this.body.appendChild(this.limitBox.DOM);
    this.closed = new YAHOO.util.CustomEvent("closed");
    this.options = [];
    if (YAHOO.env.ua.ie > 0) {
        this.go = document.createElement("span");
        YAHOO.util.Dom.generateId(this.go, "in");
        this.go.className = "cuelines_button";
        this.go.appendChild(document.createTextNode("Go"));
        YAHOO.util.Event.addListener(this.go.id, "click", this.startSearch, this);
        this.body.appendChild(this.go);
    }
    this.selectedBox = new YAHOO.util.CustomEvent("selectedBox");
    this.limitBox.reloadTheSearch.subscribe(function(e, pass, args){
        if (args.resultsTable.firstChild) {
            var el = args.who.firstChild;
            if (args.who.firstChild) {
                temp = args.who.firstChild;
                while (temp.nextSibling) {
                    if (temp.selected) {
                        el = temp;
                        break;
                    }
                    temp = temp.nextSibling;
                }
            }
            args.getQueLines(null, {
                obj: args,
                el: el
            });
        }
    }, this);
    YAHOO.util.Event.onContentReady(this.DOM.id, this.handleAvailable, this);
    YAHOO.util.Event.addListener(this.DOM.id, "click", this.handleClick, this);
    loc.appendChild(this.DOM);
};
QueLines.prototype = {
    handleClick: function(e, obj){
        obj.selectedBox.fire(obj);
    },
    handleAvailable: function(obj){
        obj.draggable = new YAHOO.util.DD(obj.main.id);
        obj.draggable.setHandleElId(obj.header.id);
        obj.resize = new YAHOO.util.Resize(obj.main.id, {
            handles: "all",
            minWidth: 300,
            minHeight: 250
        });
        obj.resize.on("endResize", function(e, obj){
            var width = parseInt(YAHOO.util.Dom.getStyle(obj.main, "width"));
            var height = parseInt(YAHOO.util.Dom.getStyle(obj.main, "height"));
            YAHOO.util.Dom.setStyle(obj.results, "width", (width - 100) + "px");
            YAHOO.util.Dom.setStyle(obj.results, "height", (height - 100) + "px");
            YAHOO.util.Dom.setStyle(obj.body, "width", width + "px");
            YAHOO.util.Dom.setStyle(obj.body, "height", height + "px");
            YAHOO.util.Dom.setStyle(obj.resultsTable, "width", (width - 100) + "px");
            YAHOO.util.Dom.setStyle(obj.resultsTable, "height", (height) + "px");
        });
    },
    findLimiters: function(obj){
        var sUrl = "./lib/Limiters/getLimits.php?type=get&firstType=speaker";
        var callback = {
            success: function(o){
                var data = o.responseText.split("\n");
                var obj = o.argument[0];
                var IEuser = (YAHOO.env.ua.ie > 0);
				var firstel=document.createElement("option");
				YAHOO.util.Dom.generateId(firstel,'op');
				firstel.value="none";
				firstel.appendChild(document.createTextNode("Select a character"));
				obj.who.appendChild(firstel);
                for (i in data) {
                    var record = data[i].split("%");
                    var el = document.createElement("option");
                    YAHOO.util.Dom.generateId(el, "op");
                    el.value = record[0];
                    el.appendChild(document.createTextNode(record[1]));
                    obj.who.appendChild(el);
                    obj.options[obj.options.length] = el;
                    if (!IEuser) {
                        YAHOO.util.Event.addListener(el.id, "click", obj.getQueLines, {
                            obj: obj,
                            el: el
                        });
                    }
                }
            },
            failure: function(o){
                alert("Failure to connect [QueLines.js] 62");
            },
            argument: [obj]
        };
        var transact = YAHOO.util.Connect.asyncRequest("GET", sUrl, callback);
    },
    startSearch: function(e, obj){
        var val = "";
        for (i = 0; i < obj.options.length; i++) {
            if (obj.options[i].selected == true) {
                val = obj.options[i].value;
            }
        }
        obj.getQueLines(e, {
            name: val,
            obj: obj
        });
    },
    getQueLines: function(e, args){
        var obj = args.obj;
        if (args.name) {
            var whoTxt = args.name;
        }
        else {
            var el = args.el;
            var whoTxt = el.value;
        }
        var arguArr = [obj, whoTxt];
        if (obj.resultsTable.firstChild) {
            temp = obj.resultsTable.firstChild;
            while (temp.nextSibling) {
                obj.resultsTable.removeChild(temp.nextSibling);
            }
            obj.resultsTable.removeChild(temp);
        }
        loading = document.createElement("div");
        loading.className = "fileitem";
        loading.appendChild(document.createTextNode("Loading..."));
        obj.resultsTable.appendChild(loading);
        var sUrl = "./lib/QueLines/getQueLines.php?who=" + whoTxt + "&setName=" + obj.setName + "&html=no";
        var callback = {
            success: function(o){
                var obj = o.argument[0];
                var data = o.responseText.split("\n");
                var value = o.argument[1];
                if (obj.resultsTable.firstChild) {
                    temp = obj.resultsTable.firstChild;
                    while (temp.nextSibling) {
                        obj.resultsTable.removeChild(temp.nextSibling);
                    }
                    obj.resultsTable.removeChild(temp);
                }
                el = document.createElement("div");
                el.className = "fileitem";
                if (!(data == "Overflow")) {
                    total = (data[0] == "") ? 0 : (data.length - 1);
                    el.appendChild(document.createTextNode("Results: " + total));
                    obj.resultsTable.appendChild(el);
                    for (dat in data) {
                        var record = data[dat].split("%");
                        if ((!(record[0] == "")) && (record[5])) {
                            el = new QueLineItem(record);
                            obj.resultsTable.appendChild(el.DOM);
                        }
                    }
                }
                else {
                    el.appendChild(document.createTextNode("Too many results; use the Limits to the right to shorten the search or select Print View to see all results in HTML format."));
                    obj.resultsTable.appendChild(el);
                }
                if (obj.resultsTable.firstChild) {
                    obj.printLink = "./lib/QueLines/getQueLines.php?who=" + value + "&setName=" + obj.setName + "&html=yes";
                    if (obj.printViewSpace.firstChild) {
                        temp = obj.printViewSpace.firstChild;
                        while (temp.nextSibling) {
                            obj.printViewSpace.removeChild(temp.nextSibling);
                        }
                        obj.printViewSpace.removeChild(temp);
                    }
                    pv = document.createElement("a");
                    pv.href = obj.printLink;
                    pv.appendChild(document.createTextNode("Print View"));
                    pv.target = "_blank";
                    obj.printViewSpace.appendChild(pv);
                }
            },
            failure: function(o){
            },
            argument: arguArr
        };
        var transact = YAHOO.util.Connect.asyncRequest("GET", sUrl, callback);
    },
    winToggle: function(obj){
        var state = YAHOO.util.Dom.getStyle(obj.DOM, "display");
        switch (state) {
            case "none":
                YAHOO.util.Dom.setStyle(obj.DOM, "display", "block");
                obj.DOM.className = "queLines window yui-resize";
                break;
            case "block":
                YAHOO.util.Dom.setStyle(obj.DOM, "display", "none");
                break;
        }
    },
    exitWin: function(e, obj){
        YAHOO.util.Dom.setStyle(obj.DOM, "display", "none");
        obj.closed.fire();
    }
};
QueLineItem = function(values){
    this.DOM = document.createElement("li");
    YAHOO.util.Dom.generateId(this.DOM, "queLineItem");
    this.id = values[0];
    this.DOM.className = "fileitem";
    this.values = values;
    this.page = this.findPage(this.values[5]);
    this.pQuote = document.createElement("span");
    this.pQuote.className = "queLines_pQuote";
    this.pQuote.appendChild(document.createTextNode(values[9]));
    this.pSpeaker = document.createElement("span");
    this.pSpeaker.className = "queLines_speaker";
    this.pSpeaker.appendChild(document.createTextNode(values[10] + ": "));
    this.cSpeaker = document.createElement("span");
    this.cSpeaker.className = "queLines_speaker";
    this.cSpeaker.appendChild(document.createTextNode(values[11] + ": "));
    this.divMeta = document.createElement("div");
    this.divMeta.className = "listMeta";
    this.divMeta.appendChild(document.createTextNode("Act: " + values[2] + " Scene: " + values[3] + " Page: " + this.page));
    this.divMeta.appendChild(document.createElement("br"));
    this.divMeta.appendChild(document.createTextNode("Speaker: " + values[4]));
    this.divMeta.appendChild(document.createElement("br"));
    this.divMeta.appendChild(document.createTextNode("Quarto: " + values[8]));
    this.divMeta.appendChild(document.createElement("br"));
    this.divMeta.appendChild(this.pSpeaker);
    this.divMeta.appendChild(this.pQuote);
    this.divMeta.appendChild(document.createElement("br"));
    this.divMeta.appendChild(this.cSpeaker);
    this.divMeta.appendChild(document.createTextNode(values[7]));
    this.DOM.appendChild(this.divMeta);
    this.manifestPrefix = "./manifest/";
    YAHOO.util.Event.addListener(this.DOM.id, "click", this.selectPhrase, this);
    this.phrasePick = new YAHOO.util.CustomEvent("phrasePick");
};
QueLineItem.prototype = {
    findPage: function(pbid){
        pbArr = pbid.split("-");
        page = pbArr[5];
        if ((page.indexOf("a") > 0) || (page.indexOf("b") > 0)) {
            page = page.substring(0, 3);
            while (page.indexOf(0) == "0") {
                page = page.substring(1);
            }
        }
        else {
            while (page.indexOf(0) == "0") {
                page = page.substring(1);
            }
        }
        return page;
    }
};
