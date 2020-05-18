//
// gamepad.js
//
//   Using the new HTML5 gamepad interface, this code will
//   send RCP commands to RoBox when a joystick (just the first one)
//   moves in a tank-drive fashion.  In other words, the left and
//   right sticks of the gamepad send motor commands to the RoBox
//   with power from -100 to 100 based upon the position of the stick.
//   It also will send a "blast" command when the X button is clicked.
//   Granted, this mapping could easily change.
//
//   Currently the Logitech F310 (X and D modes) and the Xbox controller
//   are supported.
//

gamepadIndex = null;
gamepad = null;

//
// gamepadCheck() - this routine needs to be called upon the
//                  page load to see if there is already a gamepad
//                  connected.  This routine checks for the first
//                  available gamepad.
//
function gamepadCheck()
{
    for(var i=0; i < 4; i++) {
	if(navigator.getGamepads()[i]) {
	    gamepadIndex = i;
	    gamepad = navigator.getGamepads()[gamepadIndex];
	    console.log("Got a gamepad at %d",i);
	    break;
	}
    }
}

//
// gamepadMap() - maps the appropriate stuff based upon the gamepad
//                that is connected. This makes it so that the right
//                sticks and buttons control the right functions.
//
function gamepadMap()
{
    if(gamepad !== null) {
    }
}

//
// gamepadInit() - should be called after page load, initializes the
//                 gamepad stuff - including adding a listener for
//                 gamepad changes.
//
function gamepadInit()
{
    gamepadCheck();
    window.addEventListener("gamepadconnected",
			    function(event) {
				gamepadIndex = event.gamepad.index;
				gamepad = navigator.getGamepads()[gamepadIndex];
				gamepadMap();

				console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
					    event.gamepad.index, event.gamepad.id,
					    event.gamepad.buttons.length, event.gamepad.axes.length);
			    });
}

//
// GAMEPAD CONNECT - this event listener will update the gamepad global
//                   with the new gamepad when it is plugged in.
//

//
// GAMEPAD DISCONNECT - will update the gamepad if the one we are using is disconnected.
//
window.addEventListener("gamepaddisconnected",
			function(event) {
			    if(event.gamepad.index == gamepadIndex) {
				gamepad = null;
			    }
			    console.log("Gamepad disconnected from index %d: %s",
					event.gamepad.index, event.gamepad.id);
			});

//
// gamepad "global" variables - could be tacked on to the object...
//
gamepadLastLeftStick = null;
gamepadLastRightStick = null;
gamepadLastBlastButton = null;
gamepadLastBlast = null;
gamepadLastShooterToggle = null;
gamepadLastShooterFire = null;

gamepadTimeout = 0;
gamepadPace = 250;               // only send updates every XXX ms (as set here)
gamepadLoopID = null;            // the setInterval() id for clearing later


//
// gamepadDispatch() - this routine is meant to be called repeatedly, quickly,
//                     (it will pace itself) so that gamepad data can be transmitted
//                     to the RoBox.
//
function gamepadDispatch()
{
    // BUTTONS on joystick
    const IRBLAST = 2; // X button
    const SHOOTERTOGGLE = 6; // Left bumper
    const SHOOTERFIRE = 7; // Right bumper

    // JOYSTICKS on joystick
    const LEFTMOTOR = 1; // left joystick
    const RIGHTMOTOR = 3; // right joystick

    var now = Date.now();

    if(now > gamepadTimeout && gamepad !== null) {

	var max = 75;

	gamepad = navigator.getGamepads()[gamepadIndex];
	var left = Math.floor(gamepad.axes[LEFTMOTOR] * -max);
	var right = Math.floor(gamepad.axes[RIGHTMOTOR] * -max);
	var blast = gamepad.buttons[IRBLAST].pressed;

	var shooterToggle = gamepad.buttons[SHOOTERTOGGLE] > 0.1;
	var shooterFire = gamepad.buttons[SHOOTERFIRE] > 0.1;


	// TODO - there should be translation function for the sticks
	//        to drive more smoothly.

	var rcl = new RCLMessage();

	// this is currently coded to send both left and right
	// everytime anything has changed. A little insurance
	// policy in case a packet is dropped.

	if(gamepadLastLeftStick != left || gamepadLastRightStick != right) {
	    gamepadLastLeftStick = left;
	    gamepadLastRightStick = right;
	    rcl.Motor('L',left);
	    rcl.Motor('R',right);
	    //	    console.log(gamepadLastRightStick);
	    //	    console.log(gamepadLastLeftStick);
	}

	if(gamepadLastBlast != blast) {
	    gamepadLastBlast = blast;
	    if(blast) {
		rcl.Blast(1,50);
		battleFire();            // TODO - move this somewhere else
	    }
	}

	if(gamepadLastShooterToggle != shooterToggle){
	    gamepadLastShooterToggle = shooterToggle;
	    if(shooterToggle){
		      rcl.ShooterStart();
	    }
      else{
        rcl.ShooterStop();
      }
	}

	if(gamepadLastShooterFire != shooterFire){
	    gamepadLastShooterFire = shooterFire;
	    if(shooterFire){
		rcl.ShooterFire();
	    }
	}

	if(!rcl.Empty()) {
	    gamepadTimeout = now + gamepadPace;
	    rcl.Transmit(RoBoxBrain);
	}
    }
}

//
// gamepadLoopOn() - turns on the gamepad loop that will continually check the gamepad.
//                   It schedules and paces itself.  Call gamepadLopOff() when you want
//                   to turn it off.  This usedto use window.requestAnimationFrme().
//
function gamepadLoopOn()
{
    gamepadLoopID = setInterval(gamepadDispatch,10);    // high speed makes gamepad more responsive
}

function gamepadLoopOff()
{
    if(gamepadLoopID !== null) {
	clearInterval(gamepadLoopID);
	gamepadLoopID = null;
    }
}
