/**
 * @author jgrantd
 * ArchieGlobalFunctions.js
 */

YAHOO.namespace("quartos");
Archie = YAHOO.quartos;
mouseX = 0;
mouseY = 0;
UA = YAHOO.env.ua;

// Setup constants
// QUIRKS FLAG, FOR BOX MODEL
var IE_QUIRKS = (YAHOO.env.ua.ie && document.compatMode == "BackCompat");
// UNDERLAY/IFRAME SYNC REQUIRED
var IE_SYNC = (YAHOO.env.ua.ie == 6 || (YAHOO.env.ua.ie == 7 && IE_QUIRKS));
// PADDING USED FOR BODY ELEMENT (Hardcoded for example)
var PANEL_BODY_PADDING = (10*2) // 10px top/bottom padding applied to Panel body element. The top/bottom border width is 0

var IMGDIR="";
window.onload = function(){
	
	//CustomEvent for Creating Windows
		//var desktop=new Archie.workspace("workspace",null,regPath);
	
	var callback = {
		success: function(o){
			
			var data=o.responseText.split('%');
			var rp=data[0];
			IMGDIR=data[1];
			var xpath=data[2];
			desktop = o.argument[0];
			//header=document.getElementById("header");
			desktop = new ArchWorkspace({
				loc: "workspace",
				regpath: rp,
				xmlpath: xpath
			});
			
		},
		failure: function(o){
			alert("Failure to connect to server: [ArchieGlobalFunctions.js :: 82]")
		},
		argument: []
	}
	YAHOO.util.Connect.asyncRequest("GET", "./Global_Files/findDomain.php", callback);

}

		
Archie.xml = function(xmlSrc){
	this.src = xmlSrc;
	this.xml = loadXMLDoc(xmlSrc);
}


Archie.mouseMoveEvent = function(e){
	mouseX = YAHOO.util.Event.getPageX(e);
	mouseY = YAHOO.util.Event.getPageY(e)
} 
Archie.textTag = function(inits) {
	this.x = inits.dx;
	this.y = inits.dy;
	this.panel = inits.panel;
	
	
	this.HTML = document.createElement("div");
	this.id = YAHOO.util.Dom.generateId("textTag");
	this.HTML.id = this.id;
	
	this.HTML.className = "textBox";
	this.HTML.style.left = this.x + "px";
	this.HTML.style.top = this.y + "px";
	
	this.closeButton = document.createElement("img");
	this.closeButton.id = YAHOO.util.Dom.generateId(this.closeButton, "closeit");
	this.closeButton.alt = "close";
	this.closeButton.style.top = "0px";
	
	
	this.panel.HTML.parentNode.appendChild(this.HTML);
	YAHOO.util.Event.addListener(this.closeButton.id, "click", this.close, this);
	
}
Archie.textTag.prototype.close=function() {
	this.HTML.parentNode.removeChild(this.HTML);
}

function loadXMLDoc(fname)
{
var xmlDoc;
// code for IE
if (window.ActiveXObject)
  {
  xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
  }
// code for Mozilla, Firefox, Opera, etc.
else if (document.implementation 
&& document.implementation.createDocument)
  {
  xmlDoc=document.implementation.createDocument("","",null);
  }
else
  {
  alert('Your browser cannot handle this script');
  }
xmlDoc.async=false;
xmlDoc.load(fname);
return(xmlDoc);
}

function getElementWithAttValue(xml,ele,attName,attValue){
	allEles = xml.getElementsByTagName(ele);
	
	for (i=0;i<allEles.length;i++){
			
		if (allEles[i].hasAttribute(attName)){
			thisVal = allEles[i].getAttribute(attName);
	
			if (thisVal==attValue){
				
				//alert(allEles[i].parentNode.textContent);
				return allEles[i];
			}
				
		}
	}
	return null;
}
function loadFile(filename){
    
   var req = new GetXmlHttpObject();
    
    req.open('GET', './openText.php?fn='+filename, false);
    req.send(null);
    newText =  req.responseText;
	
    return newText;
}

function retrieveCrops(panel) {
	if(panel) {
		pparams = '?id='+panel.id;
		response = phpCall('./php/archielogin/retrieveCrop.php', pparams, 'GET');
		croparray = response.split(';');
		for(x in croparray) {
			crop = croparray[x].split('%');
			
			cB = new Archie.cropBox(panel, crop);
			panel.image.crops.push(cB);
		}
		
	}
}
function createWindow() {
	
	Archie.setUpWindow.fire("");
	
	
}

