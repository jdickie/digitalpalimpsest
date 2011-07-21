<?php

/* ****************************
 * Function:	stripOuterText
 * Inputs:		1) DOM node1 (by ref)
 * 				2) DOM node2 (by ref)
 * 				3) the xml file in string format
 * 				
 * Output:		a string consisting of xml+text
 * 				that is stripped of text between
 * 				the two tags/nodes
 * ****************************/ 
function stripOuterText(&$node1, &$node2, $xmlDoc) {
	
	$tagOffset1 = 0;
	$tagOffset2 = 0;
	$setRandId = 0;
	$xmlStr = "";
	$newXML = "";
	$seg1 = "";
	$seg2 = "";
	$seg3 = "";
	$seg2Len = 0;

	// unfortunately, may have to convert the $xmlDoc object
	// to a string up to 4 times 
	// (depending on whether "xml:id" is set for the node or not)
	list($tagOffset1, $xmlStr) = getTagOffset(&$node1);
	//echo "TAG offset1: ".$tagOffset1."<br>";
	
	list($tagOffset2, $xmlStr) = getTagOffset(&$node2);
	//echo "TAG offset2: ".$tagOffset2."<br>";

	$seg1 = substr($xmlStr, 0, $tagOffset1);
	// strip text between any tags up to the first node
	$seg1 = preg_replace("/\>[^\<\>]*\</","><",$seg1);

	$seg2Len = $tagOffset2 - $tagOffset1;
	$seg2 = substr($xmlStr, $tagOffset1, $seg2Len);

	$seg3 = substr($xmlStr, $tagOffset2, strlen($xmlStr));
	// strip text between any tags after the 2nd node
	$seg3 = preg_replace("/\>[^\<\>]*\</","><",$seg3);
	
	$newXML = $seg1.$seg2.$seg3;
	
	return $newXML;
}

/* ****************************
 * Function:	getTextOffset
 * Inputs:		1) DOM node (by ref)
 * 				
 * Output:		Offset of the text (only, stripped of tags)
 * 				that up to the node of interest
 * *************************** */ 
function getTextOffset(&$theNode) {
	$xmlDoc = $theNode->ownerDocument;	
	$tagOffset = 0;
	$txtOffset = 0;
	$xmlStr = "";
	$xmlSegment = "";

	list($tagOffset, $xmlStr) = getTagOffset(&$theNode);
	//echo "TAG offset: ".$tagOffset."<br>";
	
	$xmlSegment = substr($xmlStr, 0, $tagOffset);
	// strip tags (wonder if strip_tags() would work here?)
	$xmlSegment = preg_replace("/\<[^\>]*\>/","",$xmlSegment);
	$txtOffset = strlen($xmlSegment);
	
	return $txtOffset;
}

/* ****************************
 * Function:	getTagOffset
 * Inputs:		1) DOM node (by ref)
 * 				
 * Output:		1) Offset of the start-tag ("<") for the Node
 * 				2) the final $xmlStr used 
 * 					(trying to prevent converting the $xmlDoc too many times)
 * *************************** */ 
function getTagOffset(&$theNode) {
	
	$xmlDoc = $theNode->ownerDocument;
	$idOffset = 0;
	$tagOffset = 0;
	$setRandId = 0;
	$strSegment = "";
	$str = "";
	
	$setRandId = checkTagId(&$theNode);
	// save the xml as string once the id is checked or set
	$str = $xmlDoc->saveXML();
	$searchStr = "xml:id=\"".$theNode->getAttribute("xml:id")."\"";
	
	//echo "Node Has ID: ".$theNode->getAttribute("xml:id")."<br>";
	// find the node's position in the $str
	$idOffset = strpos($str, $searchStr);
	//echo "First OFFSET: ".$idOffset."<br>";
	
	// Go back to get the "<" that starts the tag
	$strSegment = substr($str, 0, $idOffset);
	$tagOffset = strrpos($strSegment, "<");
	
	// need to clean up the random id, IF you set it...
	if ($setRandId == 1) {
		$theNode->removeAttribute("xml:id");
		// have to resave the xmlDoc as a string once "xml:id" removed
		$str = $xmlDoc->saveXML();
	}
	
	return (array($tagOffset, $str));
}

/* ****************************
 * Function:	checkTagId
 * Input:		DOM node (by ref)
 * 
 * Output:		Whether the id had to be set/created ($setId)
 * Indirect out:The node's new 'random' id, if it was set
 * *************************** */ 
function checkTagId(&$theNode) {
	$id = "";
	$setId = 0;
	
	if (!($theNode->hasAttribute("xml:id"))) {
	// if theNode does NOT have an id, assign it xml:id="nodeName_<rand>""
		mt_srand();
		$randNum = mt_rand();
		$newId = $theNode->nodeName."_".$randNum;
		$theNode->setAttribute("xml:id", $newId);
		$setId = 1;
	}
	
	return $setId;
}

