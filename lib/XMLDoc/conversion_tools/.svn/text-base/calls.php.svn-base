<?php
/*Calls.php
calls functions derived from textfind.php
and disp.php
*/


include 'stringfind.php'; //for creating the DOM Tree from XML text file
include 'disp.php';


//$text is the XML in text format
//$pb is the xml:id reference
//input: $doc, $id, $idset


function retrieve_PHP_HTML($data) {
	$html = html_out($data);
	return $html;
}
function goThrough($text, $idset) {
	
	$noti = $_GET['num'];
	$notn = $noti + 5;
	
	while($noti<$notn) {
		$data = getthis($text, $idset[$noti], $idset);
		
		$html = retrieve_PHP_HTML($data);
		
		$path = './html/' . getFileName($idset[$noti]);
		
		$fstream = fopen($path, 'w');
		fwrite($fstream, $html);
		fclose($fstream);
		$noti++;
	}
	echo "<a href=\"http://localhost:8888/quartos/php/calls.php?file=hamw.xml&num=".$noti . "\">Go.</a>";
}
goThrough($text, $idset);
?>