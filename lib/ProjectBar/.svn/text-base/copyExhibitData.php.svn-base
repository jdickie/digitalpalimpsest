<?php
/**
 * Copy the data from one exhibit
 * into a user's account
 * 
 * Original exhibit name and id are given in 
 * GET request
 */
ini_set("memory_limit", "256M");

include_once('../../Global_Files/remoteCalling.php');


copyExhibit();
function copyExhibit(){
	$oldId=$_GET['id'];
	$oldName=$_GET['name'];
	$name=$oldName;
	$version=does_name_exist($name);
	if($version>0){
		$name=$oldName."_".$version;
	}
	echo $name."<br/>";
	
$qry=sprintf("INSERT INTO project (p_id,p_title,p_desc,p_security) VALUES ('','%s','%s','%s');",
		mysql_real_escape_string($name),
		mysql_real_escape_string("Copied from ".$oldName),
		mysql_real_escape_string("private")
	);
	$result=mysql_query($qry);
	$nId=mysql_insert_id();
	//find windows from old exhibit and copy them into new exhibit
	$qry=sprintf("SELECT window.* FROM window WHERE window.p_id='%s';",
		mysql_real_escape_string($oldId)
	);
	$result=mysql_query($qry);
	while($row=mysql_fetch_assoc($result)){
		$qry=sprintf("INSERT INTO window (w_id,curPage,manifest,htmlID,w_left,w_top,width,height,p_id,w_info,state) VALUES ('','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s');",
			mysql_real_escape_string($row['curPage']),
			mysql_real_escape_string($row['manifest']),
			mysql_real_escape_string($row['htmlID']),
			mysql_real_escape_string($row['w_left']),
			mysql_real_escape_string($row['w_top']),
			mysql_real_escape_string($row['width']),
			mysql_real_escape_string($row['height']),
			mysql_real_escape_string($nId),
			mysql_real_escape_string($row['w_info']),
			mysql_real_escape_string($row['state'])
		);
		mysql_query($qry);
	}
	//find crops and copy them into exhibit file
	$qry=sprintf("SELECT crops.* FROM crops WHERE crops.c_proj='%s';",
		mysql_real_escape_string($oldId)
	);
	$result=mysql_query($qry);
	while($row=mysql_fetch_assoc($result)){
		$qry=sprintf("INSERT INTO crops (c_id,htmlID,imageSrc,srcx,srcy,srcw,srch,origw,origh,c_left,c_top,c_proj) VALUES ('','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s');",
			mysql_real_escape_string($row['htmlID']),
			mysql_real_escape_string($row['imageSrc']),
			mysql_real_escape_string($row['srcx']),
			mysql_real_escape_string($row['srcy']),
			mysql_real_escape_string($row['srcw']),
			mysql_real_escape_string($row['srch']),
			mysql_real_escape_string($row['origw']),
			mysql_real_escape_string($row['origh']),
			mysql_real_escape_string($row['c_left']),
			mysql_real_escape_string($row['c_top']),
			mysql_real_escape_string($nId)
		);
		mysql_query($qry);
	}
	//attach to user
	$qry=sprintf("INSERT INTO project_user (p_id,u_id,permission,state) VALUES ('%s','%s','%s','%s');",
		mysql_real_escape_string($nId),
		mysql_real_escape_string($_SESSION['uID']),
		mysql_real_escape_string('a'),
		mysql_real_escape_string('open')
	);
	$result=mysql_query($qry);
}
function does_id_exist($id){
	$qry=sprintf("SELECT project.* FROM project WHERE project.p_id='%s';",
		mysql_real_escape_string($id)
	);
	$result=mysql_query($qry);
	if(mysql_num_rows($result)>0){
		return true;
	} else {
		return false;
	}
	
}
function does_name_exist($name){
	$qry=sprintf("SELECT project.* FROM project,project_user WHERE project.p_title REGEXP '%s.*' AND project_user.u_id='%s' AND project_user.p_id=project.p_id;",
		mysql_real_escape_string($name),
		mysql_real_escape_string($_SESSION['uID'])
	);
	
	$result=mysql_query($qry);
	if(mysql_num_rows($result)>0){
		return mysql_num_rows($result);
	} else {
		return 0;
	}
}
?>