//
// roboxBLE.cpp
//
//   Implements the interface to the BLE device on the Romeo.
//
#include "Arduino.h"
#include "roboxBLE.h"

// DEBUG DEBUG DEBUG 
//#include <SoftwareSerial.h>
//SoftwareSerial debugSerial(2,4);

BLE::BLE()
{
}

void BLE::init()
{
/// DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG DEBUG 
//	debugSerial.begin(38400);

	Serial.begin(115200);

}

// receive() - receives BLE data returning an int that represents the. Returns -1 if nothing is available
//                   (or like a timeout). Returns a single <byte> if there
//                   is something available.
//
int BLE::receive()
{
	if(Serial.available()) {
		return(Serial.read());	// implement timeout too if desired
	}

	return(-1);
}

void BLE::commandMode()
{
	Serial.write("+++");		// introduction to the AT command set on the Romeo

//	delay(1000);			// lets it get into command mode
	delay(500);
}

void BLE::commandModeExit()
{
//	Serial.write("AT+VERSION=?\r\n");
	Serial.write("AT+EXIT\r\n");
}

void BLE::send(byte *outBuffer, int length)
{
	Serial.write(outBuffer,length);
}

//
// dataDump() - dumps data for a specific amount of time to try to catch
//              all of the data that may come back.
//
void BLE::dataDump(int msec)
{
	int		c;
	static int	count = 0;

	unsigned long target = millis() + msec;

	while(target > millis()) {
		if(Serial.available()) {
			c = Serial.read();
			if(count >= 0) {
//				debugSerial.write(c);
			}
		}
	}

	count++;
}

void BLE::dataDump()
{
	int	c;

	while(Serial.available()) {	// dump data to prevent stalling
		c = Serial.read();
//		debugSerial.write(c);
	}
}

//
// getname() - get the configured name on this Romeo.  Up to 13 characters
//             returned.  There is a static buffer in this command that is
//             the location of returned data.
//
const char *BLE::getname()
{
	static char buffer[14];		// up to 13 chars plus null
	char *ptr = buffer;
	int   c;

	commandMode();	// go into command mode
	dataDump(200);

	Serial.write("AT+NAME=?\r\n");
	Serial.flush();				// wait for it to go out

	// read in data up to a newline (skipping the return)

	while(true) {
		// TODO - really need a timeout in here
		if(Serial.available()) {
			c = Serial.read();
//			debugSerial.write(c);
			if(c == '\n' || c == '\r') {
				*ptr = '\0';
				break;
			} else {
				*ptr++ = c;
			}
		}
	}

	Serial.flush();

	dataDump(100);		// to prepare for exit
	commandModeExit();
	dataDump(100);

//	debugSerial.write("exiting");
//	debugSerial.write(strlen(buffer));
	return((const char *)buffer);
}

void BLE::restart()
{
 	Serial.write("AT+RESTART\r\n");
	delay(3000);
}


//
// rename() - rename the BLE on this Romeo - up to 13 characters
//
void BLE::rename(const char *newname)
{
	commandMode();
	dataDump();

	Serial.write("AT+NAME=");
	Serial.write(newname);	// up to 13 characters
	Serial.write("\r\n");

	delay(500);			// allows the name set to get done

	dataDump();

	// A restart is required. It would be nice if a simple:
        //	Serial.write("AT+EXIT\r\n");
	// would suffice. But apparently not.  Note that a restart
	// takes about three or four seconds before it has processed fully.
	// So this routine doesn't even return before those 3 seconds
	// have gone by to prevent spurious input.  NOTE that the
	// connection will have been dropped, too, by the restart.

	restart();

	dataDump();	// dump data to prevent bleeding into future functions

	// if the client is smart, it will automatically reconnect to the appropriate
	// MAC address after doing a rename.
}
