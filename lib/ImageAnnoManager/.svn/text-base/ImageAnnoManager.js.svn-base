
ArchiePanel.prototype.reloadCoords = function(){
	//Load Coordinates
	pparams = '?curPage=' + this.curPage;
	cArray = coordstring.split(';');
	for (i in cArray) {
		temp = cArray[i].split('-');
		if (temp[1] == 'box') { //reconstruct box
			coords = temp[2].split(',');
			left = parseInt(coords[0]) + YAHOO.util.Dom.getX(this.content.HTML);
			top = parseInt(coords[1]) + YAHOO.util.Dom.getY(this.content.HTML);
			box = new ImageRegion([left, top, coords[3], coords[2]], true);
			this.content.HTML.appendChild(box.HTML);
		}
		else 
			if (temp[1] == "poly") {
				
			}
		
	}

}

//--------------------------------------------------------
// Web 2.0, user-generated stuff (split off into other objects)
//--------------------------------------------------------
			
/***
 * Update the database that a note is deleted
 * 
 * refresh page
 * 
 * pass[0]: sUrl -> contains parameters for 
 * GET request
 * @param {Object} e
 * @param {Object} pass
 * @param {Object} args
 */
Archie.panel.prototype.deleteNote=function(e, pass, args){
	//update the Database through the php deleteAnno.php
	//panel.updateNotes(panel);
	
	var callback={
		success: function(o){
			panel=o.argument.panel;
			panel.showPage(panel);	
		},
		failure: function(o){
			alert("Error in deleting footnote");
		},
		argument: {panel: args}
	};
 	var transact=YAHOO.util.Connect.asyncRequest('GET', pass[0].sUrl, callback, null);
	
}
Archie.panel.prototype.updateNotes=function(panel){
	notes = YAHOO.util.Dom.getElementsByClassName("annoNote","span",panel.HTML);
	for (i in notes){
		note = notes[i];
		alert(note.id);
	}
	
}

Archie.panel.prototype.setUpAnno=function(panel, values){
	if (panel.project != 0) {
		//values=values.substring(0, (values.length-1));
		if (panel.mode == 'image') {
			values = values.split(';');
			
			for (curAnno in values) {
				record = values[curAnno].split('-');
				
				if ((!(record[1] == '')) && (!(record[1]==null))) {
					if (panel.mode == 'image') {
					
						var userText = (panel.properties['user'] == record[2]) ? record[0] : 'Comment made by ' + record[2] + ': ' + record[0];
						var coords = record[1].split(',');
						var text = userText;
						var editLock=(panel.properties['user']==record[3]) ? false : true;
						box = new ImageRegion(coords, false);
						panel.boxes.push(box);
						panel.content.HTML.appendChild(box.HTML);
						anno = new Annotation({
							text: text,
							coords: coords
						});
						panel.image.HTML.parentNode.appendChild(anno.HTML);
						anno.createImprint(text, box, anno, record[3], editLock);
						
					}
				}
			}
		}
		else 
			if (panel.mode == 'text') {
			
				values = values.split(';');
		
				for (curAnno in values) {
					if (!(values[curAnno] == ' ')) {
					
						record = values[curAnno].split('%');
						
						if (!(record[1] == '')) {
						
							var userText = (record[6] == panel.properties['user']) ? record[0] : "Comment from " + record[6] + ': ' + record[0];
							var infoBox = new InfoPopUp(panel.pageText, userText);
							panel.content.HTML.appendChild(infoBox.HTML);
							var node1 = document.getElementById(record[1]);
							var node2 = document.getElementById(record[2]);
							var offset1 = parseInt(record[3]);
							var offset2 = parseInt(record[4]);
							
							
							infoBox.leaveFootnote(panel.HTML, node1, node2, offset1, offset2, record[5], infoBox);
							
					
						}
					}
				}
				
			}
	}
}

