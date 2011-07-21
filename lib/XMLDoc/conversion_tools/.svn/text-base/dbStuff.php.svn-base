<?php

/* ****************************
 * Function:	insertFile
 * Inputs:		1) database connection/db object 
 * 				2) filename of file being processed
 * 
 * Output:		Returns the f_id for the file entry that is inserted	
 * *****************************/
function insertFile(&$dbObj, $fn, $procFN) {

	$f_id = 0;
	$insert = "INSERT INTO files SET orig_fn=?, proc_fn=?;";
	
	if ($insertStmt = $dbObj->prepare($insert)) {
		// bind $fn for insert stmt	
		$insertStmt->bind_param('ss', $fn, $procFN);
    	$insertStmt->execute() 
			or die ("Could not execute: ".$insert." for FILE: [".$fn."], PROC FILE[".$procFN."]<br>");
		// get the $f_id for the newly inserted row
		$f_id = $dbObj->insert_id;
		// close stmt
    	$insertStmt->close();
	
	} else {
			echo "ERROR on preparing files Insert: ".$insert."<br>";
	}
	return $f_id;
}

/* ****************************
 * Function:	fidExists
 * Inputs:		1) database connection/db object 
 * 				2) filename of file being processed
 * 
 * Output:		0 if file hasn't been put in db;
 * 				Else, the f_id for the existing file				
 * *****************************/
function fidExists(&$dbObj, $fn) {

	$f_id = 0;
	$select = "SELECT f_id FROM files where proc_fn=?;";
	
	if ($selectStmt = $dbObj->prepare($select)) {
		
		// bind f_id for select stmt	
		$selectStmt->bind_param('s', $fn);
    	$selectStmt->execute()
			or die ("ERROR: could NOT EXEcute files Select Stmt".$select."<br>".mysql_error()."<br>");

    	// bind any results to $tag_id var
		$selectStmt->bind_result($f_id); 
		$selectStmt->store_result();
	
		// if we get a row with this tag_id, fetch the tag_id
    	if ($selectStmt->num_rows == 1) {
			$selectStmt->fetch();
		}
	} else {
			echo "ERROR on preparing files Select: ".$select."<br>";
	}
	
	return $f_id;
}

/* ****************************
 * Function:	getProcFilename
 * Inputs:		1) database connection/db object 
 * 				2) filename of file being processed
 * 
 * Output:		0 if file hasn't been put in db;
 * 				Else, the f_id for the existing file				
 * *****************************/
function getProcFilename(&$dbObj, $fn) {

	$procFN = 0;
	$select = "SELECT proc_fn FROM files where orig_fn=?;";
	
	if ($selectStmt = $dbObj->prepare($select)) {
		
		// bind f_id for select stmt	
		$selectStmt->bind_param('s', $fn);
    	$selectStmt->execute()
			or die ("ERROR: could NOT EXEcute files Select Stmt".$select."<br>".mysql_error()."<br>");

    	// bind any results to $tag_id var
		$selectStmt->bind_result($procFN); 
		$selectStmt->store_result();
	
		// if we get a row with this tag_id, fetch the tag_id
    	if ($selectStmt->num_rows == 1) {
			$selectStmt->fetch();
		}
	} else {
			echo "ERROR on preparing files Select: ".$select."<br>";
	}
	
	return $procFN;
}

/* ****************************
 * Function:	&wSelPrep
 * Inputs:		1) ref to db connection
 * 
 * Output:		Returns the REF to the prepared words Selection stmt
 * Notes:		Wrapper that prepares the db statement		
 * *****************************/
function &wSelPrep(&$dbObj) {
	
	$wChkQuery = "SELECT w_id from words where w_word=?";
	if ($wordStmt = $dbObj->prepare($wChkQuery)) {
		return $wordStmt;
	} else {
		echo "ERROR on preparing Tags Update: ".$wChkQuery."<br>";
	}
}
	

function updateWords(&$dbObj, &$wordSelStmt, $word) {

	$w_id = 0;
	$w_id = checkWordTable($wordSelStmt, $word);
	
	if ($w_id == 0) {
		// prep insert of $word to w_word
		$wordsInsert = "INSERT into words SET w_word=?;";
		
		if ($insertStmt = $dbObj->prepare($wordsInsert)) {
			// bind $word for insert stmt	
			$insertStmt->bind_param('s', $word);
    		$insertStmt->execute() 
				or die ("Could not execute: ".$wordsInsert." for WORD: ".$word."<br>");
			// close stmt
    		$insertStmt->close();
	
		} else { 
			echo "<br>ERROR on preparing Words Insert: ".$wordsInsert." for WORD: ".$word."!<br>";
		}		
		
		//now that it's inserted, get the new tag 
		$w_id = checkWordTable($wordSelStmt, $word);
	}
	
	// close stmt from calling function!
	
	return $w_id;
    	
}

function checkWordTable(&$wordSelStmt, $word) {
	
	$w_id = 0;

	// bind w_id for select stmt	
	$wordSelStmt->bind_param('s', $word);
    $wordSelStmt->execute()
		or die ("Could not execute WORDS Select Stmt!<br>");

    // bind any results to $tag_id var
	$wordSelStmt->bind_result($w_id); 
	$wordSelStmt->store_result();
	
	// if we get a row with this w_id, fetch the w_id
    if ($wordSelStmt->num_rows == 1) {
		$wordSelStmt->fetch();
	}
	// Close the stmt from calling function,
	// after the handle is done being used...
	
	return $w_id;
}

/* ****************************
 * Function:	insertWord (**OLD**)
 * 				USING &wSelPrep(); checkWordTable();
 * 				and updateWords() a/o Jan2009
 * Inputs:		1) database connection/db object 
 * 				2) word to be inserted
 * 
 * Output:		Returns the w_id for the word entry that is inserted		
 * *****************************/
