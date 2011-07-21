<?php
/**
 *Collecting database data for Annotation Sets
 
  Display Annotation Set information
  Display Annotations by user
  
  Outputs a single text string (no HTML)
 */

include_once("../../Global_Files/remoteCalling.php");
if(isset($_SESSION['adminset'])){
	echo getSets();
}	
	
function getSets(){
	//find the sets and group them together by users 
	$qry=sprintf("SELECT set_user.u_id, user.login, anno_set.* FROM anno_set INNER JOIN set_user ON set_user.set_id=anno_set.set_id LEFT JOIN user ON set_user.u_id=user.uID ORDER BY set_user.u_id;");
	$result=mysql_query($qry);
	$outstring="";
	while($row=mysql_fetch_assoc($result)){
		$outstring.=$row['u_id'].'%'.$row['set_id'].'%'.$row['login'].'%'.$row['set_name'].'%'.$row['set_desc'].'%'.$row['set_security']."\n";
	}
	return $outstring;
}


?>