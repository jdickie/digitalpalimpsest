<?php
ini_set("memory_limit","128M");

echo "<?xml version='1.0' encoding='UTF-8'?>";

if ($_GET['speaker']) {
	$spkr_name = $_GET['speaker'];
} else {
	echo "Need a speaker!!<br>";
	exit;
}

if ($_GET['title']) {
	$uniform_title = $_GET['title'];
}

// set up the db connection
$cnxn = new mysqli("localhost","root","root","Archie_login");
//$cnxn = new mysqli("minerva.umd.edu","archie_user","archie_user","Archie_login");
if (mysqli_connect_errno()) {
	die ("Can't connect to MySQL Server. Errorcode: ". mysqli_connect_error(). "<br>");
} 

$f_id=2;
/*
$characters = getCharacters4singlePlay($cnxn, $uniform_title);
echo "Character list for ".$uniform_title."<br>";

foreach ($characters as $name) {
	echo "[".$name."]<br>";
}
*/

$characters = getCharacters4singleFile($cnxn, $f_id);
echo "Character list for FILE #".$f_id."<br>";

foreach ($characters as $name) {
	echo "[".$name."]<br>";
}
echo "WHO KEYS (distinct by uniform_title): <br>";
$whoKeys = getWhoKey($cnxn, $spkr_name, $uniform_title);
echo "For characterName: ".$spkr_name.", who key is/are:<br>";
foreach ($whoKeys as $who) {
	echo $who."<br>";
}

echo "WHO (distinct by file): <br>";
$whoKeys = getWhoByFile($cnxn, $spkr_name, $f_id);
echo "For characterName: ".$spkr_name.", who key is/are:<br>";
foreach ($whoKeys as $who) {
	echo $who."<br>";
}

$cnxn->close();

/* ****************************
 * Function:	getWhoByFile
 * @@Inputs:	1) ref to db connection
 * 				2) speaker name string to search on
 * 				3) f_id name of the file copy of interest
 * 
 * @@Output:	an array of the 3-character "who" keys that are mapped
 * 				to X-speaker...
 * 	
 * *****************************/
function getWhoByFile(&$cnxn, $spkr_name, $f_id) {
	
	$whoList = array();
	
	$query = "SELECT distinct(who) FROM key2speakers WHERE f_id='".$f_id
				."' AND spkr_name='".$spkr_name."';";

	if ($qResult = $cnxn->query($query)) {

    	/* Fetch results of the query */
    	while( $row = $qResult->fetch_assoc() ){
       		array_push($whoList, $row['who']);
    	}

    	/* Destroy result set/free the memory used for it */
    	$qResult->close();
	} 
	return $whoList;
}


/* ****************************
 * Function:	getWhoKey
 * @@Inputs:	1) ref to db connection
 * 				2) speaker name string to search on
 * 				3) uniform_title name of the play of interest (e.g., Hamlet, Othello, etc)
 * 
 * @@Output:	an array of the 3-character "who" keys that are mapped
 * 				to X-speaker...
 * 	
 * Notes:		The reason the "who" returned is a list is because
 * 				for a _few_ characters, one speaker name string returns
 * 				multiple "who" values...For example, "Hamlet" maps
 * 				to both "oha" and "ham" in Hamlet....	
 * *****************************/
function getWhoKey(&$cnxn, $spkr_name, $uniform_title) {
	
	$whoList = array();
	
	$query = "SELECT distinct(who) FROM key2speakers WHERE spkr_name='"
			.$spkr_name."' AND uniform_title='".$uniform_title."';";

	if ($qResult = $cnxn->query($query)) {

    	/* Fetch results of the query */
    	while( $row = $qResult->fetch_assoc() ){
       		array_push($whoList, $row['who']);
    	}

    	/* Destroy result set/free the memory used for it */
    	$qResult->close();
	} 
	return $whoList;
}

/* ****************************
 * Function:	getCharacters4singlePlay
 * @@Inputs:	1) ref to db connection
 * 				2) uniform_title name of the play of interest (e.g., Hamlet, Othello, etc)
 * 
 * @@Output:	an array of all the characters listed in a particular play
 * 		
 * *****************************/
function getCharacters4singlePlay(&$cnxn, $uniform_title) {
	
	$characterList = array();
	
	$query = "SELECT distinct(spkr_name) FROM key2speakers"
			." WHERE uniform_title='".$uniform_title."' order by spkr_name;";

	if ($qResult = $cnxn->query($query)) {

    	/* Fetch results of the query */
    	while( $row = $qResult->fetch_assoc() ){
       		array_push($characterList, $row['spkr_name']);
    	}

    	/* Destroy result set/free the memory used for it */
    	$qResult->close();
	} 
	return $characterList;
}

/* ****************************
 * Function:	getCharacters4singleFile
 * @@Inputs:	1) ref to db connection
 * 				2) f_id of file
 * 
 * @@Output:	an array of all the characters listed in a 
 * 				particular file
 * 		
 * *****************************/
function getCharacters4singleFile(&$cnxn, $f_id) {
	
	$characterList = array();
	
	$query = "SELECT distinct(spkr_name) FROM key2speakers"
			." WHERE f_id='".$f_id."' order by spkr_name;";

	if ($qResult = $cnxn->query($query)) {

    	/* Fetch results of the query */
    	while( $row = $qResult->fetch_assoc() ){
       		array_push($characterList, $row['spkr_name']);
    	}

    	/* Destroy result set/free the memory used for it */
    	$qResult->close();
	} 
	return $characterList;
}
?>
