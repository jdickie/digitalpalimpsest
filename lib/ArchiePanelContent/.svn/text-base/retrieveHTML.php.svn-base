<?php
//retrieveHTML.php
//Gets HTML file from ./html folder and echos contents


$vURI = $_GET['vURI'];
$rURI = $_GET['rURI']; 
$file = fopen($vURI, 'r');
$text = "<div class=\"leaf\">\n
				<div class=\"page1\">\n";
		while(!feof($file)) {	
			$text .= fgets($file, 1024);
		}
		
		
		fclose($file);
		$text .= "</div>\n
			<div class=\"page2\">\n";

			if($file = fopen($rURI, 'r')) {
			while(!feof($file)) {	
				$text .= fgets($file, 1024);
			}
			fclose($file);
			} else {
				$text .= "<div class=\"text\"><div class=\"empty\"></div></div>";
			}
		 
		$text .= "</div>\n
		</div>\n";
		
		//echo text without white space
		echo trim($text);




?>