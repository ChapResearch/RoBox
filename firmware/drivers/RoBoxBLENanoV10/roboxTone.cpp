//
// tone.cpp
//
//   Produce a specific tone for a specific length of time
//   on the RoBox. The tone() library is used.

#include "Arduino.h"
#include "roboxTone.h"

ToneGenerator::ToneGenerator()
{
     this->pin = 3;
     pinMode(pin,OUTPUT);
     digitalWrite(pin,LOW);
     status = false;
}

//
// Play() - plays the given frequency (in Hz) for the given duration
//          (in deci-seconds - 10 = 1 second)
//
void ToneGenerator::Play(int freq, int duration)
{
	tone(this->pin,freq);   
	status = true;
	targetMicros = micros() + (duration * 100L * 1000L);
}

void ToneGenerator::Update()
{
	if(status && micros() > targetMicros) {
		Stop();
	}
}

void ToneGenerator::Stop()
{
	noTone(pin);
	status = false;
}
