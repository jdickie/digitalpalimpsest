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
	$doc=$_GET['doc'];
	$projLimit=$_GET['proj'];
	$set=$_GET['set'];
	$security="False";
	$qry_text='';
	if(($set=="default")&&(isset($_SESSION['uID']))){
		$name=$_SESSION['user'].'_default';
		$qry=sprintf("SELECT anno_set.* FROM anno_set WHERE anno_set.set_name='%s';",
			mysql_real_escape_string($name)
		);
		$result=mysql_query($qry);
		$row=mysql_fetch_assoc($result);
		$set=$row['set_id'];
		$security="True";
		//if($_SESSION['uID']){$security="True"};
	} else if(isset($_SESSION['uID'])){
		$qry=sprintf("SELECT anno_set.*,set_user.u_id FROM anno_set, set_user WHERE anno_set.set_id='%s' AND set_user.set_id=anno_set.set_id;",
			mysql_real_escape_string($set)
		);
		$result=mysql_query($qry);
		$row=mysql_fetch_assoc($result);
		$security=($_SESSION['uID']==$row['u_id'])?"True":"False";
	}
	echo $security."\n";
	$qry_text=sprintf("SELECT anno_image.*, anno_set.set_id, user.uID FROM anno_set, anno_image INNER JOIN set_user ON anno_image.anno_set=set_user.set_id, user
	WHERE user.uID=set_user.u_id AND anno_set.set_id=set_user.set_id AND anno_image.anno_page='%s' AND anno_image.anno_doc='%s' AND anno_image.anno_set='%s';",
		mysql_real_escape_string($page),
		mysql_real_escape_string($doc),
		mysql_real_escape_string($set)
	);
	
	$result=mysql_query($qry_text);
	$annoArray='';
	
	while($row = mysql_fetch_assoc($result)) { //make array of arrays
		
		if($row['anno_security']=="private"){
			
			if($row['uID']==$_SESSION['uID']){
				$annoArray.=$row['anno_image_id']."%".$row['anno_coords']."%".$row['anno_link']."%".$row['anno_text']."\n";
			}
		} else {
			$annoArray.=$row['anno_image_id']."%".$row['anno_coords']."%".$row['anno_link']."%".$row['anno_text']."\n";
		}
		

	}
		
		//echo out the array - returned in return text
	echo $annoArray;
	
}

function retrieve_text_anno(){
	
	$page=$_GET['page'];
	$doc=$_GET['doc'];
	$set=$_GET['set'];
	$user=($_GET['user']) ? $_GET['user']: $_SESSION['user'];
 	$qry_text='';
	if($projLimit=='none'){
		
		$qry_text=sprintf("SELECT anno_text.*, user.login FROM anno_text INNER JOIN anno_project ON anno_text.anno_text_id=anno_project.anno_id, project_user JOIN user ON project_user.u_id=user.uID
		WHERE anno_text.anno_page='%s' AND anno_text.anno_doc='%s' AND project_user.p_id=anno_project.p_id AND user.login='%s' AND anno_text.anno_set='%s';",
			mysql_real_escape_string($page),
			mysql_real_escape_string($doc),
			mysql_real_escape_string($user),
			mysql_real_escape_string($set)
		);
		
	} else {
		//$qry_text=sprintf("SELECT anno_text.* FROM anno_text INNER JOIN anno_project ON anno_text.anno_text_id=anno_project.anno_id
		//WHERE anno_project.p_id='%s' AND anno_text.anno_doc='%s' AND anno_text.anno_page='%s' AND anno_text.anno_set='%s';",
		$qry_text=sprintf("SELECT anno_text.* FROM anno_text WHERE anno_text.anno_doc='%s' AND anno_text.anno_page='%s' AND anno_text.anno_set='%s';",
		mysql_real_escape_string($doc),
		mysql_real_escape_string($page),
		mysql_real_escape_string($set)
		
		);
		
	}
	
	$result=mysql_query($qry_text);
	$annoArray='';
	while($row = mysql_fetch_assoc($result)) { //make array of arrays
		$text=(!($row['anno_text']=='')) ? $row['anno_text'] : 'No annotation made';
		$annoArray.=$row['anno_text_id'].'%'.$row['anno_node1_id'].'%'. $row['anno_node2_id'] . '%'.$row['anno_offset_start']. '%'.$row['anno_offset_end']. '%'. $row['anno_start_child'] .'%'.$row['anno_end_child'] .'%'.';';
	//	echo $annoArray."<br/>";
	}
		
		//echo out the array - returned in return text
	echo $annoArray;
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