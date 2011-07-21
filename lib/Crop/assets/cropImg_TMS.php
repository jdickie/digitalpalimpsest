<?php
/*
 * cropImg_TMS.php
 * 
 * 
 * Converted to be used for TMS-compliant tile 
 * file hierarchy
 */
//include_once('./php/archielogin/includes/session.php');
//ini_set("display_errors","1");
ini_set("memory_limit", "256M");
include_once('../../../Global_Files/globalSettings.php');//regPath holder
include_once('./cropMaker.php');

class CropTMS extends CropMaker {
	public $src='src';
	public $srcw=0;
	public $srch=0;
	public $srcx=0;
	public $srcy=0;
	public $arr=array();
	public $cols=0;
	public $rows=0;
	public $img="";
	public $base="";
	public $toprightx=0;
	public $toprighty=0;
	public $fullwidth=0;
	public $fullheight=0;
	public $brx=0;
	public $bry=0;
	protected $finalImage="";
	
	function __construct(){
		
	}
	
	public function getURIElements(){
		$this->src=$_GET['src'];
		$this->srcw=intval($_GET['srcw']);
		$this->srch=intval($_GET['srch']);
		$this->srcx=intval($_GET['srcx']);
		$this->srcy=intval($_GET['srcy']);
	}
	
	public function createCrop(){
		//function only creates the 
		//necessary variables to create crop - inheriting
		//classes can then overwrite the ordering and creation of
		//the image in the protected function developImage
		$temppath=$this->src;
		
		//find base file structure
		$splitUpSrc=split("/",$temppath);
		$sCount=count($splitUpSrc);
		$zPath=$splitUpSrc[$sCount-3].'/'.$splitUpSrc[$sCount-2].'/'.str_replace(".png",'',$splitUpSrc[$sCount-1]);
		$sPath=$zPath;
		
		$this->arr = split('/',$zPath); //array of zoom level, column, and row info
		
		$csize = pow(2, intval($this->arr[0]));
		$fullsize = $csize * $csize; //how many columns + rows there are at this zoom lvl
		
		$trPath = "";
		$blPath = "";
		$brPath = "";
		$numCols = 0;
		$numRows = 0;
		$col = intval($this->arr[1]);
		$row = intval($this->arr[2]);
		$this->base=$zPath;
		
		//generate portions and
		//see if portions go over remaining tile size
		$this->toprightx = ($this->srcx + $this->srcw);
		$this->toprighty = $this->srcy;
		$this->fullwidth = 0;
		$this->fullheight = 0;
		
		if($this->toprightx > (256-$this->srcx)){
			$remain = ($this->toprightx - (256 - $this->srcx));
			
			$count=0;
			while($remain > 0){
				$remain -= 256;
				$count++;
			}	
			$numCols = $count+1;
			$col = intval($this->arr[1])-$count;
			$nPath = $this->arr[0]."/".$col."/".$this->arr[2];
			$trPath=str_replace($zPath, $nPath, $this->src);
			//$trPath=$temp.$nPath;
		} else {
			$numCols = 1;
			$trPath = $this->src;
		}
		$this->blx=$this->srcx;
		$this->bly=($this->srcy+$this->srch);
		
		if($this->bly > (256-$this->srcy)){
			$remain = ($this->bly - (256 - $this->srcy));
			
			$count=0;
			while($remain > 0){
				$remain-=256;
				
				$count++;
			}
			
			$numRows = $count+1;
			$row = intval($this->arr[2])-$count;
			$nPath = $this->arr[0]."/".$this->arr[1]."/".$row;
			$blPath = str_replace($zPath, $nPath, $this->src);
		} else {
			$numRows = 1;
			$blPath = $this->src;
		}
		
		$this->cols=$numCols;
		$this->rows=$numRows;
		
		
		//find extensions
		$trExt = substr($trPath, -9);
		$trExt = str_replace('.png','',$trExt);
		
		$blExt = substr($blPath, -9);
		$blExt = str_replace('.png', '', $blExt);
			
		$brRep = $this->arr[0]."/".$col."/".$row;
		$brPath = str_replace($zPath, $brRep, $this->src);
		
		$brExt = substr($brPath, -9);
		$brExt = str_replace('.png', '', $brExt);
		
		$this->bottomrighturi=$brExt;
		$this->bottomlefturi=$blExt;
		$this->toprighturi=$trExt;
		
		
		$this->fullwidth=$trw;
		$this->fullheight=$trh;
		
		
		//call developImage function
		$this->developImage();
	}
	
	protected function developImage(){
		//create holding image
		$dest = imagecreatetruecolor($this->srcw, $this->srch);
		
		//create and fill arrays
		$imagesR = array();
		$imagesC = array();
		
		//echo "trext: $trExt<br/>blExt: $blExt<br/>brExt: $brExt<br/><br/>";
		for($r=0;$r<$this->rows;$r++){//echo "Row ".$r." of ". $this->rows. "<hr/>";
			for($c=0;$c<$this->cols;$c++){//echo "Col ".$c." of ".$this->cols . "<br/>";
				$currPath = $this->arr[0].'/'.(intval($this->arr[1]+$c)).'/'.(intval($this->arr[2])-$r);
				$currSrc = str_replace($this->base, $currPath, $this->src);
				
				$cX = 0;
				$cY = 0;
				$destX = 0;
				$destY = 0;
				$destH = 0;
				$destW = 0;
				
				switch($currPath){
					case $this->base:
					
						$cX = $this->srcx;
						$cY = $this->srcy;
						$destH = (256-$this->srcy);
						$destW = (256-$this->srcx);
						break;
					case $this->toprighturi:
						
						$cX = 0;
						$cY = $this->srcy;
						$destH = (256-$cY);
						$destW = ($cols>2) ? ($this->srcw) - ((256*($c-1))+(256-$this->srcx)) : ($this->srcw) - ((256*$cols)-$this->srcx);
						break;
					case $this->bottomlefturi:
				
						$cX = $this->srcx;
						$cY = 0;
						$destH = ($this->rows>1) ? ($this->bly-(256-$this->srcy)) : $this->bly;
						$destW = ($this->cols>1) ? (256-$cX) : ($this->srcx+$this->srcw);
						break;
					case $this->bottomrighturi:
					
						$cX = 0;
						$cY = 0;
						$destW = ($this->cols>2) ? ($this->fullwidth) - ((256*($c-2))+(256-$this->srcx)) : $this->fullwidth - ($this->srcx-(256*$this->cols));
						$destH = ($this->rows>2) ? ($this->fullheight) - ((256*($r-2))+(256-$this->srcy)) : ($this->fullheight) - ($this->srcy-(256*$this->rows));
						break;
					default:
					
						if(($c>0)) {
							$cX = 0;
						} else {
							$cX = $this->srcx;
						}
						if($r>0){
							$cY = 0;
						} else {
							$cY = $this->srcy;
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
		$this->finalImage=$dest;
		/*
$data = getimagesize($this->src);
		$mimetype = $data['mime'];
		header('Content-Type: $mimetype');
		imagepng($dest);
		imagedestroy($dest);
*/
	}
	
	function showImg(){
		$data = getimagesize($this->src);
		$mimetype = $data['mime'];
		header('Content-Type: $mimetype');
		imagepng($this->finalImage);
		imagedestroy($this->finalImage);
	}
	
	function downloadImg(){
		$data = getimagesize($this->src);
		$mimetype = $data['mime'];
		header('Content-Type: '.$mimetype);
		header('Content-Disposition: attachment; filename='.$this->base.'.png');
		imagepng($this->finalImage);
		imagedestroy($this->finalImage);
	}
}



?>
