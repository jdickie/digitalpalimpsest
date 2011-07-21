function _(str) { /* getText */
	if (!(str in window.LOCALE)) { return str; }
	return window.LOCALE[str];
}

var DATATYPES = false;
var LOCALE = {};
var SQL = {};

/* -------------------- base visual element -------------------- */

SQL.Visual = OZ.Class(); /* abstract parent */
SQL.Visual.prototype.init = function() {
	this._init();
	this._build();
}

SQL.Visual.prototype._init = function() {
	this.dom = {
		container:OZ.DOM.elm("div"),
		content:OZ.DOM.elm("div"),
		title:OZ.DOM.elm("div",{className:"title"})
	};
	this.data = {
		title:""
	}
}

SQL.Visual.prototype._build = function() {}

SQL.Visual.prototype.toXML = function() {}

SQL.Visual.prototype.fromXML = function(node) {}

SQL.Visual.prototype.destroy = function() { /* "destructor" */
	var p = this.dom.container.parentNode;
	if (p && p.nodeType == 1) {
		p.removeChild(this.dom.container);
	}
}

SQL.Visual.prototype.setTitle = function(text) {
	if (!text) { return; }
	this.data.title = text;
	this.dom.title.innerHTML = text;
}

SQL.Visual.prototype.getTitle = function() {
	return this.data.title;
}

SQL.Visual.prototype.redraw = function() {}
SQL.Relation = OZ.Class().extend(SQL.Visual);
SQL.Relation.prototype.init = function(owner, row1, row2) {
	this.owner = owner;
	this.row1 = row1;
	this.row2 = row2;
	this.hidden = false;
	SQL.Visual.prototype.init.apply(this);
	
	//this.row1.addRelation(this);
	//this.row2.addRelation(this);
	
	this.dom = [];
	this.owner.vector = "svg";
	
	if (this.owner.vector == "svg") {
		var path = document.createElementNS(this.owner.svgNS, "path");
		path.setAttribute("stroke","black");
		path.setAttribute("stroke-width",CONFIG.RELATION_THICKNESS);
		path.setAttribute("fill","none");
		this.owner.dom.svg.appendChild(path);
		this.dom.push(path);
	} else if (this.owner.vector == "vml") {
		var curve = OZ.DOM.elm("v:curve");
		curve.strokeweight = CONFIG.RELATION_THICKNESS+"px";
		curve.from = "0 0";
		curve.to = "0 0";
		curve.control1 = "10 10";
		curve.control2 = "100 300";
		curve.strokecolor = "#000";
		curve.filled = false;
		this.owner.dom.content.appendChild(curve);
		this.dom.push(curve);
	} else {
		for (var i=0;i<3;i++) {
			var div = OZ.DOM.elm("div",{position:"absolute",className:"relation"});
			this.dom.push(div);
			if (i & 1) { /* middle */
				OZ.Style.set(div,{width:CONFIG.RELATION_THICKNESS+"px"});
			} else { /* first & last */
				OZ.Style.set(div,{height:CONFIG.RELATION_THICKNESS+"px"});
			}
			this.owner.dom.content.appendChild(div);
		}
	}
	
	this.redraw();
}

SQL.Relation.prototype.show = function() {
	this.hidden = false;
	for (var i=0;i<this.dom.length;i++) {
		this.dom[i].style.visibility = "";
	}
}

SQL.Relation.prototype.hide = function() {
	this.hidden = true;
	for (var i=0;i<this.dom.length;i++) {
		this.dom[i].style.visibility = "hidden";
	}
}

SQL.Relation.prototype.redrawNormal = function(p1, p2, half) {
	if (this.owner.vector == "svg") {
		var str = "M "+p1[0]+" "+p1[1]+" C "+(p1[0] + half)+" "+p1[1]+" ";
		str += (p2[0]-half)+" "+p2[1]+" "+p2[0]+" "+p2[1];
		this.dom[0].setAttribute("d",str);
	} else if (this.owner.vector == "vml") {
		this.dom[0].from = p1[0]+" "+p1[1];
		this.dom[0].to = p2[0]+" "+p2[1];
		this.dom[0].control1 = (p1[0]+half)+" "+p1[1];
		this.dom[0].control2 = (p2[0]-half)+" "+p2[1];
	} else {
		this.dom[0].style.left = p1[0]+"px";
		this.dom[0].style.top = p1[1]+"px";
		this.dom[0].style.width = half+"px";

		this.dom[1].style.left = (p1[0] + half) + "px";
		this.dom[1].style.top = Math.min(p1[1],p2[1]) + "px";
		this.dom[1].style.height = (Math.abs(p1[1] - p2[1])+CONFIG.RELATION_THICKNESS)+"px";

		this.dom[2].style.left = (p1[0]+half+1)+"px";
		this.dom[2].style.top = p2[1]+"px";
		this.dom[2].style.width = half+"px";
	}
}

