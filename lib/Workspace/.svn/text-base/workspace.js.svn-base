/**
 * Workspace
 * 
 * Creates a dynamic HTML zone for 
 * creating and managing other 
 * objects
 * 
 * Input:
 * @param {Object} loc
 * 	HTML element that Workspace attaches other objects to
 * 	Must be a valid DOM object
 * @param {Object} regPath
 * 	Path (String) that represents the current server location
 * 	to the root index of the project
 * 	Ex: http://localhost:8888/quartos/
 * 
 * Creates:
 * 	LoginBar
 * 	ListenerMgr
 * 	ProjectBar
 */

Workspace = Monomyth.Class.extend({
	init:function(args){
	    this.DOM = $("#"+args.loc);
	    this.header = $("#header");
	    this.header.addClass("header_Archie");
	    this.curPanel = null;
	    this.allPanels = new Array();
	    this.allCrops = new Array();
	    this.allLabels = new Array();
	   
	    //this.setProp = new YAHOO.util.CustomEvent("setProp");
	    this.objects = new Array();
	    this.properties = new Array();
	    this.openProject = "default";
	    this.user = null;
	    this.userid = null;
		this.readytocreate=false;
	  
	}
});
