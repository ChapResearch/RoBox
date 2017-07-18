//     ____        ____            
//    / __ \____  / __ )____  _  __
//   / /_/ / __ \/ __  / __ \| |/_/
//  / _, _/ /_/ / /_/ / /_/ />  <  
// /_/ |_|\____/_____/\____/_/|_|  
//
//  This is the main RoBox controller program. It makes use of
//  everything else in drivers to implement the program.
//  So note that everything is NOT in this directory.
//

#include "Arduino.h"

// NOTE - the organization here is such that THIS file just includes
//        the "hardware.h" file and it includes all of the right
//        libraries based upon the Makefile configuration (and the
//        #defines therein). Any file needing access the the hardware
//        needs to include this file.
//
// NOTE - it is expected that the hardware is setup automatically
//        when the file is loaded. That is, nothing needs to be done
//        in the setup() routine.

#include "hardware.h"
#include "roboxMessage.h"
#include "RCL.h"
#include "IR.h"

// DEBUG DEBUG DEBUG 
//#include "SoftwareSerial.h"
//SoftwareSerial debugSerial(2,4);

// Set the send/receive functions for all members of the RoBoxMessage class

int (* RoBoxMessage::recvfn)() = hw_bleReceive;
void (* RoBoxMessage::sendfn)(byte*,int) = hw_bleSend;

// Incoming large/rename/program messages are stored in EEPROM beginning at this pointer

int RoBoxMessage::EEPROM_ptr = 0;

RoBoxMessage message;

void setup()
{
/// DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG 
//	debugSerial.begin(38400);

	hw_bleStart();
//	hw_led(1,1);
}

void loop()
{
	static long	loopTracker = 0;
	loopTracker++;

	if (false)
	{	// DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG 
		// This block will toggle led #1 every N times through this loop

		if( (loopTracker % 5000) == 0) {
			hw_led(1,2);
		}
	}

	if(false) {	// DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG 
		// This block will send out line follow status every N times through this loop

		if( (loopTracker % 5000) == 0) {
			// creates a quite temporary message object and sends it immediately
			RoBoxMessage('U',hw_readUltraSonic()).Send();
		}
		if( (loopTracker % 5000) == 2500) {
			// creates a quite temporary message object and sends it immediately
			RoBoxMessage('L',hw_readLineFollow()).Send();
		}
	}

	if(message.Receive()) {

/// DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG 
//		debugSerial.print("-");
//		debugSerial.print(message.cmd,HEX);
//		debugSerial.print(message.length,HEX);
//		debugSerial.print(message.arg[0],HEX);
//		debugSerial.print(message.arg[1],HEX);

		// DEBUG DEBUG DEBUG (toggle LED when a message is received)
		// hw_led(3,2);
		RCLIncoming(message,false);	// note that this routine will recursively call
		                                //   message.Receive() when running a program
	}

	// check for an IR hit

	{	uint32_t IRvalue;

		IRvalue = IRHit();
		if(IRvalue) {
			// DEBUG DEBUG DEBUG (toggle LED upon hit)
			// hw_led(2,2);
			RoBoxMessage('I',(IRvalue&0xff00)>>8,IRvalue&0x00ff).Send();
		}
	}

	// this needs to be called at the end of the loop() and will normally 
	//   do things such as keep a tone going or flash LEDs

	hw_update();
}