/* ****************************
 * Function:	lca
 * Inputs:		1) DOM node1 (by ref)
 * 				2) DOM node2 (by ref)
 * 			
 *  Output:		DOM node of the lowest common ancestor
 *  			for the two input nodes
 * 
 * *************************** */ 
function lca(&$node1, &$node2) {
	$index1 = $node1;
	$index2 = $node2;
	$first = array();

	while (($index1!=null)&&($index2!=null)){

		while ((!($index2==null))&&(!($index2->isSameNode($index1)))){
			$index2 = $index2->parentNode;
		}
		if (($index2!=null) && ($index1->isSameNode($index2)))
		{
			return $index1;
		}
		else{
		$index2 = $node2;
		$index1 = $index1->parentNode;
		}
	}
	
}
/* ****************************
 * Function:	innerXML
 * Inputs:		1) DOM node
 * 				2) XML file as DOMDocument
 * 				
 * 				
 * 				
 * Output:		a string consisting of all XML data
 * 				within node
 * 								
 * ****************************/ 
 function innerXML($node){
 	$milestone = new DOMElement("milestone");
	$node->appendChild($milestone);
	$xml = $node->ownerDocument;
	$start = getTagOffset($node);
	//echo $start[0];
	$end = getTagOffset($milestone);
	//echo $end[0];
	$len = $end[0]-$start[0];
	$node->removeChild($milestone);
	$txt = $xml->saveXML();
	
	$txt = substr($txt,$start[0],$len)."</".$node->nodeName.">";
	
	return $txt;
	
 }
 
/* ****************************
 * Function:	outerXML 
 * Inputs:		1) DOM node 
 * 							
 * Output:		returns the tagName of the node and all it's attributes
 * ****************************/
function outerXML($node){
	$header = "<".$node->nodeName;
	$atts = $node->attributes;
	if ($atts!=null){
	foreach ($atts as $att){
		$header = $header." ".$att->name."='".$att->value."'";
	}
	}
	$header = $header.">";
	return $header;
}

/* ****************************
 * Function:	wrapNode 
 * Inputs:		1) DOM node1 (by ref)
 * 				
 * 				
 * Output:		returns a string of a new XML document
 * 				containing only the node and all its immediate
 * 				ancestors
 * ****************************/ 
 function wrapNode($node,$stopNode){
 
 	$start = "";
	$end = "";
 	$index = $node->parentNode;
	while (($index!=null)&&(!($index->isSameNode($stopNode)))){
		$start = outerXML($index).$start;
		$end = $end."</".$index->nodeName.">";
		$index = $index->parentNode;
		
	}
	//echo "START: ".$start." END: ".$end."<br>";
	return (array($start, $end));
 }
 
 
/* ****************************
 * Function:	trimTree
 * Inputs:		1) DOM node1 (by ref)
 * 				2) DOM node2 (by ref)
 * 				
 * 				
 * Output:		a string consisting of xml+text
 * 				that is stripped of text between
 * 				the two tags/nodes and any tags not directly
 * 				in the ancestory of either node
 * ****************************/ 
function trimTree(&$node1, &$node2) {
	
	$tagOffset1 = 0;
	$tagOffset2 = 0;
	$setRandId = 0;
	$xmlStr = "";
	$newXML = "";
	$seg1 = "";
	$seg2 = "";
	$seg3 = "";
	$seg2Len = 0;
	$lca = lca($node1,$node2);
	
	$in = $node1;

	list($lead1,$tail1) = wrapNode($node1,$lca);
	
	list($lead2,$tail2) = wrapNode($node2,$lca);

	list($lead3, $tail3) = wrapNode($lca,$lca->ownerDocument->documentElement->parentNode);
	
	$inner = innerXML($lca);
	//echo "INNER XML OF ".$lca->nodeName." IS: ".$inner."<br>";
	
	$xmlDoc = new DOMDocument;
	
	$xmlDoc->loadXML($inner);
	
	// unfortunately, may have to convert the $xmlDoc object
	// to a string up to 4 times 
	// (depending on whether "xml:id" is set for the node or not)
	list($tagOffset1, $xmlStr) = getTagOffset(&$node1);
	//echo "TAG offset1: ".$tagOffset1."<br>";
	
	list($tagOffset2, $xmlStr) = getTagOffset(&$node2);
	//echo "TAG offset2: ".$tagOffset2."<br>";
	
	$seg1 = $lead3.outerXML($lca).$lead1;
	$seg2Len = $tagOffset2 - $tagOffset1;
	$seg2 = substr($xmlStr, $tagOffset1, $seg2Len);

	
	$seg3 = $tail2."</".$lca->nodeName.">".$tail3;
	$newXML = $seg1.$seg2.$seg3;
	//$newXML = preg_replace("/<w[^\>]*\><\/w>/","",$newXML);
	return $newXML;
}

?>