Archie.panel.prototype.showNote = function(e,pass,args)
{

	id = pass[0].id.substring(2);
	params = "?type=text&id="+id;
	var sUrl = './lib/Annotation/showAnno.php'+params;
	
	var callback = {
		success: function(o){
			id = o.responseText;
		
		},
		failure: function(o){
			alert("Note could not be loaded.  Check your connection.");
		}
		,
		argument: {panel: args}
		
	}
	
	var request = YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);

}

Archie.panel.prototype.saveAnnoToDB = function(e, pass, args){


	obj = pass[0].obj;

	var comment=obj.textInput.value;

	var quote=obj.text.innerHTML;

	if(!(obj.values.recObj)){
		//text annotation
	
		var startParent = obj.values.startNode.parentNode;
		var endNode = obj.values.endNode;
		var endParent = endNode.parentNode;
		var startCount = 0;
		
		
		for (i in startParent.childNodes){
			if (startParent.childNodes[i]==obj.values.startNode) {
				startCount = i;
				break;
			}
		}
		
		//check for other text annotations
		var tAnnos=YAHOO.util.Dom.getElementsByClassName("annoMarker", 'span', startParent);
		var absolute=0;
		for(i=0;i<startCount;i++){
			node=startParent.childNodes[i];
			for(c in tAnnos){
				if(tAnnos[c]==node){
					absolute+=1;
				}
			}
		}
		
		var absStart=startCount-absolute;
		
		for (i in endParent.childNodes){
			if (endParent.childNodes[i]==obj.values.endNode) {
				endCount = i;
				break;
			} 
		}
		
		//check for other text annotations
		tAnnos=YAHOO.util.Dom.getElementsByClassName("annoMarker", 'span', endParent);
		absolute=0;
		for(i=0;i<endCount;i++){
			node=endParent.childNodes[i];
			for(c in tAnnos){
				if(tAnnos[c]==node){
					absolute+=1;
				}
			}
		}
		
		var absEnd=endCount-absolute;
		
		var offset1=obj.values.startValue;
		var offset2=obj.values.endValue;
		
		var docId=obj.values.documentId;
		
		
		var prefix = obj.values.set+"_"+docId+"_"+obj.values.page+"_";
		
		var params='?type=text&text='+obj.textInput.value+'&doc='+docId+'&node1='+startParent.id+'&startCount='+startCount+'&node2='+endParent.id+'&endCount='+endCount+'&absStart='+absStart+'&absEnd='+absEnd+'&startValue='+offset1+
'&endValue='+offset2+'&page='+obj.values.page+'&panel='+obj.values.panel+'&set='+obj.values.set;
			
		var sUrl = './lib/Annotation/saveAnno.php'+params;
		
		var callback = {
			success: function(o){
				o.argument.panel.createTextAnno(o);
			},
			failure: function(o){
				alert("bad");
			}
			,
			argument: {endNode: endNode, offset2: offset2, panel: args}
			
		}
		
		var request = YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);

		
		
	
	
	} else {
		//image annotation
		var recObj=obj.values.recObj;
		
		var width=parseInt(YAHOO.util.Dom.getStyle(recObj.HTML, 'width'));
		var height=parseInt(YAHOO.util.Dom.getStyle(recObj.HTML, 'height'));
		var left=parseInt(YAHOO.util.Dom.getStyle(recObj.HTML, 'left'));
		var top=parseInt(YAHOO.util.Dom.getStyle(recObj.HTML, 'top'));
		var coords=left+','+top+','+height+','+width;
		var link=obj.values.link;
		var text=obj.textInput.value;
		
		var page = obj.values.page;
		var panel = obj.values.panel;
		var docId=obj.values.documentId;
		var set=obj.values.set;
		var params='./lib/Annotation/saveAnno.php?type=image&text='+text+'&link='+link+'&page='+obj.values.page+'&coords='+coords+'&panel='+panel+'&doc='+docId+'&set='+set;
		var callback={
			success: function(o){
				
				var obj=o.argument.obj;
				obj.createImprint(obj.textInput.value, obj.values.recObj, obj);
			},
			failure: function(o){},
			argument: {obj: obj}
		};
		YAHOO.util.Connect.asyncRequest('GET', params, callback, null);
		//args.ajaxFire.fire({file: './lib/Annotation/saveAnno.php', params: params, method: 'GET'});

		//obj.createImprint(text, recObj, obj);

	}
}
/***
 * 	Create Annotation object
 * 	and display it
 * @param {Object} e
 * @param {Object} pass
 * @param {Object} args
 */
