<?php
/**
 * Retrieve most recent annotations from the database
 * 
 * Retrieves based on most current anno_timestamp value in anno_image table
 * Gets # of annos based on given num value
 *  
 */

include_once('../../Global_Files/remoteCalling.php');

if(isset($_SESSION['adminset'])){
	echo getRecent();
}

function getRecent(){
	
	//Compare the timestamps
	//Return only those anno_timestamp values that are within range of a week (7 days)
	$qry=sprintf("SELECT Archie_login.anno_image.* FROM Archie_login.anno_image WHERE TIMESTAMPDIFF(DAY,UTC_TIMESTAMP(),Archie_login.anno_image.anno_timestamp)<8;");
	$result=mysql_query($qry);
	//go through results and return delimited string
	$outstring="";
	while($row=mysql_fetch_assoc($result)){
		$outstring.=$row['anno_image_id'].'%'.$row['anno_text'].'%'.$row['anno_page'].'%'.$row['anno_set'].'%'.$row['anno_security']."\n";
	}
	return $outstring;
}
?>