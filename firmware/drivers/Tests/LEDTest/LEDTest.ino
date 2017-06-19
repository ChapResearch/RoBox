//
// LED Test
//

#include "Arduino.h"
#include "RoBoxRomeo.h"

LED led1(1);
LED led2(2);
LED led3(3);

void setup()
{
	led1.On();
	delay(500);
	led2.On();
	delay(500);
	led3.On();
	delay(1000);
	led1.Off();
	led2.Off();
	led3.Off();
	
	led1.Blink(1000);
	led2.Blink(500);
	led3.Blink(250);
}

void loop()
{
	led1.Update();
	led2.Update();
	led3.Update();
	
}