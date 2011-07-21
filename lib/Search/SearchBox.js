/***
 * SearchBox.js
 * 
 * Creates searchBox object
 * 
 * Constructors for:
 * searchBox()
 * searchText()
 * listBox()
 * listItem()
 * 
 * Input: 
 * 	loc: 
 *		valid DOM object (element) passed to constructor
 		Object attaches this.DOM (self) to loc
 */
 searchBox=function(loc){
 	
	this.DOM=document.createElement("div");
	YAHOO.util.Dom.generateId(this.DOM, "ho");
	this.id = this.DOM.id;
	this.main=document.createElement("div");
	YAHOO.util.Dom.generateId(this.main, "ho");
	this.main.className = "search_window";
	
	this.background=document.createElement("div");
	YAHOO.util.Dom.generateId(this.background,'dark');
	this.background.className="project_back";
	
	
	this.windowBody = document.createElement("div");
	this.windowBody.className = "window_body";
	
	this.windowClosebar=document.createElement("div");
	this.windowClosebar.className = "window_closebar";
	YAHOO.util.Dom.generateId(this.windowClosebar, 'handle');
	
	this.windowClose = document.createElement("a");
	this.windowClose.className = "window_close";
	this.windowClose.appendChild(document.createTextNode("Close"));
	this.windowTitle = document.createElement("span");
	this.windowTitle.className = "window_title";
	this.windowTitle.appendChild(document.createTextNode("Phrase/Word Search"));
	
	this.windowContent = document.createElement("div");
	this.windowContent.className = "search_window_content";
	
 	this.searchBox=document.createElement("div");
	YAHOO.util.Dom.generateId(this.searchBox, "searchBox");
	this.searchBox.className="searchBox";
	
	this.sText=new searchText();
	this.lBox=new listBox();
	this.limitName="searchLimit";
	this.limiterBox=new Archie.Limiter(this.limitName,["quarto","speaker","act","scene"]);
	
	this.sLabel=document.createElement("label");
	this.sLabel.appendChild(document.createTextNode("Search for a WORD or PHRASE:"));
	this.lLabel=document.createElement("label");
	this.lLabel.appendChild(document.createTextNode("Results:"));

	this.windowClosebar.appendChild(this.windowClose);
	this.windowClosebar.appendChild(this.windowTitle);
	
	//this.windowBody.appendChild(this.windowClosebar);
	this.windowBody.appendChild(this.windowContent);
	
	this.windowContent.appendChild(this.sText.DOM);
	this.windowContent.appendChild(this.lBox.DOM);
	this.windowContent.appendChild(this.limiterBox.DOM);
	this.windowContent.insertBefore(this.sLabel, this.sText.DOM);
	this.windowContent.insertBefore(this.lLabel, this.lBox.DOM);
	this.goButton = document.createElement("button");
	YAHOO.util.Dom.generateId(this.goButton, "go");
	this.goButton.className="search_button";
	this.goButton.appendChild(document.createTextNode("Go"));
	this.windowContent.insertBefore(this.goButton,this.lLabel);

	YAHOO.util.Event.addListener(this.goButton.id, 'click', this.sText.goDo, this.sText);
	
	//exact match toggle
	this.windowSwitch=document.createElement("input");
	this.windowSwitch.type="checkbox";
	YAHOO.util.Dom.generateId(this.windowSwitch,"exact_");
	this.windowSwitch.className="windowSwitch";
	this.windowContent.appendChild(this.windowSwitch);
	this.wsLabel=document.createElement("label");
	this.wsLabel.className="wsLabel";
	this.wsLabel.appendChild(document.createTextNode("Exact Match: "));
	this.windowContent.insertBefore(this.wsLabel,this.windowSwitch);
	this.DOM.appendChild(this.background);
	this.DOM.appendChild(this.main);
	this.main.appendChild(this.windowClosebar);
	this.main.appendChild(this.windowBody);
	
	YAHOO.util.Event.addListener(this.windowSwitch,'click',this.handleSwitchClick,this);
	
	this.searchCall=null;
	this.headerRequest="";
	this.remotePanel=null;
	this.exactMatch="CI"; //CI: case-insensitive ; CS: case-sensitive
	this.remotePanelChangePage=new YAHOO.util.CustomEvent("remotePanelChangePage");
	this.remotePanelOpen=new YAHOO.util.CustomEvent("remotePanelOpen");
	this.windowClicked=new YAHOO.util.CustomEvent("windowClicked");
	this.closed=new YAHOO.util.CustomEvent("closed");
	//subscribe to listeners
	this.sText.searchNow.subscribe(this.listenForSearchNow, this);
	this.limiterBox.reloadTheSearch.subscribe(this.listenForSearchNow, this);
	this.lBox.notifyListItemClicked.subscribe(function(e, pass, args){
		/**
		 * Event fired to ProjectBar to create a new panel
		 * 
		 * ProjectBar/Workspace sends back a panel to SearchBox
		 */
		//args.closeWin(null,args);
		args.remotePanelOpen.fire(pass[0]);
	}, this);
	//set visibility state
	YAHOO.util.Dom.setStyle(this.DOM, 'display', 'none');
	YAHOO.util.Event.addListener(this.windowClose, 'click', this.closeWin, this);
	//YAHOO.util.Event.addListener(this.DOM.id,'click',this.handleBoxClick,this);
	YAHOO.util.Event.onAvailable(this.main.id, this.makeDraggable, this);
	loc.appendChild(this.DOM);
 }
 searchBox.prototype={
 	handleBoxClick:function(e,obj){
 		obj.DOM.className="search_window yui-resize"; //maintain drag and resize
 		obj.windowClicked.fire();
 	},
 	handleKeypress:function(e, obj){
	 	if(e.keyCode==13){
				obj.sText.goDo("",obj.sText);
			}
 	},
	handleSwitchClick:function(e,obj){
 		obj.exactMatch=(obj.exactMatch=="CS")?"CI":"CS";
 	},
 /**
  * initialize drag and resize
  */
 makeDraggable:function(obj){
 	obj.drag = new YAHOO.util.DD(obj.main.id);
	obj.drag.setHandleElId(obj.windowClosebar.id);
	
	obj.resize = new YAHOO.util.Resize(obj.main.id, {
		handles: 'all'
	});
 },
 
 /***
  * Fire ajax call to get the 
  * search returns from php
  * 
  * Can be initiated by  searchText.searchNow event
  * OR the LimiterBox reloadTheSearch event
  */
 listenForSearchNow:function(e, pass, args){
 	//args is the searchBox
	//no data in pass
	args.searchPhrase(args.sText.DOM.value);
 },
 searchPhrase:function(terms){
 	sUrl='./lib/Search/SearchQuarto_check.php?type=getPhrase&terms='+terms+'&setName='+this.limitName+"&CASE="+this.exactMatch;
	var callback={
		success: function(o){
			sb=o.argument[0];
			data=o.responseText.split("\n");
			
			sb.lBox.listenForPhrase(data);
		
		},
		failure: function(o){
			
		},
		argument: [this]
	}
	var el = document.createElement("div");
	el.appendChild(document.createTextNode("Loading..."));
	this.lBox.DOM.appendChild(el);
	
	this.lBox.items[this.lBox.items.length]=el;
	var transact=YAHOO.util.Connect.asyncRequest('GET',sUrl,callback);
	
 },
 /***
  * Open or close window
  * 
  */
 closeWin:function(e, obj){
 	var state=YAHOO.util.Dom.getStyle(obj.DOM, 'display');
	if(state=='block'){
		YAHOO.util.Dom.setStyle(obj.DOM, 'display', 'none');
		YAHOO.util.Event.removeListener(document, 'keypress', obj.handleKeypress);
		obj.closed.fire();
	}
	else if (state=='none'){
		//get limiters
		obj.limiterBox.handleAvailable(obj.limiterBox);
		YAHOO.util.Dom.setStyle(obj.DOM, 'display', 'block');
		YAHOO.util.Dom.setStyle(obj.DOM,'z-index','990');
		/*
YAHOO.util.Dom.setStyle(obj.DOM,'left','13%');
		YAHOO.util.Dom.setStyle(obj.DOM,'top','90px');
*/
		YAHOO.util.Event.addListener(document, 'keypress', obj.handleKeypress, obj);
	}
 }	
 } 
