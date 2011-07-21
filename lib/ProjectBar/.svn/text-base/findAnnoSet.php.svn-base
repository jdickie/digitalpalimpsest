<?php
/**
 * Search for an annotation set 
 * from the database based on 
 * user-given name
 * 
 * Return: output similar to AnnoSet.php
 */

include_once('../../Global_Files/remoteCalling.php');

findAnnoSet($_GET['text']);

function findAnnoSet($name){
	$qry=sprintf("SELECT user.uID, user.login, anno_set.* FROM anno_set, set_user, user WHERE set_user.set_id=anno_set.set_id AND set_user.u_id=user.uID AND anno_set.set_name REGEXP '%s' ORDER BY anno_set.set_id;",
		mysql_real_escape_string($name)
	);
	$result=mysql_query($qry);
	
	while($row=mysql_fetch_assoc($result)){
		$userCheck=($_SESSION['user']==$row['login'])?1:0;
		echo $row['set_name'].'%'.$row['set_id'].'%'.$row['set_desc'].'%'.$row['login'].'%'.$userCheck."%".$row['set_security']."\n";
		
	}
}

?>