SQL.Relation.prototype.redrawSide = function(p1, p2, x) {
	if (this.owner.vector == "svg") {
		var str = "M "+p1[0]+" "+p1[1]+" C "+x+" "+p1[1]+" ";
		str += x+" "+p2[1]+" "+p2[0]+" "+p2[1];
		this.dom[0].setAttribute("d",str);
	} else if (this.owner.vector == "vml") {
		this.dom[0].from = p1[0]+" "+p1[1];
		this.dom[0].to = p2[0]+" "+p2[1];
		this.dom[0].control1 = x+" "+p1[1];
		this.dom[0].control2 = x+" "+p2[1];
	} else {
		this.dom[0].style.left = Math.min(x,p1[0])+"px";
		this.dom[0].style.top = p1[1]+"px";
		this.dom[0].style.width = Math.abs(p1[0]-x)+"px";
		
		this.dom[1].style.left = x+"px";
		this.dom[1].style.top = Math.min(p1[1],p2[1]) + "px";
		this.dom[1].style.height = (Math.abs(p1[1] - p2[1])+CONFIG.RELATION_THICKNESS)+"px";
		
		this.dom[2].style.left = Math.min(x,p2[0])+"px";
		this.dom[2].style.top = p2[1]+"px";
		this.dom[2].style.width = Math.abs(p2[0]-x)+"px";
	}
}

SQL.Relation.prototype.redraw = function() { /* draw connector */
	if (this.hidden) { return; }
	var t1 = this.row1;
	var t2 = this.row2;

	var l1 = t1.offsetLeft;
	var l2 = t2.offsetLeft;
	var r1 = l1 + t1.offsetWidth;
	var r2 = l2 + t2.offsetWidth;
	var t1 = t1.offsetTop + this.row1.offsetTop + Math.round(this.row1.offsetHeight/2);
	var t2 = t2.offsetTop + this.row2.offsetTop + Math.round(this.row2.offsetHeight/2);
	
	//if (this.row1.owner.selected) { t1++; l1++; r1--; }
	//if (this.row2.owner.selected) { t2++; l2++; r2--; }
	
	var p1 = [0,0];
	var p2 = [0,0];
	
	if (r1 < l2 || r2 < l1) { /* between tables */
		if (Math.abs(r1 - l2) < Math.abs(r2 - l1)) {
			p1 = [r1,t1];
			p2 = [l2,t2];
		} else {
			p1 = [r2,t2];
			p2 = [l1,t1];
		}
		var half = Math.floor((p2[0] - p1[0])/2);
		this.redrawNormal(p1, p2, half);
	} else { /* next to tables */
		var x = 0;
		var l = 0;
		if (Math.abs(l1 - l2) < Math.abs(r1 - r2)) { /* left of tables */
			p1 = [l1,t1];
			p2 = [l2,t2];
			x = Math.min(l1,l2) - CONFIG.RELATION_SPACING;
		} else { /* right of tables */
			p1 = [r1,t1];
			p2 = [r2,t2];
			x = Math.max(r1,r2) + CONFIG.RELATION_SPACING;
		}
		this.redrawSide(p1, p2, x);
	} /* line next to tables */
}

SQL.Relation.prototype.destroy = function() {
	this.row1.removeRelation(this);
	this.row2.removeRelation(this);
	for (var i=0;i<this.dom.length;i++) {
		this.dom[i].parentNode.removeChild(this.dom[i]);
	}
}

SQL.Designer = OZ.Class().extend(SQL.Visual);

