//
// roboxServo.cpp
//
//    Implements the interface to the servo on the RoBox.
//    

#include <Arduino.h>
#include "roboxServo.h"

//
// Servos are controlled by PWM (pulse width modulation)
//   The duration of the pulse determines which position
//   the servo will travel to (generally measured in
//   microseconds from 1000 to 2000).
//

RoBoxServo::RoBoxServo(int pin)
{
  continuous = 0;
  reverse = 0;
  minTime = 800;
  maxTime = 2200;
  servo = new Servo;
  servo->attach(pin);

}

//
// Reverse() - if the given argument evaluates to TRUE, then this motor will be
//             reversed. You can UN-reverse a motor by sending FALSE (zero);
//
void RoBoxServo::Reverse(int r)
{
  reverse = r;
}
void RoBoxServo::Reverse()
{
  reverse = !reverse;
}

//
// Min() - Sets the experimentally determined minimum microseconds
//
void RoBoxServo::Min(int min)
{
  minTime = min;
}

//
// Max() - Sets the experimentally determined maximum microseconds
//
void RoBoxServo::Max(int max)
{
  maxTime = max;
}

//
// Rotate() - for continuous rotation servos, takes number from -100 to 100
//            negative numbers rotate counterclockwise, positive clockwise
//            magnitude is speed
//
void RoBoxServo::Rotate(int speed)
{
  speed = speed * -1;                         // switches signs in order to stay
                                              // true to designated directions
  speed = map(speed, -100, 100, 0, 180);      // continuous rotation servos take
                                              // speed from 0 (clockwise) to
                                              // 180 (counterclockwise)
  servo->write(speed);                               // double check whether this works
                                              // pin 10 might not be able to write()
}

//
// Position() - for non-continuous servos, takes a number from 0 to 100
//              0 takes the servo to its minimum degrees and 100 to its maximum
//
void RoBoxServo::Position(int pos)
{
  int microSeconds = map(pos, 0, 100, minTime, maxTime);
  servo->writeMicroseconds(microSeconds);
}

	
