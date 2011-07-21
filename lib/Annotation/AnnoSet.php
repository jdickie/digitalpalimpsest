<?php
/***
 * AnnoSet.php
 * 
 * for retrieving anno set data
 * from the database
 * 
 * type 'list' gets a list of ids
 * 
 * type 'full' gets all data, including
 * user information
 */
include_once('../../Global_Files/remoteCalling.php');

handleheader();

function handleheader(){
	$type=$_GET['type'];
	switch($type){
		case 'full':
			retrieve_anno_set();
			break;
		case 'current':
			retrieve_user_set();
			break;
	}
}

function retrieve_anno_setList(){
	$qry_text=sprintf("SELECT anno_set.set_id FROM anno_set JOIN set_user ON anno_set.set_id=set_user.set_id, user
	WHERE user.uID=set_user.u_id ORDER BY anno_set.set_id;"
	);
	
	$result=mysql_query($qry_text);
	while($row=mysql_fetch_row($result)){
		echo $row[0].',';
	}
}
/***
 * Create list of annotation sets
 * @return 
 */
function retrieve_anno_set(){
	$set_id=$_GET['set'];
	$doc=$_GET['doc'];
	$qry_text=sprintf("SELECT user.uID, user.login, anno_set.* FROM anno_set, set_user, user WHERE set_user.set_id=anno_set.set_id AND set_user.u_id=user.uID ORDER BY anno_set.set_id;");
	$result=mysql_query($qry_text);
	while($row=mysql_fetch_assoc($result)){
		//$userCheck=($_SESSION['uID']==$row['uID'])?1:0;
	
		if($row['set_security']=='public'){ 
			echo $row['set_name'].'%'.$row['set_id'].'%'.$row['set_desc'].'%'.$row['login'].'%'.$userCheck."%".$row['set_security']."\n";
		}
		
	}

	
	
}


/**
 * Retrieve only the current user's set
 * 
 * @return 
 */
function retrieve_user_set(){
	$set_id=$_GET['set'];
	$doc=$_GET['doc']; //manifest file
	
	$qry_text = sprintf("SELECT user.uID, user.login, anno_set.* FROM anno_set, set_user, user WHERE anno_set.set_id=set_user.set_id AND set_user.u_id=user.uID AND set_user.u_id='%s' ORDER BY anno_set.set_id;",
		mysql_real_escape_string($_SESSION['uID'])
	);
	
	$result=mysql_query($qry_text);
	while($row=mysql_fetch_assoc($result)){	
		echo $row['set_name'].'%'.$row['set_id'].'%'.trim($row['set_desc'],"\n").'%'.$row['login']."%"."true"."%".$row['set_security']."\n";	
	}
}
/***
 * Change status of anno set
 */
function anno_change_status(){
	$state=$_GET['state'];
	$set_id=$_GET['set'];
	$qry_text=sprintf("UPDATE anno_set SET set_state='%s' WHERE set_id='%s';",
		mysql_real_escape_string($state),
		mysql_real_escape_string($set_id)
	);
	
	$result=mysql_query($qry_text);
}
?>