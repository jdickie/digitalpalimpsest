<?php 
$txt = file_get_contents("http://archimedespalimpsest.net/Data/");
$start = strpos($txt,"<pre>");
$end =  strpos($txt,"</pre>")+6;
$len = $end-$start;
$txt = substr($txt,$start,$len);
$alinks = explode('alt="[DIR]"></a>',$txt);
for ($i=2;$i<count($alinks);$i++){
	$p = explode(">",$alinks[$i]);
	
	$path = preg_replace('/[^"]*"([^"]*)"/','$1',$p[0]);
	$mydir = substr($path,0,strlen($path)-1);
	$newpath = "http://archimedespalimpsest.net/Data/".$path;
	$txt = file_get_contents("http://archimedespalimpsest.net/Data/".$path);
	
	$start = strpos($txt,"<pre>");
$end =  strpos($txt,"</pre>")+6;
$len = $end-$start;
$txt = substr($txt,$start,$len);

$blinks = explode('alt="[   ]"',$txt);

$path = preg_replace('/[^_]*_([^_]*)_.*/','$1',$blinks[2]);

$len = strlen($path)/2;
$path = substr($path,0,$len);
$lastpath = "prayerbook.xml";

echo $mydir." : ".$path."<br/>";
$txt = file_get_contents($lastpath);

if ((strlen($path)>0)&&(strpos($txt,"<auth>")==false)){
	$p=$mydir."-manifest.xml\"";
	$end = strpos($txt,$p)+strlen($p);
	
	$start = substr($txt,0,$end);
	$middle = " auth=\"$path\"";
	$last = substr($txt,$end);
	$newtxt = $start.$middle.$last;
	file_put_contents($lastpath,$newtxt);
}
echo "<br/>";


}
?>