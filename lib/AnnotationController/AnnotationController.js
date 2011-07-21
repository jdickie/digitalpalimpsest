/**
 * Administration for Annotations
 */
 AnnoControl=function(){
 	this.DOM=document.createElement("div");
	YAHOO.util.Dom.generateId(this.DOM,"bd");
	this.DOM.className="ac_body";
	
	this.content=document.createElement("div");
	YAHOO.util.Dom.generateId(this.content,"ct");
	this.content.className="ac_content";
	this.content.appendChild(document.createTextNode("Pick one of the Annotation Sets, then Select Annotations to erase"));
	this.content.appendChild(document.createElement("br"));
	this.DOM.appendChild(this.content);
	//first list displays annotation sets
	this.list=document.createElement("div");
	YAHOO.util.Dom.generateId(this.list,'li');
	this.list.className="ac_list";
	this.content.appendChild(this.list);
	//second list displays individual annotations from selected
	//annotation set 
	this.secondlist=document.createElement("div");
	YAHOO.util.Dom.generateId(this.secondlist,'li');
	this.secondlist.className="ac_list2";
	this.content.appendChild(this.secondlist);
	//create buttons and functions for handling deletions
	this.erase=new YAHOO.util.CustomEvent('erase');
	this.selectall=new YAHOO.util.CustomEvent('selectall');
	
	this.eraseButton=document.createElement("span");
	YAHOO.util.Dom.generateId(this.eraseButton,'er');
	this.eraseButton.appendChild(document.createTextNode("Erase"));
	this.eraseButton.className="ac_button";
	this.content.insertBefore(this.eraseButton,this.secondlist);
	
	this.selectAllButton=document.createElement("span");
	YAHOO.util.Dom.generateId(this.selectAllButton,'er');
	this.selectAllButton.appendChild(document.createTextNode("Select All"));
	this.selectAllButton.className="ac_button";
	this.content.insertBefore(this.selectAllButton,this.secondlist);
	
	this.USButton=document.createElement("span");
	YAHOO.util.Dom.generateId(this.USButton,'er');
	this.USButton.appendChild(document.createTextNode("Unselect All"));
	this.USButton.className="ac_button";
	this.content.insertBefore(this.USButton,this.secondlist);
	
	YAHOO.util.Event.addListener(this.selectAllButton.id,'click',function(e,obj){
		obj.selectall.fire('check');
	},this);
	YAHOO.util.Event.addListener(this.USButton.id,'click',function(e,obj){
		obj.selectall.fire('uncheck');
	},this);
	YAHOO.util.Event.addListener(this.eraseButton.id,'click',function(e,obj){
		obj.erase.fire();
	},this);
	
	
	
	this.appendSelf();
	
 }
 AnnoControl.prototype={
 	appendSelf:function(){
		el=document.getElementById('main');
		el.appendChild(this.DOM);
		this.getSets();
	},
	getSets:function(){
		//find annotation sets and display in first list
		sUrl="./getSets.php";
		var callback={
			success:function(o){
				obj=o.argument[0];
				if(obj.list.firstChild){
					while(obj.list.firstChild.nextSibling){
						obj.list.removeChild(obj.list.firstChild.nextSibling);
					}
					obj.list.removeChild(obj.list.firstChild);
				}
				obj.erase.unsubscribeAll();
				obj.selectall.unsubscribeAll();
				response=o.responseText.split("\n");
				for(r in response){
					if (response[r].length > 1) {
						item = new SetItem(response[r].split('%'));
						item.selected.subscribe(obj.setSelected, obj);
						obj.list.appendChild(item.DOM);
					}
				}
				
			},
			failure:function(o){
				alert("Error in retrieving from database");
			},
			argument:[this]
		}	
		connect=YAHOO.util.Connect.asyncRequest('GET',sUrl,callback);
	},
	setSelected:function(e,pass,args){
		//send selected data to PHP script
		//get back list of annotations associated with set
		sUrl="./getAnnos.php?set="+pass[0].setid;
		callback={
			success:function(o){
				obj=o.argument[0];
				if(obj.secondlist.firstChild){
					while(obj.secondlist.firstChild.nextSibling){
						obj.secondlist.removeChild(obj.secondlist.firstChild.nextSibling);
					}
					obj.secondlist.removeChild(obj.secondlist.firstChild);
				}
				obj.erase.unsubscribeAll();
				obj.selectall.unsubscribeAll();
				items=o.responseText.split("\n");
				for(i in items){
					if (items[i].length > 1) {
						item = new AnnotationItem(items[i].split('%'));
						obj.secondlist.appendChild(item.DOM);
						obj.selectall.subscribe(item.autoSelect,item);
						obj.erase.subscribe(item.removeItem,item);
						item.deleteItem.subscribe(function(e, pass, args){
							
							args.secondlist.removeChild(pass[0].DOM);
						}, obj);
					}
				}
			},
			failure:function(o){
				alert("Error in retrieving from database");
			},
			argument:[args]
		}
		connect=YAHOO.util.Connect.asyncRequest('GET',sUrl,callback);
	}
 }
 /**
  * Object Div for displaying data about a particular
  * Annotation Set
  * @param {Object} data
  */
 SetItem=function(data){
 	this.DOM=document.createElement("div");
	YAHOO.util.Dom.generateId(this.DOM,'item');
	this.DOM.className="ac_item";
	
	this.content=document.createElement("span");
	YAHOO.util.Dom.generateId(this.content,'co');
	this.content.className="ac_item_data";
	this.DOM.appendChild(this.content);
	this.setid=data[1];
	
	this.content.appendChild(document.createTextNode("Username: "+data[2]));	
	this.content.appendChild(document.createElement("br"));
	this.content.appendChild(document.createTextNode("Set Name: "+data[3]));
	this.content.appendChild(document.createElement("br"));
	this.content.appendChild(document.createTextNode("Set Description: "+data[4]));
	this.content.appendChild(document.createElement("br"));
	this.content.appendChild(document.createTextNode("Security: "+data[5]));
	
	YAHOO.util.Event.addListener(this.DOM.id,'click',this.selectItem,this);
	
	//custom event for firing to AnnotationController
	this.selected=new YAHOO.util.CustomEvent("selected");
 }
 SetItem.prototype={
 	selectItem:function(e,obj){
		obj.selected.fire({setid: obj.setid});
	}
 }
 /**
  * Object Divs for displaying data about a particular 
  * Annotation
  * @param {Object} data
  */
