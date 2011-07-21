<?php
/**
 * Display all data on annotations from a selected annotation set
 * 
 * Outputs a text string (no HTML)
 */

include_once('../../Global_Files/remoteCalling.php');

if(isset($_SESSION['adminset'])){
	echo getAnnos();
}

function getAnnos(){
	//find annotations from the given set
	$qry=sprintf("SELECT a.* FROM Archie_login.anno_image a WHERE a.anno_set='%s';",
		mysql_real_escape_string($_GET['set'])
	);
	$result=mysql_query($qry);
	//go through and load string
	$outstring="";
	while($row=mysql_fetch_assoc($result)){
		$outstring.=$row['anno_image_id'].'%'.$row['anno_text'].'%'.$row['anno_page'].'%'.$row['anno_set'].'%'.$row['anno_security']."\n";
	}
	return $outstring;
}


?>