//
// testfns.js
//
//    Functions to call RCL for the RoBox testing.
//

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
    rcl.Transmit(RoBoxBrain);
}

function BlastTest()
{
    var rcl = new RCLMessage();

    rcl.Blast(2,100);
    rcl.Transmit(RoBoxBrain);
}    

function LEDTest(num,op)
{
    var rcl = new RCLMessage();

    rcl.LED(num,op);
    rcl.Transmit(RoBoxBrain);
}

function LightTest()
{
    var rcl = new RCLMessage();

    rcl.LineFollow();
    rcl.Transmit(RoBoxBrain);
}

function UltraTest()
{
    var rcl = new RCLMessage();

    rcl.Ultrasonic();
    rcl.Transmit(RoBoxBrain);
}

function SensorTest()
{
    var rcl = new RCLMessage();

    rcl.Ultrasonic();
    rcl.LineFollow();
    rcl.Transmit(RoBoxBrain);
}

function SpeakerTest()
{
    var rcl = new RCLMessage();

    rcl.PlaySound(25,5);
    rcl.Transmit(RoBoxBrain);
}

function ShooterLoadTest()
{
    var rcl = new RCLMessage();
    
    rcl.ShooterLoad();
    rcl.Transmit(RoBoxBrain);
}

function ShooterFireTest(){
    var rcl = new RCLMessage();

    rcl.ShooterFire();
    rcl.Transmit(RoBoxBrain);
}
