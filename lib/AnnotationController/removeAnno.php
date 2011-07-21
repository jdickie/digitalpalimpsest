<?php
/**
 * Takes an ID and deletes that particular ID from the 
 * anno_image table in Archie DB
 * 
 * 
 */
include_once('../../Global_Files/remoteCalling.php');
if(isset($_SESSION['adminset'])){
	
	removeAnno();
}

function removeAnno(){
	$qry=sprintf("DELETE FROM Archie_login.anno_image WHERE Archie_login.anno_image.anno_image_id='%s';",
		mysql_real_escape_string($_GET['id'])
	);	
	$result=mysql_query($qry);
	if(mysql_num_rows($result)>0){
		echo "True";
	}
}



?>