<?php
/*
 * cropImg.php
 * 
 * 
 * Tweaked to handle TMS compliant file systems
 * of storing TMS tiles
 * 
 * Force-downloads the created image
 * 
 * Last edited: gdickie
 */
//include_once('./php/archielogin/includes/session.php');
//ini_set("display_errors","1");
ini_set("memory_limit", "256M");
//include_once('../../../Global_Files/globalSettings.php');//regPath holder
$imgPath="http://localhost:8888/ArchTest/";
cropIt($imgPath);

function cropIt($imgPath) {
	if($_GET['src']) {
		$src = $_GET['src'];
		$srcw = intval($_GET['srcw']);
		$srch = intval($_GET['srch']);
		$srcx = intval($_GET['srcx']);
		$srcy = intval($_GET['srcy']);
		//find the four corners and their
		//matching IDs
		$sPath = $_GET['src'];
		
		if(substr_count($sPath, '../') > 0){
			$sc=substr_count($sPath, '../');
			$psec=split('/',$imgPath);
			array_pop($psec);//get rid of last / = null value
			while($sc>0){
				array_pop($psec);
				$sc--;
			}
			$prefix=implode('/',$psec);
			$src = str_replace('../', '', $sPath);
			$src = $prefix.'/'.$src;
		}
		$splitUpSrc=split("/",$_GET['src']);
		//$pstr=$splitUpSrc[(count($splitUpSrc)-1)];
		//$splstr=$splitUpSrc[(count($splitUpSrc)-3)].
			$zPath=$splitUpSrc[7]."/".$splitUpSrc[8]."/".$splitUpSrc[9];
		//echo $zPath."<br/><br/>";
		$sPath = str_replace('.png', '', $zPath);
		
		$arr = split('/',$sPath); //array of zoom level, column, and row info
		
		$zPath="/".$zPath;
		$csize = pow(2, intval($arr[0]));
		$fullsize = $csize * $csize; //how many columns + rows there are at this zoom lvl
		//$zPath="-".$zPath;
		$trPath = "";
		$blPath = "";
		$brPath = "";
		$numCols = 0;
		$numRows = 0;
		$col = intval($arr[1]);
		$row = intval($arr[2]);
		
		
		//generate portions and
		//see if portions go over remaining tile size
		$trx = ($srcx + $srcw);
		$try = $srcy;
		$trw = 0;
		$trh = 0;
		$blx = $srcx;
		$bly = ($srcy+$srch);
		//find out amount of columns
		if($trx > (256-$srcx)){
			$remain = ($trx - (256 - $srcx));
			
			$count=0;
			while($remain > 0){
				$remain -= 256;
				$count++;
			}	
			$numCols = $count+1;
			$col = intval($arr[1])+$count;
			$nPath = "/".$arr[0]."/".$col."/".$arr[2].".png";
			$temp=substr($src,0,(strlen($src)-10));
			$trPath=$temp.$nPath;
		} else {
			$numCols = 1;
			$trPath = $src;
		}
		//find amount of rows
		if($bly > (256-$srcy)){
			$remain = ($bly - (256 - $srcy));
			
			$count=0;
			while($remain > 0){
				$remain-=256;
				$count++;
			}
			
			$numRows = $count+1;
			$row = intval($arr[2])+$count;
			$nPath = "/".$arr[0]."/".$arr[1]."/".$row.".png";
			$blPath = str_replace($zPath, $nPath, $src);
		} else {
			$numRows = 1;
			$blPath = $src;
		}
			
		$brRep = "/".$arr[0]."/".$col."/".$row.".png";
		$brPath = str_replace($zPath, $brRep, $src);
		
		//find extensions
		$trExt = substr($trPath, -9);
		$trExt = str_replace('.png','',$trExt);
		
		$blExt = substr($blPath, -9);
		$blExt = str_replace('.png', '', $blExt);
		
		$brExt = substr($brPath, -9);
		$brExt = str_replace('.png', '', $brExt);
		
		//create holding image
		$dest = imagecreatetruecolor($srcw, $srch);
		
		//create and fill arrays
		$imagesR = array();
		$imagesC = array();
		$sPath="/".$sPath;//to make sure that sPath has a /z/c/r format
		for($r=0;$r<$numRows;$r++){
			for($c=0;$c<$numCols;$c++){
				$currPath = '/'.$arr[0].'/'.(intval($arr[1]+$c)).'/'.(intval($arr[2])-$r);
				//now take new /z/c/r format and replace sPath with that format
				$currSrc = str_replace($sPath, $currPath, $src);
				
				$cX = 0;
				$cY = 0;
				$destX = 0;
				$destY = 0;
				$destH = 0;
				$destW = 0;
				//echo $c." X ".$r."<br/>";
				//which Path does this match? if none, go to default
				switch($currPath){
					case $sPath:
					
						$cX = $srcx;
						$cY = $srcy;
						$destH = (256-$srcy);
						$destW = (256-$srcx);
						break;
					case $trExt:
						
						$cX = 0;
						$cY = $srcy;
						$destH = (256-$cY);
						$destW = ($numCols>2) ? ($srcw) - ((256*($c-1))+(256-$srcx)) : ($srcw) - ((256*$numCols)-$srcx);
						break;
					case $blExt:
				
						$cX = $srcx;
						$cY = 0;
						$destH = ($numRows>1) ? ($bly-(256-$srcy)) : $bly;
						$destW = ($numCols>1) ? (256-$cX) : ($srcx+$srcw);
						break;
					case $brExt:
					
						$cX = 0;
						$cY = 0;
						$destW = ($numCols>2) ? ($trw) - ((256*($c-2))+(256-$srcx)) : $trw - ($srcx-(256*$numCols));
						$destH = ($numRows>2) ? ($trh) - ((256*($r-2))+(256-$srcy)) : ($trh) - ($srcy-(256*$numRows));
						break;
					default:
					
						if(($c>0)) {
							$cX = 0;
						} else {
							$cX = $srcx;
						}
						if($r>0){
							$cY = 0;
						} else {
							$cY = $srcy;
						}
						$destH = (($r>0)) ? 256 : (256-$cY);
						$destW = (($c>0)) ? 256 : (256-$cX);
						break;
				}
				//create image, paste in contents, add to array
				$tempImg = imagecreatetruecolor($destW,$destH);
				$currImg = imagecreatefrompng($currSrc);
				imagecopy($tempImg, $currImg, $destX,$destY,$cX, $cY, $destW, $destH);
				//echo $currSrc."<br/>".$cX."<br/>".$cY."<br/>".$destW."<br/>".$destH."<br/><br/>";
				
				$dx = 0;
				$dy = 0;
				
				if($c > 0){
					$tok = $c;
					
					while($tok > 0){
						
						$tok--;
						$thisSize = split("\n", $imagesC[$tok]);
						$dx += intval($thisSize[0]);
					}
					
				}
				if($r > 0){
					$tok = $r;
					while($tok > 0){
						$tok--;
						$thisSize = split("\n", $imagesR[$tok][$c]);
						$dy += intval($thisSize[1]);
					}
					
				}
				
				imagecopy($dest, $tempImg, $dx,$dy,0,0,$destW,$destH);
				
				$imagesC[$c] = $destW."\n".$destH;
				imagedestroy($tempImg);
			}
			$imagesR[$r]=$imagesC;
		}
		/**
		 *Force Download
		 **/
		$n=strripos($src,"/");
		$name=substr($src,$n);
		header("Content-Type: image/png");
		header("Content-Disposition: attachment; filename=\"$name\";");
		imagepng($dest);
		imagedestroy($dest);
	}
}

?>
