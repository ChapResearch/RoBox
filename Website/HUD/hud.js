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

function pingDatabase(){
	if(connected){
		var mentorName = document.getElementById('mentor-name').value;
		var roboxName = document.getElementById('robox-name').value;
		document.getElementById("inSessionLabel").style.color = "#34ED56";
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

<<<<<<< HEAD

=======
>>>>>>> c8424222dff26b140a4c104b44ab36403c9e874c
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
					console.log("connected with child");
					connected = true;
	
					firebase.database()
					.ref('/RoBoxRemote/available/' + mentorName + ":"+roboxName).remove();
					console.log("removed session info from /RoBoxRemote/avaliable");
			
					document.getElementById("inSessionLabel").style.color = "#34ED56";
					firebase.database()
					.ref('/RoBoxRemote/sessions/' + mentorName + ":"+roboxName)
<<<<<<< HEAD
					.set({peek:"null", currentStudentChallenge:1,nextPreviousAllow:true,autoRoBoxRunAllow:false,sensorReadings:true,ultrasonic:0,lineFollow:0,IR:0, activityPinger:true});
=======
					.set({peek:"null", currentStudentChallenge:1,nextPreviousAllow:true,autoRoBoxRunAllow:false,sensorReadings:true,ultrasonic:0,lineFollow:0,IR:0});
>>>>>>> c8424222dff26b140a4c104b44ab36403c9e874c
				}
				else
				{
					console.log("this is not my child!");
				}
			});
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


    
