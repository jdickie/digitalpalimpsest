<?php
/**
 * 
 */

include_once('../../Global_Files/remoteCalling.php');


if($_SESSION['adminset']){
	include_once('./recentAnnoControl.php');
} else {

	?>
	<h1>Login to Archimedes Admin</h1>
	<form method="post" action="loginAdmin.php">
		<label for="username">Username:</label>
		<input type="text" name="username"/>
		<label for="password">Password:</label>
		<input type="password" name="password"/>
		<input type="submit" value="Login"/>
	</form>
	
	<?php
}



?>