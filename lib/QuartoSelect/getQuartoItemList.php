<?php
/**
 * Find quarto items and derive
 * an informational list 
 */

//ini_set('display_errors', '1');
include_once('../../Global_Files/remoteCalling.php');


//constant value for all libraries in system
$libraries=array('hun'=>"Huntington Library", 
'bod'=>'Bodlein Library',
'fol'=>'Folger Library',
'bli'=>'British Library',
'eul'=>'University of Edinburgh','nls'=>'National Library of Scotland');

handle_header($libraries,$globalManifest);

function handle_header($libraries,$globalManifest){
	$type=$_GET['type'];
	switch($type){
		case 'list':
			//getQuartoList($libraries);
			//getManifestList($libraries,$globalManifest);
			getManifestTMS($libraries,$globalManifest);
			break;
	}
}
function getManifestTMS($libraries,$globalManifest){
	if(!($doc=simplexml_load_file(rawurlencode($globalManifest)))){
		die("Error, couldn't open filepath: $globalManifest");
	}
	foreach ($doc->manifest as $manifest){
		$uri=$manifest->attributes();
		$title=$manifest->title->attributes();
		//$info=$manifest->info->attributes();
		//$start=$manifest->start->attributes();
		//$teiHeaderData=getTEIHeaderData(str_replace("-manifest.xml",".xml",$uri["uri"]));
		
		
		echo $uri["uri"]."%".$title["name"]."/new/";
	}
}
function getManifestList($libraries,$globalManifest){
	if(!($doc=simplexml_load_file(rawurlencode($globalManifest)))){
		die("Error, couldn't open filepath: $globalManifest");
	}
	/*
$base=$doc->doc->attributes();
	$base=$base["base"];
*/
	foreach ($doc->manifest as $manifest){
		$uri=$manifest->attributes();
		$title=$manifest->title->attributes();
		$info=$manifest->info->attributes();
		$notes=$manifest->notes->attributes();
		$start=$manifest->start->attributes();
		//$teiHeaderData=getTEIHeaderData(str_replace("-manifest.xml",".xml",$uri["uri"]));
		
		$listItemData = split('-', $uri["uri"]);
		
		$play = ($listItemData[0]=='ham') ? "Hamlet" : "Unknown Play";
		$year = $listItemData[1];
		$STC = "STC: ".substr($listItemData[2], 0, -1);
		$lib = $libraries[$listItemData[3]];
		//$manifest=str_replace('.xml','-manifest.xml',$row['proc_fn']);
		$cn = str_replace('.xml', '', $listItemData[4]);
		
		$copyNo = "Copy ".substr($cn, -1);
		$liFData = $play.", ".$year.', '.$STC.', '.$lib.', '.$copyNo;
		
		echo $uri["uri"]."%".$title["name"].'%'.$info['data']."%".$notes["con"]."%".$liFData."%".$start["page"]."/new/";
	}
}
/**
 * retrieve data from the TEIheader
 * 
 * Get file name from getQuartoList
 */
function getTEIHeaderData($fp){

if(!($xmlDoc = simplexml_load_file("../../XML/".$fp))) die("Error opening file");


foreach($xmlDoc->teiHeader->fileDesc->children() as $child)
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
						$info.="TITLE: ". $subchild ."%";
						break;
					}
				}
			case "notesStmt":
				foreach($child->children() as $subchild)
				{
					$subchildname = $subchild->getName();
					
					if($subchildname == "note")
					{
						$info.="NOTES: ". $subchild ."%";
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
										$info.="ID No.: ".$id_child."%";
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
	return trim($info,"\n");
}
?>