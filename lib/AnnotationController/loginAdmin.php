<?php
/**
 * Functions for logging in Administrators of Annotation Sets and Annotations
 */

if($_POST['username']&&$_POST['password']){
	include_once('../../Global_Files/remoteCalling.php');
	$user=$_POST['username'];
	$pass=substr($user,0,3).$_POST['password'].substr($user,3);
	$v=verify($user,$pass);
	if($v){
		$_SESSION['adminset']=$v;
		header('Location: ./ArchieAdmin.php');
	} else {
		echo "Not a valid user, sorry";
	}
}

function verify($u,$p){
	$qry=sprintf("SELECT admin.* FROM admin WHERE admin.username='%s' AND admin.password='%s';",
		mysql_real_escape_string($u),
		mysql_real_escape_string(md5($p))
	);
	$result=mysql_query($qry);
	if(mysql_num_rows($result)>0){
		$row=mysql_fetch_array($result);
		return $row[0];
	} else {
		return false;
	}
	
}
?>