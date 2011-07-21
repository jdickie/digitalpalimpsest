<?php

if(isset($_GET['base'])&&isset($_GET['layers'])){
	$layers=preg_split('/_/',$_GET['layers']);
	$base=$_GET['base'];
	
	checkExists($base,&$layers);
}

function checkExists($base,&$layers){
	//uses curl to go through list of layers
	foreach($layers as $layername){
		$url=$base."/1.0.0/".$layername."/0/0/0.png";
		$ch=curl_init();
		curl_setopt($ch,CURLOPT_URL,$url);
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
		if(curl_exec($ch)) {
			echo $layername."\n";
		}
		curl_close($ch);
	}
}

?>