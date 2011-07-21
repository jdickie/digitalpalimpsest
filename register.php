<?php
		//include necessary PHP functions
		if (isset($_POST['submit'])) { // Has the form been submitted?
			
			include_once('./Global_Files/session.php');
			include_once('./Global_Files/globalSettings.php');
			include_once('./Global_Files/connect.php');
			include_once('./lib/Register/assets/regBlackBox.php');
			
	$redirect = false;

	// Verify that form was human-submitted
	if(checkCaptcha()){

	// Handle the form
	if (!empty($_POST['m_user']) 
		&& !empty($_POST['m_pass'])
		&& !empty($_POST['m_passcheck'])
		&& !empty($_POST['m_email'])
		&& !empty($_POST['m_dob_m'])
		&& !empty($_POST['m_dob_d'])
		&& !empty($_POST['m_dob_y'])) { // Are required form fields filled?
	
		if ($_POST['m_pass'] == $_POST['m_passcheck']) { // Do the passwords match?
		
			if (valid_email($_POST['m_email'])) {	
			
				$registered = registerUser($regPath);
				
				
			if ($registered) {
					//$redirect = true;
					//$_SESSION['message'] = "Signup successful! Please check your email for a confirmation to continue your registration.";
					//$setSystemMessage = true;
					$_SESSION['message'] = "Your signup was successful";
					header("Location: ./main.php");
				} else {
					// Handle registration errors here
					
				}
			} else {
				$_SESSION['message']="The email address \"".$_POST['m_email']."\" appears to be invalid.";
				$muser = $_POST['m_user'] ? $_POST['m_user'] : "";
				$memail = $_POST['m_email'] ? $_POST['m_email'] : "";
				$m_dob_m = $_POST['m_dob_m'] ? $_POST['m_dob_m'] : "";
				$m_dob_d = $_POST['m_dob_d'] ? $_POST['m_dob_d'] : "";
				$m_dob_y = $_POST['m_dob_y'] ? $_POST['m_dob_y'] : "";
				$m_fname = $_POST['m_first'] ? $_POST['m_first'] : "";
				$m_lname = $_POST['m_last'] ? $_POST['m_last'] : "";
				$m_middle = $_POST['m_middle'] ? $_POST['m_middle'] : "";
				$m_affiliation = $_POST['m_affiliation'] ? $_POST['m_affiliation'] : "";
				$path = "./register.php?muser=" . $muser . "&memail=" . $memail . "&m_dob_m=" . $m_dob_m 
				. "&m_dob_d=" . $m_dob_d . "&m_dob_y=" . $m_dob_y . "&m_fname=" . $m_fname . "&m_lname=" . $m_lname . 
				"&m_middle=" . $m_middle . "&m_affiliation=" . $m_affiliation;
				
				//dieGracefully("The email address \"".$_POST['m_email']."\" appears to be invalid.  ");
			}
		} else {
			
			$_SESSION['message']="Passwords do not match.";
			$muser = $_POST['m_user'] ? $_POST['m_user'] : "";
			$memail = $_POST['m_email'] ? $_POST['m_email'] : "";
			$m_dob_m = $_POST['m_dob_m'] ? $_POST['m_dob_m'] : "";
			$m_dob_d = $_POST['m_dob_d'] ? $_POST['m_dob_d'] : "";
			$m_dob_y = $_POST['m_dob_y'] ? $_POST['m_dob_y'] : "";
			$m_fname = $_POST['m_first'] ? $_POST['m_first'] : "";
			$m_lname = $_POST['m_last'] ? $_POST['m_last'] : "";
			$m_middle = $_POST['m_middle'] ? $_POST['m_middle'] : "";
			$m_affiliation = $_POST['m_affiliation'] ? $_POST['m_affiliation'] : "";
			$path = "./register.php?muser=" . $muser . "&memail=" . $memail . "&m_dob_m=" . $m_dob_m 
			. "&m_dob_d=" . $m_dob_d . "&m_dob_y=" . $m_dob_y . "&m_fname=" . $m_fname . "&m_lname=" . $m_lname . 
			"&m_middle=" . $m_middle . "&m_affiliation=" . $m_affiliation;
			//redirectTo($path, "Passwords do not match.");
			//dieGracefully("Passwords do not match.");
		}
	} else {
		//$_SESSION['message'] = "Field(s) missing";
		
		$_SESSION['message']="Field(s) Missing.";
		//redirectTo($path, "Field(s) Missing");
		//$setSystemMessage = true;
	}	
	
	if ($redirect) {
		
		redirectToSelf();
	}
	} else {
		//no human submitted this form
		
		$_SESSION['message']="The \"Recaptcha\" box was entered incorrectly. Please try again.";
	}
} else if(isset($_POST['reset'])) { 
		include_once('./Global_Files/session.php');
		include_once('./Global_Files/globalSettings.php');
		include_once('./Global_Files/connect.php');
		include_once('./lib/Register/assets/regBlackBox.php');
		redirectTo('./register.php', 'Fields Cleared');
} 

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />
<title>The Archimedes Palimpsest Project</title>
<link rel="shortcut icon" href="images/favicon.ico" />
   <link rel="stylesheet" type="text/css" href=
        "./lib/yui/build/fonts/fonts-min.css">
        <link rel="stylesheet" type="text/css" href=
        "./lib/yui/build/menu/assets/skins/sam/menu.css">
	
