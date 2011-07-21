<?php
include_once('../../Global_Files/remoteCalling.php');

if(isset($_GET['width'])&&isset($_GET['height'])){
	rememberSize($_GET['width'],$_GET['height']);
}

function rememberSize($width,$height){
	$_SESSION['winsize']=$width."%".$height;
}
?>