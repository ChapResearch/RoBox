
#ifndef ROBOXTONE_H
#define ROBOXTONE_H

class ToneGenerator {
private:
     int		pin;		// the pin where the tone will be
     int		freq;		// the current target frequency
     unsigned long	targetMicros;	// next target for half wave toggle

public:
     ToneGenerator();
     void Play(int,int);	// play the given freq for given duration
     void Stop();		// stops any playing tone
     void Update();		// must be called during loop
     bool status;


};
#endif