function insertWord(&$dbObj, $w) {
	
	$qInsert = "INSERT into words SET w_word='".$w."';";
	$qSelect = "SELECT w_id, w_word from words where w_word='".$w."'";
	
	// Check for the w_id for the input word for processing through other tables
	if ($result = $dbObj->query($qSelect)) {
		if ($result->num_rows > 0) {
			$row = $result->fetch_assoc();
			$w_id = $row['w_id'];
			$result->close();
		} else { // need to insert the word & get the new w_id for it
			if ($insert = $dbObj->query($qInsert)) {
				if ($insert->num_rows > 0) {
					echo "Word Insert: ".$w." successful!";
					$insert->close();
				} 
			} else {
					echo "ERROR ON words INSERT for WORD: ".$w."<br>";
					exit;
			}
			// Now get the w_id for the newly inserted word
			if ($result = $dbObj->query($qSelect)) {
				$row = $result->fetch_assoc();
				$w_id = $row['w_id'];
				$result->close();
			} else {
				echo "ERROR ON words RETRIEVING w_id for WORD: ".$w."<br>";
				exit;
			}
		}
	} else {
		echo "ERROR ON words RETRIEVING w_id for WORD: ".$w."<br>";
	}
	
	return $w_id;
}

function oldProc4db($baseFN, $wordList) {

	// set up the db connection
	$cnxn = new mysqli("localhost","root","root","Archie_login");
	if (mysqli_connect_errno()) {
		die ("Can't connect to MySQL Server. Errorcode: ". mysqli_connect_error(). "<br>");
	} 

	// insert file info into files table
	if (fidExists($cnxn, $baseFN) == 0) {
		$f_id = insertFile($cnxn, $baseFN);

	} else {
		echo "HAVE TO REMOVE STUFF for this file...<br>";
		echo " THEN have to insert the file info as though it were new<br>";
	}
		
	// initialize most/all processing statements
	// words table stmt refs
	$wordSelStmtHandle =& wSelPrep($cnxn);
	
	// word_fid_rel table stmt refs
	$wfrCntStmtHandle =& wfrSelPrep($cnxn); // returns ref to the prepp'd stmt
	$wfrUpdateStmtHandle =& wfrUpdatePrep($cnxn); 
		
	// tags table stmt refs
	$tagSelStmtHandle =& tagSelPrep($cnxn);
	
	// word_tag_f_rel table refs
	$twfInsertStmtHandle =& tagWordFilePrep($cnxn);
	
	// Loop through each word for this file, 
	//updating words, word_fid_rel, tags, word_tag_f_rel
	// PUT FOREACH HERE.....
	foreach ($wordList as $wAttribs) {
		list($xml_id, $tagOff, $tagLen, $w, $w_offset) = explode(":",$wAttribs);
		// make words & xml_ids ready for database entry
		$w = addslashes($w);
		$xml_id = addslashes($xml_id);
		echo "ID: ".$xml_id." : TAGOFFSET: ".$tagOff." : TAGLEN:".$tagLen." : WORD: ".$w." OFFSET: ".$w_offset."<br>";
	 
		// get the word id for this word
		// AFTER inserting, if required
		$w_id = updateWords($cnxn, $wordSelStmtHandle, $w);
		echo " W_ID: ".$w_id;
		// update the word_fid_rel table with this word/file's information
		updateWordFidRel($cnxn, $wfrCntStmtHandle, $wfrUpdateStmtHandle, $w_id, $f_id);
	
		// update the tags table for this word/tag
		$tag_id = updateTagsTable($cnxn, $tagSelStmtHandle, $xml_id, $f_id, $tagOff, $tagLen);
		echo " TAG_ID: ".$tag_id."<br><br>";
		// update word_tag_f_rel table
		updateWordTagFile($twfInsertStmtHandle, $w_id, $tag_id, $f_id, $w_offset);
	}
	// end FOREACH
	// close statement handles
	$wordSelStmtHandle->close();
	$wfrCntStmtHandle->close();
	$wfrUpdateStmtHandle->close();
	$tagSelStmtHandle->close();
	$twfInsertStmtHandle->close();
	
// WORDCOUNT TESTING Functions
$w_id = 23;
$f_id = 1;

$count = wordCount($cnxn, $w_id);
echo "COUNT OUT: ".$count."<br><BR>";

// close the db connection
$cnxn->close();

}

/* ****************************
 * Function:	&wfrUpdatePrep
 * Inputs:		1) ref to db connection
 * 
 * Output:		Returns the REF to the prepared wfrUpdate stmt
 * Notes:		Wrapper that prepares the db statement		
 * *****************************/
function &wfrUpdatePrep(&$dbObj) {
	
	$wfrUpdate = "UPDATE word_fid_rel SET w_count=? WHERE w_id=? and f_id=?";
	if ($wfrUpdateStmt = $dbObj->prepare($wfrUpdate)) {
		return $wfrUpdateStmt;
	} else {
		echo "ERROR on preparing wfrUpdate: ".$wfrUpdate."<br>";
	}
}

/* ****************************
 * Function:	&wfrSelPrep
 * Inputs:		1) ref to db connection
 * 
 * Output:		Returns the REF to the prepared wfrSelection stmt
 * Notes:		Wrapper that prepares the db statement		
 * *****************************/
function &wfrSelPrep(&$dbObj) {
	$wordCntQuery = "SELECT w_count from word_fid_rel where w_id=? and f_id=?;"; 
	if ($wfrCntStmt = $dbObj->prepare($wordCntQuery)) {
		return $wfrCntStmt;
	} else {
		echo "ERROR on preparing wfrUpdate: ".$wordCntQuery."<br>";
	}
}

