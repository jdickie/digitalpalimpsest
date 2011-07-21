LoginBar = function(loc, regPath){
    this.DOM = document.createElement("div");
    this.DOM.className = "loginForm";
    YAHOO.util.Dom.generateId(this.DOM, "lb_");
    this.infoField = document.createElement("div");
    this.infoField.className = "login_infoField";
    this.infoField.id = YAHOO.util.Dom.generateId(this.infoField, "infoField");
    this.DOM.appendChild(this.infoField);
    this.form = document.createElement("form");
    this.form.id = YAHOO.util.Dom.generateId(this.form, "loginForm");
    this.form.className = "loginForm";
    this.logoutForm = document.createElement("form");
    this.logoutForm.id = YAHOO.util.Dom.generateId(this.logoutForm, "logoutForm");
    this.logoutButton = document.createElement("input");
    this.logoutButton.type = "submit";
    this.logoutButton.value = "Logout";
    this.logoutButton.className = "logout_button";
    this.logoutForm.appendChild(this.logoutButton);
    YAHOO.util.Dom.setStyle(this.logoutButton, "display", "none");
    this.DOM.appendChild(this.logoutForm);
    YAHOO.util.Event.addListener(this.logoutButton, "click", this.setLogout, this);
    this.loggedIn = new YAHOO.util.CustomEvent("loggedIn");
    this.loggedOut = new YAHOO.util.CustomEvent("loggedOut");
    this.stateOpen = new YAHOO.util.CustomEvent("stateopen");
    this.setAlert = new YAHOO.util.CustomEvent("setAlert");
    this.createRegister(this, regPath);
    this.createTextInput(this);
    this.createPasswordInput(this);
    this.createSubmitButton(this);
    this.userIsLoggedIn = false;
    this.createLoginName(this);
    this.DOM.appendChild(this.form);
    //loc.appendChild(this.DOM);
};
LoginBar.prototype = {
    createRegister: function(obj, path){
        obj.register = document.createElement("span");
        obj.register.className = "loginLink";
        obj.registerLink = document.createElement("a");
        obj.registerLink.appendChild(document.createTextNode("Register"));
        obj.registerLink.href = "./register.php";
        obj.register.appendChild(obj.registerLink);
        obj.form.appendChild(obj.register);
    },
    createLoginName: function(obj){
        obj.loginName = document.createElement("span");
        obj.loginName.className = "loginLink";
        YAHOO.util.Dom.setStyle(obj.loginName, "display", "none");
        obj.DOM.appendChild(obj.loginName);
    },
    createTextInput: function(obj){
        obj.text = document.createElement("input");
        obj.text.id = YAHOO.util.Dom.generateId(obj.text, "user");
        obj.text.className = "loginInput";
        obj.text.value = "";
        obj.text.name = "username";
        obj.text.type = "text";
        obj.textLabel = document.createElement("label");
        YAHOO.util.Dom.setStyle(obj.textLabel, "for", obj.text.id);
        obj.textLabel.appendChild(document.createTextNode("Username:"));
        obj.form.appendChild(obj.textLabel);
        obj.form.appendChild(obj.text);
    },
    createPasswordInput: function(obj){
        obj.password = document.createElement("input");
        obj.password.id = YAHOO.util.Dom.generateId(obj.password, "pass");
        obj.password.className = "loginInput";
        obj.password.value = "";
        obj.password.type = "password";
        obj.password.name = "password";
        obj.passwordLabel = document.createElement("label");
        YAHOO.util.Dom.setStyle(obj.passwordLabel, "for", obj.password.id);
        obj.passwordLabel.appendChild(document.createTextNode("Password:"));
        obj.form.appendChild(obj.passwordLabel);
        obj.form.appendChild(obj.password);
        YAHOO.util.Event.addListener(obj.password.id, "click", function(e, obj){
            YAHOO.util.Event.addListener(document, "keypress", obj.handleKeyPress, obj);
        }, obj);
        YAHOO.util.Event.addListener(obj.password.id, "focus", function(e, obj){
            YAHOO.util.Event.addListener(document, "keypress", obj.handleKeyPress, obj);
        }, obj);
        YAHOO.util.Event.addListener(obj.password.id, "blur", function(e, obj){
            YAHOO.util.Event.removeListener(document, "keypress", obj.handleKeyPress);
        }, obj);
    },
    createSubmitButton: function(obj){
        obj.submitButton = document.createElement("input");
        YAHOO.util.Dom.generateId(obj.submitButton, "submit");
        obj.submitButton.value = "Go";
        obj.submitButton.className = "loginSubmit";
        obj.submitButton.type = "button";
        YAHOO.util.Event.addListener(obj.submitButton.id, "click", obj.submitData, obj);
        obj.form.appendChild(obj.submitButton);
    },
    handleKeyPress: function(e, obj){
        if (e.keyCode == 13) {
            obj.submitData(e, obj);
        }
    },
    checkIfUserExists: function(obj){
        var sUrl = "./lib/Workspace/setProperties.php?type=get";
        var callback = {
            success: function(o){
                var obj = o.argument[0];
                var data = o.responseText.split("%");
                var user = "";
                var uID = "";
                var state = "default";
                var openmanifest = null;
                for (i in data) {
                    record = data[i].split(",");
                    switch (record[0]) {
                        case "user":
                            user = record[1];
                            break;
                        case "uID":
                            uID = record[1];
                            break;
                        case "stateopen":
                            state = "open";
                            break;
                        case "manifestopen":
                            openmanifest = record[1];
                            obj.stateOpen.fire(openmanifest);
                            state = "open";
                            break;
                    }
                }
                if ((!(user == "")) && (!(uID == ""))) {
                    obj.loggedIn.fire({
                        user: user,
                        userid: uID,
                        state: state
                    });
                }
                else {
                    obj.loggedIn.fire({
                        user: null,
                        userid: null,
                        state: "default"
                    });
                }
            },
            failure: function(o){
                alert("Server failure while logging in");
            },
            argument: [obj]
        };
        var transact = YAHOO.util.Connect.asyncRequest("GET", sUrl, callback);
        setTimeout(function(){
            if (YAHOO.util.Connect.isCallInProgress(transact)) {
                YAHOO.util.Connect.abort(transact);
            }
        }, 5000);
    },
    submitData: function(e, obj){
        YAHOO.util.Event.stopEvent(e);
        if ((!(obj.password.value == "")) && (!(obj.text.value == ""))) {
            var postData = "username=" + obj.text.value + "&password=" + obj.password.value;
            var sUrl = "./Global_Files/Auth.php";
            var callback = {
                success: function(o){
                    var data = o.responseText.split("%");
                    var obj = o.argument[0];
                    for (i = 0; i < obj.infoField.childNodes.length; i++) {
                        kid = obj.infoField.childNodes[i];
                        obj.infoField.removeChild(kid);
                    }
                    if (data[0] == "False") {
                        obj.infoText = document.createElement("div");
                        obj.infoText.appendChild(document.createTextNode(data[1]));
                        obj.infoField.appendChild(obj.infoText);
                        obj.userIsLoggedIn = false;
                    }
                    else {
                        obj.userIsLoggedIn = true;
                        obj.loggedIn.fire({
                            user: data[1],
                            userid: data[2],
                            state: "open"
                        });
                    }
                },
                failure: function(o){
                    alert("Could not log in due to server error");
                },
                argument: [obj]
            };
            var transact = YAHOO.util.Connect.asyncRequest("POST", sUrl, callback, postData);
        }
    },
    hide: function(e, pass, args){
        YAHOO.util.Dom.setStyle(args.form, "display", "none");
        YAHOO.util.Dom.setStyle(args.register, "display", "none");
        YAHOO.util.Dom.setStyle(args.logoutButton, "display", "block");
        args.userIsLoggedIn = true;
    },
    setLogout: function(e, obj){
        YAHOO.util.Event.preventDefault(e);
        var callback = {
            success: function(o){
                var obj = o.argument[0];
                obj.userIsLoggedIn = false;
                obj.loggedOut.fire();
            },
            failure: function(o){
                var obj = o.argument[0];
                obj.setAlert("Sorry! Failure to Connect to server - try logging out again.");
            },
            argument: [obj]
        };
        var sUrl = "./Global_Files/logout.php";
        var postData = "logout=true";
        var transact = YAHOO.util.Connect.asyncRequest("POST", sUrl, callback, postData);
    }
};
