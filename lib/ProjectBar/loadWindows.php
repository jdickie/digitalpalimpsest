<?php
//loadWindows.php
//for Archie login
ini_set('display_errors','1');
include_once('../../Global_Files/remoteCalling.php');

loadWindows();

function loadWindows() {
	//constant value for all libraries in system
		$libraries=array('hun'=>"Huntington Library", 
		'bod'=>'Bodlein Library',
		'fol'=>'Folger Library',
		'bli'=>'British Library');
	
	//load windows that are open
	$_SESSION['pID']=$_GET['id'];
	$windows = getWindows();
	$wstring = "";
	if(count($windows) > 0) {
		for($i=0;$i<count($windows);$i++) {
			$temp = $windows[$i];
			
			$listItemData = split('-', $temp['manifest']);
		
			$play = ($listItemData[0]=='ham') ? "Hamlet" : "Unknown Play";
			$year = $listItemData[1];
			$STC = "STC: ".substr($listItemData[2], 0, -1);
			$lib = $libraries[$listItemData[3]];
			
			$cn = str_replace('.xml', '', $listItemData[4]);
			
			$copyNo = "Copy ".substr($cn, -1);
			$lifData = $play.", ".$year.', '.$STC.', '.$lib.', '.$copyNo;
			
			$wstring .= $temp["w_left"] . "," . $temp["w_top"] . "%" . $temp["w_id"] . "%" . $temp["width"]. "%" .$temp["height"]. "%" .$temp["curPage"] . "%" . $temp["manifest"] . "%" . $temp["w_info"] . ";";
		}
		echo substr($wstring, 0, -1);
	} else {
		echo "empty";
	}
}
function getWindows() {
		$qry = sprintf("SELECT window.* FROM window, project WHERE project.p_id=window.p_id AND project.p_id='%s';",
			mysql_real_escape_string($_SESSION['pID'])
		);
		$result = mysql_query($qry);
		
		$windows = array();
		while($row = mysql_fetch_assoc($result)) { //make array of arrays
			array_push($windows, $row); 
		}
		return $windows;
	}
	
?>