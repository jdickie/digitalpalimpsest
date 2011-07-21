<?php
ini_set("memory_limit","240M");

include("./generateIDbyFile.php");
require("./dbStuff.php");

echo "<?xml version='1.0' encoding='UTF-8'?>";
// getting some timing info
$start= date("F j, Y, g:i:s a");
echo "START: ".$start."<br>";

$XMLsourcePath = "file:///Bee_School/Archie/Archie-XML.20090520/SOURCExml/";
//$svnXMLpath = "file:///Applications/MAMP/htdocs/quartos/XML/";
//$origXMLpath = "file:///Applications/MAMP/htdocs/quartos/XML_Orig/";

// ** WHEN TESTING **
$svnXMLpath ="file:///Bee_School/Archie/XML/";
$origXMLpath = "file:///Bee_School/Archie/XML_Orig/";

// List of Repository abbrevs==>Full name
$repos = array("bli"=>"British Library",
				"fol"=>"Folger Shakespeare",
				"bod"=>"Bodleian Library",
				"hun"=>"Huntington Library",
				"eul"=>"Edinburgh University",
				"nls"=> "Scotland National Library");
				
$files = $updatedFiles = array();

// set up the db connection
$cnxn = new mysqli("localhost","root","root","Archie_login");
//$cnxn = new mysqli("minerva.umd.edu","archie_user","archie_user","Archie_login");
if (mysqli_connect_errno()) {
	die ("Can't connect to MySQL Server. Errorcode: ". mysqli_connect_error(). "<br>");
}

// Get the list of files from Jim/authoritative folks who send them
$files = getFileList($XMLsourcePath);

// Generate Ids for the files; copy the originals to an archive dir;
// put the new ones in a new folder for processing; 
// populate a new array with filename=>uniformTitle 
$updatedFiles = genIDs4files($XMLsourcePath, $origXMLpath, $svnXMLpath, $files);

// insert these files into the db's 'files' table
$numLoaded = insertFiles($cnxn, $updatedFiles, $repos);

echo $numLoaded." Files into DB.<br>";

$cnxn->close();

$end = date("F j, Y, g:i:s a");
echo "END: ".$end."<br>";

/* **************************** */

/* **************************************************************
 * Function:		getFileList
 * @@Inputs:		1) full dir path where source files are
 * 
 * @@Output:		1) array of files in that dir 
 * 							(** NOT ".", "..", or other hidden ".<name>" files **)
 * 
 * Dependencies:	
* *************************************************************** */
function getFileList($path) {
	
	if ($dirHandle = opendir($path)) {
		//echo "My dir handle for path ".$path." is: ".$dirHandle."<br>";
		//echo "Files in ".$dirHandle." directory: <br>";
		while (false !== ($file = readdir($dirHandle))) {
			// make sure you don't get "." and ".." files in the dir
			// or any hidden files that start w/ ".", like .DS_store or .svn
			$dotFile = preg_match('/^\./', $file);
			if ($dotFile == 0) {
				$fileList[] = $file;
			}
		}
	}
	return $fileList;
}

/* **************************************************************
 * Function:		genIDs4files
 * @@Inputs:		1) full dir path where xml files are
 * 					2) full dir path where original files (no xml:ids)
 * 					   will be stored
 * 					3) Full dir path where xml files will go
 * 					4) the fileList (no path)
 * 
 * @@Output:		1) adds "xml:id" attribs to tags that don't have them; 
 * 					2) copies source files to an archive place; 
 * 					3) renames processed files new filenames and puts them in XML dir
 * 					4) returns list of files with uniform title info
 * 
 * Dependencies:	calls getPrefix() and setIDs(),
 * 					functions originally from generateID.php
 * 					* Also calls getUniformTitle() to get
 * 					* the uniform title from the file
 * 					* (for files table)
* *************************************************************** */
function genIDs4files($sourcePath, $origPath, $newPath, $fileList) {
	
	$fullName = $prefix = $newName = $origFN = $baseFN = $uniformTitle = '';
	$filesByTitle = array();
	
	foreach ($fileList as $file) {
		
		$fullName = $sourcePath.$file;
		
		$fHandle = fopen($fullName,'r') or die("###error");
		$txt = "";
		while (!feof ($fHandle)) {
    		$txt .= fgets($fHandle, 1024);
		}
	
		fclose($fHandle);
		$txt = strtr($txt,"\r","\n");
		$txt = strtr($txt,"\n"," ");
		$txt = preg_replace("/\>\s*\</","><",$txt);

		$xml = new DOMDocument();
		$xml->loadXML($txt);

		$uniformTitle = getUniformTitle($xml);

		// get prefix and set xml:ids for those tags that don't have them
		$prefix = getPrefix($file);
		setIDs($xml->documentElement,0,$xml,$prefix);

		//Write out the XML file, now that each tag has an xml:id assigned
		$xml->formatOutput = true;
		// save the xml w/ids so that they can be output to a file for DB loading
		$processedXML = $xml->saveXML();
		
		// set up a base name for the $file (to which "_orig.xml" will be added)
		// note: could be $fullName or $file variable, since basename() grabs just what it needs.
		$baseFN = basename($file, ".xml"); 
		// move the original file to an 'archive' dir & name
		$origFN = $origPath.$baseFN."_orig.xml";
		copy($fullName, $origFN); 
		
		// Now write the new processed xml to the XML filename (full path)
		$newName = $newPath.$file;
		$processedFile = fopen($newName, 'w+') 
			or die("#ERROR#: Could NOT open file <i>$file</i>");
		fwrite($processedFile, $processedXML);
		
		$filesByTitle[$file] = $uniformTitle;
	}
	
	return $filesByTitle;
}

