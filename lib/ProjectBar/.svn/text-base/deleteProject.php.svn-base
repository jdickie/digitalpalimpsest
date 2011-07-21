<?php
/**
 * Delete a given project based on the URL-specified
 * ID for that project 
 * 
 */

include_once('../../Global_Files/remoteCalling.php');

if((isset($_SESSION['uID']))&&(isset($_GET['id']))){
	delProj();
}


function delProj(){
	//does user own project?
	$uid=$_SESSION['uID'];$pid=$_GET['id'];
	$qry=sprintf("SELECT user.login FROM user JOIN project_user ON user.uID=project_user.u_id WHERE project_user.p_id='%s' AND user.uID='%s';",
		mysql_real_escape_string($pid),
		mysql_real_escape_string($uid)
	);
	$result=mysql_query($qry);
	if(mysql_num_rows($result)>0){
		//first delete from project table
		$qry=sprintf("DELETE FROM project WHERE project.p_id='%s';",
			mysql_real_escape_string($pid)
		);
		$result=mysql_query($qry);
		//delete from project_user table
		$qry=sprintf("DELETE FROM project_user WHERE project_user.p_id='%s';",
			mysql_real_escape_string($pid)
		);
		$result=mysql_query($qry);
	}else{
		echo "Error";
	}
}




?>