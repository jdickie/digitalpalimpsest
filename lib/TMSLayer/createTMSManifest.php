<?php
/**
 * Create an XML manifest file to store locations of 
 * TMS compliant image folders
 */

include_once('../../Global_Files/globalSettings.php');

//Get request holds data for where image folder is kept
if(isset($_GET['path'])){
	$xpath="../../".$xmlPath;
	goThroughFolders($_GET['path'],$xpath);
}


function goThroughFolders($folder,$xmlPath){
	if($handle = opendir($folder)){
		while($file=readdir($handle)){
			//make sure its an image folder
			if(!(is_dir($file))){
				if(substr(trim($file),0,1)!='.'){echo $file."<br/>";
					//service version folder, get all the related pages
					$base=$file."/1.0.0";
					$tmssrc=$folder.'/'.$file.'/1.0.0/';
					createTMSManifest($tmssrc,$base,$file,$xmlPath);
				}
			}
		}
	} else {
		die("Error opening $folder");
	}
	
}

function createTMSManifest($folder,$base,$name,$xmlPath){
	$outPath="../../manifest/";
	echo $outPath."<br/><br/>";
	if($handle = opendir($folder)){
		$fp = fopen($outPath."$name-manifest.xml","w");
		
		fwrite($fp,'<?xml version="1.0" encoding="UTF-8" standalone="yes"?>');
		
		fwrite($fp,"<doc base=\"".$base."\">\n");
		fwrite($fp,"<page>\n");
		$valueblock="<value>".$name."</value>\n";
		fwrite($fp,$valueblock);
		$utblock="<undertext>".$name."</undertext>\n";
		while(($file=readdir($handle))!==false){
			if(!is_dir($file)){
				if(substr(trim($file),0,1)!='.'){echo "   $file<br/>";
					//is a directory
					fwrite($fp,"<layer>$file</layer>\n");
				}
			}
		}
		if($xml=opendir($xmlPath)){
			while($file=readdir($xml)){
				if(substr_count($file,$name)>0){
					fwrite($fp,"<pagetext xmluri=\"$file\"></pagetext>\n");
					break;
				}
			}
		}
		
		fwrite($fp,"</page>\n");
		fwrite($fp,"</doc>");
		
		//outputXML($outPath,$outstring);
		
		closedir($handle);
		fclose($fp);
	} 
}
function outputXML($savepath,$text){
	$xml=new DOMDocument();
	$xml->loadXML($text);
	$pathparts=split('/',$_GET['path']);
	$file=$pathparts[count($pathparts)-1]."-manifest.xml";
	
	//header("Content-Type: text/html/force-download");
	//header("Content-Disposition: attachment; filename=$file");
	echo $xml->saveXML();
	
}
?>