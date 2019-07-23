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

     // this motor controller isn't good at ensuring that the change of direction doesn't
     //  cause a high-current short - so we install a delay for use when the direction changes.

     int		pendingSpeed;		// the speed that needs to be set after the delay
     unsigned long	pendingTarget;		// the target millis, afterwhich, set the speed
     int		lastSpeed;		// the previous speed, initializes to 0

public:
     Motor(int);
     void Speed(int);
     void Stop();
     void Reverse(int);
     void Reverse();
     void Update();

private:
     void _speed(int);
     int _delay();
     
};

#endif
