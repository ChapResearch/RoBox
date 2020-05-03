#include "Arduino.h"
#include "roboxDrivers.h"

LineFollow line = LineFollow();

void setup() {
  // initialize serial communication:
  Serial.begin(9600);
}

void loop()
{
	unsigned int val;

	val = line.Measure();
	Serial.println(val);
  
	delay(1000);
}
