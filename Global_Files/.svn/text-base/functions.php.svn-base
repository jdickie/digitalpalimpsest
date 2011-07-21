<?php
//---------------------------
//Functions.php
//For Archie Login
//---------------------------

include_once('session.php');

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
	
	$qry=sprintf("SELECT anno_set.set_id FROM anno_set INNER JOIN anno_project ON anno_set.set_id=anno_projet.set_id WHERE anno_set.set_state='open' 
		AND anno_project.p_id='%s';",
			mysql_real_escape_string($pid)
		);
	echo $qry;
	$result=mysql_query($qry);
	while($row=mysql_fetch_assoc($result)){
		$_SESSION['annoName']=$row['set_id'];
	}
	//header("Location: " . $_SERVER['HTTP_REFERER']);
}
/*
function loadPrevProject($pname, $pid) {
		
		//set up global variables
		$_SESSION['project'] = $pname; 
		$_SESSION['pID'] = $pid;
		
		//Set state in project table
		$qry = sprintf("UPDATE Archie_login.project_user SET project_user.state='open' 
		WHERE project_user.p_id='%s' AND project_user.u_id='%s';",
			mysql_real_escape_string($pid),
			mysql_real_escape_string(getUserId($_SESSION['user']))
		);
		$result = mysql_query($qry);
		
		//load windows that are open
		$qry = sprintf("SELECT window.* FROM window, project_window, project_user
		WHERE project_window.p_id='%s' AND project_user.p_id=project_window.p_id AND project_user.u_id='%s' AND window.w_id=project_window.w_id
		AND project_window.state='open';",
			mysql_real_escape_string($_SESSION['pID']),
			mysql_real_escape_string($_SESSION['uID'])
		);
		$result = mysql_query($qry);
		
		$windows = array();
		while($row = mysql_fetch_assoc($result)) { //make array of arrays
			array_push($windows, $row); 
		}
		
		for($i=0;$i<count($windows);$i++) {
			$temp = $windows[$i];
			echo $temp["w_xy"] . "-" . $temp["htmlID"] . "-" . $temp["curPage"] . ";";
		}
		
	}
*/
/*
function drawLoginForm($error=null) {
	// Display the form
	require_once("./php/archielogin/forms/form_login.php");	
	
	// display any error messages
	if (isset($error)) {
		echo "<p class=\"login_error\">$error <a href=\"help.php?t=password\">Lost password?</a></p>\n";
	}
}

function drawUserMenu() {
	require_once("./php/archielogin/forms/menu_user.php");
}
*/

function getUserId($user) {
	$qry = sprintf("SELECT `uID` FROM `user`
		WHERE `login` = '%s'",
		mysql_real_escape_string($user)
	);
	$result = mysql_query($qry);
	$row = mysql_fetch_row($result);
	return $row[0];
}

/*
function getUsername($m_id) {
	$qry = sprintf("SELECT `u_user` FROM `user`
		WHERE `u_id` = '%d'",
		mysql_real_escape_string($m_id)
	);
	$result = mysql_query($qry);
	$row = mysql_fetch_row($result);
	return $row[0];
}
*/
		
function securePage($message=null) {
	if (!isset($_SESSION['user'])) {
		$die = $message ? $message : "You must log in to view this content.";
		dieGracefully($die);
	} else {
		return true;
	}
}
	
	
	
// -------------------------------------------------------------------------//
//   User Registration
// -------------------------------------------------------------------------//

function generateCode($length=12) { // Generates Verification Code for registration
	$chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	$code = "";
	$clen = strlen($chars) - 1;
	while (strlen($code) < $length) {
		$code .= $chars[mt_rand(0,$clen)];
	}
	return $code;
}

function getDateTime() {
	return date("Y-m-d H:i:s");
}

