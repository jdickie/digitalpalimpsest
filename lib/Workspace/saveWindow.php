<?php
    /***
     *saveWindow.php
     
     *
     * saves panels to a 
     * project and keeps the currently 
     * opened project, open
     * 
     * 
	*/
	
	include_once('../../Global_Files/remoteCalling.php');
	//get all necessary data
	$project=$_GET['project'];
	$pID=$_GET['pID'];
	$page = $_GET['curPage'];
	$panel = $_GET['panel']; //panel id
	$panel = str_replace('panel', '', $panel);
	$left = $_GET['left'];
	$top = $_GET['top'];
	$width=$_GET['width'];
	$height=$_GET['height'];
	$manifest = $_GET['manifest'];
	$wInfo = $_GET['wInfo'];
	startUpWindow($project,$pID,$panel,$page,$left,$top,$width,$height,$manifest,$wInfo);
	
	//load new window and update the database
	function startUpWindow($project,$pID,$panel,$page,$left,$top,$width,$height,$manifest,$wInfo) {
		if($project=='default'){
			$project=$_SESSION['uID']."_default";
			$qry=sprintf("SELECT project.p_id FROM project WHERE project.p_title='%s';",
				mysql_real_escape_string($project)
			);
			$result=mysql_query($qry);
			$row=mysql_fetch_array($result);
			$pID=$row['p_id'];
		}
		$qry = sprintf("INSERT INTO window (w_id, curPage, manifest, w_left, w_top, width, height, htmlID, p_id, w_info, state)
		VALUES ('', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s');",
			mysql_real_escape_string($page),
			mysql_real_escape_string($manifest),
			mysql_real_escape_string($left),
			mysql_real_escape_string($top),
			mysql_real_escape_string($width),
			mysql_real_escape_string($height),
			mysql_real_escape_string($panel),
			mysql_real_escape_string($pID),
			mysql_real_escape_string($wInfo),
			mysql_real_escape_string('open')
		);
		
		$result = mysql_query($qry);
		$w_id = mysql_insert_id();
		if($w_id){
			echo "True\n".$w_id;
		}
		
		
	}
	//checks if window is already in database
	function checkExists($panel, $pID) {
		$qry = sprintf("SELECT window.w_id 
		FROM window WHERE window.p_id='%s' AND window.w_id='%s';",
			mysql_real_escape_string($pID),
			mysql_real_escape_string($panel)
		);
		$result = mysql_query($qry);
		
		if($row = mysql_fetch_array($result)) {
			return true;
		} else {
			return false;
		}
		
	}
?>
