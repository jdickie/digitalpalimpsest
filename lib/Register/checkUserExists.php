<?php
/**
 * Tests whether a given username is already taken or 
 * not
 * 
 * returns True = 'not taken'
 * returns False = 'taken'
*/

include_once("../../Global_Files/remoteCalling.php");

function checkAUser(){
	$qry=sprintf("SELECT user.uID FROM user WHERE user.login='%s';",
		mysql_real_escape_string($_POST['username'])
	);
	$result=mysql_query($qry);
	$success=mysql_num_rows($result);
	echo ($success>0)?"False":"True";
}
checkAUser();


?>