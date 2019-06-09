//
// roboxMotor.h
//

#ifndef ROBOXMOTOR_H
#define ROBOXMOTOR_H

class Motor {
private:
     int	speed_pin;
     int	dir_pin;
     int	reverse;	// TRUE if this motor should be reversed, norm FALSE

public:
     Motor(int);
     void Speed(int);
     void Stop();
     void Reverse(int);
     void Reverse();
};

#endif
