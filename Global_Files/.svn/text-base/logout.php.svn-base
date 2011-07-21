<?php
	include_once('./globalSettings.php');
	include_once('./session.php');
	include_once('./connect.php');
	
	// Destroy the session variables
	//session_start();
	if(isset($_POST['logout'])){
		unset ($_SESSION);
		session_destroy();
		
		if(isset($_SERVER['SCRIPT_FILENAME'])) {
			
		}
	}
?>