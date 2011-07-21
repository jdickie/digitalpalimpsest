/***
 * ItemAdmin.js
 * 
 * 
 * Allowing admins to delete user-generated content
 * in the Archie database 
 * 
 */

ItemAdmin=function(){
	this.marked=new Array();
	
	this.HTML=document.createElement("div");
	this.HTML.className="itemTable";
	this.HTML.id=YAHOO.util.Dom.generateId(this.HTML, 'adminTable');
	this.id=this.HTML.id;
	
	this.infoHeader=document.createElement("div");
	this.infoHeader.className="adminTable_infoHeader";
	this.infoHeader.id=YAHOO.util.Dom.generateId(this.infoHeader, 'info');
	this.HTML.appendChild(this.infoHeader);
	
	this.body=document.createElement("div");
	this.body.id=YAHOO.util.Dom.generateId(this.body, 'adminBody');
	this.body.className="adminTable_body";
	this.HTML.appendChild(this.body);
	
	this.itemList=document.createElement("div");
	this.itemList.id=YAHOO.util.Dom.generateId(this.itemList, 'adminTable_users');
	this.itemList.className='adminTable_list';
	this.body.appendChild(this.itemList);
	this.body.insertBefore(document.createTextNode('Users (Double Click to make priviledged/unpriviledged)'), this.itemList);
	
	this.prefList=document.createElement("div");
	this.prefList.id=YAHOO.util.Dom.generateId(this.prefList, 'adminTable_prefs');
	this.prefList.className="adminTable_list";
	this.body.appendChild(this.prefList);
	this.body.insertBefore(document.createTextNode('Priviledged Users:'), this.prefList);
	
	YAHOO.util.Dom.setStyle(this.HTML, 'display', 'block');
	
	YAHOO.util.Event.onAvailable(this.id, this.handleAvailable, this);
}

/***
 * populate the itemList table from php 
 */
ItemAdmin.prototype.populateItemList=function(obj){
	var sUrl="./UserAdmin.php?type=allItems";
	var callback={
		success: function (o){
			var values=o.responseText.split('-');
			for(i in values){
				record=values[i].split('%');
				el=document.createElement("div");
				el.id=record[1];
				el.className="adminTable_selectitem";
				o.argument.obj.itemList.appendChild(el);
			}
		},
		failure: function(o){
			alert('Failure with accessing database - try again');
		},
		argument: {obj: obj}
	};
	var transact=YAHOO.util.Connect.asyncRequest('GET', sUrl, callback, null);
}


/***
 * Initiate table
 * @param {Object} obj
 */
ItemAdmin.prototype.handleAvailable=function(obj){
	obj.populateItemList(obj);
}