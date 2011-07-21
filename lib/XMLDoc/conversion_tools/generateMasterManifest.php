<?php
/**
 * Generate the manifest that points to other manifests
 * 
 * Location of manifest must be added manually to 
 * GlobalFiles
 * 
 * Global manifest appears as 'globalmanifest.xml' in 
 * manifest folder
 */
$FILEPATH=$_GET['fp'];
createManifest($FILEPATH);
function createManifest($FP){
	$manName="globalmanifest.xml";
	$path=$_GET['path'];//write to this path
	
	//using XMLWriter from php.net
	$xmlout=new XMLWriter();
	$xmlout->openMemory('php://output');
	$manList=opendir($path);
	$tPath=$FP.str_replace("../","",$path);
	$totalXML="<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\n<doc base=\"$tPath\">\n";
	while($file=readdir($manList)){
	if((substr_count($file,'.xml')>0) && ($file !== "globalmanifest.xml")){
		$xmlpath=str_replace("-manifest.xml",".xml",$file);
		$dataArray=getTeiData($xmlpath);
		$totalXML.="<manifest uri=\"$file\">\n<title id=\"TITLE:\" name=\"$dataArray[0]\"/>\n<info id=\"INFO:\" data=\"$dataArray[2]\"/>\n<notes id=\"NOTES:\" con=\"$dataArray[1]\"/>\n</manifest>";
		}
	}	
$totalXML.="</doc>";
$doc=new DOMDocument();
$doc->loadXML($totalXML);
header("Content-Type: text/html/force-download");
header("Content-Disposition: attachment; filename='$manName'");
echo $doc->saveXML();
}

function findXMLManifests(){
	//create list of manifests
	$path=$_GET['path'];
	$manfile=opendir($path);
	$list="";
	while(($file=readdir($manfile))!==false){
		$list.=$file."\n";
	}
	return $list;
}

function getTeiData($path){
	if(!($doc=simplexml_load_file('../../../XML/'.$path))){
		die("Error opening XML file: $path");
	}
	$info="";
	foreach($doc->teiHeader->fileDesc->children() as $child)
{
		$childname = $child->getName();
		$childattributes = $child->attributes();
		
		//echo($childname. "<br />\n");
	
		switch ($childname)
		{
			case "titleStmt":
				foreach($child->children() as $subchild)
				{
					$subchildname = $subchild->getName();
					
					if($subchildname == "title")
					{
						$info.=$subchild ."%";
						break;
					}
				}
			case "notesStmt":
				foreach($child->children() as $subchild)
				{
					$subchildname = $subchild->getName();
					
					if($subchildname == "note")
					{
						$info.=$subchild ."%";
						break;
					}
				}
			case "sourceDesc":
				foreach($child->children() as $subchild)
				{
					$subchildname = $subchild->getName();
					
					if($subchildname == "bibl")
					{
						$id_flag = false;
						foreach($subchild->children() as $id_child)
						{
							if($id_child->getName() == "idno")
							{
								foreach($id_child->attributes() as $id_attributes)
								{
									
									if($id_attributes == "shelfMark")
									{
										$info.=$id_child;
										$id_flag = true;
										break;
									}
								}
							}
							if($id_flag) break;
						}
						break;
					}
				}
		}
}
	return explode("%",trim($info));
}

?>