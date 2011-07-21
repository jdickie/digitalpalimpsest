<?php
/***
 * Set limits for the Limiter search
 * feature
 * 
 * Remove limits (If the 'setLimit' value is
 * initialized)
 */

include_once('../../Global_Files/remoteCalling.php');

setLimits();

function setLimits(){
	$mode=$_GET['mode'];
	$type=$_GET['type'];
	$value=$_GET['value'];
	$name=$_GET['setName'];
	switch($mode){
		case 'set':
			if(isset($_SESSION[$name])){
				if(!(strpos($_SESSION[$name], "$type,$value\n"))){
					$_SESSION[$name].="$type,$value\n";
				} 
			} else if(!isset($_SESSION[$name])){
				$_SESSION[$name]="$type,$value\n";
			}
			break;
		case 'remove':
			if(isset($_SESSION[$name])){
				$_SESSION[$name]=trim($_SESSION[$name]," ");
				$_SESSION[$name]=str_replace("$type,$value\n", " ", $_SESSION[$name]);
				if(substr_count($_SESSION[$name],",")<=0){
					$_SESSION[$name]="";
				}
			}
			break;
		case 'change':
			$oldType=$_GET['oldType'];
			$oldValue=$_GET['oldValue'];
			if(strpos($_SESSION[$name], "$oldType,$oldValue\n")>=0){
				$_SESSION[$name]=str_replace("$oldType,$oldValue\n", "$type,$value\n", $_SESSION[$name]);
				
			}
			break;
		case 'reset':
		
			if(isset($_SESSION[$name])){
				$_SESSION[$name]="";
			}	
			break;
		case 'test':
			echo $_SESSION[$name];
			break;
	}
}

?>