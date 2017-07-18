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
//	( - start of sub program
//      ) - end of sub program
//      W - Wheel ('L'/'R',power)
//      S - Start of program
//      D - delay (10'ths of seconds)
//      L - LED (num,op - 0/off, 1/on, 2/toggle, 3/blink)
//      F - Fire! (count,power)
//      B - Beep (freq,dur 10'ths of seconds)
//      RT - Repeat # times (count)
//      RU - Repeat until condition (opA,op,opB)
//      I - If condition do (opA,op,opB)
//      V - set variable (var,op,value)
//      K - break (level)
//      E?

#include "Arduino.h"
#include "program.h"
#include "hardware.h"
#include "roboxMessage.h"
#include "RCL.h"
#include "IR.h"
#include "RXL.h"

#define RXL_VARIABLE_COUNT	10
#define RXL_TOP_VAR		104	// the ordinal of the first variable
static int RXL_Variables[RXL_VARIABLE_COUNT];

// this is the global "hit" indicator - if non-zero, means we were "hit" since the last check
//   the code must set it to zero after it is consumed.

static uint16_t	ir_hit;

// this stores the value of the last If expression evaluation - it is used for
// the "else".  NOTE that if an else isn't right next to an If, then the else
// will STILL take the last If expression evalution no matter where it occured,
// even if in a subprogram. If no If has occurred, then the else is not run.

static bool last_if_value = true;	// default "true" means spurious "else's" won't run

// DEBUG DEBUG DEBUG
//#include <SoftwareSerial.h>
//extern SoftwareSerial debugSerial;

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

	case 'S':		// indicates the start of the program, no args
	    break;

	case 'D':
	    program.Next();     // skip duration
	    break;

	case 'L':
	    program.Next();     // skip LED number
	    program.Next();     // skip on/off
	    break;
	case 'F':
	    program.Next();     // skip count
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
	    case 'U':
		program.Next();	// skip opA
		program.Next();	// skip op
		program.Next();	// skip opB
		break;
	    }
	    break;
	case 'I':
	    program.Next();     // skip first parameter
	    program.Next();     // skip comparison
	    program.Next();     // skip second parameter
	    break;

	case 'V':
	    program.Next();     // skip variable
	    program.Next();     // skip operator
	    program.Next();     // skip second parameter
	    break;

	case 'E':		// no parameters for an else
	    break;	
	    
  
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
    unsigned long sleepTarget = 0;
    RoBoxMessage message;

    // this is a "long-running" routine that moves through the given
    // program, executing commands as it finds them.  At the end of
    // each loop, the incoming RCL commands are checked to look for
    // a "Stop" or one of the other possible running-legal commands.
    //
    // Also, at the end of each loop (which needs to be QUICK) a check
    // is done for an incoming IR hits - just like in the main program.
    // A flag is set when an IR hit occurred.

//    debugSerial.print("Z");

    while(!program.AtEnd()) {
        // DEBUG DEBUG DEBUG 
//        debugSerial.print("X");

	    if(millis() > sleepTarget) {
		    switch(program.Next()) {

		    case 'W':	RXL_Wheel(program);			break;	// turn on/off a wheel

		    case 'S':	RXL_Start(program);			break;  // start of program
			    
		    case 'D':	sleepTarget = RXL_Sleep(program);	break;	// set-up delay/sleep condition

		    case 'L':	RXL_Led(program);			break;	// turn on/off an LED
		    case 'F':	RXL_Ir(program);			break;	// fire the IR blaster
		    case 'B':	RXL_Beep(program);			break;	// generate a tone/beep
		    case 'K':	return(RXL_Break(program));		break; 	// break out of loop, if, or program
		    case 'V':	RXL_Variable(program);			break;	// set a variable
			    
		    case 'I':	
			    break_count = RXL_If(program);	// execute -if- statement
			    if(break_count > 0) {
				    return (break_count);
			    }
			    break;

		    case 'E':	
			    break_count = RXL_Else(program);	// execute -else- statement
			    if(break_count > 0) {
				    return (break_count);
			    }
			    break;

		    case 'R':					// execute a repeat loop
			    break_count = RXL_Repeat(program);
			    if(break_count > 0) {
				    return (break_count);
			    }
			    break;

		    }
	    }

	    // TODO - this receive should be aware of the fact that it SHOULD NOT use
	    //        EEPROM, since a program is running. In fact, only certain messages
	    //        should be received. Otherwise, they should be dumped.

	    if(message.Receive()) {
		    if(RCLIncoming(message,true)) {	// true return means STOP requested
			    return(100);		// breaks out of all levels
		    }
	    }

	    // check for an IR hit

	    {	uint32_t IRvalue;

		    IRvalue = IRHit();
		    if(IRvalue) {
			    RoBoxMessage('I',(IRvalue&0xff00)>>8,IRvalue&0x00ff).Send();
			    ir_hit = IRvalue;
		    }
	    }

	    // update any hardware thingies

	    hw_update();
    }

    while(millis() < sleepTarget);	// don't return until last sleep is done

    return (false);
}

