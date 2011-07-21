<?php
//retrieveHTML.php
//Gets HTML file from ./html folder and echos contents


retrieveHTML();

function getFileName($pid) {
		$n = strpos($pid, '0');
		$len = strlen($pid) - $n;
		$page = substr($pid, $n, $len);
		return "page_" . $page . ".html";
	}

function getNextFileName($pid) {
	$n = strpos($pid, '0');
	$len = strlen($pid) - $n;
	$page = substr($pid, $n, $len);
	
	if($n = strpos($page, 'a')) {
	
		$page = substr($page, 0, $n);
		return "page_" . $page . "b.html";
	} else {
		return "page_" . $page . ".html";
	}
	
}
function retrieveHTML() {
	if($_GET['page']) {
		$path = "./HTML_22276/" . getFileName($_GET['page']);
		$npath = "./HTML_22276/" . getNextFileName($_GET['page']);
		
		

		$file = fopen($path, 'r');
		$text = "<div class=\"leaf\">\n
				<div class=\"page1\">\n";
		while(!feof($file)) {	
			$text .= fgets($file, 1024);
		}
		
		
		fclose($file);
		$text .= "</div>\n
			<div class=\"page2\">\n";
		//Attach the next page of text
		//if available
		if($npath != "./html/pbb.html") {
			
			if($file = fopen($npath, 'r')) {
			while(!feof($file)) {	
				$text .= fgets($file, 1024);
			}
			fclose($file);
			} else {
				$text .= "<div class=\"text\"><div class=\"empty\"></div></div>";
			}
		} else {
			$text .= "<div class=\"text\"><div class=\"empty\"></div></div>";
		}
		$text .= "</div>\n
		</div>\n";
		
		//echo text without white space
		echo trim($text);

	} else {
		echo "<div class=\"page1\"><div class=\"empty\"></div></div>\n
		<div class=\"page2\"><div class=\"empty\"></div></div>";
	}
	
}

function retrieve_PHP_HTML($data) {
	$html = html_out($data);
	return $html;
}

function goThrough($text, $idset) {
	
	$noti = 11;
	$notn = $noti + 10;
	
	while($noti<$notn) {
		$data = getthis($text, $idset[$noti], $idset);
		
		$html = retrieve_PHP_HTML($data);
		
		$path = './html/' . getFileName($idset[$noti]);
		$fstream = fopen($path, 'w');
		fwrite($fstream, $html);
		fclose($fstream);
		$noti++;
	}
	echo $noti;
}


?>