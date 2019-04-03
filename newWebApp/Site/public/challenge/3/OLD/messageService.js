//
// this must match the robox app that interfaces to the bled112 dongle
//
var chromeAppID = "jeamalbnbjiiljceaaghddgiohpahiib";

function ping() {
    chrome.runtime.sendMessage(chromeAppID,
			       { command: "ping" },
			       function(response) {
				   console.log(response);
			       }
			      );
}

function info() {
    chrome.runtime.sendMessage(chromeAppID,
			       { command: "info" },
			       function(response) {
				   console.log(response);
			       }
			      );
}

function scan() {
    chrome.runtime.sendMessage(chromeAppID,
			   { command: "scan" },
			       function(response) {
				   console.log(response);
			       }
			      );
}

function connect() {
    chrome.runtime.sendMessage(chromeAppID,
			   { command: "connect" },
			       function(response) {
				   console.log(response);
			       }
			      );
}
