/***
 * Annotation.js
 * 
 * 
 */

 /****
  * Annotation:
  * Constructor Call for 
  * creating an annotation box
  * 
  * data: array of variables for 
  * populating the annotation space
  */
 Annotation = function(/*type,box*/){
 	this.DOM = document.createElement("div");
 	this.DOM.className = "anno";
 	YAHOO.util.Dom.generateId(this.DOM, "annote");
 	this.id = this.DOM.id;
 	//this.box=box;
 	this.values = null;
 	this.editLock = false;
 	//this.type = type;
 	//by default, publishes annotations
	//so that only user can see them
	this.annoId="default";
	this.annoName="default";
	this.publicMode='private';
 	this.setUpContent(this);	
	this.saveAnnoCall=new YAHOO.util.CustomEvent("saveAnnoCall");
	this.annoClosed = new YAHOO.util.CustomEvent("annoClosed");
	YAHOO.util.Event.onAvailable(this.DOM.id, this.makeDraggable, this);
	
 }
 Annotation.prototype.attachSelf=function(loc){
 	var x=YAHOO.util.Dom.getX(this.box.DOM)-parseInt(YAHOO.util.Dom.getStyle(this.DOM,'width'));
	var y=YAHOO.util.Dom.getY(this.box.DOM);
	
	loc.appendChild(this.DOM);
	
	/*
this.box.movedEvent.subscribe(this.moveWithBox,this);
	this.box.startMove.subscribe(this.hideAnno,this);
*/
 }
 Annotation.prototype.moveWithBox=function(e,pass,args){
 	var x=YAHOO.util.Dom.getX(args.box.DOM)-parseInt(YAHOO.util.Dom.getStyle(args.DOM,'width'));
	var y=YAHOO.util.Dom.getY(args.box.DOM);
	/*
YAHOO.util.Dom.setX(args.DOM,x);
	YAHOO.util.Dom.setY(args.DOM,y);
*/
	YAHOO.util.Dom.setStyle(args.DOM,'display','block');
 }
 /***
  * Set Content for annotation 
  * box
  * @param {Object} obj
  */
 Annotation.prototype.setUpContent=function(obj){
 	//Content
	
	obj.content=document.createElement("div");
	obj.content.className="annoWin";
	obj.content.id=YAHOO.util.Dom.generateId(obj.DOM, "annoteCT");
	
	//Header
	obj.header=document.createElement("div");
	obj.header.className="annoHeader";
	obj.header.id=YAHOO.util.Dom.generateId(obj.header, 'header');
	obj.content.appendChild(obj.header);
	
	//Header Buttons
 	obj.headerClose=document.createElement("a");
	obj.headerClose.className = "annoButton";
	obj.headerClose.appendChild(document.createTextNode("Close"));
	obj.header.appendChild(obj.headerClose);
	YAHOO.util.Event.addListener(obj.headerClose, "click", obj.destroy, obj);
	
	/*
obj.headerSave=document.createElement("a");
	obj.headerSave.className = "annoButton";
	obj.headerSave.appendChild(document.createTextNode("Save To:"));
	//obj.header.appendChild(obj.headerSave);
	YAHOO.util.Event.addListener(obj.headerSave, "click", obj.saveAnno, obj);
*/
	
	obj.saveSelectAnno=document.createElement("span");
	YAHOO.util.Dom.generateId(obj.saveSelectAnno);
	obj.saveSelectAnno.className="annoButton";
	obj.saveSelectAnno.appendChild(document.createTextNode("Save"));
	YAHOO.util.Event.addListener(obj.saveSelectAnno.id,'click',obj.saveAnno,obj);
	obj.headerClose.appendChild(obj.saveSelectAnno);
	
	obj.saveDropDown=document.createElement("select");
	YAHOO.util.Dom.generateId(obj.saveDropDown,'saveDown');
	obj.saveDropDown.className="annoSaveSelect";
	//obj.header.appendChild(obj.saveDropDown);
	obj.fillSaveDown(obj);
	
	obj.text=document.createElement("div");
	obj.text.id=YAHOO.util.Dom.generateId(obj.text, 'quote');
	obj.text.className="annoText";
	
	//Text Input
	obj.textInput=document.createElement("textarea");
	YAHOO.util.Dom.generateId(obj.textInput,"text");
	obj.textInput.className="annoTextArea";
	obj.textInput.rows="20";
	obj.textInput.cols="5";
	obj.content.appendChild(obj.textInput);
	//obj.textInput.disabled='disabled';
	//YAHOO.util.Event.addListener(obj.DOM.id,'click',function(e,obj){obj.textInput.disabled='false';alert(obj.textInput.disabled);},obj);
	
	//Public or private
	obj.saveField=document.createElement("div");
	YAHOO.util.Dom.generateId(obj.choiceField);
	obj.saveField.className="saveField";
	obj.content.appendChild(obj.saveField);
	obj.saveField.appendChild(obj.saveDropDown);
	obj.saveField.insertBefore(document.createTextNode("Save To: "),obj.saveDropDown);
	
	obj.saveField.appendChild(document.createElement("br"));
	obj.makePrivate=document.createElement("input");
	YAHOO.util.Dom.generateId(obj.makePrivate);
	obj.makePrivate.type="checkbox";
	obj.makePrivate.name="pubpriv";
	obj.makePrivate.checked=true;
	obj.saveField.appendChild(obj.makePrivate);
	obj.saveField.insertBefore(document.createTextNode('Private: '),obj.makePrivate);
	YAHOO.util.Event.addListener(obj.makePrivate.id,'click',function(e,obj){
		obj.publicMode=(obj.publicMode=='public')?'private':'public';
	},obj);
	
	obj.DOM.appendChild(obj.content);
	if (obj.type=="text") {
		obj.getData(obj);
	}else if(obj.box){
		//set near box
		left=YAHOO.util.Dom.getX(obj.box.DOM)+parseInt(YAHOO.util.Dom.getStyle(obj.DOM, 'width'))+10;
		top=YAHOO.util.Dom.getY(obj.box.DOM);
		YAHOO.util.Dom.setX(obj.DOM,left);
		YAHOO.util.Dom.setY(obj.DOM,top);
		//box.movedEvent.subscribe(obj.moveWithBox,obj);
	}
 }
 Annotation.prototype.hideAnno=function(e,pass,args){
 	YAHOO.util.Dom.setStyle(args.DOM,'display','none');
 }
 Annotation.prototype.annoSetSelected=function(e,args){
 	anno=args.anno;
	option=args.option;
	if(option.selected){
		//option was indeed selected
		anno.annoName=option.value;
		id=option.id;
		n=id.indexOf('--');
		anno.annoId=id.substring(0,n);
	}
 }
