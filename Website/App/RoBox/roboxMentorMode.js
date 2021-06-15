//
// roboxMentorMode.js
//
//   This file implements the "mentor" mode for the main GUI.
//   The idea is that the mentor has the GUI connected to a
//   robox just like normal, but the GUI is monitoring for
//   a remote connection to pass on things such as RUN,
//   STOP, and sensor readings.
//

var roboxMentorMode = {};     // GLOBAL object for maintaining mentor mode

roboxMentorMode.isOn = false; // test this variable when needed

//
// .setup() - sets-up "mentor-mode" if the right query string was given.
//
roboxMentorMode.setup = function(searchString)
{
    var params = parseQuery(searchString);
    if(params.hasOwnProperty('mentor')) {
	this.isOn = true;

	firebaseInit();
	this.guiSetup();
	this.firebaseSetup();
	console.log("mentor mode initiated");

	// cool, mentor mode entered, check for settings
	//  go get the available SESSIONS - note that the HUD
	//  must be up before entering "mentor" mode on the GUI

	var mentor;
	var password;
	var robox;
	
	if(params.hasOwnProperty('mentorName')) {
	    mentor = params.mentorName;
	}

	if(params.hasOwnProperty('roboxName')) {
	    robox = params.roboxName;
	}

	if(params.hasOwnProperty('password')) {
	    password = params.password;
	}

	// for the mentor mode, get ALL outstanding sessions, including those in available and in
	//   sessions, and then check
	
	roboxCommonMode.available('available','No sessions currently available. Start the HUD!')
	    .then((sessions) => {
		var session = null;
		var sessionKeys = Object.keys(sessions);
		for(var i=0; i < sessionKeys.length; i++) {
		    if(sessions[sessionKeys[i]].mentor == mentor &&
		       sessions[sessionKeys[i]].robox == robox &&
		       sessions[sessionKeys[i]].password == password) {
			session = sessions[sessionKeys[i]];
		    }
		}
		if(!session) {
		    throw 'URL parameters incorrect for Mentor Mode.'
		}
		this.enterSession(mentor,robox,password);
	    })
	    .catch((error) => { roboxSelect(); roboxCommonMode.connectError(error); throw error; } );
    }
}

//
// .connect() - given a mentor name and robox name, try to connect
//              to an available/session with that name.
//
roboxMentorMode.connect = function()
{
    if(!this.isOn) {
	return;
    }

    roboxSelect();    // turns on the little scanning guy
    
    // have a short delay so that the cute "scanning guy" is shown
    // for a bit - because this goes very fast otherwise

    new Promise((res,rej) => setTimeout(res,2000))

    // after waiting for the cosmetic time, get the available sessions
    
    	.then(() => roboxCommonMode.available('sessions','You need to start your HUD!'))

	.catch((error) => { roboxCommonMode.connectError(error); throw error; } )

    // otherwise, pop-up the pretty box with the selections
    
	.then((selections) => roboxCommonMode.connectSelections('sessions',selections))
}

roboxMentorMode.enterSession = function(mentor,robox,password)
{
    roboxCommonMode.enterSession(this,mentor,robox,password);
    roboxCommonMode.monitorAlive(this,'mentorAlive','remoteAlive');

    RoBoxEvents.dispatch('onSessionUpdate',{session:mentor+':'+robox,status:'Offline'});

    this.session.child('run').on('value',this.run.bind(this));
    this.session.child('stop').on('value',this.stop.bind(this));

    RoBoxEvents.addListener("onIRHit",this.onIRHit.bind(this));
    RoBoxEvents.addListener("onLineFollow",this.onLineFollow.bind(this));
    RoBoxEvents.addListener("onUltraSonic",this.onUltraSonic.bind(this));
    
    return(Promise.resolve(this.session));
}

//
// .sessionCheck() - check to see if there is a firebase entry for
//                   either the available or session, which ensures
//                   that we match the HUD.
//
roboxMentorMode.sessionCheck = function()
{
    var mentor = document.getElementById('mentorNameInput').value;
    var robox = document.getElementById('roboxNameInput').value;

    console.log("checking " + mentor + ":" + robox);

    return;
    
    var modal = document.getElementById('robox-select');
    var content = document.getElementById('robox-select-content');
    var scanning = document.getElementById('robox-select-scanning');

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
// .guiSetup() - setup the GUI for being able to do mentor mode
//
roboxMentorMode.guiSetup = function()
{
    var mhtml = 
	'<td id="mentorSettings">' +
	 '<form onsubmit="roboxMentorMode.connect(); return false;">' +
	   '<div id="mentorName"><p>Mentor Name</p><input id="mentorNameInput" type="text" /></div>' +
	   '<div id="roboxName"><p>RoBox Name</p><input id="roboxNameInput" type="text" /></div>' +
	   '<div id="mentorOK"><p><button>SET</button><p></div>' +
	 '</form>' +
	'</td>';

    // TODO - turn this off for now
    
//    document.getElementById('topDivSelector')
//	.insertAdjacentHTML('beforebegin',mhtml);
    
}


//
// .run() - called when a program was dropped into the session from the remote GUI.
//          Silently ignore empty programs.
//
roboxMentorMode.run = function(snapshot)
{
    var code = snapshot.val();

    if(code !== null && code.length != 0) {
	console.log("got a program! ",code);

	// remove it right away, so that another run can be done, otherwise
	//   the data may not change so the firebase update won't occur
    
	roboxMentorMode.session.child('run').remove();

	roboxRunLowLevel(code);
    }
}

//
// .stop() - called when the remote GUI person presses STOP
//
roboxMentorMode.stop = function(snapshot)
{
    console.log("stopped pressed");
    roboxStopLowLevel();
}

//
// .onIRHit() - called when we get an IRHit from the physical RoBox
//
roboxMentorMode.onIRHit = function()
{
    roboxMentorMode.session.child('ir').set(firebase.database.ServerValue.TIMESTAMP);
}

//
// .onLineFollow() - called when we get a report on the line follow from the
//                   physical robox.
//
roboxMentorMode.onLineFollow = function(data)
{
    roboxMentorMode.session.child('linefollow').set(data);
}

//
// .onUltraSonic() - called when get a report from the ultra-sonic from the
//                   physical robox.
//
roboxMentorMode.onUltraSonic = function(data)
{
    roboxMentorMode.session.child('ultrasonic').set(data);
}

//
// .firebaseSetup() - setup the monitoring and connections for firebase.
//
roboxMentorMode.firebaseSetup = function()
{
    // first we need to monitor for 
}
roboxMentorMode.monitorSession = function()
{
    console.log('monitoring');
}
