<?php
/*
 * saveCrop.php
 * Saves Cropped portions of windows
 * for workspace retrieval
 */
include_once('../../Global_Files/remoteCalling.php');

saveCrop();

function saveCrop() {
	/*
echo $_GET['id']."_".$_GET['src']."_".$_GET['srcx'] ."_". $_GET['srcy'] 
	."_". $_GET['srcw'] ."_". $_GET['srch'] 
	."_". $_GET['origw'] ."_". $_GET['origh'] 
	."_". $_GET['c_left'] ."_". $_GET['c_top'];
	
*/
		//all elements present
		$id = $_GET['id'];
		$src = $_GET['src'];
		$srcx = $_GET['srcx'];
		$srcy = $_GET['srcy'];
		$srcw = $_GET['srcw'];
		$srch = $_GET['srch'];
		$origw = $_GET['origw'];
		$origh = $_GET['origh'];
		$left=$_GET['c_left'];
		$top=$_GET['c_top'];
		$projId=$_GET['projId'];
		
		$qry = sprintf("INSERT INTO crops (c_id, htmlID, imageSrc, srcx, 
		srcy, srcw, srch, origw, origh, c_left,c_top,c_proj) VALUES
		('', '%s', '%s', '%s','%s','%s','%s','%s','%s','%s','%s','%s');",
			mysql_real_escape_string($id),
			mysql_real_escape_string($src),
			mysql_real_escape_string($srcx),
			mysql_real_escape_string($srcy),
			mysql_real_escape_string($srcw),
			mysql_real_escape_string($srch),
			mysql_real_escape_string($origw),
			mysql_real_escape_string($origh),
			$left,
			$top,
			mysql_real_escape_string($projId)
		);
		echo $qry;
		$result = mysql_query($qry);
		$cID = mysql_insert_id();
		
}

function checkCropExist($id) {
	$qry = sprintf("SELECT crops.* FROM crops, window_crops, project_window
	WHERE crops.htmlID='%s' AND window_crops.cID=crops.cID AND
	project_window.w_id=window_crops.wID
	AND project_window.p_id='%s';",
		mysql_real_escape_string($id),
		mysql_real_escape_string($_SESSION['pID'])
	);
	
	$result = mysql_query($qry);
	if($row = mysql_fetch_assoc($result)) {
		return $row['cID'];
	} else {
		return false;
	}
}
/*

function getWindowID($htmlID) {
	$qry = sprintf("SELECT window.w_id FROM window, project_window 
	WHERE window.htmlID='%s' AND project_window.w_id=window.w_id AND project_window.p_id='%s';",
		mysql_real_escape_string($htmlID),
		mysql_real_escape_string($_SESSION['pID'])
	);
	
	$result = mysql_query($qry);
	if($row = mysql_fetch_assoc($result)) {
		return $row['w_id'];
	}
	
}
*/
?>