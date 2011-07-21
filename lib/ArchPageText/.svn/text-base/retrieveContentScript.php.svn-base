<?php
/**
 * Performing XSLT through PHP rather than Javascript
 * 
 */

if(isset($_GET['xsluri'])&&isset($_GET['xmluri'])){
	$pt=new XMLConstructor();
	$pt->setXMLURI($_GET['xmluri']);
	$pt->setXSLURI($_GET['xsluri']);
	$pt->XMLtoHTML();
	
	//processXML($_GET['xsluri'],$_GET['xmluri']);
}

class XMLConstructor{
	public $xmluri="";
	public $xsluri="";
	private $dom;
	private $xsl;
	private $output;
	
	public function setXMLURI($xml){
		$this->xmluri=$xml;
	}
	public function setXSLURI($xsl){
		$this->xsluri=$xsl;
	} 
	
	public function XMLtoHTML(){
		if((strlen($this->xmluri)>0)&&(strlen($this->xsluri)>0)){
			
			//get xml
			$this->dom=new DOMDocument();
			$this->dom->load($this->xmluri);//loading from file
			
			//get xsl
			$temp=new DOMDocument();
			$temp->load($this->xsluri);
			$this->xsl=new XSLTProcessor();
			$this->xsl->importStyleSheet($temp);
			
			$this->output=$this->xsl->transformToXML($this->dom);
			echo (strlen($this->output)>0)?$this->output:"<div>Sorry, no transcript available.</div>";
		}
	}
}





?>