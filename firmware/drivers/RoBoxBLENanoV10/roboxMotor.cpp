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
// Speed() - sets the speed for this motor.  The speed is given between -100 and 100
//           inclusive, where negative numbers are reverse.  This number is translated
//           to the 0-255 value that is required for the motors.
//
void Motor::Speed(int incoming_speed)
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
