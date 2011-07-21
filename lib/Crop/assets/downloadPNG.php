<?php
//Crop an image and then force-download it to the user

include_once("./cropImg_TMS.php");

$cm=new CropTMS();
$cm->setImgPath($imgPath);
$cm->setRootPath($regPath);
$cm->getURIElements();
$cm->createCrop();
$cm->downloadImg();

?>