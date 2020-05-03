//
// Motor Test
//
#include "Arduino.h"
#include "roboxDrivers.h"

Motor LeftMotor(1);
Motor RightMotor(2);

void setup()
{
	RightMotor.Reverse();

	LeftMotor.Speed(100);
	delay(2000);
	LeftMotor.Speed(50);
	delay(2000);
	LeftMotor.Speed(-50);
	delay(2000);
	LeftMotor.Speed(-100);
	delay(2000);
	LeftMotor.Stop();
	delay(2000);
	RightMotor.Speed(100);
	delay(2000);
	RightMotor.Speed(50);
	delay(2000);
	RightMotor.Speed(-50);
	delay(2000);
	RightMotor.Speed(-100);
	delay(2000);
	RightMotor.Stop();
	delay(2000);
}

void loop()
{
}

