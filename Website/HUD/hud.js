//     __  ____  ______      _     
//    / / / / / / / __ \    (_)____
//   / /_/ / / / / / / /   / / ___/
//  / __  / /_/ / /_/ /   / (__  ) 
// /_/ /_/\____/_____(_)_/ /____/  
//                    /___/
// hud.js
//
//   This file is brought in by the index.html, and it includes
//   all of the code that is used to operate the HUD.  The GUI
//   in the html file links to code in here.
//
//   This file also includes the code that interfaces with
//   firebase.
//

//
// firebaseInit() - initialize firebase for us to use.  It has a configuration
//                  that is in this file.  This function needs to be called before
//                  anything tries to access firebase.
//
function firebaseInit()
{
    var firebaseConfig = {
	apiKey: "AIzaSyDz4KVH1_aoVs0tcofy1cxHkI05AIP0PCY",
	authDomain: "robox-3666f.firebaseapp.com",
	databaseURL: "https://robox-3666f.firebaseio.com",
	projectId: "robox-3666f",
	storageBucket: "robox-3666f.appspot.com",
	messagingSenderId: "356472837055",
	appId: "1:356472837055:web:3491df60bef9212534470a"
    };

    firebase.initializeApp(firebaseConfig);
}

setInterval(pingDatabase,3000);
setInterval(checkRemoteActivity,10000)

function pingDatabase(){
	if(connected){
		var mentorName = document.getElementById('mentor-name').value;
		var roboxName = document.getElementById('robox-name').value;
		var obj = firebase.database()
			.ref('/RoBoxRemote/sessions/' + mentorName + ":"+roboxName).child("activityPinger").get().then((snapshot) => {
				if(snapshot.exists()){
					console.log(snapshot.val());
					firebase.database().ref('/RoBoxRemote/sessions/' + mentorName + ":"+roboxName).update({activityPinger: !(snapshot.val())})
				}

			}).catch((error) => {
				console.error((error));
			});
	}
}
var lastRemotePing = 0
function checkRemoteActivity(){
    if(connected){
	var mentorName = document.getElementById('mentor-name').value;
	var roboxName = document.getElementById('robox-name').value;
	if(lastRemotePing==0){
	    var obj = firebase.database()
		.ref('/RoBoxRemote/sessions/' + mentorName + ":"+roboxName).child("remoteAlive").get().then((snapshot) => {
		    if(snapshot.exists()){
			lastRemotePing=snapshot.val();
		    }
		}).catch((error) => {
		    console.error((error));
		});
	}
	else{
	    var obj = firebase.database()
		.ref('/RoBoxRemote/sessions/' + mentorName + ":"+roboxName).child("remoteAlive").get().then((snapshot) => {
		    if(snapshot.exists()){
			if(lastRemotePing==snapshot.val()){
			    firebase.database()
				.ref('/RoBoxRemote/available/' + mentorName + ":"+roboxName).remove();
			    console.log("remote connection timed out");
			}
			else{
			    lastRemotePing=snapshot.val();
			}
		    }
		}).catch((error) => {
		    console.error((error));
		});
	}
    }
}

function nextChallenge(){
	if(connected){
		var mentorName = document.getElementById('mentor-name').value;
		var roboxName = document.getElementById('robox-name').value;
		var obj = firebase.database()
				.ref('/RoBoxRemote/sessions/' + mentorName + ":"+roboxName).child("currentStudentChallenge").get().then((snapshot) => {
					if(snapshot.exists()){
						var currentChallenge=snapshot.val();
						if(currentChallenge!=14){
							currentChallenge+=1;
							firebase.database()
								.ref('/RoBoxRemote/sessions/' + mentorName + ":"+roboxName)
								.update({currentStudentChallenge:currentChallenge});
						}
					}
				}).catch((error) => {
					console.error((error));
				});
	}
}
function previousChallenge(){
	if(connected){
		var mentorName = document.getElementById('mentor-name').value;
		var roboxName = document.getElementById('robox-name').value;
		var obj = firebase.database()
				.ref('/RoBoxRemote/sessions/' + mentorName + ":"+roboxName).child("currentStudentChallenge").get().then((snapshot) => {
					if(snapshot.exists()){
						var currentChallenge=snapshot.val();
						if(currentChallenge!=1){
							currentChallenge-=1;
							firebase.database()
								.ref('/RoBoxRemote/sessions/' + mentorName + ":"+roboxName)
								.update({currentStudentChallenge:currentChallenge});
						}
					}
				}).catch((error) => {
					console.error((error));
				});
	}
}


//
// mentorSave() - this function is called when someone clicks on the
//                "SAVE" button next to the mentor name.  It goes into
//                the mentor text field, grabs the value there, and
//                puts it into firebase.
//
//      TODO - this doesn't do anything with session yet! If the mentor
//             name changes while in session, what happens?
//
function mentorSave()
{
    var mentorName = document.getElementById('mentor-name').value;

    if(mentorName) {
	firebase.database()
	    .ref('/RoBoxRemote/available/' + mentorName + ":")
	    .set({mentorName:mentorName});
    }
}

