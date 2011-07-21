
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
		
		$zPath=$splitUpSrc[8].'/'.$splitUpSrc[9].'/'.str_replace(".png",'',$splitUpSrc[10]);
		$sPath=$zPath;
		//echo $zPath."<br/><br/>";
		$arr = split('/',$zPath); //array of zoom level, column, and row info
		
		$csize = pow(2, intval($arr[0]));
		$fullsize = $csize * $csize; //how many columns + rows there are at this zoom lvl
		//$zPath="/".$zPath;
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
		
		if($trx > (256-$srcx)){
			$remain = ($trx - (256 - $srcx));
			
			$count=0;
			while($remain > 0){
				$remain -= 256;
				$count++;
			}	
			$numCols = $count;
			$col = intval($arr[1])-$count;
			$nPath = $arr[0]."/".$col."/".$arr[2];
			$trPath=str_replace($zPath, $nPath, $src);
			//$trPath=$temp.$nPath;
		} else {
			$numCols = 1;
			$trPath = $src;
		}
		$blx = $srcx;
		$bly = ($srcy+$srch);
		if($bly > (256-$srcy)){
			$remain = ($bly - (256 - $srcy));
			
			$count=0;
			while($remain > 0){
				$remain-=256;
				$count++;
			}
			
			$numRows = $count;
			$row = intval($arr[2])-$count;
			$nPath = $arr[0]."/".$arr[1]."/".$row;
			$blPath = str_replace($zPath, $nPath, $src);
		} else {
			$numRows = 1;
			$blPath = $src;
		}
		
		$brRep = $arr[0]."/".$col."/".$row;
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
		//echo "trext: $trExt<br/>blExt: $blExt<br/>brExt: $brExt<br/><br/>";
		for($r=0;$r<$numRows;$r++){
			for($c=0;$c<$numCols;$c++){
				$currPath = $arr[0].'/'.(intval($arr[1]+$c)).'/'.(intval($arr[2])-$r);
				$currSrc = str_replace($zPath, $currPath, $src);
				
				$cX = 0;
				$cY = 0;
				$destX = 0;
				$destY = 0;
				$destH = 0;
				$destW = 0;
				
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
		$data = getimagesize($src);
		$mimetype = $data['mime'];
		header('Content-Type: $mimetype');
		imagepng($dest);
		imagedestroy($dest);
	}
}
