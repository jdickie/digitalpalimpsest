<?php
/***
 * Changes the annotation text that the user 
 * enters - edited by user who initiated the 
 * annotation
 */

include_once('../../Global_Files/remoteCalling.php');


changeAnnoText();

function changeAnnoText(){
	if($_GET['mode']=='text'){
		$qry=sprintf("UPDATE anno_text SET anno_text.anno_text='%s' WHERE anno_text.anno_text_id='%s';",
			mysql_real_escape_string($_GET['text']),
			mysql_real_escape_string($_GET['id'])
		);
		$result=mysql_query($qry);
	} else if($_GET['mode']=='image'){
		$qry=sprintf("UPDATE anno_image SET anno_image.anno_text='%s' WHERE anno_image.anno_image_id='%s';",
			mysql_real_escape_string($_GET['text']),
			mysql_real_escape_string($_GET['id'])
		);
		echo $qry;
		$result=mysql_query($qry);
	}
	
	
}

?>