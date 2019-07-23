//
// roboxMotor.cpp
//
//   Implements the interface to the motors on the RoBox.
//   This driver is specific for the BLE-Nano implementation.
//   It's ALMOST exactly the same as the Romeo V21, except that
//   the motor controller is slightly different (see below).
//
#include "Arduino.h"
#include "roboxMotor.h"

// Motors are controlled through an analogWrite on its speed
//   pin along with setting HIGH/LOW for direction.  Full speed is
//   255 and stopped is zero.  Note, though, that the polarity of speed
//   is reversed for direction=HIGH (meaning that 0 is full speed).

// for the BLENano, given our current board configuration, we
// switched what was M1 and what was M2

#define M1_SPEED_PIN	6
#define M1_DIR_PIN	7

#define M2_SPEED_PIN	5
#define M2_DIR_PIN	4

Motor::Motor(int motor)
{
     reverse = 0;
     pendingSpeed = 0;
     lastSpeed = 0;

     switch(motor) {
     case 1:
	  speed_pin = M1_SPEED_PIN;
	  dir_pin = M1_DIR_PIN;
	  break;
     case 2:
	  speed_pin = M2_SPEED_PIN;
	  dir_pin = M2_DIR_PIN;
	  break;
     }
     pinMode(speed_pin, OUTPUT);
     pinMode(dir_pin, OUTPUT);

}


//
// Reverse() - if the given argument evaluates to TRUE, then this motor will be
//             reversed. You can UN-reverse a motor by sending FALSE (zero);
//
void Motor::Reverse(int r)
{
     reverse = r;
}
void Motor::Reverse()
{
     reverse = !reverse;
}

//
// Speed() - sets the speed for this motor - see _speed().  This front-end ensures that
//           the motor delays between reverses of direction.
//
void Motor::Speed(int incoming_speed)
{

#define SIGNOF(x)	((x>0)?1:((x<0)?-1:0))
	
	if(incoming_speed != 0 && lastSpeed != 0) {	// if setting zero, or coming from zero, we're OK
		if(SIGNOF(lastSpeed) != SIGNOF(incoming_speed)) {
			_speed(0);			// turn OFF the motor prior to the delay
			pendingSpeed = incoming_speed;
			pendingTarget = millis() + _delay();
			return;				// no ACTUAL motor setting happens until after the delay
		}
		// if the signs are the same, we fall through and go ahead with the setting
	}

	// Note - this routine COULD be called multiple times before the pendingTarget is hit
	//   from a previous call.  Each call, therefore, will essentially reset the previous
	//   call through the above.  However, when setting zero, ensure we turn off pending.

	_speed(incoming_speed);
	lastSpeed = incoming_speed;
	pendingSpeed = 0;
}

//
// _delay() - returns an int of delay that should be observed, based upon the lastSpeed
//            in this object.
//
int Motor::_delay()
{
	// this function maps the last speed to a delay, with a minimum delay and a maximum

#define MOTORDELAY_MIN	50
#define MOTORDELAY_MAX	300

	return(map(abs(lastSpeed),0,100,MOTORDELAY_MIN,MOTORDELAY_MAX));
}
	

//
// _speed() - the internal call for ACTUALLY setting the speed for the motor.  Any delays
//            to accomodate the motor controller is implemented in the upper level Speed()
//            call.
//
//	      The speed is given between -100 and 100
//            inclusive, where negative numbers are reverse.  This number is translated
//            to the 0-255 value that is required for the motors.
//
void Motor::_speed(int incoming_speed)
{
     unsigned int speed;
     int	  forward;

     if(incoming_speed < 0) {
         forward = 0;
	 incoming_speed = -incoming_speed;
     } else {
         forward = 1;
     }

     if(incoming_speed > 100) {
	  incoming_speed = 100;
     }

     speed = 255 * incoming_speed / 100;		// translate to 0-255 - stays within 2 bytes

     if(reverse) {
	  forward = !forward;
     }

     if(forward) {
          speed = 255-speed;				// needed for new motor controller for BLE-Nano
	  digitalWrite(dir_pin,HIGH);
     } else {
	  digitalWrite(dir_pin,LOW);
     }
     analogWrite(speed_pin,speed);
}

void Motor::Stop(void)
{
	digitalWrite(speed_pin,LOW); 
}

//
// Update() - the motor controller we are using doesn't have short-circuit (break-before-make)
//            protection when reversing direction. So we have to build in a delay when reversing
//            direction, after setting the speed to zero.  This routine is called at the end of
//            each loop, and will check to see if the delay is over, and if so, execute the
//            pending settings.
//
void Motor::Update(void)
{
	// check to see if we have a pending speed, this means that it was a reverse of speed
	//   and that it can only be executed after the pendingTarget has been reached.
	
	if(pendingSpeed && pendingTarget < millis()) {
		_speed(pendingSpeed);
		lastSpeed = pendingSpeed;
		pendingSpeed = 0;
	}
}
	
