<?php
/***
 * UserAdmin.php - for updating the database
 * as to which users are priviledged 
 * 
 * priviledged has two enum types: 
 * 'none' = not priviledged
 * 'access' = priviledged
 * 
 */

include_once('../../Global_Files/remoteCalling.php');


handleHeader();

function handleHeader(){
	$type=$_GET['type'];
	switch($type){
		case 'set':
			setPriviledge();
			break;
		case 'getPriv':
			getPriviledgedUsers();
			break;
		case 'getUnPriv':
			getNonPriv();
			break;
		case 'all':
			getUsers();
			break;
		case 'delete':
			deleteItem();
			break;
		case 'allItems':
			allItems();
			break;
	}
}

function setPriviledge(){
	$values=split('-',$_GET['values']);
	
	for($tok=0;$tok<count($values);$tok++){
		
		$check=split('\*', $values[$tok]);
		
		if($check[0]=="set"){
			$qry=sprintf("UPDATE user SET user.priviledged='access' WHERE user.uID='%s';",
				mysql_real_escape_string($check[1])
			);
			
		$result=mysql_query($qry);
		} else if($check[0]=="unset"){
			$qry=sprintf("UPDATE user SET user.priviledged='none' WHERE user.uID='%s';",
				mysql_real_escape_string($check[1])
			);
			
		$result=mysql_query($qry);
		}
	}
}

function getUsers(){
	$qry="SELECT user.* FROM user;";
	$result=mysql_query($qry);
	while($row=mysql_fetch_assoc($result)){
		echo $row['uID'].'!'.$row['login'].'!'.$row['priviledged'].'!'.$row['fname'].'!'.$row['middle'].'!'.$row['lname'].'!'.$row['dob'].'!'.$row['affiliation'].'%';
	}
}

function getPriviledgedUsers(){
	$qry="SELECT user.* FROM user WHERE user.priviledged='access';";
	$result=mysql_query($qry);
	while($row=mysql_fetch_assoc($result)){
		echo $row['uID'].'!'.$row['login'].'!'.$row['fname'].'!'.$row['middle'].'!'.$row['lname'].'!'.$row['dob'].'!'.$row['affiliation'].'%';
	}
	
}

function getNonPriv(){
	$qry="SELECT user.* FROM user WHERE user.priviledged='none';";
	$result=mysql_query($qry);
	while($row=mysql_fetch_assoc($result)){
		echo $row['uID'].'!'.$row['login'].'!'.$row['fname'].'!'.$row['middle'].'!'.$row['lname'].'!'.$row['dob'].'!'.$row['affiliation'].'%';
	}
}

function deleteItem(){
	$values=split("!", $_GET['values']);
	
}

function allItems(){
	$qry="SELECT anno_image.* FROM anno_image;";
	$result=mysql_query($qry);
	while($row=mysql_fetch_assoc($result)){
		echo "Annotation".'%'.$row['anno_image_id'].'%'.$row['anno_text'].'%'.$row['anno_page'].'-';
	}
	$qry="SELECT anno_text.* FROM anno_text;";
	$result=mysql_query($qry);
	while($row=mysql_fetch_assoc($result)){
		echo "Annotation".'%'.$row['anno_text_id'].'%'.$row['anno_text'].'%'.$row['anno_page'].'-';
	}
}

?>