/***
 * InfoPopUp.js
 * 
 * Create div that displays
 * relevant information for 
 * annotations, messages, etc.
 * 
 * annoId: Database Unique Id of annotation
 * text: Text of the annotation
 * editLock: whether or not the user is allowed to edit this annotation
 * mode: Image/Text
 */
 InfoPopUp=function(annoId, text, editLock, mode){
 	this.annoId=annoId;
	this.mode=mode;
	this.AnnoText=text;
 	//this.id=YAHOO.util.Dom.generateId(this, 'info');
	this.DOM=document.createElement('div');
	//this.DOM.id=this.id;
	YAHOO.util.Dom.generateId(this.DOM,'info');
	this.DOM.className='infoPopUp';
	this.id=this.DOM.id;
	YAHOO.util.Dom.setStyle(this.DOM, 'display', 'none');
	this.deleteFootnote=new YAHOO.util.CustomEvent('deleteFootnote');
	
	this.editLock=editLock;
	//Content
	this.content=document.createElement("div");
	this.content.className="infoWin";
	YAHOO.util.Dom.generateId(this.DOM, "annoteCT");
	
	//Header
	this.header=document.createElement("div");
	this.header.className="infoHeader";
	this.header.id=YAHOO.util.Dom.generateId(this.header, 'header');
	this.content.appendChild(this.header);
	
	//Header Buttons
 	this.headerClose=document.createElement("a");
	this.headerClose.className = "annoButton";
	this.headerClose.appendChild(document.createTextNode("Close"));
	this.header.appendChild(this.headerClose);
	
	//text area surrounded by div
	this.text=document.createElement("div");
	this.text.className="infoText";
	
	this.textInput=document.createElement("textarea");
	YAHOO.util.Dom.generateId(this.textInput,"text");
	this.textInput.className="infoInputText";
	this.textInput.disabled=true;
	this.textInput.value=text;
	this.textInput.rows="20";
	this.textInput.cols="2";
	this.textInput.focus=true;
	
	this.notifyEdit=new YAHOO.util.CustomEvent("notifyEdit");
	
	this.content.appendChild(this.textInput);
	this.DOM.appendChild(this.content);
	if (this.editLock) {
	
		this.delButton = document.createElement('span');
		YAHOO.util.Dom.generateId(this.delButton, 'del');
		this.delButton.className = "annoButton";
		this.delButton.appendChild(document.createTextNode('Delete'));
		this.header.appendChild(this.delButton);
		
		this.editButton=document.createElement('span');
		YAHOO.util.Dom.generateId(this.editButton, 'edit');
		this.editButton.className="annoButton";
		this.editButton.appendChild(document.createTextNode('Edit'));
		this.header.appendChild(this.editButton);
	
		//Edit buttons appear after clicking Edit
		this.editOk=document.createElement("span");
		this.editOk.className="annoButton";
		this.editOk.appendChild(document.createTextNode('Change'));
		this.editCancel=document.createElement('span');
		this.editCancel.className='annoButton';
		this.editCancel.appendChild(document.createTextNode('Cancel'));
		
		YAHOO.util.Event.addListener(this.editButton.id,'click',this.editThisEl,this);	
		YAHOO.util.Event.addListener(this.editOk, 'click', function(e, obj){
			YAHOO.util.Event.stopEvent(e);
			var callback={
				success: function(o){
					obj=o.argument.obj;
					obj.text=obj.textInput.value;
					obj.textInput.disabled=true;
					obj.editHide("",obj);
				},
				failure: function(o){alert('Edit Failure');},
				argument: {obj: obj}
			}
			var sUrl="./lib/Annotation/changeAnnoText.php?mode="+obj.mode+"&text="+obj.textInput.value+"&id="+obj.annoId;
			var transact=YAHOO.util.Connect.asyncRequest('GET', sUrl, callback, null);
		}, this);
		
		YAHOO.util.Event.addListener(this.editCancel, 'click', this.editHide, this);
		
		YAHOO.util.Event.addListener(this.delButton.id, 'click', function(e, obj){
			obj.deleteFootnote.fire(obj);
		}, this);
	}
	
	YAHOO.util.Event.addListener(this.headerClose, 'click', this.hide, this);
	
 }
 InfoPopUp.prototype.move=function(e,pass,args){
 	box=pass[0];
	ipu=args[0];
	pc=args[1];
	
	var pcX=parseInt(YAHOO.util.Dom.getStyle(pc.DOM,'width'));
	var pcY=parseInt(YAHOO.util.Dom.getStyle(pc.DOM,'height'));
	//var pcTopRight=YAHOO.util.Dom.getX(pc.DOM)+pcX;
	if(pcX<YAHOO.util.Dom.getX(box.DOM)){
		x=YAHOO.util.Dom.getX(box.DOM)-(parseInt(YAHOO.util.Dom.getStyle(ipu.DOM,'width'))-10);
	} else {
		x=YAHOO.util.Dom.getX(box.DOM)+(parseInt(YAHOO.util.Dom.getStyle(box.DOM,'width'))+10);
	}
	if(pcY<YAHOO.util.Dom.getY(box.DOM)){
		y=YAHOO.util.Dom.getY(box.DOM)-(parseInt(YAHOO.util.Dom.getStyle(ipu.DOM,'height')));
	} else {
		y=YAHOO.util.Dom.getY(box.DOM);
	}
	YAHOO.util.Dom.setX(ipu.DOM,x);
	YAHOO.util.Dom.setY(ipu.DOM,y);
 }
 /**
  * Called after clicking Edit
  * @param {Object} e
  * @param {Object} obj
  */
 InfoPopUp.prototype.editThisEl=function(e,obj){
 	YAHOO.util.Event.stopEvent(e);
 	obj.textInput.disabled=false;//textInput can have text entered into it
 	obj.notifyEdit.fire("lock");
	if(obj.header.firstChild){
		temp=obj.header.firstChild;
		while(temp.nextSibling){
			el=temp.nextSibling;
			obj.header.removeChild(el);
			
		}
		obj.header.removeChild(obj.header.firstChild);
	}
	
	obj.header.appendChild(obj.editOk);
	obj.header.appendChild(obj.editCancel);
 }
 
 /**
  * Handles EditCancel action
  * @param {Object} obj
  */
 InfoPopUp.prototype.editHide=function(e,obj){
 	YAHOO.util.Event.stopEvent(e);
 	obj.textInput.disabled=true; //cant type in box anymore
 	obj.notifyEdit.fire("unlock");
 	if(obj.header.firstChild){
		temp=obj.header.firstChild;
		while(temp.nextSibling){
			el=temp.nextSibling;
			obj.header.removeChild(el);
		}
		obj.header.removeChild(obj.header.firstChild);
	}
	obj.header.appendChild(obj.headerClose);
	
	obj.header.appendChild(obj.delButton);
	obj.header.appendChild(obj.editButton);
 }
 
 /***
  * Leave numbered footnote
  */
 /*
InfoPopUp.prototype.leaveFootnote=function(obj, node1, node2, offset1, offset2, quote, args){
 	
	// Where the red number is generated
	
	var fNum=(YAHOO.util.Dom.getElementsByClassName('infoFootnote').length)+1;
	
	if (!(node1 == null) && !(node2 == null)) {
		
		args.text='"'+quote+'"'+args.text;
		args.textNode.innerHTML="";
		args.textNode.appendChild(document.createTextNode(args.AnnoText));
		
		var start=0;
		var full="";
		if (!(node1.id == node2.id)) {
			words = quote.split(' ');
			
			var endLine = words[words.length - 1];
			
			start = (node2.nodeName == '#text') ? node2.nodeValue.search(endLine) : node2.innerHTML.search(endLine);
			full = (node2.nodeName == '#text') ? node2.nodeValue : node2.innerHTML;
			
				
			while ((start == -1)) {
				
				node2 = (node2.nextSibling) ? node2.nextSibling : node2.previousSibling;
				
				start = (node2.nodeName == '#text') ? node2.nodeValue.search(endLine) : node2.innerHTML.search(endLine);
				full = (node2.nodeName == '#text') ? node2.nodeValue : node2.innerHTML;
				
			}
			
			var begin = full.substring(0, (start+endLine.length));
			
			var last = full.substring((start+endLine.length));
			var nstring = begin + '<span class=\'infoFootnote\'>'+fNum+'</span>'+last;
			
			temp=document.createElement(node2.nodeName);
			temp.id=node2.id;
			temp.className=temp.className;
			temp.innerHTML=nstring;
			node2.parentNode.insertBefore(temp, node2);
			node2.parentNode.removeChild(node2);
			YAHOO.util.Event.addListener(temp, 'click', function(e, args){
			
				args.DOM.style.display = (args.DOM.style.display == 'none') ? 'block' : 'none';
				
			}, args);
		}
		else {
			var words = quote.split(' ');
			
			//node1=node1.firstChild;
			start = (node1.nodeName == "#text") ? node1.nodeValue.search(quote) : node1.innerHTML.search(quote);
			var full = (node1.nodeName == "#text") ? node1.nodeValue : node1.innerHTML;
			while ((start == -1) && ((full.substring(start, (start+5)).search('-'))==-1)) {
			
				node1 = (node1.nextSibling) ? node1.nextSibling : node1.parentNode.nextSibling;
				if (node1.nodeName == "#text") {
					start = node1.nodeValue.search(quote);
					full = node1.nodeValue;
				}
				else {
					start = node1.innerHTML.search(quote);
					full = node1.innerHTML;
				}
				
				
			}
			
			start += quote.length;
			var begin = full.substring(0, start);
			var last = full.substring(start);
			var nstring = begin + "<span class=\"infoFootnote\">"+fNum+"</span>" + last;
			
			
			temp = document.createElement(node1.nodeName);
			
			temp.id = node1.id;
			
			temp.className = node1.className;
			
			temp.innerHTML = nstring;
			
			node1.parentNode.insertBefore(temp, node1);
			node1.parentNode.removeChild(node1);
			
			
			YAHOO.util.Event.addListener(temp, 'click', function(e, args){
			
				args.DOM.style.display = (args.DOM.style.display == 'none') ? 'block' : 'none';
				
			}, args);
			
		}
	}
 }
*/
 
 
 /***
  * Create shadow line
  *  Highlight footnote region
  *  Deprecated for now
  * Input: 
  * @param {Object} obj
  * @param {Object} node1
  * @param {Object} node2
  * @param {Object} args
  * 
  * Output:
  * Span element
  * Div element
  */