<script type="text/javascript" src=
"./lib/yui/build/yahoo-dom-event/yahoo-dom-event.js">
</script>
<script type="text/javascript" src=
"./lib/yui/build/container/container_core-min.js">
</script>
<script type="text/javascript" src=
"./lib/yui/build/menu/menu-min.js">
</script>

<script language="JavaScript" type="text/JavaScript" src=
"./lib/yui/build/yahoo/yahoo-min.js">
</script>
<script src="http://yui.yahooapis.com/2.7.0/build/connection/connection-min.js"></script> 
 <link rel="stylesheet" type="text/css" href="./lib/yui/build/fonts/fonts-min.css" />
    <link rel="stylesheet" type="text/css" href="./lib/yui/build/container/assets/skins/sam/container.css" />
	<link rel="stylesheet" type="text/css" href="./lib/yui/build/assets/skins/sam/skin.css"> 
	<link rel="stylesheet" type="text/css" href="./lib/Crop/assets/cropBox.css" />
	<link rel="stylesheet" type="text/css" href="./lib/Dot/assets/Dot.css" />
	<link rel="stylesheet" type="text/css" href="./lib/Node/assets/Node.css" />
	
<link rel="stylesheet" type="text/css" href="./lib/Opacity/assets/Opacity.css" />

<link rel="stylesheet" type="text/css" href="./lib/DropDown/assets/DropDown.css"/>

   <link rel="stylesheet" type="text/css" href="./lib/YahooUI/resize/assets/skins/sam/resize.css" /> 
	<link rel="stylesheet" type="text/css" href="./lib/Zoom/assets/Zoom.css" />
	
	<link rel="stylesheet" type="text/css" href="./lib/YahooUI/menu/assets/skins/sam/menu.css"/>
	<link rel="stylesheet" type="text/css" href="./lib/YahooUI/menu/assets/skins/sam/menu-skin.css"/>
	<link rel="stylesheet" type="text/css" href="./lib/WindowMenu/assets/WindowMenu.css" />
	<link rel="stylesheet" type="text/css" href="./lib/ImageRegion/assets/ImageRegion.css" />
    <link rel="stylesheet" type="text/css" href="./lib/PageText/assets/PageText.css" />
	<link rel="stylesheet" type="text/css" href="./lib/ProjectBar/assets/ProjectBar.css" />

	<link rel="stylesheet" type="text/css" href="./lib/LoginBar/assets/LoginBar.css" />
	<link rel="stylesheet" type="text/css" href="./lib/Archie_Panel/assets/ArchiePanel.css" />
	<link rel="stylesheet" type="text/css" href="./lib/Annotation/assets/Annotation.css" />
	<link rel="stylesheet" type="text/css" href="./lib/Marker/assets/Marker.css" />
	<link rel="stylesheet" type="text/css" href="./lib/LabelBox/assets/LabelBox.css" />
	  <link rel="stylesheet" type="text/css" href="./lib/Workspace/assets/archimedes.css" />
	<link rel="stylesheet" type="text/css" href="./lib/yui/build/colorpicker/assets/skins/sam/colorpicker.css"> 
	<link rel="stylesheet" type="text/css" href="./lib/Search/assets/SearchWin.css" />
	<link rel="stylesheet" type="text/css" href="./lib/Workspace/assets/Workspace.css"/>
<link rel="stylesheet" type="text/css" href="./lib/ArchieLightbox/assets/ArchieLightbox.css"/>



	<link rel="stylesheet" type="text/css" href="./lib/Register/assets/Register.css" />
	<script language="Javascript" type="text/JavaScript" src="./lib/ArchieLightbox/ArchieLightbox.js"></script>
