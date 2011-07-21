<?php
/**
 * getQueLines
 * 
 * Input: Character Name
 * Output: Array of all character's lines
 * plus the previous speaker's lines 
 * (Nth line plus (n-1) line)
 * 
 * Can be limited down using setLimits
 */

include_once('../../Global_Files/remoteCalling.php');
	
if($_GET['html']=='yes'){
	outputResultHTML();
} else {	
	getQueLines();
}
function getQueLines(){
	$qry=getSetNameProc();
	$result=mysql_query($qry);
	if(mysql_num_rows($result)<900){
		while($row=mysql_fetch_assoc($result)){
			$prev=intval($row['sp_id'])-1;
			$qry2=sprintf("SELECT speech.sp_lines, key2speakers.spkr_name FROM speech, key2speakers WHERE key2speakers.who=speech.who AND speech.sp_id='%s';",
				mysql_real_escape_string($prev)
			);
			$reResult=mysql_query($qry2);
			$rRow=mysql_fetch_assoc($reResult);
			$pQuote=$rRow['sp_lines'];
			$pSpkr=$rRow['spkr_name'];
			$quote=$row['sp_lines'];
			$quoteSpkr=$row['spkr_name'];
			
			$wInfo=$row['uniform_title'].", ".$row['year'].", STC: ".$row['stc_number'].", ".$row['repository']." Library";
			
			echo $row['sp_id'].$row['who'].$row['repository'].'%'.$row['sp_id'].'%'. $row['act_num'].'%'. $row['scene_num'].'%'. $row['spkr_name'].'%'. $row['pb1_id'].'%'. $row['pb1_img'].'%'. $quote.'%'. $wInfo.'%'.$pQuote.'%'.$pSpkr.'%'.$quoteSpkr."\n";
			
		}
	} else {
		echo "Overflow";
	}
}
function getSetNameProc(){
	$setName=$_GET['setName'];
	$who=trim($_GET['who']," \n");
	$proc="";$q=0;$a=0;$s=0;
	if((strlen($_SESSION[$setName])>0)){
		$data=split("\n",$_SESSION[$setName]);
		for($i=0;$i<count($data);$i++){
			$record=split(",",$data[$i],2);
			if(!($record[0]=="")){
				switch(trim($record[0]," \n")){
					case 'quarto':
						$proc.=($q>0)?" OR f.f_id=".$record[1]:" AND f.f_id=".$record[1];
						$q++;
						break;
					case 'act':
						$proc.=($a>0)?" OR s.act_num=".$record[1]:" AND s.act_num=".$record[1];
						$a++;
						break;
					case 'scene':
						$proc.=($s>0)?" OR s.scene_num=".$record[1]:" AND s.scene_num=".$record[1];
						$s++;
						break;
				}
				
			}
			
		}
		return sprintf("SELECT s.sp_id,s.act_num,s.scene_num,s.sp_lines,s.pb1_img,s.pb1_id,k.spkr_name, f.f_id, f.uniform_title, f.year, f.stc_number, f.repository FROM speech s, key2speakers k, files f WHERE f.f_id=s.f_id AND s.who=k.who AND s.who='%s' ".$proc." GROUP BY s.sp_id ASC;",
					mysql_real_escape_string($who)
				);
	} else {
		return sprintf("SELECT s.sp_id,s.act_num,s.sp_lines,s.scene_num,s.pb1_img,s.pb1_id,k.spkr_name, f.f_id, f.uniform_title, f.year, f.stc_number, f.repository FROM speech s, key2speakers k, files f WHERE f.f_id=s.f_id AND s.who=k.who AND s.who='%s' GROUP BY s.sp_id ASC;",
			mysql_real_escape_string($who)
		);
	}
}
function outputResultHTML(){
	$qry=getSetNameProc();
	$result=mysql_query($qry);
	echo "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">
\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n
    <head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=ISO-8859-1\" />
        \n<title>The Shakespeare Quartos Archive</title>\n</head>
";
	echo "<ul>\n";
	while($row=mysql_fetch_assoc($result)){
		$prev=intval($row['sp_id'])-1;
		$qry2=sprintf("SELECT speech.sp_lines, key2speakers.spkr_name FROM speech, key2speakers WHERE key2speakers.who=speech.who AND speech.sp_id='%s';",
			mysql_real_escape_string($prev)
		);
		$reResult=mysql_query($qry2);
		$rRow=mysql_fetch_assoc($reResult);
		$pQuote=$rRow['spkr_name'].": ".$rRow['sp_lines'];
		$quote=$row['spkr_name'].": ".$row['sp_lines'];
		$wInfo=$row['uniform_title'].", ".$row['year'].", STC: ".$row['stc_number'].", ".$row['repository']." Library";
		$pbid=split('-',$row['pb1_id'],6);
		
		$page=preg_replace('/a/',"",$pbid[5]);$page=preg_replace('/b/',"",$page);
		echo "<li class=\"fileitem\">\n";
		echo "Act: ".$row['act_num'].", Scene: ".$row['scene_num']." Page: ".$page."<br />\n"; 
		echo "Speaker: ".$row['spkr_name']."<br />\n";
		echo "Quarto: ".$wInfo."<br />\n";
		echo $pQuote."<br />\n";
		echo '<strong>'.$quote."</strong><br />\n";
		echo "</li>\n";
	
	}
	echo "</ul>\n";
	echo "</body>\n";
	echo "</html>";
	
	
	
	
}
?>