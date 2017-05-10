//                __  _                 
//    ____ ______/ /_(_)___  ____  _____
//   / __ `/ ___/ __/ / __ \/ __ \/ ___/
//  / /_/ / /__/ /_/ / /_/ / / / (__  ) 
//  \__,_/\___/\__/_/\____/_/ /_/____/  
//
//  actions.cpp
//
//    Standard "actions" that the robot can take, like turn on
//    motor or read sensor.
//

#include "actions.h"
#include "debug.h"

//
// action_Wheel() - causes a wheel to move. Returns TRUE if the
//                  action was successful, which in this case means
//                  that the action was STARTED as opposed to finished.
//                  "wheel" is one of Wheel::Left or Wheel::Right,
//                  and power is between -100 and 100 where negative
//                  is reverse.
//
bool action_Wheel(Wheel wheel, int power)
{
	debugOutput("wheel %s power %d\n", (wheel==WheelLeft?"left":"right"),power);

	return(true);
}

//
// action_Sleep() - sleeps for the given number of deciseconds (tenths of seconds).
//                  Note that this routine, in the real future, will set up a condition
//                  where it will still allow processing while "sleeping".
//
bool action_Sleep(int ds)
{
	debugOutput("sleeping for %d ds\n",ds);
	return(true);
}


bool action_Beep(int freq, int dur)
{
  debugOutput("beeping at %d freq for %d dur \n", freq, dur);
	return(true);
}

