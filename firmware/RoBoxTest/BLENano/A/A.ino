// This file implements arduino code for testing the individual components of the RoBox. 
//
// 1. Test Arch
//    a. 2 IR receivers -- powers 2 LEDs based on what it is receiving
// 2. Test Speaker -- goes through different notes (or alternating) every hundred loops or so (short beep)
// 3. Test Line follow
// 
// These pins are defined in the driver. They are here for convenience purposes
// PINS
// ----
// Line Follow signal - A0
// LED signal -- A1
// IR 1 signal -- 8
// IR 2 signal -- 9
// Ultrasonic trig 12
// Ultrasonic echo 11
// Speaker 10
// IR blaster 13
// 
// 
// LED for IR 1 -- A2
// LED for IR 2 -- A3
// Ultra LED 1 -- 5
// Ultra LED 2 -- 6
// Ultra LED 3 -- 7
// LF LED 1 -- 2
// LF LED 2 -- 3
// LF LED 3 -- 4

#include "Arduino.h"
#include "RoBoxBLENanoV10.h"		// from the roboxromeo library

#define FALSE false
#define TRUE true

#define BLASTLEDTIME 1000

// definitions for indicator leds
#define LF_1_PIN 2
// line follow 2 LED moved because speaker was moved
// keep in mind if servo is added
#define LF_2_PIN 10
#define LF_3_PIN 4
#define IR_1_PIN 6
#define IR_2_PIN 5
#define IND_PIN 3

LED led1(1);
LED led2(2);
LED led3(3);
LineFollow line = LineFollow();
IRReceiver irreceiver1 = IRReceiver(1);
IRReceiver irreceiver2 = IRReceiver(2);
ToneGenerator myTone = ToneGenerator();

long time_ir1 = 0;
long time_ir2 = 0;

void checkIR(IRReceiver *ir, int pin, long *time) 
{
    long now = millis();

    // wait until the last blast wears off
    if(now < *time) {
	return;
    } 

    digitalWrite(pin, LOW);                 // turn off the led

    // if we get a blast, turn on the LED
    //   and then, set our timeout for the LED
    if(ir->checkAndReceive()) {
	*time = now + BLASTLEDTIME;
	digitalWrite(pin, HIGH);
    }
}

void setup() 
{
    // initialize serial communication:
    Serial.begin(9600);
    
    pinMode(LF_1_PIN, OUTPUT);
    pinMode(LF_2_PIN, OUTPUT);
    pinMode(LF_3_PIN, OUTPUT);
    pinMode(IR_1_PIN, OUTPUT);
    pinMode(IR_2_PIN, OUTPUT);
    pinMode(IND_PIN, OUTPUT);
    
    digitalWrite(LF_1_PIN, LOW);
    digitalWrite(LF_2_PIN, LOW);
    digitalWrite(LF_3_PIN, LOW);
    digitalWrite(IR_1_PIN, LOW);
    digitalWrite(IR_2_PIN, LOW);
    digitalWrite(IND_PIN, LOW);
}

void loop()
{
  led1.On();
  led2.On();
  led3.On();
  
  int val = line.Measure();
  //  Serial.println(val);
  digitalWrite(LF_1_PIN, LOW);
  digitalWrite(LF_2_PIN, LOW);
  digitalWrite(LF_3_PIN, LOW);
  if(val < 100) {
    digitalWrite(LF_1_PIN,HIGH);
  } else if(val >= 100 && val < 250) {
    digitalWrite(LF_2_PIN,HIGH);
  } else {
    digitalWrite(LF_3_PIN,HIGH);
  }
  //delay(500);
  
  //  digitalWrite(IND_PIN, HIGH);
  // Test IR receivers
  
  checkIR(&irreceiver1, IR_1_PIN, &time_ir1);
  checkIR(&irreceiver2, IR_2_PIN, &time_ir2);
  //  delay(500);
  //digitalWrite(IND_PIN, LOW);

    /*  led1.On();
  led2.On();
  led3.On();

  long time = millis();
  while(true) {
    long updatedTime = millis();
    if(updatedTime > time+5000) {
      break;
    }
    int val = line.Measure();
    //  Serial.println(val);
    digitalWrite(LF_1_PIN, LOW);
    digitalWrite(LF_2_PIN, LOW);
    digitalWrite(LF_3_PIN, LOW);
    if(val < 100) {
      digitalWrite(LF_1_PIN,HIGH);
    } else if(val >= 100 && val < 250) {
      digitalWrite(LF_2_PIN,HIGH);
    } else {
      digitalWrite(LF_3_PIN,HIGH);
    }
    delay(500);
  }

  
  digitalWrite(IND_PIN, HIGH);
  // Test IR receivers
  time = millis();
  while(true) {
    long updatedTime = millis();
    if(updatedTime > time+500) {
      break;
    }
    checkIR(&irreceiver1, IR_1_PIN, &time_ir1);
    checkIR(&irreceiver2, IR_2_PIN, &time_ir2);
  }

  digitalWrite(IND_PIN, LOW);*/
  /*  led1.On();
  led2.On();
  led3.On();

  long time = millis();
  while(true) {
    long updatedTime = millis();
    if(updatedTime > time+5000) {
      break;
    }
    int val = line.Measure();
    //  Serial.println(val);
    digitalWrite(LF_1_PIN, LOW);
    digitalWrite(LF_2_PIN, LOW);
    digitalWrite(LF_3_PIN, LOW);
    if(val < 100) {
      digitalWrite(LF_1_PIN,HIGH);
    } else if(val >= 100 && val < 250) {
      digitalWrite(LF_2_PIN,HIGH);
    } else {
      digitalWrite(LF_3_PIN,HIGH);
    }
    delay(500);
  }

  
  digitalWrite(IND_PIN, HIGH);
  // Test IR receivers
  time = millis();
  while(true) {
    long updatedTime = millis();
    if(updatedTime > time+500) {
      break;
    }
    checkIR(&irreceiver1, IR_1_PIN, &time_ir1);
    checkIR(&irreceiver2, IR_2_PIN, &time_ir2);
  }

  digitalWrite(IND_PIN, LOW);*/

}	
