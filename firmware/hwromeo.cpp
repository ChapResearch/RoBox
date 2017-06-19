1//
// hwromeo.cpp
//
//   Definitions of the hw calls for the Romeo. This file is included by hardware.cpp
//   when ROMEO is defined.  Note that EVERYTHING is in this file for the romeo, that is,
//   except for the library.
//

#include "RoBoxRomeo.h"		// from the roboxromeo library

LED led1(1);					// LED pins are built-in to the driver
LED led2(2);
LED led3(3);

UltraSonic ultra = UltraSonic(12,11);		// these pins SHOULD be in the driver

IRSender irsender = IRSender(13);		// so should this one

IRReceiver irreceiver1 = IRReceiver(7);		// here too (up to 2 ir receivers)
// IRReceiver irreceiver2 = IRReceiver(8);

Motor LeftMotor(1);				// motor pins are built-in to the driver too
Motor RightMotor(2);

ToneGenerator myTone = ToneGenerator(10);	// should be built in here, oh well

//
// hw_readLineFollow() - read the line-follow sensor.  Returns value between 0 and 100.
//
unsigned int hw_readLineFollow()
{
}

//
// hw_readUltraSonic() - read the ultrasonic and return reading between 0 and 100
//                       representing cm distance.
//
unsigned int hw_readUltraSonic()
{
}

//
// hw_readIR() - checks then reads the IR sensor(s). Only if there is an incoming signal
//               does it read the whole IR packet. Reading the whole IR packet takes a bit
//               of time, but this routine returns immediately if there IS not incoming IR.
//
uint32_t hw_readIR()
{
}

//
// hw_motor() - turns on/off the two motors designated by the first arg "motor" as being
//              either 'L' or 'R' for left or right, following by power from -100 to 100.
//
void hw_motor(char motor, int power)
{
     if(power < 100) {
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
}

//
// hw_led() - operates on the given LED with the given pattern. 0 is off, 1 is on,
//            2 is blink.
//
void hw_led(int led, int pattern)
{
}

//
// hw_tone() - turns on a tone for a time. (freq in ms, dur in ms)
//
void hw_tone(int freq, int dur)
{
}

//
// hw_update() - called at the bottom of the loop, updates all relavent
//               hardware.
//
void hw_update()
{
     led1.update();
     led2.update();
     led3.update();
     myTone.update();
}

     
     
