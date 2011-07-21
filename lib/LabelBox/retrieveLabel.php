<?php
/**
 * Retrieves and outputs labels from 
 * the database
 */

include_once('../../Global_Files/remoteCalling.php');

retrieveLabel();

function retrieveLabel(){
	$qry=sprintf("SELECT labels.* FROM labels WHERE labels.p_id='%s';",
		mysql_real_escape_string($_GET['proj'])
	);
	$result=mysql_query($qry);
	while($row=mysql_fetch_assoc($result)){
		echo $row['label_id'].'%'.$row['label_x'].'%'.$row['label_y'].'%'.$row['text'].'%'.$row['width'].'%'.$row['height'].'%'.$row['p_id']."\n";
	}
}

?>