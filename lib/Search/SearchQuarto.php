<?php
//Old functions
/***
 * Echo out the results from given search terms
 * and search mode
 */
function getResults(){
	$terms=$_GET['terms'];
	
	$lim=null;

	
	if(isset($_SESSION['setLimit'])){
		
		$fromList="";
		$whereList="";
		$data=split("\n", $_SESSION['setLimit']);
		for($tok=0;$tok<count($data);$tok++){
			$record=split(',', $data[$tok]);
			
			switch($record[0]){
				case 'speaker':
					if(!strpos($fromList, 'speakers')){
						$fromList.=", speakers";
						$whereList.="AND speakers.f_id=files.f_id AND speakers.sp_id='".mysql_real_escape_string($record[1])."' ";
					} else {
						$whereList.="OR speakers.sp_id=".mysql_real_escape_string($record[1])." ";
					}
					break;
				case 'act':
					break;
				case 'quarto':
					//temporary short-circuit (we only have one quarto on file)
				//	if($record[1]=='4'){
						$whereList.='AND files.f_id='.mysql_real_escape_string($record[1])." ";
				//	}
					break;
			}
		}
		$qry="SELECT words.w_id, word_fid_rel.w_count, files.f_id, files.proc_fn
		FROM words, word_fid_rel, files".$fromList.
		" WHERE words.w_id=word_fid_rel.w_id AND files.f_id=word_fid_rel.f_id ".$whereList."AND CONVERT(words.w_word USING latin1) COLLATE latin1_swedish_ci LIKE '".mysql_real_escape_string($terms)."';";
		
		
		$result=mysql_query($qry);
		
		
		while($row=mysql_fetch_assoc($result)){
			echo "<br/><br/>";
			getTextPortion($row);
			
		}


	} else if(!isset($_SESSION['setLimit'])){
		$qry=sprintf("SELECT words.w_id, word_fid_rel.w_count, files.f_id, files.proc_fn
		FROM words, word_fid_rel, files 
		WHERE words.w_id=word_fid_rel.w_id AND files.f_id=word_fid_rel.f_id AND CONVERT(words.w_word USING latin1) COLLATE latin1_swedish_ci='%s' GROUP BY words.w_id;",
			mysql_real_escape_string($terms)
		);
		
		$result=mysql_query($qry);
		
		while($row=mysql_fetch_assoc($result)){
			
			getTextPortion($row);
		}	
	}
}

/***
 * Retrieve 10 characters back and front
 * of the search word
 * @return 
 * @param $data Object
 * @param $offset Object
 */
