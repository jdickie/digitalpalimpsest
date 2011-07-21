
Archie.Limiter = function(name,limitTypes){
	this.nameValue=name;//set in PHP
	this.limitTypes=limitTypes;
	this.DOM = document.createElement("div");
	this.DOM.className = "limitBox";
	YAHOO.util.Dom.generateId(this.DOM,"Limiter");
	this.id = this.DOM.id;
	
	this.limitArray =new Array();
	this.addLimitType="";
	
	this.limitSpace = document.createElement("div");
	this.limitSpace.className="Limiter_limitSpace";
	this.addLimitDiv = document.createElement("div");
	this.addLimitDiv.className="Limiter_addLimit";
	
	this.addLimitLabel = document.createElement("label");
	this.addLimitLabel.appendChild(document.createTextNode("Add limit"));
	this.addLimitDiv.appendChild(this.addLimitLabel);
	
	this.selectLimitType=document.createElement("select");
	this.selectLimitType.name="limitType";
	this.addLimitDiv.appendChild(this.selectLimitType);
	this.getPossibleLimits(this);
	
	this.addButton=document.createElement("span");
	this.addButton.id=YAHOO.util.Dom.generateId(this.addButton, 'addlimit');
	this.addButton.className="limiter_button";
	this.addButton.appendChild(document.createTextNode("Add"));
	this.addLimitDiv.appendChild(this.addButton);
	
	this.eraseAll=document.createElement("span");
	this.eraseAll.id=YAHOO.util.Dom.generateId(this.eraseAll, 'eraseLimit');
	this.eraseAll.className="limiter_button"
	this.eraseAll.appendChild(document.createTextNode("Remove All"));
	this.addLimitDiv.appendChild(this.eraseAll);
	
	this.reloadSearch=document.createElement("span");
	YAHOO.util.Dom.generateId(this.reloadSearch,'re');
	this.reloadSearch.className="limiter_button";
	this.reloadSearch.appendChild(document.createTextNode("Search Again"));
	this.addLimitDiv.appendChild(this.reloadSearch);
	
	this.reloadTheSearch=new YAHOO.util.CustomEvent("reloadTheSearch");
	
	this.DOM.appendChild(this.limitSpace);
	this.DOM.appendChild(this.addLimitDiv);
	YAHOO.util.Event.addListener(this.addButton.id, 'click', this.createLimitItem, this);
	YAHOO.util.Event.addListener(this.eraseAll.id, 'click', this.removeAllLimits, this);
	YAHOO.util.Event.addListener(this.reloadSearch.id,'click',function(e,obj){
		obj.reloadTheSearch.fire();
	},this);
	YAHOO.util.Event.onAvailable(this.DOM.id, this.handleAvailable, this);
}
/***
 * Reset limit 
 * @param {Object} e
 * @param {Object} obj
 */
Archie.Limiter.prototype.removeAllLimits=function(e, obj){
	for(i in obj.limitArray){
		if(obj.limitArray[i]){
			el=document.getElementById(obj.limitArray[i]);
			if (el) {
				el.parentNode.removeChild(el);
			}
		}
		//obj.reloadTheSearch.fire();
	}
	obj.limitArray=[];
	YAHOO.util.Connect.asyncRequest('GET','./lib/Limiters/setLimits.php?mode=reset&setName='+obj.nameValue,"");
}
Archie.Limiter.prototype.createLimitItem=function(e, obj){
	
	var newLimit=new Archie.limitItem(obj.addLimitType,false,obj.nameValue);
	obj.limitArray.push(newLimit.DOM.id);
	obj.limitSpace.appendChild(newLimit.DOM);
	
	newLimit.limitsChanged.subscribe(function(e, pass, args){
		
		//args.reloadTheSearch.fire();
	}, obj);
}
Archie.Limiter.prototype.getPossibleLimits=function(obj){
	//hard-coded options for which limit to choose
	
	obj.addLimitType=obj.limitTypes[0]; //set up default
	for(i in obj.limitTypes){
		el=document.createElement("option");
		el.value=obj.limitTypes[i];
		YAHOO.util.Dom.generateId(el,i+"_");
		el.appendChild(document.createTextNode(obj.limitTypes[i]));
		obj.selectLimitType.appendChild(el);
		YAHOO.util.Event.addListener(el.id, 'click', function(e, args){
			args.obj.addLimitType=args.el.value;
		}, {obj: obj, el: el});
	}
	
}

/***
 * Retrieves given limitItems
 * from PHP Session variable
 * @param {Object} obj
 */

