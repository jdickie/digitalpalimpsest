<?php
/**
 * Receive get request from 
 * viewXML.php to download XML
 * 
 * prompts user for content
 * Headers may not work on all browsers
 */

//get document
$doc=new DOMDocument();
$path='../../XML/'.$_GET['path'];
$file=$_GET['path'];
if(!($doc->load(realpath($path)))) die("Error retrieving File: $path");
header("Content-Type: text/html/force-download");
header("Content-Disposition: attachment; filename='$file'");
echo $doc->saveXML();
?>