/* ****************************
 * Function:	wordCount
 * Inputs:		1) ref to db connection
 * 				2) word to search
 * 
 * Output:		Returns the total count for that word 
 * 				over all processed xml files
 * Notes:		Wrapper that prepares the db statement
 * 				for the call to "getTotalCount()"		
 * *****************************/
function wordCount(&$dbObj, $w_id){
	$count = 0;
	$wordCntQuery = "SELECT w_count from word_fid_rel where w_id=?;";
	
	if ($wordCountStmt = $dbObj->prepare($wordCntQuery)) {
		$count = getTotalCount($wordCountStmt, $w_id);
	} else {
		echo "ERROR on preparing Word Count Query: ".$wordCntQuery."<br>";
	}
	
	return $count;
}

/* ****************************
 * Function:	getTotalCount
 * Inputs:		1) ref to an ALREADY prepared db stmt
 * 				** ASSUMES query format as follows:
 * 				** "SELECT w_count from word_fid_rel where w_id=?;" 
 * 				2) word to search
 * 
 * Output:		Returns the total count for that word 
 * 				over all processed xml files		
 * *****************************/
function getTotalCount(&$stmt, $w_id){	
	$count = 0; // count will be 0 unless it is incremented below

	// bind w_id for select stmt	
	$stmt->bind_param("i", $w_id);
    $stmt->execute();

    // bind w_count to result
	$stmt->bind_result($currCount);
	$stmt->store_result();
    if ($stmt->num_rows > 0) {
		while ($stmt->fetch()) {
	   		$count += $currCount;	
		}
	}
	
    // close stmt from calling Function!!
    //$stmt->close();
	
	return $count;
}

/* ****************************
 * Function:	wordCountByFile
 * Inputs:		1) ref to db connection
 * 				2) word to search
 * 
 * Output:		Returns the total count for that word 
 * 				over a specific file
 * Notes:		Wrapper that prepares the db statement
 * 				for the call to "getCountByFile()"		
 * *****************************/
function wordCountByFile(&$dbObj, $w_id, $f_id){
	$count = 0;
	$wordCntQuery = "SELECT w_count from word_fid_rel where w_id=? and f_id=?;";
	
	if ($wordCountStmt = $dbObj->prepare($wordCntQuery)) {
		$count = getCountByFile($wordCountStmt, $w_id, $f_id);
	} else {
		echo "ERROR on preparing Word Count Query: ".$wordCntQuery."<br>";
	}
	
	return $count;
}
/* ****************************
 * Function:	getCountByFile
 * Inputs:		1) ref to an ALREADY prepared db stmt
 * 				** ASSUMES query format as follows:
 * 				** "SELECT w_count from word_fid_rel where w_id=? and f_id=?;" 
 * 				2) word to search
 * 				3) file to search
 * 
 * Output:		Returns the total count for that word 
 * 				for that file -- or O, if it doesn't exist		
 * *****************************/
function getCountByFile(&$stmt, $w_id, $f_id){
	
	$count = 0; // count will be 0 unless it is already set for this file below

	// bind w_id for select stmt	
	$stmt->bind_param("ii", $w_id, $f_id);
    $stmt->execute();

    // bind w_count to result
	$stmt->bind_result($count);
	$stmt->store_result();
    if (($stmt->num_rows > 0) && ($stmt->num_rows == 1)) {
		$stmt->fetch();
	}
    // close stmt from calling Function!
    // $stmt->close();
	
	return $count;
}
/* ****************************
 * Function:	updateWordFidRel
 * Inputs:		1) ref to db cnxn object
 * 				2) ref to prepp'd insert stmt 
 * 				3) w_id from "words" table to be inserted
 * 				4) f_id from "files" table for the file being processed
 * 
 * Output:		update the word_fid_rel table for his w_id:f_id pair		
 * */
function updateWordFidRel(&$dbObj, &$cntStmt, &$wfrUpdateStmt, $w_id, $f_id) {

	// check if the w_id:f_id relation already exists and get the count
	$w_count = getCountByFile($cntStmt, $w_id, $f_id);
	
	if ($w_count == 0) { // need to insert the word & get the new w_id for it
	
		$w_count = 1;
		$wfrInsert = "INSERT into word_fid_rel VALUES (?,?,?);";
		
		if ($insertStmt = $dbObj->prepare($wfrInsert)) {
			// bind w_id for insert stmt	
			$insertStmt->bind_param('iii', $w_id, $f_id, $w_count);
    		$insertStmt->execute() 
				or die ("Could not execute: ".$wfrInsert."<br>");
			// close stmt
    		$insertStmt->close();
	
		} else { 
			echo "ERROR on preparing wfrInsert: ".$wfrInsert."!<br>";
		} 
		
	} else { // only need to update the count for this w_id:f_id
		$w_count = $w_count+1; // inc $w_count from current
		//echo "W_COUNT NOW: ".$w_count."<br>";
		
		$wfrUpdateStmt->bind_param('iii', $w_count, $w_id, $f_id);
		$wfrUpdateStmt->execute()
			or die ("Could not execute wfr Update!<br>");
		
		// close from Calling Function!
	}
	return;
}			

/* ****************************
 * Function:	&tagSelPrep
 * Inputs:		1) ref to db connection
 * 
 * Output:		Returns the REF to the prepared tagSelection stmt
 * Notes:		Wrapper that prepares the db statement		
 * *****************************/
function &tagSelPrep(&$dbObj) {
	
	$tagChkQuery = "SELECT tag_id from tags where xml_id=? and f_id=?";
	if ($tagChkStmt = $dbObj->prepare($tagChkQuery)) {
		return $tagChkStmt;
	} else {
		echo "ERROR on preparing Tags Update: ".$tagChkQuery."<br>";
	}
	
}

