/***
 * Creates a "New Panel" window for the
 * Archimedes interface
 * 
 * Explains what the interface is and then goes to one of 
 * three other windows
 */

 ArchSelect=Monomyth.Class.extend({
	init:function(args){
 	this.setContents();
	
 	//browse works
	this.bWorks=new bWorks({manifest:args.workmanifest});
	$("body").bind("bworkclosed",{obj:this},function(e){
		var obj=e.data.obj;
		obj.DOM.show();
	});
	$("body").bind("titleClicked",{obj:this},this.openNewPanel);
	$("body").bind("backtothemenu",{obj:this},this.backMenuHandle);
 },
 	setContents:function(){
		this.DOM=$("#archselect_dom");
		this.closebutton=$("#archselect_close");
		this.browseWorks=$("#archselect_bwork");
		this.browseOver=$("#archselect_bover");
		this.browseUnder=$("#archselect_bunder");
		//bind listeners
		this.closebutton.bind('click',{obj:this},this.close);
		this.browseWorks.bind('click',{obj:this},this.openWorksWin);
		this.browseOver.bind('click',{obj:this},this.openBrowseOver);
	 	this.browseUnder.bind('click',{obj:this},this.openBrowseUnder);
		this.open=true;
	},
	display:function(){
		this.DOM.show("slow");
		this.open=true;
	},
 	close:function(e){
		e.data.obj.DOM.hide();
		e.data.obj.open=false;
		//YAHOO.util.Dom.setStyle(obj.DOM,'display','none');
	},
	openWorksWin:function(e){
		e.stopPropagation();
		var obj=e.data.obj;
		if (obj.DOM.css("z-index") < 1000) {
			obj.DOM.css("z-index", 1000);
			obj.bWorks.DOM.css("z-index", 1000);
		}
		obj.DOM.hide("slow",function(){
			obj.bWorks.DOM.show("slow");
		});
		obj.bWorks.resetDisplay();
		
		return false;
	},
	openNewPanel:function(e,args){
		if(e.isPropagationStopped()) return false;
		e.stopPropagation();
		var obj=e.data.obj;
		obj.DOM.hide();
		obj.open=false;
		obj.DOM.trigger("setManifest",[args]);
		return false;
	},
	openBrowseOver:function(e){
		if(e.isPropagationStopped()) return false;
		e.stopPropagation();
		var obj=e.data.obj;
		obj.DOM.hide();
		obj.open=false;
		var args={type:'prayerbook',manifest:'./manifest/prayerbook.xml',part:"Prayer Book"};
		
		obj.DOM.trigger("setManifest",[args]);
		return false;
		
	},
	openBrowseUnder:function(e,obj){
		if(e.isPropagationStopped()) return false;
		e.stopPropagation();
		var obj=e.data.obj;
		obj.DOM.hide();
		obj.open=false;
		obj.DOM.trigger("setManifest",[{type:'undertext',manifest:'./manifest/undertext.xml',part:"Undertext"}])
		return false;
	},
	backMenuHandle:function(e,t){
		var obj=e.data.obj;
		switch(t){
			case 'w':
				obj.DOM.hide();
				obj.bWorks.DOM.show("slow");
				obj.bWorks.resetDisplay();
				obj.open=true;
				break;
			case 'm':
				obj.DOM.show("slow");
				obj.bWorks.DOM.hide();
				obj.open=true;
				break;
			case 'c':
				obj.DOM.hide();
				obj.bWorks.DOM.hide();
				obj.open=false;
		}
	}
 });

 /**
  * Browse By Works Window (Created in PHP)
  */
 
 var bWorks=Monomyth.Class.extend({
	init:function(args){
 	
	this.manifest=args.manifest;
	this.options=null;
	this.setContents();
 },
 	setContents:function(){
		this.DOM=$("#bwork");
		this.closebutton=$('#bwork_close');
		this.closebutton.bind('click',{obj:this},this.close);
		this.bworks_select=$('#bwork_select');
		this.bwork_works=$('#bwork_works');
		this.backButton=$("#bworkBackButton");
		this.backButton.click(function(e){
			e.preventDefault();
			$(this).trigger("backtothemenu",["m"]);
		});
		this.handleReady(this);
	},
 	close:function(e){
		var obj=e.data.obj;
	
		if($(".panel").length==0){
			obj.DOM.trigger("backtothemenu",["m"]);
		} else {
			obj.DOM.trigger("backtothemenu",["c"]);
		}
		//obj.closed.fire();
	},
	resetDisplay:function(){
		$(".listItem").each(function(i,o){
			$(o).removeClass("authItem_selected");
		});
		this.bwork_works.empty();
	},
	handleReady:function(obj){
		obj.readManifest(obj.manifest);
	},
	readManifest:function(manifest){
		var xml=$.ajax({
			async:false,
			dataType:"xml",
			url:manifest
		}).responseXML;
		
		var o=[];
		var authorarray=[];
		var authorstring="";
		$(xml).find("work").each(function(ox){
			
			var authorname=$(this).find("author").text();
			if(authorstring.indexOf(authorname,0)<0){
				authorstring+=" "+authorname;
				authorarray.push(authorname);
				var title=$(this).find("title").text();
				o[authorname]=[title];
			} else {
				var title=$(this).find("title").text();
				o[authorname].push(title);
			}
		});
		this.options=o;
		//create associative array of an author and his/her work(s)
		// for(i=0;i<workarray.length;i++){
		// 			var work=$(workarray[i]);
		// 			var authorname=work.find("author").text();
		// 			//var authorname=author.firstChild.nodeValue;
		// 			if(authorstring.indexOf(authorname,0)<0){
		// 				authorstring+=" "+authorname;
		// 				authorarray.push(authorname);
		// 				var title=work.find("title").text();
		// 				this.options[authorname]=[title];
		// 			} else {
		// 				var title=work.find("title").text();
		// 				this.options[authorname].push(title);
		// 			}		
		// 		}
		this.populateAuthorTable(authorarray);
		
		/*
var callback={
			success:function(o){
				var obj=o.argument[0];
				var data=o.responseXML;
				var dom=data.documentElement;
				obj.options=[];
				var authorarray=[];
				var authorstring="";
				var workarray=dom.getElementsByTagName("work");
				//create associative array of an author and his/her work(s)
				for(i=0;i<workarray.length;i++){
					var work=workarray.item(i);
					var author=work.getElementsByTagName("author").item(0);
					var authorname=author.firstChild.nodeValue;
					if(authorstring.indexOf(authorname,0)<0){
						authorstring+=" "+authorname;
						authorarray.push(authorname);
						var title=work.getElementsByTagName("title").item(0).firstChild.nodeValue;
						obj.options[authorname]=[title];
					} else {
						var title=work.getElementsByTagName("title").item(0).firstChild.nodeValue;
						obj.options[authorname].push(title);
					}		
				}
				obj.populateAuthorTable(authorarray);
			},
			failure:function(o){
				alert("failure to access "+o.argument[1]);
			},
			argument:[this,manifest]
			
		};
		var connect=YAHOO.util.Connect.asyncRequest('GET',manifest,callback);
		setTimeout(function(){
			if(YAHOO.util.Connect.isCallInProgress(connect)){
				YAHOO.util.Connect.abort(connect);
			}
		},2000);
*/
	},
	populateAuthorTable:function(authors){
		this.DOM.bind("authorClick",{obj:this},this.displayAuthorWorks);
		for(i=0;i<authors.length;i++){
			var el=new AuthorItem(authors[i]);
			this.bworks_select.append(el.DOM);
			//this.deselectNames.subscribe(el.unSelect,el);
			
			//el.authorClick.subscribe(this.displayAuthorWorks,this);
		}
	},
	
	displayAuthorWorks:function(e,authoritem){
		var obj=e.data.obj;
		
		//obj.deselectNames.fire();
		authoritem.DOM.addClass("authItem_selected");
		obj.bwork_works.empty();
		/*
if(args.bwork_works.firstChild){
			while(args.bwork_works.firstChild){
				args.bwork_works.removeChild(args.bwork_works.firstChild);
			}
		}
*/
		//work list cleared, display author's works 
		
		var works=obj.options[authoritem.name];
		//set up bind for title click
		obj.DOM.bind("titleClick",{obj:obj},obj.titleSelected);
		for(w=0;w<works.length;w++){
			var title=works[w];
			var el=new WorkItem(title);
			obj.bwork_works.append(el.DOM);
			
			//el.titleClick.subscribe(obj.titleSelected,args);
		}
	},
	titleSelected:function(e,workitem){
		if(e.isPropagationStopped()) return false;
		e.stopPropagation();
		var obj=e.data.obj;
		var manifest=obj.manifest;
		obj.DOM.hide();
		obj.DOM.trigger("titleClicked",[{type:'work',manifest:manifest,part:workitem.title}]);
		
		return false;
		//obj.DOM.trigger("titleClicked",[{type:'work',manifest:manifest,part:workitem.title}])
		//obj.titleClicked.fire({type:'work',manifest:manifest,part:workitem.title});
		
		//YAHOO.util.Dom.setStyle(args.DOM,'display','none');
	}
	
 });