Archie.panel.prototype.displayTextAnno=function(e, pass, args){

	if ((pass[0].text != '')&&(args.properties['annoName'])) {	
		
		pass[0].type='text';
		pass[0].page=args.curPage;
		pass[0].panel=args.id;
		pass[0].documentId=args.documentId;
		pass[0].set=args.properties['annoName'];
	
		//create annotation object
		anno = new Annotation(pass[0]);
		
		//math to figure out correct mouse location
		var mousex=pass[0].mousex;
		var mousey=pass[0].mousey;
		var left=mousex+20;
		var top=mousey;
		
		//attach to body at mouse location
		args.HTML.parentNode.appendChild(anno.HTML);
		anno.ajaxCall.subscribe(args.ajaxCall, args);
		anno.saveAnnoCall.subscribe(args.saveAnnoToDB, args);
		//locate annotation object to correct spot
		YAHOO.util.Dom.setStyle(anno.HTML, 'left', left+'px');
		YAHOO.util.Dom.setStyle(anno.HTML, 'top', top+'px');
		//set above everything
		YAHOO.util.Dom.setStyle(anno.HTML, 'z-index', 45);
		
	}
}

Archie.panel.prototype.capture=function(e, pass, args) {
		recObj=pass[0].rectangle;
	
		cropBox = new CropBox({path: args.image.HTML.src,
			srcx: YAHOO.util.Dom.getStyle(recObj.HTML, "left"),
			srcy: YAHOO.util.Dom.getStyle(recObj.HTML, "top"),
			srcw: YAHOO.util.Dom.getStyle(recObj.HTML, "width"),
			srch: YAHOO.util.Dom.getStyle(recObj.HTML, "height"),
			imgw: args.image.HTML.width,
			imgh: args.image.HTML.height
			});
		args.HTML.parentNode.appendChild(cropBox.HTML);
		cropBox.cropAjaxCall.subscribe(args.ajaxCall, args);
	
}
Archie.panel.prototype.drawBox = function(e,args){
	if(args.shapeType=="box") { //reclicking the button to turn off tagger	
		args.shapeType = "off";

	} else {
		args.shapeType = "box";
		desktop.objects[this.id].image.src = "images/icon_rectangle_selected.png";
		desktop.objects[this.previousSibling.id].image.src = "images/icon_polygon.png";
	}
		
	}

