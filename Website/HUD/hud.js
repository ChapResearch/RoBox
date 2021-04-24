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

firebaseInit();


    
