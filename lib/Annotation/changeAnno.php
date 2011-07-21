<?php
/***
 * Change the security on an annotation set
 */

include_once('../../Global_Files/remoteCalling.php');

handle_header();

function handle_header(){
	switch($_GET['type']){
		case 'set':
			change_set();
			break;
	}
}

function change_set(){
	$secure=$_GET['change'];
	$id=$_GET['id'];
	$qry=sprintf("UPDATE anno_set SET set_security='%s' WHERE anno_set.set_id='%s';",
		mysql_real_escape_string($secure),
		mysql_real_escape_string($id)
	);
	
	$result=mysql_query($qry);
}

?>