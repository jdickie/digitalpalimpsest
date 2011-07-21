<?php
/**
 * RetrieveAnno.php
 * 
 * select data from the database that concerns
 * image annotations, text annotations, and information
 * on annotation sets
 */


/***
 * Includes statements 
 */
include_once('../../Global_Files/remoteCalling.php');


handle_header();

/***
 * Takes GET values
 * Calls relevant functions
 * 
 *  
 */
function handle_header(){
	$type=$_GET['type'];
	if($type=='image'){
		retrieve_image_anno();
	} else if($type=='text'){
		retrieve_text_anno();
	} else if($type=='sets'){
		retrieve_sets();
	}
}



function retrieve_image_anno(){
	$page=$_GET['page'];
	$id=$_GET['id'];
	$doc=$_GET['doc'];
	$projLimit=$_GET['proj'];
	$set=$_GET['set'];
	$qry_text='';
	if($projLimit=='none'){
		/*$qry_text=sprintf("SELECT anno_image.*, user.login FROM anno_image INNER JOIN anno_project ON anno_image.anno_image_id=anno_project.anno_id,
		project_user INNER JOIN user ON project_user.u_id=user.uID
		WHERE anno_image.anno_page='%s' AND anno_image.anno_doc='%s' AND anno_image.anno_set='%s' AND project_user.p_id=anno_project.p_id;",
			mysql_real_escape_string($page),
			mysql_real_escape_string($doc),
			mysql_real_escape_string($set)
		);*/
		$qry_text=sprintf("SELECT anno_image.anno_text FROM anno_image 
		
		WHERE anno_image.anno_image_id='%s' AND anno_image.anno_page='%s' AND anno_image.anno_doc='%s' AND anno_image.anno_set='%s';",
			mysql_real_escape_string($id),
			mysql_real_escape_string($page),
			mysql_real_escape_string($doc),
			mysql_real_escape_string($set)
		);
	} else {
		$qry_text=sprintf("SELECT anno_image.* FROM anno_image INNER JOIN anno_project ON anno_image.anno_image_id=anno_project.anno_id
		WHERE anno_project.p_id='%s' AND anno_image.anno_page='%s' AND anno_image.anno_set='%s';",
			mysql_real_escape_string($projLimit),
			mysql_real_escape_string($page),
			mysql_real_escape_string($set)
		);
	}
	
	$result=mysql_query($qry_text);
	$annoArray='';
	while($row = mysql_fetch_assoc($result)) { //make array of arrays
		echo $row['anno_text'];
		//$annoArray.=($row["login"]) ? $row['anno_text'].'-'.$row['anno_coords'].'-'.$row["login"].';' : $row['anno_text'].'-'.$row['anno_coords'].';';
	}
		
		//echo out the array - returned in return text
	echo $annoArray;
}

function retrieve_text_anno(){
	
	$id=$_GET['id'];
	$qry_text=sprintf("SELECT anno_text.anno_text FROM anno_text WHERE anno_text.anno_text_id='%s';",
		mysql_real_escape_string($id)
	);
	$result=mysql_query($qry_text);
	$annoArray='';
	while($row = mysql_fetch_assoc($result)) { //make array of arrays
		$text=(!($row['anno_text']=='')) ? $row['anno_text'] : 'No annotation made';
		$text.=($row['login']==$_SESSION['user']) ? "%1" : "%0";
		echo $text;
			}
		
		//echo out the array - returned in return text
//	echo $annoArray;
}

/***
 * Create list of annotation sets
 * @return 
 */
function retrieve_sets(){
	$page=$_GET['page'];
	$doc=$_GET['doc'];
	$qry_text=sprintf("SELECT anno_set.* FROM anno_set;",
	mysql_real_escape_string($page),
	mysql_real_escape_string($doc)
	);
	$result=mysql_query($qry_text);
}






?>