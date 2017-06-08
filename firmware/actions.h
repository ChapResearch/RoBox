//                __  _                 
//    ____ ______/ /_(_)___  ____  _____
//   / __ `/ ___/ __/ / __ \/ __ \/ ___/
//  / /_/ / /__/ /_/ / /_/ / / / (__  ) 
//  \__,_/\___/\__/_/\____/_/ /_/____/  
//
//  actions.h
//

#ifndef ACTIONS_H
#define ACTIONS_H

enum Wheel { WheelLeft, WheelRight };

bool action_Wheel(Wheel,int);
bool action_Sleep(int);
bool action_Beep(int, int);
bool action_Led(int, int);
bool action_Fire(int, int);

#endif
