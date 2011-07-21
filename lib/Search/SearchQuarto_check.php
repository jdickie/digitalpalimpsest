<?php
/***
 * SearchQuarto.php
 * 
 * For retrieving and sending data to the 
 * Archie database for searching all the quartos
 * or specific quarto(s)
 */

include_once('../../Global_Files/remoteCalling.php');


handle_header();

function handle_header(){
	$type=$_GET['type'];
	switch($type){
		case 'getQuartos':
			getQuartoList();
			break;
		case 'getResults':
			getResults();
			break;
		case 'getSpeakers':
			getSpeakers();
			break;
		case 'getPhrase':
			getPhrase();
			break;
	}
}

/***
 * Echo out a list of the filenames for 
 * Quartos
 * @return 
 */
function getQuartoList(){
	//return a full list of speakers
	$qry="SELECT files.* FROM files ORDER BY files.f_id;";
	$result=mysql_query($qry);
	
	while($row=mysql_fetch_assoc($result)){
		echo $row['f_id'].','.$row['filename'].'-';
	}
}

/***
 * Retrieve list of speakers
 * 
 * @return 
 */
function getSpeakers(){
	$lim=(isset($_GET['lim'])) ? $_GET['lim'] : null;
	if(is_null($lim)){
		$qry="SELECT speakers.sp_id, key2speakers.spkr_name FROM speakers, key2speakers WHERE speakers.who=key2speakers.who GROUP BY speakers.sp_id;";
		$result=mysql_query($qry);
		while($row=mysql_fetch_assoc($result)){
			echo $row['sp_id'].'%'.$row['spkr_name'].'-';
		}
	} else {
		
	}
	
}
function getProcedure($termType,$str,$CASE){
	$callProcedure="";
	$name=$_GET['setName'];
	switch($termType){
		case 'phrase':
			if($CASE=="CI"){
				$qry="SELECT s.sp_id, s.f_id, s.act_num, s.scene_num, s.who, s.pb1_id, s.pb1_img, s.sp_lines FROM speech s WHERE MATCH (s.sp_lines) AGAINST ('\"".$str."\"' IN BOOLEAN MODE) ORDER BY s.sp_id ASC;";
				return $qry;
			} else if($CASE=="CS"){
				$qry="SELECT s.sp_id, s.f_id, s.act_num, s.scene_num, s.who, s.pb1_id, s.pb1_img, s.sp_lines FROM speech s WHERE MATCH (s.sp_lines_cs) AGAINST ('\"".$str."\"' IN BOOLEAN MODE) ORDER BY s.sp_id ASC;";
				return $qry;
			}
			break;
		case 'word':
			if($CASE=="CI"){
				$qry="SELECT s.sp_id, s.f_id, s.act_num, s.scene_num, s.who, s.pb1_id, s.pb1_img, s.sp_lines FROM speech s WHERE MATCH (s.sp_lines) AGAINST ('\"".$str."\"' IN BOOLEAN MODE) ORDER BY s.sp_id ASC;";
				return $qry;
			} else if($CASE=="CS"){
				$qry="SELECT s.sp_id, s.f_id, s.act_num, s.scene_num, s.who, s.pb1_id, s.pb1_img, s.sp_lines FROM speech s WHERE MATCH (s.sp_lines_cs) AGAINST ('\"".$str."\"' IN BOOLEAN MODE) ORDER BY s.sp_id ASC;";
				return $qry;
			}
			break;
	}
	
}

function getPhrase(){
	$CASE=$_GET['CASE'];
	$searchString = trim($_GET['terms'],"\"\'");
	$callProcedure=getProcedure("phrase",$searchString,$CASE);
	
	$result=mysql_query($callProcedure);
	$fData=sortData($result);//sorts data through filters (if any)
	
	echo $fData;
}

function sortData($data){
	//$data is result data from getPhrase
	$allOk=false;
	$scLimits=array();
	$sLimits=array();
	$aLimits=array();
	$qLimits=array();
	$finalData="";
	$name=$_GET['setName'];
	if((isset($_SESSION[$name]))&&(!($_SESSION[$name]==""))){
		$limits=split("\n",$_SESSION[$name]);
			for($dat=0;$dat<count($limits);$dat++){
				$record=split(',',$limits[$dat]);
				if(!($record[0]==" ")){
					switch(trim($record[0],"\n ")){ //record[0] refers to type
						case 'quarto':
							//$callProcedure=" AND s.f_id=".$record[1];
							array_push($qLimits,$record[1]);
							break;
						case 'speaker':
							array_push($sLimits,$record[1]);
							break;
						case "scene":
							array_push($scLimits,$record[1]);
							break;
						case 'act':
							array_push($aLimits,$record[1]);
							break;
					}
				}
			}
	} else {
		$allOk=true;
	}
	while($row=mysql_fetch_assoc($data)){
		$check=($allOk)?true:false;
		if(!($check)){
			foreach($qLimits as $fid){
				if($fid==$row["f_id"]){
					$check=true;
					break;
				} else {
					$check=false;
				}
			}
			foreach($aLimits as $aid){
				if($aid==$row['act_num']){
					$check=true;
				} else {
					$check=false;
				}
			}
			foreach($scLimits as $sc){//scenes
				if($sc==$row['scene_num']){
					$check=true;
				} else {
					$check=false;
				}
			}
			foreach($sLimits as $s){//speakers
				if($s==$row['who']){
					$check=true;
				} else {
					$check=false;
				}
			}
		}
		if($check){
			//find speaker name and quarto info
			$qry=sprintf("SELECT f.uniform_title,f.year,f.stc_number,f.repository,f.proc_fn FROM files f WHERE f.f_id='%s';",
				mysql_real_escape_string($row['f_id']),
				mysql_real_escape_string($row['who'])
			);
			$rResult=mysql_query($qry);
			$rRow=mysql_fetch_assoc($rResult);
			$copy=str_replace(".xml","",$rRow['proc_fn']);
			$copy=substr($copy,-3);
			$copy=str_replace("c","Copy ",$copy);
			$wInfo=$rRow['uniform_title'].", ".$rRow['year'].", STC: ".$rRow['stc_number'].", ".$rRow['repository'].", ".$copy;
			$qry=sprintf("SELECT k.spkr_name FROM key2speakers k WHERE k.who='%s';",mysql_real_escape_string($row['who']));
			$rResult=mysql_query($qry);
			$rRow=mysql_fetch_assoc($rResult);
			$finalData.=$row['sp_id'].$row['who'].'%'.$row['sp_id'].'%'. $row['act_num'].'%'. $row['scene_num'].'%'. $rRow['spkr_name'].'%'. $row['pb1_id'].'%'. $row['pb1_img'].'%'. $row['sp_lines'].'%'. $wInfo."\n";
		}
	}
	return $finalData;
}


?>