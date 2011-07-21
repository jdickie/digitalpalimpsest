<?php

// Connects to database
ob_start();

function db_connect ($dBHOST, $uSER, $pASS, $dBNAME) {
	$db_host = $dBHOST;
	$db_user = $uSER;
	$db_pass = $pASS;
	$db = $dBNAME;
	
	$connect = mysql_connect($db_host, $db_user, $db_pass) or die('Could not connect to database: ' . mysql_error());
	
	$select_db = mysql_select_db($db);
	
}

db_connect($dBHOST, $uSER, $pASS, $dBNAME);

?>