function autoRunRoboxCheckbox()
{
	var autoRun = document.getElementById('autoRunRoboxCheckbox').checked;

	var mentorName = document.getElementById('mentor-name').value;
	var roboxName = document.getElementById('robox-name').value;

	firebase.database()
		.ref('/RoBoxRemote/sessions/' + mentorName + ":"+roboxName)
		.update({autoRoBoxRunAllow:autoRun});	
}

function allowChallengeControl()
{
	var challengeControl = document.getElementById('allowChallengeControlCheckbox').checked;

	var mentorName = document.getElementById('mentor-name').value;
	var roboxName = document.getElementById('robox-name').value;

	firebase.database()
		.ref('/RoBoxRemote/sessions/' + mentorName + ":"+roboxName)
		.update({allowChallengeControl:challengeControl});
	
}

function launchMentorGUI()
{
	var mentorName = document.getElementById('mentor-name').value;
	var roboxName = document.getElementById('robox-name').value;
	var password = document.getElementById('password').value;

		window.open(
			"http://robox.chapresearch.com/App/?mentor&mentorName="+mentorName
			+"&roboxName="+roboxName+"&password="+password, 
			"_blank"
		);
} 

function nextPreviousButton()
{
	var next = document.getElementById('NextButton').clicked;
	var previous = document.getElementById('PreviousButton').clicked;

	var mentorName = document.getElementById('mentor-name').value;
	var roboxName = document.getElementById('robox-name').value;

	if (next) {
		console.log("Go to next challenge");
		firebase.database()
			.ref('/RoBoxRemote/sessions/' + mentorName + ":"+roboxName)
			.update({currentStudentChallenge:currentStudentChallenge+1});
	}

	else if (previous) {
		console.log("Go to previous challenge");
		firebase.database()
			.ref('/RoBoxRemote/sessions/' + mentorName + ":"+roboxName)
			.update({currentStudentChallenge:currentStudentChallenge-1});
	}
}

var connected = false;

function sessionChange()
{
    var mentorName = document.getElementById('mentor-name').value;
    var roboxName = document.getElementById('robox-name').value;
    var password = document.getElementById('password').value;

    var inSession = document.getElementById("inSessionCheckbox").checked;

    if(inSession){
	console.log("in session")

	document.getElementById("mentor-name").disabled = true;
	document.getElementById("robox-name").disabled = true;
	document.getElementById("password").disabled = true;

	if(mentorName && roboxName && password){
	    firebase.database()
		.ref('/RoBoxRemote/available/' + mentorName + ":"+roboxName)
		.set({mentor:mentorName, robox:roboxName,password,password});
	    console.log("setting up reference");
	    firebase.database()
		.ref('/RoBoxRemote/sessions')
		.on('child_added', function(snapshot)
		    {
			var key = snapshot.key;
			var value = snapshot.val();
			console.log(key)
			if(key == mentorName + ":" + roboxName)
			{
			    // a value was added to the session, and this happens
			    //  for both the remote GUI and the mentor GUI,
			    //  so check for the "alive" signal from the remote
			    //  to determine if it is connected

			    console.log("child_added - ",value);
			    
			    if(value.hasOwnProperty('remoteAlive')) {
				
				console.log("connected with child");
				connected = true;
			    
				firebase.database()
				    .ref('/RoBoxRemote/available/' + mentorName + ":"+roboxName).remove();
				console.log("removed session info from /RoBoxRemote/avaliable");
				
				document.getElementById("inSessionLabel").style.color = "#34ED56";
				firebase.database()
				    .ref('/RoBoxRemote/sessions/' + mentorName + ":"+roboxName)
				    .set({currentStudentChallenge:1,
					  nextPreviousAllow:document.getElementById('allowChallengeControlCheckbox').checked,
					  autoRoBoxRunAllow:document.getElementById('autoRunRoboxCheckbox').checked,
					  ultrasonic:0,lineFollow:0,IR:0});
			    }
			}
		    });

	    snapshot.on(mentorName,roboxName,'screenshot');
	}

    } 
    else{
	if(connected){
	    var conf = confirm("You are currently connected with a child. Are you sure you would like to end the session?");
	    if(conf == true){
		console.log("ended session");
		document.getElementById("mentor-name").disabled = false;
		document.getElementById("robox-name").disabled = false;
		document.getElementById("password").disabled = false;
		connected = false;
		
		firebase.database()
		    .ref('/RoBoxRemote/sessions/' + mentorName + ":"+roboxName).remove();
		console.log("removed session info from /RoBoxRemote/sessions")

		document.getElementById("inSessionLabel").style.color = "#000000"
	    }
	    if(conf == false){
		console.log("canceled end");
		document.getElementById("inSessionCheckbox").checked = true;
	    }
	}
	else{
	    console.log("ended session")
	    document.getElementById("mentor-name").disabled = false;
	    document.getElementById("robox-name").disabled = false;
	    document.getElementById("password").disabled = false;
	    
	    firebase.database()
		.ref('/RoBoxRemote/available/' + mentorName + ":"+roboxName).remove();
	    console.log("removed session info from /RoBoxRemote/avaliable");
	}
    }

}

firebaseInit();


    
