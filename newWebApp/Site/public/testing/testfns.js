//
// testfns.js
//
//    Functions to call RCL for the RoBox testing.
//

window.onload = function() {
    $('#testButton').click(function(){
    
	$('#testButton').unbind('testButton');
	$('#status').append('bound');
	
	setTimeOut(
	    function(){
		$('#testButton').bind('testButton',function(){
		    $('#status').append('bound');
		});
	    },
	    2000
	);
    });
};

function motorTest(which,what)
{
    var rcl = new RCLMessage();

    var speed;

    if( what == 'backward') {
	speed = -100;
    } else if (what == 'forward') {
	speed = 100;
    } else {
	speed = 0;
    }
    
    rcl.Motor(which,speed);
    rcl.Transmit();
}

function BlastTest()
{
    var rcl = new RCLMessage();

    rcl.Blast(2,100);
    rcl.Transmit();
}    

function LEDTest(num,op)
{
    var rcl = new RCLMessage();

    rcl.LED(num,op);
    rcl.Transmit();
}

function LightTest()
{
    var rcl = new RCLMessage();

    rcl.LineFollow();
    rcl.Transmit();
}

function UltraTest()
{
    var rcl = new RCLMessage();

    rcl.Ultrasonic();
    rcl.Transmit();
}

function SensorTest()
{
    var rcl = new RCLMessage();

    rcl.Ultrasonic();
    rcl.LineFollow();
    rcl.Transmit();
}

function SpeakerTest()
{
    var rcl = new RCLMessage();

    rcl.PlaySound(25,5);
    rcl.Transmit();
}

document.addEventListener('DOMContentLoaded',
  function() {
      roboxGetName();
  }
);


// This is the way it used to be done. Now, to make things more responsive,
//  it has been changed to do status reports only when hovering over the
//  appropriate icon.

// TODO - need to have connected be updated appropriately

//ROBOX_CONNECTED = false;

//setInterval(function() {
//    if(ROBOX_CONNECTED) {        // a global variable that is TRUE if connected,
//	SensorTest();      //     undefined or FALSE otherwise
//    }
//},1000);


