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
	Program(int,int);		// standard load of pre-loaded EEPROM as program
	Program(int,const char *);
	Program(Program,int,int);
	void Dump();
	void Dump(int);
	char Next();		// shifts from byte (unsigned char) to char to get sign extension
	int Index();
	void SetIndex(int);
	void Reset();
	bool AtEnd();
	void Skip(int);
	int Position();
};

#endif
