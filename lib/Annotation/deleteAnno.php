<?php
/***
 * DeleteAnno.php
 * 
 * Deletes an annotation from the database
 */

/***
 * Includes statements 
 */
include_once('../../Global_Files/remoteCalling.php');

if(isset($_SESSION['uID'])){
	handle_header();
}

function handle_header(){
	$type=$_GET['type'];
	switch($type){
		case 'image':
			delete_image();
			break;
		case 'text':
			delete_text();
			break;
		case 'set':
			delete_set();
			break;
	}
}

function delete_image(){
	
	if($_GET['id']){
		//user check
		
		if($_GET['set']=='default'){
			$name=$_SESSION['user'].'_default';
			$qry=sprintf("SELECT anno_set.set_id FROM anno_set WHERE anno_set.set_name='%s';",
				mysql_real_escape_string($name)
			);
			$result=mysql_query($qry);
			$row=mysql_fetch_assoc($result);
			$set=$row['set_id'];
		} else {
			$set=$_GET['set'];
		}
		
		$qry=sprintf("SELECT user.login FROM user INNER JOIN set_user ON user.uID=set_user.u_id
		WHERE set_id='%s';",
	
			mysql_real_escape_string($set)
		);
	
		$result=mysql_query($qry);
		
		$check=false;
		while($row=mysql_fetch_assoc($result)){
		
			if($row['login']==$_SESSION['user']){
				$check=true;
			}
		}
		
		if($check){
			$qry=sprintf("DELETE FROM anno_image WHERE anno_image.anno_image_id='%s';",
				mysql_real_escape_string($_GET['id'])
			);	
			
			$result=mysql_query($qry);
			
			if(mysql_num_rows($result)>0){
				echo "True";
			} else {
				echo "False";
			}
		}
		
		
	}
}

/**
 * New Text Delete - 
 * passed ID for anno_text to be 
 * deleted
 * 
 * @return 
 */
function delete_text(){
	
	if(isset($_GET['id'])){
		$id=$_GET['id'];
		
		//user check
		$qry=sprintf("SELECT user.login FROM user INNER JOIN set_user ON user.uID=set_user.u_id
		WHERE set_id='%s';",
			mysql_real_escape_string($_SESSION['annoName'])
		);
		
		$result=mysql_query($qry);
		$check=false;
		while($row=mysql_fetch_assoc($result)){
			if($row['login']==$_SESSION['user']){
				$check=true;
			}
		}
		if($check){
			$qry=sprintf("DELETE FROM anno_text WHERE anno_text.anno_text_id='%s';",
				mysql_real_escape_string($id)
			);
			
			$result=mysql_query($qry);
			if(mysql_num_rows($result)>0){
				echo "True";
			} else {
				echo "False";
			}
		}
	}
}
/**
 * Table: anno_set
 * Given: id
 * @return 
 */
function delete_set(){
	$id=$_GET['id']; //set id
	
	//delete all annotations associated with set
	$qry=sprintf("DELETE FROM anno_image.*, anno_text.* WHERE anno_image.anno_set='%s' AND anno_text.anno_set='%s';",
		mysql_real_escape_string($id),
		mysql_real_escape_string($id)
	);
	
	$result=mysql_query($qry);
	
	$qry=sprintf("DELETE FROM anno_set WHERE anno_set.set_id='%s'",
		mysql_real_escape_string($id)
	);
	$result=mysql_query($qry);
}


/**
 * Old version -
 * updates non-existant or non-active tables
 * @return 
 */

function delete_text_old(){
	$parentId=$_GET['node1'];
	$nextId=$_GET['node2'];
	$id=$_GET['id'];
	$doc=$_GET['doc'];
	$start=$_GET['child1'];
	$end=$_GET['child2'];
	$check=false;
	//user check
	$qry=sprintf("SELECT user.login FROM user INNER JOIN set_user ON user.uID=set_user.u_id
	WHERE set_id='%s';",
		mysql_real_escape_string($_SESSION['annoName'])
	);
	
	$result=mysql_query($qry);
	while($row=mysql_fetch_assoc($result)){
		if($row['login']==$_SESSION['user']){
			$check=true;
		}
	}
	
	if($check){//update table 
	
	$qry=sprintf("SELECT anno_text.anno_text_id, anno_text.anno_start_child FROM anno_text WHERE anno_text.anno_doc='%s' AND anno_text.anno_node1_id='%s' AND anno_start_child > '%s'
		GROUP BY anno_text.anno_text_id;",
			mysql_real_escape_string($doc),
			mysql_real_escape_string($parentId),
			mysql_real_escape_string($start)
	);
	
	$result=mysql_query($qry);
	
	while($row=mysql_fetch_assoc($result)){
		$nstart=intval($row['anno_start_child'])-1;
		$id=$row['anno_text_id'];
		$qry=sprintf("UPDATE anno_text SET anno_text.anno_start_child='%s' WHERE anno_text.anno_text_id=%s;",
			mysql_real_escape_string($nstart),
			mysql_real_escape_string($id)
		);
		
		$result=mysql_query($qry);
	}
	
	$qry=sprintf("SELECT anno_text.anno_text_id, anno_end_child FROM anno_text WHERE anno_text.anno_doc='%s' AND anno_text.anno_node1_id='%s' AND anno_start_end > '%s'
		GROUP BY anno_text.anno_text_id;",
			mysql_real_escape_string($doc),
			mysql_real_escape_string($parentId),
			mysql_real_escape_string($end)
		);
	echo $qry."<br/>";
	$result=mysql_query($qry);
	
	while($row=mysql_fetch_assoc($result)){
		$nEnd=intval($row['anno_end_child'])-1;
		$id=$row['anno_text_id'];
		$qry=sprintf("UPDATE anno_text SET anno_text.anno_end_child='%s' WHERE anno_text.anno_text_id=%s;",
			mysql_real_escape_string($nEnd),
			mysql_real_escape_string($id)
		);
		echo $qry."<br/>";
		$result=mysql_query($qry);
	}
	
		$qry=sprintf("DELETE FROM anno_text WHERE anno_text.anno_text_id='%s';",
			mysql_real_escape_string($id)
		);
	
		mysql_query($qry);
		
		
		$qry=sprintf("DELETE FROM annotation_text WHERE annotation_text.anno_id='%s';",
			mysql_real_escape_string($id)
		);
		mysql_query($qry);
	}
}

?>