//--------------Clear Coords--------
function OldclearCoords(panel) { //  ::Deprecated::
		//clear contents
		
	for (x in panel.image.areas) {
		curr = panel.image.areas[x];
		for (i in curr.nodes) {
			curr.nodes[i].HTML.parentNode.removeChild(curr.nodes[i].HTML);
		}
		curr.nodes[x].length = 0;
		for(i in curr.lines) {
			curr.lines[i].remove();
		}
		
	}
	panel.image.areas.length = 0;
	panel.image.curArea = null;
	
		for(i in panel.image.imageRegions) {
			
			panel.image.imageRegions[i].HTML.parentNode.removeChild(panel.image.imageRegions[i].HTML);
			
		}
		panel.image.imageRegions.length = 0;
		
}


//--------------Entering Coords into DB--------

function getCoords(image, mode, shape, args){
	
	if (image.panel.project) {
		if (shape == "box") {
			if (mode == "new") {
			
				cLeft = args.HTML.style.left;
				cTop = args.HTML.style.top;
				cWidth = args.HTML.style.width;
				cHeight = args.HTML.style.height;
				isetID = args.area.id;
				
				curPage = image.panel.curPage;
				
				coords = parseInt(cLeft) + "," + parseInt(cTop) + "," + parseInt(cWidth) + "," + parseInt(cHeight);
				
				pparams = "?coord=" + coords + "&mode=new&type=" + shape + "&width=" + (document.getElementById(image.id).width) +
				"&height=" +
				(document.getElementById(image.id).height) +
				"&curPage=" +
				curPage;
				
				//return the imagetag ID
				return phpCall('./php/archielogin/coordDB.php', pparams, 'GET');
				
			}
			else 
				if (mode == "overwrite") {
					cLeft = args.HTML.style.left;
					cTop = args.HTML.style.top;
					cWidth = args.HTML.style.width;
					cHeight = args.HTML.style.height;
					isetID = args.area.isetID;
					
					curPage = image.panel.curPage;
					
					coords = parseInt(cLeft) + "," + parseInt(cTop) + "," + parseInt(cWidth) + "," + parseInt(cHeight);
					pparams = "?coord=" + coords + "&mode=overwrite&width=" + (document.getElementById(image.id).width) +
					"&height=" +
					(document.getElementById(image.id).height) +
					"&id=" +
					isetID +
					"&curPage=" +
					curPage;
					
					phpCall('./php/archielogin/coordDB.php', pparams, 'GET');
				}
		}
		else {
			if (mode == "new") {
			
				coords = "";
				
				for (i in args.nodes) {
					//alert(args[i].dot.HTML);
					node = args.nodes[i];
					cTop = YAHOO.util.Dom.getStyle(node.dot.HTML, "top");
					cLeft = YAHOO.util.Dom.getStyle(node.dot.HTML, "left");
					coords += parseInt(cLeft) + "," + parseInt(cTop) + ",";
				}
				
				curPage = image.panel.curPage;
				
				
				pparams = "?coord=" + coords.substring(0, (coords.length - 1)) +
				"&mode=new&type=" +
				shape +
				"&width=" +
				(document.getElementById(image.id).width) +
				"&height=" +
				(document.getElementById(image.id).height) +
				"&curPage=" +
				curPage;
				
				return phpCall('./php/archielogin/coordDB.php', pparams, 'GET');
				
			}
			else 
				if (mode == "overwrite") {
					coords = "";
					var isetID = args.isetID;
					for (i in args.nodes) {
					//alert(args[i].dot.HTML);
					node = args.nodes[i];
					cTop = YAHOO.util.Dom.getStyle(node.dot.HTML, "top");
					cLeft = YAHOO.util.Dom.getStyle(node.dot.HTML, "left");
					coords += parseInt(cLeft) + "," + parseInt(cTop) + ",";
				}
				
				curPage = image.panel.curPage;
					
					
				pparams = "?coord=" + (coords.substring(0, (coords.length - 1))) + 
				"&mode=overwrite&width=" + 
				(document.getElementById(image.id).width) +
				"&height=" +
				(document.getElementById(image.id).height) +
				"&id=" +
				isetID +
				"&curPage=" +
				curPage;
				
				phpCall('./php/archielogin/coordDB.php', pparams, 'GET');
				
			}
		}
	}
}