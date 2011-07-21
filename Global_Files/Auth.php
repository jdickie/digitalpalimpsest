<?php
/**
 * Authentication of Users into Archimedes Project
 * 
 * Handled by the LoginBar.js Object
 */

include_once('./globalSettings.php');
include_once('./session.php');
include_once('./connect.php');


/**
 * HANDLE THE POST REQUEST FROM LoginBar.js
 */
if ( isset($_POST['username']) && isset($_POST['password'])) { // Form was submitted
			
			// Handle the form
			if ( (!empty ($_POST['username'])) && (!empty ($_POST['password'])) ) { // Nothing blank
				
				$username = $_POST['username'];
				$password = $_POST['password'];
				
				$user = loginAuth($username, $password);
				
				if ($user) { // User is authenticated
					
					beginSession($user);
					echo "True%".$_SESSION['user'].'%'.$_SESSION['uID'];
					// New flag to hold welcome message until after body tag is opened
					//header("Location: ".$_SERVER['REQUEST_URI']); // Redirect to clear POST

					//$showWelcome = true;	// New flag to hold welcome message until after body tag is opened

					// TEMPORARILY MOVED to INDEX.PHP:
					//echo "<div id=\"welcome\" class=\"loginLink\">Welcome, ". $_SESSION['user']."</div>";
					

					
				} else {
					echo "False%Username and/or Password not found";
					//drawLoginForm("Username and/or Password not found.");
				}
	
			} else { // Form fields left blank
				//drawLoginForm("Please complete both form fields and try again.");
			}
	
		} else { // Reaching the page for the first time OR page was redirected
			echo "False%Username and/or Password not found";
			//drawLoginForm();

			/*if($_SESSION['uID']){
				$showWelcome=true;
				//echo "<div id=\"welcome\" style=\"display: none;\"></div>";
			}*/

		} 
		
		if(isset($_POST['logout'])){
			// Destroy the session variables
			session_start();
			//unset($_SESSION);
			session_destroy();
			header("Location: ".$_SERVER['REQUEST_URI']); // Redirect to clear POST
			
		}


// -------------------------------------------------------------------------//
//   User Management
// -------------------------------------------------------------------------//
function loginAuth($user,$pass) { // Returns username if found
	$pass .= substr($user, 1, 2);
	
	$qry = sprintf("SELECT `login`,`uID` FROM `user` 
		WHERE `login` = '%s' AND `password` = MD5('%s') AND `verify` = 'y'",
		mysql_real_escape_string($user),
		mysql_real_escape_string($pass)
	);
	
	$result = mysql_query($qry);
	if (mysql_num_rows($result)) {
		$row = mysql_fetch_row($result);
		
		return $row[0];
		
	}
}

function beginSession($user) {
	$_SESSION['user'] = $user;
	$_SESSION['uID'] = getUserId($user);
	//uncover previously opened projects
	$qry = sprintf("SELECT project.p_title, project_user.p_id FROM project_user, project 
	WHERE project_user.u_id='%s' AND project_user.state='open' AND project.p_id=project_user.p_id;",
		mysql_real_escape_string($_SESSION['uID'])
	);
	$result = mysql_query($qry);
	
	if(mysql_num_rows($result) > 0) {
		$row = mysql_fetch_assoc($result);
		$_SESSION['project'] = $row["p_title"];
		$_SESSION['pID'] = $row["p_id"];
		
	}
	
	/*
$qry=sprintf("SELECT anno_set.set_id FROM anno_set INNER JOIN anno_project ON anno_set.set_id=anno_projet.set_id WHERE anno_set.set_state='open' 
		AND anno_project.p_id='%s';",
			mysql_real_escape_string($pid)
		);
	echo $qry;
	$result=mysql_query($qry);
while($row=mysql_fetch_assoc($result)){
		$_SESSION['annoName']=$row['set_id'];
	}
*/
}

function getUserId($user) {
	$qry = sprintf("SELECT `uID` FROM `user`
		WHERE `login` = '%s'",
		mysql_real_escape_string($user)
	);
	$result = mysql_query($qry);
	$row = mysql_fetch_row($result);
	return $row[0];
}

function securePage($message=null) {
	if (!isset($_SESSION['user'])) {
		$die = $message ? $message : "You must log in to view this content.";
		dieGracefully($die);
	} else {
		return true;
	}
}

?>