//
// hardware.h
//
//    Definitions of the hardware.  The code ALWAYS calls these. But they are
//    defined based upon the type of hw platform, including SIMULATION as
//    defined in the Makefile. Each of the REAL hardware files needs to implement
//    these functions.
//

unsigned int hw_readLineFollow();	// returns an int between 0 and 100
unsigned int hw_readUltraSonic();	// returns between 0 and 100 (cm) (may use 2 sensors)
uint32_t hw_readIR();			// checks IR for incoming "hit", returns it if so
void hw_motor(char,int);		// sets 'L' or 'R' motor to power between -100 and 100
void hw_motorReverse(char);		// sets either 'L' or 'R' motor to "reverse" mode
void hw_blaster(uint8_t,int,int);	// sends out <count> blasts at <power>
void hw_led(int,int);			// turns on/off/blink LED number X
void hw_tone(int,int);			// turns on tone <freq> for <dur> ms
void hw_update();			// updates all actions - called at end of loop
