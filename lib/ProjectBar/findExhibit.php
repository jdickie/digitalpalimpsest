<?php
/**
 * Finding exhibits based on names
 * 
 * Returns: output similar to getProjects.php
 */


include_once('../../Global_Files/remoteCalling.php');
findExhibit($_GET['text']);
function findExhibit($name){
	$qry=sprintf("SELECT project.*, user.uID FROM project_user INNER JOIN user ON project_user.u_id = user.uID, project
			WHERE project.p_id = project_user.p_id AND project.p_title REGEXP '%s' GROUP BY project.p_id;",
			mysql_real_escape_string($name)
		);
	$result=mysql_query($qry);
	while($row=mysql_fetch_assoc($result)){
		$Name = $row['p_title'];
		$pID = $row['p_id'];
		$desc= $row['p_desc'];
		$user=($_SESSION['uID']==$row['uID'])?1:0;
		echo "$pID%$Name%$desc%$user\n";
	}
					
}
?>