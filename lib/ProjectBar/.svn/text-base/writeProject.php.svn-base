<?php
   //writeProject.php
   //Write Project name to Archie_login DB
   include_once("../../Global_Files/remoteCalling.php");
  
   
   if($_GET['mode'] == 'new') {
   		processProj();
   } else if($_GET['mode'] == 'save') {
   		saveProj();
   }
   
   
   function processProj() {
   		if($_GET['projectName']) {
   			if(isset($_SESSION['pID'])) {
   				$ppname = $_SESSION['project'];
				$ppID = $_SESSION['pID'];
				
				//update database
				$qry = sprintf("UPDATE Archie_login.project_user, project SET project_user.state='close' 
				WHERE project_user.p_id='%s' AND project_user.u_id='%s' AND project.p_id=project_user.p_id;",
					
					mysql_real_escape_string($ppID),
					mysql_real_escape_string($_SESSION['uID'])
				);
				$result = mysql_query($qry);
				
				//close up project
				unset($_SESSION['project']);
				unset($_SESSION['pID']);
				unset($_SESSION['curPage']);
   			}
			
   			$project = $_GET['projectName'];
			if(checkExists($project)) {
				if($_GET['pID']){
					loadProject($project, $_GET['pID']);
				} else {
					echo "Exhibit already exists";
				}
			} else {
	   			$qry = sprintf("INSERT INTO Archie_login.project (p_id, p_title, p_desc) 
				VALUES ('', '%s', '%s');", 
					mysql_real_escape_string($_GET['projectName']),
					mysql_real_escape_string($_GET['desc'])
					
				);
				$response = mysql_query($qry);
				$pID = mysql_insert_id();
				$uID = $_SESSION['uID'];
				
				$_SESSION['pID'] = $pID;
				$_SESSION['project'] = $project;
				
				$qry = sprintf("INSERT INTO Archie_login.project_user (p_id, u_id, permission, state) 
				VALUES ('%s', '%s', '%s', '%s');",
					mysql_real_escape_string($pID),
					mysql_real_escape_string($uID),
					mysql_real_escape_string('a'),
					mysql_real_escape_string('open')
				);
				$response = mysql_query($qry);
				echo $pID."\n".$project;
				//update variable filter
				if(isset($_SESSION['vars'])){
					$_SESSION['vars'].="exhibit!$pID-";
				}
				
			}
   		} else {
   			die('unable to connect to database ($db)');
   		}
	
   }
   function saveProj() {
   		if($_GET['project']) {
   			$proj = $_GET['project'];
   			//update windows open
			if($proj == $_SESSION['project']) {
				//update database
				$qry = sprintf("UPDATE Archie_login.project_user, project SET project_user.state='close' 
				WHERE project_user.p_id='%s' AND project_user.u_id='%s' AND project.p_id=project_user.p_id;",
					
					mysql_real_escape_string($ppID),
					mysql_real_escape_string($_SESSION['uID'])
				);
				$result = mysql_query($qry);
			} else if(checkExists($proj)) {
				//update database
				$qry = sprintf("UPDATE Archie_login.project_user, project SET project_user.state='close' 
				WHERE project_user.p_id='%s' AND project_user.u_id='%s' AND project.p_id=project_user.p_id;",
					
					mysql_real_escape_string($ppID),
					mysql_real_escape_string($_SESSION['uID'])
				);
				$result = mysql_query($qry);
				echo $_SESSION['pID'];
			} else {
				processProj();
			}
			//update coordinates
			
   		}
   }
   
   function checkExists($project) {
		$qry = sprintf("SELECT project.p_id FROM project JOIN project_user ON project.p_id=project_user.p_id
		WHERE project.p_title='%s'
		AND project_user.u_id='%s';",
			mysql_real_escape_string($project),
			mysql_real_escape_string($_SESSION['uID'])
		);
		$result = mysql_query($qry);
		
		if($row = mysql_fetch_array($result)) {
			return true;
		} else {
			return false;
		}
		
	}
	
	function loadProject($pname, $pid) {
		
		if(isset($_SESSION['project']) && isset($_SESSION['pID'])) { //project already open
			
			$ppname = $_SESSION['project'];
			$ppID = $_SESSION['pID'];
			
			
			//update database
			$qry = sprintf("UPDATE Archie_login.project_user, project SET project_user.state='close' 
			WHERE project_user.p_id='%s' AND project_user.u_id='%s' AND project.p_id=project_user.p_id;",
				mysql_real_escape_string($ppID),
				mysql_real_escape_string($_SESSION['uID'])
			);
			$result = mysql_query($qry);
			
			//close up project
			unset($_SESSION['project']);
			unset($_SESSION['pID']);
			unset($_SESSION['curPage']);
		}
		
		//set up global variables
		$_SESSION['project'] = $pname; 
		$_SESSION['pID'] = $pid;
		
		//Set state in project table
		$qry = sprintf("UPDATE Archie_login.project_user SET project_user.state='open' 
		WHERE project_user.p_id='%s' AND project_user.u_id='%s';",
			mysql_real_escape_string($pid),
			mysql_real_escape_string($_SESSION['uID'])
		);
		$result = mysql_query($qry);
		
		$qry=sprintf("SELECT anno_set.set_id FROM anno_set INNER JOIN set_user ON set_user.set_id = anno_set.set_id WHERE anno_set.set_state = 'open'
AND set_user.u_id = '52';",
			mysql_real_escape_string($_SESSION['uID'])
		);
		
		$result=mysql_query($qry);
		while($row=mysql_fetch_assoc($result)){
			$_SESSION['annoName']=$row['set_id'];
		}
		
		header("Location: " . $_SERVER['HTTP_REFERER']);
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
