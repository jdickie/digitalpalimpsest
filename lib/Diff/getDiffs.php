<?php
ini_set('memory_limit', '64M');
$username="root";
$password="root";
$database="Archie_login";
mysql_connect("localhost:8888",$username,$password);
@mysql_select_db($database) or die( "Unable to select database");
$base = $_GET['base'];
$wit = $_GET['wit'];
$file = fopen("http://localhost:8888/quartos/txts/ppham-1604-22276x-fol-c01.txt",'r') or die("###error");
$txt = "";

while (!feof ($file)) {

    $txt .= fgets($file, 1024);
}
fclose($file);
$txt = str_replace("\r", "", $txt);

//------
$file = fopen("http://localhost:8888/quartos/txts/p3ham-1603-22275x-hun-c01.txt",'r') or die("###error");
$txt2 = "";
while (!feof ($file)) {
    $txt2 .= fgets($file, 1024);
}
fclose($file);
$txt2 = str_replace("\r", "", $txt2);
//------



$thequery = "SELECT * FROM Diffs 
	WHERE DocIdA='$base' AND DocIdB='$wit' ORDER BY bOffset DESC;";

$diffs = array();
$result = mysql_query($thequery);	

while($row = mysql_fetch_array($result))
  {
  $diffs[] = array("DiffId"=>$row['DiffId'],"type"=>$row['bType'],"bOff"=>$row['bOffset'],"bLen"=>$row['bLength'],"wOff"=>$row['wOffset'],"wLen"=>$row['wLength']);
  }
mysql_close();
foreach ($diffs as $diff){
	$off = intval($diff['bOff']);
	$len = intval($diff['bLen']);
	$off2 = $off+$len;
	
	$begin = substr($txt,0,$off);
	$middle = substr($txt,$off,$len);
	$end = substr($txt,$off2);
	
	$txt = "$begin<span class='normal' onmouseover='highlight(\"w".$diff['DiffId']."\")' onmouseout='dehighlight(\"w".$diff['DiffId']."\")' onclick='show(\"w".$diff['DiffId']."\")' id='b".$diff['DiffId']."'>$middle</span>$end";
	
	
	$woff = intval($diff['wOff']);
	$wlen = intval($diff['wLen']);
	$woff2 = $woff+$wlen;
	$wbegin = substr($txt2,0,$woff);
	$wmiddle = substr($txt2,$woff,$wlen);
	$wend = substr($txt2,$woff2);
	$txt2 = "$wbegin<span class='normal' onmouseover='highlight(\"b".$diff['DiffId']."\")' onmouseout='dehighlight(\"b".$diff['DiffId']."\")' onclick='show(\"b".$diff['DiffId']."\")' id='w".$diff['DiffId']."'>$wmiddle</span>$wend";
	
}
$txt = nl2br($txt);
$txt2 = nl2br($txt2);

echo "<HTML><HEAD><STYLE type='text/css'>td{
				vertical-align: top;
			}.red{background-color: red; padding-left: 1em;}.normal{
					background-color: yellow;
					}.diffDiv{
				width: 600px;
				height: 500px;
				overflow: auto;	}</STYLE><SCRIPT language='JavaScript'>function highlight(id){
				document.getElementById(id).className = 'red';
			
				}
				function show(did){
						newTop = document.getElementById(did).offsetTop;
				document.getElementById('witDiv').scrollTop = newTop;
					}
				function dehighlight(did){
					document.getElementById(did).className = 'normal';
					}
					
				</SCRIPT></HEAD><BODY><table><tr><td><div class='diffDiv' id='baseDiv'>$txt</div></td><td><div class='diffDiv' id='witDiv'>$txt2</div></td></tr></table></BODY></HTML>";
//$outfile = fopen("./diff1.html","w");
//fclose($outfile);
?>