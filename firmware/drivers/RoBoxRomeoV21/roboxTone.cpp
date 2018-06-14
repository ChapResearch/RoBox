//
// tone.cpp
//
//   Produce a specific tone for a specific length of time
//   on the RoBox. The tough part is that we don't have the
//   timers available - they're all being used for other 
//   things like the motors.
//
//   So we count on the main loop coming around VERY quickly
//   to maintain a decent waveform on the speaker pin. If that
//   speed isn't maintained, then the sound will get distorted.
//   Which isn't fatal.
//
//   The tone routine doesn't try to stop crazy frequencies that
//   we have no shot in keeping up with.  However, if you consider
//   880Hz (an octave above "standard" 440Hz) then:
//      Freq: 880Hz (880 cycles/second)
//      Period: 1/880 = 0.001136 seconds = 1.1 ms
//      1/2 Period: 1/880/2 = 0.0005681 seconds = 570 us
//
//   So that loop speed is rather fast, and it may be difficult to
//   keep up.  So the tones are going to be rather low to be
//   effective.

#include "Arduino.h"
#include "roboxTone.h"

ToneGenerator::ToneGenerator()
{
     this->pin = 10;
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