function getTextPortion($row){
	
	// This query will get the w_ids for the w_words that match the search term, but not the w_ids for the 
	// surrounding words in this milestone/ms_id
	$qry=sprintf("SELECT ms_word_f_rel.w_id, ms_word_f_rel.ms_id, tags.tag_name, ms_word_f_rel.w_pos, ms_word_f_rel.end_ms_id
	FROM ms_word_f_rel INNER JOIN tags ON ms_word_f_rel.ms_id=tags.tag_id
	WHERE ms_word_f_rel.f_id=tags.f_id AND ms_word_f_rel.f_id='%s' AND ms_word_f_rel.w_id='%s' AND tags.tag_name='pb';",
		mysql_real_escape_string($row['f_id']),
		mysql_real_escape_string($row['w_id'])
	);
	
	$nResult=mysql_query($qry);
	
	$nRow=mysql_fetch_assoc($nResult);
	
	//first, find the page ID for the milestone in which this word is in
	$qry=sprintf("SELECT tags.xml_id FROM tags WHERE tags.tag_id='%s';",
		mysql_real_escape_string($nRow['ms_id'])
	);
	
	$nResult=mysql_query($qry);
	
	$xRow=mysql_fetch_assoc($nResult);
	$pageId= substr($xRow['xml_id'],-4);
	
	/* **** TODO: FOREACH of the rows of the result, get the w_pos for the w_id,
	 * **** AND get the w_ids for all those rows within that w_pos range
	 * **** Need to check if the w_pos>10 for that w_id, get the w_pos-10 and w_pos+10 (else, use the lowest w_pos for that milestone)
	 * **** Once you get the w_ids for all those rows within that w_pos range, you get the w_words 
	 * **** for those w_ids and ORDER by w_pos....
	 * */
	
	//Now, get 10 characters front and back for the word
	$begin=intval($nRow['w_pos'])-10;
	$end=intval($nRow['w_pos'])+10;
	
	$qry=sprintf("SELECT DISTINCT words.w_word, ms_word_f_rel.w_id, ms_word_f_rel.ms_id, ms_word_f_rel.f_id, ms_word_f_rel.w_pos, ms_word_f_rel.end_ms_id
	FROM ms_word_f_rel INNER JOIN words ON ms_word_f_rel.w_id=words.w_id
	WHERE ms_word_f_rel.f_id='%s' AND ms_word_f_rel.ms_id='%s' AND ms_word_f_rel.end_ms_id='%s'
	AND ms_word_f_rel.w_pos>%s AND ms_word_f_rel.w_pos<%s ORDER BY ms_word_f_rel.w_pos ASC;",
		mysql_real_escape_string($row['f_id']),
		mysql_real_escape_string($nRow['ms_id']),
		mysql_real_escape_string($nRow['end_ms_id']),
		mysql_real_escape_string($begin),
		mysql_real_escape_string($end)
	);
	
	$nResult=mysql_query($qry);
	
	
	$quote="";
	while($nRow=mysql_fetch_assoc($nResult)){
		$quote.=$nRow['w_word']." ";
	}

	echo $row['w_id'].'%'.$quote.'%'.$row['w_count'].'%'.$row['proc_fn'].'%'.$pageId."\n";
	
}



?>

<?php



/***
 * SearchQuarto.php
 * 
 * For retrieving and sending data to the 
 * Archie database for searching all the quartos
 * or specific quarto(s)
 */

include_once('../../Global_Files/remoteCalling.php');


handle_header();

function handle_header(){
	$type=$_GET['type'];
	switch($type){
		case 'getQuartos':
			getQuartoList();
			break;
		case 'getResults':
			getResults();
			break;
		case 'getSpeakers':
			getSpeakers();
			break;
		case 'getPhrase':
			$w1 = $_GET['w1'];
			$w2 = $_GET['w2'];
			getPhrase($w1, $w2);
			break;
	}
}


/**
 * retrieve a possible match for a 
 * phrase
 * 
 * takes two words
 */
function getPhrase($w1, $w2){
	if(!isset($_SESSION['vars'])){
		$qry=sprintf("SELECT words.w_id, word_fid_rel.w_count, files.f_id, files.proc_fn
		FROM words, word_fid_rel, files 
		WHERE words.w_id=word_fid_rel.w_id AND files.f_id=word_fid_rel.f_id AND CONVERT(words.w_word USING latin1) COLLATE latin1_swedish_ci='%s' GROUP BY words.w_id;",
			mysql_real_escape_string($w1)
		);
		
		$resultw1 = mysql_query($qry);
		
		$qry=sprintf("SELECT words.w_id, word_fid_rel.w_count, files.f_id, files.proc_fn
		FROM words, word_fid_rel, files 
		WHERE words.w_id=word_fid_rel.w_id AND files.f_id=word_fid_rel.f_id AND CONVERT(words.w_word USING latin1) COLLATE latin1_swedish_ci='%s' GROUP BY words.w_id;",
			mysql_real_escape_string($w2)
		);
		
		$resultw2 = mysql_query($qry);
		
		$success1 = mysql_num_rows($resultw1);
		$success2 = mysql_num_rows($resultw2);
		if(($success1>0) && ($success2>0)){ //matches for both words found
			/*
while($row1 = mysql_fetch_assoc($resultw1)){
				echo $row1['w_id'].'%'.$row1['f_id']."<br/><br/>";
			}
			while($row2 = mysql_fetch_assoc($resultw2)){
				echo $row2['w_id'].'%'.$row2['f_id']."<br/><br/>";
			}
*/
			$row2 = mysql_fetch_assoc($resultw2);
			while($row1 = mysql_fetch_assoc($resultw1)){
			
		
				$qry=sprintf("SELECT ms_word_f_rel.w_id, ms_word_f_rel.ms_id, tags.tag_name, ms_word_f_rel.w_pos, ms_word_f_rel.end_ms_id
					FROM ms_word_f_rel INNER JOIN tags ON ms_word_f_rel.ms_id=tags.tag_id
					WHERE ms_word_f_rel.f_id=tags.f_id AND ms_word_f_rel.f_id='%s' AND ms_word_f_rel.w_id='%s' AND ms_word_f_rel.w_id='%s' AND tags.tag_name='pb';",
					mysql_real_escape_string($row1['f_id']),
					mysql_real_escape_string($row1['w_id']),
					mysql_real_escape_string($row2['w_id'])
				);
				
				$ret=mysql_query($qry);echo $qry."<br/><br/>";
				if(mysql_num_rows($ret)){
					echo "h";
				}
			}
		}
	}
}

