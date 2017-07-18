//
// BLENameChange.ino
//
//   Excersize the BLE driver.
//
#include "Arduino.h"
#include "RoBoxRomeo.h"

BLE BLE;

void setup()
{
	BLE.init();

	BLE.rename("Floopy5");

}

void loop()
{
}