var AuthorItem=Monomyth.Class.extend({
	init:function(name){
	this.DOM=$("<div></div>");
	this.DOM.attr("id",function(arr){
		return "author"+arr;
	});
	//YAHOO.util.Dom.generateId(this.DOM,"author");
	this.DOM.addClass("listItem");
	this.DOM.text(name);
	this.name=name;
	this.DOM.bind('click',{obj:this},this.notifyClick);
	//this.authorClick=new YAHOO.util.CustomEvent("authorClick");
	//YAHOO.util.Event.addListener(this.DOM.id,'click',this.notifyClick,this);
},
	notifyClick:function(e){
		e.stopPropagation();
		var obj=e.data.obj;
		//un-select all elements
		$(".listItem").removeClass("authItem_selected");
		obj.DOM.trigger("authorClick",[obj]);
		return false;
	},
	unSelect:function(e,pass,args){
		if(!args.DOM.hasClass("listItem")) args.DOM.addClass("listItem");
	}
});

var WorkItem=Monomyth.Class.extend({
	init:function(title){
	this.DOM=$("<div></div>");
	//YAHOO.util.Dom.generateId(this.DOM,"work");
	this.DOM.addClass("listItem");
	this.DOM.text(title);
	
	this.title=title;
	//this.titleClick=new YAHOO.util.CustomEvent("titleClick");
	//YAHOO.util.Event.addListener(this.DOM.id,'click',this.notifyClick,this);
	this.DOM.bind("click",{obj:this},this.notifyClick);
	
},
	notifyClick:function(e){
		if(e.isPropagationStopped()) return false;
		e.stopPropagation();
		
		e.data.obj.DOM.trigger("titleClick",[e.data.obj]);
		return false;
		//obj.titleClick.fire(obj);
	}
});
