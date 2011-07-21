<?php
ini_set("memory_limit", "1024M"); // incresed memory for some applications
set_time_limit(525600);
include_once 'treeTrim.php';
//include_once 'stringfind.php';
//include_once 'disp.php';
foreach (new DirectoryIterator('../../../XML/') as $file) {
   // if the file is not this file, and does not start with a '.' or '..',
   // then store it for later display
   if ( (!$file->isDot())   && (substr($file->getFileName(),0,1)!=".")){

      // if the element is a directory add to the file name "(Dir)"
      $fn = ($file->isDir()) ? "(Dir) ".$file->getFilename() : $file->getFilename()."<br/>";
      $dot = strrpos($fn,".");
	  $fn = substr($fn,0,$dot);
	  echo "Processing: $fn<br/>";
	  processQuarto($fn);
   }
}


function processQuarto($quarto){
//$quarto = "ham-1604-22276x-hun-c01";
//get elements from URI
	$fp = 'http://localhost:8888/quartos/XML/'.$quarto.'.xml';
	
	$file = fopen($fp, 'r') or die("Error opening file");
	$text = "";
	//while not at end of file, recieve at 4Kb per cycle
	while(!feof ($file)) {
		$text .= fgets($file, 1024); 
	
	}
	fclose($file);

$xmlDoc=new DOMDocument();
$xmlDoc->loadXML($text);

//$ids = GETIDS($text, 'xml:id="ham-');
goThrough($xmlDoc,$quarto);
return;
}
function goThrough($xmlDoc,$quarto) {
	$nodeList=$xmlDoc->getElementsByTagName("pb");
	$surfs = $xmlDoc->getElementsByTagName("surface");
	$imgs = array();
	foreach ($surfs as $surf){
		$img = $surf->getElementsByTagName("graphic")->item(0);
		$url = $img->getAttribute("url");	
		$imgs["#".$surf->getAttribute("xml:id")]=$url;
		echo $surf->getAttribute("xml:id")." ".$url;
	}
	//$noti = $_GET['num'];
//	$notn = $noti + 20;
	$noti = 0;
	$notn = $nodeList->length;
	//echo $notn;
	while($noti<$notn-1) {
		$node1 = $nodeList->item($noti);
		$node2 = $nodeList->item($noti+1);
	
		$facname = $node1->getAttribute("facs");
		$fac = $imgs[$facname];
		//echo $fac;
		$newXMLstring = trimTree(&$node1, &$node2);
		$leadIndex = strpos($newXMLstring,"<XML")+4;
		$lead = substr($newXMLstring,0,$leadIndex);
		$tail = substr($newXMLstring,$leadIndex);
		$newXMLstring = $lead." xmlns='http://www.tei-c.org/ns/1.0' facs='$fac'".$tail; 
		//$html = retrieve_PHP_HTML($data);
		mkdir('../../../XML_Pages/XML_'.$quarto);
		$path = '../../../XML_Pages/XML_'.$quarto.'/page_'.$node1->getAttribute('xml:id').'.xml';
		//echo $path."<br/>";
		$fstream = fopen($path, 'w');
		fwrite($fstream, $newXMLstring);
		fclose($fstream);
		$noti++;
	}
	//echo "<a href=\"http://localhost:8888/quartos/lib/xmlDoc/conversion_tools/retrievePage.php?num=".$noti . "\">ENGAGE.</a>";
	return;
}




//$xmlDoc=new DOMDocument();


		


	
	

//echo $xmlDoc->saveXML();



?>