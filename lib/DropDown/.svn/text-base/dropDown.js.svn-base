/**
 * Creates a DropDown list of <option> elements
 * from any given HTML <select> tag
 * 
 * Inheriting classes define the rest of the initialization
 * and action methods
 * 
 * @param {Object} args
 */

DropDown = Monomyth.Class.extend({
	init:function(args){
		this.DOM = args.location;
		this.options=args.options;
		
		this.DOM.attr("selectedIndex",args.start);
		this.dropDownChanged="dropDownChanged"+this.DOM.attr("id");
		
		this.setContents();
		
	},
setContents:function(e){
	//inheriting classes define this
},
updatePage:function(e){
	var obj=e.data.obj;
	obj.DOM.trigger(obj.dropDownChanged,[obj.DOM.attr("selectedIndex")]);
	//obj.dropDownChanged.fire(obj.DOM.selectedIndex);
},
updateSelf:function(e,index){
	e.stopPropagation();
	var obj=e.data.obj;
	//select the appropriate option
	$("#"+this.DOM.attr("id")+" option[value="+index+"]").attr('selected','selected');
	return false;
}
});