<script>
var RecaptchaOptions = {
   theme : 'clean'
};
</script>


</head>


<body>
	
<div id="header">
	
	<a href="./main.php"><img src="images/logo.gif" alt="Archimedes Palimpsest Logo" style="float:left" /></a>
	<div class="infoBoxReg"><?php if(isset($_SESSION['message'])) echo $_SESSION['message']; $_SESSION['message']="";?></div>
</div>



		<div id="workspace">




<form action="./register.php" method="post">
<div class="registration">
	<div class="required">
		<h3>Required Fields</h3>
		<label class="regFormItem" for="m_user">Desired Username</label>
		<input id="desiredUser" class="regFormItem" type="text" name="m_user" tabindex="1" <?php if(!empty($_POST['m_user'])) { ?> value="<?php echo $_POST['m_user']; ?>" <?php } ?> />
	
		<label class="regFormItem" for="m_pass">Password</label>
		<input class="regFormItem" type="password" name="m_pass" tabindex="2" value="" />
	
		<label class="regFormItem" for="m_passcheck">Password <span class="opt">(Verify)</span></label>
		<input class="regFormItem" type="password" name="m_passcheck" tabindex="3" value="" />
	
		<label class="regFormItem" for="m_email">Email</label>
		<input class="regFormItem" type="text" name="m_email" tabindex="4" <?php if(!empty($_POST['m_email'])) { ?> value="<?php echo $_POST['m_email']; ?>" <?php } ?> />
		
		<label class="regFormItem" for="m_dob_m">Birthday / Year <span class="opt">(MM/DD/YYYY)</span></label>
		<input class="regFormItem" type="text" name="m_dob_m" tabindex="5" size="2" maxlength="2" <?php if(!empty($_POST['m_dob_m'])) { ?> value="<?php echo $_POST['m_dob_m']; ?>" <?php } ?> />
		<input class="regFormItem" type="text" name="m_dob_d" tabindex="6" size="2" maxlength="2" <?php if(!empty($_POST['m_dob_d'])) { ?> value="<?php echo $_POST['m_dob_d']; ?>" <?php } ?> />
		<input class="regFormItem" type="text" name="m_dob_y" tabindex="7" size="4" maxlength="4" <?php if(!empty($_POST['m_dob_y'])) { ?> value="<?php echo $_POST['m_dob_y']; ?>" <?php } ?> />
	</div>

	<div class="optional">
		<h3>Optional Fields</h3>

		<label class="regFormItem" for="m_first">First Name <span class="opt">(Optional)</span></label>
		<input class="regFormItem" type="text" tabindex="8" name="m_first" size="12" <?php if(!empty($_POST['m_first'])) { ?> value="<?php echo $_POST['m_first']; ?>" <?php } ?> />
	
		<label class="regFormItem" for="m_last">Last Name <span class="opt">(Optional)</span></label>
		<input class="regFormItem" type="text" tabindex="9" name="m_last" size="12" <?php if(!empty($_POST['m_last'])) { ?> value="<?php echo $_POST['m_last']; ?>" <?php } ?> />
	
		<label class="regFormItem" for="m_middle">Middle Name <span class="opt">(Optional)</span></label>
		<input class="regFormItem" type="text" tabindex="10" name="m_middle" size="12" <?php if(!empty($_POST['m_middle'])) { ?> value="<?php echo $_POST['m_middle']; ?>" <?php } ?> />
		
		<label class="regFormItem" for="m_affiliation">Affiliation <span class="opt">(Optional)</span></label>
		<input class="regFormItem" type="text" tabindex="11" name="m_affiliation" size="12" <?php if(!empty($_POST['m_affiliation'])) { ?> value="<?php echo $_POST['m_affiliation']; ?>" <?php } ?> />
	</div>
	<div class="clear">
		
		<p>Please type both words exactly as they appear, divided by a space</p>		
		<div class="captcha clearleft">
		<?php
			require_once('lib/Register/assets/recaptchalib.php');
			$publickey = "6Lfy2gcAAAAAAKbWjlVMbgm9lCh7kUpBKDiB0vQP";
			echo recaptcha_get_html($publickey);
		?>
		</div> 
	</div>
	<div class="regsubmit">
    	<button type="button" name="cancel" class="cancelreg">Cancel</button>
		<button class="submit right" type="submit" name="submit" value="Register">Register</button>
        
	</div>
</div>


</form>



		</div>
		
    </body>
</html>




