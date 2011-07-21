<?PHP
ini_set('memory_limit', '512M');
set_time_limit(525600);
$username="root";
$password="root";
$database="Archie_login";

//If you are on a windows machine, leave off :8888 on the next line
mysql_connect("localhost:8888",$username,$password);
@mysql_select_db($database) or die( "Unable to select database");


$file = fopen("http://localhost:8888/quartos/lib/quartodiff2.xml",'r') or die("###error");
$txt = "";

while (!feof ($file)) {

    $txt .= fgets($file, 1024);
}
fclose($file);

$xml = new DOMDocument;
$xml->loadXML($txt);
$docEle = $xml->documentElement;
$diffSets = $xml->getElementsByTagName("diffSet");
foreach ($diffSets as $df){
	$base = $df->getElementsByTagName("baseURI")->item(0)->getAttribute("loc");

	$wit = $df->getElementsByTagName("witURI")->item(0)->getAttribute("loc");
	$diffs = $df->getElementsByTagName("diff");
	foreach ($diffs as $diff){
		$btype = $diff->getElementsByTagName("base")->item(0)->getElementsByTagName("type")->item(0)->nodeValue;
		$bOffset = $diff->getElementsByTagName("base")->item(0)->getElementsByTagName("offset")->item(0)->nodeValue;
		$bLength = $diff->getElementsByTagName("base")->item(0)->getElementsByTagName("length")->item(0)->nodeValue;
		//$wtype = $diff->getElementsByTagName("wit")->item(0)->getElementsByTagName("type")->item(0)->nodeValue;
		
		$wOffset = $diff->getElementsByTagName("wit")->item(0)->getElementsByTagName("offset")->item(0)->nodeValue;
		$wLength = $diff->getElementsByTagName("wit")->item(0)->getElementsByTagName("length")->item(0)->nodeValue;
		//echo("$type : $bOffset,$bLength $wOffset,$wLength");
		$thequery = "INSERT INTO Diffs (
	DocIdA,DocIdB,bType,bOffset,bLength,wOffset,wLength
	)
	VALUES (
	'$base','$wit','$btype','$bOffset','$bLength','$wOffset','$wLength');";
	echo $thequery."\n";
$result = mysql_query("$thequery");	}
}
	
	

	



mysql_close();
?>