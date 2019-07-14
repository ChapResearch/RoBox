// This file implements arduino code for testing the individual components of the RoBox. 
//
// 1. Test Arch
//    a. one set of LEDs -- goes through pattern (blue-green-red, red-blue-green)
// 2. Test Ultrasonic -- 3 leds that signal less than an amount, between 2 numbers, and larger
// 3. Test IR blaster -- every 100 loops, blast (offset with ultrasonic)
// 
// These pins are defined in the driver. They are here for convenience purposes
// PINS
// NEED TO UPDATE
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

// not used in this test any more
/*#define LF_1_PIN 2
#define LF_2_PIN 3
#define LF_3_PIN 4
#define IR_1_PIN A2
#define IR_2_PIN A3*/
#define ULTRA_1_PIN 5
#define ULTRA_2_PIN 6
#define ULTRA_3_PIN 7

//LED led1(1);
//LED led2(2);
//LED led3(3);
UltraSonic ultra = UltraSonic();
//IRSender irsender = IRSender();
ToneGenerator myTone = ToneGenerator();

long time_ir1 = 0;
long time_ir2 = 0;
IRSender irsender = IRSender();

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
  //    Serial.begin(9600);

// not used any more
/*    pinMode(LF_1_PIN, OUTPUT);
    pinMode(LF_2_PIN, OUTPUT);
    pinMode(LF_3_PIN, OUTPUT);
    pinMode(IR_1_PIN, OUTPUT);
    pinMode(IR_2_PIN, OUTPUT);*/
    pinMode(ULTRA_1_PIN, OUTPUT);
    pinMode(ULTRA_2_PIN, OUTPUT);
    pinMode(ULTRA_3_PIN, OUTPUT);

/*    digitalWrite(LF_1_PIN, LOW);
    digitalWrite(LF_2_PIN, LOW);
    digitalWrite(LF_3_PIN, LOW);
    digitalWrite(IR_1_PIN, LOW);
    digitalWrite(IR_2_PIN, LOW);*/
    digitalWrite(ULTRA_1_PIN, LOW);
    digitalWrite(ULTRA_2_PIN, LOW);
    digitalWrite(ULTRA_3_PIN, LOW);
}

void loop()
{
  //led1.On();
  //led2.On();
  //led3.On();


  // Test IR blasters
  /*  uint32_t IRcode = 0x10EF0088;
  irsender.sendCode(IRcode);

  long time = millis();
  while(true) {
    long updatedTime = millis();
    if(updatedTime > time+1000) {
      break;
    }
    }*/

  //  digitalWrite(ULTRA_1_PIN, HIGH);
  //  digitalWrite(ULTRA_2_PIN, HIGH);
  //  digitalWrite(ULTRA_3_PIN, HIGH);


  /*long time = millis();

  while(true) {
    long updatedTime = millis();
    if(updatedTime > time+5000) {
      break;
    }
  */
    unsigned int	mm;

    // Test Ultrasonic
    mm = ultra.Measure();
    //    Serial.println(mm);
    digitalWrite(ULTRA_1_PIN, LOW);
    digitalWrite(ULTRA_2_PIN, LOW);
    digitalWrite(ULTRA_3_PIN, LOW);
    if(mm > 500) {
      digitalWrite(ULTRA_1_PIN, HIGH);
    } else if(mm > 100) {
      digitalWrite(ULTRA_2_PIN, HIGH);
    } else {
      digitalWrite(ULTRA_3_PIN, HIGH);
    }
    delay(500);
    //  }

  if(true) {
    uint32_t IRcode = 0x10EF0088;
    irsender.sendCode(IRcode);
  }
  if(true) {
    myTone.Play(440,2);
    delay(250);
    myTone.Update();  
    myTone.Play(880,2);
    delay(250);
    myTone.Update();
  }
} 
