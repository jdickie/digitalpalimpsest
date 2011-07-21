<?php
/**
 * Save a AnnoLayerBox object to the database
 * 
 * Records bounds instead of XY - otherwise the same as anno_image records
 */

include_once('../../Global_Files/remoteCalling.php');

if(isset($_SESSION['uID'])){
	saveMarker();
}

function saveMarker(){
	if(checkAnnoSet($_GET['set'])){
		$qry=sprintf("INSERT INTO marker (marker_id,marker_text,marker_coords,marker_page,marker_doc,marker_set,marker_security) VALUES ('','%s','%s','%s','%s','%s','%s');",
			mysql_real_escape_string($_GET['text']),
			mysql_real_escape_string($_GET['coords']),
			mysql_real_escape_string($_GET['page']),
			mysql_real_escape_string($_GET['doc']),
			mysql_real_escape_string($_GET['set']),
			mysql_real_escape_string($_GET['security'])
		);
		$result=mysql_query($qry);
	}
}

function checkAnnoSet($set){
	$qry=sprintf("SELECT anno_set.set_id FROM anno_set WHERE anno_set.set_id='%s';",
		mysql_real_escape_string($set)
	);
	$result=mysql_query($qry);
	return (mysql_num_rows($result)>0)?true:false;
}

?>