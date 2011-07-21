5<?php
/***
 * saveAnno.php
 * Last Updated by: jdickie 10/20/08
 *
 */

/***
 * Includes statements 
 */
ini_set("display_errors","1");
include_once('../../Global_Files/remoteCalling.php');


handle_header();

/***
 * Takes GET values
 * Calls relevant functions
 * @return 
 */
function handle_header(){
	$type=$_GET['type'];
	if($type=='image'){
		anno_image_save();
	} else if($type=='text'){
		anno_text_save();
	} else if($type=='set'){
		anno_set_save();
	} 
}

/***
 * Save annotation set data
 * @return 
 */
function anno_set_save(){
	$set_name=$_GET['name'];
	$set_desc=$_GET['desc'];
	$set_keywords=$_GET['keys'];
	if((!($set_name  == '')) && (!($set_desc  == '')) && (!($set_keywords  == '')))	{
	$set_id=$_SESSION['uID']."_".rand(1,10000);
	$version=0;
	while(does_anno_set_exist($set_id)){
		$set_id=$_SESSION['uID']."_".rand(1,10000);
	}
	while(does_anno_name_exist($set_name)){
		$version+=1;
		$set_name.="_".$version;
		
	}
	$qry_text=sprintf("INSERT INTO anno_set (set_id, set_name, set_desc, set_keywords) VALUES ('%s', '%s', '%s', '%s');",
		mysql_real_escape_string($set_id),
		mysql_real_escape_string($set_name),
		mysql_real_escape_string($set_desc),
		mysql_real_escape_string($set_keywords)
	);
		
		$result=mysql_query($qry_text);
		
		$qry_text=sprintf("INSERT INTO set_user (annosetuserid, set_id, u_id) VALUES('', '%s', '%s');",
			mysql_real_escape_string($set_id),
			mysql_real_escape_string($_SESSION['uID'])
		);
		
		$result=mysql_query($qry_text);
		if(isset($_SESSION['vars'])){
			$_SESSION['vars'].='annoset!'.$set_id.'-';
		}
		echo $set_id;
	}
}
/**
 * 
 * @return 
 * @param $setID Object
 */
function does_anno_name_exist($set_name){
	$qry=sprintf("SELECT anno_set.set_id FROM anno_set, set_user WHERE anno_set.set_name='%s' AND anno_set.set_id=set_user.set_id AND set_user.u_id='%s';",
		mysql_real_escape_string($set_name),
		mysql_real_escape_string($_SESSION['uID'])
	);
	$result=mysql_query($qry);
	if(mysql_num_rows($result)>0){
		return true;
	} else {
		return false;
	}
}
/**
 * Check to see if current annotation set exists or not
 * @return 
 */
function does_anno_set_exist($setID){
	$qry=sprintf("SELECT anno_set.* FROM anno_set WHERE anno_set.set_id='%s';",
		mysql_real_escape_string($setID)
	);
	
	$result=mysql_query($qry);
	if(mysql_num_rows($result)>0){
		return true;
	} else {
		return false;
	}
}

/***
 * put relevant information into
 * the database
 * @return 
 */
function anno_text_save(){
	//save textual annotation 
	
	$text=$_GET['text'];

	$node1_id=$_GET['node1'];
	
	
	$node2_id=$_GET['node2'];

	
	$absStart=$_GET['startCount'];
	$absEnd=$_GET['endCount'];
	
	$startValue=$_GET['startValue'];
	$endValue=$_GET['endValue'];
	$page=$_GET['page'];
	$docId=$_GET['doc'];
	$set=$_GET['set'];
	
	
	$qry_text=sprintf("INSERT INTO anno_text (anno_text, anno_offset_start, anno_offset_end, anno_node1_id, anno_node2_id, anno_start_child, anno_end_child, anno_page, anno_doc, anno_set)
	VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s');",
		mysql_real_escape_string($text),
		mysql_real_escape_string($startValue),
		mysql_real_escape_string($endValue),
		mysql_real_escape_string($node1_id),
		mysql_real_escape_string($node2_id),
		mysql_real_escape_string($absStart),
		mysql_real_escape_string($absEnd),
		mysql_real_escape_string($page),
		mysql_real_escape_string($docId),
		mysql_real_escape_string($set)
	);
	
	$result=mysql_query($qry_text);
	
	$anno_id=mysql_insert_id();
	echo $anno_id;
	
	/*
$qry_text=sprintf("INSERT INTO anno_project (anno_project_id, p_id, anno_id) 
	VALUES ('', '%s', '%s');",
		mysql_real_escape_string($_SESSION['pID']),
		mysql_real_escape_string($anno_id)
	);
	
	$result=mysql_query($qry_text);
*/
	
	$qry_text=sprintf("INSERT INTO annotation_text (anno_id, anno) VALUES('%s', '%s'); ",
	mysql_real_escape_string($anno_id),
	mysql_real_escape_string($text)
	);
	
	$result=mysql_query($qry_text);
	
}

function anno_image_save(){
	//save image-based annotation
	$text=$_GET['text'];
	$ref=$_GET['ref'];
	$coords=$_GET['coords'];
	$panel=($_GET['panel'])?$_GET['panel']:"default";
	$page=$_GET['page'];
	$docId=$_GET['doc'];
	$set=$_GET['set'];
	$security=$_GET['security'];
	$sigValue=$_GET['sigValue'];
	if($set == "default"){
		//set id is always user's id plus _default
		$set_name = $_SESSION['user']."_default";
		$set_id="";
		$qry=sprintf("SELECT anno_set.set_id FROM anno_set WHERE anno_set.set_name='%s';",
			mysql_real_escape_string($set_name)
		);
		$result=mysql_query($qry);
		while($row=mysql_fetch_assoc($result)){
			$set_id=$row['set_id'];
		}
		$qry_text = sprintf("INSERT INTO anno_image (anno_text, anno_link, anno_coords, anno_page, anno_panel, anno_doc, anno_set,anno_security,anno_sigValue) VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s','%s','%s');",
			mysql_real_escape_string($text),
			mysql_real_escape_string($ref),
			mysql_real_escape_string($coords),
			mysql_real_escape_string($page),
			mysql_real_escape_string($panel),
			mysql_real_escape_string($docId),
			mysql_real_escape_string($set_id),
			mysql_real_escape_string($security),
			mysql_real_escape_string($sigValue)
		);
		echo $qry_text."<br/>";
		$result = mysql_query($qry_text);
		
	} else {
		$qry_text=sprintf("INSERT INTO anno_image (anno_text, anno_link, anno_coords, anno_page, anno_panel, anno_doc, anno_set,anno_security,anno_sigValue)
		VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s','%s','%s');",
			mysql_real_escape_string($text),
			mysql_real_escape_string($ref),
			mysql_real_escape_string($coords),
			mysql_real_escape_string($page),
			mysql_real_escape_string($panel),
			mysql_real_escape_string($docId),
			mysql_real_escape_string($set),
			mysql_real_escape_string($security),
			mysql_real_escape_string($sigValue)
		);
	
		
		$result=mysql_query($qry_text);
		echo $qry_text."<br/>";
		$anno_id=mysql_insert_id();
		echo $anno_id;
	}
}



?>