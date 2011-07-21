<?php
/**
 * Export annotation sets from database, and input into 
 * an XML file
 */
ini_set("display_errors","1");
include_once('../../Global_Files/remoteCalling.php');

if(isset($_SESSION['uID'])){
	$user=$_SESSION['uID'];
	$set=$_GET['set'];
	findData($user,$set);
}

function findData($user,$set){
	//grab all the data from the database
	$qry=sprintf("SELECT anno_set.* FROM set_user JOIN anno_set ON set_user.set_id=anno_set.set_id WHERE set_user.u_id='%s' AND set_user.set_id='%s';",
		mysql_real_escape_string($user),
		mysql_real_escape_string($set)
	);
	$result=mysql_query($qry);
	
	$xmlString="";
	
	if(mysql_numrows($result)>0){
		//Take mysql result pointer and display data in XML format
		//then force-download the XML file to the user
		//createXMLFile($result);
		$xmlString.= "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
		$row=mysql_fetch_assoc($result);
		$xmlString.= "<set setid=\"".$row['set_id']."\">";
		$xmlString.= "<setname>".$row['set_name']."</setname>";
		$xmlString.= "<setdesc>".$row['set_desc']."</setdesc>";
		$xmlString.= "<setsecurity>".$row['set_security']."</setsecurity>";
		$xmlString.= "<setstate>".$row['set_state']."</setstate>";
		
		//now grab the anno_image data and display it
		$xmlString.= "<setcontent>"; //starts the set content area of XML - where anno images are put
		$qry=sprintf("SELECT anno_image.* FROM anno_image WHERE anno_image.anno_set='%s';",
			mysql_real_escape_string($set)
		);
		echo $qry;
		//$result=mysql_query($qry);
		while($row=mysql_fetch_assoc($result)){
			$xmlString.="<imageanno annoid=\"".$row['anno_image_id']."\">";
			$xmlString.="<annotext>".$row['anno_text']."</annotext>";
			$xmlString.="<annolink>".$row['anno_link']."</annolink>";
			$xmlString.="<annocoords>".$row['anno_coords']."</annocoords>";
			$xmlString.="<annopage>".$row['anno_page']."</annopage>";
			$xmlString.="<annopanel>".$row['anno_panel']."</annopanel>";
			$xmlString.="<annodoc>".$row['anno_doc']."</annodoc>";
			$xmlString.="<annoset>".$row['anno_set']."</annoset>";
			$xmlString.="<annosecurity>".$row['anno_security']."</annosecurity>";
			$xmlString.="<annosigvalue>".$row['anno_sigValue']."</annosigvalue></imageanno>";
		}
		$xmlString.= "</setcontent>\n</set>";//ends the XML file - that's it
		
		//create DOMDocument and force download to user
		$dom=new DOMDocument();
		$dom->loadXML($xmlString); //load what we just made
		$docname=$set.".xml";
		//set up headers
		header("Content-Type: text/xml");
		header("Content-Disposition: attachment; filename=\"$docname\";");
		echo $dom->saveXML();
		
		
	} else {
		//possibly erased or does not belong to this user
		echo 'Error - No such Annotation Set was found.';
	}
}

function createXMLFile($result){
	
	echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
	while($row=mysql_fetch_assoc($result)){
		
	}
}

?>