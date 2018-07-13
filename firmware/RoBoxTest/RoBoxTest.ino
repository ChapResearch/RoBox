// This file implements arduino code for testing the individual components of the RoBox. 
//
// 1. Test Arch
//    a. 2 IR receivers -- powers 2 LEDs based on what it is receiving
//    b. one set of LEDs -- goes through pattern (blue-green-red, red-blue-green)
// 2. Test Ultrasonic -- 3 leds that signal less than an amount, between 2 numbers, and larger
// 3. Test Speaker -- goes through different notes (or alternating) every hundred loops or so (short beep)
// 4. Test IR blaster -- every 100 loops, blast (offset with ultrasonic)
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
#include "RoBoxRomeoV21.h"		// from the roboxromeo library

#define FALSE false
#define TRUE true

#define BLASTLEDTIME 1000

// definitions for indicator leds
#define LF_1_PIN 2
#define LF_2_PIN 3
#define LF_3_PIN 4
#define IR_1_PIN A2
#define IR_2_PIN A3
#define ULTRA_1_PIN 5
#define ULTRA_2_PIN 6
#define ULTRA_3_PIN 7

LED led1(1);
LED led2(2);
LED led3(3);
LineFollow line = LineFollow();
UltraSonic ultra = UltraSonic();
IRSender irsender = IRSender();
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
    pinMode(ULTRA_1_PIN, OUTPUT);
    pinMode(ULTRA_2_PIN, OUTPUT);
    pinMode(ULTRA_3_PIN, OUTPUT);

    digitalWrite(LF_1_PIN, LOW);
    digitalWrite(LF_2_PIN, LOW);
    digitalWrite(LF_3_PIN, LOW);
    digitalWrite(IR_1_PIN, LOW);
    digitalWrite(IR_2_PIN, LOW);
    digitalWrite(ULTRA_1_PIN, LOW);
    digitalWrite(ULTRA_2_PIN, LOW);
    digitalWrite(ULTRA_3_PIN, LOW);
}

#define LEDLOOPCOUNT 30000
#define LFLOOPCOUNT 30000
#define IRBLASTLOOPCOUNT 10000
#define ULTRALOOPCOUNT 30000
#define TONELOOPCOUNT 30000

static int ledLoopCount = 0;
static int lfLoopCount = 0;
static int irBlastLoopCount = 0;
static int ultraLoopCount = 0;
static int toneLoopCount = 0;

void loop()
{
    if(FALSE) {
	if(ultraLoopCount == ULTRALOOPCOUNT) {
	    ultraLoopCount = 0;
	    unsigned int	mm;
	    mm = ultra.Measure();
	    //Serial.println(mm);
	    digitalWrite(ULTRA_1_PIN, LOW);
	    digitalWrite(ULTRA_2_PIN, LOW);
	    digitalWrite(ULTRA_3_PIN, LOW);
	    if(mm > 1000) {
		digitalWrite(ULTRA_1_PIN, HIGH);
	    } else if(mm > 100) {
		digitalWrite(ULTRA_2_PIN, HIGH);
	    } else {
		digitalWrite(ULTRA_3_PIN, HIGH);
	    }
	} else {
	    ultraLoopCount++;
	}
    }
    
    if(TRUE) {
	if(toneLoopCount == TONELOOPCOUNT) {
	    toneLoopCount = 0;
	    int freq = random(110, 2000);
	    myTone.Play(freq,1);	    
	} else {
	    toneLoopCount++;
	}
    }

    if(TRUE) {
	if(irBlastLoopCount == IRBLASTLOOPCOUNT) {
	    irBlastLoopCount = 0;

	    // NEC-style code - 4 bytes (ADDR1 | ADDR2 | COMMAND1 | COMMAND2)
	    //                   c   1   c   7   c   0   3   f
	    //     uint32_t IRcode=0b11000001110001111100000000111111;  
	    //              
	    //     uint32_t IRcode=0xa55a0001;
	    Serial.println("blast");
	    uint32_t IRcode = 0x10EF0088;
	    irsender.sendCode(IRcode);
	} else {
	    irBlastLoopCount++;
	}
    }

    if(FALSE) {	
	if(ledLoopCount == LEDLOOPCOUNT) {
	    ledLoopCount = 0;
	    led1.Toggle();
	    led2.Toggle();
	    led3.Toggle();
	} else {
	    ledLoopCount++;
	}
    }

    if(FALSE) {	
	if(lfLoopCount == LFLOOPCOUNT) {
	    lfLoopCount = 0;
	    int val = line.Measure();
            //	    Serial.println(val);
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
	} else {
	    lfLoopCount++;
	}
    }

    if(FALSE) {
	checkIR(&irreceiver1, IR_1_PIN, &time_ir1);
	checkIR(&irreceiver2, IR_2_PIN, &time_ir2);
    }
    
    if(FALSE) {
	led1.Update();
	led2.Update();
	led3.Update();
    }

    if(FALSE) {
	myTone.Update();
    }
}	