/***
 * Removes Annotation Object from DOM
 * @param {Object} e
 * @param {Object} obj
 */
Annotation.prototype.destroy=function(e, obj){
	
	obj.annoClosed.fire([this,this.box]);
	//obj.DOM.parentNode.removeChild(obj.DOM);
}
/**
 * fill up the savedropdown box
 */
Annotation.prototype.fillSaveDown=function(obj){
	
	sUrl="./lib/Annotation/annoSetNames.php";
	callback={
		success: function(o){
			text=o.responseText;
			obj=o.argument[0];
			if(obj.saveDropDown.firstChild){
				temp=obj.saveDropDown.firstChild;
				while(temp.nextSibling){
					obj.saveDropDown.removeChild(temp.nextSibling);
				}
				obj.saveDropDown.removeChild(temp);
			}
			if(!(text=="No sets created")){
				tArray=text.split("\n");
				var t=0;
				for(i in tArray){
					
						record = tArray[i].split('%');
					if (!(record[0] == "")) {
						option = document.createElement("option");
						YAHOO.util.Dom.generateId(option, record[0] + "--"); //id is id of anno set + _rand()
						option.value = record[1]; //name of anno set
						option.appendChild(document.createTextNode(record[1]));
						obj.saveDropDown.appendChild(option);
						YAHOO.util.Event.addListener(option.id, 'click', obj.annoSetSelected, {
							anno: obj,
							option: option
						});
						if(t==0){
							
							obj.annoName=option.value;
							id=option.id;
							n=id.indexOf('--');
							obj.annoId=id.substring(0,n);
							
						}
						t++;
					}
				}
			}
		},
		failure: function(o){
			
		},
		argument: [obj]
	}
	var transact=YAHOO.util.Connect.asyncRequest('GET',sUrl,callback);
}
/**
 * Destroy reference to box and unsubscribe listeners
 */