/***
 * Echo out a list of the filenames for 
 * Quartos
 * @return 
 */
/*
function getQuartoList(){
	//return a full list of speakers
	$qry="SELECT files.* FROM files ORDER BY files.f_id;";
	$result=mysql_query($qry);
	
	while($row=mysql_fetch_assoc($result)){
		echo $row['f_id'].','.$row['filename'].'-';
	}
}
*/
/***
 * Retrieve list of speakers
 * 
 * @return 
 */
 /*
function getSpeakers(){
	$lim=(isset($_GET['lim'])) ? $_GET['lim'] : null;
	if(is_null($lim)){
		$qry="SELECT speakers.sp_id, key2speakers.spkr_name FROM speakers, key2speakers WHERE speakers.who=key2speakers.who GROUP BY speakers.sp_id;";
		$result=mysql_query($qry);
		while($row=mysql_fetch_assoc($result)){
			echo $row['sp_id'].'%'.$row['spkr_name'].'-';
		}
	} else {
		
	}
	
}

*/
/***
 * Echo out the results from given search terms
 * and search mode
 */
function getResults(){
	$terms=$_GET['terms'];
	
	$lim=null;

	
	if(isset($_SESSION['setLimit'])){
		
		$fromList="";
		$whereList="";
		$data=split("\n", $_SESSION['setLimit']);
		for($tok=0;$tok<count($data);$tok++){
			$record=split(',', $data[$tok]);
			
			switch($record[0]){
				case 'speaker':
					if(!strpos($fromList, 'speakers')){
						$fromList.=", speakers";
						$whereList.="AND speakers.f_id=files.f_id AND speakers.who='".mysql_real_escape_string($record[1])."' ";
					} else {
						$whereList.="OR speakers.who=".mysql_real_escape_string($record[1])." ";
					}
					break;
				case 'act':
					break;
				case 'quarto':
					//temporary short-circuit (we only have one quarto on file)
				//	if($record[1]=='4'){
						$whereList.='AND files.f_id='.mysql_real_escape_string($record[1])." ";
				//	}
					break;
			}
		}
		$qry="SELECT words.w_id, word_fid_rel.w_count, files.f_id, files.proc_fn
		FROM words, word_fid_rel, files".$fromList.
		" WHERE words.w_id=word_fid_rel.w_id AND files.f_id=word_fid_rel.f_id ".$whereList."AND CONVERT(words.w_word USING latin1) COLLATE latin1_swedish_ci LIKE '".mysql_real_escape_string($terms)."';";
		
		
		$result=mysql_query($qry);
		
		
		while($row=mysql_fetch_assoc($result)){
		
			getTextPortion($row);
			
		}


	} else if(!isset($_SESSION['setLimit'])){
		//$termAlter=strtoupper(substr($terms,0,1)).substr($terms,1);
		
		$qry=sprintf("SELECT words.w_id, word_fid_rel.w_count, files.f_id, files.proc_fn
		FROM words, word_fid_rel, files 
		WHERE words.w_id=word_fid_rel.w_id AND files.f_id=word_fid_rel.f_id AND CONVERT(words.w_word USING latin1) COLLATE latin1_swedish_ci='%s' GROUP BY words.w_id;",
			mysql_real_escape_string($terms)
		);
	
		$result=mysql_query($qry);
		
		while($row=mysql_fetch_assoc($result)){
			
			getTextPortion($row);
		}	
	}
}