SQL.Designer.prototype.init = function() {
	SQL.Designer = this;
	
	this.tables = [];
	this.relations = [];
	this.title = document.title;
	
	SQL.Visual.prototype.init.apply(this);
	
	this.dom.container = this.dom.content = document.getElementById("area");
	
	this.width = this.dom.container.offsetWidth;
	this.height = this.dom.container.offsetHeight;

	this.flag = 2;
	
	
	this.vector = this.getOption("vector") && (OZ.gecko || OZ.opera || OZ.webkit || OZ.ie);
	if (this.vector) {
		this.vector = "svg";
		if (OZ.ie) { this.vector = "vml"; }
	}
	if (this.vector == "svg") {
		this.svgNS = "http://www.w3.org/2000/svg";
		this.dom.svg = document.createElementNS(this.svgNS, "svg");
		this.dom.svg.setAttribute("width",this.dom.container.offsetWidth);
		this.dom.svg.setAttribute("height",this.dom.container.offsetHeight);
		this.dom.content.appendChild(this.dom.svg);
	}
}

SQL.Designer.prototype.requestLanguage = function() { /* get locale file */
	var lang = this.getOption("locale")
	var url = "locale/"+lang+".xml";
	OZ.Request(url, this.bind(this.languageResponse), {method:"get", xml:true});
}

SQL.Designer.prototype.languageResponse = function(xmlDoc) {
	if (xmlDoc) {
		var strings = xmlDoc.getElementsByTagName("string");
		for (var i=0;i<strings.length;i++) {
			var n = strings[i].getAttribute("name");
			var v = strings[i].firstChild.nodeValue;
			window.LOCALE[n] = v;
		}
	}
	this.flag--;
	if (!this.flag) { this.init2(); }
}




SQL.Designer.prototype.init2 = function() { /* secondary init, after locale & datatypes were retrieved */
	//this.map = new SQL.Map(this);
	//this.tableManager = new SQL.TableManager(this);
	//this.rowManager = new SQL.RowManager(this);
	//this.keyManager = new SQL.KeyManager(this);
	//this.io = new SQL.IO(this);
	//this.options = new SQL.Options(this);
	//this.window = new SQL.Window(this);
	/*
	OZ.$("docs").value = _("docs");

	var url = window.location.href;
	var r = url.match(/keyword=([^&]+)/);
	if (r) {
		var keyword = r[1];
		this.io.serverload(false, keyword);
	}
	*/
	document.body.style.visibility = "visible";
}

SQL.Designer.prototype.getMaxZ = function() { /* find max zIndex */
	var max = 0;
	for (var i=0;i<this.tables.length;i++) {
		var z = this.tables[i].getZ();
		if (z > max) { max = z; }
	}
	return max;
}

SQL.Designer.prototype.addTable = function(name, x, y) {
	var max = this.getMaxZ();
	var t = new SQL.Table(this, name, x, y, max+1);
	this.tables.push(t);
	this.dom.content.appendChild(t.dom.container);
	t.redraw();
	return t;
}

SQL.Designer.prototype.removeTable = function(t) {
	this.tableManager.select(false);
	this.rowManager.select(false);
	var idx = this.tables.indexOf(t);
	if (idx == -1) { return; }
	t.destroy();
	this.tables.splice(idx,1);
}

SQL.Designer.prototype.addRelation = function(row1, row2) {
	var r = new SQL.Relation(this, row1, row2);
	this.relations.push(r);
	return r;
}

SQL.Designer.prototype.removeRelation = function(r) {
	var idx = this.relations.indexOf(r);
	if (idx == -1) { return; }
	r.destroy();
	this.relations.splice(idx,1);
}

SQL.Designer.prototype.getCookie = function() {
	var c = document.cookie;
	var obj = {};
	var parts = c.split(";");
	for (var i=0;i<parts.length;i++) {
		var part = parts[i];
		var r = part.match(/wwwsqldesigner=({.*?})/);
		if (r) { obj = eval("("+r[1]+")"); }
	}
	return obj;
}

SQL.Designer.prototype.setCookie = function(obj) {
	var arr = [];
	for (var p in obj) {
		arr.push(p+":'"+obj[p]+"'");
	}
	var str = "{"+arr.join(",")+"}";
	document.cookie = "wwwsqldesigner="+str+"; path=/";
}

