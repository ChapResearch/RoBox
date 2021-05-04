//
// roboxRemoteMode.js
//
//   This file implements all of the "remote mode" stuff.
//
//   "Remote-mode" is the mode where the actual robox is with
//   a mentor somewhere else.  All "local" things that would
//   normally affect your local robox will effect the remote
//   robox. For example, when you press RUN, the run RCL/RXL
//   is sent to the remote robox as opposed to a local one.
//

var roboxRemoteMode = {};     // GLOBAL object for maintaing remote mode

roboxRemoteMode.isOn = false; // feel free to test this variable when needed

//
// .setup() - sets-up "remote-mode" if the right query string was given.
//
roboxRemoteMode.setup = function(searchString)
{
    var params = parseQuery(searchString);
    if(params.hasOwnProperty('remote')) {
	this.isOn = true;
	firebaseInit();
	console.log("remote mode initiated");
    }
}

//
// .connect() - called by roboxConnect, after popping up the scanning selection
//              dialog.  This is used to populate the selection dialog.
//
roboxRemoteMode.connect = function()
{
    if(!this.isOn) {
	return;
    }

    // have a short delay so that the cute "scanning guy" is shown
    // for a bit - because this goes very fast otherwise

    new Promise((res,rej) => setTimeout(res,2000))

    // after waiting for the cosmetic time, get the available sessions
    
	.then(() => this.available())

    // catch the case where there is nothing available
    // TODO - pop-up something when nothing is available

	.catch((error) => { this.connectError(error); throw error; } )

    // otherwise, pop-up the pretty box with the selections
    
	.then((selections) => this.connectSelections(selections));

}

//
// .connectSelections() - populate the robox-select dialog with connection
//                        selections.  These are wired to "move on" once
//                        a selection is made.
//
roboxRemoteMode.connectSelections = function(selections)
{
    var modal = document.getElementById('robox-select');
    var content = document.getElementById('robox-select-content');
    var scanning = document.getElementById('robox-select-scanning');

//    content.style.backgroundColor = "#56daee";

    var html = "";
    for(var i=0; i < selections.length; i++) {
	html += '<div class="robox-select-choice" ';
	html += 'onclick="roboxRemoteMode.connectExecute(\'';
	html += selections[i].mentor + '\',\'';
	html += selections[i].robox + '\')">';
	html += '<table><tr>'
	html += '<td><img width="40px" src="/media/roboxIcon128.png"/></td>';
	html += '<td>';
	html += '<span class="robox-select-choice-name">';
	html += selections[i].mentor;
	html += '</span><br>';
	html += '<span class="robox-select-choice-address">';
	html += selections[i].robox;
	html += '</span>';
	html += '</td></tr></table>';
	html += '</div>';
    }
    html += '<div style="float:clear;"></div>';
    content.innerHTML = html;
}

//
// .connectError() - populate the robox-select dialog with the error
//                   message.
//
roboxRemoteMode.connectError = function(msg)
{
    var modal = document.getElementById('robox-select');
    var content = document.getElementById('robox-select-content');
    var scanning = document.getElementById('robox-select-scanning');

    var html = "";
    html += '<span class="robox-select-close">&times;</span>';
    html += '<div>';
    html += '<img style="margin-left:auto;margin-right:auto;display:block;" '
    html += 'src="media/roboxIcon128.png"/>';
    html += '<p id="robox-select-scanning">';
    html += 'Can\'t find any RoBox!';
    html += '<br>' + msg;
    html += '</p>';
    html += '</div>';

    content.innerHTML = html;
}

//
// .connectExecute() - called by clicking on a selection, initiate the
//                     connection to the specified session.
//
roboxRemoteMode.connectExecute = function(mentor,robox)
{
    firebase.database()
	.ref('/RoBoxRemote/available/'+ mentor + ':' + robox)
	.get()
	.then((snapshot)=> {
	    if(!snapshot.exists()) {
		roboxRemoteMode.connectFailed(mentor,robox);
	    } else {
		roboxRemoteMode.mentor = mentor;
		roboxRemoteMode.robox = robox;
		roboxRemoteMode.password = snapshot.val().password
		roboxRemoteMode.connectInitiate(this.mentor,this.robox,this.password);
	    }
	});
}

