//
// roboxMotor.cpp
//
//   Implements the interface to the motors on the Romeo.
//   Pretty simple, really. The motors are in a fix position
//   on the Romeo, even without RoBox, so those constants are
//   rather, shall we say, constant, so they are in here, as
//   opposed to in the constructor.
//
#include "Arduino.h"
#include "roboxMotor.h"

// Motors are controlled through an analogWrite on its speed
//   pin along with setting HIGH/LOW for direction.  Full speed is
//   255 and stopped is zero.  Note, though, that the polarity of speed
//   is reversed for direction=HIGH (meaning that 0 is full speed).

#define M1_SPEED_PIN	5
#define M1_DIR_PIN	3

#define M2_SPEED_PIN	6
#define M2_DIR_PIN	9

Motor::Motor(int motor)
{
     reverse = 0;

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
// Speed() - sets the speed for this motor.  The speed is given between -100 and 100
//           inclusive, where negative numbers are reverse.  This number is translated
//           to the 0-255 value that is required for the Romeo motors.
//
void Motor::Speed(int incoming_speed)
{
     unsigned int speed;
     int	  forward;

     if(incoming_speed < 0) {
	  forward = 0;
	  speed = -incoming_speed;
     } else {
       forward = 1;
	  speed = incoming_speed;
     }

     if(speed > 100) {
	  speed = 100;
     }

     speed = 255 * speed / 100;		// translate to 0-255 - stays within 2 bytes

     if(reverse) {
	  forward = !forward;
     }

     if(forward) {
	  analogWrite(speed_pin,speed);
	  digitalWrite(dir_pin,LOW);
     } else {
	  analogWrite(speed_pin,255-speed);
	  digitalWrite(dir_pin,HIGH);
     }
}

void Motor::Stop()
{
     analogWrite(speed_pin,0);
     digitalWrite(dir_pin,LOW);
}
