//
//      ____  _________  ____ __________ _____ ___ 
//     / __ \/ ___/ __ \/ __ `/ ___/ __ `/ __ `__ \
//    / /_/ / /  / /_/ / /_/ / /  / /_/ / / / / / /
//   / .___/_/   \____/\__, /_/   \__,_/_/ /_/ /_/ 
//  /_/               /____/                       
//
// program.h
//

#ifndef PROGRAM_H
#define PROGRAM_H

class Program {
private:
	int	base;		// a pointer into EEPROM where the program starts
	int	ptr;		// a pointer into the program
	int	baseEnd;	// base+size - lowers the number of adds we need to do!
public:
	int	size;		// size of the program
	Program();
	Program(int,const char *);
	Program(Program,int,int);
	void Dump();
	void Dump(int);
	unsigned char Next();
	int Index();
	void SetIndex(int);
	void Reset();
	bool AtEnd();
	void Skip(int);
	int Position();
};

#endif
