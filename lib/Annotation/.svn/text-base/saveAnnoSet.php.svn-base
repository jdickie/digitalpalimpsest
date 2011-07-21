<?php
/**
 * Save annotation sets to 
 * database
 */

include_once('../../Global_Files/remoteCalling.php');
anno_set_save();
function anno_set_save(){
	$set_name=$_GET['name'];
	$set_desc=$_GET['desc'];
	$set_sec=$_GET['sec'];
	if((!($set_name  == '')) && (!($set_sec  == '')))	{
	$set_id=$_SESSION['uID']."_".rand(1,10000);
	
	$qry_text=sprintf("INSERT INTO anno_set (set_id, set_name, set_desc, set_security, set_state) VALUES ('%s', '%s', '%s', '%s','%s');",
		mysql_real_escape_string($set_id),
		mysql_real_escape_string($set_name),
		mysql_real_escape_string($set_desc),
		mysql_real_escape_string($set_sec),
		mysql_real_escape_string('open')
	);
		
		$result=mysql_query($qry_text);
		
		$qry_text=sprintf("INSERT INTO set_user (annosetuserid, set_id, u_id) VALUES('', '%s', '%s');",
			mysql_real_escape_string($set_id),
			mysql_real_escape_string($_SESSION['uID'])
		);
		
		$result=mysql_query($qry_text);
		if(isset($_SESSION['vars'])){
			$_SESSION['vars'].='annoset!'.$set_id.'-';
		}
		echo $set_id;
	}
}

?>