roboxRemoteMode.connectFailed = function(mentor,robox)
{
    console.log("connection failed");
}

roboxRemoteMode.connectInitiate = function(mentor,robox,password)
{
    var modal = document.getElementById('robox-select');
    var content = document.getElementById('robox-select-content');
    var scanning = document.getElementById('robox-select-scanning');

    var html = "";
    html += '<span class="robox-select-close">&times;</span>';
    html += '<div>';
    html += '<img style="margin-left:auto;margin-right:auto;display:block;" '
    html += 'src="media/roboxIcon128.png"/>';
    html += '<table id="robox-connect-password-prompt"><tr>';
    html +=    '<td><p class="robox-password-prompt">' + "Mentor:" + '</p></td>';
    html +=    '<td><p class="robox-password-prompt-value">' + mentor + '</p></td>';
    html +=   '</tr><tr>';
    html +=    '<td><p class="robox-password-prompt">' + "RoBox:" + '</p></td>';
    html +=    '<td><p class="robox-password-prompt-value">' + robox + '</p></td>';
    html += '</tr></table>';
    html += '<div id="robox-select-password">';
    html += '<p>Please enter the password<p>';
    html += '<div id="robox-select-password-box">';

    var uponEnterOrClick = "roboxRemoteMode.checkPassword('" + password + "')";
    
    html += '<form onsubmit="' + uponEnterOrClick + '; return false;">';
    html +=   '<input type="text" id="robox-select-password-input"></input>';
    html += '</form>';
    html += '</div>';
    html += '<a id="robox-select-password-ok" onclick="' + uponEnterOrClick + '" class="runButton allButtons">OK</a>';
    html += '</div>';
    html += '</div>';

    content.innerHTML = html;
    
    // TODO - set-up a pinger, so we know that the connection is still live
}

roboxRemoteMode.checkPassword = function(passwordTarget)
{
    var password = document.getElementById('robox-select-password-input').value;

    console.log("checking '" + password + "' against '" + passwordTarget + "'");
    if(password == passwordTarget) {
	this.checkPasswordGood();
    } else {
	this.checkPasswordBad();
    }

    return(false);     // to stop form from doing standard submitting
}

roboxRemoteMode.checkPasswordBad = function(passwordTarget)
{
    var content = document.getElementById('robox-select-content');

    var html = "";
    html += '<span class="robox-select-close">&times;</span>';
    html += '<div>';
    html += '<img style="margin-left:auto;margin-right:auto;display:block;" '
    html += 'src="media/roboxIcon128.png"/>';
    html += '<div id="robox-select-password">';
    html += '<p>THAT DIDN\'T WORK!  WRONG PASSWORD! YIKES!</p>';
    html += '<br><p>Press OK to select again.</p>';
    html += '<a id="robox-select-password-ok" onclick="roboxConnect()" class="runButton allButtons">OK</a>';
    html += '</div>';
    html += '</div>';

    content.innerHTML = html;
}

roboxRemoteMode.checkPasswordGood = function()
{
    var modal = document.getElementById('robox-select');
    modal.style.display = "none";

    this.enterSession()
	.then((lastTime) => this.monitorSession(lastTime));
}

roboxRemoteMode.indicateConnection = function(connection)
{
    if(connection) {
	RoBoxEvents.dispatch("onConnect");
	$('#ConnectButton').hide();
	$('#DisconnectButton').show();
	$('#robox-name').text(this.robox);
    } else {
	RoBoxEvents.dispatch("onDisconnect");
	$('#ConnectButton').show();
	$('#DisconnectButton').hide();
	$('#robox-name').text("");
    }
}

const POLLING = 5000;    // how often do we check the connection? (ms)

