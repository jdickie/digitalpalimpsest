Archie.ButtonGroup = function(labelText, buttonArray, className){
    this.DOM = document.createElement("div");
    this.DOM.className = className;
    YAHOO.util.Dom.generateId(this.DOM, "ButtonGroup");
    this.textLabelSpan = document.createElement("span");
    this.textLabelSpan.className = "textLabelSpan";
    this.textLabelSpan.appendChild(document.createTextNode(labelText));
    this.DOM.appendChild(this.textLabelSpan);
    for (i = 0; i < buttonArray.length; i++) {
        this.DOM.appendChild(buttonArray[i].DOM);
    }
};
