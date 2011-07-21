/****
 * LabelBox.js
 * 
 * For creating a movable, resizable
 * box that can be saved to the database,
 * and has editable text
 * 
 * Users can change background color
 * and Font
 */
LabelBox=function(values){
	this.values=values;
	this.DOM=document.createElement("div");
	
	if(this.values){
		this.DOM.id="labelBox_"+this.values[0].replace("labelBox_","");
	} else {
		YAHOO.util.Dom.generateId(this.DOM, 'labelBox_');
	}
	this.id=this.DOM.id;
	this.DOM.className="labelBox_window";
	this.body=document.createElement("div");
	YAHOO.util.Dom.generateId(this.body, 'labelBox_body');
	this.body.className="labelBox_body";
	this.DOM.appendChild(this.body);
	
	//Header
	this.header=document.createElement("div");
	this.header.className="labelHeader";
	YAHOO.util.Dom.generateId(this.header, 'header');
	this.body.appendChild(this.header);
	YAHOO.util.Dom.setStyle(this.header,'display','none');
	//Header Buttons
 	this.headerClose=document.createElement("div");
	this.headerClose.className = "labelBox_close";
	this.headerClose.appendChild(document.createTextNode("Delete"));
	//hide header 
	
	
	this.header.appendChild(this.headerClose);
	YAHOO.util.Event.addListener(this.headerClose, "click", this.closeDiv, this);

	this.labelNote=document.createElement("textarea");
	YAHOO.util.Dom.generateId(this.labelNote,'labelNote');
	this.labelNote.className="labelNote_textarea";
	this.labelNote.disabled=false;
	this.labelNote.focus=true;
	this.body.appendChild(this.labelNote);
	YAHOO.util.Dom.setStyle(this.labelNote,'width',YAHOO.util.Dom.getStyle(this.DOM,'width'));//still needs this
	//editing elements
	this.cancelEdit=document.createElement("a");
	this.cancelEdit.className="labelBox_button";
	YAHOO.util.Dom.generateId(this.cancelEdit,'ce_');
	this.cancelEdit.appendChild(document.createTextNode("Cancel"));
	YAHOO.util.Dom.setStyle(this.cancelEdit,'display','none');
	this.header.appendChild(this.cancelEdit);
	
	this.saveEdit=document.createElement("a");
	this.saveEdit.className="labelBox_button";
	YAHOO.util.Dom.generateId(this.saveEdit,'sav_');
	this.saveEdit.appendChild(document.createTextNode("Save"));
	YAHOO.util.Dom.setStyle(this.saveEdit,'display','none');
	this.header.appendChild(this.saveEdit);
	
	this.sParams="";
	this.prevEdit="";
	this.objClosed=new YAHOO.util.CustomEvent("objClosed");
	//YAHOO.util.Event.addListener(this.DOM.id,'mousedown',this.changevisible,this);
	YAHOO.util.Event.addListener(this.labelNote.id,'click',this.enterEdit,this);
	YAHOO.util.Event.addListener(this.cancelEdit.id,'click',this.exitEdit,this);
	YAHOO.util.Event.addListener(this.saveEdit.id,'click',this.keepChange,this);
	YAHOO.util.Event.addListener(this.DOM.id,'mouseover',this.showHeader,this);
	YAHOO.util.Event.addListener(this.DOM.id,'mousemove',this.showHeader,this);
	YAHOO.util.Event.addListener(this.DOM.id,'mouseout',this.hideHeader,this);
	YAHOO.util.Event.onAvailable(this.DOM.id, this.handleAvailable, this);
}
LabelBox.prototype={
	closeDiv:function(e, obj){
		var state=YAHOO.util.Dom.getStyle(obj.DOM, 'display');
		if(state=='block'){
			obj.DOM.parentNode.removeChild(obj.DOM);
		}
		obj.objClosed.fire(obj);
	},
	showHeader:function(e,obj){
		YAHOO.util.Dom.setStyle(obj.header,'display','block');
	},
	hideHeader:function(e,obj){
		YAHOO.util.Dom.setStyle(obj.header,'display','none');
	},
	handleAvailable:function(obj){
		YAHOO.util.Dom.setStyle(obj.DOM,'z-index','990');
		obj.resize=new YAHOO.util.Resize(obj.id,{
			proxy:true,
			status:false,
			minWidth:100,
			minHeight:100
		});
		YAHOO.util.Dom.setStyle(obj.DOM,'position','absolute');//needs this for resize
		obj.dragged=new YAHOO.util.DDProxy(obj.id);
		obj.dragged.on('endDragEvent',function(e,obj){
			
			YAHOO.util.Dom.setStyle(obj.DOM,'z-index','1000');
			var xconstrain = parseInt(YAHOO.util.Dom.getStyle(obj.DOM, 'left')) - parseInt(YAHOO.util.Dom.getX(obj.DOM));
			var yconstrain = parseInt(YAHOO.util.Dom.getStyle(obj.DOM, 'top')) - parseInt(YAHOO.util.Dom.getY(obj.DOM));
			obj.dragged.resetConstraints();
			obj.dragged.setXConstraint(parseInt(YAHOO.util.Dom.getX(obj.DOM))-xconstrain, (4000-parseInt(YAHOO.util.Dom.getX(obj.DOM))));
			obj.dragged.setYConstraint(parseInt(YAHOO.util.Dom.getY(obj.DOM))-80, (4000-parseInt(YAHOO.util.Dom.getY(obj.DOM))));		
		},obj);
		obj.resize.on("resize",function(e,obj){
			var width=parseInt(YAHOO.util.Dom.getStyle(obj.DOM,'width'));
			var height=parseInt(YAHOO.util.Dom.getStyle(obj.DOM,'height'));
			YAHOO.util.Dom.setStyle(obj.body,'width',width+'px');
			YAHOO.util.Dom.setStyle(obj.body,'height',height+'px');
			YAHOO.util.Dom.setStyle(obj.labelNote,'width',width+'px');
			YAHOO.util.Dom.setStyle(obj.labelNote,'height',height+'px');
		},obj);
		if(obj.values){
			obj.labelNote.value=obj.values[3].replace(/\//g,'');
			YAHOO.util.Dom.setStyle(obj.DOM,'width',parseInt(obj.values[4])+'px');
			YAHOO.util.Dom.setStyle(obj.DOM,'height',parseInt(obj.values[5])+'px');
			YAHOO.util.Dom.setStyle(obj.body,'width',parseInt(obj.values[4])+'px');
			YAHOO.util.Dom.setStyle(obj.body,'height',parseInt(obj.values[5])+'px');
			YAHOO.util.Dom.setStyle(obj.labelNote,'width',parseInt(obj.values[4])+'px');
			if(obj.values[5]==0){
				obj.values[5]=65;
			}
			YAHOO.util.Dom.setStyle(obj.labelNote,'height',parseInt(obj.values[5])+'px');
			//set coords
			if(YAHOO.util.Dom.setX(obj.DOM,parseInt(obj.values[1]))){ //if display none, returns false
				YAHOO.util.Dom.setY(obj.DOM, parseInt(obj.values[2]));
			} else {
				YAHOO.util.Dom.setStyle(obj.DOM,'left',obj.values[1]+'px');
				YAHOO.util.Dom.setStyle(obj.DOM,'top',(parseInt(obj.values[2]))+'px');
			}
			/*
if (YAHOO.env.ua.ie > 0) {
				YAHOO.util.Dom.setX(obj.DOM, parseInt(obj.values[1]));
				YAHOO.util.Dom.setY(obj.DOM, parseInt(obj.values[2]));
			} else {
				
				YAHOO.util.Dom.setStyle(obj.DOM,'left',obj.values[1]+'px');
				YAHOO.util.Dom.setStyle(obj.DOM,'top',(parseInt(obj.values[2])-80)+'px');
			}
*/
		}
	},
	enterEdit:function(e,obj){
		if (obj.dragged) {
			obj.dragged.lock();
		}
		obj.prevEdit=(obj.labelNote.value)?obj.labelNote.value:"";
		//YAHOO.util.Dom.setStyle(obj.header,'display','block');
		YAHOO.util.Dom.setStyle(obj.headerClose,'display','none');
		YAHOO.util.Dom.setStyle(obj.cancelEdit,'display','block');
		YAHOO.util.Dom.setStyle(obj.saveEdit,'display','block');
		
		YAHOO.util.Event.removeListener(obj.DOM.id,'mouseover',obj.showHeader);
		YAHOO.util.Event.removeListener(obj.DOM.id,'mousemove',obj.showHeader);
		YAHOO.util.Event.removeListener(obj.DOM.id,'mouseout',obj.hideHeader);
		obj.showHeader(null,obj);
		
	},
	exitEdit:function(e,obj){
		obj.dragged.unlock();
		obj.labelNote.value=obj.prevEdit;
		//YAHOO.util.Dom.setStyle(obj.header,'display','none');
		YAHOO.util.Dom.setStyle(obj.headerClose,'display','block');
		YAHOO.util.Dom.setStyle(obj.cancelEdit,'display','none');
		YAHOO.util.Dom.setStyle(obj.saveEdit,'display','none');
		YAHOO.util.Event.addListener(obj.DOM.id,'mouseover',obj.showHeader,obj);
		YAHOO.util.Event.addListener(obj.DOM.id,'mousemove',obj.showHeader,obj);
		YAHOO.util.Event.addListener(obj.DOM.id,'mouseout',obj.hideHeader,obj);
	},
	showHeader:function(e,obj){
		YAHOO.util.Dom.setStyle(obj.header,'display','block');
		YAHOO.util.Dom.setStyle(obj.DOM,'z-index','990');
	},
	hideHeader:function(e,obj){
		YAHOO.util.Dom.setStyle(obj.header,'display','none');
		//YAHOO.util.Dom.setStyle(obj.DOM,'z-index','-1');
	},
	keepChange:function(e,obj){
		obj.dragged.unlock();
		YAHOO.util.Dom.setStyle(obj.header,'display','none');
		YAHOO.util.Dom.setStyle(obj.headerClose,'display','block');
		YAHOO.util.Dom.setStyle(obj.cancelEdit,'display','none');
		YAHOO.util.Dom.setStyle(obj.saveEdit,'display','none');
		var x,y=0;
		if(YAHOO.util.Dom.getX(obj.DOM)){
			x=YAHOO.util.Dom.getX(obj.DOM);
			y=YAHOO.util.Dom.getY(obj.DOM)-100;
		} else {
			x=parseInt(YAHOO.util.Dom.getStyle(obj.DOM,'left'));
			y=parseInt(YAHOO.util.Dom.getStyle(obj.DOM,'top'));
		}
		
		var h=parseInt(YAHOO.util.Dom.getStyle(obj.DOM,'height'));
		if(h==0){
			h=65;
		}
		//update or create params
		obj.sParams="&id="+obj.DOM.id+"&x="+x+"&y="+y+"&text="+obj.labelNote.value+"&width="+parseInt(YAHOO.util.Dom.getStyle(obj.DOM,'width'))+"&height="+h;
	},
	changevisible:function(e,obj){
		YAHOO.util.Dom.setStyle(obj.DOM,'z-index','990');
	}
}