<?php
/**
 * For erasing all windows and crop portions
 * from a project before saving another
 * screen capture
 * 
 * 
 */


include_once('../../Global_Files/remoteCalling.php');

eraseProject($_GET['id']);
//erase all windows and crop portions and labels
function eraseProject($id){
	$qry=sprintf("DELETE FROM window WHERE window.p_id='%s';",
		mysql_real_escape_string($id)
	);
	$result=mysql_query($qry);
	
	$qry=sprintf("DELETE FROM crops WHERE crops.c_proj='%s';",
		mysql_real_escape_string($id)
	);
	$result=mysql_query($qry);
	$qry=sprintf("DELETE FROM labels WHERE labels.p_id='%s';",
		mysql_real_escape_string($id)
	);
	$result=mysql_query($qry);
}




?>