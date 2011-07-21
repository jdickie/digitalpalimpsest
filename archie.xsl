<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet
  exclude-result-prefixes="xd exsl estr edate a fo local rng tei teix"
  extension-element-prefixes="exsl estr edate" version="1.0"
  xmlns:a="http://relaxng.org/ns/compatibility/annotations/1.0"
  xmlns:edate="http://exslt.org/dates-and-times"
  xmlns:estr="http://exslt.org/strings" xmlns:exsl="http://exslt.org/common"
  xmlns:fo="http://www.w3.org/1999/XSL/Format"
  xmlns:html="http://www.w3.org/1999/xhtml"
  xmlns:local="http://www.pantor.com/ns/local"
  xmlns:rng="http://relaxng.org/ns/structure/1.0"
  xmlns:tei="http://www.tei-c.org/ns/1.0"
  xmlns:teix="http://www.tei-c.org/ns/Examples"
  xmlns:xd="http://www.pnp-software.com/XSLTdoc"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  	
<xsl:output method="html"/>

<xsl:template match="/">
	
	<xsl:apply-templates/>
       
 </xsl:template>
 
 <xsl:template match="//tei:teiHeader">
 	<div style="display:none"><xsl:apply-templates/></div>
</xsl:template>
 
 <xsl:template match="//tei:text">
	<div class="textBlock"><xsl:apply-templates/></div>
  </xsl:template>
  
 <xsl:template match="tei:seg">
 	<xsl:choose>
 		<xsl:when test="contains(@type,'folio')">
 			<div class="folio"><xsl:apply-templates/></div>
 		</xsl:when>
		<xsl:otherwise>
			<div class="line"><xsl:apply-templates/></div>
		</xsl:otherwise>
 	</xsl:choose>
	</xsl:template>
 
 </xsl:stylesheet>