/***
 * listBox
 */
listBox=function(){
	this.DOM=document.createElement("ul");
	YAHOO.util.Dom.generateId(this.DOM, "listBox");
	this.id=this.DOM.id;
	this.DOM.className="listBox";
	
	
	this.items=new Array();
	
	this.notifyListItemClicked=new YAHOO.util.CustomEvent("notifyListItemClicked");
}
listBox.prototype={
	listenForPhrase:function(data){
	
	if(this.DOM.firstChild){
		temp=this.DOM.firstChild;
		while(temp.nextSibling){
			this.DOM.removeChild(temp.nextSibling);
		}
		this.DOM.removeChild(this.DOM.firstChild);
	}
	this.items=[];
	
	el=document.createElement('div');
	el.className="fileitem";
	
	if(data=="Overflow"){
		el.appendChild(document.createTextNode('Too many results; please try refining your search by expanding the word or phrase or using the Limits to the right.'));
		this.DOM.appendChild(el);
	}
	else {
		total=(data[0]=="")?0:(data.length-1);
		el.appendChild(document.createTextNode("Total: "+total+" results"));
		this.DOM.appendChild(el);
		for (d=0;d<data.length;d++) {
			record = data[d].split('%');
			if (record[8]) {
				
				var item = new listPhrase(record);
				
			
							
				this.items[item.id] = item.DOM;
			
				this.DOM.appendChild(item.DOM);
				item.phrasePick.subscribe(function(e, pass, args){
					args.notifyListItemClicked.fire(pass[0]);
				}, this);
			}
		}
	} 
		
	
}
}
/***
 * searchText
 */
