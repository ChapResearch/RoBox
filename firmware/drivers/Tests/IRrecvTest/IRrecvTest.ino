//
// IR Send Test
//
#include "Arduino.h"
#include "RoBoxRomeo.h"

#define IR_RECEIVE_PIN_1	7
#define IR_RECEIVE_PIN_2	8

IRReceiver irreceiver1 = IRReceiver(IR_RECEIVE_PIN_1);
IRReceiver irreceiver2 = IRReceiver(IR_RECEIVE_PIN_2);

void setup()
{
	Serial.begin(9600);
}

void loop()
{
	uint32_t value;

	value = irreceiver1.checkAndReceive();
	if(!value) {
		value = irreceiver2.checkAndReceive();
	}
	if(value) {
		Serial.println(value,HEX);
	}
}
