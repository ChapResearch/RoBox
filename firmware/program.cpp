//
//      ____  _________  ____ __________ _____ ___ 
//     / __ \/ ___/ __ \/ __ `/ ___/ __ `/ __ `__ \
//    / /_/ / /  / /_/ / /_/ / /  / /_/ / / / / / /
//   / .___/_/   \____/\__, /_/   \__,_/_/ /_/ /_/ 
//  /_/               /____/                       
//
// program.cpp
//
//   Implements a "program" allowing the virtual machine to
//   process it effeciently.  For debugging, the program is
//   kept in memory, but on the Robox, it will be in EEPROM.
//

#include "robox.h"
#include "program.h"
#include "debug.h"
#include "EEPROM.h"

#ifdef DEBUGGING
#include <malloc.h>
#include <string.h>
#include <stdio.h>
#endif

Program::Program()
{
	base = 0;
	ptr = 0;
	size = 0;
	baseEnd = base + size;
}

Program::Program(const char *prog)
{
	base = 0;
	ptr = 0;
	size = strlen(prog);
	baseEnd = base + size;

	for(int i=ptr; i < size; i++) {
		EEPROM[i] = (byte)prog[i];
	}
}

//
// This constructor takes a "sub-program" view of an existing program.
// Note that for debugging purposes it has a buffer, too
//
Program::Program(Program prog, int start, int endExclusive)
{
	base = start;
	ptr = 0;
	size = endExclusive - start;
	baseEnd = base+size;
}
	

void Program::Dump()
{
	printf("Program is: ");
	for(int i=base+ptr; i < baseEnd; i++) {
		printf("%c",EEPROM[i]);
	}
	printf("\n");
}

unsigned char Program::Next()
{
	if(ptr >= size) {
		return(0);	// zero is returned continuously if at th end of the program
	}
	byte r = EEPROM[base+ptr];
	ptr++;
	return(r);
}

bool Program::AtEnd()
{
	return(ptr >= size);
}	

int Program::Index()
{
	return(ptr);
}

void Program::SetIndex(int newptr)
{
	ptr = newptr;
}

void Program::Reset()
{
	SetIndex(0);
}

