<?php
ini_set("memory_limit", "16M"); // incresed memory for some applications
/*input: location of XML and ID of page element
output: HTML text of XML between pb elements
*/
	

	/*
//get elements from URI
	$fp = $_GET['file'];
	$pb = $_GET['pid'];
	
	
	
	$file = fopen($fp, 'r') or die("Error opening file");
	$text = "";
	//while not at end of file, recieve at 4Kb per cycle
	while(!feof ($file)) {
		$text .= fgets($file, 1024); 
	
	}
	fclose($file);
*/
	
	
	/*****************
	 * 
	 * valid
	 * Returns string object
	 * that has proper XML 
	 *  
	 * @param $next Object
	 * @param $id Object
	 * @param $doc Object
	 */
	function valid($next, $id, $doc) {
		
		//copy until beginning 
		//and end of section
		
		//get rid of w tags
		//$doc = preg_replace('/<w [^>]*>/', '', $doc);
		//$doc = preg_replace('/<\/w>/', '', $doc);
		//echo $id . "<br />";
		$ostart = strpos($doc, '<text');
		$tend = strpos($doc, '</text>');
		$oend = strpos($doc, '>', $tend);
		$oend++;
		$length = $oend - $ostart;
		$textsection = substr($doc, $ostart, $length);
		
		$ostart = strpos($textsection, $id);
		$offset = $ostart - strlen($textsection);
		$ostart = strrpos($textsection, '<', $offset);
		$tstart = substr($textsection, 0, $ostart);
		
		$oend = strpos($textsection, $next);
		$offset = $oend;
		$oend = strpos($textsection, '<', $offset);
		$length = strlen($textsection) - $oend;
		$end = substr($textsection, $oend, $length);
		
		$pattern = "/>[^>]*</";
		$nstart = preg_replace($pattern, '><', $tstart);
		$nstart = preg_replace('/<pb [^>]*>/', '', $nstart);
		$nend = preg_replace($pattern, '><', $end);
		$nend = preg_replace('/<pb [^>]*>/', '', $nend);
		$length = $oend - $ostart;
		$section = substr($textsection, $ostart, $length);
		$nstart = preg_replace('/<w [^>]*>/', '', $nstart);
		$nstart = preg_replace('/<\/w>/', '', $nstart);
		$nend = preg_replace('/<w [^>]*>/', '', $nend);
		$nend = preg_replace('/<\/w>/', '', $nend);
		$dnoc = $nstart . $section . $nend;
		
		//$result = xslize($dnoc, $id);
		
		return $dnoc;
	}
	
	/*********
	 * 
	 * Takes a text string of XML
	 * and finds the 'xml:id' attribute
	 * values inside
	 * Returns: Array of Ids
	 *  
	 * @param $text Object
	 * @param $type String for what to ID 
	 * to look for
	 */
	function GETIDS($text, $type) {
		$ids = array(); //to store elements
		$stop = strlen($text);
		$start = 0;
		$k = 0;
		for($i=$start;$i<$stop;$i++) {
			
			if($x = strpos($text, $type, $i)) {
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
		
		return $ids;
	}
	
	function getIndex($ids, $id) {
		$n = 0;
		while($n < count($ids)) {
			if($id == $ids[$n]) {break;} else {
			$n++;}
		}
		if($n == 0) {
			$prev = ($n);
			$curr = ($n);
			$next = ($n+1);
		} else {
			$prev = ($n - 1);
			$curr = ($n);
			$next = ($n+1);
		}
		
		$nprev = $ids[$prev];
		$ncurr = $ids[$curr];
		$nnext = $ids[$next];
		$arids = array($nprev, $ncurr, $nnext);
		return $arids;
	}
	
	//get the current section id 
	function getthis($doc, $id, $idset) {
		$start = strpos($id, "0");
		$num = intval(substr($id, $start, 3));
		
		if($num < 1 || $num > count($idset)) {return "<div class=\"pb\"></div>";} else {
			/*$n = strpos($id, 'h');
			$length = strlen($id) - $n;
			
			$tok = substr($id, $n, $length);*/
			
			$arid = getIndex($idset, $id);
			$next = $arid[2];
			$next = 'xml:id="' . $next;
			$id = "xml:id=\"" . $id;
			$result = valid($next, $id, $doc);
			return $result;
		}
	}
	//get XML between following pb tags
	function getnext($doc, $id, $idset) {
		$start = strpos($id, "0");
		$num = intval(substr($id, $start, 3));
		if($num <= 1 || $num > count($idset)) {return "<div class=\"pb\"></div>";} else {
			/*$n = strpos($id, 'h');
			$length = strlen($id) - $n;
			
			$tok = substr($id, $n, $length);*/
			$arid = getIndex($idset, $id);
			$next = $arid[2];
			$arid = getIndex($idset, $next);
			$id = 'xml:id="' . $next;
			$next = 'xml:id="' . $arid[2];
			$result = valid($next, $id, $doc);
			return $result;
		}
	
	}
	//get XML between previous pb tags
	function getprev($doc, $id, $idset) {
		$start = strpos($id, "0");
		$num = intval(substr($id, $start, 3));
		if($num <= 1 || $num > count($idset)) {return "<div class=\"pb\"></div>";} else {
			
			$arid = getIndex($idset, $id);
			$next = $arid[0];
			$arid = getIndex($idset, $next);
			$id = "xml:id=\"" . $arid[0];
			$next = "xml:id=\"" . $next;
			$result = valid($next, $id, $doc);
			return $result;
		}
	} 
	
	
	function xslize($doc, $id) {
		$holder = "";
		$xdoc = new DOMDocument();
		$xdoc->loadXML($doc);
		
		$xsldoc = new DOMDocument();
		$xsldoc->load('hamlet2.xsl');
		
		//create variable
		$n = strpos($id, 'h');
		$length = strlen($id) - $n;
		$tok = substr($id, $n, $length);
		$arr = $xsldoc->getElementsByTagNameNS("*","variable");
		$arr->item(0)->setAttribute("select", $tok);
		
		$xp = new XSLTProcessor();
		$xp->importStylesheet($xsldoc);
		
		$holder = $xp->transformToXML($xdoc);
		
		return $holder;
	}
	//returns filename in .html format
	function getFileName($pid) {
		$n = strpos($pid, '0');
		$len = strlen($pid) - $n;
		$page = substr($pid, $n, $len);
		return "pb" . $page . ".html";
	}
	
	//set up xml:id to find
	//$id = 'xml:id="' . $pb;
	/*
$idset = GETIDS($text);
	echo getthis($text, $pb, $idset);
*/
	
	

?>