function updateTagsTable(&$dbObj, &$TagsSelStmt, $tag_name, $xml_id, $f_id, $parent_id) {

	$tag_id = 0;
	$tag_id = checkTagTable($TagsSelStmt, $xml_id, $f_id);
	
	if ($tag_id == 0) {
		// insert xml_id, f_id, offset, len
		//$tagsInsert = "INSERT INTO tags VALUES (?,?,?,?);";
		$tagsInsert = "INSERT INTO tags SET tag_name=?, xml_id=?, f_id=?, parent_id=?;";
		
		if ($insertStmt = $dbObj->prepare($tagsInsert)) {
			// bind xml_id,f_id,$offset,$len for insert stmt	
			$insertStmt->bind_param('ssis', $tag_name, $xml_id, $f_id, $parent_id);
    		$insertStmt->execute() 
				or die ("Could not execute: ".$tagsInsert."<br>");
			// get the tag_id for the newly inserted tags row	
			$tag_id = $dbObj->insert_id;
			// close stmt
    		$insertStmt->close();
	
		} else { 
			echo "<br>ERROR on preparing tagsInsert: ".$tagsInsert."!<br>";
		}		
		
		//now that it's inserted, get the new tag 
		//$tag_id = checkTagTable($TagsSelStmt, $xml_id, $f_id);
	}
	
	return $tag_id;
    	
}

function checkTagTable(&$TagsSelStmt, $xml_id, $f_id) {
	
	$tag_id = 0;

	// bind w_id for select stmt	
	$TagsSelStmt->bind_param('si', $xml_id, $f_id);
    $TagsSelStmt->execute()
		or die ("Could not execute Tags Select Stmt!<br>");

    // bind any results to $tag_id var
	$TagsSelStmt->bind_result($tag_id); 
	$TagsSelStmt->store_result();
	
	// if we get a row with this tag_id, fetch the tag_id
    if ($TagsSelStmt->num_rows == 1) {
		$TagsSelStmt->fetch();
	}
	// Close the stmt from calling function,
	// after the handle is done being used...
	
	return $tag_id;
}

/* ****************************
 * Function:	&attsSelPrep
 * Inputs:		1) ref to db connection
 * 
 * Output:		Returns the REF to the prepared attsSelection stmt
 * Notes:		Wrapper that prepares the db statement		
 * *****************************/
function &attsSelPrep(&$dbObj) {
	
	$attsChkQuery = "SELECT attrib_id from tag_attribs where tag_id=? and name=? and value=?";
	if ($attsChkStmt = $dbObj->prepare($attsChkQuery)) {
		return $attsChkStmt;
	} else {
		echo "ERROR on preparing Tags Update: ".$attsChkQuery."<br>";
	}
}

/* ****************************
 * Function:	&attsInsertPrep
 * Inputs:		1) ref to db connection
 * 
 * Output:		Returns the REF to the prepared word_tag_f_rel INSERT stmt
 * Notes:		Wrapper that prepares the db statement		
 * *****************************/
function &attsInsertPrep(&$dbObj) {
	
	$insert = "INSERT INTO tag_attribs SET tag_id=?, name=?, value=?;";
	if ($insertStmt = $dbObj->prepare($insert)) {
		return $insertStmt;
	} else {
		echo "ERROR on preparing tag_attribs Insert: ".$insert."<br>";
	}
	
}

function checkAttsTable(&$attsSelStmt, $tag_id, $attrib_name, $attrib_value) {
	
	$attrib_id = 0;

	// bind w_id for select stmt	
	$attsSelStmt->bind_param('iss', $tag_id, $attrib_name, $attrib_value);
    $attsSelStmt->execute()
		or die ("Could not execute Attributes' Select Stmt!<br>");

    // bind any results to $tag_id var
	$attsSelStmt->bind_result($attrib_id); 
	$attsSelStmt->store_result();
	
	// if we get a row with this attrib_id, fetch the attrib_id
    if ($attsSelStmt->num_rows == 1) {
		$attsSelStmt->fetch();
	}
	// Close the stmt from calling function,
	// after the handle is done being used...
	
	return $attrib_id;
}

function updateAttsTable(&$attsSelStmt, &$attsInsertStmt, $tag_id, $attrib_name, $attrib_value) {

	$attrib_id = checkAttsTable($attsSelStmt, $tag_id, $attrib_name, $attrib_value);

	if ($attrib_id == 0) {
		//echo "INSERTING: ".$attrib_id."/".$tag_id." Name/Val: ".$attrib_name."/".$attrib_value."<br>";
		$attsInsertStmt->bind_param('iss', $tag_id, $attrib_name, $attrib_value);
    	$attsInsertStmt->execute() 
			or die ("Could not execute tag_attribs INSERT: TagID: ".$tag_id." AttName:".$attrib_name." Val: ".$attrib_value."<br>".mysql_error());	
	}
	// close stmt from calling function -- not here!

}

/* ****************************
 * Function:	&tagWordFilePrep
 * Inputs:		1) ref to db connection
 * 
 * Output:		Returns the REF to the prepared word_tag_f_rel INSERT stmt
 * Notes:		Wrapper that prepares the db statement		
 * *****************************/
function &OLDtagWordFilePrep(&$dbObj) {
	
	$insert = "INSERT INTO word_tag_f_rel SET w_id=?, tag_id=?, f_id=?, w_offset=?;";
	if ($insertStmt = $dbObj->prepare($insert)) {
		return $insertStmt;
	} else {
		echo "ERROR on preparing tag word_tag_f_rel Insert: ".$insert."<br>";
	}
	
}
function OLDupdateWordTagFile(&$insertStmt, $w_id, $tag_id, $f_id, $w_offset) {
	
	// bind w_id, tag_id, file id, word offset for insert stmt	
	$insertStmt->bind_param('iiii', $w_id, $tag_id, $f_id, $w_offset);
   	$insertStmt->execute() 
		or die ("Could not execute word_tag_f_rel INSERT<br>");
		
}

