<?php
/**
 * Convert Annotation records into Marker records (From anno_image table
 * to the marker table in Archie_login)
 * 
 * anno_image record loses the anno_panel field - not really used in Archie anymore
 */
include_once('../../Global_Files/remoteCalling.php');

convertImageAnnoToMarker();

function convertImageAnnoToMarker(){
	$qry=sprintf("SELECT anno_image.* FROM anno_image;");
	$result=mysql_query($qry);
	if(mysql_num_rows($result)>0){
		//successful return
		while($row=mysql_fetch_assoc($result)){
			$insert=sprintf("INSERT INTO marker (marker_id,marker_text,marker_link,marker_coords,marker_page,marker_doc,marker_set,marker_sigValue,marker_security,marker_timestamp) VALUES ('','%s','%s','%s','%s','%s','%s','%s','%s','%s');",
				mysql_real_escape_string($row['anno_text']),
				mysql_real_escape_string($row['anno_link']),
				mysql_real_escape_string($row['anno_coords']),
				mysql_real_escape_string($row['anno_page']),
				mysql_real_escape_string($row['anno_doc']),
				mysql_real_escape_string($row['anno_set']),
				mysql_real_escape_string($row['anno_sigValue']),
				mysql_real_escape_string($row['anno_security']),
				mysql_real_escape_string($row['anno_timestamp'])
			);
			$insertresult=mysql_query($insert);
			echo $insert."<br/>";
			echo mysql_insert_id()."<br/><br/>";
		}
	} else {
		echo "anno_image table is empty.<br/>".$qry;
	}
}


?>