/***
 * Retrieve 10 characters back and front
 * of the search word
 * @return 
 * @param $data Object
 * @param $offset Object
 */
function getTextPortion($row){
	//constant value for all libraries in system
		$libraries=array('hun'=>"Huntington Library", 
		'bod'=>'Bodlein Library',
		'fol'=>'Folger Library',
		'bli'=>'British Library');
		
	$qry=sprintf("SELECT ms_word_f_rel.w_id, ms_word_f_rel.ms_id, tags.tag_name, ms_word_f_rel.w_pos, ms_word_f_rel.end_ms_id
	FROM ms_word_f_rel INNER JOIN tags ON ms_word_f_rel.ms_id=tags.tag_id
	WHERE ms_word_f_rel.f_id=tags.f_id AND ms_word_f_rel.f_id='%s' AND ms_word_f_rel.w_id='%s' AND tags.tag_name='pb';",
		mysql_real_escape_string($row['f_id']),
		mysql_real_escape_string($row['w_id'])
	);
	
	$nResult=mysql_query($qry);
	
	while($nRow=mysql_fetch_assoc($nResult)){
	
		//first, find the page ID for the milestone in which this word is in
		$qry=sprintf("SELECT tags.xml_id FROM tags WHERE tags.tag_id='%s';",
			mysql_real_escape_string($nRow['ms_id'])
		);
		
		$n2Result=mysql_query($qry);
		
		$xRow=mysql_fetch_assoc($n2Result);
		$pageId= substr($xRow['xml_id'],-4);
		
		//Now, get 10 characters front and back for the word
		$begin=intval($nRow['w_pos'])-10;
		$end=intval($nRow['w_pos'])+10;
		
		$qry=sprintf("SELECT DISTINCT words.w_word, ms_word_f_rel.w_id, ms_word_f_rel.ms_id, ms_word_f_rel.f_id, ms_word_f_rel.w_pos, ms_word_f_rel.end_ms_id
		FROM ms_word_f_rel INNER JOIN words ON ms_word_f_rel.w_id=words.w_id
		WHERE ms_word_f_rel.f_id='%s' AND ms_word_f_rel.ms_id='%s' AND ms_word_f_rel.end_ms_id='%s'
		AND ms_word_f_rel.w_pos>%s AND ms_word_f_rel.w_pos<%s ORDER BY ms_word_f_rel.w_pos ASC;",
			mysql_real_escape_string($row['f_id']),
			mysql_real_escape_string($nRow['ms_id']),
			mysql_real_escape_string($nRow['end_ms_id']),
			mysql_real_escape_string($begin),
			mysql_real_escape_string($end)
		);
		
		$n2Result=mysql_query($qry);
		
		
		$quote="";
		while($qRow=mysql_fetch_assoc($n2Result)){
			$quote.=$qRow['w_word']." ";
		}
		
		
		$listItemData = split('-', $row['proc_fn']);
		
		$play = ($listItemData[0]=='ham') ? "Hamlet" : "Unknown Play";
		$year = $listItemData[1];
		$STC = "STC: ".substr($listItemData[2], 0, -1);
		$lib = $libraries[$listItemData[3]];
		
		$cn = str_replace('.xml', '', $listItemData[4]);
		
		$copyNo = "Copy ".substr($cn, -1);
		$lifData = $play.", ".$year.', '.$STC.', '.$lib.', '.$copyNo;
		
		echo $row['w_id'].'%'.$quote.'%'.$row['w_count'].'%'.$row['proc_fn'].'%'.$pageId.'%'.$lifData."\n";
	}
}
?>