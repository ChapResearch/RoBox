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

//
// RXL() - the VM (virtual machine) processor for RXL programs.
//         Pass it a "Program" and it will execute the program.
//
void RXL(Program program)
{
	while(!program.AtEnd()) {
		switch(program.Next()) {
		case 'W':
			Wheel wheel;

			switch(program.Next()) {
			case 'L':
				wheel = WheelLeft;
				break;
			default:
			case 'R':
				wheel = WheelRight;
				break;
			}
			int power = (int)program.Next();
			power = power - 127;
			action_Wheel(wheel,power);
		}
	}
}
