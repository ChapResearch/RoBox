//
// hwromeo.cpp
//
//   Definitions of the hw calls for the Romeo. This file is included by hardware.cpp
//   when ROMEO is defined.  Note that EVERYTHING is in this file for the romeo, that is,
//   except for the library.
//

#ifdef ROMEO

#include "Arduino.h"
#include "RoBoxRomeo.h"		// from the roboxromeo library
#include "IR-ID.h"

BLE BLE;					// interface to the built-in Romeo BLE

LED led1(1);					// LED pins are built-in to the driver
LED led2(2);
LED led3(3);

UltraSonic ultra = UltraSonic(12,11);		// these pins SHOULD be in the driver

IRSender irsender = IRSender();

IRReceiver irreceiver1 = IRReceiver(1);		// here too (up to 2 ir receivers)
// IRReceiver irreceiver2 = IRReceiver(2);

Motor LeftMotor(1);				// motor pins are built-in to the driver too
Motor RightMotor(2);

ToneGenerator myTone = ToneGenerator(10);	// should be built in here, oh well

LineFollow line = LineFollow();

//
// hw_readLineFollow() - read the line-follow sensor.  Returns value between 0 and 100.
//
unsigned int hw_readLineFollow()
{
	unsigned int measurement = line.Measure();

	measurement = map(measurement,0,1023,0,100);
	return(measurement);
}

//
// hw_readUltraSonic() - read the ultrasonic and return reading between 0 and 100
//                       representing mm distance.  It is converted to cm before
//                       going out.
//
unsigned int hw_readUltraSonic()
{
	unsigned int measurement = ultra.Measure();

	measurement = measurement / 10;
	measurement = constrain(measurement,0,100);
	return(measurement);
}

//
// hw_readIR() - checks then reads the IR sensor(s). Only if there is an incoming signal
//               does it read the whole IR packet. Reading the whole IR packet takes a bit
//               of time, but this routine returns immediately if there IS not incoming IR.
//
uint32_t hw_readIR()
{
	uint32_t value;

	value = irreceiver1.checkAndReceive();
//	if(!value) {
//		value = irreceiver2.checkAndReceive();
//	}

	return(value);	// zero if nothing received
}

//
// hw_motor() - turns on/off the two motors designated by the first arg "motor" as being
//              either 'L' or 'R' for left or right, following by power from -100 to 100.
//
void hw_motor(char motor, int power)
{
#define TOLERANCE 5

     if(power < TOLERANCE && power > -TOLERANCE) {
	  power = 0;
     }

     if(power < -100) {
	  power = -100;
     }
     if(power > 100) {
	  power = 100;
     }

     if(motor == 'L') {
	  LeftMotor.Speed(power);
     } else if(motor == 'R') {
	  RightMotor.Speed(power);
     }
}

//
// hw_motorReverse() - sets the given motor to "reverse" mode. Makes programming
//                     left/right opposing motors easier.
//
void hw_motorReverse(char motor)
{
     if(motor == 'L') {
	  LeftMotor.Reverse();
     } else if(motor == 'R') {
	  RightMotor.Reverse(	);
     }
}

//
// hw_blaster() - sends out an IR signal (blasts) that is specific to RoBox. Note
//                that an 8-bit ID is sent in, which is added to the 24-bits of
//                RoBox id.
//
void hw_blaster(uint8_t id, int count, int power)
{
	uint32_t code = (((uint32_t)IR_BASE_ID)<<16) | (0x00<<8) | id;

	// TODO - implement power if it ends-up being a thing.

	while(count--) {
		irsender.sendCode(code);
		delay(100);		// need some space between blasts
	}
}

//
// hw_led() - operates on the given LED with the given pattern. 0 is off, 1 is on,
//            2 is blink.
//
void hw_led(int led, int pattern)
{
	LED  *targetLED;

	switch(led) {
	case 1:	targetLED = &led1; break;
	case 2:	targetLED = &led2; break;
	case 3:	targetLED = &led3; break;
	default: targetLED = &led1; break;	// just to silence the compiler :-)
	}

	switch(pattern) {
	case 0:	targetLED->Off(); break;
	case 1: targetLED->On(); break;
	case 2: targetLED->Toggle(); break;
	case 3:	targetLED->Blink(1000); break;
	case 4:	targetLED->Blink(500); break;
	case 5:	targetLED->Blink(250); break;
	default: targetLED->Off(); break;	// default is just to turn off LED
	}
}

static int toneTable[] = {
//         C     C#    D     Eb    E     F     F#    G    Ab    A     Bb    B
	   65,   69,   73,   77,   82,   87,   92,   98,  104,  110,  117,  123,// octave -2  [0-11]
	  130,  138,  147,  156,  165,  175,  185,  196,  208,  220,  233,  247,// octave -1  [12-23]
	  262,  277,  293,  311,  330,  349,  370,  392,  415,  440,  466,  494,// octave 0   [24-35]
	  523,  554,  587,  622,  659,  698,  740,  784,  831,  880,  932,  988,// octave 1   [36-47]
         1047, 1109, 1175, 1245, 1319, 1397, 1480, 1568, 1661, 1760, 1865, 1976,// octave 2   [48-59]
         2093, 2217, 2349, 2489, 2637, 2794, 2960, 3136, 3322, 3520, 3729, 3951,// octave 3   [60-71]
         4186, 4435, 4699, 4978, 5274, 5588, 5920, 6272, 6645, 7040, 7459, 7902,// octave 4   [72-83]
         8372, 8870, 9397, 9956,10548,11175,11840,12544,13290,14080,14918,15804 // octave 5   [84-95]
};


//
// hw_tone() - turns on a tone for a time. (freq in ms, dur in ms)
//
void hw_tone(int freq, int dur)
{
	myTone.Play(toneTable[freq],dur);
}

//
// hw_update() - called at the bottom of the loop, updates all relavent
//               hardware.
//
void hw_update()
{
     led1.Update();
     led2.Update();
     led3.Update();
     myTone.Update();
}

//
// hw_bleStart() - start-up BLE processing
//
void hw_bleStart()
{
	BLE.init();
}

//
// hw_bleReceive() - receives BLE data returning an int that represents the. Returns -1 if nothing is available
//                   (or like a timeout). Returns a single <byte> if there
//                   is something available.
//
int hw_bleReceive()
{
	return(BLE.receive());
}

//
// hw_bleSend() - sends an output byte buffer via BLE.
//
void hw_bleSend(byte *outBuffer, int length)
{
	BLE.send(outBuffer,length);
}

//
// hw_getname() - gets the name of the RoBox BLE.
//
const char *hw_getname()
{
	return(BLE.getname());
}

//
// hw_setname() - sets the name of the RoBox BLE. Needs to be 13 or less.
//
void hw_setname(const char *name)
{
	BLE.rename(name);
}

#endif
