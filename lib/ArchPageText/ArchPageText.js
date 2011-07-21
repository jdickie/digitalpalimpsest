/*
 * PageText.js
 * 
 * 
 * Create div for holding 
 * text streamed in from XML 
 * 
 * Separates XML text into separate
 * Divs (leaf, page1, page2,...)
*/

var PageText=Monomyth.Class.extend({
	init:function(args){
		this.panelid=args.panelid;
		this.DOM=$("#"+this.panelid+"_pagetext");
		
		this.DOM.css("display","none");
		//YAHOO.util.Dom.setStyle(this.DOM,'display','none');
		
		
		this.vLoaded = false;
		this.rLoaded = false;
		
		this.writing = false;
		this.docId = "097";
		this.set=null;
		this.page = 0;
		this.clearText="clearText"+this.panelid;
		this.retrieveHTML="retrieveHTML"+this.panelid;
		this.storeTextAnno="storeTextAnno"+this.panelid;
		this.pageLoaded="pageLoaded"+this.panelid;
		//this.pageLoaded.subscribe(this.handlePagesLoaded,this);
		/*
	this.clearText=new YAHOO.util.CustomEvent("clearText");
		this.retrieveHTML=new YAHOO.util.CustomEvent("retrieveHTML");
		this.storeTextAnno=new YAHOO.util.CustomEvent("storeTextAnno");
		this.pageLoaded=new YAHOO.util.CustomEvent("pageLoaded");
		this.pageLoaded.subscribe(this.handlePagesLoaded,this);
	*/
		this.annoMode = 0 // 0 = none , 1 = start, 2 = stop
		this.annoInfo = {
			startNodeParent: null,
			startChildNum: null,
			startNodeOffset: null,
			endNodeParent: null,
			endChildNum: null,
			endNodeOffset: null,
		}	
		this.annoBar = null;
		this.DOM.bind("click",{obj:this},this.clearNotes);
		
		//YAHOO.util.Event.addListener(this.DOM.id, "click", this.clearNotes, this);
		//YAHOO.util.Event.addListener(this.DOM.id, "mouseup", this.alertSelect, this);
		//YAHOO.util.Event.addListener(this.DOM.id, "dblclick", this.alertSelect, this);
	}, 
	loadXML:function(fname){
		      var xmlDoc;
	        // code for IE
	        if (window.ActiveXObject) {
				xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
			}
			// code for Mozilla, Firefox, Opera, etc.
			else {
				if (document.implementation &&
				document.implementation.createDocument) {
					
					xmlDoc = document.implementation.createDocument("", "", null);
				}
				else {
					alert('Your browser cannot handle this script');
				}
			}	
	        xmlDoc.async = false;
		
	        xmlDoc.load(fname);
			return xmlDoc;
		
	},
	retrieveContent:function(uri,target){
		XSLURI = "./quartos.xsl";
		
		xml = this.loadXML(uri);
			
		xsl = this.loadXML(XSLURI);
		
		if (window.ActiveXObject)
	  {
	    ex=xml.transformNode(xsl);
	
	   target.innerHTML = ex;
	  }
	  // code for Mozilla, Firefox, Opera, etc.
	  else if (document.implementation
	  && document.implementation.createDocument)
	  {
	    xsltProcessor=new XSLTProcessor();
	    xsltProcessor.importStylesheet(xsl);
	
		
	    resultDocument = xsltProcessor.transformToFragment(xml,document);
				var string = (new XMLSerializer()).serializeToString(resultDocument);
			
	
		
	target.innerHTML = string;
	
	  }
	  
	  this.pageLoaded.fire(target);
	/*	var callback={
			success: function(o){
				tar = o.argument.target;
				
				
				
				
				tar.innerHTML = o.responseText;
					o.argument.pageText.pageLoaded.fire(tar);
				
			},
			failure: function(o){
				
			},
			argument: {
				target: target, pageText: this
				
			}
		};
	
		YAHOO.util.Connect.asyncRequest('GET', uri, callback);
		*/
		
	},
	
	handlePagesLoaded:function(e,pass,args){
		pageText = args;
	
		if (pass[0].className=="recto"){
			if (pageText.vLoaded) {
				pageText.setUpPage();
			}
			else {
				pageText.rLoaded = true;
			}
		}
		else{
			if (pageText.rLoaded) {
				pageText.setUpPage();
			}
			else{
				pageText.vLoaded=true;
			}
			
		}
		
	},
	fillPage:function(v,r,docId,curPage,set){
		this.docId = docId;
		this.page = curPage;
		this.set = set;	
		this.retrieveContent(v,this.verso);
		this.retrieveContent(r,this.recto);
	}
});

/**
 * Inherits methods and properties from:
 * PageText.js
 */

var ArchPageText=PageText.extend({
	init:function(args){
		//call superclass
		this.$super(args);
		this.xmlpath=args.xmlpath;
		this.xsluri="./archie.xsl";
		this.cururi=null;
		this.onCleared="onCleared"+this.panelid;
		this.pageLoaded="pageLoaded"+this.panelid;
	},
	fillPage:function(uri,docId,curPage,set){
		this.cururi=uri;
		this.xmlpath = docId;
		this.page = curPage;
		this.set = set;
		this.retrieveContent(this.cururi);
		this.alreadyLoaded=true;
	},
	retrieveContent:function(uri){
		var url="./lib/ArchPageText/retrieveContentScript.php?xmluri=../../"+uri+"&xsluri=../../"+this.xsluri;
		this.DOM.html($.ajax({
			url:url,
			async:false,
			dataType:"text"
		}).responseText);
	},
	retrieveContentJS:function(uri){
		var xml=this.loadXML(uri);
		var xsl=this.loadXML(this.xsluri);
		if (window.ActiveXObject){
	    	var ex=xml.transformNode(xsl);
	   		this.DOM.html(ex);
	  	}
	  // code for Mozilla, Firefox, Opera, etc.
	  else if (document.implementation
	  	&& document.implementation.createDocument){
	    	var xsltProcessor=new XSLTProcessor();
	    	xsltProcessor.importStylesheet(xsl);
	    	resultDocument = xsltProcessor.transformToFragment(xml,document);
			var string = (new XMLSerializer()).serializeToString(resultDocument);	
			this.DOM.html(string);
	 	}
	  
	  this.DOM.trigger(this.pageLoaded,[this.DOM]);
	},
	clearArea:function(){
		this.DOM.empty();
		
		this.DOM.trigger(this.onCleared);
	},
	displayBlankPage:function(){
		this.DOM.html($("<div>Sorry, no transcript available.</div>"));
	}
});