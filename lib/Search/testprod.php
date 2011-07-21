<?php
// MYSQLI
//$mysqli = new mysqli('localhost', 'root', 'root', 'archie_login');
$user="archie_user";
$pass="archie_user";
$host="localhost";
$searchString = trim($_GET['terms'],"\"\'");
//$searchString = "To be or not to be";

$callProcedure = "CALL get_search_result1('".$searchString."');";

/*
$mysqli = new mysqli($host,$user,$pass,"Archie_login");
if (mysqli_connect_errno()) {
	die ("Can't connect to MySQL Server. Errorcode: ". mysqli_connect_error(). "<br>");
} 
$rs = $mysqli->query($callProcedure);

while($row = $rs->fetch_object())
{
	debug($row);
}

*/
   /* fetch object array */
$mysqli = new mysqli($host,$user,$pass,"Archie_login");
if (mysqli_connect_errno()) {
	die ("Can't connect to MySQL Server. Errorcode: ". mysqli_connect_error(). "<br>");
} 
$rs = $mysqli->query($callProcedure);
   while ($obj = $rs->fetch_object()) 
   { 
       print_r($obj->sp_id);
       print_r($obj->who);
       print_r($obj->repository);
      	print '%';
       print $obj->sp_id.'%'. $obj->f_id.'%'. $obj->act_num.'%'. $obj->scene_num.'%'. $obj->who.'%'. $obj->pb1_id.'%'. $obj->pb1_img.'%'. $obj->sp_lines.'%'. $obj->uniform_title.'%'. $obj->year.'%'. $obj->stc_number.'%'. $obj->repository."\n";
   }
   
   
function debug($o)
{
print '<pre>';
print_r($o);
print '</pre>';
}


?>