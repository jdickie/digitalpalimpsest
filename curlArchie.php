<?php
	//destination on HD
	$HDDest="/Users/grantd/Desktop/";
	$p1="http://www.cis.rit.edu/people/faculty/easton/Archie/";
	$p="http//www.archimedespalimpsest.net/Data/";
	$filearray=
	array("Alexander_PCA/Alexander_PCA_Stokes/143r-146v_Alex01r_UV-PCA3_black_text.tif","Alexander_PCA/Alexander_PCA_Stokes/143v-146r_Alex01v_UV-PCA3_black_text.tif","Alexander_PCA/Alexander_PCA_Stokes/120r-121v_Alex02r_UV_PCA_black_text_stitched.tif","Alexander_PCA/Alexander_PCA_Stokes/120v-121r_Alex02v_UV_PCA_black_text_stitched.tif","Alexander_PCA/Alexander_PCA_Stokes/079r-074v_Alex03r_UV-PCA3_black_text.tif","Alexander_PCA/Alexander_PCA_Stokes/079v-074r_Alex03v_UV-PCA3_black_text.tif","Alexander_PCA/Alexander_PCA_Stokes/078r-075v_Alex04r_UV-PCA3_black_text.tif","Alexander_PCA/Alexander_PCA_Stokes/078v-075r_Alex04v_PCA3_black_text.tif","Alexander_PCA/Alexander_PCA_Stokes/077r-076v_Alex05r_UV-PCA3_black_text.tif","Alexander_PCA/Alexander_PCA_Stokes/077v-076r_Alex05v_UV-PCA3_black_text.tif","Alexander_PCA/Alexander_PCA_Stokes/080r-073v_Alex06r_UV-PCA3_black_text.tif","Alexander_PCA/Alexander_PCA_Stokes/080v-073_Alex06v_UV-PCA3_black_text.tif","Alexander_PCA/Alexander_PCA_Stokes/119r-122v_Alex07r_UV-PCA3_black_text.tif","Alexander_PCA/Alexander_PCA_Stokes/119v-122r_Alex07v_UV-PCA3_black_text.tif");
	
	curl_a_file($filearray[0],$p1,$HDDest);
	
	function curl_a_file($file,$href,$prefix){
		/**
		* Initialize the cURL session
		*/
		$ch = curl_init();
		/**
		* Set the URL of the page or file to download.
		*/
		curl_setopt($ch, CURLOPT_URL,$href.$file);
		//set filename to be saved to harddrive
		$sv=preg_replace('/Alexander_PCA\//',"",$file);

		/**
		* Create a new file
		* for writing only - creates the file if it doesn't exist
		*/
		//Uses format of HDDest (provided above) + filename derived from $sv
		
		$fp = fopen($HDDest.$sv, 'x');
		/**
		* Ask cURL to write the contents to a file
		*/
		curl_setopt($ch, CURLOPT_FILE, $fp);
		/**
		* Execute the cURL session
		*/
		curl_exec ($ch);
		/**
		* Close cURL session and file
		*/
		curl_close ($ch);
		fclose($fp);
	}
?>