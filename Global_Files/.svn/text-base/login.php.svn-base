<?php
include_once('./php/archielogin/includes/functions.php');
include_once('./php/archielogin/includes/connect.php');
if (!isset($_SESSION['user'])) { // No username in session
$matches = array();
	//$arr = preg_match('/logout.php/', $_SERVER['SCRIPT_FILENAME'], $matches);

		if ( isset($_POST['username']) && isset($_POST['password'])) { // Form was submitted
	
			// Handle the form
			if ( (!empty ($_POST['username'])) && (!empty ($_POST['password'])) ) { // Nothing blank
				$username = $_POST['username'];
				$password = $_POST['password'];
				
				$user = loginAuth($username, $password);
				
				if ($user) { // User is authenticated
					beginSession($user);
					
					//header("Location: ".$_SERVER['REQUEST_URI']); // Redirect to clear POST
				} else {
					//drawLoginForm("Username and/or Password not found.");
				}
	
			} else { // Form fields left blank
				//drawLoginForm("Please complete both form fields and try again.");
			}
	
		} else { // Reaching the page for the first time
			//drawLoginForm();
		}
	
} else { // Already logged in, greet our guest
		
		//drawUserMenu();
	
}

?>