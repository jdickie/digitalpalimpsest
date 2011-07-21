<?php
/*
 * Delwindow.php 
 * 
 * For deleting windows from exhibits
 */
 
 include_once('../../Global_Files/remoteCalling.php');
 
 handle_header();
 
 function handle_header(){
 	$type = $_GET['type'];
	switch($type){
		case 'win':
			delWindow();
			break;
		case 'crop':
			delCrop();
			break;
	}
 }
 
 function delWindow(){
 	//check if user is logged in and project open
	if(($_SESSION['pID'])&&(isset($_SESSION['uID']))){
	 	$qry = sprintf("DELETE FROM window, project_user WHERE window.w_id='%s' AND window.p_id=project_user.p_id AND project_user.u_id='%s';",
			mysql_real_escape_string($_GET['id']),
			mysql_real_escape_string($_SESSION['uID'])
		);
		$result = mysql_query($qry);
		$success = mysql_num_rows($result);
		if($success){
			echo "True";
		} else {
			echo "False";
		}
	}
 }
function delCrop(){
	//check if user is logged in and project open
	if(($_SESSION['pID'])&&(isset($_SESSION['uID']))){
		
		
	}
}
?>