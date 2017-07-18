#include "Arduino.h"
#include "roboxUltra.h"

//
// roboxUltra.cpp
//
//   Implements the ultrasonic processing on Robox Romeo.
//   (site the source for the template here)
//

UltraSonic::UltraSonic(int trig, int echo)
{
	trig_pin = trig;
	echo_pin = echo;

	pinMode(trig_pin,OUTPUT);
	pinMode(echo_pin,INPUT);
}


// DISTANCE CALCULATIONS
//
// For inches:
// According to Parallax's datasheet for the PING))), there are
// 73.746 microseconds per inch (i.e. sound travels at 1130 feet per
// second).  This gives the distance travelled by the ping, outbound
// and return, so we divide by 2 to get the distance of the obstacle.
// See: http://www.parallax.com/dl/docs/prod/acc/28015-PING-v1.3.pdf
//
// For centimeters:
// The speed of sound is 340 m/s or 29 microseconds per centimeter.
// The ping travels out and back, so to find the distance of the
// object we take half of the distance travelled.
//
// For millimeters:
// The speed of sound is 340 m/s or 2.94 microseconds per millimeter.
// note that the microseconds are inflated to give more resolution

#define usToInches(us)	(us / 74 / 2)
#define usToCm(us)	(us / 29 / 2)
#define usToMm(us)	(us * 100 / 294 / 2)

//
// measure() - when called, uses the ultrasonic to get a measurement.
//             The number of mm is returned.  Minimum measurement,
//             according to specs is 20mm (2cm).  Since we are using
//             an int, the biggest number we can have is 65,536 mm
//             or 6,553.6 cm, or 65km - I think that is enough...
//
unsigned int UltraSonic::Measure()
{
	long duration;

	cli();			// turn off interrupts to get a good measurement

	digitalWrite(trig_pin, LOW);
	delayMicroseconds(2);

	digitalWrite(trig_pin, HIGH);
	delayMicroseconds(10);

	digitalWrite(trig_pin, LOW);

	// Read the signal from the sensor: a HIGH pulse whose
	// duration is the time (in microseconds) from the sending
	// of the ping to the reception of its echo off of an object.

	duration = pulseIn(echo_pin, HIGH);

	sei();

	// convert the time into a distance in mm - empirically, we are
	// always off by 15 mm - undoubtedly due to the time it takes to
	// makes the calls above.

	return((unsigned int)usToMm(duration)-15);
}
