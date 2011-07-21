<?php

/*CloseWindow.php
 * for Closing windows
 * phpCall in panel.js issues this script
 */
require_once('../../php/archielogin/includes/session.php');
require_once('../../php/archielogin/includes/connect.php');

closeWindow();

function closeWindow() {
	//update database that window is closed
	/*
$qry = sprintf("UPDATE window, project_window 
	SET window.state='close' 
	WHERE window.htmlID='%s' AND window.w_id=project_window.w_id 
	AND project_window.p_id='%s';",

	mysql_real_escape_string($_GET['panel']),
	mysql_real_escape_string($_SESSION['pID'])
	
	);
	*/
	$qry = sprintf("DELETE window.*, project_window.* 
	FROM window, project_window
	WHERE window.w_id=project_window.w_id AND project_window.p_id='%s' AND window.htmlID='%s';",
	mysql_real_escape_string($_SESSION['pID']),
	mysql_real_escape_string($_GET['panel'])
	);

	$response = mysql_query($qry);
	
	
}

?>