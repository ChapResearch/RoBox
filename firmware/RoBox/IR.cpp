//
// IR.cpp
//
//   Implements the check for IR hits.
//
#include "Arduino.h"
#include "hardware.h"
#include "IR-ID.h"

uint16_t IRHit()
{
	uint32_t IRvalue;

	IRvalue = hw_readIR();

	if(IRvalue) {	

		// DEBUG DEBUG DEBUG DEBUG DEBUG 
		hw_led(2,2);

		if(((IRvalue & 0xffff0000)>>16) == IR_BASE_ID) {
			return(IRvalue & 0xffff);
		}
	}

	return(0);
}
