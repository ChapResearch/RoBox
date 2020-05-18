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

RoBoxServo::RoBoxServo()
{
  // maxTime and minTime are set by hardware_init
  #define PIN 10
  reverse = 0;
  targetMillis = 0;
  servo = new Servo;
  initialized = false;
}

//
// init() - (PRIVATE) - initializes the servo if it hasn't already been
//                      initialized.  See roboxServo.h for a explanation of
//                      why this is done.
//
void RoBoxServo::init()
{
  if(!initialized) {
    servo->attach(PIN);
    initialized = true;
  }
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
//            magnitude is speed. 0 is where the servo stops. NOTE - it is up
//            to the caller to ensure that 0 stops by setting the min and max
//            of the servo.
//
void RoBoxServo::Rotate(int speed)
{
  init();
 
  targetMillis = 0; // setting to 0 is a flag so nothing will be done in Update()

  int microSeconds;

  if(reverse) {
    microSeconds = map(speed, -100, 100, maxTime, minTime);
  } else {
    microSeconds = map(speed, -100, 100, minTime, maxTime);
  }
  
  servo->writeMicroseconds(microSeconds);

}

//
// Rotate() - rotates at a certain speed (first parameter) for a certain
//            amount of time in milliseconds (second parameter)
//
void RoBoxServo::Rotate(int speed, int time)
{
  init();

  targetMillis = millis() + time;

  int microSeconds;
  
  if(reverse) {
    microSeconds = map(speed, -100, 100, maxTime, minTime);
  } else {
    microSeconds = map(speed, -100, 100, minTime, maxTime);
  }
  
  servo->writeMicroseconds(microSeconds);

}

//
// Position() - for non-continuous servos, takes a number from 0 to 100
//              0 takes the servo to its minimum degrees and 100 to its maximum
//
void RoBoxServo::Position(int pos)
{
  init();
 
  targetMillis = 0; // setting to 0 is a flag so nothing will be done in Update()

  int microSeconds;
  
  if(reverse) {
    microSeconds = map(pos, 0, 100, maxTime, minTime);
  } else {
    microSeconds = map(pos, 0, 100, minTime, maxTime);
  }
  
  servo->writeMicroseconds(microSeconds);

}

//
// Update() - checks to see whether the time for one complete rotation has
//            been met if a single shoot has been kicked off.
//            If so, keeps the servo rotating, otherwise turns it off
//
void RoBoxServo::Update()
{
  if(millis() > targetMillis && targetMillis != 0) {  
    Rotate(0);              // stops rotating the servo after the time for
                            // Rotate() has elapsed
    targetMillis = 0;       // setting to 0 is a flag so nothing will be
                            // done in Update()
  }
  
}

	
