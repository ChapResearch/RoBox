//
// IR Send Test
//
#include "Arduino.h"
#include "RoBoxRomeo.h"

#define IR_SEND_PIN		13

IRSender irsender = IRSender(IR_SEND_PIN);

void setup()
{
}

void loop()
{
     // NEC-style code - 4 bytes (ADDR1 | ADDR2 | COMMAND1 | COMMAND2)
     //                   c   1   c   7   c   0   3   f
     //     uint32_t IRcode=0b11000001110001111100000000111111;  
     //              
     uint32_t IRcode=0xa55a0001;

     irsender.sendCode(IRcode);

     delay(1000);
}
