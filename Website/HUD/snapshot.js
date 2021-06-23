//
// snapshot.js
//
//   This file is used to monitor the snapshot field for the remote robox
//   and paint the snapshot on the HUD when it changes.  To use:
//
//      snapshot.on(session) - turns on snapshot updating - the session
//                             must be in the form "mentor:robox".
//
//      snapshot.off() - turns off snapshot updating
//
//


snapshot = {};

snapshot.on = function(mentor,robox,divId)
{
    this.attribute = '/RoBoxRemote/sessions/' + mentor + ":"+ robox + '/snapshot';
    this.ref = firebase.database().ref(this.attribute);
    this.ref.on('value',snapshot.update.bind(snapshot));

    this.divId = divId;
}

snapshot.off = function()
{
    this.ref.off();
}

//
// .update() - called when the snapshot data changes.  The snapshot is
//             painted in the 'div' supplied when turning it 'on'.
//
snapshot.update = function(data)
{
    console.log("got svg update");
    document.getElementById(this.divId).innerHTML = data.val();
}
