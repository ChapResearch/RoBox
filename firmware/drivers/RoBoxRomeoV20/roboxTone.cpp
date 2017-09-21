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

ToneGenerator::ToneGenerator(int pin)
{
     this->pin = pin;
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
     this->freq = freq;
     halfWaveMicros = (int)((1.0 / (float)freq)*1000L*1000L/2);
     state = 0;
     stopMillis = millis() + (duration * 100);
     status = true;
     targetMicros = micros() + halfWaveMicros;
}

void ToneGenerator::Update()
{
     if(status && micros() > targetMicros) {
	  digitalWrite(pin,state);
	  state = !state;
	  targetMicros = micros() + halfWaveMicros;

	  // only checking duration at a halfwave switch time
	  if(millis() > stopMillis) {
	       state = 0;
	       digitalWrite(pin,state);
	       status = false;
	  }
     }
}

void ToneGenerator::Stop()
{
     status = false;
}
