/**
 * Inherits from OverMap.js
 * 
 */

ArchOverMap=OverMap.extend({
	init:function(args){
	this.$super(args);
	this.imageurl=args.url;
	
},
	loadImage:function(obj){
		
	},
	setImageUrl:function(url){
		this.imageurl=url+"/0/0/0.png";
		this.image.src=this.imageurl;
	}
});
//extendOS(ArchOverMap,OverMap);