/* ****************************
 * Function:	&tagWordFilePrep
 * Inputs:		1) ref to db connection
 * 
 * Output:		Returns the REF to the prepared word_tag_f_rel INSERT stmt
 * Notes:		Wrapper that prepares the db statement		
 * *****************************/
function &tagWordFilePrep(&$dbObj) {
	
	$insert = "INSERT INTO word_tag_f_rel SET w_id=?, tag_id=?, f_id=?, w_pos=?, w_num_generations=?, closest_tag_id=?, child_node_num=?;";
	if ($insertStmt = $dbObj->prepare($insert)) {
		return $insertStmt;
	} else {
		echo "ERROR on preparing tag word_tag_f_rel Insert: ".$insert."<br>";
	}
	
}

/* ****************************
 * Function:	&twfSelPrep
 * Inputs:		1) ref to db connection
 * 
 * Output:		Returns the REF to the prepared tag-word-file Selection stmt
 * Notes:		Wrapper that prepares the db statement		
 * *****************************/
function &twfSelPrep(&$dbObj) {
	
	$twfChkQuery = "SELECT w_id, tag_id, f_id, w_pos, w_num_generations, closest_tag_id, child_node_num
					FROM word_tag_f_rel 
					WHERE w_id=? and tag_id=? and f_id=? and w_pos=? and w_num_generations=? and closest_tag_id=? and child_node_num=?";
	if ($twfRelChkStmt = $dbObj->prepare($twfChkQuery)) {
		return $twfRelChkStmt;
	} else {
		echo "ERROR on preparing Tag-Word-File Rel Update: ".$twfChkQuery."<br>";
	}
}

function checkTagWordFileRelTable(&$twfSelStmt, $w_id, $tag_id, $f_id, $w_pos, $w_num_gens, $closest_tag_id, $child_node_num) {

	$exists = 0;
	// bind w_id for select stmt	
	$twfSelStmt->bind_param('iiiiiii', $w_id, $tag_id, $f_id, $w_pos, $w_num_gens, $closest_tag_id, $child_node_num);
    $twfSelStmt->execute()
		or die ("Could not execute Tag-Word-File Rel Select Stmt!<br>");

	//$twfSelStmt->bind_result($exists); 
	$twfSelStmt->store_result();
	
	// if we get a row with this attrib_id, fetch the attrib_id
    if ($twfSelStmt->num_rows >0) {
		$exists = 1;
	}
	
	return $exists;
}

function updateWordTagFile(&$insertStmt, &$twfSelStmt, $w_id, $tag_id, $f_id, $w_pos, $w_num_gens, $closest_tag_id, $child_node_num) {
	
	$exists = checkTagWordFileRelTable($twfSelStmt, $w_id, $tag_id, $f_id, $w_pos, $w_num_gens, $closest_tag_id, $child_node_num);

	if ($exists == 0) {
		// bind w_id, tag_id, file id, word offset for insert stmt	
		$insertStmt->bind_param('iiiiiii', $w_id, $tag_id, $f_id, $w_pos, $w_num_gens, $closest_tag_id, $child_node_num);
   		$insertStmt->execute() 
			or die ("Could not execute word_tag_f_rel INSERT<br>".mysql_error()."<br>");
	}
		
}

function &msRelInsertPrep(&$dbObj) {
	
	$insert = "INSERT INTO ms_word_f_rel SET w_id=?, ms_id=?, f_id=?, w_pos=?, end_ms_id=?;";
	if ($insertStmt = $dbObj->prepare($insert)) {
		return $insertStmt;
	} else {
		echo "ERROR on preparing tag ms_word_f_rel Insert: ".$insert."<br>";
	}
	
}
function &msRelSelPrep(&$dbObj) {
	
	$msRelChkQuery = "SELECT w_id, ms_id, f_id, w_pos, end_ms_id from ms_word_f_rel where w_id=? and ms_id=? and f_id=? and w_pos=? and end_ms_id=?";
	if ($msRelChkStmt = $dbObj->prepare($msRelChkQuery)) {
		return $msRelChkStmt;
	} else {
		echo "ERROR on preparing Milestone-Word-File Rel Update: ".$msRelChkQuery."<br>";
	}
}

function checkMSRelTable(&$selectStmt, $w_id, $ms_id, $f_id, $w_pos, $end_ms_id) {

	$exists = 0;
	// bind w_id for select stmt	
	$selectStmt->bind_param('iiiii', $w_id, $ms_id, $f_id, $w_pos, $end_ms_id);
    $selectStmt->execute()
		or die ("Could not execute Milestone-Word-File Rel Select Stmt!<br>");
	$selectStmt->store_result();
	
	// if we get a row with this attrib_id, fetch the attrib_id
    if ($selectStmt->num_rows >0) {
		$exists = 1;
	}
	
	return $exists;
}

function updateMSRelTable(&$insertStmt, &$msRelSelStmt, $w_id, $ms_id, $f_id, $w_pos, $end_ms_id) {
	
	$exists = checkMSRelTable($msRelSelStmt, $w_id, $ms_id, $f_id, $w_pos, $end_ms_id);

	if ($exists == 0) {
		// bind w_id, tag_id, file id, word offset for insert stmt	
		$insertStmt->bind_param('iiiii', $w_id, $ms_id, $f_id, $w_pos, $end_ms_id);
   		$insertStmt->execute() 
			or die ("Could not execute ms_word_f_rel INSERT<br>".mysql_error()."<br>");
	}
}

/* ****************************
 * Function:	&prevSpSelPrep
 * Inputs:		1) ref to db connection
 * 
 * Output:		Returns the REF to the prepared speakers Selection stmt
 * Notes:		Wrapper that prepares the db statement		
 * *****************************/
