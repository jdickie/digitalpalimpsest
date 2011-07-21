<?php
/*
 * retrieveCrop.php
 * for retrieving cropped sections
 */
include_once('../../Global_Files/remoteCalling.php');


if($_SESSION['pID']){
	retrieveCrop();
	}

function retrieveCrop() {
	$proj=$_GET['proj'];//p_id
	$qry = sprintf("SELECT crops.* FROM crops WHERE crops.c_proj='%s';",
		mysql_real_escape_string($proj)
	);
	$result=mysql_query($qry);
	$outstring = "";
	while($row=mysql_fetch_assoc($result)) {
		$pstringout = './lib/Crop/cropImg.php'. $row['imageSrc'] . 
			'&srcx='.$row['srcx'].'&srcy='.$row['srcy'].'&srcw='.
			$row['srcw'].'&srch='.$row['srch'].'&origw='.$row['origw'].
			'&origh='.$row['origh'];
		$outstring .= $row['c_id'].'%'.$row['htmlID'].'%'.$row['imageSrc'].'%'.$row['srcx'].'%'.$row['srcy'].'%'.$row['srcw'].'%'.$row['srch'].'%'.$row['c_left'].'%'.$row['c_top']."\n";
	}
	//echo substr($outstring, 0, (strlen($outstring)-1));
	
	echo ($outstring=="") ? "empty" : $outstring;
	
}

?>