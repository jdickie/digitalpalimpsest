<?php
/**
 * View XML location given by
 * QuartoSelect
 * 
 * Creates copy of what user
 * wants to see - protect original?
 */
ini_set('display_errors','1');
$path='../../XML/'.$_GET['path'];
$xsl_path='../../quartos.xsl';
$file=$_GET['path'];
$doc=new DOMDocument();
$xp=new XSLTProcessor() or die("Error in establishing XSLT processor");
$doc->load(realpath($xsl_path)); //realpath used for Win32
$xp->importStyleSheet($doc);
echo "<link rel=\"stylesheet\" type=\"text/css\" href=\"../PageText/assets/PageText.css\" />";
//provide link to download XML $file
echo '<a href=\'./downloadXML.php?path='.$file.'\'>Download this file</a><br/><br/>';
if(!($doc->load($path))) die("Error retrieving file: $path");
echo $xp->transformToXML($doc);
?>