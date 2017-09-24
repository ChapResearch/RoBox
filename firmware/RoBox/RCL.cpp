//
// RCL.cpp
//
//   Processes incoming RoBox commands using the RCL protocol.
//   Current commands are:
//
//	L - line follow sensor report (valid during run)	- same return command
//	U - ultra-sonic sensor report (valid during run)	- same return command
//	V - version report (valid during run)	       	- same return command
//	S - STOP! (valid during run)				- same return command
//	N - reName the robox (NOT valid during run)
//      D - IR ID set (NOT valid during run)
//	R - RUN! (NOT valid while already running)
//	P - program download (NOT valid during run)
//	M - motor command (NOT valid during run)
//	B - blast the IR (NOT valid during run)
//	E - LED on/off (NOT valid during run)
//	T - tone/speaker/beep (NOT valid during run)
//
//	I - incoming blast - only return, ignored incoming
//

#include "Arduino.h"
#include "roboxMessage.h"
#include "RCL.h"
#include "hardware.h"
#include "version.h"
#include "program.h"
#include "RXL.h"

// DEBUG DEBUG DEBUG
//#include <SoftwareSerial.h>
//extern SoftwareSerial debugSerial;
//SoftwareSerial debugSerial(2,4);

//
// RCLIncoming() - process incoming RCL command and do what it says.
//             Note that this routine returns right away, except
//             for two cases:  (1) when a return message is required
//             it is send right away, and (2) when processing a
//             RUN command, the program starts running right away.
//
//		Returns true if a stop was received, so the current
//              running program (if any) should be stopped.
//
bool RCLIncoming(RoBoxMessage &message, bool running)
{
// DEBUG DEBUG DEBUG 
//	debugSerial.begin(38400);

	static Program *lastProgram = NULL;

	switch(message.cmd) {

	// ------------- valid during run --------------------

		
	case 'L':	RoBoxMessage('L',hw_readLineFollow()).Send();				break;
	case 'U':	RoBoxMessage('U',hw_readUltraSonic()).Send();				break;
	case 'V':	RoBoxMessage('V',ROBOX_VERSION_MAJOR,ROBOX_VERSION_MINOR).Send();	break;
	case 'G':	RoBoxMessage('G',hw_getname()).Send();					break;
		
	case 'S':	return(true);	/* stop current program */				break;

	// ------------- NOT valid during run --------------------

	case 'E':			// turn on/off an LED
		if(!running) {
			hw_led(message.arg[0],message.arg[1]);			
		}
		break;

	case 'T':			// tone/speaker/beep
		if(!running) {
			hw_tone(message.arg[0],message.arg[1]);			
		}
		break;

	case 'N':			// Rename the RoBox - arg is name - up to NN characters
		                        // Long (normal) names are already in EEPROM
		                        // TODO - which is a problem if we're already RUNNING a program!
		if(!running) {
			char buffer[14];		// max 13 chars (plus '\0')
			message.toString(buffer,14);
			hw_setname(buffer);
		}
		break;

	case 'D':			// Change RoBox IR ID - arg is 2 bytes of ID
		if(!running) {
			// TODO - 2 bytes from args
		}
		break;

	case 'R':			// RUN command - no args
		if(!running) {

			RXL(*lastProgram);		// RUN LAST PROGRAM!

			// Note that this doesn't return immediately here...it stays 
			//     in the processing loop until the program is done or stopped -
			//     this involves, too, recursively calling this RCL routine
			//     to see if we got a "Stop".
			//
			//     When the RXL() routine calls RCLIncoming() it sets "running"
			//     running to true, so that we don't recursively run programs,
			//     or let someone drive while a program is running.

			// when RXL() comes back, it was either stopped or got done, in
			// either case, send back a stop message.

			RoBoxMessage('S').Send();	// send a stop message back to client
		}
		
		// turn off the motors!
		hw_motor('L',0);
		hw_motor('R',0);

		break;

	case 'P':			// Program command - already loaded into EEPROM 
		                        // TODO - which is a problem if we're already RUNNING a program!
		if(!running) {
			message.Transfer();		// transfer the program to EEPROM (if small)
			if(lastProgram) {
				delete lastProgram;
			}
			lastProgram = new Program(RoBoxMessage::EEPROM_ptr,message.length);
		}
		break;

	case 'M':			// Motor command - 2 args  motor number and power
		if(!running) {
			hw_motor(message.arg[0],message.arg[1]);
		}
		break;		

	case 'B':			// Blast - 2 args
		if(!running) {

#define ROBOX_IND_IR_ID	0x12
			hw_blaster(ROBOX_IND_IR_ID,message.arg[0],message.arg[1]);
		}
		break;
	}

	return(false);
}

void RCLOutgoing(char *cmd, int arg1, int arg2)
{
	
}
