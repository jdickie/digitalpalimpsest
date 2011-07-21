<?php
/**
 * Collect and output all anno set names 
 * for the current user
 * 
 * If no sets, output "No sets created"
 */

include_once('../../Global_Files/remoteCalling.php');

$qry=sprintf("SELECT anno_set.set_id, anno_set.set_name FROM anno_set, set_user WHERE anno_set.set_id=set_user.set_id AND set_user.u_id='%s' ORDER BY anno_set.set_id;",
	mysql_real_escape_string($_SESSION['uID'])
);

$result=mysql_query($qry);

if(mysql_num_rows($result)>0){
	while($row=mysql_fetch_assoc($result)){
		echo $row['set_id']."%".$row['set_name']."\n";
	}
} else {
	echo "No sets created";
}
?>