

OverMap=Monomyth.Class.extend({
	init:function(args){
		this.panelid=args.panelid;
		this.DOM=$("#"+this.panelid+"_ocontrol");
		this.image=$("#"+this.panelid+"_ocontrolimg");
		this.imageurl=args.imageurl;
		this.mapwidth=args.mapwidth;
		this.mapheight=args.mapheight;
		this.rect=$("<div></div>");
		this.DOM.append(this.rect);
		this.DOM.attr("id",function(arr){return "rect"+arr;});
		//YAHOO.util.Dom.generateId(this.rect,"rect");
		this.rect.addClass("ocontrol_boundingbox");
		//listeners
		this.boxMoved="boxMoved"+this.panelid;
		this.DOM.bind("click",{obj:this},this.handleClick);
		this.handleRectAvailable(this);
	},
	handleRectAvailable:function(obj){
		/*
obj.rectDrag=new YAHOO.util.DD(obj.rect.id);
		obj.rectDrag.on("dragEvent",function(e,obj){
			YAHOO.util.Event.stopPropagation(e);
			var x=parseInt(YAHOO.util.Dom.getStyle(obj.rect.id,'left'));
			var y=parseInt(YAHOO.util.Dom.getStyle(obj.rect.id,'top'));
			var mapx=(x*obj.mapwidth)/parseInt(YAHOO.util.Dom.getStyle(obj.DOM.id,'width'));
			var mapy=(y*obj.mapheight)/parseInt(YAHOO.util.Dom.getStyle(obj.DOM.id,'height'));
			obj.boxMoved.fire([mapx,mapy]);
		},obj);
*/
	},
	handleClick:function(e,obj){
		e.stopPropagation();
		//YAHOO.util.Event.stopPropagation(e);
	},
	setDimensions:function(e,pass,args){
		args.mapwidth=pass[0].width;
		args.mapheight=pass[0].height;
	},
	setBoxLoc:function(e,pass){
		var obj=e.data.obj;
		var x=pass[0].xy.x;
		var y=pass[0].xy.y;
		args.mapwidth=pass[0].mapw;
		args.mapheight=pass[0].maph;//alert(x+', '+y);
		if (x && y) {
			var ovx=(x*obj.DOM.width());
			var ovy=(y*obj.DOM.height());
			obj.rect.left(ovx);
			obj.rect.top(ovy);
			//var ovx = (x * parseInt(YAHOO.util.Dom.getStyle(args.DOM.id, 'width'))) / args.mapwidth;
			//var ovy = (y * parseInt(YAHOO.util.Dom.getStyle(args.DOM.id, 'height'))) / args.mapheight;
			//YAHOO.util.Dom.setStyle(args.rect.id, 'left', ovx + 'px');
			//YAHOO.util.Dom.setStyle(args.rect.id, 'top', ovy + 'px');
			//alert('setboxloc xy: '+x+', '+y+' oxy: ' + ovx + ', ' + ovy+' map dims: '+args.mapwidth+', '+args.mapheight);
		}
	}
});