function &prevSpkrPrep(&$dbObj) {
	
	$prevSpQuery = "SELECT who, sp_xml_id, sp_lines
					FROM speakers
					WHERE sp_xml_id=?";

	if ($prevSpSelStmt = $dbObj->prepare($prevSpQuery)) {
		return $prevSpSelStmt;
	} else {
		echo "ERROR on prepp'ing Speakers' Selection Query: ".$prevSpQuery."<br>";
	}
}

/* ****************************
 * Function:	&spkrSelPrep
 * Inputs:		1) ref to db connection
 * 
 * Output:		Returns the REF to the prepared speakers Selection stmt
 * Notes:		Wrapper that prepares the db statement		
 * *****************************/
function &spkrSelPrep(&$dbObj) {
	
	$spkrChkQuery = "SELECT sp_id from speakers where f_id=? and sp_xml_id=? and who=?";
	if ($spkrChkStmt = $dbObj->prepare($spkrChkQuery)) {
		return $spkrChkStmt;
	} else {
		echo "ERROR on preparing Speakers Table Update: ".$spkrChkQuery."<br>";
	}
	
}

/* ****************************
 * Function:	&spkrInsertPrep
 * Inputs:		1) ref to db connection
 * 
 * Output:		Returns the REF to the prepared word_tag_f_rel INSERT stmt
 * Notes:		Wrapper that prepares the db statement		
 * *****************************/
function &spkrInsertPrep(&$dbObj) {
	
	$insert = "INSERT INTO speakers (f_id, who, sp_xml_id, prevsp_id, nextsp_id, sp_lines) VALUES (?,?,?,?,?,?);";
	
	if ($insertStmt = $dbObj->prepare($insert)) {
		return $insertStmt;
	} else {
		echo "ERROR on preparing SPEAKERS Insert: ".$insert."<br>";
	}

}

function updateSpkrTbl(&$selStmt, &$insertStmt, $f_id, $who, $xml_id, $prev_spid, $next_spid, $lines) {
	
	$exists = 0;
	$exists = checkSpkrTbl($selStmt, $f_id, $xml_id, $who);

	if ($exists == 0) {		
		if (!$insertStmt->bind_param('isssss', $f_id, $who, $xml_id, $prev_spid, $next_spid, $lines)) {
			try {   
        		throw new Exception("MYSQL BindParam error!");   
    		} catch(Exception $e ) {
        		echo "Error No: ".$e->getCode(). " - ". $e->getMessage() . "<br >";
        		echo nl2br($e->getTraceAsString());
    		}
		}
    	
		if (!$insertStmt->execute()) { 
			try {   
        		throw new Exception("MYSQL Spkr INSERT error!");   
    		} catch(Exception $e ) {
        		echo "Error No: ".$e->getCode(). " - ". $e->getMessage() . "<br >";
        		echo nl2br($e->getTraceAsString());
    		}
		}
	}
}

function checkSpkrTbl(&$selStmt, $f_id, $xml_id, $who) {
	
	$sp_id = 0;

	// bind w_id for select stmt	
	$selStmt->bind_param('iss', $f_id, $xml_id, $who);
    $selStmt->execute()
		or die ("Could not execute Speakers' Select Stmt!<br>");

    // bind any results to $sp_id var
	$selStmt->bind_result($sp_id); 
	$selStmt->store_result();
	
	// if we get a row with this tag_id, fetch the tag_id
    if ($selStmt->num_rows == 1) {
		$selStmt->fetch();
	}

	return $sp_id;
}

function &key2SpkrSelPrep(&$dbObj) {
	
	$spkrChkQuery = "SELECT who from key2speakers where uniform_title=? and spkr_name=?";
	if ($spkrChkStmt = $dbObj->prepare($spkrChkQuery)) {
		return $spkrChkStmt;
	} else {
		echo "ERROR on preparing Key2Speakers Table Update: ".$spkrChkQuery."<br>";
	}
	
}
function &key2SpkrInsert(&$dbObj) {
	
	$insert = "INSERT INTO key2speakers (who, uniform_title, spkr_name, role_desc, role_type) VALUES (?,?,?,?,?);";
	
	if ($insertStmt = $dbObj->prepare($insert)) {
		return $insertStmt;
	} else {
		echo "ERROR on preparing Key2Speakers Table Insert: ".$insert."<br>";
	}

}

function checkKey2SpkrTbl($selStmt, $title, $whoKey, $characterName) {
	$rowExists = 0;
	$who = "";

	// bind w_id for select stmt	
	$selStmt->bind_param('ss', $title, $characterName);
    $selStmt->execute()
		or die ("Could not execute characterName to who-key' Select Stmt!<br>");

    // bind any results to $sp_id var
	$selStmt->bind_result($who); 
	$selStmt->store_result();
	
	// if we get a row with this tag_id, fetch the tag_id
    if ($selStmt->num_rows == 1) {
		$selStmt->fetch();
		if ($who == $whoKey) {
			$rowExists = 1;
		}
	}

	return $rowExists;
}

function insertKey2SpkrTbl(&$selStmt, &$insertStmt, $whoKey, $title, $charName, $role_desc, $role_type) {
	
	$exists = 0;
	$exists = checkKey2SpkrTbl($selStmt, $title, $whoKey, $charName);
echo "EXISTS= ".$exists."<BR>";

	if ($exists == 0) {		
		if (!$insertStmt->bind_param('sssss', $whoKey, $title, $charName, $role_desc, $role_type)) {
			try {   
        		throw new Exception("MYSQL BindParam error!");   
    		} catch(Exception $e ) {
        		echo "Error No: ".$e->getCode(). " - ". $e->getMessage() . "<br >";
        		echo nl2br($e->getTraceAsString());
    		}
		}
    	
		if (!$insertStmt->execute()) { 
			try {   
        		throw new Exception("MYSQL key2Speaker INSERT error!");   
    		} catch(Exception $e ) {
        		echo "Error No: ".$e->getCode(). " - ". $e->getMessage() . "<br >";
        		echo nl2br($e->getTraceAsString());
    		}
		}
	}

}