int RXL_Break(Program &program)
{
    int level = (int)program.Next();
    return (level);
}

void RXL_Start(Program &program)
{
	// clear variables

	for(int i=0; i < RXL_VARIABLE_COUNT; i++) {
		RXL_Variables[i] = 0;
	}
}

unsigned long RXL_Sleep(Program &program)
{
	int tenths = (int)program.Next();			// number of tenths of seconds
	return(millis() + ((unsigned long)tenths * 100L));	// max of 10 second seleep
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
	int break_count = 0;
	int subProgramBegin;   // points to the '(' starting the sub-program
	int subProgramEnd;     // points to just after the sub-program ')'

	int rtype = program.Next();	// get the type of repeat

	if(rtype =='T') {	// repeat a certain number of Times

		int times = program.Next();
		int forever = (times == 0);

		// at this point the next character in the program is the opening parenthesis 
		// so we create a sub program from here to the closing parenthesis.

		program.Next(); 			// skip over the '(' lead-in to the sub-statements
		subProgramBegin = program.Position();
		RXL_Skip(program);                      // skips the next statement, in this case a sub-program
		subProgramEnd = program.Position();	// points to just after the sub-program ')'

		Program subprogram(program,subProgramBegin,subProgramEnd-1);

		for(int i = 0; i < times || forever; i++) {
			subprogram.Reset();
			break_count = RXL(subprogram);
			if(break_count > 0) {
				break_count--;
				break;
			}
	 
		}

	} else if(rtype =='U') {	// repeat Until a condition occurs

		int opA = program.Next();	// operand A
		int op = program.Next();	// operation
		int opB = program.Next();	// operand B

		// see above for the sub-program progression here

		program.Next();
		subProgramBegin = program.Position();
		RXL_Skip(program);
		subProgramEnd = program.Position();

		Program subprogram(program,subProgramBegin,subProgramEnd-1);

		while(!RXL_OpEvaluate(opA,op,opB)) {
			subprogram.Reset();
			break_count = RXL(subprogram);
			if(break_count > 0) {
				break_count--;
				break;
			}
		}
	}

	// at this point we're done with the sub-program, the outer program is
	// already advanced past the sub-program due to the Skip
	return(break_count);
}

// 
// RXL_OpEvaluate() - evaluate the operator on the two operands.
//
bool RXL_OpEvaluate(int opA, int op, int opB)
{
	opA = RXL_ValueEvaluate(opA);
	opB = RXL_ValueEvaluate(opB);

	switch(op) {
	case '=':	return(opA == opB);
	case '<':	return(opA < opB);
	case '>':	return(opA > opB);
	case '!':	return(opA != opB);
	case 'G':	return(opA >= opB);
	case 'L':	return(opA <= opB);
	}

	return(false);
}

