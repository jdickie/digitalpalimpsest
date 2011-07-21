<?php
/**
 * Copy an entire annotation set and annotations over
 * to a user's set account 
 * 
 * set name is generated in AnnotationSelect.js
 * 
 * set id is generated here
 */

include_once('../../Global_Files/remoteCalling.php');

copyAnnoSet();

function copyAnnoSet(){
	if(isset($_SESSION['uID'])){
		//user is logged in
		$ref_id=$_GET['id'];
		$new_id=$_SESSION['uID']."_".rand(1,10000);
		while(does_anno_set_exist($new_id)){
			$new_id=$_SESSION['uID']."_".rand(1,1000);
		}
		$version=0;
		$oName=$_GET['name'];
		$new_name=$_GET['name'];
		while(does_anno_name_exist($new_name)){
			$version+=1;
			$new_name=$oName."_".$version;
		}
		$qry=sprintf("INSERT INTO anno_set (set_id,set_name,set_desc,set_security,set_state) VALUES ('%s','%s','%s','%s','%s');",
			mysql_real_escape_string($new_id),
			mysql_real_escape_string($new_name),
			mysql_real_escape_string("Copied from: ".$oName),
			mysql_real_escape_string("private"),
			mysql_real_escape_string("close")
		);
		$result=mysql_query($qry);
		
		//insert into user's sets
		$qry=sprintf("INSERT INTO set_user (annosetuserid,set_id,u_id) VALUES ('','%s','%s');",
			mysql_real_escape_string($new_id),
			mysql_real_escape_string($_SESSION['uID'])
		);
		$result=mysql_query($qry);
		
		//now we copy all of the annotations associated with the old set into the new one
		$allImageAnnos="";
		$qry=sprintf("SELECT anno_image.* FROM anno_image WHERE anno_image.anno_set='%s';",
			mysql_real_escape_string($ref_id)
		);
		$result=mysql_query($qry);
		while($row=mysql_fetch_assoc($result)){
			$allImageAnnos.=$row;
		}
		for($x=0;$x<count($allImageAnnos);$x++){
			//copy one and all
			$curr=$allImageAnnos[$x];//curr refers to a row
			$qry=sprintf("INSERT INTO anno_image (anno_image_id,anno_text,anno_link,anno_coords,anno_page,anno_panel,anno_doc,anno_set,anno_security) VALUES('','%s','%s','%s','%s','%s','%s','%s','%s','%s');",
				mysql_real_escape_string($curr['anno_text']),
				mysql_real_escape_string($curr['anno_link']),
				mysql_real_escape_string($curr['anno_coords']),
				mysql_real_escape_string($curr['anno_page']),
				mysql_real_escape_string($curr['anno_panel']),
				mysql_real_escape_string($curr['anno_doc']),
				mysql_real_escape_string($new_id),
				mysql_real_escape_string($curr['anno_security'])
			);
			$result=mysql_query($qry);
		}
		
	}	
}
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
?>