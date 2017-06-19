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
// RXL_SkipToEnd() - skips to the end of the given program. Used
//                   normally used to skip a sub-program.
//
void RXL_Skip(Program &program)
{

    while(!program.AtEnd()) {
	int c = program.Next();
	switch(c) {

        // deal with sub-programs a little specially - note that this will
	// appropriately skip-sub-sub-programs - 

	case '(':                      // skipping over a sub-program (repeat, if, etc.)
	    RXL_Skip(program);         // program is positioned right after the embedded ')'
	    break;

	case ')':               // so return upon sub-program end
	    return;


	case 'W':
	    program.Next();     // skip L/R
	    program.Next();     // skip power
	    break;
	case 'S':
	    program.Next();     // skip duration
	    break;
	case 'L':
	    program.Next();     // skip LED number
	    program.Next();     // skip on/off
	    break;
	case 'F':
	    program.Next();     // skip fire power
	    break;
	case 'B':
	    program.Next();     // skip freq
	    program.Next();     // skip duration
	    break;
	case 'R':
	    switch(program.Next()) {
	    case 'T':
		program.Next(); // skip number times to repeat
		break;
	    }
	    break;
	case 'I':
	    program.Next();     // skip first parameter
	    program.Next();     // skip comparison
	    program.Next();     // skip second parameter
	    break;
//	case 'E':
	    
  
	case 'K':
	    program.Next();     // skip break level
	    break;
	}
    }
}



//
// RXL() - the VM (virtual machine) processor for RXL programs.
//         Pass it a "Program" and it will execute the program.
//
int RXL(Program &program)
{
    int break_count;

    while(!program.AtEnd()) {
	switch(program.Next()) {
	case 'W':
	    RXL_Wheel(program);
	    break;

	case 'S':
	    RXL_Sleep(program);
	    break;

	case 'L':
	    RXL_Led(program);
	    break;

	case 'F':
	    RXL_Ir(program);
	    break;

	case 'B':
	    RXL_Beep(program);
	    break;			

	case 'R':
	    break_count = RXL_Repeat(program);
	    if(break_count > 0) {
		return (break_count);
	    }
	    break;
			
	case 'I':
	    RXL_If(program);
	    break;
			 
	case 'K':
	    return(RXL_Break(program));
	    break;
	}
    }
    return (0);
}

int RXL_Break(Program &program)
{
    int level = (int)program.Next();
    debugOutput("break level %d\n",level);
    return (level);
}

void RXL_Sleep(Program &program)
{
	action_Sleep((int)program.Next());
}

void RXL_Ir(Program &program)
{
  int count = (int)program.Next();
  int pwr = (int)program.Next();
  action_Fire(count, pwr);
}

void RXL_Beep(Program &program)
{
  int freq = (int)program.Next();
  int dur = (int)program.Next();
  action_Beep(freq, dur);

       
}

void RXL_Wheel(Program &program)
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

// 
// RXL_Repeat() - executes the subprogram the number of times specified.
//                It will execute the subprogram forever if the number of times is 0.
//                It returns the number of outer loops from which it should exit.
//
int RXL_Repeat(Program &program)
{

  if(program.Next()=='T') {

      int times = program.Next();
      int forever = (times == 0);

      debugOutput("repeating %d times...\n",times);
      
      // at this point the next character in the program is the opening parenthesis 
      // so we create a sub program from here to the closing parenthesis.

      program.Next(); // skip over the '('

      int subProgramBegin = program.Position();   // points to the '(' starting the sub-program

      RXL_Skip(program);                          // skips the next statement, in this case a sub-program

      int subProgramEnd = program.Position();     // points to just after the sub-program ')'

      Program subprogram(program,subProgramBegin,subProgramEnd-1);

      int break_count;

      for(int i = 0; i < times || forever; i++) {
	  subprogram.Reset();
      	  break_count = RXL(subprogram);
	  if(break_count > 0) {
	    break_count--;
	    break;
	  }
	 
      }

      // at this point we're done with the sub-program, the outer program is
      // already advanced past the sub-program due to the Skip

      return (break_count);
  }

}

// 
// RXL_If() - executes the subprogram enclosed in () if the 
//            left value (motor, sensor, integer, etc)
//            is the same as value right value 
//
void  RXL_If(Program &program)
{
    int left_value  = (int)program.Next();
    char oper = (char)program.Next();
    int right_value  = (int)program.Next();
    bool truth = false;

    /*  if(is_sensor(left_value)) {
	left_value = sensor_map(left_value);
	}*/

    /*  if(is_sensor(right_value)) {
	right_value = sensor_map(right_value);
	}*/

    switch(oper) {
    case '!':  truth = (left_value != right_value); break;
    case '=':  truth = (left_value == right_value); break;
    case '#':  truth = (left_value >= right_value); break;
    case '@':  truth = (left_value <=  right_value); break;
    case '>':  truth = (left_value > right_value); break;
    case '<':  truth = (left_value <= right_value); break;
    }
	
    if(truth) {
	program.Next(); // skip over the '('

	int subProgramBegin = program.Position();   // points to the '(' starting the sub-program
	    
	RXL_Skip(program);                          // skips the next statement, in this case a sub-program

	int subProgramEnd = program.Position();     // points to just after the sub-program ')'

	Program subprogram(program,subProgramBegin,subProgramEnd-1);
    }
	  
}

/*void RXL_Else(Program &program) {
    		program.Next(); //skips '(' enclosing the subprogram

		int subProgramBegin = program.Position();

		RXL_skip(program);

		int subProgramEnd = program.Position();

		Program subprogram(subProgramBegin, subProgramEnd - 1);
}

void RXL_ElseIf(Program &program) {

    if(
		program.Next(); //skips '(' enclosing the subprogram

		int subProgramBegin = program.Position();

		RXL_skip(program);

		int subProgramEnd = program.Position();

		Program subprogram(subProgramBegin, subProgramEnd - 1);
		}*/
		
void RXL_Led(Program &program)
{
  int led;
  int on;

  switch(program.Next()){
  case '1':
    led = 1;
    break;
  case '2':
    led = 2;
    break;
  case '3':
    led = 3;
    break;
  }
  
  switch(program.Next()){
  case '0':
    on = 0;
    break;
  case '1':
    on = 1;
    break;
  }

  action_Led(led, on);
}
