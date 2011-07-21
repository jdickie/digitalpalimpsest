<?php
    //getProjects.php
	//for Archielogin
	//new version
	include_once('../../Global_Files/remoteCalling.php');
	
	
	getUserProjects();
	
	function getUserProjects() {
		if($_GET['mode'] == 'all') {	
			if(isset($_SESSION['user'])) {	
				/*
if(!(isset($_SESSION['vars']))) {
					
					$user = $_SESSION['uID'];
					$query = sprintf("SELECT project.*, user.login FROM project, project_user INNER JOIN user ON project_user.u_id=user.uID
					WHERE project_user.u_id='%s' AND project_user.p_id=project.p_id;",
						mysql_real_escape_string($user)
					);
					
					$result = mysql_query($query);
				
					//running the while loop
					while ($row = mysql_fetch_assoc($result)){
						
						$Name = $row['p_title'];
						$pID = $row['p_id'];
						$desc= $row['p_desc'];
						$user=$row['login'];
						echo "$pID%$Name%$desc%$user\n";
					}
				} else if(strpos($_SESSION['vars'], 'ibit')){
*/
					
					
					$qry="SELECT project.*, user.uID FROM project_user INNER JOIN user ON project_user.u_id = user.uID, project
					WHERE project.p_id = project_user.p_id GROUP BY project.p_id;";
					
					$result=mysql_query($qry);
					while($row=mysql_fetch_assoc($result)){
						if(!($row['uID']==$_SESSION['uID'])){
							$Name = $row['p_title'];
							$pID = $row['p_id'];
							$desc= $row['p_desc'];
							$user=$row['login'];
							echo "$pID%$Name%$desc%$user\n";
						}
					}
			
		} else {
			echo "<a>Sorry, you must be logged in to use this feature.</a>";
		}
	} else if($_GET['mode'] == 'current'){
		if(isset($_SESSION['project'])){
			echo $_SESSION['project']."\n".$_SESSION['pID'];
		} else {
			$qry = sprintf("SELECT project.* FROM project, project_user WHERE project_user.u_id='%s' AND project_user.state='open';",
				mysql_real_escape_string($_SESSION['uID'])
			);
			$result = mysql_query($qry);
			if(mysql_affected_rows($result) > 0) {
				$row = mysql_fetch_assoc($result);
				echo "True"."\n".$row['p_title']."\n".$row['p_id']."\n";
				
			} else {
				echo "False"."\n";
			}
		}
		
		//echo (isset($_SESSION['project'])) ? $_SESSION['project'] .','.$_SESSION['pID'] : 0;
	} else if($_GET['mode']=="mine"){
		$qry=sprintf("SELECT project.* FROM project, project_user WHERE project.p_id=project_user.p_id AND project_user.u_id='%s';",
			mysql_real_escape_string($_SESSION['uID'])
		);
		$result=mysql_query($qry);
		while($row=mysql_fetch_assoc($result)){
			echo $row['p_id']."%".$row['p_title']."%".$row['p_desc']."\n";
		}
	}
}
	
	
	
?>
