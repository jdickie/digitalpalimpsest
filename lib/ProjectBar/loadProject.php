<?php
	//loadProject.php
    //for archielogin
	
	include("../../Global_Files/remoteCalling.php");
	
	
	$name = $_GET['project'];
	$id = $_GET['pID'];
	
	loadProject($name, $id);

	
	function loadProject($pname, $pid) {
		
		if(isset($_SESSION['project']) && isset($_SESSION['pID'])) { //project already open
			
			$ppname = $_SESSION['project'];
			$ppID = $_SESSION['pID'];
			
			
			//update database
			/*
$qry = sprintf("UPDATE Archie_login.project_user, project SET project_user.state='close' 
			WHERE project_user.p_id='%s' AND project.p_id=project_user.p_id;",
				mysql_real_escape_string($ppID)
			);
			$result = mysql_query($qry);
*/
			
			//close up project
			unset($_SESSION['project']);
			unset($_SESSION['pID']);
			unset($_SESSION['curPage']);
		}
		
		//set up global variables
		$_SESSION['project'] = $pname; 
		$_SESSION['pID'] = $pid;
		echo $_SESSION['project'];
		//Set state in project table
		/*
$qry = sprintf("UPDATE Archie_login.project_user SET project_user.state='open' 
		WHERE project_user.p_id='%s';",
			mysql_real_escape_string($pid)
		);
		$result = mysql_query($qry);
*/
		
		/*
$qry=sprintf("SELECT anno_set.set_id FROM anno_set INNER JOIN set_user ON set_user.set_id = anno_set.set_id WHERE anno_set.set_state = 'open'
AND set_user.u_id = '52';",
			mysql_real_escape_string($_SESSION['uID'])
		);
		
		$result=mysql_query($qry);
		while($row=mysql_fetch_assoc($result)){
			$_SESSION['annoName']=$row['set_id'];
		}
*/
		
		//header("Location: " . $_SERVER['HTTP_REFERER']);
	}
	
	function getCurrentPage($pID) {
	//current active window page
			if(isset($_SESSION['pID'])) {
				
				$qry = sprintf("SELECT window.curPage FROM project_window, window
				WHERE project_window.p_id='%s' AND project_window.w_id=window.w_id;",
					mysql_real_escape_string($pID)
				);
				
				$result = mysql_query($qry);
				
				if($row = mysql_fetch_assoc($result)) {
					return $row["curPage"];
					
				} else {
					echo false;
				}
				
			}
}



?>
