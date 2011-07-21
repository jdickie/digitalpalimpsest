<?php

class CropMaker{
	protected $rootdir;
	protected $imgDir;
	
	function __construct(){
		
	}
	
	public function setImgPath($dir){
		$this->imgDir=$dir;
	}
	public function setRootPath($dir){
		$this->rootdir=$dir;
	}
	public function createCrop(){
		//defined by inheriting classes
	}
}


?>