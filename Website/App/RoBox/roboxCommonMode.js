//
// roboxCommonMode.js
//
//   Common functions between both roboxMentorMode and roboxRemoteMode
//   (like selecting mentor/robox)
//

roboxCommonMode = {}

//
// .connectSelections() - populate the robox-select dialog with connection
//                        selections.  These are wired to "move on" once
//                        a selection is made.
//
//                        The 'fnString' is the function call to make once
//                        a selection has been made. Note that this needs
//                        to be a STRING since it is in the DOM.
//
roboxCommonMode.connectSelections = function(type,selections)
{
    var modal = document.getElementById('robox-select');
    var content = document.getElementById('robox-select-content');
    var scanning = document.getElementById('robox-select-scanning');

//    content.style.backgroundColor = "#56daee";

    var html = "";
    var selectionKeys = Object.keys(selections);
    
    for(var i=0; i < selectionKeys.length; i++) {
	var selection = selections[selectionKeys[i]];
	html += '<div class="robox-select-choice" ';
	html += 'onclick="' + 'roboxCommonMode.connectExecute' + '(\'';
	html += type + '\',\'';
	html += selection.mentor + '\',\'';
	html += selection.robox + '\')">';
	html += '<table><tr>'
	html += '<td><img width="40px" src="/media/roboxIcon128.png"/></td>';
	html += '<td>';
	html += '<span class="robox-select-choice-name">';
	html += selection.mentor;
	html += '</span><br>';
	html += '<span class="robox-select-choice-address">';
	html += selection.robox;
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
roboxCommonMode.connectError = function(msg)
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
    html += '<br><br>' + msg;
    html += '</p>';
    html += '</div>';

    content.innerHTML = html;
}

//
// .getPassword() - get the password from the user.  When the password is
//                  submitted, call the function in the string fnString.
//
//                       
roboxCommonMode.getPassword = function(type,mentor,robox,password)
{
    console.log("TYPE is '" + type + "'");
    var fnString = 'roboxCommonMode.checkPassword';
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

    var uponEnterOrClick = fnString + "('" + type + "','" + mentor + "','" + robox + "','" + password + "')";
    
    html += '<form onsubmit="' + uponEnterOrClick + '; return false;">';
    html +=   '<input type="text" id="robox-select-password-input"></input>';
    html += '</form>';
    html += '</div>';
    html += '<a id="robox-select-password-ok" onclick="' + uponEnterOrClick + '" class="runButton allButtons">OK</a>';
    html += '</div>';
    html += '</div>';

    content.innerHTML = html;
}

//
// .available() - return a promise, returning an array of the available sessions.
//                The argument determines the subkey to look in, normally either
//                "sessions" or "available".  Also, the errormsg is shown if there
//                are no sessions available.
//
roboxCommonMode.available = function(subkey,errormsg)
{
    return(firebase.database()
	   .ref('/RoBoxRemote/' + subkey)
	   .get()
	   .then((snapshot)=> {

	       if(!snapshot.exists()) {
		   throw errormsg;
	       }

	       var returnSessions = {};

	       var data = snapshot.val();
	       var available = Object.keys(snapshot.val());
	       for(var i=0; i < available.length; i++) {
		   var entry = data[available[i]];
		   if(entry.hasOwnProperty('mentor') &&
		      entry.hasOwnProperty('robox') &&
		      entry.hasOwnProperty('password')) {
		       returnSessions[available[i]] = entry;
		   }
	       }
	       if(Object.keys(returnSessions).length == 0) {
		   throw errormsg;
	       }

	       return(returnSessions);
	   })
	  );
}
//
// roboxCommonMode() - return the firebase database reference for the given type
//                     of session - available or sessions.
//
roboxCommonMode.sessionRef = function(type,mentor,robox)
{
    var session = '/RoBoxRemote/' + type + '/' + mentor + ":" + robox;
    return(firebase.database().ref(session));
}
    
//
// .connectExecute() - called by clicking on a selection, initiate the
//                     connection to the specified session.  this really
//                     just involves checking the password.  However,
//                     after the check, the appropriate call needs to
//                     be made depending upon the type.
//
roboxCommonMode.connectExecute = function(type,mentor,robox)
{
    this.sessionRef(type,mentor,robox)
	.get()
	.then((snapshot)=> {
	    if(!snapshot.exists()) {
		this.connectFailed(type,mentor,robox);
	    } else {
		this.getPassword(type,mentor,robox,snapshot.val().password);
	    }
	});
}

roboxCommonMode.connectFailed = function(type,mentor,robox)
{
    console.log("connection failed");
}

//
// .checkPassword() - this is called by the click on the OK for the password
//
roboxCommonMode.checkPassword = function(type,mentor,robox,passwordTarget)
{
    console.log("checking",type,mentor,robox,passwordTarget);
    
    var password = document.getElementById('robox-select-password-input').value;

    console.log("checking '" + password + "' against '" + passwordTarget + "'");
    if(password == passwordTarget) {
	this.checkPasswordGood(type,mentor,robox,password);
    } else {
	this.checkPasswordBad();
    }

    return(false);     // to stop form from doing standard submitting
}

roboxCommonMode.checkPasswordBad = function()
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

roboxCommonMode.checkPasswordGood = function(type,mentor,robox,password)
{
    var modal = document.getElementById('robox-select');
    modal.style.display = "none";

    if(type == 'available') {
	type = roboxRemoteMode;
    } else {
	type = roboxMentorMode;
    }

    type.enterSession(mentor,robox,password);
}

roboxCommonMode.enterSession = function(me,mentor,robox,password)
{
    me.mentor = mentor;
    me.robox = robox;
    me.password = password;
    me.connected = true;

    me.session = roboxCommonMode.sessionRef('sessions',me.mentor,me.robox);

    roboxCommonMode.guiSetup();
}

roboxCommonMode.monitorAlive = function(me,outgoing,incoming)
{
    me.outgoingMonitor = outgoing;
    me.incomingMonitor = incoming;

    this.monitorIncoming(me);
    this.monitorAlivePulse(me);
}

roboxCommonMode.monitorIncoming = function(me)
{
    me.lastIncoming = Date.now();    
    me.session.child(me.incomingMonitor).on('value',function(snapshot) {
	me.lastIncoming = Date.now();
    });
}
    
roboxCommonMode.monitorAlivePulse = function(me)
{
    var interval = 2000;         // in ms
    var tolerance = 5000;        // in ms

    var now = Date.now();

    if((now - me.lastIncoming) > tolerance ) {
	console.log("disconnected");
	me.connected = false;
	RoBoxEvents.dispatch('onSessionUpdate',{session:me.mentor+':'+me.robox,status:'Offline'});	
    } else {
	RoBoxEvents.dispatch('onSessionUpdate',{session:me.mentor+':'+me.robox,status:'Online'});	
	me.connected = true;
    }

    if(me.session) {
	// I just keep pinging if I have a valid session!
	setTimeout(this.monitorAlivePulse.bind(this,me),interval);
	me.session.child(me.outgoingMonitor).set(firebase.database.ServerValue.TIMESTAMP);
	RoBoxEvents.dispatch('pulse',null);
    }
}

roboxCommonMode.guiSetup = function()
{
    var oldIndicator = document.getElementById('remoteSettings');
    if(oldIndicator) {
	oldIndicator.remove();
    }
    
    var mhtml = 
	'<td id="remoteSettings">' +
	   '<div class="title">Mentor Remote Mode:</div>' +
	   '<div class="sessionNameLabel">Session: <span id="sessionName">(none)<span></div>' +
	   '<div class="sessionStatusLabel">Status: <span id="sessionStatus">---<span></div>' +
	   '<form onsubmit="roboxMentorMode.connect(); return false;">';

    if(roboxMentorMode.isOn) {
	mhtml += '<div id="mentorOK"><p><button>RESTART</button><p></div>';
    }

    mhtml += '</form></td>';

    document.getElementById('topDivSelector')
	.insertAdjacentHTML('beforebegin',mhtml);

    RoBoxEvents.addListener("onSessionUpdate",function(data) {
	document.getElementById('sessionName').textContent = data.session;
	document.getElementById('sessionStatus').textContent = data.status;
	var color;
	switch(data.status) {
	case 'Online':   color = 'green'; break;
	case 'Offline':  color = 'red'; break;
	default:         color = 'white'; break;
	}
	document.getElementById('sessionStatus').setAttribute('style','color:'+color);
    })
}

roboxCommonMode.guiSetupOLD = function()
{
    var mhtml = 
	'<td id="remoteSettings">' +
	  '<form onsubmit="roboxMentorMode.connect(); return false;">' +
	     '<div class="title">Mentor Remote Mode:</div>' +
	     '<div id="mentorName"><p>Mentor Name</p><input id="mentorNameInput" type="text" /></div>' +
	     '<div id="roboxName"><p>RoBox Name</p><input id="roboxNameInput" type="text" /></div>';

    if(roboxMentorMode.isOn) {
	mhtml += '<div id="mentorOK"><p><button>RESTART</button><p></div>';
    }

    mhtml += '</form></td>';

    document.getElementById('topDivSelector')
	.insertAdjacentHTML('beforebegin',mhtml);
}
