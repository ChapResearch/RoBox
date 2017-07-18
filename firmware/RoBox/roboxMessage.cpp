//
// roboxMessage.cpp
//
//   Implements robox messages independent upon the receive
//   function.
//

#include "Arduino.h"
#include "roboxMessage.h"
#include "EEPROM.h"

// DEBUG DEBUG DEBUG 
//#include <SoftwareSerial.h>
//extern SoftwareSerial debugSerial;

RoBoxMessage::RoBoxMessage()
{
	message = NULL;
}

RoBoxMessage::RoBoxMessage(char incmd)
{
	cmd = incmd;
	length = 0;
	message = NULL;
}
RoBoxMessage::RoBoxMessage(char incmd, byte arg1)
{
	cmd = incmd;
	length = 1;
	arg[0] = arg1;
	message = NULL;
}
RoBoxMessage::RoBoxMessage(char incmd, byte arg1, byte arg2)
{
	cmd = incmd;
	length = 2;
	arg[0] = arg1;
	arg[1] = arg2;
	message = NULL;
}
RoBoxMessage::RoBoxMessage(char incmd, byte arg1, byte arg2, byte arg3)
{
	cmd = incmd;
	length = 3;
	arg[0] = arg1;
	arg[1] = arg2;
	arg[2] = arg3;
	message = NULL;
}
RoBoxMessage::RoBoxMessage(char incmd, const char *msg)
{
	cmd = incmd;
	message = msg;
	length = strlen(msg);	// doesn't include '\0' ('\0' is a "C++/C" thing)
}


//
// Transfer() - transfer the current message to EEPROM. For large messages, this is a no-op.
//              For normal (small) requests, the data in the args is transferred to EEPROM.
//		This is normally used when wanting to run a program.
//
void RoBoxMessage::Transfer()
{
	if(length <= MAX_INT_PAYLOAD) {		// only transfer little messages
		int ptr = EEPROM_ptr;
		for(unsigned int count = 0; count < length; count++,ptr++) {
			EEPROM.write(ptr,(byte)arg[count]);
		}
	}
}

// 
// Receive() - check for, and receive a message. Returns TRUE if a message was received
//             or FALSE otherwise.
//
//         TODO - there are no timeouts built-in!  This will brick the RoBox until reboot.
//                 This needs to change...
//             
bool RoBoxMessage::Receive()
{
	int incoming_cmd;
	int incoming_length;

	if((incoming_cmd = (*recvfn)()) == -1) {
		return(false);
	}

	// got the command, now go get everything else

	while((incoming_length = (*recvfn)()) == -1) {
		// TODO - some overall timeout here
	}

	cmd = ((incoming_cmd & 0xfc)>>2) | 0x40;
	length = ((incoming_cmd & 0x03) << 8) | incoming_length;

        // DEBUG DEBUG DEBUG 
//	debugSerial.write("- HELLO! -");
//	debugSerial.write(cmd);
//	debugSerial.write(length);
//	debugSerial.write("-");

	if(length > MAX_INT_PAYLOAD) {
		// load into EEPROM starting at "ptr"
		int ptr = EEPROM_ptr;
		for(unsigned int i = 0; i < length; i++, ptr++) {
			char b;
			while((b = (*recvfn)()) == -1) {	// spin-wait for bytes
				// TODO - some overall timeout here
			}
//			debugSerial.write(b);
			EEPROM.write(ptr,b);
		}
//		debugSerial.write("-");
	} else {
		for(unsigned int count = 0; count < length; count++) {

			while((arg[count] = (*recvfn)()) == -1) {	// spin-wait for the bytes
				// TODO - some timeout here
			}

			// for payload bytes, each byte is treated as a little signed int
			// so they must be cast appropriately. The (char) does that below.

			arg[count] = (char)arg[count];

		}
	}

	return(true);
}

//
// Send() - send the current message.  Attempts to keep it all in one "packet",
//          except for strings, which are broken up into two for ease.
//          Special treatment is done for strings since the buffer already exists.
//
void RoBoxMessage::Send()
{
	byte outputBuffer[MAX_INT_PAYLOAD+2];	// +2 for cmd and packet length

	byte outgoing_cmd_byte = ((cmd & 0x3f)<<2) | ((length>>8)&0x03);
	byte outgoing_length_byte = length & 0xff;

	unsigned int i = 0;

	outputBuffer[i++] = outgoing_cmd_byte;
	outputBuffer[i++] = outgoing_length_byte;

	if(message) {	// outgoing string - which is always sub 0x80 so sign doesn't matter
		(*sendfn)(outputBuffer,2);
		(*sendfn)((byte *)message,length);
	} else {
		for(unsigned int j = 0; j < length; j++) {
			outputBuffer[i++] = (byte)arg[j];	// negative arg[i] converts to unsigned byte
		}
		(*sendfn)(outputBuffer,length+2);
	}
}
