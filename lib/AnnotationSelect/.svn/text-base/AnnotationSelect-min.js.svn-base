AnnotationSelect = function(d, c, b){
    this.userid = b;
    this.selectedName = null;
    this.selectedId = null;
    this.docId = c;
    this.populationType = "current";
    this.addMine = [];
    this.DOM = document.createElement("div");
    YAHOO.util.Dom.generateId(this.DOM, "view");
    this.DOM.className = "window anno_window";
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
    this.annoWindow = new AnnoWindow(this.DOM);
    this.annoWindow.newAnnoMade.subscribe(this.startSavingNew, this);
    YAHOO.util.Event.addListener(this.closeA, "click", this.closeWin, this);
    this.closeBar.appendChild(this.closeA);
    this.DOM.appendChild(this.closeBar);
    this.DOM.appendChild(this.body);
    YAHOO.util.Dom.setStyle(this.DOM, "display", "none");
    this.createButton = document.createElement("span");
    YAHOO.util.Dom.generateId(this.createButton, "select");
    this.createButton.className = "window_button";
    this.createButton.appendChild(document.createTextNode("Create New Set"));
    YAHOO.util.Event.addListener(this.createButton.id, "click", this.displayNewWindow, this);
    this.body.appendChild(this.createButton);
    YAHOO.util.Dom.setStyle(this.createButton, "display", "none");
    this.properties = new Array();
    this.changeCall = new YAHOO.util.CustomEvent("changeCall");
    this.visibleNow = new YAHOO.util.CustomEvent("visibleNow");
    d.appendChild(this.DOM);
    d.appendChild(this.annoWindow.DOM);
    YAHOO.util.Event.onAvailable(this.DOM.id, this.makeDraggable, this);
};
AnnotationSelect.prototype.makeDraggable = function(b){
    b.viewDrag = new YAHOO.util.DD(b.DOM.id);
    b.viewDrag.setHandleElId(b.closeBar.id);
    b.viewResize = new YAHOO.util.Resize(b.DOM.id, {
        handles: "all"
    });
};
AnnotationSelect.prototype.displayNewWindow = function(d, c){
    var b = YAHOO.util.Dom.getStyle(c.annoWindow.DOM, "display");
    if (b == "block") {
        alert("turning back");
        YAHOO.util.Dom.setStyle(c.DOM, "display", "block");
        YAHOO.util.Dom.setStyle(c.annoWindow.DOM, "display", "none");
        c.DOM.className = "window anno_window";
    }
    else {
        if (b == "none") {
            YAHOO.util.Dom.setStyle(c.DOM, "display", "none");
            YAHOO.util.Dom.setStyle(c.annoWindow.DOM, "display", "block");
        }
    }
};
AnnotationSelect.prototype.makeDisabled = function(b){
    b.submitButton.className = "viewPref_button_Disabled";
    b.createButton.className = "viewPref_button_Disabled";
    YAHOO.util.Event.removeListener(b.createButton, "click", b.createAnnoWindow);
    YAHOO.util.Event.removeListener(b.submitButton, "click", b.changeAnnoSet);
};
AnnotationSelect.prototype.makeAbled = function(b){
    b.submitButton.className = "window_button";
    b.createButton.className = "window_button";
    YAHOO.util.Event.addListener(b.createButton.id, "click", b.createAnnoWindow, {
        obj: b,
        value: b.nameBox.value
    });
    YAHOO.util.Event.addListener(b.submitButton.id, "click", b.changeAnnoSet, {
        obj: b,
        value: b.nameBox.value
    });
};
AnnotationSelect.prototype.findAnnoSet = function(d, c){
    text = c.searchInput.value;
    sUrl = "./lib/ProjectBar/findAnnoSet.php?text=" + text;
    var f = {
        success: function(e){
            c = e.argument[0];
            data = e.responseText.split("\n");
            if (c.winSelect.firstChild) {
                temp = c.winSelect.firstChild;
                while (temp.nextSibling) {
                    c.winSelect.removeChild(temp.nextSibling);
                }
                c.winSelect.removeChild(c.winSelect.firstChild);
            }
            for (i = 0; i < data.length; i++) {
                values = data[i].split("%");
                if ((!(values[0] == "")) && (!(values[0] == "No sets chosen."))) {
                    mode = (parseInt(values[4]) == 0) ? "all" : "mine";
                    el = new AnnoListItem(values[1], values, mode, "add", c.userid);
                    c.winSelect.appendChild(el.DOM);
                    el.choose.subscribe(c.changeNameBox, c);
                    el.add.subscribe(c.addToMyList, c);
                    el.clicked.subscribe(c.changeAnnoSet, c);
                }
                else {
                    if (values[0] == "No sets chosen.") {
                        c.winSelect.appendChild(document.createTextNode(values[0]));
                    }
                }
            }
        },
        failure: function(e){
            alert("Problem connecting to server [AnnotationSelect.js 143]");
        },
        argument: [c]
    };
    var b = YAHOO.util.Connect.asyncRequest("GET", sUrl, f);
};
AnnotationSelect.prototype.setProperties = function(c, b){
    c.properties = b;
};
AnnotationSelect.prototype.closeWin = function(d, c){
    var b = YAHOO.util.Dom.getStyle(c.DOM, "display");
    if (b == "none") {
        YAHOO.util.Dom.setStyle(c.DOM, "display", "block");
        c.populateTables(c);
        c.visibleNow.fire("open");
        c.DOM.className = "window anno_window";
        if (c.userid) {
            YAHOO.util.Dom.setStyle(c.createButton, "display", "block");
        }
        else {
            YAHOO.util.Dom.setStyle(c.createButton, "display", "none");
        }
    }
    else {
        if (b == "block") {
            YAHOO.util.Dom.setStyle(c.DOM, "display", "none");
            c.visibleNow.fire("close");
        }
    }
};
AnnotationSelect.prototype.openWin = function(d, c, b){
    c[0].data.appendChild(b.DOM);
    b.populateTables(b);
};
AnnotationSelect.prototype.addToMyList = function(g, f, b){
    YAHOO.util.Event.stopEvent(g);
    litem = f[0];
    var d = "./lib/AnnotationSelect/copyAnnoSet.php?id=" + litem.values[1] + "&name=" + litem.values[0] + "&olduser=" + litem.values[3];
    var h = {
        success: function(e){
            as = e.argument[0];
            litem = e.argument[1];
            el = document.createElement("div");
            el.className = "annoNotify";
            el.appendChild(document.createTextNode("Set " + litem.values[0] + " has been added to Mine"));
            as.winSelect.replaceChild(el, litem.DOM);
        },
        failure: function(e){
        },
        argument: [b, litem]
    };
    var c = YAHOO.util.Connect.asyncRequest("GET", d, h);
};
AnnotationSelect.prototype.takeFromList = function(d, c, b){
    YAHOO.util.Event.stopEvent(d);
    value = c[0];
    el = document.createElement("div");
    el.className = "annoNotify";
    el.appendChild(document.createTextNode("Note set " + value.values[0] + " was deleted"));
    b.winSelect.replaceChild(el, value.DOM);
};
AnnotationSelect.prototype.viewCurrUser = function(c, b){
    b.populationType = "current";
    b.populateTables(b);
    b.viewMine.className = "viewChoice_hl";
    b.viewAll.className = "viewChoice";
};
AnnotationSelect.prototype.viewAllUsers = function(c, b){
    b.populationType = "full";
    b.populateTables(b);
    b.viewAll.className = "viewChoice_hl";
    b.viewMine.className = "viewChoice";
};
AnnotationSelect.prototype.clearTable = function(b){
    if (b.winSelect.firstChild) {
        temp = b.winSelect.firstChild;
        while (temp.nextSibling) {
            a = temp.nextSibling;
            b.winSelect.removeChild(a);
        }
        b.winSelect.removeChild(temp);
    }
};
AnnotationSelect.prototype.populateTables = function(d){
    var e = "?type=" + d.populationType + "&user=" + d.properties.uID + "&doc=" + d.docId;
    var c = "./lib/Annotation/AnnoSet.php" + e;
    var f = {
        success: function(j){
            var h = j.argument[0];
            var g = j.responseText.split("\n");
            h.clearTable(h);
            for (i = 0; i < g.length; i++) {
                values = g[i].split("%");
                if (h.populationType == "full") {
                    if ((!(values[0] == "")) && (!(values[0] == "No sets chosen."))) {
                        check = false;
                        if (!check) {
                            el = new AnnoListItem(values[1], values, "all", "add", h.userid);
                            h.winSelect.appendChild(el.DOM);
                            el.choose.subscribe(h.changeNameBox, h);
                            el.add.subscribe(h.addToMyList, h);
                            el.clicked.subscribe(h.changeAnnoSet, h);
                            el.reload.subscribe(function(m, l, k){
                                k.populateTables(k);
                            }, h);
                        }
                    }
                    else {
                        if (values[0] == "No sets chosen.") {
                            h.winSelect.appendChild(document.createTextNode(values[0]));
                        }
                    }
                }
                else {
                    if (h.populationType == "current") {
                        if (i == 0) {
                            h.selectedId = values[1];
                            h.selectedName = values[0];
                            priv = (values[4] == "true") ? true : false;
                            h.selectedPriv = priv;
                        }
                        if (!(values[0] == "")) {
                            el = new AnnoListItem(values[1], values, "mine", null, h.userid);
                            h.winSelect.appendChild(el.DOM);
                            el.choose.subscribe(h.changeNameBox, h);
                            el.clicked.subscribe(h.changeAnnoSet, h);
                            el.removeItem.subscribe(function(m, l, k){
                                h.winSelect.removeChild(l[0]);
                            }, h);
                            el.reload.subscribe(function(m, l, k){
                                k.populateTables(k);
                            }, h);
                        }
                    }
                }
            }
            if (!h.winSelect.firstChild) {
                el = document.createElement("div");
                el.className = "fileitem";
                warning = (h.populationType == "current") ? ((h.userid) ? "No Sets found in My Sets" : "Must be logged in to use this feature") : "No Public Sets Available";
                el.appendChild(document.createTextNode(warning));
                h.winSelect.appendChild(el);
            }
        },
        failure: function(g){
            alert("Failure loading annotation sets");
        },
        argument: [d]
    };
    var b = YAHOO.util.Connect.asyncRequest("GET", c, f);
    setTimeout(function(j, h, g){
        if (YAHOO.util.Connect.isCallInProgress(b)) {
            YAHOO.util.Connect.abort(b);
        }
    }, 5000);
};
AnnotationSelect.prototype.changeNameBox = function(g, f, d){
    var c = f[0].name;
    var h = f[0].id;
    var b = f[0].priv;
    d.selectedName = c;
    d.selectedId = h;
    d.selectedPriv = (b == 1) ? true : false;
};
AnnotationSelect.prototype.changeAnnoSet = function(d, b, c){
    c.changeCall.fire({
        docId: c.docId,
        annoId: c.selectedId,
        annoName: c.selectedName,
        priv: c.selectedPriv
    });
    c.clearAll(d, c);
};
AnnotationSelect.prototype.startSavingNew = function(j, m, k){
    var b = m[0].name;
    var f = m[0].desc;
    var h = m[0].sec;
    var g = m[0].self;
    var d = "?type=set&name=" + b + "&desc=" + f + "&sec=" + h;
    var c = "./lib/Annotation/saveAnnoSet.php" + d;
    var o = {
        success: function(q){
            var r = q.responseText;
            var p = q.argument.obj;
            var e = q.argument.win;
            if ((r == "Unique name already taken, please choose another") || (r == "Entries Blank")) {
                p.annoWindow.body.insertBefore(document.createTextNode(r), p.annoWindow.body.childNodes[2]);
            }
            else {
                p.annoName = q.argument.name;
                p.changeCall.fire({
                    annoName: p.annoName,
                    annoId: q.responseText,
                    priv: true
                });
                p.visibleNow.fire("open");
                p.populateTables(p);
            }
        },
        failure: function(e){
            alert("Failure connecting to server");
        },
        argument: {
            obj: k,
            win: g,
            name: b
        }
    };
    var l = YAHOO.util.Connect.asyncRequest("GET", c, o);
};
AnnotationSelect.prototype.clearAll = function(c, b){
    footnotes = YAHOO.util.Dom.getElementsByClassName("infoFootnote");
    for (i = 0; i < footnotes.length; i++) {
        temp = footnotes[i];
        temp.parentNode.removeChild(temp);
    }
};
AnnoWindow = function(b){
    this.loc = b;
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
    YAHOO.util.Event.addListener(this.annoPrivate.id, "click", function(d, c){
        c.permSelect = (c.annoPrivate.checked) ? "private" : "public";
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
AnnoWindow.prototype.close = function(c, b){
    YAHOO.util.Dom.setStyle(b.DOM, "display", "none");
    YAHOO.util.Dom.setStyle(b.loc, "display", "block");
};
AnnoWindow.prototype.show = function(c, b){
    YAHOO.util.Dom.setStyle(b.DOM, "display", "block");
};
AnnoWindow.prototype.setPriv = function(c, b){
};
AnnoWindow.prototype.initializeNewAnno = function(c, b){
    b.newAnnoMade.fire({
        name: b.annoName.value,
        desc: b.annoDesc.value,
        sec: b.permSelect,
        self: b
    });
    b.annoName.value = "";
    b.annoDesc.value = "";
    b.close(c, b);
};
AnnoListItem = function(f, c, d, e, b){
    this.values = c;
    this.DOM = document.createElement("div");
    YAHOO.util.Dom.generateId(this.DOM, f + "_");
    this.DOM.className = "fileitem";
    this.secure = c[5];
    this.fillValue = document.createElement("span");
    YAHOO.util.Dom.generateId(this.fillValue, "annoset");
    this.fillValue.className = "setDetails";
    this.setName = document.createElement("p");
    this.setName.appendChild(document.createTextNode(c[0]));
    this.setName.className = "setName";
    this.fillValue.appendChild(document.createTextNode(c[2]));
    this.fillValue.appendChild(document.createElement("br"));
    this.fillValue.appendChild(document.createTextNode("Creator: " + c[3] + " (" + c[5] + ")"));
    this.DOM.appendChild(this.setName);
    this.DOM.appendChild(this.fillValue);
    this.DOM.appendChild(this.fillValue);
    this.printViewSpace = document.createElement("div");
    YAHOO.util.Dom.generateId(this.printViewSpace, "pvs");
    this.printViewSpace.className = "PrintView";
    this.DOM.appendChild(this.printViewSpace);
    this.genLink(this);
    if (d == "mine") {
        this.edit = document.createElement("div");
        YAHOO.util.Dom.generateId(this.edit);
        this.edit.className = "annoEditButton";
        this.DOM.appendChild(this.edit);
        this.editText = document.createElement("a");
        this.editText.appendChild(document.createTextNode("Edit"));
        this.editText.id = "edit" + f;
        this.edit.appendChild(this.editText);
        YAHOO.util.Event.addListener(this.edit.id, "click", this.editShow, this);
        this.editBox = document.createElement("div");
        YAHOO.util.Dom.generateId(this.editBox, "editBox");
        this.editBox.className = "annoListEditBox";
        YAHOO.util.Dom.setStyle(this.editBox, "display", "none");
        this.DOM.appendChild(this.editBox);
        this.clearEdits = document.createElement("div");
        this.clearEdits.className = "clear";
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
        this.delItem.id = "del" + f;
        this.delBox.appendChild(this.delItem);
        this.delBox.appendChild(document.createTextNode("Delete Annotation Set and all accompanying Annotations."));
        this.editBox.appendChild(this.delBox);
        this.editBoxClear = document.createElement("div");
        this.editBoxClear.className = "clear";
        this.editBox.appendChild(this.editBoxClear);
        this.warn = document.createElement("span");
        this.warn.className = "annoWarn";
        this.warn.id = "warn" + f;
        this.warn.appendChild(document.createTextNode("Warning: This will erase the set and any annotations associated with this set. Continue?"));
        YAHOO.util.Dom.setStyle(this.warn, "display", "none");
        this.yes = document.createElement("a");
        this.yes.appendChild(document.createTextNode("Delete"));
        this.yes.className = "annoWarnButton";
        this.yes.id = "yes" + f;
        this.warn.appendChild(this.yes);
        YAHOO.util.Event.addListener(this.yes.id, "click", this.delThisEl, this);
        this.no = document.createElement("a");
        this.no.appendChild(document.createTextNode("Cancel"));
        this.no.className = "annoWarnButton";
        this.no.id = "cancel" + f;
        this.warn.appendChild(this.no);
        this.DOM.appendChild(this.warn);
        YAHOO.util.Event.addListener(this.no.id, "click", function(h, g){
            YAHOO.util.Dom.setStyle(g.warn, "display", "none");
        }, this);
        YAHOO.util.Event.addListener(this.delItem.id, "click", function(h, g){
            YAHOO.util.Dom.setStyle(g.warn, "display", "block");
        }, this);
    }
    else {
        if ((d == "all") && (b)) {
            this.choiceField = document.createElement("div");
            this.choiceField.className = "annoAllChoiceField";
            YAHOO.util.Dom.generateId(this.choiceField, "choice");
            this.choice = document.createElement("input");
            this.choice.type = "checkbox";
            YAHOO.util.Dom.generateId(this.choice, "addtoMine");
            this.choiceField.appendChild(this.choice);
            txt = (e == "add") ? "Add to My Sets: " : "Remove from My Sets: ";
            this.choiceField.insertBefore(document.createTextNode(txt), this.choice);
            if (e == "add") {
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
    YAHOO.util.Event.addListener(this.DOM.id, "mouseover", function(h, g){
        priv = (g.values[4] == "true") ? true : false;
        g.choose.fire({
            id: g.values[1],
            name: g.values[0],
            priv: priv
        });
    }, this);
    YAHOO.util.Event.addListener(this.DOM.id, "dblclick", this.handleClick, this);
};
AnnoListItem.prototype.changeSecure = function(f, b){
    YAHOO.util.Event.stopEvent(f);
    obj = b.obj;
    value = b.value;
    n = obj.DOM.id.indexOf("_");
    tId = obj.DOM.id.substring(0, n);
    var d = "./lib/Annotation/changeAnno.php?type=set&id=" + tId + "&change=" + value;
    var g = {
        success: function(e){
            obj = e.argument[0];
            value = e.argument[1];
            obj.secure = value;
            obj.reload.fire();
        },
        failure: function(e){
            alert("Failure to connect to server [AnnotationSelect.js 647]");
        },
        argument: [obj, value]
    };
    var c = YAHOO.util.Connect.asyncRequest("GET", d, g);
    setTimeout(function(){
        if (YAHOO.util.Connect.isCallInProgress(c)) {
            YAHOO.util.Connect.abort(c);
            alert("Server Timed Out");
        }
    }, 5000);
};
AnnoListItem.prototype.genLink = function(b){
    el = document.createElement("a");
    el.href = "./lib/AnnotationSelect/markerHTML.php?setId=" + b.values[1];
    el.target = "_blank";
    el.appendChild(document.createTextNode("Print View"));
    b.printViewSpace.appendChild(el);
};
AnnoListItem.prototype.addList = function(c, b){
    YAHOO.util.Event.stopEvent(c);
    b.add.fire(b);
};
AnnoListItem.prototype.removeList = function(c, b){
    YAHOO.util.Event.stopEvent(c);
    b.remove.fire(b);
};
AnnoListItem.prototype.remove = function(c, b){
    YAHOO.util.Event.stopEvent(c);
    b.remove.fire(b.DOM);
};
AnnoListItem.prototype.editShow = function(c, b){
    YAHOO.util.Event.stopPropagation(c);
    YAHOO.util.Event.removeListener(b.edit.id, "click", b.editShow);
    YAHOO.util.Event.addListener(b.edit.id, "click", b.editHide, b);
    YAHOO.util.Dom.setStyle(b.editBox, "display", "block");
};
AnnoListItem.prototype.editHide = function(c, b){
    YAHOO.util.Event.stopEvent(c);
    YAHOO.util.Event.removeListener(b.edit.id, "click", b.ediHide);
    YAHOO.util.Event.addListener(b.edit.id, "click", b.editShow, b);
    YAHOO.util.Dom.setStyle(b.editBox, "display", "none");
};
AnnoListItem.prototype.handleClick = function(c, b){
    b.clicked.fire(b.values);
};
AnnoListItem.prototype.handleDblClick = function(c, b){
    b.dblclicked.fire(b.values);
};
AnnoListItem.prototype.delThisEl = function(f, d){
    YAHOO.util.Event.stopEvent(f);
    var c = "./lib/Annotation/deleteAnno.php?type=set&id=" + d.values[1];
    callback = {
        success: function(e){
            e.argument[0].removeItem.fire(d.DOM);
        },
        failure: function(e){
            alert("Failure connecting to server");
        },
        argument: [d]
    };
    var b = YAHOO.util.Connect.asyncRequest("GET", c, callback);
    setTimeout(function(){
        if (YAHOO.util.Connect.isCallInProgress(b)) {
            YAHOO.util.Connect.abort(b);
            alert("Server Timed Out");
        }
    }, 5000);
};