//
// RXL_ValueEvaluate() - given a value, which may be pointing to a sensor
//                       or variable, return the appropraite value.
//
int RXL_ValueEvaluate(int val)
{
	if(val <= 100) {	// negatives and numbers less than 100
		return(val);
	}

	switch(val) {
	case 101:	// ultrasonic
		val = hw_readUltraSonic();
		break;

	case 102:	// line follow
		val = hw_readLineFollow();
		break;

	case 103:	// ir hit sensor
		if(ir_hit) {
			ir_hit = 0;
			val = 1;
		} else {
			val = 0;
		}
		break;

	default:	// variables above here
		val = RXL_Variables[val-RXL_TOP_VAR];
		break;
	}

	return(val);
}


// 
// RXL_If() - executes the subprogram enclosed in () if the 
//            left value (motor, sensor, integer, etc)
//            is the same as value right value 
//
int RXL_If(Program &program)
{
	int break_count = 0;
	int subProgramBegin;   // points to the '(' starting the sub-program
	int subProgramEnd;     // points to just after the sub-program ')'

	int opA = program.Next();	// operand A
	int op = program.Next();	// operation
	int opB = program.Next();	// operand B

	// see above for the sub-program progression here

	program.Next();
	subProgramBegin = program.Position();
	RXL_Skip(program);
	subProgramEnd = program.Position();

	Program subprogram(program,subProgramBegin,subProgramEnd-1);

	last_if_value = RXL_OpEvaluate(opA,op,opB);

	if(last_if_value) {
		subprogram.Reset();
		break_count = RXL(subprogram);
		if(break_count > 0) {
			// break_count--;	// the "if" doesn't count for the break count - only loops count
		}
	}

	return(break_count);
}

//
// RXL_Else() - just like "If", from a sub-program perspective, except that it takes the last
//              if truth value, and runs the else if that value was false.  Note that it doesn't
//              matter when the last If was run, it will do the opposite of it.
//
int RXL_Else(Program &program)
{
	int break_count = 0;
	int subProgramBegin;   // points to the '(' starting the sub-program
	int subProgramEnd;     // points to just after the sub-program ')'

	// see above for the sub-program progression here

	program.Next();
	subProgramBegin = program.Position();
	RXL_Skip(program);
	subProgramEnd = program.Position();

	Program subprogram(program,subProgramBegin,subProgramEnd-1);

	if(!last_if_value) {
		subprogram.Reset();
		break_count = RXL(subprogram);
		if(break_count > 0) {
			// break_count--;	// the "if" doesn't count for the break count - only loops count
		}
	}

	return(break_count);
}

void RXL_Led(Program &program)
{
	int led = program.Next();
	int on = program.Next();

	hw_led(led, on);
//
// OLD WAY OF DOING LEDS		
//
//     switch(program.Next()){
//     case '1':	  led = 1;	  break;
//     case '2':	  led = 2;	  break;
//     case '3':	  led = 3;	  break;
//     }
//  
//     switch(program.Next()){
//     case '0':	  on = 0;	  break;
//     case '1':	  on = 1;	  break;
//     case '2':	  on = 1;	  break;	// TODO - need other values for blink, etc.
//     }
}

void RXL_Variable(Program &program)
{
	int var = program.Next();	// must be a variable (TODO - make sure it is really a variable)
	int mathOp = program.Next();
	int value = program.Next();	// can be any value, sensor, variable
	int newValue = 0;
	int varValue;

	varValue = RXL_ValueEvaluate(var);	// use the varValue for the formula
	value = RXL_ValueEvaluate(value);	// translate the value of sensor/variable

	switch(mathOp) {
	case '*':	newValue = varValue * value; break;	// TODO - number gets big quickly
	case '+':	newValue = varValue + value; break;
	case '/':	newValue = varValue / value; break;
	case '-':	newValue = varValue - value; break;
	case '=':	newValue = value; break;
	}

	if(newValue > 100) {
		newValue = 100;
	} else if(newValue < -100) {
		newValue = -100;
	}

	RXL_Variables[var-RXL_TOP_VAR] = newValue;
}