AnnotationItem=function(data){
	this.DOM=document.createElement("div");
	YAHOO.util.Dom.generateId(this.DOM,'item');
	this.DOM.className="ac_item";
	
	this.content=document.createElement("span");
	YAHOO.util.Dom.generateId(this.content,'co');
	this.content.className="ac_item_data";
	this.DOM.appendChild(this.content);
	
	//set variables for sending to db
	this.annoid=data[0];
	
	this.content.appendChild(document.createTextNode("Content: "+data[1]));
	this.content.appendChild(document.createElement("br"));
	this.content.appendChild(document.createTextNode("Page: "+data[2]));
	this.content.appendChild(document.createElement("br"));
	this.content.appendChild(document.createTextNode("Annotation Set: "+data[3]));
	//user checks the box, then clicks on 'delete' from above secondlist
	this.check=document.createElement("input");
	YAHOO.util.Dom.generateId(this.check,'ch');
	this.check.type="checkbox";
	this.DOM.appendChild(this.check);
	
	//Custom Event for deleting the item 
	this.deleteItem=new YAHOO.util.CustomEvent("deleteItem");
	

}
AnnotationItem.prototype={
	removeItem:function(e,pass,obj){
		//is item selected?
		if (obj.check.checked) {
			//call database and erase annotation from table
			var url = './removeAnno.php?id=' + obj.annoid;
			callback = {
				success: function(o){
					obj = o.argument[0];
					obj.deleteItem.fire(obj);
				},
				failure: function(o){
					alert("Error connecting to Database");
				},
				argument: [obj]
			}
			connect = YAHOO.util.Connect.asyncRequest('GET', url, callback);
		}
	},
	autoSelect:function(e,pass,obj){
		//selected using the "select all" command
		//OR the "unselect all" command
		//sent by AnnoController
		obj.check.checked=(pass[0]=='check')?true:false;
	}
}
/**
 * Object for displaying most recent Annotations
 */
