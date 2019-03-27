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

LEDs = 3;

document.addEventListener('DOMContentLoaded',
			  function() {
			      RoBoxEvents.addListener("onIRHit",
						      function() {
							  var hit = document.getElementById("hit-sound");
							  hit.play();
							  var rcl = new RCLMessage();
							  if(LEDs) {
							      rcl.LED(LEDs,0);
							      rcl.Transmit();
							      LEDs -= 1;
							  }
						      });
			      RoBoxEvents.addListener("onFire",
						      function() {
							  var fire = document.getElementById("fire-sound");
							  fire.play();
						      });

			      // turn on the LEDs - have to wait a bit though for things to initialize
			      setTimeout(function() {
				  var rcl = new RCLMessage();
				  console.log("humph");
				  rcl.LED(1,1);
				  rcl.LED(2,1);
				  rcl.LED(3,1);
				  rcl.Transmit(); }, 1000);

			      gamepadCheck();
			      setInterval(gamepadDispatch,10);    // high speed makes gamepad more responsive
			  }
			 );

function resetLights()
{
    setTimeout(function() {
	LEDs = 3;
	var rcl = new RCLMessage();
	console.log("humph");
	rcl.LED(1,1);
	rcl.LED(2,1);
	rcl.LED(3,1);
	rcl.Transmit(); }, 500);
}
