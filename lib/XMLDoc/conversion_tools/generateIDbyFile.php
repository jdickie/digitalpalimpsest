<?php

// Functions to get an xml:id prefix to make unique xml:id tags
// and to set xml:ids for any tags in a doc that don't have the xml:ids already

// Basically, this is the "generateID" that Doug created for EBP
// only passing @params from the calling script or function,
// versus getting GET[]/POST[] vars from HTTP.
// Used by testProc2DB.php for Quartos (as of 4/2009)

/* ****************************
 * Function:	getPrefix
 * Inputs:		1) filename of source file
 * 
 * Output:		an "xml:id" prefix based on file format
 * ****************************/ 
function getPrefix($fn) {
	
	$prefix = $fn;
	if (strlen($prefix)<1) {
		$prefix = "tag";
	}	
	return $prefix;
}

/* ****************************
 * Function:	setIDs
 * Inputs:		1) the current DOMele
 * 				2) the current counter (usu. Start at 0)
 * 				3) the xml being updated
 * 				4) the xml:id prefix (usually, the base filename)
 * 
 * Output:		sets ids for the xml
 */
function setIDs($ele,$counter,$xml,$prefix) {
	
	$kids = $ele->childNodes;
	$tagName = $ele->nodeName;
	
	if (($tagName=="#text") || (get_class($ele) == "DOMComment")) {	
		// nada needed
	} else {
		
    	if (!($ele->hasAttribute("xml:id"))) {

			// trying to ensure uniqueness if prefix
			// is only set as tag for some reason
			if ($prefix == "tag") {
				$prefix = "tag-".$ele->nodeName;
			}
			   	 
    		//echo "Setting xml:id: ".$prefix."-".$counter."<br>";
			$ele->setAttribute("xml:id",$prefix."-".$counter);
			$counter++;
    	}
		
		// recurse down tree
		if ($kids){
			foreach ($kids as $kid){
				$counter = setIDs($kid,$counter,$xml,$prefix);
			}
		}
	}	
	
	return $counter;	
}

?>