RecentAnno=function(){
	this.DOM=document.createElement("div");
	YAHOO.util.Dom.generateId(this.DOM,'bd');
	this.DOM.className="ac_body";
	
	this.content=document.createElement("div");
	YAHOO.util.Dom.generateId(this.content,'co');
	this.content.className="ac_content";
	this.content.appendChild(document.createTextNode("Most Recent Annotations Added:"));
	this.content.appendChild(document.createElement("br"));
	this.DOM.appendChild(this.content);
	
	this.erase=new YAHOO.util.CustomEvent('erase');
	this.selectall=new YAHOO.util.CustomEvent('selectall');
	
	this.eraseButton=document.createElement("span");
	YAHOO.util.Dom.generateId(this.eraseButton,'er');
	this.eraseButton.appendChild(document.createTextNode("Erase"));
	this.eraseButton.className="ac_button";
	this.content.insertBefore(this.eraseButton,this.secondlist);
	
	this.selectAllButton=document.createElement("span");
	YAHOO.util.Dom.generateId(this.selectAllButton,'er');
	this.selectAllButton.appendChild(document.createTextNode("Select All"));
	this.selectAllButton.className="ac_button";
	this.content.insertBefore(this.selectAllButton,this.secondlist);
	
	this.USButton=document.createElement("span");
	YAHOO.util.Dom.generateId(this.USButton,'er');
	this.USButton.appendChild(document.createTextNode("Unselect All"));
	this.USButton.className="ac_button";
	this.content.insertBefore(this.USButton,this.secondlist);
	
	YAHOO.util.Event.addListener(this.selectAllButton.id,'click',function(e,obj){
		obj.selectall.fire('check');
	},this);
	YAHOO.util.Event.addListener(this.USButton.id,'click',function(e,obj){
		obj.selectall.fire('uncheck');
	},this);
	YAHOO.util.Event.addListener(this.eraseButton.id,'click',function(e,obj){
		obj.erase.fire();
	},this);
	this.list=document.createElement("div");
	YAHOO.util.Dom.generateId(this.list,'li');
	this.list.className="ac_list";
	this.content.appendChild(this.list);
	
	this.appendSelf();
}
RecentAnno.prototype={
	/**
	 * Append DOM to given div
	 */
	appendSelf:function(){
		el=document.getElementById("main");
		el.appendChild(this.DOM);
		this.getRecent();
	},
	getRecent:function(){
		url='./getRecent.php';
		callback={
			success:function(o){
				var obj=o.argument[0];
				if(obj.list.firstChild){
					while(obj.list.firstChild.nextSibling){
						obj.list.removeChild(obj.list.firstChild.nextSibling);
					}
					obj.list.removeChild(obj.list.firstChild);
				}
				obj.erase.unsubscribeAll();
				obj.selectall.unsubscribeAll();
				var data=o.responseText.split("\n");
				for(d in data){
					if (data[d].length > 0) {
						var anno = data[d].split('%');
						item = new AnnotationItem(anno);
						obj.list.appendChild(item.DOM);
						obj.selectall.subscribe(item.autoSelect, item);
						obj.erase.subscribe(item.removeItem, item);
						item.deleteItem.subscribe(function(e, pass, args){
							args.secondlist.removeChild(pass[0].DOM);
						}, obj);
					}
				}
			},
			failure:function(o){
				
			},
			argument:[this]
		}
		
		connect=YAHOO.util.Connect.asyncRequest('GET',url,callback);
		
	}
}