function registerUser() { // Creates new user record with verification code
	$username = $_POST['m_user'];
	$password = $_POST['m_pass'];
	$dob = $_POST['m_dob_y']."-".$_POST['m_dob_m']."-".$_POST['m_dob_d'];
	$email = $_POST['m_email'];
	$password .= substr($username, 1, 2);
	$verify = generateCode();
	$m_first = (!empty($_POST['m_first'])) ? $_POST['m_first'] : null;
	$m_middle = (!empty($_POST['m_middle'])) ? $_POST['m_middle'] : null;
	$m_last = (!empty($_POST['m_last'])) ? $_POST['m_last'] : null;
	$m_affiliation = (!empty($_POST['m_affiliation'])) ? $_POST['m_affiliation'] : null;
	
	// Insert query
	$qry = sprintf("INSERT INTO user ( 
		uID, fname, middle, lname, login, password, dob, email, affiliation, verify)
	VALUES (
		'', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s');",
		mysql_real_escape_string($m_first),
		mysql_real_escape_string($m_middle),
		mysql_real_escape_string($m_last),
		mysql_real_escape_string($username),
		md5(mysql_real_escape_string($password)),
		mysql_real_escape_string($dob),
		mysql_real_escape_string($email),
		mysql_real_escape_string($m_affiliation),
		mysql_real_escape_string($verify)
	);
	$result = mysql_query($qry);
	$success = mysql_affected_rows();
	echo $qry;
	// If successful, email the user with their verification code
	if ($success > 0) {
		$confirm = send_confirmation($email, $username,$verify);
		if ($confirm) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

function send_confirmation($email, $user,$code) { // Emails verification code to user
	$to = $email;
	
	$subject = "Archie Login :: Registration Succesful!";
	$body = "In order to complete your registration, create projects, etc., please click on the link below:<br />
	http://localhost:8888/quartos/php/archielogin/verify.php?verify=" . $code . "&user=" . $user
	
	;
	$headers = "From: Archie Login <no-reply@givtu.com>\r\n" . "X-Mailer: php";

	if (mail($to, $subject, $body, $headers)) {
		return true;
	} else {
		return false;
	}
}

function checkCaptcha() {
	require_once('./php/archielogin/includes/recaptchalib.php');
	$privatekey = "6LfZrgAAAAAAANgBHxq2BOJZsXUf3RFMmY-KPWae";
	$resp = recaptcha_check_answer ($privatekey,
                                $_SERVER["REMOTE_ADDR"],
                                $_POST["recaptcha_challenge_field"],
                                $_POST["recaptcha_response_field"]);

	if (!$resp->is_valid) {
	  die ("The reCAPTCHA wasn't entered correctly. Go back and try it again." .
	       "(reCAPTCHA said: " . $resp->error . ")");
	}
}

function valid_email($email) {
	return (eregi("^[a-z0-9]+([_\\.-][a-z0-9]+)*"."@([a-z0-9]+([\.-][a-z0-9]{1,})+)*$", $email, $regs)) ? true : false;
}

// -------------------------------------------------------------------------//
//   For Retrieving User Info
// -------------------------------------------------------------------------//

function setProject($pName) {
	
	if(!$_SESSION['project']) {
		session_register('project');
	}
	$_SESSION['project'] = $pName;
	$id = getProjectId($pName);
	$qry = sprintf("SELECT * FROM project WHERE project.p_id='%s';",
		mysql_real_escape_string($id)
	);
	$result = mysql_query($qry);
	$row = mysql_fetch_assoc($result);
	$_SESSION['curPage'] = $row['curPage'];
	
}
/*
function closeProject() {
	$project = getProjectId($_SESSION['project']);
	$qry = sprintf("UPDATE Archie_login.project SET project.curPage='%s' WHERE project.p_id='%s';",
		mysql_real_escape_string($_SESSION['curPage']),
		mysql_real_escape_string($project)
	);
	$result = mysql_query($qry);
	$_SESSION['project'] = "";
	clearCoords();
	
}
*/
function loadCoords($pname, $page) {
	$pID = getProjectId($pname);
	$qry = sprintf("SELECT imagetag.isetID, imagetag.i_coords FROM imagetag, project_imagetag 
	WHERE project_imagetag.pID='%s' AND project_imagetag.isetID=imagetag.isetID AND imagetag.i_curPage='%s'
	GROUP BY isetID;",
		mysql_real_escape_string($pID),
		mysql_real_escape_string($page)
	);
	$result = mysql_query($qry);
	return $result;
}

/*
function getUserProjects($username) {
	$user = getUserId($username);
	$query = sprintf("SELECT project.p_title 
	FROM project, project_user
	WHERE project.p_id=project_user.p_id AND project_user.u_id='%s';", 
		mysql_real_escape_string($user));
	
	$result = mysql_query($query);

	//running the while loop
	while ($row = mysql_fetch_assoc($result)){
	
	$Name = $row['p_title'];
	//$file = $row['FileName'];
	
	//$ID = $row['ID'];
	  if($Name){
	  	    echo "<div  onclick=\"selectfile('$ID', this)\" class='fileitem' id='file$ID'>";
			echo "<a>".$Name."</a>\n";
			$ID = getProjectId($Name);
			$query = sprintf("SELECT imagetag.i_coords FROM imagetag, project_imagetag 
			WHERE project_imagetag.pID='%s' AND imagetag.isetID=project_imagetag.isetID
			ORDER BY imagetag.isetID;",
				mysql_real_escape_string($ID)	
				);
			
			$token = mysql_query($query);
			
			if (mysql_num_rows($token)>0){
				echo "<select id='select$ID'>";
			while ($nrow = mysql_fetch_assoc($token)){
				
				//echo "<option>".$timerow['Time']."</option>";
				$coord = $nrow['i_coords'];
				echo "<option value=\"\">$coord</option>";
			}
			
			echo "</select>";
			}
			echo "</div>";
	 }
	}
	
	
}
*/

function loadDiffs($tagSetName,$fstring,$time){
	
$query = "SELECT * FROM TextDiffs JOIN TagSet WHERE TagSet.Name='$tagSetName' AND TextDiffs.TagSetID=TagSet.ID AND TextDiffs.Time='$time' ORDER BY offset DESC;";

$result = mysql_query($query);

//$fstring = implode("",$lines1);

//echo strlen($fstring)."<br/><hr>";
while ($row = mysql_fetch_assoc($result)){

$type = $row['Type'];

$offset = $row['Offset'];
$length = $row['Length'];

//$replacement = str_replace("\0", "\n",$row['Replacement']);
$replacement = $row['Replacement'];
$level = $row['Level'];
//echo $offset;
$start = substr($fstring,0,$offset);
if ($type=="A"){
$length = 0;
}

$end = substr($fstring,($offset+$length));

//if (!(($type=="C") && ($level=="L"))){


switch ($type) {
          	
            case 'A':
            	if ($level=="L"){
            	$replacement = "\n$replacement";
            	}
            	
                $fstring = $start . $replacement . $end;
                break;

            case 'D':
                $fstring = $start . $end;
                break;

            case 'C':
                $fstring = $start . $replacement . $end;
                break;

            }
}
return $fstring;
}

function getProjectId($p_title) {
	$qry = sprintf("SELECT p_id FROM project WHERE project.p_title='%s';", mysql_real_escape_string($p_title));
	$result = mysql_query($qry);
	$row = mysql_fetch_row($result);
	return $row[0];
}

function processProject($user) {
	if(!empty($_POST['projectname'])) {
		
		$p_title = $_POST['projectname'];
		$p_desc = (!empty($_POST['projectdesc'])) ? $_POST['projectdesc'] : null;
		
		$qry = sprintf("INSERT INTO project (p_id, p_title, p_desc) VALUES 
		('', '%s', '%s');", 
		
		mysql_real_escape_string($p_title),
		mysql_real_escape_string($p_desc)
		
		);
		
		$result = mysql_query($qry);
		$success = mysql_affected_rows();
		if($success > 0) {
			$u_id = getUserId($user);
			$permission = 'a'; 
			$p_id = getProjectId($p_title);
			
			
			$qry = sprintf("INSERT INTO project_user (p_id, u_id, permission) VALUES ('%s', '%s', '%s');", 
			
				mysql_real_escape_string($p_id),
				mysql_real_escape_string($u_id),
				mysql_real_escape_string($permission)
			);
			$result = mysql_query($qry);
			$_SESSION['message'] = "Your project, " . $p_title .  ", was saved successfully";
			redirectToSelf();
		} else {
			//handle errors in MySQL insert here
		}
	} else {
		echo "Please Enter in a Project Name.";
		return false;
	}
	
	
	
}

function drawProjectCreate() {
	$output = "
			\n<div class=\"projectcreate\">
				<form class=\"projectcreate\" method=\"post\" action=\"\" name=\"createproject\">
					<label class=\"projectcreate\" for=\"projectname\">Name for the Project:</label>
					<input class=\"projectcreate\" type=\"text\" name=\"projectname\" maxlength=\"255\" length=\"25\"/>
					<label class=\"projectcreate\" for=\"projectdesc\">Short Description of the Project:</label>
					<input class=\"projectcreate\" type=\"text\" name=\"projectdesc\" maxlength=\"128\" length=\"25\"/><br />
					<input class=\"projectcreate\" type=\"submit\" name=\"submit\" value=\"Create\"/>
					<input class=\"projectcreate\" type=\"reset\" value=\"Start Over\"/>
				</form>
			</div>\n
	";
	echo $output;
}

// -------------------------------------------------------------------------//
//   Debug
// -------------------------------------------------------------------------//

function debugArray($array) {
	echo "<pre>\n";
	print_r($array);
	echo "</pre>\n";
}

function br2nl($text) {
    return  preg_replace('/<br\\\\s*?\\/??>/i', "\\n", $text);
}

// -------------------------------------------------------------------------//
//   For Both
// -------------------------------------------------------------------------//

function redirectToSelf($qry=true) {
	$location = $_SERVER['REQUEST_URI'];
	if ($qry) {
		if (!empty($_SERVER['QUERY_STRING'])) {
			$location .= "?".$_SERVER['QUERY_STRING'];
		}
	}
	header("Location: $location");
}

function redirectTo($location, $message=false) {
	if ($message) $_SESSION['message'] = $message;
	
	header("Location: $location");
}

function getSystemMessages() {
	if (isset($_SESSION['message'])) {
		echo $_SESSION['message'];
		unset($_SESSION['message']);
		return true;
	} else {
		echo "";
		return false;
	}
}

function unsetSystemMessages() {
	if (isset($_SESSION['message'])) {
		unset($_SESSION['message']);
	}
}

function dieGracefully($message=null) {
	echo ($message) ? "<p class=\"die_message\">$message</p>\n" : null;
	//include ("theme/footer.php");
	redirectTo("./register.php", $message);
	die();
}

function functionResult($qry) {
	$result = mysql_query($qry);
	$numrows = mysql_num_rows($result);
	if ($numrows > 0) {
		$row = mysql_fetch_assoc($result);
		return $row;
	} else {
		return false;
	}
}

function functionResults($qry) {
	$result = mysql_query($qry);
	$numrows = mysql_num_rows($result);
	if ($numrows > 0) {
		$result_array = array();
		while ($row = mysql_fetch_assoc($result)) {
			$result_array[] = $row;
		}
		return $result_array;
	} else {
		return false;
	}
}


?>