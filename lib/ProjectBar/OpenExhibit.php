<html>
<head>
<?php
/**
 * Creates OpenExhibit panel
 */
?>
</head>
	<body>
    	<div id="openWindow" class="openWindow">
        	<div class="window_closebar">   
            	<span class="window_title">Open an Existing Exhibit</span>
                <span id="openWindow_closea" class="window_close" />
            </div>
            <div class="window_body">
            	<div id="openWindow_select" class="window_select"></div>
            	<div class="viewForm">
                    <span id="openWindow_publicExhibits" class="viewChoice">Public Exhibits</span>
                    <span id="openWindow_myExhibits" class="viewChoice_hl">My Exhibits</span>
                </div>
            	<div class="proj_searchBox">
                    <input id="openWindow_searchInput" class="proj_searchInput" type="text" name="open_InputText"/>
                    <input id="openWindow_findButton" type="button" value="Find"/>
                </div>
            	<a id="openWindow_open" class="window_button">Open</a>
				<a id="openWindow_cancel" class="window_button">Cancel</a>
            </div>
    	</div>
    </body>
</html>