function OLDcheckKey2SpkrTbl($selStmt, $f_id, $key, $who) {
	$row_id = 0;

	// bind w_id for select stmt	
	$selStmt->bind_param('iss', $f_id, $key, $who);
    $selStmt->execute()
		or die ("Could not execute who-key to speaker' Select Stmt!<br>");

    // bind any results to $sp_id var
	$selStmt->bind_result($row_id); 
	$selStmt->store_result();
	
	// if we get a row with this tag_id, fetch the tag_id
    if ($selStmt->num_rows == 1) {
		$selStmt->fetch();
	}

	return $row_id;
}

function OLDinsertKey2SpkrTbl(&$selStmt, &$insertStmt, $f_id, $key, $who) {
	
	$exists = 0;
	$exists = checkKey2SpkrTbl($selStmt, $f_id, $key, $who);

	if ($exists == 0) {		
		if (!$insertStmt->bind_param('iss', $f_id, $key, $who)) {
			try {   
        		throw new Exception("MYSQL BindParam error!");   
    		} catch(Exception $e ) {
        		echo "Error No: ".$e->getCode(). " - ". $e->getMessage() . "<br >";
        		echo nl2br($e->getTraceAsString());
    		}
		}
    	
		if (!$insertStmt->execute()) { 
			try {   
        		throw new Exception("MYSQL key2Speaker INSERT error!");   
    		} catch(Exception $e ) {
        		echo "Error No: ".$e->getCode(). " - ". $e->getMessage() . "<br >";
        		echo nl2br($e->getTraceAsString());
    		}
		}
	}

}


/* ****************************
 * Function:	&key2SpkrDelete
 * Inputs:		1) ref to db connection
 * 
 * Output:		Returns the REF to the prepared DELETE Selection stmt
 * Notes:		Wrapper that prepares the db statement		
 * *****************************/
function &key2SpkrDelete(&$dbObj) {
	
	$key2spDelSel = "DELETE FROM key2speakers WHERE f_id=?";
	if ($key2spSelStmt = $dbObj->prepare($key2spDelSel)) {
		return $key2spSelStmt;
	} else {
		echo "ERROR on preparing key2speaker list for file id: ".$key2spSelQuery."<br>";
	}
}


/* ****************************
 * Function:	OLDinsertFile
 * Inputs:		1) database connection/db object 
 * 				2) filename of file being processed
 * 
 * Output:		Returns the f_id for the file entry that is inserted	
 * * ******** OLD OLD OLD *************	*/
function OLDinsertFile(&$dbObj, $fn) {
	$qInsert = "INSERT INTO files SET filename='".$fn."';";
	$qSelect = "SELECT f_id FROM files where filename='".$fn."';";
	$f_id = -1;
	
	// Insert the info into the files table first
	if ($insert = $dbObj->query($qInsert)) {
		$rows = $insert->num_rows;
		echo "Inserted: ".$rows."<br>";
		if ($insert->num_rows > 0) {
			echo "Insert successful!";
			$insert->close();
		}
	} else {
		echo "ERROR ON files INSERT for FILE: ".$fn."<br>";
	}
	
	// Now get the f_id for that file for processing through other tables
	if ($result = $dbObj->query($qSelect)) {
		$row = $result->fetch_assoc();
		$f_id = $row['f_id'];
		$result->close();
	} else {
		echo "ERROR ON files RETRIEVING f_id for FILE: ".$fn."<br>";
	}
	
	return $f_id;
}

/* ****************************
 * Function:	******OLDfidExists
 * Inputs:		1) database connection/db object 
 * 				2) filename of file being processed
 * 
 * Output:		0 if file hasn't been put in db;
 * 				1 if it has.
 * ******** OLD OLD OLD ************* */
function OLDfidExists(&$dbObj, $fn) {
	$exists = 0;
	$query = "SELECT f_id, filename FROM files WHERE filename='".$fn."';";
	
	if ($qResult = $dbObj->query($query)) {
		if ($qResult->num_rows > 0) { 
		// we need to clean up and re-insert
			echo "NEED TO CLEAN UP ALL THE TABLEs ENTRIES for this FILE!!";
			// set $exists
			$exists = 1;
			// need to get the f_id for this filename
			$row = $qResult->fetch_assoc();
			$f_id = $row['f_id'];
			$file = $row['filename'];
			echo "FILE id: ".$f_id." for FILE: ".$file."<br>";
			// TODO:
			// 1) REMOVE the row from files table
			// 2) run a query to get a list of w_ids from word_file_rel, and remove all rows
			// with this file's file_id
			// 3) run a query to confirm w_ids for which this f_id was the only relation..??
			// HOW?? -- after this, remove all w_ids/words from words table where this is true
			// 4) Will have the same problem with tag_ids in the tag table...
			// *** Maybe can take care of with the w_id, tag_id, f_id composite key...?
			
		}
	}
	// safely close result
	$qResult->close();
	
	return $exists;
}

function OLDupdateTagsTable(&$dbObj, &$TagsSelStmt, $xml_id, $f_id, $offset, $len) {

	$tag_id = 0;
	$tag_id = checkTagTable($TagsSelStmt, $xml_id, $f_id);
	
	if ($tag_id == 0) {
		// insert xml_id, f_id, offset, len
		//$tagsInsert = "INSERT INTO tags VALUES (?,?,?,?);";
		$tagsInsert = "INSERT INTO old_tags SET xml_id=?, f_id=?, offset=?, len=?;";
		
		if ($insertStmt = $dbObj->prepare($tagsInsert)) {
			// bind xml_id,f_id,$offset,$len for insert stmt	
			$insertStmt->bind_param('siii', $xml_id, $f_id, $offset, $len);
    		$insertStmt->execute() 
				or die ("Could not execute: ".$tagsInsert."<br>");
			// close stmt
    		$insertStmt->close();
	
		} else { 
			echo "<br>ERROR on preparing tagsInsert: ".$tagsInsert."!<br>";
		}		
		
		//now that it's inserted, get the new tag 
		$tag_id = checkTagTable($TagsSelStmt, $xml_id, $f_id);
	}
	// close stmt from calling function!
   	//$TagsSelStmt->close();
	return $tag_id;
    	
}

