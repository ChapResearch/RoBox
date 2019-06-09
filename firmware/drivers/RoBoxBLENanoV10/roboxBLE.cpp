//
// roboxBLE.cpp
//
//   Implements the interface to the BLE device on the BLE-Nano.
//   Almost the same as the Romeo:
//    - different baud rate
//    - different AT command set
//    - no "enterable" command mode
//
#include "Arduino.h"
#include "roboxBLE.h"
#include <avr/wdt.h>

// DEBUG DEBUG DEBUG 
//#include <SoftwareSerial.h>
//SoftwareSerial debugSerial(2,4);

BLE::BLE()
{
}

void BLE::init()
{
	wdt_disable();
	Serial.begin(9600);

	// now get the current name of the BLE-Nano, and keep it locally,
	//   not trying to get it from the board while connected

	//	Serial.write("+++");
	//	delay(1000);
	//	_getname();
	
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
	unsigned long target = millis() + msec;

	while(target > millis()) {
		if(Serial.available()) {
			(void)Serial.read();
		}
	}
}

//
// _getname() - (LOCAL ONLY) get the configured name on this BLE-Nano.  Up to 13
//             chars returned.  There is a static buffer in the BLE object that
//             is filled in with the name.  This routine assumes that we are NOT
//             connected.
//
void BLE::_getname()
{
	char buffer[20];		// up to 13 chars plus null for the name, and 5 more for "NAME:"
	char *nameOnly = buffer + 5;	// the return string is "NAME:<name>" so this points to just the <name>
	char *ptr = buffer;
	int   c;

	dataDump(200);	// clear any incoming data

	Serial.write("AT+NAME\r\n");
	Serial.flush();				// wait for it to go out

	// read in data up to a newline (skipping the return)

	while(true) {
		// TODO - really need a timeout in here
		if(Serial.available()) {
			c = Serial.read();
			if(c == '\n' || c == '\r') {
				*ptr = '\0';
				break;
			} else {
				*ptr++ = c;
			}
		}
	}

	Serial.flush();

	strncpy(myName,nameOnly,13);	// copy only the name part, up to 13 chars
	myName[13] = '\0';		// ensure that the last byte is null
}

//
// getname() - get the configured name on this BLE-Nano.  Up to 13 characters
//             returned.  There is a static buffer in this object that is
//             the location of returned data.  Note that on the BLE-Nano, this
//    	       can only be done while NOT connected.
//
const char *BLE::getname()
{
	return(myName);
}

void BLE::restart()
{
 	Serial.write("AT+RESTART\r\n");	// resets the BLE, then
	wdt_enable(WDTO_2S);		// will cause a whole board reset at 1 second
	delay(3000);			// enough delay to allow the complete reset
	
	// NEVER RETURN FROM THIS!
}


//
// rename() - rename the BLE  - up to 13 characters - NOT YET DONE FOR BLE-Nano
//
void BLE::rename(const char *newname)
{
	//	commandMode();
	dataDump(200);

	Serial.write("AT+NAME=");
	Serial.write(newname);	// up to 13 characters
	Serial.write("\r\n");
	Serial.flush();

	dataDump(500);			// allows the name set to get done

	// A restart is required. It would be nice if a simple:
        //	Serial.write("AT+EXIT\r\n");
	// would suffice. But apparently not.  Note that a restart
	// takes about three or four seconds before it has processed fully.
	// So this routine doesn't even return before those 3 seconds
	// have gone by to prevent spurious input.  NOTE that the
	// connection will have been dropped, too, by the restart.

	restart();

	dataDump(100);	// dump data to prevent bleeding into future functions

	// if the client is smart, it will automatically reconnect to the appropriate
	// MAC address after doing a rename.
}
