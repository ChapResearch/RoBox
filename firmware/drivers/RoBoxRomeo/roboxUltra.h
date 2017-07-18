#ifndef ROBOXULTRA_H
#define ROBOXULTRA_H

class UltraSonic {
private:
	int	trig_pin;
	int	echo_pin;

public:
	UltraSonic(int,int);
	unsigned int Measure();
};


#endif