//
// .monitorSession()  - called to kicks-off the monitoring of the session.
//                   Provides feedback to the user, then kicks-off the next
//                   monitor.

//
roboxRemoteMode.monitorSession = function(lastTime)
{
    console.log("entering monitorSession");
    
    roboxRemoteMode.indicateConnection(true);

    this.lastTime = lastTime;

    function checkConnectionPolling()
    {
	this.session.get()
	    .then((snapshot) => snapshot.val())
	    .then((lastTime) => {
		if(lastTime != this.lastTime) {  // it's been updated!
		    console.log("still connected");
		    this.monitorSession(lastTime);
		} else {
		    console.log("disconnected");
		    roboxRemoteMode.indicateConnection(false);
		}
	    });
    }

    setTimeout(checkConnectionPolling.bind(this),POLLING);
}

//
// .sessionFeedback() - set-up the feedback monitors for the session. If
//                      'on' is true, turn them all on, otherwise all off.
//
roboxRemoteMode.sessionFeedback = function(on)
{
    if(on) {
	this.session.on('child_changed')
	    .then((snapshot) => {
		var value = snapshot.val();
		switch(snapshot.key) {
		case 'ultrasonic':     RoBoxEvents.dispatch('onUltraSonic',value); break;
		case 'lineFollow':     RoBoxEvents.dispatch('onLineFollow',value); break;
		case 'IR':             RoBoxEvents.dispatch('onIRHit',value); break;
		case 'stopped':        RoBoxEvents.dispatch('onStop',value); break;

		    // the mentor has selected to go to the next/previous
		    
		case 'Previous':           // TODO
		case 'Next':               // TODO

		case 'NextPreviousAllow':  this.nextPreviousAllow(value); break;
		}
	    });
    } else {
	this.session.off();
	this.nextPreviousAllow(true);
    }
}

//
// .nextPreviousAllow() - called to turn on/off the next/previous buttons on the GUI
//
roboxRemoteMode.nextPreviousAllow = function(allow)
{
    if(allow) {
	$('#prevChallengeButton').show();
	$('#nextChallengeButton').show();
    } else {
	$('#prevChallengeButton').hide();
	$('#nextChallengeButton').hide();
    }
}

//
// .blocklyListener() - called when there is a change in blockly. We monitor
//                      so the desktop can be sent to the HUD.
//
roboxRemoteMode.blocklyListener = function(event)
{
    if(roboxRemoteMode.isOn) {
	switch(event.type) {
	case 'change':
	case 'move':
	    console.log('something interesting in blockly');
	    break;
	default: break;
	}
    }
}
    
//
// .enterSession() - enter the given session
//
//
roboxRemoteMode.enterSession = function()
{
    this.session = '/RoBoxRemote/sessions/' + this.mentor + ":" + this.robox;
    this.session = firebase.database().ref(this.session);
    
    return(firebase.database()
	   .ref('/RoBoxRemote/available/' + this.mentor + ':' + this.robox)
	   .set(null)
	   .then(() => this.session.set(firebase.database.ServerValue.TIMESTAMP))
	   .then(() => this.session.get())
	   .then((snapshot) => snapshot.val())
	  );
}

//
// .available() - return a promise, returning an array of the available sessions.
//
roboxRemoteMode.available = function()
{
    return(firebase.database()
	   .ref('/RoBoxRemote/available')
	   .get()
	   .then((snapshot)=> {

	       if(!snapshot.exists()) {
		   throw "No mentors available for remote sessions!";
	       }

	       var returnArray = [];

	       var data = snapshot.val();
	       var available = Object.keys(snapshot.val());
	       for(var i=0; i < available.length; i++) {
		   var entry = data[available[i]];
		   if(entry.hasOwnProperty('mentor') &&
		      entry.hasOwnProperty('robox') &&
		      entry.hasOwnProperty('password')) {
		       returnArray.push(entry);
		   }
	       }
	       if(returnArray.length == 0) {
		   throw "No mentors available for remote sessions!";
	       }

	       return(returnArray);
	   })
	  );
}

