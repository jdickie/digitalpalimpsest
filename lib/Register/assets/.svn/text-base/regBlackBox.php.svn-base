<?php
/**
 * following are registration functions formerly located in
 * functions.php
 * 
 */

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

function registerUser($path) { // Creates new user record with verification code
	$username = $_POST['m_user'];
	if(checkAUser($username)){
		$_SESSION['message']="Username $username already exists, please choose another.";
		return false;
	} else {
	
		$password = $_POST['m_pass'];
		$dob = $_POST['m_dob_y']."-".$_POST['m_dob_m']."-".$_POST['m_dob_d'];
		$email = $_POST['m_email'];
		$password .= substr($username, 1, 2);
		if(checkAPassword($password)){
			$verify = generateCode();
			$m_first = (!empty($_POST['m_first'])) ? $_POST['m_first'] : null;
			$m_middle = (!empty($_POST['m_middle'])) ? $_POST['m_middle'] : null;
			$m_last = (!empty($_POST['m_last'])) ? $_POST['m_last'] : null;
			$m_affiliation = (!empty($_POST['m_affiliation'])) ? $_POST['m_affiliation'] : null;
			
			// Insert query
			$qry = sprintf("INSERT INTO user (uID, fname, middle, lname, login, password, dob, email, affiliation, verify)
			VALUES ('', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s');",
				mysql_real_escape_string($m_first),
				mysql_real_escape_string($m_middle),
				mysql_real_escape_string($m_last),
				mysql_real_escape_string($username),
				md5($password),
				mysql_real_escape_string($dob),
				mysql_real_escape_string($email),
				mysql_real_escape_string($m_affiliation),
				mysql_real_escape_string('y')
			);
			$result = mysql_query($qry);
			$success = mysql_affected_rows();
			
			// If successful, email the user with their verification code
			if ($success > 0) {
				$_SESSION['user']=$username;
				$_SESSION['uID']=mysql_insert_id();
				createUserDefaults($username, mysql_insert_id());
				return true;
			} else {
				$_SESSION['message']="Error in entering data - check that your fields are entered correctly.";
				return false;
			}
		} else {
			$_SESSION['message']="Please use a different password";
		}
	}
}
/**
 * Create default exhibit and 
 * annotation set which the user
 * automatically saves to
 * @return 
 * @param $name Object
 * @param $id Object
 */
function createUserDefaults($name, $id){
	$set_name=$name."_default"; //name for annotation sets and exhibits is username + _default
	$set_id=$id.mt_rand(1,800); //randomly generated id of user ID + randomly generated number
	$qry=sprintf("INSERT INTO anno_set (set_id,set_name,set_desc,set_security,set_state) VALUES ('%s','%s','%s','%s','%s');",
		mysql_real_escape_string($set_id),
		mysql_real_escape_string($set_name),
		mysql_real_escape_string("This is your default annotation set and it is set to 'private'. You can create others."),
		mysql_real_escape_string("private"),
		mysql_real_escape_string("open")
	);
	
	$result=mysql_query($qry);
	
	$qry=sprintf("INSERT INTO set_user (annosetuserid,set_id,u_id) VALUES ('','%s','%s');",
		mysql_real_escape_string($set_id),
		mysql_real_escape_string($id)
	);
	
	$result=mysql_query($qry);
	//set up exhibit default
	$qry=sprintf("INSERT INTO project (p_id,p_title,p_desc) VALUES ('','%s','%s');",
		mysql_real_escape_string($set_name),
		mysql_real_escape_string("This is your default exhibit. You can make others.")
	);
	
	$result=mysql_query($qry);
	$p_id=mysql_insert_id();
	$qry=sprintf("INSERT INTO project_user (p_id,u_id,permission,state) VALUES ('%s','%s','%s','%s');",
		mysql_real_escape_string($p_id),
		mysql_real_escape_string($id),
		mysql_real_escape_string("w"),
		mysql_real_escape_string("close")
	);
	
	$result=mysql_query($qry);
}

function send_confirmation($email, $user,$code, $path) { // Emails verification code to user
	$to = $email;
	
	$subject = "Archimedes Login :: Registration Successful!";
	$body = "In order to complete your registration, create projects, etc., please click on the link below:<br />
	".$path."/lib/Register/assets/verify.php". $code . "&user=" . $user."<br/><br/>DO NOT REPLY TO THIS EMAIL"; 
	
	$headers = "From: Archimedes Registration <no-reply@archimedes.com>\r\n" . "X-Mailer: php";

	if (mail($to, $subject, $body, $headers)) {
		return true;
	} else {
		return false;
	}
}

function checkCaptcha() {
	require_once('./lib/Register/assets/recaptchalib.php');
	$privatekey = "6Lfy2gcAAAAAACtRq6wuYy09bsGEDWfbAKO76kre";
	$resp = recaptcha_check_answer ($privatekey,
                                $_SERVER["REMOTE_ADDR"],
                                $_POST["recaptcha_challenge_field"],
                                $_POST["recaptcha_response_field"]);

	if (!$resp->is_valid) {
		//display error message
		$_SESSION['message']="The reCAPTCHA wasn't entered correctly. Please try again." .
	       "(reCAPTCHA said: " . $resp->error . ")";
		return false;
	 /*
 die ("The reCAPTCHA wasn't entered correctly. Go back and try it again." .
	       "(reCAPTCHA said: " . $resp->error . ")");
*/
	} else {
		return true;
	}
}

function valid_email($email) {
	return (eregi("^[a-z0-9]+([_\\.-][a-z0-9]+)*"."@([a-z0-9]+([\.-][a-z0-9]{1,})+)*$", $email, $regs)) ? true : false;
}

function redirectToSelf($qry=true) {
	$location = $_SERVER['REQUEST_URI'];
	/*
if ($qry) {
		if (!empty($_SERVER['QUERY_STRING'])) {
			$location .= "?".$_SERVER['QUERY_STRING'];
		}
	}
*/
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
	echo ($message) ? "$message\n" : null;
	//include ("theme/footer.php");
	redirectTo("./register.php", $message);
	die();
}
function checkAUser($user){
	$qry=sprintf("SELECT user.uID FROM user WHERE user.login='%s';",
		mysql_real_escape_string($user)
	);
	$result=mysql_query($qry);
	$success=mysql_num_rows($result);
	if($success>0){
		return true;
	} else {
		return false;
	}
}
function checkAPassword($pass){
	$qry=sprintf("SELECT user.uID FROM user WHERE user.password='%s'",
		md5($pass)
	);
	$result=mysql_query($qry);
	if(mysql_num_rows($result)>0){
		return false;
	} else {
		return true;
	}
}

?>