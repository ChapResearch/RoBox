#include "Arduino.h"
#include "RoBoxRomeo.h"

LineFollow line = LineFollow();

void setup() {
  // initialize serial communication:
  Serial.begin(9600);
}

void loop()
{
	int val;

	val = line.measure();
	Serial.println(val);
  
	delay(1000);
}
