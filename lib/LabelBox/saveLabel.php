<?php
/**
 * SaveLabel
 * 
 * Save labels to the database
 * 
 * Saves:
 * X Pos
 * Y Pos
 * Text
 * Width & Height
 */

include_once('../../Global_Files/remoteCalling.php');

switch($_GET['mode']){
	case 'save':
		saveLabel();
		break;
	case 'erasePrev':
		checkanddelete($_SESSION['pID']);
		break;
}

function saveLabel(){
	$id=$_GET['id'];
	$x=intval($_GET['x']);
	$y=intval($_GET['y']);
	$text=trim($_GET['text'],"%");
	$width=intval($_GET['width']);
	$height=intval($_GET['height']);
	
	$qry=sprintf("INSERT INTO labels (label_id,label_x,label_y,text,width,height,p_id) VALUES ('','%s','%s','%s','%s','%s','%s');",
		mysql_real_escape_string($x),
		mysql_real_escape_string($y),
		mysql_real_escape_string($text),
		mysql_real_escape_string($width),
		mysql_real_escape_string($height),
		mysql_real_escape_string($_GET['projId'])
	);
	$result=mysql_query($qry);
	echo $qry;
}

?>