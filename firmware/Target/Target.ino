#include "Arduino.h"
#include "RoBoxRomeo.h"
#include <Servo.h> 
#include "../RoBox/IR-ID.h"

#define IR	11
#define LED	12
#define SERVO	10
 
Servo myservo;

IRReceiver irreceiver1(IR);

int UP = 1;			// starts in the UP position
unsigned long LED_Blip;

int upLimit = 180;
int downLimit = 110;

unsigned long returnUpTime;	// set to time when target goes back up

#define LED_BLIP_MS	100

// MODES!
//    1 - standard UP upon hit, then DOWN upon hit
//    2 - normally UP, when hit, go down then back up after 3 seconds
//    3 - normally UP, when hit, go down then back up after 5 seconds

int mode = 1;			// starts off in "normal" mode


void setup() 
{
	Serial.begin(9600);

	pinMode(LED,OUTPUT);
	digitalWrite(LED,HIGH);
	myservo.attach(SERVO);
	myservo.write(upLimit);
	delay(1000);
	myservo.write(downLimit);
	delay(1000);
	myservo.write(upLimit);
	
	Serial.println("HI!");
}

//
// operate() - given the particular mode, do the particular operation.
//
void operate()
{
	switch(mode) {
	case 1:			// hit goes down, hit goes up
		if(UP) {
			myservo.write(downLimit);
		} else {
			myservo.write(upLimit);
		}
		UP = !UP;
		returnUpTime = 0;	// doesn't automatically go back up
		break;

	case 2:			// hit goes down, back up in 3 seconds
		if(UP) {
			myservo.write(downLimit);
			returnUpTime = millis() + 3000;
			UP = !UP;
		}
		break;

	case 3:			// hit goes down, back up in 6 seconds
		if(UP) {
			myservo.write(downLimit);
			returnUpTime = millis() + 6000;
			UP = !UP;
		}
		break;
	}
}

//
// operateCleanUp() - some modes need to clean-up after an operation
//                    occurred. This routine should be called at the
//                    end of each loop so that the cleanup can occur.
//
void operateCleanUp()
{
	// for normal operations, the LED "blips" when a hit is registered

	if(millis() > LED_Blip) {
		digitalWrite(LED,HIGH);
	}

	if(returnUpTime) {
		if(millis() > returnUpTime) {
			myservo.write(upLimit);
			returnUpTime = 0;
			UP = !UP;
		}
	}
}

//
// indicateMode() - do a quick indication of the mode - locks everything
//                  out while doing so.
//
void indicateMode()
{
	digitalWrite(LED,LOW);	
	delay(1000);
	for(int i=mode; i--; ) {
		digitalWrite(LED,HIGH);
		delay(300);
		digitalWrite(LED,LOW);
		delay(300);
	}
	delay(1000);
	digitalWrite(LED,HIGH);
}

//
// checkForMode() - check the incoming id to see if it is a mode switch.
//                  If so, switch the mode, and indicate the switch.
//                  Returns true if a mode switch occurred, false otherwise.
//
bool checkForMode(uint16_t command)
{
	switch(command) {
	case IR_A_CODE1:
	case IR_A_CODE2:
			mode = 1; return(true); break;	// sparkfun A key
			
	case IR_B_CODE1:
	case IR_B_CODE2:
			mode = 2; return(true); break;	// sparkfun B key
			
	case IR_C_CODE1:
	case IR_C_CODE2:
			mode = 3; return(true); break;	// sparkfun C key
	}

	return(false);
}

void loop()
{
	uint32_t value;
	uint16_t id;

	value = irreceiver1.checkAndReceive();

	// if an IR value is received, register it with an LED "blip"

	if(value) {
	     LED_Blip = millis() + LED_BLIP_MS;
	     digitalWrite(LED,LOW);
	     irreceiver1.Debounce();		// stop multiple hits
	     Serial.println(value,HEX);
	}

	if(IRHIT(value)) {
		id = value & 0x0000ffff;

		if(checkForMode(id)) {		// check to see if there is a mode switch command
			indicateMode();         //   if so, don't adjust the target, just switch mode
		} else {
			operate();
		}	
	}	

	operateCleanUp();
}
