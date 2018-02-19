//
// IR Send Test
//
#include "Arduino.h"
#include "RoBoxRomeoV20.h"

IRReceiver irreceiver1 = IRReceiver(1);
IRReceiver irreceiver2 = IRReceiver(2);

void setup()
{
	Serial.begin(9600);
}

void loop()
{
	uint32_t value;

	value = irreceiver1.checkAndReceive();
	if(!value) {
//		value = irreceiver2.checkAndReceive();
	}
	if(value) {
		Serial.println(value,HEX);
	}
}
