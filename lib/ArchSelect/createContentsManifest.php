<?php
/**
 * Creates a contentsmanifest.xml file with the following contents:
 * 
 * Based on tables of data, the manifest includes the Title, Author, and Page
 * Index of all works within the palimpsest
 */

include_once('../../Contents/contenttables.php');
//Path should be the path to the PNG/Tiff images - wherever a full image of the
//pages are

$text=sortContents($AUTHOR_WHO,$WORKS,$_GET['path'],(strtolower($_GET['v'])=="true")?true:false);

createXMLFile($text);
function sortContents($author,$works,$imgdir,$verbose){
	$TEXT="<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n";
	$TEXT.="<doc>\n";
	echo ($verbose)?"<h2>CONTENTS OF UNDERTEXT:</h2>":"";
	foreach($author as $who => $name){
		//go through directory and find image pairs
		$images=searchItems($who,$name,$imgdir);
		//now have an array that is all pages, separated by key value of 
		//the author's work's page  
		//EXAMPLE: 01v => 0000-100v
		
		echo ($verbose)? $name."<br/><br/>":"";
		
		//take this array and split it up depending on page values
		//for the author's individual work (taken from $works array)
		$aworks=$works[$who]; //works by this author and their page values
		$akeys=array_keys($works[$who]); //titles of the works
		$count=0;
		foreach($aworks as $work){
			$pages=split(";",$work,2); //get the start and end for this particular work
			if($pages){
				$start=str_replace($who,"",$pages[0]);$end=str_replace($who,"",$pages[1]);
				$insert=false;
				foreach($images as $image => $value){ 
					$keyval=intval(substr($image,0,2));
					$manipage=$value."-manifest.xml"; //name of manifest file for page
					if(($insert==false)&&($start==$keyval)){//does the key fall between those values?
						
						$TEXT.="<work>\n<title>".$akeys[$count]."</title>\n<author who=\"$who\">$name</author>\n";
						$TEXT.="<index>\n";
						echo ($verbose)? $akeys[$count]."<br/>":"";
						$count++;
						$TEXT.="<page id=\"$image\" xml=\"$manipage\">$value</page>\n";
						echo ($verbose)? $image.', '.$value."<br/>":"";
						$insert=true;
					} else if($insert){
						if($end==$keyval){
							$TEXT.="<page id=\"$image\" xml=\"$manipage\">$value</page>\n";
							$TEXT.="</index>\n";
							echo ($verbose)? $image.', '.$value."<br/>":"";
							$TEXT.="</work>\n";
							break;
						} else {
							$TEXT.="<page id=\"$image\" xml=\"$manipage\">$value</page>\n";
							echo ($verbose)? $image.', '.$value."<br/>":"";
						}
					}
				}
			}
			
			echo ($verbose)? "<br/>":"";
			
		}
		echo ($verbose)? "<hr/>":"";
		
	}
	$TEXT.="</doc>";
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
				if($innerhandle=opendir($dir.$file)){//echo $file."<br/>";
					//read the first image from this page, and 
					//return result if it contains author's key
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
	$savePath="../../manifest/works.xml";
	if($handle=fopen($savePath,'w')){
		for($w=0;$w<strlen($txt);$w+=128){
			$fwrite=fwrite($handle,substr($txt,$w,128));
		}
	};
	fclose($handle);
}

?>