Archie.panel.prototype.drawPoly = function(e,args){
	if (args.shapeType == "poly") { //reclicking the button to turn off tagger
		args.shapeType = "off";
		
		if (args.curArea) {
			args.areas.push(args.curArea);
		}
		
	}
	else {
		args.shapeType = "poly";
		args.curArea=new Area();
	}
}
Archie.panel.prototype.createShape=function(e, pass, args){
	
	switch(args.shapeType){
		
		case "annoBox":
			if (!args.properties['annoName'] == '') {
				
				mousex = parseInt(pass.mousex) - YAHOO.util.Dom.getX(args.content.HTML) - 20;
				mousey = parseInt(pass.mousey) - YAHOO.util.Dom.getY(args.content.HTML) - 20;
				box = new ImageRegion([mousex, mousey, 40, 40], false);
				
				//box.regionClick.subscribe(args.capture, args);
				
				pass.obj.parentNode.appendChild(box.HTML);
				args.boxes.push(box);
				
				//create annotation for box
				//not able to save - data left out
				anno = new Annotation({
					text: box.HTML.id,
					panel: args.id,
					page: args.curPage,
					recObj: box,
					link: args.image.HTML.src,
					documentId: args.documentId,
					set: args.properties['annoName']
				});
				args.HTML.parentNode.appendChild(anno.HTML);
				box.regionClick.subscribe(anno.leaveImprint, anno);
				anno.saveAnnoCall.subscribe(args.saveAnnoToDB, args);
				anno.ajaxCall.subscribe(args.ajaxCall, args);
				
				YAHOO.util.Dom.setStyle(anno.HTML, 'z-index', '45');
				var left = (parseInt(YAHOO.util.Dom.getStyle(box.HTML, 'left'))) + (parseInt(YAHOO.util.Dom.getStyle(box.HTML, 'width')) + (YAHOO.util.Dom.getX(args.content.HTML)) + 10);
				var top = (parseInt(YAHOO.util.Dom.getStyle(box.HTML, 'top'))) + (parseInt(YAHOO.util.Dom.getY(args.content.HTML))) - (parseInt(YAHOO.util.Dom.getStyle(box.HTML, 'height')));
				YAHOO.util.Dom.setStyle(anno.HTML, 'left', left + 'px');
				YAHOO.util.Dom.setStyle(anno.HTML, 'top', top + 'px');
				box.regionClick.subscribe(anno.remoteDestroy, anno);
				
				//reset shapetype
				args.shapeType = 'off';
			}
			break;
			
		case "box":
			if(args.curArea){
				//args.image.imageClicked.unsubscribe(args.curArea.createNode, args.curArea);
			}
			mousex=parseInt(pass.mousex)-YAHOO.util.Dom.getX(args.content.HTML)-20;
			mousey=parseInt(pass.mousey)-YAHOO.util.Dom.getY(args.content.HTML)-20;
			box=new ImageRegion([mousex, mousey, 40, 40], false);
			
			box.regionClick.subscribe(args.capture, args);
			
			pass.obj.parentNode.appendChild(box.HTML);
			args.boxes.push(box);
			
			//reset shaptype
			args.shapeType='off';
			break;	
			

	}
}



Archie.panel.prototype.setUpPage=function(panel){
	
	var projLimit=(panel.properties["projView"]) ? panel.properties["projView"] : 'none';
	if (panel.mode == 'image') {
		var params = './lib/Annotation/retrieveAnno.php?type=image&doc=' + panel.documentId + '&page=' + panel.curPage+'&proj='+projLimit+'&set='+panel.properties['annoName'];
		var callback={
			success: function(o){
				var panel=o.argument.obj;
				panel.setUpAnno(panel, o.responseText);
			},
			failure: function(o){
				alert('Notes could not be loaded. Check your connection.');
			},
			argument: {obj: panel}
		};
		YAHOO.util.Connect.asyncRequest('GET', params, callback, null);
		
	} else if(panel.mode=='text'){
	//	var params = '?type=text&doc=' + panel.documentId + '&page=' + panel.curPage+'&proj='+projLimit+'&set='+panel.properties['annoName'];
		var params = '?type=text&doc=' + panel.documentId + '&page=' + panel.curPage+'&set='+panel.properties['annoName'];
	
	
		var sUrl = './lib/Annotation/retrieveAnno.php'+params;
		
		var callback = {
			success: function(o){
				annosOnPage = o.responseText;
				
				o.argument.panel.markAnnos(o);
			
			},
			failure: function(o){
				alert("Notes could not be loaded.  Check your connection.");
			}
			,
			argument: {panel: panel}
			
		}
		
		var request = YAHOO.util.Connect.asyncRequest('GET', sUrl, callback);

		
	}
}
	Archie.panel.prototype.clearPage=function(obj){
	for(i in obj.areas){
		obj.areas[i].destroyNodes.fire();
	}
	for(i in obj.boxes){
		obj.boxes[i].destroy("click", "", obj.boxes[i]);
		
	}
	obj.areas.length=0;
	obj.boxes.length=0;
}