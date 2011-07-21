<?php
/*disp.php
Input: XML DOM
Output: HTML
*/



	
	
	
	function html_out($t) {
		//Output HTML of TEI DOM passed in $dom
		//create XML object
		$xml_doc = new DOMDocument();
	
		if($xml_doc->loadXML($t)) {
		
			//turn into XML
			//$xml_doc->saveXML();
		} else {
		
			exit("Error Reading Source ($curr)");
		}
		
		
		//output initial HTML
			/*echo '<?xml version="1.0" encoding="UTF-8" ?>
				<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
				"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">';
		
			//set up content header for UTF-8 
			//also included below
			header('Content-Type: text/html; charset=utf-8');
		
			echo '
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
				<html xmlns="http://www.w3.org/1999/xhtml">
				<head>
					<title>Hamlet :: ' . $pb . '</title>
					<link rel="stylesheet" type="text/css" href="./hamlet.css"/>
				</head>
				*/
			
			
			$finalout = "";
			
			if($xml_doc->hasChildNodes()) {
				$finalout = dispTEI($xml_doc->childNodes);
			}
			
			/* Get rid of classnames with commas */
			$finalout = preg_replace('/\"stageitalic, /', '"stageitalic', $finalout);
			
			return $finalout;
			
	}
	
	function dispTEI($node) {
		//function to go through the tree and output HTML
		
	
		//go through the entire dom tree
		$test = $node;
		$final = "";
		for($i=0;$i<$test->length;$i++) {
			if(dispCase($test->item($i)) ) {
				$final .= dispCase($test->item($i));
				//do nothing: tag is displayed
			} /* elseif($test->item($i)->nodeName == 'hi' || $test->item($i)->nodeName == 'name') {
				//hi tag, create a span
				echo '<span id="' . $test->item($i)->nodeName . '">';
				dispTEI($test->item($i)->childNodes);
				
				echo '</span>';
			} else if($test->item($i)->nodeName == 'lb') {
				echo "<br />\n";
			} */ else {
				//higher tag element: make a div of it
				//add type as ID
				if($test->item($i)->hasAttribute('type')) {
					if($test->item($i)->hasAttribute('rend')) {
						$final .= "<span class=\"" . $test->item($i)->nodeName . $test->item($i)->getAttribute('rend') ."\">\n";
						$final .= dispTEI($node->item($i)->childNodes);
						$final .=  "</span>\n";
					} else {
						$final .= "<div class=\"" . $test->item($i)->nodeName . $test->item($i)->getAttribute('type') . "\">\n";
						$final .= dispTEI($node->item($i)->childNodes);
						$final .=  "</div>\n";
					}
				} else if($test->item($i)->hasAttribute('rend')) {
					
					$final .= "<span class=\"" . $test->item($i)->nodeName . $test->item($i)->getAttribute('rend') . "\">\n";
					$final .= dispTEI($node->item($i)->childNodes);
					$final .=  "</span>\n";
				
				} else {
					if($test->item($i)->nodeName != "l" && $test->item($i)->nodeName != "lb") {
						$final .=  "<div class=\"" . $test->item($i)->nodeName . "\">\n";
						$final .= dispTEI($node->item($i)->childNodes);
						$final .=  "</div>\n";
					} else {
						$final .= dispTEI($node->item($i)->childNodes);
					}
				}
			}
			
		}
		
		return $final;
	}
	
	function dispCase($node) {
		//display passed node
		switch($node->nodeName) {
			case '#text':
				return $node->nodeValue;
				//return true;
				break;
			case 'w':
				return $node->nodeValue;
				//return true;
				break;
			/*case 'pb':
				echo "<pb xml:id=\"" . $node->getAttribute('xml:id') . "\"/>";
				return true;
				break;
				*/
			default: 
				//tag is higher element
				return false;
				break;
		}
	}

	

?>