//
// IR Send Test
//
#include "Arduino.h"
#include "roboxDrivers.h"

IRSender irsender = IRSender();

void setup()
{
	Serial.begin(115200);
}

void loop()
{
     // NEC-style code - 4 bytes (ADDR1 | ADDR2 | COMMAND1 | COMMAND2)
     //                   c   1   c   7   c   0   3   f
     //     uint32_t IRcode=0b11000001110001111100000000111111;  
     //              
//     uint32_t IRcode=0xa55a0001;
     uint32_t IRcode=0xC12F40BF;

     irsender.sendCode(IRcode);

     delay(2000);

     Serial.println("bang!");
}