/*
InfoPopUp.prototype.createShadow=function(obj, node1, node2, offset1, offset2, quote, args){
	
	var redSpan=document.createElement('span');
	redSpan.id='redSpan';

	
	if(!(node1==null) && !(node2==null)){
		var ellipse=quote.indexOf('...');
		if(!(node1.id == node2.id)){
			
			var valid=(ellipse >0) ? quote.substring(0, (ellipse-1)) : quote;
			var start=node1.innerHTML.indexOf(valid);
			
			var text1=node1.innerHTML.substring(start);
			
			var valid2=(ellipse>0) ? quote.substring(ellipse+4) : quote.substring(quote.length-10);
			var end=node2.innerHTML.indexOf(valid2);
			var text2=node2.innerHTML.substring(0, end);
			//var quote=text1.concat(text2);
			//wrap content
			
			var replace="<span id='redSpan'>"+text1+'</span>';
			//re-insert
			var quote1 = node1.innerHTML.replace(text1, replace);
			
			replace="<span id='redSpan'>"+text2+'</span>';
			var quote2 = node2.innerHTML.replace(text2, replace);
			
			node1.innerHTML=quote1;
			node2.innerHTML=quote2;
			
			YAHOO.util.Event.addListener(node1, 'click', function(e, args){
				args.DOM.style.display=(args.DOM.style.display=='none') ? 'block' : 'none';
			}, 
			args);
			YAHOO.util.Event.addListener(node2, 'click', function(e, args){
				args.DOM.style.display=(args.DOM.style.display=='none') ? 'block' : 'none';
			}, 
			args);
		} else {
			
			var valid=(ellipse >0) ? quote.substring(0, 18) : quote;
			
			var start=node1.innerHTML.indexOf(valid);
			
			var text1=(start==0) ? valid:node1.innerHTML.substring(start);
			
			var valid2=quote.substring(ellipse);
			var end=node1.innerHTML.indexOf(valid2);
			
			var text1=node1.innerHTML.substring(start, end);
		
			
			var replace="<span id='redSpan'>"+text1+'</span>';
			
			var quote1=node1.innerHTML.replace(text1, replace);
			node1.innerHTML=quote1;
		
			YAHOO.util.Event.addListener(node1, 'click', function(e, args){
				args.DOM.style.display=(args.DOM.style.display=='none') ? 'block' : 'none';
			}, 
			args);
		}

		
		YAHOO.util.Dom.setStyle(args.DOM, 'left', YAHOO.util.Dom.getX(node1)+'px');
		YAHOO.util.Dom.setStyle(args.DOM, 'top', YAHOO.util.Dom.getY(node1)+'px');
		
		
		YAHOO.util.Dom.setStyle(args.DOM, 'display', 'none');
		obj.parentNode.appendChild(args.DOM);
	}
}
*/


/***
 * hide element
 * @param {Object} e
 * @param {Object} pass
 * @param {Object} args
 */
InfoPopUp.prototype.showWin=function(e, obj){
	//var state=YAHOO.util.Dom.getStyle(obj.DOM,'display');
	YAHOO.util.Dom.setStyle(obj.DOM, 'display', 'block');
}

/***
 * Hide element
 */
InfoPopUp.prototype.hide=function(e, args){
	YAHOO.util.Dom.setStyle(args.DOM, 'display', 'none');
	
}


