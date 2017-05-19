
#ifndef ROBOXTONE_H
#define ROBOXTONE_H

class ToneGenerator {
private:
     int	pin;		// the pin where the tone will be
     int	freq;		// the current target frequency
     int	halfWaveMicros;	// micro seconds for a half wave
     long	targetMicros;	// next target for half wave toggle
     bool	state;		// used to quickly toggle pin (as opposed to reading it)
     long	stopMillis;	// target millis when tone will stop

public:
     ToneGenerator(int);
     void Play(int,int);	// play the given freq for given duration
     void Stop();		// stops any playing tone
     void Update();		// must be called during loop

     bool status;		// TRUE means currently playing - used internally, but accessible
};
#endif
