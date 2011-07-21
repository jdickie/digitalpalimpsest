<?php
    /***
     *startUpWindow.php
     
     *
     * saves panels to a 
     * project
     * 
     * 
	*/
	
	include_once('../../Global_Files/remoteCalling.php');
	
	$project=$_GET['project'];
	$pID=$_GET['pID'];
	$mode = $_GET['mode'];
	$page = $_GET['curPage'];
	$panel = $_GET['panel']; //panel id
	$panel = str_replace('panel', '', $panel);
	$left = $_GET['left'];
	$top = $_GET['top'];
	$manifest = $_GET['manifest'];
	$wInfo = $_GET['wInfo'];
	startUpWindow($project, $pID, $mode, $panel, $page, $left, $top, $manifest, $wInfo);
	
	//load new window and update the database
	function startUpWindow($project, $pID, $mode, $panel, $page, $left, $top, $manifest, $wInfo) {
		if($project=='default'){
			$project=$_SESSION['uID']."_default";
			$qry="SELECT project.p_id FROM project WHERE project.p_title='$project'";
			$result=mysql_query($qry);
			$row=mysql_fetch_array($result);
			$pID=$row['p_id'];
		}
		if($mode == 'new') { //insert new 
			if(checkExists($panel, $pID)) {
				$qry = sprintf("UPDATE window SET window.w_left='%s', window.w_top='%s', window.curPage='%s'
				WHERE window.p_id='%s' AND window.w_id='%s';",
					mysql_real_escape_string($left),
					mysql_real_escape_string($top),
					mysql_real_escape_string($page),
					mysql_real_escape_string($pID),
					mysql_real_escape_string($panel)
				);
				
				$result = mysql_query($qry);
				
			} else {
				
				$qry = sprintf("INSERT INTO window (w_id, curPage, manifest, w_left, w_top, htmlID, p_id, w_info, state)
				VALUES ('', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s');",
					mysql_real_escape_string($page),
					mysql_real_escape_string($manifest),
					mysql_real_escape_string($left),
					mysql_real_escape_string($top),
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
