<?php
/**
 * Get marker info from the database and output it
 * out in delimited string
 * 
 * Input: Page, set and document information
 * Output: Delimited string of marker data
 * 
 */


include_once('../../Global_Files/remoteCalling.php');

if(isset($_SESSION['uID'])){
	loadMarker();
}


function loadMarker(){
	$set=$_GET['set'];
	if($set=='default'){
		$result=mysql_query("SELECT anno_set.set_id FROM anno_set WHERE anno_set.set_name='".$_SESSION['user']."_default';");
		$row=mysql_fetch_assoc($result);
		$set=$row['set_id'];
	}
	if(checkOwnership($set)){
		$qry=sprintf("SELECT marker.* FROM marker WHERE marker.marker_page='%s' AND marker.marker_set='%s' AND marker.marker_doc='%s';",
			mysql_real_escape_string($_GET['page']),
			mysql_real_escape_string($set),
			mysql_real_escape_string($_GET['doc'])
		);
		$result=mysql_query($qry);
		//Output the data in a delimited file
		$delim="\n";
		$spacer="%";
		while($row=mysql_fetch_assoc($result)){
			echo $row['marker_id'].$spacer.$row['marker_text'].$spacer.$row['marker_coords'].$spacer.$row['marker_security'].$delim;
		}
	}
}

function checkOwnership($set){
	$qry=sprintf("SELECT anno_set.* FROM anno_set JOIN set_user ON set_user.set_id=anno_set.set_id WHERE anno_set.set_id='%s' AND set_user.u_id='%s';",
		mysql_real_escape_string($set),
		mysql_real_escape_string($_SESSION['uID'])
	);
	$result=mysql_query($qry);
	return (mysql_num_rows($result)>0)?true:false;
}

?>