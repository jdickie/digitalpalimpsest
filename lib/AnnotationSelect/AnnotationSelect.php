<?php
	$prefix=htmlspecialchars($_GET['id'],ENT_NOQUOTES, "UTF-8");
?>	
	
	<div id="<?php echo $prefix."_closebar"?>" class="window_closebar">
		<span id="<?php echo $prefix."_windowtitle"?>" class="window_title">Open Notes</span>
        <span id="<?php echo $prefix."_close"?>" class="window_close" />
	</div>
    <div id="<?php echo $prefix."_windowbody"?>" class="window_body">
    	<form id="<?php echo $prefix."_viewform"?>" class="viewForm">
        	<span id="<?php echo $prefix."_publicsets"?>" class="viewChoice">Public Sets</span>
            <span id="<?php echo $prefix."_mysets"?>" class="viewChoice_hl">My Sets</span>
        </form>
        <div id="<?php echo $prefix."_windowselect"?>" class="window_select">
       		 <div id="<?php echo $prefix."_fileitem"?>" class="fileitem">Must be logged in to use this feature</div>
		</div>
        <div id="<?php echo $prefix."_searchbox"?>" class="searchBox">
        	<input id="<?php echo $prefix."_searchtext"?>" type="text" />
            <input id="<?php echo $prefix."_searchsubmit"?>" type="submit" value="Find" />
        </div>
        <a id="<?php echo $prefix."_newset"?>" class="window_button">Create New Set</a>
		<a id="<?php echo $prefix."_importset"?>" class="window_button">Import Set</a>
</div>