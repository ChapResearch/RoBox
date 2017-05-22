#include "Arduino.h"
#include "RoBoxRomeo.h"

UltraSonic ultra = UltraSonic(12,11);

void setup() {
  // initialize serial communication:
  Serial.begin(9600);
}

void loop()
{
	unsigned int	mm;

	mm = ultra.measure();

	Serial.print(mm);
	Serial.println("mm");
  
	delay(1000);
}