searchText=function(){
	this.DOM=document.createElement("input");
	YAHOO.util.Dom.generateId(this.DOM, "searchText");
	this.DOM.value="";
	this.id=this.DOM.id;
	this.DOM.className="searchText";
	
	this.TIMEOUT=1000; //Minimum time between key up and ajax call for search
	this.typing=false;
	
	this.searchNow=new YAHOO.util.CustomEvent("searchNow");

	
}
searchText.prototype={
	keyWait:function(obj){
		var timeForSearch=setTimeout(function(){
			obj.goDo(obj)
		},obj.TIMEOUT);
	},
	goDo:function(e, obj){
	
		obj.searchNow.fire();
	}
}
/**
 * Designed as a list item for phrases (different data input)
 */
listPhrase=function(values){
	this.DOM=document.createElement("li");
	YAHOO.util.Dom.generateId(this.DOM, "listItem");
	this.id=values[0];//unique identifier for selecting
	this.DOM.className="listItem";
	this.values=values;
	
	this.page=this.findPage(this.values[5])
	
	this.divMeta=document.createElement("div");
	this.divMeta.className="listMeta";

	this.divMeta.appendChild(document.createTextNode("Act: "+values[2]+" Scene: "+values[3]+" Page: "+this.page));

	this.divMeta.appendChild(document.createElement("br"));
	
	this.divMeta.appendChild(document.createTextNode("Speaker: "+values[4]));
	this.divMeta.appendChild(document.createElement("br"));
	this.divMeta.appendChild(document.createTextNode("Quarto: "+values[8]));
	this.divMeta.appendChild(document.createElement("br"));
	this.divMeta.appendChild(document.createTextNode(values[7]));
	this.DOM.appendChild(this.divMeta);
	
	this.manifestPrefix='./manifest/';
	
	YAHOO.util.Event.addListener(this.DOM.id,'click',this.selectPhrase,this);

	this.phrasePick=new YAHOO.util.CustomEvent("phrasePick");
	
}
listPhrase.prototype = {
	selectPhrase : function(e,obj){
		//find page
		
		pbid=obj.values[5].split('-');
		page=pbid[5];
		manParts=obj.values[5].split("-");
		manParts[5]="manifest.xml";
		
		doc=obj.manifestPrefix+manParts.join("-");
		
		bibInfo=obj.values[8];
		
		obj.phrasePick.fire({
			readyPage: obj.page,
			manifest: doc,
			bibInfo: bibInfo
		});
	},
	findPage : function(pbid){
		
		pbArr=pbid.split('-');
		page=pbArr[5];
		if((page.indexOf('a')>0)||(page.indexOf('b')>0)){
			
			page=page.substring(0,3);
			
			while(page.indexOf(0)=='0'){
			
				page=page.substring(1);
			
			}
			//page=parseInt(page);
			
		} else {
			while(page.indexOf(0)=='0'){
			
				page=page.substring(1);
				
			}
			//page=parseInt(page);
			
		}
		return page;
	}
}
