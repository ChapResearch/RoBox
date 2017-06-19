//
// hwsimulation.cpp
//
//   Definitions of the hw calls for SIMULATION. This file is included by hardware.cpp
//   when SIMULATION is defined. 
//
//#include "Arduino.h"

typedef unsigned char uint8_t;	// until Arduino.h can be defined
typedef unsigned long uint32_t;

#include "debug.h"

//
// hw_readLineFollow() - read the line-follow sensor.  Returns value between 0 and 100.
//
unsigned int hw_readLineFollow()
{
     debugOutput("reading line follow\n");
}

//
// Hw_readUltraSonic() - read the ultrasonic and return reading between 0 and 100
//                       representing cm distance.
//
unsigned int hw_readUltraSonic()
{
     debugOutput("reading ultrasonic\n");
}

//
// hw_readIR() - checks then reads the IR sensor(s). Only if there is an incoming signal
//               does it read the whole IR packet. Reading the whole IR packet takes a bit
//               of time, but this routine returns immediately if there IS not incoming IR.
//
uint32_t hw_readIR()
{
     debugOutput("reading ir\n");
}

//
// hw_motor() - turns on/off the two motors designated by the first arg "motor" as being
//              either 'L' or 'R' for left or right, following by power from -100 to 100.
//
void hw_motor(char motor, int power)
{
     debugOutput("wheel %s power %d\n", (motor=='L'?"left":"right"),power);
}

//
// hw_motorReverse() - sets the given motor to "reverse" mode. Makes programming
//                     left/right opposing motors easier.
//
void hw_motorReverse(char motor)
{
     debugOutput("reversing %d motor\n",motor);
}

//
// hw_blaster() - sends out an IR signal (blasts) that is specific to RoBox. Note
//                that an 8-bit ID is sent in, which is added to the 24-bits of
//                RoBox id.
//
void hw_blaster(uint8_t id, int count, int power)
{
     debugOutput("firing %d shots at %d power, id is %d\n", count, power, id);
}

//
// hw_led() - operates on the given LED with the given pattern. 0 is off, 1 is on,
//            2 is blink.
//
void hw_led(int led, int pattern)
{
     debugOutput("led %d set to %d\n", led, pattern);
}

//
// hw_tone() - turns on a tone for a time. (freq in ms, dur in ms)
//
void hw_tone(int freq, int dur)
{
     debugOutput("beeping at %d freq for %d dur \n", freq, dur);
}

//
// hw_update() - called at the bottom of the loop, updates all relavent
//               hardware.
//
void hw_update()
{
}

     
     
