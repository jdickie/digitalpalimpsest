<?php
ini_set("memory_limit","64M");

ini_set(
    "max_execution_time", "120"

    );

$fp = $_GET['fp'];
$prefix = $_GET['prefix'];
echo "<?xml version='1.0'?>";
	$file = fopen($fp, 'r') or die("Error opening file");
	$text = "";
	//while not at end of file, recieve at 4Kb per cycle
	while(!feof ($file)) {
		$text .= fgets($file, 1024); 
	
	}
	fclose($file);






$xml = new DOMDocument;
$xml->loadXML($text);
$docEle = $xml->documentElement;
processXML($docEle,0,$xml,$prefix);
$fstream = fopen("./$prefix"."_proc.xml", 'w');
	fwrite($fstream, $xml->saveXML());
	fclose($fstream);

function processXML($ele,$counter,$xml,$prefix) {


	$kids = $ele->childNodes;
	$tagName = $ele->nodeName;
	if ($tagName=="#text"){
		
		
		
		
	}
	else{
		
    if (!($ele->hasAttribute("xml:id"))) {
    	$thisId = $prefix.$counter;
    	while ($xml->getElementById($thisId)){
    		$counter++;
		
			$thisId = $prefix.$counter;
    	}  	
		$ele->setAttribute("xml:id",$prefix.$counter);
		$counter++;
    }

	
	//echo $thisCounter;
	if ($kids){
	foreach ($kids as $kid){
     
			$counter = processXML($kid,$counter,$xml,$prefix);
	}
	}

	}	
	
	
	return $counter;	
	
}

?>
