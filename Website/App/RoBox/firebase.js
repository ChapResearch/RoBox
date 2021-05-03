//
// firebase.js
//
//    Interface to firebase for the "remote" mode of the RoBox app.
//    Note that this needs the firebase to loaded in the html as (for v8.4.1):
//
//     <script src="https://www.gstatic.com/firebasejs/8.4.1/firebase-app.js"></script>
//     <script src="https://www.gstatic.com/firebasejs/8.4.1/firebase-database.js"></script>
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
