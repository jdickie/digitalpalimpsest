<?php
include_once('./Global_Files/session.php');
include_once('./Global_Files/globalSettings.php');

include_once('./header.php');
?>
	<body>
		
		<div id="header">
			
			<a href="./index.php"><img src="images/logo.gif" alt="Archimedes Palimpsest Project Logo" style="float:left" /></a>
			<div id="infoBoxMain" class="infoBoxMain"></div>
			
		</div>
		
		<div id="workspace">

				<?php 
				include_once('./lib/ProjectBar/ProjectBar.php'); 
				include_once('./lib/ArchSelect/ArchSelect.php');      
				//include_once('./lib/ProjectBar/OpenExhibit.php');
				//include_once('./lib/ProjectBar/SaveExhibit.php');
				
				?>
		</div>
    </body>
</html>