Archie.Limiter.prototype.handleAvailable=function(obj){
	var callback={
		success: function(o){
			if(!(o.responseText=="empty")){
				var obj=o.argument[0];
				var data=o.responseText.split('\n');
				
				for(i in data){
					record=data[i].split(',');
					
					if(record[1]){
						newLimit=new Archie.limitItem(record[0], record[1],obj.nameValue);
						obj.limitArray.push(newLimit.DOM.id);
						obj.limitSpace.appendChild(newLimit.DOM);
						
						newLimit.limitsChanged.subscribe(function(e, pass, args){
							//args.reloadTheSearch.fire();
						}, obj);
						

					}
				}
			} 
		},
		failure: function(o){
			alert("Error in retrieving data");
		},
		argument: [obj]
	}
	var getRequest=YAHOO.util.Connect.asyncRequest('GET','./lib/Limiters/getLimits.php?type=current&setName='+obj.nameValue, callback);
	setTimeout(function(){YAHOO.util.Connect.abort(getRequest)}, 5000);
}

Archie.limitItem=function(type,optionValue,nameValue){
	this.type=type;
	this.optionValue=optionValue;
	this.nameValue=nameValue;
	this.limitValue="";
	
	this.DOM = document.createElement("div");
	YAHOO.util.Dom.generateId(this.DOM,"Limit");
	this.id=this.DOM.id;
	this.DOM.className="limitItem";
	
	this.firstLimit = document.createElement("select");
	this.DOM.appendChild(this.firstLimit);
	
	this.remove = document.createElement("span");
	this.remove.className="limiterRemove";
	this.remove.appendChild(document.createTextNode("Remove"));
	this.DOM.appendChild(this.remove);
	
	this.limitsChanged=new YAHOO.util.CustomEvent("limitsChanged");
	
	YAHOO.util.Event.addListener(this.remove, 'click', this.removeLimit, this);
	
	YAHOO.util.Event.onContentReady(this.DOM.id, this.fillItem, this);
}
/***
 * set up the limitItem
 * @param {Object} obj
 */
Archie.limitItem.prototype.fillItem=function(obj){
	//fill both the first and second limit select
	//elements
	var sUrl='./lib/Limiters/getLimits.php?type=get&firstType='+obj.type+'&setName='+obj.nameValue;
	var callback={
		success: function(o){
			var obj=o.argument[0];
			var el=document.createElement("option");
			YAHOO.util.Dom.generateId(el,"default");
			el.value="default";
			el.selected=(obj.optionValue) ? false : true;
			el.appendChild(document.createTextNode("Select One..."));
			obj.firstLimit.appendChild(el);
			var data=o.responseText.split('\n');
			
			for(i in data){
				record=data[i].split('%');
				
				if (!record[1]=="") {
					el = document.createElement("option");
					YAHOO.util.Dom.generateId(el,record[0]);
					el.value = "&type="+obj.type+"&value="+record[0];
					el.appendChild(document.createTextNode(record[1]));
					el.selected=(obj.optionValue==record[0]) ? true : false;
					if(el.selected==true){
						obj.limitValue=el.value;
					}
					el.className="limitItem_option";
					obj.firstLimit.appendChild(el);
					YAHOO.util.Event.addListener(el, 'click', obj.changeSetting, {el: el, obj: obj});
				}
			}
		},
		failure: function(o){
			alert("Failure in adding limit");
		},
		argument: [obj]
	};
	YAHOO.util.Connect.asyncRequest('GET',sUrl,callback);
}
Archie.limitItem.prototype.changeSetting=function(e,args){
	limit=args.obj;
	option=args.el;
	if (limit.limitValue == "") {
		var sUrl = './lib/Limiters/setLimits.php?mode=set' + option.value+'&setName='+limit.nameValue;
		limit.limitValue = option.value;
		limit.limitsChanged.fire({mode: 'set'});
		YAHOO.util.Connect.asyncRequest('GET', sUrl, "");
		
	} else {
		var oldValue=limit.limitValue;
		oldValue = oldValue.replace("type","oldType");
		oldValue = oldValue.replace("value","oldValue");
		limit.limitValue = option.value;
		limit.limitsChanged.fire({mode: 'set'});
		var sUrl='./lib/Limiters/setLimits.php?mode=change'+oldValue+option.value+'&setName='+limit.nameValue;
		YAHOO.util.Connect.asyncRequest('GET',sUrl,"");
	}
	
}
/***
 * Sets the selected option to value
 * @param {Object} value
 */
Archie.limitItem.prototype.setValue=function(obj, value){
	var temp=YAHOO.util.Dom.getElementsByClassName("limitItem_option", "option", obj.firstLimit);
	obj.limitValue=value;
	
	for(i in temp){
		
		if(parseInt(temp.id)==parseInt(value)){
			temp.selected="selected";
			obj.limitValue=temp.value;
			
		} else {
			temp.selected="false";
		}
		temp=temp.nextSibling;
	}
}

Archie.limitItem.prototype.removeLimit=function(e, obj){
	YAHOO.util.Connect.asyncRequest('GET','./lib/Limiters/setLimits.php?mode=remove'+obj.limitValue+'&setName='+obj.nameValue);
	obj.limitsChanged.fire({mode: 'remove', value: obj.id});
	obj.DOM.parentNode.removeChild(obj.DOM);
	
	
}
