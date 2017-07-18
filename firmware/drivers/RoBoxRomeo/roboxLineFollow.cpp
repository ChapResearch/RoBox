#include "Arduino.h"
#include "roboxLineFollow.h"

//
// roboxLineFollow.cpp
//
//   Implements the line follow processing on Robox Romeo.
//   Note that the pin used is built in.
//

LineFollow::LineFollow()
{
     pin = A0;
     pinMode(pin,INPUT);
}

//
// measure() - returns a unitless measurement from the line follow.
//
unsigned int LineFollow::Measure()
{
     return(analogRead(pin));
}
