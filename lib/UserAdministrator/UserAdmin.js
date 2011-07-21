/***
 * UserAdmin.js
 * 
 * For administrating user accounts and flagging
 * those that are considered scholar users, or priviledged
 * users
 */


 UserAdminTable=function(){
 	this.prefs=new Array();
	this.unPrefs=new Array();
	
 	this.HTML=document.createElement("div");
	this.HTML.className="adminTable";
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
	
	this.userList=document.createElement("div");
	this.userList.id=YAHOO.util.Dom.generateId(this.userList, 'adminTable_users');
	this.userList.className='adminTable_list';
	this.body.appendChild(this.userList);
	this.body.insertBefore(document.createTextNode('Users (Double Click to make priviledged/unpriviledged)'), this.userList);
	
	this.prefList=document.createElement("div");
	this.prefList.id=YAHOO.util.Dom.generateId(this.prefList, 'adminTable_prefs');
	this.prefList.className="adminTable_list";
	//this.body.appendChild(this.prefList);
	//this.body.insertBefore(document.createTextNode('Priviledged Users:'), this.prefList);
	
	this.closeA=document.createElement("span");
	this.closeA.id=YAHOO.util.Dom.generateId(this.closeA, 'close');
	this.closeA.appendChild(document.createTextNode('Close'));
	this.closeA.className="adminTable_button";
	
	this.saveA=document.createElement("span");
	this.saveA.id=YAHOO.util.Dom.generateId(this.saveA, 'save');
	this.saveA.appendChild(document.createTextNode('Save'));
	this.saveA.className="adminTable_button";
	
	this.HTML.appendChild(this.saveA);
	this.HTML.appendChild(this.closeA);
	
	YAHOO.util.Dom.setStyle(this.HTML, 'display', 'block');
	YAHOO.util.Event.addListener(this.saveA.id, 'click', this.savePreferences, this);
	YAHOO.util.Event.addListener(this.closeA.id, 'click', this.closeWin, this);
	
	YAHOO.util.Event.onAvailable(this.id, this.handleAvailable, this);
 }
 
 /***
  * Save preferences to database
  */
 UserAdminTable.prototype.savePreferences=function(e, obj){
 	var values="";
	
	for(i in obj.prefs){
		if (!obj.prefs[i] == null) {
			values += 'set*'+obj.prefs[i] + '-';
		}
	}
	for(i in obj.unPrefs){
		
		if(!(obj.unPrefs[i]==null)){
			values += 'unset*'+obj.unPrefs[i]+'-';
		}
	}
	
	var callback={
		success: function(o){
			
			o.argument.obj.infoHeader.innerHTML="";
			o.argument.obj.infoHeader.appendChild(document.createTextNode('Save Successful'));
			o.argument.obj.prefList.innerHTML="";
			o.argument.obj.userList.innerHTML="";
			o.argument.obj.prefs=[];
			o.argument.obj.unPrefs=[];
			o.argument.obj.populatePrefList(o.argument.obj);
			o.argument.obj.populateUserList(o.argument.obj);
		},
		failure: function(o){
			o.argument.obj.infoHeader.innerHTML="";
			o.argument.obj.infoHeader.appendChild(document.createTextNode('Save Failed: Try Again'));
		},
		argument: {obj: obj}
	};
	var sUrl="./UserAdmin.php?type=set&values="+values;
	var transact=YAHOO.util.Connect.asyncRequest('GET',sUrl,callback,null);
	
	
	
	
 }
 
 /***
  * Set up prefList
  * @param {Object} e
  * @param {Object} obj
  */
 UserAdminTable.prototype.populatePrefList=function(obj){
 	var callback={
		success: function(o){
			var values=o.responseText.split('%');

			for(i in values){
				record=values[i].split('!');
				if (!record[0] == "") {
					el = document.createElement('div');
					el.className = 'adminTable_selectfile';
					el.id = record[0];
					el.appendChild(document.createTextNode('User name: ' + record[1]));
					o.argument.obj.prefList.appendChild(el);
					YAHOO.util.Event.addListener(el.id, 'click', function(e, args){
						var obj = args.obj;
						var el = args.el;
						var record = args.record;
						
						obj.infoHeader.innerHTML = "<p>User name: " + record[1] + "<br/>User Id: " + record[0] + "<br/>Affiliation: " + record[2] + "</p>"
					}, {
						obj: o.argument.obj,
						el: el,
						record: record
					});
				}
			}
		},
		failure: function(o){
			o.argument.obj.infoHeader.innerHTML="";
			o.argument.obj.infoHeader.appendChild(document.createTextNode("Error in retrieving data, refresh browser."));
		},
		argument: {obj: obj}
	}
	var sUrl='./UserAdmin.php?type=getPriv';
	var transact=YAHOO.util.Connect.asyncRequest('GET',sUrl,callback,null);
	
	
 }
 /***
  * Set up the list of unpriviledged users
  * @param {Object} e
  * @param {Object} obj
  */
 UserAdminTable.prototype.populateUserList=function(obj){
 	var callback={
		success: function(o){
			var values = o.responseText.split('%');
			for (i in values) {
				record=values[i].split('!');
				if (!record[0] == "") {
					el = document.createElement('div');
					el.id = record[0];
					if(record[2]=="access"){
						el.className="adminTable_selectfileCheck";
						o.argument.obj.prefs[el.id]=el.id;
					} else {
						el.className="adminTable_selectfile";
					}
					
					el.appendChild(document.createTextNode('User name: ' + record[1]));
					o.argument.obj.userList.appendChild(el);
					YAHOO.util.Event.addListener(el.id, 'click', function(e, args){
						var obj = args.obj;
						var el = args.el;
						var record = args.record;
						
						obj.infoHeader.innerHTML = "<p>User name: " + record[1] + "<br/>User Id: " + record[0] + "<br/>Affiliation: " + record[2] + "</p>"
					}, {
						obj: o.argument.obj,
						el: el,
						record: record
					});
					YAHOO.util.Event.addListener(el.id, 'dblclick', function(e, args){
						el = args.el;
						if (!args.obj.prefs[el.id]) {
							el.className="adminTable_selectfileCheck";
							if(args.obj.unPrefs[el.id]){args.obj.unPrefs[el.id]=null;}
							args.obj.prefs[el.id] = el.id;
						} 
						else 
							if (args.obj.prefs[el.id]) {
								el.className="adminTable_selectfile";
								args.obj.prefs[el.id] = null;
								args.obj.unPrefs[el.id]=el.id;
							}
					}, {
						obj: obj,
						el: el
					});
				}
			}
		},
		failure: function(o){
			o.argument.obj.infoHeader.innerHTML="";
			o.argument.obj.infoHeader.appendChild(document.createTextNode("Error in retrieving data, refresh browser."));
		},
		argument: {obj: obj}
	}
	var sUrl='./UserAdmin.php?type=all';
	var transact=YAHOO.util.Connect.asyncRequest('GET',sUrl,callback,null);
 }
 
/***
 * Close the window
 */
UserAdminTable.prototype.closeWin=function(e, obj){
	var state=YAHOO.util.Dom.getStyle(obj.HTML, 'display');
	if(state=='block'){
		YAHOO.util.Dom.setStyle(obj.HTML, 'display', 'none');
	} else if(state=='none'){
		YAHOO.util.Dom.setStyle(obj.HTML, 'display', 'block');
	}
}

/***
 * Initiate table
 */
UserAdminTable.prototype.handleAvailable=function(obj){
	obj.populatePrefList(obj);
	obj.populateUserList(obj);
}
