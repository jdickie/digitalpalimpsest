/**
 * Created for Text Annotations in PageText.js
 * 
 * Deprecated as of March 2009
 * @param {Object} o
 */
ArchiePanel.prototype.createTextAnno= function(o){
				
				id = o.responseText;
				node1=o.argument.node1;
				node2=o.argument.node2;
				child1=o.argument.childstart;
				child2=o.argument.childend;
				panel = o.argument.panel;
				endNode = o.argument.endNode;
				offset2 = o.argument.offset2;
				
				if (endNode) {
					start = endNode.nodeValue.substring(0, offset2);
					end = endNode.nodeValue.substring(offset2);
					newEnd = document.createTextNode(end);
					values = {node1: node1, node2: node2, offset2: offset2, child1: child1, child2: child2, doc: panel.documentId};
					markerObj = new AnnotationMarker("*", "fn" + id, values);
					marker = markerObj.HTML;
					newStart = document.createTextNode(start);
					par = endNode.parentNode;
					
					par.replaceChild(newEnd, endNode);
					par.insertBefore(marker, newEnd);
					par.insertBefore(newStart, marker);
					markerObj.showNote.subscribe(panel.showNote, panel);
					markerObj.delFire.subscribe(panel.deleteNote, panel);
				}
}