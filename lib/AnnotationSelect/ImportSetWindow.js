/**
 * Window for importing annotations sets
 * 
 * Works with annoSetExport.php and annoSetImport.php
 */

ImportWin=function(dom){
	this.loc=dom;
	this.DOM=document.createElement("div");
	YAHOO.util.Dom.generateId(this.DOM,'imp');
	this.DOM.className="window";
	
	this.header=document.createElement("div");
	YAHOO.util.Dom.generateId(this.header,'header');
	this.header.className="window_closebar";
	this.header.appendChild(document.createTextNode("Import Set"));
	
	this.close=document.createElement("a");
	YAHOO.util.Dom.generateId(this.close,'close');
	this.close.className="window_close";
	this.close.appendChild(document.createTextNode("Close"));
	
	this.body=document.createElement("div");
	YAHOO.util.Dom.generateId(this.body,'body');
	this.body.className="window_body";
	
	this.importdata=document.createElement("div");
	YAHOO.util.Dom.generateId(this.importdata,'imp');
	this.importdata.className="import_data";
	this.importform=document.createElement("form");
	YAHOO.util.Dom.generateId(this.importform,'form');
	this.importform.className="importform";
	this.importform.enctype="multipart/form-data";
	
	this.importform.method="POST";
	this.importform.action="./lib/Annotation/annoSetImport.php";
	this.importfile=document.createElement("input");
	YAHOO.util.Dom.generateId(this.importfile,'file');
	this.importfile.className="import_input";
	this.importfile.type="file";
	this.importfile.name="path";
	
	
	this.importOk=document.createElement("input");
	YAHOO.util.Dom.generateId(this.importOk,'button');
	this.importOk.type="submit";
	this.importOk.value="Import";
	//this.importOk.appendChild(document.createTextNode("Import"));
	this.DOM.appendChild(this.header);
	this.header.appendChild(this.close);
	this.DOM.appendChild(this.body);
	this.DOM.appendChild(this.importdata);
	this.importform.appendChild(this.importfile);
	this.importform.appendChild(this.importOk);
	this.importdata.appendChild(this.importform);
	this.DOM.appendChild(this.importdata);
	this.annoimported=new YAHOO.util.CustomEvent("annoimported");
	this.closed=new YAHOO.util.CustomEvent("closed");
	YAHOO.util.Dom.setStyle(this.DOM,'display','none');
	YAHOO.util.Event.onContentReady(this.DOM.id,this.makeDrag,this);
	//YAHOO.util.Event.addListener(this.importOk.id,'click',this.importSet,this);
	YAHOO.util.Event.addListener(this.close.id,'click',this.closeWin,this);
	
}
ImportWin.prototype={
	makeDrag:function(obj){
		obj.drag=new YAHOO.util.DD(obj.DOM.id);
		obj.resize=new YAHOO.util.Resize(obj.DOM.id);
	},
	closeWin:function(e,obj){
		obj.closed.fire();
	},
	importSet:function(e,obj){
		var path=obj.importfile.value;
		var url="./lib/Annotation/annoSetImport.php?path="+path;
		var callback={
			success:function(o){
				var obj=o.argument[0];
				obj.annoimported.fire();
			},
			failure:function(o){
				alert("Failure to import data");
			},
			argument:[obj]
		}
		var connect=YAHOO.util.Connect.asyncRequest('POST',url,callback);
	}
}
