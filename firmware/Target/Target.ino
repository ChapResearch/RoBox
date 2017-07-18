#include "Arduino.h"
#include "RoBoxRomeo.h"
#include <Servo.h> 
#include "../RoBox/IR-ID.h"

#define IR	11
#define LED	12
#define SERVO	10
 
Servo myservo;

IRReceiver irreceiver1(IR);

void setup() 
{
     Serial.begin(9600);

     pinMode(LED,OUTPUT);
     digitalWrite(LED,HIGH);
     myservo.attach(SERVO);
     myservo.write(180);
     delay(1000);
     myservo.write(100);
     delay(1000);
     myservo.write(180);
	
     Serial.println("HI!");
}

int UP = 0;
unsigned long LED_Blip;

#define LED_BLIP_MS	100

void loop()
{
	uint32_t value;

	value = irreceiver1.checkAndReceive();

	if(value) {

	     LED_Blip = millis() + LED_BLIP_MS;

	     digitalWrite(LED,LOW);

	     irreceiver1.Debounce();

	     Serial.println(value,HEX);
	}

	if((value >> 16) == IR_BASE_ID) {

//	if(value == (uint32_t)0xC12F40BF) {	// viewsonic power button
	     if(UP) {
		  myservo.write(100);
	     } else {
		  myservo.write(180);
	     }
	     UP = !UP;
	}

	if(millis() > LED_Blip) {
	     digitalWrite(LED,HIGH);
	}
}
