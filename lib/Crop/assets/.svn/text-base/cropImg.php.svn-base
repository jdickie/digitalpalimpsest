<?php
/**Crop an image and output contents**/

include_once("./cropImg_TMS.php");

$cm=new CropTMS();
$cm->setImgPath($imgPath);
$cm->setRootPath($regPath);
$cm->getURIElements();
$cm->createCrop();
$cm->showImg();

?>