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
//
//#include "Arduino.h"
#include "program.h"
#include "hardware.h"
#include "IR.h"
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
    long sleepTarget = 0;
    RoBoxMessage message;
    uint16_t	hit;		// if non-zero, means we were "hit" since the last check

    // TODO - need to propagate the hit to sub programs, or something...

    // this is a "long-running" routine that moves through the given
    // program, executing commands as it finds them.  At the end of
    // each loop, the incoming RCL commands are checked to look for
    // a "Stop" or one of the other possible running-legal commands.
    //
    // Also, at the end of each loop (which needs to be QUICK) a check
    // is done for an incoming IR hits - just like in the main program.
    // A flag is set when an IR hit occurred.

    while(!program.AtEnd()) {
	    if(millis() > sleepTarget) {
		    switch(program.Next()) {

		    case 'W':	RXL_Wheel(program);			break;	// turn on/off a wheel
		    case 'S':	sleepTarget = RXL_Sleep(program);	break;	// set-up sleep condition
		    case 'L':	RXL_Led(program);			break;	// turn on/off an LED
		    case 'F':	RXL_Ir(program);			break;	// fire the IR blaster
		    case 'B':	RXL_Beep(program);			break;	// generate a tone/beep
		    case 'I':	RXL_If(program);			break;	// execute -if- statement
		    case 'K':	return(RXL_Break(program));		break; 	// break out of loop, if, or program

		    case 'R':					// execute a repeat loop
			    break_count = RXL_Repeat(program);
			    if(break_count > 0) {
				    return (break_count);
			    }
			    break;
			
		    }
	    }

	    // check for incoming message that may have a bearing on the current run,
	    // or is simply a request for data.

	    if(message.Receive()) {
		    if(RCL_Incoming(message,true)) {	// true return means STOP requested
			    return(100);		// breaks out of all levels
		    }
	    }

	    // check for an IR hit

	    {	uint32_t IRvalue;

		    IRvalue = IRHit();
		    if(IRvalue) {
			    RoBoxMessage('I',(IRvalue&0xff00)>>8,IRvalue&0x00ff).Send();
			    hit = IRvalue;
		    }
	    }

	    // update any hardware thingies

	    hw_update();
    }
    return (false);
}

int RXL_Break(Program &program)
{
    int level = (int)program.Next();
    return (level);
}

void RXL_Sleep(Program &program)
{
	int tenths = (int)program.Next();		// number of tenths of seconds
	return(millis() + tenths * 100);		// max of 10 second seleep
}

void RXL_Ir(Program &program)
{
     int count = (int)program.Next();
     int pwr = (int)program.Next();
     hw_blaster((uint8_t)0x88,count,pwr);
}

void RXL_Beep(Program &program)
{
  int freq = (int)program.Next();
  int dur = (int)program.Next();
  hw_tone(freq,dur);
}

void RXL_Wheel(Program &program)
{
	int power;
	char wheel;

	wheel = program.Next();
	power = (int)program.Next();
	power = power - 127;

	hw_motor(wheel,power);
}

// 
// RXL_Repeat() - executes the subprogram the number of times specified.
//                It will execute the subprogram forever if the number of times is 0.
//                It returns the number of outer loops from which it should exit.
//
//                    T = repeat for number of times
//		      ?C = repeat until a condition is met
//
int RXL_Repeat(Program &program)
{

  if(program.Next()=='T') {

      int times = program.Next();
      int forever = (times == 0);

      // at this point the next character in the program is the opening parenthesis 
      // so we create a sub program from here to the closing parenthesis.

      program.Next(); // skip over the '(' lead-in to the sub-statements

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
>>>>>>> 1c9fb32c418ecfb23baaa77202bc490ebfc0af03
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
     case '1':	  led = 1;	  break;
     case '2':	  led = 2;	  break;
     case '3':	  led = 3;	  break;
     }
  
     switch(program.Next()){
     case '0':	  on = 0;	  break;
     case '1':	  on = 1;	  break;
     case '2':	  on = 1;	  break;	// TODO - need other values for blink, etc.
     }

     hw_led(led, on);
}
