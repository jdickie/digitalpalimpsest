<?php
/**
 * sessionWindowMgr
 * 
 * Manages open window states - makes sure
 * user state is preserved during SESSION 
 * runtime
 */

include_once('../../Global_Files/remoteCalling.php');

//to erase all incoming messages from register/elsewhere
if(isset($_SESSION['message'])){
	$_SESSION['message']="";
}

handle_header();

function handle_header(){
	if($_SESSION['uID']){
		$mode = $_GET['mode'];
		switch($mode){
			case 'set':
				$type=$_GET['type'];
				$id=$_GET['id'];
				setItem($type, $id);
				break;
			case 'get':
				displayState();
				break;
			case 'reset':
				resetState();
				break;
			case 'remove':
				removeItem($_GET['type']);
				break;
		}
	}
}

function resetState(){
	$state=$_SESSION['uID']."_statearchimedes";
	if(isset($_SESSION[$state])){
		$_SESSION[$state]="";
	}	
}

function removeItem($type){
	//constant value for all libraries in system
$libraries=array('hun'=>"Huntington Library", 
'bod'=>'Bodlein Library',
'fol'=>'Folger Library',
'bli'=>'British Library');
	$state=$_SESSION['uID']."_statearchimedes";
	if(isset($_SESSION[$state])){
		switch($type){
			case 'win':
				$id=$_GET['id'];
				if(substr_count($_SESSION[$state],$id)>0){
					//is in state variable
					$fullArray=split("\n",$_SESSION[$state]);
					if(count($fullArray)>1){
						for($x=0;$x<count($fullArray);$x++){
							$temp=$fullArray[$x];
							
							if(substr_count($temp,$id)>0){
								$fullArray[$x]="";
								$_SESSION[$state]=implode("\n",$fullArray);
								break;
							}
						}
					} else {
						echo 'reset';
						$_SESSION[$state]="";	
					}
					
					echo $_SESSION[$state];
				}
				break;
			case 'crop':
				$id=$_GET['id'];
				if(substr_count($_SESSION[$state],$id)>0){
					
					$fullArray=split("\n",$_SESSION[$state]);
					if(count($fullArray)>1){
						
						for($x=0;$x<count($fullArray);$x++){
							$temp=$fullArray[$x];
							
							if(substr_count($temp,$id)>0){
								$fullArray[$x]="";
								$_SESSION[$state]=implode("\n",$fullArray);
								break;
							}
						}
						
					} else {
						echo "reset";
						$_SESSION[$state]="";
					}
				}
				break;
			case 'label':
				$id=$_GET['id'];
				if(substr_count($_SESSION[$state],$id)>0){
					
					$fullArray=split("\n",$_SESSION[$state]);
					if(count($fullArray)>1){
						
						for($x=0;$x<count($fullArray);$x++){
							$temp=$fullArray[$x];
							
							if(substr_count($temp,$id)>0){
								$fullArray[$x]="";
								$_SESSION[$state]=implode("\n",$fullArray);
								break;
							}
						}
						
					} else {
						echo "reset";
						$_SESSION[$state]="";
					}
				}
				break;
				
		}
	}	
			
}


function setItem($type, $id){
	
	//constant value for all libraries in system
$libraries=array('hun'=>"Huntington Library", 
'bod'=>'Bodlein Library',
'fol'=>'Folger Library',
'bli'=>'British Library');
	
	$state=$_SESSION['uID']."_statearchimedes";
	switch($type){
		case 'win':
			if(($_GET['manifest'])){
				$proc = strpos($_GET['manifest'], 't/');
				$procFn = substr($_GET['manifest'], $proc+2);
				$procFn = split('-', $procFn);
				$pageNum=$procFn[0];
				$project = $_GET['project'];
				
				$sessionString=$type."%".$id."%".$_GET['manifest']."%".$_GET['x']."%".$_GET['y']."%".$_GET['width']."%".$_GET['height']."%".$_GET['page']."%".stripslashes($_GET['bibInfo'])."%".$project."%".$_GET['zoom']."%".$_GET['center']."%".$_GET['order']."\n";
				if(isset($_SESSION[$state])&&(strlen($_SESSION[$state])>0)){
					//check if item exists
					$arr = split("\n", $_SESSION[$state]);
					$found=false;
					for($x=0;$x<count($arr);$x++){
						$c = split('%',$arr[$x]);
						if($c[1]==$id){
							$arr[$x]=$sessionString;
							$found=true;
							break;
						}
					}
					if($found){
						$_SESSION[$state] = implode("\n",$arr);	
					} else {
						$_SESSION[$state].=$sessionString;
					}
				} else {
					$_SESSION[$state]=$sessionString;
				}
				echo $_SESSION[$state];
			}
			break;
		case 'crop':
			
			//all elements present
			$id = $_GET['id'];
			$src = $_GET['src'];
			$srcx = $_GET['srcx'];
			$srcy = $_GET['srcy'];
			$srcw = $_GET['srcw'];
			$srch = $_GET['srch'];
			$origw = $_GET['origw'];
			$origh = $_GET['origh'];
			$c_left=$_GET['c_left'];
			$c_top=$_GET['c_top'];
			$sessionString=$type."%".$id."%".$src."%".$srcx."%".$srcy."%".$srcw."%".$srch."%".$origw."%".$origh."%".$c_left."%".$c_top."\n";
			$state=$_SESSION['uID']."_statearchimedes";
			if(strlen($_SESSION[$state])>0){
				$arr = split("\n", $_SESSION[$state]);
				$found=false;
				for($x=0;$x<count($arr);$x++){
						$c = split('%',$arr[$x]);
						if(!($c[0]=="")){
							if($c[1]==$id){
								$arr[$x]=$sessionString;
								$found=true;
								break;
							}
						}
					}
					if($found){
						$_SESSION[$state] = implode("\n",$arr);	
					} else {
						$_SESSION[$state].=$sessionString;
					}
				} else {
					$_SESSION[$state]=$sessionString;
				}
				echo $_SESSION[$state];
				break;
			case 'label':
				$id=$_GET['id'];
				$x=intval($_GET['x']);
				$y=intval($_GET['y']);
				$text=trim($_GET['text'],"%");
				$width=intval($_GET['width']);
				$height=intval($_GET['height']);
				$key="label%".$id.'%'.$x.'%'.$y.'%'.$text.'%'.$width.'%'.$height."\n";
				$state=$_SESSION['uID']."_statearchimedes";
				//echo "substr count of $id: ".substr_count($_SESSION[$state],$id)."<Br/><br/>";
				if(substr_count($_SESSION[$state],$id)>0){
					$arr=split("\n",$_SESSION[$state]);
					$found=false;
					for($l=0;$l<count($arr);$l++){
						$record=split("%",$arr[$l]);
						if($record[0]=="label"){
							if($record[1]==$id){
								$arr[$l]=$key;
								$found=true;
								break;
							}
						}
					}
					if($found){
						$_SESSION[$state] = implode("\n",$arr);	
					} else {
						$_SESSION[$state].=$key; 
					}
					
				} else {
					$_SESSION[$state].=$key;
				}
				
				break;
			
			
			}
			
}

/**
 * Display the state
 * 
 * Called from GET request
 * by stateMgr
 */
function displayState(){
	//display only the users state?
	$state=$_SESSION['uID']."_statearchimedes";
	if(isset($_SESSION[$state])&&(strlen($_SESSION[$state])>0)){
		echo stripslashes($_SESSION[$state]);
	}
}


?>