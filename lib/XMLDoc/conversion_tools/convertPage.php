<?php
ini_set("memory_limit", "256M");

$fp = 'http://localhost:8888/quartos/XML/ham-1603-22275x-bli-c01.xml';

	$file = fopen($fp, 'r') or die("Error opening file");
	$text = "";
	//while not at end of file, recieve at 4Kb per cycle
	while(!feof ($file)) {
		$text .= fgets($file, 1024); 
	
	}
	fclose($file);
$dom  = new DOMDocument;
$dom->loadXML($text);

/***
 * Go through and convert XML file
 * into HTML file
 */


goThrough($_GET['num'], $dom);

function goThrough($noti, $dom){
	$nodeList=$dom->getElementsByTagName("pb");
	$end=$noti+10;
	for($noti; $noti<($end); $noti++){
	
	$side='one';
	
	$currPage=$nodeList->item($noti);
	if(substr($currPage->getAttribute('xml:id'), -1)=='a'){
		$side='a';
		
	} else if(substr($currPage->getAttribute('xml:id'), -1)=='b'){
		$side='b';
	} 
	//echo substr($currPage->getAttribute('xml:id'), -1).'  side: '.$side."<br/>";
	$file='../../../XML_Pages/XML_22275x-bli-c01/'; 
	$pg='page_'.$currPage->getAttribute('xml:id');
	/*
if($noti<10){
		$pg='page_0'.$noti;
	} else {
		$pg='page_'.$noti;
	}
*/
	$file.=$pg.'.xml'; 
	$source = fopen($file, 'r') or die("Error opening file");
	$text = "";
	//while not at end of file, recieve at 4Kb per cycle
	while(!feof ($source)) {
		$text .= fgets($source, 1024); 
	
	}
	fclose($source);
	
	$path = '../../../HTML_Pages/HTML_22275x-bli-c01/'.$pg.'.html';
	
	$xml_doc=new DOMDocument;
	if($xml_doc->loadXML($text)){
		$html=html_out($xml_doc, $side);
		echo $path.'<br/>';
	} else {
		echo 'Error: '.$path.'<br/>';
	}
	
	
	$fstream = fopen($path, 'w');
	fwrite($fstream, $html);
	fclose($fstream);
	
	}
	echo '<a href="http://localhost:8888/quartos/lib/XMLDoc/conversion_tools/convertPage.php?num='.$end.'>ENGAGE</a>';
	//echo "<a href=\"http://localhost:8888/quartos/php/calls.php?file=hamw.xml&num=".$noti . "\">Go.</a>";
}



function html_out($xml_doc, $side){
	//Output HTML of TEI DOM passed in $dom
		//create XML object
		//$xml_doc = new DOMDocument();
	
		
	
			$finalout = "";
			
			if($xml_doc->hasChildNodes()) {
				$finalout = dispTEI($xml_doc->childNodes, $side);
			}
			
			/* Get rid of classnames with commas */
			$finalout = preg_replace('/\"stageitalic, /', '"stageitalic', $finalout);
			
			return $finalout;
			
}


/***
 * Change given dom node into a 
 * relative XML div or span
 * 
 * @return 
 * @param $node Object
 */
function dispTEI($node, $side) {
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
					if(($test->item($i)->hasAttribute('rend')) || ($test->item($i)->nodeName=='name')) {
						$id=($test->item($i)->getAttribute('id')) ? $test->item($i)->getAttribute('id') : $test->item($i)->getAttribute('xml:id');
						if($side=='a'){
							$id='page1_'.$id;
						} else if($side=='b'){
							$id='page2_'.$id;
						}
						$final .= "<span class=\"" . $test->item($i)->nodeName . $test->item($i)->getAttribute('rend') .
						"\" id=\"".$id."\">\n";
						$final .= dispTEI($node->item($i)->childNodes, $side);
						$final .=  "</span>\n";
					} else {
						$id=($test->item($i)->getAttribute('id')) ? $test->item($i)->getAttribute('id') : $test->item($i)->getAttribute('xml:id');
						if($side=='a'){
							$id='page1_'.$id;
						} else if($side=='b'){
							$id='page2_'.$id;
						}
						$final .= "<div class=\"" . $test->item($i)->nodeName . $test->item($i)->getAttribute('rend') .
						"\" id=\"".$id."\">\n";
						$final .= dispTEI($node->item($i)->childNodes, $side);
						$final .=  "</div>\n";
					}
				} else if($test->item($i)->hasAttribute('rend')) {
					
					$id=($test->item($i)->getAttribute('id')) ? $test->item($i)->getAttribute('id') : $test->item($i)->getAttribute('xml:id');
					if($side=='a'){
						$id='page1_'.$id;
					} else if($side=='b'){
						$id='page2_'.$id;
					}	
					$final .= "<span class=\"" . $test->item($i)->nodeName . $test->item($i)->getAttribute('rend') .
					"\" id=\"".$id."\">\n";
					
					$final .= dispTEI($node->item($i)->childNodes, $side);
					$final .=  "</span>\n";
				
				} else {
					if($test->item($i)->nodeName != "l" && $test->item($i)->nodeName != "lb") {
						$id=($test->item($i)->getAttribute('id')) ? $test->item($i)->getAttribute('id') : $test->item($i)->getAttribute('xml:id');
						if($side=='a'){
							$id='page1_'.$id;
						} else if($side=='b'){
							$id='page2_'.$id;
						}
						$final .=  "<div class=\"" . $test->item($i)->nodeName . "\" id=\"".$id."\">\n";
						$final .= dispTEI($node->item($i)->childNodes, $side);
						$final .=  "</div>\n";
					} else {
						$final .= dispTEI($node->item($i)->childNodes, $side);
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