/* **************************************************************
 * Function:		getUniformTitle
 * @@Inputs:		1) xml from the source xml file
 * 
 * @@Output:		The text value of the <title> tag 
 * 					whose "type" attribute has the "uniform" value
 * 					<title type="uniform"> Hamlet </title>
 * 
 * Dependencies:	Called from genIDs4Files()
 * 					since that processes the xml
* *************************************************************** */
function getUniformTitle(&$xml) {
	
	$uniformTitle = $uniformStmt = '';
	
	$titleTags = $xml->getElementsByTagname("title");
	
	foreach ($titleTags as $title) {
		if (get_class($title) == "DOMElement") {

			$attributes = $title->attributes;
			
			if ($attributes!=null) {
				foreach ($attributes as $att) {
					//echo $att->name." ===> ".$att->value."<br>";
					switch ($att->value) {
						case "uniform":
							$uniformTitle = $title->nodeValue;
							break;
						case "statement":
							$uniformStmt = $title->nodeValue;
							break;
						default:
							break;
					}
				}
			}
		}
	}
	if ($uniformTitle == '') {
		// enusre uniform statement can subsitute for no uniformTitle
		if ($uniformStmt == '') {
			$uniformTitle = "NEED TITLE";
		} else {
			$uniformTitle = $uniformStmt;
		}
	}		
	
	return $uniformTitle;
}

/* **************************************************************
 * Function:		insertFiles
 * @@Inputs:		1) ref to db connection
 * 					2) ** Assoc. Array of files ** index=filename, value=uniformTitle
 * 					3) ** Assoc. Array of repositories
 * 					  (didn't want to include the list in the function
 * 					   in case we need it elsewhere...)
 * 
 * @@Output:		Inserts new entries into the database
 * 
 * Dependencies:	Need php to have the mysqli modules loaded
 * 					for database processing
* *************************************************************** */
function insertFiles(&$cnxn, $files, $repos) {
	
	$ham=$year=$stc=$repo=$copyNum=$uniformTitle=$baseFN=$origFN='';
	$count = 0;
	 
	$insertQuery = "INSERT into files(orig_fn, proc_fn, year, stc_number, repository, uniform_title, copy_number)"
					." VALUES(?,?,?,?,?,?,?)";

	if ($insert = $cnxn->prepare($insertQuery)) {		
		echo "Good prep.<br>";
	} else { 
		echo "###TILT TILT####<br>ERROR on prepp'ing Query: ".$insertQuery."<br>###ABORT ABORT###<br>";
	}


	foreach ($files as $file=>$uniformTitle) {
	
		$f_id = fidExists($cnxn, $file);
		if ($f_id == 0) {
			$count++;
			$baseFN = basename($file, ".xml");
			$origFN = $baseFN."_orig.xml";
			list($ham, $year, $stc, $repo, $copyNum) = split('-', $baseFN);
			$repository = $repos[$repo];
			$copyNum = preg_replace('/^c/','',$copyNum);
			echo $origFN.": ".$file.": ".$year.": ".$stc.": ".$repository.": ".$uniformTitle.": ".$copyNum."<br>";

			$insert->bind_param('sssssss',$origFN, $file, $year, $stc, $repository, $uniformTitle, $copyNum);
			$insert->execute()
				or die ("ERROR: could NOT EXEcute files Update Stmt".$updateQuery."<br>");
	
		} else {
			echo "FID:".$f_id."<br>";
			// ***TODO: setup process to alert whether a file
			// ***		may have already been inserted and come back
			// *** 		depending on whether it has been loaded
			echo "HAVE TO REMOVE STUFF for this file...<br>";
			echo " THEN have to insert the file info as though it were new<br>";
		}
	}
	
	$insert->close();
	return $count;
	
} // end insertFiles

/* **************************************************************
 * Function:		loadFiles [ ** OLD ** ]
 * @@Inputs:		1) ref to db connection
 * 					2) list of files to load
 * 
 * @@Output:		Loads <files> table in quartos/plays database
 * 					with the names of all processed* XML files
 * 					*processed=all tags have xml:id (generateId)
 * 
 * Dependencies:	calls fidExists() and insertFile() 
 * 					from the dbStuff.php lib to take care
 * 					of all insertions
 * *************************************************************** */
function loadFiles($fileList, &$cnxn) {
	$count = 0; // count of files inserted
	
	foreach ($fileList as $file) {
		
		$baseFN = basename($file, ".xml");
		$origFN = $baseFN."_orig.xml";
		
		echo $file."<br>";
		echo "ORIG: ".$origFN."<br>";		
		
		$f_id = fidExists($cnxn, $file);
		if ($f_id == 0) {
			$f_id = insertFile($cnxn, $origFN, $file);
			$count++;
		} else {
			echo "FID:".$f_id."<br>";
			// ***TODO: setup process to alert whether a file
			// ***		may have already been inserted and come back
			// *** 		depending on whether it has been loaded
			echo "HAVE TO REMOVE STUFF for this file...<br>";
			echo " THEN have to insert the file info as though it were new<br>";
		}
	}
	
	return $count;
}

?>
