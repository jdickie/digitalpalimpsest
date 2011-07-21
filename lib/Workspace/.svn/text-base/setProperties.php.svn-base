<?php
/***
 * setProperties.php
 * 
 * Tells workspace which project,
 * annotation, windows are open
 */

include_once('../../Global_Files/remoteCalling.php');

handleheader();

function handleheader(){
	$type=$_GET['type'];
	if($type=='get'){
		getProperties();
	} else if($type=='set'){
		setProperties();
	} else if($type=='panel'){
		setPanelProperty();
	}
}
function getProperties(){
	if(isset($_GET['panel'])){
		echo (isset($_SESSION[$_GET['panel']])) ? $_SESSION[$_GET['panel']] : "";
	} else {
		$state=$_SESSION['uID']."_statearchimedes";$present=false;
		if(isset($_SESSION[$state])){
			if(substr_count($_SESSION[$state],"win")>0){$present=true;}
		}
		if(isset($_SESSION['user'])){echo "user,".$_SESSION['user'];}
		if(isset($_SESSION['uID'])){echo "%uID,".$_SESSION['uID'];}
		if($present){echo "%stateopen";}else{echo "%False";}
		if(isset($_SESSION['project'])){echo "%project,".$_SESSION['project'].'%pID,'.$_SESSION['pID'];}
	}
}

function setProperties(){
	if(isset($_GET['panel'])){
		$panel=$_GET['panel'];
		
		$_SESSION[$panel]=$_GET['name'].','.$_GET['value'];
	} else {
		$name=$_GET['name'];
		$value=$_GET['value'];
		$_SESSION[$name]=$value;
		echo $_SESSION[$name];
	}
}

function setPanelProperty(){
	$_SESSION[$_GET['panel']]=$_GET['name'].','.$_GET['value'].'-';
	
}

?>