function OLDloadTags(&$node,$path, &$cnxn, $f_id, $dbStmtRefs) {

		// break down the references to prepared DB statements array
		$wordSelStmtRef		= $dbStmtRefs[0];
		$wfrCntStmtRef		= $dbStmtRefs[1];
		$wfrUpdateStmtRef	= $dbStmtRefs[2];
		$tagSelStmtRef		= $dbStmtRefs[3];
		$attsSelStmtRef		= $dbStmtRefs[4];
		$attsInsertStmtRef	= $dbStmtRefs[5];
		$twfInsertStmtRef	= $dbStmtRefs[6];
		$twfSelStmtRef		= $dbStmtRefs[7];
		
		// first load the node info into tags and tag_attribs tables, 
		// if it is a DOMElement
		if (get_class($node) == "DOMElement") {
			$id = $node->getAttribute("xml:id");
			if (isset($node->parentNode)) {
					$parentNode =  $node->parentNode;
					if ($parentNode->hasAttribute("xml:id")) {
						$parent_id = $parentNode->getAttribute("xml:id");
					} else { $parent_id = "NULL"; } // take care of rootText parent_id
			} else {
					$parent_id = "NULL";
			}
			// update the tags table for this tag
			$tag_id = updateTagsTable($cnxn, $tagSelStmtRef, $id, $f_id, $parent_id);
				
			// update the tag_attribs for this tag
			$atts = $node->attributes;
			if ($atts!=null) {
				foreach ($atts as $att){
					//if (is_string($att->value)) { $attrib_val = $att->value; } 
					//else { $attrib_val = strval($att->value); }
					// check if the attribs for this tag exists; if not, insert
					updateAttsTable($attsSelStmtRef, $attsInsertStmtRef, $tag_id, $att->name, $att->value);
				}
			}
		}
		
		// Now work on the kids of this node		
		$kids = $node->childNodes;
		for ($i=0;$i<$kids->length;$i++){
			$kid = $kids->item($i);
			if (get_class($kid) == "DOMText"){	
				$wc_utf8 = strWordCountUTF8(stripPunct($kid->nodeValue));
				$words = array();
				$words = strWordCountUTF8(stripPunct($kid->nodeValue),1);
				
				switch ($wc_utf8) { // check for content 
				
				case 0: //(0 ==> assume solo punctuation, do nothing in DB)
				break;
				
				case 1: // single word in the tag

				$ancArray = explode("|", $path);
				//** The number of ancestors for this word
				//** is actually one LESS than the items in the $ancArray 
				//** (i.e., the $path), due to extra array element
				//** resulting from the explode("|", $path)
				$w_num_gens = (count($ancArray))-1;
				
				$w_pos = 0; // because only one word in tag
				//echo "word: ".$words[0]." Pos: 0, AncPath: ".$path."<br>";					
				// get the word id for this word
				// AFTER inserting, if required
				$w_id = updateWords($cnxn, $wordSelStmtRef, $words[0]);
				
				// update the word_fid_rel table with this word/file's information
				updateWordFidRel($cnxn, $wfrCntStmtRef, $wfrUpdateStmtRef, $w_id, $f_id);
				
				// Want to link this w_id to every tag in its Ancester path
				// Start at end($ancArray) and dec down
				if ($w_num_gens>0 ) {				
					for($ancIndex=$w_num_gens; $ancIndex>0; $ancIndex--) {
						$id = $ancArray[$ancIndex];
						$tag_id = checkTagTable($tagSelStmtRef, $id, $f_id);
						if ($tag_id !=0) {
								updateWordTagFile($twfInsertStmtRef, $twfSelStmtRef, $w_id, $tag_id, $f_id, $w_pos, $w_num_gens);
						}
					}
				}
				
				break;
				
				default: // greater than one word in this tag
				
				$ancArray = explode("|", $path);
				//** The number of ancestors for this word
				//** is actually one LESS than the items in the $ancArray 
				//** (i.e., the $path), due to extra array element
				//** resulting from the explode("|", $path)
				$w_num_gens = (count($ancArray))-1;
				
				for ($i=0;$i<count($words);$i++){
					$w_pos = $i; // word position in tag is at index $i
				
					$w_id = updateWords($cnxn, $wordSelStmtRef, $words[$i]);
					// update the word_fid_rel table with this word/file's information
					updateWordFidRel($cnxn, $wfrCntStmtRef, $wfrUpdateStmtRef, $w_id, $f_id);
					// Want to link this w_id to every tag in its Ancester path
					// Start at end($ancArray) and dec down
					if ($w_num_gens>0 ) {	
						for($ancIndex=$w_num_gens; $ancIndex>0; $ancIndex--) {
							$id = $ancArray[$ancIndex];
							$tag_id = checkTagTable($tagSelStmtRef, $id, $f_id);
							if ($tag_id !=0) {
								updateWordTagFile($twfInsertStmtRef, $twfSelStmtRef, $w_id, $tag_id, $f_id, $w_pos, $w_num_gens);
							} 
						}
					}
				}
				
				break;
		}
			
			}
			else{
				$id = $kid->getAttribute("xml:id");
				
				// add this tag to the ancestor path
				$newpath = $path."|".$id;

				loadTags(&$kid,$newpath, $cnxn, $f_id, $dbStmtRefs);

			}	
		}
}

?>
