<?php

/*GetAllIds.php
Retrieve all of the xml:id values
for page breaks
*/
$fp = '../hamw.xml';
$file = fopen($fp, 'r') or die("Error opening file");
	$text = "";
	//while not at end of file, recieve at 4Kb per cycle
	while(!feof ($file)) {
		$text .= fgets($file, 1024); 
	
	}
	fclose($file);

	$fstring = GETIDS($text);
	echo $fstring;
	//store all of the ids in another string 
	function GETIDS($text) {
		$ids = array(); //to store elements
		$stop = strlen($text);
		$start = 0;
		$k = 0;
		for($i=$start;$i<$stop;$i++) {
			
			if($x = strpos($text, 'xml:id="ham-', $i)) {
				//found one
				
				$x = strpos($text, '"', $x);
				$x++;
				$y = strpos($text, '"', $x);
				
				
				$len = $y - $x;
				$ids[$k] = substr($text, $x, $len); 
				
				
				$i = $y;	
				$k++;	
			} else {
				
				break;
			}
		}
		//put elements of array in a large string
		$lstring = "";
		for($n=0;$n<count($ids);$n++) {
			if(checkNum($ids[$n])) {
				continue;
			} else {
				$lstring .= $ids[$n] . "\n";
			}
		}
		
		return $lstring;
	}
	//check if $string is recto page
	function checkNum($string) {
		$tok = strrpos($string, '-');
		$recto = strpos($string, 'b', $tok);
		if($recto) {
			return true;
		} else {
			return false;
		}
	}


?>