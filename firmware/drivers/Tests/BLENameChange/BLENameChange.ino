//
// BLENameChange.ino
//
//   Excersize the BLE driver.
//
#include "Arduino.h"
#include "roboxDrivers.h"

BLE BLE;

void setup()
{
	BLE.init();

	BLE.rename("Floopy5");

}

void loop()
{
}
