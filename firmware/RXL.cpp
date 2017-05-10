//      ____ _  __ __ 
//     / __ \ |/ // / 
//    / /_/ /   // /  
//   / _, _/   |/ /___
//  /_/ |_/_/|_/_____/
// 
// rxl.cpp
//
//   Implements RXL processing.
//

#include "actions.h"
#include "debug.h"
#include "program.h"
#include "RXL.h"

//
// RXL() - the VM (virtual machine) processor for RXL programs.
//         Pass it a "Program" and it will execute the program.
//
void RXL(Program program)
{
	while(!program.AtEnd()) {
		switch(program.Next()) {
		case 'W':
			RXL_Wheel(program);
			break;

		case 'S':
			RXL_Sleep(program);
			break;

		case 'B':
			RXL_Beep(program);
			break;			
		}
	}
}

void RXL_Sleep(Program program)
{
	action_Sleep((int)program.Next());
}

void RXL_Beep(Program program)
{
  int freq = program.Next();
  int dur = program.Next();
  action_Beep(freq, dur);

       
}

void RXL_Wheel(Program program)
{
	Wheel wheel;
	int power;

	switch(program.Next()) {
	case 'L':
		wheel = WheelLeft;
		break;
	default:
	case 'R':
		wheel = WheelRight;
		break;
	}

	power = (int)program.Next();
	power = power - 127;
	action_Wheel(wheel,power);
}
