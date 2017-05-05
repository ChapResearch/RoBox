//      ________________  ____  ____  __  ___
//     / ____/ ____/ __ \/ __ \/ __ \/  |/  /
//    / __/ / __/ / /_/ / /_/ / / / / /|_/ / 
//   / /___/ /___/ ____/ _, _/ /_/ / /  / /  
//  /_____/_____/_/   /_/ |_|\____/_/  /_/   
//
// EEPROM.h
//
// SIMULATED EEPROM
//

#ifdef SIMULATION

#ifndef EEPROM_H
#define EEPROM_H

// here we are simulating a 328 with 1k of eeprom

class simuEEPROM {
private:
	byte buffer[1024];

public:
	byte read(int x) { return(buffer[x]); }
	void write(int x,byte b) { buffer[x] = b; }
	void update(int x,byte b) { buffer[x] = b; }	// doesn't do anything special for simulation
	byte& operator[] (int x) {return(buffer[x]); }
	void funky();
};

extern simuEEPROM EEPROM;

#endif
#endif
	

		
