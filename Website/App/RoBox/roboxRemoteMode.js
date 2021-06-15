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
    
    	.then(() => roboxCommonMode.available('available','No mentors available for remote sessions!'))

    // catch the case where there is nothing available
    // TODO - pop-up something when nothing is available

	.catch((error) => { roboxCommonMode.connectError(error); throw error; } )

    // otherwise, pop-up the pretty box with the selections
    
	.then((selections) => roboxCommonMode.connectSelections('available',selections));

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
	var svg = document.getElementsByClassName('blocklySvg')[0];
	var svgDoc = svg.contentDocument;
	var defs = document.getElementsByTagName('defs')[0];
	var blocks = document.getElementsByClassName('blocklyBlockCanvas')[0];
	var bbox = blocks.getBBox();

	var viewbox = 'viewbox="' + (bbox.x-10) + ' ' + (bbox.y-10) + ' ' +
	                           (bbox.width+50) + ' ' + (bbox.height+50) + '" ';
	var widthHeight = 'width="' + bbox.width + '" height="' + bbox.height + '" ';
	    
	var svgText = '<svg ' + viewbox + widthHeight + '>';
	svgText += defs.outerHTML;
	svgText += blocks.outerHTML;
	svgText += '</svg>';

	if(roboxRemoteMode.connected) {
	    roboxRemoteMode.session.child('snapshot').set(svgText);
	}
    }
}
    
//
// .enterSession() - enter the given session
//
//
roboxRemoteMode.enterSession = function(mentor,robox,password)
{
    roboxCommonMode.enterSession(this,mentor,robox,password);
    roboxCommonMode.monitorAlive(this,'remoteAlive','mentorAlive');

    var sessionData = { mentor:this.mentor,robox:this.robox,password:this.password };
    
//    return(roboxCommonMode.sessionRef('available',this.mentor,this.robox)
//	   .set(null)
//	   .then(() => this.session.set(sessionData))
//	  );

    return(this.session.set(sessionData));
}

RoBoxEvents.addListener('pulse',function(){
    console.log('beep');
});
