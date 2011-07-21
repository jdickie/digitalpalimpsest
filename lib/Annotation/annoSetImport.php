<?php
/**
 * Take a php-generated XML file, then import the Annotation Set data
 * therein into the Archie database
 */

ini_set('display_errors','1');
include_once('../../Global_Files/remoteCalling.php');
if(isset($_SESSION['uID'])){	
	importData();
	}
function importData(){
	$dom=new DOMDocument();
	$dom->load($_GET['path']);
	$set=$dom->getElementsByTagName("set");
	$setid=$set->item(0)->getAttribute('setid');
	$setchildren=$set->item(0)->childNodes;
	
	$setname=$setchildren->item(0)->nodeValue;
	$setdesc=$setchildren->item(1)->nodeValue;
	$setsecurity=$setchildren->item(2)->nodeValue;
	$setstate=$setchildren->item(3)->nodeValue;
	
	$qry=sprintf("INSERT INTO anno_set ('set_id','set_name','set_desc','set_security','set_state') VALUES ('','%s','%s','%s','%s');",
		mysql_real_escape_string($setname),
		mysql_real_escape_string($setdesc),
		mysql_real_escape_string($setsecurity),
		mysql_real_escape_string($setstate)
	);
	$result=mysql_query($qry);
	//Now set up the annotation set for the user
	$id=mysql_insert_id();
	$qry=sprintf("INSERT INTO set_user ('annosetuserid','set_id','u_id') VALUES ('','%s','%s');",
		mysql_real_escape_string($id),
		mysql_real_escape_string($_SESSION['uID'])
	);

	//$result=mysql_query($qry);
	//Now get all of the annotations from setcontent 
	$annoimages=$dom->getElementsByTagName("setcontent")->item(0)->childNodes;
	
	foreach($annoimages as $anno){
		$data=$anno->childNodes;
		$qry=sprintf("INSERT INTO anno_image ('anno_image_id','anno_text','anno_link','anno_coords','anno_page','anno_panel','anno_doc','anno_set','anno_security','anno_sigValue') 
		VALUES ('','%s','%s','%s','%s','%s','%s','%s','%s','%s')",
			mysql_real_escape_string($data->item(0)->nodeValue),
			mysql_real_escape_string($data->item(1)->nodeValue),
			mysql_real_escape_string($data->item(2)->nodeValue),
			mysql_real_escape_string($data->item(3)->nodeValue),
			mysql_real_escape_string($data->item(4)->nodeValue),
			mysql_real_escape_string($data->item(5)->nodeValue),
			mysql_real_escape_string($id),
			mysql_real_escape_string($data->item(7)->nodeValue),
			mysql_real_escape_string($data->item(8)->nodeValue)
		);
		echo $qry;	
		$result=mysql_query($qry);
	}
	
}


?>