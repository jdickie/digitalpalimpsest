<?php
//Verification for passed 
//GET verify literal
include_once('../../Global_Files/remoteCalling.php');
include_once('./assets/regBlackBox.php');

if($_GET['verify'] && $_GET['user']) {
	$verify = $_GET['verify'];
	$qry = sprintf("SELECT user.uID, user.verify FROM user WHERE user.verify='%s';", 
	
		mysql_real_escape_string($verify)
	);
	
	$result = mysql_query($qry);
	$success = mysql_affected_rows();
	if($success > 0) {
		//get user id
		$row=mysql_fetch_assoc($result);
		$id = $row['uID'];
		
		$qry = sprintf("UPDATE Archie_login.user SET verify='y' WHERE user.uID='%s' LIMIT 1;",
			mysql_real_escape_string($id)
		);
		mysql_query($qry);
		$success = mysql_affected_rows();
		if($success > 0) {
			//send to main page with message
			redirectTo('../../index.php', 'Registration succesfully completed');
		}
	} else {
		//echo "<p>Sorry, please <a href=\"../../index.php\">go back</a> and register again.</p>";
		//$_SESSION['message'] = "Error in database record retrieval";
		redirectTo('../../register.php', "Error retrieving your record");
		dieGracefully($_SESSION['message']);
	}
} else {
	
	//echo "<p>Sorry, please <a href=\"../../index.php\">go back</a> and register again.</p>";
	//$_SESSION['message'] = "Error in database record retrieval";
	redirectTo('../../register.php', "Error retrieving your record");
	dieGracefully($_SESSION['message']);
	
}


?>