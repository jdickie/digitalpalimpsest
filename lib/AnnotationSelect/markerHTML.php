<?php
/**
 * OpenLayers Marker-based version of HTML view for Annotation Select
 */


include_once('../../Global_Files/remoteCalling.php');
findAnnoSetData();

function findAnnoSetData(){
	$set_id=trim($_GET['setId']," \n");
	$qry=sprintf("SELECT m.marker_page,m.marker_id,m.marker_coords,m.marker_crop_src,m.marker_doc,m.marker_text,m.marker_security,m.marker_link,m.marker_sigValue,s.set_name,s.set_desc,u.login,u.fname,u.middle,u.lname,u.uID FROM marker m,set_user su,user u,anno_set s WHERE su.set_id=s.set_id AND s.set_id=m.marker_set AND m.marker_set='%s' AND su.u_id=u.uID ORDER BY m.marker_page ASC;",
		mysql_real_escape_string($set_id),
		mysql_real_escape_string($set_id)
	);
	
	$result=mysql_query($qry);
	$data="";
	while($row=mysql_fetch_assoc($result)){
		$check=($_SESSION['uID']==$row['uID'])?1:-1;
		$data.=$row['marker_id'].'%'.$row['marker_coords'].'%'.$row['marker_text'].'%'.$row['marker_page'].'%'.$row['marker_link'].'%'.$row['fname'].'%'.$row['middle'].'%'.$row['lname'].'%'.$row['set_name'].'%'.$check.'%'.$row['marker_security']."%".$row['marker_doc']."%".$row['marker_sigValue']."%".$row['marker_crop_src']."%".$row['set_desc']."\n";
	}
	createHTMLPage($data);
}
function createHTMLPage($data){
	//get array
	$args=split("\n",$data);
	
	//start HTML page
	echo "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">
\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n
    <head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=ISO-8859-1\" />
        \n<title>The Shakespeare Quartos Archive</title>\n
		<link rel=\"stylesheet\" type=\"text/css\" href=\"../QueLines/assets/PrintView.css\" />
	</head>";
	$headerInfo=split('%',$args[0]);
	
	echo "<h2>\n";
	echo (strlen(trim($headerInfo[8]," \n"))>0)?$headerInfo[8]."\n<br /><br />\n":"Untitled\n<br/><br/>";
	echo (strlen(trim($headerInfo[14]," \n"))>0)?"\"".$headerInfo[14]."\"\n<br /><br />\n":"<br/>";
	//echo "SOUND OFF:  ::4 ". $headerInfo[4] ."::5".$headerInfo[5]."  ::6 ".$headerInfo[6]." ::7 ".$headerInfo[7]."<br/><br/>";
	echo (strlen(trim($headerInfo[5]," \n")>0))?$headerInfo[5]." ":"";
	echo (strlen(trim($headerInfo[6]," \n")>0))?$headerInfo[6]." ":"";
	echo (strlen(trim($headerInfo[7]," \n")>0))?$headerInfo[7]."<br/>\n":"";
	echo "</h2>\n";
	
	echo "<p>Page Images are \".tif\" files and are therefore very large. This means it could take a long time to load if you have a slow connection speed or processor.</p>\n";
	$page=0;
	
	for($i=0;$i<count($args);$i++){
		$record=split('%',$args[$i]);
		if(($record[9]<0)&&($i==0)){
			//user logged in is not the owner of this set - display warning
			echo "<h2>\nAny images or annotations that were marked 'private' by the set's creator will not display here.\n</h2>\n";
		}
		
		$pS=strpos($record[4],"-tiles");
		$pageImg=substr($record[4],0,$pS);
		$quarto=str_replace("./manifest/","",$record[11]);
		$quarto=str_replace("-manifest.xml","",$quarto);
		$pageImg.=".tif";
		//$pageImg=realpath($pageImg);
		if($pageImg==".tif") $pageImg="<Unknown>";
		$sigValue=(trim($record[12])=="N/A")?"Unregistered Page":trim($record[12]);
		
		if(substr_count($pageImg,'../')){
			$pageImg=str_replace('../',$imgPath,$pageImg);
		} 
		if(!($record[0]=="")){
			if(($record[10]=='private')&&($record[9]>0)){
				if(intval($record[3])>$page){
					$page=intval($record[3]);
					echo "</ul><ul class=\"pv_annoList\">\n<li class=\"pv_Page\">\n<h3>Page ".$page." <br/>\nFrom: ".$quarto."<span class=\"pv_annoLink\">Page Image**: <a href=\"".$pageImg."\" target=\"_blank\">".$pageImg."</a></span></h3>\n<span class=\"pv_sigValue\">".$sigValue."</span>\n</li>\n";
				}
				$coords=split(',',$record[1]);
				//$imgUrl='../Crop/assets/cropImg.php?src='.$record[4].'&srcx='.$coords[0].'&srcy='.$coords[1].'&srcw='.$coords[2].'&srch='.$coords[3];
				$imgUrl='../Crop/assets/cropImg.php'.$record[13];
				echo "<li class=\"pv_AnnoItem\">\n<img src=\"".$imgUrl."\" alt=\"Loading...\"/>\n<br/>\n".$record[2]."<br/>\n</li>";
				
			} else if(($record[10]=='public')){
				if(intval($record[3])>$page){
					$page=intval($record[3]);
					echo "</ul><ul class=\"pv_annoList\">\n<li class=\"pv_Page\">\n<h3>Page ".$page." <br/>\nFrom: ".$quarto."<span class=\"pv_annoLink\">Page Image**: <a href=\"".$pageImg."\" target=\"_blank\">".$pageImg."</a></span></h3>\n<span class=\"pv_sigValue\">".$sigValue."</span>\n</li>\n";
				}
				$coords=split(',',$record[1]);
				//$imgUrl='../Crop/assets/cropImg.php?src='.$record[4].'&srcx='.$coords[0].'&srcy='.$coords[1].'&srcw='.$coords[2].'&srch='.$coords[3];
				$imgUrl='../Crop/assets/cropImg.php'.$record[13];
				echo "<li class=\"pv_AnnoItem\">\n<img src=\"".$imgUrl."\" alt=\"Loading...\"/>\n<br/>\n".$record[2]."<br/>\n</li>";
				
			}
		}
	}
	echo "\n</ul>\n</body>\n</html>";
}

?>