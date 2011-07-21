

//function object to use for generating random IDS
function MakeRandomId(){
	var startseed=(Math.random())*1000;
	var endseed=startseed.toPrecision(3);
	return endseed;
}

/**
 * Loading Tiers
 * Loads scripts using the JQ .getScript()
 * 
 * 
 */
//FIRST TIER OF LOADING
//$.getScript("./lib/ArchWorkspace/ArchWorkspace.js",function(){
	//SECOND TIER OF LOADING
	$(function(){
		//create a loadscreen for users
		var load=$("<div class=\"load\"><p>Loading Interface...</p></div>");
		$("#workspace").append(load);
		var loadprogress=$("<div id=\"loadpBar\" class=\"testPBAR\"></div>");
		load.append(loadprogress);
		loadprogress.progressbar({value:25});
		/*
$.getScript("./lib/StateMgr/stateMgr.js");
		$.getScript("./lib/ArchieLightbox/ArchieLightbox.js");
		$.getScript("./lib/ArchSelect/ArchSelect.js");
		$.getScript("./lib/ArchProjectBar/ArchProjectBar.js");
		$.getScript("./lib/ArchDropDown/ArchDropDown.js");
		$("#loadpBar").progressbar('option','value','45');
		$.getScript("./lib/Archie_Panel/ArchiePanel.js");
		$.getScript("./lib/Crop/crop.js");		
		$.getScript("./lib/CropLayerBox/CropLayerBox.js");
		$("#loadpBar").progressbar('option','value','55');
		$.getScript("./lib/ArchPageText/ArchPageText.js");
		$.getScript("./lib/OverMap/ArchOverMap.js");
		$.getScript("./lib/OverlaySwitcher/OverlaySwitcher.js");
		$.getScript("./lib/ArchiePanelContent/TMSContent.js");
	
		$.getScript("./lib/TMSLayer/TMSLayer.js");
		
		$("#loadpBar").progressbar('option','value','75');
		$.getScript("./lib/CropLayer/CropLayer.js");
*/
		/*
$.getScript("./lib/TMSLayer/SubLayer.js",function(){
*/
		
		$("#loadpBar").progressbar('option','value','98');
				
			setTimeout(function(){
					$(function(){
						var data = $.ajax({
							async: false,
							dataType: "text",
							url: "./Global_Files/findDomain.php"
						}).responseText;
						
						data=data.split("%");
						var rp = data[0];
						IMGDIR = data[1];
						var xpath = data[2];
						//header=document.getElementById("header");
						$(".load").remove();
						var desktop = new ArchWorkspace({
							loc: "workspace",
							regpath: rp,
							imgdir: IMGDIR,
							xmlpath: xpath
						});

					});
				
			}, 200);
		});
	//});
//});

//$.getScript("./lib/ArchieLoad/ArchieGlobalFunctions.js");








