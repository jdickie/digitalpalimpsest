<?php
/**
 * Create manifest xml file linking together pages in order
 * of undertext appearance
 */

if($_GET['path']){
	$v=(isset($_GET['v']))?strtolower($_GET['v']):'false';
	createFullUndertext($AUTHOR_WHO,$WORKS,$_GET['path'],($v=="true")?true:false);
}

function createFullUndertext($authors,$works,$path,$verbose){
	$contents=getContents($path);
	if($contents){
		
	}
}

function getContents(){
	
}

?>