Annotation.prototype.clearBox=function(){
	
	this.box.movedEvent.unsubscribe(this.moveWithBox,this);
	this.box=null;
}
Annotation.prototype.remoteDestroy=function(e, pass, args){
	args.DOM.parentNode.removeChild(args.DOM);
}
 /***
  * receives data from selection
  * object
  */
 Annotation.prototype.getData=function(args){
 	
 	

	args.DOM.style.display='block';
	
	args.editLock=false;
	
 }
 
 

 /***
  * display values and allow for user
  * input
  */
 Annotation.prototype.showValue=function(obj){
 	obj.DOM.style.display='block';
	
	var textValue=obj.values.text;
	
	//obj.textValue=document.createTextNode(obj.values.text);
	if(parseInt(textValue.length)>40){
		//shorten text
		textValue = (textValue.substring(0,15) + '...') + (textValue.substring(30));
	}
	obj.text.innerHTML=textValue;
	
 }
 
 /***
  * Save data
  * 
  * Data to save:
  * 	relative location
  * 	value of textarea
  * 
  * @param {Object} obj
  */
 Annotation.prototype.saveAnno=function(e, obj){
 	//get data	
	YAHOO.util.Event.stopEvent(e);
	obj.saveAnnoCall.fire({obj:obj});
 }
 Annotation.prototype.closeOutBox=function(obj){
 	obj.draggableBox.lock();
	obj.resizeBox.destroy();
	
	YAHOO.util.Event.removeListener(obj.id, 'dblclick', obj.capture);
	
	
 }
 Annotation.prototype.createImprint=function(coords, args, obj, dbId, editLock){
 	
	args.DOM.className="annoImprint";
	YAHOO.util.Event.onAvailable(args.id, obj.closeOutBox, args);

	var text='';
	if(!(coords=='')){
		text=coords;
	} else {
		text = (obj.textInput.value) ? obj.textInput.value : "No Comment Made";
	}
	
	obj.infoBox = new InfoPopUp(dbId, text, editLock, 'image');
	YAHOO.util.Dom.setStyle(obj.infoBox.DOM, 'display', 'none');
	obj.infoBox.deleteFootnote.subscribe(obj.imageDelete, obj);
	args.DOM.parentNode.appendChild(obj.infoBox.DOM);
	
	obj.dbId=dbId;
	obj.values.recObj=args;
	//set infoBox commands 
	YAHOO.util.Event.addListener(args.DOM.id, "click", function(e, args){
		var infoBox=args.box;
		
		infoBox.DOM.style.display=(infoBox.DOM.style.display=='none') ? 'block' : 'none';
		YAHOO.util.Dom.setStyle(infoBox.DOM, 'left', '0px');
		YAHOO.util.Dom.setStyle(infoBox.DOM, 'top', '0px');
		
	}, {box: obj.infoBox});
	
	//obj.DOM.parentNode.removeChild(obj.DOM);
	

	
 }
 
 /***
  * Deletes image annotation record from database as well
  * as imprint
  * @param {Object} e
  * @param {Object} pass
  * @param {Object} args
  */
 Annotation.prototype.imageDelete=function(e, pass, args){
 	var box=pass[0];
	var callback={
		success: function(o){
			var box=o.argument.box;
			var obj=o.argument.obj;
			box.DOM.parentNode.removeChild(box.DOM);
			obj.values.recObj.DOM.parentNode.removeChild(obj.values.recObj.DOM);
			
		},
		failure: function(o){
			alert("Error");
		},
		argument: {box: box, obj: args} 
	}
	var transact=YAHOO.util.Connect.asyncRequest('GET','./lib/Annotation/deleteAnno.php?type=image&id='+args.dbId, callback, null);
 	
	
 }
 
 /***
  * Leave imprint of where 
  * Image Annotation was
  * 
  */
 Annotation.prototype.leaveImprint=function(e, pass, args){
 	recObj=pass[0].rectangle;
	
	//get coordinates
	/*
var width=parseInt(YAHOO.util.Dom.getStyle(recObj.DOM, 'width'));
	var height=parseInt(YAHOO.util.Dom.getStyle(recObj.DOM, 'height'));
	var left=parseInt(YAHOO.util.Dom.getStyle(recObj.DOM, 'left'));
	var top=parseInt(YAHOO.util.Dom.getStyle(recObj.DOM, 'top'));
	var coords=width+','+height+','+left+','+top+','+args.textInput.value;
*/
	var coords=args.textInput.value;
 	//create transparent box
	args.createImprint(coords, recObj, args);
	
	/*
recObj=pass[0].rectangle;
	trBox=document.createElement("div");
	trBox.className="annoImprint";
	trBox.id=YAHOO.util.Dom.generateId(trBox, 'annoimprint');
	
	recObj.DOM.parentNode.appendChild(trBox);
	
	//set coordinates
	YAHOO.util.Dom.setStyle(trBox, 'width', YAHOO.util.Dom.getStyle(recObj.DOM, 'width'));
	YAHOO.util.Dom.setStyle(trBox, 'height', YAHOO.util.Dom.getStyle(recObj.DOM, 'height'));
	YAHOO.util.Dom.setStyle(trBox, 'left', YAHOO.util.Dom.getStyle(recObj.DOM, 'left'));
	YAHOO.util.Dom.setStyle(trBox, 'top', YAHOO.util.Dom.getStyle(recObj.DOM, 'top'));
	
	//set infoBox commands 
	YAHOO.util.Event.addListener(trBox.id, "mouseover", function(e, args){
		var obj=args.anno;
		var box=args.box;
		
		obj.infoBox=document.createElement("div");
		obj.infoBox.className='annoInfoPopUp';
		obj.infoBox.innerHTML=(!(obj.textInput.value=='')) ? '<p>'+obj.textInput.value+'</p>' : '<p>No annotation made</p>';
		YAHOO.util.Dom.setStyle(obj.infoBox, 'left', parseInt(YAHOO.util.Dom.getStyle(box, 'left'))+100+'px');
		YAHOO.util.Dom.setStyle(obj.infoBox, 'top', YAHOO.util.Dom.getStyle(box, 'top'));
		box.parentNode.appendChild(obj.infoBox);
	}, {anno: args, box: trBox});
	
	YAHOO.util.Event.addListener(trBox.id, "mouseout", function(e, args){
		var obj=args.anno;
		var box=args.box;
		
		obj.infoBox.parentNode.removeChild(obj.infoBox);
	}, {anno: args, box: trBox});
 */
 }
 
 
 
 
/***
 * Private function for creating
 * draggable box
 * @param {Object} obj
 */
 Annotation.prototype.makeDraggable=function(obj){
 	
 	obj.dragAnno=new YAHOO.util.DD(obj.content.id);
	
	obj.dragAnno.setHandleElId(obj.header.id);
	
 }
