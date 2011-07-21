<?php
/**
 *Resize images and save them in a specified folder
 
  Folder is always: $prefix + '/cropped/'+ the filename
 * 
*/ 

ini_set("memory_limit", "256M");

goThrough($_GET['num'], $_GET['prefix']);

function goThrough($startValue, $prefix){
	$count = intval($startValue);

	$end = $count + 5;
	for($x=$count;$x<$end;$x++){
		resizeThenSave($prefix, $x);
	}
	$me = './imageCropChangeResize.php?prefix='.$prefix.'&num='.$end;
	header("Location: $me"); 
}

function resizeThenSave($prefix, $pageNum){
	$num = ($pageNum > 10) ? '-0'.$pageNum : '-00'.$pageNum;
	$src = 'http://mith.info/archie/'.$prefix.'/'.$prefix.$num.'.jpg';
	$savePath='../../../'.$prefix.'/cropped/'.$prefix.$num.'_c.jpg';
	
	$orig = imagecreatefromjpeg($src);
	$info = getimagesize($src);
	$idealW = intval($info[0])/2;
	$idealH = intval($info[1])/2;
	
	$dest = imagecreatetruecolor($idealW, $idealH);
	
	imagecopyresampled($dest, $orig, 0, 0, 0, 0, $idealW, $idealH, $info[0], $info[1]);
	$mime = $info['mime'];
	header('Content-Type: $mime');
	imagejpeg($dest, $savePath);
	
	imagedestroy($dest);
	imagedestroy($orig);


}

?>