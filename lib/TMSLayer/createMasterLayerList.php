<?php

//create master layer list - pull data from all manifest files
$self=$_SERVER['PHP_SELF'];

$manifestDir="../../manifest";

$masterList=array();

//for each file in directory, find the layer names and add to list (if new)
//open dir
if($dir=opendir($manifestDir)){
	while(($file=readdir($dir))!==false){
		if(($file!==".svn")&&($file!==".")&&($file!=="..")){
			if($fo=fopen($file,"r")){
				
			}
		} 
	}
	
} else {
	echo "error with ".$manifestDir;
}





?>