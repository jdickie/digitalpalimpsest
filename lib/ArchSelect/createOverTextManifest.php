<?php
/**
 * Creates the manifest for the page order of the 
 * original Prayer Book, written over all of the other
 * works in the Palimpsest
 */

include_once('../../Contents/contenttables.php');
include_once('../../Global_Files/globalSettings.php');

$text=sortPageOrder($PRAYERBOOK);
createXMLFile($text);

function sortPageOrder($pages){
	$TEXT="<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n";
	$TEXT.="<doc>\n";
	$TEXT.="<work>\n";
	$TEXT.="<title>Prayer Book</title>\n";
	$TEXT.="<index>\n";
	foreach($pages as $p){
		$pageid=str_replace("-","_",$p);
		$manipage=$p."-manifest.xml";
		$TEXT.="<page id=\"$pageid\" xml=\"$manipage\">$p</page>\n";
	}
	$TEXT.="</index>\n";
	$TEXT.="</work></doc>";
	return $TEXT;
}

function searchItems($key,$name,$dir){
	if($handle=opendir($dir)){
		//key is found within the image name
		//put all instances in this array
		$images=array();
		
		while($file=readdir($handle)){
			
			if(substr($file,0,1)!="."){
				//go inside this folder and search
				if($innerhandle=opendir($dir.$file)){
					//read the first image from this page, and 
					//return result if it contains key
					while($innerfile=readdir($innerhandle)){
						if(strstr($innerfile,$key)){//echo $innerfile."<br/><br/>";
							$n=strpos($innerfile,$key);
							$page=substr($innerfile,0,($n-1));
							$tkey=substr($innerfile,($n+4),3);
							$tkey=str_replace("_","",$tkey);
							$images[$tkey]=$page;
							break;
						} 
					}
					
				}
				
			}
		}
		
		ksort(&$images);
		/*
echo $key."<br/>";
		print_r($images); echo "<br/><br/>";
*/
		return $images;
	} else {
		echo "Error opening filepath: $dir";
	}
	
}
function createXMLFile($txt){
	$dom=new DOMDocument();
	$dom->loadXML($txt);
	$savePath="../../manifest/prayerbook.xml";
	if($handle=fopen($savePath,'w')){
		for($w=0;$w<strlen($txt);$w+=128){
			$fwrite=fwrite($handle,substr($txt,$w,128));
		}
	};
	fclose($handle);
}

?>