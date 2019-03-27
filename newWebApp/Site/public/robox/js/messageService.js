//
// this must match the robox app that interfaces to the bled112 dongle
//

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

// TODO - if the app isn't running, this comes back with a null
//        and some message should be displayed.  Further, it
//        should try every now and then in case someone starts
//        up the app.

msgAppPort = chrome.runtime.connect(chromeAppID);
console.log(msgAppPort);

//   The following implements the RoBox Command Language (RCL) for 
//   talking with the remote RoBox over BLE. HOWEVER, this side
//   of the conversation is meant to be transmitted to the Chrome
//   app, which does the real work.
//

// MESSAGES - are objects that have the following data members,
//            and are the same format coming in/out:
//
//     cmd - A character (string) that is the command to be processed.
//           The Chrome app converted it from a byte to a string.
//
//     length - the length of the incoming command.  Note that
//              the length of the data[] array is equal to this.
//
//     data[] - a data array of simple integers. The Chrome app
//              converted the bytes (including negative numbers)
//              to the int array.

// Anyone can listen for an RCL message, and the format is easy to
// decode. But this routine handles everything for us for now.

msgAppPort.onMessage.addListener(function(msg) { RCL_Incoming(msg); });

//
// RCL_Incoming() - Processes all current RCL incoming commands and
//                  updates the display appropriately.  The current
//                  commands are:
//
//     L - line follow report
//     U - ultrasonic report
//     I - IR hit (includes ID of hitter)
//     S - stop occurred (either naturally or due to stop request)
//     G - incoming name report
//     X - connection dropped (either due to request or otherwise)
//     V - firmware version report
//                  

function RCL_Incoming(msg)
{
    console.log("RCL incoming: %s",msg.cmd);

    switch(msg.cmd) {

    case 'L':              // line follow reading
	RoBoxEvents.dispatch("onLineFollow",msg.data[0]);
	break;

    case 'U':              // ultra sonic reading
	RoBoxEvents.dispatch("onUltraSonic",msg.data[0]);
	break;
	
    case 'I':              // IR hit
	RoBoxEvents.dispatch("onIRHit",[msg.data[0],msg.data[1]]);
	break;
	
    case 'S':             // Program has stopped
	RoBoxEvents.dispatch("onStop");
	break;

    case 'G':             // incoming name report
	var name = "";
	for(var i=0; i < msg.length; i++) {
	    name += String.fromCharCode(msg.data[i]);
	}
	
	RoBoxEvents.dispatch("onNameReport",name);
	break;

    case 'X':             // connection dropped
	RoBoxEvents.dispatch("onDisconnect");
	break;

    case 'C':             // connection established
	RoBoxEvents.dispatch("onConnect",msg.data);   // should be 6 bytes of MAC address
	break;

    case 'V':             // robox firmware version report
	RoBoxEvents.dispatch("onVersionReport",[msg.data[0],msg.data[1]]);  // major,minor number
	break;
    }
}

document.addEventListener('DOMContentLoaded',function() {
    RoBoxEvents.addListener("onConnect",function(mac) { console.log(mac); });
});
