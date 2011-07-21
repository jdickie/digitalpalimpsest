/***
 * openScreen.js
 * 
 * Developing interface for loading 
 * project/exhibit windows and crop
 * portions and then displaying them
 * 
 * Sets an OnDomReady method
 */



// Instantiate and configure Loader:
var loader = new YAHOO.util.YUILoader({

    // Identify the components you want to load.  Loader will automatically identify
    // any additional dependencies required for the specified components.
    require: ["dom","container","dragdrop","connection","resize","menu"],

    // Configure loader to pull in optional dependencies.  For example, animation
    // is an optional dependency for slider.
    loadOptional: true,

    // The function to call when all script/css resources have been loaded
    onSuccess: function() {
        //this is your callback function; you can use
        //this space to call all of your instantiation
        //logic for the components you just loaded.
		
    },

    // Configure the Get utility to timeout after 10 seconds for any given node insert
    timeout: 10000,

    // Combine YUI files into a single request (per file type) by using the Yahoo! CDN combo service.
    combine: true
});

// Load the files using the insert() method. The insert method takes an optional
// configuration object, and in this case we have configured everything in
// the constructor, so we don't need to pass anything to insert().
loader.insert();

// Setup constants
// QUIRKS FLAG, FOR BOX MODEL
var IE_QUIRKS = (YAHOO.env.ua.ie && document.compatMode == "BackCompat");
// UNDERLAY/IFRAME SYNC REQUIRED
var IE_SYNC = (YAHOO.env.ua.ie == 6 || (YAHOO.env.ua.ie == 7 && IE_QUIRKS));
// PADDING USED FOR BODY ELEMENT (Hardcoded for example)
var PANEL_BODY_PADDING = (10*2) // 10px top/bottom padding applied to Panel body element. The top/bottom border width is 0

YAHOO.util.Event.onDOMReady(function(){
	YAHOO.namespace("quartos");
	Archie = YAHOO.quartos;
	var desktop=null;
	var callback = {
		success: function(o){
			
			desktop = o.argument[0];
		
			desktop = new Archie.workspace("workspace", o.responseText);
			
			desktop.login.checkIfUserExists(desktop.login);
	
		},
		failure: function(o){
			
		},
		argument: [desktop]
	}
	YAHOO.util.Connect.asyncRequest("GET", "./Global_Files/findDomain.php", callback);
	
});
