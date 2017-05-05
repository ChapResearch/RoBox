//      ________________  ____  ____  __  ___
//     / ____/ ____/ __ \/ __ \/ __ \/  |/  /
//    / __/ / __/ / /_/ / /_/ / / / / /|_/ / 
//   / /___/ /___/ ____/ _, _/ /_/ / /  / /  
//  /_____/_____/_/   /_/ |_|\____/_/  /_/   
//
// SIMULATED EEPROM
//
//    This is used for debugging purposes when not
//    running on the Arduino.
//
//    It must be turned OFF when running on a real
//    Arduino.  Fortunately, it is automagically.

#ifdef SIMULATION

#include "robox.h"
#include "EEPROM.h"

simuEEPROM EEPROM;

#endif

