//
// battle.js
//   Implement the robox final battle.
//   This is just like driving, but it includes
//   a bit more:
//
//     - driving and firing
//     - upon refresh or reset, all three LEDs go on
//     - whenever an IRhit comes in, an LED goes out (until they are all out)
//     - sound when hit, sound when firing
//

// GLOBALS
battleLEDs = 3;           // used to track which LEDs are still on
battleHitListenerID = 0;    // used to turn off the listener for incoming hits
battleFireListenerID = 0;   // used to turn off the listener for firing

// battle is the same as driving, but includes firing and LED scoring,
//   along with the sound effects

//
// battleInit() - a one-time call to prepare the "stuff" for the battle mode.
//                It should be called when initializing everything.
//
function battleInit()
{
    // TODO - load the fire and hit sounds

}

//
// battleOn() - turns "on" the battle mode. This means:
//              - sound effects are attached to the IRHit and Fire RoBoxEvents
//              - LEDs are affected by hits
//              - gamepad monitoring is turned on
//
function battleOn()
{
    gamepadCheck();       // when the battle goes on, check for a gamepad
    
    battleLEDReset();

    battleHitListenerID = RoBoxEvents.addListener("onIRHit",battleHit);
    battleFireListenerID = RoBoxEvents.addListener("onFire",battleFire);

    gamepadLoopOn();
}

//
// battleOff() - turns "off" the battle mode. This means:
//                - sound effects are turned off
//                - LEDs are turned off
//                - gamepad monitoring is turned off
//
function battleOff()
{
    battleLEDOff();

    if(battleHitListenerID) {
	RoBoxEvents.removeListener(battleHitListenerID);
    }
    if(battleFireListenerID) {
	RoBoxEvents.removeListener(battleFireListenerID);
    }

    battleHitListenerID = 0;
    battleFireListenerID = 0;

    gamepadLoopOff();
}

//
// battleHit() - function to call when a battle hit is registered.
//
function battleHit()
{
    var hit = document.getElementById("hit-sound");
    hit.play();
    var rcl = new RCLMessage();
    if(battleLEDs) {
	rcl.LED(battleLEDs,0);
	rcl.Transmit(RoBoxBrain);
	battleLEDs -= 1;
    }
}

//
// battleFire() - function to call when the blaster is fired
//
function battleFire()
{
    var fire = document.getElementById("fire-sound");
    fire.play();
}    

//
// battleLEDReset() - resets the LEDs for a new battle
//
function battleLEDReset()
{
    battleLEDs = 3;
    return(battleLEDControl(true));
}

//
// battleLEDOff() - turns off LEDs
//
function battleLEDOff()
{
    return(battleLEDControl(false));
}

//
// battleLEDControl() - turns off or on the LEDs
//
function battleLEDControl(on)
{
    on = on?1:0;

    // in the old code, there was a setTimeout used to make sure the LEDs
    //   turned on/off - I kept it in here but don't remember why it was needed
    //   TODO - see if this is really needed

    setTimeout(function() {    
	var rcl = new RCLMessage();
	rcl.LED(1,on);
	rcl.LED(2,on);
	rcl.LED(3,on);
	rcl.Transmit(RoBoxBrain);
    }, 500);
}

