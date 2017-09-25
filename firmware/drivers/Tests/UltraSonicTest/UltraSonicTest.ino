#include "Arduino.h"
#include "RoBoxRomeoV20.h"

UltraSonic ultra = UltraSonic();

void setup() {
  // initialize serial communication:
  Serial.begin(9600);
}

void loop()
{
	unsigned int	mm;

	mm = ultra.Measure();

	Serial.print(mm);
	Serial.println("mm");
  
	delay(1000);
}