SQL.Designer.prototype.getOption = function(name) {
	var c = this.getCookie();
	if (name in c) { return c[name]; }
	/* defaults */
	switch (name) {
		
		case "snap": return 0;
		case "pattern": return "%R_%T";
		case "hide": return false;
		case "vector": return true;
		default: return null;
	}
}

SQL.Designer.prototype.setOption = function(name, value) {
	var obj = this.getCookie();
	obj[name] = value;
	this.setCookie(obj);
}

SQL.Designer.prototype.raise = function(table) { /* raise a table */
	var old = table.getZ();
	var max = this.getMaxZ();
	table.setZ(max);
	for (var i=0;i<this.tables.length;i++) {
		var t = this.tables[i];
		if (t == table) { continue; }
		if (t.getZ() > old) { t.setZ(t.getZ()-1); }
	}
	var m = table.dom.mini;
	m.parentNode.appendChild(m);
}

SQL.Designer.prototype.clearTables = function() {
	while (this.tables.length) { this.removeTable(this.tables[0]); }
	this.setTitle(false);
}

SQL.Designer.prototype.alignTables = function() {
	var win = OZ.DOM.win();
	var avail = win[0] - OZ.$("bar").offsetWidth;
	var x = 10;
	var y = 10;
	var max = 0;
	
	this.tables.sort(function(a,b){
		return b.getRelations().length - a.getRelations().length;
	});

	for (var i=0;i<this.tables.length;i++) {
		var t = this.tables[i];
		var w = t.dom.container.offsetWidth;
		var h = t.dom.container.offsetHeight;
		if (x + w > avail) {
			x = 10;
			y += 10 + max;
			max = 0;
		}
		t.moveTo(x,y);
		x += 10 + w;
		if (h > max) { max = h; }
	}
}

SQL.Designer.prototype.findNamedTable = function(name) { /* find row specified as table(row) */
	for (var i=0;i<this.tables.length;i++) {
		if (this.tables[i].getTitle() == name) { return this.tables[i]; }
	}
}

SQL.Designer.prototype.toXML = function() {
	var xml = '<?xml version="1.0" encoding="utf-8" ?>';
	xml += '<sql>';
	
	/* serialize datatypes */
	if (window.XMLSerializer) {
		var s = new XMLSerializer();
		xml += s.serializeToString(window.DATATYPES);
	} else if (window.DATATYPES.xml) {
		xml += window.DATATYPES.xml;
	} else {
		alert(_("errorxml")+': '+e.message);
	}
	
	for (var i=0;i<this.tables.length;i++) {
		xml += this.tables[i].toXML();
	}
	xml += "</sql>";
	return xml;
}

SQL.Designer.prototype.fromXML = function(node) {
	this.clearTables();
	var types = node.getElementsByTagName("datatypes");
	if (types.length) { window.DATATYPES = types[0]; }
	var tables = node.getElementsByTagName("table");
	for (var i=0;i<tables.length;i++) {
		var t = this.addTable("", 0, 0);
		t.fromXML(tables[i]);
	}

	/* relations */
	var rs = node.getElementsByTagName("relation");
	for (var i=0;i<rs.length;i++) {
		var rel = rs[i];
		var tname = rel.getAttribute("table");
		var rname = rel.getAttribute("row");
		
		var t1 = this.findNamedTable(tname);
		if (!t1) { continue; }
		var r1 = t1.findNamedRow(rname);
		if (!r1) { continue; }

		tname = rel.parentNode.parentNode.getAttribute("name");
		rname = rel.parentNode.getAttribute("name");
		var t2 = this.findNamedTable(tname);
		if (!t2) { continue; }
		var r2 = t2.findNamedRow(rname);
		if (!r2) { continue; }

		this.addRelation(r1, r2);
	}
}

SQL.Designer.prototype.setTitle = function(t) {
	document.title = this.title + (t ? " - "+t : "");
}

SQL.Designer.prototype.removeSelection = function() {
	var sel = (window.getSelection ? window.getSelection() : document.selection);
	if (!sel) { return; }
	if (sel.empty) { sel.empty(); }
	if (sel.removeAllRanges) { sel.removeAllRanges(); }
}
function initAll(){
	owner = new SQL.Designer();
	owner.init();
	relate = new SQL.Relation(owner, document.getElementById("b4497"), document.getElementById("w4497"));
}
