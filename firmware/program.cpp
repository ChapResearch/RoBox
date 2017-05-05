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

#include "program.h"
#include "debug.h"

#ifdef DEBUGGING
#include <malloc.h>
#include <string.h>
#include <stdio.h>
#endif

Program::Program(const char *prog)
{
	ptr = 0;

	buffer = (unsigned char *)malloc(500);		// 500 bytes of storage for debugging programs
	size = strlen(prog);
	strncpy((char *)buffer,prog,size);
}

void Program::Dump()
{
	printf("Program is: %s\n",buffer+ptr);
}

void Program::Dump(int i)
{
	printf("Program is: %s\n",buffer+i);
}

unsigned char Program::Next()
{
	if(ptr >= size) {
		return(0);	// zero is returned continuously if at th end of the program
	}
	return(buffer[ptr++]);
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

