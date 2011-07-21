<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />
        <title>Archimedes Administrator</title>
		<link rel="stylesheet" type="text/css" href="./assets/annocontrol.css"/>
		
		<script src="../yui270/build/yuiloader/yuiloader-min.js"></script>
		<script src="../yui270/build/event/event-min.js"></script>
		<script type="text/javascript">
			window.onload=function(){
				YAHOO.namespace("quartos");
				Archie = YAHOO.quartos;
				var loader = new YAHOO.util.YUILoader({
	
				    // Identify the components you want to load.  Loader will automatically identify
				    // any additional dependencies required for the specified components.
				    require: ["dom","container","dragdrop","connection","resize","menu"],
				
				    // Configure loader to pull in optional dependencies.  For example, animation
				    // is an optional dependency for slider.
				    loadOptional: true,
					
				    // The function to call when all script/css resources have been loaded
				    onSuccess: function() {
						var control=new AnnoControl();
							       //this is your callback function; you can use
				        //this space to call all of your instantiation
				        //logic for the components you just loaded.
						//CustomEvent for Creating Windows
						
						
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
			}
			
		</script>
		<script type="text/javascript" src="./AnnotationController.js"></script>
	</head>
	
	<body>
		<h1>Archimedes Administrator</h1>
		<div id="upper"><h3>Switch View:</h3><a href="./recentAnnoControl.php">Recent Annotations</a></div>
		<div id="main"></div>
	</body>	
</html>