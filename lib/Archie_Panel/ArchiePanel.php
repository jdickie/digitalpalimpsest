<?php
/**
 * Modified ArchiePanel.php
 */

if(isset($_GET['id'])&&isset($_GET['title'])){
	$prefix=htmlspecialchars($_GET['id'],ENT_NOQUOTES, "UTF-8");
	$title=htmlspecialchars($_GET['title'],ENT_QUOTES, "UTF-8");


?>


            <div id="<?php echo $prefix."_header" ?>" class="hd">
                        <div id="<?php echo $prefix."_quartoinfo" ?>" class="quartoInfo">
                            <span class="textLabelSpan"></span>
                            <a class="quartoInfoHeader"><?php echo stripslashes($title) ?></a>
                            <span id="<?php echo $prefix."_close" ?>" class="window_close" />
                        </div>
                        <div id="<?php echo $prefix."_controls" ?>" class="controls">
                            <div class="navControls"> 	
								<a id="<?php echo $prefix."home"; ?>" class="home archselect_button"><span class="textLabelSpan">Home</span></a>
                        	</div>    
							<div class="pageControls">
                                <span class="textLabelSpan">Image</span>
                                <a id="<?php echo $prefix."_pageBack" ?>" class="pageBack"></a>
                                <a id="<?php echo $prefix."_dropDown" ?>" class="dropDown">
                                    <select id="<?php echo $prefix."_select" ?>">
                                        
                                    </select>
                                </a>
                                <a id="<?php echo $prefix."_pageNext" ?>" class="pageNext"></a>
                            </div>
                            <div id="<?php echo $prefix."_zoomControls" ?>" class="zoomControls">
                                <span class="textLabelSpan">Zoom</span>
                                <a id="<?php echo $prefix."_zoomIn" ?>" class="zoomIn"></a>
                                <a id="<?php echo $prefix."_zoomOut" ?>" class="zoomOut"></a>
                            </div>	
                          <!-- <div id="<?php //echo $prefix."_opacityControls" ?>" class="opacityControls">
                                <span class="textLabelSpan">Opacity</span>
                                <a id="<?php //echo $prefix."_darker" ?>" class="darker"></a>
                                <a id="<?php //echo $prefix."_lighter" ?>" class="lighter"></a>
                            </div> -->
							<div class="cropControls">
								<span class="textLabelSpan">Crop</span>
								<a id="<?php echo $prefix."_crop"; ?>" class="crop"></a>
							</div>
							
                            <div id="<?php echo $prefix."_imageToggle" ?>" class="imageToggle">
                                <span class="textLabelSpan">View</span>
                                <a id="<?php echo $prefix."_showImage" ?>" class="showImage">Image</a>
                                <a id="<?php echo $prefix."_showText" ?>" class="showText">Text</a>
                            </div>
							<div id="<?php echo $prefix."_overlayToggle" ?>" class="overlayToggle">
								<span class="textLabelSpan">Hide/Show Layers:</span>
                                <a id="<?php echo $prefix."_layerDisplayToggle" ?>" class="hideSidebar"></a>
							</div>
                            <!-- <div id="<?php //echo $prefix."_opennotes" ?>" class="annoGroup">
                                <span class="textLabelSpan">Open Notes</span>
                                <a class="annoViewPref"></a>
                            </div>-->
                          
                            <div class="clear"></div>
                 	</div>
            </div>
            <div id="<?php echo $prefix."_content" ?>" class="panelBody">
                <div id="<?php echo $prefix."_contentBody" ?>" class="panelBodyContents clearfix">
                        
                        <div id="<?php echo $prefix."_overlaySwitcher" ?>" class="layers">
                            
							<div class="categories clearfix">
									<h3 class="item1">Move</h3>
									<h3 class="item2">Layer On/Off</h3>
									<h3 class="item3">Opacity</h3></div>
                            <ul id="<?php echo $prefix."_imgType1" ?>">
                                
                            </ul>
                            <!-- <h4>Imaging Type 2</h4>
                            <ul id="<?php //echo $prefix."_imgType2" ?>">
                                
                            </ul>-->
                        </div>
                        <div id="<?php echo $prefix."_mapdiv"?>" class="mapDiv">
                           <!-- <div id="<?php //echo $prefix."_ocontrol"?>" class="map_ocontrol">
                            	<img id="<?php //echo $prefix."_ocontrolimg"?>" src="" width="128px" height="128px"/>
                            </div> -->
                        </div>
                        <div id="<?php echo $prefix."_pagetext"?>" class="leaf">
                            
                        </div>
                        
                        <div class="clear"></div>
                        
                 </div>
            </div>
            <div id="<?php echo $prefix."_footer" ?>" class="ft"></div>
         
		 
<?php
} else {
	
}
?>