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


/**
 * Inherits from dropDown.js
 * 
 */

ArchDropDown=DropDown.extend({
	init:function(args){
		//call superclass
		this.$super(args);
		this.alreadySelected=null;
	},
	setContents:function(){
		for (i in this.options){
			var item = $("<option></option>");
			var ind=parseInt(i,10);
			item.attr("value",ind);
			item.attr("id",ind);
			item.text(this.options[i].pageName+" : "+this.options[i].pageSuffix);
			this.DOM.append(item);	
			this.DOM.bind("click",{obj:this,num:i},this.pageSelect);
		}
	},
	pageSelect:function(e){
		e.stopPropagation();
		
		var obj=e.data.obj;
		var num=e.data.num;
		
		if (!obj.alreadySelected) {
			obj.alreadySelected = obj.DOM.val();
			obj.DOM.trigger(obj.dropDownChanged,[obj.DOM.val()]);
		} else if(obj.alreadySelected!=obj.DOM.val()){
			obj.DOM.trigger(obj.dropDownChanged,[obj.DOM.val()]);
		}	
		return false;
	},
	updateSelf:function(i){
		
		//unselect previously selected item
		//$("#"+this.DOM.attr('id')+" option:selected").attr("selected","");
		//set the options so that the newly elected item takes precedence
		//$("#"+this.DOM.attr('id')+" option[val="+i+"]").attr("selected","selected");
		$("#"+this.DOM.attr('id')).val(i);
	}
});