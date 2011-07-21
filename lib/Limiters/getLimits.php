<?php
/***
 * GetLimits.php
 * 
 * Sets up limitItem for options for 
 * select element
 */

include_once('../../Global_Files/remoteCalling.php');


handle_header();

function handle_header(){
	$type=$_GET['type'];
	switch($type){
		case 'get':
			getFirst();
			break;
		case 'current':
			getCurrent();
			break;
	}
}

function getFirst(){
	$firstType=$_GET['firstType'];
	
	$qry="";
	switch($firstType){
		case 'speaker':
			$qry="SELECT key2speakers.spkr_name, speech.who FROM speech, key2speakers WHERE speech.who=key2speakers.who GROUP BY key2speakers.spkr_name;";
			$result=mysql_query($qry);
			while($row=mysql_fetch_assoc($result)){
				echo $row['who'].'%'.$row['spkr_name']."\n";
			}
			break;
		case 'quarto':
			$qry="SELECT files.* FROM files GROUP BY files.f_id;";
			$result=mysql_query($qry);
			$returnString="firstItem\n";
			while($row=mysql_fetch_assoc($result)){
				$temp=str_replace(".xml","",$row['proc_fn']);
				$temp=substr($temp,-3);
				$wInfo=$row['uniform_title'].", ".$row['Year'].", STC: ".$row["stc_number"].", ".$row['repository'].", ".str_replace("c","Copy ",$temp);
				$returnString.=$row['f_id'].'%'.$wInfo."\n";
			}
			echo $returnString;
			break;
		case 'act':
			$qry="SELECT DISTINCT s.act_num,s.sp_id FROM speech s GROUP BY s.act_num;";
			$result=mysql_query($qry);
			if(mysql_num_rows($result)>0){
				while($row=mysql_fetch_assoc($result)){
					$rowNum=($row['act_num']=='0')?"Backmatter":$row['act_num'];
					echo $rowNum.'%'."Act: ".$rowNum."\n";
				}
			} else {
				echo "False\n";
			}
			break;
		case 'scene':
			$qry="SELECT DISTINCT s.scene_num,s.sp_id FROM speech s GROUP BY s.scene_num;";
			$result=mysql_query($qry);
			if(mysql_num_rows($result)){
				while($row=mysql_fetch_assoc($result)){
					$rowNum=($row['scene_num']=='0')?"Backmatter":$row['scene_num'];
					echo $rowNum.'%'."Scene: ".$rowNum."\n";
				}
			} else {
				echo "False\n";
			}
	}
	
	
}

function getSecond(){
	
}

function getCurrent(){
	$name=$_GET['setName'];
	if(isset($_SESSION[$name])){
		echo $_SESSION[$name];
	} else if(!isset($_SESSION[$name])){
		echo "empty";
	}
	
}

?>