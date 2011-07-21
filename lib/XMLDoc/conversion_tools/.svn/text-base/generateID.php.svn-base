<?php
ini_set("memory_limit","64M");

ini_set(
    "max_execution_time", "120"

    );

echo "<?xml version='1.0'?>";
$txt = stripslashes($_POST['old']);

$prefix = $_POST['prefix'];


$xml = new DOMDocument;
$xml->loadXML($txt);
$docEle = $xml->documentElement;
processXML($docEle,0,$xml,$prefix);
echo $xml->saveXML();
function processXML($ele,$counter,$xml,$prefix) {


	$kids = $ele->childNodes;
	$tagName = $ele->nodeName;
	if ($tagName=="#text"){
		
		
		
		
	}
	else{
		
    if (!($ele->hasAttribute("xml:id"))) {
    	
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
